<template>
  <div class="header-filter">
    <q-btn-dropdown
      flat
      rounded
      dense
      size="xs"
      icon="mdi-filter-variant"
      class="hide-arrow"
    >
      <q-card class="header-filter-q-card">
        <q-card-section class="header-filter-q-card-section">
          <!-- Default filters for the type string -->
          <template v-if="hasDefaultFiltersAvailable && type == 'string'">
            <div class="flex items-end mb-1">
              <div class="text-label">Starts with</div>
              <input v-model="startsWithWord" class="text-field" />
            </div>
          </template>

          <template v-if="hasDefaultFiltersAvailable && type == 'string'">
            <div class="flex items-end mb-1">
              <div class="text-label">Ends with</div>
              <input v-model="endsWithWord" class="text-field" />
            </div>
          </template>

          <template v-if="hasDefaultFiltersAvailable && type == 'string'">
            <div class="flex items-end mb-1">
              <div class="text-label">Equals to</div>
              <input v-model="equalsToWord" class="text-field" />
            </div>
          </template>

          <template v-if="hasDefaultFiltersAvailable && type == 'string'">
            <div class="flex items-end mb-2">
              <div class="text-label">Contains</div>
              <input v-model="containsWord" class="text-field" />
            </div>
          </template>

          <!-- Default filters for the type boolean -->
          <template v-if="hasDefaultFiltersAvailable && type == 'boolean'">
            <div class="flex items-center mb-1">
              <q-checkbox v-model="yes" size="xs" />
              <span class="text-sm pl-1">Yes</span>
            </div>
          </template>

          <template v-if="hasDefaultFiltersAvailable && type == 'boolean'">
            <div class="flex items-center mb-1">
              <q-checkbox v-model="no" size="xs" />
              <span class="text-sm pl-1">No</span>
            </div>
          </template>

          <!-- Default filters for the type date -->
          <template v-if="hasDefaultFiltersAvailable && type == 'date'">
            <div class="flex items-center mb-1">
              <span class="text-sm pl-1 pr-2" style="min-width: 4rem"
                >Before</span
              >
              <q-input
                v-model="dateBefore"
                filled
                dense
                clearable
                mask="date"
                :rules="['date']"
                :input-style="{
                  'max-width': '6rem',
                }"
              >
                <template #append>
                  <q-icon name="mdi-calendar-range" class="cursor-pointer">
                    <q-popup-proxy
                      ref="qDateProxy"
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date v-model="dateBefore">
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Close"
                            color="primary"
                            flat
                          />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </template>

          <template v-if="hasDefaultFiltersAvailable && type == 'date'">
            <div class="flex items-center mb-1">
              <span class="text-sm pl-1 pr-2" style="min-width: 4rem"
                >After</span
              >
              <q-input
                v-model="dateAfter"
                filled
                clearable
                dense
                mask="date"
                :rules="['date']"
                :input-style="{
                  'max-width': '6rem',
                }"
              >
                <template #append>
                  <q-icon name="mdi-calendar-range" class="cursor-pointer">
                    <q-popup-proxy
                      ref="qDateProxy"
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date v-model="dateAfter">
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Close"
                            color="primary"
                            flat
                          />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </template>

          <!-- Custom filters -->
          <template v-for="(filter, index) in filters">
            <div
              :key="index"
              v-if="!filter.hasOwnProperty('isDefault')"
              class="flex items-center mb-2"
            >
              <q-checkbox v-model="filter.applied" size="xs" />
              <span class="text-sm pl-1">{{ filter.text }}</span>
            </div>
          </template>
        </q-card-section>
      </q-card>
    </q-btn-dropdown>
    <div v-if="filtersApplied" class="notification">{{ filtersApplied }}</div>
  </div>
</template>

<script>
import { isDateBefore } from '@/utils/validations'

export default {
  props: {
    type: {
      type: String,
      default: 'text',
    },
    showDefaultFilters: {
      type: Boolean,
      default: true,
    },
    filters: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['update:filters'],
  data() {
    return {
      startsWithWord: '',
      endsWithWord: '',
      equalsToWord: '',
      containsWord: '',
      yes: false,
      no: false,
      dateBefore: false,
      dateAfter: false,
    }
  },
  computed: {
    hasDefaultFiltersAvailable() {
      return (
        this.showDefaultFilters && this.defaultFilters.hasOwnProperty(this.type)
      )
    },
    defaultFilters() {
      return {
        string: [
          {
            text: 'Starts with',
            expr: (v) =>
              v.toLowerCase().startsWith(this.startsWithWord.toLowerCase()),
            applied: this.startsWithWord.length > 0,
            isDefault: true,
          },
          {
            text: 'Ends with',
            expr: (v) =>
              v.toLowerCase().endsWith(this.endsWithWord.toLowerCase()),
            applied: this.endsWithWord.length > 0,
            isDefault: true,
          },
          {
            text: 'Equals to',
            expr: (v) => v.toLowerCase() === this.equalsToWord.toLowerCase(),
            applied: this.equalsToWord.length > 0,
            isDefault: true,
          },
          {
            text: 'Contains',
            expr: (v) =>
              v.toLowerCase().includes(this.containsWord.toLowerCase()),
            applied: this.containsWord.length > 0,
            isDefault: true,
          },
        ],
        boolean: [
          {
            text: 'Yes',
            expr: (v) => v === true,
            applied: this.yes,
            isDefault: true,
          },
          {
            text: 'No',
            expr: (v) => v === false,
            applied: this.no,
            isDefault: true,
          },
        ],
        date: [
          {
            text: 'Before',
            expr: (v) => isDateBefore(v, this.dateBeforeIso),
            applied: this.dateBefore,
            isDefault: true,
          },
          {
            text: 'After',
            expr: (v) => isDateBefore(v, this.dateAfterIso),
            applied: this.dateAfter,
            isDefault: true,
          },
        ],
      }
    },
    allFilters() {
      if (this.hasDefaultFiltersAvailable)
        return [
          ...this.defaultFilters[this.type],
          ...this.filters.filter((x) => !x.isDefault),
        ]
      else return this.filters
    },
    filtersApplied() {
      return this.allFilters.filter((f) => f.applied).length
    },
    dateBeforeIso() {
      return this.dateBefore ? this.dateBefore.replaceAll('/', '-') : null
    },
    dateAfterIso() {
      return this.dateAfter ? this.dateAfter.replaceAll('/', '-') : null
    },
  },
  watch: {
    defaultFilters: {
      handler(newVal, oldVal) {
        if (JSON.stringify(newVal) !== JSON.stringify(oldVal))
          this.$emit('update:filters', this.allFilters)
      },
      deep: true,
    },
  },
  mounted() {
    // Add default filters do custom filters
    this.$emit('update:filters', this.allFilters)
  },
}
</script>

<style lang="postcss">
.header-filter {
  @apply cursor-pointer relative;

  transition: color 0.3s ease-in-out;

  .hide-arrow {
    border-radius: 100% !important;
    width: 1.5rem !important;
    height: 1.5rem !important;

    .q-btn-dropdown__arrow {
      @apply hidden;
    }
  }

  .notification {
    @apply flex items-center justify-center absolute w-4 h-4 bg-primary-600 rounded-full text-white cursor-default;

    padding-top: 0.5px;
    font-size: 0.6rem;
    right: -0.8rem;
    top: -0.1rem;
  }
}

.header-filter-q-card {
  .header-filter-q-card-section {
    padding: 0.5rem 1rem 0.5rem 0.5rem;
    min-width: 11rem;
    max-height: 25rem;
    overflow-y: auto;

    .text-field {
      border-bottom: solid 1px rgba(0, 0, 0, 0.2);
      max-width: 5rem;

      &:focus {
        outline: none;
      }
    }

    .text-label {
      @apply text-sm mr-2;

      width: 5rem;
    }
  }
}
</style>
