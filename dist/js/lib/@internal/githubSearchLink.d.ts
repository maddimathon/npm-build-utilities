/**
 * @since ___\PKG_VERSION___
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.3.0-alpha.8
 * @license MIT
 */
/**
 * Builds a github search URL with the given params.
 *
 * @see {@link https://github.com/search/advanced | Advanced Search (GitHub)}
 * @see {@link https://docs.github.com/en/search-github/getting-started-with-searching-on-github/about-searching-on-github | About searching on GitHub (GitHub)}
 * @see {@link https://docs.github.com/en/search-github/getting-started-with-searching-on-github/understanding-the-search-syntax | Understanding the search syntax (GitHub)}
 * @see {@link https://docs.github.com/en/search-github/github-code-search/understanding-github-code-search-syntax | Understanding GitHub Code Search syntax (GitHub)}
 * @see {@link https://docs.github.com/en/search-github/searching-on-github/searching-for-repositories | Searching for repositories (GitHub)}
 * @see {@link https://docs.github.com/en/search-github/searching-on-github/searching-issues-and-pull-requests | Searching issues and pull requests (GitHub)}
 * @see {@link https://docs.github.com/en/search-github/searching-on-github/searching-users | Searching users (GitHub)}
 *
 * @since ___\PKG_VERSION___
 *
 * @UPGRADE
 * @internal
 */
export declare function githubSearchLink(params: githubSearchLink.Params): string;
export declare namespace githubSearchLink {
    type Params = Params.Basic;
    namespace Params {
        /**
         * Basic search parameters.
         */
        interface Basic {
            /**
             * An extension name.
             */
            extension?: string | string[];
            /**
             * A location string.
             */
            location?: string | string[];
            /**
             * Defines where to look for the given keywords.
             */
            in?: string | string[];
            /**
             * Basic search term(s) to *exclude* from results.
             */
            not?: string | string[];
            /**
             * Just basic search term(s).
             */
            keyword?: string | string[];
            /**
             * Restrict the search by owner username(s).
             */
            user?: string | string[];
        }
        /**
         * Search for part of code.
         */
        interface Code extends Basic {
        }
        /**
         * Search within issues for a repo.
         */
        interface Issue extends Basic {
        }
        /**
         * Search in a repo.
         */
        interface Repo extends Basic {
            /**
             * Full name of the repo to search within.
             */
            repo: string;
        }
        /**
         * Search for a user.
         */
        interface User extends Basic {
        }
    }
}
//# sourceMappingURL=githubSearchLink.d.ts.map