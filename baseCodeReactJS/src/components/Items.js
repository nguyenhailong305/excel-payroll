/* eslint-disable no-undef */
import Table from 'react-bootstrap/Table';
import React, { Component } from 'react';
// import * as XLSX from 'xlsx'; 
import * as fs from 'file-saver';
import {CSVLink } from "react-csv";
const Excel = require('exceljs'); 


class Items extends Component {
    state = {
        id: "",
        name : "",
        age :"",
        nameUpdate : "",
        ageUpdate : "",
        idUpdate : "",
        file : [],
        idLock : []

    }

    handleId = (a) => {
      const idLockNew = [...this.state.idLock]
      if(idLockNew.includes(a)){
        idLockNew.splice(idLockNew.indexOf(a), 1)
      }else {
        idLockNew.push(a)
      }
      console.log(idLockNew);
      this.setState({idLock : idLockNew})
    }

    handleExport = async (sheetName) => {
      const setExport =this.props.items.filter(item => this.state.idLock.includes(item._id))
      this.props.items.map((item , key) => 
        item._id = key + 1
      )  


      const workbook = new Excel.Workbook()
      const  workSheet = workbook.addWorksheet(sheetName)
    
 
      const columns = Object.keys(this.props.items[0]).map((items) => ({
          name: items,
        }))
       
        const rows = setExport.map((entry) => Object.values(entry))

        workbook.getWorksheet("sheet1").addTable({
          name: "sheet1",
          ref: 'H1',
          columns,
          rows
        })
      
       
      workSheet.eachRow((row, rowNumber ) => {
          row.eachCell((cell) => {
            console.log(rowNumber);
            if (rowNumber === 1) {
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFF00" },
              };
            }
          
          });
         
          row.commit();
          });

         
          workbook.xlsx.writeBuffer().then((data) => {
            let blob =  new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

            fs.saveAs(blob, 'CarData.xlsx');
      });
    }
 

   

    handleExportAll = async(sheetName) => {
      this.props.items.map((item , key) => 
        item._id = key + 1
      )  

      const workbook = new Excel.Workbook()
      const  workSheet = workbook.addWorksheet(sheetName)
    
    
      const columns = Object.keys(this.props.items[1]).map((items) => ({
          name: items,
          width : 5000
        }))
        console.log(columns , 'aaaaaaaaaaaa')
      

      

        const rows = this.props.items.map((entry) => Object.values(entry))
        workbook.getWorksheet("sheet1").addTable({
          name: "sheet1",
          ref: 'A1',
          columns,
          rows
        })
        workSheet.mergeCells("B6:E6")
        workSheet.mergeCells("B7:E7")

        workSheet.getTable("sheet1").removeColumns(0,1)
        workSheet.getTable("sheet1").removeRows(1,1)
        workSheet.getTable("sheet1").commit()

      workSheet.eachRow((row, rowNumber ) => {
          row.eachCell((cell) => {
            console.log(rowNumber);
            if (rowNumber === 1) {
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFF00" },
              };
            }

            if (rowNumber === 2) {
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFF02" },
              };
            }
          
            if (rowNumber === 3) {
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFF" },
              };
            }
          
            if (rowNumber === 4) {
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFF00" },
              };
            }
          
          
            
            cell.border = {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" },
            };
          });
         
          row.commit();
          });

         
          workbook.xlsx.writeBuffer().then((data) => {
            let blob =  new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            fs.saveAs(blob, 'CarData.xlsx');
      });
         
    }
    
    render() {
      let listData = []
      if(this.props.items) {
        listData = this.props.items.map((item , index) => {
          return (
              <tr key={index}>
                <th>{item._id}</th>
                <th>{item.Name}</th>
                <th>{item.Age}</th>
                <th>
                  <button onClick={() =>this.props.updateItems({id : item._id  })}>UPDATE</button>
                  <button onClick={() =>this.props.deleteItems({id : item._id})}>DELETE</button>
                </th>
                <th>
                  <input type="checkbox"  onClick={() => this.handleId(item._id)} value={item._id}  checked={this.state.idLock.includes(item._id)} onChange={()=>{}}    />
                  </th>
               
              </tr>
              
          )
        }
        )
        
      }
      
        return (
            <div>
                <input type="file" onChange={(e) => this.setState({file : e.target.files})}/>
                <button onClick={() => this.props.addExcelItems({file : this.state.file})}>IMPORT</button>
                <br/>
                <input onChange={(e) => this.isChange(e , "name")} value={this.state.name}/>
                <button onClick={() => this.props.addItems({name : this.state.name , age : this.state.age})}>ADD</button>
                <br />
                <input onChange={(e) => this.isChange(e , "nameUpdate")} value={this.state.nameUpdate}/>
                <button onClick={() => this.props.updateItems({name : this.state.nameUpdate , age : this.state.ageUpdate})}>UPDATE</button>
           
                <button onClick={() => this.props.deleteAllItems({idLock : this.state.idLock })}>DELETEALL</button>
               
              {/* <a href="http://localhost:3001/item/downloadExcel" variant="contained"  >
              <button>export</button>
                </a>  */}
              
               
              <button variant="contained" onClick={ () => this.handleExportAll() }>Export All</button>

              <button onClick={ () => this.handleExport()}>Export</button>
             

             
           
           {/* <CSVLink
                filename={"my-file.csv"}
                target="_blank"
                data={this.props.items}
                asyncOnClick={true}
            >
                Download me
            </CSVLink>    */}

            <table className="table table-striped table-inverse table-responsive">
              <thead className="thead-inverse">
                <tr>
                  <th>STT</th>
                  <th>Name</th>
                  <th>Age</th>
                </tr>
                </thead>
                <tbody>
                 {listData}
                </tbody>
            </table>
        
        {/* <h2>Bordered Table</h2>
  <p>The .table-bordered class adds borders to a table:</p>            
  <table class="table table-bordered">
    <thead>
      <tr>
      <th rowSpan="2">Nguyễn Hải Long</th>
        <th>Lastname</th>
        <th>Lastname</th>
        <th>Lastname</th>
        <th>Lastname</th>
        <th>Lastname</th>
        <th>Lastname</th>
        
      </tr>
      <tr >
        <th >a</th>
        <th>Lastname</th>
        <th>Lastname</th>
        <th>Lastname</th>
        <th>Lastname</th>
        <th>Lastname</th>
        <th>Email</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th >Thời gian làm việc</th>
        <td>a</td>
        <td>a</td>
        <td>a</td>
        <td>a</td>
        <td>a</td>
        <td>a</td>
      </tr>
      <tr>
      <th>Thời gian OT 150%</th>
        <td>Moe</td>
        <td>mary@example.com</td>
      </tr>
      <tr>
        <th>Thời gian OT 200%</th>
        <td>Dooley</td>
        <td>july@example.com</td>
      </tr>
      <tr>
      <th>Thời gian OT 300%</th>
        <td>Dooley</td>
        <td>july@example.com</td>
      </tr>
      <tr>
      <th>Thưởng</th>
        <td>Dooley</td>
        <td>july@example.com</td>
      </tr>
      <tr>
      <th>Hỗ trợ</th>
        <td>Dooley</td>
        <td>july@example.com</td>
      </tr>
      <tr>
      <th>Bảo hiểm</th>
        <td>Dooley</td>
        <td>july@example.com</td>
      </tr>
      <tr>
      <th>Vay tháng này</th>
        <td>Dooley</td>
        <td>july@example.com</td>
      </tr>
      <tr>
      <th>Trừ nợ tháng này</th>
        <td>Dooley</td>
        <td>july@example.com</td>
      </tr>
      <tr>
      <th>Công nợ</th>
        <td>Dooley</td>
        <td>july@example.com</td>
      </tr>
      <tr>
      <th>Lương thực tế nhận được</th>
        <td>Dooley</td>
        <td>july@example.com</td>
      </tr>

    </tbody>
  </table> */}
            </div>
        );
    }
}

export default Items;