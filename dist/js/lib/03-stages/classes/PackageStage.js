/**
 * @since 0.1.0-alpha
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.3.0-alpha.2
 * @license MIT
 */ import {
    arrayUnique,
    escRegExp,
    timestamp,
} from '@maddimathon/utility-typescript/functions';
import { node } from '@maddimathon/utility-typescript/classes';
import { SemVer, StageError } from '../../@internal/index.js';
import { FileSystem } from '../../00-universal/index.js';
// import {
// } from '../../01-config/index.js';
import { AbstractStage } from './abstract/AbstractStage.js';
/**
 * Default package stage.
 *
 * @category Stages
 *
 * @since 0.1.0-alpha
 */
export class PackageStage extends AbstractStage {
    /* PROPERTIES
     * ====================================================================== */
    /**
     * {@inheritDoc AbstractStage.subStages}
     *
     * @category Running
     *
     * @source
     */
    subStages = ['snapshot', 'build', 'copy', 'zip'];
    /* Args ===================================== */
    get ARGS_DEFAULT() {
        return {
            utils: {},
        };
    }
    /* CONSTRUCTOR
     * ====================================================================== */
    /**
     * @category Constructor
     *
     * @param config   Current project config.
     * @param params   Current CLI params.
     * @param args     Partial overrides for the default args.
     * @param pkg      Parsed contents of the project’s package.json file.
     * @param version  Version object for the project’s version.
     */
    constructor(config, params, args, pkg, version) {
        super(
            'package',
            params.releasing ? 'orange' : 'purple',
            config,
            params,
            args,
            pkg,
            version,
        );
    }
    /* LOCAL METHODS
     * ====================================================================== */
    /**
     * Runs the prompters to confirm before starting the substages.
     *
     * @category Running
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
     *
     * @category Sub-Stages
     */
    async build() {
        await this.runStage('build', 1);
    }
    /**
     * Copies all project files to the release directory.
     *
     * @category Sub-Stages
     */
    async copy() {
        this.console.progress('copying files to package directory...', 1);
        // throws & returns
        if (!this.pkg.files?.length) {
            this.handleError(
                new StageError('No files defined in package.json for export', {
                    class: 'PackageStage',
                    method: 'copy',
                }),
                2,
            );
            return;
        }
        const releaseDir = this.releaseDir;
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
        if (this.fs.exists(releaseDir)) {
            this.console.verbose('deleting current package folder...', 2);
            this.try(this.fs.delete, this.params.verbose ? 4 : 3, [
                [releaseDir],
                this.params.verbose ? 3 : 2,
            ]);
        }
        this.console.verbose('copying files to package...', 2);
        this.fs.copy(
            this.pkg.files,
            this.params.verbose ? 3 : 2,
            releaseDir,
            './',
            {
                glob: {
                    filesOnly: true,
                    ignore,
                },
            },
        );
        this.console.verbose('replacing placeholders in package...', 2);
        const replaceGlobs = [releaseDir.replace(/\/$/gi, '') + '/**/*'];
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
     *
     * @category Sub-Stages
     */
    async snapshot() {
        await this.runStage('snapshot', 1);
    }
    /**
     * Zips the release directory.
     *
     * @category Sub-Stages
     */
    async zip() {
        this.console.progress('zipping package...', 1);
        let zipPath = this.releaseDir.replace(/\/*$/g, '') + '.zip';
        /**
         * Directory to use as working dir when zipping the project.
         * With a trailing slash.
         */
        const zippingPWD =
            this.fs.pathResolve(this.releaseDir, '..').replace(/\/*$/g, '')
            + '/';
        /**
         * Regex that matches the path to the working directory to zip from.
         */
        const zippingPWD_regex = new RegExp('^' + escRegExp(zippingPWD), 'g');
        /*
         * Correcting and formatting the output zip path.
         */
        zipPath =
            this.fs.pathResolve(zipPath).replace(/(\/*|\.zip)?$/g, '') + '.zip';
        if (this.fs.exists(zipPath)) {
            const _timeStr = timestamp(null, {
                date: true,
                separator: '@',
                time: true,
            })
                .replace(/[^a-z|0-9|\@]+/gi, '')
                .replace(/@/g, '-');
            zipPath = this.fs.uniquePath(
                zipPath.replace(/(\/*|\.zip)?$/g, '') + `-${_timeStr}.zip`,
            );
        }
        /**
         * All files to include in the zip file.
         */
        const files = this.fs
            .glob(this.releaseDir.replace(/\/*$/g, '/**'), { filesOnly: true })
            .map((p) => p.replace(zippingPWD_regex, ''));
        /*
         * Running the command.
         */
        const zipCMD = `cd "${this.fs.pathRelative(zippingPWD)}" && zip "${zipPath.replace(zippingPWD_regex, '')}" '${files.join("' '")}'`;
        this.try(this.console.nc.cmd, this.params.verbose ? 3 : 2, [zipCMD]);
    }
}
//# sourceMappingURL=PackageStage.js.map
