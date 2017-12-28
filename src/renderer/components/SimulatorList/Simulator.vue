<template>
  
  <div class="container">
    
    <div class="column">
      <p class="title is-3">{{ name }}</p>
    </div>
        
    <div class="column">
      <div class="tags has-addons">
        <span class="tag">{{ deviceName }}</span>
        <span class="tag is-info">{{ runtimeName }}</span>
      </div>
    </div>
    
    <div class="column">
      <a class="button" v-on:click="boot()">Boot</a>
      <a class="button" v-on:click="storeUDIDToClipboard()">Copy UDID</a>
      <a class="button" v-on:click="test()">Test</a>
    </div>
    
    <div class="column">
      <p class="title is-4">Applications</p>
      <ul>
        <li v-for="application in applications">
          <div class="column">
            <p class="title is-5">{{ application.name }} : {{ application.bundleIdentifier }}</p>
            <div class="container">
              <a class="button" v-on:click="lanuch(application)">Launch</a>
              <a class="button" v-on:click="openDataDirectory(application)">Open Data</a>
              <a class="button" v-on:click="openAppDirectory(application)">Open App</a>
            </div>
          </div>
        </li>
      </ul>
    </div>
    
    <hr>
  </div>

</template>

<script lang="ts">

import Vue from 'vue'
import sim from '@/Simulator'
import { Simulator, Application } from '@/Simulator'

export default Vue.extend({
  name: "Simulator",
  props: {
    simulator: Simulator
  },
  data() {
    return {
      applications: ([] as Application[])
    }
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
      this.$emit('copyToClipboard', this.simulator.udid)
    },
    boot() {
      this.$emit('boot', this.simulator)
    },
    lanuch(application: Application) {
      this.$emit('launchApplication', application, this.simulator)
    },
    openDataDirectory(application: Application) {
      this.$emit('openDataDirectory', application, this.simulator)
    },
    openAppDirectory(application: Application) {
      this.$emit('openAppDirectory', application, this.simulator)
    }
  },
  mounted() {
    sim.fetchApplications(this.simulator)
      .then((r) => {
        this.applications = r
      })
  }
})

</script>

<style>

</style>
