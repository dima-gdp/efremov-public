<template>
  <div class="flex flex-col justify-center items-center text-center">
    <button @click="$emit('close')">
      <IconCheckCircle
        class="
          w-28
          h-28
          mb-4
          text-main-chocolate
          md:mb-7 md:w-36 md:h-36
          xl:w-52 xl:h-52 xl:mb-8
          flex-shrink-0
        "
      />
    </button>
    <h2 class="text-h1 mb-3 max-w-sm md:max-w-2xl xl:mb-6 xl:max-w-5xl">
      Поздравляем с регистрацией в&nbsp;онлайн-каталоге EFREMOV
    </h2>
    <p class="text-main mb-3 max-w-xs md:mb-6 md:max-w-2xl xl:mb-8 xl:max-w-3xl">
      Регистрационные данные отправлены на ваш E-mail. Ссылка на активацию аккаунта находится в
      письме. Для подтверждения учётных данных с вами свяжется менеджер отдела продаж. После
      успешной проверки вам придёт письмо о доступе в каталог.
    </p>
    <SButton
      to="/user/sign-in/login"
      class="flex mb-3 md:mr-5 md:mb-0 xl:mr-6"
      @click.native="$emit('click-auth')"
    >
      <IconUser class="w-4 h-4 mr-2 xl:w-5 xl:h-5 xl:mr-2.5" />
      <span>Авторизоваться</span>
    </SButton>
  </div>
</template>

<script>
import SButton from '~/components/ui-system/s-button/s-button.vue'
import { IconCheckCircle, IconUser } from '~/components/feather-icons'

export default {
  components: {
    SButton,
    IconCheckCircle,
    IconUser,
  },
}
</script>
