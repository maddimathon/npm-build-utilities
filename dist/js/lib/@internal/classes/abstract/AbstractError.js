/**
 * @since 0.1.0-alpha.draft
 *
 * @packageDocumentation
 */
/**
 * @package @maddimathon/build-utilities@0.1.0-alpha.draft
 */
/*!
 * @maddimathon/build-utilities@0.1.0-alpha.draft
 * @license MIT
 */
import {
    CustomError,
    VariableInspector,
} from '@maddimathon/utility-typescript/classes';
/**
 * An extension of the utilities error for use within the library.
 *
 * @category Errors
 *
 * @since 0.1.0-alpha.draft
 */
export class AbstractError extends CustomError {
    /* STATIC
     * ====================================================================== */
    /**
     * Adds this error information to a log file according to the project
     * configuration.
     *
     * @return  If false, writing a log file failed. Else, this is the path to
     *          the log file.
     */
    static log(error, fs, args) {
        return String(error);
    }
    /* LOCAL PROPERTIES
     * ====================================================================== */
    context;
    /* CONSTRUCTOR
     * ====================================================================== */
    constructor(message, context, args) {
        super(message, args?.cause, args);
        this.context = context;
    }
    /* LOCAL METHODS
     * ====================================================================== */
    /**
     * Gets a detailed output message for error handlers.
     */
    getOutput() {
        const msgs = [];
        if (this.context) {
            msgs.push([VariableInspector.stringify({ context: this.context })]);
        }
        return msgs;
    }
    /* DEFAULT METHODS
     * ====================================================================== */
    /**
     * The object shape used when converting to JSON.
     *
     * @category Exporters
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#description | JSON.stringify}
     */
    toJSON() {
        return {
            name: this.name,
            message: this.message,
            context: this.context,
            cause: this.cause,
            stack: this.stack,
            string: this.toString(),
        };
    }
    /**
     * Overrides the default function to return a string representation of this
     * object.
     *
     * @category Exporters
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toString | Object.prototype.toString()}
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/toString | Error.prototype.toString()}
     */
    toString() {
        // returns
        if (!this.stack) {
            // returns
            if (!this.name) {
                return this.message;
            }
            // returns
            if (!this.message) {
                return this.name;
            }
            return `${this.name}: ${this.message}`;
        }
        return this.stack;
    }
    /**
     * Overrides the default function to return an object representation of this
     * object.
     *
     * @category Exporters
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/valueOf | Object.prototype.valueOf()}
     * @see {@link NodeConsole_Error.toJSON | NodeConsole_Error.toJSON()}
     */
    valueOf() {
        return this.toJSON();
    }
}
/**
 * Used only for {@link AbstractError}.
 *
 * @category Class-Helpers
 *
 * @since 0.1.0-alpha.draft
 */
(function (AbstractError) {})(AbstractError || (AbstractError = {}));
//# sourceMappingURL=AbstractError.js.map
