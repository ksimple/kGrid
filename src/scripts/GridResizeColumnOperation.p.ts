class GridResizeColumnOperation implements IOperation {
    private static logger = Fundamental.Logger.getLogger('GridResizeColumnOperation');
    public disposer;
    private _deferred;
    private _isTouch;
    private _pointerId;
    private _headerCellElement;
    private _pointerDownCoordinate;
    private _resizeColumnIndex;
    private _runtime;
    private _positionService;
    private _viewportService;
    private _rtl;
    private _startPointToHeaderViewportCoordinate;
    private _splitters;
    private _initialFront;
    private _initialWidth;
    private _baseScrollCoordinate;
    private _lastWidth;
    private _headerCanvasWidth;
    private _headerViewportCoordinate;

    constructor(isTouch, pointerId, pointerDownCoordinate, headerCellElement, resizeColumnIndex) {
        this.disposer = new Fundamental.Disposer(() => {
            this._splitters[0].remove();
            this._splitters[1].remove();
            this._headerCellElement.removeClass('msoc-list-header-cell-resizing');
            this._headerCellElement.attr('style', '');
        });

        this._isTouch = isTouch;
        this._pointerId = pointerId;
        this._pointerDownCoordinate = pointerDownCoordinate;
        this._headerCellElement = $(headerCellElement);
        this._resizeColumnIndex = resizeColumnIndex;
    }

    public canStart() {
        return true;
    }

    public start(runtime, positionService, viewportService): JQueryPromise<any> {
        this._deferred = $.Deferred();
        this._runtime = runtime;
        this._positionService = positionService;
        this._viewportService = viewportService;
        this._rtl = this._runtime.direction.rtl();
        this._startPointToHeaderViewportCoordinate = Microsoft.Office.Controls.Fundamental.CoordinateFactory.fromElement(this._rtl, this._viewportService.headerViewport()).minus(this._pointerDownCoordinate);
        this._startPointToHeaderViewportCoordinate.rtl(this._rtl);
        var headerCellRect = this._positionService.getRect(0, this._resizeColumnIndex, 0, this._resizeColumnIndex, { type: 'header' });
        this._initialFront = headerCellRect.front;
        this._initialWidth = this._lastWidth = headerCellRect.width;
        this._baseScrollCoordinate = Microsoft.Office.Controls.Fundamental.CoordinateFactory.scrollFromElement(this._rtl, $(this._viewportService.headerViewport()));
        this._headerCellElement.addClass('msoc-list-header-cell-resizing');
        this.disposer.addDisposable(new Fundamental.EventAttacher($(window), this._isTouch ? 'touchend' : 'mouseup', (event) => this._onPointerUp(event)));
        this.disposer.addDisposable(new Fundamental.EventAttacher($(window), this._isTouch ? 'touchmove' : 'mousemove', (event) => this._onPointerMove(event)));

        this._splitters = [$('<div class="msoc-list-resizer"></div>'), $('<div class="msoc-list-resizer"></div>')];
        $(this._viewportService.frontHeaderCanvas()).append(this._splitters[0]);
        $(this._viewportService.frontContentCanvas()).append(this._splitters[1]);
        var scrollFrontCoordinate = Microsoft.Office.Controls.Fundamental.CoordinateFactory.scrollFromElement(this._rtl, $(this._viewportService.headerViewport()));
        var baseResizerCoordinate = scrollFrontCoordinate.add(this._startPointToHeaderViewportCoordinate);

        this._splitters[0].css(this._runtime.direction.front(), baseResizerCoordinate.front() + 'px');
        this._splitters[0].css('height', $(this._viewportService.frontHeaderCanvas()).height() + 'px');
        this._splitters[1].css(this._runtime.direction.front(), baseResizerCoordinate.front() + 'px');
        this._splitters[1].css('height', $(this._viewportService.frontContentCanvas()).height() + 'px');
        this._headerCanvasWidth = this._runtime.canvasWidth;
        this._headerViewportCoordinate = Microsoft.Office.Controls.Fundamental.CoordinateFactory.fromElement(this._rtl, $(this._viewportService.headerViewport()));
        return this._deferred.promise();
    }

    public dispose() {
        this.disposer.dispose();
    }

    private _onPointerUp(event) {
        if (event.which == 1 || this._isTouch) {
            if (this._lastWidth >= 43 && this._lastWidth != this._initialWidth) {
                this._deferred.resolve(this._lastWidth);
            } else {
                this._deferred.reject();
            }
        }
    }

    private _onPointerMove(event) {
        var pointerToHeaderViewCoordinate = Microsoft.Office.Controls.Fundamental.CoordinateFactory.fromEvent(this._rtl, event)[this._pointerId].minus(this._headerViewportCoordinate);
        var headerWidth = $(this._viewportService.rootElement()).width();
        var scrollCoordinate = Microsoft.Office.Controls.Fundamental.CoordinateFactory.scrollFromElement(this._rtl, $(this._viewportService.headerViewport()));

        if (pointerToHeaderViewCoordinate.front() < headerWidth * Constants.RatioToOperationScrollArea) {
            if (scrollCoordinate.front() - Constants.OperationScrollNumber > this._baseScrollCoordinate.front()) {
                // Do not scroll front when we are already scroll to the position we started with
                this._viewportService.scroll(0, -Constants.OperationScrollNumber);
            } else if (scrollCoordinate.front() > this._baseScrollCoordinate.front()) {
                this._viewportService.scroll(0, scrollCoordinate.front() - this._baseScrollCoordinate.front());
            }
        } else if (pointerToHeaderViewCoordinate.front() > headerWidth * (1 - Constants.RatioToOperationScrollArea)) {
            if (this._headerCanvasWidth < scrollCoordinate.front() + headerWidth + Constants.OperationScrollNumber) {
                // Extend the canvas when we hit the end of it
                $(this._viewportService.frontContentCanvas).css('width', (this._headerCanvasWidth + Constants.OperationScrollNumber) + 'px');
                $(this._viewportService.frontHeaderCanvas).css('width', (this._headerCanvasWidth + Constants.OperationScrollNumber) + 'px');
                this._headerCanvasWidth += Constants.OperationScrollNumber;
            }

            this._viewportService.scroll(0, Constants.OperationScrollNumber);
        }

        var minResizeFront = this._initialFront + 43;
        var resizerFront = Math.max(scrollCoordinate.front() + pointerToHeaderViewCoordinate.front(), minResizeFront);
        var newWidth = resizerFront - this._initialFront;

        this._lastWidth = newWidth;
        this._headerCellElement.css('width', newWidth + 'px');
        this._headerCellElement.css('z-index', 1);
        this._headerCellElement.css('filter', 'alpha(opacity=90)');
        this._headerCellElement.css('-moz-opacity', 0.9);
        this._headerCellElement.css('-khtml-opacity', 0.9);
        this._headerCellElement.css('opacity', 0.9);

        this._splitters[0].css(this._runtime.direction.front(), resizerFront + 'px');
        this._splitters[1].css(this._runtime.direction.front(), resizerFront + 'px');
    }
}


