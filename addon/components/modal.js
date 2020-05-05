import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';
import { inject as service } from '@ember/service';

import createFocusTrap from 'focus-trap';

import layout from '../templates/components/modal';

export default Component.extend({
  layout,
  classNames: ['epm-modal'],
  classNameBindings: ['optionsClassName'],
  outAnimationClass: 'epm-out',
  result: undefined,

  modals: service(),

  optionsClassName: readOnly('modal._options.className'),

  didInsertElement() {
    this._super(...arguments);

    let { clickOutsideDeactivates } = this.modals;

    this.focusTrap = createFocusTrap(this.element, {
      clickOutsideDeactivates,
      fallbackFocus: `#${this.elementId}`,

      onDeactivate: () => {
        if (this.isDestroyed || this.isDestroying) {
          return;
        }

        this.closeModal();
      },
    });

    this.focusTrap.activate();

    this.fadeOutEnd = ({ target, animationName }) => {
      if (target !== this.element || animationName.substring(animationName.length - 4) !== '-out') {
        return true;
      }

      this.modal.close(this.result);
      this.element.parentElement.classList.remove(this.outAnimationClass);

      return true;
    };

    this.element.addEventListener('animationend', this.fadeOutEnd);
    this.element.parentElement.classList.remove(this.outAnimationClass);
  },

  willDestroyElement() {
    if (this.focusTrap) {
      this.focusTrap.deactivate({ onDeactivate: null });
    }

    if (this.fadeOutEnd) {
      this.element.removeEventListener(this.fadeOutEnd);
    }

    this._super(...arguments);
  },

  closeModal(result) {
    this.set('result', result);
    this.element.parentElement.classList.add(this.outAnimationClass);
  },

  actions: {
    close(result) {
      this.closeModal(result);
    },
  },
});
