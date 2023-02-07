<template>
  <div class="flex items-center">
    <div class="w-2/12">Simulated Group</div>
    <div class="w-4/12">
      <q-select
        v-model="model"
        :options="groups.map((g) => g.id)"
        label="Simulated Group"
        dense
        clearable
        @input="(value) => $emit('onUpdate', value)"
      />
    </div>
    <div class="w-6/12"></div>
  </div>
</template>

<script>
import { get } from 'vuex-pathify'
export default {
  props: {
    simulatedGroup: {
      type: String,
      default: null,
    },
  },
  emits: ['onUpdate'],
  data() {
    return {
      model: null,
    }
  },
  computed: {
    groups: get('auth/groups'),
  },
  mounted() {
    this.model = this.simulatedGroup
  },
}
</script>
