/**
 * @since 0.1.0-alpha
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.3.0-beta.draft
 * @license MIT
 */
import { AbstractError } from './abstract/AbstractError.js';
/**
 * An extension of the utilities error for use while running a {@link AbstractStage}.
 *
 * @category Errors
 *
 * @since 0.1.0-alpha
 */
export declare class StageError extends AbstractError {
    readonly name: string;
}
