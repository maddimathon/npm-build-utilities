/**
 * @since 0.1.0-alpha
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.3.0-alpha.1.draft
 * @license MIT
 */
import { defaultConfig } from './defaultConfig.js';
import { getDefaultStageClass } from './getDefaultStageClass.js';
/**
 * Converts a single config stage to an internal config stage.
 *
 * @hidden
 */
function _internalConfig_stage(name, config) {
    // returns - sets stage to false first
    if (typeof config === 'undefined' || config === false) {
        return false;
    }
    let internalStage;
    // returns - use default class
    if (config === true) {
        switch (name) {
            case 'compile':
            case 'build':
            case 'document':
            case 'package':
            case 'release':
            case 'snapshot':
            case 'test':
                internalStage = [getDefaultStageClass(name)];
                return internalStage;
        }
        return false;
    }
    // returns - this is a class input
    if (typeof config === 'function') {
        if (typeof config.prototype !== 'undefined') {
            internalStage = [config];
            return internalStage;
        }
        return false;
    }
    // returns - this is a class + args input
    if (Array.isArray(config)) {
        // confirms this is a class
        if (
            typeof config[0] === 'function'
            && typeof config[0].prototype !== 'undefined'
        ) {
            internalStage = config[1] ? [config[0], config[1]] : [config[0]];
            return internalStage;
        }
        return false;
    }
    const _defaultStage = getDefaultStageClass(name);
    // returns - the args were input
    if (_defaultStage) {
        internalStage = [_defaultStage, config];
        return internalStage;
    }
    return false;
}
/**
 * Takes a partial {@link Config} object and converts it to a
 * {@link Config.Internal} object.
 *
 * @category Config
 *
 * @param inputConfig  Partial config to complete.
 * @param console      Instance used to log messages and debugging info.
 *
 * @return  Complete object ready for {@link ProjectConfig}.
 *
 * @since 0.1.0-alpha
 *
 * @internal
 */
export function internalConfig(inputConfig, console) {
    const def = defaultConfig(console);
    const stages = def.stages;
    if (inputConfig.stages) {
        for (const t_stage in inputConfig.stages) {
            const _stage = t_stage;
            const _input = inputConfig.stages[_stage];
            // @ts-expect-error - confusing me
            stages[_stage] = _internalConfig_stage(_stage, _input);
        }
    }
    const paths = def.paths;
    if (inputConfig.paths) {
        for (const t_path in inputConfig.paths) {
            const _path = t_path;
            // continues
            if (typeof inputConfig.paths[_path] === 'undefined') {
                continue;
            }
            switch (_path) {
                case 'dist':
                    switch (typeof inputConfig.paths[_path]) {
                        case 'function':
                            paths[_path] = {
                                _: inputConfig.paths[_path](),
                                docs: inputConfig.paths[_path]('docs'),
                                scss: inputConfig.paths[_path]('scss'),
                            };
                            break;
                        case 'string':
                            const _distDirString = inputConfig.paths[
                                _path
                            ].replace(/\/$/gi, '');
                            paths[_path] = {
                                _: _distDirString,
                                docs: _distDirString + '/docs',
                                scss: _distDirString + '/scss',
                            };
                            break;
                        case 'object':
                            paths[_path] = {
                                ...def.paths[_path],
                                ...inputConfig.paths[_path],
                            };
                            break;
                    }
                    break;
                case 'notes':
                    paths[_path] = {
                        ...def.paths[_path],
                        ...inputConfig.paths[_path],
                    };
                    break;
                case 'scripts':
                    switch (typeof inputConfig.paths[_path]) {
                        case 'string':
                            const _scriptsDirString = inputConfig.paths[
                                _path
                            ].replace(/\/$/gi, '');
                            paths[_path] = {
                                _: _scriptsDirString,
                                logs: _scriptsDirString + '/logs',
                            };
                            break;
                        case 'object':
                            paths[_path] = {
                                ...def.paths[_path],
                                ...inputConfig.paths[_path],
                            };
                            break;
                    }
                    break;
                case 'src':
                    switch (typeof inputConfig.paths[_path]) {
                        case 'function':
                            paths[_path] = {
                                _: inputConfig.paths[_path](),
                                docs: inputConfig.paths[_path]('docs'),
                                scss: inputConfig.paths[_path]('scss'),
                                ts: inputConfig.paths[_path]('ts'),
                            };
                            break;
                        case 'object':
                            paths[_path] = {
                                ...def.paths[_path],
                                ...inputConfig.paths[_path],
                            };
                            break;
                    }
                    break;
                default:
                    paths[_path] = inputConfig.paths[_path];
                    break;
            }
        }
    }
    return {
        ...def,
        ...inputConfig,
        paths,
        stages,
        compiler: {
            ...def.compiler,
            ...(inputConfig.compiler ?? {}),
        },
    };
}
//# sourceMappingURL=internalConfig.js.map
