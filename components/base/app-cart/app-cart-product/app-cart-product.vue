<template>
  <div class="cart-product">
    <div
      class="cart-product__container"
      :class="{ 'cart-product__container--translate': isDeletePanelShown }"
    >
      <div class="cart-product__main">
        <div class="cart-product__image" @click="$emit('click-product')">
          <AppProductImage :url="imageUrl" />
        </div>

        <div class="w-full order-0 mb-2 md:mb-0 md:order-1 md:mr-2 xl:flex">
          <div class="flex-auto mb-2 md:mb-3 xl:mb-0 xl:mr-12">
            <AppProductInfo
              :article="info.article"
              :name="info.name"
              :weight="info.weight"
              :type="info.type"
              :short-info="info.shortInfo"
              @click-name="$emit('click-product')"
            />
          </div>

          <div v-if="currentBreakpoint === $options.BREAKPOINT_NAMES.DESKTOP" class="flex">
            <AppCartProductSizes :sizes="sizes" @click-change="$emit('click-change')" />
          </div>
        </div>

        <div class="order-2 md:flex md:flex-col md:items-end md:h-full">
          <div class="md:mb-1">
            <AppCartProductAmounts
              :price="formattedCost"
              :weight="amounts.weight"
              :amount="amounts.amount"
            />
          </div>
          <div class="flex items-center mb-1">
            <SButton
              class="mr-3"
              color="dark"
              variant="transparent"
              @click.native="$emit('click-change')"
            >
              <span class="flex items-center">
                <IconEdit class="w-4 h-4 mr-1 md:mr-2 xl:w-5 xl:h-5 xl:mr-2.5" />
                <span class="text-but-lin">Изменить</span>
              </span>
            </SButton>
            <button
              :class="{ 'fav-button--selected': isFavorite }"
              class="fav-button"
              @click="$emit('click-favorite', isFavorite)"
            >
              <IconStar class="w-4 h-4 xl:w-5 xl:h-5" />
            </button>
            <button
              class="text-status-error hover:text-main-waffle transition-colors"
              @click="isDeletePanelShown = true"
            >
              <IconTrash class="w-4 h-4 xl:w-5 xl:h-5" />
            </button>
          </div>
          <div class="text-comment md:mt-auto">
            <span v-if="hasComment">C комментарием</span>
            <span v-else>Без комментария</span>
          </div>
        </div>
      </div>

      <div class="cart-product__panel">
        <button
          class="
            h-1/2
            flex
            items-center
            justify-center
            bg-status-error
            text-main-sugar
            hover:text-main-chocolate hover:bg-main-souffle
            transition-colors
          "
          @click="$emit('delete')"
        >
          <IconTrash class="w-6 h-6 xl:w-5 xl:h-5" />
        </button>
        <button
          class="
            h-1/2
            flex
            items-center
            justify-center
            text-main-b
            bg-main-chocolate
            text-main-sugar
            hover:text-main-chocolate hover:bg-main-souffle
            transition-colors
          "
          @click="isDeletePanelShown = false"
        >
          Отмена
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import AppProductImage from '~/components/common/app-product-image.vue'
import AppCartProductSizes from '~/components/base/app-cart/app-cart-product-sizes/app-cart-product-sizes.vue'
import AppProductInfo from '~/components/common/app-product-info/app-product-info.vue'
import AppCartProductAmounts from '~/components/common/app-cart-product-amounts.vue'
import { BREAKPOINT_NAMES } from '~/utils/constants'
import { IconStar, IconTrash, IconEdit } from '~/components/feather-icons'
import { SButton } from '~/components/ui-system'
import { getFormattedCostByType } from '~/domain/cart-metal-insert-groups'

export default {
  components: {
    IconStar,
    SButton,
    AppCartProductAmounts,
    AppProductInfo,
    AppProductImage,
    IconTrash,
    IconEdit,
    AppCartProductSizes,
  },

  props: {
    imageUrl: { type: String, default: '', required: true },
    info: {
      type: Object,
      default: () => ({ article: '', name: '', weight: '', type: '', shortInfo: '' }),
      required: true,
    },
    amounts: {
      type: Object,
      default: () => ({ cost: '', tollingCost: '', weight: '', amount: '' }),
      required: true,
    },
    hasComment: { type: Boolean, default: false, required: false },
    sizes: { type: Array, default: () => [], required: false },
    priceType: { type: String, default: '', required: true },
    isFavorite: { type: Boolean, default: false, required: false },
  },

  BREAKPOINT_NAMES,

  data() {
    return {
      isDeletePanelShown: false,
    }
  },

  computed: {
    ...mapState(['currentBreakpoint']),

    formattedCost() {
      return getFormattedCostByType(this.amounts, this.priceType)
    },
  },
}
</script>

<style lang="scss">
@import 'app-cart-product';
</style>
