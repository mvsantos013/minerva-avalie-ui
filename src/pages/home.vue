<template>
  <div>
    <div class="container pt-5 px-3 max-w-5xl mx-auto">
      <section
        class="flex flex-col flex-nowrap items-center justify-center mb-12 mx-auto max-w-2xl"
      >
        <img
          :src="require('@/assets/imgs/logo-minerva-avalie.png')"
          class="w-16 h-16 block"
        />
        <h1 class="text-xl text-gray-700 whitespace-nowrap mb-6">
          Minerva Avalie
        </h1>

        <p class="mb-3 text-justify text-gray-600 text-lg leading-tight">
          Minerva Avalie é uma ferramenta de avaliação de professores.
          Estudantes podem avaliar professores de acordo com suas habilidades de
          ensino, conhecimento e disponibilidade.
        </p>
        <p class="mb-3 text-justify text-gray-600 text-lg leading-tight">
          A plataforma também oferece aos professores e coordenadores uma visão
          valiosa sobre sua performance e a satisfação dos estudantes,
          permitindo que eles façam ajustes e melhorias em sua abordagem de
          ensino.
        </p>
        <p
          class="text-justify text-gray-600 text-lg leading-tight"
          :style="'hyphens: none'"
        >
          A aplicação possui código aberto, o que significa que todos podem
          contribuir e melhorar o projeto, tornando-o ainda mais útil e
          acessível para todos.
        </p>
      </section>

      <div class="flex items-center pb-5">
        <div class="app-title" :style="'margin: 0'">Professores</div>
        <q-space></q-space>
        <q-input v-model="searchProfessor" dense placeholder="Buscar">
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
          class="ml-5"
        />
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
          id: 'abc',
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
