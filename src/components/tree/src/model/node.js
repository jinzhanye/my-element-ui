import objectAssign from 'element-ui/src/utils/merge';
import { markNodeData, NODE_KEY } from './util';

const getPropertyFromData = function(node, prop) {
  const props = node.store.props;
  const data = node.data || {};
  const config = props[prop];

  if (typeof config === 'function') {
    return config(data, node);
  } else if (typeof config === 'string') {
    return data[config];
  } else if (typeof config === 'undefined') {
    const dataProp = data[prop];
    return dataProp === undefined ? '' : dataProp;
  }
};

let nodeIdSeed = 0;

export default class Node {
  constructor(options) {
    this.id = nodeIdSeed++;
    this.text = null;
    this.checked = false;
    this.indeterminate = false;// ??
    this.data = null;// important
    this.expanded = false;
    this.parent = null;// important
    this.visible = true;

    for (let name in options) {
      if (options.hasOwnProperty(name)) {
        this[name] = options[name];
      }
    }

    // internal
    this.level = 0;
    this.loaded = false;
    this.childNodes = [];
    this.loading = false;

    if (this.parent) {
      this.level = this.parent.level + 1;
    }

    const store = this.store;
    if (!store) {
      throw new Error('[Node]store is required!');
    }
    // 注册树节点与nodeKey的映射关系
    store.registerNode(this);

    const props = store.props;
    if (props && typeof props.isLeaf !== 'undefined') {
      // 获取指定子节点的字段的数据，可以通过数据中某个字段来指定是否是子节点
      const isLeaf = getPropertyFromData(this, 'isLeaf');
      if (typeof isLeaf === 'boolean') {
        this.isLeafByUser = isLeaf;
      }
    }

    if (store.lazy !== true && this.data) {
      this.setData(this.data);

      if (store.defaultExpandAll) {
        this.expanded = true;
      }
    }

    if (!Array.isArray(this.data)) {
      markNodeData(this, this.data);
    }

    if (!this.data) return;
    const key = store.key;
    if (key && store.currentNodeKey !== undefined && this.key === store.currentNodeKey) {
      store.currentNode = this;
    }

    this.updateLeafState();
  }

  setData(data) {
    if (!Array.isArray(data)) {
      markNodeData(this, data);
    }

    this.data = data;
    // 当data更新时，将旧数据清空，insertChild会给childNodes填充数据，重新构造树节点
    this.childNodes = [];

    let children;
    if (this.level === 0 && this.data instanceof Array) {
      // root节点的孩子就是开发者传入的data
      children = this.data;
    } else {
      children = getPropertyFromData(this, 'children') || [];
    }

    for (let i = 0, j = children.length; i < j; i++) {
      this.insertChild({ data: children[i] });
    }
  }

  updateLeafState() {
    if (this.store.lazy === true && this.loaded !== true && typeof this.isLeafByUser !== 'undefined') {
      this.isLeaf = this.isLeafByUser;
      return;
    }
    const childNodes = this.childNodes;
    if (!this.store.lazy || (this.store.lazy === true && this.loaded === true)) {
      this.isLeaf = !childNodes || childNodes.length === 0;
      return;
    }
    this.isLeaf = false;
  }

  expand(callback, expandParent) {
    const done = () => {
      if (expandParent) {
        let parent = this.parent;
        while (parent.level > 0) {
          parent.expanded = true;
          parent = parent.parent;
        }
      }
      this.expanded = true;
      if (callback) {
        callback();
      }
    };

    if (this.shouldLoadData()) {// 懒加载

    } else {
      done();
    }
  }

  collapse() {
    this.expanded = false;
  }

  shouldLoadData() {
    return this.store.lazy === true && this.store.load && !this.loaded;
  }

  insertChild(child, index, batch) {
    if (!child) throw new Error('insertChild error: child is required.');
    if (!(child instanceof Node)) {
      // ....
      objectAssign(child, {
        parent: this,
        store: this.store
      });
      // 递归构造Node
      child = new Node(child);
    }

    child.level = this.level + 1;

    if (typeof index === 'undefined' || index < 0) {
      this.childNodes.push(child);
    } else {
      this.childNodes.splice(index, 0, child);
    }

    this.updateLeafState();
  }

  updateChildren() {
    const newData = this.getChildren() || [];
    const oldData = this.childNodes.map((node) => node.data);

    const newDataMap = {};
    const newNodes = [];

    newData.forEach((item, index) => {
      if (item[NODE_KEY]) {
        newDataMap[item[NODE_KEY]] = { index, data: item };
      } else {
        newNodes.push({ index, data: item });
      }
    });

    oldData.forEach((item) => {
      if (!newDataMap[item[NODE_KEY]]) this.removeChildByData(item);
    });

    newNodes.forEach(({ index, data }) => {
      this.insertChild({ data }, index);
    });

    this.updateLeafState();
  }

  getChildren(forceInit = false) {
    if (this.level === 0) {// 根节点的孩子就是data数组
      return this.data;
    }
    const data = this.data;
    if (!data) return null;

    const props = this.store.props;
    let children = 'children';
    if (props) {// 替换props
      children = props.children || 'children';
    }

    if (data[children] === undefined) {
      data[children] = null;
    }

    if (forceInit && !data[children]) {
      data[children] = [];
    }

    return data[children];
  }

  removeChild(child) {

  }

  get label() {
    return getPropertyFromData(this, 'label');
  }
}
