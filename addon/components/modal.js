import Component from '@ember/component';
import { next } from '@ember/runloop';
import { inject as service } from '@ember/service';

import createFocusTrap from 'focus-trap';

import layout from '../templates/components/modal';

export default Component.extend({
  layout,
  classNames: ['epm-modal'],
  outAnimationName: 'epm-modal-out',
  outAnimationClass: 'epm-out',
  result: undefined,

  modals: service(),

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
      if (target !== this.element || animationName !== this.outAnimationName) {
        return;
      }

      next(() => {
        this.modal.close(this.result);
        this.element.parentElement.classList.remove(this.outAnimationClass);
      });
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
