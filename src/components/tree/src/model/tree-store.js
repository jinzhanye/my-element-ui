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
    debugger
    const instanceChanged = newVal !== this.root.data;
    if (instanceChanged) {
      this.root.setData(newVal);
      // ...
    } else {
      this.root.updateChildren();
    }
  }

  updateChildren(key, data) {
    const node = this.nodesMap[key];
    if (!node) {
      return;
    }
    const childNodes = node.childNodes;
    for (let i = childNodes.length - 1; i >= 0; i--) {
      const child = childNodes[i];
      this.remove(child.data);
    }
    for (let i = 0, j = data.length; i < j; i++) {
      const child = data[i];
      this.append(child, node.data);
    }
  }

  remove(data) {
    const node = this.getNode(data);
    if (node) {
      node.parent.removeChild(node);
    }
  }

  getNode(data) {
    if (data instanceof Node) return data;
    const key = typeof data !== 'object' ? data : getNodeKey(this.key, data);
    return this.nodesMap[key] || null;
  }

  append(data, parentData) {
    const parentNode = parentData ? this.getNode(parentData) : this.root;

    if (parentNode) {
      parentNode.insertChild({ data });
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
