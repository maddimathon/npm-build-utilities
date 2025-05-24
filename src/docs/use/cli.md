---
title: CLI
---

# Use via Command Line

The CLI is the intended way to use this library.  It is designed so that you can
run the CLI before configuring the library at all — if the configuration or
required files are missing, the CLI will prompt you for the missing info (and
optionally create the missing files).


## Syntax

```sh
build-utils [command] [...options]
```

## Commands

There are two meta-utility commands:
1. `help`
2. `debug`

There are seven commands for running build stages:
1. `snapshot`
2. `compile`
3. `test`
4. `document`
5. `build`
6. `package`
7. `release`


## Options

These options are defined and documented by {@link CLI.Params}.

| Option        | Type    | Default                                       | Notes                                                 |
| :------------ | :------ | :-------------------------------------------- | :---------------------------------------------------- |
| `--config`    | string  | *see [config page](../config.md) for details* | Path to the configuration file for the project.       |
| `--debug`     | boolean | `false`                                       | Whether to display debugging messages.                |
| `--notice`    | boolean | `true`                                        | Whether to display notice (stage start/end) messages. |
| `--progress`  | boolean | `true`                                        | Whether to display progress messages.                 |
| `--verbose`   | boolean | `false`                                       | Whether to display extra logging information.         |
|               |         |                                               |                                                       |
| `--only`      | boolean | `false`                                       | Only sub-stages to run during the stage.              |
| `--without`   | boolean | `false`                                       | Sub-stages to skip when running the stage.            |
|               |         |                                               |                                                       |
| `--building`  | boolean | `false`                                       |                                                       |
| `--dryrun`    | boolean | `false`                                       |                                                       |
| `--packaging` | boolean | `false`                                       |                                                       |
| `--releasing` | boolean | `false`                                       |                                                       |
| `--starting`  | boolean | `false`                                       |                                                       |


## Examples

```sh
build-utils compile --no-verbose --config .config/build-utils.config.js --starting
build-utils package --verbose --debug --dryrun
```