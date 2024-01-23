<template>
  <div
    class="widget-product-item"
    :class="{ 'widget-product-item--selected': offerItem.cartAmount }"
  >
    <div class="widget-product-item__col">
      <span class="text-ma text-main-sugar tracking-widest mb-1 xl:mb-0.5">{{
        offerItem.barcode
      }}</span>
      <span class="text-comment text-main-marzipan">{{ offerItem.insert }}</span>
    </div>

    <div class="widget-product-item__col">
      <span class="text-main-b text-main-marzipan">{{ offerItem.weight }} гр.</span>
      <span class="text-h5 text-main-sugar">{{ price }}</span>
    </div>

    <div class="widget-product-item__col">
      <SButton
        v-show="!offerItem.cartAmount"
        class="flex items-center"
        variant="ghost"
        color="light"
        :disabled="disabled"
        @click.native="$emit('change-amount')"
      >
        <IconCheckCircle class="w-4 h-4 mr-1.5 md:mr-2 xl:w-5 xl:h-5 xl:mr-2.5" />
        <span>В корзину</span>
      </SButton>

      <div v-show="offerItem.cartAmount" class="widget-product-item__delete">
        <div class="flex items-center text-main-nuga">
          <IconCheckCircle class="w-4 h-4 mr-1.5 md:mr-2 xl:w-5 xl:h-5 xl:mr-2.5" />
          <span class="text-but-lin select-none">Добавлено</span>
        </div>
        <button
          class="text-main-sugar text-comment-b select-none hover:text-main-nuga transition"
          :disabled="disabled"
          @click="$emit('change-amount')"
        >
          Удалить
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import SButton from '~/components/ui-system/s-button/s-button.vue'
import { IconCheckCircle } from '~/components/feather-icons'
import { getFormattedPriceByType } from '~/domain/product'

export default {
  components: { IconCheckCircle, SButton },

  props: {
    offerItem: {
      type: Object,
      default: () => ({
        barcode: '',
        insert: '',
        weight: '',
        price: '',
        tollingPrice: '',
        cartItemId: null,
        cartAmount: 0,
      }),
      required: false,
    },
    disabled: { type: Boolean, default: false, required: false },
  },

  data() {
    return {
      isSelected: false,
    }
  },

  computed: {
    ...mapState({
      priceType: (state) => state.user.userData.userProfile.priceType,
    }),

    price() {
      return getFormattedPriceByType(this.offerItem, this.priceType)
    },
  },
}
</script>

<style lang="scss">
@import 'widget-cart-product';
</style>
