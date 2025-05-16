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

import type { Node } from '@maddimathon/utility-typescript/types';

import type {
    Config,
    // Stage,
} from '../../types/index.js';

import { getPackageJson } from '../00-universal/getPackageJson.js';

import {
    BuildStage,
    CompileStage,
    PackageStage,
    ReleaseStage,
    SnapshotStage,
} from './index.js';

/**
 * Complete, default configuration for the library.
 */
export function defaultConfig( pkg?: Node.PackageJson ) {

    if ( !pkg ) {
        pkg = getPackageJson();
    }

    const stages = {
        compile: CompileStage,
        build: BuildStage,
        document: false,
        package: PackageStage,
        release: ReleaseStage,
        snapshot: SnapshotStage,
        test: false,
    } as const satisfies Config.Internal[ 'stages' ];

    const paths = {

        release: '@releases',
        snapshot: '.snapshots',

        dist: {
            _: 'dist',
            docs: 'docs',
            scss: 'dist/css',
            ts: 'dist/ts',
        },

        src: {
            docs: 'src/docs',
            scss: 'src/scss',
            ts: 'src/ts',
        },
    } as const satisfies Config.Internal[ 'paths' ];

    return {

        title: pkg.config?.title ?? pkg.name,

        clr: 'purple',

        compiler: {
            sass: {
                charset: true,
                sourceMap: true,
                sourceMapIncludeSources: true,
                style: 'expanded',
            },
        },

        fs: {},

        paths,
        stages,

    } as const satisfies Config.Internal;
}