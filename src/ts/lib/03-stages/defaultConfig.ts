/**
 * @since ___PKG_VERSION___
 * 
 * @packageDocumentation
 */
/**
 * @package @maddimathon/build-utilities@___CURRENT_VERSION___
 */
/*!
 * @maddimathon/build-utilities@___CURRENT_VERSION___
 * @license MIT
 */

import type {
    Node,
} from '@maddimathon/utility-typescript/types';

import {
    timestamp,
} from '@maddimathon/utility-typescript/functions';

import type {
    Config,
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

import {
    ProjectConfig,
} from '../01-config/index.js';

import { getDefaultStageClass } from './getDefaultStageClass.js';


const _dummyConsole = new DummyConsole();

/**
 * Complete, default configuration for the library.
 * 
 * @category Config
 */
export function defaultConfig(
    args?: { pkg: Node.PackageJson; } | Logger,
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

        release: '@releases',
        snapshot: '.snapshots',

        dist: {
            _: 'dist',
            docs: 'docs',
            scss: 'dist/css',
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

    const stages = {
        compile: getDefaultStageClass( 'compile' ),
        build: getDefaultStageClass( 'build' ),
        document: false,
        package: getDefaultStageClass( 'package' ),
        release: getDefaultStageClass( 'release' ),
        snapshot: getDefaultStageClass( 'snapshot' ),
        test: false,
    } as const satisfies Config.Internal.Stages;

    const sass = {
        charset: true,
        sourceMap: true,
        sourceMapIncludeSources: true,
        style: 'expanded',
    } as const satisfies Required<Required<Config.Internal>[ 'compiler' ]>[ 'sass' ];


    return {

        title: pkg.config?.title ?? pkg.name,

        clr: 'black',

        compiler: {
            sass,
        },

        fs: {},

        launchYear: timestamp( null, {
            date: false,
            time: true,
            format: { time: { year: 'numeric' } },
        } ),

        paths,
        replace: ProjectConfig.replace,
        stages,

    } as const satisfies Config.Internal;
}