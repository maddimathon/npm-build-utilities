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

// import type {
// } from '@maddimathon/utility-typescript/types';

import {
    mergeArgs,
} from '@maddimathon/utility-typescript/functions';

import {
    MessageMaker,
    node,
    VariableInspector,
} from '@maddimathon/utility-typescript/classes';

import type {
    CLI,
    Logger,
} from '../../../types/index.js';

// import {
// } from '../../@internal/index.js';

// import {
// } from '../../00-universal/index.js';

import {
    ProjectConfig,
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
export class Stage_Console implements Logger {



    /* LOCAL PROPERTIES
     * ====================================================================== */

    /** {@inheritDoc Logger.nc} */
    public readonly nc: node.NodeConsole;

    /** {@inheritDoc Logger.vi} */
    public readonly vi: _Stage_Console_VarInspect;



    /* CONSTRUCTOR
     * ====================================================================== */

    /**
     * @param clr     Colour slug for this colour-coding this class.
     * @param config  Current project config.
     * @param params  Current CLI params.
     */
    //  * @param name    Name for this stage used for notices.
    //  * @param utils   Optional. Partial argument overrides for classes used 
    //  *                within this one.
    constructor (
        // public readonly name: string,
        public readonly clr: MessageMaker.Colour,
        public readonly config: ProjectConfig,
        public readonly params: CLI.Params,
    ) {
        this.nc = new node.NodeConsole( mergeArgs(
            this.config.console.nc ?? {},
            {
                msgMaker: {
                    msg: {
                        clr: this.clr,
                    },
                },
            },
            true
        ) );

        this.msgArgs = this.msgArgs.bind( this );

        this.vi = new _Stage_Console_VarInspect(
            // this.name,
            this.config,
            this.params,
            this.msgArgs,
            this.nc,
        );
    }



    /* LOCAL METHODS
     * ====================================================================== */

    /**
     * Creates an argument object used to print messages to the terminal, adding
     * styling defaults by depth level.
     * 
     * @see {@link Stage_Console.clr}  Default colour for the message.
     * 
     * @param level     Depth level for this message (above the value of 
     *                  {@link CLI.Params.log-base-level}).
     * @param msgArgs   Optional. Argument overrides for the message.
     * @param timeArgs  Optional. Argument overrides for the message's timestamp.
     * 
     * @return  An object with arguments separated by message (`msg`) and time.
     */
    protected msgArgs(
        level: number = 0,
        msgArgs: Partial<MessageMaker.MsgArgs> = {},
        timeArgs: Partial<MessageMaker.MsgArgs> = {},
    ): {
        msg: Partial<MessageMaker.MsgArgs>;
        time: Partial<MessageMaker.MsgArgs>;
    } {
        const depth = level + Number( this.params[ 'log-base-level' ] );

        const msg: Partial<MessageMaker.MsgArgs> = {

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

    // /**
    //  * Prints a timestamped log message to the console. Only if 
    //  * `{@link Stage.Args}.debug` is truthy.
    //  * 
    //  * @param msg       The message(s) to print to the console.
    //  * @param level     Depth level for this message (above the value of 
    //  *                  {@link CLI.Params.log-base-level}).
    //  * @param msgArgs   Optional. Argument overrides for the message.
    //  * @param timeArgs  Optional. Argument overrides for the message's timestamp.
    //  */
    /** {@inheritDoc Logger.debug} */
    public debug(
        msg: Parameters<node.NodeConsole[ 'timestampLog' ]>[ 0 ],
        level: Parameters<Stage_Console[ 'log' ]>[ 1 ],
        msgArgs?: Parameters<Stage_Console[ 'log' ]>[ 2 ],
        timeArgs?: Parameters<Stage_Console[ 'log' ]>[ 3 ],
    ): void {
        if ( !this.params.debug ) { return; }
        this.log( msg, level, msgArgs, timeArgs );
    }

    /** {@inheritDoc Logger.error} */
    public error(
        msg: MessageMaker.BulkMsgs,
        level: number,
        msgArgs: Partial<MessageMaker.MsgArgs> = {},
        timeArgs: Partial<MessageMaker.MsgArgs> = {},
    ) {
        this.log( msg, level, msgArgs, timeArgs );
    }

    // /**
    //  * Prints a timestamped log message to the console.
    //  * 
    //  * @see {@link AbstractStage['msgArgs']}  Generates default arguments.
    //  * 
    //  * @param msg       The message(s) to print to the console.
    //  * @param level     Depth level for this message (above the value of 
    //  *                  {@link CLI.Params.log-base-level}).
    //  * @param msgArgs   Optional. Argument overrides for the message.
    //  * @param timeArgs  Optional. Argument overrides for the message's timestamp.
    //  */
    /** {@inheritDoc Logger.log} */
    public log(
        msg: Parameters<node.NodeConsole[ 'timestampLog' ]>[ 0 ],
        level: number,
        msgArgs?: Partial<MessageMaker.MsgArgs>,
        timeArgs?: Partial<MessageMaker.MsgArgs>,
    ): void {
        const args = this.msgArgs( level, msgArgs, timeArgs );
        this.nc.timestampLog( msg, args.msg, args.time );
    }

    // /**
    //  * Prints a timestamped log message to the console. Only if 
    //  * `{@link Stage.Args}.notice` is truthy.
    //  * 
    //  * @param msg       The message(s) to print to the console.
    //  * @param level     Depth level for this message (above the value of 
    //  *                  {@link CLI.Params.log-base-level}).
    //  * @param msgArgs   Optional. Argument overrides for the message.
    //  * @param timeArgs  Optional. Argument overrides for the message's timestamp.
    //  */
    /** {@inheritDoc Logger.notice} */
    public notice(
        msg: Parameters<node.NodeConsole[ 'timestampLog' ]>[ 0 ],
        level: Parameters<Stage_Console[ 'log' ]>[ 1 ],
        msgArgs?: Parameters<Stage_Console[ 'log' ]>[ 2 ],
        timeArgs?: Parameters<Stage_Console[ 'log' ]>[ 3 ],
    ): void {
        if ( !this.params.notice ) { return; }
        this.log( msg, level, msgArgs, timeArgs );
    }

    // /**
    //  * Prints a timestamped log message to the console. Only if 
    //  * `{@link Stage.Args}.notice` is truthy.
    //  * 
    //  * @param msg       The message(s) to print to the console.
    //  * @param level     Depth level for this message (above the value of 
    //  *                  {@link CLI.Params.log-base-level}).
    //  * @param msgArgs   Optional. Argument overrides for the message.
    //  * @param timeArgs  Optional. Argument overrides for the message's timestamp.
    //  */
    /** {@inheritDoc Logger.progress} */
    public progress(
        msg: Parameters<node.NodeConsole[ 'timestampLog' ]>[ 0 ],
        level: Parameters<Stage_Console[ 'log' ]>[ 1 ],
        msgArgs?: Parameters<Stage_Console[ 'log' ]>[ 2 ],
        timeArgs?: Parameters<Stage_Console[ 'log' ]>[ 3 ],
    ): void {
        if ( !this.params.progress ) { return; }
        this.log( msg, level, msgArgs, timeArgs );
    }


    // /**
    //  * Prints a timestamped log message to the console. Only if 
    //  * `{@link Stage.Args}.notice` is truthy.
    //  * 
    //  * **Doesn't currently actually warn.**
    //  * @todo
    //  * 
    //  * @param msg       The message(s) to print to the console.
    //  * @param level     Depth level for this message (above the value of 
    //  *                  {@link CLI.Params.log-base-level}).
    //  * @param msgArgs   Optional. Argument overrides for the message.
    //  * @param timeArgs  Optional. Argument overrides for the message's timestamp.
    //  */
    /** 
     * {@inheritDoc Logger.debug}
     * 
     * @todo
     * **Doesn't currently actually warn.**
     */
    public warn(
        msg: Parameters<node.NodeConsole[ 'timestampLog' ]>[ 0 ],
        level: Parameters<Stage_Console[ 'log' ]>[ 1 ],
        msgArgs?: Parameters<Stage_Console[ 'log' ]>[ 2 ],
        timeArgs?: Parameters<Stage_Console[ 'log' ]>[ 3 ],
    ): void {
        this.log( msg, level, msgArgs, timeArgs );
    }

    // /**
    //  * Method for printing a log message to the console. Only if 
    //  * `{@link Stage.Args}.verbose` is truthy.
    //  * 
    //  * @param msg       The message(s) to print to the console.
    //  * @param level     Depth level for this message (above the value of 
    //  *                  {@link CLI.Params.log-base-level}).
    //  * @param msgArgs   Optional. Argument overrides for the message.
    //  * @param timeArgs  Optional. Argument overrides for the message's timestamp.
    //  */
    /** {@inheritDoc Logger.verbose} */
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


/**
 * To be used by {@link Stage_Console}.
 *
 * Includes a variety of utilities for printing variable inspections to the console.
 * 
 * @category Utilities
 * 
 * @since ___PKG_VERSION___
 * 
 * @internal
 * @private
 */
export class _Stage_Console_VarInspect implements Logger.VarInspect {



    /* CONSTRUCTOR
     * ====================================================================== */

    /**
     * @param config   Current project config.
     * @param params   Current CLI params.
     * @param msgArgs  Function to construct a {@link MessageMaker.MsgArgs} object.
     * @param nc       Instance to use within the class.
     */
    //  * @param name     Name for this stage used for notices.
    constructor (
        // public readonly name: string,
        public readonly config: ProjectConfig,
        public readonly params: CLI.Params,
        public readonly msgArgs: Stage_Console[ 'msgArgs' ],
        protected readonly nc: node.NodeConsole,
    ) {
    }



    /* LOCAL METHODS
     * ====================================================================== */

    // /**
    //  * Prints a timestamped log message to the console.
    //  * 
    //  * @param variable  Variable to inspect.
    //  * @param level     Depth level for this message (above the value of 
    //  *                  {@link CLI.Params.log-base-level}).
    //  * @param msgArgs   Optional. Argument overrides for the message.
    //  * @param timeArgs  Optional. Argument overrides for the message's timestamp.
    //  */
    /** {@inheritDoc Logger.VarInspect.log} */
    public log(
        variable: ConstructorParameters<typeof VariableInspector>[ 0 ],
        level: Parameters<Stage_Console[ 'notice' ]>[ 1 ],
        msgArgs?: Parameters<Stage_Console[ 'notice' ]>[ 2 ],
        timeArgs?: Parameters<Stage_Console[ 'notice' ]>[ 3 ],
    ): void {
        const args = this.msgArgs( level, msgArgs, timeArgs );
        this.nc.timestampLog( this.stringify( variable ), args.msg, args.time );
    }

    // /**
    //  * Prints a timestamped log message to the console. Only if 
    //  * `{@link Stage.Args}.notice` is truthy.
    //  * 
    //  * @param variable  Variable to inspect.
    //  * @param level     Depth level for this message (above the value of 
    //  *                  {@link CLI.Params.log-base-level}).
    //  * @param msgArgs   Optional. Argument overrides for the message.
    //  * @param timeArgs  Optional. Argument overrides for the message's timestamp.
    //  */
    /** {@inheritDoc Logger.VarInspect.notice} */
    public notice(
        variable: ConstructorParameters<typeof VariableInspector>[ 0 ],
        level: Parameters<_Stage_Console_VarInspect[ 'log' ]>[ 1 ],
        msgArgs?: Parameters<_Stage_Console_VarInspect[ 'log' ]>[ 2 ],
        timeArgs?: Parameters<_Stage_Console_VarInspect[ 'log' ]>[ 3 ],
    ): void {
        if ( this.params.notice === false ) { return; }
        this.log( variable, level, msgArgs, timeArgs );
    }

    // /**
    //  * Prints a timestamped log message to the console. Only if 
    //  * `{@link Stage.Args}.notice` is truthy.
    //  * 
    //  * @see {@link AbstractStage['msgArgs']}  Generates default arguments.
    //  * 
    //  * @param variable  Variable to inspect.
    //  * @param level     Depth level for this message (above the value of 
    //  *                  {@link CLI.Params.log-base-level}).
    //  * @param msgArgs   Optional. Argument overrides for the message.
    //  * @param timeArgs  Optional. Argument overrides for the message's timestamp.
    //  */
    /** {@inheritDoc Logger.VarInspect.progress} */
    public progress(
        variable: ConstructorParameters<typeof VariableInspector>[ 0 ],
        level: Parameters<_Stage_Console_VarInspect[ 'log' ]>[ 1 ],
        msgArgs?: Parameters<_Stage_Console_VarInspect[ 'log' ]>[ 2 ],
        timeArgs?: Parameters<_Stage_Console_VarInspect[ 'log' ]>[ 3 ],
    ): void {
        if ( this.params.progress === false ) { return; }
        this.log( variable, level, msgArgs, timeArgs );
    }

    /** {@inheritDoc Logger.VarInspect.stringify} */
    public stringify(
        variable: ConstructorParameters<typeof VariableInspector>[ 0 ],
        args?: ConstructorParameters<typeof VariableInspector>[ 1 ],
    ): string {
        return VariableInspector.stringify( variable, args ).replace( /\n\s*\n/gi, '\n' );
    }

    // /**
    //  * Method for printing a log message to the console. Only if 
    //  * `{@link Stage.Args}.verbose` is truthy.
    //  * 
    //  * Alias for {@link AbstractStage.progressLog}.
    //  * 
    //  * @param variable  Variable to inspect.
    //  * @param level     Depth level for this message (above the value of 
    //  *                  {@link CLI.Params.log-base-level}).
    //  * @param msgArgs   Optional. Argument overrides for the message.
    //  * @param timeArgs  Optional. Argument overrides for the message's timestamp.
    //  */
    /** {@inheritDoc Logger.VarInspect.verbose} */
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