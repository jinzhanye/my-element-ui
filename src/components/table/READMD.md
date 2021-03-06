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

3. 将数据存储到store，供table-body获取data将其渲染

````
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

4. 设置tableId，

````
created() {
      //.....
      this.tableId = `el-table_${tableIdSeed}`;
      //.....
  }
````

5. 调用 updateColumns 触发 table-header、table-body 二次render更新,标记mounted完成

````
mounted() {
    // .....
    this.store.updateColumns();
    // .....
    this.$ready = true;
}     
````
  

### table-column
1. 生成column，并为column绑定`renderCell函数`供table-body使用

````js
created(){
      // .........
      let column = getDefaultColumn(type, {
          id: this.columnId,
          columnKey: this.columnKey,
          label: this.label,
          property: this.prop || this.property,// 旧版element ui为property，现在的版本是prop
          type, // selection、index、expand
          renderCell: null,
          renderHeader: this.renderHeader, // 提供给table-column， table-column.js line 112
          width,
          formatter: this.formatter,
          context: this.context,
          index: this.index,
        });
      // .........
      
      // 提table-body使用， table-body.js line 69
      column.renderCell = function (createElement, data) {
        if (_self.$scopedSlots.default) {
          renderCell = () => _self.$scopedSlots.default(data);
          //<template slot-scope="{row}">
          //<span>{{row.frequentlyUsed | formatBoolean}}</span>
          //</template>
        }
  
        if (!renderCell) {// table-header不渲染index列的走这里，
          /*<div className="cell">王小虎</div>*/
          renderCell = DEFAULT_RENDER_CELL;
        }
  
        //  <ElTableColumn
        //      type="index"
        //      width="50"/>
        return <div className="cell">{renderCell(createElement, data)}</div>;
      };
  
}
````

2. 给store.state._columns数组填充数据

  ````js
  mounted() {
      // ...... 
      owner.store.commit('insertColumn', this.columnConfig, columnIndex, this.isSubColumn ? parent.columnConfig : null);
  }
  ````
  
3. 设置列宽

  ````js
  const getDefaultColumn = function(type, options) {
      // ......
      if (!column.minWidth) {
        column.minWidth = 80;
      }
      column.realWidth = column.width === undefined ? column.minWidth : column.width;
      // ......
  }
  ````    
### table-store
向_columns填充数据

````js
TableStore.prototype.mutations = {
  insertColumn(states, column, index, parent) {
    let array = states._columns;
    // ......

    if (typeof index !== 'undefined') {
      // 在index的位置插入column
      array.splice(index, 0, column);
    } else {
      array.push(column);
    }

    // 只有在表格渲染后动态添加列才会执行以下
    if (this.table.$ready) {
      this.updateColumns(); // hack for dynamics insert column
      this.scheduleLayout();
    }
  },
}
````

updateColumns 对_columns进行过滤得到columns

`````js
TableStore.prototype.updateColumns = function() {
  const states = this.states;
  const _columns = states._columns || [];
  
  const notFixedColumns = _columns.filter(column => !column.fixed);
  // .....
  const leafColumns = doFlattenColumns(notFixedColumns);
  // .....
  
  states.columns = [].concat(leafColumns);
  // ....
}
`````

### table-header、table-body
table-header、table-body都拥有以下属性

````
props: {
    store: {
      required: true
    },
}
   
computed: {
    columns() {
      return this.store.states.columns;
    },
},

render(){
    // 渲染columns的数据
}
````

这两个组件的工作原理是监听columns数据变化以触发render渲染。在table组件的mounted阶段会调用 updateColumns 会更新 columns，
触发 table-header、table-body 重新渲染。
 
另外table-body还会监听data变化，触发render。例如当组件加载后发送请求，待请求响应赋值data，重新渲染table-body。
````
  computed: {
    data() {
      // table.vue watch.data 中 调用 setData 在store 中存储 data
      return this.store.states.data;
    },
  },
````

## 初始化顺序
![image](https://ws3.sinaimg.cn/large/006tNc79gy1ftjm8s7o5uj30k307kmxz.jpg)
