const GISCUS_SCRIPT_SRC = "https://giscus.app/client.js"
const DEFAULT_LANG = "ko"
const DEFAULT_THEME = "light"

/**
 * @param {{ repo?: string, repoId?: string, category?: string, categoryId?: string }} config
 * @returns {boolean}
 */
function isGiscusConfigReady(config) {
  return Boolean(
    config?.repo && config?.repoId && config?.category && config?.categoryId
  )
}

/**
 * @param {{ repo: string, repoId: string, category: string, categoryId: string, lang?: string }} config
 * @param {{ postId: string, theme?: string }} options
 * @returns {Record<string, string>}
 */
function buildGiscusScriptAttributes(config, options) {
  return {
    src: GISCUS_SCRIPT_SRC,
    "data-repo": config.repo,
    "data-repo-id": config.repoId,
    "data-category": config.category,
    "data-category-id": config.categoryId,
    "data-mapping": "specific",
    "data-term": `notion:${options.postId}`,
    "data-strict": "0",
    "data-reactions-enabled": "1",
    "data-emit-metadata": "0",
    "data-input-position": "bottom",
    "data-theme": options.theme || DEFAULT_THEME,
    "data-lang": config.lang || DEFAULT_LANG,
    crossorigin: "anonymous",
    async: "true",
  }
}

module.exports = {
  buildGiscusScriptAttributes,
  isGiscusConfigReady,
}
