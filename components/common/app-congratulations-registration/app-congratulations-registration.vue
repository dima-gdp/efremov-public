<template>
  <div class="flex justify-center items-center content-center h-full">
    <div class="flex flex-col items-center max-w-3xl pl-3 pr-3 md:pl-0 md:pr-0">
      <div class="mb-4 md:mb-7 xl:mb-8">
        <IconCheckCircle class="h-28 w-28 md:h-36 md:w-36 xl:h-52 xl:w-52" />
      </div>
      <h3 class="text-h1 text-main-chocolate text-center mb-2 md:mb-4 xl:mb-4">
        Поздравляем с регистрацией в онлайн-каталоге EFREMOV
      </h3>
      <span class="text-main-chocolate text-main text-center mb-5 xl:mb-8"
        >Регистрационные данные отправлены на ваш E-mail. Ссылка на активацию аккаунта находится в
        письме. Для подтверждения учётных данных с вами свяжется менеджер отдела продаж. После
        успешной проверки вам придёт письмо о доступе в каталог</span
      >
      <div class="flex">
        <SButton variant="solid" color="dark">
          <IconUser class="w-5 h-5 mr-1.5 md:mr-2.5" />Авторизоваться</SButton
        >
      </div>
    </div>
  </div>
</template>

<script>
import SButton from '~/components/ui-system/s-button/s-button.vue'
import IconCheckCircle from '~/components/feather-icons/icon-check-circle.vue'
import IconUser from '~/components/feather-icons/icon-user.vue'

export default {
  components: {
    IconUser,
    IconCheckCircle,
    SButton,
  },
}
</script>

<style lang="scss">
</style>
