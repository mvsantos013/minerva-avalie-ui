<template>
  <div class="header finisher-header flex" style="width: 100%; height: 550px">
    <div
      class="flex flex-col items-center justify-center mx-auto max-w-3xl"
      style="height: 410px"
    >
      <div class="flex flex-col items-center mx-auto lg:w-4/12 lg:px-5">
        <img
          src="@/assets/imgs/logo-minerva-avalie.png"
          alt="Logo Minerva Avalie"
          class="w-24- h-24"
        />
        <h1 class="text-2xl lg:text-3xl text-gray-200 font-bold text-center">
          Minerva Avalie
        </h1>
      </div>
      <div class="lg:w-8/12">
        <p
          class="mt-6 text-lg lg:text-xl text-gray-200 leading-relaxed text-center px-2 lg:px-0 mb-6"
        >
          Minerva Avalie é uma ferramenta de avaliação de disciplinas e
          professores que permite aos estudantes expressarem suas opiniões sobre
          ensino, organização e disponibilidade.
        </p>
        <!-- <div class="text-center">
            <q-btn color="green-500" dark label="avaliar" />
          </div> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    this.loadAnimation()
  },
  methods: {
    loadAnimation() {
      /*eslint-disable-next-line*/
      new FinisherHeader({
        count: 7,
        size: {
          min: 900,
          max: 1500,
          pulse: 0,
        },
        speed: {
          x: {
            min: 0,
            max: 0.3,
          },
          y: {
            min: 0,
            max: 0,
          },
        },
        colors: {
          background: '#6e99bc',
          particles: ['#204766', '#6e99bc', '#204766'],
        },
        blending: 'lighten',
        opacity: {
          center: 0.15,
          edge: 0.05,
        },
        skew: -2,
        shapes: ['s'],
      })
    },
  },
}
</script>
