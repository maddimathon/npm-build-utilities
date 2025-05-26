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
 * @import { Config, Stage } from "../src/ts/types/index.js"
 */

/**
 * @type {Config}
 */
const config = {

    title: 'NPM Build Utilities',

    paths: {

        /** @type {Config.Internal['paths']['dist']} */
        dist: {
            _: 'new-dist',
            docs: 'new-docs',
            scss: 'new-dist-scss',
        },
    },

    stages: {

        compile: {

            scss: false,

            files: {

                root: [],

                src: [],
            },
        },

        build: {

            /**
             * @type {( stage: Stage.Class ) => { current: string[]; ignore: string[]; package: string[]; }}
             */
            replace: ( stage ) => {

                const _obj = BuildStage.prototype.ARGS_DEFAULT.replace( stage );

                _obj.ignore.push( 'demos/**' );

                return _obj;
            },
        },
    },
};

export default config;