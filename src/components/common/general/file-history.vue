<template>
  <div>
    <div class="flex flex-nowrap items-center mb-5">
      <div class="tracking-wider text-gray-600">{{ title }}</div>
      <slot></slot>
    </div>
    <q-table
      :data="files"
      :columns="columns"
      :loading="loading"
      :pagination="{
        sortBy: 'date',
        rowsPerPage: rowsPerPage,
        descending: true,
      }"
      dense
      flat
      table-header-class="bg-primary-100"
    >
      <q-td slot="body-cell-fund_id" slot-scope="props" :props="props">
        <span v-if="props.row.funds_ids" class="grid grid-cols-5">
          <span v-for="f in props.row.funds_ids.split(',')" :key="f">
            {{ getFundTicker(f) }}
          </span>
        </span>
        <span v-else>{{ getFundTicker(props.row.fund_id) }}</span>
      </q-td>

      <q-td slot="body-cell-id" slot-scope="props" :props="props">
        <span v-if="allowPreview">
          <q-icon
            name="mdi-eye-outline"
            size="xs"
            @click="$emit('onPreview', props.row.id)"
            class="mr-3 cursor-pointer text-primary-500 hover:text-primary-700"
          />
          <q-tooltip>Preview</q-tooltip>
        </span>

        <span v-if="allowDownload">
          <q-icon
            name="mdi-download-outline"
            size="xs"
            @click="
              () => {
                loading
                  ? null
                  : $emit(
                      'onDownload',
                      emitAllValues ? props.row : props.row.id,
                    )
              }
            "
            class="cursor-pointer text-primary-500 hover:text-primary-700"
          >
          </q-icon>
          <q-tooltip>Download</q-tooltip>
        </span>

        <span class="ml-8" v-if="allowPublish">
          <q-icon
            name="mdi-send-outline"
            @click="
              $emit('onPublish', {
                date: props.row.date,
                fileId: props.row.id,
              })
            "
            class="cursor-pointer text-primary-500 hover:text-primary-700"
            style="transform: rotate(-35deg)"
          />

          <q-tooltip> Publish </q-tooltip>
        </span>

        <slot name="custom-actions" v-bind="props"></slot>
      </q-td>
    </q-table>
  </div>
</template>

<script>
import { get } from 'vuex-pathify'

export default {
  props: {
    title: {
      type: String,
      default: null,
    },
    dateColumnLabel: {
      type: String,
      default: 'Date',
    },
    files: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
    showCreatedAtColumn: {
      type: Boolean,
      default: true,
    },
    showCreatedByColumn: {
      type: Boolean,
      default: true,
    },
    showFundIdColumn: {
      type: Boolean,
      default: false,
    },
    showDateColumn: {
      type: Boolean,
      default: true,
    },
    allowPreview: {
      type: Boolean,
      default: false,
    },
    allowDownload: {
      type: Boolean,
      default: true,
    },
    allowPublish: {
      type: Boolean,
      default: false,
    },
    emitAllValues: {
      type: Boolean,
      default: false,
    },
    rowsPerPage: {
      type: Number,
      default: 10,
    },
  },
  computed: {
    funds: get('funds/funds'),
    tfsFunds: get('funds/tfsFunds'),
    columns() {
      const columns = []
      if (this.showFundIdColumn)
        columns.push({
          name: 'fund_id',
          label: 'Fund',
          field: 'fund_id',
          align: 'left',
          sortable: true,
        })

      if (this.showCreatedAtColumn)
        columns.push({
          name: 'created_at',
          label: 'Created At',
          field: 'created_at',
          align: 'left',
          sortable: true,
          format: (e) => this.$options.filters.date(e, 'YYYY-MM-DD HH:mm:ss'),
        })

      if (this.showDateColumn)
        columns.push({
          name: 'date',
          label: this.dateColumnLabel,
          field: 'date',
          align: 'left',
          sortable: true,
        })

      if (this.showCreatedByColumn)
        columns.push({
          name: 'username',
          label: 'Created By',
          field: 'username',
          align: 'left',
          sortable: true,
        })

      columns.push(
        ...[
          {
            name: 'id',
            label: '',
            field: 'id',
            align: 'left',
            sortable: false,
          },
          {
            name: 'custom-actions',
            label: '',
            field: 'custom-actions',
            align: 'left',
            sortable: false,
          },
        ],
      )

      return columns
    },
    fundTickers() {
      const allFunds = [
        ...this.funds,
        ...this.tfsFunds,
        { id: 'all', ticker: 'All' },
      ]
      return Object.fromEntries(allFunds.map((x) => [x.id, x.ticker]))
    },
  },
  methods: {
    getFundTicker(id) {
      const f = this.funds.find((x) => x.id === id)
      if (f) return f.ticker
      else return ''
    },
  },
}
</script>
