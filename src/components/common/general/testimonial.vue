<template>
  <div class="flex flex-nowrap w-full">
    <div class="flex-col w-full" :style="'min-width: 12rem'">
      <div class="flex items-center w-full">
        <h5 class="font-medium">
          {{ testimonial.anonymous ? 'Anônimo' : testimonial.studentName }}
        </h5>
        <span class="ml-2 text-xs text-gray-600">
          (Docente {{ professorName }})
        </span>
        <q-space></q-space>
        <span class="ml-2 text-xs text-gray-400">
          <div v-if="testimonial.updatedAt">
            {{ testimonial.updatedAt | date('DD/MM/YYYY [às] HH:mm') }}
            (editado)
          </div>
          <div v-else>
            {{ testimonial.createdAt | date('DD/MM/YYYY [às] HH:mm:ss') }}
          </div>
        </span>
        <a v-if="showSource" :href="sourcePath" target="_blank">
          <q-btn
            icon="mdi-open-in-new"
            color="primary"
            size="sm"
            dense
            flat
            class="ml-1"
          >
          </q-btn>
        </a>
        <q-btn
          v-if="canApprove"
          icon="mdi-thumb-up"
          color="primary"
          size="sm"
          dense
          flat
          class="ml-1"
          :disable="!canApprove"
          @click="$emit('onApprove')"
        >
        </q-btn>
        <q-btn
          v-if="canEdit"
          icon="mdi-pencil"
          color="primary"
          size="sm"
          dense
          flat
          :disable="!canEdit"
          @click="$emit('onEdit')"
        >
        </q-btn>
        <q-btn
          v-if="canDelete"
          icon="mdi-delete"
          color="primary"
          size="sm"
          dense
          flat
          class="ml-1"
          :disable="!canDelete || loading"
          @click="$emit('onDelete')"
        >
        </q-btn>
        <q-btn-dropdown
          v-if="canReport"
          icon="mdi-dots-vertical"
          color="primary"
          flat
          dense
          size="sm"
          :disable="loading"
          class="hide-arrow"
        >
          <q-list class="w-52">
            <q-item clickable v-close-popup @click="$emit('onReport')">
              <q-item-section>
                <q-item-label> Denunciar depoimento </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
      <p class="text-gray-600">{{ testimonial.text }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    testimonial: {
      type: Object,
      default: () => ({}),
    },
    canEdit: {
      type: Boolean,
      default: false,
    },
    canDelete: {
      type: Boolean,
      default: false,
    },
    canReport: {
      type: Boolean,
      default: true,
    },
    canApprove: {
      type: Boolean,
      default: false,
    },
    showSource: {
      type: Boolean,
      default: false,
    },
    sourcePath: {
      type: String,
      default: '',
    },
    professorName: {
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
