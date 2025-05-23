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
    type VariableInspector,

    MessageMaker,
    node,
} from '@maddimathon/utility-typescript/classes';

import type {
    Stage,
} from '../../../types/index.js';

class _DummyConsole_VarDump implements Stage.Console.VarInspect {

    public readonly nc: node.NodeConsole;

    public constructor ( nc?: node.NodeConsole ) {
        this.nc = nc ?? new node.NodeConsole();
    }

    public log(
        variable: ConstructorParameters<typeof VariableInspector>[ 0 ],
        level: number,
        msgArgs = {},
        timeArgs = {},
    ) {
        this.nc.timestampVarDump(
            variable,
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

    public verbose(
        variable: Parameters<_DummyConsole_VarDump[ 'log' ]>[ 0 ],
        level: Parameters<_DummyConsole_VarDump[ 'log' ]>[ 1 ],
        msgArgs?: Parameters<_DummyConsole_VarDump[ 'log' ]>[ 2 ],
        timeArgs?: Parameters<_DummyConsole_VarDump[ 'log' ]>[ 3 ],
    ) {
        this.log( variable, level, msgArgs, timeArgs );
    }
}

/**
 * A basic console class used as a back-up before {@link Stage_Console} is
 * defined.
 * 
 * @internal
 */
export class DummyConsole implements Stage.Console {

    public readonly nc: node.NodeConsole;

    public readonly varDump: Stage.Console.VarInspect = new _DummyConsole_VarDump();

    public constructor ( nc?: node.NodeConsole ) {
        this.nc = nc ?? new node.NodeConsole();
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
        msg: string,
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
        this.log( msg, level, msgArgs, timeArgs );
    }

    public progress(
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
        this.log( msg, level, msgArgs, timeArgs );
    }
}