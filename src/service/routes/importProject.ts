import {iExpressRoute} from "../interfaces/route";
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
  res.status(200).send({
    message: '哈囉',
    data
  })
}
export default importProject