<template>
  <div v-if="!isUserAuthenticated" style="min-height: 100vh; min-width: 100vw">
    <!-- <div
      class="background"
      :style="{
        backgroundImage: `url(${require('@/assets/imgs/hashdex-nasdaq-background.jpg')})`,
      }"
    ></div> -->
    <div class="overlay"></div>
    <div
      style="min-height: 100vh; min-width: 100vw"
      class="flex items-center justify-center"
    >
      <div
        class="bg-white rounded-md overflow-hidden shadow-2xl border border-gray-700 relative"
        style="min-width: 37rem; min-height: 21rem; z-index: 99"
      >
        <div
          class="flex items-center justify-between w-full h-20 bg-primary-500"
        >
          <!-- <q-img
            :src="require('@/assets/imgs/minerva-avalie-logo7.svg')"
            class="w-44 ml-10"
          ></q-img> -->

          <!-- <q-img
            :src="require('@/assets/imgs/logo-hashdex-white.png')"
            class="w-40 mr-10"
          ></q-img> -->
        </div>
        <div class="border pb-6" style="min-height: 15.7rem">
          <div class="mt-5 mb-6 text-lg select-none text-gray-700 text-center">
            Welcome to Minerva Avalie
          </div>
          <div class="flex flex-nowrap items-center justify-center">
            <div class="w-1/2 pl-8 pr-4">
              <div
                v-if="!authenticating"
                class="login-button"
                @click="onLoginWithGoogle"
              >
                <q-img
                  :src="require('@/assets/imgs/logo-google.png')"
                  class="w-8"
                ></q-img>
                <div class="ml-5">Sign in with Google</div>
              </div>

              <q-spinner-ball
                v-else
                color="primary"
                size="2em"
                class="mt-4 m-auto"
              />
            </div>
            <div class="h-32 bg-gray-100 mx-2" style="min-width: 1px"></div>
            <form
              class="w-1/2 pl-4 pr-8 flex flex-col"
              @submit.prevent="onLogin"
            >
              <q-input
                v-model="username"
                label="Username"
                :disable="authenticating"
                dense
                type="email"
                class="mb-3"
              />
              <q-input
                v-model="password"
                label="Password"
                type="password"
                :disable="authenticating"
                step="any"
                dense
                class="mb-3"
              />
              <q-btn
                color="primary"
                type="sumbit"
                :disable="authenticating"
                :loading="authenticating"
                >Sign in</q-btn
              >
            </form>
          </div>
          <div class="text-center text-red-400 pt-5">{{ errorMessage }}</div>

          <!-- New password form -->
          <div v-if="newPasswordError">
            <hr class="my-3" />
            <form
              class="flex flex-col items-center justify-center m-auto w-60"
              @submit.prevent="onNewPassword"
            >
              <q-input
                v-model="newPassword"
                label="New password"
                type="password"
                :disable="chosingNewPassword"
                step="any"
                dense
                class="mb-3 w-full"
              />
              <q-input
                v-model="newPasswordConfirm"
                label="New password confirm"
                type="password"
                :disable="chosingNewPassword"
                step="any"
                dense
                class="mb-3 w-full"
              />
              <q-btn
                color="primary"
                type="sumbit"
                outline
                class="w-full"
                :disable="chosingNewPassword"
                :loading="chosingNewPassword"
              >
                Confirm new password
              </q-btn>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { get, call } from 'vuex-pathify'

export default {
  data() {
    return {
      userResponse: null,
      authenticating: false,
      username: null,
      password: null,
      errorMessage: null,
      newPasswordError: false,
      newPassword: null,
      newPasswordConfirm: null,
      chosingNewPassword: false,
    }
  },
  beforeMount() {
    if (this.isUserAuthenticated) this.$router.go('/')
  },
  mounted() {
    const error = this.$route.query.error
    const errorDescription = this.$route.query.error_description

    if (error) {
      let msg = `${errorDescription} (${error})`

      if (errorDescription.includes('Invalid email domain'))
        msg = 'Domínio de email inválido.'
      this.$toast.open({ message: msg, type: 'error' })
    }
  },
  computed: {
    isUserAuthenticated: get('auth/isUserAuthenticated'),
    isUserAuthenticating: get('auth/isUserAuthenticating'),
  },
  watch: {
    isUserAuthenticated() {
      if (this.isUserAuthenticated) this.$router.go('/')
    },
  },
  methods: {
    login: call('auth/login'),
    loginWithGoogle: call('auth/loginWithGoogle'),
    confirmNewPassword: call('auth/confirmNewPassword'),
    onLoginWithGoogle() {
      this.authenticating = true
      this.loginWithGoogle()
    },
    async onLogin() {
      this.authenticating = true
      this.errorMessage = null
      this.newPasswordError = false
      try {
        this.userResponse = await this.login({
          username: this.username,
          password: this.password,
        })

        if (this.userResponse.challengeName === 'NEW_PASSWORD_REQUIRED') {
          this.errorMessage =
            'You attempted to log in using a temporary password. Please choose a new password.'
          this.newPassword = null
          this.newPasswordError = true
          this.newPasswordConfirm = null
        } else {
          window.location.href = '/'
        }
      } catch (e) {
        this.errorMessage = e.message
      }
      this.authenticating = false
    },
    async onNewPassword() {
      this.chosingNewPassword = true
      try {
        if (this.newPassword !== this.newPasswordConfirm) {
          this.errorMessage = "Passwords don't match"
          this.chosingNewPassword = false
          return
        }
        await this.confirmNewPassword({
          user: this.userResponse,
          password: this.newPassword,
        })
        this.newPasswordError = false
      } catch (e) {
        this.errorMessage = e.message
      }

      this.chosingNewPassword = false
    },
  },
}
</script>

<style scoped>
.background {
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  min-height: 100vh;
  min-width: 100vw;
  top: 0;
  bottom: 0;
  position: fixed;
  filter: blur(6px);
  z-index: -2;
}

/* stylelint-disable */
.overlay {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  bottom: 0;
  //background-color: rgba(0, 0, 0, 0.2);
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.05) 0%,
    rgba(0, 0, 0, 0.7) 100%
  );
  z-index: -1;
}
/* stylelint-enable */

.login-button {
  @apply flex items-center justify-center flex-nowrap border rounded-md cursor-pointer shadow-md py-3 px-6 select-none;

  transition: box-shadow 0.15s ease-in-out;
}

.login-button:hover {
  @apply shadow-lg;
}

.login-button:active {
  @apply shadow-md;
}
</style>
