import { extend, setInteractionMode } from 'vee-validate'
import { email, is, min, max, required, integer, length, alpha } from 'vee-validate/dist/rules.umd'
import { userPhoneRegExp } from '~/domain/user'

export function setupValidation() {
  setInteractionMode('lazy')
  extend('required', {
    ...required,
    message: 'Необходимо заполнить поле «{_field_}»',
  })

  extend('alpha', {
    ...alpha,
    message: 'Поле «{_field_}» может содержать только буквенные символы',
  })

  extend('max', {
    validate(value, { max }) {
      return value.length <= max;
    },
    message: 'Поле «{_field_}» не должно содержать больше {max} символов',
    params: ['max'],
  });

  extend('max_length_base', {
    validate: (value) => max.validate(value, { length: 255 }),
    message: 'Поле «{_field_}» не должно содержать больше 255 символов',
  });

  extend('email', {
    ...email,
    message: 'Введите почтовый адрес формата example@pochta.ru',
  })

  extend('min6', {
    // чтобы не передавать параметр в темплейте как в доке, что не плохо, просто показываю варианты
    validate: (value) => min.validate(value, { length: 6 }),
    message: 'Введите минимум 6 символов',
  })

  extend('minmax', {
    validate(value, { min, max }) {
      return value.length >= min && value.length <= max;
    },
    params: ['min', 'max'],
    message: 'Пароль должен содержать',
  });

  extend('length', {
    ...length,
    message: 'Поле «{_field_}» должно содержать {length} символов',
  });

  extend('password-min', {
    validate(value, args) {
      if(value.length >= args.length) {
        return true
      }

      return `Пароль должен содержать не менее ${args.length} символов`
    },
    params: ['length'],
  });

  extend('password-max', {
    validate(value, args) {
      if(value.length <= args.length) {
        return true
      }

      return `Пароль не должен содержать больше ${args.length} символов`
    },
    params: ['length'],
  });

  extend('phone', {
    validate: (value) => userPhoneRegExp.test(value),
    message: 'Поле «{_field_}» должно быть вида +7 (###) ###-##-##',
  });

  extend('password', {
    validate: (value) => {
      return /\d/.test(value) && /[a-zA-z]/.test(value)
    },
    message: 'Минимальные требования к паролю: 8 символов, 1 буква, 1 цифра',
  })

  extend('equalField', {
    params: ['otherField'],
    validate(value, { otherField }) {
      return is.validate(value, { other: otherField })
    },
    message: 'Не совпадает с полем “{otherField}”',
  })

  extend('equalFieldPassword', {
    params: ['otherField'],
    validate(value, { otherField }) {
      return is.validate(value, { other: otherField })
    },
    message: 'Пароли не совпадают',
  })

  extend('integer', {
    ...integer,
    message: 'Неверный формат «{_field_}»',
  })
}
