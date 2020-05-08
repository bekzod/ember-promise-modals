import Component from '@ember/component';
import { or, readOnly } from '@ember/object/computed';
import { later, cancel } from '@ember/runloop';
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

  outAnimationTimeout: or('modal._service.outAnimationTimeout', 'modal._options.timeout'),
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
      if (
        target !== this.element ||
        (this.modal._options.animationName && this.modal._options.animationName !== animationName) ||
        animationName.substring(animationName.length - 4) !== '-out'
      ) {
        return;
      }

      this.removeModal();
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
    this._timeout = later(() => {
      this.removeModal();
    }, this.outAnimationTimeout);

    this.set('result', result);
    this.element.parentElement.classList.add(this.outAnimationClass);

    if (this.focusTrap) {
      this.focusTrap.deactivate({ onDeactivate: null });
    }
  },

  removeModal() {
    cancel(this._timeout);

    this.modal.close(this.result);
    this.element.parentElement.classList.remove(this.outAnimationClass);
  },

  actions: {
    close(result) {
      this.closeModal(result);
    },
  },
});
