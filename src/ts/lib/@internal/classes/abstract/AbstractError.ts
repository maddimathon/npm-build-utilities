/**
 * @since ___PKG_VERSION___
 * 
 * @packageDocumentation
 */
/**
 * @package @maddimathon/build-utilities@___CURRENT_VERSION___
 */
/*!
 * @maddimathon/build-utilities@___CURRENT_VERSION___
 * @license MIT
 */

import type { Objects } from '@maddimathon/utility-typescript/types';

import { CustomError, MessageMaker, VariableInspector } from '@maddimathon/utility-typescript/classes';

import type {
    LocalError,
} from '../../../../types/index.js';

import type { FileSystemType } from '../../../../types/FileSystemType.js';

// import { DummyConsole } from '../DummyConsole.js';

// import {
//     errorHandler,
//     _errorStringify,
//     DummyConsole,
// } from '../../index.js';


// const _dummyConsole = new DummyConsole();

/**
 * An extension of the utilities error for use within the library.
 */
export abstract class AbstractError<
    Args extends LocalError.Args,
> extends CustomError<Args> implements LocalError<Args> {



    /* STATIC
     * ====================================================================== */

    /**
     * Adds this error information to a log file according to the project
     * configuration.
     *
     * @return  If false, writing a log file failed. Else, this is the path to
     *          the log file.
     */
    public static log(
        error: unknown,
        fs: FileSystemType,
        args?: Partial<LocalError.Handler.Args>,
    ): false | string {

        return String( error );
    }



    /* LOCAL PROPERTIES
     * ====================================================================== */

    public readonly context: null | AbstractError.Context;


    /* Args ===================================== */

    /**
     * Represents the name for the type of error.
     * 
     * @category Args
     * 
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/name | MDN docs}
     */
    public abstract override readonly name: string;

    /**
     * @category Args
     */
    public abstract override get ARGS_DEFAULT(): Args;



    /* CONSTRUCTOR
     * ====================================================================== */

    public constructor (
        message: string,
        context: null | AbstractError.Context,
        args?: Partial<Args> & { cause?: LocalError.Input; },
    ) {
        super( message, args?.cause, args );
        this.context = context;
    }



    /* LOCAL METHODS
     * ====================================================================== */

    /**
     * Gets a detailed output message for error handlers.
     */
    public getOutput(): MessageMaker.BulkMsgs {

        const msgs: MessageMaker.BulkMsgs = [];

        if ( this.context ) {
            msgs.push( [ VariableInspector.stringify( { context: this.context } ) ] );
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
    public toJSON(): Objects.Classify<AbstractError.JSON> {

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
    public override toString(): string {

        // returns
        if ( !this.stack ) {

            // returns
            if ( !this.name ) { return this.message; }

            // returns
            if ( !this.message ) { return this.name; }

            return `${ this.name }: ${ this.message }`;
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
    public override valueOf() { return this.toJSON(); }
}

/**
 * Used only for {@link AbstractError}.
 * 
 * @since ___PKG_VERSION___
 */
export namespace AbstractError {

    /**
     * Context information for an error.
     * 
     * @since ___PKG_VERSION___
     */
    export type Context =
        | Context.Basic
        | Context.Class
        | Context.Function;

    /**
     * Types for {@link Context} interface.
     * 
     * @since ___PKG_VERSION___
     */
    export namespace Context {

        /**
         * @interface
         */
        export type Basic = {
            file: string;
            line?: string;
            module?: string;
        };

        /**
         * @interface
         */
        export type Class = Partial<Basic> & {
            class: string;
            method: string;
        };

        /**
         * @interface
         */
        export type Function = Partial<Basic> & {
            function: string;
        };
    };

    /**
     * Export shape for a plain {@link AbstractError} object.
     */
    export interface JSON extends Omit<CustomError, "ARGS_DEFAULT"> {

        context: null | Context;
        message: string;
        name: string;

        /**
         * Result of this.toString().
         */
        string: string;

        cause?: unknown;
    };
}