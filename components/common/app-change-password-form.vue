<template>
  <div>
    <label class="block max-w-sm mb-5 md:mb-6 xl:mb-7 xl:max-w-md">
      <SFieldLabel>Старый пароль</SFieldLabel>
      <SInput
        v-model.trim="form.oldPassword.value"
        type="password"
        autocomplete
        placeholder="Введите пароль"
        :failed="!form.oldPassword.valid"
      />
      <SErrorMessage v-if="!form.oldPassword.valid">{{ form.oldPassword.error }}</SErrorMessage>
    </label>

    <label class="block mb-5 md:mb-6 xl:mb-7">
      <SFieldLabel>Новый пароль</SFieldLabel>
      <div class="md:flex md:items-center">
        <SInput
          v-model.trim="form.newPassword.value"
          class="w-full max-w-sm mb-3 md:mb-0 md:mr-5 xl:max-w-md"
          type="password"
          autocomplete
          placeholder="Введите новый пароль"
          :failed="!form.newPassword.valid"
        />
        <SErrorMessage v-if="!form.newPassword.valid">{{ form.newPassword.error }}</SErrorMessage>
        <span v-else class="block text-comment text-main-marzipan"
          >Длина пароля от 8 символов, минимум 1&nbsp;буква и 1&nbsp;цифра</span
        >
      </div>
    </label>

    <label class="block max-w-sm mb-5 md:mb-6 xl:max-w-md xl:mb-8">
      <SFieldLabel>Новый пароль ещё раз</SFieldLabel>
      <SInput
        v-model.trim="form.duplicatePassword.value"
        type="password"
        autocomplete
        placeholder="Повторно введите новый пароль"
        :failed="!form.duplicatePassword.valid"
      />
      <SErrorMessage v-if="!form.duplicatePassword.valid">{{
        form.duplicatePassword.error
      }}</SErrorMessage>
    </label>

    <div class="md:flex md:items-center">
      <SButton
        type="button"
        :disabled="isSubmitBtnDisabled"
        class="flex-shrink-0 mb-4 md:mr-5 md:mb-0 xl:mr-6"
        @click.native="onSubmit"
      >
        <span>Изменить пароль</span>
      </SButton>

      <div class="relative w-full h-10">
        <transition name="fade">
          <div
            v-if="isPasswordChanged"
            class="
              absolute
              top-0
              left-0
              flex
              items-center
              text-comment text-status-success
              md:h-full
            "
          >
            <IconCheckCircle class="w-4 h-4 mr-2 xl:w-5 xl:h-5" />
            <span>Пароль успешно изменён</span>
          </div>

          <span v-else class="absolute top-0 left-0 text-comment text-main-marzipan md:max-w-sm"
            >Для смены пароля заполните все три поля со старым и&nbsp;новым паролем, и нажмите
            кнопку «Изменить пароль»</span
          >
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import { validate } from 'vee-validate'
import SInput from '~/components/ui-system/s-input.vue'
import SErrorMessage from '~/components/ui-system/s-error-message.vue'
import SFieldLabel from '~/components/ui-system/s-field-label.vue'
import { SButton } from '~/components/ui-system'
import { IconCheckCircle } from '~/components/feather-icons'
import usersAdapter from '~/services/users-adapter'
import HttpError from '~/domain/errors/http-error'
import { getParsedErrorsByPointer } from '~/domain/errors'

export default {
  components: {
    IconCheckCircle,
    SFieldLabel,
    SErrorMessage,
    SInput,
    SButton,
  },

  data() {
    return {
      form: {
        oldPassword: {
          value: '',
          valid: true,
          error: '',
        },
        newPassword: {
          value: '',
          valid: true,
          error: '',
        },
        duplicatePassword: {
          value: '',
          valid: true,
          error: '',
        },
      },
      isPasswordChanged: false,
      isLoading: false,
    }
  },

  computed: {
    isSubmitBtnDisabled() {
      const hasEmptyField = Object.values(this.form).some((field) => !field.value)
      return this.isLoading || hasEmptyField
    },
  },

  methods: {
    async onSubmit() {
      try {
        if (this.isLoading) return
        const isValid = await this.validateForm()
        if (!isValid) return

        this.isLoading = true
        await usersAdapter().changePassword({
          password: this.form.oldPassword.value,
          newPassword: this.form.newPassword.value,
        })
        this.onPasswordChanged()
        this.form = Object.fromEntries(
          Object.entries(this.form).map(([key]) => [key, { value: '', valid: true, error: '' }]),
        )
      } catch (e) {
        if (e instanceof HttpError) {
          this.onChangePasswordErrors(e.errorsList)
        } else {
          console.error(e)
        }
      } finally {
        this.isLoading = false
      }
    },

    async validateForm() {
      const validatePasswords = await Promise.all([
        validate(this.form.oldPassword.value, 'required', {
          name: 'Старый пароль',
        }),
        validate(this.form.newPassword.value, 'required|password|password-min:8|password-max:255', {
          name: 'Новый пароль',
        }),
        validate(this.form.duplicatePassword.value, 'required|equalField:@newPassword', {
          name: 'Новый пароль ещё раз',
          values: { newPassword: this.form.newPassword.value },
          names: { newPassword: 'Новый пароль' },
        }),
      ])

      this.form = Object.fromEntries(
        Object.entries(this.form).map(([key, { value }], idx) => [
          key,
          { value, valid: validatePasswords[idx].valid, error: validatePasswords[idx].errors[0] },
        ]),
      )

      const isValid = validatePasswords.every((field) => field.valid)
      return isValid
    },

    onChangePasswordErrors(errorsList) {
      const parsedErrors = getParsedErrorsByPointer(errorsList)
      if (parsedErrors.password) {
        this.form.oldPassword.valid = false
        this.form.oldPassword.error = parsedErrors.password[0]
      }
    },

    onPasswordChanged() {
      this.isPasswordChanged = true
      setTimeout(() => {
        this.isPasswordChanged = false
      }, 5000)
    },
  },
}
</script>
