<template>
  <div>
    <q-table
      :data="items"
      :columns="headers"
      :pagination="{ rowsPerPage: 15 }"
      dense
      flat
      table-header-class="bg-primary-100"
      style="text-align: left !important"
    >
      <template #body-cell="props">
        <q-td :props="props" :auto-width="props.col.autoWidth">
          {{
            props.col.format
              ? props.col.format(props.row[props.col.field])
              : props.row[props.col.field]
          }}
          <q-popup-edit v-if="allowEdit" v-model="props.row[props.col.field]">
            <q-input
              v-model="props.row[props.col.field]"
              dense
              autofocus
              counter
            />
          </q-popup-edit>
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    columns: {
      type: Array,
      default: () => [],
    },
    schema: {
      type: Array,
      default: () => [],
    },
    errors: {
      type: Object,
      default: () => {},
    },
    allowEdit: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    headers() {
      return this.schema.map((h) => ({
        ...h,
        format: h.field.includes('erro_') ? this.formatErrors : h.format,
      }))
    },
  },
  methods: {
    formatErrors(v) {
      return this.errors.hasOwnProperty(v) ? this.errors[v] : v
    },
  },
}
</script>
