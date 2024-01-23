import productGroupsAdapter from '~/services/product-groups-adapter'
import productsAdapter from '~/services/products-adapter'
import cartProductsAdapter from '~/services/cart-products-adapter'
import cartProductChangesAdapter from '~/services/cart-product-changes-adapter'
import { CART_ITEM_ENTITY_NAMES } from '~/domain/cart-items'
import { GROUP_PRODUCTS } from '~/utils/constants'
import favoritesAdapter from '~/services/favorites-adapter'

export default function useCartProducts() {
  /**
   * Получает cartProducts и соответствующие им products
   * @param {object} params
   * @param {object} params.filter
   * @param {object} params.page
   * @param {string} params.sort
   * @param {string} params.userId
   * @returns {Promise<{cartProducts: array, products: array, favoritesProducts: array, lastPage: number}>}
   */
  async function getCartProductsWithProducts({ filter, page, sort, userId }) {
    const { products: productGroups, lastPage } = await productGroupsAdapter().getProductGroups({
      filter,
      page,
      sort,
      include: 'cartProducts.cartProductSizes.offer',
    })

    const cartProducts = productGroups.map((cartProduct) => cartProduct.cartProducts[0])
    const cartProductsIds = cartProducts.map((cartProduct) => cartProduct.productId)

    const products = await productsAdapter().getProducts({
      filter: { id: cartProductsIds },
      include: 'productType,productInserts.insert,publishedProductFiles.file',
    })

    try {
      const productsIds = cartProducts.map((cartProduct) => cartProduct.productId)
      const { data: favoritesProducts } = await favoritesAdapter().getFavorites({
        filter: { userId, productId: productsIds.join(',') },
      })
      return {
        cartProducts,
        products,
        favoritesProducts,
        lastPage,
      }
    } catch (e) {
      console.error(e)
      return {
        cartProducts,
        products,
        lastPage,
        favoritesProducts: [],
      }
    }
  }

  /**
   * Получает cartProduct и соответствующий ему product
   * @param {string} id - cartProduct id
   * @returns {Promise<{cartProduct: object, product: object}>}
   */
  async function getCartProductWithProduct(id) {
    const cartProduct = await cartProductsAdapter().getCartProduct(id)
    const product = await productsAdapter().getProduct(cartProduct.productId, {
      include: 'productType,productInserts.insert,publishedProductFiles.file',
    })

    return {
      cartProduct,
      product,
    }
  }

  async function changeCartProduct(offers, cartId, productId, comment) {
    const sentCartOffers = await cartProductChangesAdapter().changeCartProduct({
      cartId,
      productId,
      cartItems: offers.map((offer) => ({
        entity: CART_ITEM_ENTITY_NAMES.offer,
        entityId: Number(offer.id),
        amount: offer.cartAmount,
      })),
      comment,
    })

    return sentCartOffers
  }

  /**
   * Получает cartProducts и соответствующие им products
   * @param {object} params
   * @param {object} [params.filter]
   * @param {object} [params.page]
   * @param {string} [params.sort]
   * @param {string} params.userId
   * @returns {Promise<{productGroups: array, products: array, favoritesProducts: array, lastPage: number}>}
   */
  async function getKitsWithProducts({ filter, page, sort, userId }) {
    const { products: productGroups, lastPage } = await productGroupsAdapter().getProductGroups({
      filter: {
        ...filter,
        groupType: GROUP_PRODUCTS.KITS.value,
      },
      sort: `hasFullCartKit,${sort}`,
      page,
      include: 'cartProducts.cartProductSizes.offer,noCartProducts',
    })

    if (!productGroups[0]?.cartProducts?.length) {
      return {
        productGroups: [],
        products: [],
        favoritesProducts: [],
        lastPage,
      }
    }

    const productsIds = productGroups.reduce((allIds, productGroup) => {
      const cartProductIds = productGroup.cartProducts.map((cartProduct) =>
        String(cartProduct.productId),
      )
      const otherProductIds = productGroup.noCartProducts.map((product) => product.id)
      return [...allIds, ...cartProductIds, ...otherProductIds]
    }, [])

    const uniqProductsIds = new Set(productsIds)

    const products = await productsAdapter().getProducts({
      filter: { id: [...uniqProductsIds] },
      include: 'productType,productInserts.insert,publishedProductFiles.file',
    })

    try {
      const { data: favoritesProducts } = await favoritesAdapter().getFavorites({
        filter: { userId, productId: uniqProductsIds.join(',') },
      })
      return {
        productGroups,
        products,
        favoritesProducts,
        lastPage,
      }
    } catch (e) {
      console.error(e)
      return {
        productGroups,
        products,
        favoritesProducts: [],
        lastPage,
      }
    }
  }

  return {
    getCartProductsWithProducts,
    getCartProductWithProduct,
    changeCartProduct,
    getKitsWithProducts,
  }
}
