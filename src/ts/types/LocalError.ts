/**
 * Types for errors handled or thrown by this project.
 * 
 * @category Types
 * 
 * @since ___PKG_VERSION___
 * 
 * @packageDocumentation
 */
/**
 * @package @maddimathon/build-utilities@___CURRENT_VERSION___
 */
/*!
 * @maddimathon/build-utilities@___CURRENT_VERSION___
 * @license MIT
 */

import {
    CustomError,
    MessageMaker,
} from '@maddimathon/utility-typescript/classes';

import type { Logger } from './Logger.js';
import type { FileSystemType } from './FileSystemType.js';


/**
 * Shape of error classes used in this project.
 * 
 * @category Types
 * 
 * @since ___PKG_VERSION___
 */
export interface LocalError<
    Args extends LocalError.Args,
> extends CustomError<Args> { }

/**
 * Types used for {@link LocalError} classes.
 * 
 * @category Types
 * 
 * @since ___PKG_VERSION___
 */
export namespace LocalError {

    /**
     * Optional configuration for {@link LocalError} classes.
     * 
     * @since ___PKG_VERSION___
     */
    export type Args = CustomError.Args & {
    };

    /**
     * Function for handling errors.
     * 
     * **Should exit the node process.**
     * 
     * @since ___PKG_VERSION___
     */
    export interface Handler {
        (
            error: Input,
            level: number,
            console: Logger,
            fs: FileSystemType,
            args?: Partial<Handler.Args>,
        ): void;
    }

    /** 
     * Types for handling errors in a variety of contexts.
     * 
     * @since ___PKG_VERSION___
     */
    export namespace Handler {

        /**
         * Optional configuration for {@link Handler} function types.
         */
        export interface Args extends CustomError.Handler.Args, MessageMaker.BulkMsgArgs {
        };
    };

    /**
     * Input types for Handler funtions.
     * 
     * @expand
     */
    export type Input = CustomError.Input;
}