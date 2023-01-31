import f from '@/utils/validations'

const required = (v) => {
  return (
    (v !== null && typeof v !== 'undefined' && v.toString().trim() !== '') ||
    'Field is required.'
  )
}

const minLength = (v, length) => {
  return (
    f.hasMinLength(v, length) ||
    `Field must have at least ${length} characters.`
  )
}

const maxLength = (v, length) => {
  return (
    f.hasMaxLength(v, length) || `Field must have at most ${length} characters.`
  )
}

const greaterThan = (v, num) => {
  return v > num || `Field must be greater than ${num}.`
}

const lessThan = (v, num) => {
  return v < num || `Field must be less than ${num}.`
}

const greaterThanEqual = (v, num) => {
  return v >= num || `Field must be greater than or equal to ${num}.`
}

const lessThanEqual = (v, num) => {
  return v <= num || `Field must be less than or equal to${num}.`
}

const email = (v) => {
  if (!v) return true
  return f.isEmail(v) || `Field must be a valid email.`
}

const url = (v) => {
  return f.isUrl(v) || `Field must be a valid URL.`
}

const numeric = (v) => {
  return f.isNumeric(v) || `Field must be numeric.`
}

const array = (v) => {
  return f.isArray(v) || `Field must be an array.`
}

const inArray = (v, array) => {
  return (
    f.isInArray(v, array) || `Field must be in array [${array.join(', ')}].`
  )
}

const date = (v) => {
  return f.isDate(v) || `Field must be a Date Object or have yyyy-mm-dd format.`
}

const dateFormat = (v, format = 'DD/MM/YYYY') => {
  return f.hasDateFormat(v) || `Field must have date format ${format}.`
}

const dateIsoFormat = (v) => {
  return (
    f.hasDateIsoFormat(v) || `Field must have date ISO (yyyy-mm-dd) format.`
  )
}

const dateBetween = (v, from, to) => {
  return (
    f.isDateBetween(v, from, to) ||
    `Field must be between between ${from} and ${to} .`
  )
}

const dateEquals = (v, date) => {
  return f.isDateEquals(v, date) || `Date must be equal to ${date}.`
}

const dateAfter = (v, date) => {
  return f.isDateAfter(v, date) || `Date must be after ${date}.`
}

const dateBefore = (v, date) => {
  return f.isDateBefore(v, date) || `Date must be before ${date}.`
}

export default {
  required,
  minLength,
  maxLength,
  email,
  url,
  numeric,
  array,
  inArray,
  date,
  dateFormat,
  dateIsoFormat,
  dateBetween,
  dateEquals,
  dateAfter,
  dateBefore,
  greaterThan,
  greaterThanEqual,
  lessThan,
  lessThanEqual,
}
