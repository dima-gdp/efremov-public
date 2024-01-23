<template>
  <div
    class="s-input-number"
    :class="{
      's-input-number--disabled': disabled,
      's-input-number--dark': color === $options.AVAILABLE_COLORS.DARK,
    }"
  >
    <button class="s-input-number__minus" :disabled="disabled" @click="decrement"></button>
    <input
      :value="value"
      class="s-input-number__input text-main"
      type="number"
      :disabled="disabled"
      @input="inputHandler"
    />
    <button class="s-input-number__plus" :disabled="disabled" @click="increment"></button>
  </div>
</template>

<script>
const AVAILABLE_COLORS = {
  LIGHT: 'light',
  DARK: 'dark',
}

export default {
  AVAILABLE_COLORS,
  props: {
    value: { type: Number, default: 0, required: false },
    maxValue: { type: Number, default: 0, required: false },
    disabled: { type: Boolean, default: false, required: false },
    haveLimit: { type: Boolean, default: false, required: false },
    color: {
      type: String,
      required: false,
      default: AVAILABLE_COLORS.LIGHT,
      validator: (val) => Object.values(AVAILABLE_COLORS).includes(val),
    },
  },
  data() {
    return {
      last: this.value,
    }
  },

  methods: {
    inputHandler(ev) {
      // Если ввели не число
      if (ev.data && !new RegExp('[0-9]').test(ev.data)) {
        this.changeInputValue(ev.target)
        return
      }

      // Если инпут пустой
      if (!ev.target.value && ev.target.value !== 0) {
        this.$emit('input', null)
        return
      }

      // Если есть верхняя граница
      if (this.haveLimit && ev.target.value > this.maxValue) {
        // eslint-disable-next-line no-param-reassign
        ev.target.value = this.maxValue
        this.$emit('input', this.maxValue)
        return
      }

      this.$emit('input', Number(ev.target.value))
    },

    changeInputValue(input) {
      if (!this.value && this.value !== 0) {
        // eslint-disable-next-line
        input.value = null
        this.$emit('input', null)
      } else {
        // eslint-disable-next-line
        input.value = this.value
      }
    },

    increment() {
      if (this.haveLimit && this.value >= this.maxValue) {
        return
      }
      this.$emit('input', Number(this.value) + 1)
    },

    decrement() {
      if (this.value > 0) {
        this.$emit('input', Number(this.value) - 1)
      }
    },
  },
}
</script>

<style lang="scss">
@import 's-input-number';
</style>
