<template>
  
  <div class="container">
    <section class="section">
      <h1 class="title">SimulatorList</h1>
      <ul>
        <li v-for="simulator in simulators">
          <SimulatorComp v-bind:simulator=simulator v-on:boot=boot v-on:launchApplication=launchApplication v-on:openDataDirectory=openDataDirectory v-on:openAppDirectory=openAppDirectory v-on:copyToClipboard=copyToClipboard></SimulatorComp>
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
  import Notification from '../Notification/Notification.vue'
  import path from 'path'

  export default Vue.extend({
    name: "SimulatorList",
    components: { SimulatorComp },
    data() {
      return { simulators : [] }
    },
    methods: {
      boot(e) {
        sim.boot(e)
        this.showNotification("Start booting")
      },
      launchApplication(application: Application, simulator: Simulator) {
        sim.launch(application, simulator)
        this.showNotification("Start launching")
      },
      openDataDirectory(application: Application, simulator: Simulator) {
        sim.dataContainerPath(application, simulator)
        .then((path) => {
          shell.openExternal('file:///' + path)
        })
      },
      openAppDirectory(application: Application, simulator: Simulator) {
        shell.openExternal('file:///' + path.parse(application.path).dir)
      },
      copyToClipboard(udid: string) {
        clipboard.writeText(udid)
        this.showNotification("Copied UDID to Clipboard")
      },
      showNotification(message: string) {
        const notification = new Notification({
          propsData: {
            message: message,
            onDismiss: () => {
              this.$root.$el.removeChild(notification.$el)
            }
          }
        })
        .$mount();
        
        this.$root.$el.appendChild(notification.$el)
      }
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
