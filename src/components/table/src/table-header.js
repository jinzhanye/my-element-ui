import LayoutObserver from './layout-observer';

const getAllColumns = (columns) => {
  const result = [];
  columns.forEach(column => {
    if (column.children) {
      result.push(column);
      result.push.apply(result, getAllColumns(column.children));
    } else {
      result.push(column);
    }
  });

  return result;
};

const convertToRows = (originColumns) => {
  let maxLevel = 1;
  const traverse = (column, parent) => {

  };

  originColumns.forEach((column) => {

  });

  const rows = [];
  for (let i = 0; i < maxLevel; i++) {
    rows.push([]);
  }

  const allColumns = getAllColumns(originColumns);
  allColumns.forEach((column) => {
  });

  return rows;
};

export default {
  name: 'ElTableHeader',

  mixin: [LayoutObserver],

  props: {
    border: Boolean,
  },

  data() {
    return {
      draggingColumn: null,
      dragging: false,
      dragState: {}
    };
  },

  computed: {
    table() {
      return this.$parent;
    },
  },

  render(createElement) {
    const originColumns = this.store.states.originColumns;
    const columnRows = convertToRows(originColumns, this.columns);
    // 是否拥有多级表头
    const isGroup = columnRows.length > 1;
    if (isGroup) this.$parent.isGroup = true;
    return (
      <table class="el-table__header"
             cellspacing="0"
             cellpadding="0"
             border="0">
        <colgroup>
          {
            this._l(this.columns, column => <col name={column.id}/>)
          }
          {
            this.hasGutter ? <col name="gutter"/> : ''
          }
        </colgroup>
        <thead>
        {
          this._l(columnRows, (columns, rowIndex) =>
            <tr
              style={this.getHeaderRowStyle(rowIndex)}
              className={this.getHeaderRowClass(rowIndex)}>
              {
                this._l(columns, (column, cellIndex) =>
                  <th colspan={column.colSpan}
                      rowspan={column.rowSpan}
                      style={this.getHeaderCellStyle(rowIndex, cellIndex, columns, column)}
                      class={this.getHeaderCellClass(rowIndex, cellIndex, columns, column)}>
                    <div
                      class={['cell', column.filteredValue && column.filteredValue.length > 0 ? 'highlight' : '', column.labelClassName]}>
                      {column.label}
                    </div>
                  </th>)
              }
              {
                this.hasGutter ? <th class="gutter"></th> : ''
              }
            </tr>)
        }
        </thead>
      </table>);
  },

  methods: {
    hasGutter() {
      return !this.fixed && this.tableLayout.gutterWidth;
    }
  }
}
