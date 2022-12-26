/* eslint-disable no-undef */
import Table from "react-bootstrap/Table";
import React, { Component } from "react";
// import * as XLSX from 'xlsx';
import * as fs from "file-saver";
import { CSVLink } from "react-csv";
const Excel = require("exceljs");
const dayjs = require("dayjs");
import ('dayjs/locale/vi')
class Items extends Component {
  state = {
    id: "",
    name: "",
    age: "",
    nameUpdate: "",
    ageUpdate: "",
    idUpdate: "",
    file: [],
    idLock: [],
    thu: [],
    timeWork: [],
    dateAll: [],
    month: [],
    week: [],
    timeworkInfo : [],
    timework200 : []
  };

  

  handleId = (a) => {
    const idLockNew = [...this.state.idLock];
    if (idLockNew.includes(a)) {
      idLockNew.splice(idLockNew.indexOf(a), 1);
    } else {
      idLockNew.push(a);
    }
    console.log(idLockNew);
    this.setState({ idLock: idLockNew });
  };

  // handleExport = async (sheetName) => {
  //   const setExport =this.props.items.filter(item => this.state.idLock.includes(item._id))
  //   this.props.items.map((item , key) =>
  //     item._id = key + 1
  //   )

  //   const workbook = new Excel.Workbook()
  //   const  workSheet = workbook.addWorksheet(sheetName)

  //   const columns = Object.keys(this.props.items[0]).map((items) => ({
  //       name: items,
  //     }))

  //     const rows = setExport.map((entry) => Object.values(entry))

  //     workbook.getWorksheet("sheet1").addTable({
  //       name: "sheet1",
  //       ref: 'H1',
  //       columns,
  //       rows
  //     })

  //   workSheet.eachRow((row, rowNumber ) => {
  //       row.eachCell((cell) => {
  //         console.log(rowNumber);
  //         if (rowNumber === 1) {
  //           cell.fill = {
  //             type: "pattern",
  //             pattern: "solid",
  //             fgColor: { argb: "FFFF00" },
  //           };
  //         }

  //       });

  //       row.commit();
  //       });

  //       workbook.xlsx.writeBuffer().then((data) => {
  //         let blob =  new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

  //         fs.saveAs(blob, 'CarData.xlsx');
  //   });
  // }
  

  handleExportAll = async (sheetName) => {
    this.props.items.map((item, key) => (item._id = key + 1));

    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);

    // Set the column widths for columns A, B, and C
    worksheet.getColumn(1).width = 30;

    
  

    const year = 2022;
    const month = 11;

    const daysInMonth = dayjs().year(year).month(month).daysInMonth();  
    // Add the weekdays, days, and months of the month to the worksheet
    // const daysInMonth = dayjs().daysInMonth();
    console.log(daysInMonth , 'month' )
    let a = [];
    let b = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const date = dayjs().year(year).month(month).date(i);
      const url = (worksheet.getCell(`B1`).value = date.format('D/M'))
      a.push(url);
      this.setState({
        month: a,
      });
    }


    

    dayjs.locale('vi');
  
    
    for (let i = 0; i <= daysInMonth; i++) {
      const date = dayjs().year(year).month(month).date(i); // update the day inside the loop
      const weekday = date.format('dd');  // format the date as the name of the weekday in Vietnamese
      
      const cell = worksheet.getCell(`B2`);
      if (cell) {  // check if the cell exists
        const urls = cell.value = weekday;  // access the value property if the cell exists
        b.push(urls);
        this.setState({
          week: b
        });
      }
    }


    const timework = [];
    for(let i = 0 ; i <= daysInMonth ; i++) {
      const date = dayjs().year(year).month(month).date(i);  // update the day inside the loop
      const weekday = date.format('dd');
      const url = (worksheet.getCell(`B1`).value = dayjs()
        .date(i)
        .format("DD/M"));
      if(weekday === 'T7' || weekday === 'CN') {
        timework.push('x')
      // eslint-disable-next-line no-mixed-operators
      }else if (weekday === 'T5' && url === '01/12' || weekday === 'T6' && url === '02/12') {
        timework.push('0,00')
      }else {
        timework.push('8,00')
      }
      this.setState({
        timeworkInfo : timework 
      })
    }

    const timework200 = [];
    for(let i = 0; i <= daysInMonth ; i++) {
      const date = dayjs().year(year).month(month).date(i); // update the day inside the loop
      const weekday = date.format('dd');
      if(weekday === 'T7' || weekday === 'CN') {
        timework200.push('x')
      }else {
        timework200.push('0')
      }
      this.setState({
        timework200 : timework200 
      })
    }

    // Day of the week
    const columns = this.state.month.map((items) => ({
      name: items,
    }));

    console.log(columns, "111");


    const columnss = this.state.week.map((items) => items);

    console.log(columnss, "2222");

    const columnsss = this.state.timeworkInfo.map((items) => items);

    console.log(columnsss, "2222");

    const columnssss = this.state.timework200.map((items) => items);

    console.log(columnssss, "2222");


    const rows = this.props.items.map((entry) => Object.values(entry));
    console.log(rows, "aaaaaaaaaaa");

    workbook.getWorksheet("sheet1").addTable({
      name: "sheet1",
      ref: "B1",
      columns: columns,
      rows,
    });

    const table = worksheet.getTable("sheet1");
    worksheet.insertRow(2, columnss);
    worksheet.insertRow(3, columnsss);
    worksheet.insertRow(4, columnssss);

    worksheet.getCell('A2').font = {
      name: 'Arial Black',
      color: { argb: 'FF00FF00' },
      family: 2,
      size: 14,
      italic: true
    };

    table.commit();

    worksheet.mergeCells("A1:A2");
    worksheet.mergeCells("B6:AF6");
    worksheet.mergeCells("B7:AF7");
    worksheet.mergeCells("B8:AF8");
    worksheet.mergeCells("B9:AF9");
    worksheet.mergeCells("B10:AF10");
    worksheet.mergeCells("B11:AF11");
    worksheet.mergeCells("B12:AF12");
    worksheet.mergeCells("B13:AF13");

    worksheet.getCell("A2").value = "Vuong Quoc Tuan";
    worksheet.getCell("A3").value = "Thời gian làm việc";
    worksheet.getCell("A4").value = "Thời gian OT 150%";
    worksheet.getCell("A5").value = "Thời gian OT 200%";
    worksheet.getCell("A6").value = "Thời gian OT 300%";
    worksheet.getCell("A7").value = "Thưởng";
    worksheet.getCell("A8").value = "Hỗ trợ";
    worksheet.getCell("A9").value = "Bảo hiểm";
    worksheet.getCell("A10").value = "Vay tháng này";
    worksheet.getCell("A11").value = "Trừ nợ tháng này";
    worksheet.getCell("A12").value = "Còn nợ";
    worksheet.getCell("A13").value = "Lương thực tế nhận được";

    // const columns = Object.keys(this.props.items[1]).map((items) => ({
    //     name: items,
    //     width : 5000
    //   }))
    //   console.log(columns , 'aaaaaaaaaaaa')

    //   function getDaysInMonth(year, month) {
    //     return new Date(year, month, 0).getDate();
    //   }
    //   const daysInDecember = getDaysInMonth(2022, 12);

    //   for ( let i = 1; i <= daysInDecember; i++){
    //     if (i < 10) {
    //       this.state.dateAll.push('0' + i + '/' + '12')
    //     } else {
    //       this.state.dateAll.push(i + '/' + '12')
    //     }
    //   }

    //   const thu = {0: 'CN', 1: 'T2', 2: 'T3', 3: 'T4', 4: 'T5', 5: 'T6', 6:'T7'}

    //   for ( let i = 1; i <= 31; i++){
    //       this.state.thu.push(thu[new Date(`December ${i}, 2022 00:00:001`).getDay()])
    //   }

    // for(let i = 1; i <= 31 ; i++) {
    //   if(thu[new Date(`December ${i}, 2022 00:00:00`).getDay()] === "T7" || thu[new Date(`December ${i}, 2022 00:00:00`).getDay()] === "CN"){
    //     this.state.timeWork.push('x')
    //   }else {
    //     this.state.timeWork.push(8.00)
    //   }
    // }

    //   workSheet.addRow(this.state.dateAll)
    //   workSheet.addRow(this.state.thu)
    //   workSheet.addRow(this.state.timeWork)

    //   const rows = this.props.items.map((entry) => Object.values(entry))
    //   workbook.getWorksheet("sheet1").addTable({
    //     name: "sheet1",
    //     ref: 'A1',
    //     columns,
    //     rows
    //   })
    //   workSheet.mergeCells("B6:E6")
    //   workSheet.mergeCells("B7:E7")

    //   workSheet.getTable("sheet1").removeColumns(0,1)
    //   workSheet.getTable("sheet1").removeRows(1,1)
    //   workSheet.getTable("sheet1").commit()

    // workSheet.eachRow((row, rowNumber ) => {
    //     row.eachCell((cell) => {
    //       console.log(rowNumber);
    //       if (rowNumber === 1) {
    //         cell.fill = {
    //           type: "pattern",
    //           pattern: "solid",
    //           fgColor: { argb: "FFFF00" },
    //         };
    //       }

    //       if (rowNumber === 2) {
    //         cell.fill = {
    //           type: "pattern",
    //           pattern: "solid",
    //           fgColor: { argb: "FFF02" },
    //         };
    //       }

    //       if (rowNumber === 3) {
    //         cell.fill = {
    //           type: "pattern",
    //           pattern: "solid",
    //           fgColor: { argb: "FFF" },
    //         };
    //       }

    //       if (rowNumber === 4) {
    //         cell.fill = {
    //           type: "pattern",
    //           pattern: "solid",
    //           fgColor: { argb: "FFFF00" },
    //         };
    //       }

    //       cell.border = {
    //         top: { style: "thin" },
    //         left: { style: "thin" },
    //         bottom: { style: "thin" },
    //         right: { style: "thin" },
    //       };
    //     });

    //     row.commit();
    //     });

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      fs.saveAs(blob, "CarData.xlsx");
    });
  };

  render() {
    let paginate = [];
    let totalPage = this.props.totalPage;
    let activePage = this.props.activePage;
    for (let i = 1; i <= totalPage; i++) {
      let button = (
        <button
          key={i}
          onClick={() => {
            this.props.textSearch
              ? this.props.searchItems({
                  activePage: i,
                  textSearch: this.props.textSearch,
                })
              : this.props.paginateItems(i);
          }}
          style={{ backgroundColor: activePage === i ? "blue" : "white" }}
        >
          {i}
        </button>
      );
      paginate.push(button);
    }

    let listData = [];
    if (this.props.items) {
      listData = this.props.items.map((item, index) => {
        return (
          <tr key={index}>
            <th>{item._id}</th>
            <th>{item.Name}</th>
            <th>{item.Age}</th>
            <th>
              <button onClick={() => this.props.updateItems({ id: item._id })}>
                UPDATE
              </button>
              <button onClick={() => this.props.deleteItems({ id: item._id })}>
                DELETE
              </button>
              {/* <a href="http://localhost:3001/item/downloadExcel" variant="contained"  >
                    <button>export</button>
                  </a>  */}
            </th>

            <th>
              <input
                type="checkbox"
                onClick={() => this.handleId(item._id)}
                value={item._id}
                checked={this.state.idLock.includes(item._id)}
                onChange={() => {}}
              />
            </th>
          </tr>
        );
      });
    }

    return (
      <div>
        <input
          type="file"
          onChange={(e) => this.setState({ file: e.target.files })}
        />
        <button
          onClick={() => this.props.addExcelItems({ file: this.state.file })}
        >
          IMPORT
        </button>
        <br />
        <input
          onChange={(e) => this.isChange(e, "name")}
          value={this.state.name}
        />
        <button
          onClick={() =>
            this.props.addItems({ name: this.state.name, age: this.state.age })
          }
        >
          ADD
        </button>
        <br />
        <input
          onChange={(e) => this.isChange(e, "nameUpdate")}
          value={this.state.nameUpdate}
        />
        <button
          onClick={() =>
            this.props.updateItems({
              name: this.state.nameUpdate,
              age: this.state.ageUpdate,
            })
          }
        >
          UPDATE
        </button>

        <button
          onClick={() =>
            this.props.deleteAllItems({ idLock: this.state.idLock })
          }
        >
          DELETEALL
        </button>

        <a href="http://localhost:3001/item/downloadExcel" variant="contained">
          <button>export</button>
        </a>

        <button variant="contained" onClick={() => this.handleExportAll()}>
          Export All
        </button>

        <button onClick={() => this.handleExport()}>Export</button>

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
          <tbody>{listData}</tbody>
        </table>
        {paginate}
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
