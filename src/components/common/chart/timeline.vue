<template>
  <div class="timeline-container">
    <ul class="timeline">
      <li
        v-for="item in items"
        :key="item.step"
        class="li"
        :class="{ complete: item.concludedAt }"
      >
        <div class="timestamp">
          <span class="author">
            {{ item.author }}
            <span class="invisible">.</span>
          </span>
          <span class="date">
            {{ item.concludedAt | date('HH:mm:ss', 'TBD', -180) }}
          </span>
        </div>
        <div class="status">
          <h4>{{ item.step }}</h4>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
}
</script>

<style scoped>
.timeline-container {
  display: inline-block;
}

.timeline {
  list-style-type: none;
  display: flex;
  align-items: center;
}

.li {
  transition: all 200ms ease-in;
  width: 150px;
}

.timestamp {
  margin-bottom: 20px;
  padding: 0 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-weight: 100;
}

.status {
  padding: 10px 30px 0 30px;
  display: flex;
  justify-content: center;
  border-top: 2px solid #d6dce0;
  position: relative;
  transition: all 200ms ease-in;
  font-size: 0.8rem;
}

.status h4 {
  font-weight: 400;
  line-height: 1.4rem;
  text-align: center;
}

.status::before {
  content: '';
  width: 22px;
  height: 22px;
  background-color: white;
  border-radius: 22px;
  border: 1px solid #ddd;
  position: absolute;
  top: -13px;
  left: 42%;
  transition: all 200ms ease-in;
}

.li.complete .status {
  border-top: 2px solid #527ba8;
}

.li.complete .status::before {
  background-color: #527ba8;
  border: none;
  transition: all 200ms ease-in;
}

.li.complete .status h4 {
  color: #527ba8;
  font-weight: 600;
}

.author {
  max-width: 150px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.date {
  font-size: 0.75rem;
}

@media (min-device-width: 320px) and (max-device-width: 700px) {
  .timeline {
    list-style-type: none;
    display: block;
  }

  .li {
    transition: all 200ms ease-in;
    display: flex;
    width: inherit;
  }

  .timestamp {
    width: 100px;
  }

  .status::before {
    left: -8%;
    top: 30%;
    transition: all 200ms ease-in;
  }
}
</style>
