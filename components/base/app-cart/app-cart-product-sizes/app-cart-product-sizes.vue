<template>
  <div>
    <div class="flex flex-col w-72">
      <div class="flex flex-row items-center">
        <span class="mr-2 text-h6">Размеры</span>
        <button
          class="mr-2 text-comment hover:text-main-marzipan transition"
          @click="$emit('click-change')"
        >
          Изменить
        </button>

        <div class="flex items-center">
          <STooltip>
            <template #root-element>
              <button class="hover:text-main-waffle transition"><IconInfo class="h-4 w-4" /></button>
            </template>

            <template #content>
              <p class="text-comment">
                Чёрным указано общее количество изделий,
                <span class="text-status-success">зелёным</span> — количество изделий в наличии
              </p>
            </template>
          </STooltip>
        </div>

      </div>
      <div class="flex">
        <ul ref="product-sizes-list" class="cart-product-sizes-list">
          <li v-for="size in sizes" :key="size.id" class="cart-product-sizes-list__item">
            <div v-if="size.total" class="text-comment text-main-chocolate">
              <span class="text-h6"> {{ size.size }} </span>
              <span class="ml-2"> {{ size.total }}</span>
              <span class="text-status-success">({{ size.availability }})</span> изд.
            </div>
            <div v-else class="text-comment text-main-waffle">
              {{ size.size }} <span class="ml-2">{{ size.total }}</span> изд.
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import IconInfo from '~/components/feather-icons/icon-info.vue'
import STooltip from '~/components/ui-system/s-tooltip/s-tooltip.vue'

export default {
  components: { IconInfo, STooltip },

  props: {
    sizes: { type: Array, default: () => [], required: false },
  },
}
</script>

<style lang="scss">
@import 'app-cart-product-sizes';
</style>
