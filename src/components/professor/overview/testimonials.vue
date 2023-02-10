<template>
  <section class="pb-6">
    <div class="mb-3 flex items-center">
      <div class="text-lg tracking-wide inline-block">Depoimentos</div>
      <span>
        <q-btn
          icon="mdi-plus"
          color="primary"
          size="sm"
          dense
          class="ml-3"
          :disable="
            fetchingTestimonials ||
            submitingTestimonial ||
            !userHasPermission('post-testimonial:professor')
          "
          :loading="submitingTestimonial || fetchingTestimonials"
          @click="openTestimonialDialog('add')"
        ></q-btn>
        <!-- -->
        <q-tooltip v-if="userHasPermission('post-testimonial:professor')">
          Postar depoimento
        </q-tooltip>
        <q-tooltip v-else>
          Você precisa estar conectado e ser um estudante para postar um
          depoimento.
        </q-tooltip>
      </span>
    </div>

    <div
      v-if="
        professor.hasOwnProperty('publicTestimonials') &&
        !professor.publicTestimonials
      "
      class="text-center"
    >
      Os depoimentos deste professor são privados por padrão, o professor deve
      autorizar a publicação dos dados.
    </div>
    <div
      v-else-if="
        !fetchingProfessor && !fetchingTestimonials && testimonials.length === 0
      "
      class="text-center"
    >
      <p class="text-gray-600">Não há depoimentos para este professor.</p>
    </div>

    <div
      v-for="testimonial in items"
      :key="testimonial.id"
      class="flex flex-nowrap items-center rounded-md p-3 mb-3 bg-white shadow-sm"
    >
      <div class="flex flex-nowrap w-full">
        <div class="flex-col w-full" :style="'min-width: 12rem'">
          <div class="flex items-center w-full">
            <h5 class="font-medium">
              {{ testimonial.studentName }}
            </h5>
            <span class="ml-2 text-xs text-gray-400">
              <div v-if="testimonial.updatedAt">
                {{ testimonial.updatedAt | date('DD/MM/YYYY [às] HH:mm') }}
                (editado)
              </div>
              <div v-else>
                {{ testimonial.postedAt | date('DD/MM/YYYY [às] HH:mm:ss') }}
              </div>
            </span>
            <q-space></q-space>
            <q-btn
              v-if="user.id === testimonial.studentId"
              icon="mdi-pencil"
              color="primary"
              size="sm"
              dense
              flat
              :disable="
                submitingTestimonial ||
                !userHasPermission('post-testimonial:professor')
              "
              @click="openTestimonialDialog('edit', testimonial)"
            >
            </q-btn>
            <q-btn
              v-if="user.id === testimonial.studentId"
              icon="mdi-delete"
              color="primary"
              size="sm"
              dense
              flat
              class="ml-1"
              :disable="
                submitingTestimonial ||
                !userHasPermission('post-testimonial:professor')
              "
              @click="openTestimonialDialog('delete', testimonial)"
            >
            </q-btn>
          </div>
          <p class="text-gray-600">{{ testimonial.text }}</p>
        </div>
      </div>
    </div>

    <div
      v-if="!fetchingProfessor && !fetchingTestimonials"
      class="flex flex-center pb-10"
    >
      <q-pagination
        v-model="currentPage"
        :max="numberOfPages"
        :max-pages="6"
        boundary-numbers
        direction-links
      />
    </div>

    <!-- Add/Update testimonial dialog -->
    <q-dialog v-model="dialog.open">
      <q-card class="bg-white" :style="'width: 40rem'">
        <q-card-section class="row items-center">
          <div class="text-h6">
            {{ dialogLabels.title[dialog.state] }} Depoimento
          </div>
          <q-space></q-space>
          <q-btn flat icon="mdi-close" dense v-close-popup></q-btn>
        </q-card-section>
        <q-card-section>
          <q-form @submit.prevent="onSubmit">
            <q-input
              v-model="dialog.testimonial.text"
              label="Depoimento"
              outlined
              type="textarea"
              :disable="dialog.state === 'delete' || submitingTestimonial"
              :rules="[
                (val) =>
                  val?.length > 6 ||
                  'Campo obrigatório com mínimo de 6 caracteres',
              ]"
            ></q-input>
            <div class="flex justify-end mt-1">
              <q-btn
                type="submit"
                :color="dialog.state === 'delete' ? 'negative' : 'primary'"
                :label="dialogLabels.button[dialog.state]"
                :disable="submitingTestimonial"
                :loading="submitingTestimonial"
              ></q-btn>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </section>
</template>

<script>
import { get } from 'vuex-pathify'

export default {
  props: {
    professor: {
      type: Object,
      default: () => ({}),
    },
    testimonials: {
      type: Array,
      default: () => [],
    },
    fetchingProfessor: {
      type: Boolean,
      default: false,
    },
    fetchingTestimonials: {
      type: Boolean,
      default: false,
    },
    submitingTestimonial: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 10,
      dialog: {
        open: false,
        state: 'add',
        testimonial: {},
      },
      dialogLabels: {
        title: {
          add: 'Postar',
          edit: 'Editar',
          delete: 'Excluir',
        },
        button: {
          add: 'Postar',
          edit: 'Atualizar',
          delete: 'Excluir',
        },
      },
    }
  },
  computed: {
    user: get('auth/user'),
    userHasPermission: get('auth/userHasPermission'),
    items() {
      // Paginate items
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.testimonials.slice(start, end)
    },
    numberOfPages() {
      return Math.ceil(this.testimonials.length / this.itemsPerPage)
    },
  },
  methods: {
    openTestimonialDialog(state, testimonial = {}) {
      this.dialog.state = state
      if (testimonial)
        this.dialog.testimonial = JSON.parse(JSON.stringify(testimonial))
      this.dialog.open = true
    },
    onSubmit() {
      if (this.dialog.state === 'add')
        this.$emit('onAddTestimonial', this.dialog.testimonial)
      else if (this.dialog.state === 'edit')
        this.$emit('onEditTestimonial', this.dialog.testimonial)
      else if (this.dialog.state === 'delete')
        this.$emit('onDeleteTestimonial', this.dialog.testimonial)

      this.dialog.text = null
      this.dialog.open = false
    },
  },
}
</script>
