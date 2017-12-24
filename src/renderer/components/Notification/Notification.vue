<template>
  <div class="notification-container">
    <span class="tag is-black">{{ message }}</span>
  </div>
</template>

<script lang="ts">

import Vue from 'vue';
export default Vue.extend({
  name: "Dialog",
  props: {
    message: String,
    onDismiss: Function
  },
  mounted() {
    setTimeout(() => {
      this.$props.onDismiss()
    }, 2000);
  }
})

</script>

<style scoped>

.notification-container {
  display: block;
  position: absolute;
  top: 10px;
  right: 10px;
}

.notification-container
span {
  font-weight: 800;
  font-size: 36px;
}

</style>
