export class Logger {
    private static _loggers = {};
    private _name;

    constructor(name) {
        this._name = name;
    }

    public static getLogger(name) {
        if (Logger._loggers[name]) {
            return Logger._loggers[name];
        } else {
            var logger = new Logger(name);
            Logger._loggers[name] = logger;
            return logger;
        }
    }

    public trace(message) {
        (<any>console).trace(message);
    }

    public debug(message) {
        console.debug(message);
    }

    public info(message) {
        console.info(message);
    }

    public warn(message) {
        console.warn(message);
    }

    public error(message) {
        console.error(message);
    }

    public static trace(message) {
        Logger.getLogger('default').trace(message);
    }

    public static debug(message) {
        Logger.getLogger('default').debug(message);
    }

    public static info(message) {
        Logger.getLogger('default').info(message);
    }

    public static warn(message) {
        Logger.getLogger('default').warn(message);
    }

    public static error(message) {
        Logger.getLogger('default').error(message);
    }
}

