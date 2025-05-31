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
 * @since 0.1.0-alpha.draft
 *
 * @internal
 */
export function getDefaultStageClass(stage) {
    switch (stage) {
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
//# sourceMappingURL=getDefaultStageClass.js.map
