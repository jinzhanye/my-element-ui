<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>Essential Links</h2>

    <!--<ElTable-->
      <!--:data="tableData"-->
      <!--style="width: 100%">-->
      <!--<ElTableColumn-->
        <!--type="index"-->
        <!--width="50"/>-->
      <!--<ElTableColumn-->
        <!--prop="date"-->
        <!--label="日期"-->
        <!--width="180"-->
        <!--:formatter="dateFormatter"/>-->
      <!--<ElTableColumn-->
        <!--prop="name"-->
        <!--label="姓名"-->
        <!--width="180"/>-->
      <!--<ElTableColumn-->
        <!--prop="address"-->
        <!--label="地址"/>-->

      <!--<ElTableColumn-->
        <!--prop="enable"-->
        <!--label="可用">-->
        <!--<template slot-scope="{ row }">-->
          <!--<span>{{row.enable ? '是' : '否'}}</span>-->
        <!--</template>-->
      <!--</ElTableColumn>-->
    <!--</ElTable>-->

    <ElMenu default-active="reportTemplateList"
            style="min-height: 100%;">
      <ElSubmenu index="1">
        <template slot="title">报告模版</template>
        <ElMenuItem index="reportTemplateList">报告模版列表</ElMenuItem>
        <ElMenuItem index="reportTemplateImage">报告图例</ElMenuItem>
      </ElSubmenu>

      <El-submenu index="2">
        <template slot="title">支付</template>
        <ElMenuItem index="reportGradeList">套餐列表</ElMenuItem>
      </El-submenu>

      <ElMenuItem index="countryList">国家列表</ElMenuItem>
    </ElMenu>

  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
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
    }
  },

  created() {
    this.$on('hello', (d) => {
      console.log(d);
    });
  },

  mounted() {
    this.$emit('hello', 'hahahaha');
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
