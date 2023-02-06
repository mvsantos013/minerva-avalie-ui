<template>
  <div class="flex items-center mb-3">
    <div class="w-2/12">Nome exibido</div>
    <div class="w-4/12">
      <q-card-section class="max-w-xs py-0">
        <q-select
          v-model="newDisplayName"
          :options="['name', 'email']"
          label="Nome exibido"
          @input="$emit('onUpdate', newDisplayName)"
        />
      </q-card-section>
    </div>
    <div class="w-6/12"></div>
  </div>
</template>

<script>
export default {
  props: {
    userPreferences: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      newDisplayName: null,
    }
  },
  watch: {
    userPreferences: {
      handler(newValue) {
        this.newDisplayName = newValue.displayName
      },
      deep: true,
    },
  },
  mounted() {
    this.newDisplayName = this.userPreferences.displayName
  },
}
</script>
