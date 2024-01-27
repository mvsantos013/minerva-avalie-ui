<template>
  <div class="container mt-5 bg-white rounded-md">
    <div class="flex">
      <div class="flex-grow p-3 pb-10">
        <div class="flex flex-col">
          <CrudTable
            title="Questions"
            entity="Question"
            cache-key="admin-questions"
            row-key="id"
            selection="none"
            form-size="md"
            dense
            :rows="questions"
            :columns="columns"
            :loading="fetchingQuestions"
            :allow-create="userHasPermission('manage:questions')"
            :allow-update="userHasPermission('manage:questions')"
            :allow-delete="userHasPermission('manage:questions')"
            :allowSelectionDelete="false"
            :pagination="{
              sortBy: 'id',
              descending: false,
              page: 1,
              rowsPerPage: 30,
            }"
            @onCreate="onAddQuestion"
            @onUpdate="onUpdateQuestion"
            @onDelete="onRemoveQuestion"
          />
        </div>
      </div>
      <div class="flex-shrink py-3 border-l" style="min-width: 16rem">
        <Menu :items="pages" />
      </div>
    </div>
  </div>
</template>

<script>
import { get } from 'vuex-pathify'
import { getPropValue } from '@/utils/utils'
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
      questions: [],
      fetchingQuestions: false,
      types: [
        { id: 'discipline', name: 'Disciplina' },
        { id: 'professor', name: 'Professor' },
      ],
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
            visible: 'update|delete',
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
          name: 'title',
          label: 'Title',
          align: 'left',
          field: (row) => row.title,
          format: (val) => `${val}`,
          sortable: true,
          visible: true,
          type: 'string',
          form: {
            visible: 'create|update|delete',
            editable: 'create|update',
            default: null,
            placeholder: null,
            label: 'Title',
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
          style: 'max-width: 20rem; overflow: hidden',
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
        {
          name: 'type',
          label: 'Type',
          align: 'left',
          field: (row) => row.type,
          format: (val) => getPropValue(val, 'id', 'name', this.types),
          sortable: true,
          visible: true,
          type: 'string',
          form: {
            visible: 'create|update|delete',
            editable: 'create',
            default: null,
            placeholder: null,
            label: 'Type',
            validations: 'required',
            input: 'select',
            selectOptions: this.types,
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
          name: 'questionType',
          label: 'Question Format',
          align: 'left',
          field: (row) => row.questionType,
          format: (val) => `${val}`,
          sortable: true,
          visible: true,
          type: 'string',
          form: {
            visible: 'create|update|delete',
            editable: 'create|update',
            default: null,
            placeholder: null,
            label: 'Question Format',
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
          name: 'active',
          label: 'Active',
          align: 'left',
          field: (row) => row.active,
          format: (val) => `${val}`,
          sortable: true,
          visible: true,
          type: 'string',
          form: {
            visible: 'create|update|delete',
            editable: 'create|update',
            default: false,
            placeholder: null,
            label: 'Active',
            validations: '',
            input: 'radio-boolean',
          },
          headerFilter: {
            show: true,
            defaultFilters: true,
            customFilters: [],
          },
        },
        {
          name: 'order',
          label: 'Order',
          align: 'left',
          field: (row) => row.order,
          format: (val) => `${val}`,
          sortable: true,
          visible: true,
          type: 'number',
          form: {
            visible: 'create|update|delete',
            editable: 'create|update',
            default: false,
            placeholder: null,
            label: 'Order',
            validations: '',
            input: 'number',
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
    await this.fetchQuestions()
  },
  methods: {
    async fetchQuestions() {
      this.fetchingQuestions = true
      const response = await api.fetchQuestions()
      if (response.ok) {
        this.questions = response.data
      }
      this.fetchingQuestions = false
    },
    async onAddQuestion(item) {
      this.fetchingQuestions = true
      const response = await api.addQuestion(item)
      if (response.ok) {
        this.$toast.open('Question added sucessfully.')
        this.fetchQuestions()
      }
      this.fetchingQuestions = false
    },
    async onUpdateQuestion(item) {
      this.fetchingQuestions = true
      const response = await api.updateQuestion(item)
      if (response.ok) {
        this.$toast.open('Question updated sucessfully.')
        this.fetchQuestions()
      }
      this.fetchingQuestions = false
    },
    async onRemoveQuestion(item) {
      this.fetchingQuestions = true
      const response = await api.removeQuestion(item.id)
      if (response.ok) {
        this.$toast.open('Question removed sucessfully.')
        this.fetchQuestions()
      }
      this.fetchingQuestions = false
    },
  },
}
</script>
