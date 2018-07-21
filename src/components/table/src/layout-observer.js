/* eslint-disable no-underscore-dangle */
export default {
  computed: {
    tableLayout() {
      let layout = this.layout;
      // this.table 来自父组件
      if (!layout && this.table) {
        layout = this.table.layout;
      }
      if (!layout) {
        throw new Error('Can not find table layout');
      }
      return layout;
    },
  },

  methods: {
    onColumnsChange() {
      const cols = this.$el.querySelectorAll('colgroup > col');
      if (!cols.length) return;
      const flattenColumns = this.tableLayout.getFlattenColumns();
      const columnsMap = {};
      flattenColumns.forEach((column) => {
        columnsMap[column.id] = column;
      });
      for (let i = 0, j = cols.length; i < j; i++) {
        const col = cols[i];
        const name = col.getAttribute('name');
        const column = columnsMap[name];
        if (column) {
          col.setAttribute('width', column.realWidth || column.width);
        }
      }
    },
    onScrollableChange() {
      // TODO
    },
  },

  created() {
    this.tableLayout.addObserver(this);
  },

  mounted() {
    this.onColumnsChange();
    this.onScrollableChange();
  },

  updated() {
    if (this.__updated__) return;
    this.onColumnsChange(this.tableLayout);
    this.onScrollableChange(this.tableLayout);
    this.__updated__ = true;
  },

  destroyed() {
    this.tableLayout.removeObserver(this);
  },
};
