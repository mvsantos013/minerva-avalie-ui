<template>
  <q-list class="menu">
    <div v-for="item in items" :key="item.text">
      <q-item-label v-if="item.category" header>
        {{ item.category }}
      </q-item-label>

      <template v-for="child in item.children">
        <div :key="child.text" v-if="child.visible">
          <q-item
            :to="child.url ? child.url : null"
            exact
            :class="{
              hoverable: !child.url,
              'q-router-link--active': child.id === active,
            }"
            @click.native="
              () => {
                $emit('onItemSelected', child)
                item.handler ? item.handler() : null
              }
            "
          >
            <q-item-section v-if="child.icon" avatar>
              <q-icon :name="child.icon" />
            </q-item-section>

            <q-item-section>
              <q-item-label>{{ child.text }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-separator v-if="child.separator" />
        </div>
      </template>
    </div>
  </q-list>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    active: {
      type: String,
      default: null,
    },
  },
}
</script>

<style lang="postcss" scoped>
.menu {
  .q-item__label--header {
    @apply pt-4 pb-1;
  }

  .hoverable {
    @apply cursor-pointer select-none;

    transition: background-color 0.3s ease-in-out;

    &:hover {
      background: rgba(106, 150, 199, 0.1);
    }
  }

  .q-item {
    min-height: 45px;
  }
}
</style>
