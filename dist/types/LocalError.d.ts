/**
 * Types for errors handled or thrown by this project.
 *
 * @category Types
 *
 * @since 0.1.0-draft
 *
 * @packageDocumentation
 */
/**
 * @package @maddimathon/build-utilities@0.1.0-draft
 */
/*!
 * @maddimathon/build-utilities@0.1.0-draft
 * @license MIT
 */
import { CustomError, MessageMaker } from '@maddimathon/utility-typescript/classes';
import { Logger } from './Logger.js';
/**
 * Shape of error classes used in this project.
 *
 * @category Types
 *
 * @since 0.1.0-draft
 */
export interface LocalError<Args extends LocalError.Args> extends CustomError<Args> {
}
/**
 * Types used for {@link LocalError} classes.
 *
 * @category Types
 *
 * @since 0.1.0-draft
 */
export declare namespace LocalError {
    /**
     * Optional configuration for {@link LocalError} classes.
     *
     * @since 0.1.0-draft
     */
    type Args = CustomError.Args & {};
    /**
     * Function for handling errors.
     *
     * **Should exit the node process.**
     *
     * @since 0.1.0-draft
     */
    interface Handler {
        (error: Input, level: number, console: Logger, args?: Partial<Handler.Args>): void;
    }
    /**
     * Types for handling errors in a variety of contexts.
     *
     * @since 0.1.0-draft
     */
    namespace Handler {
        /**
         * Optional configuration for {@link Handler} function types.
         */
        interface Args extends CustomError.Handler.Args, MessageMaker.MsgArgs {
        }
    }
    /**
     * Input types for Handler funtions.
     *
     * @expand
     */
    type Input = CustomError.Input;
}
//# sourceMappingURL=LocalError.d.ts.map