<template>
  <div class="flex items-center">
    <div class="w-2/12">Username</div>
    <div class="w-4/12">{{ username }}</div>
    <div class="w-6/12">
      <q-btn
        color="primary"
        outline
        size="sm"
        @click="openDialogUpdateUsername"
      >
        Atualizar
      </q-btn>
    </div>

    <q-dialog v-model="dialogUpdateUsername">
      <q-card class="w-6/12 h-60">
        <q-card-section>
          <div class="text-h6">Set your username</div>
        </q-card-section>

        <q-card-section class="max-w-sm py-0">
          <q-input
            v-model="newUsername"
            autofocus
            label="Username"
            :rules="[
              (val) => !!val || '* Field is required',
              (val) =>
                val.length > 2 || 'Field must have at least 3 characters',
            ]"
          />
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn
            v-close-popup
            flat
            label="Save"
            color="primary"
            @click="$emit('onUpdate', newUsername)"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  props: {
    username: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      dialogUpdateUsername: false,
      newUsername: null,
    }
  },
  methods: {
    openDialogUpdateUsername() {
      this.newUsername = this.username
      this.dialogUpdateUsername = true
    },
  },
}
</script>
