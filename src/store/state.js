const state = {
  currentArticle: {},
  // 当前选中文章
  currentUser: {},
  // 当前登录用户
  allPage: 0,
  // 总页数
  page: 1,
  // 当前页数
  isLogin: false,
  // 是否打开登录框
  labelArray: [],
  // 标签分类数组
  timeArray: [],
  // 事件分类数组
  articleLists: [],
  // 作文分类列表
  loginSuccess: false,
  // 是否登录
  currentDraft: {},
  // 当前选中草稿
  checkUser: {},
  // 当前选中用户
  isChecked: false,
  isAdmin: false,
  search: {},
  pageSize: 0,
  sort: {}
}
export default state
