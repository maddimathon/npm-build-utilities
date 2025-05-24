/**
 * @since ___PKG_VERSION___
 * 
 * @packageDocumentation
 */
/**
 * @package @maddimathon/npm-build-utilities@___CURRENT_VERSION___
 */
/*!
 * @maddimathon/npm-build-utilities@___CURRENT_VERSION___
 * @license MIT
 */

import {
    escRegExp,
    typeOf,
} from '@maddimathon/utility-typescript/functions';

import {
    MessageMaker,
    node,
    VariableInspector,
} from '@maddimathon/utility-typescript/classes';

import type {
    LocalError,
    Logger,
} from '../../types/index.js';

import {
    AbstractError,
    UnknownCaughtError,
} from './index.js';
import { RecursivePartial } from '@maddimathon/utility-typescript/types/objects/basics';


const _msgMaker = new MessageMaker();

/**
 * Returns a string representation of the error for logging a child object of an
 * error.
 *
 * @internal
 * @private
 */
function _errorStringifyInternal(
    error: LocalError.Input,
    args: Partial<LocalError.Handler.Args>,
    console: Logger,
    level: number,
): MessageMaker.BulkMsgs {
    args = {
        ...args,

        bold: false,

        linesIn: 0,
        linesOut: 0,
    };

    if ( typeof error !== 'object' ) {
        return [ [ String( error ), args ] ];
    }

    const bulkMsgs: MessageMaker.BulkMsgs = [];

    let i = 0;
    for ( const [ _msg, _args ] of _errorStringify( error, args, console, 1 + level ) ) {

        bulkMsgs.push( [ _msg, {
            depth: ( i > 0 ? 1 : 0 ),
            ..._args,
        } ] );

        i++;
    }

    return bulkMsgs;
}

/**
 * Returns a string representation of the error for logging.
 * 
 * @category Errors
 * 
 * @internal
 * @private
 */
export function _errorStringify(
    error: LocalError.Input,
    args: Partial<LocalError.Handler.Args>,
    console: Logger,
    level: number,
): MessageMaker.BulkMsgs {

    /**
     * Sectioned information for the error message.
     */
    let t_errorInfo: {
        name: string;
        message: string | undefined;
        output: string;
        cause: unknown | undefined;
        stack: string | undefined;
        details: string | { [ key: string ]: any; };
    };

    const errorType = typeOf( error );

    const _defaultErrorInfo = (
        err: Exclude<object & typeof error, any[]> | UnknownCaughtError,
        info?: Partial<typeof t_errorInfo>,
    ) => {

        const default_info: typeof t_errorInfo = {
            name: err.name ?? 'Error',
            message: err.message ?? '',
            output: ( err as { [ key: string ]: any; } ).output ?? '',
            cause: err.cause,
            stack: err.stack,

            details: {},
        };

        if ( err instanceof UnknownCaughtError ) {

            default_info.details = {
                cause: err.cause,
            };

            const causeString = err.cause
                ? _msgMaker.msgs( _errorStringifyInternal( err.cause, args, console, 1 + level ) )
                : '';

            if ( causeString.length ) {
                default_info.cause = undefined;
                default_info.output = causeString;
            }
        } else if ( err instanceof AbstractError && !default_info.output ) {
            default_info.output = console.nc.msg.msgs( err.getOutput(), {
                ...args,

                bold: false,
                italic: false,
            } );
        }

        return {
            ...default_info,
            ...info,
        } as const satisfies typeof t_errorInfo;
    };

    switch ( typeof error ) {

        case 'object':
            // breaks
            if ( error instanceof UnknownCaughtError ) {
                t_errorInfo = _defaultErrorInfo( error );
                break;
            }

            // breaks
            if ( error instanceof AbstractError ) {
                t_errorInfo = _defaultErrorInfo( error );
                break;
            }

            // breaks
            if ( error instanceof Error ) {

                const output = [
                    error.output
                    || error.stderr
                    || error.stdout
                    || []
                ].flat();

                t_errorInfo = _defaultErrorInfo( error, {
                    message: error.message,
                    output: output.filter( v => v !== null ).join( '\n\n' ),

                    details: {
                        code: error.code,
                        signal: error.signal,
                        status: error.status,
                        path: error.path,
                        pid: error.pid,
                        // stderr: error.stderr,
                        // stdout: error.stdout,
                    },
                } );

                break;
            }

            // breaks
            if ( error === null || Array.isArray( error ) ) {

                error = new UnknownCaughtError(
                    `<${ errorType }> \n${ String( error ) }`,
                    { cause: error }
                );

                t_errorInfo = _defaultErrorInfo( error );
                break;
            }

            let _objConstructorName = error.constructor?.name ?? 'object';

            if ( _objConstructorName === 'Object' ) {
                _objConstructorName = _objConstructorName.toLowerCase();
            }

            t_errorInfo = _defaultErrorInfo( error, {
                message: [
                    `Unknown error object type: <${ _objConstructorName }>`,
                    error.message ?? '',
                ].filter( str => str.length ).join( ' — ' ),
            } );
            break;

        case 'boolean':
        case 'number':
        case 'string':
            const _errorStringLength = (
                (
                    args.maxWidth
                    ?? console.nc.args.msgMaker.msg?.maxWidth
                    ?? 100
                )
                - ( new UnknownCaughtError( '' ) ).name.length
                - errorType.length
                - 6
            );
            // console.vi.log( { 'UnknownCaughtError.prototype.name.length': ( new UnknownCaughtError( '' ) ).name.length }, level );
            // console.vi.log( { _errorStringLength }, level );

            let _errorString = String( error );

            if ( _errorString.length > _errorStringLength ) {
                _errorString = _errorString.substring( 0, _errorStringLength - 3 ) + '...';
            }

            error = new UnknownCaughtError(
                `<${ errorType }> ${ _errorString }`,
                { cause: error }
            );
            t_errorInfo = _defaultErrorInfo( error );
            break;

        default:
            error = new UnknownCaughtError(
                `Unknown error type: <${ errorType }> \n${ String( error ) }`,
                { cause: error }
            );
            t_errorInfo = _defaultErrorInfo( error );
            break;
    }

    const errorInfo = {
        ...t_errorInfo,

        message: t_errorInfo.message?.trim(),
        output: t_errorInfo.output.trim(),
    };

    const _msgHeading = ( heading: string ): MessageMaker.BulkMsgs => [
        [ '' ],
        [
            `-- ${ heading } --`,
            { bold: true, italic: true, },
        ],
    ];

    const bulkMsgs: MessageMaker.BulkMsgs = [
        [ `[${ errorInfo.name }] ${ errorInfo.message ?? '' }` ],
    ];

    if ( errorInfo.output ) {

        if ( error instanceof AbstractError ) {
            bulkMsgs.push( [ errorInfo.output, { bold: false } ] );
        } else {
            bulkMsgs.push( [ errorInfo.output, { bold: false, clr: 'black', } ] );
        }
    }

    if ( errorInfo.cause ) {

        if ( errorInfo.output || !( error instanceof UnknownCaughtError ) ) {

            for ( const arr of _msgHeading( 'Cause' ) ) {
                bulkMsgs.push( arr );
            }
        }

        for ( const arr of _errorStringifyInternal( errorInfo.cause, args, console, 1 + level ) ) {
            bulkMsgs.push( arr );
        }
    }

    if ( errorInfo.stack ) {

        for ( const arr of _msgHeading( 'Stack' ) ) {
            bulkMsgs.push( arr );
        }

        const _fs = new node.NodeFiles();

        const _rootDirPath = _fs.pathResolve().replace( /\/\s*$/g, '' ) + '/';

        const _rootDirPathRegex = new RegExp(
            `(?<=[\\(|\\s|\\n])${ escRegExp( _rootDirPath ) }`,
            'g'
        );

        const _trimmedStack = errorInfo.stack.replace( _rootDirPathRegex, '' );

        bulkMsgs.push( [
            _trimmedStack,
            { bold: false, italic: true, maxWidth: null, }
        ] );
    }

    const details: string[] = [];

    if ( typeof errorInfo.details == 'string' ) {
        details.push( errorInfo.details );
    } else {

        for ( const key in errorInfo.details ) {

            const _inspectArgs = {
                childArgs: {} as RecursivePartial<VariableInspector.Args[ 'childArgs' ]>,
            };

            if (
                typeof errorInfo.details[ key ] === 'object'
                && errorInfo.details[ key ] !== null
                && !Array.isArray( errorInfo.details[ key ] )
                && errorInfo.details[ key ].constructor.name.toLowerCase() !== 'object'
            ) {
                _inspectArgs.childArgs.includeValue = false;
            }

            details.push( VariableInspector.stringify(
                { [ key ]: errorInfo.details[ key ] },
                _inspectArgs
            ) );
        }
    }

    if ( details.length ) {

        for ( const arr of _msgHeading( 'Details' ) ) {
            bulkMsgs.push( arr );
        }

        bulkMsgs.push( [ details.join( '\n' ), { bold: false, italic: false, maxWidth: null, } ] );
    }

    if ( !( error instanceof Error ) ) {

        for ( const arr of _msgHeading( 'Dump' ) ) {
            bulkMsgs.push( arr );
        }

        const _inspectArgs = {
            childArgs: {} as RecursivePartial<VariableInspector.Args[ 'childArgs' ]>,
        };

        if (
            typeof error === 'object'
            && !Array.isArray( error )
            && error.constructor.name.toLowerCase() !== 'object'
        ) {
            _inspectArgs.childArgs.includeValue = false;
        }

        bulkMsgs.push( [
            VariableInspector.stringify( { error }, _inspectArgs ),
            { bold: false, italic: false, maxWidth: null, }
        ] );

        if ( !_inspectArgs.childArgs.includeValue ) {

            bulkMsgs.push( [
                'child value inspection was skipped to avoid a super-long output message — to inspect the value, catch the error and log it before handling with the default handler',
                {
                    bold: false,
                    clr: 'grey',
                    depth: 1,
                    italic: true,
                }
            ] );
        }
    }

    return bulkMsgs;
}

/**
 * Default error handler for use within the library.
 * 
 * @category Errors
 * 
 * @internal
 */
export function errorHandler(
    error: LocalError.Input,
    level: number,
    console: Logger,
    args?: Partial<LocalError.Handler.Args>,
) {
    args = {
        bold: true,
        clr: 'red',
        italic: false,

        linesIn: 2,
        linesOut: 2,

        ...args ?? {},
    };

    const bulkMsgs = _errorStringify( error, args, console, 0 );

    console.error( bulkMsgs, level, args );
    process.exit( process.exitCode ?? 0 );
};