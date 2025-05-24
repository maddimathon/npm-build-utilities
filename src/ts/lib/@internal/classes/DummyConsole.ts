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
    MessageMaker,
    node,
    VariableInspector,
} from '@maddimathon/utility-typescript/classes';

import type {
    CLI,
    Logger,
} from '../../../types/index.js';


/**
 * A basic console class used as a back-up before {@link Stage_Console} is
 * defined.
 * 
 * @internal
 */
export class DummyConsole implements Logger {

    public readonly vi: Logger.VarInspect = new _DummyConsole_VarDump();

    public constructor (
        public readonly nc: node.NodeConsole = new node.NodeConsole(),
        protected readonly params: Partial<CLI.Params> = {},
    ) {
    }

    public debug(
        msg: Parameters<DummyConsole[ 'log' ]>[ 0 ],
        level: Parameters<DummyConsole[ 'log' ]>[ 1 ],
        msgArgs?: Parameters<DummyConsole[ 'log' ]>[ 2 ],
        timeArgs?: Parameters<DummyConsole[ 'log' ]>[ 3 ],
    ) {
        if ( !this.params.debug && typeof this.params.debug !== 'undefined' ) { return; }
        this.log( msg, level, msgArgs, timeArgs );
    }

    public error(
        msg: string | string[] | MessageMaker.BulkMsgs,
        level: number,
        msgArgs: Parameters<node.NodeConsole[ 'timestampLog' ]>[ 1 ] = {},
        timeArgs: Parameters<node.NodeConsole[ 'timestampLog' ]>[ 2 ] = {},
    ) {
        this.nc.timestampLog(
            msg,
            {
                ...msgArgs,
                depth: level,
            },
            timeArgs
        );
    }

    public log(
        msg: string | string[] | MessageMaker.BulkMsgs,
        level: number,
        msgArgs: Parameters<node.NodeConsole[ 'timestampLog' ]>[ 1 ] = {},
        timeArgs: Parameters<node.NodeConsole[ 'timestampLog' ]>[ 2 ] = {},
    ) {
        this.nc.timestampLog(
            msg,
            {
                ...msgArgs,
                depth: level,
            },
            timeArgs
        );
    }

    public notice(
        msg: Parameters<DummyConsole[ 'log' ]>[ 0 ],
        level: Parameters<DummyConsole[ 'log' ]>[ 1 ],
        msgArgs?: Parameters<DummyConsole[ 'log' ]>[ 2 ],
        timeArgs?: Parameters<DummyConsole[ 'log' ]>[ 3 ],
    ) {
        if ( !this.params.notice && typeof this.params.notice !== 'undefined' ) { return; }
        this.log( msg, level, msgArgs, timeArgs );
    }

    public progress(
        msg: Parameters<DummyConsole[ 'log' ]>[ 0 ],
        level: Parameters<DummyConsole[ 'log' ]>[ 1 ],
        msgArgs?: Parameters<DummyConsole[ 'log' ]>[ 2 ],
        timeArgs?: Parameters<DummyConsole[ 'log' ]>[ 3 ],
    ) {
        if ( !this.params.progress && typeof this.params.progress !== 'undefined' ) { return; }
        this.log( msg, level, msgArgs, timeArgs );
    }

    /** 
     * Doesn't currently actually warn.
     * 
     * @todo
     */
    public warn(
        msg: Parameters<DummyConsole[ 'log' ]>[ 0 ],
        level: Parameters<DummyConsole[ 'log' ]>[ 1 ],
        msgArgs?: Parameters<DummyConsole[ 'log' ]>[ 2 ],
        timeArgs?: Parameters<DummyConsole[ 'log' ]>[ 3 ],
    ) {
        this.log( msg, level, msgArgs, timeArgs );
    }

    public verbose(
        msg: Parameters<DummyConsole[ 'log' ]>[ 0 ],
        level: Parameters<DummyConsole[ 'log' ]>[ 1 ],
        msgArgs?: Parameters<DummyConsole[ 'log' ]>[ 2 ],
        timeArgs?: Parameters<DummyConsole[ 'log' ]>[ 3 ],
    ) {
        if ( !this.params.verbose && typeof this.params.verbose !== 'undefined' ) { return; }
        this.log( msg, level, msgArgs, timeArgs );
    }
}

class _DummyConsole_VarDump implements Logger.VarInspect {

    // public readonly nc: node.NodeConsole;

    public constructor (
        public readonly nc: node.NodeConsole = new node.NodeConsole(),
        protected readonly params: Partial<CLI.Params> = {},
    ) {
    }

    public log(
        variable: ConstructorParameters<typeof VariableInspector>[ 0 ],
        level: number,
        msgArgs = {},
        timeArgs = {},
    ) {
        this.nc.timestampLog(
            this.stringify( variable ),
            {
                ...msgArgs,
                depth: level,
            },
            timeArgs
        );
    }

    public notice(
        variable: Parameters<_DummyConsole_VarDump[ 'log' ]>[ 0 ],
        level: Parameters<_DummyConsole_VarDump[ 'log' ]>[ 1 ],
        msgArgs?: Parameters<_DummyConsole_VarDump[ 'log' ]>[ 2 ],
        timeArgs?: Parameters<_DummyConsole_VarDump[ 'log' ]>[ 3 ],
    ) {
        this.log( variable, level, msgArgs, timeArgs );
    }

    public progress(
        variable: Parameters<_DummyConsole_VarDump[ 'log' ]>[ 0 ],
        level: Parameters<_DummyConsole_VarDump[ 'log' ]>[ 1 ],
        msgArgs?: Parameters<_DummyConsole_VarDump[ 'log' ]>[ 2 ],
        timeArgs?: Parameters<_DummyConsole_VarDump[ 'log' ]>[ 3 ],
    ) {
        this.log( variable, level, msgArgs, timeArgs );
    }

    public stringify(
        variable: ConstructorParameters<typeof VariableInspector>[ 0 ],
        args?: ConstructorParameters<typeof VariableInspector>[ 1 ],
    ): string {
        return VariableInspector.stringify( variable, args );
    }

    public verbose(
        variable: Parameters<_DummyConsole_VarDump[ 'log' ]>[ 0 ],
        level: Parameters<_DummyConsole_VarDump[ 'log' ]>[ 1 ],
        msgArgs?: Parameters<_DummyConsole_VarDump[ 'log' ]>[ 2 ],
        timeArgs?: Parameters<_DummyConsole_VarDump[ 'log' ]>[ 3 ],
    ) {
        this.log( variable, level, msgArgs, timeArgs );
    }
}