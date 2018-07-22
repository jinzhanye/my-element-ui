<template>
  <div class="el-table">
    <!-- 隐藏列: slot里容纳table-column -->
    <div class="hidden-columns" ref="hiddenColumns">
      <slot></slot>
    </div>

    <div class="el-table__header-wrapper"
         ref="headerWrapper">
      <table-header ref="tableHeader"
                    :store="store"
                    :style="{
                        width: layout.bodyWidth ? layout.bodyWidth + 'px' : ''
                    }">
      </table-header>
    </div>

    <div class="el-table__body-wrapper"
         ref="bodyWrapper">
      <table-body :context="context"
                  :store="store"
                  :stripe="stripe"
                  :style="{
                      width: bodyWidth
                  }">></table-body>
    </div>

    <!--列宽调整代理-->
    <div class="el-table__column-resize-proxy" ref="resizeProxy" v-show="resizeProxyVisible"></div>
  </div>
</template>

<script>
// 控制操作频度的组件
import debounce from 'throttle-debounce/debounce';
import { addResizeListener, removeResizeListener } from 'element-ui/src/utils/resize-event';
// 表格状态管理工具
import TableStore from './table-store';
import TableLayout from './table-layout';
import TableBody from './table-body';
import TableHeader from './table-header';

let tableIdSeed = 1;

export default {
  name: 'ElTable',

  props: {
    data: { type: Array, default: () => [] },
    stripe: Boolean,// 条纹
    border: Boolean,
    context: {},
    fit: {
      type: Boolean,
      default: true
    },
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
      resizeProxyVisible: false,
      resizeState: {
        width: null,
        height: null
      },
    };
  },

  computed: {
    bodyWrapper() {
      return this.$refs.bodyWrapper;
    },
    // 供table-layout.js 的 getFlattenColumns 使用
    columns() {
      return this.store.states.columns;
    },

    tableData() {
      return this.store.states.data;
    },

    bodyWidth() {
      const { bodyWidth, scrollY, gutterWidth } = this.layout;
      return bodyWidth ? bodyWidth - (scrollY ? gutterWidth : 0) + 'px' : '';
    },
  },

  components: {
    TableHeader,
    TableBody,
  },

  watch: {
    data: {
      immediate: true,
      handler(value) {
        // 供 table-body computed.data 使用
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
    doLayout() {
      console.log('doLayout executed');
      this.layout.updateColumnsWidth();
    },

    resizeListener() {
      if (!this.$ready) return;
      let shouldUpdateLayout = false;
      const el = this.$el;
      const { width: oldWidth, height: oldHeight } = this.resizeState;

      const width = el.offsetWidth;
      if (oldWidth !== width) {
        shouldUpdateLayout = true;
      }

      const height = el.offsetHeight;
      if ((this.height || this.shouldUpdateHeight) && oldHeight !== height) {
        shouldUpdateLayout = true;
      }

      if (shouldUpdateLayout) {
        this.resizeState.width = width;
        this.resizeState.height = height;
        this.doLayout();
      }
    },

    bindEvents() {
      if (this.fit) {
        addResizeListener(this.$el, this.resizeListener);
      }
    },
  },

  created() {
    this.tableId = `el-table_${tableIdSeed}`;
    tableIdSeed += 1;
    // 提供给table-store的TableStore.prototype.scheduleLayout使用
    this.debouncedUpdateLayout = debounce(50, () => this.doLayout());
  },

  mounted() {
    this.bindEvents();
    // 更新columns与originColumns从而触发table-header、table-body更新
    this.store.updateColumns();

    this.resizeState = {
      width: this.$el.offsetWidth,
      height: this.$el.offsetHeight
    };

   this.doLayout();
    // 标记table组件已经mounted，table-store.js的insertColumn也以此来判断需不需调用updateColumn
    this.$ready = true;
  },

  destroyed() {
    if (this.resizeListener) removeResizeListener(this.$el, this.resizeListener);
  },
};
</script>
