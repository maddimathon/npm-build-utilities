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
    arrayUnique,
    escRegExp,
    escRegExpReplace,
    softWrapText,
    timestamp,
} from '@maddimathon/utility-typescript/functions';
import { SemVer } from '../../@internal/index.js';
// import {
// } from '../../01-config/index.js';
import { AbstractStage } from './abstract/AbstractStage.js';
import { FileSystem } from '../../00-universal/index.js';
/**
 * Default release stage.
 *
 * @category Stages
 *
 * @since 0.1.0-alpha
 */
export class ReleaseStage extends AbstractStage {
    /* PROPERTIES
     * ====================================================================== */
    /**
     * Default content for an empty, markdown changelog file.
     *
     * @category Constants
     */
    get DEFAULT_CHANGELOG() {
        return [
            `---`,
            `title: Changelog`,
            `---`,
            ``,
            `# ${this.config.title} Changelog`,
            ``,
            `All notable changes to this project will be documented in this file after/on`,
            `each release.`,
            ``,
            `The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),`,
            `and this project adheres to `,
            `[Semantic Versioning](https://semver.org/spec/v2.0.0.html), i.e.:`,
            `> Given a version number ${'`MAJOR`.`MINOR`.`PATCH`'}, increment the:`,
            `> - ${'`MAJOR`'} version when you make incompatible changes`,
            `> - ${'`MINOR`'} version when you add backwards-compatible functionality`,
            `> - ${'`PATCH`'} version when you make backwards-compatible bug fixes`,
        ].join('\n');
    }
    /**
     * Default content for an empty, markdown release notes file.
     *
     * @category Constants
     */
    get DEFAULT_RELEASE_NOTES() {
        return [
            '',
            '### Removed',
            '- ',
            '',
            '### Moved & Renamed',
            '- ',
            '',
            '### Misc. Breaking',
            '- ',
            '',
            '### Added',
            '- ',
            '',
            '### Changed',
            '- ',
            '',
            '### Deprecated',
            '- ',
            '',
            '### Fixed',
            '- ',
            '',
            '',
        ].join('\n');
    }
    /**
     * {@inheritDoc AbstractStage.subStages}
     *
     * @category Running
     *
     * @source
     */
    subStages = ['changelog', 'package', 'replace', 'commit', 'github', 'tidy'];
    /* Args ===================================== */
    get ARGS_DEFAULT() {
        const replace = (_stage) => {
            return {
                ignore: [
                    ...FileSystem.globs.IGNORE_PROJECT,
                    ...FileSystem.globs.SYSTEM,
                    '**/.vscode/**',
                    '**/*.zip',
                ],
                package: [
                    _stage.getSrcDir().replace(/\/$/gi, '') + '/**/*',
                    _stage.config.paths.release.replace(/\/$/gi, '') + '/**/*',
                    _stage.config.paths.changelog,
                    _stage.config.paths.readme,
                ],
            };
        };
        return {
            commit: null,
            replace,
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
        super('release', 'purple', config, params, args, pkg, version);
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
        // corrects package number
        const inputVersionMessage = 'What version is being released?';
        const inputVersionIndent = ' '.repeat(
            this.console.nc.msg.args.msg.tab.length
                + inputVersionMessage.length
                + 11,
        );
        const inputVersion = (
            (await this.console.nc.prompt.input({
                ...(promptArgs ?? {}),
                message: inputVersionMessage,
                default: this.pkg.version,
                validate: (value) =>
                    value.trim().match(SemVer.regex) ?
                        true
                    :   softWrapText(
                            'The version should be in [MAJOR].[MINOR].[PATCH] format, optionally suffixed with `-alpha[.#]`, `-beta[.#]`, `-rc[.#]`, another valid version code, or metadata prefixed with `+`.',
                            Math.max(
                                20,
                                (this.console.nc.msg.args.msg.maxWidth ?? 80)
                                    - inputVersionIndent.length,
                            ),
                        )
                            .split(/\n/g)
                            .join('\n' + inputVersionIndent),
            })) ?? ''
        ).trim();
        if (inputVersion !== this.pkg.version) {
            const currentPkgJson = this.fs.readFile('package.json');
            this.version = inputVersion;
            this.fs.write(
                'package.json',
                currentPkgJson.replace(
                    /"version":\s*"[^"]*"/gi,
                    escRegExpReplace(`"version": "${inputVersion}"`),
                ),
                { force: true },
            );
        }
    }
    async startEndNotice(which) {
        const version = this.version.toString(this.isDraftVersion);
        // returns
        switch (which) {
            case 'start':
                await super.startEndNotice(which, false);
                return this.startPrompters();
            case 'end':
                const maxWidth = this.console.nc.msg.args.msg.maxWidth ?? 120;
                const _endMsg = [
                    ['✓ ', { flag: false }],
                    ['Released!', { italic: true }],
                    [`${this.pkg.name}@${version}`, { flag: 'reverse' }],
                    ['  🎉 🎉 🎉', { flag: false }],
                    ['\n\n', { flag: false }],
                ];
                if (this.pkg.repository) {
                    _endMsg.push([
                        'eventually I will put a link to the github release draft here: '
                            + this.pkg.repository.replace(/(\/+|\.git)$/g, '')
                            + '/releases',
                        {
                            bold: false,
                            flag: false,
                            indent: '  ',
                            italic: true,
                            maxWidth,
                        },
                    ]);
                }
                this.console.startOrEnd(_endMsg, which, { maxWidth: null });
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
     * Add updates in the release notes file to the changelog.
     *
     * @category Sub-Stages
     */
    async changelog() {
        this.console.progress('updating changelog...', 1);
        const promptArgs = {
            msgArgs: {
                bold: false,
                clr: this.clr,
                depth: 2,
                linesIn: 1,
                maxWidth: null,
            },
            styleClrs: {
                highlight: this.clr,
            },
        };
        const releaseNotesPath = this.config.paths.notes.release;
        // exits
        if (!this.fs.exists(releaseNotesPath)) {
            this.console.log(
                'No release notes file was found, so the release cannot continue.',
                2,
            );
            if (
                await this.console.nc.prompt.bool({
                    ...promptArgs,
                    message:
                        'Do you want to create a release notes file from the template?',
                    default: true,
                })
            ) {
                this.fs.write(releaseNotesPath, this.DEFAULT_RELEASE_NOTES, {
                    force: true,
                });
            }
            process.exit();
        } else if (
            !(await this.console.nc.prompt.bool({
                ...promptArgs,
                message:
                    'Is the release notes file at '
                    + releaseNotesPath.replace(/ /g, '%20')
                    + ' updated?',
                default: false,
            }))
            && !this.params.dryrun
        ) {
            this.console.log(
                'Exiting since release notes are required for release.',
                2,
            );
            process.exit();
        }
        const changelogPath = this.config.paths.changelog;
        const changelogExists = this.fs.exists(changelogPath);
        // exits if not creating a changelog
        if (!changelogExists) {
            /**
             * What to do since no changelog was found.
             */
            const _noChangelogPrompt = await this.console.nc.prompt.select({
                ...promptArgs,
                message: `No changelog was found at configured path (${changelogPath}).  What next?`,
                choices: [
                    {
                        name: 'Create new changelog file',
                        value: 'create-new',
                    },
                    {
                        name: 'Cancel and exit',
                        value: 'cancel',
                    },
                ],
            });
            // returns
            if (_noChangelogPrompt === 'cancel') {
                process.exit();
            }
        }
        let t_currentChangelog =
            changelogExists ?
                this.fs.readFile(changelogPath)
            :   this.DEFAULT_CHANGELOG + '\n\n\n<!--CHANGELOG_NEW-->\n';
        const newEntryRegex = /(\n+)\s*<!--CHANGELOG_NEW-->\s*(\n|$)/g;
        // exits if not adding pleaceholder
        if (
            changelogExists
            && t_currentChangelog.match(newEntryRegex) === null
        ) {
            this.console.log(
                [
                    [
                        'The new entry placeholder was not found in the config file.',
                    ],
                    [
                        'The placeholder (`<!--CHANGELOG_NEW-->`) must be on its own line with no extra spaces and is case-sensitive.',
                        { bold: false },
                    ],
                ],
                2,
                { bold: true },
            );
            const _noNewEntryPlaceholderPrompt = {
                ...promptArgs,
                message:
                    'Once you’ve added the placeholder, please hit continue.',
                choices: [
                    {
                        name: 'Continue',
                        value: 'continue',
                    },
                    {
                        name: 'Cancel and exit',
                        value: 'cancel',
                    },
                ],
            };
            do {
                const _noNewEntryPlaceholder =
                    await this.console.nc.prompt.select(
                        _noNewEntryPlaceholderPrompt,
                    );
                // exits
                if (_noNewEntryPlaceholder === 'cancel') {
                    process.exit();
                }
                _noNewEntryPlaceholderPrompt.message =
                    'The placeholder still wasn’t found, please check again and hit continue.';
                t_currentChangelog = this.fs.readFile(changelogPath);
            } while (t_currentChangelog.match(newEntryRegex) === null);
        }
        const currentChangelog = t_currentChangelog;
        const releaseNotes = this.fs.readFile(releaseNotesPath);
        const newChangeLogEntry =
            '<!--CHANGELOG_NEW-->\n\n\n'
            + `## **${this.version.toString(false)}** — ${timestamp(null, { date: true, time: false })}`
            + '\n\n'
            + releaseNotes.trim()
            + '\n\n\n';
        // returns
        if (this.params.dryrun) {
            if (!changelogExists) {
                this.console.verbose('writing changelog template...', 2);
                this.fs.write(changelogPath, currentChangelog, { force: true });
            }
            this.console.vi.debug(
                { newChangeLogEntry: '\n' + newChangeLogEntry },
                2,
                { maxWidth: null },
            );
            this.console.verbose(
                'skipping changelog update during dryrun...',
                2,
            );
            return;
        }
        this.console.verbose('writing updated changelog...', 2);
        this.fs.write(
            changelogPath,
            currentChangelog
                .replace(
                    newEntryRegex,
                    '$1' + escRegExpReplace(newChangeLogEntry),
                )
                .trim(),
            { force: true },
        );
    }
    /**
     * Git commits files changed and created during build and package.
     *
     * @category Sub-Stages
     */
    async commit() {
        this.console.progress('commiting any new changes...', 1);
        const version = this.version.toString();
        const relPath = this.config.paths.release.replace(/\/+$/g, '');
        /** To add to commit. */
        let updatedPaths = [
            this.getDistDir(),
            this.getDistDir('docs'),
            this.getDistDir('scss'),
            relPath + '/*.zip',
            this.config.paths.changelog,
            this.config.paths.readme,
        ];
        // adds replaced files to the commit too
        if (this.args.replace) {
            const _relPathRegex = new RegExp('^' + escRegExp(relPath), 'gi');
            updatedPaths = updatedPaths.concat(
                this.args
                    .replace(this)
                    .package.filter(
                        (_path) => _path.match(_relPathRegex) === null,
                    )
                    .map((_path) => _path.replace(/(\/\*{1,2}){1,2}$/gi, '')),
            );
        }
        updatedPaths = arrayUnique(updatedPaths).filter(
            (_path) => this.fs.exists(_path) || _path.includes('*'),
        );
        if (this.args.commit) {
            updatedPaths = this.args.commit(this, updatedPaths);
        }
        const gitCmd =
            ''
            + `git fetch`
            + ' && '
            + `git add "${updatedPaths.join('" "')}"`
            + ' && '
            + `git commit -a --allow-empty -m "[${timestamp(null, { date: true, time: false })}] release: ${version}"`;
        // returns
        if (this.params.dryrun) {
            this.console.verbose('skipping git commit during dryrun...', 2);
            this.console.vi.verbose({ gitCmd }, 3, { maxWidth: null });
            this.console.vi.debug({ gitCmd }, this.params.verbose ? 3 : 2, {
                maxWidth: null,
            });
            return;
        }
        this.console.vi.debug({ gitCmd }, 2, { maxWidth: null });
        // commit, tag, and push tags
        for (const _cmd of [
            gitCmd,
            `git tag -a -f ${version} -m "release: ${version}"`,
            `git push --tags || echo ''`,
        ]) {
            this.try(this.console.nc.cmd, 2, [_cmd]);
        }
        this.console.verbose('pushing to origin...', 2);
        this.try(this.console.nc.cmd, 2, ['git push']);
    }
    /**
     * Uses GitHub API to update repo meta and draft a release.
     *
     * @category Sub-Stages
     */
    async github() {
        this.console.progress('publishing to github...', 1);
        const version = this.version.toString(false);
        this.console.verbose('updating repo metadata...', 2);
        const repoUpdateCmd = `gh repo edit ${this.console.nc.cmdArgs(
            {
                description: this.pkg.description ?? null,
                homepage: this.pkg.homepage ?? null,
            },
            false,
            false,
        )}`;
        if (this.params.dryrun) {
            this.console.verbose('skipping repo updates during dryrun...', 3);
            this.console.vi.debug(
                { repoUpdateCmd },
                this.params.verbose ? 4 : 2,
                { maxWidth: null },
            );
        } else {
            this.try(this.console.nc.cmd, 2, [repoUpdateCmd]);
        }
        this.console.verbose('creating github release...', 2);
        const releaseAttachment = `"${this.releaseDir.replace(/\/*$/g, '') + '.zip'}#${this.pkg.name}@${version}"`;
        const releaseCmd = `gh release create ${version} ${releaseAttachment} ${this.console.nc.cmdArgs(
            {
                draft: true,
                'notes-file': this.config.paths.notes.release,
                title: `${version} — ${timestamp(null, { date: true, time: false })}`,
            },
            false,
            false,
        )}`;
        this.console.vi.debug({ releaseCmd }, this.params.verbose ? 3 : 2, {
            maxWidth: null,
        });
        if (this.params.dryrun) {
            this.console.verbose('skipping github release during dryrun...', 3);
        } else {
            this.try(this.console.nc.cmd, 2, [releaseCmd]);
        }
    }
    /**
     * Runs the project's package class.
     *
     * @category Sub-Stages
     */
    async package() {
        await this.runStage('package', 1);
    }
    /**
     * Replaces package placeholders in the source.
     *
     * @category Sub-Stages
     */
    async replace() {
        if (!this.args.replace) {
            return;
        }
        this.console.progress('replacing placeholders in source...', 1);
        // returns
        if (this.params.dryrun) {
            this.console.progress('skipping replacements during dryrun...', 2);
            return;
        }
        const globs = this.args.replace(this);
        this.replaceInFiles(
            globs.package,
            'package',
            2,
            globs.ignore ?? [...FileSystem.globs.SYSTEM],
        );
    }
    /**
     * Resets the release notes file.
     *
     * @category Sub-Stages
     */
    async tidy() {
        this.console.progress('tidying up...', 1);
        if (!this.params.dryrun) {
            this.console.verbose('resetting release notes...', 2);
            this.fs.write(
                this.config.paths.notes.release,
                this.DEFAULT_RELEASE_NOTES,
                { force: true },
            );
        }
    }
}
//# sourceMappingURL=ReleaseStage.js.map
