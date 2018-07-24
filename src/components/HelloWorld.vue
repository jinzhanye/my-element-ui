<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>Essential Links</h2>

    <ElTable
      :data="tableData"
      style="width: 100%">
      <ElTableColumn
        type="index"
        width="50"/>
      <ElTableColumn
        prop="date"
        label="日期"
        width="180"
        :formatter="dateFormatter"/>
      <ElTableColumn
        prop="name"
        label="姓名"
        width="180"/>
      <ElTableColumn
        prop="address"
        label="地址"/>

      <ElTableColumn
        prop="enable"
        label="可用">
        <template slot-scope="{ row }">
          <span>{{row.enable ? '是' : '否'}}</span>
        </template>
      </ElTableColumn>
    </ElTable>

    <ElTree :data="data" :props="defaultProps" @node-click="handleNodeClick"></ElTree>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
      data: [{
        label: '一级 1',
        children: [{
          label: '二级 1-1',
          children: [{
            label: '三级 1-1-1'
          }]
        }]
      }, {
        label: '一级 2',
        children: [{
          label: '二级 2-1',
          children: [{
            label: '三级 2-1-1'
          }]
        }, {
          label: '二级 2-2',
          children: [{
            label: '三级 2-2-1'
          }]
        }]
      }, {
        label: '一级 3',
        children: [{
          label: '二级 3-1',
          children: [{
            label: '三级 3-1-1'
          }]
        }, {
          label: '二级 3-2',
          children: [{
            label: '三级 3-2-1'
          }]
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      tableData: [{
        date: new Date(),
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
        enable: true,
      }, {
        date: new Date(),
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄',
        enable: false,
      }, {
        date: new Date(),
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄',
        enable: true,
      }, {
        date: new Date(),
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄',
        enable: true,
      }]
    };
  },

  methods: {
    dateFormatter(row, column, value, index) {
      return row.date.toString();
    },
    handleNodeClick(data) {
      console.log(data);
    }
  },

  created() {
    // this.$on('hello', (d) => {
    //   console.log(d);
    // });
  },

  mounted() {
    // this.$emit('hello', 'event test');
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
</style>
