/** Если query параметры не совпадают c текущими, то используем router.push
 * @param {object} router - vue-router
 * @param {object} location - vue-router location
 * @return {Promise|undefined}
 */
export function notDuplicatedQueryPush(router, location) {
  if (JSON.stringify(router.currentRoute.query) !== JSON.stringify(location?.query)) {
    return new Promise((resolve, reject) => {
      router.push(
        location,
        (r) => resolve(r),
        (r) => reject(r),
      )
    })
  }
}

/** Обертка промисом над router.push
 * @param {object} router - vue-router
 * @param {object} location - vue-router location
 * @return {Promise}
 */
export function routerPush(router, location) {
  return new Promise((resolve, reject) => {
    router.push(
      location,
      (r) => resolve(r),
      (r) => reject(r),
    )
  })
}
