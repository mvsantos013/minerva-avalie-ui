<template>
  <li class="hovering mb-5 cursor-pointer rounded-md">
    <router-link
      :to="`/orgs/${organizationId}/disciplines/${discipline.id}`"
      :is="loading ? 'span' : 'router-link'"
    >
      <div
        class="flex flex-col lg:flex-row lg:flex-nowrap items-center bg-white shadow-md rounded-md p-3 hover:bg-gray-300"
      >
        <h3 class="font-medium text-center lg:text-left leading-tight py-3">
          {{ discipline.name }}
        </h3>
        <div v-if="!discipline.name" class="w-full py-3">
          <q-skeleton
            type="text"
            :width="`${Math.floor(Math.random() * 20) + 70}%`"
          />
        </div>
      </div>
    </router-link>
  </li>
</template>

<script>
export default {
  props: {
    discipline: {
      type: Object,
      default: () => ({}),
    },
    organizationId: {
      type: String,
      default: '',
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="postcss" scoped>
.hovering {
  transition: all 0.2s ease-in-out;
  border: solid 2px transparent;

  &:hover {
    border: solid 2px #dadada;
  }
}
</style>
