import Table from './components/table';
import TableColumn from './components/table-column';
import messageFactory from './components/message';

const components = [
  Table,
  TableColumn
];

export const install = function (Vue, ops = {}) {
  components.map(component => {
    // 注册全局组件
    Vue.component(component.name, component);
  });

  Vue.prototype.$message = messageFactory;
};

