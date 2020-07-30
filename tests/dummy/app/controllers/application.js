import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  modals: service(),

  actions: {
    showModal() {
      this.modals.open('modal1', undefined, { className: 'from-top' });
    },
  },
});
