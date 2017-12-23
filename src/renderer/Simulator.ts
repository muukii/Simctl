
import fs from 'fs'
import path from 'path'
import os from 'os'
import glob from 'glob'
import plist from 'plist'
import { exec } from 'child_process'

export class Simulator {
  
  udid: string
  deviceType: string
  name: string
  runtime: string
  state: number
  
  constructor(object: any) {
    
    this.udid = object.UDID
    this.deviceType = object.deviceType
    this.name = object.name
    this.runtime = object.runtime
    this.state = object.state
  }
}

export default {
  async testSim(): Promise<Simulator[]> {
    
    return new Promise<Simulator[]>((resolve, reject) => {
      
      const pattern = path.join(os.homedir(), 'library/Developer/CoreSimulator/Devices/*/*.plist')
        
      console.log('Find device.plist', pattern)
            
      glob(pattern, (error, files: [any]) => {
        
        const result: Simulator[] = files
          .map((file) => { return plist.parse(fs.readFileSync(file, 'utf8')) })
          .map((obj) => { return new Simulator(obj) })
                          
        resolve(result)
      })
    })
  },
  boot(simulator: Simulator): void {
    exec(`xcrun simctl boot ${simulator.udid}`, (error, r) => {
      console.log(error, r)
    })
  },
  launch(simulator: Simulator): void {
  }
}
