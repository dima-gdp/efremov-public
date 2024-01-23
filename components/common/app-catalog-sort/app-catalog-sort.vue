<template>
  <div class="md:flex">
    <div class="flex">
      <div class="text-main text-main-marzipan">Сортировать</div>
      <AppSelectSort v-model="selectSort" :options="optionsSort" class="flex ml-1" />
    </div>
    <div class="flex md:ml-8">
      <div class="text-main text-main-marzipan">Группировать</div>
      <AppSelectSort v-model="selectGroupType" :options="optionsGroup" class="flex ml-1" />
    </div>
  </div>
</template>

<script>
import AppSelectSort from '~/components/common/app-select-sort/app-select-sort.vue'
import { GROUP_PRODUCTS, SORT_PRODUCTS } from '~/utils/constants'

export default {
  components: {
    AppSelectSort,
  },

  props: {
    groupType: {
      type: String,
      default: GROUP_PRODUCTS.PRODUCTS.value,
      required: false,
      validator: (val) =>
        Object.values(GROUP_PRODUCTS)
          .map((g) => g.value)
          .includes(val),
    },
    sort: {
      type: String,
      default: SORT_PRODUCTS.UPLOADED_AT.value,
      required: false,
      validator: (val) =>
        Object.values(SORT_PRODUCTS)
          .map((g) => g.value)
          .includes(val),
    },
  },

  data() {
    return {
      optionsSort: Object.values(SORT_PRODUCTS),
      optionsGroup: Object.values(GROUP_PRODUCTS),
    }
  },

  computed: {
    selectGroupType: {
      get() {
        return this.groupType
      },

      set(val) {
        this.$emit('change-group-type', val)
      },
    },

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
