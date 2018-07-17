colgroup 调整列宽度
````html
<colgroup>
  <col name="el-table_21_column_90" width="180">
  <col name="el-table_21_column_91" width="180">
  <col name="el-table_21_column_92" width="460">
</colgroup>
````

_l render函数中 用来渲染list的方法

更抽象一点来看，我们可以把组件区分为两类：一类是偏视图表现的 (presentational)，一类则是偏逻辑的 (logical)。我们推荐在前者中使用模板，在后者中使用 JSX 或渲染函数。这两类组件的比例会根据应用类型的不同有所变化，但整体来说我们发现表现类的组件远远多于逻辑类组件。
