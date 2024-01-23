<template>
  <div>
    <ProductsSingle
      v-if="isSingleProductList"
      :products="products"
      :show-price="showPrice"
      @click-to-card="$emit('click-to-card', $event)"
      @change-favorite="$emit('change-favorite', $event)"
    />
    <ProductsGroups
      v-else
      :products="products"
      :show-price="showPrice"
      @click-to-card="$emit('click-to-card', $event)"
      @change-favorite="$emit('change-favorite', $event)"
    />
  </div>
</template>

<script>
import ProductsSingle from './components/products-single/products-single.vue'
import ProductsGroups from './components/products-groups/products-groups.vue'
import { GROUP_PRODUCTS } from '~/utils/constants'

export default {
  components: { ProductsGroups, ProductsSingle },
  props: {
    groupType: {
      type: String,
      default: GROUP_PRODUCTS.PRODUCTS.value,
      required: false,
      validator: (val) =>
        Object.values(GROUP_PRODUCTS)
          .map((g) => g.value)
          .includes(val),
    },
    products: { type: Array, default: () => [], required: false },
    showPrice: { type: Boolean, default: true, required: false },
  },

  computed: {
    isSingleProductList() {
      return this.groupType === GROUP_PRODUCTS.PRODUCTS.value
    },
  },
}
</script>
