<template>
  <div class="flex justify-center items-center content-center h-full">
    <div class="flex flex-col items-center pl-3 pr-3 md:max-w-xl md:pl-0 md:pr-0 xl:max-w-full">
      <div class="mb-4 md:mb-7 xl:mb-8">
        <IconUser class="h-28 w-28 md:h-36 md:w-36 xl:h-52 xl:w-52" />
      </div>
      <h3 class="text-h1 text-main-chocolate text-center mb-3 xl:mb-6">
        Ваша учётная запись активирована
      </h3>
      <p class="text-main-chocolate text-main text-center mb-3 md:mb-5 xl:mb-8">
        Теперь вы можете пользоваться онлайн-каталогом после авторизации на сайте
      </p>
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
import IconUser from '~/components/feather-icons/icon-user.vue'

export default {
  components: {
    IconUser,
    SButton,
  },
}
</script>
