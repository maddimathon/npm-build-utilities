/**
 * @since 0.1.0-alpha
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.3.0-beta.draft
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
export class Stage_Console {
    clr;
    config;
    params;
    /* LOCAL PROPERTIES
     * ====================================================================== */
    /** {@inheritDoc Logger.nc} */
    nc;
    /** {@inheritDoc Logger.vi} */
    vi;
    /* CONSTRUCTOR
     * ====================================================================== */
    /**
     * @param clr     Colour slug for this colour-coding this class.
     * @param config  Current project config.
     * @param params  Current CLI params.
     */
    constructor(clr, config, params) {
        this.clr = clr;
        this.config = config;
        this.params = params;
        this.nc = new NodeConsole(
            mergeArgs(
                this.config.console?.nc ?? {},
                {
                    msgMaker: {
                        msg: {
                            clr: this.clr,
                        },
                    },
                },
                true,
            ),
        );
        this.msgArgs = this.msgArgs.bind(this);
        this.debug = this.debug.bind(this);
        this.error = this.error.bind(this);
        this.log = this.log.bind(this);
        this.progress = this.progress.bind(this);
        this.warn = this.warn.bind(this);
        this.verbose = this.verbose.bind(this);
        this.vi = new _Stage_Console_VarInspect({
            debug: this.debug,
            error: this.error,
            log: this.log,
            progress: this.progress,
            warn: this.warn,
            verbose: this.verbose,
        });
        this.prompt_prepareOpts = this.prompt_prepareOpts.bind(this);
        this.prompt_bool = this.prompt_bool.bind(this);
        this.prompt_input = this.prompt_input.bind(this);
        this.prompt_select = this.prompt_select.bind(this);
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
    msgArgs(level = 0, args = {}) {
        const depth = level + Number(this.params['log-base-level']);
        const msg = {
            bold: depth == 0 || level <= 1,
            clr: this.clr,
            depth,
            linesIn: 0,
            linesOut: 0,
            ...args,
            time: args.time ? deleteUndefinedProps(args.time) : {},
        };
        if (level <= 0) {
            msg.linesIn = args.linesIn ?? 2;
        }
        if (level > 0) {
            msg.linesIn = args.linesIn ?? 1;
        }
        // if ( level > 1 ) {
        // }
        if (level > 2) {
            msg.italic = args.italic ?? true;
            msg.linesIn = args.linesIn ?? 0;
        }
        if (level > 3) {
            msg.clr = args.clr ?? 'grey';
        }
        return msg;
    }
    /** {@inheritDoc Logger.debug} */
    debug(msg, level, args = {}) {
        if (!this.params.debug) {
            return;
        }
        this.nc.timestamp.debug(
            msg,
            this.msgArgs(level, {
                clr: 'grey',
                ...args,
            }),
        );
    }
    /** {@inheritDoc Logger.error} */
    error(msg, level, args = {}) {
        this.nc.timestamp.log(msg, {
            ...this.msgArgs(level, {
                clr: 'red',
                ...args,
            }),
            via: 'error',
        });
    }
    /** {@inheritDoc Logger.log} */
    log(msg, level, args = {}) {
        this.nc.timestamp.log(msg, this.msgArgs(level, args));
    }
    /** {@inheritDoc Logger.progress} */
    progress(msg, level, args = {}) {
        if (!this.params.progress) {
            return;
        }
        this.nc.timestamp.log(msg, this.msgArgs(level, args));
    }
    /**
     * Prints a message to the console signalling the start or end of this build
     * stage.  Uses {@link Stage_Consolelog}.
     *
     * @param msg    Text to display as start/end message.
     * @param which  Whether we are starting or ending.
     * @param args   Message argument overrides.
     */
    startOrEnd(msg, which, args = {}) {
        const depth = this.params['log-base-level'];
        let linesIn = args.linesIn ?? 2;
        let linesOut = args.linesOut ?? 1;
        const itemArgs = {
            ...args,
            linesIn: 0,
            linesOut: 0,
        };
        const bulkMsgs =
            typeof msg === 'string' ?
                [[msg]]
            :   msg.map((item) => {
                    // returns
                    if (typeof item === 'string') {
                        return [item, itemArgs];
                    }
                    item[1] = {
                        ...(item[1] ?? {}),
                        ...itemArgs,
                    };
                    return item;
                });
        switch (which) {
            case 'start':
                linesOut = 0;
                if (depth < 1) {
                    linesIn += 1;
                }
                break;
            case 'end':
                if (depth < 1) {
                    linesOut += 1;
                }
                break;
        }
        this.log(bulkMsgs, 0, {
            bold: true,
            italic: false,
            flag: true,
            joiner: '',
            linesIn,
            linesOut,
            ...args,
        });
    }
    /**
     * {@inheritDoc Logger.debug}
     *
     * @UPGRADE
     * **Doesn't currently actually warn.**
     */
    warn(msg, level, args = {}) {
        this.nc.timestamp.warn(
            msg,
            this.msgArgs(level, {
                clr: 'orange',
                ...args,
            }),
        );
    }
    /** {@inheritDoc Logger.verbose} */
    verbose(msg, level, args = {}) {
        if (!this.params.verbose) {
            return;
        }
        this.nc.timestamp.log(msg, {
            ...this.msgArgs(level, args),
            via: 'info',
        });
    }
    /* PROMPTING ===================================== */
    get prompt() {
        return {
            bool: this.prompt_bool,
            input: this.prompt_input,
            select: this.prompt_select,
        };
    }
    prompt_prepareOpts(level, opts) {
        const msgArgs = {
            ...(opts?.msgArgs ?? {}),
            depth:
                (opts?.msgArgs?.depth ?? level) + this.params['log-base-level'],
        };
        const styleClrs = {
            help: this.clr,
            highlight: this.clr,
            ...(opts?.styleClrs ?? {}),
        };
        return { msgArgs, styleClrs };
    }
    async prompt_bool(message, level, opts) {
        const { msgArgs, styleClrs } = this.prompt_prepareOpts(level, opts);
        return this.nc.prompt.bool({
            ...(opts ?? {}),
            message,
            msgArgs,
            styleClrs,
        });
    }
    async prompt_input(message, level, opts) {
        const { msgArgs, styleClrs } = this.prompt_prepareOpts(level, opts);
        return this.nc.prompt.input({
            ...(opts ?? {}),
            message,
            msgArgs,
            styleClrs,
        });
    }
    async prompt_select(message, level, opts) {
        const { msgArgs, styleClrs } = this.prompt_prepareOpts(level, opts);
        const choices = opts.choices.map((choice) =>
            typeof choice === 'string' ? { value: choice } : choice,
        );
        return this.nc.prompt.select({
            ...opts,
            message,
            choices,
            msgArgs,
            styleClrs,
        });
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
export class _Stage_Console_VarInspect {
    console;
    /* CONSTRUCTOR
     * ====================================================================== */
    /**
     * @since 0.3.0-beta.draft — Removed `_msgArgs`, `config`, `nc`, `params` params.
     */
    constructor(
        /**
         * Functions to use for outputting messages.
         *
         * @since 0.3.0-beta.draft
         */
        console,
    ) {
        this.console = console;
    }
    /* LOCAL METHODS
     * ====================================================================== */
    /** {@inheritDoc Stage_Console.msgArgs} */
    msgArgs(args) {
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
    debug(variable, level, { msg, ...args } = {}) {
        this.console.debug(
            this.stringify(variable, args),
            level,
            this.msgArgs(msg),
        );
    }
    /**
     * @since 0.3.0-beta.draft
     */
    error(variable, level, { msg, ...args } = {}) {
        this.console.error(
            this.stringify(variable, args),
            level,
            this.msgArgs(msg),
        );
    }
    /** {@inheritDoc Logger.VarInspect.log} */
    log(variable, level, { msg, ...args } = {}) {
        this.console.log(
            this.stringify(variable, args),
            level,
            this.msgArgs(msg),
        );
    }
    /** {@inheritDoc Logger.VarInspect.progress} */
    progress(variable, level, { msg, ...args } = {}) {
        this.console.log(
            this.stringify(variable, args),
            level,
            this.msgArgs(msg),
        );
    }
    /** {@inheritDoc Logger.VarInspect.stringify} */
    stringify(variable, args = {}) {
        return VariableInspector.stringify(variable, args).replace(
            /\n\s*\n/gi,
            '\n',
        );
    }
    /**
     * @since 0.3.0-beta.draft
     */
    warn(variable, level, { msg, ...args } = {}) {
        this.console.warn(
            this.stringify(variable, args),
            level,
            this.msgArgs(msg),
        );
    }
    /** {@inheritDoc Logger.VarInspect.verbose} */
    verbose(variable, level, { msg, ...args } = {}) {
        this.console.verbose(
            this.stringify(variable, args),
            level,
            this.msgArgs(msg),
        );
    }
}
