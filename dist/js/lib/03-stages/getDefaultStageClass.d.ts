/**
 * @since 0.1.0-alpha.draft
 *
 * @packageDocumentation
 */
/**
 * @package @maddimathon/build-utilities@0.1.0-alpha.draft
 */
/*!
 * @maddimathon/build-utilities@0.1.0-alpha.draft
 * @license MIT
 */
import { Stage } from '../../types/index.js';
import { BuildStage, CompileStage, DocumentStage, PackageStage, ReleaseStage, SnapshotStage, TestStage } from './classes/index.js';
/**
 * Gets the default class for the given stage.
 *
 * @category Stages
 *
 * @since 0.1.0-alpha.draft
 *
 * @internal
 */
export declare function getDefaultStageClass(stage: Stage.WithDefaultClass): typeof BuildStage | typeof CompileStage | typeof DocumentStage | typeof PackageStage | typeof ReleaseStage | typeof SnapshotStage | typeof TestStage;
//# sourceMappingURL=getDefaultStageClass.d.ts.map