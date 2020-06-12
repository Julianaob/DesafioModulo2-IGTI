import express from "express";
import {promises} from "fs";
import winston from 'winston';
import gradesRouter from './routes/grades.js'
import swaggerUI from 'swagger-ui-express';
//import {swaggerDocument} from './doc.js';
import cors from 'cors';
global.fileName = "grades.json";
const readFile = promises.readFile;
const writeFile = promises.writeFile;

//const router = express.Router();

const app = express();
app.use(express.json());
app.use(cors());
app.use('/grades', gradesRouter);
//app.use('/doc', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

const { combine, timestamp, label, printf } = winston.format;
const myFormat = printf(({level, message, label, timestamp}) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});
global.logger = winston.createLogger({
  level: "silly",
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({ filename: 'grades-control-api.log' }),
  ],
  format: combine(
    label({ label: "grades-control-api"}),
    timestamp(),
    myFormat
  )
});

app.listen(3006, async () => {
  try{  
      await readFile(global.fileName, "utf8");
      logger.info('api started');
      
     }catch(err){       
      const initialJson = {
        nextId: 1,
        grades:[]
        }; 
        writeFile(global.fileName, JSON.stringify(initialJson)).catch(err => {
          logger.err(err);
        });            
  }    
});