import Node from './node';
import { getNodeKey } from './util';

export default class TreeStore {
  constructor(options) {
    for (let option in options) {
      if (options.hasOwnProperty(option)) {
        this[option] = options[option];
      }
    }

    this.nodesMap = {};

    this.root = new Node({
      data: this.data,
      store: this
    });
  }

  setData(newVal) {
    const instanceChanged = newVal !== this.root.data;
    if (instanceChanged) {
      this.root.setData(newVal);
      this._initDefaultCheckedNodes();
    } else {// 什么时候会触发这种更新？？
      this.root.updateChildren();
    }
  }


  registerNode(node) {
    const key = this.key;
    if (!key || !node || !node.key) {
      return;
    }

    const nodeKey = node.key;
    if (nodeKey !== undefined) {
      this.nodesMap[node.key] = node;
    }
  }
}
