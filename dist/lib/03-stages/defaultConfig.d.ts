/**
 * @since 0.1.0-draft
 *
 * @packageDocumentation
 */
/**
 * @package @maddimathon/npm-build-utilities@0.1.0-draft
 */
/*!
 * @maddimathon/npm-build-utilities@0.1.0-draft
 * @license MIT
 */
import type { Node } from '@maddimathon/utility-typescript/types';
import { BuildStage, CompileStage, PackageStage, ReleaseStage, SnapshotStage } from './index.js';
/**
 * Complete, default configuration for the library.
 */
export declare function defaultConfig(pkg?: Node.PackageJson): {
    readonly title: any;
    readonly clr: "purple";
    readonly compiler: {
        readonly sass: {
            readonly charset: true;
            readonly sourceMap: true;
            readonly sourceMapIncludeSources: true;
            readonly style: "expanded";
        };
    };
    readonly fs: {};
    readonly paths: {
        readonly release: "@releases";
        readonly snapshot: ".snapshots";
        readonly dist: {
            readonly _: "dist";
            readonly docs: "docs";
            readonly scss: "dist/css";
            readonly ts: "dist/ts";
        };
        readonly src: {
            readonly docs: "src/docs";
            readonly scss: "src/scss";
            readonly ts: "src/ts";
        };
    };
    readonly stages: {
        readonly compile: typeof CompileStage;
        readonly build: typeof BuildStage;
        readonly document: false;
        readonly package: typeof PackageStage;
        readonly release: typeof ReleaseStage;
        readonly snapshot: typeof SnapshotStage;
        readonly test: false;
    };
};
//# sourceMappingURL=defaultConfig.d.ts.map