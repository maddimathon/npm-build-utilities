#!/usr/bin/env node
// @ts-check
'use strict';

import { BuildStage } from '../src/ts/index.js';

/**
 * @package @maddimathon/build-utilities
 * @author Maddi Mathon (www.maddimathon.com)
 * 
 * @license MIT
 */

/**
 * @import { Config } from "../src/ts/types/index.js"
 */

const _defaults = {
    build: BuildStage.prototype.ARGS_DEFAULT,
};

/**
 * @type {Config}
 */
const config = {

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
            // files: {
            //     root: [],
            //     src: [],
            // },
        },

        build: {

            minimize: false,
            // minimize: ( _stage ) => {
            //     const _defaults_minimize = _defaults.build.minimize( _stage );
            //     return {
            //         ..._defaults_minimize,
            //         css: undefined,
            //         html: undefined,
            //         js: undefined,
            //         // json: undefined,
            //     };
            // },

            prettify: ( _stage ) => {

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

            replace: ( _stage ) => {

                const _obj = _defaults.build.replace( _stage );

                _obj.ignore.push( 'demos/**' );

                return _obj;
            },
        },
    },
};

export default config;