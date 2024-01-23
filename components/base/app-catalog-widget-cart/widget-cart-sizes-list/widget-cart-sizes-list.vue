<template>
  <div>
    <ul class="flex items-center space-x-1 mb-4 md:space-x-2 md:mb-6 xl:space-x-3">
      <li>
        <STagButton @click.native="$emit('mass-update-amount', 1)"
          ><span class="hidden md:inline">Добавить всех по </span>+1 шт.</STagButton
        >
      </li>
      <li>
        <STagButton @click.native="$emit('mass-update-amount', 5)">+5 шт.</STagButton>
      </li>
      <li class="hidden md:block">
        <STagButton @click.native="$emit('mass-update-amount', 10)">+10 шт.</STagButton>
      </li>
      <li>
        <button
          class="text-comment text-main-souffle hover:text-main-nuga transition"
          @click="$emit('clean-amount')"
        >
          Очистить
        </button>
      </li>
    </ul>

    <ul ref="sizes-list" class="cart-sizes-list">
      <li v-for="size in sizes" :key="size.id" class="cart-sizes-list__item">
        <SizesListItem :size="size" @update-amount="$emit('update-amount', $event)" />
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import SizesListItem from './sizes-list-item/sizes-list-item.vue'
import { BREAKPOINT_NAMES } from '~/utils/constants'
import flushPromises from '~/utils/flush-promises'
import STagButton from '~/components/ui-system/s-tag-button/s-tag-button.vue'

export default {
  components: { SizesListItem, STagButton },

  props: {
    sizes: { type: Array, default: () => [], required: false },
  },
  computed: {
    ...mapState(['currentBreakpoint']),
  },

  watch: {
    async currentBreakpoint(val) {
      if (val !== BREAKPOINT_NAMES.MOBILE) {
        await flushPromises()
        this.setMinWidthOddSizes()
      }
    },
  },

  mounted() {
    if (this.currentBreakpoint !== BREAKPOINT_NAMES.MOBILE) {
      this.setMinWidthOddSizes()
    }
  },

  methods: {
    setMinWidthOddSizes() {
      const sizesEl = this.$refs['sizes-list'].querySelectorAll('[data-size]')
      const oddSizesEl = Array.from(sizesEl).filter((el, idx) => idx % 2 !== 0)
      const maxWidthOddSizes = Math.max(...oddSizesEl.map((el) => el.offsetWidth))
      oddSizesEl.forEach((el) => {
        el.style.minWidth = `${maxWidthOddSizes}px`
      })
    },
  },
}
</script>

<style lang="scss">
.cart-sizes-list {
  display: grid;
  grid-template-columns: 1fr;
  grid-column-gap: 10px;
  grid-row-gap: 8px;

  @media (min-width: theme('screens.md')) {
    grid-template-columns: auto 1fr;
    grid-row-gap: 16px;
    grid-column-gap: 45px;
  }

  @media (min-width: theme('screens.xl')) {
    grid-row-gap: 20px;
  }

  &__item {
    &:nth-child(2n) {
      width: 100%;
      @media (min-width: theme('screens.md')) {
        justify-self: flex-start;
        width: initial;
      }

      [data-size] {
        flex: 1 1 auto;
        @media (min-width: theme('screens.md')) {
          flex: 0 0 auto;
        }
      }
    }

    &:nth-child(odd) {
      width: 100%;
      [data-size] {
        flex: 1 1 auto;
        @media (max-width: theme('screens.md')) {
          min-width: auto !important;
        }
      }
    }

    &:nth-child(6n) {
      margin-bottom: 16px;

      @media (min-width: theme('screens.md')) {
        margin-bottom: 20px;
      }

      @media (min-width: theme('screens.xl')) {
        grid-row-gap: 14px;
      }
    }
  }
}
</style>
