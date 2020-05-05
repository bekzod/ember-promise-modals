export default function setupPromiseModals(hooks) {
  let originalValue;

  hooks.beforeEach(function () {
    document.documentElement.style.setProperty('--epm-duration-in', `0.001s`);
    document.documentElement.style.setProperty('--epm-duration-out', `0.001s`);

    this.modals = this.owner.lookup('service:modals');
    originalValue = this.modals.outAnimationTimeout;
    this.modals.set('outAnimationTimeout', 0);
  });

  hooks.afterEach(function () {
    document.documentElement.style.removeProperty('--epm-duration-in', `0.001s`);
    document.documentElement.style.removeProperty('--epm-duration-out', `0.001s`);

    this.modals.set('outAnimationTimeout', originalValue);
  });
}
