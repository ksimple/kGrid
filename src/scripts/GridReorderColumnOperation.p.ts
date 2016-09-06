class GridReorderColumnOperation implements IOperation {
    private static logger = Fundamental.Logger.getLogger("GridReorderColumnOperation");
    public disposer: Fundamental.Disposer;
    private _runtime;
    private _deferred;
    private _positionService;
    private _viewportService;
    private _rtl;
    private _headerCellElement;
    private _headerCellCoverElement;
    private _reorderColumnId;
    private _reorderColumnIndex;
    private _isTouch;
    private _pointerId;
    private _pointerDownCoordinate;
    private _startPointToHeaderElementCoordinate;
    private _transitionStylesheet;
    private _movingStylesheet;
    private _currentColumnStylesheet;
    private _lastNewPlaceIndex;
    private _headerViewportCoordinate;
    private _started;

    constructor(isTouch, pointerId, pointerDownCoordinate, headerCellElement, reorderColumnIndex) {
        // TODO: the header element will be removed if it is out of current viewport, so we need to tell render engine
        // that we are moving the header element and do not remove it.
        this.disposer = new Fundamental.Disposer(() => {
            $(this._viewportService.rootElement()).removeClass('msoc-list-operation-ReorderColumn');
            // TODO: hide the selection and cursor
            // Do we still need to do this? Since we only move the header when user is moving now.
            this._headerCellElement.removeClass('msoc-list-header-cell-moving');

            if (this._headerCellCoverElement) {
                this._headerCellCoverElement.remove();
            }
        });

        this._isTouch = isTouch;
        this._pointerId = pointerId;
        this._pointerDownCoordinate = pointerDownCoordinate;
        this._headerCellElement = $(headerCellElement);
        this._reorderColumnIndex = reorderColumnIndex;
    }

    public canStart() {
        return true;
    }

    public start(runtime, positionService, viewportService): JQueryPromise<any> {
        GridReorderColumnOperation.logger.trace('column reorder start');
        this._deferred = $.Deferred();
        this._runtime = runtime;
        this._positionService = positionService;
        this._viewportService = viewportService;

        this._reorderColumnId = this._runtime.dataContexts.columnsDataContext.getColumnIdByIndex(this._reorderColumnIndex);
        $(this._viewportService.rootElement()).addClass('msoc-list-operation-ReorderColumn');
        this._rtl = this._runtime.direction.rtl();
        this._startPointToHeaderElementCoordinate = this._pointerDownCoordinate.minus(Fundamental.CoordinateFactory.fromElement(this._rtl, this._headerCellElement));
        this._startPointToHeaderElementCoordinate.rtl(this._rtl);
        this._started = false;

        var args = {
            fromColumnIndex: this._reorderColumnIndex,
            cancel: false,
        };

        this._runtime.events.internal.emit('beforeColumnReorder', this, args);

        if (!!args.cancel) {
            this._deferred.reject();
            return this._deferred.promise();
        }

        this.disposer.addDisposable(this._transitionStylesheet = new Microsoft.Office.Controls.Fundamental.DynamicStylesheet(this._runtime.id + '_moving_column_transition'));
        this.disposer.addDisposable(this._movingStylesheet = new Microsoft.Office.Controls.Fundamental.DynamicStylesheet(this._runtime.id + '_moving_column'));
        this.disposer.addDisposable(this._currentColumnStylesheet = new Microsoft.Office.Controls.Fundamental.DynamicStylesheet(this._runtime.id + '_moving_current_column'));
        // this._runtime.elements.canvas.eq(TableView.CursorCanvasIndex).hide();
        this._lastNewPlaceIndex = -1;

        var cssText = new Microsoft.Office.Controls.Fundamental.CssTextBuilder();

        this._runtime.buildCssRootSelector(cssText, '.msoc-list-operation-ReorderColumn');
        cssText.push('.msoc-list-header-cell');
        cssText.property('transition', this._runtime.direction.front() + ' 200ms');

        this._runtime.buildCssRootSelector(cssText, '.msoc-list-operation-ReorderColumn');
        cssText.push('.msoc-list-header-cell.msoc-list-header-cell-');
        cssText.push(this._reorderColumnId);
        cssText.property('transition', 'none');

        this._runtime.buildCssRootSelector(cssText, '.msoc-list-operation-ReorderColumn');
        cssText.push('.msoc-list-header-cell-v-border-');
        cssText.push(this._reorderColumnId);
        cssText.property('display', 'none');

        this._transitionStylesheet.content(cssText.toString());

        this.disposer.addDisposable(new Fundamental.EventAttacher($(window), this._isTouch ? 'touchend' : 'mouseup', (event) => this._onPointerUp(event)));
        this.disposer.addDisposable(new Fundamental.EventAttacher($(window), this._isTouch ? 'touchmove' : 'mousemove', (event) => this._onPointerMove(event)));

        // TODO: remove find
        this._headerViewportCoordinate = Microsoft.Office.Controls.Fundamental.CoordinateFactory.fromElement(this._rtl, $(this._viewportService.rootElement()).find('>.msoc-list-header-viewport'));
        return this._deferred.promise();
    }

    private _onPointerUp(event) {
        if (event.which == 1 || (this._isTouch && Microsoft.Office.Controls.Fundamental.BrowserDetector.getChangedPointerIdentifier(event).indexOf(this._pointerId) >= 0)) {
            if (this._started && this._lastNewPlaceIndex >= 0 && this._lastNewPlaceIndex != this._reorderColumnIndex) {
                this._deferred.resolve(this._reorderColumnIndex, this._lastNewPlaceIndex);
            } else {
                this._deferred.reject();
            }
        }
    }

    private _onPointerMove(event) {
        var pointerCoordinate = Microsoft.Office.Controls.Fundamental.CoordinateFactory.fromEvent(this._rtl, event)[this._pointerId];

        if (!this._started) {
            var offsetMovement = pointerCoordinate.minus(this._pointerDownCoordinate);

            if (offsetMovement.x() > 5 || offsetMovement.x() < -5 || offsetMovement.y() > 5 || offsetMovement.y() < -5) {
                GridReorderColumnOperation.logger.trace('column reorder started, mouse movement exceeded the threhold');
                this._started = true;
            } else {
                return;
            }
        }

        this._headerCellElement.addClass('msoc-list-header-cell-moving');

        if (!this._headerCellCoverElement) {
            GridReorderColumnOperation.logger.trace('create header cell cover element');
            this._headerCellElement.append(this._headerCellCoverElement = $('<div></div>'));
            this._headerCellCoverElement.css('position', 'absolute');
            this._headerCellCoverElement.css('top', '0px');
            this._headerCellCoverElement.css('bottom', '0px');
            this._headerCellCoverElement.css('left', '0px');
            this._headerCellCoverElement.css('right', '0px');
        }

        var headerWidth = $(this._viewportService.rootElement()).width();
        var pointerToHeaderViewCoordinate = pointerCoordinate.minus(this._headerViewportCoordinate);

        pointerToHeaderViewCoordinate.rtl(this._rtl);

        if (pointerToHeaderViewCoordinate.front() < headerWidth * Constants.RatioToOperationScrollArea) {
            this._viewportService.scroll(0, -Constants.OperationScrollNumber);
        } else if (pointerToHeaderViewCoordinate.front() > headerWidth * (1 - Constants.RatioToOperationScrollArea)) {
            this._viewportService.scroll(0, Constants.OperationScrollNumber);
        }

        var pointerToHeaderContentCoordinate = Microsoft.Office.Controls.Fundamental.CoordinateFactory.scrollFromElement(this._rtl, $(this._viewportService.headerViewport())).add(pointerToHeaderViewCoordinate);
        var currentColumnCssText = new Microsoft.Office.Controls.Fundamental.CssTextBuilder();
        var headerCellRect = this._positionService.getRect(0, this._reorderColumnIndex, 0, this._reorderColumnIndex, { type: 'header' });

        GridReorderColumnOperation.logger.trace('pointerToHeaderContentCoordinate: ' + pointerToHeaderContentCoordinate.toString());
        GridReorderColumnOperation.logger.trace('headerCellRect: ' + headerCellRect.toString());
        this._runtime.buildCssRootSelector(currentColumnCssText, '.msoc-list-operation-ReorderColumn');
        currentColumnCssText.push('.msoc-list-header-cell-');
        currentColumnCssText.push(this._reorderColumnId);
        currentColumnCssText.property(this._runtime.direction.front(), pointerToHeaderContentCoordinate.front() - headerCellRect.width / 2, 'px');
        currentColumnCssText.property('z-index', 1);
        currentColumnCssText.property('filter', 'alpha(opacity=90)');
        currentColumnCssText.property('-moz-opacity', 0.9);
        currentColumnCssText.property('-khtml-opacity', 0.9);
        currentColumnCssText.property('opacity', 0.9);

        this._runtime.buildCssRootSelector(currentColumnCssText, '.msoc-list-operation-ReorderColumn');
        currentColumnCssText.push('.msoc-list-header-cell-v-border-');
        currentColumnCssText.push(this._reorderColumnId);
        currentColumnCssText.property('display', 'none');

        this._currentColumnStylesheet.content(currentColumnCssText.toString());

        var newPlaceIndex = this.getNewPlaceIndex(pointerToHeaderContentCoordinate.front());

        if (newPlaceIndex != this._lastNewPlaceIndex) {
            GridReorderColumnOperation.logger.trace('newPlaceIndex: ' + newPlaceIndex);
            var args = {
                fromColumnIndex: this._reorderColumnIndex,
                toColumnIndex: newPlaceIndex,
                cancel: false,
            };

            this._runtime.events.internal.emit('beforeColumnReorder', this, args);

            if (!args.cancel) {
                GridReorderColumnOperation.logger.debug('Prepare to move column to ' + newPlaceIndex);
                this._lastNewPlaceIndex = newPlaceIndex;

                if (newPlaceIndex != this._reorderColumnIndex) {
                    var movingToFront = this._reorderColumnIndex > newPlaceIndex,
                        fromIndex = movingToFront ? newPlaceIndex : this._reorderColumnIndex,
                        toIndex = movingToFront ? this._reorderColumnIndex : newPlaceIndex,
                        rect = this._positionService.getRect(0, fromIndex, 0, fromIndex, { type: 'header' }),
                        front = rect.front;

                    if (movingToFront) {
                        front += rect.width + this._runtime.theme.values['header.cell.border-right'].number;
                    }

                    var cssText = new Microsoft.Office.Controls.Fundamental.CssTextBuilder();

                    for (var i = <number>fromIndex; i < toIndex; i++) {
                        if (i == this._reorderColumnIndex) {
                            continue;
                        }

                        var width = this._positionService.getColumnWidthByIndex(i);

                        this._runtime.buildCssRootSelector(cssText, '.msoc-list-operation-ReorderColumn');
                        cssText.push('.msoc-list-header-cell-');
                        cssText.push(this._runtime.dataContexts.columnsDataContext.getColumnIdByIndex(i));
                        cssText.property(this._runtime.direction.front(), front, 'px');

                        front += width + this._runtime.theme.values['header.cell.border-right'].number;
                    }

                    this._movingStylesheet.content(cssText.toString());
                }
            }
        }
    }

    private getNewPlaceIndex(x) {
        var columnCount = this._runtime.dataContexts.columnsDataContext.getColumnCount();
        var newPlaceIndex = columnCount;

        for (var i = 0; i < columnCount; i++) {
            var front = this._positionService.getRect(0, i, 0, i, { type: 'header' }).front;

            if (front + this._positionService.getColumnWidthByIndex(this._positionService.getColumnWidthByIndex(i)) * 0.3 > x) {
                newPlaceIndex = i;
                break;
            }
        }

        return newPlaceIndex;
    }

    public dispose() {
        this.disposer.dispose();
    }
}

