<template>
  <section class="pb-6">
    <div class="app-title">Depoimentos</div>
    <div
      v-for="testimony in testimonials"
      :key="testimony.id"
      class="flex flex-nowrap items-center rounded-md p-3 mb-3 bg-white shadow-sm"
    >
      <div class="flex flex-nowrap">
        <div class="flex-col" :style="'min-width: 12rem'">
          <h5 class="font-medium">
            {{ testimony.studentDetails.name }}
          </h5>
          <p class="text-gray-600">{{ testimony.text }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    testimonials: {
      type: Array,
      default: () => [],
    },
  },
}
</script>
