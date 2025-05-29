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

import type { Node } from '@maddimathon/utility-typescript/types';

import type {
    CLI,
    Config,
    Stage,
} from '../../../types/index.js';

import type { FileSystemType } from '../../../types/FileSystemType.js';

import {
    SemVer,
} from '../../@internal/index.js';

import {
    FileSystem,
} from '../../00-universal/index.js';

import {
    ProjectConfig,
} from '../../01-config/index.js';

import { AbstractStage } from './abstract/AbstractStage.js';



/**
 * Default build stage.
 * 
 * @category Stages
 * 
 * @since ___PKG_VERSION___
 */
export class BuildStage extends AbstractStage<
    Stage.SubStage.Build,
    Stage.Args.Build
> {



    /* PROPERTIES
     * ====================================================================== */

    public readonly subStages: Stage.SubStage.Build[] = [
        'compile',
        'replace',
        'prettify',
        'minimize',
        'test',
        'document',
    ];


    /* Args ===================================== */

    public get ARGS_DEFAULT() {

        const minimize = ( _stage: Stage.Class ) => {

            const _distDir: {
                [ D in "_" | Config.Paths.DistDirectory ]: string;
            } = {
                _: _stage.getDistDir().replace( /\/$/, '' ),
                scss: _stage.getDistDir( 'scss' ).replace( /\/$/, '' ),
                docs: _stage.getDistDir( 'docs' ).replace( /\/$/, '' ),
            };

            const _renamer = ( _path: string ) => _stage.fs.uniquePath(
                _stage.fs.changeBaseName(
                    _path,
                    _stage.fs.basename( _path ) + '.min',
                )
            );

            return {

                css: {
                    globs: [
                        `${ _distDir._ }/**/*.css`,
                        `${ _distDir.scss }/**/*.css`,
                    ],
                    ignore: [
                        `${ _distDir._ }/**/*.min.css`,
                        `${ _distDir.scss }/**/*.min.css`,
                        `${ _distDir._ }/**/*.css.map`,
                        `${ _distDir.scss }/**/*.css.map`,
                    ],
                    renamer: _renamer,
                },

                html: {
                    globs: [ `${ _distDir._ }/**/*.html`, ],
                },

                js: {
                    globs: [
                        `${ _distDir._ }/**/*.js`,
                        `${ _distDir._ }/**/*.jsx`,
                    ],
                    ignore: [
                        `${ _distDir._ }/**/*.min.js`,
                        `${ _distDir._ }/**/*.min.jsx`,
                        `${ _distDir._ }/**/*.test.js`,
                        `${ _distDir._ }/**/*.test.jsx`,
                        `${ _distDir._ }/**/*.js.map`,
                        `${ _distDir._ }/**/*.jsx.map`,
                    ],
                    renamer: _renamer,
                },

                json: {
                    globs: [ `${ _distDir._ }/**/*.json`, ],
                },

            } as const satisfies {
                [ K in FileSystemType.Minify.Format ]: {
                    globs: string[];
                    ignore?: string[];
                    args?: FileSystemType.Glob.Args;
                    renamer?: ( ( path: string ) => string );
                }
            };
        };

        const prettify = ( _stage: Stage.Class ) => {

            const _distDir: {
                [ D in "_" | Config.Paths.DistDirectory ]: string;
            } = {
                _: _stage.getDistDir().replace( /\/$/, '' ),
                scss: _stage.getDistDir( 'scss' ).replace( /\/$/, '' ),
                docs: _stage.getDistDir( 'docs' ).replace( /\/$/, '' ),
            };

            return {

                css: [
                    [
                        `${ _distDir._ }/**/*.css`,
                        `${ _distDir.scss }/**/*.css`,
                    ],
                ],

                html: [
                    [ `${ _distDir._ }/**/*.html`, ],
                ],

                js: [
                    [
                        `${ _distDir._ }/**/*.js`,
                        `${ _distDir._ }/**/*.jsx`,
                        `${ _distDir.docs }/**/*.js`,
                        `${ _distDir.docs }/**/*.jsx`,
                    ],
                ],

                json: [
                    [ `${ _distDir._ }/**/*.json`, ],
                ],

                md: undefined,

                mdx: undefined,

                scss: [
                    [
                        `${ _distDir._ }/**/*.scss`,
                        `${ _distDir.scss }/**/*.scss`,
                    ],
                ],

                ts: [
                    [
                        `${ _distDir._ }/**/*.ts`,
                        `${ _distDir._ }/**/*.tsx`,
                        `${ _distDir.docs }/**/*.ts`,
                        `${ _distDir.docs }/**/*.tsx`,
                    ],
                ],

                yaml: [
                    [ `${ _distDir._ }/**/*.yaml`, ],
                ],

            } as const satisfies {
                [ K in FileSystemType.Prettier.Format ]:
                | undefined
                | readonly [ readonly string[] ]
                | readonly [ readonly string[], undefined | Partial<FileSystemType.Prettier.Args> ];
            };
        };

        const replace = ( _stage: Stage.Class ) => ( {

            current: [
                'dist/**/*',
            ],

            ignore: [
                ...FileSystem.globs.IGNORE_COPIED( _stage ),
                ...FileSystem.globs.IGNORE_PROJECT,
                ...FileSystem.globs.SYSTEM,

                '**/.new-scripts/**',
                '**/.vscode/**',
            ],

            package: [
                'dist/**/*',
            ],
        } );

        return {
            ...AbstractStage.ARGS_DEFAULT,

            compile: true,
            document: false,
            minimize,
            prettify,
            replace,
            test: false,

        } as const satisfies Stage.Args.Build;
    }



    /* CONSTRUCTOR
     * ====================================================================== */

    /**
     * @param config    Current project config.
     * @param params    Current CLI params.
     * @param args      Optional. Partial overrides for the default args.
     * @param _pkg      Optional. The current package.json value, if any.
     * @param _version  Optional. Current version object, if any.
     */
    constructor (
        config: ProjectConfig,
        params: CLI.Params,
        args: Partial<Stage.Args.Build>,
        _pkg?: Node.PackageJson,
        _version?: SemVer,
    ) {
        super( 'build', 'blue', config, params, args, _pkg, _version );
    }



    /* LOCAL METHODS
     * ====================================================================== */

    /**
     * Prints a message to the console signalling the start or end of this
     * build stage.
     *
     * @param which  Whether we are starting or ending.
     */
    public override startEndNotice( which: "start" | "end" | null ) {
        return super.startEndNotice( which, !this.params.packaging );
    }



    /* RUNNING METHODS
     * ====================================================================== */

    protected async runSubStage( subStage: Stage.SubStage.Build ) {
        await this[ subStage ]();
    }

    /**
     * Runs the project's compile class.
     */
    protected async compile() {
        await this.runStage( 'compile', 1 );
    }

    /**
     * Runs the project's document class.
     */
    protected async document() {
        await this.runStage( 'document', 1 );
    }

    protected async minimize() {
        if ( !this.args.minimize ) { return; } // here for typing backup
        this.console.progress( 'minimizing built files...', 1 );

        const args = typeof this.args.minimize === 'function'
            ? this.args.minimize( this )
            : this.args.minimize;

        // returns
        if ( !Object.keys( args ).length ) {
            this.console.verbose( 'empty minimize config, no files to format', 2 );
            return;
        }

        for ( const t_format in args ) {
            const _format = t_format as FileSystemType.Minify.Format;

            // continues
            if (
                typeof args[ _format ] === 'undefined'
                || args[ _format ] === false
            ) {
                continue;
            }

            const _formatArgs = Array.isArray( args[ _format ] )
                ? { globs: args[ _format ] }
                : args[ _format ];

            // continues
            if (
                !Array.isArray( _formatArgs.globs )
                || !_formatArgs.globs.length
            ) {
                this.console.verbose( `no globs present to minimize ${ _format } files`, 2, { italic: true } );
                continue;
            }


            this.console.verbose( `minimizing ${ _format } files...`, 2 );


            const _minimized = await this.try(
                this.fs.minify,
                ( this.params.verbose ? 3 : 2 ),
                [
                    _formatArgs.globs,
                    _format,
                    ( this.params.verbose ? 3 : 2 ),

                    {
                        ..._formatArgs.args,

                        glob: {
                            ignore: _formatArgs.ignore,
                            ..._formatArgs.args?.glob ?? {},
                        },
                    },

                    _formatArgs.renamer,
                ],
            );

            this.console.verbose(
                `minimized ${ _minimized.length } ${ _format } files`,
                3,
                { italic: true },
            );
        }
    }

    protected async prettify() {
        if ( !this.args.prettify ) { return; } // here for typing backup
        this.console.progress( 'prettifying built files...', 1 );

        const args = typeof this.args.prettify === 'function'
            ? this.args.prettify( this )
            : this.args.prettify;

        // returns
        if ( !Object.keys( args ).length ) {
            this.console.verbose( 'empty prettify config, no files to format', 2 );
            return;
        }

        for ( const t_format in args ) {
            const _format = t_format as FileSystemType.Prettier.Format;

            // continues
            if ( typeof args[ _format ] === 'undefined' ) {
                continue;
            }

            // continues
            if (
                !args[ _format ]
                || !Array.isArray( args[ _format ][ 0 ] )
            ) {
                this.console.verbose( `no globs present to prettify ${ _format } files`, 2, { italic: true } );
                continue;
            }


            this.console.verbose( `prettifying ${ _format } files...`, 2 );

            const [
                _globs,
                _args = {} as Partial<FileSystemType.Prettier.Args>,
            ] = args[ _format ];


            const _prettified = await this.try( this.fs.prettier, 3, [
                _globs,
                _format,
                _args,
            ] );

            this.console.verbose(
                `prettified ${ _prettified.length } ${ _format } files`,
                3,
                { italic: true },
            );
        }
    }

    protected async replace() {
        if ( !this.args.replace ) { return; } // here for typing backup
        this.console.progress( 'replacing placeholders...', 1 );

        const paths = this.args.replace( this );

        const replacements = typeof this.config.replace === 'function'
            ? this.config.replace( this )
            : this.config.replace;

        for ( const _key of ( [ 'current', 'package' ] as const ) ) {

            if ( paths[ _key ] && replacements[ _key ] ) {
                this.console.verbose( `making ${ _key } replacements...`, 2 );

                const _currentReplaced = this.fs.replaceInFiles(
                    paths[ _key ],
                    replacements[ _key ],
                    ( this.params.verbose ? 3 : 2 ),
                    {
                        ignore: paths.ignore ?? FileSystem.globs.SYSTEM,
                    },
                );

                this.console.verbose(
                    `replaced ${ _key } placeholders in ${ _currentReplaced.length } files`,
                    3,
                    { italic: true },
                );
            }
        }
    }

    /**
     * Runs the project's test class.
     */
    protected async test() {
        await this.runStage( 'test', 1 );
    }
}