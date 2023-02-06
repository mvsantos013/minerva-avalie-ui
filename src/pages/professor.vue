<template>
  <div>
    <div class="container pt-5 px-3 max-w-4xl mx-auto">
      <div class="flex justify-between flex-nowrap mb-3">
        <ProfessorDetails
          :professor="professor"
          :fetchingProfessor="fetchingProfessor"
          class="w-1/2 pr-3"
        />
        <ProfessorRatings
          :professor="professor"
          :fetchingProfessor="fetchingProfessor"
          class="ml-3"
          @onRateProfessor="openRatingDialog"
        />
      </div>
      <ProfessorTestimonials :testimonials="testimonials" />
    </div>

    <q-dialog v-model="ratingDialog.open">
      <ProfessorRatingDialog @onSubmitProfessorRating="submitProfessorRating" />
    </q-dialog>
  </div>
</template>

<script>
import api from '@/utils/api/api'
import ProfessorDetails from '@/components/professor/professor-details.vue'
import ProfessorRatings from '@/components/professor/professor-ratings.vue'
import ProfessorTestimonials from '@/components/professor/professor-testimonials.vue'
import ProfessorRatingDialog from '@/components/professor/professor-rating-dialog.vue'

export default {
  components: {
    ProfessorDetails,
    ProfessorRatings,
    ProfessorTestimonials,
    ProfessorRatingDialog,
  },
  data() {
    return {
      fetchingProfessor: false,
      professor: {
        id: 1,
        name: 'John Doe',
        pictureUrl:
          'data:image/jpeg;base64,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',
        description: 'Software Engineer',
        about:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore, consequuntur aliquid laboriosam ea laborum, temporibus corrupti consequatur soluta ad praesentium rem.',
        rating: 4.75,
      },
      testimonials: [
        {
          id: 1,
          studentId: 1,
          professorId: 1,
          studentDetails: {
            name: 'Student 1',
          },
          text: 'lorem ipsum dolor sit amet consectetur adipisicing elit. Labore, consequuntur aliquid laboriosam ea laborum, temporibus corrupti consequatur soluta ad praesentium rem.',
        },
        {
          id: 2,
          studentId: 2,
          professorId: 1,
          studentDetails: {
            name: 'Student 2',
          },
          text: 'lorem ipsum dolor sit amet consectetur adipisicing elit. Labore, consequuntur aliquid laboriosam ea laborum, temporibus corrupti consequatur soluta ad praesentium rem.',
        },
      ],
      fetchingTestimonials: false,
      ratingDialog: {
        open: false,
      },
    }
  },
  mounted() {
    const professorId = this.$route.params.id
    const departmentId = this.$route.query.departmentId

    if (!professorId || !departmentId) {
      this.$router.push({ name: 'error-404' })
    }

    // this.fetchProfessor(departmentId, professorId)
  },
  methods: {
    async fetchProfessor(departmentId, professorId) {
      if (this.fetchingProfessor) return
      this.fetchingProfessor = true
      const response = await api.fetchProfessor(departmentId, professorId)
      if (response.ok) this.professor = response.data
      else this.$router.push({ name: 'error-404' })
      this.fetchingProfessor = false
    },
    async fetchTestimonials(professorId) {
      if (this.fetchingTestimonials) return
      this.fetchingTestimonials = true
      const response = await api.fetchProfessorTestimonials(professorId)
      if (response.ok) this.testimonials = response.data
      else this.$router.push({ name: 'error-404' })
      this.fetchingTestimonials = false
    },
    openRatingDialog() {
      this.ratingDialog.open = true
    },
    async submitProfessorRating() {},
  },
}
</script>
