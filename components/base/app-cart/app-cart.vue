<template>
  <transition name="modal">
    <div class="app-cart" :class="{ 'app-cart--lock': productWidgetType }">
      <!-- Виджет корзины -->
      <transition name="fade">
        <AppCatalogWidgetCart
          v-if="isCartWidgetVisible"
          :product-widget-type="productWidgetType"
          :show-price="isShowedPrice"
          :product-id="currentProductId"
          :is-files-modal-open="isFilesModalOpen"
          @change-widget-type="changeProductWidgetType"
          @update-cart-product="onUpdateCartProduct"
        />
      </transition>

      <!-- Страница товара -->
      <transition name="fade">
        <AppCatalogWidgetProduct
          v-if="isProductWidgetVisible"
          :product-id="currentProductId"
          :show-price="isShowedPrice"
          @change-widget-type="changeProductWidgetType"
          @update-product="updateCurrentProductId"
          @change-favorite="onAlreadyChangedFavorite"
          @toggle-files-modal="isFilesModalOpen = $event"
        />
      </transition>

      <div
        v-if="isLoading"
        class="
          hidden
          items-center
          justify-center
          mb-3
          mx-auto
          md:flex md:w-20 md:h-20
          xl:w-24 xl:h-24
        "
      >
        <SSpin />
      </div>
      <div v-else>
        <div class="ml-3 mr-3 md:mr-5 mb:ml-15 xl:mr-10 xl:ml-10 mt-5 xl:mt-14">
          <div class="flex justify-between mb-4 xl:mb-5">
            <h2 class="text-h1 text-main-chocolate">Корзина</h2>
            <button class="hover:text-main-waffle transition" @click="closeModal">
              <IconX class="w-8 h-8 md:h-12 md:w-12" />
            </button>
          </div>
        </div>

        <div class="flex justify-center md:hidden bg-main-souffle mb-5 h-14">
          <button @click="toggleFilter">
            <div class="flex w-full md:w-auto justify-end items-center">
              <IconFilter class="w-4 h-4 mr-1.5 md:mr-2 xl:mr-2.5 xl:w-5 xl:h-5" />
              <span v-if="isOpenFilter">Скрыть</span>
              <span v-else>Показать фильтр</span>
            </div>
          </button>
        </div>

        <div class="md:flex bg-main-souffle" :class="{ hidden: !isOpenFilter }">
          <div class="w-auto md:flex md:w-full ml-3 mr-3 md:mr-5 mb:ml-15 xl:mr-10 xl:ml-10">
            <client-only>
              <AppFilter
                :options="options"
                :filters="filter"
                :range-options="rangeOptions"
                @change-filters="applyFilters"
              />
            </client-only>
          </div>
        </div>

        <div class="bg-main-sugar relative z-12 md:pt-9 xl:pt-14">
          <div class="ml-3 mr-3 md:mr-5 mb:ml-15 xl:mr-10 xl:ml-10">
            <div v-if="isAlertVisible" class="flex w-full pb-5 md:pt-6 md:pb-6 xl:pt-10 xl:pb-9">
              <AppCartAlert @close="updateCart" />
            </div>
            <ul>
              <li v-for="(metalGroup, key) in metalGroups" :key="key">
                <AppCartMetalGroup
                  :cart-id="cart.id"
                  :active-group-id="activeGroupId"
                  :disabled="metalGroup.isEmpty"
                  :metal-group="metalGroup"
                  @open-group="openGroup"
                  @close-group="closeGroup"
                  @update-comment="updateComment"
                  @delete-cart-product="onDeleteCartProduct($event, metalGroup.id)"
                  @delete-kit-product="onDeleteKitProduct($event, metalGroup.id)"
                  @click-change="onClickChange"
                  @click-change-kit-product="onClickChangeKit"
                  @click-load-more="onClickLoadMore(metalGroup.id, metalGroup.groupType)"
                  @create-order="createOrder"
                  @change-sort="changeSort"
                  @change-group-type="changeGroupType"
                  @change-price="changePriceType"
                  @click-kit-product="onClickKitProduct"
                  @click-product="onClickProduct"
                  @click-favorite="onClickFavorite"
                  @click-favorite-kit-product="onClickFavoriteKitProduct"
                />
              </li>
            </ul>
            <SDialog v-model="isConfirmOrderModalVisible">
              <AppCartConfirmOrder
                :order-info="orderInfo"
                @register-order="registerOrder"
                @close="isConfirmOrderModalVisible = false"
              />
            </SDialog>

            <SDialog v-model="isOrderProcessedModalVisible">
              <AppCartOrderProcessed
                :order-id="orderId"
                @close="isOrderProcessedModalVisible = false"
                @go-to-cabinet="goToCabinet"
              />
            </SDialog>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState } from 'vuex'
import { IconFilter } from '~/components/feather-icons'
import IconX from '~/components/feather-icons/icon-x.vue'
import { lockBodyScroll, unlockBodyScroll } from '~/application/body-overflow'
import useCart from '~/application/use-cart'
import { SSpin } from '~/components/ui-system'
import flushPromises from '~/utils/flush-promises'
import AppCartMetalGroup from '~/components/base/app-cart/app-cart-metal-group/app-cart-metal-group.vue'
import cartMetalInsertGroupsAdapter from '~/services/cart-metal-insert-groups-adapter'
import {
  getEmptyCartFilter,
  getFormattedMetalGroups,
  getFormattedOrderInfo,
} from '~/domain/cart-metal-insert-groups'
import metalInsertGroupsAdapter from '~/services/metal-insert-groups-adapter'
import SDialog from '~/components/ui-system/s-dialog/s-dialog.vue'
import AppCartConfirmOrder from '~/components/base/app-cart/app-cart-confirm-order/app-cart-confirm-order.vue'
import AppCartOrderProcessed from '~/components/base/app-cart/app-cart-order-processed/app-cart-order-processed.vue'
import AppCartAlert from '~/components/base/app-cart/app-cart-alert/app-cart-alert.vue'
import AppFilter from '~/components/common/app-filter.vue'
import cartsAdapter from '~/services/carts-adapter'
import {
  BASE_DEBOUNCE_DELAY,
  BREAKPOINT_NAMES,
  CATALOG_WIDGET_TYPES,
  ESC_KEY_CODE,
  GROUP_PRODUCTS,
  INITIAL_CART_OPTIONS,
  INITIAL_RANGE_OPTIONS,
} from '~/utils/constants'
import AppCatalogWidgetCart from '~/components/base/app-catalog-widget-cart/app-catalog-widget-cart.vue'
import AppCatalogWidgetProduct from '~/components/base/app-catalog-widget-product/app-catalog-widget-product.vue'
import useCartProducts from '~/application/use-cart-products'
import {
  getCartProductsForCart,
  CART_PRODUCTS_PER_PAGE,
  CART_PRODUCTS_PER_PAGE_INITIAL,
  getCartProductForCart,
  getFormattedProductSizes,
  getKitsForCart,
  getKitForCart,
} from '~/domain/cart-products'
import cartProductsAdapter from '~/services/cart-products-adapter'
import { debounce, getUniqItemsById } from '~/utils'
import { ERROR_CODES } from '~/domain/errors/error-codes'
import ordersAdapter from '~/services/orders-adapter'
import cartProductSizesAdapter from '~/services/cart-product-sizes-adapter'
import productFiltersAdapter from '~/services/product-filters-adapter'
import { getRangeInputOptions } from '~/domain/product-filters'
import ProductGroups from '~/domain/product-groups'
import favoritesAdapter from '~/services/favorites-adapter'
import { findKitProduct } from '~/application/use-products'

export default {
  components: {
    AppCartOrderProcessed,
    AppCartConfirmOrder,
    AppCartAlert,
    AppCartMetalGroup,
    SDialog,
    AppCatalogWidgetCart,
    AppCatalogWidgetProduct,
    AppFilter,
    IconX,
    SSpin,
    IconFilter,
  },

  data() {
    return {
      activeGroupId: null,
      metalGroups: [],
      isLoading: false,
      isConfirmOrderModalVisible: false,
      isOrderProcessedModalVisible: false,
      productWidgetType: '',
      currentProductId: null,
      currentCartProductId: '',
      currentKitId: null,
      isShowedPrice: false,
      orderInfo: null,
      orderId: null,
      options: { ...INITIAL_CART_OPTIONS },
      filter: getEmptyCartFilter(),
      rangeOptions: { ...INITIAL_RANGE_OPTIONS },
      isOpenFilter: false,
      isFilesModalOpen: false,
    }
  },

  computed: {
    ...mapState({
      currentBreakpoint: 'currentBreakpoint',
      cart: (state) => state.cart.cart,
      isAlertVisible: (state) => state.cart.cart.hasChangeNotice,
      userId: (state) => state.user.userData.id,
    }),

    isCartWidgetVisible() {
      if (this.currentBreakpoint === BREAKPOINT_NAMES.DESKTOP) {
        return this.productWidgetType
      }
      return this.productWidgetType === CATALOG_WIDGET_TYPES.CART
    },

    isProductWidgetVisible() {
      return this.productWidgetType === CATALOG_WIDGET_TYPES.PRODUCT
    },
  },

  created() {
    if (!this.$store.state.user.isLoggedIn) {
      this.closeModal()
    }
    this.loadCart()
    this.loadMetalInsertGroups()
  },

  mounted() {
    lockBodyScroll()
    window.addEventListener('keydown', this.onKeyDownEsc)
  },

  beforeDestroy() {
    window.removeEventListener('keydown', this.onKeyDownEsc)
  },

  methods: {
    onKeyDownEsc(ev) {
      if (
        this.isConfirmOrderModalVisible ||
        this.isOrderProcessedModalVisible ||
        this.productWidgetType
      )
        return
      if (ev.keyCode === ESC_KEY_CODE) {
        this.closeModal()
      }
    },

    async loadMetalInsertGroups() {
      try {
        this.isLoading = true
        const [metalGroups, cartMetalGroups] = await Promise.all([
          metalInsertGroupsAdapter().getGroups({
            sort: 'id',
          }),
          cartMetalInsertGroupsAdapter().getCartGroups({
            filter: { cartId: this.cart.id },
          }),
        ])

        this.metalGroups = getFormattedMetalGroups(metalGroups, cartMetalGroups)
      } catch (e) {
        console.error(e)
      } finally {
        this.isLoading = false
      }
    },

    async loadCart() {
      try {
        // Остатки будут меняться в реальном времени, корзину нужно обновлять при каждом открытии
        const data = await cartsAdapter().getCart(this.$store.state.cart.cart.id)
        this.$store.commit('cart/SET_CART', data)
      } catch (e) {
        console.error(e)
      }
    },

    // TODO: может эти 2 функции здесь не нужны и достаточно просто вызвать productFiltersAdapter().getProductFilters(params) в openGroup
    async setProductFilters(params) {
      const { options } = await productFiltersAdapter().getProductFilters(params)
      this.options = options
    },

    async setRangeOptions(params) {
      const { options } = await productFiltersAdapter().getProductFilters(params)
      this.rangeOptions = getRangeInputOptions(options)
    },

    async openGroup(metalGroupId) {
      this.activeGroupId = metalGroupId
      this.cleanFilter()

      const updatedMetalGroup = this.metalGroups.find(
        (metalGroup) => metalGroup.id === metalGroupId,
      )
      try {
        updatedMetalGroup.isLoading = true
        updatedMetalGroup.groupType = GROUP_PRODUCTS.PRODUCTS.value

        // TODO: может в будущем стоит вынести в отдельную функцию параметры и получение продуктов
        const params = {
          filter: { cartId: this.cart.id, metalInsertGroupIds: updatedMetalGroup.id },
          page: {
            number: updatedMetalGroup.pagination.currentPage,
            size: updatedMetalGroup.pagination.perPage,
          },
          sort: updatedMetalGroup.sort,
          userId: this.userId,
        }

        await this.setProductFilters({
          cartId: this.cart.id,
          metalInsertGroupIds: updatedMetalGroup.id,
        })
        await this.setRangeOptions({
          cartId: this.cart.id,
          metalInsertGroupIds: updatedMetalGroup.id,
        })

        // getProductGroups and getProduct
        const { cartProducts, products, favoritesProducts, lastPage } =
          await useCartProducts().getCartProductsWithProducts(params)

        updatedMetalGroup.cartProducts = getCartProductsForCart(
          cartProducts,
          products,
          favoritesProducts,
        )
        updatedMetalGroup.pagination.lastPage = lastPage
      } catch (e) {
        console.error(e)
      } finally {
        updatedMetalGroup.isLoading = false
      }
    },

    toggleFilter() {
      this.isOpenFilter = !this.isOpenFilter
    },

    applyFilters: debounce(async function (filters) {
      const updatedMetalGroup = this.metalGroups.find(
        (metalGroup) => metalGroup.id === this.activeGroupId,
      )

      this.filter = filters

      updatedMetalGroup.pagination.currentPage = 1
      updatedMetalGroup.pagination.lastPage = 1
      updatedMetalGroup.pagination.perPage = CART_PRODUCTS_PER_PAGE_INITIAL

      const notEmptyFilters = ProductGroups.getNotEmptyFilters(filters)
      const formattedFilters = ProductGroups.getFormattedFilters(notEmptyFilters)

      const params = {
        filter: {
          cartId: this.cart.id,
          metalInsertGroupIds: updatedMetalGroup.id,
          ...formattedFilters,
        },
        page: {
          number: updatedMetalGroup.pagination.currentPage,
          size: updatedMetalGroup.pagination.perPage,
        },
        sort: updatedMetalGroup.sort,
        userId: this.userId,
      }

      // getProductGroups and getProduct
      const { cartProducts, products, favoritesProducts, lastPage } =
        await useCartProducts().getCartProductsWithProducts(params)

      updatedMetalGroup.cartProducts = getCartProductsForCart(
        cartProducts,
        products,
        favoritesProducts,
      )
      updatedMetalGroup.pagination.lastPage = lastPage
    }, 800),

    async loadMoreKits(metalGroupId) {
      const updatedMetalGroup = this.metalGroups.find(
        (metalGroup) => metalGroup.id === metalGroupId,
      )
      updatedMetalGroup.isLoading = true
      const notEmptyFilters = ProductGroups.getNotEmptyFilters(this.filter)
      const formattedFilters = ProductGroups.getFormattedFilters(notEmptyFilters)

      const params = {
        filter: {
          cartId: this.cart.id,
          metalInsertGroupIds: updatedMetalGroup.id,
          ...formattedFilters,
          groupType: updatedMetalGroup.groupType,
        },
        page: {
          number: updatedMetalGroup.pagination.currentPage,
          size: updatedMetalGroup.pagination.perPage,
        },
        sort: updatedMetalGroup.sort,
        userId: this.userId,
      }

      const kits = await useCartProducts().getKitsWithProducts(params)
      // Изначально мы просили 10 комплектов, далее нам надо получить все остальные
      const kitsWithoutInitial = getUniqItemsById(kits.productGroups, updatedMetalGroup.kits)

      // Склеиваем то, что было в первых 10 и новые
      updatedMetalGroup.kits = [
        ...updatedMetalGroup.kits,
        ...getKitsForCart(kitsWithoutInitial, kits.products, kits.favoritesProducts),
      ]
      updatedMetalGroup.pagination.lastPage = kits.lastPage
      updatedMetalGroup.pagination.currentPage += 1

      // Рекурсивно запрашиваем остальные cartProducts
      await this.loadAllKits(
        updatedMetalGroup.pagination.currentPage,
        updatedMetalGroup.pagination.lastPage,
        metalGroupId,
      )
    },

    async onClickLoadMore(metalGroupId, groupType) {
      const updatedMetalGroup = this.metalGroups.find(
        (metalGroup) => metalGroup.id === metalGroupId,
      )
      try {
        updatedMetalGroup.isLoading = true
        updatedMetalGroup.pagination.perPage = CART_PRODUCTS_PER_PAGE
        if (groupType === GROUP_PRODUCTS.KITS.value) {
          await this.loadMoreKits(metalGroupId)
          return
        }

        const notEmptyFilters = ProductGroups.getNotEmptyFilters(this.filter)
        const formattedFilters = ProductGroups.getFormattedFilters(notEmptyFilters)

        const params = {
          filter: {
            cartId: this.cart.id,
            metalInsertGroupIds: updatedMetalGroup.id,
            ...formattedFilters,
            groupType: updatedMetalGroup.groupType,
          },
          page: {
            number: updatedMetalGroup.pagination.currentPage,
            size: updatedMetalGroup.pagination.perPage,
          },
          sort: updatedMetalGroup.sort,
          userId: this.userId,
        }

        const { cartProducts, products, favoritesProducts, lastPage } =
          await useCartProducts().getCartProductsWithProducts(params)

        // Изначально мы просили 10 продуктов, далее нам надо получить все остальные
        const cartProductsWithoutInitial = getUniqItemsById(
          cartProducts,
          updatedMetalGroup.cartProducts,
        )

        // Склеиваем то что было в первых 10 и новые
        updatedMetalGroup.cartProducts = [
          ...updatedMetalGroup.cartProducts,
          ...getCartProductsForCart(cartProductsWithoutInitial, products, favoritesProducts),
        ]

        updatedMetalGroup.pagination.lastPage = lastPage
        updatedMetalGroup.pagination.currentPage += 1

        // Рекурсивно запрашиваем остальные cartProducts
        await this.loadAllCartProducts(
          updatedMetalGroup.pagination.currentPage,
          updatedMetalGroup.pagination.lastPage,
          metalGroupId,
        )
      } catch (e) {
        console.error(e)
      } finally {
        updatedMetalGroup.isLoading = false
      }
    },

    async loadAllKits(currentPage, pageLast, metalGroupId) {
      if (currentPage >= pageLast) {
        return
      }

      const updatedMetalGroup = this.metalGroups.find(
        (metalGroup) => metalGroup.id === metalGroupId,
      )

      const params = {
        filter: {
          cartId: this.cart.id,
          metalInsertGroupIds: updatedMetalGroup.id,
          groupType: updatedMetalGroup.groupType,
        },
        page: {
          number: updatedMetalGroup.pagination.currentPage,
          size: updatedMetalGroup.pagination.perPage,
        },
        sort: updatedMetalGroup.sort,
        userId: this.userId,
      }

      const kits = await useCartProducts().getKitsWithProducts(params)
      updatedMetalGroup.kits = [
        ...updatedMetalGroup.kits,
        ...getKitsForCart(kits.productGroups, kits.products, kits.favoritesProducts),
      ]
      updatedMetalGroup.pagination.lastPage = kits.lastPage
      updatedMetalGroup.pagination.currentPage += 1

      await this.loadAllKits(
        updatedMetalGroup.pagination.lastPage,
        updatedMetalGroup.pagination.currentPage,
        metalGroupId,
      )
    },

    async loadAllCartProducts(currentPage, pageLast, metalGroupId) {
      if (currentPage >= pageLast) {
        return
      }

      const updatedMetalGroup = this.metalGroups.find(
        (metalGroup) => metalGroup.id === metalGroupId,
      )

      const params = {
        filter: { cartId: this.cart.id, metalInsertGroupIds: updatedMetalGroup.id },
        page: {
          number: updatedMetalGroup.pagination.currentPage,
          size: updatedMetalGroup.pagination.perPage,
        },
        sort: updatedMetalGroup.sort,
        userId: this.userId,
      }

      const { cartProducts, products, favoritesProducts, lastPage } =
        await useCartProducts().getCartProductsWithProducts(params)

      updatedMetalGroup.cartProducts = [
        ...updatedMetalGroup.cartProducts,
        ...getCartProductsForCart(cartProducts, products, favoritesProducts),
      ]

      updatedMetalGroup.pagination.lastPage = lastPage
      updatedMetalGroup.pagination.currentPage += 1

      await this.loadAllCartProducts(
        updatedMetalGroup.pagination.lastPage,
        updatedMetalGroup.pagination.currentPage,
        metalGroupId,
      )
    },

    closeGroup(metalGroupId) {
      this.activeGroupId = null

      // Очищаем фильтр после закрытия группы
      this.cleanFilter()

      const updatedMetalGroup = this.metalGroups.find(
        (metalGroup) => metalGroup.id === metalGroupId,
      )
      updatedMetalGroup.cartProducts = []
      updatedMetalGroup.kits = []
      updatedMetalGroup.groupType = GROUP_PRODUCTS.PRODUCTS.value
      updatedMetalGroup.pagination.currentPage = 1
      updatedMetalGroup.pagination.lastPage = 1
      updatedMetalGroup.pagination.perPage = CART_PRODUCTS_PER_PAGE_INITIAL
    },

    cleanFilter() {
      this.rangeOptions = { ...INITIAL_RANGE_OPTIONS }
      this.options = { ...INITIAL_CART_OPTIONS }
      this.filter = getEmptyCartFilter()
    },

    async updateComment(comment, id) {
      try {
        await cartMetalInsertGroupsAdapter().updateCartGroups(id, {
          comment,
          id,
        })
      } catch (e) {
        console.error(e)
      }
    },

    async updateCart() {
      try {
        const data = await cartsAdapter().updateCart(this.$store.state.cart.cart.id, {
          hasChangeNotice: false,
          id: this.$store.state.cart.cart.id,
        })
        this.$store.commit('cart/SET_CART', data)
      } catch (e) {
        console.error(e)
      }
    },

    async onUpdateNotLoadedCartProduct(cartProductId, metalGroupId) {
      try {
        const updatedMetalGroup = this.metalGroups.find(
          (metalGroup) => metalGroup.id === String(metalGroupId),
        )
        const allCartProductsLoaded =
          updatedMetalGroup.pagination.currentPage >= updatedMetalGroup.pagination.lastPage

        await this.updateMetalGroup(updatedMetalGroup.cartMetalGroupId)

        if (allCartProductsLoaded) {
          const { cartProduct, product } = await useCartProducts().getCartProductWithProduct(
            cartProductId,
          )
          const newCartProduct = getCartProductForCart(cartProduct, product)
          updatedMetalGroup.cartProducts.push(newCartProduct)
        }
      } catch (e) {
        console.error(e)
      }
    },

    async onUpdateKit(metalGroupId) {
      try {
        const kitId = this.currentKitId
        this.currentKitId = ''
        await this.onChangeKit({ id: kitId, metalGroupId })
      } catch (e) {
        console.error(e)
      }
    },

    async onUpdateCartProduct({ cartProductId, metalGroupId }) {
      const updatedMetalGroup = this.metalGroups.find(
        (metalGroup) => metalGroup.id === String(metalGroupId),
      )

      if (updatedMetalGroup.groupType === GROUP_PRODUCTS.KITS.value) {
        await this.onUpdateKit(metalGroupId)
        return
      }

      const updatedCartProduct = updatedMetalGroup.cartProducts.find(
        (cartProduct) => cartProduct.id === String(cartProductId),
      )

      // Если cartProduct есть, но в списке его не нашлось
      if (!updatedCartProduct && cartProductId) {
        await this.onUpdateNotLoadedCartProduct(cartProductId, metalGroupId)
        return
      }

      try {
        // Тут получаем cartProduct с бэка, который может быть удален
        // Поэтому обрабатываем эту ошибку в catch
        const cartProduct = await cartProductsAdapter().getCartProduct(cartProductId)
        const sizesParams = {
          filter: { cartId: this.cart.id, cartProductId: cartProduct.id },
          include: 'offer',
        }
        const sizes = await cartProductSizesAdapter().getSizes(sizesParams)
        updatedCartProduct.amounts.amount = cartProduct.amount
        updatedCartProduct.amounts.weight = cartProduct.weight
        updatedCartProduct.amounts.cost = cartProduct.cost
        updatedCartProduct.amounts.tollingCost = cartProduct.tollingCost
        updatedCartProduct.sizes = getFormattedProductSizes(sizes, updatedCartProduct.product)
        await this.updateMetalGroup(updatedMetalGroup.cartMetalGroupId)
      } catch (e) {
        if (e.status?.toString() === ERROR_CODES.NOT_FOUND) {
          updatedMetalGroup.cartProducts = updatedMetalGroup.cartProducts.filter(
            (cartProduct) => cartProduct.id !== this.currentCartProductId,
          )
          await this.onDeleteCartProductFromDB(updatedMetalGroup)
        }
        console.error(e)
      }
    },

    async onDeleteCartProduct(deletedCartProductId, metalGroupId) {
      try {
        const updatedMetalGroup = this.metalGroups.find(
          (metalGroup) => metalGroup.id === metalGroupId,
        )

        await cartProductsAdapter().deleteProduct(deletedCartProductId)
        this.$store.dispatch('cart/updateCartMains')
        updatedMetalGroup.cartProducts = updatedMetalGroup.cartProducts.filter(
          (cartProduct) => cartProduct.id !== deletedCartProductId,
        )

        await this.onDeleteCartProductFromDB(updatedMetalGroup)
      } catch (e) {
        console.error(e)
      }
    },

    async onChangeKit({ id, metalGroupId }) {
      const updatedMetalGroup = this.metalGroups.find(
        (metalGroup) => metalGroup.id === String(metalGroupId),
      )
      const { productGroups, products, favoritesProducts } =
        await useCartProducts().getKitsWithProducts({
          filter: {
            kitIds: id,
            cartId: this.cart.id,
            metalInsertGroupIds: metalGroupId,
          },
          sort: updatedMetalGroup.sort,
          userId: this.userId,
        })

      if (productGroups.length) {
        const updatedKit = updatedMetalGroup.kits.find((kit) => kit.id === id)
        const newKit = getKitForCart(productGroups[0], products, favoritesProducts)
        updatedKit.id = newKit.id
        updatedKit.cartProducts = newKit.cartProducts
        updatedKit.noCartProducts = newKit.noCartProducts
      } else {
        updatedMetalGroup.kits = updatedMetalGroup.kits.filter((kit) => kit.id !== id)
      }

      const canLoadMore =
        updatedMetalGroup.pagination.currentPage < updatedMetalGroup.pagination.lastPage
      if (updatedMetalGroup.kits.length || canLoadMore) {
        await this.updateMetalGroup(updatedMetalGroup.cartMetalGroupId)
      } else {
        this.onCleanCartMetal(updatedMetalGroup.cartMetalGroupId, updatedMetalGroup.id)
      }
    },

    async onDeleteKitProduct({ kitId, cartProductId }, metalGroupId) {
      try {
        await cartProductsAdapter().deleteProduct(cartProductId)
        this.$store.dispatch('cart/updateCartMains')
        await this.onChangeKit({ id: kitId, metalGroupId })
      } catch (e) {
        console.error(e)
      }
    },

    async updateMetalGroup(cartGroupId) {
      try {
        const cartGroup = await cartMetalInsertGroupsAdapter().getGroup(cartGroupId)
        const updatedMetalGroup = this.metalGroups.find(
          (metalGroup) => metalGroup.cartMetalGroupId === cartGroup.id,
        )
        updatedMetalGroup.amount = cartGroup.amount
        updatedMetalGroup.cost = cartGroup.cost
        updatedMetalGroup.tollingCost = cartGroup.tollingCost
        updatedMetalGroup.weight = cartGroup.weight
        updatedMetalGroup.isEmpty = !cartGroup.amount
      } catch (e) {
        console.error(e)
      }
    },

    onCleanCartMetal(cartGroupId, metalGroupId) {
      const updatedMetalGroup = this.metalGroups.find(
        (metalGroup) => metalGroup.cartMetalGroupId === cartGroupId,
      )
      updatedMetalGroup.amount = 0
      updatedMetalGroup.cost = '0'
      updatedMetalGroup.tollingCost = '0'
      updatedMetalGroup.weight = '0'
      updatedMetalGroup.isEmpty = true
      if (metalGroupId === this.activeGroupId) {
        this.activeGroupId = null
      }
    },

    async onDeleteCartProductFromDB(updatedMetalGroup) {
      const canLoadMore =
        updatedMetalGroup.pagination.currentPage < updatedMetalGroup.pagination.lastPage
      if (updatedMetalGroup.cartProducts.length || canLoadMore) {
        await this.updateMetalGroup(updatedMetalGroup.cartMetalGroupId)
      } else {
        this.onCleanCartMetal(updatedMetalGroup.cartMetalGroupId, updatedMetalGroup.id)
      }
    },

    async createOrder(metalGroup) {
      try {
        const params = { include: 'metalInsertGroup' }
        const data = await cartMetalInsertGroupsAdapter().getGroup(
          metalGroup.cartMetalGroupId,
          params,
        )
        this.orderInfo = getFormattedOrderInfo(data)
      } catch (e) {
        console.error(e)
      } finally {
        this.isConfirmOrderModalVisible = true
      }
    },

    async registerOrder() {
      try {
        this.isConfirmOrderModalVisible = false

        const data = await ordersAdapter().createOrder({
          user: { id: this.$store.state.user.userData.id },
          cart: { id: this.$store.state.cart.cart.id },
          'metal-insert-group': { id: this.activeGroupId },
        })
        this.orderId = data.id
        this.isOrderProcessedModalVisible = true
        this.activeGroupId = null
        await this.loadMetalInsertGroups()
      } catch (e) {
        console.error(e)
      }
    },

    async changeSort(sort, metalGroupId) {
      const updatedMetalGroup = this.metalGroups.find(
        (metalGroup) => metalGroup.id === metalGroupId,
      )
      updatedMetalGroup.sort = sort
      updatedMetalGroup.pagination.currentPage = 1
      updatedMetalGroup.pagination.lastPage = 1
      updatedMetalGroup.pagination.perPage = CART_PRODUCTS_PER_PAGE_INITIAL

      const notEmptyFilters = ProductGroups.getNotEmptyFilters(this.filter)
      const formattedFilters = ProductGroups.getFormattedFilters(notEmptyFilters)

      try {
        updatedMetalGroup.isLoading = true

        const params = {
          filter: {
            cartId: this.cart.id,
            metalInsertGroupIds: updatedMetalGroup.id,
            ...formattedFilters,
          },
          page: {
            number: updatedMetalGroup.pagination.currentPage,
            size: updatedMetalGroup.pagination.perPage,
          },
          sort: updatedMetalGroup.sort,
          userId: this.userId,
        }

        // Для вида без комплектов
        if (updatedMetalGroup.groupType === GROUP_PRODUCTS.PRODUCTS.value) {
          const { cartProducts, products, favoritesProducts, lastPage } =
            await useCartProducts().getCartProductsWithProducts(params)

          updatedMetalGroup.cartProducts = getCartProductsForCart(
            cartProducts,
            products,
            favoritesProducts,
          )
          updatedMetalGroup.kits = []
          updatedMetalGroup.pagination.lastPage = lastPage
        } else {
          // Для вида по комплектам
          const kits = await useCartProducts().getKitsWithProducts(params)
          updatedMetalGroup.kits = getKitsForCart(
            kits.productGroups,
            kits.products,
            kits.favoritesProducts,
          )
          updatedMetalGroup.cartProducts = []
          updatedMetalGroup.pagination.lastPage = kits.lastPage
        }
      } catch (e) {
        console.error(e)
      } finally {
        updatedMetalGroup.isLoading = false
      }
    },

    async changeGroupType(groupType, metalGroupId) {
      const updatedMetalGroup = this.metalGroups.find(
        (metalGroup) => metalGroup.id === metalGroupId,
      )
      updatedMetalGroup.groupType = groupType
      updatedMetalGroup.pagination.currentPage = 1
      updatedMetalGroup.pagination.lastPage = 1
      updatedMetalGroup.pagination.perPage = CART_PRODUCTS_PER_PAGE_INITIAL

      const notEmptyFilters = ProductGroups.getNotEmptyFilters(this.filter)
      const formattedFilters = ProductGroups.getFormattedFilters(notEmptyFilters)

      try {
        updatedMetalGroup.isLoading = true

        const params = {
          filter: {
            cartId: this.cart.id,
            metalInsertGroupIds: updatedMetalGroup.id,
            groupType,
            ...formattedFilters,
          },
          page: {
            number: updatedMetalGroup.pagination.currentPage,
            size: updatedMetalGroup.pagination.perPage,
          },
          sort: updatedMetalGroup.sort,
          userId: this.userId,
        }

        // Для вида без комплектов
        if (updatedMetalGroup.groupType === GROUP_PRODUCTS.PRODUCTS.value) {
          const { cartProducts, products, favoritesProducts, lastPage } =
            await useCartProducts().getCartProductsWithProducts(params)

          updatedMetalGroup.cartProducts = getCartProductsForCart(
            cartProducts,
            products,
            favoritesProducts,
          )
          updatedMetalGroup.kits = []
          updatedMetalGroup.pagination.lastPage = lastPage
        } else {
          // Для вида по комплектам
          const kits = await useCartProducts().getKitsWithProducts(params)
          updatedMetalGroup.kits = getKitsForCart(
            kits.productGroups,
            kits.products,
            kits.favoritesProducts,
          )
          updatedMetalGroup.cartProducts = []
          updatedMetalGroup.pagination.lastPage = kits.lastPage
        }
      } catch (e) {
        console.error(e)
      } finally {
        updatedMetalGroup.isLoading = false
      }
    },

    async changePriceType(priceType, metalGroupId) {
      const updatedMetalGroup = this.metalGroups.find(
        (metalGroup) => metalGroup.id === metalGroupId,
      )
      updatedMetalGroup.priceType = priceType

      // Обновляем priceType для каждой метал вставки
      try {
        await cartMetalInsertGroupsAdapter().updateCartGroups(updatedMetalGroup.cartMetalGroupId, {
          priceType: updatedMetalGroup.priceType,
          id: updatedMetalGroup.cartMetalGroupId,
        })
      } catch (e) {
        console.error(e)
      }
    },

    changeProductWidgetType(type) {
      this.productWidgetType = type
    },

    updateCurrentProductId(productId) {
      this.currentProductId = productId
    },

    onClickProduct(productId, cartProductId) {
      if (this.productWidgetType) {
        return
      }
      lockBodyScroll()
      this.currentProductId = productId
      this.currentCartProductId = cartProductId
      this.changeProductWidgetType(CATALOG_WIDGET_TYPES.PRODUCT)
    },

    onClickChange(productId, cartProductId) {
      if (this.productWidgetType) {
        return
      }
      lockBodyScroll()
      this.currentProductId = productId
      this.currentCartProductId = cartProductId
      this.changeProductWidgetType(CATALOG_WIDGET_TYPES.CART)
    },

    onClickKitProduct({ kitId, productId }) {
      if (this.productWidgetType) {
        return
      }
      lockBodyScroll()
      this.currentProductId = productId
      this.currentKitId = kitId
      this.currentCartProductId = ''
      this.changeProductWidgetType(CATALOG_WIDGET_TYPES.PRODUCT)
    },

    onClickChangeKit({ kitId, productId }) {
      if (this.productWidgetType) {
        return
      }
      lockBodyScroll()
      this.currentProductId = productId
      this.currentKitId = kitId
      this.changeProductWidgetType(CATALOG_WIDGET_TYPES.CART)
    },

    async onCloseCart() {
      // Важен порядок закрытия корзины
      const newQuery = useCart().getRouteQueryWithoutCart(this.$route.query)
      this.$router.push({
        query: newQuery,
      })
      await flushPromises()
      this.$store.commit('cart/SET_IS_OPEN_CART', false)
    },

    goToCabinet() {
      // TODO: потом просто вставим путь до истории заказов вместо каталога
      this.isOrderProcessedModalVisible = false
      this.closeModal()
      this.$router.push(`/user/orders-history/order/${this.orderId}`)
    },

    closeModal() {
      this.onCloseCart()
      unlockBodyScroll()
    },

    async onClickFavorite({ productId, isFavorite, metalGroupId }) {
      const updatedMetalGroup = this.metalGroups.find(
        (metalGroup) => metalGroup.id === metalGroupId,
      )
      const product = updatedMetalGroup.cartProducts.find(
        (product) => product.productId === productId,
      )
      product.isFavorite = !isFavorite
      await this.changeFavorite({
        productId,
        isFavorite: !isFavorite,
        userId: this.userId,
        favoriteId: product.favoriteId,
        metalGroupId,
      })
    },

    changeFavorite: debounce(async function ({
      productId,
      isFavorite,
      userId,
      favoriteId,
      metalGroupId,
    }) {
      try {
        if (isFavorite) {
          const { data: favorite } = await favoritesAdapter().addToFavorites({
            user: { id: userId },
            product: { id: productId },
          })

          const updatedMetalGroup = this.metalGroups.find(
            (metalGroup) => metalGroup.id === metalGroupId,
          )
          const product = updatedMetalGroup.cartProducts.find(
            (product) => product.productId === productId,
          )
          product.isFavorite = true
          product.favoriteId = favorite.id
        } else {
          await favoritesAdapter().deleteFavorites(favoriteId)
        }
      } catch (e) {
        console.error(e)
      } finally {
        this.$store.dispatch('favorites/updateFavoriteProductsCount')
      }
    },
    BASE_DEBOUNCE_DELAY),

    async onClickFavoriteKitProduct({ productId, isFavorite, kitId }, metalGroupId) {
      const updatedMetalGroup = this.metalGroups.find(
        (metalGroup) => metalGroup.id === metalGroupId,
      )
      const updatedKit = updatedMetalGroup.kits.find((kit) => kit.id === kitId)
      const product = updatedKit.cartProducts.find((product) => product.productId === productId)
      product.isFavorite = !isFavorite
      await this.changeFavoriteKitProduct({
        productId,
        isFavorite: !isFavorite,
        userId: this.userId,
        favoriteId: product.favoriteId,
        metalGroupId,
        kitId,
      })
    },

    changeFavoriteKitProduct: debounce(async function ({
      productId,
      isFavorite,
      userId,
      favoriteId,
      metalGroupId,
      kitId,
    }) {
      try {
        if (isFavorite) {
          const { data: favorite } = await favoritesAdapter().addToFavorites({
            user: { id: userId },
            product: { id: productId },
          })

          const updatedMetalGroup = this.metalGroups.find(
            (metalGroup) => metalGroup.id === metalGroupId,
          )
          const updatedKit = updatedMetalGroup.kits.find((kit) => kit.id === kitId)
          const product = updatedKit.cartProducts.find((product) => product.productId === productId)
          product.isFavorite = true
          product.favoriteId = favorite.id
        } else {
          await favoritesAdapter().deleteFavorites(favoriteId)
        }
      } catch (e) {
        console.error(e)
      } finally {
        this.$store.dispatch('favorites/updateFavoriteProductsCount')
      }
    },
    BASE_DEBOUNCE_DELAY),

    onAlreadyChangedFavorite({ productId, isFavorite, metalGroupId, favoriteId }) {
      const updatedMetalGroup = this.metalGroups.find(
        (metalGroup) => metalGroup.id === String(metalGroupId),
      )

      if (updatedMetalGroup.groupType === GROUP_PRODUCTS.KITS.value) {
        this.onChangedFavoriteKitProduct({
          kits: updatedMetalGroup.kits,
          productId,
          isFavorite,
          favoriteId,
        })
      } else {
        this.onChangedProduct({
          cartProducts: updatedMetalGroup.cartProducts,
          productId,
          isFavorite,
          favoriteId,
        })
      }
    },

    onChangedFavoriteKitProduct({ kits, productId, isFavorite, favoriteId }) {
      const product = findKitProduct(kits, productId)
      if (product) {
        product.isFavorite = isFavorite
        product.favoriteId = favoriteId
      }
    },

    onChangedProduct({ cartProducts, productId, isFavorite, favoriteId }) {
      const product = cartProducts.find((product) => product.productId === productId)
      if (product) {
        product.isFavorite = isFavorite
        product.favoriteId = favoriteId
      }
    },
  },
}
</script>

<style lang="scss">
@import 'app-cart';
</style>
