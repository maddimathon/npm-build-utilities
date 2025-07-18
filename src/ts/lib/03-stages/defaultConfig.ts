/**
 * @since 0.1.0-alpha
 * 
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@___CURRENT_VERSION___
 * @license MIT
 */

import type {
    Json,
} from '@maddimathon/utility-typescript/types';

import {
    timestamp,
} from '@maddimathon/utility-typescript/functions';

import type {
    Config,
    Stage,
} from '../../types/index.js';

import type { Logger } from '../../types/Logger.js';

import {
    DummyConsole,
} from '../@internal/index.js';

import { getPackageJson } from '../00-universal/getPackageJson.js';

import {
    catchOrReturn,

    FileSystem,
} from '../00-universal/index.js';

import { getDefaultStageClass } from './getDefaultStageClass.js';


const _dummyConsole = new DummyConsole();

/**
 * Complete, default configuration for the library.
 * 
 * @category Config
 * 
 * @param args  Either the package.json value or a Logger instance to use in 
 *              {@link internal.getPackageJson}.
 * 
 * @return  Default configuration values.  Satisfies {@link Config.Internal}.
 * 
 * @since 0.1.0-alpha
 */
export function defaultConfig(
    args?: { pkg: Json.PackageJson; } | Logger,
) {
    const fs = new FileSystem( ( args && !( 'pkg' in args ) ) ? args : _dummyConsole );

    const pkg = ( args && ( 'pkg' in args ) )
        ? args.pkg
        : catchOrReturn(
            getPackageJson,
            0,
            fs.console,
            fs,
            [ fs ],
        );

    const paths = {

        changelog: 'CHANGELOG.md',
        readme: 'README.md',
        release: '@releases',
        snapshot: '.snapshots',

        dist: {
            _: 'dist',
            docs: 'docs',
            scss: 'dist/css',
        },

        notes: {
            release: '.releasenotes.md',
        },

        scripts: {
            _: '.scripts',
            logs: '.scripts/logs',
        },

        src: {
            _: 'src',
            docs: 'src/docs',
            scss: 'src/scss',
            ts: 'src/ts',
        },
    } as const satisfies Config.Internal[ 'paths' ];

    const replace = ( _stage: Stage ) => {

        const _currentDate = timestamp( null, {
            time: false,
            date: true,
        } );

        const _currentYear = timestamp( null, {
            time: false,
            date: true,
            format: {
                date: {
                    year: 'numeric',
                },
            },
        } );

        return {

            current: [
                [ /___(CURRENT)_DATE___/g, _currentDate ],
                [ /___(CURRENT)_DESC(RIPTION)?___/g, _stage.pkg.description ?? '' ],
                [ /___(CURRENT)_(HOMEPAGE|URL)___/g, _stage.pkg.homepage ?? '' ],
                [ /___(CURRENT)_VERSION___/g, _stage.version.toString( _stage.isDraftVersion ) ],
                [ /___(CURRENT)_YEAR___/g, _currentYear ],
            ],

            package: [
                [ /___(PKG)_DATE___/g, _currentDate ],
                [ /___(PKG)_VERSION___/g, _stage.version.toString( _stage.isDraftVersion ) ],
                [ /___(PKG)_YEAR___/g, _currentYear ],
            ],
        } satisfies Config.Replace;
    };

    const stages = {
        compile: [ getDefaultStageClass( 'compile' ) ],
        build: [ getDefaultStageClass( 'build' ) ],
        document: false,
        package: [ getDefaultStageClass( 'package' ) ],
        release: [ getDefaultStageClass( 'release' ) ],
        snapshot: [ getDefaultStageClass( 'snapshot' ) ],
        test: false,
    } as const satisfies Config.Internal.Stages;

    const title: string = pkg.config?.title ?? pkg.name;

    return {

        title,

        clr: 'black',

        compiler: {},

        console: {},

        fs: {},

        launchYear: timestamp( null, {
            date: false,
            time: true,
            format: { time: { year: 'numeric' } },
        } ),

        paths,
        replace,
        stages,

    } as const satisfies Config.Internal;
}