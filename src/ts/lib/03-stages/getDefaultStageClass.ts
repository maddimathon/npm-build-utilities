/**
 * @since ___PKG_VERSION___
 * 
 * @packageDocumentation
 */
/**
 * @package @maddimathon/build-utilities@___CURRENT_VERSION___
 */
/*!
 * @maddimathon/build-utilities@___CURRENT_VERSION___
 * @license MIT
 */

import {
    Stage,
} from '../../types/index.js';

import {
    BuildStage,
    CompileStage,
    DocumentStage,
    PackageStage,
    ReleaseStage,
    SnapshotStage,
    TestStage,
} from './classes/index.js';

/**
 * Gets the default class for the given stage.
 * 
 * @category Stages
 * 
 * @since ___PKG_VERSION___
 * 
 * @internal
 */
export function getDefaultStageClass( stage: Stage.WithDefaultClass ) {

    switch ( stage ) {

        case 'compile':
            return CompileStage;

        case 'build':
            return BuildStage;

        case 'document':
            return DocumentStage;

        case 'package':
            return PackageStage;

        case 'release':
            return ReleaseStage;

        case 'snapshot':
            return SnapshotStage;

        case 'test':
            return TestStage;
    }
}