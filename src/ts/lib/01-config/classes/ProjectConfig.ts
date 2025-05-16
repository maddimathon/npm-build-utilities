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

import type { Objects } from '@maddimathon/utility-typescript/types';

import { typeOf } from '@maddimathon/utility-typescript/functions/typeOf';

import type {
    CLI,
    Config,
    Stage,
} from '../../../types/index.js';


/**
 * A super-simple class just for the configuration of the entire project.
 *
 * Includes some utility methods and coverts a {@link Config} object into a
 * complete {@link Config.Internal} object.
 *
 * @category Config
 *
 * @since ___PKG_VERSION___
 */
export class ProjectConfig implements Config.Class {

    public readonly clr;
    public readonly compiler;
    public readonly console;
    public readonly fs;
    public readonly paths;
    public readonly stages;
    public readonly title;

    constructor ( config: Config.Internal ) {
        this.clr = config.clr;
        this.compiler = config.compiler ?? {};
        this.console = config.console ?? {};
        this.fs = config.fs;
        this.paths = config.paths;
        this.stages = config.stages;
        this.title = config.title;
    }



    /* LOCAL METHODS
     * ====================================================================== */

    /**
     * Gets the instance for the given stage.
     * 
     * @param stage  Stage to get.
     */
    public async getStage<
        S extends Stage.Name,
        C extends NonNullable<Stage.ClassType.All[ S ]>,
        A extends Stage.Args.All[ S ],
    >(
        stage: S,
        console: Stage.Console,
        params: CLI.Params,
    ): Promise<undefined | [ C, Partial<A> ]> {

        const stageConfig = this.stages[ stage ];
        // const level = 0;

        // returns
        if ( !stageConfig ) {
            params.debug && console.progress( `no ${ stage } stage config found, skipping...`, 0, { italic: true } );
            return undefined;
        }

        let stageClass: C | undefined;
        let stageArgs: Partial<A> | undefined;

        if ( Array.isArray( stageConfig ) ) {

            const [
                _stageClass,
                _subArgs,
            ] = stageConfig;

            if ( _stageClass && typeOf( _stageClass ) === 'class' ) {
                stageClass = _stageClass as typeof _stageClass & C;
            }

            if ( _subArgs && typeof _subArgs === 'object' ) {
                stageArgs = _subArgs as typeof _subArgs & Partial<A>;
            }
        } else if ( stageConfig ) {

            const tmp_type = typeOf( stageConfig );

            switch ( tmp_type ) {

                case 'boolean':
                    break;

                case 'class':
                    stageClass = stageConfig as typeof stageConfig & C;
                    break;

                case 'object':
                    stageArgs = stageConfig as typeof stageConfig & Partial<A>;
                    break;
            }
        }

        // returns
        if ( !stageClass ) {
            console.progress( `no valid ${ stage } stage class found, skipping...`, 0, { italic: true } );
            return undefined;
        }

        return [ stageClass, stageArgs ?? {} ];
    }

    /**
     * Returns the minimum required properties of this config.
     * 
     * Useful for creating stripped-down or default configuration objects.
     */
    public minimum(): Config & Partial<Config.Internal> {
        return {
            title: this.title,
        };
    }



    /* DEFAULT METHODS
     * ====================================================================== */

    /**
     * The object shape used when converting to JSON.
     * 
     * @category Exporters
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#description | JSON.stringify}
     */
    public toJSON(): Objects.Classify<Config.Internal, never> {
        return this;
    }

    /**
     * Overrides the default function to return a string representation of this
     * object.
     * 
     * @category Exporters
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toString | Object.prototype.toString()}
     */
    public toString(): string { return JSON.stringify( this, null, 4 ); }

    /**
     * Overrides the default function to return an object representation of this
     * object.
     * 
     * @category Exporters
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/valueOf | Object.prototype.valueOf()}
     * @see {@link ProjectConfig.toJSON | ProjectConfig.toJSON()}
     */
    public valueOf() { return this.toJSON(); }
}