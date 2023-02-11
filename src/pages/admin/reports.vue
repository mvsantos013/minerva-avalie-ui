<template>
  <div class="container mt-5 bg-white rounded-md">
    <div class="flex">
      <div class="flex-grow p-3 pb-10">
        <div class="flex flex-col">
          <div class="app-title">Reported Testimonials</div>
          <div
            v-if="!fetchingTestimonials && testimonials.length === 0"
            class="text-center text-gray-600"
          >
            No reported testimonials to show
          </div>
          <div
            v-for="testimonial in items"
            :key="testimonial.id"
            class="flex flex-nowrap items-center rounded-md p-3 mb-3 bg-white shadow-sm"
          >
            <Testimonial
              :testimonial="testimonial"
              :canEdit="false"
              :canDelete="true"
              :canApprove="true"
              :canReport="false"
              :showSource="true"
              :sourcePath="`/professor/${testimonial.professorId}?departmentId=${testimonial.departmentId}`"
              @onDelete="openDeleteTestimonialDialog(testimonial)"
              @onApprove="openApproveTestimonialDialog(testimonial)"
            />
          </div>
          <div
            v-if="!fetchingTestimonials && testimonials.length"
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
        </div>
      </div>
      <div class="flex-shrink py-3 border-l" style="min-width: 16rem">
        <Menu :items="pages" />
      </div>
    </div>

    <q-dialog v-model="testimonialDialog.open">
      <q-card class="bg-white" :style="'width: 40rem'">
        <q-card-section class="row items-center">
          <div class="text-h6">
            {{ testimonialDialog.title }}
          </div>
          <q-space></q-space>
          <q-btn flat icon="mdi-close" dense v-close-popup></q-btn>
        </q-card-section>
        <q-card-section>
          <q-form @submit.prevent="onSubmitReportedTestimonial">
            <q-input
              v-model="testimonialDialog.testimonial.text"
              label="Depoimento"
              outlined
              type="textarea"
              :disable="true"
            ></q-input>
            <div class="flex justify-end mt-3">
              <q-btn
                type="submit"
                :color="
                  testimonialDialog.state === 'delete' ? 'negative' : 'primary'
                "
                label="Ok"
                :disable="submitingTestimonial"
                :loading="submitingTestimonial"
              ></q-btn>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import api from '@/utils/api/api'
import Menu from '@/components/common/menu/base-menu.vue'
import Sidebar from './sidebar.js'
import Testimonial from '@/components/professor/overview/testimonial.vue'

export default {
  components: {
    Menu,
    Testimonial,
  },
  data() {
    return {
      testimonials: [],
      fetchingTestimonials: false,
      submitingTestimonial: false,
      currentPage: 1,
      itemsPerPage: 10,
      testimonialDialog: {
        open: false,
        state: null,
        title: null,
        testimonial: {},
      },
    }
  },
  computed: {
    pages() {
      return Sidebar
    },
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
  async mounted() {
    this.fetchReportedTestimonials()
  },
  methods: {
    async fetchReportedTestimonials() {
      this.fetchingTestimonials = true
      const response = await api.fetchProfessorsReportedTestimonials()
      if (response.ok) {
        this.testimonials = response.data
      }
      this.fetchingTestimonials = false
    },
    openDeleteTestimonialDialog(testimonial) {
      this.testimonialDialog = {
        open: true,
        state: 'delete',
        title: 'Delete testimonial',
        testimonial,
      }
    },
    openApproveTestimonialDialog(testimonial) {
      this.testimonialDialog = {
        open: true,
        state: 'approve',
        title: 'Approve testimonial',
        testimonial,
      }
    },
    onSubmitReportedTestimonial() {
      if (this.submitingTestimonial) return
      this.submitingTestimonial = true
      this.testimonialDialog.open = false

      if (this.testimonialDialog.state === 'delete') {
        this.removeReportedTestimonial(this.testimonialDialog.testimonial)
      } else if (this.testimonialDialog.state === 'approve') {
        this.approveReportedTestimonial(this.testimonialDialog.testimonial)
      }
      this.submitingTestimonial = false
    },
    async removeReportedTestimonial(testimonial) {
      this.submitingTestimonial = true
      const response = await api.removeReportedTestimonial(testimonial)
      if (response.ok) {
        this.$toast.open('Testimonial removed sucessfully.')
        this.fetchReportedTestimonials()
      }
      this.submitingTestimonial = false
    },
    async approveReportedTestimonial(testimonial) {
      this.submitingTestimonial = true
      const response = await api.approveReportedTestimonial(testimonial)
      if (response.ok) {
        this.$toast.open('Testimonial approved sucessfully.')
        this.fetchReportedTestimonials()
      }
      this.submitingTestimonial = false
    },
  },
}
</script>
