/**
 * @since 0.1.0-draft
 *
 * @packageDocumentation
 */
/**
 * @package @maddimathon/npm-build-utilities@0.1.0-draft
 */
/*!
 * @maddimathon/npm-build-utilities@0.1.0-draft
 * @license MIT
 */
import { node, } from '@maddimathon/utility-typescript/classes';
class _DummyConsole_VarDump {
    nc;
    constructor(nc) {
        this.nc = nc ?? new node.NodeConsole();
    }
    log(variable, level, msgArgs = {}, timeArgs = {}) {
        this.nc.timestampVarDump(variable, {
            ...msgArgs,
            depth: level,
        }, timeArgs);
    }
    notice(variable, level, msgArgs, timeArgs) {
        this.log(variable, level, msgArgs, timeArgs);
    }
    progress(variable, level, msgArgs, timeArgs) {
        this.log(variable, level, msgArgs, timeArgs);
    }
    verbose(variable, level, msgArgs, timeArgs) {
        this.log(variable, level, msgArgs, timeArgs);
    }
}
/**
 * A basic console class used as a back-up before {@link Stage_Console} is
 * defined.
 *
 * @internal
 */
export class DummyConsole {
    nc;
    varDump = new _DummyConsole_VarDump();
    constructor(nc) {
        this.nc = nc ?? new node.NodeConsole();
    }
    error(msg, level, msgArgs = {}, timeArgs = {}) {
        this.nc.timestampLog(msg, {
            ...msgArgs,
            depth: level,
        }, timeArgs);
    }
    log(msg, level, msgArgs = {}, timeArgs = {}) {
        this.nc.timestampLog(msg, {
            ...msgArgs,
            depth: level,
        }, timeArgs);
    }
    notice(msg, level, msgArgs, timeArgs) {
        this.log(msg, level, msgArgs, timeArgs);
    }
    progress(msg, level, msgArgs, timeArgs) {
        this.log(msg, level, msgArgs, timeArgs);
    }
    verbose(msg, level, msgArgs, timeArgs) {
        this.log(msg, level, msgArgs, timeArgs);
    }
}
//# sourceMappingURL=DummyConsole.js.map