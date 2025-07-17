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

// import type {
// } from "../../src/ts/lib/@internal.js";

// import {
// } from '../../src/ts/lib/@internal.js';

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

        await this.atry(
            this.fs.prettier,
            this.params.verbose ? 3 : 2,
            [ jsonDistDir + '/**/*.json', 'json' ],
            {
                exitProcess: !!this.params.packaging,
            }
        );
    }
}

export namespace Compile {

    export type SubStage =
        | Stage.SubStage.Compile
        | 'demos'
        | 'readme'
        | 'tscheck';
}
