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
 * @import { Config } from "../src/ts/types/index.js"
 */

/**
 * @type {Config}
 */
const config = {

    title: 'NPM Build Utilities',

    paths: {
        dist: {
            ts: 'dist',
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
    },
};

export default config;