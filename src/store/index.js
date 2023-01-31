import Vue from 'vue'
import Vuex from 'vuex'
import pathify from 'vuex-pathify'

// Get store modules inside ./modules folder
const getAppModules = () => {
  const files = require.context('./modules/', true, /\.js$/)
  const modules = {}

  files.keys().forEach((fileName) => {
    const modulePath = fileName.replace(/(\.\/|\.js)/g, '')
    const n = modulePath.lastIndexOf('/')
    const moduleName = modulePath.substring(n + 1)
    modules[moduleName] = files(fileName).default
  })
  return modules
}

const modules = getAppModules()

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [pathify.plugin],
  modules: modules,
})
