<template>
  <q-list class="expansion-menu select-none">
    <div v-for="(item, index) in items" :key="index">
      <div v-if="item.header">
        <q-expansion-item
          v-if="item.visible"
          :icon="item.icon"
          :label="item.header"
          :default-opened="item.open"
          :header-inset-level="headerInsetLevel"
          :content-inset-level="item.header ? contentInsetLevel : 0"
          :class="{ 'hidden-header': !item.header }"
          class="mb-2 text-sm select-none"
          @click="() => $emit('onSectionSelected', item)"
        >
          <template v-for="child in item.children">
            <div :key="child.text" v-if="child.visible">
              <div v-if="child.children">
                <expansion-menu-node
                  :items="child.children"
                  @onSectionSelected="(e) => $emit('onSectionSelected', e)"
                  @onItemSelected="(e) => $emit('onItemSelected', e)"
                />
              </div>
              <div v-else>
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
                    <q-item-label style="font-size: 0.8rem">{{
                      child.text
                    }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-separator v-if="child.separator" />
              </div>
            </div>
          </template>
        </q-expansion-item>
      </div>
      <div v-else>
        <div v-if="item.visible">
          <q-item
            :to="item.url ? item.url : null"
            exact
            :class="{
              hoverable: !item.url,
              'q-router-link--active': item.id === active,
            }"
            @click.native="
              () => {
                $emit('onItemSelected', item)
                item.handler ? item.handler() : null
              }
            "
          >
            <q-item-section v-if="item.icon" avatar>
              <q-icon :name="item.icon" />
            </q-item-section>

            <q-item-section>
              <q-item-label style="font-size: 0.8rem">{{
                item.text
              }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-separator v-if="item.separator" />
        </div>
      </div>
    </div>
  </q-list>
</template>

<script>
export default {
  name: 'expansion-menu-node',
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    active: {
      type: String,
      default: null,
    },
    headerInsetLevel: {
      type: Number,
      default: 0,
    },
    contentInsetLevel: {
      type: Number,
      default: 0.3,
    },
  },
}
</script>

<style lang="postcss">
/* stylelint-disable */
.expansion-menu {
  .q-expansion-item {
    &.hidden-header {
      .q-expansion-item__container {
        div.q-item:first-child {
          display: none;
        }
      }
    }
  }

  .q-item {
    min-height: 35px;

    .q-item__section--avatar {
      min-width: 2.5rem;
    }

    .q-item__label {
      font-size: 0.8rem;

      .q-item__label--header {
        @apply pt-4 pb-1;
      }
    }
  }

  .hoverable {
    @apply cursor-pointer select-none;

    transition: background-color 0.3s ease-in-out;

    &:hover {
      background: rgba(106, 150, 199, 0.1);
    }
  }
}
</style>
