<template>
  <q-input
    v-model="model"
    :label="label"
    :clearable="clearable"
    :dense="dense"
    :disable="disable"
    :loading="loading"
    :rules="getRules(rules)"
    :error="error"
    :error-message="errorMessage"
    :outlined="outlined"
    :filled="filled"
    @input="$emit('update:value', model)"
    @blur="$emit('onBlur', model)"
  >
    <template #append>
      <q-icon name="mdi-calendar-range" class="cursor-pointer">
        <q-popup-proxy
          ref="qDateProxy"
          transition-show="jump-up"
          transition-hide="jump-up"
        >
          <q-date
            v-model="model"
            mask="YYYY-MM-DD"
            @input="$emit('update:value', model) && $refs.qDateProxy.hide()"
          >
            <div class="items-center justify-end row">
              <q-btn v-close-popup label="Close" color="primary" flat />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>

<script>
import { getRules } from '@/utils/utils'

export default {
  props: {
    value: {
      type: String,
      default: null,
    },
    label: {
      type: String,
      default: '',
    },
    disable: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    dense: {
      type: Boolean,
      default: true,
    },
    outlined: {
      type: Boolean,
      default: false,
    },
    filled: {
      type: Boolean,
      default: false,
    },
    rules: {
      type: String,
      default: '',
    },
    error: {
      type: Boolean,
      default: null,
    },
    errorMessage: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      model: null,
    }
  },
  watch: {
    value(newValue) {
      if (newValue !== this.model) this.model = newValue
    },
  },
  mounted() {
    this.model = this.value
  },
  methods: {
    getRules(rulesNames) {
      return getRules(rulesNames)
    },
  },
}
</script>
