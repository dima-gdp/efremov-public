<template>
  <main class="container">
    <section class="pb-10 pt-4 md:pb-16 md:pt-10 xl:pb-20 xl:pt-13">
      <h1 class="text-h1 mb-3 md:mb-3.5">Сброс пароля</h1>

      <form class="max-w-lg" @submit.prevent="resetPassword">
        <ValidationObserver ref="resetPassword" class="block mb-6 md:mb-8 xl:mb-6">
          <ValidationProvider
            #default="{ errors, failed }"
            class="block mb-5 md:mb-6 xl:mb-7"
            rules="required|password|password-min:8|password-max:255"
            name="Введите новый пароль"
          >
            <label>
              <SFieldLabel required>Введите новый пароль</SFieldLabel>
              <SInput
                v-model.trim="password"
                type="password"
                autocomplete
                placeholder="Пароль от 8 символов"
                :failed="failed"
              />
              <SErrorMessage>{{ errors[0] }}</SErrorMessage>
            </label>
          </ValidationProvider>
          <ValidationProvider
            #default="{ errors, failed }"
            class="block"
            rules="required|equalFieldPassword:@Введите новый пароль"
            name="Введите новый пароль ещё раз"
          >
            <label>
              <SFieldLabel required>Введите новый пароль ещё раз</SFieldLabel>
              <SInput
                v-model.trim="duplicatePassword"
                type="password"
                autocomplete
                placeholder="Введите новый пароль ещё раз"
                :failed="failed"
              />
              <SErrorMessage>{{ errors[0] }}</SErrorMessage>
            </label>
          </ValidationProvider>
        </ValidationObserver>

        <div class="md:flex md:items-center">
          <SButton type="submit" class="flex mb-3 md:mr-5 md:mb-0 xl:mr-6" :disabled="isLoading">
            <IconCheckCircle class="w-4 h-4 mr-2 xl:w-5 xl:h-5 xl:mr-2.5" />
            <span>Установить новый пароль</span>
          </SButton>
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import SInput from '~/components/ui-system/s-input.vue'
import SButton from '~/components/ui-system/s-button/s-button.vue'
import IconCheckCircle from '~/components/feather-icons/icon-check-circle.vue'
import SErrorMessage from '~/components/ui-system/s-error-message.vue'
import SFieldLabel from '~/components/ui-system/s-field-label.vue'
import { getParsedErrorsByPointer } from '~/domain/errors'
import passwordResetsAdapter from '~/services/password-resets-adapter'
import HttpError from '~/domain/errors/http-error'

export default {
  components: {
    SFieldLabel,
    SErrorMessage,
    IconCheckCircle,
    SButton,
    SInput,
    ValidationProvider,
    ValidationObserver,
  },

  data() {
    return {
      password: '',
      duplicatePassword: '',
      isLoading: false,
    }
  },

  methods: {
    setResetPasswordErrors(e) {
      const resetPasswordErrors = e.errorsList
      if (resetPasswordErrors?.length) {
        const parsedErrors = getParsedErrorsByPointer(e.errorsList)
        this.$refs.resetPassword.setErrors(parsedErrors)
      }
    },

    async resetPassword() {
      if (this.isLoading) {
        return
      }
      const isValid = await this.$refs.resetPassword.validate()

      if (!isValid) {
        return
      }

      try {
        this.isLoading = true
        await passwordResetsAdapter().passwordReset({
          email: this.$route.query.email,
          password: this.password,
          token: this.$route.query.token,
        })

        this.$router.push('/user/sign-in/login')
      } catch (e) {
        if (e instanceof HttpError) {
          this.setResetPasswordErrors(e)
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
