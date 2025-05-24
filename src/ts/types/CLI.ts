/**
 * Types for the CLI.
 * 
 * @category Types
 * 
 * @since ___PKG_VERSION___
 * 
 * @packageDocumentation
 */
/**
 * @package @maddimathon / npm - build - utilities@___CURRENT_VERSION___
 */
/*!
 * @maddimathon/build-utilities@___CURRENT_VERSION___
 * @license MIT
 */

import type * as Stage from './Stage.js';


/**
 * Possible first argument options for the CLI.
 */
export type Command =
    | "debug"
    | "help"
    | Stage.Name;

/**
 * @expand
 */
export type ParamOnlyStageKey = `only-${ Stage.Name }`;

/**
 * @expand
 */
export type ParamWithoutStageKey = `without-${ Stage.Name }`;


/**
 * All possible command line arguments.
 *
 * Assumes the args were parsed with
 * {@link https://www.npmjs.com/package/minimist | minimist}.
 *
 * @since ___PKG_VERSION___
 * 
 * @interface
 */
export type Params = {

    /**
     * Plain text (i.e., unnamed) params passed to the cli.
     */
    _: string[];

    /**
     * Path, relative to the cwd or absolute, to the configuration file.
     */
    config?: string;

    /**
     * Only run theses sub-stage(s), else runs them all.
     */
    only: string | string[];

    /**
     * Exclude theses sub-stage(s), else runs them all.
     */
    without: string | string[];

} & {

    /**
     * Passed as `only` param to instances of SubStage run by other stages.
     */
    [ K in ParamOnlyStageKey ]: string | string[];

} & {

    /**
     * Passed as `without` param to instances of SubStage run by other stages.
     */
    [ K in ParamWithoutStageKey ]: string | string[];

} & {


    /* ## LOG MESSAGES ===================================== */

    /**
     * Display extra information that could be helpful for debugging scripts.
     * 
     * @default false
     */
    debug: boolean;

    /**
     * The minimum log level to output.
     * 
     * @default 0
     */
    'log-base-level': number;

    /**
     * Display notice when starting/ending.
     * 
     * @default true
     */
    notice: boolean;

    /**
     * Display progress update messages after initial notice.
     * 
     * @default true
     */
    progress: boolean;

    /**
     * Display extra status updates.
     * 
     * @default false
     */
    verbose: boolean;


    /* ## STAGE FLAGS ===================================== */
    /* these are values used to indicate that another build script is being run */

    /**
     * Indicates that this is being done as part of a {@link BuildStage}
     * script.
     */
    building: boolean;

    /**
     * Indicates a package/release dry-run - i.e., make no irreversable
     * changes.
     */
    dryrun: boolean;

    /**
     * Indicates that this is being done as part of a {@link PackageStage}
     * script - i.e., go full out.
     */
    packaging: boolean;

    /**
     * Indicates that this is being done as part of a {@link ReleaseStage}
     * script - i.e., go full out and update all placeholders.
     */
    releasing: boolean;

    /**
     * Indicates that this is being done as just before the start or watch
     * scripts (probably via npm).
     */
    starting: boolean;


    /* ### Watching-Related ------------------ */

    /**
     * Event name that triggered a watch event.
     */
    watchedEvent?: string;

    /**
     * File that triggered a watch event.
     */
    watchedFilename?: string;

    /**
     * Watcher script that triggered a watch event.
     */
    watchedWatcher?: string;
};