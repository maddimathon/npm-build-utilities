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
import type { Node } from '@maddimathon/utility-typescript/types';
import type { Logger } from '../../types/Logger.js';
import { ProjectConfig } from '../01-config/index.js';
/**
 * Complete, default configuration for the library.
 *
 * @category Config
 */
export declare function defaultConfig(args?: {
    pkg: Node.PackageJson;
} | Logger): {
    readonly title: any;
    readonly clr: "black";
    readonly compiler: {
        readonly sass: {
            readonly charset: true;
            readonly sourceMap: true;
            readonly sourceMapIncludeSources: true;
            readonly style: "expanded";
        };
    };
    readonly fs: {};
    readonly launchYear: string;
    readonly paths: {
        readonly release: "@releases";
        readonly snapshot: ".snapshots";
        readonly dist: {
            readonly _: "dist";
            readonly docs: "docs";
            readonly scss: "dist/css";
        };
        readonly scripts: {
            readonly _: ".scripts";
            readonly logs: ".scripts/logs";
        };
        readonly src: {
            readonly _: "src";
            readonly docs: "src/docs";
            readonly scss: "src/scss";
            readonly ts: "src/ts";
        };
    };
    readonly replace: typeof ProjectConfig.replace;
    readonly stages: {
        readonly compile: typeof import("./index.js").BuildStage | typeof import("./index.js").CompileStage | typeof import("./index.js").DocumentStage | typeof import("./index.js").PackageStage | typeof import("./index.js").ReleaseStage | typeof import("./index.js").SnapshotStage | typeof import("./index.js").TestStage;
        readonly build: typeof import("./index.js").BuildStage | typeof import("./index.js").CompileStage | typeof import("./index.js").DocumentStage | typeof import("./index.js").PackageStage | typeof import("./index.js").ReleaseStage | typeof import("./index.js").SnapshotStage | typeof import("./index.js").TestStage;
        readonly document: false;
        readonly package: typeof import("./index.js").BuildStage | typeof import("./index.js").CompileStage | typeof import("./index.js").DocumentStage | typeof import("./index.js").PackageStage | typeof import("./index.js").ReleaseStage | typeof import("./index.js").SnapshotStage | typeof import("./index.js").TestStage;
        readonly release: typeof import("./index.js").BuildStage | typeof import("./index.js").CompileStage | typeof import("./index.js").DocumentStage | typeof import("./index.js").PackageStage | typeof import("./index.js").ReleaseStage | typeof import("./index.js").SnapshotStage | typeof import("./index.js").TestStage;
        readonly snapshot: typeof import("./index.js").BuildStage | typeof import("./index.js").CompileStage | typeof import("./index.js").DocumentStage | typeof import("./index.js").PackageStage | typeof import("./index.js").ReleaseStage | typeof import("./index.js").SnapshotStage | typeof import("./index.js").TestStage;
        readonly test: false;
    };
};
//# sourceMappingURL=defaultConfig.d.ts.map