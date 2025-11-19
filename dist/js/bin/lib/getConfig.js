/**
 * @since 0.1.0-alpha
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.3.0-alpha.9
 * @license MIT
 */
import { timestamp } from '@maddimathon/utility-typescript/functions';
import { VariableInspector } from '@maddimathon/utility-typescript/classes';
import { getPackageJson } from '../../lib/00-universal/getPackageJson.js';
import { FileSystem, Project, ProjectConfig } from '../../lib/index.js';
import {
    isConfigValid,
    internalConfig,
    getDefaultStageClass,
    logError,
} from '../../lib/@internal.js';
/**
 * Gets the configuration object for the current node package.
 *
 * Prompts the user in the terminal as needed to complete the configuration.
 *
 * @param params   Input CLI params to convert.
 * @param console  Instance used to log messages and debugging info.
 * @param level    Depth level for this message.
 *
 * @returns  Complete config instance.
 *
 * @since 0.1.0-alpha
 * @since 0.1.4-alpha — Experimental support for typescript config files.
 *
 * @internal
 */
export async function getConfig(params, console = null, level = 0) {
    if (!console) {
        console = await Project.getConsole({
            name: 'getConfig',
            params,
        });
    }
    if (params.debug) {
        console.progress('[getConfig] Debugging some info...', level);
        level++;
    }
    const defaultConfigPaths = [
        '.scripts/build.config.js',
        'build-utils.config.js',
    ];
    const pathsToCheck = [params.config, ...defaultConfigPaths];
    /** Pulled from an existing config file. */
    let config;
    /** Index of the path currently behind checked. */
    let i = 0;
    /** Maximum number of times to loop while checking for a config file. */
    const maxInterations = pathsToCheck.length;
    const fs = new FileSystem(console);
    console.debug('Checking config paths...', level);
    while (!config && i < maxInterations) {
        let path = pathsToCheck[i];
        i++;
        // continues
        if (!path) {
            continue;
        }
        console.debug(
            `path #${i.toString()}: ${VariableInspector.stringify({ path })}`,
            1 + level,
        );
        path = fs.pathResolve(path);
        // continues
        if (!fs.exists(path)) {
            continue;
        }
        // TODO - document why this is here
        const content = (await import(path + '?t=' + Date.now())).default;
        console.vi.debug({ content }, 2 + level);
        if (content && typeof content === 'object') {
            config = content;
            console.debug('content approved for config', 2 + level);
        }
    }
    if (!config) {
        config = {};
    }
    const pkg = getPackageJson(fs);
    const validConfig = isConfigValid(
        config !== null && config !== void 0 ? config : {},
    );
    // returns
    if (validConfig) {
        console.vi.debug({ 'valid config': config }, 1 + level);
        const configInstance = new ProjectConfig(
            internalConfig(validConfig, console),
        );
        console.vi.debug({ return: configInstance }, level);
        return configInstance;
    }
    // adds config from package.json as backup defaults
    config = {
        ...pkg.config,
        ...config,
    };
    console.vi.debug({ 'partial config': config }, 1 + level);
    /**
     * What to do since no valid config was found.
     */
    const noConfigPrompt = await console.prompt.select(
        'No valid config file was found.  What next?',
        level,
        {
            choices: [
                {
                    name: 'Create new config file',
                    value: 'create-new',
                },
                {
                    name: 'Don’t create a config file and proceed',
                    value: 'proceed',
                    description:
                        'You will still be prompted for the values of required fields.',
                },
                {
                    name: 'Cancel script and exit',
                    value: 'cancel',
                },
            ],
            msgArgs: {
                linesIn: 1,
            },
        },
    );
    // exits process
    if (noConfigPrompt === 'cancel') {
        process.exit();
    }
    const msgArgs = {
        linesIn: 0,
    };
    const currentYear = timestamp(null, {
        date: false,
        time: true,
        format: { time: { year: 'numeric' } },
    });
    // the basic minimum object
    /**
     * Basic minimum config constructed because no valid config was found.
     */
    let newConfig = {
        title:
            (await console.prompt.input(
                'What’s the project’s title? (human-readable, title case)',
                level,
                {
                    default: config.title,
                    required: true,
                    msgArgs,
                },
            )) ?? '',
        launchYear:
            (await console.prompt.input(
                'What’s the project’s launch year? (four digits)',
                level,
                {
                    default: config.launchYear ?? currentYear,
                    required: true,
                    msgArgs,
                },
            )) ?? currentYear,
    };
    let newCompleteConfig = undefined;
    if (
        await console.prompt.bool(
            'Do you want to configure optional arguments too?',
            level,
            { msgArgs },
        )
    ) {
        msgArgs.linesIn = 1;
        const defaultConfig = internalConfig(newConfig, console);
        newCompleteConfig = {
            ...defaultConfig,
            paths: {
                ...defaultConfig.paths,
                release:
                    (await console.prompt.input(
                        'What is the path for the release directory?',
                        level,
                        {
                            default: defaultConfig.paths.release,
                            msgArgs,
                        },
                    )) ?? defaultConfig.paths.release,
                snapshot:
                    (await console.prompt.input(
                        'What is the path for the snapshot directory?',
                        level,
                        {
                            default: defaultConfig.paths.snapshot,
                            msgArgs,
                        },
                    )) ?? defaultConfig.paths.snapshot,
            },
            stages: {
                ...defaultConfig.stages,
                document:
                    (
                        (await console.prompt.bool(
                            'Include document stage?',
                            level,
                            {
                                default: !!defaultConfig.stages.document,
                                msgArgs,
                            },
                        ))
                    ) ?
                        [getDefaultStageClass('document')]
                    :   false,
                snapshot:
                    (
                        (await console.prompt.bool(
                            'Include snapshot stage?',
                            level,
                            {
                                default: !!defaultConfig.stages.snapshot,
                                msgArgs,
                            },
                        ))
                    ) ?
                        [getDefaultStageClass('snapshot')]
                    :   false,
                test:
                    (
                        (await console.prompt.bool(
                            'Include test stage?',
                            level,
                            {
                                default: !!defaultConfig.stages.test,
                                msgArgs,
                            },
                        ))
                    ) ?
                        [getDefaultStageClass('test')]
                    :   false,
            },
        };
    }
    const builtConfig = internalConfig(newCompleteConfig ?? newConfig, console);
    const configInstance = new ProjectConfig(builtConfig);
    console.vi.debug({ return: configInstance }, level);
    // returns
    if (noConfigPrompt !== 'create-new') {
        return configInstance;
    }
    /** Path for writing the config file. */
    const configPath =
        (await console.prompt.select(
            'Where should we write the config file?',
            level,
            {
                choices: defaultConfigPaths,
                msgArgs,
            },
        )) ?? defaultConfigPaths[0];
    // returns
    if (!configPath) {
        return configInstance;
    }
    /** Whether to force-write the config file. */
    const force =
        fs.exists(configPath) ?
            await console.prompt.bool(
                'Should the new config file overwrite the current file at `'
                    + configPath
                    + '`?',
                level,
                { msgArgs },
            )
        :   true;
    const configFileContent = [
        `#!/usr/bin/env node`,
        `// @ts-check`,
        `'use strict';`,
        ``,
        `/**`,
        ` * @import { Config } from "@maddimathon/build-utilities"`,
        ` */`,
        ``,
        `/**`,
        ` * @type {Config}`,
        ` */`,
        'const config = '
            + JSON.stringify(configInstance.export(), null, 4)
            + ';',
        ``,
        `export default config;`,
    ].join('\n');
    console.vi.debug({ configFileContent }, level);
    fs.write(configPath, configFileContent, { force });
    return fs
        .prettier(configPath, 'js')
        .catch((error) => {
            logError(
                'Error caught while trying to run prettier on config file; rewriting config file without formatting',
                error,
                level,
                { console, fs },
            );
            // re-writing to make sure the file is at least valid
            fs.write(configPath, configFileContent, { force });
        })
        .then(() => configInstance);
}
//# sourceMappingURL=getConfig.js.map
