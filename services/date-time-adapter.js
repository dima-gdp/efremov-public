import { DateTime, Settings } from 'luxon'
import { DEFAULT_DATE_FORMAT } from '~/utils/constants'

// Может не работать на ноде смотреть в доку или переехать на dayjs
Settings.defaultZone = 'Europe/Moscow'
Settings.defaultLocale = 'ru'

export function fromISOToString(iso, format = DEFAULT_DATE_FORMAT) {
  return DateTime.fromISO(iso).toFormat(format)
}
