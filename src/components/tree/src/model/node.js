import objectAssign from 'element-ui/src/utils/merge';
import { markNodeData, NODE_KEY } from './util';

let nodeIdSeed = 0;

export default class Node {
  constructor(options) {
    this.id = nodeIdSeed++;
    this.text = null;
    this.checked = false;
    this.indeterminate = false;// ??
    this.data = null;
    this.expanded = false;
    this.parent = null;
    this.visible = true;

    for (let name in options) {
      if (options.hasOwnProperty(name)) {
        this[name] = options[name];
      }
    }

    //internal
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
    store.registerNode(this);

    const props = store.props;
    if (props && typeof props.isLeaf !== 'undefined') {// ??
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

    if (key && store.currentNodeKey !== undefined && this.key === store.currentNodeKey) {
      store.currentNode = this;
    }

    this.updateLeafState();
  }

  updateLeafState() {
    const childNodes = this.childNodes;
    if (!this.store.lazy || (this.store.lazy === true && this.loaded === true)) {
      this.isLeaf = !childNodes || childNodes.length === 0;
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
      if (!batch) {
        const children = this.getChildren(true);
        if (children.indexOf(child.data) === -1) {
          if (typeof index === 'undefined' || index < 0) {
            children.push(child.data);
          } else {
            children.splice(index, 0, child.data);
          }
        }
      }
      objectAssign(child, {
        parent: this,
        store: this.store
      });
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

  getChildren(forceInit = false) {
    if (this.level === 0) {
      return this.data;
    }
    const data = this.data;
    if (!data) return null;

    // TODO
  }

  removeChild(child) {

  }
}
