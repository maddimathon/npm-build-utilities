#!/usr/bin/env node
// @ts-check
'use strict';
/**
 * @package @maddimathon/npm-build-utilities
 * @author Maddi Mathon (www.maddimathon.com)
 * 
 * @license MIT
 */

/**
 * @import { Config } from "@maddimathon/npm-build-utilities"
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
};

export default config;