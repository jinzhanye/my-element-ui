import scrollbarWidth from 'element-ui/src/utils/scrollbar-width';
import Vue from 'vue';

class TableLayout {
  constructor(options) {
    this.observers = [];
    this.table = null;
    this.store = null;
    this.bodyWidth = null;
    this.columns = null;
    this.showHeader = true;

    this.height = null;
    this.gutterWidth = scrollbarWidth();

    for (let name in options) {
      if (options.hasOwnProperty(name)) {
        this[name] = options[name];
      }
    }

    if (!this.table) {
      throw new Error('table is required for Table Layout');
    }
    if (!this.store) {
      throw new Error('store is required for Table Layout');
    }
  }

  setHeight(value, prop = 'height') {
    if (Vue.prototype.$isServer) return;
    this.updateElsHeight();
  }

  updateElsHeight() {
    this.notifyObservers('scrollable');
  }

  getFlattenColumns() {
    const flattenColumns = [];
    const columns = this.table.columns;
    columns.forEach((column) => {
      if (column.isColumnGroup) {
        flattenColumns.push.apply(flattenColumns, column.columns);
      } else {
        flattenColumns.push(column);
      }
    });

    return flattenColumns;
  }

  updateColumnsWidth() {
    if (Vue.prototype.$isServer) return;
    const fit = this.fit;
    const bodyWidth = this.table.$el.clientWidth;
    let bodyMinWidth = 0;

    const flattenColumns = this.getFlattenColumns();
    let flexColumns = flattenColumns.filter((column) => typeof column.width !== 'number');

    flattenColumns.forEach((column) => { // Clean those columns whose width changed from flex to unflex
      if (typeof column.width === 'number' && column.realWidth) column.realWidth = null;
    });

    if (flexColumns.length > 0 && fit) {
      flattenColumns.forEach((column) => {
        bodyMinWidth += column.width || column.minWidth || 80;
      });

      const scrollYWidth = this.scrollY ? this.gutterWidth : 0;

      if (bodyMinWidth <= bodyWidth - scrollYWidth) { // DON'T HAVE SCROLL BAR
        this.scrollX = false;

        const totalFlexWidth = bodyWidth - scrollYWidth - bodyMinWidth;

        if (flexColumns.length === 1) {
          flexColumns[0].realWidth = (flexColumns[0].minWidth || 80) + totalFlexWidth;
        } else {
          const allColumnsWidth = flexColumns.reduce((prev, column) => prev + (column.minWidth || 80), 0);
          const flexWidthPerPixel = totalFlexWidth / allColumnsWidth;
          let noneFirstWidth = 0;

          flexColumns.forEach((column, index) => {
            if (index === 0) return;
            const flexWidth = Math.floor((column.minWidth || 80) * flexWidthPerPixel);
            noneFirstWidth += flexWidth;
            column.realWidth = (column.minWidth || 80) + flexWidth;
          });

          flexColumns[0].realWidth = (flexColumns[0].minWidth || 80) + totalFlexWidth - noneFirstWidth;
        }
      } else { // HAVE HORIZONTAL SCROLL BAR
        this.scrollX = true;
        flexColumns.forEach(function(column) {
          column.realWidth = column.minWidth;
        });
      }

      this.bodyWidth = Math.max(bodyMinWidth, bodyWidth);
      this.table.resizeState.width = this.bodyWidth;
    } else {
      flattenColumns.forEach((column) => {
        if (!column.width && !column.minWidth) {
          column.realWidth = 80;
        } else {
          column.realWidth = column.width || column.minWidth;
        }

        bodyMinWidth += column.realWidth;
      });
      this.scrollX = bodyMinWidth > bodyWidth;

      this.bodyWidth = bodyMinWidth;
    }

    this.notifyObservers('columns');
  }

  addObserver(observer) {
    this.observers.push(observer);
  }

  removeObserver(observer) {
    const index = this.observers.indexOf(observer);
    if (index !== -1) {
      this.observers.splice(index, 1);
    }
  }

  notifyObservers(event) {
    const observers = this.observers;
    observers.forEach((observer) => {
      switch (event) {
        case 'columns':
          observer.onColumnsChange(this);
          break;
        case 'scrollable':
          observer.onScrollableChange(this);
          break;
        default:
          throw new Error(`Table Layout don't have event ${event}.`);
      }
    });
  }
}

export default TableLayout;
