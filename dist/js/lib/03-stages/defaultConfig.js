/**
 * @since 0.1.0-alpha.draft
 *
 * @packageDocumentation
 */
/**
 * @package @maddimathon/build-utilities@0.1.0-alpha.draft
 */
/*!
 * @maddimathon/build-utilities@0.1.0-alpha.draft
 * @license MIT
 */
import { timestamp } from '@maddimathon/utility-typescript/functions';
import { DummyConsole } from '../@internal/index.js';
import { getPackageJson } from '../00-universal/getPackageJson.js';
import { catchOrReturn, FileSystem } from '../00-universal/index.js';
import { ProjectConfig } from '../01-config/index.js';
import { getDefaultStageClass } from './getDefaultStageClass.js';
const _dummyConsole = new DummyConsole();
/**
 * Complete, default configuration for the library.
 *
 * @category Config
 */
export function defaultConfig(args) {
    const fs = new FileSystem(args && !('pkg' in args) ? args : _dummyConsole);
    const pkg =
        args && 'pkg' in args
            ? args.pkg
            : catchOrReturn(getPackageJson, 0, fs.console, fs, [fs]);
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
    };
    const stages = {
        compile: getDefaultStageClass('compile'),
        build: getDefaultStageClass('build'),
        document: false,
        package: getDefaultStageClass('package'),
        release: getDefaultStageClass('release'),
        snapshot: getDefaultStageClass('snapshot'),
        test: false,
    };
    const sass = {
        charset: true,
        sourceMap: true,
        sourceMapIncludeSources: true,
        style: 'expanded',
    };
    return {
        title: pkg.config?.title ?? pkg.name,
        clr: 'black',
        compiler: {
            sass,
        },
        fs: {},
        launchYear: timestamp(null, {
            date: false,
            time: true,
            format: { time: { year: 'numeric' } },
        }),
        paths,
        replace: ProjectConfig.replace,
        stages,
    };
}
//# sourceMappingURL=defaultConfig.js.map
