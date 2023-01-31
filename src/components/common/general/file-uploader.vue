<template>
  <div>
    <div v-if="title" class="mb-5 tracking-wider text-gray-600">
      {{ title }}
    </div>
    <q-form @submit.prevent="$emit('onUpload', inputs)">
      <q-select
        v-if="showFundsSelector"
        v-model="currentFund"
        :options="availableFunds"
        label="Fund"
        option-value="id"
        option-label="ticker"
        :disable="loading"
        class="mb-3 w-28"
      />
      <q-file
        filled
        bottom-slots
        v-model="file"
        :label="label"
        counter
        :rules="[(val) => !!val]"
      >
        <template v-slot:prepend>
          <q-icon name="mdi-cloud-upload" @click.stop />
        </template>
        <template v-slot:append>
          <q-icon
            name="mdi-close"
            @click.stop.prevent="file = null"
            class="cursor-pointer"
          />
        </template>
      </q-file>

      <!-- form actions -->
      <q-card-actions
        align="right"
        class="mt-3 bg-white text-teal"
        style="padding-right: 0"
      >
        <q-btn
          label="Upload"
          :color="'primary'"
          style="margin-left: 1rem; min-width: 5rem"
          type="submit"
          :disable="loading || disabled"
          :loading="loading"
        />
      </q-card-actions>
    </q-form>
  </div>
</template>

<script>
import { get } from 'vuex-pathify'

export default {
  props: {
    title: {
      type: String,
      default: null,
    },
    label: {
      type: String,
      default: null,
    },
    fundsType: {
      type: String,
      default: 'onshore',
    },
    defaultFund: {
      type: String,
      default: null,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    showFundsSelector: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      currentFund: null,
      file: null,
    }
  },
  computed: {
    funds: get('funds/funds'),
    availableFunds() {
      const f = {
        all: this.funds,
        onshore: this.funds.filter((x) => x.category === 'onshore'),
        funds: this.funds.filter((x) => x.category === 'offshore'),
      }
      return f[this.fundsType]
    },
    inputs() {
      const fd = new FormData()
      fd.append('file', this.file)
      if (this.showFundsSelector) fd.append('fund_id', this.currentFund.id)
      return fd
    },
  },
  mounted() {
    if (this.showFundsSelector && !this.defaultFund)
      this.currentFund = this.availableFunds[0]
  },
}
</script>
