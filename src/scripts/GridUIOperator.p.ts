export class GridUIOperator implements Fundamental.IFeature, IGridOperator {
    private static logger = Fundamental.Logger.getLogger('GridUIOperator');
    public disposer;
    private _operation: IOperation;
    private _deferred: JQueryDeferred<any>;
    private _operationName;
    private _runtime: GridRuntime;
    private _invoke;

    constructor() {
        this.disposer = new Fundamental.Disposer(() => this.stop());
    }

    public name() {
        return 'uiOperator';
    }

    public inject($invoke) {
        $invoke.inject('operatorService', this);
    }

    public initialize(runtime, $invoke) {
        this._runtime = runtime;
        this._invoke = $invoke;
    }

    public operationName() {
        return this._operationName;
    }

    public start(operationName, operation: IOperation): JQueryPromise<any> {
        var deferred = this._deferred = $.Deferred();

        if (this._operation) {
            GridUIOperator.logger.info('reject operation ' + operationName + ' since another operation ' + this._operationName + ' is running');
            deferred.reject();
            return deferred.promise();
        }

        this._invoke.withThis(operation, operation.canStart).done((canStart) => {
            if (typeof(canStart) != 'undefined' && !canStart) {
                GridUIOperator.logger.info('the operation ' + operationName + ' cannot start now');
                deferred.reject();
                return;
            }

            var args = Array.prototype.slice.call(arguments, 2);

            this._operation = operation;
            this._operationName = operationName;
            GridUIOperator.logger.info('start operation ' + operationName);
            this._invoke.withThis(this._operation, this._operation.start)
                .done((result) => {
                    result
                    .always(() => this._operation && this._operation.disposer.dispose())
                    .done(() => deferred.resolve.apply(deferred, arguments))
                    .fail(() => deferred.reject.apply(deferred, arguments))
                    .always(() => this.stop());
                });
            deferred.done(() => GridUIOperator.logger.info('operation ' + operationName + ' done'));
            deferred.fail(() => GridUIOperator.logger.info('operation ' + operationName + ' fail'));
        });

        return deferred.promise();
    }

    public stop() {
        if (this._operation) {
            var operation = this._operation;

            this._operation = null;
            operation.disposer.dispose();

            if (this._deferred) {
                this._deferred.reject();
            }
        }

        this._deferred = null;
    }

    public dispose() {
        this.disposer.dispose();
    }
}

