import objectAssign from 'element-ui/src/utils/merge';
import { getPropByPath } from 'element-ui/src/utils/util';

let columnIdSeed = 1;

const defaults = {
  default: {
    order: ''
  },
  index: {
    width: 48,
    minWidth: 48,
    realWidth: 48,
    order: ''
  }
};

const forced = {
  index: {
    renderHeader: function (h, { column }) {
      return column.label || '#';
    },
    renderCell: function (h, { $index, column }) {
      let i = $index + 1;
      const index = column.index;

      if (typeof index === 'number') {
        i = $index + index;
      } else if (typeof index === 'function') {
        i = index($index);
      }

      return <div>{i}</div>;
    },
    sortable: false
  },
};

const DEFAULT_RENDER_CELL = function (h, { row, column, $index }) {
  const property = column.property;
  const value = property && getPropByPath(row, property).v;
  if (column && column.formatter) {
    return column.formatter(row, column, value, $index);
  }
  return value;
};

const parseWidth = (width) => {
  if (width !== undefined) {
    width = parseInt(width, 10);
    if (isNaN(width)) {
      width = null;
    }
  }
  return width;
};

const getDefaultColumn = function (type, options) {
  const column = {};

  objectAssign(column, defaults[type || 'default']);

  for (let name in options) {
    if (options.hasOwnProperty(name)) {
      const value = options[name];
      if (typeof value !== 'undefined') {
        column[name] = value;
      }
    }
  }

  if (!column.minWidth) {
    column.minWidth = 80;
  }

  column.realWidth = column.width === undefined ? column.minWidth : column.width;

  return column;
};

export default {
  name: 'ElTableColumn',

  props: {
    type: {
      type: String,
      default: 'default',
    },
    label: String,
    prop: String,
    width: {},
    formatter: Function,
  },

  data() {
    return {
      isSubColumn: false,
      columns: [],
    };
  },

  watch: {
    label(newVal) {
      if (this.columnConfig) {
        this.columnConfig.label = newVal;
      }
    },

    prop(newVal) {
      if (this.columnConfig) {
        this.columnConfig.property = newVal;
      }
    },


    width(newVal) {
      if (this.columnConfig) {
        this.columnConfig.width = parseWidth(newVal);
        this.owner.store.scheduleLayout();
      }
    },
  },

  computed: {
    owner() {
      let parent = this.$parent;
      while (parent && !parent.tableId) {
        parent = parent.$parent;
      }
      return parent;
    },
    columnOrTableParent() {
      let parent = this.$parent;
      while (parent && !parent.tableId && !parent.columnId) {
        parent = parent.$parent;
      }
      return parent;
    },
  },

  beforeCreate() {
    this.row = {};
    this.column = {};
    this.$index = 0;
  },

  created() {
    this.customRender = this.$options.render;
    this.$options.render = createElement => createElement('div', this.$slots.default);

    let type = this.type;

    let column = getDefaultColumn(type, {
      id: this.columnId,
      columnKey: this.columnKey,
      label: this.label,
      property: this.prop || this.property,// 旧版element ui为property，现在的版本是prop
      type,
      renderCell: null,
      width,
      context: this.context,
      index: this.index,
    });

    objectAssign(column, forced[type] || {});

    this.columnConfig = column;

    let renderCell = column.renderCell;
    let _self = this;

    column.renderCell = function (createElement, data) {
      //<template slot-scope="{row}">
      //<span>{{row.frequentlyUsed | formatBoolean}}</span>
      //</template>
      if (_self.$scopedSlots.default) {
        renderCell = () => _self.$scopedSlots.default(data);
      }

      if (!renderCell) {
        renderCell = DEFAULT_RENDER_CELL;
      }

      return <div className="cell">{renderCell(h, data)}</div>;
    };
  },

  mounted() {
    const owner = this.owner;
    const parent = this.columnOrTableParent;
    let columnIndex;

    if (!this.isSubColumn) {
      columnIndex = [].indexOf.call(parent.$refs.hiddenColumns.children, this.$el);
    } else {
      columnIndex = [].indexOf.call(parent.$el.children, this.$el);
    }

    owner.store.commit('insertColumn', this.columnConfig);
  },

  destroyed() {
    if (!this.$parent) return;
    const parent = this.$parent;
    this.owner.store.commit('removeColumn', this.columnConfig, this.isSubColumn ? parent.columnConfig : null);
  },
};
