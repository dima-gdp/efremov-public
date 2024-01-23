import { defineAbility } from '@casl/ability'
import { getUserAbility } from '~/domain/user-ability'

export default async function ({ store }, inject) {
  const abilityInstance = defineAbility(() => {})
  const isLoggedIn = store.state.user.isLoggedIn

  if (isLoggedIn) {
    const userRoles = getUserAbility(store.state.user.userData.roles)
    abilityInstance.update(userRoles)
  }

  inject('ability', abilityInstance)
}
