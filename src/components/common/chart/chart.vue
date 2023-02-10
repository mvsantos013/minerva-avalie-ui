<template>
  <div v-show="chartData.length" class="component-wrapper">
    <div>
      <GChart
        :type="type"
        :data="[legends].concat(chartData)"
        :options="chartOptions"
        class="px-0"
      />
    </div>
  </div>
</template>

<script>
import { GChart } from 'vue-google-charts/legacy'

export default {
  components: {
    GChart,
  },
  props: {
    type: {
      default: 'LineChart',
      type: String,
    },
    legends: {
      default: () => [],
      type: Array,
    },
    chartData: {
      default: () => [],
      type: Array,
    },
    chartOptions: {
      default: () => ({
        curveType: 'function',
        legend: { position: 'none' },
        chartArea: { left: 38, width: '95%', height: '80%' },
        explorer: { actions: ['dragToZoom', 'rightClickToReset'] },
        colors: [
          '#ff6161',
          '#50e3c2',
          '#58d0ff',
          '#ffc935',
          '#8479ff',
          '#79ff89',
          '#ff79d2',
          '#494f4c',
        ],
      }),
      type: Object,
    },
  },
}
</script>

<style lang="postcss" scoped>
.component-wrapper {
  position: relative;
  user-select: none;
}
</style>
