import moment from 'moment'

export const hasMinLength = (v, length) => {
  return v && v.length >= length
}

export const hasMaxLength = (v, length) => {
  return v && v.length <= length
}

export const isEmail = (v) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  return re.test(v)
}

export const isUrl = (v) => {
  const re =
    /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}[.]{0,1}/

  return re.test(v)
}

export const isNumeric = (v) => {
  return !isNaN(v)
}

export const isArray = (v) => {
  return Array.isArray(v)
}

export const isInArray = (v, arr) => {
  return arr.includes(v)
}

export const isDate = (v) => {
  const date = Date.parse(v)

  return !isNaN(date)
}

export const hasDateFormat = (v, format = 'DD/MM/YYYY') => {
  return moment(v, format, true).isValid()
}

export const hasDateIsoFormat = (v) => {
  return moment(v, 'YYYY-MM-DD', true).isValid()
}

export const isDateBetween = (v, from, to) => {
  return moment(v).isBetween(from, to)
}

export const isDateEquals = (v, date) => {
  return moment(v).isSame(date)
}

export const isDateAfter = (v, date) => {
  return moment(v).isAfter(date)
}

export const isDateBefore = (v, date) => {
  return moment(v).isBefore(date)
}

export default {
  hasMinLength,
  hasMaxLength,
  isEmail,
  isUrl,
  isNumeric,
  isArray,
  isInArray,
  isDate,
  hasDateFormat,
  hasDateIsoFormat,
  isDateBetween,
  isDateEquals,
  isDateAfter,
  isDateBefore,
}
