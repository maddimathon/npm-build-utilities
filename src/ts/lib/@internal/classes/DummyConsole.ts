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
    node,

    MessageMaker,
    VariableInspector,
} from '@maddimathon/utility-typescript/classes';

import type {
    CLI,
    Config,
} from '../../../types/index.js';

import type { Logger } from '../../../types/Logger.js';


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
        public readonly config: Partial<Config | Config.Internal> = {},
        public readonly params: Partial<CLI.Params> = {},
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
        msgArgs: Partial<MessageMaker.BulkMsgArgs> = {},
        timeArgs: Partial<MessageMaker.BulkMsgArgs> = {},
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
        msgArgs: Partial<MessageMaker.BulkMsgArgs> = {},
        timeArgs: Partial<MessageMaker.BulkMsgArgs> = {},
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
     * @UPGRADE - make it warn
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


    /* PROMPTING ===================================== */

    public get prompt() {

        return {
            bool: this.prompt_bool,
            input: this.prompt_input,
            select: this.prompt_select,
        } as const;
    }

    protected prompt_prepareOpts<T_Config extends node.NodeConsole_Prompt.Config>(
        level: number,
        opts?: Omit<T_Config, 'message'>,
    ): Pick<T_Config, 'msgArgs' | 'styleClrs'> {

        const msgArgs = {
            ...opts?.msgArgs ?? {},
            depth: ( opts?.msgArgs?.depth ?? level ) + ( this.params[ 'log-base-level' ] ?? 0 ),
            clr: 'purple',
        } as const;

        const styleClrs = {
            ...opts?.styleClrs ?? {},
            help: 'purple',
            highlight: 'purple',
        } as const;

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
        T_Config extends Omit<node.NodeConsole_Prompt.SelectConfig<T_Return>, "choices"> & {
            choices: T_Return[];
        },
    >(
        message: string,
        level: number,
        opts: Omit<T_Config, 'message' | 'theme'>,
    ): Promise<T_Return | undefined>;

    protected async prompt_select<
        T_Return extends node.NodeConsole_Prompt.SelectValue,
        T_Config extends Omit<node.NodeConsole_Prompt.SelectConfig<T_Return>, "choices"> & {
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
        T_Return extends node.NodeConsole_Prompt.SelectValue,
        T_Config extends Omit<node.NodeConsole_Prompt.SelectConfig<T_Return>, "choices"> & {
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
            opts as Omit<node.NodeConsole_Prompt.Config<'select'>, 'message'>,
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

class _DummyConsole_VarDump implements Logger.VarInspect {

    public constructor (
        public readonly nc: node.NodeConsole = new node.NodeConsole(),
        protected readonly params: Partial<CLI.Params> = {},
    ) {
    }

    public debug(
        variable: Parameters<_DummyConsole_VarDump[ 'log' ]>[ 0 ],
        level: Parameters<_DummyConsole_VarDump[ 'log' ]>[ 1 ],
        msgArgs?: Parameters<_DummyConsole_VarDump[ 'log' ]>[ 2 ],
        timeArgs?: Parameters<_DummyConsole_VarDump[ 'log' ]>[ 3 ],
    ) {
        this.log( variable, level, msgArgs, timeArgs );
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