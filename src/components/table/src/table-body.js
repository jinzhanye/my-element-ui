/* eslint-disable no-underscore-dangle */

import { getCell, getColumnByCell, getRowIdentity } from './util';
import { getStyle, hasClass, addClass, removeClass } from 'element-ui/src/utils/dom';
import ElCheckbox from 'element-ui/packages/checkbox';
import ElTooltip from 'element-ui/packages/tooltip';
import debounce from 'throttle-debounce/debounce';
import LayoutObserver from './layout-observer';

export default {
  name: 'ElTableBody',

  mixins: [LayoutObserver],

  props: {
    stripe: Boolean,
    fixed: String,
    highlight: Boolean,
  },

  data() {
    return {
      tooltipContent: '',
    };
  },

  computed: {
    table() {
      return this.$parent;
    },

    data() {
      return this.store.states.data;
    },

    columnsCount() {
      return this.store.states.columns.length;
    },

    columns() {
      return this.store.states.columns;
    },
  },

  components: {
    ElCheckbox,
    ElTooltip,
  },

  render(createElement) {
    const columnsHidden = this.columns.map((column, index) => this.isColumnHidden(index));
    return (
      <table
        class="el-table__body"
        cellspacing="0"
        cellpadding="0"
        border="0">
        <colgroup>
          {this._l(this.columns, column => <col name={column.id}/>)}
        </colgroup>
        <tbody>
          {
            this._l(this.data, (row, $index) =>
              [<tr style={this.rowStyle ? this.getRowStyle(row, $index) : null}
                key={this.table.rowKey ? this.getKeyOfRow(row, $index) : $index}
                on-click={$event => this.handleClick($event, row)}
                class={[this.getRowClass(row, $index)]}>
                {
                  this._l(this.columns, (column, cellIndex) => {
                    const { rowspan, colspan } = this.getSpan(row, column, $index, cellIndex);
                    if (!rowspan || !colspan) {
                      return '';
                    }

                    if (rowspan === 1 && colspan === 1) {
                      return (<td style={this.getCellStyle($index, cellIndex, row, column)}
                        class={this.getCellClass($index, cellIndex, row, column)}>
                      </td>);
                    }

                    return (<td style={this.getCellStyle($index, cellIndex, row, column)}
                      class={this.getCellClass($index, cellIndex, row, column)}>

                    </td>);
                  })
                }
              </tr>],
            )
          }
        </tbody>
      </table>
    );
  },

  watch: {
    'store.states.hoverRow': function hoverRow(newVal, oldVal) {},
    'store.states.currentRow': function currentRow(newVal, oldVal) {},
  },

  methods: {
    isColumnHidden() {
      return false;
    },
    handleClick(event, row) {
      this.store.commit('setCurrentRow', row);
      this.handleEvent(event, row, 'click');
    },
    handleEvent(event, row, name) {
      const table = this.table;
      const cell = getCell(event);
      let column = {};
      if (cell) { // 触发单元格事件
        column = getColumnByCell(table, cell);
        if (column) {
          table.$emit(`cell-${name}`, row, column, cell, event);
        }
      }
      // 触发行事件
      table.$emit(`row-${name}`, row, event, column);
    },
  },
};
