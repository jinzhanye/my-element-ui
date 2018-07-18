<template>
  <div class="el-table">
    <!-- 隐藏列: slot里容纳table-column -->
    <div class="hidden-columns" ref="hiddenColumns">
      <slot></slot>
    </div>

    <div class="el-table__header-wrapper"
         ref="headerWrapper">
      <table-header ref="tableHeader"
                    :store="store"></table-header>
    </div>

    <div class="el-table__body-wrapper">
      <table-body></table-body>
    </div>

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

  mixins: [Migrating],

  props: {
    data: { type: Array, default: () => [] }
  },

  data() {
    const layout = new TableLayout();
    const store = new TableStore();
    return {
      layout,
      store,
    };
  },

  components: {
    TableHeader,
    TableFooter,
    TableBody,
  },

  computed: {
    columns() {},
    data: {
      immediate: true,
      handler(value) {
        this.store.commit('setData', value);
        if (this.$ready) {
          this.$nextTick(() => {
            this.doLayout();
          });
        }
      }
    },
    tableData() {
      return this.store.states.data;
    },
  },

  methods: {
    // 绑定事件：处理鼠标滚动及调整大小事件
    bindEvents() {},
    doLayout() {
      // this.layout.updateColumnsWidth();
      // if (this.shouldUpdateHeight) {
      //   this.layout.updateElsHeight();
      // }
    },
  },

  created() {
    this.tableId = `el-table_${tableIdSeed}`;
    tableIdSeed += 1;
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
