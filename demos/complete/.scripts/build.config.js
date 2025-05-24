#!/usr/bin/env node
// @ts-check
'use strict';
/**
 * @package @maddimathon/build-utilities
 * @author Maddi Mathon (www.maddimathon.com)
 * 
 * @license MIT
 */

/**
 * @import { Config } from "@maddimathon/build-utilities"
 */

/**
 * @type {Config}
 */
const config = {
    title: 'NPM Build Utilities DEMO',

    paths: {
        src: {
            scss: [
                'src/scss/main.scss',
                'src/scss/secondary.scss',
            ],
        },
    },

    stages: {
        compile: {
            files: {

                root: [
                    'README.md',
                ],

                src: [
                    'src/files',
                ],
            },
        },
    },
};

export default config;