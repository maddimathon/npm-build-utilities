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
 */ import { arrayUnique } from '@maddimathon/utility-typescript/functions';
import { FileSystem } from '../../00-universal/index.js';
import { AbstractStage } from './abstract/AbstractStage.js';
/**
 * Default package stage.
 *
 * @category Stages
 *
 * @since 0.1.0-alpha.draft
 */
export class PackageStage extends AbstractStage {
    /* PROPERTIES
     * ====================================================================== */
    subStages = ['snapshot', 'build', 'copy', 'zip'];
    /* Args ===================================== */
    get ARGS_DEFAULT() {
        return {
            ...AbstractStage.ARGS_DEFAULT,
        };
    }
    /* CONSTRUCTOR
     * ====================================================================== */
    /**
     * @param config  Complete project configuration.
     * @param params  Current CLI params.
     * @param args    Optional. Partial overrides for the default args.
     * @param _pkg      Optional. The current package.json value, if any.
     * @param _version  Optional. Current version object, if any.
     */
    constructor(config, params, args, _pkg, _version) {
        super(
            'package',
            params?.releasing ? 'orange' : 'purple',
            config,
            params,
            args,
            _pkg,
            _version,
        );
    }
    /* LOCAL METHODS
     * ====================================================================== */
    /**
     * Runs the prompters to confirm before starting the substages.
     */
    async startPrompters() {
        const promptArgs = {
            default: false,
            msgArgs: {
                clr: this.clr,
                depth: 1,
                maxWidth: null,
            },
            styleClrs: {
                highlight: this.clr,
            },
        };
        this.params.dryrun =
            (await this.console.nc.prompt.bool({
                ...promptArgs,
                message: `Is this a dry run?`,
                default: !!this.params.dryrun,
                msgArgs: {
                    ...promptArgs.msgArgs,
                    linesIn: 1 + (promptArgs.msgArgs?.linesIn ?? 0),
                },
            })) ?? !!this.params.dryrun;
    }
    /**
     * Prints a message to the console signalling the start or end of this
     * build stage.
     *
     * @param which  Whether we are starting or ending.
     */
    async startEndNotice(which) {
        const version = this.version.toString(this.isDraftVersion);
        // returns
        switch (which) {
            case 'start':
                this.console.startOrEnd(
                    [
                        ['PACKAGING...'],
                        [`${this.pkg.name}@${version}`, { flag: 'reverse' }],
                    ],
                    which,
                );
                if (!this.params.releasing) {
                    await this.startPrompters();
                }
                return;
            case 'end':
                this.console.startOrEnd(
                    [
                        ['✓ ', { flag: false }],
                        ['Packaged!', { italic: true }],
                        [`${this.pkg.name}@${version}`, { flag: 'reverse' }],
                    ],
                    which,
                );
                return;
        }
        return super.startEndNotice(which, false);
    }
    /* RUNNING METHODS
     * ====================================================================== */
    async runSubStage(subStage) {
        await this[subStage]();
    }
    /**
     * Runs the project's build class.
     */
    async build() {
        await this.runStage('build', 1);
    }
    async copy() {
        this.console.progress('copying files to package directory...', 1);
        const sourceGlobs = [
            ...(this.pkg.files ?? []),
            // '.npmrc',
            // '.nvmrc',
            // 'package.json',
            // 'package-lock.json',
            // 'LICENSE.md',
            // 'README.md',
            // 'tsconfig.base.json',
        ];
        // this.console.vi.log( { sourceGlobs }, 2 );
        const outDir = this.releasePath;
        // this.console.vi.log( { outDir }, 2 );
        const sourceDir = './';
        // this.console.vi.log( { sourceDir }, 2 );
        let t_ignore = [
            ...FileSystem.globs.SYSTEM,
            '**/.archive/**',
            '**/.cache/**',
            '**/.snapshots/**',
            '**/composer.phar',
            '**/*.css.map',
            '**/*.js.map',
            '**/*.test.d.ts',
            '**/*.test.d.ts.map',
            '**/*.test.js',
        ];
        for (const _path of ['.gitignore', '.npmignore']) {
            const _ignoreFile = this.fs.readFile(_path);
            // continues
            if (!_ignoreFile) {
                continue;
            }
            for (const _line of _ignoreFile.split(/\n/i)) {
                // continues
                if (_line.match(/^(#+\s|!)/gi) !== null) {
                    continue;
                }
                if (_line) {
                    t_ignore.push(_line);
                }
            }
        }
        const ignore = arrayUnique(t_ignore);
        // this.console.vi.log( { ignore }, 2 );
        // this.console.vi.log( { filesToCopy: this.fs.glob( sourceGlobs, { ignore } ).map( this.fs.pathRelative ) }, 2 );
        if (this.fs.exists(outDir)) {
            this.console.verbose('deleting current package folder...', 2);
            this.try(this.fs.delete, this.params.verbose ? 4 : 3, [
                [outDir],
                this.params.verbose ? 3 : 2,
            ]);
        }
        this.console.verbose('copying files to package...', 2);
        this.fs.copy(
            sourceGlobs,
            this.params.verbose ? 3 : 2,
            outDir,
            sourceDir,
            { glob: { ignore } },
        );
        this.console.verbose('replacing placeholders in package...', 2);
        const replaceGlobs = [outDir.replace(/\/$/gi, '') + '/**/*'];
        for (const _key of ['current', 'package']) {
            this.replaceInFiles(
                replaceGlobs,
                _key,
                this.params.verbose ? 3 : 2,
            );
        }
    }
    /**
     * Runs the project's snapshot class.
     */
    async snapshot() {
        await this.runStage('snapshot', 1);
    }
    async zip() {
        this.console.progress('(NOT IMPLEMENTED) running zip sub-stage...', 1);
    }
}
//# sourceMappingURL=PackageStage.js.map
