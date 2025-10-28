/**
 * Types for the cli.
 *
 * @category Types
 *
 * @since 0.1.0-alpha
 *
 * @example
 * ```ts
 * import type { CLI } from '@maddimathon/build-utilities';
 * ```
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.3.0-alpha.3
 * @license MIT
 */
import type { Stage } from './Stage.js';
/**
 * Possible command options for the CLI.
 *
 * @since 0.1.0-alpha
 */
export type Command = "debug" | "help" | Stage.Name;
/**
 * All possible command line arguments.
 *
 * Assumes the args were parsed with
 * {@link https://www.npmjs.com/package/minimist | minimist}.
 *
 * For default values, see {@link parseParamsCLI.DEFAULT}.
 *
 * @since 0.1.0-alpha
 */
export interface Params {
    /**
     * Plain text (i.e., unnamed) params passed to the cli.
     *
     * @category Basics
     */
    _: string[];
    /**
     * Path, relative to the cwd or absolute, to the configuration file.
     *
     * @category Basics
     */
    config?: string;
    /**
     * Only run theses sub-stage(s), else runs them all.
     *
     * @category Sub-Stages
     */
    only: string | string[];
    /**
     * {@include ./CLI.docs.md#Only}
     *
     * @category Sub-Stages
     */
    'only-build': string | string[];
    /**
     * {@include ./CLI.docs.md#Only}
     *
     * @category Sub-Stages
     */
    'only-compile': string | string[];
    /**
     * {@include ./CLI.docs.md#Only}
     *
     * @category Sub-Stages
     */
    'only-document': string | string[];
    /**
     * {@include ./CLI.docs.md#Only}
     *
     * @category Sub-Stages
     */
    'only-package': string | string[];
    /**
     * {@include ./CLI.docs.md#Only}
     *
     * @category Sub-Stages
     */
    'only-release': string | string[];
    /**
     * {@include ./CLI.docs.md#Only}
     *
     * @category Sub-Stages
     */
    'only-snapshot': string | string[];
    /**
     * {@include ./CLI.docs.md#Only}
     *
     * @category Sub-Stages
     */
    'only-test': string | string[];
    /**
     * Exclude theses sub-stage(s), else runs them all.
     *
     * @category Sub-Stages
     */
    without: string | string[];
    /**
     * {@include ./CLI.docs.md#Without}
     *
     * @category Sub-Stages
     */
    'without-build': string | string[];
    /**
     * {@include ./CLI.docs.md#Without}
     *
     * @category Sub-Stages
     */
    'without-compile': string | string[];
    /**
     * {@include ./CLI.docs.md#Without}
     *
     * @category Sub-Stages
     */
    'without-document': string | string[];
    /**
     * {@include ./CLI.docs.md#Without}
     *
     * @category Sub-Stages
     */
    'without-package': string | string[];
    /**
     * {@include ./CLI.docs.md#Without}
     *
     * @category Sub-Stages
     */
    'without-release': string | string[];
    /**
     * {@include ./CLI.docs.md#Without}
     *
     * @category Sub-Stages
     */
    'without-snapshot': string | string[];
    /**
     * {@include ./CLI.docs.md#Without}
     *
     * @category Sub-Stages
     */
    'without-test': string | string[];
    /**
     * Display extra information that could be helpful for debugging scripts.
     *
     * @category Logging
     */
    debug: boolean;
    /**
     * The minimum log level to output.
     *
     * @category Logging
     */
    'log-base-level': number;
    /**
     * Display progress update messages after initial start message.
     *
     * @category Logging
     */
    progress: boolean;
    /**
     * Display extra status updates.
     *
     * @category Logging
     */
    verbose: boolean;
    /**
     * Indicates that this is being done as part of a {@link BuildStage}
     * script.
     *
     * @category Environment
     */
    building: boolean;
    /**
     * Indicates a package/release dry-run - i.e., make no irreversable
     * changes.
     *
     * @category Environment
     */
    dryrun: boolean;
    /**
     * Indicates that this is being done as part of a {@link PackageStage}
     * script - i.e., go full out.
     *
     * @category Environment
     */
    packaging: boolean;
    /**
     * Indicates that this is being done as part of a {@link ReleaseStage}
     * script - i.e., go full out and update all placeholders.
     *
     * @category Environment
     */
    releasing: boolean;
    /**
     * Indicates that this is being done as just before the start or watch
     * scripts (probably via npm).
     *
     * @category Environment
     */
    starting: boolean;
    /**
     * Event name that triggered a watch event.
     *
     * @category Environment - Watch
     */
    watchedEvent?: string;
    /**
     * File that triggered a watch event.
     *
     * @category Environment - Watch
     */
    watchedFilename?: string;
    /**
     * Watcher script that triggered a watch event.
     *
     * @category Environment - Watch
     */
    watchedWatcher?: string;
}
//# sourceMappingURL=CLI.d.ts.map