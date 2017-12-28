
import fs from 'fs'
import path from 'path'
import os from 'os'
import glob from 'glob'
import plist from 'simple-plist'
import { exec, execSync } from 'child_process'
import { shell } from 'electron'

export class Simulator {
  
  readonly udid: string
  readonly deviceType: string
  readonly name: string
  readonly runtime: string
  readonly state: number
  
  constructor(object: any) {
    
    this.udid = object.UDID
    this.deviceType = object.deviceType
    this.name = object.name
    this.runtime = object.runtime
    this.state = object.state
  }
}

export class ApplicationIcon {
  
  readonly filePaths: string[]
  readonly name: string
  
  constructor(plist: any, applicationPath: string) {
    
    this.filePaths = (plist.CFBundleIconFiles as Array<string>)
      .map(value => path.join(applicationPath, value))
      
    console.log(this.filePaths)
      
    this.name = (plist.CFBundleIconName as string | undefined) || ""
    
  }
}

export class Application {
    
  readonly name: string
  readonly bundleIdentifier: string
  readonly applicationIcon: ApplicationIcon | null
  readonly path: string
  
  constructor(appPath: string) {
    
    const appInfoPlistPath = path.join(appPath, 'Info.plist')
    const info: any = plist.readFileSync(appInfoPlistPath)
    
    this.path = appPath
    this.name = info.CFBundleDisplayName || info.CFBundleName
    this.bundleIdentifier = info.CFBundleIdentifier
    
    if (info.CFBundleIcons != null && info.CFBundleIcons.CFBundlePrimaryIcon != null) {
      this.applicationIcon = new ApplicationIcon(info.CFBundleIcons.CFBundlePrimaryIcon, appPath)
    } else {
      this.applicationIcon = null
    }
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
                
      glob(pattern, (error, files: [any]) => {
                            
        const applications = files.map((file) => {
          
          const appPath = glob.sync(path.join(file, '*.app'))[0]
          
          return new Application(appPath)
                    
        })
        
        resolve(applications)
      })
    })
  },
  async boot(simulator: Simulator): Promise<void> {
        
    try {
      await this.__exec(`xcrun simctl boot ${simulator.udid}`)
    } catch(e) {
    }
    
    return Promise.resolve()
  },
  async dataContainerPath(forApplication: Application, onSimulator: Simulator): Promise<string> {
    
    await this.boot(onSimulator)
    const path = await this.__exec(`xcrun simctl get_app_container ${onSimulator.udid} ${forApplication.bundleIdentifier} data`)
    
    return Promise.resolve(path)
  },
  async launch(application: Application, onSimulator: Simulator): Promise<void> {
    
    this.openSimulator()
    
    await this.boot(onSimulator)
    await this.__exec(`xcrun simctl launch ${onSimulator.udid} ${application.bundleIdentifier}`)
    
    return Promise.resolve()
  },
  openSimulator() {
    const simulatorPath = path.join(execSync('xcode-select -p').toString().trim(), '/Applications/Simulator.app')
    shell.openExternal(`file:///${simulatorPath}`)
  },
  async __exec(command: string): Promise<string> {
    return new Promise<string>((p_resolve, p_error) => {
      exec(command, (error, r) => {
        if (error) {
          p_error(error)
        } else {
          p_resolve(r)
        }
      })
    })
  }
}
