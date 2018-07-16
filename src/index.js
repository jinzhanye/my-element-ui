import messageFactory from './components/message';

export const install = function (Vue, ops = {}) {
  Vue.prototype.$message = messageFactory;
};

