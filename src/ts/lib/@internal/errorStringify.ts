/**
 * @since 0.1.0-alpha
 * 
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@___CURRENT_VERSION___
 * @license MIT
 */

import {
    slugify,
    typeOf,
} from '@maddimathon/utility-typescript/functions';

import {
    MessageMaker,
    VariableInspector,
} from '@maddimathon/utility-typescript/classes';

// import type {
// } from '../../types/index.js';

import type { FileSystemType } from '../../types/FileSystemType.js';
import type { Logger } from '../../types/Logger.js';

import {
    AbstractError,
    UnknownCaughtError,
} from './classes/index.js';

import { writeLog } from './writeLog.js';


const _msgMaker = new MessageMaker( { paintFormat: null } );

/**
 * Gets some basic, standardized info for any input error.
 * 
 * @since 0.2.0-alpha.4
 * 
 * @internal
 */
export function getErrorInfo(
    error: AbstractError.Input,
    level: number,
    console: Logger,
    fs: FileSystemType,
    args: Partial<AbstractError.Handler.Args>,
) {

    /**
     * Categorized information for the error message.
     */
    let t_errorInfo: errorStringify.Info;

    const errorType = typeOf( error );

    switch ( typeof error ) {

        case 'object':
            // breaks
            // pass to the default object handler
            if ( error instanceof AbstractError ) {
                t_errorInfo = getErrorInfo.object( error, level, console, fs, args );
                break;
            }

            // breaks
            // fix the output information, then pass to the default object handler
            if ( error instanceof Error ) {
                const _typedError = error as Error & Partial<AbstractError.NodeCliError>;

                t_errorInfo = getErrorInfo.object(
                    error,
                    level,
                    console,
                    fs,
                    args,
                    {
                        message: _typedError.message,
                        output: [
                            _typedError.output
                            || _typedError.stderr
                            || _typedError.stdout
                            || []
                        ].flat().filter(
                            v => v !== null
                        ).map(
                            _str => getErrorInfo.stringToBulkMsgs( _str )
                        ).flat( 1 ),

                        details: {
                            code: _typedError.code,
                            signal: _typedError.signal,
                            status: _typedError.status,

                            path: typeof _typedError.path === 'string'
                                ? fs.pathRelative( _typedError.path ).replace( ' ', '%20' )
                                : _typedError.path,

                            pid: _typedError.pid,
                        },
                    },
                );

                break;
            }

            // breaks
            // generate UnknownCaughtError for non-object type, then pass to the
            // default object handler
            if ( error === null || Array.isArray( error ) ) {

                error = new UnknownCaughtError(
                    `<${ errorType }> \n${ String( error ) }`,
                    error,
                );

                t_errorInfo = getErrorInfo.object( error, level, console, fs, args );
                break;
            }

            let _objConstructorName = error.constructor?.name ?? 'object';

            if ( _objConstructorName === 'Object' ) {
                _objConstructorName = _objConstructorName.toLowerCase();
            }

            // it is weird that this isn't an error object if it's an object
            t_errorInfo = getErrorInfo.object(
                error,
                level,
                console,
                fs,
                args,
                {
                    message: [
                        `Unknown error object type: <${ _objConstructorName }>`,
                        error.message ?? '',
                    ].filter( str => str.length ).join( ' — ' ),
                },
            );
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

            let _errorString = String( error );

            if ( _errorString.length > _errorStringLength ) {
                _errorString = _errorString.substring( 0, _errorStringLength - 3 ) + '...';
            }

            error = new UnknownCaughtError(
                `<${ errorType }> ${ _errorString }`,
                { cause: error }
            );

            t_errorInfo = getErrorInfo.object( error, level, console, fs, args );
            break;

        default:
            error = new UnknownCaughtError(
                `Unknown error type: <${ errorType }> \n${ String( error ) }`,
                { cause: error }
            );

            t_errorInfo = getErrorInfo.object( error, level, console, fs, args );
            break;
    }

    return [ error, {
        ...t_errorInfo,

        message: t_errorInfo.message?.trim(),
        output: t_errorInfo.output,
    } ] as [ typeof error, typeof t_errorInfo ];
}

/**
 * @since 0.2.0-alpha.4
 * 
 * @internal
 */
export namespace getErrorInfo {

    /**
     * Converts a given string into a valid bulk msgs argument.
     */
    export function stringToBulkMsgs(
        str: string,
        _opts?: Partial<{
            removeNodeStyles: boolean;
        }>,
    ): MessageMaker.BulkMsgs {

        const opts = {
            removeNodeStyles: true,
            ..._opts,
        };

        if ( opts.removeNodeStyles ) {
            str = str.replace( /\\x1b\[[\d|;|:]*\d+m/g, '' );
        }

        return [ [ str ] ];
    }

    /** 
     * Parses an error object in the most basic way.
     * 
     * @since 0.2.0-alpha.4
     */
    export function object(
        error: Error | Partial<Error> | Partial<AbstractError.NodeCliError> | UnknownCaughtError,
        level: number,
        console: Logger,
        fs: FileSystemType,
        args: Partial<AbstractError.Handler.Args>,
        info: Partial<errorStringify.Info> = {},
    ) {

        const default_info = {
            name: error.name ?? 'Error',
            message: error.message ?? '',
            output: ( 'output' in error && error.output ) ? [ [ error.output.filter( _item => _item !== null ) ] ] : [],
            cause: error.cause,
            stack: error.stack,

            details: {},
        } as const satisfies errorStringify.Info;

        if ( error instanceof AbstractError && !info?.output ) {
            info.output = error.getOutput();
        }

        const merged = {
            ...default_info,
            ...info,

            details: typeof info?.details === 'object' ? {
                ...default_info.details,
                ...info?.details,
            } : ( info?.details ?? default_info.details ),

        } as const satisfies errorStringify.Info;

        return merged;
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
export function errorStringify(
    _error: AbstractError.Input,
    level: number,
    console: Logger,
    fs: FileSystemType,
    args: Partial<AbstractError.Handler.Args>,
): MessageMaker.BulkMsgs {

    const [ error, info ] = getErrorInfo( _error, level, console, fs, args );

    const msgs: MessageMaker.BulkMsgs = [
        ...errorStringify.message( error, info, level, console, fs, args ),
        ...errorStringify.output( error, info, level, console, fs, args ),
        ...errorStringify.cause( error, info, level, console, fs, args ),
        ...errorStringify.stack( error, info, level, console, fs, args ),
        ...errorStringify.details( error, info, level, console, fs, args ),
    ];

    if (
        (
            error instanceof UnknownCaughtError
            && !( error.cause instanceof Error )
        )
        || console.params.debug
    ) {

        msgs.push(
            ...errorStringify.heading( 'Dump' ),
            ...errorStringify.validateMsgsLength(
                info,
                console,
                fs,
                args,
                [
                    [
                        VariableInspector.stringify( { info } ),
                        { bold: false, italic: false, maxWidth: null, }
                    ],
                    [
                        VariableInspector.stringify( { error } ),
                        { bold: false, italic: false, maxWidth: null, }
                    ],
                    [
                        VariableInspector.stringify( { 'error.toString()': error.toString() } ),
                        { bold: false, italic: false, maxWidth: null, }
                    ],
                ],
            ),
        );
    } else if ( console.params.debug ) {
        msgs.push(
            ...errorStringify.heading( 'Dump' ),
            [ 'No content.', { bold: false, italic: true } ]
        );
    }

    return msgs;
}

/**
 * Utility functions used by the {@link errorStringify} function.
 * 
 * @category Errors
 * 
 * @since 0.2.0-alpha.4
 * @internal
 */
export namespace errorStringify {

    /**
     * Basic, structured and parsed information about an error.
     * 
     * @since 0.2.0-alpha.4
     */
    export interface Info {
        name: string;
        message: string | undefined;
        output: MessageMaker.BulkMsgs;
        cause: unknown | undefined;
        stack: string | undefined;
        details: string | { [ key: string ]: any; };
    };

    /**
     * Returns a string representation of a child object of an error.
     *
     * @internal
     * @hidden
     */
    export function _childStringify(
        _error: AbstractError.Input,
        level: number,
        console: Logger,
        fs: FileSystemType,
        args: Partial<AbstractError.Handler.Args>,
    ): MessageMaker.BulkMsgs {
        args = {
            ...args,

            bold: false,

            linesIn: 0,
            linesOut: 0,
        };

        if ( typeof _error !== 'object' ) {
            return [ [ String( _error ), args ] ];
        }

        const [ error, info ] = getErrorInfo( _error, level, console, fs, args );

        const msgs: MessageMaker.BulkMsgs = [];

        let i = 0;
        for ( const [ _msg, _args ] of [
            ...errorStringify.message( error, info, level, console, fs, args ),
            ...errorStringify.output( error, info, level, console, fs, args ),
            ...errorStringify.cause( error, info, level, console, fs, args ),
            // ...errorStringify.stack( error, info, level, console, fs, args ),
            // ...errorStringify.details( error, info, level, console, fs, args ),
        ] ) {

            msgs.push( [ _msg, {
                depth: ( i > 0 ? 1 : 0 ),
                ..._args,
            } ] );

            i++;
        }

        return msgs;
    }

    /**
     * Formats a heading for output.
     * 
     * @since 0.2.0-alpha.4
     */
    export function heading( heading: string ): MessageMaker.BulkMsgs {

        return [
            [ '' ],
            [
                `-- ${ heading } --`,
                { bold: true, italic: true, },
            ],
        ];
    }

    /**
     * Checks the length of the output message and writes it to a file instead
     * when applicable (changing the returned message to reflect the log
     * location).
     * 
     * @since 0.2.0-alpha.4
     */
    export function validateMsgsLength(
        info: errorStringify.Info,
        console: Logger,
        fs: FileSystemType,
        args: Partial<AbstractError.Handler.Args>,
        msg: MessageMaker.BulkMsgs,
        _maxLines: number = 80,
    ): MessageMaker.BulkMsgs {

        const joined = typeof msg === 'string' ? _msgMaker.msg( msg ) : _msgMaker.msgs( msg );

        const abridgedOutput = joined.split( '\n' ).length > _maxLines
            || joined.length > ( _maxLines * 120 );

        // returns
        if ( !abridgedOutput ) {
            return msg;
        }

        const fileWriteResult = writeLog(
            joined.trim(),
            slugify( info.name ),
            {
                config: console.config,
                fs,
            },
        );

        if ( fileWriteResult ) {
            msg = [ [
                'Long output message written to ' + fs.pathRelative( fileWriteResult ).replace( ' ', '%20' ),
                { bold: false, clr: args.clr, italic: true }
            ] ];
        }

        return msg;
    }

    /**
     * Formats the getErrorInfo message property.
     * 
     * @since 0.2.0-alpha.4
     */
    export function message(
        error: ReturnType<typeof getErrorInfo>[ 0 ],
        info: errorStringify.Info,
        level: number,
        console: Logger,
        fs: FileSystemType,
        args: Partial<AbstractError.Handler.Args>,
    ): MessageMaker.BulkMsgs {

        return [
            [ `[${ info.name }] ${ info.message ?? '' }` ],
        ];
    }

    /**
     * Formats the getErrorInfo output property.
     * 
     * @since 0.2.0-alpha.4
     */
    export function output(
        error: ReturnType<typeof getErrorInfo>[ 0 ],
        info: errorStringify.Info,
        level: number,
        console: Logger,
        fs: FileSystemType,
        args: Partial<AbstractError.Handler.Args>,
    ): MessageMaker.BulkMsgs {

        // returns
        if ( !info.output.length ) {
            return console.params.debug ? [
                ...errorStringify.heading( 'Output' ),
                [ 'No content.', { bold: false, italic: true } ]
            ] : [];
        }

        const output = validateMsgsLength(
            info,
            console,
            fs,
            args,
            info.output.map(
                ( [ _msg, _opts ] ) => [ _msg, {
                    bold: false,
                    clr: error instanceof AbstractError ? args.clr : 'black',
                    maxWidth: null,
                    ..._opts,
                } ]
            ),
        );

        const msgs: MessageMaker.BulkMsgs = [
            // ...errorStringify.heading( 'Output' ),
            ...output,
        ];

        return msgs;
    }

    /**
     * Formats the getErrorInfo cause property.
     * 
     * @since 0.2.0-alpha.4
     */
    export function cause(
        error: ReturnType<typeof getErrorInfo>[ 0 ],
        info: errorStringify.Info,
        level: number,
        console: Logger,
        fs: FileSystemType,
        args: Partial<AbstractError.Handler.Args>,
    ): MessageMaker.BulkMsgs {

        // returns
        if ( typeof info.cause === 'undefined' ) {
            return console.params.debug ? [
                ...errorStringify.heading( 'Cause' ),
                [ 'No content.', { bold: false, italic: true } ]
            ] : [];
        }

        const msgs: MessageMaker.BulkMsgs = [
            ...errorStringify.heading( 'Cause' ),
            ...validateMsgsLength(
                info,
                console,
                fs,
                args,
                errorStringify._childStringify(
                    info.cause,
                    1 + level,
                    console,
                    fs,
                    args,
                ),
            ),
        ];

        return msgs;
    }

    /**
     * Formats the getErrorInfo stack property.
     * 
     * @since 0.2.0-alpha.4
     */
    export function stack(
        error: ReturnType<typeof getErrorInfo>[ 0 ],
        info: errorStringify.Info,
        level: number,
        console: Logger,
        fs: FileSystemType,
        args: Partial<AbstractError.Handler.Args>,
    ): MessageMaker.BulkMsgs {

        // returns
        if ( !info.stack?.length ) {
            return console.params.debug ? [
                ...errorStringify.heading( 'Stack' ),
                [ 'No content.', { bold: false, italic: true } ]
            ] : [];
        }

        const _stackPathRegex = /(^\s*at\s+[^\n]*?\s+)\((?:file\:\/\/)?([^\(\)]+)\)(?=(?:\s*$))/;

        const _trimmedStack = info.stack.split( '\n' ).map( ( path ) => {

            const _matches = path.match( _stackPathRegex );

            if ( _matches && _matches[ 2 ] ) {
                path = path.replace( _stackPathRegex, '$1' )
                    + `(${ fs.pathRelative( decodeURI( _matches[ 2 ] ) ).replace( ' ', '%20' ) })`;
            }

            return path;
        } );

        const msgs: MessageMaker.BulkMsgs = [
            ...errorStringify.heading( 'Stack' ),
            ...validateMsgsLength( info, console, fs, args, [ [
                _trimmedStack,
                { bold: false, italic: true, maxWidth: null }
            ] ] ),
        ];

        return msgs;
    }

    /**
     * Formats the getErrorInfo details property.
     * 
     * @since 0.2.0-alpha.4
     */
    export function details(
        error: ReturnType<typeof getErrorInfo>[ 0 ],
        info: errorStringify.Info,
        level: number,
        console: Logger,
        fs: FileSystemType,
        args: Partial<AbstractError.Handler.Args>,
    ): MessageMaker.BulkMsgs {

        const details: string[] = [];

        if ( typeof info.details == 'string' ) {
            details.push( info.details );
        } else {

            for ( const key in info.details ) {
                details.push(
                    VariableInspector.stringify( { [ key ]: info.details[ key ] } )
                );
            }
        }

        // returns
        if ( !details.length ) {
            return console.params.debug ? [
                ...errorStringify.heading( 'Details' ),
                [ 'No content.', { bold: false, italic: true } ]
            ] : [];
        }

        const msgs: MessageMaker.BulkMsgs = [
            ...errorStringify.heading( 'Details' ),
            ...validateMsgsLength(
                info,
                console,
                fs,
                args,
                [ [ details.join( '\n' ), {
                    bold: false,
                    italic: false,
                    maxWidth: null,
                } ] ],
            ),
        ];

        return msgs;
    }
}