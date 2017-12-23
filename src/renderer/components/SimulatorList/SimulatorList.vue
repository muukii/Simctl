<template>
  
  <div class="container">
    <section class="section">
      <h1 class="title">SimulatorList</h1>
      <ul>
        <li v-for="simulator in simulators">
          <Simulator v-bind:simulator=simulator v-on:boot=boot></Simulator>
        </li>
      </ul>
    </section>
  </div>
  
</template>

<script lang="ts">

import sim from '../../Simulator'
import Vue from 'vue'

import Simulator from './Simulator.vue'

export default Vue.extend({
  name: "SimulatorList",
  components: { Simulator },
  data() {
    return { simulators : [] }
  },
  methods: {
    boot(e) {
      console.log("Should boot", e)
      sim.boot(e)
    }
  },
  mounted: function () {
    sim.testSim()
      .then((r) => {
        this.simulators = r
      })
      
    this.$on('boot', () => { console.log('hi') })
  }
})

</script>

<style>

</style>
