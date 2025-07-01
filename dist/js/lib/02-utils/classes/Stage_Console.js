/**
 * @since 0.1.0-alpha
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.1.4-alpha.1.draft
 * @license MIT
 */
import { mergeArgs } from '@maddimathon/utility-typescript/functions';
import {
    node,
    VariableInspector,
} from '@maddimathon/utility-typescript/classes';
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
        this.nc = new node.NodeConsole(
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
    msgArgs(level = 0, msgArgs = {}, timeArgs = {}) {
        const depth = level + Number(this.params['log-base-level']);
        const msg = {
            bold: depth == 0 || level <= 1,
            clr: this.clr,
            depth,
            linesIn: 0,
            linesOut: 0,
            ...msgArgs,
        };
        const time = {
            ...timeArgs,
        };
        if (level <= 0) {
            msg.linesIn = msgArgs.linesIn ?? 2;
        }
        if (level > 0) {
            msg.linesIn = msgArgs.linesIn ?? 1;
        }
        // if ( level > 1 ) {
        // }
        if (level > 2) {
            msg.italic = msgArgs.italic ?? true;
            msg.linesIn = msgArgs.linesIn ?? 0;
        }
        if (level > 3) {
            msg.clr = msgArgs.clr ?? 'grey';
        }
        return { msg, time };
    }
    /** {@inheritDoc Logger.debug} */
    debug(msg, level, msgArgs, timeArgs) {
        if (!this.params.debug) {
            return;
        }
        this.log(msg, level, msgArgs, timeArgs);
    }
    /** {@inheritDoc Logger.error} */
    error(msg, level, msgArgs = {}, timeArgs = {}) {
        this.log(msg, level, msgArgs, timeArgs);
    }
    /** {@inheritDoc Logger.log} */
    log(msg, level, msgArgs, timeArgs) {
        const args = this.msgArgs(level, msgArgs, timeArgs);
        this.nc.timestampLog(msg, args.msg, args.time);
    }
    /** {@inheritDoc Logger.progress} */
    progress(msg, level, msgArgs, timeArgs) {
        if (!this.params.progress) {
            return;
        }
        this.log(msg, level, msgArgs, timeArgs);
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
            typeof msg === 'string'
                ? [[msg]]
                : msg.map((item) => {
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
     * @TODO
     * **Doesn't currently actually warn.**
     */
    warn(msg, level, msgArgs, timeArgs) {
        this.log(msg, level, msgArgs, timeArgs);
    }
    /** {@inheritDoc Logger.verbose} */
    verbose(msg, level, msgArgs, timeArgs) {
        if (!this.params.verbose) {
            return;
        }
        this.log(
            msg,
            level,
            {
                bold: false,
                ...msgArgs,
            },
            timeArgs,
        );
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
    config;
    params;
    _msgArgs;
    nc;
    /* CONSTRUCTOR
     * ====================================================================== */
    /**
     * @param config    Current project config.
     * @param params    Current CLI params.
     * @param _msgArgs  Function to construct a {@link MessageMaker.BulkMsgArgs} object.
     * @param nc        Instance to use within the class.
     */
    constructor(config, params, _msgArgs, nc) {
        this.config = config;
        this.params = params;
        this._msgArgs = _msgArgs;
        this.nc = nc;
    }
    /* LOCAL METHODS
     * ====================================================================== */
    msgArgs(level = 0, msgArgs = {}, timeArgs = {}) {
        return this._msgArgs(
            level,
            {
                bold: false,
                flag: false,
                italic: false,
                ...msgArgs,
                maxWidth: null,
            },
            timeArgs,
        );
    }
    /** {@inheritDoc Logger.VarInspect.debug} */
    debug(variable, level, msgArgs, timeArgs) {
        if (!this.params.debug) {
            return;
        }
        this.log(variable, level, msgArgs, timeArgs);
    }
    /** {@inheritDoc Logger.VarInspect.log} */
    log(variable, level, msgArgs, timeArgs) {
        const args = this.msgArgs(level, msgArgs, timeArgs);
        this.nc.timestampLog(this.stringify(variable), args.msg, args.time);
    }
    /** {@inheritDoc Logger.VarInspect.progress} */
    progress(variable, level, msgArgs, timeArgs) {
        if (!this.params.progress) {
            return;
        }
        this.log(variable, level, msgArgs, timeArgs);
    }
    /** {@inheritDoc Logger.VarInspect.stringify} */
    stringify(variable, args) {
        return VariableInspector.stringify(variable, args).replace(
            /\n\s*\n/gi,
            '\n',
        );
    }
    /** {@inheritDoc Logger.VarInspect.verbose} */
    verbose(variable, level, msgArgs, timeArgs) {
        if (!this.params.verbose) {
            return;
        }
        this.log(
            variable,
            level,
            {
                bold: false,
                ...msgArgs,
            },
            timeArgs,
        );
    }
}
//# sourceMappingURL=Stage_Console.js.map
