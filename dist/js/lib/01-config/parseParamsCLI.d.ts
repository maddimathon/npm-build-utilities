/**
 * @since 0.1.0-alpha.draft
 *
 * @packageDocumentation
 */
/**
 * @package @maddimathon/build-utilities@0.1.0-alpha.draft
 */
/*!
 * @maddimathon/build-utilities@0.1.0-alpha.draft
 * @license MIT
 */
import type { CLI } from '../../types/index.js';
/**
 * Constructs a complete CLI params object based on the partial input.
 *
 * @category Config
 *
 * @param input  Input CLI params to convert.
 *
 * @return  A completed version of the params object.
 */
export declare function parseParamsCLI(input: Partial<CLI.Params>): CLI.Params;
export declare namespace parseParamsCLI {
    const ARGS_DEFAULT: (input: Partial<CLI.Params>) => {
        readonly _: [];
        readonly only: [];
        readonly without: [];
        readonly 'only-snapshot': [];
        readonly 'only-compile': [];
        readonly 'only-test': [];
        readonly 'only-document': [];
        readonly 'only-build': [];
        readonly 'only-package': [];
        readonly 'only-release': [];
        readonly 'without-snapshot': [];
        readonly 'without-compile': [];
        readonly 'without-test': [];
        readonly 'without-document': [];
        readonly 'without-build': [];
        readonly 'without-package': [];
        readonly 'without-release': [];
        readonly debug: boolean;
        readonly 'log-base-level': 0;
        readonly notice: true;
        readonly progress: true;
        readonly verbose: false;
        readonly building: boolean;
        readonly dryrun: false;
        readonly packaging: boolean;
        readonly releasing: boolean;
        readonly starting: false;
    };
}
//# sourceMappingURL=parseParamsCLI.d.ts.map