<template>
  <div>
    <div class="text-gray-500 mb-2">
      Avaliação média ao longo do tempo
      <!-- <span class="italic text-gray-400">
        (intervalo máximo de {{ chartMaxRangeInMonths }} meses, ajuste o
        intervalo acima)
      </span> -->
    </div>
    <div v-if="!loading">
      <GoogleChart
        v-if="timeSeries.length"
        type="LineChart"
        :legends="['Data', 'Avaliação média']"
        :chartData="timeSeries"
        :chartOptions="options"
        class="mb-10 rounded-md overflow-hidden"
      />
      <div v-else class="text-center mb-10">
        Não há dados para serem exibidos neste intervalo.
      </div>
    </div>
    <div v-else>
      <q-skeleton name="rect" class="h-48"></q-skeleton>
    </div>
  </div>
</template>

<script>
import GoogleChart from '@/components/common/chart/chart.vue'

export default {
  components: {
    GoogleChart,
  },
  props: {
    timeSeries: {
      type: Array,
      default: () => [],
    },
    chartMaxRangeInMonths: {
      type: Number,
      default: 0,
    },
    options: {
      type: Object,
      default: () => ({}),
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
