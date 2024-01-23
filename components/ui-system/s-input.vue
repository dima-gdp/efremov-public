<template>
  <div class="flex relative text-main placeholder-main-marzipan">
    <input
      v-if="variant === $options.AVAILABLE_VARIANTS.STANDARD"
      v-model="inputValue"
      :autocomplete="autocomplete"
      :placeholder="placeholder"
      :type="type"
      class="
        h-8
        md:h-9
        xl:h-10
        w-full
        px-3
        md:px-3.5
        xl:px-4
        outline-none
        rounded
        border border-main-marzipan
      "
      :class="{
        'pr-8 md:pr-9 xl:pr-10': withSearchIcon || failed || success,
        'border-status-error text-status-error': failed,
        'bg-main-waffle text-main-souffle': disabled,
        'bg-main-sugar text-main-chocolate': !disabled

      }"
      :readonly="readonly"
      :name="name"
      :disabled="disabled"
      @focus="$emit('focus', $event)"
      @blur="$emit('blur', $event)"
    />
    <textarea
      v-else
      v-model="inputValue"
      :autocomplete="autocomplete"
      :readonly="readonly"
      :name="name"
      :disabled="disabled"
      class="
        h-32
        w-full
        py-1.5
        md:py-2
        xl:py-2.5
        px-3
        md:px-3.5
        xl:px-4
        resize-none
        outline-none
        rounded
        border border-main-marzipan
      "
      :class="{
        'pr-8 md:pr-9 xl:pr-10': withSearchIcon || failed || success,
        'border-status-error text-status-error': failed,
        'bg-main-waffle text-main-souffle': disabled,
        'bg-main-sugar text-main-chocolate': !disabled
      }"
      :placeholder="placeholder"
      @focus="$emit('focus', $event)"
      @blur="$emit('blur', $event)"
    ></textarea>
    <button
      v-if="withSearchIcon && !failed && !success"
      class="
        flex
        justify-center
        items-center
        absolute
        top-0
        right-0
        w-8
        md:w-9
        xl:w-10
        h-8
        md:h-9
        xl:h-10
      "
    >
      <IconSearch class="w-4 h-4 xl:w-5 xl:h-5" />
    </button>

    <span
      v-if="failed || success"
      class="
        flex
        justify-center
        items-center
        absolute
        top-0
        right-0
        w-8
        md:w-9
        xl:w-10
        h-8
        md:h-9
        xl:h-10
      "
    >
      <IconCheckCircle v-if="success" class="w-4 h-4 xl:w-5 xl:h-5 text-status-success" />
      <IconAlertTriangle v-if="failed" class="w-4 h-4 text-status-error" />
    </span>
  </div>
</template>

<script>
import { IconSearch, IconCheckCircle, IconAlertTriangle } from '~/components/feather-icons'

const AVAILABLE_VARIANTS = {
  STANDARD: 'standard',
  MULTIROW: 'multirow',
}

export default {
  AVAILABLE_VARIANTS,
  components: { IconAlertTriangle, IconCheckCircle, IconSearch },
  props: {
    value: { type: String, default: '', required: false },
    disabled: { type: Boolean, default: false, required: false },
    autocomplete: { type: String, default: 'off', required: false },
    name: { type: String, default: '', required: false },
    readonly: { type: Boolean, default: false, required: false },
    placeholder: { type: String, default: '', required: false },
    type: { type: String, default: 'text', required: false },
    failed: { type: Boolean, default: false, required: false },
    success: { type: Boolean, default: false, required: false },
    variant: {
      type: String,
      default: AVAILABLE_VARIANTS.STANDARD,
      required: false,
      validator: (val) => Object.values(AVAILABLE_VARIANTS).includes(val),
    },
    withSearchIcon: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  computed: {
    inputValue: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      },
    },
  },
}
</script>
