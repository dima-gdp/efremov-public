<script>
const AVAILABLE_TYPES = {
  SOLID: 'solid',
  GHOST: 'ghost',
  TRANSPARENT: 'transparent',
}

const AVAILABLE_COLORS = {
  LIGHT: 'light',
  DARK: 'dark',
}

export default {
  props: {
    variant: {
      type: String,
      required: false,
      default: AVAILABLE_TYPES.SOLID,
      validator: (val) => Object.values(AVAILABLE_TYPES).includes(val),
    },

    color: {
      type: String,
      required: false,
      default: AVAILABLE_COLORS.DARK,
      validator: (val) => Object.values(AVAILABLE_COLORS).includes(val),
    },

    href: { type: String, required: false, default: '' },
    redirect: { type: Boolean, required: false, default: false },
    to: { type: [Object, String], required: false, default: '' },
    disabled: { type: Boolean, required: false, default: false },
  },

  computed: {
    buttonHtmlTag() {
      if (this.href) return 'a'
      if (this.to) return 'nuxt-link'
      return 'button'
    },
  },

  render(createElement) {
    return createElement(
      this.buttonHtmlTag,
      {
        class: {
          's-button': true,
          's-button--dark': this.color === AVAILABLE_COLORS.DARK,
          's-button--ghost': this.variant === AVAILABLE_TYPES.GHOST,
          's-button--transparent': this.variant === AVAILABLE_TYPES.TRANSPARENT,
        },
        attrs: {
          disabled: this.disabled,
          href: this.href || undefined,
        },
        props: {
          to: this.to || undefined,
        },
      },
      [this.$slots.default],
    )
  },
}
</script>

<style lang="scss">
@import 's-button';
</style>
