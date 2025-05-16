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
import { getPackageJson } from '../00-universal/getPackageJson.js';
import { BuildStage, CompileStage, PackageStage, ReleaseStage, SnapshotStage, } from './index.js';
/**
 * Complete, default configuration for the library.
 */
export function defaultConfig(pkg) {
    var _a, _b;
    if (!pkg) {
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
            target: 'es2018',
        },
    };
    return {
        title: (_b = (_a = pkg.config) === null || _a === void 0 ? void 0 : _a.title) !== null && _b !== void 0 ? _b : pkg.name,
        clr: 'purple',
        compiler: {
            sass: {
                charset: true,
                sourceMap: true,
                sourceMapIncludeSources: true,
                style: 'expanded',
            },
            tsConfig,
        },
        fs: {},
        paths,
        stages,
    };
}
//# sourceMappingURL=defaultConfig.js.map