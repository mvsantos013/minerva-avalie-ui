<template>
  <div v-show="chartData.length" class="component-wrapper">
    <div>
      <GChart
        ref="gchart"
        type="PieChart"
        :data="[legends].concat(chartData)"
        :options="chartOptions"
        @ready="onReady"
      />
    </div>
  </div>
</template>

<script>
import { GChart } from 'vue-google-charts'

export default {
  components: {
    GChart,
  },
  props: {
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
        chartArea: { height: 185 },
        tooltip: { text: 'percentage' },
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
  watch: {
    chartData: {
      handler() {
        this.fixTooltipBug()
      },
      deep: true,
    },
  },
  methods: {
    /* Resolves bug that makes tooltip flickering */
    fixTooltipBug() {
      const gchart = this.$refs.gchart.$el
      const htmlCollection = gchart.getElementsByTagName('svg')
      setTimeout(() => {
        const svg = htmlCollection[0]
        if (svg)
          if (svg.children.length > 0)
            svg.children[svg.children.length - 1].setAttribute(
              'pointer-events',
              'none',
            )
      }, 100)
    },
    onReady() {
      this.fixTooltipBug()
    },
  },
}
</script>

<style lang="postcss" scoped>
.component-wrapper {
  user-select: none;
}
</style>
