class GridResizeColumn implements Fundamental.IFeature {
    private static logger = Fundamental.Logger.getLogger('GridResizeColumn');
    public disposer;
    private _runtime: GridRuntime;
    private _invoke;
    private _viewportService: IGridViewport;
    private _operatorService: IGridOperator;
    private _selectionService: IGridSelection;

    constructor() {
        this.disposer = new Fundamental.Disposer(() => {
            this._runtime = null;
            this._invoke = null;
            this._viewportService = null;
            this._operatorService = null;
            this._selectionService = null;
        });
    }

    public name() {
        return 'reorderColumn';
    }

    public inject() {
    }

    public initialize(runtime, $invoke, viewportService, operatorService, selectionService) {
        this._runtime = runtime;
        this._invoke = $invoke;
        this._viewportService = viewportService;
        this._operatorService = operatorService;
        this._selectionService = selectionService;
        this.disposer.addDisposable(new Fundamental.EventAttacher($(viewportService.rootElement()), 'mousedown touchstart', (event) => this._viewportMouseDown(event)));
    }

    private _viewportMouseDown(event) {
        if (!Microsoft.Office.Controls.Fundamental.BrowserDetector.isTouchEvent(event.type) && event.which != 1) {
            // Not mouse left button down or touch down
            return;
        }

        var headerCellElement = $(event.target).closest('.kGrid-header-cell');
        var headerCellSplitterElement = $(event.target).closest('.kGrid-header-cell-splitter');

        if (headerCellElement.length > 0) {
            if (headerCellSplitterElement.length > 0) {
                this._startResizeColumn('resizeColumn', event);
            }
        }
    }

    private _startResizeColumn(name, event) {
        var isTouch = Microsoft.Office.Controls.Fundamental.BrowserDetector.isTouchEvent(event.type),
            pointerId = Microsoft.Office.Controls.Fundamental.BrowserDetector.getChangedPointerIdentifier(event)[0],
            coordinate = Microsoft.Office.Controls.Fundamental.CoordinateFactory.fromEvent(this._runtime.direction.rtl(), event)[pointerId],
            headerCellElement = this._viewportService.getCellElementByEvent(event),
            headerCellPosition = this._viewportService.getCellPositionByEvent(event);

        return this._operatorService.start(name, new GridResizeColumnOperation(isTouch, pointerId, coordinate, headerCellElement, headerCellPosition.position.columnIndex))
        .done(newWidth => {
            var columnIndex = headerCellPosition.position.columnIndex;
            GridResizeColumn.logger.info('column ' + columnIndex + ' resized to ' + newWidth + 'px');
            // column.table.width = width;
            // this._updateColumnPosition();
            // this._invalidateColumn(columnUniqueId);
            // this._runtime.updateUI(1);
        });
    }
}

