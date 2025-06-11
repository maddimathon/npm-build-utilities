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