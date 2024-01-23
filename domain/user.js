export const userPhoneRegExp = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/

/**
 * @typedef {{
 *  email: string,
 *  phone: string,
 *  roles: array,
 *  isActive: boolean,
 *  isConfirmed: boolean,
 *  emailVerifiedAt: boolean,
 *  phoneVerifiedAt: boolean,
 *  [userProfile]: object
 * }} User
 */

export const USER_ROLES = {
  USER: 'user',
  VERIFIED_USER: 'verified_user',
  EMPLOYEE: 'employee',
  CONTENT_MANAGER: 'content_manager',
  MANAGER: 'manager',
  ADMIN: 'admin',
}
