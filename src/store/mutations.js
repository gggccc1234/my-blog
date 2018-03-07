import * as types from './mutation-types'
import {decodeArticle, decodeUser} from '@/common/js/util'

const mutations = {
  [types.SET_CURRENT_ARTICLE] (state, article) {
    decodeArticle(article)
    state.currentArticle = article
  },
  [types.SET_CURRENT_USER] (state, user) {
    decodeUser(user)
    state.currentUser = user
  },
  [types.SET_ALL_PAGE] (state, allpage) {
    state.allPage = allpage
  },
  [types.SET_PAGE] (state, page) {
    state.page = page
  },
  [types.SET_LABEL_ARRAY] (state, labelarray) {
    state.labelArray = labelarray
  },
  [types.SET_ARTICLE_LOVE] (state, articlelove) {
    state.currentArticle.articleLove = articlelove
  },
  [types.SET_ARTICLE_VISIT] (state, articlevisit) {
    state.currentArticle.articleVisit = articlevisit
  },
  [types.SET_ARTICLE_LISTS] (state, articlelists) {
    articlelists.forEach((item) => {
      decodeArticle(item)
    })
    state.articleLists = articlelists
  },
  [types.SET_IS_LOGIN] (state, islogin) {
    state.isLogin = islogin
  },
  [types.SET_LOGIN_SUCCESS] (state, loginsuccess) {
    state.loginSuccess = loginsuccess
  },
  [types.SET_PAGE_ADD] (state) {
    state.page++
  },
  [types.SET_PAGE_SUB] (state) {
    state.page--
  },
  [types.SET_TIME_ARRAY] (state, timearray) {
    state.timeArray = timearray
  },
  [types.SET_IS_LOGIN_TOGGLE] (state) {
    state.isLogin = !state.isLogin
  },
  [types.SET_CURRENT_DRAFT] (state, currentdraft) {
    decodeArticle(currentdraft)
    state.currentDraft = currentdraft
  },
  [types.SET_CHECK_USER] (state, checkuser) {
    decodeUser(checkuser)
    state.checkUser = checkuser
  },
  [types.SET_IS_CHECKED] (state, ischecked) {
    state.isChecked = ischecked
  },
  [types.PUSH_LABEL_ARRAY] (state, newlabel) {
    state.labelArray.push(newlabel)
  },
  [types.SET_IS_ADMIN] (state, isadmin) {
    state.isAdmin = isadmin
  },
  [types.SET_COMMENT_ADD] (state) {
    state.currentArticle.articleComment++
  },
  [types.SET_ARTICLE_LISTS_PULL] (state, articleid) {
    state.articleLists = state.articleLists.filter((item) => {
      return item.articleId !== articleid
    })
  },
  [types.SET_SEARCH] (state, search) {
    state.search = search
  },
  [types.SET_PAGE_SIZE] (state, pagesize) {
    state.pageSize = pagesize
  },
  [types.SET_SORT] (state, sort) {
    state.sort = sort
  },
  [types.RESET_SEARCH] (state) {
    state.search = {}
  }
}

export default mutations
