/**
 * @since ___PKG_VERSION___
 * 
 * @packageDocumentation
 */
/**
 * @package @maddimathon/npm-build-utilities@___CURRENT_VERSION___
 */
/*!
 * @maddimathon/npm-build-utilities@___CURRENT_VERSION___
 * @license MIT
 */

import type {
    CLI,
    Config,
    Logger,
    Stage,
} from '../../../types/index.js';

import { DummyConsole } from '../../@internal/index.js';

import {
    parseParamsCLI,
    ProjectConfig,
} from '../../01-config/index.js';

// import {
// } from '../../02-utils/index.js';

import { Stage_Console } from '../../02-utils/classes/Stage_Console.js';

import {
    defaultConfig,
} from '../../03-stages/defaultConfig.js';

/**
 * Manages and runs a single project (typically used by the cli).
 * 
 * @category Project
 * 
 * @since ___PKG_VERSION___
 */
export class Project {



    /* STATIC METHODS
     * ====================================================================== */

    public static async getConsole(
        opts: {
            name?: string,
            params?: CLI.Params,
            config?: ProjectConfig,
        } = {},
    ): Promise<Stage_Console> {

        const params = opts.params ?? parseParamsCLI( {} );
        const config = opts.config ?? new ProjectConfig( defaultConfig( new DummyConsole() ) );

        return new Stage_Console(
            // opts.name ?? 'Package',
            config.clr,
            config,
            params,
            // {
            //     clr: config.clr ?? 'purple',
            //     ...config.console,
            // },
        );
    }



    /* LOCAL PROPERTIES
     * ====================================================================== */

    /**
     * The configuration for this project.
     */
    public readonly config: ProjectConfig;



    /* CONSTRUCUTOR
     * ====================================================================== */

    /**
     * Constructs the class.
     * 
     * @param config  Complete project config.
     * @param params  Complete CLI params.
     */
    constructor (
        config: Config.Internal | ProjectConfig,
        public readonly params: CLI.Params,
    ) {

        this.config = config instanceof ProjectConfig
            ? config
            : new ProjectConfig( config );
    }



    /* LOCAL METHODS
     * ====================================================================== */

    /**
     * Displays some debugging information.
     */
    protected async debug<S extends Stage.Name>(
        console: Logger,
        stageClass: null | Stage.ClassType.All[ S ],
        stageArgs: null | Partial<Stage.Args.All[ S ]>,
        stageInstance: null | Stage.Class.All[ S ],
    ): Promise<void> {
        const level = this.params[ 'log-base-level' ];

        console.progress( '[Project] Debugging some info...', level );

        stageClass && console.vi.progress( { stageClass }, 1 + level );
        stageArgs && console.vi.progress( { stageArgs }, 1 + level );
        stageInstance && console.vi.progress( {
            stageInstance: {
                // config: stageInstance.config,
                params: stageInstance.params,
                args: stageInstance.args,
            }
        }, 1 + level );
    }

    /**
     * Runs the given stage with the params.
     */
    public async run( stage: "debug" | Stage.Name ): Promise<void> {

        const console = await Project.getConsole( {
            name: stage,
            config: this.config,
            params: this.params,
        } );

        // returns
        if ( stage === 'debug' ) {
            return this.debug( console, null, null, null );
        }

        const [
            stageClass,
            stageArgs = {},
        ] = await this.config.getStage(
            stage,
            console,
            this.params
        ) ?? [];

        // returns
        if ( !stageClass ) {

            if ( this.params.debug ) {
                await this.debug( console, stageClass, stageArgs ?? null, null );
            }
            return;
        }

        const inst = new stageClass( this.config, this.params, stageArgs );

        if ( this.params.debug ) {
            await this.debug( console, stageClass, stageArgs ?? null, inst );
        }

        return inst.run();
    }
}