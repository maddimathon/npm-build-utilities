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
/**
 * Constructs a complete CLI params object based on the partial input.
 *
 * @category Config
 *
 * @param input  Input CLI params to convert.
 *
 * @return  A completed version of the params object.
 */
export function parseParamsCLI(input) {
    const defaultParams = parseParamsCLI.ARGS_DEFAULT(input);
    const parsed = {
        ...defaultParams,
        ...(input ?? {}),
    };
    if (!input) {
        return parsed;
    }
    for (const t_key in input) {
        const _key = t_key;
        if (typeof input[_key] === 'undefined') {
            // @ts-expect-error - I honestly have no idea what's going wrong here
            parsed[_key] = defaultParams[_key];
        }
    }
    return parsed;
}
(function (parseParamsCLI) {
    parseParamsCLI.ARGS_DEFAULT = (input) => {
        const stage = input._?.[0];
        const releasing = stage === 'release';
        const packaging = stage === 'package' || releasing;
        const building = stage === 'build' || packaging || releasing;
        return {
            _: [],
            only: [],
            without: [],
            'only-snapshot': [],
            'only-compile': [],
            'only-test': [],
            'only-document': [],
            'only-build': [],
            'only-package': [],
            'only-release': [],
            'without-snapshot': [],
            'without-compile': [],
            'without-test': [],
            'without-document': [],
            'without-build': [],
            'without-package': [],
            'without-release': [],
            /* ## LOG MESSAGES ===================================== */
            debug: input._?.[0] === 'debug',
            'log-base-level': 0,
            notice: true,
            progress: true,
            verbose: false,
            /* ## STAGE FLAGS ===================================== */
            building,
            dryrun: false,
            packaging,
            releasing,
            starting: false,
        };
    };
})(parseParamsCLI || (parseParamsCLI = {}));
//# sourceMappingURL=parseParamsCLI.js.map
