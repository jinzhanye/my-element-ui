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

    <div class="el-table__body-wrapper"
         ref="bodyWrapper">
      <table-body :context="context"
                  :store="store"
                  :stripe="stripe"></table-body>
    </div>

    <!--列宽调整代理-->
    <div class="el-table__column-resize-proxy"></div>

  </div>
</template>

<script>
// 控制操作频度的组件
import debounce from 'throttle-debounce/debounce';
// 调试相关
import Migrating from 'element-ui/src/mixins/migrating';
import Locale from 'element-ui/src/mixins/locale';
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

  props: {
    data: { type: Array, default: () => [] },
    stripe: Boolean,// 条纹
    border: Boolean,
    context: {},
    emptyText: String,// 无数据时显示的文本内容，默认为“暂无数据”
    spanMethod: Function,// 用于合并行或列

    headerRowClassName: [String, Function],
    headerRowStyle: [Object, Function],
  },

  data() {
    const store = new TableStore(this);
    const layout = new TableLayout({
      store,
      table: this,
    });
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
    bodyWrapper() {
      return this.$refs.bodyWrapper;
    },
    tableData() {
      return this.store.states.data;
    },
    columns() {},
  },

  watch: {
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
  },

  methods: {
    bindEvents() {},
    doLayout() {},
  },

  created() {
    this.tableId = `el-table_${tableIdSeed}`;
    tableIdSeed += 1;
    // 提供给table-store的TableStore.prototype.scheduleLayout使用
    this.debouncedUpdateLayout = debounce(50, () => this.doLayout());
  },

  mounted() {
    this.bindEvents();
    this.store.updateColumns();
    this.doLayout();
    this.$ready = true;
  },
};
</script>
