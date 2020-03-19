

function save() {

   
if(!data.length)  excelDataPush()
    var tableData = [
        {
            "sheetName": "Sheet1",
            "data": data
        }
    ];
    var options = {
        fileName:  `LAB4`
    };
    Jhxlsx.export(tableData, options);
}
