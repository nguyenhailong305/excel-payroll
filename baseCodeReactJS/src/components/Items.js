import React, { Component } from "react";
// import * as XLSX from 'xlsx';
import * as fs from "file-saver";
// import { CSVLink } from "react-csv";
const Excel = require("exceljs");
const dayjs = require("dayjs");
import("dayjs/locale/vi");
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
    timeworkInfo: [],
    timework200: [],
    timework300: [],
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
    const month = 8;

    const daysInMonth = dayjs().year(year).month(month).daysInMonth();
    // Add the weekdays, days, and months of the month to the worksheet
    // const daysInMonth = dayjs().daysInMonth();
    console.log(daysInMonth, "month");
    let a = [];
    let b = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const date = dayjs().year(year).month(month).date(i);
      const url = (worksheet.getCell(`B1`).value = date.format("DD/M"));
      a.push(url);
      this.setState({
        month: a,
      });
    }

    dayjs.locale("vi");

    for (let i = 0; i <= daysInMonth; i++) {
      const date = dayjs().year(year).month(month).date(i); // update the day inside the loop
      const weekday = date.format("dd"); // format the date as the name of the weekday in Vietnamese

      const cell = worksheet.getCell(`B2`);
      if (cell) {
        // check if the cell exists
        const urls = (cell.value = weekday); // access the value property if the cell exists
        b.push(urls);
        this.setState({
          week: b,
        });
      }
    }

    const timework = [];
    for (let i = 0; i <= daysInMonth; i++) {
      const date = dayjs().year(year).month(month).date(i); // update the day inside the loop
      const weekday = date.format("dd");
      const url = (worksheet.getCell(`B1`).value = dayjs()
        .date(i)
        .format("DD/M"));
      if (weekday === "T7" || weekday === "CN") {
        timework.push("x");
        // eslint-disable-next-line no-mixed-operators
      } else if (
        (weekday === "T5" && url === "01/12") ||
        (weekday === "T6" && url === "02/12")
      ) {
        timework.push("0,00");
      } else if (weekday === "T2" && url === "26/12") {
        timework.push("4,00");
      } else {
        timework.push("8,00");
      }
      this.setState({
        timeworkInfo: timework,
      });
    }

    const timework200 = [];
    for (let i = 0; i <= daysInMonth; i++) {
      const date = dayjs().year(year).month(month).date(i); // update the day inside the loop
      const weekday = date.format("dd");
      if (weekday === "T7" || weekday === "CN") {
        timework200.push("x");
      } else {
        timework200.push("0");
      }
      this.setState({
        timework200: timework200,
      });
    }

    const timework300 = [];
    for (let i = 0; i <= daysInMonth; i++) {
      const date = dayjs().year(year).month(month).date(i); // update the day inside the loop
      const weekday = date.format("dd");
      if (weekday === "T7" || weekday === "CN") {
        timework300.push("x");
      } else {
        timework300.push("0");
      }
      this.setState({
        timework300: timework300,
      });
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

    const columnsssss = this.state.timework300.map((items) => items);

    console.log(columnsssss, "2222");

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
    worksheet.insertRow(5, columnsssss);

    const border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    
    for (let i = 1; i <= 13; i++) {
      worksheet.getRow(i).border = border;
    }

    worksheet.getRow(1).font = {
      color: { argb: "000000" },
    };

    worksheet.getRow(2).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "3B86CB" },
    };

    for (let i = 1; i <= 5; i++) {
      worksheet.getRow(i).alignment = {
        horizontal: "center",
        vertical: "center",
      };
    }
  
    for (let i = 6; i <= 13; i++) {
      worksheet.getRow(i).alignment = {
        horizontal: "right",
      };
    }

    worksheet.getCell("A1").alignment = {
      horizontal: "left",
      vertical: "middle",
    };

    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "93ADC9" },
    };

    const cell2s = ["AH3" , "AI3" , "AI4" , "AI5", "AJ3" , "AJ4","AJ5",];

    for (const cell of cell2s) {
      worksheet.getCell(cell).alignment = {
        horizontal: "right"
    };
  }

    const cells = ['A3', 'A4', 'A5' , 'A6' , 'A7' , 'A8' ,'A9','A10','A11','A12' ,'A13'];

    for (const cell of cells) {
    worksheet.getCell(cell).alignment = {
      horizontal: "left"
  };
}


const cell1s = ['D2', 'D3', 'D4' , 'D5' , 'E2' , 'E3' , 'E4' , 'E5' , 'K2' , 'K3' , 'K4' , 'K5' , 'L2' , 'L3' , 'L4' , 'L5' , 'R2' , 'R3' , 'R4' , 'R5', 'S2' , 'S3' , 'S4' , 'S5' , 'Y2' , 'Y3' , 'Y4' , 'Y5' , 'Z2' , 'Z3' , 'Z4' , 'Z5' ,  ];

    for (const cell of cell1s) {
    worksheet.getCell(cell).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "6AA653" },
  };
}

    table.commit();

    worksheet.mergeCells("AF1:AF2");
    worksheet.mergeCells("AG1:AG2");
    worksheet.mergeCells("AH1:AH2");
    worksheet.mergeCells("AI1:AI2");
    worksheet.mergeCells("AJ1:AJ2");

    worksheet.getColumn(32).width = 15;
    worksheet.getColumn(33).width = 35;
    worksheet.getColumn(34).width = 20;
    worksheet.getColumn(35).width = 20;
    worksheet.getColumn(36).width = 20;

    worksheet.getCell("AF1").value = "T???ng c???ng";
    worksheet.getCell("AG1").value = "S??? ng??y c??ng l??m vi???c th???c t??? ";
    worksheet.getCell("AH1").value = "????n gi?? 1 th??ng (VN??)";
    worksheet.getCell("AI1").value = "????n gi?? gi??? c??ng";
    worksheet.getCell("AJ1").value = "Chi ph?? th??ng (VN??)";

    const newColumnsss = columnsss.slice(1);
    console.log(newColumnsss, "new");

    const sum = newColumnsss.reduce((accumulator, currentValue) => {
      if (currentValue !== "x") {
        return accumulator + parseFloat(currentValue.replace(",", "."));
      }
      return accumulator;
    }, 0);

    console.log(sum, "sum");
    const sty = sum + ",00";
    worksheet.getCell("AF3").value = sty;
    worksheet.getCell("AF4").value = 0;
    worksheet.getCell("AF5").value = 0;
    worksheet.getCell("AG3").value = '19,5';
    worksheet.getCell("AG4").value = 0;
    worksheet.getCell("AG5").value = 0;


    const num = 7000000;

    // Convert the number to a string with the desired format
    const str = num.toLocaleString('vi-VN', { useGrouping: true }) + ' ??';
    
    // Set the value of the cell to the formatted string
    worksheet.getCell("AH3").value = str;
    worksheet.getCell("AH4").value = '0 ??';
    worksheet.getCell("AH5").value = '0 ??';


    const num1 = 39773;
    const num2 = 59659;
    const num3 = 79545;
    const num4 = 500000;


    // Convert the number to a string with the desired format
    const str1 = num1.toLocaleString('vi-VN', { useGrouping: true }) + ' ??';
    const str2 = num2.toLocaleString('vi-VN', { useGrouping: true }) + ' ??';
    const str3 = num3.toLocaleString('vi-VN', { useGrouping: true }) + ' ??';
    const str4 = num4.toLocaleString('vi-VN', { useGrouping: true }) + ' ??';
    
    
    // Set the value of the cell to the formatted string
    worksheet.getCell("AI3").value = str1;
    worksheet.getCell("AI4").value = str2;
    worksheet.getCell("AI5").value = str3;
     
      const result = num1 * sum;
      const str5 = result.toLocaleString('vi-VN', { useGrouping: true }) + ' ??';
      worksheet.getCell('AJ3').value = str5;
      worksheet.getCell("AJ4").value = '0 ??';
      worksheet.getCell("AJ5").value = '0 ??';
      worksheet.getCell("B6").value = str4;
      worksheet.getCell("B7").value = '0 ??';
      worksheet.getCell("B8").value = '0 ??';
      worksheet.getCell("B9").value = '0 ??';
      worksheet.getCell("B10").value = '0 ??';
      worksheet.getCell("B11").value = '0 ??';
      worksheet.getCell("B12").value = '0 ??';

     const result1 = result + num4;
     const str6 = result1.toLocaleString('vi-VN', { useGrouping: true }) + ' ??';
     worksheet.getCell("B13").value = str6;
  

    worksheet.mergeCells("A1:A2");
    worksheet.mergeCells("B6:AJ6");
    worksheet.mergeCells("B7:AJ7");
    worksheet.mergeCells("B8:AJ8");
    worksheet.mergeCells("B9:AJ9");
    worksheet.mergeCells("B10:AJ10");
    worksheet.mergeCells("B11:AJ11");
    worksheet.mergeCells("B12:AJ12");
    worksheet.mergeCells("B13:AJ13");

    worksheet.getCell("A2").value = "V????ng Qu???c Tu???n";
    worksheet.getCell("A3").value = "Th???i gian l??m vi???c";
    worksheet.getCell("A4").value = "Th???i gian OT 150%";
    worksheet.getCell("A5").value = "Th???i gian OT 200%";
    worksheet.getCell("A6").value = "Th???i gian OT 300%";
    worksheet.getCell("A7").value = "Th?????ng";
    worksheet.getCell("A8").value = "H??? tr???";
    worksheet.getCell("A9").value = "B???o hi???m";
    worksheet.getCell("A10").value = "Vay th??ng n??y";
    worksheet.getCell("A11").value = "Tr??? n??? th??ng n??y";
    worksheet.getCell("A12").value = "C??n n???";
    worksheet.getCell("A13").value = "L????ng th???c t??? nh???n ???????c";

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
      <th rowSpan="2">Nguy???n H???i Long</th>
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
        <th >Th???i gian l??m vi???c</th>
        <td>a</td>
        <td>a</td>
        <td>a</td>
        <td>a</td>
        <td>a</td>
        <td>a</td>
      </tr>
      <tr>
      <th>Th???i gian OT 150%</th>
        <td>Moe</td>
        <td>mary@example.com</td>
      </tr>
      <tr>
        <th>Th???i gian OT 200%</th>
        <td>Dooley</td>
        <td>july@example.com</td>
      </tr>
      <tr>
      <th>Th???i gian OT 300%</th>
        <td>Dooley</td>
        <td>july@example.com</td>
      </tr>
      <tr>
      <th>Th?????ng</th>
        <td>Dooley</td>
        <td>july@example.com</td>
      </tr>
      <tr>
      <th>H??? tr???</th>
        <td>Dooley</td>
        <td>july@example.com</td>
      </tr>
      <tr>
      <th>B???o hi???m</th>
        <td>Dooley</td>
        <td>july@example.com</td>
      </tr>
      <tr>
      <th>Vay th??ng n??y</th>
        <td>Dooley</td>
        <td>july@example.com</td>
      </tr>
      <tr>
      <th>Tr??? n??? th??ng n??y</th>
        <td>Dooley</td>
        <td>july@example.com</td>
      </tr>
      <tr>
      <th>C??ng n???</th>
        <td>Dooley</td>
        <td>july@example.com</td>
      </tr>
      <tr>
      <th>L????ng th???c t??? nh???n ???????c</th>
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
