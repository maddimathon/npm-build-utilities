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
import { mergeArgs, } from '@maddimathon/utility-typescript/functions';
import { defaultConfig } from './defaultConfig.js';
/**
 * Takes a partial {@link Config} object and converts it to a
 * {@link Config.Internal} object.
 *
 * @category Config
 *
 * @internal
 */
export function internalConfig(_config, console) {
    const def = defaultConfig(console);
    const config = {
        ...def,
        ..._config,
        paths: {
            ...def.paths,
            ..._config.paths,
        },
        stages: {
            ...def.stages,
            ..._config.stages,
        },
        compiler: {
            ...def.compiler,
            ..._config.compiler ?? {},
            tsConfig: mergeArgs(def.compiler.tsConfig, _config.compiler?.tsConfig ?? {}, true),
        },
    };
    const stages = def.stages;
    if (config.stages) {
        for (const _stage in config.stages) {
            const stage = _stage;
            const stageConfig = config.stages[stage];
            // continues
            if (typeof stageConfig === 'undefined') {
                continue;
            }
            let stageClass = def.stages[stage] || undefined;
            let stageArgs = undefined;
            // continues
            if (typeof stageConfig === 'undefined') {
                continue;
            }
            // continues
            if (Array.isArray(stageConfig)) {
                const [tmp_0, tmp_1] = stageConfig;
                if (tmp_0 && typeof tmp_0 === 'function') {
                    stageClass = tmp_0;
                }
                if (tmp_1 && typeof tmp_1 === 'object') {
                    stageArgs = tmp_1;
                }
                if (stageClass) {
                    stages[stage] = [stageClass, stageArgs];
                }
                continue;
            }
            // continues
            switch (typeof stageConfig) {
                case 'boolean':
                    if (!stageConfig) {
                        stages[stage] = false;
                    }
                    continue;
                    break;
                case 'object':
                    // is an args object
                    if (stageClass) {
                        stages[stage] = [stageClass, stageConfig];
                    }
                    continue;
                    break;
                default:
                    stages[stage] = stageConfig;
                    continue;
                    break;
            }
        }
    }
    const paths = {
        ...config.paths,
        dist: typeof config.paths.dist === 'function'
            ? {
                _: config.paths.dist(),
                docs: config.paths.dist('docs'),
                scss: config.paths.dist('scss'),
                ts: config.paths.dist('ts'),
            }
            : (typeof config.paths.dist === 'object'
                ? {
                    _: 'dist',
                    docs: 'docs',
                    scss: 'dist/scss',
                    ts: 'dist/js',
                    ...config.paths.dist,
                }
                : config.paths.dist),
        src: typeof config.paths.src === 'function'
            ? {
                _: config.paths.src(),
                docs: config.paths.src('docs'),
                scss: config.paths.src('scss'),
                ts: config.paths.src('ts'),
            }
            : {
                _: 'src',
                docs: 'src/docs',
                scss: 'src/scss',
                ts: 'src/ts',
                ...config.paths.src,
            },
    };
    return {
        ...config,
        paths,
        stages,
    };
}
//# sourceMappingURL=internalConfig.js.map