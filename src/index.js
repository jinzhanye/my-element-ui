import Menu from './components/menu';
import MenuItem from './components/menu-item';
import SubMenu from './components/submenu';
import Table from './components/table';
import TableColumn from './components/table-column';
import messageFactory from './components/message';
import Tree from './components/tree';

const components = [
  Table,
  TableColumn,
  Tree,
  Menu,
  MenuItem,
  SubMenu
];

export const install = function (Vue, ops = {}) {
  components.map(component => {
    // 注册全局组件
    Vue.component(component.name, component);
  });

  Vue.prototype.$message = messageFactory;
};

