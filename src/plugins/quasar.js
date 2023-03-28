import Vue from 'vue'
import 'quasar/dist/quasar.css'
import iconSet from 'quasar/icon-set/mdi-v6.js'
import '@quasar/extras/mdi-v7/mdi-v7.css'
import { Quasar, Loading } from 'quasar'

Vue.use(Quasar, {
  config: {
    brand: {
      primary: '#5482a5',
    },
    Loading,
  },
  plugins: {
    Loading,
  },
  iconSet: iconSet,
})
