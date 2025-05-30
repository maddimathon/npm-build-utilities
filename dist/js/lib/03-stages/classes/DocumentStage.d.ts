import type { Node } from '@maddimathon/utility-typescript/types';
import type { CLI, Stage } from '../../../types/index.js';
import { SemVer } from '../../@internal/index.js';
import { ProjectConfig } from '../../01-config/index.js';
import { AbstractStage } from './abstract/AbstractStage.js';
/**
 * Default package stage.
 *
 * @category Stages
 *
 * @since 0.1.0-alpha.draft
 */
export declare class DocumentStage extends AbstractStage<Stage.SubStage.Document, Stage.Args.Document> {
    readonly subStages: Stage.SubStage.Document[];
    get ARGS_DEFAULT(): {
        readonly objs: {};
    };
    /**
     * @param config  Complete project configuration.
     * @param params  Current CLI params.
     * @param args    Optional. Partial overrides for the default args.
     * @param _pkg      Optional. The current package.json value, if any.
     * @param _version  Optional. Current version object, if any.
     */
    constructor(config: ProjectConfig, params: CLI.Params, args: Partial<Stage.Args.Document>, _pkg?: Node.PackageJson, _version?: SemVer);
    protected runSubStage(subStage: Stage.SubStage.Document): Promise<void>;
    protected typeDoc(): Promise<void>;
}
//# sourceMappingURL=DocumentStage.d.ts.map