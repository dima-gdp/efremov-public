<template>
  <main class="not-found">
    <section class="not-found__first-section">
      <div class="container flex flex-col items-center">
        <span class="not-found__number">{{ error.statusCode }}</span>
        <h1 class="text-h1 mb-4 text-center md:mb-5">{{ title }}</h1>
        <p
          v-if="String(error.statusCode) === $options.ERROR_CODES.NOT_FOUND"
          class="text-main text-main-marzipan text-center mb-5 max-w-2xl xl:max-w-4xl"
        >
          Возможно она была перенесена или удалена. Попробуйте найти её вручную через главное меню
          или поиск, или вернитесь на главную страницу сайта.
        </p>
        <SButton to="/catalog">
          <span class="flex items-center text-but-lin">
            <IconHome class="w-4 h-4 mr-1.5 md:mr-2 xl:mr-2.5 xl:w-5 xl:h-5" />
            <span>Вернуться на главную страницу</span>
          </span>
        </SButton>
      </div>
    </section>
  </main>
</template>

<script>
import { SButton } from '~/components/ui-system'
import { IconHome } from '~/components/feather-icons'
import { ERROR_CODES } from '~/domain/errors/error-codes'
import { NOTFOUND_ERROR_TITLE, BASE_ERROR_TITLE } from '~/domain/errors/index'

export default {
  components: {
    SButton,
    IconHome,
  },

  layout: 'default',

  props: {
    error: { type: Object, default: () => ({}), required: false },
  },

  ERROR_CODES,

  computed: {
    title() {
      if (String(this.error.statusCode) === ERROR_CODES.NOT_FOUND) {
        return NOTFOUND_ERROR_TITLE
      }
      return BASE_ERROR_TITLE
    },
  },
}
</script>

<style lang="scss">
.not-found {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1;

  @media (min-width: theme('screens.md')) {
    background-color: #e8e5e5;
    background-image: url('~/assets/img/404/404-bg.jpg');
    background-position: bottom left;
    background-repeat: no-repeat;
    background-size: contain;
    flex-grow: 1;
  }

  &__first-section {
    padding-top: 40px;
    padding-bottom: 32px;

    @media (min-width: theme('screens.md')) {
      padding-top: 48px;
      padding-bottom: 48px;
    }

    @media (min-width: theme('screens.xl')) {
      padding-top: 86px;
      padding-bottom: 74px;
    }
  }

  &__number {
    margin-bottom: 6px;
    font-size: 100px;
    line-height: 1;
    color: theme('colors.main.chocolate');

    @media (min-width: theme('screens.md')) {
      font-size: 150px;
      margin-bottom: 0;
    }

    @media (min-width: theme('screens.xl')) {
      font-size: 250px;
    }
  }
}
</style>
