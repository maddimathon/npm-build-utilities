/**
 * @since 0.1.0-alpha
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.3.0-alpha.2
 * @license MIT
 */
import {
    MessageMaker,
    VariableInspector,
} from '@maddimathon/utility-typescript/classes';
import { mergeArgs } from '@maddimathon/utility-typescript/functions';
/**
 * An extension of the utilities error for use within the library.
 *
 * @category Errors
 *
 * @typeParam T_Args  Complete {@link AbstractError.args} object for this instance.
 *
 * @since 0.1.0-alpha
 */
export class AbstractError extends Error {
    /* LOCAL PROPERTIES
     * ====================================================================== */
    /** {@inheritDoc internal.AbstractError.Context} */
    context;
    /* Args ===================================== */
    /**
     * Represents the cause of the error (e.g., a different exception that was
     * caught).
     *
     * @see {@link Error.cause}
     */
    cause;
    /**
     * Additional arguments for this instance, if any.
     */
    args;
    /**
     * Default args object, if applicable.
     */
    ARGS_DEFAULT;
    /** @hidden */
    buildArgs(args) {
        return mergeArgs(this.ARGS_DEFAULT ?? {}, args ?? {}, true);
    }
    /* CONSTRUCTOR
     * ====================================================================== */
    constructor(message, context, cause, args) {
        super(message);
        this.args = this.buildArgs(args);
        this.cause = cause;
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
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/valueOf | Object.prototype.valueOf()}
     */
    valueOf() {
        return this.toJSON();
    }
}
/**
 * Types used for {@link AbstractError} classes.
 *
 * @category Types
 *
 * @since 0.1.0-alpha
 *
 * @internal
 */
(function (AbstractError) {
    /**
     * Types for {@link Context} interface.
     *
     * @since 0.1.0-alpha
     */
    let Context;
    (function (Context) {})(
        (Context = AbstractError.Context || (AbstractError.Context = {})),
    );
    /**
     * Types for handling errors in a variety of contexts.
     *
     * @since 0.1.0-alpha
     */
    let Handler;
    (function (Handler) {})(
        (Handler = AbstractError.Handler || (AbstractError.Handler = {})),
    );
})(AbstractError || (AbstractError = {}));
//# sourceMappingURL=AbstractError.js.map
