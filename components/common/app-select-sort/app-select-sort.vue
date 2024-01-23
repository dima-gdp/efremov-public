<template>
  <div ref="select-sort" class="select-sort" data-select-sort>
    <button :disabled="priceDisabled" class="select-sort__top group" @click="isOpened = !isOpened">
      <span
        :class="[{ 'text-main-waffle' : priceDisabled }, 'text-main group-hover:text-main-waffle transition']"
        class="select-sort__val"
        >{{ valueLabel }}</span
      >
      <IconChevronDown :class="[{ 'text-main-waffle' : priceDisabled }, 'text-main']" class="select-sort__arrow group-hover:text-main-waffle transition" />
    </button>
    <transition name="fade">
      <ul v-show="isOpened" class="select-sort__dropdown">
        <li class="text-main mb-1.5 px-4 select-none whitespace-nowrap">
          {{ valueLabel }}
        </li>
        <li v-for="(option, idx) in options" :key="idx" class="select-sort__item text-main">
          <button @click="setValue(option.value)">
            {{ option.label }}
          </button>
        </li>
      </ul>
    </transition>
  </div>
</template>

<script>
import { IconChevronDown } from '~/components/feather-icons'

export default {
  components: { IconChevronDown },
  props: {
    value: { type: String, default: '', required: false },
    options: { type: Array, default: () => [], required: false },
    priceDisabled: { type: Boolean, default: false, required: false },
  },

  data() {
    return {
      isOpened: false,
    }
  },

  computed: {
    valueLabel() {
      return this.options.find((o) => o.value === this.value)?.label || ''
    },
  },

  mounted() {
    document.body.addEventListener('click', this.onClickOutsideSelect)
  },

  beforeDestroy() {
    document.body.removeEventListener('click', this.onClickOutsideSelect)
  },

  methods: {
    setValue(option) {
      if (this.value !== option) {
        this.$emit('input', option)
      }
      this.isOpened = false
    },

    onClickOutsideSelect({ target }) {
      if (target.closest('[data-select-sort]') !== this.$refs['select-sort']) {
        this.isOpened = false
      }
    },
  },
}
</script>

<style lang="scss">
@import 'app-select-sort';
</style>
