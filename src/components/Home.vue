<template>
  <el-container>
    <el-header>
      <div>
        <img class="logo" src="../assets/logo.jpg" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="collapse ? '64px' : '200px'">
        <el-menu
          :collapse="collapse"
          :collapse-transition="false"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          router
          :default-active="activePath"
        >
          <div class="toggle-button" @click="toggleCollapse">|||</div>
          <!-- 一级菜单 -->
          <el-submenu v-for="item in menuList" :key="item.id" :index="item.id+''">
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item @click="fnsaveNavState('/' + subitem.path)" v-for="subitem in item.children" :key="subitem.id" :index="'/' + subitem.path">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subitem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      menuList: [],
      iconObj: {
        '125': 'iconfont icon-yonghuming',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      // 折叠菜单栏
      collapse: false,
      // 被激活的链接
      activePath: ''
    }
  },
  created () {
    this.fnGetMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    async fnGetMenuList () {
      const { data: res } = await this.$http.get('/menus')
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    logout () {
      // 退出功能 只需要 清空token  就行
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 菜单栏的折叠功能
    toggleCollapse () {
      this.collapse = !this.collapse
    },
    // 保存连接的激活状态
    fnsaveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  width: 100%;
  height: 100%;
}
.el-header {
  background-color: #383c3f;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0px;
  div {
    display: flex;
    align-items: center;
    color: #fff;
    .logo {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      margin-right: 20px;
    }
  }
}

.el-aside {
  background-color: #313743;
  .toggle-button {
    background-color: #4a5064;
    color: #fff;
    line-height: 24px;
    text-align: center;
    cursor: pointer;
    // 注意点 : 设置字符之间的间距
    letter-spacing: 0.4em;
    font-size: 10px;
  }
  .toggle-button:hover {
    background-color: rgb(50, 116, 72);
  }
}
.el-main {
  background-color: #e9edf1;
}
.el-menu {
  width: 100%;
}
</style>
