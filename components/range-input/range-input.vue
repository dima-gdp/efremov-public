<template>
  <div class="range-input text-main">
    <input
      :value="value[0]"
      :placeholder="min"
      :disabled="isDisabled"
      type="number"
      title=""
      class="range-input__left text-main"
      @change="changeNumberHandler($event, 0)"
    />
    <input
      :value="value[1]"
      :placeholder="max"
      :disabled="isDisabled"
      type="number"
      title=""
      class="range-input__right text-main"
      @change="changeNumberHandler($event, 1)"
    />
    <button v-show="isResetButtonVisible" class="range-input__reset" @click="resetValue">
      <RangeInputClose />
    </button>
    <div v-show="showRangeControl" class="range-input__slider">
      <VueSlider
        :value="rangeValue"
        height="2px"
        :dot-size="[20, 20]"
        tooltip="none"
        :min="min"
        :max="max"
        :interval="interval"
        :disabled="isDisabled"
        @change="$emit('change-range', $event)"
        @drag-end="$emit('changes-completed')"
      >
        <template #dot>
          <span class="range-input__dot">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="19"
              viewBox="0 0 20 19"
              fill="none"
            >
              <path
                d="M1.44749e-10 10.6095C1.68463e-10 9.23497 0.56589 7.92103 1.56464 6.9766L6.56464 2.24853C8.49221 0.425787 11.5078 0.425787 13.4354 2.24853L18.4354 6.9766C19.4341 7.92103 20 9.23497 20 10.6095V14C20 16.7614 17.7614 19 15 19H5C2.23858 19 0 16.7614 0 14L1.44749e-10 10.6095Z"
                fill="#090909"
              />
            </svg>
          </span>
        </template>
      </VueSlider>
    </div>
  </div>
</template>

<script>
import VueSlider from 'vue-slider-component/dist-css/vue-slider-component.umd.min'
import { getMinValueRange, getMaxValueRange } from '~/domain/product-filters'
import { RangeInputClose } from '~/components/icons'

export default {
  components: {
    RangeInputClose,
    VueSlider,
  },

  props: {
    fromValue: { type: [String, Number], default: 0, required: false },
    toValue: { type: [String, Number], default: 0, required: false },
    min: { type: Number, default: 0, required: true },
    max: { type: Number, default: 0, required: true },
    interval: { type: Number, default: 0.5, required: false },
    measure: { type: String, default: '', required: false },
    disabled: { type: Boolean, default: false, required: false },
    showRangeControl: { type: Boolean, default: true, required: false },
  },

  computed: {
    value: {
      get() {
        return [this.fromValue, this.toValue]
      },

      set(val) {
        this.$emit('change-range', val)
      },
    },

    isDisabled() {
      if (this.disabled) {
        return true
      }
      return !(this.min || this.max)
    },

    rangeValue() {
      const min = getMinValueRange(Number(this.min), Number(this.max), Number(this.fromValue))
      const max = getMaxValueRange(Number(this.max), Number(this.toValue))
      return [min, max]
    },

    isResetButtonVisible() {
      const [min, max] = this.value
      return Boolean(min || max)
    },
  },

  methods: {
    resetValue() {
      this.$emit('change-range', [null, null])
      this.$emit('changes-completed')
    },

    changeNumberHandler(ev, idx) {
      // Если инпут пустой
      if (!ev.target.value && ev.target.value !== 0) {
        this.changeEventTargetValue(ev.target, '')
        this.value = this.getNewValue(idx, null)
        this.$emit('changes-completed')
        return
      }

      if (Number(ev.target.value) < this.min) {
        this.changeEventTargetValue(ev.target, this.min)
        this.value = this.getNewValue(idx, this.min)
        this.$emit('changes-completed')
        return
      }

      if (Number(ev.target.value) > this.max) {
        this.changeEventTargetValue(ev.target, this.max)
        this.value = this.getNewValue(idx, this.max)
        this.$emit('changes-completed')
        return
      }

      this.value = this.getNewValue(idx, Number(ev.target.value))
      this.$emit('changes-completed')
    },

    getNewValue(idx, val) {
      const newValue = [...this.value]
      newValue[idx] = val
      return newValue
    },

    changeEventTargetValue(target, val) {
      // eslint-disable-next-line
      target.value = val
    },
  },
}
</script>

<style lang="scss">
@import 'range-input';
</style>
