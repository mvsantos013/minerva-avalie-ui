<template>
  <q-input
    v-model="model"
    :label="label"
    :clearable="clearable"
    :dense="dense"
    :disable="disable"
    :loading="loading"
    :rules="datetimeRules"
    :error="error"
    :error-message="errorMessage"
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
          <div class="q-gutter-md row items-start">
            <q-date
              v-model="model"
              mask="YYYY-MM-DD HH:mm"
              color="primary"
              @input="$emit('update:value', model)"
            />
            <q-time
              v-model="model"
              mask="YYYY-MM-DD HH:mm"
              format24h
              color="primary"
              @input="$emit('update:value', model)"
            >
              <div class="items-center justify-end row">
                <q-btn v-close-popup label="Close" color="primary" flat />
              </div>
            </q-time>
          </div>
          <!-- <q-date
            v-model="model"
            mask="YYYY-MM-DD"
            @input="$emit('update:value', model)"
          >
            <div class="items-center justify-end row">
              <q-btn v-close-popup label="Close" color="primary" flat />
            </div>
          </q-date> -->
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
    rules: {
      type: [String, Array],
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
  computed: {
    datetimeRules() {
      if (typeof this.rules === 'string') return this.getRules(this.rules)
      else return this.rules
    },
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
