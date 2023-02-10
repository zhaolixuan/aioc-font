<template>
  <div class="bg_gif">
    <div class="nav_bg">
      <div class="nav_main">
        <div class="head_tit">
          <div class="date_box">
            <div id="time">{{time}}</div>
            <div id="dayTime">{{date}}{{week}}</div>
          </div>
          <h2><a href="/">{{title}}</a></h2>
        </div>
        <div class="list">
          <dl :key="itemIdx" v-for="(item,itemIdx) in menu" >
            <template v-if="item.visible">
            <dt><i :class="item.class"></i><b></b>{{item.title}}</dt>
            <dd v-if="item.children && item.children.length > 0">
              <div class="dd_bg">
                <div :key="elIdx" v-for="(el ,elIdx) in item.children">
                  <li :class="el.class">
                    <a v-if="el.notclick" class="notclick">{{el.title}}</a>
                    <router-link v-else-if="el.type && el.type!='' && el.type!='goto'" :to="{ name: el.type, query:{'url':el.url,'titleName':el.title,'key':el.key}, params:el}" @click.native="handleClick(el)">{{el.title}}</router-link>
                    <a v-else-if="el.type=='goto'" :href="el.url" >{{el.title}}</a>
                    <router-link v-else :to="{ path: '/'+el.url ,query:{'titleName':el.title,'key':el.key}}" @click.native="handleClick(el)">{{el.title}}</router-link>
                  </li>
                  <div v-if="el.children && el.children.length > 0">
                    <span :key="sIdx" v-for="(sEl,sIdx) in el.children" :class="sEl.class">
                      <a v-if="sEl.notclick" class="notclick">{{sEl.title}}</a>
                      <router-link v-else-if="sEl.type && sEl.type!='' && sEl.type!='goto'" :to="{ name: sEl.type, query:{'url':sEl.url,'titleName':sEl.title,'key':sEl.key}, params: sEl }" @click.native="handleClick(sEl)">{{sEl.title}}</router-link>
                      <a v-else-if="el.type=='goto'" :href="sEl.url" >{{sEl.title}}</a>
                      <router-link v-else :to="{ path: '/'+sEl.url ,query:{'titleName':sEl.title,'key':sEl.key}}" @click.native="handleClick(sEl)">{{sEl.title}}</router-link>
                    </span>
                  </div>
                </div>
              </div>
            </dd>
            </template>
          </dl>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  // 导航页组件
  name: 'navigation',
  props: ['menu'],
  data () {
    return {
      time: '',
      week: '',
      date: '',
      title: this.$store.state.title || "智慧运营管理中心"
    }
  },
  mounted () {
    var _this = this
    this.timer = setInterval(function () {
      let wholeDate = new Date()
      let year = wholeDate.getFullYear()
      let mounth =
          wholeDate.getMonth() + 1 < 10
            ? '0' + (wholeDate.getMonth() + 1)
            : wholeDate.getMonth() + 1
      let date =
          wholeDate.getDate() < 10 ? '0' + wholeDate.getDate() : wholeDate.getDate()
      _this.date = year + '-' + mounth + '-' + date
      let hour =
          wholeDate.getHours() < 10 ? '0' + wholeDate.getHours() : wholeDate.getHours()
      let minute =
          wholeDate.getMinutes() < 10
            ? '0' + wholeDate.getMinutes()
            : wholeDate.getMinutes()
      // let second = wholeDate.getSeconds()
      _this.time = hour + ':' + minute
      let weekNum = wholeDate.getDay()
      switch (weekNum) {
        case 0:
          _this.week = '星期天'
          break
        case 1:
          _this.week = '星期一'
          break
        case 2:
          _this.week = '星期二'
          break
        case 3:
          _this.week = '星期三'
          break
        case 4:
          _this.week = '星期四'
          break
        case 5:
          _this.week = '星期五'
          break
        case 6:
          _this.week = '星期六'
          break
      }
    }, 1000)
  },
  beforeDestroy: function () {
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
  methods: {
    handleClick (el) {
      this.$emit('closed')
      console.log(el)
      if(el.key ==33){
        this.$store.commit('setActiveTitle','本地龙头企业')
      }else if(el.key == 35){
        this.$store.commit('setActiveTitle','招商重大项目')
      }else{
        this.$store.commit('setActiveTitle',el.title)
      }
      this.$store.commit('setActiveName', el.title)
      this.$store.commit('setActiveKey', el.key)
    }
  }
}
</script>

<style scoped>
  .bg_gif{
    background:url("../../../assets/img/bggif.gif") no-repeat;
    width: 100%;
    height: 100%;
    background-size: 100% auto;
    position: relative;

  }
  .nav_bg{
    background: rgba(0,42,128,0.4);
    height: 100%;

  }
  .head_tit{
    position: relative;
    padding-top:3%;
  }
  .head_tit .date_box{
    position: absolute;
    right: 6%;
    top: 40%;
  }
  .nav_main h2{
    background: url("../../../assets/img/titbg.png") no-repeat;
    width: 6.33rem;
    height: .98rem;
    background-size: 6.33rem .98rem ;
    line-height: .98rem;
    font-size: .32rem;
    text-align: center;
    font-weight: normal;
    margin: 0 auto;
  }
  .nav_main h2 a{
    color: #fff;
    text-decoration: none;
    text-align: center;
    padding-top: 10%;
  }
  .nav_main .list{
    overflow: hidden;
    position: absolute;
    top: 50%;
    left: 60%;
    width:60%;
    text-align:center;
    transform: translate(-65%, -40%);
  }
  .nav_main .list dl{
    float: left;
    font-size: .2rem;
    width: 23%;
    margin-right: 1.5%;
  }
  .nav_main .list dl:last-child{
    margin-right: 0;
  }
  .nav_main .list dl a{
    text-decoration: none;
    color:#fff;
  }
  .nav_main .list dl dt{
    background-image: radial-gradient(50% 130%, rgba(115,161,255,0.00) 35%, rgba(115,161,255,0.19) 100%);
    border-radius: 4px 4px 0px 4px 4px;
    height: 2.4rem;
    color: #fff;
    position: relative;
  }
  .nav_main .list dl dt i{
    display: block;
    font-size: .38rem;
    padding-top: 30%;
    padding-bottom: 10%;
  }
  .nav_main .list dl dt b{
    background: url("../../../assets/img/dt_line.png") no-repeat;
    width: 100%;
    height: .02rem;
    display:block;
    position: absolute;
    bottom:0;
    left: 50%;
    margin-left: -40%;
  }
  .nav_main .list dl dd{
    background: rgba(82,133,236,0.20);
    border-radius: 4px;
    height: 3.6rem;
    width: 100%;
    position: relative;
  }
  .nav_main .list dl dd li{
    color: #fff;
    line-height: .3rem;
    padding-bottom: .2rem;
    background: url("../../../assets/img/title_line.png") no-repeat center .4rem;
    text-align: center;
    /* padding-left: .7rem; */
  }
  .nav_main .list dl dd p i{
    display: inline-block;
    width: .06rem;
    height: .06rem;
    background: #D8D8D8;
    border-radius: .06rem;
    margin-right: .1rem;
  }
  .nav_main .list dl dd .dd_bg{
    position: absolute;
    background: rgba(255,255,255,0.06);
    border-radius: 4px;
    height: 2.9rem;
    top: .2rem;
    width: 100%;
    padding-top: .3rem;
  }
  .nav_main .list dl dd .dd_bg span{
    display: block;
    font-size: .16rem;
    text-align: left;
    padding-left: .6rem;
    height:.3rem;
    line-height: .3rem;
  }
  .nav_main .list dl dd .dd_bg .notclick {
    color:rgba(255,255,255,0.5);
    cursor: not-allowed
  }
  .date_box{
    color: #fff;
    position: absolute;
    right: 0;
  }
  .date_box #time{
    font-size: .42rem;
  }
  .date_box #dayTime{
    font-size: .16rem;
  }

</style>
