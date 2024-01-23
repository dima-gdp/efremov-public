<template>
  <div class="flex flex-col md:items-end">
    <span class="text-h4 md:mb-1 xl:mb-0">{{ price }}</span>
    <div class="text-comment text-main-marzipan">
      <span>{{ amount }} изд.</span> &thinsp; <span> · </span> &thinsp;
      <span>{{ weight }} гр</span> &thinsp;
    </div>
  </div>
</template>

<script>
export default {
  props: {
    price: { type: String, default: '', required: true },
    amount: { type: [String, Number], default: '', required: true },
    weight: { type: String, default: '', required: true },
  },
}
</script>
