import * as child_process from "child_process";
import {appListener} from "../../index";

// 更新專案
export const updateProject = () => {
  const env = process.env.NODE_ENV
  const cdPath: string = env === 'production' ? '..' : '../../' as string
  appListener.close()
  child_process.execSync(`cd ${cdPath} && npm run update:project`)
}