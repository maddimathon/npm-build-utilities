#!/usr/bin/env node
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
import { parseParamsCLI, Project, } from '../index.js';
export default async function (_params, level = 0, console) {
    const params = parseParamsCLI(_params !== null && _params !== void 0 ? _params : {});
    if (!console) {
        console = await Project.getConsole({ params });
    }
    // TODO finish me
    console.notice('Hello!  I am the help function.  I am not yet useful, sorry.', level);
    params.debug && console.varDump.progress({ params }, level);
    params.debug && console.varDump.progress({ params: parseParamsCLI(params !== null && params !== void 0 ? params : {}) }, level);
}
;
//# sourceMappingURL=help.js.map