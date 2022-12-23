const Models = require('../model/index')
// var XLSX = require("xlsx");
const Excel = require('exceljs'); 
const fs= require('fs')


exports.getItem = async (req , res , next) => {
    try {
        const listData = await Models.find()
        res.send({listData})
    } catch (error) {
        res.send(error)
    }
}

exports.addExcel = async (req , res , _next) => {
    try {
        let file = req.files
      
        const workbook = new Excel.Workbook();
       
        await workbook.xlsx.readFile(file[0].path);
        let jsonData = [];
         workbook.worksheets.forEach(function(sheet) {
        // read first row as data keys
        let firstRow = sheet.getRow(1);
        if (!firstRow.cellCount) return;
        let keys = firstRow.values;
        sheet.eachRow((row, rowNumber) => {
            if (rowNumber == 1) return;
            let values = row.values
            let obj = {};
            for (let i = 1; i < keys.length; i ++) {
                obj[keys[i]] = values[i];
            }
            jsonData.push(obj);
        })

    });
    console.log(jsonData);
        // let wb = XLSX.readFile(file[0].path) 
        // let ws = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
        // console.log(wb , ws , "aaaaaaaaaaa");

         Models.insertMany(jsonData, (error, data) => {
            console.log(data , 'aaaaaaaaaa')
            res.send({jsonData , message: "Success"})
        })
        
          
    } catch (error) {   
        res.send(error) 
    }
}

exports.addItem = async (req , res , _next) => {
    try {
        const listData = await Models.create({name : req.body.name , age : req.body.age})
        res.send({listData})
    } catch (error) {
        res.send(error)
    }
}

exports.deleteItem = async (req , res , _next) => {
    try {
        await Models.findByIdAndDelete(req.params.id)
        res.send({}) 
    } catch (error) {
        res.send(error)
    }
}
exports.updateItem = async (req , res , _next) => {
    try {
        await Models.findByIdAndUpdate(req.param.id , {name : req.body.name})
        res.send({})
    } catch (error) {
        res.send(error)
    }
}

exports.paginateItem = async(req, res, _next) => {
    try {
        const limit = parseInt(req.query.limit)
        const activePage = parseInt(req.query.activePage)
        const skip = (activePage - 1)*limit
        const totalRecord = await Models.countDocuments({})
        const totalPage = Math.ceil(totalRecord / limit)
        const listData = await Models.find().select(["-__v" ]).skip(skip).limit(limit)
        res.send({listData , totalPage})
    } catch (error) {
        res.send({error : error})
    }
}

exports.searchItem = async(req, res, _next) => {
    try {
        const name = req.query.textSearch
        const limit = parseInt(req.query.limit)
        const activePage = parseInt(req.query.activePage)
        const skip = (activePage - 1)*limit
        const totalRecord = await Models.countDocuments({name : {$regex : name  , $options : 'i'}})
        const totalPage = Math.ceil(totalRecord / limit)
        const listData = await Models.find({name : {$regex : name  , $options : 'i'}}).skip(skip).limit(limit)
        res.send({listData , totalPage})
    } catch (error) {
        res.send({error : error})
    }
}


 exports.exportUser = async (_req, res) => {
        Models.find().then(async (objs) => {  
          let tutorials = [];

          let counter = 0;
          objs.forEach((obj) => {
            obj.id = counter;
            counter++;
            tutorials.push({
              id: counter,     
              name: obj.Name,
              age: obj.Age,
            });
          });
      
          let workbook = new Excel.Workbook();
          let worksheet = workbook.addWorksheet("Tutorials");
      
          worksheet.columns = [
            { header: "Id", key: "id", width: 25 },
            { header: "Name", key: "name", width: 25 },
            { header: "Age", key: "age", width: 25 },
           
          ];
      

        
          // Add Array Rows 
          worksheet.addRows(tutorials);
      
          res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          );
          res.setHeader(
            "Content-Disposition",
            "attachment; filename=" + "tutorials.xlsx"
          );
      
          await workbook.xlsx.write(res);
            res.status(200).end();
        });
      };
       

exports.deleteAll = async (req , res , next) => { 
    try {
        console.log(req.body);
        const idLock = req.body.idLock
        for(let i = 0; i < idLock.length; i++) {
            await Models.findByIdAndDelete(idLock[i])
        }

        res.send({})
    } catch (error) {
        res.send(error)
    }
}