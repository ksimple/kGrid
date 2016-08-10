require.config({
    '*': {
        'css': 'css' // or whatever the path to require-css is
    },

    baseUrl: '../../',

    paths: {
        jquery: 'lib/bower/jquery/jquery',
        jqueryui: 'lib/bower/jquery-ui/jquery-ui',
        Bootstrap: 'lib/bootstrap/js/bootstrap.min',
        css: 'lib/bower/require-css/css',
        // DataPicker: 'lib/pickadate/picker.date',
        listcontrol: 'build/js/dev/listcontrol',
        enhancedlistcontrol: 'build/js/dev/enhancedlistcontrol',
    },
    shim: {
        'jqueryui': {
            deps: [
                'css!lib/jquery-ui.css',
            ],
        },
        listcontrol: {
            exports: 'Microsoft.Office.Controls',
            deps: [
                'jquery',
                'css!build/assets/css/listcontrol.css',
            ],
        },
        enhancedlistcontrol: {
            exports: 'Microsoft.Office.Controls',
            deps: [
                'jquery',
                'listcontrol',
                'css!build/assets/css/enhancedlistcontrol.css',
            ],
        },
        // DataPicker: {
        //     deps: ['jquery', 'lib/pickadate/picker', 'css!lib/pickadate/default.css', 'css!lib/pickadate/default.date.css'],
        // },
        jquery: {
            exports: 'jquery',
        },
        // angular: {
        //     deps: ['jquery'],
        //     exports: 'angular',
        // },
        // ngRoute: {
        //     deps: ['angular'],
        // },
        Bootstrap: {
            deps: [
                'jquery',
                'css!lib/bootstrap/css/bootstrap.min.css',
                'css!lib/bootstrap/css/bootstrap-theme.min.css'
            ],
        },
    }
});

require(['listcontrol', /* 'js/enhancedlistcontrol' */, /* 'DataPicker' */, 'jqueryui', 'Bootstrap'], function (listcontrol) {
    var columnCount = 1000;

    // var testData = [
    //     // { Id: 0, Stage: 'Done', Waiting: { status: 'online', name: 'Rachel Falzone' }, Requestor: { status: 'away', name: 'Todd The Builder' }, 'ActiveDate': '2014-09-30', StartDate: '2 days ago', Action: 'Poke' },
    //     // { Id: 1, Stage: 'Done', Waiting: { status: 'online', name: 'Rachel Falzone' }, Requestor: { status: 'away', name: 'Todd The Builder' }, 'ActiveDate': '2014-09-30', StartDate: '2 days ago', Action: 'Poke' },
    //     // { Id: 2, Stage: 'Waiting', Waiting: { status: 'busy', name: 'Rachel Falzone 2' }, Requestor: { status: 'away', name: 'Todd The Builder' }, 'ActiveDate': '2014-09-30', StartDate: '2 days ago', Action: 'Poke' },
    //     // { Id: 3, Stage: 'Waiting', Waiting: { status: 'busy', name: 'Rachel Falzone 2' }, Requestor: { status: 'away', name: 'Todd The Builder' }, 'ActiveDate': '2014-09-30', StartDate: '2 days ago', Action: 'Poke' },
    // ];

    var testData = [
        // { Id: 0, Stage: 'Done', Waiting: 'Rachel Falzone', Requestor: 'Todd The Builder', 'ActiveDate': '2014-09-30', StartDate: '2 days ago', Action: 'Poke' },
        // { Id: 1, Stage: 'Done', Waiting: 'Rachel Falzone', Requestor: 'Todd The Builder', 'ActiveDate': '2014-09-30', StartDate: '2 days ago', Action: 'Poke' },
        // { Id: 2, Stage: 'Waiting', Waiting: 'Rachel Falzone 2', Requestor: 'Todd The Builder', 'ActiveDate': '2014-09-30', StartDate: '2 days ago', Action: 'Poke' },
        // { Id: 3, Stage: 'Waiting', Waiting: 'Rachel Falzone 2', Requestor: 'Todd The Builder', 'ActiveDate': '2014-09-30', StartDate: '2 days ago', Action: 'Poke' },
    ];

    for (var i = 0; i < 100; i++) {
        testData.push({ Id: i + 4, Stage: 'Done', Waiting: 'Rachel Falzone ' + i, Requestor: 'Todd The Builder', 'ActiveDate': '2014-09-30', StartDate: '2 days ago', Action: 'Poke', 'test19': 'testtesttesttesttesttesttesttesttest' });

        for (var j = 0; j < 1000; j++) {
            testData[testData.length - 1]['test' + j] = 'test ' + j;
        }
    }

    $(document.head).append($('<style></style>').html("document, body { border: 0px; padding: 0px; margin: 0px; overflow: hidden; } body { position: fixed; left: 0px; right: 0px; top: 0px; height: 100%; }"));

    var button = $('<button>toggle rtl</button>');
    $(document.body).append(button);

    button.on('click', () => {
        listControlObject.rtl(!listControlObject.rtl());
        listControlObject.updateUI();
    });

    var button = $('<button>toggle view</button>');
    $(document.body).append(button);

    button.on('click', () => {
        listControlObject.viewType(listControlObject.viewType() == listcontrol.ViewType.Stack ? listcontrol.ViewType.Table : listcontrol.ViewType.Stack);
        listControlObject.updateUI();
    });

    var button = $('<button>set cursor to 4,4</button>');
    $(document.body).append(button);

    button.on('click', () => {
        listControlObject.features('selection').cursor(new listcontrol.Position(4, 4));
    });

    var button = $('<button>toggle selections</button>');
    $(document.body).append(button);

    button.on('click', () => {
        switch (listControlObject.features('selection').selectionMode()) {
            case listcontrol.SelectionMode.MultipleRows:
                listControlObject.features('selection').select(new listcontrol.Range(listcontrol.RangeType.Row, 0, 2, -1, -1));
                break;

            case listcontrol.SelectionMode.Range:
                listControlObject.features('selection').select(new listcontrol.Range(listcontrol.RangeType.Range, 0, 2, 1, 3));
                break;
        }
    });

    var button = $('<button>toggle selection mode:SingleRow</button>');
    $(document.body).append(button);

    button.on('click', (event) => {
        var selectionMode;

        switch (listControlObject.features('selection').selectionMode()) {
            case listcontrol.SelectionMode.SingleRow:
                selectionMode = listcontrol.SelectionMode.MultipleRows;
                break;

            case listcontrol.SelectionMode.MultipleRows:
                selectionMode = listcontrol.SelectionMode.Range;
                break;

            case listcontrol.SelectionMode.Range:
                selectionMode = listcontrol.SelectionMode.Cell;
                break;

            case listcontrol.SelectionMode.Cell:
                selectionMode = listcontrol.SelectionMode.SingleRow;
                break;
        }

        listControlObject.features('selection').selectionMode(selectionMode);
        $(event.target).text('toggle selection mode:' + listcontrol.SelectionMode[selectionMode]);
    });

    var button = $('<button>toggle stack view selection</button>');
    $(document.body).append(button);

    button.on('click', () => {
        listControlObject.stack.selectionIndicator(!listControlObject.stack.selectionIndicator());
    });

    var button = $('<button>toggle id column</button>');
    $(document.body).append(button);

    var idColumnId, idColumnIndexInTable, idColumnIndexInStack;

    button.on('click', () => {
        if (!idColumnId) {
            return;
        }

        var currentIdColumnIndex = listControlObject.table.getColumnIndexById(idColumnId);

        if (!isNaN(currentIdColumnIndex)) {
            listControlObject.table.hideColumnByIndex(currentIdColumnIndex);
        } else {
            listControlObject.table.showColumnByIndex(idColumnIndexInTable, idColumnId);
        }

        idColumnIndexInTable = currentIdColumnIndex;

        var currentIdColumnIndex = listControlObject.stack.getColumnIndexById(idColumnId);

        if (!isNaN(currentIdColumnIndex)) {
            listControlObject.stack.hideColumnByIndex(currentIdColumnIndex);
        } else {
            listControlObject.stack.showColumnByIndex(idColumnIndexInStack, idColumnId);
        }

        idColumnIndexInStack = currentIdColumnIndex;
    });

    var button = $('<button>toggle theme</button>');
    $(document.body).append(button);

    button.on('click', () => {
        var theme;

        if (listControlObject.theme() == listcontrol.Theme.Default) {
            theme = listcontrol.Theme.Editable;
        } else if (listControlObject.theme() == listcontrol.Theme.Editable) {
            theme = listcontrol.Theme.Zebra;
        } else {
            theme = listcontrol.Theme.Default;
        }

        listControlObject.theme(theme);
        listControlObject.updateUI();
    });

    var button = $('<button>customize theme</button>');
    $(document.body).append(button);
    var dialog;

    button.on('click', () => {
        if (!dialog) {
            $(document.body).append('<div id="customizeTheme"><textarea maxlength="65535" style="width: 720px; height: 500px"></textarea></div>');

            dialog = $('#customizeTheme');
        }

        $('#customizeTheme > textarea').val('{\n\t\'backgroundColor\': \'#ffffff\',\n\t\'hoverBackgroundColor\': \'#f4f4f4\',\n\t\'selectionBackgroundColor\': \'#cde6f7\',\n\t\'cellPadding\': Theme.parsePadding(\'1px 5px 1px 5px\'),\n\t\'cellFontFamily\': \'"Segoe UI Web Semilight", "Segoe UI Semilight", "Segoe WP Semilight", "Segoe UI", "Segoe WP", Tahoma, Arial, sans-serif\',\n\t\'cellFontSize\': \'12px\',\n\t\'cellColor\': \'#666666\',\n\t\'headerCellColor\': \'#333333\',\n\t\'headerCellFontSize\': \'12px\',\n\n\t\'stack.cellCursor\': \'pointer\',\n\t\'stack.cellHBorder\': Theme.parseBorder(\'solid 1px #cccccc\'),\n\t\'stack.cellHeight\': 28,\n\t\'stack.headerCursor\': \'pointer\',\n\t\'stack.selectionIndicatorWidth\': 16,\n\t\'stack.selectionIndicatorPadding\': Theme.parsePadding(\'4px 3px 4px 5px\'),\n\t\'stack.headerCellFontFamily\': \'"Segoe UI Web Semilight", "Segoe UI Semilight", "Segoe WP Semilight", "Segoe UI", "Segoe WP", Tahoma, Arial, sans-serif\',\n\t\'stack.headerEndBorder\': Theme.parseBorder(\'solid 1px #cccccc\'),\n\t\'stack.headerHBorder\': Theme.parseBorder(\'solid 1px #cccccc\'),\n\t\'stack.rowBorder\': Theme.parseBorder(\'solid 1px #cccccc\'),\n\t\'stack.rowPadding\': Theme.parsePadding(\'5px 3px 5px 3px\'),\n\n\t\'table.cellCursor\': \'cell\',\n\t\'table.cellHBorder\': Theme.parseBorder(\'solid 1px transparent\'),\n\t\'table.cellVBorder\': Theme.parseBorder(\'solid 1px transparent\'),\n\t\'table.cellWidth\': 100,\n\t\'table.cursorBorder\': Theme.parseBorder(\'solid 1px #cccccc\'),\n\t\'table.headerBottomBorder\': Theme.parseBorder(\'solid 1px #eaeaea\'),\n\t\'table.headerCellVBorder\': Theme.parseBorder(\'solid 1px #eaeaea\'),\n\t\'table.headerCursor\': \'pointer\',\n\t\'table.headerCellFontFamily\': \'"Segoe UI Semibold", "Segoe UI Web Semibold", "Segoe UI Web Semilight", "Segoe UI Semilight", "Segoe WP Semilight", "Segoe UI", "Segoe WP", Tahoma, Arial, sans-serif\',\n\t\'table.headerRowHeight\': 28,\n\t\'table.rowHeight\': 30,\n\t\'table.canvasEndMargin\': 300,\n\t\'table.canvasBottomMargin\': 300,\n}\n');

        dialog.dialog({
            height: 650,
            width: 760,
            modal: true,
            buttons: {
                'Apply': () => {
                    var theme;
                    var themeString = $('#customizeTheme > textarea').val();

                    console.log(themeString);
                    var func = new Function('Theme', 'return ' + themeString + ';');
                    theme = new listcontrol.Theme(func(listcontrol.Theme));

                    listControlObject.theme(theme);
                },
                'Close': () => dialog.dialog('close'),
            }
        });
    });

    var button = $('<button>remove the first row</button>');
    $(document.body).append(button);

    button.on('click', () => {
        listControlObject.rowsDataContext().removeRowsByIndex(0, 1);
    });

    var button = $('<button>insert to the second row</button>');
    $(document.body).append(button);

    button.on('click', () => {
        listControlObject.rowsDataContext().insertRowsByIndex([generateRow('i_0'), generateRow('i_1')], 1, 2);
    });

    var button = $('<button>clear data</button>');
    $(document.body).append(button);

    button.on('click', () => {
        listControlObject.rowCount(0);
    });

    var button = $('<button>set data</button>');
    $(document.body).append(button);

    button.on('click', () => {
        listControlObject.rowCount(100);
    });

    var button = $('<button>dispose</button>');
    $(document.body).append(button);

    button.on('click', () => {
        if (listControlObject) {
            listControlObject.dispose();
            listControlObject = null;
        }
    });

    var listControlObject, uniqueIdOfId;

    var button = $('<button>create</button>');
    $(document.body).append(button);

    button.on('click', () => {
        if (!listControlObject) {
            createControl();
        }
    });

    //var button = $('<button id="animate">animate</button>');
    //$(document.body).append(button);

    //button.on('click', () => {
    //    // dynamicStylesheet1.content("button#animate { width: 200px; }");
    //    dynamicStylesheet1.content("button#animate { transition: width 4s; width: 200px; }");
    //    window.setTimeout(() => console.log($('#animate').width()), 2000);
    //});

    //var dynamicStylesheet = new listcontrol.Fundamental.DynamicStylesheet("test");
    //var dynamicStylesheet1 = new listcontrol.Fundamental.DynamicStylesheet("test1");

    // dynamicStylesheet.content("button#animate { transition: width 2s; }");
    // dynamicStylesheet1.content("button#animate { width: 100px; }");
    // dynamicStylesheet1.content("button#animate { transition: width 2s; width: 100px; }");

    var button = $('<button id="matchcss">match css</button>');
    $(document.body).append(button);

    button.on('click', () => {
        var theme = new listcontrol.Fundamental.Theme('<div prefix=""><div class="content" prefix="content."><div class="selection" prefix="content.selection."></div><div class="cell" prefix="content.cell."></div><div class="row" prefix="content.row."></div><div class="row alternate" prefix="content.row:alternate."></div><div class="row hover" prefix="content.row:hover."></div></div><div class="header" prefix="header."><div class="row" prefix="header.row."></div><div class="cell" prefix="header.cell."></div></div></div>', 'kGrid');

        theme.load('default');
    });

    function generateRow(id, waitingResolver?, requestorResolver?) {
        var row = { Id: id, Stage: 'Done', Waiting: { status: 'busy', rawValue: 'Rachel Falzone ' + id, resolver: waitingResolver }, Requestor: { status: 'away', rawValue: 'Todd The Builder ' + id, resolver: requestorResolver }, 'ActiveDate': '2014-09-30', StartDate: '2 days ago', Action: 'Poke' };

        for (var i = 0; i < columnCount; i++) {
            row['test' + i] = 'test ' + i;
        }

        return row;
    }

    function createControl() {
        listControlObject = new listcontrol.Grid(listControlElement[0]);
        // listControlObject = listcontrol.Grid.create(listControlElement[0]);
        var columnsDataContext = listControlObject.columnsDataContext();
        var rowsDataContext = listControlObject.rowsDataContext();

        var columnIds = columnsDataContext.addColumns([
            {
                // data: { displayName: 'Id', icons: [], },
                data: 'Id',
                field: 'Id',
                table: { width: 50 },
                alignToEnd: true,
                filterable: false,
                sortable: false,
                cellRender: new listcontrol.SimpleTextCellRender((args) => args.cellData, true),
            }
        ]);

        rowsDataContext.rows(testData);
        rowsDataContext.rowCount(1000);

        // listControlObject.addColumns([new enhancedlistcontrol.EnhancedColumnDefinition({
        //     data: { displayName: 'Stage', icons: [], },
        //     field: 'Stage',
        //     table: { width: 80 },
        //     cellRender: new listcontrol.SimpleTextCellRender((args) => args.cellData),
        // })]);
        // listControlObject.addColumns([new enhancedlistcontrol.EnhancedColumnDefinition({
        //     data: { displayName: 'Waiting', icons: [], },
        //     field: 'Waiting',
        //     table: { width: 150 },
        // })]);
        // listControlObject.addColumns([new enhancedlistcontrol.EnhancedColumnDefinition({
        //     data: { displayName: 'Requestor', icons: [], },
        //     field: 'Requestor',
        //     table: { width: 150 },
        // })]);
        // listControlObject.addColumns([new enhancedlistcontrol.EnhancedColumnDefinition({
        //     data: { displayName: 'Acitve Date', icons: [], },
        //     field: 'ActiveDate',
        //     table: { width: 120 },
        //     cellRender: new listcontrol.SimpleTextCellRender((args) => args.cellData),
        //     cellEditor: new listcontrol.SimpleCellEditor((args) => {
        //         var element = args.element;
        //         var cellData = args.cellData;
        //         var input: any = $('<input class="msoc-layout-wh100 msoc-layout-border-box"></input>');
        //         var newData = cellData;
        //         var p = $.Deferred();

        //         $(element).append(input);
        //         input.val(cellData);
        //         input.css('border', 'none 0px transparent');

        //         if (listControlObject.rtl()) {
        //             input.css('padding', listControlObject.theme().value('table.cellPadding').raw.rtl);
        //         } else {
        //             input.css('padding', listControlObject.theme().value('table.cellPadding').raw.ltr);
        //         }
        //         input.pickadate({
        //             format: 'yyyy-mm-dd',
        //         });
        //         var picker = input.pickadate("picker");

        //         picker.on('close', () => p.resolve(newData));
        //         picker.on('set', (thing) => {
        //             newData = input.val();
        //         });

        //         input.focus();
        //         picker.open();
        //         input.keydown((event) => {
        //             if (event.keyCode == 27) {
        //                 p.reject();
        //             }
        //         });

        //         return p.promise();
        //     }, 320, 300),
        // })]);
        // listControlObject.addColumns([new enhancedlistcontrol.EnhancedColumnDefinition({
        //     data: { displayName: 'Action', icons: [], },
        //     field: 'Action',
        //     table: { width: 100 },
        //     alignToEnd: true,
        //     // headerRender: new listcontrol.SimpleTextHeaderRender((args) => '<' + args.data + '>', true),
        //     cellRender: new listcontrol.SimpleTextCellRender((args) => args.cellData, true),
        // })]);

        var columns = [];

        for (var i = 0; i < columnCount; i++) {
            columns.push({
                data: 'test' + i,
                field: 'test' + i,
                width: 100,
                cellRender: new listcontrol.SimpleTextCellRender((args) => args.cellData),
            });
        }

        columnsDataContext.addColumns(columns);

        // listControlObject.on('rowClick', (sender, args) => {
        //     console.log(JSON.stringify(listControlObject.getRowsByIndex(args.rowIndex, 1)[0].Id, null, 2));
        // });

        // listControlObject.on('headerRowClick', (sender, args) => {
        //     // if (headerCellData.icons.length == 0) {
        //     //     headerCellData.icons.push('arrowDown');
        //     // } else if (headerCellData.icons[0] == 'arrowDown') {
        //     //     headerCellData.icons[0] = 'arrowUp';
        //     // } else {
        //     //     headerCellData.icons = [];
        //     // }
        //     // if (headerCellData.icons.length == 0) {
        //     //     headerCellData.icons.push('filter');
        //     // } else {
        //     //     headerCellData.icons = [];
        //     // }

        //     if (!args.column.sortable()) {
        //         return;
        //     }

        //     var sortDirection = args.column.sortDirection();

        //     if (!sortDirection) {
        //         args.column.sortDirection('asc');
        //     } else if (sortDirection == 'asc') {
        //         args.column.sortDirection('desc');
        //     } else {
        //         args.column.sortDirection(null);
        //     }

        //     listControlObject.invalidateHeaderCell(args.columnIndex);
        // });

        // listControlObject.on('headerDropDown', (sender, args) => {
        //     args.updateDropDown({
        //         items: [
        //             {
        //                 data: 'A to Z',
        //                 onClick: (item, args) => {
        //                 },
        //             },
        //             {
        //                 data: 'Z to A',
        //                 onClick: (item, args) => {
        //                 },
        //             },
        //             {
        //                 data: '-',
        //             },
        //             {
        //                 data: 'Loading',
        //             },
        //         ],
        //     });
        // });

        // var waitingResolver = (value) => {
        //     var deferred = $.Deferred();

        //     window.setTimeout(
        //         () => {
        //             deferred.resolve((element) => {
        //                 $(element).html('<div style="background-color:green;position:absolute;width:10px;height:10px;left:5px;top:12px;"></div><div style="position:absolute;left:20px;right:0px;top:0px;bottom:0px"></div>');
        //                 $(element).find('>div').eq(1).text(value);
        //             });
        //         },
        //         Math.random() * 4000);

        //     return deferred.promise();
        // }

        // var requestorResolver = (value) => {
        //     var deferred = $.Deferred();

        //     window.setTimeout(
        //         () => {
        //             // deferred.resolve(value);
        //             deferred.reject();
        //         },
        //         Math.random() * 4000);

        //     return deferred.promise();
        // }

        // listControlObject.on('cursorChange', (sender, args) => {
        //     console.log('cursorChange: ' + JSON.stringify(args));
        // });

        // listControlObject.on('selectionChange', (sender, args) => {
        //     console.log('selectionChange: ' + JSON.stringify(args));
        // });

        // listControlObject.on('beforeSelect', (sender, args) => {
        //     console.log('beforeSelect: ' + JSON.stringify(args));
        // });

        // listControlObject.on('beforeDeselect', (sender, args) => {
        //     console.log('beforeDeselect: ' + JSON.stringify(args));
        // });

        // listControlObject.on('beforeColumnReorder', (sender, args) => {
        //     console.log('beforeColumnReorder: ' + JSON.stringify(args));
        // });

        // listControlObject.on('beforeCursorChange', (sender, args) => {
        //     console.log('beforeCursorChange: ' + JSON.stringify(args));
        //     if (args.rowIndex == 3) {
        //         args.cancel = true;
        //     }
        // });

        // listControlObject.on('beforeRender', (sender, args) => {
        //     var rows = listControlObject.getRowsByIndex(args.renderRange.top(), args.renderRange.bottom() - args.renderRange.top() + 1);
        //     var changed = false;
        //     var startIndex, endIndex;
        //     var hasUndefined = false;

        //     for (var rowIndex: any = 0; rowIndex < rows.length; rowIndex++) {
        //         if (typeof(rows[rowIndex]) == 'undefined') {
        //             hasUndefined = true;
        //             break;
        //         }
        //     }

        //     if (!hasUndefined) {
        //         return;
        //     }

        //     for (startIndex = 0; startIndex < rows.length; startIndex++) {
        //         if (typeof(rows[startIndex]) == 'undefined') {
        //             break;
        //         }
        //     }

        //     for (endIndex = rows.length - 1; endIndex >= 0; endIndex--) {
        //         if (typeof(rows[endIndex]) == 'undefined') {
        //             break;
        //         }
        //     }

        //     if (startIndex > endIndex) {
        //         return;
        //     }

        //     rows = rows.splice(startIndex, endIndex - startIndex + 1);

        //     for (var rowIndex = startIndex; rowIndex <= endIndex; rowIndex++) {
        //         if (typeof(rows[rowIndex - startIndex]) == 'undefined') {
        //             rows[rowIndex - startIndex] = generateRow(rowIndex + args.renderRange.top(), waitingResolver, requestorResolver);
        //             changed = true;
        //         }
        //     }

        //     if (!changed) {
        //         return;
        //     }

        //     if (args.renderRange.top() > 10000) {
        //         window.setTimeout(() => listControlObject.updateRowsByIndex(rows, args.renderRange.top() + startIndex), 2000);
        //     } else {
        //         listControlObject.updateRowsByIndex(rows, args.renderRange.top() + startIndex);
        //     }
        // });

        // listControlObject.rows(testData);
        // listControlObject.rowCount(1000);
    }

    $(document.body).append('<input id="forWidth"></input>');

    var listControlElement = $('<div style="position: absolute; left: 10px; right: 10px; top: 120px; bottom: 10px;"></div>');
    $(document.body).append('<div><h1>kGrid</h1></div>');
    $(document.body).append(listControlElement);

    createControl();
});

