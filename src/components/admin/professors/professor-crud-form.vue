<template>
  <div>
    <div
      v-if="model && Object.keys(model).length > 0"
      class="grid gap-4 grid-cols-3"
    >
      <div v-if="isFieldVisible('id')" class="col-span-3">
        <q-input
          v-model="model.id"
          :label="getFieldConfig('id').form.label"
          :disable="!isFieldEditable('id') || submited"
          :rules="getFieldRules('id')"
        />
      </div>

      <div v-if="isFieldVisible('name')">
        <q-input
          v-model="model.name"
          :label="getFieldConfig('name').form.label"
          :disable="!isFieldEditable('name') || submited"
          :rules="getFieldRules('name')"
        />
      </div>

      <div v-if="isFieldVisible('departmentId')" class="input-text">
        <q-select
          v-model="model.departmentId"
          ref="departmentId"
          :options="departments"
          :label="getFieldConfig('departmentId').form.label"
          option-value="id"
          option-label="name"
          :emit-value="true"
          map-options
          :disable="!isFieldEditable('departmentId') || submited"
          :rules="getFieldRules('departmentId')"
          :clearable="false"
          :dense="false"
          :loading="fetchingDepartments"
          @input="
            () => {
              $refs.departmentId.hidePopup
                ? $refs.departmentId.hidePopup()
                : $refs.departmentId[0].hidePopup()
            }
          "
        />
      </div>

      <div v-if="isFieldVisible('description')">
        <q-input
          v-model="model.description"
          :label="getFieldConfig('description').form.label"
          :disable="!isFieldEditable('description') || submited"
          :rules="getFieldRules('description')"
        />
      </div>

      <div v-if="isFieldVisible('about')" class="col-span-3">
        <q-input
          v-model="model.about"
          :label="getFieldConfig('about').form.label"
          :disable="!isFieldEditable('about') || submited"
          :rules="getFieldRules('about')"
          type="textarea"
          outlined
          maxlength="300"
          rows="3"
        />
      </div>

      <div v-if="isFieldVisible('publicRating')">
        <div class="mb-1">{{ getFieldConfig('publicRating').form.label }}</div>
        <div>
          <q-radio
            v-model="model.publicRating"
            :val="false"
            label="Não"
            dense
            :disable="!isFieldEditable('publicRating') || submited"
            :rules="getFieldRules('publicRating')"
            class="mr-4"
          />
          <q-radio
            v-model="model.publicRating"
            :val="true"
            label="Sim"
            dense
            :disable="!isFieldEditable('publicRating') || submited"
            :rules="getFieldRules('publicRating')"
          />
        </div>
      </div>

      <div v-if="isFieldVisible('publicTestimonials')">
        <div class="mb-1">
          {{ getFieldConfig('publicTestimonials').form.label }}
        </div>
        <div>
          <q-radio
            v-model="model.publicTestimonials"
            :val="false"
            label="Não"
            dense
            :disable="!isFieldEditable('publicTestimonials') || submited"
            :rules="getFieldRules('publicTestimonials')"
            class="mr-4"
          />
          <q-radio
            v-model="model.publicTestimonials"
            :val="true"
            label="Sim"
            dense
            :disable="!isFieldEditable('publicTestimonials') || submited"
            :rules="getFieldRules('publicTestimonials')"
          />
        </div>
      </div>

      <div v-if="isFieldVisible('publicStatistics')">
        <div class="mb-1">
          {{ getFieldConfig('publicStatistics').form.label }}
        </div>
        <div>
          <q-radio
            v-model="model.publicStatistics"
            :val="false"
            label="Não"
            dense
            :disable="!isFieldEditable('publicStatistics') || submited"
            :rules="getFieldRules('publicStatistics')"
            class="mr-4"
          />
          <q-radio
            v-model="model.publicStatistics"
            :val="true"
            label="Sim"
            dense
            :disable="!isFieldEditable('publicStatistics') || submited"
            :rules="getFieldRules('publicStatistics')"
          />
        </div>
      </div>

      <div v-if="isFieldVisible('pictureUrl')" class="col-span-3 pt-3">
        <div class="flex items-center">
          <q-img
            v-if="displayPicture"
            :src="displayPicture"
            spinner-color="white"
            class="mr-5 w-16 h-16 rounded-md bg-gray-200"
          />
          <q-file
            v-model="pictureInput"
            :label="getFieldConfig('pictureUrl').form.label"
            :disable="!isFieldEditable('pictureUrl') || submited"
            :rules="getFieldRules('pictureUrl')"
            accept=".png, .jpg, .jpeg"
            max-file-size="200000"
            @rejected="onImageRejected"
            filled
            dense
            :clearable="true"
          >
            <template v-slot:prepend>
              <q-icon name="mdi-paperclip" />
            </template>
          </q-file>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getRules, getPropValue } from '@/utils/utils'

export default {
  data() {
    return {
      fundsIds: [],
      conterParties: [],
    }
  },
  components: {},
  props: {
    state: {
      type: String,
      default: null,
    },
    model: {
      type: Object,
      default: () => {},
    },
    selected: {
      type: Array,
      default: () => [],
    },
    columns: {
      type: Array,
      default: () => [],
    },
    validateForm: {
      type: Function,
      default: (v) => v,
    },
    submited: {
      type: Boolean,
      default: false,
    },
    departments: {
      type: Array,
      default: () => [],
    },
    fetchingDepartments: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    displayPicture() {
      if (!this.model.pictureUrl)
        return 'https://minerva-avalie-bff-files-dev.s3.amazonaws.com/public/imgs/general/profile-empty.png'
      if (typeof this.model.pictureUrl === 'string')
        return this.model.pictureUrl
      return URL.createObjectURL(this.model.pictureUrl)
    },
    pictureInput: {
      get() {
        if (typeof this.model.pictureUrl === 'string') return null
        return this.model.pictureUrl
      },
      set(val) {
        this.model.pictureUrl = val
      },
    },
  },
  mounted() {},
  methods: {
    getFieldConfig(field) {
      return this.columns.find((x) => x.name === field)
    },
    isFieldVisible(field) {
      return this.getFieldConfig(field).form.visible.includes(this.state)
    },
    isFieldEditable(field) {
      return this.getFieldConfig(field).form.editable.includes(this.state)
    },
    getFieldRules(field) {
      return this.getRules(this.getFieldConfig(field).form.validations)
    },
    getRules(rulesName) {
      return getRules(rulesName)
    },
    getPropValue(val, propToMatch, propToReturn, array) {
      return getPropValue(val, propToMatch, propToReturn, array)
    },
    onImageRejected(e) {
      const error = e[0].failedPropValidation
      this.model.pictureUrl = null

      if (error === 'max-file-size') {
        this.$toast.error('Imagem muito grande. (Max 0.2 MB)')
        return
      }

      this.$toast.error('Imagem inválida.')
    },
  },
}
</script>
