import { AbilityBuilder } from '@casl/ability'
import { USER_ROLES } from '~/domain/user'

export const ABILITY_SUBJECTS = {
  CATALOG_VIEW: 'catalog-view',
  USER_PROFILE: 'userProfile',
  USER: 'user',
}

const ROLES_CAN_CATALOG = [
  USER_ROLES.VERIFIED_USER,
  USER_ROLES.EMPLOYEE,
  USER_ROLES.CONTENT_MANAGER,
  USER_ROLES.MANAGER,
  USER_ROLES.ADMIN,
]

/**
 * Настраивает права для работы с каталогом
 * По умолчанию админу можно все
 */
function setAbilityCatalogView({ roles, abilityBuilder }) {
  const canCatalog = roles.some((role) => ROLES_CAN_CATALOG.includes(role))
  if (canCatalog) {
    abilityBuilder.can('manage', ABILITY_SUBJECTS.CATALOG_VIEW)
  }
}

/**
 * Настраивает права для работы с профилем пользователя
 */
function setAbilityUserProfile({ roles, abilityBuilder }) {
  const rolesCanUpdateInn = [USER_ROLES.MANAGER, USER_ROLES.ADMIN]
  abilityBuilder.can('manage', ABILITY_SUBJECTS.USER_PROFILE)

  if (roles.some((r) => !rolesCanUpdateInn.includes(r))) {
    abilityBuilder.cannot('update', ABILITY_SUBJECTS.USER_PROFILE, ['inn'])
  }
}

/**
 * Настраивает права для работы с юзером
 */
function setUserAbility({ roles, abilityBuilder }) {
  const rolesCanUpdateUser = [USER_ROLES.MANAGER, USER_ROLES.ADMIN]
  if (roles.some((r) => rolesCanUpdateUser.includes(r))) {
    abilityBuilder.can('manage', ABILITY_SUBJECTS.USER)
  }
}

/**
 * Возвращает массив абилок пользователя
 * @param {array} roles - роли пользователя
 * @returns {array}
 */
export function getUserAbility(roles) {
  const abilityBuilder = new AbilityBuilder()
  setAbilityCatalogView({ roles, abilityBuilder })
  setAbilityUserProfile({ roles, abilityBuilder })
  setUserAbility({ roles, abilityBuilder })

  return abilityBuilder.rules
}
