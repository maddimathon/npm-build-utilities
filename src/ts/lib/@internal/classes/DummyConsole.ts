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
import type { RecursivePartial } from '@maddimathon/utility-typescript/types';


/**
 * A basic console class used as a back-up before {@link Stage_Console} is
 * defined.
 * 
 * @internal
 */
export class DummyConsole implements Logger {

    public readonly vi: Logger.VarInspect = new _DummyConsole_VarDump();

    public constructor (
        public readonly nc: NodeConsole = new NodeConsole(),
        public readonly config: Partial<Config | Config.Internal> = {},
        public readonly params: Partial<CLI.Params> = {},
    ) {
    }

    public debug(
        msg: string | string[] | MessageMaker.BulkMsgs,
        level: number,
        args: RecursivePartial<Logger.MsgArgs> = {},
    ) {
        if ( !this.params.debug ) { return; }

        this.nc.timestamp.debug(
            msg,
            {
                ...args,
                depth: level,
            },
        );
    }

    public error(
        msg: string | string[] | MessageMaker.BulkMsgs,
        level: number,
        args: RecursivePartial<Logger.MsgArgs> = {},
    ) {
        this.nc.timestamp.log(
            msg,
            {
                ...args,
                depth: level,
                via: 'error',
            },
        );
    }

    public log(
        msg: string | string[] | MessageMaker.BulkMsgs,
        level: number,
        args: RecursivePartial<Logger.MsgArgs> = {},
    ) {
        this.nc.timestamp.log(
            msg,
            {
                ...args,
                depth: level,
            },
        );
    }

    public progress(
        msg: string | string[] | MessageMaker.BulkMsgs,
        level: number,
        args: RecursivePartial<Logger.MsgArgs> = {},
    ) {
        if ( !this.params.progress ) { return; }
        this.log( msg, level, args );
    }

    public warn(
        msg: string | string[] | MessageMaker.BulkMsgs,
        level: number,
        args: RecursivePartial<Logger.MsgArgs> = {},
    ) {
        this.nc.timestamp.warn(
            msg,
            {
                ...args,
                depth: level,
            },
        );
    }

    public verbose(
        msg: string | string[] | MessageMaker.BulkMsgs,
        level: number,
        args: RecursivePartial<Logger.MsgArgs> = {},
    ) {
        if ( !this.params.verbose ) { return; }
        this.nc.timestamp.log(
            msg,
            {
                ...args,
                depth: level,
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

class _DummyConsole_VarDump implements Logger.VarInspect {

    public constructor (
        public readonly nc: NodeConsole = new NodeConsole(),
        protected readonly params: Partial<CLI.Params> = {},
    ) {
    }

    public debug(
        variable: ConstructorParameters<typeof VariableInspector>[ 0 ],
        level: number,
        { msg, ...args }: RecursivePartial<Logger.VarInspect.Args> = {},
    ) {
        if ( !this.params.debug ) { return; }

        this.nc.timestamp.debug(
            this.stringify( variable, args ),
            {
                ...msg,
                depth: level,
            },
        );
    }

    public log(
        variable: ConstructorParameters<typeof VariableInspector>[ 0 ],
        level: number,
        { msg, ...args }: RecursivePartial<Logger.VarInspect.Args> = {},
    ) {
        this.nc.timestamp.log(
            this.stringify( variable, args ),
            {
                ...msg,
                depth: level,
            },
        );
    }

    public progress(
        variable: ConstructorParameters<typeof VariableInspector>[ 0 ],
        level: number,
        { msg, ...args }: RecursivePartial<Logger.VarInspect.Args> = {},
    ) {
        if ( !this.params.progress ) { return; }
        this.log( variable, level, args );
    }

    public stringify(
        variable: ConstructorParameters<typeof VariableInspector>[ 0 ],
        args: RecursivePartial<Logger.VarInspect.Args>,
    ): string {
        return VariableInspector.stringify( variable, args );
    }

    public verbose(
        variable: ConstructorParameters<typeof VariableInspector>[ 0 ],
        level: number,
        { msg, ...args }: RecursivePartial<Logger.VarInspect.Args> = {},
    ) {
        if ( !this.params.verbose ) { return; }

        this.nc.timestamp.log(
            this.stringify( variable, args ),
            {
                ...msg,
                depth: level,
                via: 'info',
            },
        );
    }
}