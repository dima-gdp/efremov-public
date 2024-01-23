<template>
  <div class="md:flex">
    <div class="flex">
      <span class="text-main text-main-marzipan">Сортировать</span>
      <AppSelectSort v-model="selectSort" :options="optionsSort" class="flex ml-1" />
    </div>
    <div class="flex md:ml-8">
      <span class="text-main text-main-marzipan">Группировать</span>
      <AppSelectSort v-model="selectGroupType" :options="optionsGroupType" class="flex ml-1" />
    </div>
    <div class="flex md:ml-8">
      <span class="text-main text-main-marzipan">Цена</span>
      <AppSelectSort
        v-model="selectPrice"
        :options="optionsPrice"
        :price-disabled="priceDisabled"
        class="flex ml-1"
      />
    </div>
  </div>
</template>

<script>
import AppSelectSort from '~/components/common/app-select-sort/app-select-sort.vue'
import { CART_METAL_GROUP_PRICE_TYPES, SORT_CART_PRODUCTS } from '~/domain/cart-metal-insert-groups'
import { GROUP_PRODUCTS } from '~/utils/constants'

export default {
  components: {
    AppSelectSort,
  },

  props: {
    optionsPrice: {
      type: Array,
      default: () => [...CART_METAL_GROUP_PRICE_TYPES],
      required: false,
    },
    sort: {
      type: String,
      default: SORT_CART_PRODUCTS.WEIGHT_INCREASE.value,
      required: false,
      validator: (val) =>
        Object.values(SORT_CART_PRODUCTS)
          .map((g) => g.value)
          .includes(val),
    },
    price: {
      type: String,
      default: CART_METAL_GROUP_PRICE_TYPES.COST.value,
      required: false,
      validator: (val) =>
        Object.values(CART_METAL_GROUP_PRICE_TYPES)
          .map((g) => g.value)
          .includes(val),
    },
    groupType: {
      type: String,
      default: GROUP_PRODUCTS.PRODUCTS.value,
      required: false,
      validator: (val) =>
        Object.values(GROUP_PRODUCTS)
          .map((g) => g.value)
          .includes(val),
    },
    priceDisabled: { type: Boolean, default: false, required: false },
  },

  data() {
    return {
      optionsSort: Object.values(SORT_CART_PRODUCTS),
      optionsGroupType: Object.values(GROUP_PRODUCTS),
    }
  },

  computed: {
    selectSort: {
      get() {
        return this.sort
      },

      set(val) {
        this.$emit('change-sort', val)
      },
    },

    selectPrice: {
      get() {
        return this.price
      },

      set(val) {
        this.$emit('change-price', val)
      },
    },

    selectGroupType: {
      get() {
        return this.groupType
      },

      set(val) {
        this.$emit('change-group-type', val)
      },
    },
  },
}
</script>
