<template>
  <div class="flex items-center">
    <div class="w-2/12">Email</div>
    <div class="w-4/12">{{ email }}</div>
    <div class="w-6/12"></div>
  </div>
</template>

<script>
export default {
  props: {
    email: {
      type: String,
      default: null,
    },
  },
}
</script>
