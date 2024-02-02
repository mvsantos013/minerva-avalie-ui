<template>
  <div class="container mt-5 bg-white rounded-md">
    <div class="flex">
      <div class="flex-grow p-3 pb-10">
        <div class="flex flex-col">
          <CrudTable
            title="Professors"
            entity="Professor"
            cache-key="admin-professors"
            row-key="id"
            selection="none"
            form-size="md"
            dense
            :rows="professors"
            :columns="columns"
            :loading="fetchingProfessors"
            :allow-create="userHasPermission('create:professors')"
            :allow-update="userHasPermission('update:professors')"
            :allow-delete="userHasPermission('delete:professors')"
            :allowSelectionDelete="false"
            :pagination="{
              sortBy: 'id',
              descending: false,
              page: 1,
              rowsPerPage: 30,
            }"
            @onCreate="onAddProfessor"
            @onUpdate="onUpdateProfessor"
            @onDelete="onRemoveProfessor"
          >
            <q-btn
              color="primary"
              label="Add from CSV"
              size="md"
              outline
              :disabled="!userHasPermission('create:professors')"
              @click="openCsvDialog"
              class="ml-3"
            />

            <!-- Override default CRUD form -->
            <template #form="{ state, model, validateForm, submited }">
              <ProfessorCrudForm
                :state="state"
                :model="model"
                :columns="columns"
                :validateForm="validateForm"
                :submited="submited"
                :departments="departments"
                :fetchingDepartments="fetchingDepartments"
                :disciplines="disciplines"
                :fetchingDisciplines="fetchingDisciplines"
                :professorDisciplines="professorDisciplines"
                :fetchingProfessorDisciplines="fetchingProfessorDisciplines"
                @onOpen="fetchProfessorDisciplines"
                @onFetchDisciplines="fetchDisciplines"
                @onAddDiscipline="onAddDiscipline"
                @onRemoveDiscipline="onRemoveDiscipline"
              />
            </template>
          </CrudTable>
        </div>
      </div>
      <div class="flex-shrink py-3 border-l" style="min-width: 16rem">
        <Menu :items="pages" />
      </div>
    </div>

    <q-dialog v-model="csvDialogOpen">
      <q-card :style="'width: 36rem'">
        <div class="app-title pb-3 bg-primary-400 text-white pl-3 pt-3">
          Carregar professores via CSV
        </div>

        <div class="px-4">
          <h5 class="font-bold">Colunas do arquivo</h5>
          <div>departmentId (string) - Departamento do professor</div>
          <div>name (string)</div>
          <div>description (string)</div>
          <div>about (string)</div>
          <div>hasPublicRating (boolean)</div>
          <div>hasPublicTestimonials (boolean)</div>
          <div>hasPublicStatistics (boolean)</div>
          <div class="mt-2 italic text-xs">
            <br />
            O separador é vírgula.
          </div>
        </div>

        <q-card-section>
          <q-form ref="form" autofocus @submit.prevent="onSubmitCsv">
            <q-file
              bottom-slots
              v-model="csvFile"
              label="Arquivo CSV"
              counter
              :rules="[(val) => !!val]"
              class="flex-grow mb-5"
            >
              <template v-slot:prepend>
                <q-icon name="mdi-cloud-upload" @click.stop />
              </template>
              <template v-slot:append>
                <q-icon
                  v-if="csvFile"
                  name="mdi-close"
                  @click.stop.prevent="csvFile = null"
                  class="cursor-pointer"
                />
              </template>
            </q-file>

            <q-card-actions align="right" :style="'padding-right: 0'">
              <q-btn
                color="primary"
                type="submit"
                :disable="!csvFile || fetchingProfessors"
                :loading="fetchingProfessors"
              >
                Salvar
              </q-btn>
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { get } from 'vuex-pathify'
import api from '@/utils/api/api'
import Menu from '@/components/common/menu/base-menu.vue'
import { getPropValue } from '@/utils/utils'
import CrudTable from '@/components/common/table/crud-table/crud-table.vue'
import ProfessorCrudForm from '@/components/admin/professors/professor-crud-form.vue'
import getSidebar from './sidebar.js'

export default {
  components: {
    Menu,
    CrudTable,
    ProfessorCrudForm,
  },
  data() {
    return {
      professors: [],
      fetchingProfessors: false,
      departments: [],
      fetchingDepartments: false,
      disciplines: [],
      fetchingDisciplines: false,
      currentModel: null,
      professorOriginalDisciplines: [],
      professorDisciplines: [],
      fetchingProfessorDisciplines: false,
      csvDialogOpen: false,
      csvFile: null,
    }
  },
  computed: {
    userHasGroup: get('auth/userHasGroup'),
    userHasPermission: get('auth/userHasPermission'),
    pages() {
      return getSidebar(this.userHasGroup, this.userHasPermission)
    },
    columns() {
      return [
        {
          name: 'id',
          label: 'ID',
          align: 'left',
          field: (row) => row.id,
          format: (val) => `${val}`,
          sortable: true,
          visible: false,
          type: 'string',
          form: {
            visible: 'update|delete',
            editable: '',
            default: null,
            placeholder: null,
            label: 'ID',
            validations: 'required',
            input: 'string',
          },
          headerFilter: {
            show: true,
            defaultFilters: true,
            customFilters: [],
          },
        },
        {
          name: 'departmentId',
          label: 'Department',
          align: 'left',
          field: (row) => row.departmentId,
          format: (val) => getPropValue(val, 'id', 'name', this.departments),
          sortable: true,
          visible: true,
          type: 'string',
          form: {
            visible: 'create|update|delete',
            editable: 'create',
            default: null,
            placeholder: null,
            label: 'Department',
            validations: 'required',
            input: 'select',
            selectOptions: this.departments,
            selectOptionValue: 'id',
            selectOptionLabel: 'name',
            selectOptionEmitValue: true,
            selectClearable: false,
          },
          headerFilter: {
            show: true,
            defaultFilters: true,
            customFilters: [],
          },
        },
        {
          name: 'name',
          label: 'Name',
          align: 'left',
          field: (row) => row.name,
          format: (val) => `${val}`,
          sortable: true,
          visible: true,
          type: 'string',
          form: {
            visible: 'create|update|delete',
            editable: 'create|update',
            default: null,
            placeholder: null,
            label: 'Name',
            validations: 'required',
            input: 'string',
          },
          headerFilter: {
            show: true,
            defaultFilters: true,
            customFilters: [],
          },
        },
        {
          name: 'description',
          label: 'Description',
          align: 'left',
          field: (row) => row.description,
          format: (val) => `${val}`,
          sortable: true,
          visible: true,
          type: 'string',
          form: {
            visible: 'create|update|delete',
            editable: 'create|update',
            default: null,
            placeholder: null,
            label: 'Description (optional)',
            validations: '',
            input: 'string',
          },
          headerFilter: {
            show: true,
            defaultFilters: true,
            customFilters: [],
          },
        },
        {
          name: 'about',
          label: 'About',
          align: 'left',
          field: (row) => row.about,
          format: (val) => `${val}`,
          sortable: true,
          visible: false,
          type: 'string',
          form: {
            visible: 'create|update|delete',
            editable: 'create|update',
            default: null,
            placeholder: null,
            label: 'About (optional)',
            validations: '',
            input: 'string',
          },
          headerFilter: {
            show: true,
            defaultFilters: true,
            customFilters: [],
          },
        },
        {
          name: 'hasPublicRating',
          label: 'Public Rating',
          align: 'left',
          field: (row) => row.hasPublicRating,
          format: (val) => `${val}`,
          sortable: true,
          visible: true,
          type: 'string',
          form: {
            visible: 'create|update|delete',
            editable: 'create|update',
            default: false,
            placeholder: null,
            label: 'Public Rating',
            validations: '',
            input: 'string',
          },
          headerFilter: {
            show: true,
            defaultFilters: true,
            customFilters: [],
          },
        },
        {
          name: 'hasPublicTestimonials',
          label: 'Public Testimonials',
          align: 'left',
          field: (row) => row.hasPublicTestimonials,
          format: (val) => `${val}`,
          sortable: true,
          visible: true,
          type: 'string',
          form: {
            visible: 'create|update|delete',
            editable: 'create|update',
            default: false,
            placeholder: null,
            label: 'Public Testimonials',
            validations: '',
            input: 'string',
          },
          headerFilter: {
            show: true,
            defaultFilters: true,
            customFilters: [],
          },
        },
        {
          name: 'hasPublicStatistics',
          label: 'Public Statistics',
          align: 'left',
          field: (row) => row.hasPublicStatistics,
          format: (val) => `${val}`,
          sortable: true,
          visible: true,
          type: 'string',
          form: {
            visible: 'create|update|delete',
            editable: 'create|update',
            default: false,
            placeholder: null,
            label: 'Public Statistics',
            validations: '',
            input: 'string',
          },
          headerFilter: {
            show: true,
            defaultFilters: true,
            customFilters: [],
          },
        },
        {
          name: 'pictureUrl',
          label: 'Picture',
          align: 'left',
          field: (row) => row.pictureUrl,
          format: (val) => `${val}`,
          sortable: true,
          visible: false,
          type: 'string',
          form: {
            visible: 'create|update|delete',
            editable: 'create|update',
            default: null,
            placeholder: null,
            label: 'Edit Picture',
            validations: '',
            input: 'string',
          },
          headerFilter: {
            show: true,
            defaultFilters: true,
            customFilters: [],
          },
        },
      ]
    },
  },
  async mounted() {
    await this.fetchDepartments()
    this.fetchProfessors()
  },
  methods: {
    async fetchDepartments() {
      this.fetchingDepartments = true
      const response = await api.fetchDepartments()
      if (response.ok) {
        this.departments = response.data
      }
      this.fetchingDepartments = false
    },
    async fetchDisciplines(departmentId) {
      this.fetchingDisciplines = true
      const response = await api.fetchDisciplines(departmentId)
      if (response.ok) {
        this.disciplines = response.data
      }
      this.fetchingDisciplines = false
    },
    async fetchProfessors() {
      this.fetchingProfessors = true
      const response = await api.fetchProfessors()
      if (response.ok) {
        this.professors = response.data
      }
      this.fetchingProfessors = false
    },
    async onAddProfessor(item) {
      // Create multipart form data
      const formData = new FormData()
      formData.append('name', item.name)
      formData.append('description', item.description)
      formData.append('about', item.about)
      formData.append('departmentId', item.departmentId)
      formData.append('hasPublicRating', item.hasPublicRating)
      formData.append('hasPublicTestimonials', item.hasPublicTestimonials)
      formData.append('hasPublicStatistics', item.hasPublicStatistics)
      if (item.pictureUrl) formData.append('picture', item.pictureUrl)

      this.fetchingProfessors = true
      const response = await api.addProfessor(formData)
      if (response.ok) {
        this.$toast.open('Professor added sucessfully.')
        this.fetchProfessors()
      }
      this.fetchingProfessors = false
    },
    async onUpdateProfessor(item) {
      if (this.fetchingProfessorDisciplines) return
      // Create multipart form data
      const formData = new FormData()
      formData.append('id', item.id)
      formData.append('name', item.name)
      formData.append('description', item.description)
      formData.append('about', item.about)
      formData.append('departmentId', item.departmentId)
      formData.append('hasPublicRating', item.hasPublicRating)
      formData.append('hasPublicTestimonials', item.hasPublicTestimonials)
      formData.append('hasPublicStatistics', item.hasPublicStatistics)
      if (item.pictureUrl && typeof item.pictureUrl !== 'string')
        formData.append('picture', item.pictureUrl)

      const { disciplinesToAdd, disciplinesToRemove } =
        this.getProfessorDisciplinesToAddAndRemove()
      formData.append('disciplinesToAdd', JSON.stringify(disciplinesToAdd))
      formData.append(
        'disciplinesToRemove',
        JSON.stringify(disciplinesToRemove),
      )

      this.fetchingProfessors = true
      const response = await api.updateProfessor(formData)
      if (response.ok) {
        this.$toast.open('Professor updated sucessfully.')
        this.fetchProfessors()
      }
      this.fetchingProfessors = false
    },
    async onRemoveProfessor(item) {
      this.fetchingProfessors = true
      const response = await api.removeProfessor(item.id)
      if (response.ok) {
        this.$toast.open('Professor removed sucessfully.')
        this.fetchProfessors()
      }
      this.fetchingProfessors = false
    },
    openCsvDialog() {
      this.csvFile = null
      this.csvDialogOpen = true
    },
    async onSubmitCsv() {
      if (this.fetchingProfessors) return
      this.fetchingProfessors = true
      const fd = new FormData()
      fd.append('file', this.csvFile)
      const response = await api.addProfessorsViaCsv(fd)
      if (response.ok) {
        this.$toast.open('CSV file uploaded sucessfully.')
        this.fetchProfessors()
      }
      this.csvDialogOpen = false
      this.fetchingProfessors = false
    },
    async fetchProfessorDisciplines(professor) {
      if (!professor.id) return
      this.professorDisciplines = []
      this.fetchingProfessorDisciplines = true
      const response = await api.fetchProfessorDisciplines(professor.id)
      if (response.ok) {
        this.professorDisciplines = response.data
        this.professorOriginalDisciplines = JSON.parse(
          JSON.stringify(response.data),
        )
      }
      this.fetchingProfessorDisciplines = false
    },
    onAddDiscipline({ professorId, departmentIdDisciplineId }) {
      const professorDiscipline = this.professorDisciplines.find(
        (pd) => pd.departmentIdDisciplineId === departmentIdDisciplineId,
      )
      if (professorDiscipline) return
      this.professorDisciplines.push({
        professorId,
        departmentIdDisciplineId,
      })
    },
    onRemoveDiscipline({ professorId, departmentIdDisciplineId }) {
      const professorDiscipline = this.professorDisciplines.find(
        (pd) => pd.departmentIdDisciplineId === departmentIdDisciplineId,
      )
      if (!professorDiscipline) return
      this.professorDisciplines = this.professorDisciplines.filter(
        (pd) => pd.departmentIdDisciplineId !== departmentIdDisciplineId,
      )
    },
    getProfessorDisciplinesToAddAndRemove() {
      const disciplinesToAdd = this.professorDisciplines.filter(
        (pd) =>
          !this.professorOriginalDisciplines.find(
            (pod) =>
              pod.departmentIdDisciplineId === pd.departmentIdDisciplineId,
          ),
      )

      const disciplinesToRemove = this.professorOriginalDisciplines.filter(
        (pod) =>
          !this.professorDisciplines.find(
            (pd) =>
              pd.departmentIdDisciplineId === pod.departmentIdDisciplineId,
          ),
      )

      return { disciplinesToAdd, disciplinesToRemove }
    },
  },
}
</script>
