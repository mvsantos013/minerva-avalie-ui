<template>
  <div>
    <div v-for="(item, index) in paginatedItems" :key="index" class="mb-4">
      <!-- render component passed as slot -->
      <slot v-bind="item" />
    </div>

    <div v-if="items.length > itemsPerPage" class="flex justify-center">
      <q-pagination
        v-model="currentPage"
        :max="Math.ceil(items.length / itemsPerPage)"
        :max-pages="6"
        boundary-numbers
        direction-links
        color="primary-300"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    itemsPerPage: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      currentPage: 1,
    }
  },
  computed: {
    paginatedItems() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.items.slice(start, end)
    },
  },
}
</script>
