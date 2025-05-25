/**
 * @since ___PKG_VERSION___
 * 
 * @packageDocumentation
 */
/**
 * @package @maddimathon/build-utilities@___CURRENT_VERSION___
 */
/*!
 * @maddimathon/build-utilities@___CURRENT_VERSION___
 * @license MIT
 */

import type { Objects } from '@maddimathon/utility-typescript/types';

import {
    timestamp,
    typeOf,
} from '@maddimathon/utility-typescript/functions';

import type {
    Config,
    Logger,
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

    static replace( stage: Stage.Class ): Config.Replace {

        const _currentDate = timestamp( null, {
            time: false,
            date: true,
        } );

        const _currentYear = timestamp( null, {
            time: false,
            date: true,
            format: {
                date: {
                    year: 'numeric',
                },
            },
        } );

        const rpl: Config.Replace = {

            current: [
                [ /___CURRENT_DATE___/g, _currentDate ],
                [ /___CURRENT_DESC(RIPTION)?___/g, stage.pkg.description ?? '' ],
                [ /___CURRENT_(HOMEPAGE|URL)___/g, stage.pkg.homepage ?? '' ],
                [ /___CURRENT_VERSION___/g, stage.version.toString( stage.isDraftVersion ) ],
                [ /___CURRENT_YEAR___/g, _currentYear ],
            ],

            package: [
                [ /___PKG_DATE___/g, _currentDate ],
                [ /___PKG_VERSION___/g, stage.version.toString( stage.isDraftVersion ) ],
                [ /___PKG_YEAR___/g, _currentYear ],
            ],
        };
        stage.console.vi.log( { 'ProjectConfig.replace()': rpl }, 1 );
        return rpl;
    }

    public readonly clr;
    public readonly compiler;
    public readonly console;
    public readonly fs;
    public readonly paths;
    public readonly replace;
    public readonly stages;
    public readonly title;

    constructor ( config: Config.Internal ) {
        this.clr = config.clr;
        this.compiler = config.compiler ?? {};
        this.console = config.console ?? {};
        this.fs = config.fs;
        this.paths = config.paths;
        this.replace = config.replace;
        this.stages = config.stages;
        this.title = config.title;

        if (
            this.stages.compile
            && Array.isArray( this.stages.compile )
        ) {

            // const _compileArgs = this.stages.compile[ 1 ] ?? {};
            if ( !this.stages.compile[ 1 ] ) {
                this.stages.compile[ 1 ] = {};
            }

            if (
                this.stages.compile[ 1 ].files
                && typeof this.stages.compile[ 1 ].files === 'object'
            ) {
                const totalPathCount = Object.values( this.stages.compile[ 1 ].files )
                    .map( arr => arr.length )
                    .reduce( ( runningTotal = 0, current = 0 ) => runningTotal + current );

                if ( totalPathCount < 1 ) {
                    this.stages.compile[ 1 ].files = false;
                }
            }
        }
    }



    /* LOCAL METHODS
     * ====================================================================== */

    /**
     * Gets the instance for the given stage.
     * 
     * @category Fetchers
     *
     * @param stage  Stage to get.
     *
     * @return  An array with first the stage’s class and then the configured
     *          arguments for that class, if any.
     */
    public async getStage(
        stage: Stage.Name,
        console: Logger,
    ): Promise<undefined | [ Stage.ClassType, Partial<Stage.Args> ]> {

        const stageConfig = this.stages[ stage ];

        // returns
        if ( !stageConfig ) {
            console.debug( `no ${ stage } stage config found, skipping...`, 0, { italic: true } );
            return undefined;
        }

        let stageClass: Stage.ClassType | undefined;
        let stageArgs: Partial<Stage.Args> | undefined;

        if ( Array.isArray( stageConfig ) ) {

            const [
                _stageClass,
                _stageArgs,
            ] = stageConfig;

            if ( _stageClass && typeOf( _stageClass ) === 'class' ) {
                stageClass = _stageClass;
            }

            if ( _stageArgs && typeof _stageArgs === 'object' ) {
                stageArgs = _stageArgs;
            }
        } else if ( stageConfig ) {
            stageClass = stageConfig;
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
    public minimum(): Config {
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