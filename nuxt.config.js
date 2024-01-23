import globalHead from './application/global-head'
import getGlobalModules from './application/global-modules'

/* eslint-disable global-require */
export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    ...globalHead,
  },

  // Для теста на локалке в прод режиме
  // server: {
  //   port: 3000,
  //   host: '0.0.0.0',
  // },

  loading: false,

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['@/assets/css/tailwind.css'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/api-plugin.js', ssr: true },
    { src: '~/plugins/auth.js', mode: 'server' },
    { src: '~/plugins/vee-validate-settings', ssr: false },
    { src: '~/plugins/vuejs-paginate', ssr: false },
    { src: '~/plugins/vue-tags-input', ssr: false },
    { src: '~/plugins/resize-observer.js', ssr: false },
    { src: '~/plugins/vue-tooltip.js', ssr: false },
    { src: '~/plugins/ability.js', ssr: true },
    { src: '~/plugins/chatra.js', ssr: false },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: false,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: ['@nuxtjs/eslint-module', '@nuxtjs/tailwindcss', '@nuxtjs/composition-api/module'],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: getGlobalModules(process.env.APP_ENV),

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    vendor: ['@johmun/vue-tags-input'],
  },

  publicRuntimeConfig: {
    apiHost: process.env.API_HOST,
    yandexMetrika: {
      id: '92708336',
      webvisor: true,
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
    },
  },

  router: {
    parseQuery(q) {
      return require('qs').parse(q)
    },

    stringifyQuery(q) {
      return require('qs').stringify(q, { addQueryPrefix: true, encodeValuesOnly: true })
    },
  },
}
