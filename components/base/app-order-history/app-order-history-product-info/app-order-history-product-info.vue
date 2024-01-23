<template>
  <div class="flex flex-col">
    <span class="mb-2 md:mb-3 text-a tracking-widest">{{ article }}</span>
    <h3 class="hidden text-h5 transition-colors xl:inline-block xl:mb-2">
      <a
        v-if="isActiveProduct"
        target="_blank"
        :href="`/catalog?productId=${productId}`"
        class="cursor-pointer hover:text-main-marzipan"
      >
        {{ name }}
      </a>
      <span v-else class="text-main-marzipan">{{ name }}</span>
    </h3>

    <div class="hidden text-comment-b mb-1 md:inline-block">
      <span>{{ type }}</span> &nbsp; <span> · </span> &nbsp;
      <span>{{ weight }} гр.</span>
    </div>
    <p class="text-comment text-main-marzipan">{{ shortInfo }}</p>
  </div>
</template>

<script>
export default {
  props: {
    article: { type: String, default: '', required: true },
    name: { type: String, default: '', required: true },
    weight: { type: String, default: '', required: true },
    type: { type: String, default: '', required: true },
    shortInfo: { type: String, default: '', required: true },
    productId: { type: Number, default: null, required: false },
    isActiveProduct: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
}
</script>

<style scoped></style>
