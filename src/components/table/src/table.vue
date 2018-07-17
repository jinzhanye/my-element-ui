<template>
  <div class="el-table"
       :class="[]">

    <!--隐藏列:容纳 table 内容-->
    <div class="hidden-columns" ref="hiddenColumns">
      <slot></slot>
    </div>

    <div class="el-table__header-wrapper">
      <table-header></table-header>
    </div>

    <div class="el-table__body-wrapper">
      <table-body></table-body>
    </div>

    <div class="el-table__footer-wrapper">
      <table-footer></table-footer>
    </div>

    <!--左侧固定列-->
    <div class="el-table__fixed">
      <div class="el-table__fixed-header-wrapper" ref="fixedHeaderWrapper">
        <table-header ref="fixedTableHeader"></table-header>
      </div>
      <div class="el-table__fixed-body-wrapper" ref="fixedBodyWrapper">
        <table-body></table-body>
        <div class="el-table__append-gutter"></div>
      </div>
      <div class="el-table__fixed-footer-wrapper" ref="fixedFooterWrapper">
        <table-footer></table-footer>
      </div>
    </div>

    <!--右侧固定列-->
    <div class="el-table__fixed-right">
      <div class="el-table__fixed-header-wrapper" ref="rightFixedHeaderWrapper">
        <table-header ref="rightFixedTableHeader"></table-header>
      </div>
      <div class="el-table__fixed-body-wrapper" ref="rightFixedBodyWrapper">
        <table-body></table-body>
      </div>
      <div class="el-table__fixed-footer-wrapper" ref="rightFixedFooterWrapper">
        <table-footer></table-footer>
      </div>
    </div>

    <!--右侧固定列补丁-->
    <div class="el-table__fixed-right-patch"></div>

    <!--列宽调整代理-->
    <div class="el-table__column-resize-proxy"></div>

  </div>
</template>

<script>
// 用于选择列的多选按钮
import ElCheckbox from 'element-ui/packages/checkbox';
// 控制操作频度的组件
import debounce from 'throttle-debounce/debounce';
// 添加或移除调整尺寸事件
import { addResizeListener, removeResizeListener } from 'element-ui/src/utils/resize-event';
// 处理鼠标滚动事件
import Mousewheel from 'element-ui/src/directives/mousewheel';
import Locale from 'element-ui/src/mixins/locale';
// 调试相关
import Migrating from 'element-ui/src/mixins/migrating';
// 表格状态管理组件
import TableStore from './table-store';
import TableLayout from './table-layout';
import TableBody from './table-body';
import TableHeader from './table-header';
import TableFooter from './table-footer';

let tableIdSeed = 1;

export default {
  name: 'ElTable',

  mixins: [Locale, Migrating],

  props: {},

  data() {
    const layout = new TableLayout();
    const store = new TableStore();
    return {
      layout,
      store,
    };
  },

  computed: {
    // 返回表格主体部分
    bodyWrapper() {},
    // 能否自动更新表格高度，height 属性为数值或具有固定列时可以
    shouldUpdateHeight() {},
    // 获取行选择集
    selection() {},
    // 获取列对象集合
    columns() {},
    // 获取表格数据
    tableData() {},
    // 获取左侧固定列集合
    fixedColumns() {},
    // 获取右侧固定列集合
    rightFixedColumns() {},
    // 计算表格高度
    bodyHeight() {},
    // 计算表格宽度
    bodyWidth() {},
    // 计算固定列表身高度
    fixedBodyHeight() {},
    // 计算固定列整体高度
    fixedHeight() {},
  },

  watch: {
    height: {
      immediate: true, // TODO ??
      handler(value) {
        this.layout.setHeight(value);
      },
      maxHeight: {
        immediate: true,
        handler(value) {
          this.layout.setMaxHeight(value);
        },
      },
      currentRowKey(newVal) { // TODO ??
        this.store.setCurrentRowKey(newVal);
      },
      expandRowKeys: {},

      data: {// TODO ??
        immediate: true,
        handler(value) {

        },
      },
    },
  },

  methods: {
    // 切换行的选择状态
    toggleRowSelection(row, selected) {},
    // 清除行的选择集
    clearSelection() {},
    // 处理鼠标离开某行的事件
    handleMouseLeave() {},
    // 更新垂直滚动条位置
    updateScrollY() {},
    // 绑定事件：处理鼠标滚动及调整大小事件
    bindEvents() {},
    // 刷新表格布局
    doLayout() {},
  },

  created() {
    this.tableId = `el-table_${tableIdSeed}`;
    tableIdSeed += 1;
    // 设置刷新布局的频度
    this.debouncedUpdateLayout = debounce(50, () => this.doLayout());
  },

  mounted() {
    this.bindEvents();
    this.doLayout();
    this.$ready = true;
  },

  destroyed() {
    if (this.resizeListener) removeResizeListener(this.$el, this.resizeListener);
  },
};
</script>

<style lang="less" scoped>

</style>
