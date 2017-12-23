<template>
  
  <div class="column">
    
    <p class="title is-3">{{ name }}</p>
        
    <div class="tags has-addons">
      <span class="tag">{{ deviceName }}</span>
      <span class="tag is-info">{{ runtimeName }}</span>
    </div>
    
    <a class="button" v-on:click="boot()">Boot</a>
    <a class="button" v-on:click="storeUDIDToClipboard()">Copy UDID</a>
    
  </div>

</template>

<script lang="ts">

import Vue from 'vue'
import { Simulator } from '@/Simulator'

export default Vue.extend({
  name: "Simulator",
  props: {
    simulator: Simulator
  },
  computed: {
    name(): string {
      return this.simulator.name
    },
    deviceName(): string {
      return this.simulator.deviceType.replace('com.apple.CoreSimulator.SimDeviceType.', '')
    },
    runtimeName(): string {
      return this.simulator.runtime.replace('com.apple.CoreSimulator.SimRuntime.', '')
    }
  },
  methods: {
    storeUDIDToClipboard() {
      console.log(this.simulator.udid)
      console.log(this.$store)
    },
    boot() {
      this.$emit('boot', this.simulator)
    }
  },
  mounted() {
    this.$on('boot', (e) => { console.log('hi', e) })
  }
})

</script>

<style>

</style>
