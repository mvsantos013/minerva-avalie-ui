import Vue from 'vue'
import { Auth } from '@aws-amplify/auth'
import App from './app'
import store from './store'
import router from './router'
import './plugins/filters'
import './plugins/quasar'
import './plugins/vue-toast-notification'
import '@/assets/css/main.css'

console.log('env', process.env.VUE_APP_STAGE)

const config = {
  identityPoolId: process.env.VUE_APP_IDENTITY_POOL_ID,
  region: process.env.VUE_APP_REGION,
  identityPoolRegion: process.env.VUE_APP_REGION,
  userPoolId: process.env.VUE_APP_USER_POOL_ID,
  userPoolWebClientId: process.env.VUE_APP_POOL_CLIENT_ID,
  oauth: {
    domain: `minerva-avalie-${process.env.VUE_APP_STAGE}.auth.${process.env.VUE_APP_REGION}.amazoncognito.com`,
    scope: [
      'phone',
      'email',
      'openid',
      'profile',
      'aws.cognito.signin.user.admin',
    ],
    redirectSignIn: process.env.VUE_APP_REDIRECT_SIGN_IN_URL,
    redirectSignOut: process.env.VUE_APP_REDIRECT_SIGN_OUT_URL,
    responseType: 'code',
  },
}

Auth.configure(config)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
