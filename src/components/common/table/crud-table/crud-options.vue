<template>
  <q-dialog v-model="dialogOpen" @hide="onCloseDialog">
    <q-card style="min-width: 50rem">
      <!-- Form header -->
      <q-card-section>
        <div class="text-h6">Options</div>
      </q-card-section>

      <q-card-section>
        <q-form ref="form" @submit="onSubmit">
          <div class="visible-columns">
            <h5 class="text-lg">Visible Columns</h5>
            <div class="options grid grid-cols-4">
              <div
                v-for="col in options.visibleColumns"
                :key="col.name"
                class="col-option"
              >
                <q-checkbox v-model="col.visible" size="xs" />
                <span class="text-sm pl-1">{{ col.label || col.name }}</span>
              </div>
            </div>
          </div>

          <q-card-actions align="right" class="bg-white text-teal mt-3">
            <q-btn v-close-popup flat label="Cancel" color="primary" />
            <q-btn
              label="Save"
              color="primary"
              style="margin-left: 1rem; min-width: 5rem"
              type="submit"
            />
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { getRules } from '@/utils/utils'

export default {
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    cache: {
      type: Object,
      default: () => {},
    },
  },
  emits: ['update:open', 'onUpdate'],
  data() {
    return {
      dialogOpen: false,
      options: {},
    }
  },
  watch: {
    open(newVal) {
      this.dialogOpen = newVal
      if (newVal === true) this.onOpenDialog()
    },
    dialogOpen(newVal) {
      this.$emit('update:open', newVal)
    },
    cache(newVal) {
      this.options = JSON.parse(JSON.stringify(newVal))
    },
  },
  mounted() {
    this.options = JSON.parse(JSON.stringify(this.cache))
  },
  methods: {
    onCloseDialog() {},
    onOpenDialog() {},
    onSubmit(e) {
      e.preventDefault()
      this.$emit('update:open', false)
      this.$emit('onUpdate', this.options)
    },
    getRules(rulesNames) {
      return getRules(rulesNames)
    },
  },
}
</script>
