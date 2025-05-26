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

    stages: {

        compile: {

            scss: false,

            files: {

                root: [],

                src: [],
            },
        },

        build: {

            prettify: ( stage ) => {

                return {
                    ..._defaults.build.prettify( stage ),

                    css: undefined,
                    html: undefined,
                    json: undefined,
                    scss: undefined,
                    ts: undefined,
                    yaml: undefined,
                };
            },

            replace: ( stage ) => {

                const _obj = _defaults.build.replace( stage );

                _obj.ignore.push( 'demos/**' );

                return _obj;
            },
        },
    },
};

export default config;