/**
 * @package @maddimathon/template-npm-library@___CURRENT_VERSION___
 * @author Maddi Mathon (www.maddimathon.com)
 * @homepage ___CURRENT_URL___
 * 
 * @license MIT
 * 
 * @since ___PKG_VERSION___
 */

import { Functions } from '../classes/Functions.js';
import { AbstractStage } from '../classes/abstracts/AbstractStage.js';


export type ReplacementObject = { find: string | RegExp, replace: string; };


export function currentReplacements( F: Functions ): ReplacementObject[] {
    return [
        { find: '___CURRENT_DESC___', replace: F.pkg.description, },
        { find: '___CURRENT_URL___', replace: F.pkg.homepage, },
        { find: '___CURRENT_VERSION___', replace: F.pkgVersion, },
        { find: '___CURRENT_YEAR___', replace: F.datestamp( null, 'yyyy' ), },
    ];
}

export function pkgReplacements( F: Functions ): ReplacementObject[] {
    return [
        { find: '___PKG_DATE___', replace: F.datestamp( null, 'yyyy-MM-dd' ), },
        { find: '___PKG_VERSION___', replace: F.pkgVersion, },
        { find: '___PKG_YEAR___', replace: F.datestamp( null, 'yyyy' ), },
    ];
}

export function newCurrentReplacements( stage: AbstractStage<any, any> ): ReplacementObject[] {
    return [
        { find: '___CURRENT_DESC___', replace: stage.pkg.description, },
        { find: '___CURRENT_URL___', replace: stage.pkg.homepage, },
        { find: '___CURRENT_VERSION___', replace: stage.pkgVersion, },
        { find: '___CURRENT_YEAR___', replace: stage.datestamp( null, 'yyyy' ), },
    ];
}

export function newPkgReplacements( stage: AbstractStage<any, any> ): ReplacementObject[] {
    return [
        { find: '___PKG_DATE___', replace: stage.datestamp( null, 'yyyy-MM-dd' ), },
        { find: '___PKG_VERSION___', replace: stage.pkgVersion, },
        { find: '___PKG_YEAR___', replace: stage.datestamp( null, 'yyyy' ), },
    ];
}