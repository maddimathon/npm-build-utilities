/**
 * @since ___\PKG_VERSION___
 *
 * @packageDocumentation
 */
/*!
 * @maddimathon/build-utilities@0.2.0-alpha.1
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
export function githubSearchLink(params) {
    const url = new URL('https://github.com/search');
    console.log('params = ', JSON.stringify(params, null, 4));
    console.log('url = ', url.toString());
    const setParam = (key, value) => {
        // returns
        if (url.search) {
            url.search = '&' + key + '=' + value;
            return;
        }
        url.search = key + '=' + value;
    };
    for (const t_key in params) {
        const _key = t_key;
        // continues
        if (!params[_key]) {
            continue;
        }
        switch (_key) {
            case 'not':
                break;
            case 'keyword':
                break;
            default:
                _key;
                // breaks
                if (typeof params[_key] === 'string') {
                    setParam(_key, params[_key]);
                    break;
                }
                for (const _term of params[_key]) {
                    setParam(_key, _term);
                }
                break;
        }
    }
    return url.toString();
}
(function (githubSearchLink) {})(githubSearchLink || (githubSearchLink = {}));
//# sourceMappingURL=githubSearchLink.js.map
