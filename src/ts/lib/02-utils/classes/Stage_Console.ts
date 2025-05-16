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

import type {
    Objects,
} from '@maddimathon/utility-typescript/types';

import {
    mergeArgs,
} from '@maddimathon/utility-typescript/functions';

import {
    node,
    VariableInspector,
} from '@maddimathon/utility-typescript/classes';

import type {
    CLI,
    Config,
    Stage,
} from '../../../types/index.js';

import {
    ProjectConfig
} from '../../01-config/index.js';


/**
 * To be used by {@link AbstractStage} and those that inherit from it.
 *
 * Includes a variety of utilities for printing messages to the console.
 * 
 * @category Utilities
 * 
 * @since ___PKG_VERSION___
 * 
 * @internal
 */
export class Stage_Console implements Stage.Console {



    /* LOCAL PROPERTIES
     * ====================================================================== */

    /** {@inheritDoc Stage.Console.nc} */
    public readonly nc: node.NodeConsole;

    /**
     * Instance to use within the class.
     */
    public readonly varDump: _Stage_Console_VarInspect;



    /* CONSTRUCTOR
     * ====================================================================== */

    /**
     * @param name    Name for this stage used for notices.
     * @param clr     {@inheritDoc Stage.Class.clr}
     * @param config  Current project config.
     * @param params  Current CLI params.
     * @param utils   Optional. Partial argument overrides for classes used 
     *                within this one.
     */
    constructor (
        public readonly name: string,
        public readonly clr: Config[ 'clr' ],
        public readonly config: ProjectConfig,
        public readonly params: CLI.Params,
        utils?: {
            nc?: Objects.RecursivePartial<node.NodeConsole.Args>,
        },
    ) {

        const ncInputArgs = mergeArgs(
            this.config.console.nc ?? {},
            utils?.nc ?? {},
            true
        );

        this.nc = new node.NodeConsole( {
            ...ncInputArgs,

            msgMaker: {
                ...ncInputArgs.msgMaker ?? {},

                msg: {
                    clr: this.clr,
                    ...ncInputArgs.msgMaker?.msg ?? {},
                },
            },
        } );

        this.varDump = new _Stage_Console_VarInspect(
            this.name,
            this.config,
            this.params,
            this.msgArgs,
            {
                nc: this.nc,
            },
        );
    }



    /* LOCAL METHODS
     * ====================================================================== */

    /**
     * Creates an argument object used to print messages to the terminal, adding
     * styling defaults by depth level.
     * 
     * @category Messagers
     * 
     * @see {@link AbstractStage.clr}  Default colour for the message.
     * 
     * @param level     Depth level for this message (above the value of 
     *                  {@link Stage.Args['log-base-level']}).
     * @param msgArgs   Optional. Argument overrides for the message.
     * @param timeArgs  Optional. Argument overrides for the message's timestamp.
     * 
     * @return  An object with arguments separated by message (`msg`) and time.
     */
    protected msgArgs(
        level: number = 0,
        msgArgs: Parameters<node.NodeConsole[ 'timestampLog' ]>[ 1 ] = {},
        timeArgs: Parameters<node.NodeConsole[ 'timestampLog' ]>[ 2 ] = {},
    ): {
        msg: Parameters<node.NodeConsole[ 'timestampLog' ]>[ 1 ];
        time: Parameters<node.NodeConsole[ 'timestampLog' ]>[ 2 ];
    } {
        const depth = level + Number( this.params[ 'log-base-level' ] );

        const msg: typeof msgArgs = {

            bold: depth == 0 || level <= 1,
            clr: this.clr,

            depth,

            linesIn: 0,
            linesOut: 0,

            ...msgArgs,
        };

        const time: typeof timeArgs = {
            ...timeArgs,
        };

        if ( level <= 0 ) {
            msg.linesIn = msgArgs.linesIn ?? 2;
        }

        if ( level > 0 ) {
            msg.linesIn = msgArgs.linesIn ?? 1;
        }

        // if ( level > 1 ) {
        // }

        if ( level > 2 ) {
            msg.italic = msgArgs.italic ?? true;
            msg.linesIn = msgArgs.linesIn ?? 0;
        }

        if ( level > 3 ) {
            msg.clr = msgArgs.clr ?? 'grey';
        }

        return { msg, time };
    }

    /**
     * Prints a timestamped log message to the console.
     * 
     * @category Messagers
     * 
     * @see {@link AbstractStage['msgArgs']}  Generates default arguments.
     * 
     * @param msg       The message(s) to print to the console.
     * @param level     Depth level for this message (above the value of 
     *                  {@link Stage.Args['log-base-level']}).
     * @param msgArgs   Optional. Argument overrides for the message.
     * @param timeArgs  Optional. Argument overrides for the message's timestamp.
     */
    protected log(
        msg: Parameters<node.NodeConsole[ 'timestampLog' ]>[ 0 ],
        level: number,
        msgArgs?: Parameters<node.NodeConsole[ 'timestampLog' ]>[ 1 ],
        timeArgs?: Parameters<node.NodeConsole[ 'timestampLog' ]>[ 2 ],
    ): void {
        const args = this.msgArgs( level, msgArgs, timeArgs );
        this.nc.timestampLog( msg, args.msg, args.time );
    }

    /**
     * Prints a timestamped log message to the console. Only if 
     * `{@link Stage.Args}.notice` is truthy.
     * 
     * @category Messagers
     * 
     * @see {@link AbstractStage['msgArgs']}  Generates default arguments.
     * 
     * @param msg       The message(s) to print to the console.
     * @param level     Depth level for this message (above the value of 
     *                  {@link Stage.Args['log-base-level']}).
     * @param msgArgs   Optional. Argument overrides for the message.
     * @param timeArgs  Optional. Argument overrides for the message's timestamp.
     */
    public notice(
        msg: Parameters<node.NodeConsole[ 'timestampLog' ]>[ 0 ],
        level: Parameters<Stage_Console[ 'log' ]>[ 1 ],
        msgArgs?: Parameters<Stage_Console[ 'log' ]>[ 2 ],
        timeArgs?: Parameters<Stage_Console[ 'log' ]>[ 3 ],
    ): void {
        if ( this.params.notice === false ) { return; }
        this.log( msg, level, msgArgs, timeArgs );
    }

    /**
     * Prints a timestamped log message to the console. Only if 
     * `{@link Stage.Args}.notice` is truthy.
     * 
     * @category Messagers
     * 
     * @see {@link AbstractStage['msgArgs']}  Generates default arguments.
     * 
     * @param msg       The message(s) to print to the console.
     * @param level     Depth level for this message (above the value of 
     *                  {@link Stage.Args['log-base-level']}).
     * @param msgArgs   Optional. Argument overrides for the message.
     * @param timeArgs  Optional. Argument overrides for the message's timestamp.
     */
    public progress(
        msg: Parameters<node.NodeConsole[ 'timestampLog' ]>[ 0 ],
        level: Parameters<Stage_Console[ 'log' ]>[ 1 ],
        msgArgs?: Parameters<Stage_Console[ 'log' ]>[ 2 ],
        timeArgs?: Parameters<Stage_Console[ 'log' ]>[ 3 ],
    ): void {
        if ( this.params.progress === false ) { return; }
        this.log( msg, level, msgArgs, timeArgs );
    }

    /**
     * Method for printing a log message to the console. Only if 
     * `{@link Stage.Args}.verbose` is truthy.
     * 
     * Alias for {@link AbstractStage.progressLog}.
     * 
     * @category Messagers
     * 
     * @param msg       The message(s) to print to the console.
     * @param level     Depth level for this message (above the value of 
     *                  {@link Stage.Args['log-base-level']}).
     * @param msgArgs   Optional. Argument overrides for the message.
     * @param timeArgs  Optional. Argument overrides for the message's timestamp.
     */
    public verbose(
        msg: Parameters<Stage_Console[ 'progress' ]>[ 0 ],
        level: Parameters<Stage_Console[ 'log' ]>[ 1 ],
        msgArgs?: Parameters<Stage_Console[ 'log' ]>[ 2 ],
        timeArgs?: Parameters<Stage_Console[ 'log' ]>[ 3 ],
    ): void {
        if ( !this.params.verbose ) { return; }
        this.log( msg, level, msgArgs, timeArgs );
    }
}

// /**
//  * Used only for {@link Stage_Console}.
//  * 
//  * @category Utilities
//  * 
//  * @since ___PKG_VERSION___
//  */
// export namespace Stage_Console {
// }


/**
 * To be used by {@link Stage_Console}.
 *
 * Includes a variety of utilities for printing messages to the console.
 * 
 * @category Utilities
 * 
 * @since ___PKG_VERSION___
 * 
 * @private
 * @internal
 */
export class _Stage_Console_VarInspect implements Stage.Console.VarInspect {



    /* LOCAL PROPERTIES
     * ====================================================================== */

    /**
     * Instance to use within the class.
     */
    protected readonly nc: node.NodeConsole;


    /* Args ===================================== */

    /**
     * Default values for the args property.
     * 
     * @category Args
     */
    public get ARGS_DEFAULT(): Stage.Console.Args {

        return {
            clr: 'black',
            nc: {},
        };
    }



    /* CONSTRUCTOR
     * ====================================================================== */

    /**
     * @param name    Name for this stage used for notices.
     * @param config  Current project config.
     * @param params  Current CLI params.
     * @param msgArgs
     * @param utils   Optional. Partial argument overrides for classes used 
     *                within this one.
     */
    constructor (
        public readonly name: string,
        public readonly config: ProjectConfig,
        public readonly params: CLI.Params,
        public readonly msgArgs: Stage_Console[ 'msgArgs' ],
        utils: {
            nc: node.NodeConsole,
        },
    ) {
        this.nc = utils.nc;
    }



    /* LOCAL METHODS
     * ====================================================================== */

    /**
     * Gets a simple, unformatted inspection string.
     */
    public varString(
        variable: ConstructorParameters<typeof VariableInspector>[ 0 ],
        args?: ConstructorParameters<typeof VariableInspector>[ 1 ],
    ): string {
        return VariableInspector.stringify( variable, args ).replace( /\n\s*\n/gi, '\n' );
    }

    /**
     * Prints a timestamped log message to the console.
     * 
     * @category Messagers
     * 
     * @see {@link AbstractStage['msgArgs']}  Generates default arguments.
     * 
     * @param variable  Variable to inspect.
     * @param level     Depth level for this message (above the value of 
     *                  {@link Stage.Args['log-base-level']}).
     * @param msgArgs   Optional. Argument overrides for the message.
     * @param timeArgs  Optional. Argument overrides for the message's timestamp.
     */
    protected log(
        variable: ConstructorParameters<typeof VariableInspector>[ 0 ],
        level: Parameters<Stage_Console[ 'notice' ]>[ 1 ],
        msgArgs?: Parameters<Stage_Console[ 'notice' ]>[ 2 ],
        timeArgs?: Parameters<Stage_Console[ 'notice' ]>[ 3 ],
    ): void {
        const args = this.msgArgs( level, msgArgs, timeArgs );
        this.nc.timestampLog( this.varString( variable ), args.msg, args.time );
    }

    /**
     * Prints a timestamped log message to the console. Only if 
     * `{@link Stage.Args}.notice` is truthy.
     * 
     * @category Messagers
     * 
     * @see {@link AbstractStage['msgArgs']}  Generates default arguments.
     * 
     * @param variable  Variable to inspect.
     * @param level     Depth level for this message (above the value of 
     *                  {@link Stage.Args['log-base-level']}).
     * @param msgArgs   Optional. Argument overrides for the message.
     * @param timeArgs  Optional. Argument overrides for the message's timestamp.
     */
    public notice(
        variable: ConstructorParameters<typeof VariableInspector>[ 0 ],
        level: Parameters<_Stage_Console_VarInspect[ 'log' ]>[ 1 ],
        msgArgs?: Parameters<_Stage_Console_VarInspect[ 'log' ]>[ 2 ],
        timeArgs?: Parameters<_Stage_Console_VarInspect[ 'log' ]>[ 3 ],
    ): void {
        if ( this.params.notice === false ) { return; }
        this.log( variable, level, msgArgs, timeArgs );
    }

    /**
     * Prints a timestamped log message to the console. Only if 
     * `{@link Stage.Args}.notice` is truthy.
     * 
     * @category Messagers
     * 
     * @see {@link AbstractStage['msgArgs']}  Generates default arguments.
     * 
     * @param variable  Variable to inspect.
     * @param level     Depth level for this message (above the value of 
     *                  {@link Stage.Args['log-base-level']}).
     * @param msgArgs   Optional. Argument overrides for the message.
     * @param timeArgs  Optional. Argument overrides for the message's timestamp.
     */
    public progress(
        variable: ConstructorParameters<typeof VariableInspector>[ 0 ],
        level: Parameters<_Stage_Console_VarInspect[ 'log' ]>[ 1 ],
        msgArgs?: Parameters<_Stage_Console_VarInspect[ 'log' ]>[ 2 ],
        timeArgs?: Parameters<_Stage_Console_VarInspect[ 'log' ]>[ 3 ],
    ): void {
        if ( this.params.progress === false ) { return; }
        this.log( variable, level, msgArgs, timeArgs );
    }

    /**
     * Method for printing a log message to the console. Only if 
     * `{@link Stage.Args}.verbose` is truthy.
     * 
     * Alias for {@link AbstractStage.progressLog}.
     * 
     * @category Messagers
     * 
     * @param variable  Variable to inspect.
     * @param level     Depth level for this message (above the value of 
     *                  {@link Stage.Args['log-base-level']}).
     * @param msgArgs   Optional. Argument overrides for the message.
     * @param timeArgs  Optional. Argument overrides for the message's timestamp.
     */
    public verbose(
        variable: ConstructorParameters<typeof VariableInspector>[ 0 ],
        level: Parameters<_Stage_Console_VarInspect[ 'log' ]>[ 1 ],
        msgArgs?: Parameters<_Stage_Console_VarInspect[ 'log' ]>[ 2 ],
        timeArgs?: Parameters<_Stage_Console_VarInspect[ 'log' ]>[ 3 ],
    ): void {
        if ( !this.params.verbose ) { return; }
        this.log( variable, level, msgArgs, timeArgs );
    }
}