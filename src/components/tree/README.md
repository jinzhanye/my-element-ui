````html
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
````

重点在root.childNodes

created新建TreeStore

tree与tree-node通过tree-store操作node

## TreeStore
构建Node节点

````
 constructor(options) {
    // ....
    this.root = new Node({
      data: this.data,
      store: this
    });
  }
````

root对象
![](https://ws2.sinaimg.cn/large/006tNc79gy1ftlvpobpjzj30as0g43zy.jpg)

## Node
重点在setData方法，递归构造Node节点

## TreeNode
每个节点都是无差别的，展示的时候只是根据层级(level)来控制其缩进，来起到父子关系

````html
<div class="el-tree-node__content"
         :style="{ 'padding-left': (node.level - 1) * tree.indent + 'px' }">
         <!--.........-->
</div>
````

## 参考 
[tree 源码分析](https://github.com/zimplexing/zzZ/issues/22)
