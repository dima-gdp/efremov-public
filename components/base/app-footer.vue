<template>
  <footer class="footer bg-main-chocolate text-main-sugar">
    <div class="container">
      <div
        class="flex flex-col items-center pt-8 pb-4 md:justify-between md:flex-row md:py-5 xl:py-4"
      >
        <nuxt-link to="/catalog" class="mb-8 md:mb-0 md:mr-7 xl:mr-14">
          <IconE class="hover:text-main-nuga transition" />
        </nuxt-link>

        <div class="block md:flex md:flex-grow md:justify-between">
          <ul
            class="
              flex flex-col
              items-center
              space-y-3
              mb-5
              md:mb-0 md:flex-row md:space-y-0 md:flex-wrap
            "
          >
            <li class="md:mr-8">
              <button
                class="flex items-center text-main-sugar hover:text-main-nuga transition"
                data-menu-catalog-btn
                data-menu-close
                @click="$emit('click-catalog-btn')"
              >
                <IconGrid class="mr-1" />
                <span class="text-but-lin">Каталог</span>
              </button>
            </li>

            <li v-for="link in $options.NAVIGATE_MENU_LIST" :key="link.title" class="md:mr-8">
              <nuxt-link
                v-if="link.to"
                :to="link.to"
                class="text-main-sugar text-but-lin hover:text-main-nuga transition"
              >
                {{ link.title }}
              </nuxt-link>
              <a
                v-else
                :href="link.href"
                class="text-main-sugar text-but-lin hover:text-main-nuga transition"
                target="_blank"
              >
                {{ link.title }}
              </a>
            </li>
          </ul>
          <div class="flex flex-col items-center md:items-end xl:items-center xl:flex-row xl:ml-3">
            <ul class="flex items-center mb-4 md:mb-2 xl:mb-0 xl:mr-10">
              <li class="mr-2">
                <a class="vk-link" href="https://vk.com/efremov_gold" target="_blank"><IconVk /></a>
              </li>
              <li>
                <a
                  class="pinterest-link"
                  href="https://ru.pinterest.com/efremov_gold/"
                  target="_blank"
                  ><IconPinterest
                /></a>
              </li>
            </ul>
            <a
              href="tel:84942425311"
              class="
                text-h5 text-main-sugar
                whitespace-nowrap
                mb-4
                md:mb-0
                hover:text-main-nuga
                transition
              "
              >+7 (4942) 42-53-11</a
            >
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import { IconGrid } from '~/components/feather-icons'
import { IconE, IconVk, IconPinterest } from '~/components/icons'
import { NAVIGATE_MENU_LIST } from '~/utils/constants'

export default {
  components: {
    IconGrid,
    IconE,
    IconVk,
    IconPinterest,
  },

  NAVIGATE_MENU_LIST,
}
</script>

<style lang="scss">
.hover-logo:hover #Rectangle {
  fill: theme('colors.main.nuga');
  transition: 0.3s;
}

.vk-link {
  rect,
  path {
    transition: fill 0.3s;
  }
  &:hover {
    rect {
      fill: theme('colors.main.nuga');
    }

    path {
      fill: theme('colors.main.waffle');
    }
  }
}

.pinterest-link {
  path {
    transition: fill 0.3s;
  }
  &:hover {
    path {
      &:first-child {
        fill: theme('colors.main.nuga');
      }
      &:last-child {
        fill: theme('colors.main.waffle');
      }
    }
  }
}
</style>
