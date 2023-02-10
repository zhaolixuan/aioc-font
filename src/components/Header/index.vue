<template>
  <div class="header">
    <div class="header_tit"><a href="/">{{activeTitle ? activeTitle : title}}</a></div>
    <div :class="['nav',showDate?'nav_move':'']">
      <div class="navleft_tit">
        <ul>
          <!-- <li v-if="type==2">
            <div v-if="showDate" class="nav_date">{{navDate}}</div>
          </li> -->
          <li v-for="menu in leftMenus" :key="menu.key" @click="changeValue(menu)">
            <a v-if="menu.notclick" class="menu_btn notclick"><i :class="menu.icon"></i>{{menu.alias || menu.title}}</a>
            <router-link v-else-if="menu.type && menu.type=='frame'" :class="['menu_btn',menu.key==activeKey?'active':'' ]" :to="{ name: menu.type ,query:{'url':menu.url,'titleName':menu.title,'key':menu.key},params:menu}" ><i :class="menu.icon"></i>{{menu.alias || menu.title}}</router-link>
            <a v-else-if="menu.type=='goto'" :href="menu.url" class="menu_btn"><i :class="menu.icon"></i>{{menu.alias || menu.title}}</a>
            <router-link v-else :class="['menu_btn',menu.key==activeKey?'active':'' ]" :to="{ path: '/'+menu.url, query:{'titleName':menu.title,'key':menu.key} }"><i :class="menu.icon"></i>{{menu.alias || menu.title}}</router-link>
          </li>
        </ul>
      </div>
      <div class="navright_tit">
        <ul>
          <li v-for="menu in rightMenus" :key="menu.key" @click="changeValue(menu)">
            <a v-if="menu.notclick" class="menu_btn notclick"><i :class="menu.icon"></i>{{menu.alias || menu.title}}</a>
            <router-link v-else-if="menu.type && menu.type=='frame'" :class="['menu_btn',menu.key==activeKey?'active':'' ]" :to="{ name: menu.type ,query:{'url':menu.url,'titleName':menu.title,'key':menu.key}, params:menu }"><i :class="menu.icon"></i>{{menu.alias || menu.title}}</router-link>
            <a v-else-if="menu.type=='goto'" :href="menu.url" class="menu_btn"><i :class="menu.icon"></i>{{menu.alias || menu.title}}</a>
            <router-link v-else :class="['menu_btn',menu.key==activeKey?'active':'' ]" :to="{ path: '/'+menu.url, query:{'titleName':menu.title,'key':menu.key}}"><i :class="menu.icon"></i>{{menu.alias || menu.title}}</router-link>
          </li>
          <!-- <li v-if="type==2">
            <div v-if="showWeather" class="nav_weather">{{weather}}</div>
            <span class="home_btn iconfont iconshouyeicon" @click="goHome"></span>
          </li> -->
        </ul>
      </div>
    </div>
    <div v-if="type!=2" class="nav_btn" @click="dialogVisible = true"></div>
    <el-dialog :fullscreen="fullscreen" :visible.sync="dialogVisible" >
      <Navigation @closed="closed" :menu="menus"></Navigation>
    </el-dialog>
  </div>
</template>

<script>
import Navigation from './Navigation/Navigation'
// import chineseLunar from 'chinese-lunar'
export default {
  // type: 1.头部无下拉框，通过弹层展示导航菜单(默认)；2.头部有下拉框，无菜单弹层
  // showDate: 展示日期星期农历，一级按钮向中间偏移展示
  props: {
    title: {
      type: String,
      default: "智慧运营管理中心"
      // required: true,
    },
    type: {
      type: Number,
      default: 1
    },
    showDate: {
      type: Boolean,
      default: false
    },
    showWeather: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dialogVisible: false,
      fullscreen: true
    }
  },
  mounted(){
    // console.log(this.activeTitle)
    // console.log(this.title)
    console.log(this.menu)
},
  computed: {
    activeTitle(){
      if(this.$route.query.titleName === '招商引资'){
        return '招商态势监测'
      }
      if(this.$route.query.titleName === '产业电商'){
        return '食用菌全网电商'
      } 
      if(this.$route.query.titleName === '产业链招商'){
        return '产业链全景'
      } 
      if(this.$route.query.titleName === '全网零售大数据'){
        return '邹城市全网零售大数据'
      }
      if(this.$route.query.titleName === '邹城市网络零售'){
        return '邹城市网络零售详细分析'
      }
      return this.$store.state.activeName
    },
    menus () {
      console.log(this.$store.state.menuStore.navMenu)
      return this.$store.state.menuStore.navMenu
    },
    activeKey () {
      if(this.$route.query.key){
        return this.$route.query.key
      }
      return this.$store.state.activeKey
    },
    leftMenus () {
      let arry = []
      this.menus.map((item, index) => {
        if (item.visible) {
          arry.push(item)
        }
        // if (item.children && item.children.length > 0) {
        //   item.children.map(el => {
        //     if (el.visible) {
        //       arry.push(el)
        //     }
        //   })
        // }
      })
      return arry.slice(0, Math.ceil(arry.length / 2))
    },
    rightMenus () {
      let arry = []
      this.menus.map((item, index) => {
        if (item.children && item.children.length > 0) {
          if (item.visible) {
            arry.push(item)
          }
          // item.children.map(el => {
          //   if (el.visible) {
          //     arry.push(el)
          //   }
          // })
        }
      })
      return arry.slice(Math.ceil(arry.length / 2))
    },
    // navDate () {
    //   let now = new Date()
    //   let month = now.getMonth() + 1
    //   let day = now.getDate()
    //   let weeks = ['日', '一', '二', '三', '四', '五', '六']
    //   let week = weeks[now.getDay()]
    //   if (month < 10) {
    //     month = '0' + month
    //   }
    //   if (day < 10) {
    //     day = '0' + day
    //   }
    //   let lunar = chineseLunar.solarToLunar(now, 'MD')
    //   return month + '月' + day + '日' + ' 星期' + week + ' 农历' + lunar
    // },
    // weather () {
    //   if (typeof (wea_) !== 'undefined') {
    //     let weather = wea_.day1
    //     return weather[2] + ' ' + weather[0] + ' ' + weather[3]
    //   } else {
    //     return ''
    //   }
    // }
  },
  methods: {
    changeValue (el) {
      console.log(el)
      if(el.title == '行业资讯'){
        this.$store.commit('setActiveTitle','活动峰会')
      }else{
        this.$store.commit('setActiveTitle',el.title)
      }
      this.$store.commit('setActiveName', el.title)
      this.$store.commit('setActiveKey', el.key)
    },
    closed () {
      this.dialogVisible = false
    },
    goHome () {
      this.$router.push({name: 'Home'})
    }
  },
  components: {
    Navigation
  }
}
</script>
<style>
  .header{
    position: relative;
    height:11%;
    z-index: 99;
  }
  .header_tit {
    background: url("../../assets/img/title_bg.png") no-repeat center center;
    width:100%;
    height: 1.34rem;
    color:#A5DCFF;
    font-size:.32rem;
    font-weight:bold;
    text-align:center;
    line-height:.8rem;
    position: absolute;
    background-size: 100% 1.34rem;
  }
  .header_tit a{
    color: #fff;
    text-decoration: none;
  }
  .header .nav{
    width: 100%;
    color: #fff;
    float: right;
  }
  .navleft_tit{
    width:7.5rem;
    position: absolute;
  }
  .navright_tit{
    width:7.5rem;
    position: absolute;
    right: 0;
    top: 0;
  }
  .nav ul{
    display: flex;
  }
  .nav ul li{
    flex: 1;
    font-size: .16rem;
    color: #B1DFFF;
    height:.54rem;
    line-height: .54rem;
    position: relative;
  }
  .nav_move .navleft_tit .nav_title{
    left: 50%;
  }
  .nav_move .navright_tit .nav_title{
    right: 50%;
  }
  .nav .menu_btn{
    text-decoration: none;
    color: #A5DCFF;
    display: block;
    position: absolute;
    left: 20%;
  }
  .nav .menu_btn i{
    float: left;
    width: .46rem;
    height: .54rem;
    background-size: .46rem .54rem;
    margin-right: .1rem;
  }
  .active.menu_btn i{
    width: .62rem;
    height: .55rem;
    background-size: .63rem .55rem;
  }
  .notclick{
    cursor: not-allowed;
  }
  .cyfz{
    background: url("../../assets/img/cyfz.png") no-repeat;
  }
  .active .cyfz{
    background: url("../../assets/img/cyfz_on.png") no-repeat;
  }
  .szsy{
    background: url("../../assets/img/szsy.png") no-repeat;
  }
  .active .szsy{
    background: url("../../assets/img/szsy_on.png") no-repeat;
  }
  .xczx{
    background: url("../../assets/img/xczx.png") no-repeat;
  }
  .active .xczx{
    background: url("../../assets/img/xczx_on.png") no-repeat;
  }
  .whjy{
    background: url("../../assets/img/whjy.png") no-repeat;
  }
  .active .whjy{
    background: url("../../assets/img/whjy_on.png") no-repeat;
  }
  .hjzl{
    background: url("../../assets/img/hjzl.png") no-repeat;
  }
  .active .hjzl{
    background: url("../../assets/img/hjzl_on.png") no-repeat;
  }
  .zwfw{
    background: url("../../assets/img/zwfw.png") no-repeat;
  }
  .active .zwfw{
    background: url("../../assets/img/zwfw_on.png") no-repeat;
  }

  .nav_date{
    position: absolute;
    left: .5rem;
    top: 0;
    color: #A5DCFF;
    font-size: .2rem;
    line-height: .54rem;
  }
  .nav_weather{
    position: absolute;
    right: .5rem;
    top: 0;
    color: #A5DCFF;
    font-size: .2rem;
    line-height: .54rem;
  }
  .home_btn{
    position: absolute;
    right: .2rem;
    font-size: .18rem;
    cursor: pointer;
  }

  .nav_btn{
    background: url("../../assets/img/nav_btn.png") no-repeat;
    width: .57rem;
    height: .77rem;
    background-size: .57rem .77rem;
    position: absolute;
    right: 0;
    top: 0;
    cursor: pointer;
    z-index: 999;
  }

  .el-dialog__body{
    height: 100%!important;
    padding: 0;
  }
  .el-dialog__header{
    position: absolute;
    padding: 0;
    z-index: 999;
    width: 100%;
  }
  .el-dialog__headerbtn{
    font-size: 30px!important;
  }
  .v-modal{
    z-index: 0!important;
  }

</style>
