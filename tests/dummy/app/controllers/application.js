import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  modals: service(),

  flip: false,

  actions: {
    showModal() {
      this.modals.open('modal1', undefined, { className: this.flip ? 'from-top' : 'from-bottom' });
      this.toggleProperty('flip');
    },
  },
});
