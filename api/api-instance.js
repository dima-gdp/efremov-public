import setupAxios from './setup-axios'
import ApiCategories from './endpoints/api-categories'
import ApiUsers from './endpoints/api-users'
import ApiAuth from './endpoints/api-auth'
import ApiProductGroups from './endpoints/api-product-groups'
import ApiProductFiles from './endpoints/api-product-files'
import ApiProductFilters from './endpoints/api-product-filters'
import ApiOffers from './endpoints/api-offers'
import ApiProducts from './endpoints/api-products'
import ApiOfferItemsFilters from './endpoints/api-offer-items-filters'
import ApiOfferItems from './endpoints/api-offer-items'
import ApiCollectionFiles from './endpoints/api-collection-files'
import ApiVersionFilters from './endpoints/api-version-filters'
import ApiCarts from './endpoints/api-carts'
import InfrastructureError from '~/domain/errors/infrastructure-error'
import ApiCartItems from '~/api/endpoints/api-cart-items'
import ApiCartProducts from '~/api/endpoints/api-cart-products'
import ApiCartMetalInsertGroups from '~/api/endpoints/api-cart-metal-insert-groups'
import ApiMetalInsertGroups from '~/api/endpoints/api-metal-insert-groups'
import ApiRegistrations from '~/api/endpoints/api-registrations'
import ApiCartProductSizes from '~/api/endpoints/api-cart-product-sizes'
import ApiUserProfiles from '~/api/endpoints/api-user-profiles'
import ApiChangePasswords from '~/api/endpoints/api-change-passwords'
import ApiOrders from '~/api/endpoints/api-orders'
import ApiCartMains from '~/api/endpoints/api-cart-mains'
import ApiCartProductChanges from '~/api/endpoints/api-cart-product-changes'
import ApiPasswordResets from '~/api/endpoints/api-password-resets'
import ApiOrderProducts from '~/api/endpoints/api-order-products'
import ApiCartFillingByOrders from '~/api/endpoints/api-cart-filling-by-orders'
import ApiEmailVerifications from '~/api/endpoints/api-email-verifications'
import ApiPasswordRecoveries from '~/api/endpoints/api-password-recoveries'
import ApiFavorites from '~/api/endpoints/api-favorites'
import ApiProductSearches from '~/api/endpoints/api-product-searches'

/**
 * @type {{
 *  instance: NuxtAxiosInstance,
 *  users: ApiUsers,
 *  auth: ApiAuth,
 *  catalogs: ApiCategories,
 *  productGroups: ApiProductGroups,
 *  productFilters: ApiProductFilters,
 *  offers: ApiOffers,
 *  products: ApiProducts,
 *  productFiles: ApiProductFiles,
 *  offerItemsFilters: ApiOfferItemsFilters,
 *  collectionFiles: ApiCollectionFiles,
 *  offerItems: ApiOfferItems,
 *  versionFilters: ApiVersionFilters,
 *  carts: ApiCarts,
 *  cartItems: ApiCartItems,
 *  cartProducts: ApiCartProducts,
 *  cartMetalInsertGroups: ApiCartMetalInsertGroups,
 *  metalInsertGroups: ApiMetalInsertGroups,
 *  registrations: ApiRegistrations,
 *  cartProductSizes: ApiCartProductSizes,
 *  userProfiles: ApiUserProfiles,
 *  userProfiles: ApiChangePasswords,
 *  orders: ApiOrders,
 *  cartMains: ApiCartMains,
 *  cartProductChanges: ApiCartProductChanges,
 *  passwordResets: ApiPasswordResets,
 *  orderProducts: ApiOrderProducts,
 *  cartFillingByOrders: ApiCartFillingByOrders,
 *  emailVerifications: ApiEmailVerifications,
 *  passwordRecoveries: ApiPasswordRecoveries,
 *  favorites: ApiFavorites,
 *  productSearches: ApiProductSearches,
 * }}
 */
let apiInstance

/**
 *
 * @param {Context} ctx
 */
export function createApiInstance(ctx) {
  if (apiInstance) {
    return apiInstance
  }

  const baseURL = `${ctx.$config.apiHost}/api/v1`
  // Постучаться на дев
  // const baseURL = 'https://ef.s256.dev/api/v1'

  const newAxiosInstance = ctx.$axios.create({
    baseURL,
    headers: {
      common: {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      },
    },
  })

  // Походу ApiInstance на клиенте будет заново создаваться
  if (ctx.store.state.user.userToken) {
    newAxiosInstance.setToken(ctx.store.state.user.userToken, 'Bearer')
  }

  setupAxios(newAxiosInstance)

  // Временно воткнул instance в ключ объекта, лучше бы разделить
  apiInstance = {
    instance: newAxiosInstance,
    users: new ApiUsers(newAxiosInstance),
    auth: new ApiAuth(newAxiosInstance),
    catalogs: new ApiCategories(newAxiosInstance),
    productGroups: new ApiProductGroups(newAxiosInstance),
    productFilters: new ApiProductFilters(newAxiosInstance),
    offers: new ApiOffers(newAxiosInstance),
    products: new ApiProducts(newAxiosInstance),
    productFiles: new ApiProductFiles(newAxiosInstance),
    offerItemsFilters: new ApiOfferItemsFilters(newAxiosInstance),
    collectionFiles: new ApiCollectionFiles(newAxiosInstance),
    offerItems: new ApiOfferItems(newAxiosInstance),
    versionFilters: new ApiVersionFilters(newAxiosInstance),
    carts: new ApiCarts(newAxiosInstance),
    cartItems: new ApiCartItems(newAxiosInstance),
    cartProducts: new ApiCartProducts(newAxiosInstance),
    cartMetalInsertGroups: new ApiCartMetalInsertGroups(newAxiosInstance),
    metalInsertGroups: new ApiMetalInsertGroups(newAxiosInstance),
    registrations: new ApiRegistrations(newAxiosInstance),
    cartProductSizes: new ApiCartProductSizes(newAxiosInstance),
    userProfiles: new ApiUserProfiles(newAxiosInstance),
    changePasswords: new ApiChangePasswords(newAxiosInstance),
    orders: new ApiOrders(newAxiosInstance),
    cartMains: new ApiCartMains(newAxiosInstance),
    cartProductChanges: new ApiCartProductChanges(newAxiosInstance),
    passwordResets: new ApiPasswordResets(newAxiosInstance),
    orderProducts: new ApiOrderProducts(newAxiosInstance),
    cartFillingByOrders: new ApiCartFillingByOrders(newAxiosInstance),
    emailVerifications: new ApiEmailVerifications(newAxiosInstance),
    passwordRecoveries: new ApiPasswordRecoveries(newAxiosInstance),
    favorites: new ApiFavorites(newAxiosInstance),
    productSearches: new ApiProductSearches(newAxiosInstance),
  }

  return apiInstance
}

export function getExistingApiInstance() {
  if (!apiInstance) {
    throw new InfrastructureError('[api-instance]: инстанс еще не создан!')
  }
  return apiInstance
}
