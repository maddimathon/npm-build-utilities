/**
 * @since 0.1.0-alpha
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.3.0-alpha.2.draft
 * @license MIT
 */
import { MessageMaker } from '@maddimathon/utility-typescript/classes';
import type { FileSystemType } from '../../types/FileSystemType.js';
import type { Logger } from '../../types/Logger.js';
import { AbstractError, UnknownCaughtError } from './classes/index.js';
/**
 * Gets some basic, standardized info for any input error.
 *
 * @since 0.2.0-alpha.4
 *
 * @internal
 */
export declare function getErrorInfo(error: AbstractError.Input, level: number, console: Logger, fs: FileSystemType, args: Partial<AbstractError.Handler.Args>): [typeof error, errorStringify.Info];
/**
 * @since 0.2.0-alpha.4
 *
 * @internal
 */
export declare namespace getErrorInfo {
    /**
     * Converts a given string into a valid bulk msgs argument.
     */
    function stringToBulkMsgs(str: string, _opts?: Partial<{
        removeNodeStyles: boolean;
    }>): MessageMaker.BulkMsgs;
    /**
     * Parses an error object in the most basic way.
     *
     * @since 0.2.0-alpha.4
     */
    function object(error: Error | Partial<Error> | Partial<AbstractError.NodeCliError> | UnknownCaughtError, level: number, console: Logger, fs: FileSystemType, args: Partial<AbstractError.Handler.Args>, info?: Partial<errorStringify.Info>): {
        readonly details: {};
        readonly name: string;
        readonly message: string;
        readonly output: MessageMaker.BulkMsgs;
        readonly cause: unknown | undefined;
        readonly stack: string | undefined;
    };
}
/**
 * Returns a string(s) representation of an error for logging.
 *
 * @category Errors
 *
 * @param _error   Error to convery.
 * @param level    Depth level for output to the console.
 * @param console  Instance used to log messages and debugging info.
 * @param fs       Instance used to work with paths and files.
 * @param args     Overrides for default options.
 *
 * @since 0.1.0-alpha
 *
 * @internal
 */
export declare function errorStringify(_error: AbstractError.Input, level: number, console: Logger, fs: FileSystemType, args: Partial<AbstractError.Handler.Args>): MessageMaker.BulkMsgs;
/**
 * Utility functions used by the {@link errorStringify} function.
 *
 * @category Errors
 *
 * @since 0.2.0-alpha.4
 * @internal
 */
export declare namespace errorStringify {
    /**
     * Basic, structured and parsed information about an error.
     *
     * @since 0.2.0-alpha.4
     */
    interface Info {
        name: string;
        message: string | undefined;
        output: MessageMaker.BulkMsgs;
        cause: unknown | undefined;
        stack: string | undefined;
        details: string | {
            [key: string]: any;
        };
    }
    /**
     * Returns a string representation of a child object of an error.
     *
     * @internal
     * @hidden
     */
    function _childStringify(_error: AbstractError.Input, level: number, console: Logger, fs: FileSystemType, args: Partial<AbstractError.Handler.Args>): MessageMaker.BulkMsgs;
    /**
     * Formats a heading for output.
     *
     * @since 0.2.0-alpha.4
     */
    function heading(heading: string): MessageMaker.BulkMsgs;
    /**
     * Checks the length of the output message and writes it to a file instead
     * when applicable (changing the returned message to reflect the log
     * location).
     *
     * @since 0.2.0-alpha.4
     */
    function validateMsgsLength(info: errorStringify.Info, console: Logger, fs: FileSystemType, args: Partial<AbstractError.Handler.Args>, msg: MessageMaker.BulkMsgs, _maxLines?: number): MessageMaker.BulkMsgs;
    /**
     * Formats the getErrorInfo message property.
     *
     * @since 0.2.0-alpha.4
     */
    function message(error: ReturnType<typeof getErrorInfo>[0], info: errorStringify.Info, level: number, console: Logger, fs: FileSystemType, args: Partial<AbstractError.Handler.Args>): MessageMaker.BulkMsgs;
    /**
     * Formats the getErrorInfo output property.
     *
     * @since 0.2.0-alpha.4
     */
    function output(error: ReturnType<typeof getErrorInfo>[0], info: errorStringify.Info, level: number, console: Logger, fs: FileSystemType, args: Partial<AbstractError.Handler.Args>): MessageMaker.BulkMsgs;
    /**
     * Formats the getErrorInfo cause property.
     *
     * @since 0.2.0-alpha.4
     */
    function cause(error: ReturnType<typeof getErrorInfo>[0], info: errorStringify.Info, level: number, console: Logger, fs: FileSystemType, args: Partial<AbstractError.Handler.Args>): MessageMaker.BulkMsgs;
    /**
     * Formats the getErrorInfo stack property.
     *
     * @since 0.2.0-alpha.4
     */
    function stack(error: ReturnType<typeof getErrorInfo>[0], info: errorStringify.Info, level: number, console: Logger, fs: FileSystemType, args: Partial<AbstractError.Handler.Args>): MessageMaker.BulkMsgs;
    /**
     * Formats the getErrorInfo details property.
     *
     * @since 0.2.0-alpha.4
     */
    function details(error: ReturnType<typeof getErrorInfo>[0], info: errorStringify.Info, level: number, console: Logger, fs: FileSystemType, args: Partial<AbstractError.Handler.Args>): MessageMaker.BulkMsgs;
}
//# sourceMappingURL=errorStringify.d.ts.map