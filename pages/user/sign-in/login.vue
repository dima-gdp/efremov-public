<template>
  <main class="container">
    <section class="pb-10 pt-4 md:pb-16 md:pt-8 xl:pb-20">
      <h1 class="text-h1 mb-3 md:mb-3.5">Авторизация</h1>
      <div class="inline-flex items-center mb-6 py-3 pl-3 pr-6 md:pl-3.5 bg-main-souffle">
        <IconHelpCircle class="w-5 h-5 mr-2.5 text-main-waffle" />
        <span class="mr-1.5 text-comment text-main-marzipan">Нет логина и пароля?</span>
        <nuxt-link
          to="/user/sign-up"
          class="text-comment text-main-chocolate hover:text-main-waffle transition"
        >
          <span class="hidden md:inline">Перейти к регистрации</span>
          <span class="md:hidden">Регистрация</span>
        </nuxt-link>
      </div>

      <form class="max-w-lg" @submit.prevent="login">
        <ValidationObserver ref="loginForm" class="block mb-6 md:mb-8 xl:mb-6">
          <ValidationProvider
            #default="{ errors, failed }"
            class="block mb-5 md:mb-6 xl:mb-7"
            rules="required|email"
            vid="login"
            name="Электронная почта"
          >
            <label>
              <SFieldLabel required>Электронная почта</SFieldLabel>
              <SInput v-model="email" placeholder="email@example.ru" :failed="failed" />
              <SErrorMessage>{{ errors[0] }}</SErrorMessage>
            </label>
          </ValidationProvider>
          <ValidationProvider
            #default="{ errors, failed }"
            class="block"
            rules="required|password-min:8|password-max:255"
            vid="password"
            name="Пароль"
          >
            <label>
              <SFieldLabel required>Пароль</SFieldLabel>
              <SInput
                v-model.trim="password"
                type="password"
                autocomplete
                placeholder="********"
                :failed="failed"
              />
              <SErrorMessage>{{ errors[0] }}</SErrorMessage>
            </label>
          </ValidationProvider>
        </ValidationObserver>

        <div class="md:flex md:items-center">
          <SButton type="submit" class="flex mb-3 md:mr-5 md:mb-0 xl:mr-6">
            <IconArrowRight class="w-4 h-4 mr-2 xl:w-5 xl:h-5 xl:mr-2.5" />
            <span>Авторизоваться</span>
          </SButton>
          <nuxt-link
            to="/user/sign-in/recovery-password"
            class="text-main hover:text-main-waffle transition"
            >Забыли пароль?</nuxt-link
          >
        </div>
      </form>

      <SDialog
        v-model="isSuccessModalShown"
        class="flex justify-center px-5 py-10 md:px-10"
        lock-scroll
      >
        <AppSuccessfulRegistration @close="closeSuccessModal" @click-auth="closeSuccessModal" />
      </SDialog>

      <SDialog v-model="isVerifiedModalVisible">
        <AppAccountVerified @close="isVerifiedModalVisible = false" />
      </SDialog>

      <SDialog v-model="isActivatedModalVisible">
        <AppAccountActivated @close="isActivatedModalVisible = false" />
      </SDialog>
    </section>
  </main>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import IconHelpCircle from '~/components/feather-icons/icon-help-circle.vue'
import SInput from '~/components/ui-system/s-input.vue'
import SButton from '~/components/ui-system/s-button/s-button.vue'
import IconArrowRight from '~/components/feather-icons/icon-arrow-right.vue'
import SErrorMessage from '~/components/ui-system/s-error-message.vue'
import SFieldLabel from '~/components/ui-system/s-field-label.vue'
import Auth from '~/domain/auth'
import HttpError from '~/domain/errors/http-error'
import SDialog from '~/components/ui-system/s-dialog/s-dialog.vue'
import AppSuccessfulRegistration from '~/components/common/app-successful-registration.vue'
import AppAccountActivated from '~/components/common/app-account-activated.vue'
import { getParsedErrorsByPointer } from '~/domain/errors'
import useCarts from '~/application/useCarts'
import cartMainsAdapter from '~/services/cart-mains-adapter'
import { ABILITY_SUBJECTS, getUserAbility } from '~/domain/user-ability'
import AppAccountVerified from '~/components/common/app-account-verified/app-account-verified.vue'
import emailVerificationsAdapter from '~/services/email-verifications-adapter'
import useGlobalAlert from '~/application/global-alert'
import { ERROR_CODES } from '~/domain/errors/error-codes'

export default {
  components: {
    AppAccountVerified,
    SFieldLabel,
    SErrorMessage,
    IconArrowRight,
    SButton,
    SInput,
    IconHelpCircle,
    ValidationProvider,
    ValidationObserver,
    SDialog,
    AppAccountActivated,
    AppSuccessfulRegistration,
  },

  middleware: ['redirect-already-logged-in'],

  data() {
    return {
      email: '',
      password: '',
      isLoading: false,
      isSuccessModalShown: false,
      isVerifiedModalVisible: false,
      isActivatedModalVisible: false,
    }
  },

  async created() {
    if (this.$route.query.successRegistration) {
      this.isSuccessModalShown = true
      this.$router.replace({ ...this.$route, query: {} })
      return
    }

    if (this.$route.query.accountActivated) {
      this.isActivatedModalVisible = true
      this.$router.replace({ ...this.$route, query: {} })
    }
  },

  async mounted() {
    // Если вызывать этот запрос в created, то возвращается сразу 406 ошибка, как будто он вызывается дважды, но в консоли только 1 запрос с ошибкой
    if (this.$route.query.verifiedEmail) {
      await this.onVerifyEmail()
      this.$router.replace({ ...this.$route, query: {} })
    }
  },

  methods: {
    setLoginErrors(e) {
      if (e.status.toString() === ERROR_CODES.UNAUTHENTICATED) {
        useGlobalAlert().createAlert('Ваша учётная запись не активирована', 'error')
      }

      const loginErrors = e.errorsList
      if (loginErrors?.length) {
        const parsedErrors = getParsedErrorsByPointer(e.errorsList)
        this.$refs.loginForm.setErrors(parsedErrors)
      }
    },

    async login() {
      if (this.isLoading) {
        return
      }
      const isValid = await this.$refs.loginForm.validate()

      if (!isValid) {
        return
      }

      try {
        this.isLoading = true
        const authService = new Auth(this.$store)
        await authService.authClient(this.email, this.password)

        const userRoles = getUserAbility(this.$store.state.user.userData.roles)
        this.$ability.update(userRoles)

        if (this.$ability.can('manage', ABILITY_SUBJECTS.CATALOG_VIEW)) {
          await this.setCart(this.$store.state.user.userData.id)
          // TODO: Получаем избранное по разрешениям корзины, мб потом разобраться
          this.$store.dispatch('favorites/updateFavoriteProductsCount')
          this.$router.push({ name: 'catalog' })
          return
        }

        this.$router.push('/')
      } catch (e) {
        if (e instanceof HttpError) {
          this.setLoginErrors(e)
        } else {
          console.error(e)
        }
      } finally {
        this.isLoading = false
      }
    },

    async onVerifyEmail() {
      try {
        await emailVerificationsAdapter().verifiedEmail({
          token: this.$route.query.token,
          userId: this.$route.query.userId,
        })
        this.isVerifiedModalVisible = true
      } catch (e) {
        if (
          e.status.toString() === ERROR_CODES.AUTHORIZATION ||
          e.status.toString() === ERROR_CODES.VALIDATE_TOKEN ||
          e.status.toString() === ERROR_CODES.UNAUTHENTICATED
        ) {
          useGlobalAlert().createAlert('Ваша учётная запись не активирована', 'error')
        } else {
          console.error(e)
        }
      }
    },

    closeSuccessModal() {
      this.isSuccessModalShown = false
    },

    async setCart(userId) {
      const userCart = await useCarts().defineUserCart(userId)
      if (userCart) {
        this.$store.commit('cart/SET_CART', userCart)
      }

      const cartId = this.$store.state.cart.cart.id
      if (cartId) {
        const cartMainInfo = await cartMainsAdapter().getCartInfo({ cartId, isSelected: true })
        this.$store.commit('cart/SET_CART_MAINS', cartMainInfo)
      }
    },
  },
}
</script>
