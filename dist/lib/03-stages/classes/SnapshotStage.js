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
import { slugify, timestamp } from '@maddimathon/utility-typescript/functions';
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
                '.git/**',
                'node_modules/**',
                'dist/**',
                'docs/**',
                `${stage.config.paths.release.replace(/\/$/g, '')}/**`,
                `${stage.config.paths.snapshot.replace(/\/$/g, '')}/**`,
                '**/._*',
                '**/._*/**',
                '**/.DS_Store',
                '**/.smbdelete**',
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
    /* RUNNING METHODS
     * ====================================================================== */
    async runSubStage(subStage) {
        await this[subStage]();
    }
    async snap() {
        this.console.progress('copying files...', 1);
        this.fs.copy('*', 2, this.path, null, {
            glob: {
                ignore: typeof this.args.ignoreGlobs === 'function'
                    ? this.args.ignoreGlobs(this)
                    : this.args.ignoreGlobs,
            },
        });
        await this._zip();
        await this._tidy();
    }
    async _zip() {
        this.console.progress('(NOT IMPLEMENTED) zipping folder...', 1);
    }
    async _tidy() {
        this.console.progress('(NOT IMPLEMENTED) deleting snapshot folder...', 1);
    }
}
//# sourceMappingURL=SnapshotStage.js.map