import Vue from 'vue'
import Router from 'vue-router'
import MainPage from '@/views/MainPage/MainPage'
import VueContent from '@/components/Content/VueContent'
import Article from '@/components/Article/Article'
import User from '@/components/User/User'
import Admin from '@/views/AdminPage/AdminPage'
import VueContentLeft from '@/components/ContentLeft/VueContentLeft'
import Productions from '@/components/Productions/Productions'
import AboutMe from '@/components/AboutMe/AboutMe'
import Question from '@/components/Question/Question'
import Support from '@/components/Support/Support'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/mainpage'
    }, {
      path: '/mainpage',
      name: 'MainPage',
      component: MainPage,
      children: [
        {
          path: '/mainpage',
          name: 'VueContent',
          component: VueContent,
          children: [
            {
              path: '/mainpage',
              name: 'VueContentLeft',
              component: VueContentLeft
            }, {
              path: '/mainpage/article/:id',
              name: 'Article',
              component: Article
            }
          ]
        }, {
          path: '/mainpage/user',
          name: 'User',
          component: User
        }, {
          path: '/mainpage/productions',
          name: 'Productions',
          component: Productions
        }, {
          path: '/mainpage/aboutme',
          name: 'AboutMe',
          component: AboutMe
        }, {
          path: '/mainpage/question',
          name: 'Question',
          component: Question
        }, {
          path: '/mainpage/support',
          name: 'Support',
          component: Support
        }
      ]
    }, {
      path: '/admin',
      name: 'Admin',
      component: Admin
    }
  ]
})
