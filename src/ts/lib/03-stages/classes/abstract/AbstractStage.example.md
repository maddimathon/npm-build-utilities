
#### Example

```ts
/**
 * @since ___PKG_VERSION___
 */
export class ExampleStage extends AbstractStage { }

/**
 * Used only for {@link ExampleStage}.
 */
export namespace ExampleStage {

    /**
     * Optional configuration for {@link ExampleStage}.
     * 
     * @since ___PKG_VERSION___
     */
    export interface Args extends Stage.Args { };
}
```