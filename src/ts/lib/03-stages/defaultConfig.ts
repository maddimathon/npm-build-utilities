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
    Json,
    Node,
} from '@maddimathon/utility-typescript/types';

import type {
    Config,
    Logger,
} from '../../types/index.js';

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

import {
    BuildStage,
    CompileStage,
    PackageStage,
    ReleaseStage,
    SnapshotStage,
} from './index.js';

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
            ts: 'dist/js',
        },

        src: {
            _: 'src',
            docs: 'src/docs',
            scss: 'src/scss',
            ts: 'src/ts',
        },
    } as const satisfies Config.Internal[ 'paths' ];

    const stages = {
        compile: CompileStage,
        build: BuildStage,
        document: false,
        package: PackageStage,
        release: ReleaseStage,
        snapshot: SnapshotStage,
        test: false,
    } as const satisfies Config.Internal.Stages;


    const tsConfig = {

        extends: [
            '@tsconfig/node20/tsconfig.json',
        ],
        exclude: [
            '**/node_modules/**/*',
        ],

        compilerOptions: {
            allowJs: true,
            checkJs: true,
            declaration: true,
            declarationMap: true,
            esModuleInterop: true,
            exactOptionalPropertyTypes: false,
            forceConsistentCasingInFileNames: true,
            lib: [ 'ES2022' ],
            module: 'node18',
            moduleResolution: 'node16',
            noFallthroughCasesInSwitch: true,
            noImplicitAny: true,
            noImplicitOverride: true,
            noImplicitReturns: true,
            noImplicitThis: true,
            noUnusedLocals: true,
            pretty: true,
            removeComments: false,
            resolveJsonModule: true,
            skipLibCheck: true,
            sourceMap: true,
            strict: true,
            strictBindCallApply: true,
            target: 'es2022',
        },
    } as const satisfies Json.TsConfig;

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
            tsConfig,
        },

        fs: {},

        paths,
        replace: ProjectConfig.replace,
        stages,

    } as const satisfies Config.Internal;
}