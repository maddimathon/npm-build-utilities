---
title: Using the Library
---

# Using the Library

This library is best used by defining a configuation object, optionally
extending some of the included classes, and then running them from the command
line.


## Command Line

The following sub-commands are available with the `build-utils` command:
1. [help](#help)
1. [debug](#debug)
1. [snapshot](#snapshot)
1. [compile](#compile)
1. [test](#test)
1. [document](#document)
1. [build](#build)
1. [package](#package)
1. [release](#release)

### Universal Options

These options are defined and documented by {@link CLI.Params}.

| Option      | Type      | Default | Notes                                                 |
| :---------- | :-------- | :------ | :---------------------------------------------------- |
| --config    | `string`  |         | Path to the configuration file for the project.       |
| --debug     | `boolean` | false   | Whether to display debugging messages.                |
| --notice    | `boolean` | true    | Whether to display notice (stage start/end) messages. |
| --progress  | `boolean` | true    | Whether to display progress messages.                 |
| --verbose   | `boolean` | false   | Whether to display extra logging information.         |
|             |           |         |                                                       |
| --only      | `boolean` | false   | Only sub-stages to run during the stage.              |
| --without   | `boolean` | false   | Sub-stages to skip when running the stage.            |
|             |           |         |                                                       |
| --building  | `boolean` | false   |                                                       |
| --dryrun    | `boolean` | false   |                                                       |
| --packaging | `boolean` | false   |                                                       |
| --releasing | `boolean` | false   |                                                       |
| --starting  | `boolean` | false   |                                                       |

#### Examples

```sh
build-utils compile --no-verbose --config .config/build-utils.config.js --starting
build-utils package --verbose --debug --dryrun
```

### Help

```sh
build-utils help 
```

### Debug

```sh
build-utils debug 
```

### Snapshot

```sh
build-utils snapshot 
```

### Compile

See {@link CompileStage.Args} for complete details.

```sh
build-utils compile [...args]
```

### Test

```sh
build-utils test 
```

### Document

```sh
build-utils document 
```

### Build

```sh
build-utils build 
```

### Package

```sh
build-utils package 
```

### Release

```sh
build-utils release 
```
