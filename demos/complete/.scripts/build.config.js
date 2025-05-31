#!/usr/bin/env node
// @ts-check
'use strict';
/**
 * @package @maddimathon/build-utilities
 * @author Maddi Mathon (www.maddimathon.com)
 * 
 * @license MIT
 */

import { BuildStage } from "@maddimathon/build-utilities";

/**
 * @import { Config } from "@maddimathon/build-utilities"
 */

const _defaults = {
    build: BuildStage.prototype.ARGS_DEFAULT,
};

/**
 * @type {Config}
 */
const config = {
    title: 'NPM Build Utilities DEMO',
    launchYear: '2025',

    stages: {

        compile: {
            files: {

                root: [
                    'README.md',
                ],

                src: [
                    'files',
                    'scss',
                ],
            },
        },

        build: {

            prettify: ( stage ) => {

                return {
                    ..._defaults.build.prettify( stage ),

                    html: undefined,
                    json: undefined,
                    yaml: undefined,
                };
            },
        },
    },
};

export default config;