import {iExpressRoute} from "../interfaces/route";
const renderGui: iExpressRoute = (_, res) => {
  res.status(200).sendFile('/gui/index.html')
}
export default renderGui