class Constants {
    public static RatioToOperationScrollArea = 0.2;
    public static OperationScrollNumber = 20;
}

export interface IOperation {
    canStart();
    start(...args): JQueryPromise<any>;
    disposer: Microsoft.Office.Controls.Fundamental.Disposer;
}

export enum SelectionMode {
    SingleRow,
    MultipleRows,
    Cell,
    Range,
}

export enum RangeType {
    Row,
    Column,
    Range,
}

enum RenderState {
    Initial,
    OutDated,
    Painted,
};

export interface IRender {
    render(args);
    title(args);
}

export interface IEditor {
    edit(args);
}

export enum ViewType {
    Table,
    Stack,
}

export interface IListView {
    name(): string;
    type(): ViewType;
    activate(): void;
    deactivate(): void;
    updateUI(): boolean;
    controller(): any;
    invalidate();
    invalidateRange(range: Range);
    invalidateHeaderRange(range: Range);
    getColumnIdByIndex(columnIndex);
    getColumnIndexById(columnUniqueId);
}

export enum CursorMovement {
    Forward,
    Backward,
    Up,
    Down,
    LineFirst,
    LineEnd,
    PageUp,
    PageDown,
    Top,
    Bottom,
}

/// <summary>
/// Column definition, used by list control
/// </summary>
export class ColumnDefinition {
    public name;
    public data;
    public field;
    public width;
    public headerRender;
    public cellRender;
    public cellEditor;
}

export interface IGridPosition {
    getColumnWidthById(columnId);
    getColumnWidthByIndex(columnIndex);
    getRowHeightById(rowId);
    getRowHeightByIndex(rowIndex);
    getRect(topRowIndex, bottomRowIndex, frontColumnIndex, endColumnIndex, tag?);
}

export interface IGridViewport {
    rootElement();
    headerViewport();
    contentViewport();
    frontContentCanvas();
    backContentCanvas();
    frontHeaderCanvas();
    backHeaderCanvas();
    scrollIntoView(rect);
    scrollTo(point);
    scroll(topOffset, frontOffset);
    getCellElementByEvent(event);
    getCellPositionByEvent(event);
}

export interface IGridOperator {
    start(operationName, operation: IOperation): JQueryPromise<any>;
    stop();
}

export interface IGridSelection {
    select(range: Range, keepSelectedRanges);
    deselect(range: Range);
    selectionMode(selectionMode?: SelectionMode);
    selectedRanges();
    cursor(position?: Position);
    hideSelection();
    showSelection();
    hideCursor();
    showCursor();
}

