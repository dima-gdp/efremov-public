<template>
  <div class="flex justify-center items-center content-center h-full">
    <div class="flex flex-col items-center max-w-3xl pl-3 pr-3 md:pl-0 md:pr-0">
      <div class="mb-4 md:mb-7 xl:mb-8">
        <IconCheckCircle class="h-28 w-28 md:h-36 md:w-36 xl:h-52 xl:w-52" />
      </div>
      <h3 class="text-h1 text-main-chocolate text-center mb-4 xl:mb-6">
        Поздравляем с регистрацией в&nbsp;онлайн-каталоге EFREMOV
      </h3>
      <span class="text-main-chocolate text-main text-center mb-5 xl:mb-8"
        >Доступ к каталогу будет предоставлен после проверки ваших регистрационных данных менеджером
        отдела продаж, он в скором времени свяжется с вами</span
      >
      <div class="flex">
        <SButton variant="solid" color="dark" @click.native="$emit('close')">
          <IconUser class="w-5 h-5 mr-1.5 md:mr-2.5" />Авторизоваться</SButton
        >
      </div>
    </div>
  </div>
</template>

<script>
import SButton from '~/components/ui-system/s-button/s-button.vue'
import { IconUser, IconCheckCircle } from '~/components/feather-icons'

export default {
  components: {
    IconCheckCircle,
    IconUser,
    SButton,
  },
}
</script>
