<template>
  <main class="container sign-up">
    <section class="pb-10 pt-4 md:pb-16 md:pt-8 xl:pb-20">
      <h1 class="text-h1 mb-3 md:mb-4 xl:mb-8">Регистрация</h1>
      <div class="flex mb-6 px-3 py-3 md:px-4 md:mb-10 xl:mb-12 bg-main-souffle sign-up__alert">
        <IconAlertTriangle class="flex-grow flex-shrink-0 w-5 h-5 mr-2.5 text-main-waffle" />
        <span class="mr-1.5 text-comment text-main-marzipan">
          Регистрация в оптовом каталоге EFREMOV доступна только юридическим лицам.
        </span>
      </div>

      <form @submit.prevent="signUp">
        <ValidationObserver ref="signUpForm" class="block mb-5 md:mb-6">
          <div class="max-w-xs md:max-w-lg mb-10 md:mb-16 xl:mb-20">
            <h3 class="text-h3 mb-3 xl:mb-6">Персональные данные</h3>
            <ValidationProvider
              #default="{ errors, failed }"
              class="block mb-5 md:mb-6 xl:mb-8"
              rules="required|max_length_base|alpha"
              name="Фамилия"
            >
              <label class="block">
                <SFieldLabel required>Фамилия</SFieldLabel>
                <SInput v-model="user.lastName" placeholder="Ваша фамилия" :failed="failed" />
                <SErrorMessage>{{ errors[0] }}</SErrorMessage>
              </label>
            </ValidationProvider>
            <ValidationProvider
              #default="{ errors, failed }"
              class="block mb-5 md:mb-6 xl:mb-8"
              rules="required|max_length_base|alpha"
              name="Имя"
            >
              <label class="block">
                <SFieldLabel required>Имя</SFieldLabel>
                <SInput v-model="user.firstName" placeholder="Ваше имя" :failed="failed" />
                <SErrorMessage>{{ errors[0] }}</SErrorMessage>
              </label>
            </ValidationProvider>
            <ValidationProvider
              class="block"
              #default="{ errors, failed }"
              rules="max_length_base|alpha"
              name="Отчество"
            >
              <label class="block">
                <SFieldLabel>Отчество</SFieldLabel>
                <SInput v-model="user.middleName" placeholder="Ваше отчество" :failed="failed" />
                <SErrorMessage>{{ errors[0] }}</SErrorMessage>
              </label>
            </ValidationProvider>
          </div>
          <div class="max-w-lg mb-10 md:max-w-4xl md:mb-16 xl:mb-20">
            <h3 class="text-h3 mb-3 xl:mb-6">Безопасность</h3>
            <div class="grid gap-y-5 md:grid-cols-2 md:gap-x-5 md:gap-y-6 xl:gap-y-8">
              <ValidationProvider
                #default="{ errors, failed }"
                class="block"
                rules="required|email|max_length_base"
                name="email"
              >
                <label class="block">
                  <SFieldLabel required>E-mail</SFieldLabel>
                  <SInput v-model="user.email" placeholder="email@example.ru" :failed="failed" />
                  <SErrorMessage>{{ errors[0] }}</SErrorMessage>
                </label>
              </ValidationProvider>
              <ValidationProvider
                #default="{ errors, failed }"
                class="block"
                rules="required|equalField:@email"
                name="Повторить E-mail"
              >
                <label class="block">
                  <SFieldLabel required>Повторить E-mail</SFieldLabel>
                  <SInput
                    v-model="duplicateEmail"
                    placeholder="email@example.ru"
                    :failed="failed"
                  />
                  <SErrorMessage>{{ errors[0] }}</SErrorMessage>
                </label>
              </ValidationProvider>
              <ValidationProvider
                #default="{ errors, failed }"
                class="block max-w-xs md:max-w-none"
                rules="required|password|password-min:8|password-max:255"
                name="Пароль"
              >
                <label>
                  <SFieldLabel required>Пароль</SFieldLabel>
                  <SInput
                    v-model.trim="user.password"
                    type="password"
                    autocomplete
                    placeholder="Введите пароль"
                    :failed="failed"
                  />
                  <SErrorMessage>{{ errors[0] }}</SErrorMessage>
                  <span v-show="!failed" class="block text-comment text-main-marzipan mt-3"
                    >Длина пароля от 8 символов, минимум 1&nbsp;буква и 1&nbsp;цифра</span
                  >
                </label>
              </ValidationProvider>
              <ValidationProvider
                #default="{ errors, failed }"
                class="block max-w-xs md:max-w-none"
                rules="required|equalField:@Пароль"
                name="Повторить пароль"
              >
                <label>
                  <SFieldLabel required>Повторить пароль</SFieldLabel>
                  <SInput
                    v-model.trim="duplicatePassword"
                    type="password"
                    autocomplete
                    placeholder="Пароль ещё раз"
                    :failed="failed"
                  />
                  <SErrorMessage>{{ errors[0] }}</SErrorMessage>
                </label>
              </ValidationProvider>
            </div>
          </div>
          <div class="max-w-5xl mb-8 md:mb-10">
            <h3 class="text-h3 mb-3 xl:mb-6">Данные юридического лица</h3>
            <ValidationProvider
              #default="{ errors, failed }"
              class="block max-w-sm mb-5 md:mb-6 xl:mb-8"
              rules="required|max_length_base"
              name="Город"
            >
              <label class="block">
                <SFieldLabel required>Город</SFieldLabel>
                <SInput v-model="user.city" placeholder="Например, Москва" :failed="failed" />
                <SErrorMessage>{{ errors[0] }}</SErrorMessage>
              </label>
            </ValidationProvider>
            <div class="flex flex-col md:flex-row mb-5 md:mb-6 xl:mb-8">
              <ValidationProvider
                #default="{ errors, failed }"
                class="flex-grow max-w-lg mb-5 md:mb-0 md:mr-5"
                rules="max_length_base"
                name="Название организации"
              >
                <label class="block">
                  <SFieldLabel>Название организации</SFieldLabel>
                  <SInput
                    v-model="user.organization"
                    placeholder="Например, ООО «ЮвелирСервис»"
                    :failed="failed"
                  />
                  <SErrorMessage>{{ errors[0] }}</SErrorMessage>
                </label>
              </ValidationProvider>
              <ValidationProvider
                #default="{ errors, failed }"
                class="max-w-xs flex-grow"
                rules="required|integer|max:14"
                name="ИНН"
              >
                <label class="block">
                  <SFieldLabel required>ИНН</SFieldLabel>
                  <SInput v-model="user.inn" placeholder="Введите ИНН" :failed="failed" />
                  <SErrorMessage>{{ errors[0] }}</SErrorMessage>
                </label>
              </ValidationProvider>
            </div>
            <ValidationProvider
              class="block max-w-lg mb-5 md:mb-6 xl:mb-8"
              #default="{ errors, failed }"
              rules="max_length_base"
              name="Номер свидетельства постановки на спецучёт"
            >
              <label class="block cursor-pointer">
                <SFieldLabel>Номер свидетельства постановки на спецучёт</SFieldLabel>
                <SInput
                  v-model="user.registrationNumber"
                  placeholder="Введите номер свидетельства"
                  :failed="failed"
                />
                <SErrorMessage>{{ errors[0] }}</SErrorMessage>
              </label>
            </ValidationProvider>
            <ValidationProvider
              #default="{ errors, failed }"
              class="block max-w-lg mb-5 md:mb-6 xl:mb-8"
              rules="required|phone"
              name="Телефон"
            >
              <label class="block">
                <SFieldLabel required>Телефон</SFieldLabel>
                <SInput
                  v-model="user.phone"
                  v-mask="'+7 (###) ###-##-##'"
                  placeholder="+7 (___) ___-__-__"
                  :failed="failed"
                />

                <SErrorMessage>{{ errors[0] }}</SErrorMessage>
              </label>
            </ValidationProvider>
          </div>
          <div>
            <ValidationProvider class="block mb-3" vid="isAgreeToReceive">
              <label class="flex text-comment cursor-pointer select-none">
                <SCheckBox v-model="user.isAgreeToReceive" class="flex-shrink-0 mr-3" />
                <span
                  >Согласие на получение информационных и рекламных сообщений от бренда
                  EFREMOV</span
                >
              </label>
            </ValidationProvider>
            <ValidationProvider
              class="block"
              rules="required"
              name="Пароль"
              vid="isPrivacyAccepted"
            >
              <label class="flex text-comment cursor-pointer select-none">
                <SCheckBox v-model="isPrivacyAccepted" class="flex-shrink-0 mr-3" />
                <span>Согласие на обработку персональных данных</span>
              </label>
            </ValidationProvider>
          </div>
        </ValidationObserver>
        <SButton
          type="submit"
          :disabled="isSubmitBtnDisabled || isLoading"
          class="flex mb-3 md:mr-5 md:mb-0 xl:mr-6"
        >
          <IconCheckCircle class="w-4 h-4 mr-2 xl:w-5 xl:h-5 xl:mr-2.5" />
          <span>Зарегистрироваться</span>
        </SButton>
      </form>
    </section>
  </main>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { mask } from 'vue-the-mask'
import SInput from '~/components/ui-system/s-input.vue'
import SCheckBox from '~/components/ui-system/s-checkbox/s-checkbox.vue'
import SButton from '~/components/ui-system/s-button/s-button.vue'
import SErrorMessage from '~/components/ui-system/s-error-message.vue'
import SFieldLabel from '~/components/ui-system/s-field-label.vue'
import { IconAlertTriangle, IconCheckCircle } from '~/components/feather-icons'
import usersAdapter from '~/services/users-adapter'
import { parseNumbersFromString } from '~/utils'
import HttpError from '~/domain/errors/http-error'
import { getParsedErrorsByPointer } from '~/domain/errors'

export default {
  components: {
    IconAlertTriangle,
    SFieldLabel,
    SErrorMessage,
    IconCheckCircle,
    SButton,
    SInput,
    ValidationProvider,
    ValidationObserver,
    SCheckBox,
  },

  directives: { mask },

  middleware: ['redirect-already-logged-in'],

  data() {
    return {
      user: {
        lastName: '',
        firstName: '',
        middleName: '',
        email: '',
        password: '',
        city: '',
        organization: '',
        inn: '',
        registrationNumber: '',
        phone: '',
        isAgreeToReceive: true,
      },
      isLoading: false,
      duplicateEmail: '',
      duplicatePassword: '',
      isPrivacyAccepted: true,
    }
  },

  computed: {
    isSubmitBtnDisabled() {
      return !this.isPrivacyAccepted
    },
  },

  methods: {
    async signUp() {
      try {
        const isFormValid = await this.$refs.signUpForm.validate()
        if (!isFormValid) return
        this.isLoading = true
        await usersAdapter().createUser({
          ...this.user,
          phone: parseNumbersFromString(this.user.phone),
        })
        this.$router.push('/user/sign-in/login?successRegistration=true')
      } catch (e) {
        if (e instanceof HttpError) {
          this.onRegistrationErrors(e.errorsList)
        } else {
          console.error(e)
        }
      } finally {
        this.isLoading = false
      }
    },

    onRegistrationErrors(errorsList) {
      if (errorsList?.length) {
        const parsedErrors = getParsedErrorsByPointer(errorsList)
        this.$refs.signUpForm.setErrors(parsedErrors)
      }
    },
  },
}
</script>

<style lang="scss">
.sign-up {
  &__alert {
    max-width: 579px;

    @media (min-width: theme('screens.md')) {
      max-width: 607px;
    }
  }
}
</style>
