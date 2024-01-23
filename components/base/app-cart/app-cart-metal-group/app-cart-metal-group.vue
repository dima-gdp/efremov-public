<template>
  <div class="bg-main-souffle py-3 px-3 mb-3 md:mb-5 md:py-5 md:px-5 xl:py-8 xl:pt-7 xl:pb-5">
    <div class="mb-5 md:mb-4 xl:mb-4">
      <button
        class="
          inline-block
          text-left text-h3
          hover:text-main-marzipan
          transition-colors
          mb-1
          md:mb-1.5
        "
        :class="{ 'cursor-default text-main-marzipan': disabled, 'text-main-chocolate': !disabled }"
        :disabled="disabled"
        @click="onClickHeader"
      >
        <span>{{ metalGroup.title }}</span>
        <IconChevronDown
          class="inline-block w-4 h-4 xl:w-5 xl:h-5 transition-transform"
          :class="{ 'transform rotate-180': isExpand }"
        />
      </button>
      <p class="text-h4 text-main-marzipan">{{ subtitle }}</p>
    </div>

    <SlideUpDown :active="isExpand">
      <AppCartSort
        :sort="metalGroup.sort"
        :price="metalGroup.priceType"
        :group-type="metalGroup.groupType"
        :options-price="metalGroup.optionsPrice"
        :price-disabled="metalGroup.isDisabledOptionPrice"
        class="mb-4 md:mb-5 xl:mb-8"
        @change-price="$emit('change-price', $event, metalGroup.id)"
        @change-sort="$emit('change-sort', $event, metalGroup.id)"
        @change-group-type="$emit('change-group-type', $event, metalGroup.id)"
      />
      <!-- Вид без комплектов -->
      <ul v-if="metalGroup.groupType === $options.GROUP_PRODUCTS.PRODUCTS.value">
        <li
          v-for="cartProduct in metalGroup.cartProducts"
          :key="cartProduct.id"
          class="last:mb-0 mb-3 md:mb-5 xl:mb-8"
        >
          <AppCartProduct
            :image-url="cartProduct.imageUrl"
            :info="cartProduct.info"
            :amounts="cartProduct.amounts"
            :has-comment="cartProduct.hasComment"
            :sizes="cartProduct.sizes"
            :price-type="metalGroup.priceType"
            :is-favorite="cartProduct.isFavorite"
            @delete="$emit('delete-cart-product', cartProduct.id)"
            @click-change="$emit('click-change', cartProduct.productId, cartProduct.id)"
            @click-product="$emit('click-product', cartProduct.productId, cartProduct.id)"
            @click-favorite="
              $emit('click-favorite', {
                productId: cartProduct.productId,
                isFavorite: $event,
                metalGroupId: metalGroup.id,
              })
            "
          />
        </li>
      </ul>

      <!-- Вид по комплектам -->
      <AppCartKitsList
        v-else
        :kits="metalGroup.kits"
        :price-type="metalGroup.priceType"
        @delete-kit-product="$emit('delete-kit-product', $event)"
        @click-change="$emit('click-change-kit-product', $event)"
        @click-product="$emit('click-kit-product', $event)"
        @click-favorite-kit-product="$emit('click-favorite-kit-product', $event, metalGroup.id)"
      />

      <div
        v-if="metalGroup.isLoading"
        class="flex items-center justify-center my-5 mx-auto md:w-20 md:h-20 xl:w-24 xl:h-24"
      >
        <SSpin />
      </div>

      <SButton
        v-if="canLoadMore"
        :disabled="metalGroup.isLoading"
        color="dark"
        variant="ghost"
        class="mx-auto mt-5 md:mt-6 xl:mt-8"
        @click.native="$emit('click-load-more')"
      >
        <span class="flex items-center">
          <IconLoader class="w-4 h-4 mr-1.5 md:mr-2 xl:w-5 xl:h-5 xl:mr-2.5" />
          <span class="text-but-lin">Загрузить больше</span>
        </span>
      </SButton>

      <div class="mt-10 md:mt-12 md:flex md:items-end md:justify-between xl:mt-16">
        <div class="flex-auto mb-4 md:mb-0 md:mr-10 xl:mr-32">
          <AppCartCommentOrder v-model="comment" @focus="onFocusComment" @blur="onBlurComment" />
        </div>

        <div class="flex flex-col md:items-end">
          <span class="text-h2 md:mb-1 xl:mb-0">{{ formattedCost }}</span>
          <div class="text-main text-main-marzipan mb-2">
            <span>Выбрано {{ metalGroup.amount }} изд.</span> &thinsp; <span> · </span> &thinsp;
            <span>{{ metalGroup.weight }} гр</span>
          </div>
          <div>
            <SButton color="dark" variant="solid" @click.native="$emit('create-order', metalGroup)">
              <span class="flex items-center">
                <IconShoppingBag class="w-4 h-4 mr-1.5 md:mr-2 xl:w-5 xl:h-5 xl:mr-2.5" />
                <span class="text-but-lin">Оформить заказ</span>
              </span>
            </SButton>
          </div>
        </div>
      </div>
    </SlideUpDown>
  </div>
</template>

<script>
import SlideUpDown from 'vue-slide-up-down'
import { IconChevronDown, IconLoader, IconShoppingBag } from '~/components/feather-icons'
import AppCartCommentOrder from '~/components/base/app-cart/app-cart-comment-order/app-cart-comment-order.vue'
import {
  DELAY_COMMENT_UPDATE,
  getFormattedCostByType,
  getSubTitleMetalGroups,
} from '~/domain/cart-metal-insert-groups'
import AppCartProduct from '~/components/base/app-cart/app-cart-product/app-cart-product.vue'
import { SButton, SSpin } from '~/components/ui-system'
import AppCartSort from '~/components/base/app-cart/app-cart-sort/app-cart-sort.vue'
import { GROUP_PRODUCTS } from '~/utils/constants'
import AppCartKitsList from '~/components/base/app-cart/app-cart-kits-list/app-cart-kits-list.vue'

export default {
  components: {
    AppCartKitsList,
    AppCartSort,
    IconShoppingBag,
    AppCartProduct,
    IconChevronDown,
    SlideUpDown,
    AppCartCommentOrder,
    SButton,
    IconLoader,
    SSpin,
  },

  props: {
    activeGroupId: { type: String, default: null, required: false },
    metalGroup: { type: Object, default: () => ({}), required: false },
    disabled: { type: Boolean, default: false, required: false },
  },

  GROUP_PRODUCTS,

  data() {
    return {
      comment: '',
      timerId: null,
    }
  },

  computed: {
    isExpand() {
      return this.activeGroupId === this.metalGroup.id
    },

    formattedCost() {
      return getFormattedCostByType(this.metalGroup, this.metalGroup.priceType)
    },

    canLoadMore() {
      return this.metalGroup.pagination.currentPage < this.metalGroup.pagination.lastPage
    },

    subtitle() {
      return getSubTitleMetalGroups({
        amount: this.metalGroup.amount,
        weight: this.metalGroup.weight,
        cost: this.formattedCost,
      })
    },
  },

  created() {
    this.comment = this.metalGroup.comment
  },

  methods: {
    async onClickHeader() {
      if (this.disabled) {
        return
      }

      if (this.isExpand) {
        this.$emit('close-group', this.metalGroup.id)
        return
      }

      this.$emit('open-group', this.metalGroup.id)
    },

    onFocusComment() {
      this.timerId = setInterval(
        () => this.$emit('update-comment', this.comment, this.metalGroup.cartMetalGroupId),
        DELAY_COMMENT_UPDATE,
      )
    },

    onBlurComment() {
      clearInterval(this.timerId)
      this.$emit('update-comment', this.comment, this.metalGroup.cartMetalGroupId)
    },
  },
}
</script>

<style lang="scss">
@import 'app-cart-metal-group';
</style>
