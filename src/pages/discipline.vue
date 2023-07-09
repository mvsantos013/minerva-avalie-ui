<template>
  <div class="container pt-5 px-3 max-w-3xl mx-auto">
    <h3 class="text-lg font-medium mb-2 text-center lg:text-left">
      {{ discipline?.name }}
    </h3>
    <div v-if="fetchingDiscipline" class="max-w-sm">
      <q-skeleton
        type="text"
        :width="`${Math.floor(Math.random() * 20) + 70}%`"
      />
    </div>

    <div class="my-5">Docentes desta disciplina</div>

    <ul class="mb-10">
      <li
        v-for="professor in professorsOfThisDiscipline"
        :key="professor.id"
        class="flex flex-nowrap items-center"
      >
        <q-radio v-model="selectedProfessor" :val="professor" dense></q-radio>
        <Professor
          :professor="professor"
          :organizationId="organizationId"
          :loading="fetchingProfessorsDisciplines"
          :no-routing="true"
          class="shadow-md ml-3 border border-transparent"
          :class="{
            border: selectedProfessor && professor.id === selectedProfessor?.id,
            'border-green-200':
              selectedProfessor && professor.id === selectedProfessor?.id,
          }"
        >
        </Professor>
      </li>
    </ul>

    <div class="flex flex-col lg:flex-row gap-2 items-center justify-center">
      <q-select
        v-model="selectedPeriod"
        :options="periods"
        :loading="false"
        :disable="false"
        label="Período"
        dense
        filled
        class="w-36"
      />
      <div>
        <q-btn
          color="primary"
          size="sm"
          class="lg:ml-3"
          :disable="submitDisabled"
          :to="`/orgs/${organizationId}/departments/instituto-de-computacao/professors/${selectedProfessor?.id}?evaluate=true&period=${selectedPeriod}&disciplineId=${discipline?.id}`"
        >
          Avaliar disciplina
        </q-btn>
        <q-tooltip v-if="!userHasPermission('rate:professor')">
          Você precisa estar conectado e ser um estudante para avaliar uma
          disciplina.
        </q-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import { get } from 'vuex-pathify'
import api from '@/utils/api/api'
import Professor from '@/components/home/professor.vue'

export default {
  components: {
    Professor,
  },
  data() {
    return {
      selectedPeriod: null,
      selectedProfessor: null,
      discipline: null,
      fetchingDiscipline: false,
      fetchingProfessor: false,
      organizationId: null,
      deparmentId: null,
      professors: [],
      ratingDialog: {
        open: false,
      },
      ratingProfessor: false,
      professorsDisciplines: [],
      fetchingProfessorsDisciplines: false,
      disciplines: [],
      fetchingDisciplines: false,
      selectedPeriods: [],
      selectedDisciplines: [],
    }
  },
  computed: {
    user: get('auth/user'),
    isUserAuthenticated: get('auth/isUserAuthenticated'),
    userHasGroup: get('auth/userHasGroup'),
    userHasPermission: get('auth/userHasPermission'),
    periods() {
      const initialYear = 2022
      const initialSemester = 1
      const currentYear = new Date().getFullYear()
      const currentSemester = new Date().getMonth() < 6 ? 1 : 2
      const periods = []
      for (let year = initialYear; year <= currentYear; year++) {
        for (let semester = initialSemester; semester <= 2; semester++) {
          if (year === currentYear && semester > currentSemester) break
          periods.push(`${year}.${semester}`)
        }
      }
      return periods
    },
    professorsOfThisDiscipline() {
      if (this.fetchingProfessors || this.fetchingProfessorsDisciplines)
        return [{}, {}, {}]
      const profs = this.professorsDisciplines
        .filter((pd) => pd.disciplineId === this.disciplineId)
        .map((pd) => pd.professorId)
      return this.professors.filter((p) => profs.includes(p.id))
    },
    submitDisabled() {
      return (
        !this.selectedPeriod ||
        !this.selectedProfessor ||
        this.fetchingDiscipline ||
        !this.userHasPermission('rate:professor') ||
        this.fetchingProfessors ||
        this.fetchingProfessorsDisciplines
      )
    },
  },
  async mounted() {
    this.disciplineId = this.$route.params.disciplineId
    this.organizationId = this.$route.params.organizationId

    if (!this.disciplineId || !this.organizationId) {
      this.$router.push({ name: 'error-404' })
    }

    this.fetchDiscipline(this.organizationId, this.disciplineId)
    this.fetchProfessors('instituto-de-computacao')
    this.fetchProfessorsDisciplines()
  },
  methods: {
    async fetchDiscipline(organizationId, disciplineId) {
      if (this.fetchingDiscipline) return
      this.fetchingDiscipline = true
      const response = await api.fetchDiscipline(organizationId, disciplineId)
      if (response.ok) this.discipline = response.data
      else this.$router.push({ name: 'error-404' })
      this.fetchingDiscipline = false
    },
    async fetchProfessors(departmentId) {
      if (this.fetchingProfessor) return
      this.fetchingProfessor = true
      const response = await api.fetchProfessors(departmentId)
      if (response.ok) this.professors = response.data
      else this.$router.push({ name: 'error-404' })
      this.fetchingProfessor = false
    },
    async fetchDisciplines() {
      if (this.fetchingDisciplines) return
      this.fetchingDisciplines = true
      const response = await api.fetchDisciplines(this.organizationId)
      if (response.ok) this.disciplines = response.data

      this.fetchingDisciplines = false
    },
    async fetchProfessorsDisciplines() {
      if (this.fetchingProfessorsDisciplines) return
      this.fetchingProfessorsDisciplines = true
      const response = await api.fetchProfessorsDisciplines()
      if (response.ok) {
        this.professorsDisciplines = response.data
      }
      this.fetchingProfessorsDisciplines = false
    },
  },
}
</script>
