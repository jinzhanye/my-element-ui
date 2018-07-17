/* Table状态管理 */

import Vue from 'vue';
import debounce from 'throttle-debounce/debounce';
import merge from 'element-ui/src/utils/merge';
import { hasClass, addClass, removeClass } from 'element-ui/src/utils/dom';
import { orderBy, getColumnById, getRowIdentity } from './util';

const TableStore = function (table, initialState = {}) {
  if (!table) {
    throw new Error('Table is required.');
  }
  this.table = table;
  this.states = {};

};

TableStore.prototype.setCurrentRowKey = function (key) {

};

TableStore.prototype.mutations = {

};
TableStore.prototype.commit = function commit() {

};

export default TableStore;
