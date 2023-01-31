<template>
  <div class="crud-table">
    <div class="crud-table-container">
      <q-table
        :selected.sync="selectedRows"
        :title="title"
        :entity="entity"
        :data="computedRows"
        :columns="computedColumns"
        :row-key="rowKey"
        :selection="selection"
        :filter="search"
        :pagination="pagination"
        :loading="loading"
        :dense="dense"
        @selection="(e) => $emit('onSelect', e)"
      >
        <!-- Using q-table slot #top (title, add button, search, etc) -->
        <template #top>
          <h3 class="text-lg" style="margin-right: 1rem">{{ title }}</h3>
          <span v-if="showCreateButton">
            <q-btn
              color="primary"
              :label="`${createLabel} ${entity}`"
              size="md"
              outline
              :disabled="!allowCreate"
              @click="openCreateDialog"
            />
            <q-tooltip v-if="!allowCreate">
              You don't have permission for this operation.
            </q-tooltip>
          </span>
          <!-- Slot for additional buttons -->
          <slot></slot>
          <q-space />
          <q-btn
            icon="mdi-tune"
            size="md"
            flat
            round
            style="margin-right: 0.5rem"
            @click="openOptionsDialog"
          />
          <q-input v-model="search" dense placeholder="Search">
            <template #append>
              <q-icon name="mdi-magnify" />
            </template>
          </q-input>
        </template>

        <!-- Format table headers
          If the column has prop type == image, a image will be displayed.
          Else render other cells normally.
        -->
        <template #header-cell="props">
          <div
            v-if="visibleColumns.includes(props.col.name)"
            class="header-cell"
            :class="{ 'has-header-filters': props.col.headerFilter.show }"
          >
            <div class="flex items-center flex-nowrap">
              <q-th :props="props" :sortable="false">
                {{ props.col.label }}
              </q-th>
              <HeaderFilter
                v-if="props.col.headerFilter.show"
                :filters.sync="headerFilters[props.col.name]"
                :show-default-filters="props.col.headerFilter.defaultFilters"
                :type="props.col.type"
              />
            </div>
          </div>
        </template>

        <!-- Format table cells
          If the column has prop type == image, a image will be displayed.
          Else render other cells normally.
        -->
        <template #body-cell="props">
          <q-td
            v-if="visibleColumns.includes(props.col.name)"
            :props="props"
            :auto-width="props.col.autoWidth"
          >
            <template v-if="props.col.type == 'image'">
              <img
                v-if="props.col.field(props.row)"
                :src="props.col.field(props.row)"
                class="cell-image"
              />
            </template>
            <template v-else>
              {{ props.col.format(props.col.field(props.row)) }}
            </template>
            <slot :name="`body-cell-${props.col.name}`" v-bind="props"></slot>
          </q-td>
        </template>

        <!-- Add action buttons to table -->
        <template #body-cell-action="{ row }">
          <q-td :auto-width="true">
            <div class="text-center mr-3">
              <slot name="actions" v-bind="{ row }"></slot>

              <span v-if="showUpdateButton">
                <q-btn
                  icon="mdi-pencil"
                  flat
                  dense
                  round
                  size="sm"
                  :disable="!allowUpdate"
                  @click="() => openUpdateDialog(row)"
                />
                <q-tooltip v-if="!allowUpdate">
                  You don't have permission for this operation.
                </q-tooltip>
              </span>

              <span v-if="showDeleteButton">
                <q-btn
                  icon="mdi-delete"
                  flat
                  dense
                  round
                  size="sm"
                  :disable="!allowDelete"
                  @click="() => openDeleteDialog(row)"
                />
                <q-tooltip v-if="!allowDelete">
                  You don't have permission for this operation.
                </q-tooltip>
              </span>
            </div>
          </q-td>
        </template>

        <!-- Bottom table slot -->
        <template #bottom="props">
          <div class="w-full flex items-center justify-around">
            <div class="w-3/12">
              <div
                v-if="selectedRows.length > 0 && allowSelectionDelete"
                class="flex items-center"
              >
                <div class="mr-2">{{ selectedRows.length }} rows selected.</div>
                <span>
                  <q-btn
                    icon="mdi-delete"
                    flat
                    dense
                    round
                    size="sm"
                    :disable="!allowDelete"
                    @click="openMultipleDeleteDialog"
                  />
                  <q-tooltip v-if="!allowDelete">
                    You don't have permission for this operation.
                  </q-tooltip>
                </span>
              </div>
            </div>
            <div class="flex w-6/12 justify-center">
              <q-pagination
                v-model="props.pagination.page"
                color="primary"
                dense
                :max="props.pagesNumber <= 10 ? props.pagesNumber : 10"
                :max-pages="props.pagesNumber"
                :boundary-numbers="true"
              />
            </div>
            <div class="w-3/12 flex items-center justify-end">
              <q-select
                v-model="props.pagination.rowsPerPage"
                dense
                :options="[5, 10, 15, 25, 50, 100, 200, 1000]"
                label="Rows Per Page"
                class="w-28"
              />
            </div>
          </div>
        </template>
      </q-table>

      <CrudForm
        :open.sync="dialogOpen"
        :state="dialogState"
        :item="item"
        :default-item="defaultItem"
        :columns="columns"
        :entity="entity"
        :size="formSize"
        :selected-rows="selectedRows"
        :row-key="rowKey"
        :createLabel="createLabel"
        :actionBtnLabel="actionBtnLabel"
        @onCreate="(model) => $emit('onCreate', model)"
        @onUpdate="(model) => $emit('onUpdate', model)"
        @onDelete="(model) => $emit('onDelete', model)"
        @onMultipleDelete="() => $emit('onMultipleDelete', selected)"
        @onModelChange="(model) => $emit('onModelChange', model)"
      >
        <!-- Form slot, can be overriden -->
        <template #form="{ state, model, validateForm, submited }">
          <slot
            name="form"
            v-bind="{ state, model, validateForm, submited }"
          ></slot>
        </template>
      </CrudForm>

      <CrudOptions
        :open.sync="optionsDialogOpen"
        :cache="cache"
        @onUpdate="updateCache"
      />
    </div>
  </div>
</template>

<script>
import CrudForm from './crud-form.vue'
import CrudOptions from './crud-options.vue'
import HeaderFilter from './header-filter.vue'

export default {
  components: {
    CrudForm,
    CrudOptions,
    HeaderFilter,
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    entity: {
      type: String,
      default: '',
    },
    cacheKey: {
      type: String,
      default: null,
    },
    rows: {
      type: Array,
      default: () => [],
    },
    columns: {
      type: Array,
      default: () => [],
    },
    selected: {
      type: Array,
      default: () => [],
    },
    rowKey: {
      type: [String, Function],
      default: 'id',
    },
    selection: {
      type: String,
      default: 'none',
    },
    formSize: {
      type: String,
      default: 'md', // sm, md, lg
    },
    pagination: {
      type: Object,
      default: () => ({
        sortBy: null,
        descending: false,
        page: 1,
        rowsPerPage: 15,
      }),
    },
    loading: {
      type: Boolean,
      default: false,
    },
    allowCreate: {
      type: Boolean,
      default: false,
    },
    allowUpdate: {
      type: Boolean,
      default: false,
    },
    allowDelete: {
      type: Boolean,
      default: false,
    },
    allowSelectionDelete: {
      type: Boolean,
      default: true,
    },
    showCreateButton: {
      type: Boolean,
      default: true,
    },
    showUpdateButton: {
      type: Boolean,
      default: true,
    },
    showDeleteButton: {
      type: Boolean,
      default: true,
    },
    dense: {
      type: Boolean,
      default: true,
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
    'update:selected',
    'onCreate',
    'onUpdate',
    'onDelete',
    'onMultipleDelete',
  ],
  data() {
    return {
      item: null,
      defaultItem: {},
      headerFilters: {},
      dialogOpen: false,
      dialogState: 'create',
      search: '',
      optionsDialogOpen: false,
      cache: {
        visibleColumns: [],
      },
    }
  },
  computed: {
    selectedRows: {
      get() {
        return this.selected
      },
      set(v) {
        this.$emit('update:selected', v)
      },
    },
    computedRows() {
      const appliedFilters = this.getHeaderFiltersApplied()
      if (!appliedFilters) return this.rows

      let computedRows = JSON.parse(JSON.stringify(this.rows))

      appliedFilters.map((filter) => {
        computedRows = computedRows.filter((row) =>
          filter.expr(row[filter.col]),
        )
      })

      return computedRows
    },
    computedColumns() {
      return [
        ...this.columns,
        { name: 'action', label: 'Actions', align: 'center', field: 'action' },
      ]
    },
    visibleColumns() {
      const v = this.cache.visibleColumns
        .filter((col) => col.visible)
        .map((col) => col.name)
      return v
    },
  },
  mounted() {
    this.loadCache()

    // Derive default item from columns options
    this.defaultItem = Object.fromEntries(
      this.columns.map((col) => [col.name, col.form.default]),
    )

    // Get columns headerFilters
    this.headerFilters = Object.fromEntries(
      this.columns.map((col) => [col.name, col.headerFilter.customFilters]),
    )
  },
  methods: {
    openCreateDialog() {
      this.item = JSON.parse(JSON.stringify(this.defaultItem))
      this.$emit('onOpenCreateDialog', this.item)
      this.dialogState = 'create'
      this.dialogOpen = true
    },
    openUpdateDialog(item) {
      this.item = JSON.parse(JSON.stringify(item)) // deep copy
      this.$emit('onOpenUpdateDialog', this.item)
      this.dialogState = 'update'
      this.dialogOpen = true
    },
    openDeleteDialog(item) {
      this.item = JSON.parse(JSON.stringify(item)) // deep copy
      this.$emit('onOpenDeleteDialog', this.item)
      this.dialogState = 'delete'
      this.dialogOpen = true
    },
    openMultipleDeleteDialog() {
      this.dialogState = 'multiple-delete'
      this.dialogOpen = true
    },
    openOptionsDialog() {
      this.optionsDialogOpen = true
    },
    getHeaderFiltersApplied() {
      const appliedFilters = []
      Object.keys(this.headerFilters).map((col) =>
        this.headerFilters[col].map((filter) => {
          if (filter.applied)
            appliedFilters.push({ col: col, expr: filter.expr })
        }),
      )
      return appliedFilters
    },
    loadCache() {
      // Default visible columns
      const visibleCols = this.columns.map((col) => ({
        name: col.name,
        label: col.label,
        visible: col.visible,
      }))

      const cacheRaw = localStorage.getItem(this.cacheKey)

      // Create cache if it does not exist
      if (!cacheRaw) {
        this.updateCache({ visibleColumns: visibleCols })
      } else {
        this.cache = JSON.parse(cacheRaw)
      }

      // Check if columns have changed, if so, update cache
      const cols = visibleCols.map((col) => col.name).sort()
      const cachedCols = this.cache.visibleColumns.map((col) => col.name).sort()
      if (JSON.stringify(cols) !== JSON.stringify(cachedCols)) {
        this.updateCache({ visibleColumns: visibleCols })
      }
    },
    updateCache(props) {
      const newCache = { ...this.cache, ...props }
      this.cache = newCache
      localStorage.setItem(this.cacheKey, JSON.stringify(newCache))
    },
  },
  watch: {
    columns: {
      handler() {
        this.loadCache()

        // Derive default item from columns options
        this.defaultItem = Object.fromEntries(
          this.columns.map((col) => [col.name, col.form.default]),
        )

        // Get columns headerFilters
        this.headerFilters = Object.fromEntries(
          this.columns.map((col) => [col.name, col.headerFilter.customFilters]),
        )
      },
      deep: false,
    },
  },
}
</script>

<style lang="postcss">
.crud-table {
  .crud-table-container {
    .q-table__container {
      @apply shadow-none;

      tr {
        th {
          border-bottom: 0;
        }

        &:first-child {
          td {
            border-top: solid 1px rgba(0, 0, 0, 0.1);
          }
        }

        .header-cell {
          @apply table-cell h-full;

          &.has-header-filters {
            padding-top: 15px;

            th {
              padding-right: 0.1rem;
            }
          }
        }
      }

      .cell-image {
        @apply w-5 h-5;

        min-width: 1.25rem;
      }

      .q-table tbody tr.selected {
        background: #eaf3fd;
      }

      .q-checkbox__inner--truthy {
        .q-checkbox__bg {
          background: #6a96c7 !important;
        }
      }
    }
  }
}
</style>
