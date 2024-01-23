<template>
  <div class="md:flex">
    <div class="flex">
      <div class="text-main text-main-marzipan">Сортировать</div>
      <AppSelectSort v-model="selectSort" :options="optionsSort" class="flex ml-1" />
    </div>
  </div>
</template>

<script>
import AppSelectSort from '~/components/common/app-select-sort/app-select-sort.vue'
import { FAVORITES_SORTS } from '~/domain/favorites'

export default {
  components: {
    AppSelectSort,
  },

  props: {
    sort: {
      type: String,
      default: FAVORITES_SORTS.UPLOADED_DECREASE.value,
      required: false,
      validator: (val) =>
        Object.values(FAVORITES_SORTS)
          .map((g) => g.value)
          .includes(val),
    },
  },

  data() {
    return {
      optionsSort: Object.values(FAVORITES_SORTS),
    }
  },

  computed: {
    selectSort: {
      get() {
        return this.sort
      },

      set(val) {
        this.$emit('change-sort', val)
      },
    },
  },
}
</script>
