<template>
  <div>
    <div v-for="k in kitsList" :key="k.id" class="mb-10 md:mb-14 xl:mb-20">
      <span
        class="
          inline-block
          text-ha text-main-sugar
          bg-main-marzipan
          tracking-widest
          rounded
          uppercase
          mb-3.5
          px-1
          md:px-2
          xl:mb-5 xl:mb-6
        "
        >Комплект</span
      >
      <ProductsSingle
        :products="k.products"
        :group-type="$options.GROUP_PRODUCTS.KITS.value"
        :show-price="showPrice"
        @click-to-card="$emit('click-to-card', $event)"
        @change-favorite="$emit('change-favorite', $event)"
      />
    </div>
  </div>
</template>

<script>
import ProductsSingle from '../products-single/products-single.vue'
import { GROUP_PRODUCTS } from '~/utils/constants'

export default {
  GROUP_PRODUCTS,

  components: { ProductsSingle },

  props: {
    products: { type: Array, default: () => [], required: false },
    showPrice: { type: Boolean, default: true, required: false },
  },

  computed: {
    kitsList() {
      return this.products.map((k) => ({ id: k.id, products: k.sortProducts }))
    },
  },
}
</script>
