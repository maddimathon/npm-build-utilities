#!/usr/bin/env node
'use strict';
/*
 * @package @maddimathon/build-utilities
 * @author Maddi Mathon (www.maddimathon.com)
 *
 * @license MIT
 */

import {
    type Config,
    type Stage,

    FileSystem,
} from "../src/ts/index.js";

import { Build } from './classes/Build.js';

const _defaults = {
    build: Build.prototype.ARGS_DEFAULT,
};

const config: Config = {

    title: 'NPM Build Utilities',

    launchYear: '2025',

    paths: {
        release: '@releases',
        snapshot: '.snapshots',

        scripts: {
            logs: '.scripts/.logs',
        },
    },

    stages: {

        compile: {
            scss: false,
            files: false,
        },

        build: [ Build, {

            minimize: false,

            prettify: ( _stage: Stage ) => {

                return {
                    ..._defaults.build.prettify( _stage ),

                    html: undefined,
                    ts: undefined,
                    yaml: undefined,
                };
            },

            replace: ( _stage: Stage ) => {

                const _obj = _defaults.build.replace( _stage );

                if ( !_obj.ignore ) {
                    _obj.ignore = [];
                }

                _obj.ignore.push( 'demos/**' );

                return _obj;
            },
        } ],

        test: true,

        document: {

            entryPoints: [
                'src/ts/index.ts',
                'src/ts/lib/@internal.ts',
                'src/ts/bin/lib/index.ts',
            ],

            typeDoc: {

                categorizeByGroup: false,

                navigation: {
                    // includeCategories: true,
                    // includeGroups: false,
                    includeFolders: true,
                    compactFolders: false,
                    // excludeReferences: true,
                },

                projectDocuments: [
                    'README.md',
                    'src/docs/*.md',
                ],
            },
        },

        snapshot: {

            ignoreGlobs: ( _stage: Stage ) => [
                ...FileSystem.globs.IGNORE_COPIED( _stage ),
                ...FileSystem.globs.IGNORE_COMPILED( _stage ),
                ...FileSystem.globs.IGNORE_PROJECT,
                ...FileSystem.globs.SYSTEM,

                'demos/**/.snapshots/**',
                'demos/**/docs/**',
                'demos/**/dist/**',
            ],
        },
    },
};

export default config;