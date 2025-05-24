/**
 * @since 0.1.0-draft
 *
 * @packageDocumentation
 */
/**
 * @package @maddimathon/build-utilities@0.1.0-draft
 */
/*!
 * @maddimathon/build-utilities@0.1.0-draft
 * @license MIT
 */
import type { Objects } from '@maddimathon/utility-typescript/types';
import { CustomError, MessageMaker } from '@maddimathon/utility-typescript/classes';
import type { LocalError } from '../../../../types/index.js';
import type { FileSystemType } from '../../../../types/FileSystemType.js';
/**
 * An extension of the utilities error for use within the library.
 *
 * @category Errors
 *
 * @since 0.1.0-draft
 */
export declare abstract class AbstractError<Args extends LocalError.Args> extends CustomError<Args> implements LocalError<Args> {
    /**
     * Adds this error information to a log file according to the project
     * configuration.
     *
     * @return  If false, writing a log file failed. Else, this is the path to
     *          the log file.
     */
    static log(error: unknown, fs: FileSystemType, args?: Partial<LocalError.Handler.Args>): false | string;
    readonly context: null | AbstractError.Context;
    /**
     * Represents the name for the type of error.
     *
     * @category Args
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/name | MDN docs}
     */
    abstract readonly name: string;
    /**
     * @category Args
     */
    abstract get ARGS_DEFAULT(): Args;
    constructor(message: string, context: null | AbstractError.Context, args?: Partial<Args> & {
        cause?: LocalError.Input;
    });
    /**
     * Gets a detailed output message for error handlers.
     */
    getOutput(): MessageMaker.BulkMsgs;
    /**
     * The object shape used when converting to JSON.
     *
     * @category Exporters
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#description | JSON.stringify}
     */
    toJSON(): Objects.Classify<AbstractError.JSON>;
    /**
     * Overrides the default function to return a string representation of this
     * object.
     *
     * @category Exporters
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toString | Object.prototype.toString()}
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/toString | Error.prototype.toString()}
     */
    toString(): string;
    /**
     * Overrides the default function to return an object representation of this
     * object.
     *
     * @category Exporters
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/valueOf | Object.prototype.valueOf()}
     * @see {@link NodeConsole_Error.toJSON | NodeConsole_Error.toJSON()}
     */
    valueOf(): Objects.Classify<AbstractError.JSON, never>;
}
/**
 * Used only for {@link AbstractError}.
 *
 * @category Errors
 *
 * @since 0.1.0-draft
 */
export declare namespace AbstractError {
    /**
     * Context information for an error.
     *
     * @since 0.1.0-draft
     */
    type Context = Context.Basic | Context.Class | Context.Function;
    /**
     * Types for {@link Context} interface.
     *
     * @since 0.1.0-draft
     */
    namespace Context {
        /**
         * @interface
         */
        type Basic = {
            file: string;
            line?: string;
            module?: string;
        };
        /**
         * @interface
         */
        type Class = Partial<Basic> & {
            class: string;
            method: string;
        };
        /**
         * @interface
         */
        type Function = Partial<Basic> & {
            function: string;
        };
    }
    /**
     * Export shape for a plain {@link AbstractError} object.
     */
    interface JSON extends Omit<CustomError, "ARGS_DEFAULT"> {
        context: null | Context;
        message: string;
        name: string;
        /**
         * Result of this.toString().
         */
        string: string;
        cause?: unknown;
    }
}
//# sourceMappingURL=AbstractError.d.ts.map