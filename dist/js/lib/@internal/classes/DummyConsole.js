/**
 * @since 0.1.0-alpha
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.3.0-alpha.4
 * @license MIT
 */
import {
    node,
    MessageMaker,
    VariableInspector,
} from '@maddimathon/utility-typescript/classes';
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
    constructor(nc = new node.NodeConsole(), config = {}, params = {}) {
        this.nc = nc;
        this.config = config;
        this.params = params;
    }
    debug(msg, level, msgArgs, timeArgs) {
        if (!this.params.debug && typeof this.params.debug !== 'undefined') {
            return;
        }
        this.log(msg, level, msgArgs, timeArgs);
    }
    error(msg, level, msgArgs = {}, timeArgs = {}) {
        this.nc.timestampLog(
            msg,
            {
                ...msgArgs,
                depth: level,
            },
            timeArgs,
        );
    }
    log(msg, level, msgArgs = {}, timeArgs = {}) {
        this.nc.timestampLog(
            msg,
            {
                ...msgArgs,
                depth: level,
            },
            timeArgs,
        );
    }
    progress(msg, level, msgArgs, timeArgs) {
        if (
            !this.params.progress
            && typeof this.params.progress !== 'undefined'
        ) {
            return;
        }
        this.log(msg, level, msgArgs, timeArgs);
    }
    /**
     * Doesn't currently actually warn.
     *
     * @UPGRADE - make it warn
     */
    warn(msg, level, msgArgs, timeArgs) {
        this.log(msg, level, msgArgs, timeArgs);
    }
    verbose(msg, level, msgArgs, timeArgs) {
        if (
            !this.params.verbose
            && typeof this.params.verbose !== 'undefined'
        ) {
            return;
        }
        this.log(msg, level, msgArgs, timeArgs);
    }
}
class _DummyConsole_VarDump {
    nc;
    params;
    constructor(nc = new node.NodeConsole(), params = {}) {
        this.nc = nc;
        this.params = params;
    }
    debug(variable, level, msgArgs, timeArgs) {
        this.log(variable, level, msgArgs, timeArgs);
    }
    log(variable, level, msgArgs = {}, timeArgs = {}) {
        this.nc.timestampLog(
            this.stringify(variable),
            {
                ...msgArgs,
                depth: level,
            },
            timeArgs,
        );
    }
    progress(variable, level, msgArgs, timeArgs) {
        this.log(variable, level, msgArgs, timeArgs);
    }
    stringify(variable, args) {
        return VariableInspector.stringify(variable, args);
    }
    verbose(variable, level, msgArgs, timeArgs) {
        this.log(variable, level, msgArgs, timeArgs);
    }
}
//# sourceMappingURL=DummyConsole.js.map
