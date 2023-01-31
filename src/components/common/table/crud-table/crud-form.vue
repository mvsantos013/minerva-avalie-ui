<template>
  <q-dialog v-model="dialogOpen" @hide="onCloseDialog">
    <q-card :style="`min-width: ${sizes[size].width}`">
      <!-- Form header -->
      <q-card-section>
        <div class="text-h6">{{ labels[state].title }}</div>
      </q-card-section>

      <q-card-section>
        <q-form
          ref="form"
          autofocus
          @submit="onSubmit"
          @validation-error="isFormValid = false"
        >
          <slot name="form" v-bind="{ state, model, validateForm, submited }">
            <!-- Form body -->
            <div v-if="isDialogMultipleDelete">
              Items with the following <em>{{ rowKey }}s </em> will be deleted:
              <br />
              <br />
              <div
                v-for="(item, index) in selectedRows.map(
                  (item) => item[rowKey],
                )"
                :key="index"
                class="mb-1"
              >
                - {{ item }}
              </div>
            </div>

            <div
              v-else-if="model && Object.keys(model).length > 0"
              class="grid gap-4"
              :class="`grid-cols-${sizes[size].cols}`"
            >
              <!-- eslint-disable -->
              <div
                v-if="isFieldAvailable(col.form.visible)"
                v-for="col in columns"
                :key="col.name"
              >
              <!-- eslint-enable -->
                <div>
                  <template v-if="col.form.input === 'radio-boolean'">
                    <div class="input-radio-boolean">
                      <label
                        :class="
                          !isFieldAvailable(col.form.editable) || submited
                            ? 'text-gray-400'
                            : 'text-gray-600'
                        "
                      >
                        {{ col.form.label }}
                      </label>
                      <br />
                      <q-radio
                        v-model="model[col.name]"
                        :val="true"
                        label="Yes"
                        size="sm"
                        :disable="
                          !isFieldAvailable(col.form.editable) || submited
                        "
                        :rules="getRules(col.form.validations)"
                      />
                      <q-radio
                        v-model="model[col.name]"
                        :val="false"
                        label="No"
                        size="sm"
                        :disable="
                          !isFieldAvailable(col.form.editable) || submited
                        "
                        :rules="getRules(col.form.validations)"
                      />
                    </div>
                  </template>

                  <template v-else-if="col.form.input === 'date'">
                    <q-input
                      v-model="model[col.name]"
                      :label="col.form.label"
                      filled
                      clearable
                      dense
                      outlined
                      :disable="
                        !isFieldAvailable(col.form.editable) || submited
                      "
                      mask="####-##-##"
                      :rules="getRules(col.form.validations)"
                    >
                      <template #append>
                        <q-icon
                          name="mdi-calendar-range"
                          class="cursor-pointer"
                        >
                          <q-popup-proxy
                            ref="qDateProxy"
                            transition-show="scale"
                            transition-hide="scale"
                          >
                            <q-date v-model="model[col.name]">
                              <div class="row items-center justify-end">
                                <q-btn
                                  v-close-popup
                                  label="Close"
                                  color="primary"
                                  flat
                                />
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </template>

                  <template v-else-if="col.form.input === 'number'">
                    <div class="input-text">
                      <q-input
                        v-model.number="model[col.name]"
                        :label="col.form.label"
                        :disable="
                          !isFieldAvailable(col.form.editable) || submited
                        "
                        :rules="getRules(col.form.validations)"
                        type="number"
                        step="any"
                      />
                    </div>
                  </template>

                  <template v-else-if="col.form.input == 'select'">
                    <div class="input-text">
                      <q-select
                        v-model="model[col.name]"
                        :ref="`selectField_${col.name}`"
                        :options="col.form.selectOptions"
                        :label="col.form.label"
                        :option-value="col.form.selectOptionValue"
                        :option-label="col.form.selectOptionLabel"
                        :emit-value="col.form.selectOptionEmitValue === true"
                        :map-options="col.form.selectOptionEmitValue === true"
                        :disable="
                          !isFieldAvailable(col.form.editable) || submited
                        "
                        :rules="getRules(col.form.validations)"
                        :clearable="col.form.selectClearable === true"
                        :dense="col.form.selectDense === true"
                        @input="
                          () => {
                            $refs[`selectField_${col.name}`].hidePopup
                              ? $refs[`selectField_${col.name}`].hidePopup()
                              : $refs[`selectField_${col.name}`][0].hidePopup()
                          }
                        "
                      /></div
                  ></template>

                  <template v-else>
                    <div class="input-text">
                      <q-input
                        v-model="model[col.name]"
                        :label="col.form.label"
                        :disable="
                          !isFieldAvailable(col.form.editable) || submited
                        "
                        :rules="getRules(col.form.validations)"
                      />
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </slot>

          <!-- form actions -->
          <q-card-actions
            align="right"
            class="bg-white text-teal mt-3"
            style="padding-right: 0"
          >
            <q-btn
              v-close-popup
              flat
              label="Cancel"
              color="primary"
              :disable="submited"
            />
            <q-btn
              :label="actionBtnLabel ? actionBtnLabel : labels[state].actionBtn"
              :color="
                isDialogDelete || isDialogMultipleDelete
                  ? 'negative'
                  : 'primary'
              "
              style="margin-left: 1rem; min-width: 5rem"
              :disable="submited"
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

const DIALOG_CREATE = 'create'
const DIALOG_UPDATE = 'update'
const DIALOG_DELETE = 'delete'
const DIALOG_MULTIPLE_DELETE = 'multiple-delete'

export default {
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    state: {
      type: String,
      default: DIALOG_CREATE,
    },
    item: {
      type: Object,
      default: () => {},
    },
    defaultItem: {
      type: Object,
      default: () => {},
    },
    columns: {
      type: Array,
      default: () => [],
    },
    entity: {
      type: String,
      default: 'Item',
    },
    size: {
      type: String,
      default: 'md',
    },
    selectedRows: {
      type: Array,
      default: () => [],
    },
    rowKey: {
      type: [String, Function],
      default: null,
    },
    createLabel: {
      type: String,
      default: 'Add',
    },
    actionBtnLabel: {
      type: String,
      default: null,
    },
  },
  emits: [
    'update:open',
    'onCreate',
    'onUpdate',
    'onDelete',
    'onMultipleDelete',
    'viewLogs',
    'endWebsockets',
  ],
  data() {
    return {
      model: {},
      dialogOpen: false,
      labels: {
        [DIALOG_CREATE]: {
          title: this.createLabel + ' new ' + this.entity,
          actionBtn: this.createLabel,
        },
        [DIALOG_UPDATE]: {
          title: 'Update ' + this.entity,
          actionBtn: 'Save',
        },
        [DIALOG_DELETE]: {
          title: 'Delete ' + this.entity,
          actionBtn: 'Delete',
        },
        [DIALOG_MULTIPLE_DELETE]: {
          title: 'Delete multiple items',
          actionBtn: 'Delete',
        },
      },
      sizes: {
        sm: {
          width: '25rem',
          cols: 2,
        },
        md: {
          width: '45rem',
          cols: 2,
        },
        lg: {
          width: '60rem',
          cols: 6,
        },
      },
      isFormValid: true,
      submited: false,
    }
  },
  computed: {
    isDialogCreate() {
      return this.state === DIALOG_CREATE
    },
    isDialogUpdate() {
      return this.state === DIALOG_UPDATE
    },
    isDialogDelete() {
      return this.state === DIALOG_DELETE
    },
    isDialogMultipleDelete() {
      return this.state === DIALOG_MULTIPLE_DELETE
    },
  },
  watch: {
    open(newVal) {
      this.dialogOpen = newVal
      if (newVal === true) this.onOpenDialog()
    },
    dialogOpen(newVal) {
      this.$emit('update:open', newVal)
    },
  },
  methods: {
    onCloseDialog() {
      this.submited = false
      this.isFormValid = true
    },
    onOpenDialog() {
      this.model = JSON.parse(JSON.stringify(this.item))
    },
    isFieldAvailable(states) {
      return states.toLowerCase().includes(this.state)
    },
    async validateForm() {
      const isValid = await this.$refs.form.validate()
      this.isFormValid = isValid
    },
    onSubmit(e) {
      e.preventDefault()
      this.submited = true
      switch (this.state) {
        case DIALOG_CREATE:
          this.model = this.sanitizeModel(this.model)
          this.$emit('onCreate', this.model)
          break
        case DIALOG_UPDATE:
          this.$emit('onUpdate', this.model)
          break
        case DIALOG_DELETE:
          this.$emit('onDelete', this.model)
          break
        case DIALOG_MULTIPLE_DELETE:
          this.$emit('onMultipleDelete')
          break
      }
      this.$emit('update:open', false)
    },
    sanitizeModel(model) {
      // Remove non-available fields from model
      const editableFields = this.columns
        .filter(
          (col) =>
            this.isFieldAvailable(col.form.visible) &&
            this.isFieldAvailable(col.form.editable),
        )
        .map((col) => col.name)

      const newModel = Object.fromEntries(
        Object.keys(model)
          .filter((prop) => editableFields.includes(prop))
          .map((prop) => [prop, model[prop]]),
      )
      return newModel
    },
    getRules(rulesNames) {
      return getRules(rulesNames)
    },
  },
}
</script>
