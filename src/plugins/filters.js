import Vue from 'vue'
import moment from 'moment'

const currency = (value, lang = 'br', decimals = 2) => {
  if (value === null || value === undefined || value === '') return
  if (lang === 'en')
    return value.toFixed(decimals).replace(/\d(?=(\d{3})+\.)/g, '$&,')

  return parseFloat(value)
    .toFixed(decimals)
    .replace(/\d(?=(\d{3})+\.)/g, '$&.')
    .replace(/.([^.]*)$/, ',$1')
}

const date = (
  value,
  format = 'YYYY-MM-DD',
  timezoneOffset = -3,
  placeholder = '',
) => {
  if (!value) return placeholder
  return moment(value).utcOffset(timezoneOffset).format(format)
}

const percent = (value, precision = 1, lang = 'br') => {
  if (!value) value = 0
  if (lang === 'en') return (value * 100).toFixed(precision)
  return (value * 100).toFixed(precision).replace('.', ',')
}

const variation = (value, precision = 2) =>
  `${value > 0 ? '+' : ''}${(value * 100)
    .toFixed(precision)
    .replace('.', ',')}%`

const formatted24hrs = (value, precision = 2) => {
  if (value === null || value === undefined) return
  return `${value > 0 ? '+' : ''}${value.toFixed(precision).replace('.', ',')}%`
}

const abrvNumber = (num, fixed = 1) => {
  if (num === null) {
    return null
  }

  if (num === 0) {
    return '0'
  }

  fixed = !fixed || fixed < 0 ? 0 : fixed
  const b = num.toPrecision(2).split('e')
  const k = b.length === 1 ? 0 : Math.floor(Math.min(b[1].slice(1), 14) / 3)
  const c =
    k < 1
      ? num.toFixed(0 + fixed)
      : (num / Math.pow(10, k * 3)).toFixed(1 + fixed)
  const d = c < 0 ? c : Math.abs(c)
  const e = d + ['', ' m', ' Mi', ' Bi', ' Tri'][k]

  return e.replace('.', ',')
}

const escapeHtml = (value, except = 'a|b|i|u|br') => {
  const regexStr = `(<\\/?(?:${except})[^>]*>)|<[^>]+>`
  const regex = new RegExp(regexStr, 'ig')
  const val = value.replace(regex, '$1')
  return val
}

Vue.filter('currency', currency)
Vue.filter('date', date)
Vue.filter('percent', percent)
Vue.filter('variation', variation)
Vue.filter('formatted24hrs', formatted24hrs)
Vue.filter('abrvNumber', abrvNumber)
Vue.filter('escapeHtml', escapeHtml)

export default {
  currency,
  date,
  percent,
  variation,
  formatted24hrs,
  abrvNumber,
  escapeHtml,
}
