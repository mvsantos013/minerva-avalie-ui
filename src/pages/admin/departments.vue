<template>
  <div class="container mt-5 bg-white rounded-md">
    <div class="flex">
      <div class="flex-grow p-3 pb-10">
        <div class="flex flex-col">
          <CrudTable
            title="Departments"
            entity="Department"
            cache-key="admin-departments"
            row-key="id"
            selection="none"
            form-size="md"
            dense
            :rows="departments"
            :columns="columns"
            :loading="fetchingDepartments"
            :allow-create="userHasPermission('create:departments')"
            :allow-update="userHasPermission('update:departments')"
            :allow-delete="userHasPermission('delete:departments')"
            :allowSelectionDelete="false"
            :pagination="{
              sortBy: 'id',
              descending: false,
              page: 1,
              rowsPerPage: 30,
            }"
            @onCreate="onAddDepartment"
            @onUpdate="onUpdateDepartment"
            @onDelete="onRemoveDepartment"
          >
            <q-btn
              color="primary"
              label="Add from CSV"
              size="md"
              outline
              :disabled="!userHasPermission('create:departments')"
              @click="openCsvDialog"
              class="ml-3"
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
          Carregar departamentos via CSV
        </div>

        <div class="px-4">
          <h5 class="font-bold">Colunas do arquivo</h5>
          <div>name (string)</div>
          <div class="mt-2 italic text-xs">
            O ID do departamento é calculado automaticamente. Ex: Instituto de
            Computação resulta no ID instituto-de-computacao. <br />
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
                :disable="!csvFile || fetchingDepartments"
                :loading="fetchingDepartments"
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
import { slugify } from '@/utils/utils'
import api from '@/utils/api/api'
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
      departments: [],
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
            editable: '',
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
            onChange: (value, model) => {
              model.id = slugify(model.name)
            },
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
    async onAddDepartment(item) {
      this.fetchingDepartments = true
      const response = await api.addDepartment(item)
      if (response.ok) {
        this.$toast.open('Department added sucessfully.')
        this.fetchDepartments()
      }
      this.fetchingDepartments = false
    },
    async onUpdateDepartment(item) {
      this.fetchingDepartments = true
      const response = await api.updateDepartment(item)
      if (response.ok) {
        this.$toast.open('Department updated sucessfully.')
        this.fetchDepartments()
      }
      this.fetchingDepartments = false
    },
    async onRemoveDepartment(item) {
      this.fetchingDepartments = true
      const response = await api.removeDepartment(item.id)
      if (response.ok) {
        this.$toast.open('Department removed sucessfully.')
        this.fetchDepartments()
      }
      this.fetchingDepartments = false
    },
    openCsvDialog() {
      this.csvFile = null
      this.csvDialogOpen = true
    },
    async onSubmitCsv() {
      if (this.fetchingDepartments) return
      this.fetchingDepartments = true
      const fd = new FormData()
      fd.append('file', this.csvFile)
      const response = await api.addDepartmentsViaCsv(fd)
      if (response.ok) {
        this.$toast.open('CSV file uploaded sucessfully.')
        this.fetchDepartments()
      }
      this.csvDialogOpen = false
      this.fetchingDepartments = false
    },
  },
}
</script>
