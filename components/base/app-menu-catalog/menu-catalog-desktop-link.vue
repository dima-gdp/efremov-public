<!-- TODO: можно слить в один компонент вместе с мобильной ссылкой -->
<template>
  <nuxt-link
    v-if="url && !isSoon"
    :to="url"
    class="catalog-link-desktop text-main"
    data-catalog-link
  >
    {{ name }}
  </nuxt-link>

  <p v-else class="catalog-link-desktop text-main">
    <span v-if="isSoon" class="opacity-50">
      {{ name }}
      <label class="text-ma text-main-marzipan uppercase tracking-widest ml-1">Скоро</label>
    </span>

    <span v-else>
      {{ name }}
    </span>
  </p>
</template>

<script>
export default {
  props: {
    name: { type: String, default: () => '', required: false },
    url: { type: String, default: () => '', required: false },
    isSoon: { type: Boolean, default: () => false, required: false },
  },
}
</script>

<style lang="scss">
.catalog-link-desktop {
  display: block;
  padding: 4px 20px;
  user-select: none;
  color: theme('colors.main.sugar');
  transition: color 0.3s;
  &:hover {
    background: theme('colors.main.nuga');
  }
}
</style>
