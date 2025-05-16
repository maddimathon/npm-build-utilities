/**
 * @since ___PKG_VERSION___
 * 
 * @packageDocumentation
 */
/**
 * @package @maddimathon/npm-build-utilities@___CURRENT_VERSION___
 */
/*!
 * @maddimathon/npm-build-utilities@___CURRENT_VERSION___
 * @license MIT
 */

import type { CLI } from '../../types/index.js';


/**
 * Constructs a complete CLI params object based on the partial input.
 * 
 * @category Config
 * 
 * @param p  Input CLI params to convert.
 * 
 * @return  A completed version of the params object.
 */
export function parseParamsCLI( p: Partial<CLI.Params> ): CLI.Params {

    const stage = p._?.[ 0 ];

    const releasing = stage === 'release';

    const packaging = stage === 'package' || releasing;

    const building = stage === 'build' || packaging || releasing;

    const def: CLI.Params = {
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

        debug: p._?.[ 0 ] === 'debug',
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