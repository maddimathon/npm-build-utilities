#!/usr/bin/env node
/**
 * @since 0.1.0-alpha
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.1.0-alpha
 * @license MIT
 */
import { parseParamsCLI, Project } from '../lib/index.js';
export default async function (_params, level = 0, console) {
    const params = parseParamsCLI(_params ?? {});
    if (!console) {
        console = await Project.getConsole({ params });
    }
    // TODO finish me
    console.log(
        'Hello!  I am the help function.  I am not yet useful, sorry.',
        level,
        { linesOut: 2 },
    );
    console.vi.debug({ params }, level, { bold: false, linesOut: 2 });
}
//# sourceMappingURL=help.js.map
