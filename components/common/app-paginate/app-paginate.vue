<template>
  <div>
    <client-only>
      <paginate
        v-model="curPage"
        :page-count="pageCount"
        container-class="pagination"
        break-view-class="pagination__break"
        :page-range="3"
        prev-class="pagination__prev"
        next-class="pagination__next"
        page-class="pagination__item"
      />
    </client-only>
  </div>
</template>

<script>
export default {
  props: {
    currentPage: { type: Number, default: 1, required: false },
    pageCount: { type: Number, default: 1, required: true },
  },

  computed: {
    curPage: {
      get() {
        return this.currentPage
      },

      set(val) {
        this.$emit('change-page', val)
      },
    },
  },
}
</script>

<style lang="scss">
@import 'app-paginate';
</style>
