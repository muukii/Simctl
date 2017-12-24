<template>
  
  <div class="container">
    <section class="section">
      <h1 class="title">SimulatorList</h1>
      <ul>
        <li v-for="simulator in simulators">
          <SimulatorComp v-bind:simulator=simulator v-on:boot=boot v-on:launchApplication=launchApplication v-on:openDataDirectory=openDataDirectory v-on:copyToClipboard=copyToClipboard></SimulatorComp>
        </li>
      </ul>
    </section>
  </div>
  
</template>

<script lang='ts'>

  import sim from '../../Simulator'
  import Vue from 'vue'
  import { shell, clipboard } from 'electron'

  import SimulatorComp from './Simulator.vue'

  import { Simulator, Application } from '../../Simulator'

  export default Vue.extend({
    name: "SimulatorList",
    components: { SimulatorComp },
    data() {
      return { simulators : [] }
    },
    methods: {
      boot(e) {
        console.log("Should boot", e)
        sim.boot(e)
      },
      launchApplication(application: Application, simulator: Simulator) {
        console.log(application, simulator)
        sim.launch(application, simulator)
      },
      openDataDirectory(application: Application, simulator: Simulator) {
        sim.dataContainerPath(application, simulator)
        .then((path) => {
          shell.openExternal('file:///' + path)
        })
      },
      copyToClipboard(udid: string) {
        clipboard.writeText(udid)
      },
    },
    mounted: function () {
      sim.fetchSimulators()
        .then((r) => {
          this.simulators = r
        })
    }
  })
</script>

<style>

</style>
