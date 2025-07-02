/**
 * @since 0.1.0-alpha
 * 
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@___CURRENT_VERSION___
 * @license MIT
 */

import type {
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

export function getDefaultStageClass( stage: "compile" ): Stage.Class.Compile;
export function getDefaultStageClass( stage: "build" ): Stage.Class.Build;
export function getDefaultStageClass( stage: "document" ): Stage.Class.Document;
export function getDefaultStageClass( stage: "package" ): Stage.Class.Package;
export function getDefaultStageClass( stage: "release" ): Stage.Class.Release;
export function getDefaultStageClass( stage: "snapshot" ): Stage.Class.Snapshot;
export function getDefaultStageClass( stage: "test" ): Stage.Class.Test;

export function getDefaultStageClass( stage: Stage.Name ): Stage.Class;

/**
 * Gets the default class for the given stage.
 * 
 * Overloaded for exact class typing.
 * 
 * @category Stages
 * 
 * @param stage  Name of the stage to fetch (lowercase).
 * 
 * @return  The default stage class.
 * 
 * @since 0.1.0-alpha
 * 
 * @internal
 */
export function getDefaultStageClass( stage: Stage.Name ): Stage.Class {

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