#!/usr/bin/env node
// @ts-check
'use strict';
/*
 * @package @maddimathon/build-utilities
 * @author Maddi Mathon (https://www.maddimathon.com/web)
 *
 * @license MIT
 */

/**
 * @import { Config, Stage } from "@maddimathon/build-utilities"
 */

import { BuildStage } from "@maddimathon/build-utilities";

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
            /**
             * @param {Stage} _stage
             */
            prettify: ( _stage ) => {

                return {
                    ..._defaults.build.prettify( _stage ),

                    html: undefined,
                    json: undefined,
                    yaml: undefined,
                };
            },
        },

        document: true,

        test: true,
    },
};

export default config;