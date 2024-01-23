<template>
  <header class="header">
    <!-- Header Desktop -->
    <div class="hidden md:block">
      <div class="header__content">
        <div class="header__nav container">
          <nav>
            <ul class="flex items-center space-x-6 md:space-x-4">
              <li v-for="(item, index) in $options.NAVIGATE_MENU_LIST" :key="index">
                <nuxt-link
                  v-if="item.to"
                  :to="item.to"
                  class="text-but-lin text-main-chocolate hover:text-main-waffle transition"
                >
                  {{ item.title }}
                </nuxt-link>
                <a
                  v-else
                  :href="item.href"
                  class="text-but-lin text-main-chocolate hover:text-main-waffle transition"
                  target="_blank"
                >
                  {{ item.title }}
                </a>
              </li>
            </ul>
          </nav>

          <nuxt-link to="/" class="hidden xl:flex justify-center items-center">
            <IconEfremov class="hover:text-main-waffle transition" />
          </nuxt-link>

          <div class="flex items-center justify-end">
            <a
              class="mr-5 text-main-chocolate hover:text-main-waffle transition"
              href="tel:8494242-53-11"
            >
              <span class="text-main-b hidden xl:block"> +7 (4942) 42-53-11 </span>
              <IconPhone class="xl:hidden w-5 h-5" />
            </a>
            <a
              href="mailto:info@efremov.gold"
              class="text-main-chocolate hover:text-main-waffle transition"
            >
              <span class="text-comment hidden xl:block">info@efremov.gold</span>
              <IconMail class="xl:hidden w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      <div class="header__bottom container md:py-5 xl:py-4">
        <div class="flex items-center">
          <nuxt-link class="md:mr-3 xl:mr-10" to="/catalog">
            <IconE
              class="w-7 h-7 md:w-12 md:h-12 xl:w-16 xl:h-16 hover:text-main-waffle transition"
            />
          </nuxt-link>
          <!--  Элемент который должен расширится-->
          <div
            class="header-search-block"
            :class="{ 'header-search-block--active': isSearchActive }"
          >
            <AppCatalogBtn
              class="search-block__btn text-main-b"
              :disabled="!canReadCatalog"
              @click-catalog-btn="$emit('click-catalog-btn')"
            />
            <div ref="input" class="search-products" data-header-search>
              <AppTagsInput
                :input-value="searchInputValue"
                :tags="foundArticles"
                :placeholder="searchInputPlaceholder"
                :disabled="!canReadCatalog"
                :class="{ 'header-search--overflow': isInputOverflow }"
                @input="onInputSearch"
                @focus="onFocusInputSearch"
                @delete-tag="onDeleteArticle"
                @keydown-enter="onEnterInput"
                @keydown-delete="onKeydownDelete"
              />
              <div
                v-show="foundProducts.length"
                class="search-products__result"
                :class="{ 'search-products__result--active': isSearchActive }"
              >
                <AppHeaderSearchResult
                  :products="limitedFoundProducts"
                  :result-title="searchResultTitle"
                  @click-show-all="onClickShowAllProducts"
                  @reset="onResetSearch"
                />
              </div>
            </div>
          </div>
          <div class="flex transition-opacity" :class="{ 'opacity-0 invisible': isSearchActive }">
            <div class="flex flex-col items-center xl:items-start">
              <nuxt-link v-if="canReadCatalog" to="/favorites" class="flex items-center group">
                <IconStar
                  class="w-5 h-5 text-main-marzipan group-hover:text-main-waffle transition-colors"
                />
                <div class="text-but-lin text-main-chocolate ml-2.5 md:hidden xl:block">
                  <span class="group-hover:text-main-waffle transition-colors">Избранное</span>
                </div>
              </nuxt-link>
              <span v-else class="flex items-center group">
                <IconStar class="w-5 h-5 text-main-marzipan" />
                <div class="text-but-lin text-main-chocolate ml-2.5 md:hidden xl:block">
                  <span>Избранное</span>
                </div>
              </span>
              <div class="text-comment text-main-marzipan mt-0.5 xl:mt-0">
                {{ favoritesCount }}
              </div>
            </div>
            <div class="md:mr-8 md:ml-7 lg:mr-20 lg:ml-14">
              <div class="flex items-center">
                <div class="mr-1.5 xl:mr-2.5">
                  <IconBasket class="text-main-marzipan w-5 h-5"></IconBasket>
                </div>
                <div class="text-but-lin text-main-chocolate">
                  <button
                    v-if="$ability.can('read', $options.ABILITY_SUBJECTS.CATALOG_VIEW)"
                    class="hover:text-main-waffle whitespace-nowrap transition"
                    @click="openCart"
                  >
                    {{ cartCost }}
                  </button>
                  <span v-else class="whitespace-nowrap">
                    {{ cartCost }}
                  </span>
                </div>
              </div>
              <div class="text-comment text-main-marzipan transition whitespace-nowrap">
                {{ cartSums }}
              </div>
            </div>

            <div class="header__cabinet">
              <AppHeaderUserCabinet
                :is-logged-in="isLoggedIn"
                :user-data="userData"
                @click-logout="logout"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Header Mobile -->
    <AppHeaderMobile
      :found-articles="foundArticles"
      :found-products="limitedFoundProducts"
      :search-input-value="searchInputValue"
      :search-result-title="searchResultTitle"
      class="header__mobile"
      @click-catalog-btn="$emit('click-catalog-btn')"
      @input="onInputSearch"
      @delete-tag="onDeleteArticle"
      @click-show-all="onClickShowAllProducts"
      @reset="onResetSearch"
      @keydown-delete="onKeydownDelete"
    />
  </header>
</template>

<script>
import { mapState } from 'vuex'
import AppHeaderUserCabinet from '../app-header-user-cabinet/app-header-user-cabinet.vue'
import AppHeaderMobile from '~/components/base/header/app-header-mobile/app-header-mobile.vue'
import AppTagsInput from '~/components/common/app-tags-input/app-tags-input.vue'
import { IconPhone, IconMail, IconStar, IconBasket } from '~/components/feather-icons'
import { IconE, IconEfremov } from '~/components/icons'
import AppCatalogBtn from '~/components/common/app-catalog-btn.vue'
import useUser from '~/application/use-user'
import useCart from '~/application/use-cart'
import { getShortSumsString } from '~/domain/carts'
import {
  BASE_DEBOUNCE_DELAY,
  BREAKPOINT_NAMES,
  SEARCH_INPUT_PLACEHOLDER_XL,
  SEARCH_PAGE_NAME,
  SEARCH_INPUT_PLACEHOLDER,
  NAVIGATE_MENU_LIST,
} from '~/utils/constants'
import { debounce, getFormattedLocalePrice } from '~/utils'
import { getFavoriteProductsAmountString } from '~/domain/favorites'
import { ABILITY_SUBJECTS } from '~/domain/user-ability'
import productsAdapter from '~/services/products-adapter'
import {
  getFormattedSearchArticles,
  getArticlesDelim,
  getStringWithoutArticles,
  getSearchProductsFromProducts,
  hasStringArticle,
  PRODUCT_ARTICLES_DELIMS,
  PRODUCT_SEARCH_PER_PAGE,
  GROUP_SEARCH_TITLE,
} from '~/domain/product'
import productSearchesAdapter from '~/services/product-searches-adapter'
import AppHeaderSearchResult from '~/components/base/header/app-header-search-result.vue'

export default {
  components: {
    AppHeaderSearchResult,
    IconEfremov,
    AppCatalogBtn,
    AppHeaderUserCabinet,
    AppTagsInput,
    AppHeaderMobile,
    IconPhone,
    IconMail,
    IconStar,
    IconBasket,
    IconE,
  },

  ABILITY_SUBJECTS,
  NAVIGATE_MENU_LIST,

  data() {
    return {
      searchInputValue: '',
      foundArticles: [],
      foundProducts: [],
      isSearchActive: false,
      searchResultTitle: '',
      isInputOverflow: false,
      canReadCatalog: true,
    }
  },

  computed: {
    ...mapState({
      isLoggedIn: (state) => state.user.isLoggedIn,
      userData: (state) => state.user.userData,
      cartMains: (state) => state.cart.cartMains,
      currentBreakpoint: (state) => state.currentBreakpoint,
      favoritesCount: (state) => {
        const amount = state.favorites.favoriteProductsCount
        if (state.currentBreakpoint === BREAKPOINT_NAMES.TABLET) {
          return amount || 0
        }
        return getFavoriteProductsAmountString(amount)
      },
    }),

    cartCost() {
      return getFormattedLocalePrice({ price: Number(this.cartMains.cartCost) })
    },

    cartSums() {
      return getShortSumsString(this.cartMains.itemsCount, this.cartMains.cartTotalWeight)
    },

    limitedFoundProducts() {
      if (this.currentBreakpoint === BREAKPOINT_NAMES.TABLET) {
        return this.foundProducts.slice(0, 4)
      }

      if (this.currentBreakpoint === BREAKPOINT_NAMES.MOBILE) {
        return this.foundProducts.slice(0, 2)
      }

      return this.foundProducts
    },

    searchInputPlaceholder() {
      if (this.currentBreakpoint === BREAKPOINT_NAMES.DESKTOP) {
        return SEARCH_INPUT_PLACEHOLDER_XL
      }
      return SEARCH_INPUT_PLACEHOLDER
    },
  },

  watch: {
    async isSearchActive(isActive) {
      if (isActive) {
        this.isInputOverflow = false
        return
      }
      const inputEl = this.$refs.input.querySelector('input')
      await this.$nextTick()
      await this.$nextTick()
      if (inputEl.scrollWidth > inputEl.offsetWidth) {
        this.isInputOverflow = true
        return
      }
      this.isInputOverflow = false
    },
  },

  created() {
    const canReadCatalog = this.$ability.can('read', ABILITY_SUBJECTS.CATALOG_VIEW)
    this.canReadCatalog = canReadCatalog
    if (canReadCatalog) {
      this.$store.dispatch('favorites/updateFavoriteProductsCount')
    }
    const onChangeAbility = this.$ability.on('updated', ({ target }) => {
      this.canReadCatalog = target.can('read', ABILITY_SUBJECTS.CATALOG_VIEW)
    })

    this.$once('hook:beforeDestroy', function () {
      onChangeAbility()
    })

    if (!this.canReadCatalog) {
      this.searchInputValue = ''
      this.foundArticles = []
      return
    }

    const articles = this.$route.query?.params?.filter?.articles
    const search = this.$route.query?.params?.filter?.search

    if (articles) {
      this.searchInputValue = articles
      this.$store.commit('SET_SEARCH_ARTICLES', articles.split(PRODUCT_ARTICLES_DELIMS[0]))
      return
    }

    if (search) {
      this.searchInputValue = search
      this.$store.commit('SET_SEARCH_TEXT', search)
    }
  },

  mounted() {
    document.body.addEventListener('click', this.onBodyClick)
  },

  beforeDestroy() {
    document.body.removeEventListener('click', this.onBodyClick)
  },

  methods: {
    onBodyClick({ target }) {
      if (
        !target.closest('[data-header-search]') &&
        this.currentBreakpoint !== BREAKPOINT_NAMES.MOBILE
      ) {
        this.onClickOutsideSearch()
      }
    },

    async onClickOutsideSearch() {
      if (this.foundArticles.length) {
        this.searchInputValue = `${this.foundArticles.join(PRODUCT_ARTICLES_DELIMS[0])},`
        this.foundArticles = []
      }
      this.isSearchActive = false
    },

    async logout() {
      useUser().logout(this.$store, this.$ability)
      this.$router.push('/user/sign-in/login')
    },

    openCart() {
      const params = {
        store: this.$store,
        route: this.$route,
        router: this.$router,
      }
      useCart().openCart(params)
    },

    async onDeleteArticle(deletedIdx) {
      try {
        this.foundArticles = this.foundArticles.filter((_, i) => i !== deletedIdx)
        if (this.foundArticles.length) {
          const articleIn = getFormattedSearchArticles(this.foundArticles)
          const products = await productsAdapter().getProducts({
            fields: {
              products: 'article,publishedProductFiles',
              'product-files': 'file,isMain',
              files: 'url',
            },
            filter: {
              articleIn,
              isActive: true,
            },
            include: 'publishedProductFiles.file',
            page: {
              number: 1,
              size: PRODUCT_SEARCH_PER_PAGE,
            },
          })

          this.foundArticles = products.map((product) => product.article)
          this.foundProducts = getSearchProductsFromProducts(products)
          this.searchResultTitle = GROUP_SEARCH_TITLE
          this.isSearchActive = true
        } else {
          this.onDeleteLastArticle()
        }
      } catch (e) {
        console.error(e)
      }
    },

    onDeleteLastArticle() {
      this.foundProducts = []
      if (this.$route.name === SEARCH_PAGE_NAME) {
        this.$store.commit('SET_SEARCH_ARTICLES', [])
        this.isSearchActive = false
      }
    },

    async onFocusInputSearch() {
      if (this.isSearchActive) return
      try {
        if (this.searchInputValue) {
          this.isSearchActive = true
          await this.onSearchProducts()
          return
        }
      } catch (e) {
        console.error(e)
      }
    },

    async onInputSearch(val) {
      this.searchInputValue = val

      if (!val && this.$route.name === SEARCH_PAGE_NAME && !this.foundArticles.length) {
        this.$store.commit('SET_SEARCH_TEXT', '')
        return
      }

      if (!this.isSearchActive && val) {
        this.isSearchActive = true
      }
      await this.onSearchProducts()
    },

    isArticlesSearch() {
      return this.foundArticles.length || hasStringArticle(this.searchInputValue)
    },

    onSearchProducts: debounce(async function () {
      try {
        if (this.isArticlesSearch()) {
          await this.onSearchByArticles()
          return
        }
        await this.onSearchByText()
      } catch (e) {
        console.error(e)
      }
    }, BASE_DEBOUNCE_DELAY),

    async onSearchByArticles() {
      const articlesDelim = getArticlesDelim(this.searchInputValue)
      const articles = [...this.searchInputValue.split(articlesDelim), ...this.foundArticles]
      const articleIn = getFormattedSearchArticles(articles)
      const products = await productsAdapter().getProducts({
        fields: {
          products: 'article,publishedProductFiles',
          'product-files': 'file,isMain',
          files: 'url',
        },
        filter: {
          articleIn,
          isActive: true,
        },
        include: 'publishedProductFiles.file',
        page: {
          number: 1,
          size: PRODUCT_SEARCH_PER_PAGE,
        },
      })

      if (products.length) {
        const productArticles = products.map((product) => product.article)
        this.foundArticles = this.isSearchActive ? productArticles : []
        this.searchInputValue = this.isSearchActive
          ? getStringWithoutArticles(this.searchInputValue, articlesDelim, productArticles)
          : productArticles.join(PRODUCT_ARTICLES_DELIMS[0])
        this.foundProducts = getSearchProductsFromProducts(products)
        this.searchResultTitle = GROUP_SEARCH_TITLE
      } else {
        this.foundArticles = []
        this.foundProducts = []
        this.searchResultTitle = ''
      }
    },

    async onSearchByText() {
      if (!this.searchInputValue.length) {
        this.foundArticles = []
        this.foundProducts = []
        this.searchResultTitle = ''
        return
      }

      const productSearches = await productSearchesAdapter().getProducts({
        fields: {
          products: 'article,publishedProductFiles',
          'product-files': 'file,isMain',
          files: 'url',
        },
        filter: {
          textILikeOrFullText: this.searchInputValue.trim(),
          product: {
            isActive: true,
          },
        },
        include: 'product.publishedProductFiles.file',
        page: {
          number: 1,
          size: PRODUCT_SEARCH_PER_PAGE,
        },
      })
      if (productSearches.length) {
        const products = productSearches.map((productSearch) => productSearch.product)
        this.foundProducts = getSearchProductsFromProducts(products)
        this.setResultTitleByText(this.searchInputValue)
      } else {
        this.foundProducts = []
        this.searchResultTitle = ''
      }
    },

    setResultTitleByText(value) {
      if (this.currentBreakpoint === BREAKPOINT_NAMES.MOBILE) {
        this.searchResultTitle = `Поиск по запросу «${value}»`
      } else {
        this.searchResultTitle = `Результаты поиска по запросу «${value}»`
      }
    },

    async onKeydownDelete() {
      try {
        if (this.foundArticles.length && !this.searchInputValue) {
          this.foundArticles = this.foundArticles.slice(0, -1)
          await this.onSearchByFoundArticles()
        }
      } catch (e) {
        console.error(e)
      }
    },

    onSearchByFoundArticles: debounce(async function () {
      if (!this.foundArticles.length) {
        this.foundArticles = []
        this.foundProducts = []
        this.searchResultTitle = ''
        return
      }

      const products = await productsAdapter().getProducts({
        fields: {
          products: 'article,publishedProductFiles',
          'product-files': 'file,isMain',
          files: 'url',
        },
        filter: {
          articleIn: this.foundArticles,
          isActive: true,
        },
        include: 'publishedProductFiles.file',
        page: {
          number: 1,
          size: PRODUCT_SEARCH_PER_PAGE,
        },
      })

      if (products.length) {
        const productArticles = products.map((product) => product.article)
        this.foundArticles = productArticles
        this.foundProducts = getSearchProductsFromProducts(products)
        this.searchResultTitle = GROUP_SEARCH_TITLE
      } else {
        this.foundArticles = []
        this.foundProducts = []
        this.searchResultTitle = ''
      }
    }, BASE_DEBOUNCE_DELAY),

    onEnterInput() {
      if (this.foundArticles.length) {
        this.onShowAllArticles()
        return
      }

      if (this.searchInputValue) {
        this.onShowAllProductByText()
      }
    },

    onShowAllProductByText() {
      this.$store.commit('SET_SEARCH_TEXT', this.searchInputValue)
      this.$router.push({
        name: 'search',
        query: { params: { filter: { search: this.searchInputValue } } },
      })
      this.isSearchActive = false
    },

    onClickShowAllProducts() {
      if (this.foundArticles.length) {
        this.onShowAllArticles()
        return
      }
      this.onShowAllProductByText()
    },

    onShowAllArticles() {
      const articles = this.foundArticles.join(PRODUCT_ARTICLES_DELIMS[0])
      this.$store.commit('SET_SEARCH_ARTICLES', [...this.foundArticles])
      this.$router.push({ name: 'search', query: { params: { filter: { articles } } } })
      if (this.currentBreakpoint !== BREAKPOINT_NAMES.MOBILE) {
        this.searchInputValue = this.foundArticles.join(PRODUCT_ARTICLES_DELIMS[0])
        this.foundArticles = []
      }
      this.isSearchActive = false
    },

    onResetSearch() {
      this.foundArticles = []
      this.searchInputValue = ''
      this.foundProducts = []
      this.isSearchActive = false
    },
  },
}
</script>
<style lang="scss">
@import 'app-header';
</style>
