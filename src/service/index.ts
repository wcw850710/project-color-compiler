import * as express from 'express'
import * as multer from 'multer'
import * as path from "path";
import router from './routes'
const app = express();
const upload = multer()

app.use('/', express.static(path.resolve('../dist/gui')))
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// for parsing multipart/form-data
app.use(upload.single('file'));

app.use('/', router)

app.listen(4200, function () {
  console.log('服務已開啟，請查看 http://localhost:4200');
});

