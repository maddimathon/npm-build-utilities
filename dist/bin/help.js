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
import { parseParamsCLI, Project, } from '../lib/index.js';
export default async function (_params, level = 0, console) {
    const params = parseParamsCLI(_params ?? {});
    if (!console) {
        console = await Project.getConsole({ params });
    }
    // TODO finish me
    console.notice('Hello!  I am the help function.  I am not yet useful, sorry.', level, { linesOut: 2 });
    params.debug && console.vi.progress({ params }, level, { bold: false, linesOut: 2 });
}
;
//# sourceMappingURL=help.js.map