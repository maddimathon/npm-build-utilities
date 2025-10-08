/**
 * @since 0.1.0-alpha
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
 * @since 0.1.0-alpha
 */
export function parseParamsCLI( input: Partial<CLI.Params> ): CLI.Params {

    const defaultParams: CLI.Params = parseParamsCLI.DEFAULT( input );

    if ( !input ) {
        return defaultParams;
    }

    const parsed: CLI.Params = {
        ...defaultParams,
        ...input ?? {},
    };

    for ( const t_key in input ) {
        const _key = t_key as keyof CLI.Params;

        if ( typeof input[ _key ] === 'undefined' ) {
            // UPGRADE - figure this out
            // @ts-expect-error - I honestly have no idea what's going wrong here
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
 * @since 0.1.0-alpha
 */
export namespace parseParamsCLI {

    /**
     * Default arguments for {@link parseParamsCLI} function.
     * 
     * @since 0.1.0-alpha
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