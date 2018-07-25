<template>
  <div class="el-tree"
       role="tree">
    <el-tree-node v-for="child in root.childNodes"
                  :node="child"
                  :props="props"
                  @node-expand="handleNodeExpand">
    </el-tree-node>
  </div>
</template>

<script>
import TreeStore from './model/tree-store';
import ElTreeNode from './tree-node.vue';
import emitter from 'element-ui/src/mixins/emitter';

export default {
  name: 'ElTree',

  mixins: [emitter],

  data() {
    return {
      store: null,
    }
  },

  props: {
    data: { type: Array },
    nodeKey: String,
    props: {
      default() {
        return {
          children: 'children',
          label: 'label',
          icon: 'icon',
          disabled: 'disabled'
        }
      }
    },
    indent: {// 树节点缩进
      type: Number,
      default: 18
    }
  },

  computed: {
    children: {// ??? 只有get被调用过，但不清楚哪里调用
      set(value) {
        this.data = value;
      },
      get() {
        return this.data;
      }
    },
  },

  components: {
    ElTreeNode
  },

  watch: {
    data(newVal) {
      // 当data改变时刷新this.root.childNodes
      this.store.setData(newVal);
    },
  },

  methods: {
    handleNodeExpand(nodeData, node, instance) {
      this.broadcast('ElTreeNode', 'tree-node-expand', node);
      this.$emit('node-expand', nodeData, node, instance);
    },
  },

  created() {
    this.isTree = true;

    // 将data包装成root节点
    this.store = new TreeStore({
      key: this.nodeKey,
      data: this.data,
      props: this.props
    });
    // 供 tree-node 使用
    this.root = this.store.root;
  },

  updated() {

  },

  mounted() {
    // 监听键盘事件
    // .......
  },
}
</script>
