<!-- TODO: Большая страница, разнести бы код, копия страницы каталог -->
<template>
  <div>
    <client-only>
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
          @close-product-widget="removeProductIdFromUrl"
          @update-product="updateCurrentProductId"
          @change-favorite="onAlreadyChangedFavorite"
          @toggle-files-modal="isFilesModalOpen = $event"
        />
      </transition>
    </client-only>

    <main>
      <!-- Сортировка и фильтрация -->
      <div class="py-4">
        <div class="container flex items-end md:block xl:flex">
          <h2 class="w-full md:w-auto flex text-h1">Результаты</h2>
          <template v-if="!$fetchState.pending">
            <div class="hidden md:block md:mt-2.5 xl:mt-0 xl:ml-8 xl:mb-1">
              <AppCatalogSort
                :group-type="params.groupType"
                :sort="params.sort"
                @change-group-type="changeGroupType"
                @change-sort="changeSort"
              />
            </div>
            <button class="md:hidden" @click="toggleFilter">
              <div class="flex w-full md:w-auto justify-end items-center">
                <IconFilter class="w-4 h-4 mr-1.5 md:mr-2 xl:mr-2.5 xl:w-5 xl:h-5" />
                <span v-if="isOpenFilter">Скрыть</span>
                <span v-else>Фильтр</span>
              </div>
            </button>
          </template>
        </div>
      </div>

      <template v-if="!$fetchState.pending">
        <div class="bg-main-souffle md:flex" :class="{ hidden: !isOpenFilter }">
          <div class="container">
            <div class="container pt-4 md:hidden">
              <AppCatalogSort
                :group-type="params.groupType"
                :sort.sync="params.sort"
                @change-group-type="changeGroupType"
                @change-sort="changeSort"
              />
            </div>

            <client-only>
              <AppFilter
                :options="options"
                :filters="params.filter"
                :range-options="rangeOptions"
                @change-filters="applyFilters"
              />
            </client-only>
          </div>
        </div>

        <div v-if="haveProducts" class="products-container">
          <!-- Список товаров -->
          <section class="container mb-10 bg-main-sugar md:pt-12 xl:pt-14">
            <AppProductsList
              v-if="!isLoading"
              :products="products"
              :show-price="isShowedPrice"
              :group-type="params.groupType"
              @click-to-card="onClickToCard"
              @change-favorite="onChangeFavorite"
            />
          </section>

          <div
            v-if="isLoading || $fetchState.pending || isLoadingMore"
            class="hidden mb-3 mx-auto md:block md:w-20 md:h-20 xl:w-24 xl:h-24"
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
              :current-page="Number(params.page.number)"
              :page-count="lastPage"
              class="md:ml-auto"
              @change-page="changeCurrentPage"
            />
          </div>
        </div>

        <div
          v-else
          class="bg-main-sugar relative z-10 container pt-12 pb-14 md:pt-20 xl:pt-24 xl:pb-28"
        >
          <AppCatalogNotFound @click-catalog-btn="loadInitialProducts" />
        </div>
      </template>
    </main>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import AppCatalogSort from '../components/common/app-catalog-sort/app-catalog-sort.vue'
import productGroupsAdapter from '~/services/product-groups-adapter'
import AppCatalogWidgetCart from '~/components/base/app-catalog-widget-cart/app-catalog-widget-cart.vue'
import AppCatalogWidgetProduct from '~/components/base/app-catalog-widget-product/app-catalog-widget-product.vue'
import {
  BREAKPOINT_NAMES,
  CATALOG_WIDGET_TYPES,
  INITIAL_CATALOG_PARAMS,
  INITIAL_CATALOG_OPTIONS,
  PRODUCT_FILTER_AVAILABILITY,
  INITIAL_RANGE_OPTIONS,
  BASE_DEBOUNCE_DELAY,
} from '~/utils/constants'
import AppPaginate from '~/components/common/app-paginate/app-paginate.vue'
import AppProductsList from '~/components/common/app-products-list/app-products-list.vue'
import { IconFilter, IconLoader } from '~/components/feather-icons'
import AppFilter from '~/components/common/app-filter.vue'
import SButton from '~/components/ui-system/s-button/s-button.vue'
import SSpin from '~/components/ui-system/s-spin.vue'
import productFiltersAdapter from '~/services/product-filters-adapter'
import ProductGroups from '~/domain/product-groups'
import { lockBodyScroll, unlockBodyScroll } from '~/application/body-overflow'
import useScroll from '~/application/scroll'
import AppCatalogNotFound from '~/components/common/app-catalog-not-found/app-catalog-not-found.vue'
import { notDuplicatedQueryPush } from '~/application/vue-router'
import { getRangeInputOptions } from '~/domain/product-filters'
import flushPromises from '~/utils/flush-promises'
import Product from '~/domain/product'
import { debounce } from '~/utils'
import { getFormattedProducts, findProductInSortProducts } from '~/application/use-products'
import favoritesAdapter from '~/services/favorites-adapter'

export default {
  components: {
    AppCatalogNotFound,
    SButton,
    AppCatalogSort,
    AppCatalogWidgetProduct,
    AppCatalogWidgetCart,
    AppProductsList,
    AppPaginate,
    AppFilter,
    IconFilter,
    IconLoader,
    SSpin,
  },

  middleware: ['redirect-not-logged-in', 'redirect-cannot-catalog'],
  PRODUCT_FILTER_AVAILABILITY,

  data() {
    return {
      isLoading: false,
      isLoadingMore: false,
      products: [],
      params: {
        ...INITIAL_CATALOG_PARAMS,
        page: { ...INITIAL_CATALOG_PARAMS.page },
        filter: { ...INITIAL_CATALOG_PARAMS.filter },
      },
      options: { ...INITIAL_CATALOG_OPTIONS },
      rangeOptions: { ...INITIAL_RANGE_OPTIONS },
      lastPage: 1,
      isOpenFilter: false,
      menuCatalogOpen: false,
      productWidgetType: '',
      isCurrentQueryChanges: false,
      currentProductId: null,
      isShowedPrice: false,
      isFilesModalOpen: false,
    }
  },

  async fetch() {
    const { params, productId } = this.$route.query
    this.currentProductId = productId || null
    if (productId) {
      this.productWidgetType = CATALOG_WIDGET_TYPES.PRODUCT
    }

    if (params?.filter?.availability) {
      this.setVisibilityPrice(params.filter.availability)
    }

    this.setParamsFromUrl(params)
    const formattedFilters = ProductGroups.getFormattedFilters(this.params.filter)
    const requestParams = ProductGroups.getRequestParams(this.params)

    try {
      await Promise.all([
        this.setProducts(requestParams),
        this.setProductFilters(formattedFilters),
        this.setRangeOptions(),
      ])
    } catch (e) {
      console.error(e)
    }
  },

  computed: {
    ...mapState({
      currentBreakpoint: 'currentBreakpoint',
      isOpenCart: (state) => state.cart.isOpenCart,
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
      return this.params.page.number < this.lastPage
    },

    haveProducts() {
      return this.products.length
    },
  },

  watch: {
    '$route.query.params': function () {
      const articles = this.$route.query?.params?.filter?.articles
      const search = this.$route.query?.params?.filter?.search
      if (search || articles) return
      if (this.isCurrentQueryChanges || this.isOpenCart) return
      this.$fetch()
    },

    '$route.query.productId': function (value) {
      if (this.isCurrentQueryChanges) return
      if (value) {
        this.currentProductId = value
        this.productWidgetType = CATALOG_WIDGET_TYPES.PRODUCT
        return
      }
      this.productWidgetType = ''
      unlockBodyScroll()
    },

    '$store.state.searchText': async function (val) {
      const filter = val ? { search: val } : null
      this.onChangeSearches(filter)
    },

    '$store.state.searchArticles': async function (val) {
      const filter = val.length ? { articles: [...val] } : null
      this.onChangeSearches(filter)
    },
  },

  mounted() {
    document.body.addEventListener('click', this.onBodyClick)
    const { productId } = this.$route.query
    if (productId) {
      lockBodyScroll()
    }
  },

  beforeDestroy() {
    document.body.removeEventListener('click', this.onBodyClick)
    unlockBodyScroll()
  },

  methods: {
    async onChangeSearches(filter) {
      try {
        if(filter) {
          this.params = {
            ...INITIAL_CATALOG_PARAMS,
            page: { ...INITIAL_CATALOG_PARAMS.page },
            filter: { ...INITIAL_CATALOG_PARAMS.filter, ...filter },
          }
        } else {
          this.params = {
            ...INITIAL_CATALOG_PARAMS,
            page: { ...INITIAL_CATALOG_PARAMS.page },
            filter: { ...INITIAL_CATALOG_PARAMS.filter },
          }
          this.isCurrentQueryChanges = true
          this.$router.push({name: this.$route.name})
        }

        const requestParams = ProductGroups.getRequestParams(this.params)
        const formattedFilters = ProductGroups.getFormattedFilters(this.params.filter)
        await Promise.all([
          this.setProducts(requestParams),
          this.setProductFilters(formattedFilters),
        ])
      } catch (e) {
        console.error(e)
      } finally {
        this.isCurrentQueryChanges = false
      }
    },

    setParamsFromUrl(params) {
      if (params) {
        this.params = {
          ...INITIAL_CATALOG_PARAMS,
          page: { ...INITIAL_CATALOG_PARAMS.page },
          ...params,
          filter: { ...INITIAL_CATALOG_PARAMS.filter, ...params.filter },
        }
      } else {
        this.params = {
          ...INITIAL_CATALOG_PARAMS,
          page: { ...INITIAL_CATALOG_PARAMS.page },
          filter: { ...INITIAL_CATALOG_PARAMS.filter },
        }
      }
    },

    changeProductWidgetType(type) {
      this.productWidgetType = type
      if (type === CATALOG_WIDGET_TYPES.PRODUCT) {
        this.saveProductIdInUrl(this.currentProductId)
      }
      if (!type) {
        unlockBodyScroll()
      }
    },

    onUpdateCartProduct({ cartProductId, productId }) {
      const updatedProduct = findProductInSortProducts(this.products, productId)
      updatedProduct.inCart = Boolean(cartProductId)
    },

    onCLickCatalogBtn() {
      this.productWidgetType = null
    },

    async onBodyClick({ target }) {
      if (target.closest('[data-menu-catalog-btn]')) {
        this.onCLickCatalogBtn()
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

    updateCurrentProductId(productId) {
      this.currentProductId = productId
      this.saveProductIdInUrl(productId)
    },

    async saveProductIdInUrl(productId) {
      this.isCurrentQueryChanges = true

      await notDuplicatedQueryPush(this.$router, {
        name: this.$route.name,
        query: {
          ...this.$route.query,
          productId,
        },
      })

      this.isCurrentQueryChanges = false
    },

    async removeProductIdFromUrl() {
      this.isCurrentQueryChanges = true
      const queryWithoutId = Object.fromEntries(
        Object.entries(this.$route.query).filter(([key]) => key !== 'productId'),
      )
      await notDuplicatedQueryPush(this.$router, {
        name: this.$route.name,
        query: { ...queryWithoutId },
      })

      this.isCurrentQueryChanges = false
    },

    toggleFilter() {
      this.isOpenFilter = !this.isOpenFilter
    },

    async setProducts(params) {
      const { products, lastPage } = await getFormattedProducts(
        params,
        this.$store.state.cart.cart.id,
        this.$store.state.user.userData.id,
      )
      this.lastPage = lastPage
      this.products = products
    },

    async setProductFilters(currentFilters) {
      const { options } = await productFiltersAdapter().getProductFilters(currentFilters)
      this.options = options
    },

    async setRangeOptions() {
      const { options } = await productFiltersAdapter().getProductFilters()
      this.rangeOptions = getRangeInputOptions(options)
    },

    async addMoreProducts() {
      const params = ProductGroups.getRequestParams(this.params)
      const { products, lastPage } = await productGroupsAdapter().getProductGroups(params)
      this.lastPage = lastPage
      this.products = [...this.products, ...products]
    },

    async loadMore() {
      try {
        this.isLoadingMore = true
        this.isCurrentQueryChanges = true
        this.params.page.number = Number(this.params.page.number) + 1
        await this.addMoreProducts()
        await notDuplicatedQueryPush(this.$router, {
          name: this.$route.name,
          query: {
            ...this.$route.query,
            params: { ...this.$route.query.params, page: { ...this.params.page } },
          },
        })
      } catch (e) {
        console.error(e)
      } finally {
        this.isCurrentQueryChanges = false
        this.isLoadingMore = false
      }
    },

    async changeCurrentPage(currentPage) {
      try {
        this.isCurrentQueryChanges = true
        this.params.page.number = currentPage
        useScroll().scrollTop()
        const params = ProductGroups.getRequestParams(this.params)
        await this.setProducts(params)
        this.$router.push({
          name: this.$route.name,
          query: {
            ...this.$route.query,
            params: { ...this.$route.query.params, page: { ...this.params.page } },
          },
        })
        await flushPromises()
      } catch (e) {
        console.error(e)
      } finally {
        this.isCurrentQueryChanges = false
      }
    },

    async changeGroupType(type) {
      try {
        this.isLoading = true
        this.isCurrentQueryChanges = true
        this.params.page.number = 1
        this.params.groupType = type
        const params = ProductGroups.getRequestParams(this.params)
        await this.setProducts(params)
        this.$router.push({
          name: this.$route.name,
          query: {
            ...this.$route.query,
            params: {
              ...this.$route.query.params,
              page: { ...this.params.page },
              groupType: this.params.groupType,
            },
          },
        })
        await flushPromises()
      } catch (e) {
        console.error(e)
      } finally {
        this.isCurrentQueryChanges = false
        this.isLoading = false
      }
    },

    async changeSort(sort) {
      try {
        this.isCurrentQueryChanges = true
        this.params.sort = sort
        this.params.page.number = 1
        const params = ProductGroups.getRequestParams(this.params)
        await this.setProducts(params)
        this.$router.push({
          name: this.$route.name,
          query: {
            ...this.$route.query,
            params: {
              ...this.$route.query.params,
              page: { ...this.params.page },
              sort: this.params.sort,
            },
          },
        })
        await flushPromises()
      } catch (e) {
        console.error(e)
      } finally {
        this.isCurrentQueryChanges = false
      }
    },

    applyFilters: debounce(async function (newFilters) {
      try {
        this.isCurrentQueryChanges = true
        const notEmptyFilters = ProductGroups.getNotEmptyFilters(newFilters)
        const formattedFilters = ProductGroups.getFormattedFilters(newFilters)
        this.params.filter = newFilters
        this.params.page.number = 1
        const params = ProductGroups.getRequestParams(this.params)

        await notDuplicatedQueryPush(this.$router, {
          name: this.$route.name,
          query: {
            ...this.$route.query,
            params: {
              ...this.$route.query.params,
              filter: { ...notEmptyFilters },
              page: { ...this.params.page },
            },
          },
        })
        await Promise.all([this.setProducts(params), this.setProductFilters(formattedFilters)])
        this.setVisibilityPrice(newFilters.availability)
      } catch (e) {
        console.error(e)
      } finally {
        this.isCurrentQueryChanges = false
      }
    }, 800),

    setVisibilityPrice(availability) {
      this.isShowedPrice = Product.isVisibilityPrice(availability)
    },

    async loadInitialProducts() {
      try {
        this.$fetchState.pending = true
        this.isCurrentQueryChanges = true
        this.params = {
          ...INITIAL_CATALOG_PARAMS,
          page: { ...INITIAL_CATALOG_PARAMS.page },
          filter: { ...INITIAL_CATALOG_PARAMS.filter },
        }
        this.options = { ...INITIAL_CATALOG_OPTIONS }
        const formattedFilters = ProductGroups.getFormattedFilters(this.params.filter)
        const requestParams = ProductGroups.getRequestParams(this.params)
        notDuplicatedQueryPush(this.$router, { name: this.$route.name })
        await Promise.all([
          this.setProducts(requestParams),
          this.setProductFilters(formattedFilters),
        ])
      } catch (e) {
        console.error(e)
      } finally {
        this.$fetchState.pending = false
        this.isCurrentQueryChanges = false
      }
    },

    async onChangeFavorite({ id, isFavorite }) {
      const updatedProduct = findProductInSortProducts(this.products, id)
      if (!updatedProduct) return
      updatedProduct.isFavorite = isFavorite
      await this.changeFavorite({
        productId: id,
        isFavorite,
        userId: this.$store.state.user.userData.id,
        favoriteId: updatedProduct.favoriteId,
      })
    },

    changeFavorite: debounce(async function ({ productId, isFavorite, userId, favoriteId }) {
      try {
        if (isFavorite) {
          const { data: favorite } = await favoritesAdapter().addToFavorites({
            user: { id: userId },
            product: { id: productId },
          })
          const updatedProduct = findProductInSortProducts(this.products, productId)
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

    onAlreadyChangedFavorite({ productId, isFavorite, favoriteId }) {
      const product = findProductInSortProducts(this.products, productId)
      product.isFavorite = isFavorite
      product.favoriteId = favoriteId
    },
  },
}
</script>

<style lang="scss">
.products-container {
  position: relative;
  z-index: 10;
  padding-bottom: 36px;
  background: theme('colors.main.sugar');
  @media (min-width: theme('screens.md')) {
    min-height: 250px;
    padding-bottom: 40px;
  }
  @media (min-width: theme('screens.xl')) {
    padding-bottom: 80px;
  }
}
</style>
