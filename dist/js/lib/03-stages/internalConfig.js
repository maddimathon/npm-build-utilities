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
import { mergeArgs } from '@maddimathon/utility-typescript/functions';
import { defaultConfig } from './defaultConfig.js';
import { CompileStage } from './classes/CompileStage.js';
import { BuildStage } from './classes/BuildStage.js';
import { DocumentStage } from './classes/DocumentStage.js';
import { PackageStage } from './classes/PackageStage.js';
import { ReleaseStage } from './classes/ReleaseStage.js';
import { SnapshotStage } from './classes/SnapshotStage.js';
import { TestStage } from './classes/TestStage.js';
/**
 * Takes a partial {@link Config} object and converts it to a
 * {@link Config.Internal} object.
 *
 * @category Config
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
            // continues - sets stage to false first
            if (typeof _input === 'undefined' || _input === false) {
                stages[_stage] = false;
                continue;
            }
            // continues - use default class
            if (_input === true) {
                switch (_stage) {
                    case 'compile':
                        stages[_stage] = CompileStage;
                        continue;
                    case 'build':
                        stages[_stage] = BuildStage;
                        continue;
                    case 'document':
                        stages[_stage] = DocumentStage;
                        continue;
                    case 'package':
                        stages[_stage] = PackageStage;
                        continue;
                    case 'release':
                        stages[_stage] = ReleaseStage;
                        continue;
                    case 'snapshot':
                        stages[_stage] = SnapshotStage;
                        continue;
                    case 'test':
                        stages[_stage] = TestStage;
                        continue;
                }
                continue;
            }
            // continues - this is a class input
            if (typeof _input === 'function') {
                if (typeof _input.prototype !== 'undefined') {
                    stages[_stage] = _input;
                }
                continue;
            }
            // continues - this is a class + args input
            if (Array.isArray(_input)) {
                // confirms this is a class
                if (
                    typeof _input[0] === 'function'
                    && typeof _input[0].prototype !== 'undefined'
                ) {
                    stages[_stage] = _input[1]
                        ? [_input[0], _input[1]]
                        : _input[0];
                }
                continue;
            }
            // continues - the args were input
            if (def.stages[_stage]) {
                stages[_stage] = [def.stages[_stage], _input];
                continue;
            }
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
                case 'scripts':
                    switch (typeof inputConfig.paths[_path]) {
                        case 'string':
                            const _distDirString = inputConfig.paths[
                                _path
                            ].replace(/\/$/gi, '');
                            paths[_path] = {
                                _: _distDirString,
                                logs: _distDirString + '/logs',
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
            tsConfig: mergeArgs(
                def.compiler.tsConfig,
                inputConfig.compiler?.tsConfig ?? {},
                true,
            ),
        },
    };
}
//# sourceMappingURL=internalConfig.js.map
