import { getContext } from '@ember/test-helpers';

export default async function cssAnimationsSettled(animationName, target = document, options = { timeout: 10 * 1000 }) {
  let { owner } = getContext();

  return new Promise((resolve, reject) => {
    let timeout = setTimeout(() => {
      reject(new Error(`cssAnimationsSettle timed out waiting for ${animationName}`));
    }, options.timeout);

    let element;

    if (typeof target === 'string') {
      element = document.querySelector(target);
    } else if (!target) {
      element = document.querySelector(owner.rootElement);
    }

    if (!element) {
      throw new Error(`Unable to select target "${target}"`);
    }

    element.addEventListener('animationend', event => {
      clearTimeout(timeout);

      if (
        (typeof animationName === 'string' && event.animationName !== animationName) ||
        (animationName instanceof RegExp && animationName.exec(event.animationName) === null)
      ) {
        return;
      }

      resolve(event);
    });
  });
}
