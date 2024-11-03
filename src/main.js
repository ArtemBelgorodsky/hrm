import { createApp } from 'vue';

// Vuetify
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import Header from '@/components/Header.vue';

// Components
import App from './App.vue';

const app = createApp(App);
app.component('Header', Header);

const vuetify = createVuetify({
  components,
  directives,
});

app.use(vuetify).mount('#app');
