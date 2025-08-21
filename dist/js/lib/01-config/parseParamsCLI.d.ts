/**
 * @since 0.1.0-alpha
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.2.0-alpha.2
 * @license MIT
 */
import type { CLI } from '../../types/index.js';
/**
 * Constructs a complete CLI params object based on partial input.
 *
 * @category Config
 *
 * @param input  Input CLI params to convert.
 *
 * @return  A completed version of the params object.
 *
 * @since 0.1.0-alpha
 */
export declare function parseParamsCLI(input: Partial<CLI.Params>): CLI.Params;
/**
 * Utilities for {@link parseParamsCLI} function.
 *
 * @category Config
 *
 * @since 0.1.0-alpha
 */
export declare namespace parseParamsCLI {
    /**
     * Default arguments for {@link parseParamsCLI} function.
     *
     * @since 0.1.0-alpha
     */
    function DEFAULT(input: Partial<CLI.Params>): {
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