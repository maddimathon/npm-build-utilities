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

import {
    node,
    type MessageMaker,
} from '@maddimathon/utility-typescript/classes';

import * as Stage from './Stage.js';



/**
 * Complete configuration object for a project using this library.
 * 
 * @category Types
 * 
 * @since ___PKG_VERSION___
 */
export interface Config {

    /**
     * Project’s human-friendly name in title case.
     */
    title: string;

    /**
     * Default output colour to the terminal.
     */
    clr?: MessageMaker.Colour;

    /**
     * Optional arguements to use when constructing {@link Stage.Compiler}.
     */
    compiler?: Partial<Stage.Compiler.Args>;

    /**
     * Optional arguements to use when constructing {@link Stage.Console}.
     */
    console?: Partial<Stage.Console.Args>;

    /**
     * Optional arguements to use when constructing {@link node.NodeFiles}.
     */
    fs?: Partial<node.NodeFiles.Args>;

    /** {@inheritDoc Config.Paths} */
    paths?: Partial<Config.Paths>,

    /** {@inheritDoc Config.Stages} */
    stages?: Partial<Config.Stages>,
};

/**
 * Types used for project configuration.
 * 
 * @category Types
 * 
 * @since ___PKG_VERSION___
 */
export namespace Config {

    /**
     * Shape for a class implementing the project's complete configuration.
     * 
     * @interface
     */
    //  * 
    //  * @useDeclaredType
    // export type Class = Objects.Classify<Internal, never>;
    export type Class = {

        [ K in keyof Internal ]-?: (
            Internal[ K ] extends undefined
            ? ( Internal[ K ] | undefined )
            : Internal[ K ]
        ) | (
            K extends Objects.KeysOptional<Internal> ? undefined : never
        );
    };

    /** 
     * @hidden
     * @internal
     * @expand
     */
    type Internal_RequiredKeys = "clr";

    /**
     * Complete configuration shape. Requires more properties than
     * {@link Config}.
     *
     * @since ___PKG_VERSION___
     *
     * @interface
     *
     * @internal
     */
    export type Internal = Objects.RequirePartial<
        Omit<Config, "fs" | "paths" | "stages">,
        Internal_RequiredKeys
    > & {
        /** {@inheritDoc Config.fs} */
        fs: Required<Config>[ 'fs' ],

        /** {@inheritDoc Config.Paths} */
        paths: {
            [ K in keyof Required<Config>[ 'paths' ] ]-?: Required<Exclude<Required<Config>[ 'paths' ][ K ], Function>>;
        };

        /** 
         * A version of {@link Config.Stages} with more predictable options.
         */
        stages: Internal.Stages;
        // stages: {
        //     // [ K in keyof Config.Stages ]-?:
        //     // | false
        //     // | Stage.ClassType
        //     // | [
        //     //     Stage.ClassType,
        //     //     undefined | Partial<Stage.Args.All[ K ]>,
        //     // ];
        //     // [ K in keyof Config.Stages ]-?: Extract<Required<Config.Stages>[ K ], false | Stage.ClassType | any[]>;
        //     [ K in Stage.Name ]-?:
        //     | false
        //     | Stage.ClassType.All[ K ]
        //     | [ Stage.ClassType.All[ K ], undefined | Partial<Stage.Args.All[ K ]> ];
        // };
    };

    export namespace Internal {

        /**
         * @interface
         */
        export type Stages = {
            [ K in Stage.Name ]-?:
            | false
            | Required<Stage.ClassType.All>[ K ]
            | [ Required<Stage.ClassType.All>[ K ], undefined | Partial<Stage.Args.All[ K ]> ];
        };
    }

    /** 
     * Paths to files or directories.
     * 
     * Absolute *or* relative to node’s cwd.
     * 
     * @expand
     */
    export interface Paths {

        /**
         * Destination for compiled files.
         * 
         * @default
         * ```ts
         * {
         *     _: 'dist',
         *     docs: 'docs',
         *     scss: 'dist/scss',
         *     ts: 'dist/ts',
         * }
         * ```
         */
        dist: string | ( ( subDir?: SourceDirectory ) => string ) | {
            [ D in "_" | SourceDirectory ]?: string;
        };

        /**
         * Source for files to be compiled.
         * 
         * @default
         * ```ts
         * {
         *     docs: 'src/docs',
         *     scss: 'src/scss',
         *     ts: 'src/ts',
         * }
         * ```
         */
        src: ( ( subDir: SourceDirectory ) => string | string[] ) | {
            [ D in SourceDirectory ]?: string | string[];
        };

        /**
         * Directory for release zip files.
         * 
         * @default '@releases'
         */
        release: string;

        /**
         * Directory for snapshot zip files.
         * 
         * @default '.snapshots'
         */
        snapshot: string;
    };

    /**
     * A generic for the allowed input types for stage configuration.
     * 
     * @internal
     * @expand
     */
    export type StageOpts<
        C extends Stage.ClassType = Stage.ClassType,
        A extends Stage.Args = Stage.Args,
        B extends boolean | never = boolean,
    > =
        | B
        | Partial<A>
        | C
        | [ C, undefined | Partial<A> ];

    /**
     * A generic for the allowed input types for stage configuration where only
     * an abstract is included in this package (test, document).
     *
     * @internal
     * @expand
     */
    export type StageOptsAbstract<
        Stage extends Stage.Name,
        B extends boolean | never = false,
        A extends Stage.Args.All[ Stage ] = Stage.Args.All[ Stage ],
    > =
        | B
        | Stage.ClassType.All[ Stage ]
        | [ Stage.ClassType.All[ Stage ] ]
        | [
            Stage.ClassType.All[ Stage ],
            undefined | Partial<A>,
        ];

    /**
     * All build stages and whether or not they run, including custom
     * implementations.
     * 
     * If true, the default class is run.  If false, it is not run at all.
     * 
     * @interface
     * 
     * @expand
     */
    export interface Stages {

        build:
        | boolean
        | Partial<Stage.Args.Build>
        | Stage.ClassType.Build
        | [ Stage.ClassType.Build, undefined | Partial<Stage.Args.Build> ],

        compile:
        | boolean
        | Partial<Stage.Args.Compile>
        | Stage.ClassType.Compile
        | [ Stage.ClassType.Compile, undefined | Partial<Stage.Args.Compile> ],

        document?:
        | false
        | Stage.ClassType.Document
        | [ Stage.ClassType.Document, undefined | Partial<Stage.Args.Document> ],

        package:
        | boolean
        | Partial<Stage.Args.Package>
        | Stage.ClassType.Package
        | [ Stage.ClassType.Package, undefined | Partial<Stage.Args.Package> ],

        release:
        | boolean
        | Partial<Stage.Args.Release>
        | Stage.ClassType.Release
        | [ Stage.ClassType.Release, undefined | Partial<Stage.Args.Release> ],

        snapshot:
        | boolean
        | Partial<Stage.Args.Snapshot>
        | Stage.ClassType.Snapshot
        | [ Stage.ClassType.Snapshot, undefined | Partial<Stage.Args.Snapshot> ],

        test?:
        | false
        | Stage.ClassType.Test
        | [ Stage.ClassType.Test, undefined | Partial<Stage.Args.Test> ],
    };

    /**
     * Keys for paths in the source directory.
     * 
     * @expand
     */
    export type SourceDirectory = "docs" | "scss" | "ts";
}

