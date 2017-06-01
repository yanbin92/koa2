module.exports ={ 
    data:{
        title: 'New Sheet',
        header: [ // 对应首行 A, B, C...
            { row: 0, col: 0, text: '' },
            { row: 0, col: 1, text: 'A' },
            { row: 0, col: 2, text: 'B' },
            { row: 0, col: 3, text: 'C' },
        
            { row: 0, col: 10, text: 'J' }
        ],
        rows: [
             [
                { row: 1, col: 0, text: '1' },
                { row: 1, col: 1, text: '' ,contentEditable:true,align:'left'},
                { row: 1, col: 2, text: '' ,contentEditable:true,align:'left'},
            
                { row: 1, col: 10, text: '' ,contentEditable:true,align:'left'},
            ],
            [
                { row: 2, col: 0, text: '2' },
                { row: 2, col: 1, text: '' ,contentEditable:true,align:'left'},
                { row: 2, col: 2, text: '' ,contentEditable:true,align:'left'},
            
                { row: 2, col: 10, text: '',contentEditable:true,align:'left' },
            ],
               [
                { row: 3, col: 0, text: '3' },
                { row: 3, col: 1, text: '' ,contentEditable:true,align:'left'},
                { row: 3, col: 2, text: '' ,contentEditable:true,align:'left'},
            
                { row: 2, col: 10, text: '',contentEditable:true,align:'left' },
            ],
    
            [
                { row: 10, col: 0, text: '10' ,contentEditable:false},
                { row: 10, col: 1, text: '' ,contentEditable:true,align:'left'},
                { row: 10, col: 2, text: '' ,contentEditable:true,align:'left'},
        
                { row: 10, col: 10, text: '',contentEditable:true ,align:'left'},
            ]
        ],
        selectedRowIndex: 0, // 当前活动单元格的row
        selectedColIndex: 0 // 当前活动单元格的col
    }

}