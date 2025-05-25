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
import type { Logger } from '../../types/index.js';
import { ProjectConfig } from '../01-config/index.js';
import { BuildStage, CompileStage, PackageStage, ReleaseStage, SnapshotStage } from './index.js';
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
        readonly tsConfig: {
            readonly extends: ["@tsconfig/node20/tsconfig.json"];
            readonly exclude: ["**/node_modules/**/*"];
            readonly compilerOptions: {
                readonly allowJs: true;
                readonly checkJs: true;
                readonly declaration: true;
                readonly declarationMap: true;
                readonly esModuleInterop: true;
                readonly exactOptionalPropertyTypes: false;
                readonly forceConsistentCasingInFileNames: true;
                readonly lib: ["ES2022"];
                readonly module: "node18";
                readonly moduleResolution: "node16";
                readonly noFallthroughCasesInSwitch: true;
                readonly noImplicitAny: true;
                readonly noImplicitOverride: true;
                readonly noImplicitReturns: true;
                readonly noImplicitThis: true;
                readonly noUnusedLocals: true;
                readonly pretty: true;
                readonly removeComments: false;
                readonly resolveJsonModule: true;
                readonly skipLibCheck: true;
                readonly sourceMap: true;
                readonly strict: true;
                readonly strictBindCallApply: true;
                readonly target: "es2022";
            };
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
            readonly ts: "dist/js";
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