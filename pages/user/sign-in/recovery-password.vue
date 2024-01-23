<template>
  <main class="container">
    <section class="pb-10 pt-4 md:pb-16 md:pt-10 xl:pb-20 xl:pt-13">
      <h1 class="text-h1 mb-3 md:mb-3.5">Восстановление пароля</h1>

      <form class="max-w-lg" @submit.prevent="recoveryPassword">
        <ValidationObserver ref="recoveryPassword" class="block mb-6 md:mb-8 xl:mb-6">
          <ValidationProvider
            #default="{ errors, failed }"
            class="block mb-5 md:mb-6 xl:mb-7"
            rules="required|email"
            vid="email"
            name="Электронная почта"
          >
            <label>
              <SFieldLabel required>Электронная почта</SFieldLabel>
              <SInput v-model="email" placeholder="email@example.ru" :failed="failed" />
              <SErrorMessage>{{ errors[0] }}</SErrorMessage>
              <span v-if="isRecoveryPasswordSuccess" class="text-status-success text-comment flex pt-1">
                <IconCheckCircle class="w-5 h-5 mr-1.5" /> Ссылка на создание нового пароля
                отправлена на ваш E-mail.
              </span>
            </label>
          </ValidationProvider>
        </ValidationObserver>

        <div class="inline-block md:flex md:items-center">
          <SButton type="submit" class="flex mb-3 md:mr-5 md:mb-0 xl:mr-6" :disabled="isLoading">
            <IconRefresh class="w-4 h-4 mr-2 xl:w-5 xl:h-5 xl:mr-2.5" />
            <span>Сбросить пароль</span>
          </SButton>
          <SButton to="/user/sign-in/login" variant="transparent" color="dark">
            <IconArrowRight class="w-4 h-4 mr-2 xl:w-5 xl:h-5 xl:mr-2.5 transform rotate-180" />
            Вернуться к авторизации</SButton
          >
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import SInput from '~/components/ui-system/s-input.vue'
import SButton from '~/components/ui-system/s-button/s-button.vue'
import IconArrowRight from '~/components/feather-icons/icon-arrow-right.vue'
import IconRefresh from '~/components/feather-icons/icon-refresh-cw.vue'
import SErrorMessage from '~/components/ui-system/s-error-message.vue'
import SFieldLabel from '~/components/ui-system/s-field-label.vue'
import { getParsedErrorsByPointer } from '~/domain/errors'
import HttpError from '~/domain/errors/http-error'
import passwordRecoveriesAdapter from '~/services/password-recoveries-adapter'
import IconCheckCircle from '~/components/feather-icons/icon-check-circle.vue'

export default {
  components: {
    IconCheckCircle,
    SFieldLabel,
    SErrorMessage,
    IconArrowRight,
    IconRefresh,
    SButton,
    SInput,
    ValidationProvider,
    ValidationObserver,
  },

  data() {
    return {
      email: '',
      isLoading: false,
      isRecoveryPasswordSuccess: false,
    }
  },

  methods: {
    setRecoveryPasswordErrors(e) {
      const recoveryPasswordErrors = e.errorsList
      if (recoveryPasswordErrors?.length) {
        const parsedErrors = getParsedErrorsByPointer(e.errorsList)
        this.$refs.recoveryPassword.setErrors(parsedErrors)
      }
    },

    async recoveryPassword() {
      if (this.isLoading) {
        return
      }

      this.isRecoveryPasswordSuccess = false
      const isValid = await this.$refs.recoveryPassword.validate()

      if (!isValid) {
        return
      }

      try {
        this.isLoading = true
        await passwordRecoveriesAdapter().passwordRecovery({ email: this.email })
        this.isRecoveryPasswordSuccess = true
      } catch (e) {
        if (e instanceof HttpError) {
          this.setRecoveryPasswordErrors(e)
        } else {
          console.error(e)
        }
      } finally {
        this.isLoading = false
      }
    },
  },
}
</script>
