import {iExpressRoute} from "../interfaces/route";
import {sendResponse} from "../utils/sendResponse";
interface iProject {
  name: string
  config: {
    fileExtensions: string[]
    compileFile: [string, string]
    compilePath: string
    rootPath: string
    isAutoImport: boolean
  }
}
const importProject: iExpressRoute = (req, res) => {
  const { buffer } = req.file
  const data: iProject[] = JSON.parse(buffer.toString())
  sendResponse(res, {
    status: 200,
    message: '哈囉',
    data
  })
}
export default importProject