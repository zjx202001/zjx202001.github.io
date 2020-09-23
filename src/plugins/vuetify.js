import Vue from 'vue'
import Vuetify, { VSnackbar } from 'vuetify/lib'

import Toast from '@/components/toast'

Vue.use(Vuetify, {
  components: {
    VSnackbar,
  }
})

const opts = {};

const vueObj = new Vuetify(opts);

export default vueObj;

Vue.use(Toast, { x: 'center',$vuetify: vueObj.framework });

