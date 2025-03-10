import { Route } from 'vue-router';
import { reactive, watch } from '@vue/composition-api';
import { getInstance } from './getInstance';

export const useVueRouter = () => {
  const vm = getInstance();
  const state = reactive<{ route: Route }>({ route: vm.$route });

  const defineRoute = (r: Route) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    state.route = r;
  };

  watch(() => vm.$route, defineRoute);

  return {
    ...state,
    router: vm.$router
  };
};
