/**
 * @since 0.1.0-alpha
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.3.0-alpha.2.draft
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
