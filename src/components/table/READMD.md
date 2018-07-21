colgroup 调整列宽度
````html
<colgroup>
  <col name="el-table_21_column_90" width="180">
  <col name="el-table_21_column_91" width="180">
  <col name="el-table_21_column_92" width="460">
</colgroup>
````

_l render函数中 用来渲染list的方法

更抽象一点来看，我们可以把组件区分为两类：一类是偏视图表现的 (presentational)，一类则是偏逻辑的 (logical)。我们推荐在前者中使用模板，在后者中使用 JSX 或渲染函数。
这两类组件的比例会根据应用类型的不同有所变化，但整体来说我们发现表现类的组件远远多于逻辑类组件。

table、table-header、table-column之间通过table-store共享数据

this.customRender = this.$options.render;
this.$options.render = createElement => createElement('div', this.$slots.default);

table-layout是对整个表格宽高等布局进行修改的。 简单的表格暂用不上

table.vue
 
props里的context的作用是？？文档中未提及该属性
<slot name="append"></slot>
<slot name="empty">{{ emptyText || t('el.table.emptyText')}}</slot>

### table
1. 初始化store与layout

````js
data() {
  const store = new TableStore(this);
  const layout = new TableLayout({
    store,
    table: this,
  });
  return {
    layout, // layout-observer会引用到layout
    store,
  };
}
````

````js
const TableStore = function (table, initialState = {}) {
  // .....
  this.table = table;
  // .....
}
````

2. 将store共享给table-header、table-body

````html
    <div class="el-table__header-wrapper"
         ref="headerWrapper">
      <table-header :store="store"></table-header>
    </div>

    <div class="el-table__body-wrapper"
         ref="bodyWrapper">
      <table-body :store="store"></table-body>
    </div>
```` 

3. 将数据存储到store，供table-body获取data

````js
watch: {
    data: {
      immediate: true,
      handler(value) {
        // 供 table-body computed.data 使用 
        this.store.commit('setData', value);
        // ......
      }
    },
},
````

4. 设置tableId，调用updateColumns设置 columns，标记mounted

  ````
  created() {
      //.....
      this.tableId = `el-table_${tableIdSeed}`;
      //.....
  }
  mounted() {
      // .....
      this.store.updateColumns();
      // .....
      this.$ready = true;
  }     
  ````
  
### table-column
1. created:生成column，并为column绑定`renderCell函数`供table-body使用
2. mounted:给state._columns数组填充数据

  ````
  mounted() {
      owner.store.commit('insertColumn', this.columnConfig, columnIndex, this.isSubColumn ? parent.columnConfig : null);
  }
  ````
  
### table-store
updateColumns 设置 columns，columns是_columns进行一系列操作后得到的

````js
TableStore.prototype.mutations = {
  insertColumn(states, column, index, parent) {
      let array = states._columns;
      // 一般情况下parent为null，只有当嵌套列时parent才不为null
      // 也就是说一般情况下， states._columns还是默认值[]
      if (parent) {
        // 为states._columns设值
        array = parent.children;
        if (!array) array = parent.children = [];
      }
      
      if (this.table.$ready) {
        this.updateColumns(); // hack for dynamics insert column
        this.scheduleLayout();
      }
  }
}
````

`````js
TableStore.prototype.updateColumns = function() {
  // ....
  const states = this.states;
  const _columns = states._columns || [];
  const notFixedColumns = _columns.filter(column => !column.fixed);
  const leafColumns = doFlattenColumns(notFixedColumns);
  states.columns = [].concat(leafColumns);
    // ....
}
`````

### table-header
渲染需要用到store.states.originColumns，当table.vue mounted时，会调用updateColumns，这个函数会为originColumns设值

````js
render(createElement) {
    const originColumns = this.store.states.originColumns;
    // ......
}
````

### table-body
监听从store.states.columns渲染。

````
  props: {
    store: {
      required: true
    },
  },
  computed: {
    columns() {
      return this.store.states.columns;
    },
  },
  
  render(createElement) {
      const columnsHidden = this.columns.map((column, index) => this.isColumnHidden(index));
      return (
        <table>
          <colgroup>
            {/*控制宽度与table-header的colgroup同步*/}
            {this._l(this.columns, column => <col name={column.id}/>)}
          </colgroup>
          <tbody>
          {
            this._l(this.data, (row, $index) => {
                {/* 渲染数据....... */}
            });
          }
          </tbody>
          )
````
