#!/usr/bin/env node
'use strict';
/*
 * @package @maddimathon/build-utilities
 * @author Maddi Mathon (www.maddimathon.com)
 *
 * @license MIT
 */

import * as prettier from 'prettier';

import type { Stage } from '../../src/ts/index.js';

import { CompileStage, FileSystem } from '../../src/ts/index.js';

/**
 * Extension of the built-in one.
 */
export class Compile extends CompileStage {

    public override readonly subStages: Stage.SubStage.Compile[] = [
        'json' as Stage.SubStage.Compile,
        'scss',
        'ts',
        'files',
    ];

    /**
     * Compiles json files to be included in the package.
     */
    protected async json() {
        this.console.progress( 'compiling json files...', 1 );

        const jsonDistDir = this.getDistDir( undefined, 'json' );


        if ( this.fs.exists( jsonDistDir ) ) {
            this.console.verbose( 'deleting existing files...', 2 );
            this.fs.delete( jsonDistDir, this.params.verbose ? 3 : 2 );
        }


        this.console.verbose( 'writing prettier base config...', 2 );

        const prettierJSON: prettier.Options = FileSystem.prettierConfig;

        this.fs.write(
            jsonDistDir + '/prettierrc.json',
            JSON.stringify( prettierJSON ),
            { force: true },
        );

        return this.atry(
            this.fs.prettier,
            this.params.verbose ? 3 : 2,
            [ jsonDistDir + '/**/*.json', 'json' ],
            {
                exitProcess: !!this.params.packaging,
            }
        );
    }

    /**
     * Write tsconfig files and compiles ts files to be included in the package.
     */
    protected override async ts() {
        this.console.progress( 'writing tsconfig files...', 1 );

        const writeArgs = { force: true, rename: false };

        const baseConfigPath = await this.writeTsConfig(
            'tsconfig.base.json',
            2,
            {
                extends: [
                    '@maddimathon/utility-typescript/tsconfig',
                ],

                compilerOptions: {
                    // lib: [
                    //     'DOM',
                    //     'ESNext',
                    // ],
                    sourceMap: false,
                },
            },
            writeArgs,
        );

        const basePath_relative = baseConfigPath ? this.fs.pathRelative( baseConfigPath ) : baseConfigPath;

        const scriptsConfigPath = await this.writeTsConfig(
            'tsconfig.scripts.json',
            2,
            {
                extends: [
                    basePath_relative ? basePath_relative : './tsconfig.base.json',
                ],

                compilerOptions: {
                    allowJs: true,
                    checkJs: true,
                    composite: false,
                    exactOptionalPropertyTypes: false,
                    isolatedDeclarations: false,
                    isolatedModules: false,
                    module: 'NodeNext',
                    moduleResolution: 'NodeNext',
                    noEmit: true,
                    target: 'ES2022',
                },
            },
            writeArgs,
        );

        const scriptsPath_relative = scriptsConfigPath ? this.fs.pathRelative( scriptsConfigPath ) : scriptsConfigPath;

        await this.writeTsConfig(
            'src/ts/tsconfig.json',
            2,
            {
                extends: scriptsPath_relative ? scriptsPath_relative : '../../tsconfig.base.json',

                include: [
                    "../../src/ts/**/*",
                    "./src/ts/**/*"
                ],

                exclude: [
                    "**/node_modules/**/*",
                ],

                compilerOptions: {
                    composite: true,
                    module: 'Node18',
                    moduleResolution: 'Node16',
                    noEmit: undefined,
                    outDir: '../../dist/js/',
                    target: 'ES2022',
                },
            },
            writeArgs,
        );

        await this.writeTsConfig(
            'src/docs/tsconfig.json',
            2,
            {
                extends: basePath_relative ? basePath_relative : "../../tsconfig.base.json",

                include: [
                    "../../src/docs/**/*.js",
                    "../../src/docs/**/*.ts",
                    "src/docs/**/*.js",
                    "src/docs/**/*.ts"
                ],

                compilerOptions: {
                    // rootDir: '../../',
                    noEmit: true,
                }
            },
            writeArgs,
        );

        return super.ts();
    }
}
