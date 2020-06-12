import express from "express";
import {promises} from "fs";

const router = express.Router();
const readFile = promises.readFile;
const writeFile = promises.writeFile;
import libs from '../libs/calculations.js'

//Item 1
router.post("/", async (req, res) => {
  console.log('testes');
  let grade = req.body;  
  let timestamp = new Date();
  try{
    let data = await readFile(global.fileName, "utf8");
    let json = JSON.parse(data);   
    grade = { id: json.nextId++, ...grade, timestamp: timestamp };
    json.grades.push(grade); 
    await  writeFile(global.fileName, JSON.stringify(json));
    res.end();    

    logger.info(`POST / grades - ${JSON.stringify(grades)}`);
  }catch(err){
    res.status(400).send({error: err.message});
    logger.error(`POST / grades - ${err.message}`);
  };  
});

router.get("/", async (_, res) => {
  try{
    let data = await readFile(global.fileName, 'utf8');
    let json = JSON.parse(data);    
    delete json.nextId; 
    res.send(json);
    logger.info("GET / grades");
  } catch(err){
    res.status(400).send({error: err.message});
    logger.error(`GET / grades - ${err.message}`);
  } 
 });

 //Item 2
 router.put("/", async (req, res) => {  
  try{
    let newGrades = req.body;  
    let data = await readFile(global.fileName, "utf8");            
    let json = JSON.parse(data);
    
    let oldIndex = json.grades.findIndex(grades => grades.id === newGrades.id); 
    console.log(json.grades[oldIndex]);   
    json.grades[oldIndex].student = newGrades.student;
    json.grades[oldIndex].subject = newGrades.subject;
    json.grades[oldIndex].type = newGrades.type;
    json.grades[oldIndex].value = newGrades.value;

    await writeFile(global.fileName, JSON.stringify(json));
    res.end(); 
    logger.info(`PUT / grades - ${JSON.stringify(newGrades)}`); 
  }
  catch(err){
    res.status(400).send({error: err.message});
    logger.error(`PUT / grades - ${err.message}`);
  } 
});

//Item 3
 router.delete("/:id", async (req, res) => {
  try{
     let data = await readFile(global.fileName, "utf8");
     let json = JSON.parse(data);
     let grade = json.grades.filter(grade => grade.id !== parseInt(req.params.id, 10));
     json.grades = grade;
     await writeFile(global.fileName, JSON.stringify(json));
     res.end();
     logger.info(`Delete / grades/id: - ${req.params.id}`);
  }catch(err){
   res.status(400).send({error: err.message});
   logger.error(`DELETE / grades/id: - ${err.message}`);
  }  
});

//Item 4
// router.get("/:id", async (req, res) => {   
//   try{
//       let data = await readFile(global.fileName, 'utf8');
//       let json = JSON.parse(data);
//       const grade = json.grades.find(grades => grades.id === parseInt(req.params.id), 10);
//       if(grade){
//       res.send(grade);
//       logger.info(`GET / grades/id: - ${JSON.stringify(grades)}`);
//       }else{
//         res.end();
//         logger.info("GET / grades/id:");
//       }      
//   }catch(err){
//       res.status(400).send({error: err.message});
//       logger.error(`GET / grades/id: - ${err.message}`);
//   }     
//  });

 // Item 5 - Crie um endpoint para consultar a nota total de um aluno em uma disciplina.
 // O endpoint deverá receber como parâmetro o student e o subject, e realizar a soma 
 //de todas as notas de atividades correspondentes àquele subject, para aquele student.
 // O endpoint deverá retornar a soma da propriedade value dos registros encontrados.

//  router.get("/:student/:subject", async (req, res) => {
//   try{
//     let json = JSON.parse(await readFile(global.fileName, 'utf8'));    
//     let calc = json.grades.filter(calcs => {
//       return calcs.student === req.params.student && 
//             calcs.subject === req.params.subject
//      });      
//     calc = calc.map(calcs =>{
//       return calcs.value;
//     });
//       res.send({value: libs.summation(calc)});
//       logger.info("GET / grades");
//   } catch(err){
//       res.status(400).send({error: err.message});
//       logger.error(`GET / grades - ${err.message}`);
//   } 
//  });

 //Item 6 Media por subject e type

//  router.get("/:subject/:type", async (req, res) => {
//   try{
//     let json = JSON.parse(await readFile(global.fileName, 'utf8'));    
//     let calc = json.grades.filter(calcs => {
//       return calcs.subject === req.params.subject && 
//             calcs.type === req.params.type
//      });

//      calc = calc.map(calcs =>{
//              return calcs.value;
//       });     
      
//       res.send({Average: libs.calcAverage(calc)});
//       logger.info("GET / grades");
//   } catch(err){
//       res.status(400).send({error: err.message});
//       logger.error(`GET / grades - ${err.message}`);
//   } 
//  });

 //Item 7 - 3 melhores grades
router.get("/:subject/:type", async (req, res) => {
  try{
    let json = JSON.parse(await readFile(global.fileName, 'utf8'));  
    let calc = json.grades.filter(calcs => {
      return calcs.subject === req.params.subject && 
            calcs.type === req.params.type
     }).sort((a, b) => 
          b.value - a.value).splice(0,3);  

      res.send({...calc});
      logger.info("GET / grades");
  } catch(err){
      res.status(400).send({error: err.message});
      logger.error(`GET / grades - ${err.message}`);
  } 
 });

export default router;