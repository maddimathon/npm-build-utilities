/**
 * @since 0.1.0-alpha
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.1.2
 * @license MIT
 */
import { slugify, typeOf } from '@maddimathon/utility-typescript/functions';
import {
    MessageMaker,
    VariableInspector,
} from '@maddimathon/utility-typescript/classes';
import { AbstractError, UnknownCaughtError } from './classes/index.js';
import { writeLog } from './writeLog.js';
const _msgMaker = new MessageMaker();
/**
 * Returns a string representation of the error for logging a child object of an
 * error.
 *
 * @internal
 * @hidden
 */
function _errorStringifyInternal(error, level, console, fs, args) {
    args = {
        ...args,
        bold: false,
        linesIn: 0,
        linesOut: 0,
    };
    if (typeof error !== 'object') {
        return [[String(error), args]];
    }
    const bulkMsgs = [];
    let i = 0;
    for (const [_msg, _args] of errorStringify(
        error,
        1 + level,
        console,
        fs,
        args,
    )) {
        bulkMsgs.push([
            _msg,
            {
                depth: i > 0 ? 1 : 0,
                ..._args,
            },
        ]);
        i++;
    }
    return bulkMsgs;
}
/**
 * Returns a string(s) representation of an error for logging.
 *
 * @category Errors
 *
 * @param error    Error to convery.
 * @param level    Depth level for output to the console.
 * @param console  Instance used to log messages and debugging info.
 * @param fs       Instance used to work with paths and files.
 * @param args     Overrides for default options.
 *
 * @since 0.1.0-alpha
 *
 * @internal
 */
export function errorStringify(error, level, console, fs, args) {
    /**
     * Sectioned information for the error message.
     */
    let t_errorInfo;
    const errorType = typeOf(error);
    const _defaultErrorInfo = (err, info) => {
        const default_info = {
            name: err.name ?? 'Error',
            message: err.message ?? '',
            output: err.output ?? '',
            cause: err.cause,
            stack: err.stack,
            details: {},
        };
        if (err instanceof UnknownCaughtError) {
            default_info.details = {
                cause: err.cause,
            };
            const causeString = err.cause
                ? _msgMaker.msgs(
                      _errorStringifyInternal(
                          err.cause,
                          1 + level,
                          console,
                          fs,
                          args,
                      ),
                  )
                : '';
            if (causeString.length) {
                default_info.cause = undefined;
                default_info.output = causeString;
            }
        } else if (err instanceof AbstractError && !default_info.output) {
            default_info.output = console.nc.msg.msgs(err.getOutput(), {
                ...args,
                bold: false,
                italic: false,
            });
        }
        return {
            ...default_info,
            ...info,
        };
    };
    switch (typeof error) {
        case 'object':
            // breaks
            if (error instanceof AbstractError) {
                t_errorInfo = _defaultErrorInfo(error);
                break;
            }
            // breaks
            if (error instanceof Error) {
                const output = [
                    error.output || error.stderr || error.stdout || [],
                ]
                    .flat()
                    .filter((v) => v !== null)
                    .join('\n\n');
                t_errorInfo = _defaultErrorInfo(error, {
                    message: error.message,
                    output: output,
                    details: {
                        code: error.code,
                        signal: error.signal,
                        status: error.status,
                        path:
                            typeof error.path === 'string'
                                ? fs
                                      .pathRelative(error.path)
                                      .replace(' ', '%20')
                                : error.path,
                        pid: error.pid,
                    },
                });
                break;
            }
            // breaks
            if (error === null || Array.isArray(error)) {
                error = new UnknownCaughtError(
                    `<${errorType}> \n${String(error)}`,
                    error,
                );
                t_errorInfo = _defaultErrorInfo(error);
                break;
            }
            let _objConstructorName = error.constructor?.name ?? 'object';
            if (_objConstructorName === 'Object') {
                _objConstructorName = _objConstructorName.toLowerCase();
            }
            t_errorInfo = _defaultErrorInfo(error, {
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
            // console.vi.log( { 'UnknownCaughtError.prototype.name.length': ( new UnknownCaughtError( '' ) ).name.length }, level );
            // console.vi.log( { _errorStringLength }, level );
            let _errorString = String(error);
            if (_errorString.length > _errorStringLength) {
                _errorString =
                    _errorString.substring(0, _errorStringLength - 3) + '...';
            }
            error = new UnknownCaughtError(`<${errorType}> ${_errorString}`, {
                cause: error,
            });
            t_errorInfo = _defaultErrorInfo(error);
            break;
        default:
            error = new UnknownCaughtError(
                `Unknown error type: <${errorType}> \n${String(error)}`,
                { cause: error },
            );
            t_errorInfo = _defaultErrorInfo(error);
            break;
    }
    const errorInfo = {
        ...t_errorInfo,
        message: t_errorInfo.message?.trim(),
        output: t_errorInfo.output.trim(),
    };
    const _msgHeading = (heading) => [
        [''],
        [`-- ${heading} --`, { bold: true, italic: true }],
    ];
    const bulkMsgs = [[`[${errorInfo.name}] ${errorInfo.message ?? ''}`]];
    if (errorInfo.output) {
        let _abridgedOutput = false;
        // checks if it is too long for the console
        if (errorInfo.output.split('\n').length > 100) {
            const _logResult = writeLog(errorInfo.output, slugify(error.name), {
                config: console.config,
                fs,
            });
            if (_logResult) {
                _abridgedOutput = true;
                errorInfo.output =
                    'Long output message written to '
                    + fs.pathRelative(_logResult).replace(' ', '%20');
            }
        }
        if (_abridgedOutput) {
            bulkMsgs.push([
                errorInfo.output,
                { bold: false, italic: true, maxWidth: null },
            ]);
        } else if (error instanceof AbstractError) {
            bulkMsgs.push([errorInfo.output, { bold: false, maxWidth: null }]);
        } else {
            bulkMsgs.push([
                errorInfo.output,
                { bold: false, clr: 'black', maxWidth: null },
            ]);
        }
    }
    if (errorInfo.cause) {
        if (errorInfo.output || !(error instanceof UnknownCaughtError)) {
            for (const arr of _msgHeading('Cause')) {
                bulkMsgs.push(arr);
            }
        }
        for (const arr of _errorStringifyInternal(
            errorInfo.cause,
            1 + level,
            console,
            fs,
            args,
        )) {
            bulkMsgs.push(arr);
        }
    }
    if (errorInfo.stack) {
        for (const arr of _msgHeading('Stack')) {
            bulkMsgs.push(arr);
        }
        const _stackPathRegex =
            /(^\s*at\s+[^\n]*?\s+)\((?:file\:\/\/)?([^\(\)]+)\)(?=(?:\s*$))/;
        const _trimmedStack = errorInfo.stack.split('\n').map((path) => {
            const _matches = path.match(_stackPathRegex);
            if (_matches && _matches[2]) {
                path =
                    path.replace(_stackPathRegex, '$1')
                    + `(${fs.pathRelative(decodeURI(_matches[2])).replace(' ', '%20')})`;
            }
            return path;
        });
        bulkMsgs.push([
            _trimmedStack,
            { bold: false, italic: true, maxWidth: null },
        ]);
    }
    const details = [];
    if (typeof errorInfo.details == 'string') {
        details.push(errorInfo.details);
    } else {
        for (const key in errorInfo.details) {
            const _inspectArgs = {
                childArgs: {},
            };
            if (
                typeof errorInfo.details[key] === 'object'
                && errorInfo.details[key] !== null
                && !Array.isArray(errorInfo.details[key])
                && errorInfo.details[key].constructor.name.toLowerCase()
                    !== 'object'
            ) {
                _inspectArgs.childArgs.includeValue = false;
            }
            details.push(
                VariableInspector.stringify(
                    { [key]: errorInfo.details[key] },
                    _inspectArgs,
                ),
            );
        }
    }
    if (details.length) {
        for (const arr of _msgHeading('Details')) {
            bulkMsgs.push(arr);
        }
        bulkMsgs.push([
            details.join('\n'),
            { bold: false, italic: false, maxWidth: null },
        ]);
    }
    if (!(error instanceof Error)) {
        for (const arr of _msgHeading('Dump')) {
            bulkMsgs.push(arr);
        }
        const _inspectArgs = {
            childArgs: {},
        };
        if (
            typeof error === 'object'
            && !Array.isArray(error)
            && error.constructor.name.toLowerCase() !== 'object'
        ) {
            _inspectArgs.childArgs.includeValue = false;
        }
        bulkMsgs.push([
            VariableInspector.stringify({ error }, _inspectArgs),
            { bold: false, italic: false, maxWidth: null },
        ]);
        if (!_inspectArgs.childArgs.includeValue) {
            bulkMsgs.push([
                'child value inspection was skipped to avoid a super-long output message — to inspect the value, catch the error and log it before handling with the default handler',
                {
                    bold: false,
                    clr: 'grey',
                    depth: 1,
                    italic: true,
                },
            ]);
        }
    }
    return bulkMsgs;
}
//# sourceMappingURL=errorStringify.js.map
