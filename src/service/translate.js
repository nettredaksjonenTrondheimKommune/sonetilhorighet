/**
 * Used when no translate attribute given to components.
 *
 * If not /english/ in URL, norwegian is assumed.
 */

const TEMPLATE_STRING_GROUP = /\$\{([^}]+)}/g;

/**
 * Returns props.translate or internal translateFallback
 * that is a minimal implementation of the same.
 *
 * @param {object} translation Translation object.
 * @param {object} props Component props.
 */
export default function getTranslate(translation, props) {
  let { translate } = props;

  function translateFallback(id, _values) {
    let language = detectLanguage();
    let languages = getIdFromObject(id, translation) || [];
    let translated = (languages[language] || id)
      // eslint-disable-next-line no-template-curly-in-string
      .replace(TEMPLATE_STRING_GROUP, (match) => {
        let sanitized = match
          .substring(2, match.length - 1)
          // only allow these characters, as we unsafely eval below
          .replace(/[^a-zæøåA-ZÆØÅ0-9_]/g, '');

        return '${_values.' + sanitized + '}';
      });

    // eslint-disable-next-line no-eval
    return eval('`' + translated + '`');
  }

  return typeof translate === 'function' ? translate : translateFallback;
}

function getIdFromObject(fullId, obj) {
  return fullId.split('.').reduce((value, id) => value[id], obj);
}

function detectLanguage() {
  return window.location.pathname.includes('/english/') ? 1 : 0;
}
