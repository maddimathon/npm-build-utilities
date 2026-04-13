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
    MessageMaker,
    VariableInspector,
} from '@maddimathon/utility-typescript';
import {
    NodeConsole,
    NodeConsole_Prompt,
} from '@maddimathon/utility-typescript/node';
/**
 * A basic console class used as a back-up before {@link Stage_Console} is
 * defined.
 *
 * @internal
 */
export class DummyConsole {
    nc;
    config;
    params;
    vi = new _DummyConsole_VarDump();
    constructor(nc = new NodeConsole(), config = {}, params = {}) {
        this.nc = nc;
        this.config = config;
        this.params = params;
    }
    debug(msg, level, args = {}) {
        if (!this.params.debug) {
            return;
        }
        this.nc.timestamp.debug(msg, {
            ...args,
            depth: level,
        });
    }
    error(msg, level, args = {}) {
        this.nc.timestamp.log(msg, {
            ...args,
            depth: level,
            via: 'error',
        });
    }
    log(msg, level, args = {}) {
        this.nc.timestamp.log(msg, {
            ...args,
            depth: level,
        });
    }
    progress(msg, level, args = {}) {
        if (!this.params.progress) {
            return;
        }
        this.log(msg, level, args);
    }
    warn(msg, level, args = {}) {
        this.nc.timestamp.warn(msg, {
            ...args,
            depth: level,
        });
    }
    verbose(msg, level, args = {}) {
        if (!this.params.verbose) {
            return;
        }
        this.nc.timestamp.log(msg, {
            ...args,
            depth: level,
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
                (opts?.msgArgs?.depth ?? level)
                + (this.params['log-base-level'] ?? 0),
            clr: 'purple',
        };
        const styleClrs = {
            ...(opts?.styleClrs ?? {}),
            help: 'purple',
            highlight: 'purple',
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
class _DummyConsole_VarDump {
    nc;
    params;
    constructor(nc = new NodeConsole(), params = {}) {
        this.nc = nc;
        this.params = params;
    }
    debug(variable, level, { msg, ...args } = {}) {
        if (!this.params.debug) {
            return;
        }
        this.nc.timestamp.debug(this.stringify(variable, args), {
            ...msg,
            depth: level,
        });
    }
    log(variable, level, { msg, ...args } = {}) {
        this.nc.timestamp.log(this.stringify(variable, args), {
            ...msg,
            depth: level,
        });
    }
    progress(variable, level, { msg, ...args } = {}) {
        if (!this.params.progress) {
            return;
        }
        this.log(variable, level, args);
    }
    stringify(variable, args) {
        return VariableInspector.stringify(variable, args);
    }
    verbose(variable, level, { msg, ...args } = {}) {
        if (!this.params.verbose) {
            return;
        }
        this.nc.timestamp.log(this.stringify(variable, args), {
            ...msg,
            depth: level,
            via: 'info',
        });
    }
}
