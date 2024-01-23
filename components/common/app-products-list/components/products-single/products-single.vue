<template>
  <ul class="app-products-list">
    <li v-for="product in productsList" :key="product.id" class="app-products-list__col">
      <AppProductCard
        :product="product"
        :in-cart="product.inCart"
        :is-favorite="product.isFavorite"
        :show-price="showPrice"
        @click-to-card="$emit('click-to-card', $event)"
        @change-favorite="$emit('change-favorite', $event)"
      />
    </li>
  </ul>
</template>

<script>
import AppProductCard from '~/components/common/app-product-card/app-product-card.vue'
import { GROUP_PRODUCTS } from '~/utils/constants'

export default {
  components: { AppProductCard },

  props: {
    products: { type: Array, default: () => [], required: false },
    showPrice: { type: Boolean, default: true, required: false },
    groupType: {
      type: String,
      default: GROUP_PRODUCTS.PRODUCTS.value,
      required: false,
      validator: (val) =>
        Object.values(GROUP_PRODUCTS)
          .map((g) => g.value)
          .includes(val),
    },
  },
  computed: {
    productsList() {
      if (this.groupType === GROUP_PRODUCTS.PRODUCTS.value) {
        return this.products.map((p) => p.sortProducts[0])
      }
      return this.products
    },
  },
}
</script>

<style lang="scss">
@import 'products-single';
</style>
