<template>
  <div class="cart-widget" :class="{ 'cart-widget--availability': isOfferItemsSelect }">
    <!-- Пришлось вынести кнопку сюда из-за сафари -->
    <button class="cart-widget__close" data-cart-widget @click="onCloseCartWidget">
      <IconX class="w-5 h-5 md:w-7 md:h-7 xl:w-10 xl:h-10" />
    </button>

    <!-- Модалка переключения режима в наличии -->
    <Portal to="presence-modal">
      <transition name="slide-left">
        <AppCatalogAlert
          v-show="isPresenceModalShown"
          data-cart-widget
          @close="onClosePresenceModal"
        >
          <p class="text-main text-main-marzipan mb-6 text-center">
            Вы выбрали несколько размеров, но не добавили их в корзину. При переключении в режим «В
            наличии» ваш выбор будет сброшен.
          </p>
          <SButton color="light" class="mb-3 md:mb-5 xl:mb-6" @click.native="onClosePresenceModal">
            <span class="flex items-center text-but-lin">
              <IconShoppingCart class="w-4 h-4 mr-1.5 md:mr-2 xl:mr-2.5 xl:w-5 xl:h-5" />
              <span class="hidden md:inline">Вернуться и добавить размеры</span>
              <span class="md:hidden">Вернуться</span>
            </span>
          </SButton>
          <SButton
            color="light"
            variant="transparent"
            class="presence-modal__to-presence"
            @click.native="onSwitchToOfferItemsFromModal"
          >
            <span class="flex items-center">
              <IconXCircle class="w-4 h-4 mr-1.5 md:mr-2 xl:mr-2.5 xl:w-5 xl:h-5" />
              <span class="hidden md:inline">Всё-равно переключиться в вид «В наличии»</span>
              <span class="md:hidden">Переключиться</span>
            </span>
          </SButton>
        </AppCatalogAlert>
      </transition>
    </Portal>

    <!-- Модалка изменения остатков -->
    <Portal to="remains-modal">
      <WidgetCartRemainModal
        :is-shown="isRemainModalShown"
        :offers="rejectedCartOffers"
        :is-loading="isRemainsOffersSending"
        @close="onRemainsModalClose"
        @add="onAddInRemainsModal"
      />
    </Portal>

    <!-- Модалка закрытия -->
    <Portal to="closing-modal">
      <transition name="slide-left">
        <WidgetCartClosingModal
          v-show="isClosingModalShown"
          @click-add="isClosingModalShown = false"
          @close="$emit('change-widget-type', '')"
        />
      </transition>
    </Portal>

    <div class="cart-widget__content" data-cart-widget>
      <div class="cart-widget__container">
        <STabs
          :value="currentTab"
          :tabs="tabs"
          class="cart-widget__tabs"
          @input="$emit('change-widget-type', $event)"
        />

        <span class="flex items-center text-h4 text-main-sugar mb-2 xl:mb-3">
          <IconShoppingCart class="w-5 h-5 mr-2 md:w-6 md:h-6 xl:w-8 xl:h-8" />
          <span class="hidden md:block">Добавление в корзину</span>
          <span class="md:hidden">В корзину</span>
        </span>

        <div v-if="isLoading" class="cart-widget__preloader">
          <SSpin />
        </div>

        <template v-else>
          <WidgetCartProductStatus :status-text="cartProductStatus" class="mb-4 md:mb-6 xl:mb-7" />

          <p class="text-main text-main-sugar mb-4 md:mb-8">
            {{ offerTitle }}
          </p>

          <div v-if="offersTypeCheckbox">
            <AppWidgetCartAlert
              v-if="isRemainsAlertShown"
              data-cart-widget
              @close="isRemainsAlertShown = false"
            />
          </div>

          <div
            v-if="isVisibleChooseFromAvailability"
            class="mb-4 md:mb-5 xl:md-6 md:flex md:items-center"
          >
            <div class="flex items-center text-main-b text-main-marzipan select-none">
              <SToggle v-model="offersTypeCheckbox" />
              <span class="ml-2 md:hidden">Из наличия</span>
              <span class="hidden ml-3 md:block">Выбрать из наличия</span>
            </div>
            <div v-if="isOfferItemsSelect" class="mt-4 md:w-56 md:mt-0 md:ml-5 xl:ml-8 xl:w-72">
              <PortalTarget name="facets-select" />
            </div>
          </div>

          <WidgetCartProductsList
            v-if="isOfferItemsSelect"
            :cart-offer-items="cartOfferItems"
            :product-id="productId"
            :price-type="priceType"
            :cart-id="cart.id"
            @create-cart-item="onCreateCartItem"
            @delete-cart-item="onDeleteCartItem"
            @update-cart-item="onUpdateCartItem"
          />

          <WidgetCartOffers
            v-else
            :sizes="offers"
            :product-price="productPrice"
            :product-weight="productWeight"
            :cart-product="cartProduct"
            :show-price="showPrice"
            :is-loading="isOffersSending"
            @update-amount="onUpdateAmount"
            @mass-update-amount="onMassUpdateAmount"
            @clean-amount="onCleanAmount"
            @update-comment="cartProduct.comment = $event"
            @add="onClickToAdd"
            @save="onClickToSave"
          />
        </template>

        <button
          v-if="!isOfferItemsSelect"
          class="hidden mt-6 xl:flex items-center text-main-souffle hover:text-main-nuga transition"
          @click.stop="changeWidgetType"
        >
          <IconInfo class="w-5 h-5 mr-2.5" />
          <span
            v-if="productWidgetType === $options.CATALOG_WIDGET_TYPES.PRODUCT"
            class="text-but-lin"
            >Скрыть информацию о товаре</span
          >
          <span v-else class="text-but-lin">Показать информацию о товаре</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { PortalTarget } from 'portal-vue'
import { mapState } from 'vuex'
import WidgetCartProductStatus from './widget-cart-product-status.vue'
import WidgetCartProductsList from './widget-cart-products-list/widget-cart-products-list.vue'
import STabs from '~/components/ui-system/s-tabs/s-tabs.vue'
import {
  IconShoppingCart,
  IconX,
  IconMaximize,
  IconInfo,
  IconXCircle,
} from '~/components/feather-icons'
import { CATALOG_WIDGET_TYPES, BREAKPOINT_NAMES, ESC_KEY_CODE } from '~/utils/constants'
import SToggle from '~/components/ui-system/s-toggle/s-toggle.vue'
import SButton from '~/components/ui-system/s-button/s-button.vue'
import offersAdapter from '~/services/offers-adapter'
import productsAdapter from '~/services/products-adapter'
import { getFormattedOffersList, getOfferTitle } from '~/domain/offers'
import SSpin from '~/components/ui-system/s-spin.vue'
import cartItemsAdapter from '~/services/cart-items-adpater'
import {
  CART_ITEM_ENTITY_NAMES,
  getCartItemsAmount,
  getCartItemsWeight,
  REMAINS_ERROR,
} from '~/domain/cart-items'
import Product, { getProductPriceByType } from '~/domain/product'
import useOffers from '~/application/use-offers'
import AppCatalogAlert from '~/components/common/app-catalog-alert/app-catalog-alert.vue'
import cartProductsAdapter from '~/services/cart-products-adapter'
import WidgetCartOffers from '~/components/base/app-catalog-widget-cart/widget-cart-offers/widget-cart-offers.vue'
import AppWidgetCartAlert from '~/components/common/app-widget-cart-alert/app-widget-cart-alert.vue'
import WidgetCartRemainModal from '~/components/base/app-catalog-widget-cart/widget-cart-remain-modal.vue'
import WidgetCartClosingModal from '~/components/base/app-catalog-widget-cart/widget-cart-closing-modal.vue'
import { unlockBodyScroll } from '~/application/body-overflow'
import flushPromises from '~/utils/flush-promises'
import useCartProducts from '~/application/use-cart-products'

export default {
  components: {
    WidgetCartClosingModal,
    WidgetCartRemainModal,
    WidgetCartOffers,
    AppWidgetCartAlert,
    WidgetCartProductsList,
    IconInfo,
    SButton,
    SToggle,
    IconX,
    IconXCircle,
    WidgetCartProductStatus,
    IconShoppingCart,
    STabs,
    SSpin,
    PortalTarget,
    AppCatalogAlert,
  },

  props: {
    productId: { type: String, default: '', required: true },
    productWidgetType: { type: String, default: CATALOG_WIDGET_TYPES.CART, required: true },
    showPrice: { type: Boolean, default: true, required: false },
    isFilesModalOpen: { type: Boolean, default: false, required: true },
  },

  CATALOG_WIDGET_TYPES,

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
      currentTab: CATALOG_WIDGET_TYPES.CART,
      isOfferItemsSelect: false,
      isLoading: false,
      isOffersSending: false,
      isRemainsOffersSending: false,
      isRemainsAlertShown: true,
      offerTitle: '',
      needReturnProductWidget: false,
      offers: [],
      offerItems: [],
      productPrice: '',
      productWeight: '',
      metalInsertGroupId: null,
      cartItems: [],
      cartProduct: {
        id: null,
        comment: '',
      },
      rejectedCartOffers: [],
      offersTypeCheckbox: false,
      isPresenceModalShown: false,
      isClosingModalShown: false,
      isRemainModalShown: false,
      isVisibleChooseFromAvailability: false,
      needEmitUpdateCartProduct: false,
    }
  },

  computed: {
    ...mapState({
      currentBreakpoint: 'currentBreakpoint',
      cart: (state) => state.cart.cart,
      priceType: (state) => state.user.userData.userProfile.priceType,
    }),

    cartProductStatus() {
      if (this.cartItems.length) {
        return this.getCartProductStatus(this.cartItems)
      }
      return ''
    },

    cartOfferItems() {
      return this.cartItems.filter(
        (cartItem) => cartItem.entity === CART_ITEM_ENTITY_NAMES.offerItem,
      )
    },
  },

  watch: {
    isOfferItemsSelect(value) {
      if (value) {
        this.onChangeToAvailabilityChoice()
      } else {
        this.onChangeToOffersChoice()
      }
    },

    productId(value) {
      if (value) {
        this.loadCart(value)
      }
    },

    offersTypeCheckbox(val) {
      if (!val || this.cartProduct.id) {
        this.isOfferItemsSelect = val
        return
      }

      const hasAmount = useOffers().hasSomeOfferAmount(this.offers)

      if (hasAmount) {
        // Закрываем виджет продукта, если он открыт
        this.$emit('change-widget-type', CATALOG_WIDGET_TYPES.CART)
        this.isPresenceModalShown = true
      } else {
        this.isOfferItemsSelect = true
      }
    },
  },

  created() {
    this.loadCart(this.productId)
  },

  async mounted() {
    await flushPromises()
    document.body.addEventListener('click', this.onBodyClick)
    window.addEventListener('keydown', this.onKeyDownEsc)
  },

  beforeDestroy() {
    if (this.needEmitUpdateCartProduct) {
      this.$emit('update-cart-product', {
        cartProductId: this.cartProduct?.id,
        productId: this.productId,
        metalGroupId: this.metalInsertGroupId,
      })
      this.$store.dispatch('cart/updateCartMains')
    }
    document.body.removeEventListener('click', this.onBodyClick)
    window.removeEventListener('keydown', this.onKeyDownEsc)
  },

  methods: {
    onBodyClick({ target }) {
      if (!target.closest('[data-cart-widget]')) {
        this.onCloseCartWidget()
      }
    },

    onKeyDownEsc(ev) {
      if (ev.keyCode === ESC_KEY_CODE && !this.isFilesModalOpen) {
        this.onCloseCartWidget()
      }
    },

    async loadCart(productId) {
      try {
        this.isLoading = true
        const [offers, product, { cartItems }] = await Promise.all([
          this.getOffers(productId),
          this.getProduct(productId),
          cartItemsAdapter().getCartItems({
            filter: { cartId: this.cart.id, productId: this.productId },
          }),
        ])

        // Если есть cartItems, получаем cartProduct
        if (cartItems.length) {
          this.cartItems = cartItems
          const { cartProducts } = await cartProductsAdapter().getCartProducts({
            filter: { cartId: this.cart.id, productId: this.productId },
          })
          this.cartProduct = cartProducts[0]?.id ? cartProducts[0] : this.cartProduct
        }

        const offerCartItems = cartItems.filter(
          (cartItem) => cartItem.entity === CART_ITEM_ENTITY_NAMES.offer,
        )

        if (offers.length) {
          this.offers = getFormattedOffersList(offers, product.productType, offerCartItems)
          this.isVisibleChooseFromAvailability = this.offers.some((offer) => offer.itemAmount > 0)
        }

        this.metalInsertGroupId = product.metalInsertGroupId
        this.offerItems = product.offerItems
        this.productPrice = getProductPriceByType(product, this.priceType)
        this.productWeight = product.weight

        this.offerTitle = getOfferTitle({
          color: product.color,
          metal: product.metal,
          probe: product.probe,
          productInserts: product.productInserts,
        })
      } catch (e) {
        console.error(e)
      } finally {
        this.isLoading = false
      }
    },

    async changeCartProduct(touchedOffers) {
      try {
        this.isOffersSending = true
        const sentCartOffers = await useCartProducts().changeCartProduct(
          touchedOffers,
          this.cart.id,
          this.productId,
          this.cartProduct.comment,
        )
        this.cartProduct.id = sentCartOffers.cartProductId
        this.cartProduct.comment = sentCartOffers.comment
        this.needEmitUpdateCartProduct = true
        // Закрываем виджет, если не было ошибок остатка
        this.$emit('change-widget-type', null)
      } catch (e) {
        if (e?.payload?.data?.code === REMAINS_ERROR.code) {
          this.rejectedCartOffers = await useOffers().onRemainError(touchedOffers)
          this.isRemainModalShown = true
        } else {
          console.error(e)
          this.$emit('change-widget-type', null)
        }
      } finally {
        this.isOffersSending = false
      }
    },

    async onClickToAdd() {
      const touchedOffers = useOffers().getOffersForSend(this.offers)
      await this.changeCartProduct(touchedOffers)
    },

    async onClickToSave() {
      const touchedOffers = useOffers().getOffersForSend(this.offers)
      await this.changeCartProduct(touchedOffers)
    },

    onUpdateAmount(selectedOffer) {
      const updatedOffer = this.offers.find((offer) => offer.id === selectedOffer.entityId)
      updatedOffer.cartAmount = selectedOffer.cartAmount
    },

    onMassUpdateAmount(amount) {
      this.offers = useOffers().getIncrementedOffersByAmount(this.offers, amount)
    },

    onCleanAmount() {
      this.offers = useOffers().nullifyOffersCartAmount(this.offers)
    },

    getCartProductStatus(cartItems) {
      const amount = getCartItemsAmount(cartItems)
      const weight = getCartItemsWeight(cartItems)
      return Product.getCartProductStatus(amount, weight.toFixed(2))
    },

    async getOffers(productId) {
      const offers = await offersAdapter().getOffers({
        filter: { productId },
        sort: 'size',
      })
      return offers
    },

    changeWidgetType() {
      if (this.productWidgetType === CATALOG_WIDGET_TYPES.PRODUCT) {
        this.$emit('change-widget-type', CATALOG_WIDGET_TYPES.CART)
      } else {
        this.$emit('change-widget-type', CATALOG_WIDGET_TYPES.PRODUCT)
      }
    },

    async getProduct(productId) {
      const product = await productsAdapter().getProduct(productId, {
        include: 'productInserts.insert,productType,offerItems',
      })
      return product
    },

    onChangeToAvailabilityChoice() {
      this.$emit('change-widget-type', CATALOG_WIDGET_TYPES.CART)
      if (this.currentBreakpoint !== BREAKPOINT_NAMES.DESKTOP) {
        return
      }
      if (this.productWidgetType === CATALOG_WIDGET_TYPES.PRODUCT) {
        this.needReturnProductWidget = true
      }
    },

    onChangeToOffersChoice() {
      if (this.currentBreakpoint !== BREAKPOINT_NAMES.DESKTOP) {
        return
      }

      if (this.needReturnProductWidget) {
        this.needReturnProductWidget = false
        this.$emit('change-widget-type', CATALOG_WIDGET_TYPES.PRODUCT)
      }
    },

    async onSwitchToOfferItemsFromModal() {
      this.offers = useOffers().nullifyOffersCartAmount(this.offers)
      this.isPresenceModalShown = false
      this.isOfferItemsSelect = true
    },

    returnProductWidget() {
      this.isPresenceMode = false
    },

    onClosePresenceModal() {
      this.isPresenceModalShown = false
      this.isOfferItemsSelect = false
      this.offersTypeCheckbox = false
    },

    onCreateCartItem(cartItem) {
      this.cartItems.push(cartItem)
      this.needEmitUpdateCartProduct = true
    },

    onDeleteCartItem(id) {
      this.cartItems = this.cartItems.filter((cartItem) => cartItem.id !== id)
      this.needEmitUpdateCartProduct = true
    },

    onUpdateCartItem(updatedItem) {
      const updatedCartItem = this.cartItems.find((cartItem) => cartItem.id === updatedItem.id)
      updatedCartItem.amount = updatedItem.amount
      this.needEmitUpdateCartProduct = true
    },

    onRemainsModalClose() {
      this.isRemainModalShown = false
    },

    async onAddInRemainsModal() {
      try {
        this.isRemainsOffersSending = true
        const sentCartOffers = await useCartProducts().changeCartProduct(
          this.rejectedCartOffers,
          this.cart.id,
          this.productId,
        )
        this.cartProduct.id = sentCartOffers.cartProductId
        this.cartProduct.comment = sentCartOffers.comment
        this.needEmitUpdateCartProduct = true
        // Закрываем виджет, если не было ошибок остатка
        this.$emit('change-widget-type', null)
      } catch (e) {
        if (e?.payload?.data?.code === REMAINS_ERROR.code) {
          this.rejectedCartOffers = await useOffers().onRemainError(this.rejectedCartOffers)
        } else {
          console.error(e)
          this.$emit('change-widget-type', null)
        }
      } finally {
        this.isRemainsOffersSending = false
      }
    },

    onCloseCartWidget() {
      if (this.cartProduct.id) {
        this.$emit('change-widget-type', '')
        return
      }

      const hasAmount = useOffers().hasSomeOfferAmount(this.offers)
      if (hasAmount) {
        // Закрываем виджет продукта, если он открыт
        this.$emit('change-widget-type', CATALOG_WIDGET_TYPES.CART)
        this.isClosingModalShown = true
        return
      }
      this.$emit('change-widget-type', '')
      if (this.cart.isOpenCart) {
        return
      }
      unlockBodyScroll()
    },
  },
}
</script>

<style lang="scss">
@import 'app-catalog-widget-cart';
</style>
