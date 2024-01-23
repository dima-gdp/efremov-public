<template>
  <div class="flex flex-col">
    <span class="mb-2 md:mb-3 text-a tracking-widest">{{ article }}</span>
    <h3
      class="
        hidden
        text-h5
        cursor-pointer
        hover:text-main-marzipan
        transition-colors
        xl:inline-block xl:mb-2
      "
      @click="$emit('click-name')"
    >
      {{ name }}
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
  },
}
</script>

<style scoped></style>
