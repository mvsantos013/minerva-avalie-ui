<template>
  <div
    v-if="!loading"
    class="hovering cursor-pointer shadow-sm rounded-md p-3"
    :class="{
      active: active,
      'shadow-md': active,
    }"
    @click="$emit('click', organization.id)"
  >
    {{ organization.name }}
  </div>
  <q-skeleton v-else type="rect" class="w-full h-11"></q-skeleton>
</template>

<script>
export default {
  props: {
    organization: {
      type: Object,
      default: () => {},
    },
    active: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
