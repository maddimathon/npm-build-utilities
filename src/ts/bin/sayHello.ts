#!/usr/bin/env node
/**
 * An example function used on the command line.
 * 
 * @package @maddimathon/template-npm-library@___CURRENT_VERSION___
 * @since 0.1.1+tmpl
 * 
 * @packageDocumentation
 */
/*!
 * @maddimathon/template-npm-library@___CURRENT_VERSION___
 * @license MIT
 */

/**
 * Testing command line scripts in the package.
 */
export default function ( args: {} ): void {
    console.log( 'hello' );
    console.log( 'args =', args );
}