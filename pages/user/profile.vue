<template>
  <main class="container sign-up">
    <section class="pb-10 pt-4 md:pb-16 md:pt-10 xl:pb-20 xl:pt-8">
      <h1 class="text-h1 mb-4 md:mb-8 xl:mb-12">Личные данные</h1>

      <SSpin
        v-if="isFetchingUser"
        class="block mx-auto w-20 h-20 md:w-28 md:h-28 xl:w-40 xl:h-40"
      />

      <form v-else @submit.prevent="onSubmitUserProfile">
        <ValidationObserver ref="profileForm" class="block mb-4">
          <!-- Персональные данные -->
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
                <SInput
                  v-model="userProfile.lastName"
                  placeholder="Ваша фамилия"
                  :failed="failed"
                />
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
                <SInput v-model="userProfile.firstName" placeholder="Ваше имя" :failed="failed" />
                <SErrorMessage>{{ errors[0] }}</SErrorMessage>
              </label>
            </ValidationProvider>
            <ValidationProvider
              #default="{ errors, failed }"
              rules="max_length_base|alpha"
              class="block"
              name="Ваше отчество"
            >
              <label class="block">
                <SFieldLabel>Отчество</SFieldLabel>
                <SInput
                  v-model="userProfile.middleName"
                  :failed="failed"
                  placeholder="Ваше отчество"
                />
                <SErrorMessage>{{ errors[0] }}</SErrorMessage>
              </label>
            </ValidationProvider>
          </div>

          <!-- Безопасность -->
          <div class="max-w-lg mb-10 md:max-w-4xl md:mb-16 xl:mb-20">
            <h3 class="text-h3 mb-3 xl:mb-6">Безопасность</h3>
            <!-- Email -->
            <div class="mb-8 md:mb-10 xl:mb-14">
              <ValidationProvider class="block" name="email">
                <SFieldLabel>E-mail</SFieldLabel>
                <div class="md:flex items-center">
                  <SInput
                    v-model="email"
                    class="w-full max-w-sm mb-3 md:mb-0 md:mr-5 xl:max-w-md"
                    placeholder="email@example.ru"
                    disabled
                  />
                  <span class="text-comment text-main-marzipan"
                    >Для смены адреса электронной почты обратитесь в&nbsp;отдел продаж</span
                  >
                </div>
              </ValidationProvider>
            </div>
            <!-- Пароли -->
            <div>
              <AppChangePasswordForm />
            </div>
          </div>

          <!-- Данные юридического лица -->
          <div class="max-w-5xl mb-10 md:mb-16 xl:mb-20">
            <h3 class="text-h3 mb-3 xl:mb-6">Данные юридического лица</h3>
            <!-- City -->
            <ValidationProvider
              #default="{ errors, failed }"
              class="block max-w-sm mb-5 md:mb-6 xl:mb-8 xl:max-w-md"
              rules="required|max_length_base"
              name="Город"
            >
              <label class="block">
                <SFieldLabel required>Город</SFieldLabel>
                <SInput
                  v-model="userProfile.city"
                  placeholder="Например, Москва"
                  :failed="failed"
                />
                <SErrorMessage>{{ errors[0] }}</SErrorMessage>
              </label>
            </ValidationProvider>
            <!-- Organization -->
            <ValidationProvider
              #default="{ errors, failed }"
              class="block max-w-md mb-5 md:mb-6 xl:mb-8 xl:max-w-lg"
              rules="max_length_base"
              name="Название организации"
            >
              <label class="block">
                <SFieldLabel>Название организации</SFieldLabel>
                <SInput
                  v-model="userProfile.organization"
                  placeholder="Например, ООО «ЮвелирСервис»"
                  :failed="failed"
                />
                <SErrorMessage>{{ errors[0] }}</SErrorMessage>
              </label>
            </ValidationProvider>
            <!-- Inn -->
            <div class="mb-5 md:mb-6 xl:mb-8">
              <ValidationProvider class="flex-grow" name="ИНН">
                <SFieldLabel>ИНН</SFieldLabel>
                <div class="md:flex md:items-center">
                  <SInput
                    v-model="userProfile.inn"
                    class="max-w-xs w-full mb-3 md:mb-0 md:mr-5"
                    placeholder="Введите ИНН"
                    :disabled="$ability.cannot('update', $options.ABILITY_SUBJECTS.USER_PROFILE, 'inn')"
                  />
                  <span class="text-comment text-main-marzipan"
                    >Для смены ИНН обратитесь в&nbsp;отдел продаж</span
                  >
                </div>
              </ValidationProvider>
            </div>
            <!-- Registration number -->
            <ValidationProvider
              #default="{ errors, failed }"
              rules="max_length_base"
              class="block max-w-md mb-5 md:mb-6 xl:mb-8 xl:max-w-lg"
              name="Номер свидетельства постановки на спецучёт"
            >
              <label class="block cursor-pointer">
                <SFieldLabel>Номер свидетельства постановки на спецучёт</SFieldLabel>
                <SInput
                  v-model="userProfile.registrationNumber"
                  :failed="failed"
                  placeholder="Введите номер свидетельства"
                />
                <SErrorMessage>{{ errors[0] }}</SErrorMessage>
              </label>
            </ValidationProvider>
            <!-- phone -->
            <ValidationProvider
              #default="{ errors, failed }"
              class="block max-w-xs mb-5 md:mb-6 xl:mb-8"
              :rules="
                $ability.can('update', $options.ABILITY_SUBJECTS.USER) ? 'required|phone' : ''
              "
              name="Телефон"
            >
              <label class="block">
                <SFieldLabel required>Телефон</SFieldLabel>
                <SInput
                  v-model="phone"
                  v-mask="'+7 (###) ###-##-##'"
                  placeholder="+7 (___) ___-__-__"
                  :failed="failed"
                  :disabled="$ability.cannot('update', $options.ABILITY_SUBJECTS.USER)"
                />

                <SErrorMessage>{{ errors[0] }}</SErrorMessage>
              </label>
            </ValidationProvider>
          </div>

          <!-- Настройки каталога -->
          <div
            class="
              mb-6
              bg-main-souffle
              pt-5
              pb-6
              px-5
              -mx-5
              md:mb-8
              xl:pt-8 xl:pb-8 xl:-mx-10 xl:px-10
            "
          >
            <h3 class="text-h3 mb-2 md:mb-5 xl:mb-6">Настройки каталога</h3>
            <SFieldLabel>Тип цены по умолчанию</SFieldLabel>
            <div class="md:flex md:items-center">
              <div class="max-w-xs mb-3 md:mb-0 md:mr-5">
                <SSelect v-model="userProfile.priceType" :initial-options="priceTypes" />
              </div>
              <span class="text-comment text-main-marzipan max-w-xs"
                >Этот тип цены будет по умолчанию отображаться у всех товаров на сайте EFREMOV</span
              >
            </div>
          </div>

          <div>
            <ValidationProvider class="block" vid="isAgreeToReceive">
              <label class="flex text-comment cursor-pointer select-none">
                <SCheckbox v-model="userProfile.isAgreeToReceive" class="flex-shrink-0 mr-3" />
                <span
                  >Согласие на получение информационных и рекламных сообщений от бренда
                  EFREMOV</span
                >
              </label>
            </ValidationProvider>
          </div>
        </ValidationObserver>

        <SButton type="submit" :disabled="isUpdatingUser" class="flex mb-3 md:mr-5 md:mb-0 xl:mr-6">
          <IconSave class="w-4 h-4 mr-2 xl:w-5 xl:h-5 xl:mr-2.5" />
          <span>Сохранить информацию</span>
        </SButton>
      </form>
    </section>
  </main>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { mask } from 'vue-the-mask'
import { mapState } from 'vuex'
import {
  SFieldLabel,
  SErrorMessage,
  SButton,
  SCheckbox,
  SInput,
  SSelect,
  SSpin,
} from '~/components/ui-system'
import { IconSave } from '~/components/feather-icons'
import AppChangePasswordForm from '~/components/common/app-change-password-form.vue'
import { PRICE_TYPES } from '~/domain/carts'
import userProfileAdapter from '~/services/user-profile-adapter'
import { parseNumbersFromString } from '~/utils'
import { ABILITY_SUBJECTS } from '~/domain/user-ability'
import usersAdapter from "~/services/users-adapter";

export default {
  components: {
    AppChangePasswordForm,
    SFieldLabel,
    SErrorMessage,
    IconSave,
    SButton,
    SInput,
    ValidationProvider,
    ValidationObserver,
    SCheckbox,
    SSelect,
    SSpin,
  },

  directives: { mask },
  ABILITY_SUBJECTS,
  middleware: ['redirect-not-logged-in'],

  data() {
    return {
      userProfile: {
        lastName: '',
        firstName: '',
        middleName: '',
        password: '',
        city: '',
        inn: '',
        organization: '',
        registrationNumber: '',
        isAgreeToReceive: true,
        priceType: PRICE_TYPES.main.id,
      },
      email: '',
      phone: '',
      isFetchingUser: false,
      isUpdatingUser: false,
      isPrivacyAccepted: true,
      priceTypes: Object.values(PRICE_TYPES),
    }
  },

  async fetch() {
    try {
      this.isFetchingUser = true
      this.email = this.userData.email
      this.phone = this.userData.phone
      const { data } = await userProfileAdapter().getUserProfiles({
        filter: { userId: this.userData.id },
      })

      this.userProfile = data[0]
    } catch (e) {
      console.error(e)
    } finally {
      this.isFetchingUser = false
    }
  },

  computed: {
    ...mapState({
      userData: (state) => state.user.userData,
    }),
  },

  methods: {
    async onSubmitUserProfile() {
      try {
        const isValid = await this.$refs.profileForm.validate()
        if (!isValid) return
        this.isUpdatingUser = true

        const canUpdateUser = this.$ability.can('manage', this.$options.ABILITY_SUBJECTS.USER)

        if (canUpdateUser) {
          const [userProfile, user] = await Promise.all([
            userProfileAdapter().updateUserProfile(this.userProfile.id, {
              ...this.userProfile,
            }),
            usersAdapter().updateUser(this.userData.id, {
              id: this.userData.id,
              phone: parseNumbersFromString(this.phone),
            }),
          ])
          this.$store.commit('user/SET_USER_DATA', {...user, userProfile})
          return
        }

       const userProfile = await userProfileAdapter().updateUserProfile(this.userProfile.id, {
          ...this.userProfile, inn: undefined
        })

        this.$store.commit('user/SET_USER_PROFILE', userProfile)
      } catch (e) {
        console.error(e)
      } finally {
        this.isUpdatingUser = false
      }
    },
  },
}
</script>
