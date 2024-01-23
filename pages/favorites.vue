<template>
  <div>
    <client-only>
      <!-- Виджет корзины -->
      <transition name="fade">
        <AppCatalogWidgetCart
          v-if="isCartWidgetVisible"
          :product-widget-type="productWidgetType"
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
          @change-widget-type="changeProductWidgetType"
          @update-product="updateCurrentProductId"
          @change-favorite="onAlreadyChangedFavorite"
          @toggle-files-modal="isFilesModalOpen = $event"
        />
      </transition>
    </client-only>

    <main class="pb-8 pt-4 md:pb-10 md:pt-10 xl:pb-20 xl:pt-8">
      <!-- Сортировка -->
      <div class="container mb-4 md:mb-5 xl:flex xl:items-end">
        <h1 class="text-h1 mb-1 md:mb-2.5 xl:mr-8 xl:mb-0">Избранное</h1>
        <div class="xl:mb-1.5">
          <AppFavoritesSort :sort="sort" @change-sort="changeSort" />
        </div>
      </div>

      <!-- Список товаров -->
      <section class="container mb-6 relative z-10 md:mb-8 xl:mb-10">
        <!-- TODO: компонент списка продуктов оказался не универсальным -->
        <ul class="app-favorites-list">
          <li v-for="product in productsList" :key="product.id" class="app-products-list__col">
            <AppProductCard
              :product="product"
              :in-cart="product.inCart"
              :is-favorite="product.isFavorite"
              :show-price="false"
              @click-to-card="onClickToCard"
              @change-favorite="onChangeFavorite"
            />
          </li>
        </ul>
      </section>
      <div
        v-if="isLoading || isLoadingMore"
        class="flex items-center justify-center mx-auto md:w-20 md:h-20 xl:w-24 xl:h-24"
      >
        <SSpin />
      </div>
      <!-- Пагинация -->
      <div v-if="!isLoading" class="container flex justify-center md:justify-between">
        <div v-if="isShowLoadMoreButton" class="hidden md:block mr-4">
          <SButton color="dark" :disabled="isLoadingMore" @click.native="loadMore">
            <span class="flex items-center">
              <IconLoader class="w-4 h-4 mr-1.5 md:mr-2 xl:w-5 xl:h-5 xl:mr-2.5" />
              <span class="text-but-lin">Загрузить больше</span>
            </span>
          </SButton>
        </div>
        <AppPaginate
          :current-page="page.currentPage"
          :page-count="page.lastPage"
          class="md:ml-auto"
          @change-page="changeCurrentPage"
        />
      </div>
    </main>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import AppCatalogWidgetCart from '~/components/base/app-catalog-widget-cart/app-catalog-widget-cart.vue'
import AppCatalogWidgetProduct from '~/components/base/app-catalog-widget-product/app-catalog-widget-product.vue'
import AppProductCard from '~/components/common/app-product-card/app-product-card.vue'
import { BREAKPOINT_NAMES, CATALOG_WIDGET_TYPES, BASE_DEBOUNCE_DELAY } from '~/utils/constants'
import { lockBodyScroll, unlockBodyScroll } from '~/application/body-overflow'
import { FAVORITES_SORTS, FAVORITES_PER_PAGE } from '~/domain/favorites'
import AppFavoritesSort from '~/components/common/app-favorites/app-favorites-sort/app-favorites-sort.vue'
import { getFavoritesProductsWithCartProducts } from '~/application/use-favorites'
import { getFavProductsWithInCartField } from '~/domain/product'
import { IconLoader } from '~/components/feather-icons'
import { SButton, SSpin } from '~/components/ui-system'
import AppPaginate from '~/components/common/app-paginate/app-paginate.vue'
import useScroll from '~/application/scroll'
import { debounce } from '~/utils'
import favoritesAdapter from '~/services/favorites-adapter'

export default {
  components: {
    AppFavoritesSort,
    AppCatalogWidgetProduct,
    AppCatalogWidgetCart,
    AppProductCard,
    SButton,
    IconLoader,
    AppPaginate,
    SSpin,
  },

  middleware: ['redirect-not-logged-in', 'redirect-cannot-catalog'],

  data() {
    return {
      productsList: [],
      sort: FAVORITES_SORTS.UPLOADED_DECREASE.value,
      page: {
        currentPage: 1,
        perPage: FAVORITES_PER_PAGE,
        lastPage: 1,
      },
      productWidgetType: '',
      currentProductId: '',
      isLoading: '',
      isLoadingMore: false,
      isFilesModalOpen: false,
    }
  },

  async fetch() {
    try {
      this.isLoading = true
      this.$store.dispatch('favorites/updateFavoriteProductsCount')
      await this.setProductsList()
    } catch (e) {
      console.error(e)
    } finally {
      this.isLoading = false
    }
  },

  computed: {
    ...mapState({
      currentBreakpoint: 'currentBreakpoint',
      isOpenCart: (state) => state.cart.isOpenCart,
      cartId: (state) => state.cart.cart.id,
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

    isShowLoadMoreButton() {
      return this.page.currentPage < this.page.lastPage
    },
  },

  methods: {
    async setProductsList() {
      const { favoritesProducts, page, cartProducts } = await getFavoritesProductsWithCartProducts({
        sort: this.sort,
        cartId: this.cartId,
        userId: this.userId,
        perPage: this.page.perPage,
        pageNumber: this.page.currentPage,
      })

      this.productsList = getFavProductsWithInCartField(favoritesProducts, cartProducts)
      this.page = page
    },

    onUpdateCartProduct({ cartProductId, productId }) {
      const updatedProduct = this.productsList.find((product) => product.id === productId)
      updatedProduct.inCart = Boolean(cartProductId)
    },

    updateCurrentProductId(productId) {
      this.currentProductId = productId
    },

    async changeSort(sort) {
      try {
        this.sort = sort
        this.page.currentPage = 1
        try {
          this.isLoading = true
          await this.setProductsList()
        } catch (e) {
          console.error(e)
        } finally {
          this.isLoading = false
        }
      } catch (e) {
        console.error(e)
      }
    },

    async changeCurrentPage(currentPage) {
      try {
        this.page.currentPage = currentPage
        useScroll().scrollTop()
        await this.setProductsList()
      } catch (e) {
        console.error(e)
      }
    },

    async addMoreProducts() {
      const { favoritesProducts, page, cartProducts } = await getFavoritesProductsWithCartProducts({
        sort: this.sort,
        cartId: this.cartId,
        userId: this.userId,
        perPage: this.page.perPage,
        pageNumber: this.page.currentPage,
      })

      this.productsList = [
        ...this.productsList,
        ...getFavProductsWithInCartField(favoritesProducts, cartProducts),
      ]
      this.page = page
    },

    async loadMore() {
      try {
        this.isLoadingMore = true
        this.page.currentPage += 1
        await this.addMoreProducts()
      } catch (e) {
        console.error(e)
      } finally {
        this.isLoadingMore = false
      }
    },

    changeProductWidgetType(type) {
      this.productWidgetType = type
      if (!type) {
        unlockBodyScroll()
      }
    },

    onClickToCard({ id, type }) {
      if (this.productWidgetType) {
        return
      }
      lockBodyScroll()
      this.currentProductId = id
      this.changeProductWidgetType(type)
    },

    onAlreadyChangedFavorite({ productId, isFavorite, favoriteId }) {
      const product = this.productsList.find((product) => product.id === productId)
      product.isFavorite = isFavorite
      product.favoriteId = favoriteId
    },

    async onChangeFavorite({ id, isFavorite }) {
      const product = this.productsList.find((product) => product.id === id)
      if (!product) return
      product.isFavorite = isFavorite
      await this.changeFavorite({
        productId: id,
        isFavorite,
        userId: this.userId,
        favoriteId: product.favoriteId,
      })
    },

    changeFavorite: debounce(async function ({ productId, isFavorite, userId, favoriteId }) {
      try {
        if (isFavorite) {
          const { data: favorite } = await favoritesAdapter().addToFavorites({
            user: { id: userId },
            product: { id: productId },
          })

          const updatedProduct = this.productsList.find(
            (product) => product.id === String(favorite.productId),
          )
          updatedProduct.isFavorite = true
          updatedProduct.favoriteId = favorite.id
        } else {
          await favoritesAdapter().deleteFavorites(favoriteId)
        }
      } catch (e) {
        console.error(e)
      } finally {
        this.$store.dispatch('favorites/updateFavoriteProductsCount')
      }
    }, BASE_DEBOUNCE_DELAY),
  },
}
</script>

<style lang="scss">
.app-favorites-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  margin-left: -10px;
  margin-right: -10px;

  @media (min-width: theme('screens.md')) {
    grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
    grid-gap: 16px;
    margin-left: 0;
    margin-right: 0;
  }

  @media (min-width: theme('screens.xl')) {
    grid-template-columns: repeat(auto-fill, minmax(222px, 1fr));
    grid-gap: 20px;
  }

  &__col {
    max-width: 264px;
  }
}
</style>
