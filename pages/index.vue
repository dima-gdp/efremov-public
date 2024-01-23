<template>
  <div class="container pb-3 xl mx-auto">
    <h1 class="mb-4 mt-4 text-h1">EF</h1>
    <h5 class="mb-4 text-h5">Links list</h5>
    <ul>
      <li>
        <nuxt-link to="/ui">UI</nuxt-link>
      </li>
      <li>
        <nuxt-link to="/catalog">Catalog</nuxt-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  middleware: ['redirect-to-catalog'],
}
</script>

