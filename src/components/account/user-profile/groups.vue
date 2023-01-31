<template>
  <div class="flex items-center">
    <div class="w-2/12">Groups</div>
    <div class="w-4/12">
      <q-badge
        v-for="(groupId, index) in userGroups"
        :key="index"
        color="accent"
        class="mr-2"
      >
        {{ getGroupName(groupId) }}
      </q-badge>
    </div>
    <div class="w-6/12"></div>
  </div>
</template>

<script>
import { get } from 'vuex-pathify'
export default {
  props: {
    userGroups: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    groups: get('auth/groups'),
  },
  methods: {
    getGroupName(id) {
      const group = this.groups.find((group) => group.id === id)
      return group ? group.name : id
    },
  },
}
</script>
