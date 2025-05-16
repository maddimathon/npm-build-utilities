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
/**
 * Constructs a complete CLI params object based on the partial input.
 *
 * @category Config
 *
 * @param p  Input CLI params to convert.
 *
 * @return  A completed version of the params object.
 */
export function parseParamsCLI(p) {
    var _a, _b;
    const stage = (_a = p._) === null || _a === void 0 ? void 0 : _a[0];
    const releasing = stage === 'release';
    const packaging = stage === 'package' || releasing;
    const building = stage === 'build' || packaging || releasing;
    const def = {
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
        debug: ((_b = p._) === null || _b === void 0 ? void 0 : _b[0]) === 'debug',
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
    return { ...def, ...p };
}
//# sourceMappingURL=parseParamsCLI.js.map