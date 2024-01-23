import { APP_ENV_MAP } from '../utils/constants'

/**
 * Возвращает набор nuxt модулей
 * @param {string} appEnv - переменная окружения
 * @returns {array}
 */
export default function getGlobalModules(appEnv) {
  if (appEnv === APP_ENV_MAP.PROD) {
    return ['@nuxtjs/axios', 'portal-vue/nuxt', '@nuxtjs/yandex-metrika']
  }
  return ['@nuxtjs/axios', 'portal-vue/nuxt']
}
