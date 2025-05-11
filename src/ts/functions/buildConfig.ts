/**
 * @since ___PKG_VERSION___
 * 
 * @packageDocumentation
 */
/**
 * @package @maddimathon/npm-build-utilities@___CURRENT_VERSION___
 */
/*!
 * @maddimathon/npm-build-utilities@___CURRENT_VERSION___
 * @license MIT
 */

import { ProjectConfig, ProjectConfigDefault } from '../types/ProjectConfig.js';

/**
 * Builds a complete configuration object to work with in the library.
 * 
 * @param config  Configuration to override defaults.
 * 
 * @expandType ProjectConfigDefault
 */
export function buildConfig( config: ProjectConfig ): ProjectConfigDefault {

    return {
        ...config,
    };
}