<template>
  <div
    class="el-tree-node"
    ref="node">

    <div class="el-tree-node__content"
         :style="{ 'padding-left': (node.level - 1) * tree.indent + 'px' }">
      <!--expanded样式控制箭头向右还是向下-->
      <span class="el-tree-node__expand-icon el-icon-caret-right"
            @click.stop="handleExpandIconClick"
            :class="{ 'is-leaf': node.isLeaf, expanded: !node.isLeaf && expanded }"></span>
      <node-content :node="node"></node-content>
    </div>

    <div class="el-tree-node__children"
         v-if="!renderAfterExpand || childNodeRendered"
         v-show="expanded"
         role="group">
      <!--递归组件-->
      <el-tree-node v-for="child in node.childNodes"
                    :node="child"
                    :render-after-expand="renderAfterExpand"
                    @node-expand="handleChildNodeExpand">
      </el-tree-node>
    </div>
  </div>
</template>

<script>
import emitter from 'element-ui/src/mixins/emitter';

export default {
  name: 'ElTreeNode',

  componentName: 'ElTreeNode',

  mixins: [emitter],

  props: {
    node: {
      default() {
        return {};
      }
    },
    props: {},
    renderAfterExpand: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      tree: null,
      expanded: false,
      childNodeRendered: false,
    }
  },

  components: {
    NodeContent: {
      props: {
        node: {
          required: true
        }
      },
      render(createElement) {
        const parent = this.$parent;
        const tree = parent.tree;
        const node = this.node;
        const { data, store } = node;
        return (
          parent.renderContent
            ? ''
            : tree.$scopedSlots.default
            ? tree.$scopedSlots.default({ node, data })
            : <span class="el-tree-node__label">{node.label}</span>
        );
      }
    }
  },

  watch: {
    'node.expanded'(val) {
      debugger
      // TODO ???
      this.$nextTick(() => this.expanded = val);
      if (val) {
        this.childNodeRendered = true;
      }
    }
  },

  methods: {
    handleClick() {
      this.tree.$emit('node-click', this.node.data, this.node, this);
    },

    handleChildNodeExpand(nodeData, node, instance) {
      this.broadcast('ElTreeNode', 'tree-node-expand', node);
      this.tree.$emit('node-expand', nodeData, node, instance);
    },

    handleExpandIconClick() {
      if (this.node.isLeaf) return;
      if (this.expanded) {
        this.tree.$emit('node-collapse', this.node.data, this.node, this);
        this.node.collapse();
      } else {
        this.node.expand();
        this.$emit('node-expand', this.node.data, this.node, this);
      }
    },
  },

  created() {
    const parent = this.$parent;

    if (parent.isTree) {
      this.tree = parent;
    } else {
      this.tree = parent.tree;
    }

    const tree = this.tree;
    if (!tree) {// 防止tree-node标签外层没有tree标签包裹
      console.warn('Can not find node\'s tree.');
    }

    const props = tree.props || {};
    const childrenKey = props['children'] || 'children';

    this.$watch(`node.data.${childrenKey}`, () => {
      this.node.updateChildren();
    });

    if (this.node.expanded) {
      this.expanded = true;
      this.childNodeRendered = true;
    }
  }
}
</script>
