<template>
  <div class="widget-cart-products-list">
    <Portal to="facets-select">
      <div v-if="facetsSelect.value">
        <SSelect
          v-model="facetsSelect.value"
          :initial-options="facetsSelect.options"
          custom-labels
          @input="updateOfferItemsFilters"
        />
      </div>
    </Portal>

    <div v-if="isLoading" class="flex justify-center circle">
      <SSpin class="w-20 h-20 md:w-28 md:h-28 xl:w-40 xl:h-40" />
    </div>

    <template v-else>
      <div v-for="sizeData in sizesList" :key="sizeData.offerId" class="mb-2 md:mb-4 xl:mb-5">
        <div class="flex items-center text-h4">
          <button
            class="
              flex
              items-center
              mr-3
              text-main-sugar
              md:mr-4
              xl:mr-5
              hover:text-main-nuga
              transition
            "
            @click="onClickToSize(sizeData.offerId)"
          >
            <span class="mr-2 md:mr-1">Размер {{ sizeData.size }}</span>
            <IconChevronDown
              class="w-4 h-4 xl:w-5 xl:h-5 transition-transform"
              :class="{ 'transform rotate-180': activeSize === sizeData.offerId }"
            />
          </button>
          <span class="text-main-nuga">{{ sizeData.amount }} изд.</span>
        </div>

        <SlideUpDown :active="activeSize === sizeData.offerId" :duration="400">
          <div>
            <div v-if="isLoadingOfferItems" class="flex justify-center circle my-3">
              <SSpin class="w-16 h-16 md:w-20 md:h-20 xl:w-28 xl:h-28" />
            </div>

            <template v-if="!isLoadingOfferItems && sizeData.products.length">
              <ul class="pb-4 md:pb-8 xl:pb-10">
                <li
                  v-for="product in sizeData.products"
                  :key="product.id"
                  class="pt-4 pb-4 border-b border-main-nuga border-solid md:pt-6 xl:pt-5"
                >
                  <WidgetCartProduct
                    :offer-item="product"
                    :disabled="isLoadingAddToCart"
                    @change-amount="onChangeAmount(product)"
                  />
                </li>
              </ul>

              <div v-if="isLoadingMoreOfferItems" class="flex justify-center circle">
                <SSpin class="w-10 h-10 md:w-12 md:h-12 xl:w-16 xl:h-16" />
              </div>

              <SButton
                v-if="
                  sizeData.page.currentPage < sizeData.page.lastPage && !isLoadingMoreOfferItems
                "
                color="light"
                class="mx-auto mt-0 mb-8 md:mb-14 xl:mb-12"
                @click.native.stop="loadMoreOfferItems(sizeData)"
              >
                <span class="flex items-center">
                  <IconLoader class="w-4 h-4 mr-1.5 md:mr-2 xl:w-5 xl:h-5 xl:mr-2.5" />
                  <span class="text-but-lin">Загрузить больше</span>
                </span>
              </SButton>
            </template>
          </div>
        </SlideUpDown>
      </div>
      <p class="text-h2 text-main-sugar mt-6 mb-1 md:mb-2 md:mt-8 xl:mb-3 xl:mt-10">
        {{ cartOfferItemsSums.price }} ₽
      </p>

      <div class="flex flex-col">
        <span class="text-comment text-main-marzipan">Выбрано</span>
        <span class="text-main text-main-sugar"
          >{{ cartOfferItemsSums.amount }} изд. · {{ cartOfferItemsSums.weight }} гр</span
        >
      </div>
    </template>
  </div>
</template>

<script>
import { Portal } from 'portal-vue'
import SlideUpDown from 'vue-slide-up-down'
import WidgetCartProduct from './widget-cart-product/widget-cart-product.vue'
import { IconChevronDown, IconLoader } from '~/components/feather-icons'
import SButton from '~/components/ui-system/s-button/s-button.vue'
import offerItemsAdapter from '~/services/offer-items-adapter'
import SSpin from '~/components/ui-system/s-spin.vue'
import {
  getFormattedSizesList,
  getFacetsSelect,
  getOfferItemsWithCartItems,
} from '~/domain/offer-items'
import SSelect from '~/components/ui-system/s-select/s-select.vue'
import offerItemsFiltersAdapter from '~/services/offer-items-filters-adapter'
import { MAX_FACETS_COUNT_IN } from '~/utils/constants'
import cartItemsAdapter from '~/services/cart-items-adpater'
import { CART_ITEM_ENTITY_NAMES } from '~/domain/cart-items'
import useCartItems from '~/application/use-cart-items'
import { PRICE_TYPES } from '~/domain/carts'

export default {
  components: {
    WidgetCartProduct,
    SButton,
    IconChevronDown,
    IconLoader,
    SSpin,
    Portal,
    SSelect,
    SlideUpDown,
  },

  props: {
    cartOfferItems: { type: Array, default: () => [], required: true },
    productId: { type: String, default: '', required: true },
    cartId: { type: String, default: '', required: true },
    priceType: { type: String, default: PRICE_TYPES.main, required: true },
  },

  data() {
    return {
      isLoading: false,
      isLoadingOfferItems: false,
      isLoadingMoreOfferItems: false,
      isLoadingAddToCart: false,
      sizesList: [],
      facetsSelect: {
        value: '',
        options: [],
      },
      activeSize: null,
    }
  },

  computed: {
    cartOfferItemsSums() {
      return useCartItems().getCartItemsSums(
        this.cartOfferItems,
        this.priceType
      )
    },
  },

  async created() {
    try {
      this.isLoading = true
      await this.initialLoadData()
    } catch (e) {
      console.error(e)
    } finally {
      this.isLoading = false
    }
  },

  methods: {
    async getOfferItemsFilters(productId, facetCountIn) {
      const offerItems = await offerItemsFiltersAdapter().getOfferItemsFilters({
        productId,
        facetCountIn,
      })
      return offerItems
    },

    async initialLoadData() {
      const offerItems = await this.getOfferItemsFilters(this.productId, MAX_FACETS_COUNT_IN)
      this.facetsSelect = getFacetsSelect(offerItems.facetCounts)
      this.activeSize = null
      this.sizesList = getFormattedSizesList(offerItems.sizes)
    },

    async setInitialOfferItems(offerId) {
      try {
        this.isLoadingOfferItems = true
        const updatedSize = this.sizesList.find((size) => size.offerId === offerId)
        const offerItems = await offerItemsAdapter().getOfferItems({
          filter: { offerId, facetCountIn: this.facetsSelect.value, isAccess: true },
          page: { size: updatedSize.page.perPage, number: 1 },
        })

        updatedSize.products = getOfferItemsWithCartItems(offerItems.data, this.cartOfferItems)
        updatedSize.page = offerItems.page
      } catch (e) {
        console.error(e)
      } finally {
        this.isLoadingOfferItems = false
      }
    },

    async updateOfferItemsFilters(facetCountIn) {
      try {
        this.isLoading = true
        const offerItems = await this.getOfferItemsFilters(this.productId, facetCountIn)
        this.activeSize = null
        this.sizesList = getFormattedSizesList(offerItems.sizes)
      } catch (e) {
        console.error(e)
      } finally {
        this.isLoading = false
      }
    },

    setActiveSize(id) {
      if (this.activeSize === id) {
        this.activeSize = null
      } else {
        this.activeSize = id
      }
    },

    onClickToSize(id) {
      this.setActiveSize(id)
      if (this.activeSize) {
        this.setInitialOfferItems(id)
      }
    },

    async loadMoreOfferItems({ page, offerId }) {
      try {
        this.isLoadingMoreOfferItems = true
        const updatedSize = this.sizesList.find((size) => size.offerId === offerId)
        const offerItems = await offerItemsAdapter().getOfferItems({
          filter: { offerId, facetCountIn: this.facetsSelect.value, isAccess: true },
          page: { size: page.perPage, number: page.currentPage + 1 },
        })

        updatedSize.products = [
          ...updatedSize.products,
          ...getOfferItemsWithCartItems(offerItems.data, this.cartOfferItems),
        ]
        updatedSize.page = offerItems.page
      } catch (e) {
        console.error(e)
      } finally {
        this.isLoadingMoreOfferItems = false
      }
    },

    async sendCartItem({ id, entityId, amount, cartId }) {
      // Если уже был создан и новый amount 0
      if (id && !amount) {
        await cartItemsAdapter().deleteCartItem(id)
        this.$emit('delete-cart-item', id)
        return {
          cartItemId: null,
          cartAmount: 0,
        }
      }

      // Если не был создан и новый amount 1
      if (!id && amount) {
        const { cartItem } = await cartItemsAdapter().createCartItem({
          entity: CART_ITEM_ENTITY_NAMES.offerItem,
          entityId,
          amount,
          cart: {
            id: cartId,
          },
        })
        this.$emit('create-cart-item', { ...cartItem })
        return {
          cartItemId: cartItem.id,
          cartAmount: cartItem.amount,
        }
      }

      // Update на всякий случай вдруг понадобится
      // Если уже был создан и новый amount 1
      if (id && amount) {
        const { cartItem } = await cartItemsAdapter().updateCartItem(id, {
          id,
          entityId,
          amount,
          cart: {
            id: cartId,
          },
        })
        this.$emit('update-cart-item', { ...cartItem })
        return {
          cartItemId: cartItem.id,
          cartAmount: cartItem.amount,
        }
      }
    },

    updateOfferItem(changedSize, newCartAmount, cartItem) {
      const updatedSize = this.sizesList.find(
        (size) => size.offerId === String(changedSize.offerId),
      )
      const updatedOfferItem = updatedSize.products.find(
        (offerItem) => offerItem.id === changedSize.id,
      )

      updatedOfferItem.cartAmount = cartItem.cartAmount
      updatedOfferItem.cartItemId = cartItem.cartItemId
    },

    async onChangeAmount(changedSize) {
      const newCartAmount = changedSize.cartAmount ? 0 : 1
      try {
        this.isLoadingAddToCart = true
        // обновляем в базе
        const cartItem = await this.sendCartItem({
          id: changedSize.cartItemId,
          entityId: Number(changedSize.id),
          amount: newCartAmount,
          cartId: this.cartId,
        })

        // обновляем на фронте кнопку у offerItem
        this.updateOfferItem(changedSize, newCartAmount, cartItem)
      } catch (e) {
        console.error(e)
      } finally {
        this.isLoadingAddToCart = false
      }
    },
  },
}
</script>

<style lang="scss">
// TODO: Можно будет либо в таилвинд записать либо придумать глобальные классы
.circle {
  circle {
    fill: theme('colors.main.marzipan');
  }
}

// tailwind не видит классы, которых изначально не было в сборке
.facet-option {
  display: flex;
  align-items: center;
  height: 100%;
  user-select: none;

  font-size: 14px;
  line-height: 26px;

  @media (min-width: theme('screens.md')) {
    font-size: 15px;
    line-height: 30px;
  }

  @media (min-width: theme('screens.xl')) {
    font-size: 16px;
    line-height: 32px;
  }

  svg {
    width: 20px;
    height: 20px;
    margin-right: 4px;
  }

  &--inline {
    display: inline;

    svg {
      display: inline;
      margin-right: 0;
      margin-bottom: 2px;

      @media (min-width: theme('screens.md')) {
        margin-bottom: 1px;
      }
    }
  }
}
</style>
