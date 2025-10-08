/**
 * @since 0.1.0-alpha
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.3.0-alpha.1.draft
 * @license MIT
 */
import type { Objects } from '@maddimathon/utility-typescript/types';
import { MessageMaker } from '@maddimathon/utility-typescript/classes';
import type { FileSystemType } from '../../../../types/FileSystemType.js';
import type { Logger } from '../../../../types/Logger.js';
/**
 * An extension of the utilities error for use within the library.
 *
 * @category Errors
 *
 * @typeParam T_Args  Complete {@link AbstractError.args} object for this instance.
 *
 * @since 0.1.0-alpha
 */
export declare abstract class AbstractError<T_Args extends object | never = never, T_Context extends object = AbstractError.Context> extends Error {
    /** {@inheritDoc internal.AbstractError.Context} */
    readonly context: null | T_Context;
    /**
     * Represents the cause of the error (e.g., a different exception that was
     * caught).
     *
     * @see {@link Error.cause}
     */
    readonly cause?: unknown;
    /**
     * Represents the name for the type of error.
     *
     * @see {@link !Error.name | Error.name}
     */
    abstract readonly name: string;
    /**
     * Additional arguments for this instance, if any.
     */
    readonly args: Partial<T_Args>;
    /**
     * Default args object, if applicable.
     */
    protected readonly ARGS_DEFAULT?: T_Args;
    /** @hidden */
    private buildArgs;
    constructor(message: string, context: null | T_Context, cause?: AbstractError.Input, args?: Partial<T_Args>);
    /**
     * Gets a detailed output message for error handlers.
     */
    getOutput(): MessageMaker.BulkMsgs;
    /**
     * The object shape used when converting to JSON.
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#description | JSON.stringify}
     */
    toJSON(): AbstractError.JSON<T_Context>;
    /**
     * Overrides the default function to return a string representation of this
     * object.
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toString | Object.prototype.toString()}
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/toString | Error.prototype.toString()}
     */
    toString(): string;
    /**
     * Overrides the default function to return an object representation of this
     * object.
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/valueOf | Object.prototype.valueOf()}
     */
    valueOf(): AbstractError.JSON<T_Context>;
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
export declare namespace AbstractError {
    /**
     * Context information for an error.
     *
     * @since 0.1.0-alpha
     */
    type Context = Context.Basic | Context.Class | Context.Function;
    /**
     * Types for {@link Context} interface.
     *
     * @since 0.1.0-alpha
     */
    namespace Context {
        /**
         * Basic context information for a thrown error.
         *
         * @since 0.1.0-alpha
         */
        interface Basic {
            file: string;
            line?: string;
            module?: string;
        }
        /**
         * Context information for an error thrown in a class.
         *
         * @since 0.1.0-alpha
         */
        interface Class extends Partial<Basic> {
            class: string;
            method: string;
        }
        /**
         * Context information for an error thrown in a function.
         *
         * @since 0.1.0-alpha
         */
        interface Function extends Partial<Basic> {
            function: string;
        }
    }
    /**
     * Function for handling errors.
     *
     * **Should exit the node process.**
     *
     * @param error    Error to handle.
     * @param level    Depth level for output to the console.
     * @param console  Instance used to log messages and debugging info.
     * @param fs       Instance used to work with paths and files.
     * @param args     Overrides for default options.
     *
     * @since 0.1.0-alpha
     */
    type Handler = (error: Input, level: number, console: Logger, fs: FileSystemType, args?: Partial<Handler.Args>) => void;
    /**
     * Types for handling errors in a variety of contexts.
     *
     * @since 0.1.0-alpha
     */
    namespace Handler {
        /**
         * Optional configuration for {@link Handler} function types.
         *
         * @since 0.1.0-alpha
         */
        interface Args extends MessageMaker.BulkMsgArgs {
            /**
             * Whether to exit the process after handling.
             *
             * @default true
             */
            exitProcess: boolean;
        }
    }
    /**
     * Expected error input types for Handler funtions.
     *
     * This is mostly fake - in reality, 'errors' can be anything.
     *
     * @since 0.1.0-alpha
     */
    type Input = null | boolean | number | string | string[] | {
        [key: string]: any;
    } | (Partial<Error> & {
        [key: string]: any;
    }) | Partial<NodeCliError>;
    /**
     * Export shape for a plain {@link AbstractError} object.
     *
     * @since 0.1.0-alpha
     */
    interface JSON<T_Context extends object = AbstractError.Context> extends Objects.Classify<Omit<AbstractError<never, T_Context>, "args" | "getOutput" | "toJSON" | "toString" | "valueOf">> {
        /**
         * Result of this.toString().
         */
        string: string;
        [key: string]: unknown;
    }
    /**
     * An approximation of the error thrown by node run via npm, which I can't
     * find the proper type for despite a ton of search keywords.
     *
     * @since 0.1.0-alpha
     */
    interface NodeCliError extends Error {
        code?: string;
        output?: (null | string)[];
        path?: string;
        pid?: number;
        signal?: null | unknown;
        status?: number;
        stderr?: string;
        stdout?: string;
        [key: string]: any;
    }
}
//# sourceMappingURL=AbstractError.d.ts.map