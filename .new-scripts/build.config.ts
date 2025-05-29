#!/usr/bin/env node
'use strict';
/**
 * @package @maddimathon/build-utilities
 * @author Maddi Mathon (www.maddimathon.com)
 * 
 * @license MIT
 */

import type {
    Config,
    Stage,
} from "../src/ts/index.js";

import { Build } from './classes/Build.js';

const _defaults = {
    build: Build.prototype.ARGS_DEFAULT,
};

const config: Config = {

    title: 'NPM Build Utilities',

    paths: {
        release: '@new-releases',
        snapshot: '.new-snapshots',

        scripts: {
            _: '.new-scripts',
            logs: '.new-scripts/.logs',
        },
    },

    stages: {

        compile: {
            scss: false,
            files: false,
        },

        build: [ Build, {

            minimize: false,

            prettify: ( _stage: Stage.Class ) => {

                return {
                    ..._defaults.build.prettify( _stage ),

                    css: undefined,
                    html: undefined,
                    json: undefined,
                    scss: undefined,
                    ts: undefined,
                    yaml: undefined,
                };
            },

            replace: ( _stage: Stage.Class ) => {

                const _obj = _defaults.build.replace( _stage );

                _obj.ignore.push( 'demos/**' );

                return _obj;
            },
        } ],
    },
};

export default config;