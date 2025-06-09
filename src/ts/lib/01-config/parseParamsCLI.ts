/**
 * @since ___PKG_VERSION___
 * 
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@___CURRENT_VERSION___
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
 * @since ___PKG_VERSION___
 */
export function parseParamsCLI( input: Partial<CLI.Params> ): CLI.Params {

    const defaultParams: CLI.Params = parseParamsCLI.DEFAULT( input );

    const parsed: CLI.Params = {
        ...defaultParams,
        ...input ?? {},
    };

    if ( !input ) {
        return parsed;
    }

    for ( const t_key in input ) {
        const _key = t_key as keyof CLI.Params;

        if ( typeof input[ _key ] === 'undefined' ) {
            // @ts-expect-error - I honestly have no idea what's going wrong here
            // UPGRADE - figure this out
            parsed[ _key ] = defaultParams[ _key ];
        }
    }

    return parsed;
}

/**
 * Utilities for {@link parseParamsCLI} function.
 * 
 * @category Config
 * 
 * @since ___PKG_VERSION___
 */
export namespace parseParamsCLI {

    /**
     * Default arguments for {@link parseParamsCLI} function.
     * 
     * @since ___PKG_VERSION___
     */
    export function DEFAULT( input: Partial<CLI.Params> ) {

        const stage = input._?.[ 0 ];

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

            debug: input._?.[ 0 ] === 'debug',
            'log-base-level': 0,
            progress: true,
            verbose: false,


            /* ## STAGE FLAGS ===================================== */

            building,
            dryrun: false,
            packaging,
            releasing,
            starting: false,

        } as const satisfies CLI.Params;
    };
}