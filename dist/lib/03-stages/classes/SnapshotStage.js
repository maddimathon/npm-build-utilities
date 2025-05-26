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
import { slugify, timestamp, } from '@maddimathon/utility-typescript/functions';
import { FileSystem, } from '../../00-universal/index.js';
import { AbstractStage } from './abstract/AbstractStage.js';
/**
 * Default snapshot stage.
 *
 * @category Stages
 *
 * @since 0.1.0-alpha.draft
 */
export class SnapshotStage extends AbstractStage {
    /* PROPERTIES
     * ====================================================================== */
    /**
     * Output name for the snapshot zip.
     */
    filename;
    /**
     * Output directory for the snapshot.
     */
    path;
    subStages = [
        'snap',
    ];
    /* Args ===================================== */
    get ARGS_DEFAULT() {
        return {
            ...AbstractStage.ARGS_DEFAULT,
            ignoreGlobs: (stage) => [
                ...FileSystem.globs.IGNORE_COPIED(stage),
                ...FileSystem.globs.IGNORE_COMPILED,
                ...FileSystem.globs.IGNORE_PROJECT,
                ...FileSystem.globs.SYSTEM,
            ],
        };
    }
    /* CONSTRUCTOR
     * ====================================================================== */
    /**
     * @param config    Complete project configuration.
     * @param params    Current CLI params.
     * @param args      Optional. Partial overrides for the default args.
     * @param _pkg      Optional. The current package.json value, if any.
     * @param _version  Optional. Current version object, if any.
     */
    constructor(config, params, args, _pkg, _version) {
        super('snapshot', 'pink', config, params, args, _pkg, _version);
        this.filename = [
            slugify(this.pkg.name.replace(/\//g, '_')),
            slugify(this.version.toString(this.isDraftVersion).replace(/[\.\+]/g, '-')),
            timestamp(null, { date: true, time: true }).replace(/[\-:]/g, '').replace(/[^\d]+/g, '-'),
        ].join('_');
        this.path = this.fs.pathRelative(this.fs.pathResolve(this.config.paths.snapshot, this.filename));
    }
    /* LOCAL METHODS
     * ====================================================================== */
    /**
     * Prints a message to the console signalling the start or end of this
     * build stage.
     *
     * @param which  Whether we are starting or ending.
     */
    async startEndNotice(which) {
        // returns
        if (which !== 'end') {
            return super.startEndNotice(which, false);
        }
        const _endMsg = [
            ['✓ ', { flag: false }],
            ['Snapshot Complete!', { italic: true }],
            [
                this.path + '.zip',
                { bold: false, flag: false, indent: '  ', italic: true }
            ],
        ];
        this.console.startOrEnd(_endMsg, which, { maxWidth: null });
        return;
    }
    /* RUNNING METHODS
     * ====================================================================== */
    async runSubStage(subStage) {
        await this[subStage]();
    }
    async snap() {
        await this._tidy();
        this.console.verbose('copying files...', 1);
        const copyPaths = this.try(this.fs.glob, 2, ['**/*', {
                follow: false,
                ignore: typeof this.args.ignoreGlobs === 'function'
                    ? this.args.ignoreGlobs(this)
                    : this.args.ignoreGlobs,
            },]).filter(path => !this.fs.isSymLink(this.fs.pathResolve(path)));
        this.try(this.fs.copy, this.params.verbose ? 2 : 1, [
            copyPaths,
            this.params.verbose ? 2 : 1,
            this.path,
            null,
            {
                recursive: false,
            },
        ]);
        await this._zip();
        this.console.verbose('removing the snapshot folder...', 1);
        this.try(this.fs.delete, this.params.verbose ? 2 : 1, [this.path, this.params.verbose ? 2 : 1, false]);
    }
    async _tidy() {
        this.console.verbose('removing any current folders...', 1);
        const snapDir = this.config.paths.snapshot.replace(/\/$/g, '') + '/';
        // returns
        if (!this.fs.exists(snapDir)) {
            return;
        }
        const currentFolders = this.fs.readDir(snapDir)
            .map(p => snapDir + p)
            .filter(path => this.fs.isDirectory(path));
        this.try(this.fs.delete, this.params.verbose ? 2 : 1, [currentFolders, this.params.verbose ? 2 : 1, false]);
    }
    async _zip() {
        this.console.verbose('zipping folder...', 1);
        this.try(this.console.nc.cmd, this.params.verbose ? 2 : 1, [`cd ${this.config.paths.snapshot} && zip -r ${this.filename}.zip ${this.filename}`]);
    }
}
//# sourceMappingURL=SnapshotStage.js.map