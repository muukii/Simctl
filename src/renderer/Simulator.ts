
import fs from 'fs'
import path from 'path'
import os from 'os'
import glob from 'glob'
import plist from 'simple-plist'
import { exec, execSync } from 'child_process'
import { shell } from 'electron'

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

export class Application {
  
  name: string
  bundleIdentifier: string
  iconFilePaths: string[] = []
  
  constructor(name: string, bundleIdentifier: string) {
    this.name = name
    this.bundleIdentifier = bundleIdentifier
    // this.iconFilePaths = iconFilePaths
  }
}

const baseDir: string = path.join(os.homedir(), 'library/Developer/CoreSimulator/Devices')

export default {
  async fetchSimulators(): Promise<Simulator[]> {
    return new Promise<Simulator[]>((resolve) => {
      
      const isDirectory = source => fs.lstatSync(source).isDirectory()
      
      let files = fs.readdirSync(baseDir)
        .map(p => path.join(baseDir, p))
        .filter(isDirectory)
        .sort((a, b) => {
          return fs.statSync(b).mtime.getTime() - fs.statSync(a).mtime.getTime();
        })
                  
      const sims = files
        .map((file) => { return plist.parse(fs.readFileSync(path.join(file, 'device.plist'), 'utf8')) })
        .map((obj) => { return new Simulator(obj) })
      
      resolve(sims)
    })
  },
  async fetchApplications(forSimulator: Simulator): Promise<Application[]> {
    
    return new Promise<Application[]>((resolve, reject) => {
      
      const pattern = path.join(baseDir, `/${forSimulator.udid}/data/Containers/Bundle/Application/*`)
      
      console.log(pattern)
      
      glob(pattern, (error, files: [any]) => {
                            
        const applications = files.map((file) => {
          
          const appPath = glob.sync(path.join(file, '*.app'))[0]
          
          const appInfoPlistPath = path.join(appPath, 'Info.plist')
                    
          const info = plist.readFileSync(appInfoPlistPath)
          
          console.log(info)
          
          const containerPlistPath = path.join(file, '/.com.apple.mobile_container_manager.metadata.plist')
          
          const plistFile = plist.readFileSync(containerPlistPath)
          
          // const info = plist.parse(fs.readFileSync(containerPlistPath, 'utf8'))
          // console.log(app, info)
          
          return new Application(
            info.CFBundleDisplayName || info.CFBundleName,
            info.CFBundleIdentifier
          )
          
        })
        
        resolve(applications)
      })
    })
  },
  async boot(simulator: Simulator): Promise<void> {
    
    this.openSimulator()
      
    return new Promise<void>((resolve) => {
      exec(`xcrun simctl boot ${simulator.udid}`, (error, r) => {
        console.log(error, r)
        resolve()
      })
    })
  },
  async dataContainerPath(forApplication: Application, onSimulator: Simulator): Promise<string> {
    
    await this.boot(onSimulator)
    
    return new Promise<string>((resolve) => {
      exec(`xcrun simctl get_app_container ${onSimulator.udid} ${forApplication.bundleIdentifier} data`, (error, r) => {
        console.log(error, r)
        resolve(r)
      })
    })
  },
  async launch(application: Application, onSimulator: Simulator): Promise<void> {
    
    this.openSimulator()
    
    await this.boot(onSimulator)
    
    return new Promise<void>((resolve) => {
      exec(`xcrun simctl launch ${onSimulator.udid} ${application.bundleIdentifier}`, (error, r) => {
        console.log(error, r)
        resolve()
      })
    })
  },
  openSimulator() {
    const simulatorPath = path.join(execSync('xcode-select -p').toString().trim(), '/Applications/Simulator.app')
    shell.openExternal(`file:///${simulatorPath}`)
  }
}
