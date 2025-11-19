/**
 * @since 0.1.0-alpha
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.3.0-alpha.9
 * @license MIT
 */
import { slugify, typeOf } from '@maddimathon/utility-typescript/functions';
import {
    MessageMaker,
    VariableInspector,
} from '@maddimathon/utility-typescript/classes';
import { AbstractError, UnknownCaughtError } from './classes/index.js';
import { writeLog } from './writeLog.js';
const _msgMaker = new MessageMaker({ paintFormat: null });
/**
 * Gets some basic, standardized info for any input error.
 *
 * @since 0.2.0-alpha.4
 *
 * @internal
 */
export function getErrorInfo(error, level, console, fs, args) {
    /**
     * Categorized information for the error message.
     */
    let t_errorInfo;
    const errorType = typeOf(error);
    switch (typeof error) {
        case 'object':
            // breaks
            // pass to the default object handler
            if (error instanceof AbstractError) {
                t_errorInfo = getErrorInfo.object(
                    error,
                    level,
                    console,
                    fs,
                    args,
                );
                break;
            }
            // breaks
            // fix the output information, then pass to the default object handler
            if (error instanceof Error) {
                const _typedError = error;
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
                                || [],
                        ]
                            .flat()
                            .filter((v) => v !== null)
                            .map((_str) => getErrorInfo.stringToBulkMsgs(_str))
                            .flat(1),
                        details: {
                            code: _typedError.code,
                            signal: _typedError.signal,
                            status: _typedError.status,
                            path:
                                typeof _typedError.path === 'string' ?
                                    fs
                                        .pathRelative(_typedError.path)
                                        .replace(' ', '%20')
                                :   _typedError.path,
                            pid: _typedError.pid,
                        },
                    },
                );
                break;
            }
            // breaks
            // generate UnknownCaughtError for non-object type, then pass to the
            // default object handler
            if (error === null || Array.isArray(error)) {
                error = new UnknownCaughtError(
                    `<${errorType}> \n${String(error)}`,
                    error,
                );
                t_errorInfo = getErrorInfo.object(
                    error,
                    level,
                    console,
                    fs,
                    args,
                );
                break;
            }
            let _objConstructorName = error.constructor?.name ?? 'object';
            if (_objConstructorName === 'Object') {
                _objConstructorName = _objConstructorName.toLowerCase();
            }
            // it is weird that this isn't an error object if it's an object
            t_errorInfo = getErrorInfo.object(error, level, console, fs, args, {
                message: [
                    `Unknown error object type: <${_objConstructorName}>`,
                    error.message ?? '',
                ]
                    .filter((str) => str.length)
                    .join(' — '),
            });
            break;
        case 'boolean':
        case 'number':
        case 'string':
            const _errorStringLength =
                (args.maxWidth ?? console.nc.args.msgMaker.msg?.maxWidth ?? 100)
                - new UnknownCaughtError('').name.length
                - errorType.length
                - 6;
            let _errorString = String(error);
            if (_errorString.length > _errorStringLength) {
                _errorString =
                    _errorString.substring(0, _errorStringLength - 3) + '...';
            }
            error = new UnknownCaughtError(`<${errorType}> ${_errorString}`, {
                cause: error,
            });
            t_errorInfo = getErrorInfo.object(error, level, console, fs, args);
            break;
        default:
            error = new UnknownCaughtError(
                `Unknown error type: <${errorType}> \n${String(error)}`,
                { cause: error },
            );
            t_errorInfo = getErrorInfo.object(error, level, console, fs, args);
            break;
    }
    return [
        error,
        {
            ...t_errorInfo,
            message: t_errorInfo.message?.trim(),
            output: t_errorInfo.output,
        },
    ];
}
/**
 * @since 0.2.0-alpha.4
 *
 * @internal
 */
(function (getErrorInfo) {
    /**
     * Converts a given string into a valid bulk msgs argument.
     */
    function stringToBulkMsgs(str, _opts) {
        const opts = {
            removeNodeStyles: true,
            ..._opts,
        };
        if (opts.removeNodeStyles) {
            str = str.replace(/\\x1b\[[\d|;|:]*\d+m/g, '');
        }
        return [[str]];
    }
    getErrorInfo.stringToBulkMsgs = stringToBulkMsgs;
    /**
     * Parses an error object in the most basic way.
     *
     * @since 0.2.0-alpha.4
     */
    function object(error, level, console, fs, args, info = {}) {
        const default_info = {
            name: error.name ?? 'Error',
            message: error.message ?? '',
            output:
                'output' in error && error.output ?
                    [[error.output.filter((_item) => _item !== null)]]
                :   [],
            cause: error.cause,
            stack: error.stack,
            details: {},
        };
        if (error instanceof AbstractError && !info?.output) {
            info.output = error.getOutput();
        }
        const merged = {
            ...default_info,
            ...info,
            details:
                typeof info?.details === 'object' ?
                    {
                        ...default_info.details,
                        ...info?.details,
                    }
                :   (info?.details ?? default_info.details),
        };
        return merged;
    }
    getErrorInfo.object = object;
})(getErrorInfo || (getErrorInfo = {}));
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
export function errorStringify(_error, level, console, fs, args) {
    const [error, info] = getErrorInfo(_error, level, console, fs, args);
    const msgs = [
        ...errorStringify.message(error, info, level, console, fs, args),
        ...errorStringify.output(error, info, level, console, fs, args),
        ...errorStringify.cause(error, info, level, console, fs, args),
        ...errorStringify.stack(error, info, level, console, fs, args),
        ...errorStringify.details(error, info, level, console, fs, args),
    ];
    if (
        (error instanceof UnknownCaughtError && !(error.cause instanceof Error))
        || console.params.debug
    ) {
        msgs.push(
            ...errorStringify.dump(error, info, level, console, fs, args),
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
(function (errorStringify) {
    /**
     * Returns a string representation of a child object of an error.
     *
     * @internal
     * @hidden
     */
    function _childStringify(_error, level, console, fs, args) {
        args = {
            ...args,
            bold: false,
            linesIn: 0,
            linesOut: 0,
        };
        if (typeof _error !== 'object') {
            return [[String(_error), args]];
        }
        const [error, info] = getErrorInfo(_error, level, console, fs, args);
        const msgs = [];
        let i = 0;
        for (const [_msg, _args] of [
            ...errorStringify.message(error, info, level, console, fs, args),
            ...errorStringify.output(error, info, level, console, fs, args),
            ...errorStringify.cause(error, info, level, console, fs, args),
            // ...errorStringify.stack( error, info, level, console, fs, args ),
            // ...errorStringify.details( error, info, level, console, fs, args ),
        ]) {
            msgs.push([
                _msg,
                {
                    depth: i > 0 ? 1 : 0,
                    ..._args,
                },
            ]);
            i++;
        }
        return msgs;
    }
    errorStringify._childStringify = _childStringify;
    /**
     * Formats a heading for output.
     *
     * @since 0.2.0-alpha.4
     */
    function heading(heading) {
        return [[''], [`-- ${heading} --`, { bold: true, italic: true }]];
    }
    errorStringify.heading = heading;
    /**
     * Checks the length of the output message and writes it to a file instead
     * when applicable (changing the returned message to reflect the log
     * location).
     *
     * @since 0.2.0-alpha.4
     */
    function validateMsgsLength(info, console, fs, args, msg, _maxLines = 80) {
        const joined =
            typeof msg === 'string' ? _msgMaker.msg(msg) : _msgMaker.msgs(msg);
        const abridgedOutput =
            joined.split('\n').length > _maxLines
            || joined.length > _maxLines * 120;
        // returns
        if (!abridgedOutput) {
            return msg;
        }
        const fileWriteResult = writeLog(joined.trim(), slugify(info.name), {
            config: console.config,
            fs,
        });
        if (fileWriteResult) {
            msg = [
                [
                    'Long output message written to '
                        + fs.pathRelative(fileWriteResult).replace(' ', '%20'),
                    { bold: false, clr: args.clr, italic: true },
                ],
            ];
        }
        return msg;
    }
    errorStringify.validateMsgsLength = validateMsgsLength;
    /**
     * Formats the getErrorInfo message property.
     *
     * @since 0.2.0-alpha.4
     */
    function message(error, info, level, console, fs, args) {
        return [[`[${info.name}] ${info.message ?? ''}`]];
    }
    errorStringify.message = message;
    /**
     * Formats the getErrorInfo output property.
     *
     * @since 0.2.0-alpha.4
     */
    function output(error, info, level, console, fs, args) {
        // returns
        if (!info.output.length) {
            return console.params.debug ?
                    [
                        ...errorStringify.heading('Output'),
                        ['No content.', { bold: false, italic: true }],
                    ]
                :   [];
        }
        const output = validateMsgsLength(
            info,
            console,
            fs,
            args,
            info.output.map(([_msg, _opts]) => [
                _msg,
                {
                    bold: false,
                    clr: error instanceof AbstractError ? args.clr : 'black',
                    maxWidth: null,
                    ..._opts,
                },
            ]),
        );
        const msgs = [
            // ...errorStringify.heading( 'Output' ),
            ...output,
        ];
        return msgs;
    }
    errorStringify.output = output;
    /**
     * Formats the getErrorInfo cause property.
     *
     * @since 0.2.0-alpha.4
     */
    function cause(error, info, level, console, fs, args) {
        // returns
        if (typeof info.cause === 'undefined') {
            return console.params.debug ?
                    [
                        ...errorStringify.heading('Cause'),
                        ['No content.', { bold: false, italic: true }],
                    ]
                :   [];
        }
        const msgs = [
            ...errorStringify.heading('Cause'),
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
    errorStringify.cause = cause;
    /**
     * Formats the getErrorInfo stack property.
     *
     * @since 0.2.0-alpha.4
     */
    function stack(error, info, level, console, fs, args) {
        // returns
        if (!info.stack?.length) {
            return console.params.debug ?
                    [
                        ...errorStringify.heading('Stack'),
                        ['No content.', { bold: false, italic: true }],
                    ]
                :   [];
        }
        const _stackPathRegex =
            /(^\s*at\s+[^\n]*?\s+)\((?:file\:\/\/)?([^\(\)]+)\)(?=(?:\s*$))/;
        const _trimmedStack = info.stack.split('\n').map((path) => {
            const _matches = path.match(_stackPathRegex);
            if (_matches && _matches[2]) {
                path =
                    path.replace(_stackPathRegex, '$1')
                    + `(${fs.pathRelative(decodeURI(_matches[2])).replace(' ', '%20')})`;
            }
            return path;
        });
        const msgs = [
            ...errorStringify.heading('Stack'),
            ...validateMsgsLength(info, console, fs, args, [
                [_trimmedStack, { bold: false, italic: true, maxWidth: null }],
            ]),
        ];
        return msgs;
    }
    errorStringify.stack = stack;
    /**
     * Formats the getErrorInfo details property.
     *
     * @since 0.2.0-alpha.4
     */
    function details(error, info, level, console, fs, args) {
        const details = [];
        if (typeof info.details == 'string') {
            details.push(info.details);
        } else {
            for (const key in info.details) {
                details.push(
                    VariableInspector.stringify({ [key]: info.details[key] }),
                );
            }
        }
        // returns
        if (!details.length) {
            return console.params.debug ?
                    [
                        ...errorStringify.heading('Details'),
                        ['No content.', { bold: false, italic: true }],
                    ]
                :   [];
        }
        const msgs = [
            ...errorStringify.heading('Details'),
            ...validateMsgsLength(info, console, fs, args, [
                [
                    details.join('\n'),
                    {
                        bold: false,
                        italic: false,
                        maxWidth: null,
                    },
                ],
            ]),
        ];
        return msgs;
    }
    errorStringify.details = details;
    /**
     * Formats a var dump of the error itself.
     *
     * @since 0.3.0-alpha.6
     */
    function dump(error, info, level, console, fs, args) {
        const dumps = [
            [
                VariableInspector.stringify({ error }),
                { bold: false, italic: false, maxWidth: null },
            ],
        ];
        if (console.params.verbose) {
            dumps.push(
                [
                    VariableInspector.stringify({ info }),
                    { bold: false, italic: false, maxWidth: null },
                ],
                [
                    VariableInspector.stringify({
                        'error.toString()': error.toString(),
                    }),
                    { bold: false, italic: false, maxWidth: null },
                ],
            );
        }
        const msgs = [
            ...errorStringify.heading('Dump'),
            ...errorStringify.validateMsgsLength(
                info,
                console,
                fs,
                args,
                dumps,
            ),
        ];
        return msgs;
    }
    errorStringify.dump = dump;
})(errorStringify || (errorStringify = {}));
//# sourceMappingURL=errorStringify.js.map
