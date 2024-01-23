<template>
  <div class="widget-product-wrapper">
    <Portal to="files-modal">
      <SDialog :value="isFilesModalOpen" data-cart-widget @input="onToggleFilesModal">
        <WidgetProductModal :product-files="productFiles" :initial-slide="filesModalInitialSlide" />
      </SDialog>
    </Portal>

    <div class="widget-product">
      <button class="widget-product__close">
        <IconX class="w-5 h-5 md:w-7 md:h-7 xl:w-10 xl:h-10" />
      </button>

      <div class="widget-product__container" data-cart-widget>
        <div
          v-if="isLoading"
          class="
            absolute
            top-1/2
            left-1/2
            transform
            -translate-x-1/2 -translate-y-1/2
            w-20
            h-20
            ml-10
            md:ml-20 md:w-28 md:h-28
            xl:w-40 xl:h-40 xl:ml-24
          "
        >
          <SSpin />
        </div>

        <template v-else>
          <STabs
            :value="currentTab"
            :tabs="tabs"
            color="light"
            class="widget-product__tabs"
            @input="changeWidgetType"
          />

          <WidgetProductGallery
            :product-files="productFiles"
            :is-favorite="isFavorite"
            :medals="medals"
            class="mb-8 xl:mb-10"
            @click-image="openFileModal"
            @click-favorite="onClickFavorite"
          />
          <div class="flex items-center mb-2 md:mb-3">
            <span class="text-ha text-main-chocolate uppercase tracking-widest">{{
              product.article
            }}</span>
            <span
              v-if="product.hasKit"
              class="
                ml-1.5
                md:ml-2
                xl:ml-3
                px-1
                bg-main-marzipan
                uppercase
                text-main-sugar text-a
                rounded
              "
              >к</span
            >
          </div>

          <h2 class="text-h4 text-main-chocolate mb-3 md:mb-4">
            {{ product.name }}
          </h2>

          <ul
            v-if="product.activeTags.length"
            class="flex items-center flex-wrap text-comment -mx-1 mb-2 md:mb-4"
          >
            <li v-for="tag in product.activeTags" :key="tag.id" class="mx-1 mb-2">
              <span class="px-2.5 text-main-chocolate bg-main-souffle rounded-xl">{{
                tag.name
              }}</span>
            </li>
          </ul>

          <WidgetProductVersions
            :product-versions="productVersions"
            :product="product"
            @change-version="onVersionChange"
          />

          <div class="flex items-center flex-wrap mb-1 md:mb-3">
            <AppAvailableTag
              class="mr-2.5 mb-2"
              :is-catalog-available="product.isCatalogAvailable"
              :is-leftovers-available="product.isLeftoversAvailable"
            />
            <span class="text-comment text-main-chocolate mr-2.5 mb-2">{{ offersTotal }} шт.</span>
            <span v-if="stockAvailableAt" class="text-comment text-main-marzipan mb-2"
              >На складе с {{ stockAvailableAt }}
            </span>
          </div>

          <div v-if="showPrice" class="mb-5">
            <span class="text-h4 text-main-chocolate">от {{ productPrice }}</span>
            <span class="text-h6 text-main-marzipan">/шт.</span>
          </div>

          <div class="px-2.5 py-3 bg-main-souffle mb-3 md:px-5 md:mb-8">
            <div class="flex items-center justify-between">
              <span class="text-h4 text-main-marzipan">Описание</span>
              <button
                class="flex items-center text-main-chocolate hover:text-main-waffle transition"
                @click="descriptionVisible = !descriptionVisible"
              >
                <span class="text-comment mr-2">
                  <span v-show="descriptionVisible">Скрыть</span>
                  <span v-show="!descriptionVisible">Показать</span>
                  <span class="hidden md:inline">описание</span>
                </span>
                <IconChevronUp
                  class="w-2.5 h-2.5 transition-transform"
                  :class="{ 'transform rotate-180': !descriptionVisible }"
                />
              </button>
            </div>
            <SlideUpDown :active="descriptionVisible">
              <div class="mt-2 md:pb-6 md:mt-2.5 xl:mt-3">
                <p class="text-main-b text-main-chocolate mb-3">
                  {{ product.productType.name }} · Вес {{ product.weight }} гр.
                </p>
                <ul class="flex flex-wrap items-center -mx-3 md:-mx-5">
                  <li
                    v-for="(col, idx) in descriptionProductTable"
                    :key="idx"
                    class="flex flex-col mx-3 mb-5 md:mx-5 md:mb-4"
                  >
                    <span class="text-main-b text-main-marzipan">{{ col.name }}</span>
                    <span class="text-main text-main-chocolate">{{ col.value }}</span>
                  </li>
                </ul>
                <div class="widget-product__description text-main">
                  <span
                    v-for="(item, idx) in insertsTable"
                    :key="idx"
                    :class="[idx % 2 ? 'text-main-marzipan' : 'text-main-chocolate']"
                    >{{ item }}</span
                  >
                </div>
              </div>
            </SlideUpDown>
          </div>

          <div class="flex flex-col md:flex-row">
            <div v-if="firstCollectionName" class="widget-product__collection">
              <WidgetProductCollection :name="firstCollectionName" :image-url="collectionImage" />
            </div>

            <WidgetProductKit
              v-if="productKit.length"
              :kit="productKit"
              :product-id="productId"
              @click-kit-item="updateProduct"
            />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import Swiper, { Lazy, Navigation, Thumbs } from 'swiper'
import { mapState } from 'vuex'
import SlideUpDown from 'vue-slide-up-down'
import WidgetProductGallery from './widget-product-gallery/widget-product-gallery.vue'
import WidgetProductKit from './widget-product-kit/widget-product-kit.vue'
import WidgetProductCollection from './widget-product-collection/widget-product-collection.vue'
import STabs from '~/components/ui-system/s-tabs/s-tabs.vue'
import { IconMaximize, IconInfo, IconX, IconChevronUp } from '~/components/feather-icons'
import {
  CATALOG_WIDGET_TYPES,
  BREAKPOINT_NAMES,
  FILES_KIND,
  BASE_DEBOUNCE_DELAY,
  ESC_KEY_CODE,
} from '~/utils/constants'
import SSpin from '~/components/ui-system/s-spin.vue'
import AppAvailableTag from '~/components/common/app-available-tag.vue'
import productsAdapter from '~/services/products-adapter'
import Product, { getFormattedPriceByType } from '~/domain/product'
import { fromISOToString } from '~/services/date-time-adapter'
import productFilesAdapter from '~/services/product-files-adapter'
import collectionAdapter from '~/services/collection-adapter'
import WidgetProductVersions from '~/components/base/app-catalog-widget-product/widget-product-versions/widget-product-versions.vue'
import { getFormattedFilesForGallery } from '~/domain/product-files'
import { unlockBodyScroll } from '~/application/body-overflow'
import { routerPush } from '~/application/vue-router'
import WidgetProductModal from '~/components/base/app-catalog-widget-product/widget-product-modal/widget-product-modal.vue'
import { SDialog } from '~/components/ui-system'
import favoritesAdapter from '~/services/favorites-adapter'
import { debounce } from '~/utils'
import flushPromises from '~/utils/flush-promises'

Swiper.use([Navigation, Thumbs, Lazy])

export default {
  components: {
    WidgetProductVersions,
    WidgetProductCollection,
    WidgetProductKit,
    WidgetProductGallery,
    AppAvailableTag,
    SSpin,
    STabs,
    IconX,
    IconChevronUp,
    SlideUpDown,
    SDialog,
    WidgetProductModal,
  },

  BREAKPOINT_NAMES,
  thumbSlider: null,
  mainSlider: null,

  props: {
    productId: { type: String, default: '', required: false },
    showPrice: { type: Boolean, default: true, required: false },
  },

  data() {
    return {
      tabs: [
        {
          icon: IconMaximize,
          html: 'Размеры',
          value: CATALOG_WIDGET_TYPES.CART,
        },
        {
          icon: IconInfo,
          html: '<span>Инфо<span class="hidden md:inline">рмация</span></span>',
          value: CATALOG_WIDGET_TYPES.PRODUCT,
        },
      ],
      currentTab: CATALOG_WIDGET_TYPES.PRODUCT,
      descriptionVisible: true,
      isLoading: false,
      collectionImage: null,
      productFiles: [],
      productKit: [],
      productVersions: [],
      product: {
        isCatalogAvailable: false,
        isLeftoversAvailable: false,
        article: '',
        favoriteId: '',
        metalInsertGroupId: '',
        name: '',
        colorAndMetal: '',
        offersTotal: 0,
        weight: '',
        hasKit: false,
        price: 0,
        stockAvailableAt: null,
        coatings: [],
        productInserts: [],
        versionInsertFilter: '',
        productType: {
          name: '',
        },
        collections: [{ name: '' }],
        activeTags: [],
      },
      isFavorite: false,
      isFilesModalOpen: false,
      filesModalInitialSlide: 1,
    }
  },

  computed: {
    ...mapState(['currentBreakpoint']),
    insertsTable() {
      return Product.getInsertsTable(this.product.productInserts)
    },

    descriptionProductTable() {
      return Product.getProductDescription(this.product)
    },

    stockAvailableAt() {
      return this.product.stockAvailableAt ? fromISOToString(this.product.stockAvailableAt) : null
    },

    firstCollectionName() {
      return this.product.collections[0]?.name
    },

    productPrice() {
      return getFormattedPriceByType(
        this.product,
        this.$store.state.user.userData.userProfile.priceType,
      )
    },

    offersTotal() {
      return this.product.offersTotal?.toLocaleString() || '0'
    },

    medals() {
      return Product.getMedals({
        isHit: this.product.isHit,
        isSale: this.product.isSale,
        isNew: this.product.isNew,
      })
    },
  },

  watch: {
    productId(val) {
      if (val) {
        this.loadProduct(val)
      }
    },
  },

  async mounted() {
    await this.loadProduct(this.productId)
    document.body.addEventListener('click', this.onBodyClick)
    window.addEventListener('keydown', this.onKeyDownEsc)
  },

  beforeDestroy() {
    document.body.removeEventListener('click', this.onBodyClick)
    window.removeEventListener('keydown', this.onKeyDownEsc)
    this.$options.thumbSlider?.destroy()
    this.$options.mainSlider?.destroy()
    this.$emit('close-product-widget')
  },

  methods: {
    async onToggleFilesModal(val) {
      await flushPromises()
      this.isFilesModalOpen = val
      this.$emit('toggle-files-modal', val)
    },

    onKeyDownEsc(ev) {
      const canClose = this.currentBreakpoint !== BREAKPOINT_NAMES.DESKTOP && !this.isFilesModalOpen
      if (ev.keyCode === ESC_KEY_CODE && canClose) {
        this.$emit('change-widget-type', null)

        if (!this.$store.state.cart.isOpenCart) {
          unlockBodyScroll()
        }
      }
    },

    onBodyClick({ target }) {
      // Если десктоп то закрытием будет рулить виджет корзины
      // Наверное надо будет уйти от присваивания productWidgetType
      // На просто флаги, открыта страница продукта или открыт виджет корзины
      if (this.currentBreakpoint === BREAKPOINT_NAMES.DESKTOP) {
        return
      }

      if (target.closest('[data-cart-widget]')) {
        return
      }
      // Тут мы уже кликнули вне виджета корзины, поэтому закрываем
      this.$emit('change-widget-type', null)

      if (!this.$store.state.cart.isOpenCart) {
        unlockBodyScroll()
      }
    },

    async loadProduct(productId) {
      try {
        this.isLoading = true
        this.productVersions = []

        const [product, productFiles, favorite] = await Promise.all([
          this.getProduct(productId),
          this.getProductFiles(productId),
          this.getFavorites(productId),
        ])

        if (!product.isActive) {
          await routerPush(this.$router, { name: '404' })
        }

        this.product = product
        this.productFiles = getFormattedFilesForGallery(productFiles)

        if (favorite) {
          this.product.favoriteId = favorite.id
          this.isFavorite = true
        }

        if (product.selfVersion?.isActive) {
          const productVersions = await productsAdapter().getProducts({
            filter: {
              versions: {
                id: [product.selfVersion.id],
              },
              isActive: true,
            },
            include: 'coatings',
          })

          this.productVersions = productVersions
        }

        if (product.selfKit) {
          this.productKit = await this.getKitFiles()
          this.productKit = this.productKit.filter(
            (kit) => kit.productId !== Number(this.productId),
          )
        } else {
          this.productKit = []
        }

        if (product.collections.length) {
          this.collectionImage = await this.getCollectionImage()
        }
      } catch (e) {
        this.onErrorLoadProduct(e)
      } finally {
        this.isLoading = false
        await this.$nextTick()
        this.setThumbSlider()
        this.setMainSlider()
      }
    },

    updateProduct(productId) {
      this.$emit('update-product', productId)
    },

    async getProduct(productId) {
      const product = await productsAdapter().getProduct(productId, {
        include:
          'productType,coatings,activeTags,collections,productInserts.insert,selfKit,selfVersion',
      })
      return product
    },

    async getProductFiles(productId) {
      const productFiles = await productFilesAdapter().getProductFiles({
        filter: {
          isActive: true,
          productIdIn: productId,
          kindIn: `${FILES_KIND.image},${FILES_KIND.video}`,
        },
        include: 'file',
        sort: 'sort,id',
      })
      return productFiles
    },

    async getFavorites(productId) {
      const { data } = await favoritesAdapter().getFavorites({
        filter: { userId: this.$store.state.user.userData.id, productId },
      })
      return data[0]
    },

    async getKitFiles() {
      const kitFiles = await productFilesAdapter().getProductFiles({
        filter: {
          product: { kits: { id: [this.product.selfKit.id], isActive: true }, isActive: true },
          kindIn: FILES_KIND.image,
          isMain: true,
          isActive: true,
        },
        include: 'file',
      })
      return kitFiles
    },

    async getCollectionImage() {
      const collectionImg = await collectionAdapter().getCollectionFiles({
        filter: {
          collection: {
            id: [this.product.collections[0].id],
          },
          kindIn: FILES_KIND.image,
          isMain: true,
          isActive: true,
        },
        include: 'file',
      })

      return collectionImg[0]?.file?.url
    },

    openFileModal(idx) {
      this.filesModalInitialSlide = idx
      this.isFilesModalOpen = true
      this.$emit('toggle-files-modal', true)
    },

    onClickFavorite() {
      this.isFavorite = !this.isFavorite
      this.changeFavorite({
        productId: this.product.id,
        isFavorite: this.isFavorite,
        userId: this.$store.state.user.userData.id,
        favoriteId: this.product.favoriteId,
      })
    },

    changeFavorite: debounce(
      async function ({ productId, isFavorite, userId, favoriteId }) {
        try {
          if (isFavorite) {
            const { data: favorite } = await favoritesAdapter().addToFavorites({
              user: { id: userId },
              product: { id: productId },
            })
            this.isFavorite = true
            this.product.favoriteId = favorite.id
          } else {
            await favoritesAdapter().deleteFavorites(favoriteId)
          }
        } catch (e) {
          console.error(e)
        } finally {
          this.$emit('change-favorite', {
            productId: this.productId,
            isFavorite: this.isFavorite,
            metalGroupId: this.product.metalInsertGroupId,
            favoriteId: this.product.favoriteId,
          })
          this.$store.dispatch('favorites/updateFavoriteProductsCount')
        }
      },
      BASE_DEBOUNCE_DELAY,
      true,
    ),

    closeProductWidget() {
      this.$emit('change-widget-type', null)
    },

    changeWidgetType(type) {
      this.$emit('change-widget-type', type)
    },

    setMainSlider() {
      this.$options.mainSlider = new Swiper('.gallery__main-swiper', {
        slidesPerView: 1,
        preloadImages: false,
        lazy: {
          checkInView: false,
        },
        thumbs: {
          swiper: this.$options.thumbSlider,
        },
      })
    },

    setThumbSlider() {
      this.$options.thumbSlider = new Swiper('.gallery__thumb-swiper', {
        slidesPerView: 6,
        watchSlidesProgress: true,
        navigation: {
          nextEl: '.gallery__next',
          prevEl: '.gallery__prev',
        },
        breakpoints: {
          768: {
            slidesPerView: 5,
            direction: 'vertical',
          },
          1280: {
            slidesPerView: 7,
            direction: 'vertical',
          },
        },
      })
    },

    async onVersionChange(id) {
      this.updateProduct(id)
    },

    onErrorLoadProduct(e) {
      // TODO: не придумал пока куда такое запихать
      console.error(e)
      if (e.status === 404) {
        this.$router.push({ name: '404' })
      }
    },
  },
}
</script>

<style lang="scss">
@import 'app-catalog-widget-product';
</style>
