export default {
  route: {
    dashboard: '首页',
    generalDeploy: '常规部署',
    documentation: '文档',
    guide: '引导页',
    permission: '权限管理',
    serverassets: '资产管理',
    assetsList: '资产列表',
    batchmanage: '运维管理',
    AdminUser: '管理账户',
    SystemUser: '系统账户',
    rolePermission: '角色权限',
    edituser: '人员编辑',
    user: '人员权限',
    pagePermission: '页面权限',
    directivePermission: '指令权限',
    icons: '图标',
    components: '组件',
    tinymce: '富文本编辑器',
    markdown: 'Markdown',
    jsonEditor: 'JSON 编辑器',
    dndList: '列表拖拽',
    splitPane: 'Splitpane',
    avatarUpload: '头像上传',
    dropzone: 'Dropzone',
    sticky: 'Sticky',
    countTo: 'Count To',
    componentMixin: '小组件',
    backToTop: '返回顶部',
    dragDialog: '拖拽 Dialog',
    dragSelect: '拖拽 Select',
    dragKanban: '可拖拽看板',
    charts: '图表',
    keyboardChart: '键盘图表',
    lineChart: '折线图',
    mixChart: '混合图表',
    example: '综合实例',
    nested: '路由嵌套',
    batchops: '批量操作',
    batchCommand: '执行命令',
    batchSend: '传送文件',
    batchScript: '执行脚本',
    deploy: '部署管理',
    // menu1: '菜单1',
    // 'batchCommand': '菜单 1-1',
    // 'batchSend': '菜单 1-2',
    // 'batchSend-1': '菜单 1-2-1',
    // 'batchSend-2': '菜单 1-2-2',
    // 'batchScript': '菜单 1-3',
    // menu2: '菜单 2',
    Table: 'Table',
    dynamicTable: '动态 Table',
    dragTable: '拖拽 Table',
    inlineEditTable: 'Table 内编辑',
    complexTable: '综合 Table',
    tab: 'Tab',
    form: '表单',
    createArticle: '创建文章',
    editArticle: '编辑文章',
    articleList: '文章列表',
    errorPages: '错误页面',
    page401: '401',
    page404: '404',
    errorLog: '错误日志',
    excel: 'Excel',
    exportExcel: '导出 Excel',
    selectExcel: '导出 已选择项',
    mergeHeader: '导出 多级表头',
    uploadExcel: '上传 Excel',
    zip: 'Zip',
    pdf: 'PDF',
    exportZip: 'Export Zip',
    theme: '换肤',
    clipboardDemo: 'Clipboard',
    i18n: '国际化',
    externalLink: '外链'
  },
  navbar: {
    logOut: '退出登录',
    dashboard: '首页',
    github: '项目地址',
    theme: '换肤',
    size: '布局大小'
  },
  login: {
    title: '系统登录',
    logIn: '登录',
    username: '账号',
    password: '密码',
    any: '随便填',
    thirdparty: '第三方登录',
    thirdpartyTips: '本地不能模拟，请结合自己业务进行模拟！！！'
  },
  documentation: {
    documentation: '文档',
    github: 'Github 地址'
  },
  permission: {
    addRole: '新增角色',
    clear: '清除',
    editPermission: '编辑权限',
    roles: '你的权限',
    switchRoles: '切换权限',
    tips: '在某些情况下，不适合使用 v-permission。例如：Element-UI 的 el-tab 或 el-table-column 以及其它动态渲染 dom 的场景。你只能通过手动设置 v-if 来实现。',
    delete: '删除',
    confirm: '确定',
    cancel: '取消'
  },
  serverassets: {

  },
  guide: {
    description: '引导页对于一些第一次进入项目的人很有用，你可以简单介绍下项目的功能。本 Demo 是基于',
    button: '打开引导'
  },
  components: {
    documentation: '文档',
    tinymceTips: '富文本是管理后台一个核心的功能，但同时又是一个有很多坑的地方。在选择富文本的过程中我也走了不少的弯路，市面上常见的富文本都基本用过了，最终权衡了一下选择了Tinymce。更详细的富文本比较和介绍见',
    dropzoneTips: '由于我司业务有特殊需求，而且要传七牛 所以没用第三方，选择了自己封装。代码非常的简单，具体代码你可以在这里看到 @/components/Dropzone',
    stickyTips: '当页面滚动到预设的位置会吸附在顶部',
    backToTopTips1: '页面滚动到指定位置会在右下角出现返回顶部按钮',
    backToTopTips2: '可自定义按钮的样式、show/hide、出现的高度、返回的位置 如需文字提示，可在外部使用Element的el-tooltip元素',
    imageUploadTips: '由于我在使用时它只有vue@1版本，而且和mockjs不兼容，所以自己改造了一下，如果大家要使用的话，优先还是使用官方版本。'
  },
  table: {
    dynamicTips1: '固定表头, 按照表头顺序排序',
    dynamicTips2: '不固定表头, 按照点击顺序排序',
    dragTips1: '默认顺序',
    dragTips2: '拖拽后顺序',
    title: '标题',
    importance: '重要性',
    Heroes: '金榜',
    protocol: '连接协议',
    hostname: '主机别称',
    command: '执行命令',
    file: '传送文件',
    script: '执行脚本',
    ip: '内网IP',
    FetchAssetsDetail: '资产详细信息',
    public_ip: '公网IP',
    node: '节  点',
    lable: '标  签',
    comment: '备  注',
    os: '系统类型',
    checks_all: '全选',
    vendor: '供应商',
    sn: 'SN码',
    cpu_count: 'CPU颗数',
    cpu_cores: 'CPU核数',
    cpu_vcpus: '逻辑CPU数',
    memory: '内存大小',
    disk_total: '硬盘大小',
    disk_info: '硬盘详情',
    os_version: '系统版本',
    os_arch: '系统位数',
    hostname_raw: '主机名',
    labels: '标签',
    search: '搜索',
    add: '新建资产',
    updateAssesInfo: '更新硬件信息',
    export: '导出',
    port: '端口',
    is_active: '状 态',
    platform: '系统类型',
    admin_user: '系统账号',
    reviewer: '审核人',
    id: '序号',
    date_created: '创建时间',
    author: '作者',
    readings: '阅读数',
    status: '状  态',
    actions: '操作',
    edit: '编辑',
    publish: '发布',
    draft: '草稿',
    delete: '删除',
    cancel: '取 消',
    confirm: '确 定',
    upload: '上传',
    checkProt:'端口',
  },
  errorLog: {
    tips: '请点击右上角bug小图标',
    description: '现在的管理后台基本都是spa的形式了，它增强了用户体验，但同时也会增加页面出问题的可能性，可能一个小小的疏忽就导致整个页面的死锁。好在 Vue 官网提供了一个方法来捕获处理异常，你可以在其中进行错误处理或者异常上报。',
    documentation: '文档介绍'
  },
  excel: {
    export: '导出',
    selectedExport: '导出已选择项',
    placeholder: '请输入文件名(默认excel-list)'
  },
  zip: {
    export: '导出',

    placeholder: '请输入文件名(默认file)'
  },
  pdf: {
    tips: '这里使用   window.print() 来实现下载pdf的功能'
  },
  theme: {
    change: '换肤',
    documentation: '换肤文档',
    tips: 'Tips: 它区别于 navbar 上的 theme-pick, 是两种不同的换肤方法，各自有不同的应用场景，具体请参考文档。'
  },
  tagsView: {
    refresh: '刷新',
    close: '关闭',
    closeOthers: '关闭其它',
    closeAll: '关闭所有'
  },
  settings: {
    title: '系统布局配置',
    theme: '主题色',
    tagsView: '开启 Tags-View',
    fixedHeader: '固定 Header',
    sidebarLogo: '侧边栏 Logo'
  },
  deploy: {
    commit: '提交',
    checklog: '查看日志',
    reset: '重置'
  }

}
