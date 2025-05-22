// https://valgeirb.github.io/vue3-popper/guide/getting-started.html#global

import Popper from 'vue3-popper';

import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin(({ vueApp }) => {
	vueApp.component('Popper', Popper);
});
