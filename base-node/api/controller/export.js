const Models = require('../model/index')
var XLSX = require("xlsx");
const Excel = require('exceljs'); 
const fs= require('fs')


exports.addExcel = async (req , res , _next) => {
    try {
        let file = req.files
    
        let wb = XLSX.readFile(file[0].path) 
        let ws = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
        console.log(wb , ws , "aaaaaaaaaaa");

        const movies = data.map(row => ({
            TimeOT150: row['TimeOT150'],
            TimeOT200: row['TimeOT200'],
            director: row['Director'],
            rating: row['Rating']
        }))

        await Movie.bulkCreate(movies); 
         Models.insertMany(ws, (error, data) => {
            console.log(data , 'aaaaaaaaaa')
            res.send({jsonData , message: "Success"})
        })
        
          
    } catch (error) {   
        res.send(error) 
    }
}

exports.exportUser = async (_req, res) => {
    const movies = await Models.find({
        attributes: [
            'id', 
            'movie', 
            'category', 
            'director', 
            'rating'
        ],
        raw: true
    }); 

    const headings = [
        ['Id', 'Name', 'Date']
    ]; 

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(movies, { 
        origin: 'A2', 
        skipHeader: true 
    });
    XLSX.utils.sheet_add_aoa(ws, headings); 
    XLSX.utils.book_append_sheet(wb, ws, 'Movies');

    const buffer = XLSX.write(wb, { bookType: 'csv', type: 'buffer' }); 
    res.attachment('movies.csv');

    return res.send(buffer);
  };
   

