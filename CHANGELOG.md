---
title: Changelog
---

# NPM Build Utilities Changelog

All notable changes to this project will be documented in this file after/on
each release.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to 
[Semantic Versioning](https://semver.org/spec/v2.0.0.html), i.e.:
> Given a version number `MAJOR`.`MINOR`.`PATCH`, increment the:
> - `MAJOR` version when you make incompatible changes
> - `MINOR` version when you add backwards-compatible functionality
> - `PATCH` version when you make backwards-compatible bug fixes


<!--CHANGELOG_NEW-->


## **0.2.0-alpha.3** — 2025-08-21

### Fixed
- Updated dependencies


## **0.2.0-alpha.2** — 2025-08-21

### Added
- New static accessor FileSystem.prettierConfig for easily making prettier json
  config files
- Custom Compile build stage to compile json files
- Error catching to prettifying written config file

### Changed
- Added peer dependencies (optional) for jest, postcss, postcss-preset-env,
  prettier, sass, typedoc, typedoc-plugin-inline-sources, and typescript

### Deprecated
- FileSystem.prettier.ARGS_DEFAULT deprecated and replaced by static accessor
  FileSystem.prettierConfig
- AbstractStage.runCustomScssDirSubStage() third param changed from a boolean to
  an args object

### Fixed
- Updated dependencies


## **0.2.0-alpha.1** — 2025-07-08

Quick fix.

### Fixed
- Added logLevelBase param to AbstractStage.runCustomDirCopySubStage() and
  AbstractStage.runCustomScssDirSubStage() methods


## **0.2.0-alpha** — 2025-07-01

Added PostCSS support (enabled by default) and better uncaught error handling.

### Moved & Renamed
- SemVer.regex converted to static and public

### Misc. Breaking
- PostCSS processing enabled by default in Stage_Compiler.scss,
  Stage.Args.Compile, and AbstractStage.runCustomScssDirSubStage() 
- Added `verbatimModuleSyntax: true` to base tsconfig

### Added
- Uncaught error handling - with uncaughtErrorListener() methods in Project
  (static) and Stage (local) classes
- PostCSS support in Stage.Compiler, AbstractStage, and CompileStage
  (enabled by default)
- `verbatimModuleSyntax: true` to base tsconfig
- Stage_Compiler.getTsConfig() method
- Stage_Compiler.getTsConfigOutDir() method
- Stage_Compiler.typescript() optional param: errorIfNotFound
- Stage_Compiler.getTsConfigPaths() static method (this logic was previously in
  CompileStage.typescript())
- Stage_Compiler.postCssConfig() static method
- TestStage.tsConfigTidyPaths() method for default Stage.Args.Test.js.tidy

### Fixed
- Bugs in AbstractStage.runCustomDirCopySubStage() and
  AbstractStage.runCustomScssDirSubStage():
    - Deletion was left in dry-run mode
    - Notice output level for fs.delete calls
- Rare bug resulting in uncaught error while constructing a SemVer while
  running build as a sub-stage
- Updated dependency versions


## **0.1.4-alpha** — 2025-06-29

Quick update to facilitate common custom sub-stage types and test typescript
config file compatibility.

### Added
- AbstractStage.runCustomDirCopySubStage() - experimental
- AbstractStage.runCustomScssDirSubStage() - experimental

### Fixed
- Improved exports schema in package.json for explicit types paths


## **0.1.3** — 2025-06-19

Quick fix for better ts compiling.

### Added
- Option to Stage.Compiler args (ts.tidyGlobs) to delete unneeded ts files after
  compile (e.g., type-only files)

### Fixed
- Added deprecated heading to template release notes file


## **0.1.2** — 2025-06-11

### Fixed
- Reverted jest peerDependencies version to match dependency


## **0.1.1** — 2025-06-11

### Added
- Release stage args now have a commit prop for filtering commit paths

### Changed
- Stage_Compiler.scss() now forces an instance of `NodePackageImporter` into the
  config

### Fixed
- Bug in git commit in release stage if dist is in gitignore
- Compiler methods are now bound to this in the constructor


## **0.1.0** — 2025-06-11

External testing complete, upgrading to release.

### Changed
- Release notes template updated
- Version updating in demo package.json files improved

### Fixed
- Updated versions of brace-expansion in dependencies to 4.0.0


## **0.1.0-alpha.1** — 2025-06-11

### Moved & Renamed
- Moved ProjectConfig class to 04-project folder; earlier references now use new
  Config.Class interface

### Added
- Class interface to Config namespace — this types the class methods
- Default interface to Config namespace — export shape used when writing new
  config files
- isObjectEmpty() internal function

### Fixed
- Fixed default config file output (wrong var, so config did not convert to
  json)
- Now updating dependency versions in demos on releasing build
- Improved additional new-config questions in CLI


## **0.1.0-alpha** — 2025-06-09

First release, everything is new!

### Classes
- AbstractStage
- BuildStage
- CompileStage
- DocumentStage
- PackageStage
- ReleaseStage
- SnapshotStage
- TestStage
- FileSystem (and namespace)
- Project
- ProjectConfig

#### Internal
- AbstractError (and namespace)
- ProjectError
- SemVer (and namespace)
- Stage_Compiler
- Stage_Console
- StageError
- UnknownCaughtError

### Functions
- catchOrReturn
- defaultConfig
- parseParamsCLI (and namespace)

#### Internal
- errorHandler
- errorStringify
- getConfig
- getDefaultStageClass
- getPackageJson
- internalConfig
- isConfigValid
- logError (and namespace)
- writeLog (and namespace)

### Types
- Config (and namespace)
- Stage (and namespace)
- CLI namespace

#### Internal
- FileSystemType (and namespace)
- Logger (and namespace)