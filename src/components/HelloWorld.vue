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
        width="180"/>
      <ElTableColumn
        prop="name"
        label="姓名"
        width="180"/>
      <ElTableColumn
        prop="address"
        label="地址"/>
    </ElTable>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }]
    };
  },

  mounted() {
    // this.$message({
    //   showClose: true,
    //   type: 'success',
    //   message: '这是一条消息？',
    //   duration: 0
    // });
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
