<template>
  <div class="cart-kits">
    <div v-for="kit in kits" :key="kit.id" class="mb-12 md:mb-16 last:mb-0">
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
          xl:mb-4
        "
        >Комплект</span
      >
      <ul>
        <li
          v-for="cartProduct in kit.cartProducts"
          :key="cartProduct.id"
          class="last:mb-0 mb-3 md:mb-5 xl:mb-8"
        >
          <AppCartProduct
            :image-url="cartProduct.imageUrl"
            :info="cartProduct.info"
            :amounts="cartProduct.amounts"
            :has-comment="cartProduct.hasComment"
            :sizes="cartProduct.sizes"
            :price-type="priceType"
            :is-favorite="cartProduct.isFavorite"
            @delete="$emit('delete-kit-product', { kitId: kit.id, cartProductId: cartProduct.id })"
            @click-change="
              $emit('click-change', { kitId: kit.id, productId: cartProduct.productId })
            "
            @click-product="
              $emit('click-product', { kitId: kit.id, productId: cartProduct.productId })
            "
            @click-favorite="
              $emit('click-favorite-kit-product', {
                productId: cartProduct.productId,
                isFavorite: $event,
                kitId: kit.id,
              })
            "
          />
        </li>
      </ul>

      <div v-if="kit.noCartProducts.length" class="mt-3 md:mt-5 md:flex">
        <h4 class="text-h4 text-main-marzipan mb-2 md:mb-0 md:mt-1.5 md:mr-4 xl:mr-5">
          Другие товары<br class="hidden md:inline" />
          из <span class="hidden md:inline">этого</span> комплекта
        </h4>
        <ul class="nocarts-products">
          <li v-for="noCartProducts in kit.noCartProducts" :key="noCartProducts.id">
            <a
              class="nocarts-products__product"
              @click.prevent="
                $emit('click-product', { kitId: kit.id, productId: noCartProducts.id })
              "
            >
              <AppImgResizer
                v-if="noCartProducts.imageUrl"
                :url="noCartProducts.imageUrl"
                :width="$options.CACHED_IMAGE_SIZES[250]"
                sizes="(min-width:1280px) 156px, (min-width:768px) 114px, 92px"
                alt="фото"
              />
              <img v-else src="~/assets/img/product-no-photo.jpg" alt="фото" />
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import AppImgResizer from '~/components/common/app-img-resizer.vue'
import AppCartProduct from '~/components/base/app-cart/app-cart-product/app-cart-product.vue'
import { PRICE_TYPES } from '~/domain/carts'
import { CACHED_IMAGE_SIZES } from '~/utils/constants'

export default {
  components: {
    AppImgResizer,
    AppCartProduct,
  },

  props: {
    kits: { type: Array, default: () => [], required: true },
    priceType: { type: String, default: PRICE_TYPES.main.id, required: true },
  },

  CACHED_IMAGE_SIZES,
}
</script>

<style lang="scss">
.nocarts-products {
  display: grid;
  grid-template-columns: repeat(auto-fill, 48px);
  grid-template-rows: 48px;
  grid-gap: 12px;

  @media (min-width: theme('screens.md')) {
    flex-grow: 1;
    grid-template-columns: repeat(auto-fill, 64px);
    grid-template-rows: 64px;
    grid-gap: 16px;
  }

  @media (min-width: theme('screens.xl')) {
    grid-template-columns: repeat(auto-fill, 80px);
    grid-template-rows: 80px;
    grid-gap: 20px;
  }

  &__product {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    border: 1px solid theme('colors.main.waffle');
    cursor: pointer;
    transition: border 0.3s;

    &:hover {
      border: 1px solid theme('colors.main.chocolate');
    }

    @media (min-width: theme('screens.md')) {
      &:hover {
        border: 3px solid theme('colors.main.chocolate');
        transition: border-color 0.3s;
      }
    }
  }
}
</style>
