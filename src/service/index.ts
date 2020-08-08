// import * as https from 'https'
import * as express from 'express'
import * as multer from 'multer'
import * as path from "path";
import router from './src/routes'
const app = express();
const upload = multer()

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(upload.single('file')); // for parsing multipart/form-data

app.use('/', express.static(path.resolve('./gui')))
app.use('/', router)

export const appListener = app.listen(4200, function () {
  console.log('服務已開啟，請查看 http://localhost:4200');
});




// 捕獲 README 資料
// https.get('https://raw.githubusercontent.com/frank575/project-color-compiler/master/README.md', (response) => {
//   // res.setHeader('Content-disposition', 'attachment; filename=' + 'hello.jpg');
//   // res.setHeader('Content-type', 'application/octet-stream');
//   // response.pipe(res)
//   response.on('data', function (chunk: Buffer) {
//     const readMeData: string = chunk.toString()
//     console.log(readMeData);
//   });
// });