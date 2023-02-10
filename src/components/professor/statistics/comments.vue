<template>
  <div>
    <div class="text-gray-500 mb-2">
      Comentários dos estudantes por categoria
    </div>

    <q-tabs
      v-model="tab"
      dense
      class="text-gray-600"
      active-color="primary"
      indicator-color="primary"
      align="left"
      narrow-indicator
    >
      <q-tab
        v-for="category in ratingCategories"
        :key="category.id"
        :name="category.id"
        :label="category.name"
      />
    </q-tabs>

    <q-tab-panels
      v-model="tab"
      class="bg-transparent"
      animated
      :style="'min-height: 30rem'"
    >
      <q-tab-panel
        v-for="category in ratingCategories"
        :key="category.id"
        :name="category.id"
      >
        <div v-if="studentsCommentsGroupedByCategory[category.id].length">
          <div
            v-for="(comment, index) in studentsCommentsGroupedByCategory[
              category.id
            ]"
            :key="index"
            class="flex flex-nowrap items-center rounded-md p-3 mb-3 bg-white shadow-sm"
          >
            <div class="w-full" :style="'min-height: 3rem'">
              <p class="text-gray-600">{{ comment }}</p>
            </div>
          </div>
        </div>
        <div v-else>Não há comentários para esta categoria</div>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script>
export default {
  props: {
    ratingCategories: {
      type: Array,
      default: () => [],
    },
    studentsCommentsGroupedByCategory: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      tab: 'didactic',
    }
  },
}
</script>
