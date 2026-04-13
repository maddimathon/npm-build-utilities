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
    deleteUndefinedProps,
    mergeArgs,
    MessageMaker,
    VariableInspector,
} from '@maddimathon/utility-typescript';

import {
    NodeConsole,
    NodeConsole_Prompt,
} from '@maddimathon/utility-typescript/node';

import type {
    CLI,
    Config,
} from '../../../types/index.js';

import type { Logger } from '../../../types/Logger.js';
import type { RecursivePartial, RecursivePartialExcept } from '@maddimathon/utility-typescript/types';

// import {
// } from '../../@internal/index.js';

// import {
// } from '../../00-universal/index.js';

// import {
// } from '../../01-config/index.js';


/**
 * To be used by {@link AbstractStage} and those that inherit from it.
 *
 * Includes a variety of utilities for printing messages to the console.
 * 
 * @category Stages
 * 
 * @since 0.1.0-alpha
 * 
 * @internal
 */
export class Stage_Console implements Logger {



    /* LOCAL PROPERTIES
     * ====================================================================== */

    /** {@inheritDoc Logger.nc} */
    public readonly nc: NodeConsole;

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
        public readonly config: Config.Class,
        public readonly params: CLI.Params,
    ) {
        this.nc = new NodeConsole( mergeArgs(
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

        this.debug = this.debug.bind( this );
        this.error = this.error.bind( this );
        this.log = this.log.bind( this );
        this.progress = this.progress.bind( this );
        this.warn = this.warn.bind( this );
        this.verbose = this.verbose.bind( this );

        this.vi = new _Stage_Console_VarInspect(
            {
                debug: this.debug,
                error: this.error,
                log: this.log,
                progress: this.progress,
                warn: this.warn,
                verbose: this.verbose,
            },
        );

        this.prompt_prepareOpts = this.prompt_prepareOpts.bind( this );
        this.prompt_bool = this.prompt_bool.bind( this );
        this.prompt_input = this.prompt_input.bind( this );
        this.prompt_select = this.prompt_select.bind( this );
    }



    /* LOCAL METHODS
     * ====================================================================== */

    /**
     * Creates an argument object used to print messages to the terminal, adding
     * styling defaults by depth level.
     * 
     * @see {@link Stage_Console.clr}  Default colour for the message.
     * 
     * @param level  Depth level for this message.
     * @param args   Argument overrides for the message.
     * 
     * @return  An object with arguments separated by message (`msg`) and time.
     */
    protected msgArgs(
        level: number = 0,
        args: RecursivePartial<Logger.MsgArgs> = {},
    ): RecursivePartial<Logger.MsgArgs> {
        const depth = level + Number( this.params[ 'log-base-level' ] );

        const msg: RecursivePartialExcept<Logger.MsgArgs, 'time'> & { depth: number; } = {

            bold: depth == 0 || level <= 1,
            clr: this.clr,

            depth,

            linesIn: 0,
            linesOut: 0,

            ...args,

            time: args.time ? deleteUndefinedProps( args.time ) : {},
        };

        if ( level <= 0 ) {
            msg.linesIn = args.linesIn ?? 2;
        }

        if ( level > 0 ) {
            msg.linesIn = args.linesIn ?? 1;
        }

        // if ( level > 1 ) {
        // }

        if ( level > 2 ) {
            msg.italic = args.italic ?? true;
            msg.linesIn = args.linesIn ?? 0;
        }

        if ( level > 3 ) {
            msg.clr = args.clr ?? 'grey';
        }

        return msg;
    }

    /** {@inheritDoc Logger.debug} */
    public debug(
        msg: string | string[] | MessageMaker.BulkMsgs,
        level: number,
        args: RecursivePartial<Logger.MsgArgs> = {},
    ): void {
        if ( !this.params.debug ) { return; }

        this.nc.timestamp.debug( msg, this.msgArgs( level, {
            clr: 'grey',
            ...args,
        } ) );
    }

    /** {@inheritDoc Logger.error} */
    public error(
        msg: string | string[] | MessageMaker.BulkMsgs,
        level: number,
        args: RecursivePartial<Logger.MsgArgs> = {},
    ) {
        this.nc.timestamp.log(
            msg,
            {
                ...this.msgArgs( level, {
                    clr: 'red',
                    ...args,
                } ),
                via: 'error',
            },
        );
    }

    /** {@inheritDoc Logger.log} */
    public log(
        msg: string | string[] | MessageMaker.BulkMsgs,
        level: number,
        args: RecursivePartial<Logger.MsgArgs> = {},
    ): void {
        this.nc.timestamp.log( msg, this.msgArgs( level, args ) );
    }

    /** {@inheritDoc Logger.progress} */
    public progress(
        msg: string | string[] | MessageMaker.BulkMsgs,
        level: number,
        args: RecursivePartial<Logger.MsgArgs> = {},
    ): void {
        if ( !this.params.progress ) { return; }
        this.nc.timestamp.log( msg, this.msgArgs( level, args ) );
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
     * @UPGRADE
     * **Doesn't currently actually warn.**
     */
    public warn(
        msg: string | string[] | MessageMaker.BulkMsgs,
        level: number,
        args: RecursivePartial<Logger.MsgArgs> = {},
    ): void {
        this.nc.timestamp.warn( msg, this.msgArgs( level, {
            clr: 'orange',
            ...args,
        } ) );
    }

    /** {@inheritDoc Logger.verbose} */
    public verbose(
        msg: string | string[] | MessageMaker.BulkMsgs,
        level: number,
        args: RecursivePartial<Logger.MsgArgs> = {},
    ): void {
        if ( !this.params.verbose ) { return; }

        this.nc.timestamp.log(
            msg,
            {
                ...this.msgArgs( level, args ),
                via: 'info',
            },
        );
    }


    /* PROMPTING ===================================== */

    public get prompt() {

        return {
            bool: this.prompt_bool,
            input: this.prompt_input,
            select: this.prompt_select,
        } as const;
    }

    protected prompt_prepareOpts<T_Config extends NodeConsole_Prompt.Config>(
        level: number,
        opts?: Omit<T_Config, 'message'>,
    ): Pick<T_Config, 'msgArgs' | 'styleClrs'> {
        const msgArgs = {
            ...opts?.msgArgs ?? {},
            depth: ( opts?.msgArgs?.depth ?? level ) + this.params[ 'log-base-level' ],
        };

        const styleClrs = {
            help: this.clr,
            highlight: this.clr,
            ...opts?.styleClrs ?? {},
        };

        return { msgArgs, styleClrs };
    }

    protected async prompt_bool(
        message: string,
        level: number,
        opts?: Omit<Parameters<typeof this.nc.prompt.bool>[ 0 ], 'message'>,
    ) {
        const { msgArgs, styleClrs } = this.prompt_prepareOpts( level, opts );

        return this.nc.prompt.bool( {
            ...opts ?? {},
            message,
            msgArgs,
            styleClrs,
        } );
    }

    protected async prompt_input(
        message: string,
        level: number,
        opts?: Omit<Parameters<typeof this.nc.prompt.input>[ 0 ], 'message'>,
    ) {
        const { msgArgs, styleClrs } = this.prompt_prepareOpts( level, opts );

        return this.nc.prompt.input( {
            ...opts ?? {},
            message,
            msgArgs,
            styleClrs,
        } );
    }


    protected async prompt_select<
        T_Return extends string,
        T_Config extends Omit<NodeConsole_Prompt.SelectConfig<T_Return>, "choices"> & {
            choices: T_Return[];
        },
    >(
        message: string,
        level: number,
        opts: Omit<T_Config, 'message' | 'theme'>,
    ): Promise<T_Return | undefined>;

    protected async prompt_select<
        T_Return extends NodeConsole_Prompt.SelectValue,
        T_Config extends Omit<NodeConsole_Prompt.SelectConfig<T_Return>, "choices"> & {
            choices: {
                value: T_Return;

                name?: string;
                description?: string;
                short?: string;
                disabled?: boolean | string;
            }[];
        },
    >(
        message: string,
        level: number,
        opts: Omit<T_Config, 'message' | 'theme'>,
    ): Promise<T_Return | undefined>;

    protected async prompt_select<
        T_Return extends NodeConsole_Prompt.SelectValue,
        T_Config extends Omit<NodeConsole_Prompt.SelectConfig<T_Return>, "choices"> & {
            choices: [ string ] & string[] | {
                value: T_Return;

                name?: string;
                description?: string;
                short?: string;
                disabled?: boolean | string;
            }[];
        },
    >(
        message: string,
        level: number,
        opts: Omit<T_Config, 'message' | 'theme'>,
    ) {
        const { msgArgs, styleClrs } = this.prompt_prepareOpts(
            level,
            opts as Omit<NodeConsole_Prompt.Config<'select'>, 'message'>,
        );

        const choices: {
            value: T_Return;

            name?: string;
            description?: string;
            short?: string;
            disabled?: boolean | string;
        }[] = opts.choices.map( choice => typeof choice === 'string' ? { value: choice as T_Return } : choice );

        return this.nc.prompt.select( {
            ...opts,
            message,
            choices,
            msgArgs,
            styleClrs,
        } );
    }
}


/**
 * To be used by {@link Stage_Console}.
 *
 * Includes a variety of utilities for printing variable inspections to the console.
 * 
 * @category Stages
 * 
 * @since 0.1.0-alpha
 * 
 * @internal
 * @private
 */
export class _Stage_Console_VarInspect implements Logger.VarInspect {


    /* CONSTRUCTOR
     * ====================================================================== */

    /**
     * @since ___PKG_VERSION___ — Removed `_msgArgs`, `config`, `nc`, `params` params.
     */
    constructor (

        /**
         * Functions to use for outputting messages.
         * 
         * @since ___PKG_VERSION___
         */
        protected readonly console: {
            [ K in "debug" | "error" | "log" | "progress" | "warn" | "verbose" ]: (
                msg: string | string[] | MessageMaker.BulkMsgs,
                level: number,
                args?: RecursivePartial<Logger.MsgArgs>,
            ) => void;
        },
    ) {
    }



    /* LOCAL METHODS
     * ====================================================================== */

    /** {@inheritDoc Stage_Console.msgArgs} */
    private msgArgs(
        args: RecursivePartial<Logger.VarInspect.Args[ 'msg' ]> | undefined,
    ): RecursivePartial<Logger.VarInspect.Args[ 'msg' ]> {
        return {
            bold: false,
            flag: false,
            italic: false,
            linesIn: 1,
            ...args,
            maxWidth: null,
        };
    }

    /** {@inheritDoc Logger.VarInspect.debug} */
    public debug(
        variable: ConstructorParameters<typeof VariableInspector>[ 0 ],
        level: number,
        { msg, ...args }: RecursivePartial<Logger.VarInspect.Args> = {},
    ): void {

        this.console.debug(
            this.stringify( variable, args ),
            level,
            this.msgArgs( msg ),
        );
    }

    /**
     * @since ___PKG_VERSION___
     */
    public error(
        variable: ConstructorParameters<typeof VariableInspector>[ 0 ],
        level: number,
        { msg, ...args }: RecursivePartial<Logger.VarInspect.Args> = {},
    ): void {

        this.console.error(
            this.stringify( variable, args ),
            level,
            this.msgArgs( msg ),
        );
    }

    /** {@inheritDoc Logger.VarInspect.log} */
    public log(
        variable: ConstructorParameters<typeof VariableInspector>[ 0 ],
        level: number,
        { msg, ...args }: RecursivePartial<Logger.VarInspect.Args> = {},
    ): void {

        this.console.log(
            this.stringify( variable, args ),
            level,
            this.msgArgs( msg ),
        );
    }

    /** {@inheritDoc Logger.VarInspect.progress} */
    public progress(
        variable: ConstructorParameters<typeof VariableInspector>[ 0 ],
        level: number,
        { msg, ...args }: RecursivePartial<Logger.VarInspect.Args> = {},
    ): void {

        this.console.log(
            this.stringify( variable, args ),
            level,
            this.msgArgs( msg ),
        );
    }

    /** {@inheritDoc Logger.VarInspect.stringify} */
    public stringify(
        variable: ConstructorParameters<typeof VariableInspector>[ 0 ],
        args: RecursivePartial<Logger.VarInspect.Args> = {},
    ): string {
        return VariableInspector.stringify( variable, args ).replace( /\n\s*\n/gi, '\n' );
    }

    /**
     * @since ___PKG_VERSION___
     */
    public warn(
        variable: ConstructorParameters<typeof VariableInspector>[ 0 ],
        level: number,
        { msg, ...args }: RecursivePartial<Logger.VarInspect.Args> = {},
    ): void {

        this.console.warn(
            this.stringify( variable, args ),
            level,
            this.msgArgs( msg ),
        );
    }

    /** {@inheritDoc Logger.VarInspect.verbose} */
    public verbose(
        variable: ConstructorParameters<typeof VariableInspector>[ 0 ],
        level: number,
        { msg, ...args }: RecursivePartial<Logger.VarInspect.Args> = {},
    ): void {

        this.console.verbose(
            this.stringify( variable, args ),
            level,
            this.msgArgs( msg ),
        );
    }
}