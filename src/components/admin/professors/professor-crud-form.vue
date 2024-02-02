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
          :style="'margin: 0; padding: 0'"
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

      <div v-if="isFieldVisible('departmentId')">
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

      <div v-if="isFieldVisible('hasPublicRating')">
        <div class="mb-1">
          {{ getFieldConfig('hasPublicRating').form.label }}
        </div>
        <div>
          <q-radio
            v-model="model.hasPublicRating"
            :val="false"
            label="Não"
            dense
            :disable="!isFieldEditable('hasPublicRating') || submited"
            :rules="getFieldRules('hasPublicRating')"
            class="mr-4"
          />
          <q-radio
            v-model="model.hasPublicRating"
            :val="true"
            label="Sim"
            dense
            :disable="!isFieldEditable('hasPublicRating') || submited"
            :rules="getFieldRules('hasPublicRating')"
          />
        </div>
      </div>

      <div v-if="isFieldVisible('hasPublicTestimonials')">
        <div class="mb-1">
          {{ getFieldConfig('hasPublicTestimonials').form.label }}
        </div>
        <div>
          <q-radio
            v-model="model.hasPublicTestimonials"
            :val="false"
            label="Não"
            dense
            :disable="!isFieldEditable('hasPublicTestimonials') || submited"
            :rules="getFieldRules('hasPublicTestimonials')"
            class="mr-4"
          />
          <q-radio
            v-model="model.hasPublicTestimonials"
            :val="true"
            label="Sim"
            dense
            :disable="!isFieldEditable('hasPublicTestimonials') || submited"
            :rules="getFieldRules('hasPublicTestimonials')"
          />
        </div>
      </div>

      <div v-if="isFieldVisible('hasPublicStatistics')">
        <div class="mb-1">
          {{ getFieldConfig('hasPublicStatistics').form.label }}
        </div>
        <div>
          <q-radio
            v-model="model.hasPublicStatistics"
            :val="false"
            label="Não"
            dense
            :disable="!isFieldEditable('hasPublicStatistics') || submited"
            :rules="getFieldRules('hasPublicStatistics')"
            class="mr-4"
          />
          <q-radio
            v-model="model.hasPublicStatistics"
            :val="true"
            label="Sim"
            dense
            :disable="!isFieldEditable('hasPublicStatistics') || submited"
            :rules="getFieldRules('hasPublicStatistics')"
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

      <div class="col-span-3 py-6">
        <h5 class="bg-primary-500 px-3 text-white leading-normal">
          Disciplinas
        </h5>
        <q-linear-progress
          v-show="fetchingProfessorDisciplines"
          indeterminate
        />
        <div class="flex items-center gap-3 mb-3 mt-1">
          <q-select
            v-model="selectedDepartmentId"
            :options="departments"
            option-label="name"
            option-value="id"
            :emit-value="true"
            :map-options="true"
            :loading="fetchingDepartments"
            :disable="fetchingDepartments || fetchingDisciplines"
            label="Departament"
            dense
            class="flex-1"
          />
          <q-select
            v-model="selectedDisciplineId"
            :options="disciplines"
            :option-label="(v) => `${v.id} - ${v.name}`"
            option-value="id"
            :emit-value="true"
            :map-options="true"
            :loading="fetchingDisciplines"
            :disable="fetchingDisciplines || fetchingDepartments"
            label="Discipline"
            dense
            class="flex-1"
          />
          <q-btn
            color="primary"
            :disable="
              fetchingDisciplines ||
              fetchingDepartments ||
              !selectedDepartmentId ||
              !selectedDisciplineId
            "
            icon="mdi-plus"
            @click="onAddDiscipline(selectedDepartmentId, selectedDisciplineId)"
          />
        </div>
        <div
          v-if="professorDisciplines.length > 0"
          class="max-h-40 overflow-y-auto border rounded-md pt-2 px-2"
        >
          <div
            v-for="(d, index) in professorDisciplines"
            :key="index"
            class="flex items-center gap-3 mb-2"
          >
            <q-btn
              color="red"
              :disable="fetchingDisciplines || fetchingDepartments"
              icon="mdi-minus"
              size="xs"
              @click="onRemoveDiscipline(d)"
            />
            <div>{{ d.departmentIdDisciplineId.split(':')[1] }}</div>
          </div>
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
      selectedDepartmentId: null,
      selectedDisciplineId: null,
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
    professorDisciplines: {
      type: Array,
      default: () => [],
    },
    fetchingProfessorDisciplines: {
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
    disciplines: {
      type: Array,
      default: () => [],
    },
    fetchingDisciplines: {
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
  watch: {
    selectedDepartmentId(val) {
      if (val) {
        this.$emit('onFetchDisciplines', val)
      }
    },
  },
  mounted() {
    this.$emit('onOpen', this.model)
  },
  methods: {
    getFieldConfig(field) {
      return this.columns.find((x) => x.name === field)
    },
    isFieldVisible(field) {
      return (
        this.getFieldConfig(field)?.form.visible.includes(this.state) || false
      )
    },
    isFieldEditable(field) {
      return (
        this.getFieldConfig(field)?.form.editable.includes(this.state) || false
      )
    },
    getFieldRules(field) {
      return this.getRules(this.getFieldConfig(field)?.form.validations) || []
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
    onAddDiscipline(departmentId, disciplineId) {
      this.$emit('onAddDiscipline', {
        professorId: this.model.id || 'x',
        departmentIdDisciplineId: `${departmentId}:${disciplineId}`,
      })
      this.selectedDisciplineId = null
    },
    onRemoveDiscipline(d) {
      this.$emit('onRemoveDiscipline', {
        professorId: this.model.id || 'x',
        departmentIdDisciplineId: d.departmentIdDisciplineId,
      })
    },
  },
}
</script>
