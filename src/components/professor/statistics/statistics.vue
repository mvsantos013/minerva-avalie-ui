<template>
  <section>
    <div class="text-lg font-medium mb-6 text-center">
      {{ professor.name }}
    </div>

    <div class="text-center mb-10">
      <div class="text-gray-600 text-xs mb-2">Intervalo de tempo</div>
      <div class="flex flex-col lg:flex-row items-center justify-center">
        <DateInput
          :value.sync="startDate"
          label="Data inicial"
          dense
          filled
          class="w-48 lg:mr-5 mb-3 lg:mb-0"
        />
        <DateInput
          :value.sync="endDate"
          label="Data final"
          dense
          filled
          class="w-48"
        />
      </div>
    </div>

    <ProfessorMetrics
      :meanRating="
        meanRatingOverTime.length
          ? meanRatingOverTime[meanRatingOverTime.length - 1][1]
          : 0
      "
      :qtyStudentsRatings="filteredStudentsRatings.length"
      :qtyTestimonials="filteredTestimonials.length"
      :fetchingStudentsRatings="fetchingStudentsRatings"
      :fetchingTestimonials="fetchingTestimonials"
      class="mb-10"
    />

    <ProfessorMeanRatingChart
      :timeSeries="meanRatingOverTime"
      :chartMaxRangeInMonths="chartMaxRangeInMonths"
      :options="studentsRatingsQuantityChartOptions"
      :loading="fetchingStudentsRatings"
      class="mb-10"
    />

    <ProfessorRatingQtyChart
      :timeSeries="studentsRatingsQuantityOverTime"
      :chartMaxRangeInMonths="chartMaxRangeInMonths"
      :options="studentsRatingsQuantityChartOptions"
      :loading="fetchingStudentsRatings"
      class="mb-10"
    />

    <div class="text-gray-500 mb-2">Avaliações por estudante</div>
    <q-table
      :data="filteredStudentsRatings.map((s) => ({ ...s.ratings }))"
      :columns="
        ratingCategories.map((c) => ({
          name: c.name,
          label: c.name,
          field: c.id,
          align: 'center',
        }))
      "
      :loading="fetchingStudentsRatings"
      :rows-per-page-options="[5, 10, 15, 50]"
      rows-per-page-label="5"
      :row-key="(row) => row.id"
      dense
      flat
      class="shadow-md mb-10"
    >
    </q-table>

    <ProfessorRatingsComments
      :ratingCategories="ratingCategories"
      :studentsCommentsGroupedByCategory="studentsCommentsGroupedByCategory"
    />
  </section>
</template>

<script>
import moment from 'moment'
import DateInput from '@/components/common/input/date.vue'
import ProfessorMetrics from '@/components/professor/statistics/metrics.vue'
import ProfessorMeanRatingChart from '@/components/professor/statistics/chart-mean-rating.vue'
import ProfessorRatingQtyChart from '@/components/professor/statistics/chart-rating-qty.vue'
import ProfessorRatingsComments from '@/components/professor/statistics/comments.vue'

export default {
  components: {
    DateInput,
    ProfessorMetrics,
    ProfessorMeanRatingChart,
    ProfessorRatingQtyChart,
    ProfessorRatingsComments,
  },
  props: {
    professor: {
      type: Object,
      default: () => ({}),
    },
    fetchingProfessor: {
      type: Boolean,
      default: false,
    },
    testimonials: {
      type: Array,
      default: () => [],
    },
    fetchingTestimonials: {
      type: Boolean,
      default: false,
    },
    studentsRatings: {
      type: Array,
      default: () => [],
    },
    fetchingStudentsRatings: {
      type: Boolean,
      default: false,
    },
    ratingCategories: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      startDate: moment().subtract(1, 'months').format('YYYY-MM-DD'), // 30 days before
      endDate: moment().format('YYYY-MM-DD'), // today
      commentsTab: 'didactic',
      chartMaxRangeInMonths: 12,
      studentsRatingsQuantityChartOptions: {
        height: 360,
        legend: { position: 'none' },
        chartArea: { left: 65, width: '89%', height: '68%' },
        explorer: { actions: ['dragToZoom', 'rightClickToReset'] },
        vAxis: {
          title: 'Qtd de avaliações',
          gridlines: { color: 'rgba(0,0,0,0.05)', count: 4 },
        },
        hAxis: {
          gridlines: { color: 'transparent' },
          textStyle: { color: '#909090' },
        },
      },
    }
  },
  computed: {
    evaluableRatingCategories() {
      // testDifficulty category does not count for the mean.
      return this.ratingCategories.filter((c) => c.id !== 'testDifficulty')
    },
    utcEndDatePlusOneDay() {
      return moment(this.endDate).add(1, 'days').utcOffset(0)
    },
    utcEndDatePlusOneDayStr() {
      return this.utcEndDatePlusOneDay.format('YYYY-MM-DD')
    },
    filteredStudentsRatings() {
      if (!this.studentsRatings) return []
      return this.studentsRatings.filter((r) => {
        return (
          r.createdAt >= this.startDate &&
          r.createdAt <= this.utcEndDatePlusOneDayStr
        )
      })
    },
    filteredTestimonials() {
      if (!this.testimonials) return []
      return this.testimonials.filter((t) => {
        return (
          t.postedAt >= this.startDate &&
          t.postedAt <= this.utcEndDatePlusOneDayStr
        )
      })
    },
    studentsRatingsGroupedByDate() {
      // Group ratings by date
      const studentsRatingsGroupedByDate = this.filteredStudentsRatings.reduce(
        (acc, curr) => {
          const dateKey = curr.createdAt.slice(0, 10)
          if (acc[dateKey]) acc[dateKey].push(curr)
          else acc[dateKey] = [curr]
          return acc
        },
        {},
      )
      return studentsRatingsGroupedByDate
    },
    studentsRatingsQtyGroupedByDate() {
      // Count ratings
      const studentsRatingsQuantities = this.filteredStudentsRatings.reduce(
        (acc, curr) => {
          const dateKey = curr.createdAt.slice(0, 10)
          if (acc[dateKey]) acc[dateKey] += 1
          else acc[dateKey] = 1
          return acc
        },
        {},
      )
      return studentsRatingsQuantities
    },
    studentsCommentsGroupedByCategory() {
      const comments = {}
      this.ratingCategories.map((c) => {
        comments[c.id] = []
      })
      this.filteredStudentsRatings.map((r) => {
        if (r.comments) {
          Object.keys(r.comments).map((c) => {
            if (r.comments[c]) comments[c].push(r.comments[c])
          })
        }
      })
      return comments
    },
    meanRatingOverTime() {
      const timeSeries = []
      const monthsAgo = moment(this.endDate)
        .utcOffset(0)
        .subtract(this.chartMaxRangeInMonths, 'months')
        .format('YYYY-MM-DD')
      let date =
        this.startDate < monthsAgo
          ? moment(monthsAgo).utcOffset(0)
          : moment(this.startDate).utcOffset(0)
      const finalDate = this.utcEndDatePlusOneDay
      const categories = this.evaluableRatingCategories.map((c) => c.id)

      let totalRatings = 0
      let meanRating = 0
      while (date <= finalDate) {
        const dateKey = date.format('YYYY-MM-DD')
        const dateQty = this.studentsRatingsQtyGroupedByDate[dateKey] || 0

        totalRatings += dateQty

        if (dateQty) {
          const dateRatings = this.studentsRatingsGroupedByDate[dateKey]
          const ratings = []
          dateRatings.map((dateRating) => {
            categories.map((c) => ratings.push(dateRating.ratings[c]))
          })

          const dateMean =
            ratings.reduce((acc, curr) => acc + curr, 0) /
            (dateQty * categories.length)

          meanRating =
            (meanRating * (totalRatings - dateQty) + dateMean * dateQty) /
            totalRatings
        }

        timeSeries.push([dateKey, meanRating])
        date = date.add(1, 'days')
      }

      return timeSeries
    },
    studentsRatingsQuantityOverTime() {
      const timeSeries = []
      const monthsAgo = moment(this.endDate)
        .utcOffset(0)
        .subtract(this.chartMaxRangeInMonths, 'months')
        .format('YYYY-MM-DD')
      let date =
        this.startDate < monthsAgo
          ? moment(monthsAgo).utcOffset(0)
          : moment(this.startDate).utcOffset(0)
      const finalDate = this.utcEndDatePlusOneDay
      while (date <= finalDate) {
        const dateKey = date.format('YYYY-MM-DD')
        const val = this.studentsRatingsQtyGroupedByDate[dateKey] || 0
        timeSeries.push([dateKey, val])
        date = date.add(1, 'days')
      }

      return timeSeries
    },
  },
}
</script>
