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
import { DummyConsole, } from '../@internal/index.js';
import { getPackageJson } from '../00-universal/getPackageJson.js';
import { catchOrReturn, FileSystem, } from '../00-universal/index.js';
import { BuildStage, CompileStage, PackageStage, ReleaseStage, SnapshotStage, } from './index.js';
const _dummyConsole = new DummyConsole();
/**
 * Complete, default configuration for the library.
 *
 * @category Config
 */
export function defaultConfig(args) {
    const pkg = (args && ('pkg' in args))
        ? args.pkg
        : catchOrReturn(getPackageJson, 0, args ?? _dummyConsole, [new FileSystem(args ?? _dummyConsole)]);
    const stages = {
        compile: CompileStage,
        build: BuildStage,
        document: false,
        package: PackageStage,
        release: ReleaseStage,
        snapshot: SnapshotStage,
        test: false,
    };
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
    };
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
            lib: ['ES2022'],
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
    };
    const sass = {
        charset: true,
        sourceMap: true,
        sourceMapIncludeSources: true,
        style: 'expanded',
    };
    return {
        title: pkg.config?.title ?? pkg.name,
        clr: 'purple',
        compiler: {
            sass,
            tsConfig,
        },
        fs: {},
        paths,
        stages,
    };
}
//# sourceMappingURL=defaultConfig.js.map