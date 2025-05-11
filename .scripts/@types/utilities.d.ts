/**
 * Utility types for build process scripts.
 * 
 * @package @maddimathon/npm-build-utilities
 * @since ___PKG_VERSION___
 */

import { GlobOptions } from 'glob';

import pkg from '../../package.json';

export type PackageJson = typeof pkg;