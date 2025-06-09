/**
 * @since ___PKG_VERSION___
 * 
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@___CURRENT_VERSION___
 * @license MIT
 */

import {
    mergeArgs,
} from '@maddimathon/utility-typescript/functions';

import {
    node,

    MessageMaker,
    VariableInspector,
} from '@maddimathon/utility-typescript/classes';

import type {
    CLI,
} from '../../../types/index.js';

import type { Logger } from '../../../types/Logger.js';

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
 * @category Stages
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
    constructor (
        public readonly clr: MessageMaker.Colour,
        public readonly config: ProjectConfig,
        public readonly params: CLI.Params,
    ) {
        this.nc = new node.NodeConsole( mergeArgs(
            this.config.console?.nc ?? {},
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
     * @param level     Depth level for this message.
     * @param msgArgs   Argument overrides for the message.
     * @param timeArgs  Argument overrides for the message's timestamp.
     * 
     * @return  An object with arguments separated by message (`msg`) and time.
     */
    protected msgArgs(
        level: number = 0,
        msgArgs: Partial<MessageMaker.BulkMsgArgs> = {},
        timeArgs: Partial<MessageMaker.BulkMsgArgs> = {},
    ): {
        msg: Partial<MessageMaker.BulkMsgArgs>;
        time: Partial<MessageMaker.BulkMsgArgs>;
    } {
        const depth = level + Number( this.params[ 'log-base-level' ] );

        const msg: Partial<MessageMaker.BulkMsgArgs> = {

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
        msg: string | string[] | MessageMaker.BulkMsgs,
        level: number,
        msgArgs: Partial<MessageMaker.BulkMsgArgs> = {},
        timeArgs: Partial<MessageMaker.BulkMsgArgs> = {},
    ) {
        this.log( msg, level, msgArgs, timeArgs );
    }

    /** {@inheritDoc Logger.log} */
    public log(
        msg: Parameters<node.NodeConsole[ 'timestampLog' ]>[ 0 ],
        level: number,
        msgArgs?: Partial<MessageMaker.BulkMsgArgs>,
        timeArgs?: Partial<MessageMaker.BulkMsgArgs>,
    ): void {
        const args = this.msgArgs( level, msgArgs, timeArgs );
        this.nc.timestampLog( msg, args.msg, args.time );
    }

    /** {@inheritDoc Logger.progress} */
    public progress(
        msg: Parameters<Stage_Console[ 'log' ]>[ 0 ],
        level: Parameters<Stage_Console[ 'log' ]>[ 1 ],
        msgArgs?: Parameters<Stage_Console[ 'log' ]>[ 2 ],
        timeArgs?: Parameters<Stage_Console[ 'log' ]>[ 3 ],
    ): void {
        if ( !this.params.progress ) { return; }
        this.log( msg, level, msgArgs, timeArgs );
    }

    /**
     * Prints a message to the console signalling the start or end of this build
     * stage.  Uses {@link Stage_Consolelog}.
     *
     * @param msg    Text to display as start/end message.
     * @param which  Whether we are starting or ending.
     * @param args   Message argument overrides.
     */
    public startOrEnd(
        msg: string | string[] | MessageMaker.BulkMsgs,
        which: "start" | "end" | null,
        args: Partial<MessageMaker.BulkMsgArgs> = {},
    ): void {

        const depth = this.params[ 'log-base-level' ];

        let linesIn = args.linesIn ?? 2;
        let linesOut = args.linesOut ?? 1;

        const itemArgs: Partial<MessageMaker.MsgArgs> = {
            ...args,
            linesIn: 0,
            linesOut: 0,
        };

        const bulkMsgs: MessageMaker.BulkMsgs = typeof msg === 'string'
            ? [ [ msg ] ]
            : msg.map( ( item ) => {

                // returns
                if ( typeof item === 'string' ) {
                    return [ item, itemArgs ];
                }

                item[ 1 ] = {
                    ...( item[ 1 ] ?? {} ),
                    ...itemArgs,
                };

                return item;
            } );

        switch ( which ) {

            case 'start':
                linesOut = 0;

                if ( depth < 1 ) {
                    linesIn += 1;
                }
                break;

            case 'end':
                if ( depth < 1 ) {
                    linesOut += 1;
                }
                break;
        }

        this.log(
            bulkMsgs,
            0,
            {
                bold: true,
                italic: false,

                flag: true,

                joiner: '',

                linesIn,
                linesOut,

                ...args,
            },
        );
    }

    /** 
     * {@inheritDoc Logger.debug}
     * 
     * @TODO
     * **Doesn't currently actually warn.**
     */
    public warn(
        msg: Parameters<Stage_Console[ 'log' ]>[ 0 ],
        level: Parameters<Stage_Console[ 'log' ]>[ 1 ],
        msgArgs?: Parameters<Stage_Console[ 'log' ]>[ 2 ],
        timeArgs?: Parameters<Stage_Console[ 'log' ]>[ 3 ],
    ): void {
        this.log( msg, level, msgArgs, timeArgs );
    }

    /** {@inheritDoc Logger.verbose} */
    public verbose(
        msg: Parameters<Stage_Console[ 'log' ]>[ 0 ],
        level: Parameters<Stage_Console[ 'log' ]>[ 1 ],
        msgArgs?: Parameters<Stage_Console[ 'log' ]>[ 2 ],
        timeArgs?: Parameters<Stage_Console[ 'log' ]>[ 3 ],
    ): void {
        if ( !this.params.verbose ) { return; }
        this.log( msg, level, {
            bold: false,
            ...msgArgs,
        }, timeArgs );
    }
}


/**
 * To be used by {@link Stage_Console}.
 *
 * Includes a variety of utilities for printing variable inspections to the console.
 * 
 * @category Stages
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
     * @param config    Current project config.
     * @param params    Current CLI params.
     * @param _msgArgs  Function to construct a {@link MessageMaker.BulkMsgArgs} object.
     * @param nc        Instance to use within the class.
     */
    constructor (
        public readonly config: ProjectConfig,
        public readonly params: CLI.Params,
        public readonly _msgArgs: Stage_Console[ 'msgArgs' ],
        protected readonly nc: node.NodeConsole,
    ) {
    }



    /* LOCAL METHODS
     * ====================================================================== */

    private msgArgs(
        level: number = 0,
        msgArgs: Partial<MessageMaker.BulkMsgArgs> = {},
        timeArgs: Partial<MessageMaker.BulkMsgArgs> = {},
    ): {
        msg: Partial<MessageMaker.BulkMsgArgs>;
        time: Partial<MessageMaker.BulkMsgArgs>;
    } {
        return this._msgArgs( level, {
            bold: false,
            flag: false,
            italic: false,
            ...msgArgs,
            maxWidth: null,
        }, timeArgs );
    }

    /** {@inheritDoc Logger.VarInspect.debug} */
    public debug(
        variable: ConstructorParameters<typeof VariableInspector>[ 0 ],
        level: Parameters<_Stage_Console_VarInspect[ 'log' ]>[ 1 ],
        msgArgs?: Parameters<_Stage_Console_VarInspect[ 'log' ]>[ 2 ],
        timeArgs?: Parameters<_Stage_Console_VarInspect[ 'log' ]>[ 3 ],
    ): void {
        if ( !this.params.debug ) { return; }
        this.log( variable, level, msgArgs, timeArgs );
    }

    /** {@inheritDoc Logger.VarInspect.log} */
    public log(
        variable: ConstructorParameters<typeof VariableInspector>[ 0 ],
        level: Parameters<Stage_Console[ 'log' ]>[ 1 ],
        msgArgs?: Parameters<Stage_Console[ 'log' ]>[ 2 ],
        timeArgs?: Parameters<Stage_Console[ 'log' ]>[ 3 ],
    ): void {
        const args = this.msgArgs( level, msgArgs, timeArgs );
        this.nc.timestampLog( this.stringify( variable ), args.msg, args.time );
    }

    /** {@inheritDoc Logger.VarInspect.progress} */
    public progress(
        variable: ConstructorParameters<typeof VariableInspector>[ 0 ],
        level: Parameters<_Stage_Console_VarInspect[ 'log' ]>[ 1 ],
        msgArgs?: Parameters<_Stage_Console_VarInspect[ 'log' ]>[ 2 ],
        timeArgs?: Parameters<_Stage_Console_VarInspect[ 'log' ]>[ 3 ],
    ): void {
        if ( !this.params.progress ) { return; }
        this.log( variable, level, msgArgs, timeArgs );
    }

    /** {@inheritDoc Logger.VarInspect.stringify} */
    public stringify(
        variable: ConstructorParameters<typeof VariableInspector>[ 0 ],
        args?: ConstructorParameters<typeof VariableInspector>[ 1 ],
    ): string {
        return VariableInspector.stringify( variable, args ).replace( /\n\s*\n/gi, '\n' );
    }

    /** {@inheritDoc Logger.VarInspect.verbose} */
    public verbose(
        variable: ConstructorParameters<typeof VariableInspector>[ 0 ],
        level: Parameters<_Stage_Console_VarInspect[ 'log' ]>[ 1 ],
        msgArgs?: Parameters<_Stage_Console_VarInspect[ 'log' ]>[ 2 ],
        timeArgs?: Parameters<_Stage_Console_VarInspect[ 'log' ]>[ 3 ],
    ): void {
        if ( !this.params.verbose ) { return; }
        this.log( variable, level, {
            bold: false,
            ...msgArgs,
        }, timeArgs );
    }
}