import { nanoid } from 'nanoid'
import { reactive } from '@nuxtjs/composition-api'

/**
 * @typedef {('error'|'success')} AlertType
 */

/**
 * @typedef {(number|null)} AlertTime
 */

/**
 * @typedef {(string|number)} AlertMessage
 */

/**
 * @typedef {{
 *    isShown: boolean
 *    message: AlertMessage
 *    type: AlertType
 *    time: AlertTime
 *    id: string
 *    timer: number
 * }} AlertState
 */

const initialAlertState = []

const alertState = reactive(initialAlertState)

/**
 * Очередные эксперименты (по идее это часть Application State и должен использоваться Vuex)
 * а возможно вообще сторонняя библиотека
 */
export default function () {
  function findAlert(id) {
    const alert = alertState.find((alert) => alert.id === id)

    if (!alert) {
      throw new Error('useGlobalAlert: не найден id')
    }

    return alert
  }

  function hideAlert(id) {
    const alert = findAlert(id)

    if (alert.timer) {
      clearTimeout(alert.timer)
    }

    alert.isShown = false

    alertState.forEach((a) => {
      if (a.id === id) {
        const index = alertState.findIndex((item) => item.id === id)
        // перерисовывает весь массив после удаленного элемента,
        // возможно можно придумать что-нибудь производительнее
        alertState.splice(index, 1)
      }
    })
  }

  function createAlert(message, type = 'info', time = 3000) {
    if (!['string', 'number'].includes(typeof message)) {
      throw new TypeError('Неверный тип message')
    }
    if (!['error', 'success'].includes(type)) {
      throw new TypeError('Неверный тип type')
    }

    // typeof null === object
    if (typeof time !== 'number' && time !== null) {
      throw new TypeError('Неверный тип time')
    }

    const newId = nanoid()
    const newAlert = {
      message,
      type,
      time,
      id: newId,
      isShown: true,
      timer: time
        ? setTimeout(() => {
            hideAlert(newId)
          }, time)
        : 0,
    }
    alertState.push(newAlert)

    return newAlert
  }

  function getAlertState() {
    return alertState
  }

  return {
    createAlert,
    hideAlert,
    getAlertState,
  }
}
