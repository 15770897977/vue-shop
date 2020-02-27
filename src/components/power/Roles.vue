<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 按钮 -->
    <el-card>
      <el-button type="primary">添加角色</el-button>
    </el-card>
    <!-- 表格 -->
    <el-table :data="RolesList" border stripe>
      <!-- 展开列 -->
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row
            :class="['bdbuttom',i1===0?'bdtop':'','vcenter']"
            v-for="(item1, i1) in scope.row.children"
            :key="item1.id"
          >
            <el-col :span="5">
              <el-tag closable @close="removeRightByid(scope.row,item1.id )">{{item1.authName}}</el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <!-- 渲染二级和三级权限 -->
            <el-col :span="19">
              <el-row
                :class="[i2===0?'':'bdtop','vcenter']"
                v-for="(item2 ,i2) in item1.children"
                :key="item2.id"
              >
                <el-col :span="6">
                  <el-tag
                    closable
                    @close="removeRightByid(scope.row,item2.id )"
                    type="success"
                  >{{item2.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="18">
                  <el-tag
                    closable
                    @close="removeRightByid(scope.row,item3.id )"
                    type="warning"
                    v-for="item3 in item2.children"
                    :key="item3.id"
                  >{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <!-- 注意点  : per标签会保留空格和空行 -->
          <pre>
            {{scope.row}}
          </pre>
        </template>
      </el-table-column>
      <!-- 索引列 -->
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column prop="roleName" label="角色名称"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述"></el-table-column>

      <el-table-column label="操作" width="300px">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
          <el-button
            @click="showSetRightDialgo(scope.row)"
            size="mini"
            type="warning"
            icon="el-icon-s-tools"
          >分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <!-- 树形控件 -->
      <el-tree
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        :data="rightsList"
        :props="treeProps"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 角色列表
      RolesList: [],
      // 分配权限对话框的显示和隐藏
      setRightDialogVisible: false,
      // 获取到的权限数据
      rightsList: [],
      // 树形控件的属性绑定对象
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      // 默认选中的节点id
      defKeys: [],
      RightsId: ''
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    // 获取权限列表
    async getRolesList () {
      const { data: res } = await this.$http.get('roles')
      this.RolesList = res.data
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色失败')
      }
      this.RolesList = res.data
    },
    // 删除用户权限
    async removeRightByid (role, rightId) {
      const confirmResult = await this.$confirm(
        '此操作将删除该权限, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      // console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('你取消了删除权限!')
      }
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('取消权限失败')
      }
      this.$message.success('取消权限成功!')
      // this.getRolesList()
      // 这里将返回的数据赋值给当前角色的权限数据
      role.children = res.data
    },
    // 展示分配权限的对话框
    async showSetRightDialgo (role) {
      this.setRightDialogVisible = true
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限数据失败')
      }
      this.rightsList = res.data
      this.getLeafkeys(role, this.defKeys)
      this.RightsId = role.id
    },
    // 通过递归的形式获取所有角色下的三级节点的id  , 并将它保存到defKeys这个数组中
    getLeafkeys (node, arr) {
      // 如果当前node节点不包含children属性 , 则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafkeys(item, arr))
    },
    // 监听分配权限对话框的关闭事件
    setRightDialogClosed () {
      this.defKeys = []
    },
    // 权限授权
    async allotRights () {
      // console.log(this.RightsId)
      const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
      const idStr = keys.join(',')
      const {data: res} = await this.$http.post(`roles/${this.RightsId}/rights`, {rids: idStr})
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败!')
      }
      this.$message.success('分配权限成功!')
      this.setRightDialogVisible = false
      this.getRolesList()
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbuttom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
