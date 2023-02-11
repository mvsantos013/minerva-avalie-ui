<template>
  <div>
    <section class="py-8 lg:py-16 mb-12" :style="'background-color: #f4f4f4; '">
      <div class="flex lg:flex-nowrap items-center mx-auto max-w-3xl">
        <div class="flex flex-col items-center mx-auto lg:w-4/12 lg:px-5">
          <img
            :src="require('@/assets/imgs/logo-minerva-avalie.png')"
            class="w-24 h-24 block"
          />
          <h1 class="text-xl text-gray-700 whitespace-nowrap mb-6">
            Minerva Avalie
          </h1>
        </div>

        <div class="lg:w-8/12">
          <p
            class="mb-3 text-justify text-gray-600 text-lg leading-tight px-3 lg:px-0"
          >
            Minerva Avalie é uma ferramenta de avaliação de professores.
            Estudantes podem avaliar professores de acordo com suas habilidades
            de ensino, conhecimento e disponibilidade.
          </p>
          <p
            class="mb-3 text-justify text-gray-600 text-lg leading-tight px-3 lg:px-0"
          >
            A plataforma também oferece uma visão valiosa sobre performance dos
            professores e a satisfação dos estudantes, permitindo que eles façam
            ajustes e melhorias em sua abordagem de ensino.
          </p>
        </div>
      </div>
    </section>

    <div class="container pt-5 px-3 max-w-5xl mx-auto">
      <div class="flex items-center pb-5">
        <div
          class="text-lg tracking-wide text-center lg:text-left w-full lg:w-auto"
        >
          Professores
        </div>
        <q-space></q-space>
        <div
          class="flex flex-col items-center lg:flex-nowrap lg:flex-row w-full lg:w-auto"
        >
          <q-input
            v-model="searchProfessor"
            dense
            placeholder="Buscar"
            class="w-full lg:w-auto"
          >
            <template #append>
              <q-icon name="mdi-magnify" />
            </template>
          </q-input>
          <q-select
            v-model="selectedDepartmentId"
            :options="departments"
            option-label="name"
            option-value="id"
            :emit-value="true"
            :map-options="true"
            :loading="fetchingDepartments"
            :disable="fetchingDepartments"
            label="Departamento"
            dense
            class="lg:ml-5 w-full lg:w-auto"
          />
        </div>
      </div>

      <Professors
        :professors="professors"
        :fetching="fetchingProfessors"
        :search="searchProfessor"
      />
    </div>
  </div>
</template>

<script>
import api from '@/utils/api/api.js'
import Professors from '@/components/home/professors.vue'

export default {
  components: {
    Professors,
  },
  data() {
    return {
      selectedDepartmentId: 'ic',
      professors: [
        {
          departmentId: 'ic',
          id: 'dfaf97b6-acae-4940-abdd-8a3aead3af73',
          about:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore, consequuntur aliquid laboriosam ea laborum, temporibus corrupti consequatur soluta ad praesentium rem.',
          name: 'Silvana Rossetto',
          description: '',
          pictureUrl:
            'https://minerva-avalie-bff-files-dev.s3.amazonaws.com/public/imgs/general/profile-woman.png',
        },
        {
          departmentId: 'ic',
          id: 'abcd',
          about:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore, consequuntur aliquid laboriosam ea laborum, temporibus corrupti consequatur soluta ad praesentium rem.',
          name: 'Vinicius Gusmão',
          pictureUrl:
            'https://minerva-avalie-bff-files-dev.s3.amazonaws.com/public/imgs/general/profile-man.png',
          description: '',
        },
        {
          departmentId: 'ic',
          id: 'abcde',
          about:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore, consequuntur aliquid laboriosam ea laborum, temporibus corrupti consequatur soluta ad praesentium rem.',
          name: 'Giseli Rabelo',
          description: '',
          pictureUrl:
            'https://minerva-avalie-bff-files-dev.s3.amazonaws.com/public/imgs/general/profile-woman.png',
        },
      ],
      fetchingProfessors: false,
      searchProfessor: null,
      departments: [{ id: 'ic', name: 'Instituto de Computação' }],
      fetchingDepartments: false,
    }
  },
  watch: {
    // Fetch professors when department changes
    selectedDepartmentId: function (newDeparmentId, oldDepartmentId) {
      if (newDeparmentId !== oldDepartmentId)
        this.fetchProfessors(newDeparmentId)
    },
  },
  async mounted() {
    // this.fetchDepartments()
    // this.fetchProfessors(this.selectedDepartmentId)
  },
  methods: {
    async fetchProfessors(departmentId) {
      if (this.fetchingProfessors) return
      this.fetchingProfessors = true
      const response = await api.fetchProfessors(departmentId)
      if (response.ok) {
        this.professors = response.data
      }
      this.fetchingProfessors = false
    },
    async fetchDepartments() {
      if (this.fetchingDepartments) return
      this.fetchingDepartments = true
      const response = await api.fetchDepartments()
      if (response.ok) {
        this.departments = response.data
      }
      this.fetchingDepartments = false
    },
  },
}
</script>
