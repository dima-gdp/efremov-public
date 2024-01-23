<template>
  <button
    v-if="hasChildren || !url"
    class="catalog-link-mobile text-main"
    @click="$emit('click-button-link')"
  >
    <span v-if="isSoon" class="opacity-50">
      {{ name }}
      <label class="text-ma text-main-marzipan uppercase tracking-widest ml-1">Скоро</label>
    </span>

    <span class="hover:text-main-waffle transition" v-else> {{ name }} </span>
  </button>

  <span v-else>
    <span v-if="isSoon" class="catalog-link-mobile text-main opacity-50" data-catalog-link>
      {{ name }}
      <label class="text-ma text-main-marzipan uppercase tracking-widest ml-1">Скоро</label>
    </span>

    <nuxt-link v-else :to="url" class="catalog-link-mobile text-main hover:text-main-waffle transition" data-catalog-link>
      {{ name }}
    </nuxt-link>
  </span>
</template>

<script>
export default {
  props: {
    name: { type: String, default: '', required: false },
    url: { type: String, default: '', required: false },
    isSoon: { type: Boolean, default: false, required: false },
    hasChildren: { type: Boolean, default: false, required: false },
  },
}
</script>

<style lang="scss">
.catalog-link-mobile {
  display: block;
  width: 100%;
  user-select: none;
  padding: 0 12px;
  color: theme('colors.main.sugar');
  text-align: left;

  @media (min-width: theme('screens.md')) {
    padding: 0 20px;
  }
}
</style>
