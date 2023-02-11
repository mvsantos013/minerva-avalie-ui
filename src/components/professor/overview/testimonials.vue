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
            !userHasPermission('post:professor-testimonial')
          "
          :loading="submitingTestimonial || fetchingTestimonials"
          @click="openTestimonialDialog('add')"
        ></q-btn>
        <!-- -->
        <q-tooltip v-if="userHasPermission('post:professor-testimonial')">
          Postar depoimento
        </q-tooltip>
        <q-tooltip v-else>
          Você precisa estar conectado e ser um estudante para postar um
          depoimento.
        </q-tooltip>
      </span>
    </div>

    <div v-if="hasPrivateTestimonials" class="text-center">
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
      <Testimonial
        :testimonial="testimonial"
        :canEdit="
          user.id === testimonial.studentId &&
          userHasPermission('post:professor-testimonial')
        "
        :canDelete="
          user.id === testimonial.studentId &&
          userHasPermission('post:professor-testimonial')
        "
        @onEdit="openTestimonialDialog('edit', testimonial)"
        @onDelete="openTestimonialDialog('delete', testimonial)"
        @onReport="$emit('onReportTestimonial', testimonial)"
      />
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
              <q-checkbox
                v-if="dialog.state === 'add'"
                v-model="dialog.anonymous"
                label="Postar como anônimo"
                :disable="submitingTestimonial"
                class="mr-3"
              ></q-checkbox>
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
import Testimonial from '@/components/professor/overview/testimonial.vue'

export default {
  components: {
    Testimonial,
  },
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
        anonymous: false,
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
    userHasGroup: get('auth/userHasGroup'),
    items() {
      // Paginate items
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.testimonials.slice(start, end)
    },
    numberOfPages() {
      return Math.ceil(this.testimonials.length / this.itemsPerPage)
    },
    hasPrivateTestimonials() {
      return (
        Object.keys(this.professor).length > 0 &&
        !this.professor.publicTestimonials &&
        !this.userHasGroup('Admin')
      )
    },
  },
  methods: {
    openTestimonialDialog(state, testimonial = {}) {
      this.dialog.state = state
      if (testimonial)
        this.dialog.testimonial = JSON.parse(JSON.stringify(testimonial))
      this.dialog.anonymous = false
      this.dialog.open = true
    },
    onSubmit() {
      this.dialog.testimonial.anonymous = this.dialog.anonymous
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
