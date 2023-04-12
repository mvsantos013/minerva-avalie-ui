<template>
  <div v-if="!loading">
    <li class="hovering mb-5 cursor-pointer rounded-md">
      <router-link
        :to="`/orgs/${organizationId}/departments/${professor.departmentId}/professors/${professor.id}`"
      >
        <div
          class="flex flex-col lg:flex-row lg:flex-nowrap items-center bg-white shadow-sm rounded-md p-3 hover:bg-gray-300"
        >
          <div class="lg:w-1/12">
            <q-img
              class="rounded-full mr-4 bg-gray-200 w-16 h-16"
              :src="
                professor.pictureUrl ? professor.pictureUrl : defaultPictureUrl
              "
            />
          </div>
          <div
            class="flex flex-col lg:flex-row lg:flex-nowrap lg:w-3/12 text-center lg:text-left lg:pl-5"
          >
            <div class="flex-col">
              <h3 class="font-medium leading-tight">
                {{ professor.name }}
              </h3>
              <p class="text-xs text-gray-500">
                {{ professor.description }}
              </p>
            </div>
          </div>
          <div class="lg:w-8/12 ml-3 text-gray-500 text-center lg:text-left">
            <p>{{ ellipis(professor.about) }}</p>
          </div>
        </div>
      </router-link>
    </li>
  </div>
  <q-item v-else class="bg-white h-20 mb-5">
    <q-item-section avatar>
      <q-skeleton type="QAvatar" />
    </q-item-section>

    <q-item-section>
      <q-item-label>
        <q-skeleton type="text" width="450px" />
      </q-item-label>
      <q-item-label caption>
        <q-skeleton type="text" width="250px" />
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
export default {
  props: {
    professor: {
      type: Object,
      default: () => ({}),
    },
    loading: {
      type: Boolean,
      default: false,
    },
    organizationId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      defaultPictureUrl:
        'https://minerva-avalie-bff-files-dev.s3.amazonaws.com/public/imgs/general/profile-empty.png',
    }
  },
  methods: {
    ellipis(text) {
      const threshold = 160
      if (text?.length > threshold) {
        return text.substring(0, threshold) + '... Ler mais'
      }
      return text
    },
  },
}
</script>

<style lang="postcss" scoped>
.hovering {
  transition: all 0.2s ease-in-out;
  border: solid 2px transparent;

  &:hover {
    border: solid 2px #dadada;
  }
}
</style>
