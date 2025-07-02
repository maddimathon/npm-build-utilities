/**
 * @since 0.1.0-alpha
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.2.0-alpha
 * @license MIT
 */
import type { Stage } from '../../types/index.js';
export declare function getDefaultStageClass(stage: "compile"): Stage.Class.Compile;
export declare function getDefaultStageClass(stage: "build"): Stage.Class.Build;
export declare function getDefaultStageClass(stage: "document"): Stage.Class.Document;
export declare function getDefaultStageClass(stage: "package"): Stage.Class.Package;
export declare function getDefaultStageClass(stage: "release"): Stage.Class.Release;
export declare function getDefaultStageClass(stage: "snapshot"): Stage.Class.Snapshot;
export declare function getDefaultStageClass(stage: "test"): Stage.Class.Test;
export declare function getDefaultStageClass(stage: Stage.Name): Stage.Class;
//# sourceMappingURL=getDefaultStageClass.d.ts.map