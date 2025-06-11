/**
 * @since 0.1.0-alpha
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.1.0-alpha.1
 * @license MIT
 */
import type { Json } from '@maddimathon/utility-typescript/types';
import type { Stage } from '../../types/index.js';
import type { Logger } from '../../types/Logger.js';
/**
 * Complete, default configuration for the library.
 *
 * @category Config
 *
 * @param args  Either the package.json value or a Logger instance to use in
 *              {@link internal.getPackageJson}.
 *
 * @return  Default configuration values.  Satisfies {@link Config.Internal}.
 *
 * @since 0.1.0-alpha
 */
export declare function defaultConfig(args?: {
    pkg: Json.PackageJson;
} | Logger): {
    readonly title: string;
    readonly clr: "black";
    readonly compiler: {};
    readonly console: {};
    readonly fs: {};
    readonly launchYear: string;
    readonly paths: {
        readonly changelog: "CHANGELOG.md";
        readonly readme: "README.md";
        readonly release: "@releases";
        readonly snapshot: ".snapshots";
        readonly dist: {
            readonly _: "dist";
            readonly docs: "docs";
            readonly scss: "dist/css";
        };
        readonly notes: {
            readonly release: ".releasenotes.md";
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
    readonly replace: (_stage: Stage) => {
        current: [RegExp, string][];
        package: [RegExp, string][];
    };
    readonly stages: {
        readonly compile: [Stage.Class.Compile];
        readonly build: [Stage.Class.Build];
        readonly document: false;
        readonly package: [Stage.Class.Package];
        readonly release: [Stage.Class.Release];
        readonly snapshot: [Stage.Class.Snapshot];
        readonly test: false;
    };
};
//# sourceMappingURL=defaultConfig.d.ts.map