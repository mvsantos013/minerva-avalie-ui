import rules from '@/utils/rules'

export const isLocalhost = () => {
  return process.env.VUE_APP_STAGE === undefined
}

/**
 * Returns value from LocalStorage.
 * This method is util for getting stringfied objects.
 *
 * @param {string} value Prop from LocalStorage.
 * @param {any} defaultValue Default Value if it doesn't exists.
 * @param {boolean} parse Should value be parsed?
 */
export const fromLocalStorage = (value, defaultValue, parse = true) => {
  const string = localStorage.getItem(value)
  if (!string) return defaultValue

  try {
    return parse ? JSON.parse(string) : string
  } catch (e) {
    return string
  }
}

/**
 * Get function rules based on strig of rules passed (used in forms).
 *
 * @param {*} rulesNames
 */
export const getRules = (rulesNames) => {
  if (!rulesNames) return null

  if (!rulesNames.toString()) return []

  const signatures = rulesNames.toString().split('|')

  const rulesFunctions = signatures.map((signature) => {
    const ruleHasParameters = signature.includes('(')
    // Case where rule has no parameters
    if (!ruleHasParameters) {
      const ruleName = signature.trim()
      if (!rules.hasOwnProperty(ruleName))
        throw new Error(`Validation rule not found: ${ruleName}`)

      return rules[ruleName]
    }
    // Case where rule has parameters
    else {
      const index = signature.indexOf('(')
      const ruleName = signature.substr(0, index).trim()
      if (!rules.hasOwnProperty(ruleName))
        throw new Error(`Validation rule not found: ${ruleName}`)

      const args = signature
        .substring(index + 1, signature.indexOf(')'))
        .split(',')

      return (v) => rules[ruleName](v, ...args)
    }
  })

  return rulesFunctions
}

// Match a object val within an array and return prop value
export const getPropValue = (val, propToMatch, propToReturn, array) => {
  if (!val || !array) return ''
  const element = array.find((x) => x[propToMatch] === val)
  if (!element) return val

  return element[propToReturn]
}

export const sortArray = (array, prop) => {
  return array.sort((a, b) => {
    if (a[prop] < b[prop]) return -1
    if (a[prop] > b[prop]) return 1
    return 0
  })
}

export const slugify = (str) => {
  // Convert to lowercase
  str = str.toLowerCase()

  // Remove accents and diacritics
  str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

  // Replace non-alphanumeric characters with hyphens
  str = str.replace(/[^a-z0-9]+/g, '-')

  // Remove leading/trailing hyphens
  str = str.trim('-')

  // Handle consecutive hyphens
  str = str.replace(/-{2,}/g, '-')

  return str
}
