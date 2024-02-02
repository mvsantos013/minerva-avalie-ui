<template>
  <div class="container mt-5 bg-white rounded-md">
    <div class="flex">
      <div class="flex-grow p-3 pb-10">
        <div class="flex flex-col">
          <CrudTable
            title="Disciplines"
            entity="Discipline"
            cache-key="admin-discipline"
            row-key="id"
            selection="none"
            form-size="md"
            dense
            :rows="discipline"
            :columns="columns"
            :loading="fetchingDisciplines"
            :allow-create="userHasPermission('create:discipline')"
            :allow-update="userHasPermission('update:discipline')"
            :allow-delete="userHasPermission('delete:discipline')"
            :allowSelectionDelete="false"
            :pagination="{
              sortBy: 'id',
              descending: false,
              page: 1,
              rowsPerPage: 30,
            }"
            @onCreate="onAddDiscipline"
            @onUpdate="onUpdateDiscipline"
            @onDelete="onRemoveDiscipline"
            :style="'max-width: calc(100vw - 18rem);'"
          >
            <q-btn
              color="primary"
              label="Add from CSV"
              size="md"
              outline
              :disabled="!userHasPermission('create:discipline')"
              @click="openCsvDialog"
              class="ml-3"
            />
            <q-select
              v-model="selectedDepartmentId"
              :options="departments"
              option-label="name"
              option-value="id"
              :emit-value="true"
              :map-options="true"
              :loading="fetchingDepartments"
              :disable="fetchingDepartments"
              label="Departament"
              dense
              class="ml-5"
            />
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
          Carregar disciplinas via CSV
        </div>

        <div class="px-4">
          <h5 class="font-bold">Colunas do arquivo</h5>
          <div>id (string)</div>
          <div>departmentId (string)</div>
          <div>name (string)</div>
          <div>description (string)</div>
          <div class="mt-2 italic text-xs">
            IDs de departamento devem existir na tabela de departamentos, caso
            contrário haverá erro de validação. <br />
            O ID da disciplina é referente ao código da mesma. <br />
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
                :disable="!csvFile || fetchingDisciplines"
                :loading="fetchingDisciplines"
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
import { getPropValue } from '@/utils/utils'
import Menu from '@/components/common/menu/base-menu.vue'
import CrudTable from '@/components/common/table/crud-table/crud-table.vue'
import getSidebar from './sidebar.js'

export default {
  components: {
    Menu,
    CrudTable,
  },
  data() {
    return {
      discipline: [],
      selectedDepartmentId: null,
      departments: [],
      fetchingDisciplines: false,
      fetchingDepartments: false,
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
          visible: true,
          type: 'string',
          form: {
            visible: 'create|update|delete',
            editable: 'create|update',
            default: null,
            placeholder: null,
            label: 'ID',
            validations: 'required',
            input: 'string',
            insertable: true,
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
          visible: false,
          type: 'string',
          style: 'max-width: 25rem; overflow: hidden',
          form: {
            visible: 'create|update|delete',
            editable: 'create|update',
            default: null,
            placeholder: null,
            label: 'Description',
            validations: 'required',
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
  watch: {
    selectedDepartmentId() {
      this.fetchDisciplines()
      localStorage.setItem('selectedDepartmentId', this.selectedDepartmentId)
    },
  },
  async mounted() {
    await this.fetchDepartments()
    const deparmentIdCache = localStorage.getItem('selectedDepartmentId')

    if (deparmentIdCache) {
      // Fetch professors from cache deparment
      this.selectedDepartmentId = deparmentIdCache
      this.fetchDisciplines()
    } else {
      // Fetch departments and then fetch professors from first department
      this.selectedDepartmentId =
        this.departments.length > 0 ? this.departments[0].id : null
      if (this.selectedDepartmentId) this.fetchDisciplines()
    }
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
    async fetchDisciplines() {
      this.fetchingDisciplines = true
      const response = await api.fetchDisciplines(this.selectedDepartmentId)
      if (response.ok) {
        this.discipline = response.data
      }
      this.fetchingDisciplines = false
    },
    async onAddDiscipline(item) {
      this.fetchingDisciplines = true
      const response = await api.addDiscipline(item)
      if (response.ok) {
        this.$toast.open('Discipline added sucessfully.')
        this.fetchDisciplines()
      }
      this.fetchingDisciplines = false
    },
    async onUpdateDiscipline(item) {
      this.fetchingDisciplines = true
      const response = await api.updateDiscipline(item)
      if (response.ok) {
        this.$toast.open('Discipline updated sucessfully.')
        this.fetchDisciplines()
      }
      this.fetchingDisciplines = false
    },
    async onRemoveDiscipline(item) {
      this.fetchingDisciplines = true
      const response = await api.removeDiscipline(item.departmentId, item.id)
      if (response.ok) {
        this.$toast.open('Discipline removed sucessfully.')
        this.fetchDisciplines()
      }
      this.fetchingDisciplines = false
    },
    openCsvDialog() {
      this.csvFile = null
      this.csvDialogOpen = true
    },
    async onSubmitCsv() {
      if (this.fetchingDisciplines) return
      this.fetchingDisciplines = true
      const fd = new FormData()
      fd.append('file', this.csvFile)
      const response = await api.addDisciplinesViaCsv(fd)
      if (response.ok) {
        this.$toast.open('CSV file uploaded sucessfully.')
        this.fetchDisciplines()
      }
      this.csvDialogOpen = false
      this.fetchingDisciplines = false
    },
  },
}
</script>
