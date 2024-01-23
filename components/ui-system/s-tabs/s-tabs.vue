<template>
  <ul class="s-tabs" :class="{ 's-tabs--light': color === $options.AVAILABLE_COLORS.LIGHT }">
    <li
      v-for="(tab, idx) in tabs"
      :key="idx"
      class="s-tabs__item"
      :class="{ 's-tabs__item--current': value === tab.value }"
    >
      <button class="s-tabs__button" @click="onTabClick(tab.value)">
        <span class="s-tabs__icon">
          <component :is="tab.icon" />
        </span>
        <span v-html="tab.html" class="s-tabs__content text-but-lin"></span>
      </button>
    </li>
  </ul>
</template>

<script>
const AVAILABLE_COLORS = {
  LIGHT: 'light',
  DARK: 'dark',
}

export default {
  AVAILABLE_COLORS,
  props: {
    value: { type: String, default: '', required: false },
    tabs: { type: Array, default: () => [], required: false },
    color: {
      type: String,
      default: AVAILABLE_COLORS.DARK,
      required: false,
      validator: (val) => Object.values(AVAILABLE_COLORS).includes(val),
    },
  },

  methods: {
    onTabClick(val) {
      if (val !== this.value) {
        this.$emit('input', val)
      }
    },
  },
}
</script>

<style lang="scss">
@import 's-tabs';
</style>
