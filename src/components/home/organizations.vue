<template>
  <div class="container">
    <div
      class="text-lg tracking-wide text-center lg:text-left w-full lg:w-auto mb-3"
    >
      Instituição
    </div>
    <div
      class="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-5 px-5 lg:px-0"
    >
      <Organization
        v-for="org in organizations"
        :key="org.id"
        :organization="org"
        :active="selectedOrganizationId === org.id"
        :loading="fetchingOrganizations"
        @click="$emit('onSelect', org.id)"
      >
        {{ org.name }}
      </Organization>
    </div>
  </div>
</template>

<script>
import Organization from '@/components/home/organization.vue'

export default {
  components: {
    Organization,
  },
  props: {
    selectedOrganizationId: {
      type: String,
      default: '',
    },
    organizations: {
      type: Array,
      default: () => [],
    },
    fetchingOrganizations: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="postcss" scoped>
.hovering {
  transition: all 0.2s ease-in-out;
  border: solid 2px #f0f0f0;
  background-image: red;

  &:hover {
    border: solid 2px #dadada;
  }
}

.active {
  /* stylelint-disable-next-line */
  background-image: linear-gradient(
    30deg,
    hsl(211deg 27% 44%) 0%,
    hsl(211deg 27% 45%) 11%,
    hsl(210deg 27% 47%) 22%,
    hsl(210deg 27% 49%) 33%,
    hsl(209deg 28% 51%) 44%,
    hsl(209deg 30% 52%) 56%,
    hsl(208deg 33% 54%) 67%,
    hsl(208deg 35% 56%) 78%,
    hsl(207deg 38% 58%) 89%,
    hsl(207deg 41% 59%) 100%
  );
  color: white;
}
</style>
