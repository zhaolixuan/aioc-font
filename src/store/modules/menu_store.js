export default {
  state: {
    navMenu: [
      {
        title: '产业电商',
        url: '',
        class: 'iconfont iconiconshuangzhaoshuangyin',
        key: 1,
        icon: 'szsy',
        visible: true,
        type: 'frame',
        url: 'https://ultrav-console.jdcloud.com/previewScreen?id=2EZDY8W12_20200110094827',
        children: [
          {
            type: 'frame',
            title: '食用菌全网电商',
            key: 1,
            url: 'https://ultrav-console.jdcloud.com/previewScreen?id=2EZDY8W12_20200110094827'
          },
          {
            type: 'frame',
            key: 1,
            title: '全网实时电商',
            url: 'https://ultrav-console.jdcloud.com/previewScreen?id=2EEDRZV85_20190614205736'
          },
          {
            type: 'frame',
            key: 1,
            title: '全网零售大数据',
            alias: '邹城市全网零售大数据',
            // url: 'https://ultrav-console.jdcloud.com/previewScreen?id=2EV5RWG7A_20191210094420'
            url: 'https://ultrav-console.jdcloud.com/previewScreen?id=2EYXWD5N7_20200110094722'
          },
          {
            type: 'frame',
            key: 1,
            title: '邹城市网络零售',
            alias: '邹城市网络零售详细分析',
            // url: 'https://ultrav-console.jdcloud.com/previewScreen?id=2EX7DY3H6_20191210101330'
            url: 'https://ultrav-console.jdcloud.com/previewScreen?id=2EXYGA51S_20200110095526'
          }
        ]
      },
      {
        title: '招商引资',
        key: 2,
        class: 'iconfont iconiconxiangcunzhenxing ',
        icon:'xczx',
        visible: true,
        type: 'frame',
        url: 'https://ultrav-console.jdcloud.com/previewScreen?id=2F3RK2UHA_20200228125948',
        children: [
          {
            type: 'frame',
            key: 2,
            title: '招商态势监测',
            url: 'https://ultrav-console.jdcloud.com/previewScreen?id=2F3RK2UHA_20200228125948'
          },
          {
            type: 'frame',
            key: 2,
            title: '招商项目选址',
            url: 'static/html/site.html'
          },
          {
            key: 2,
            title: '重大项目',
            url: 'bigProject'
          }
        ]
      },
      {
        title: '城市云脑',
        icon: 'xczx',
        url: '/',
        visible: false
      },
      {
        title: '产业链招商',
        key: 3,
        url: '',
        class: 'iconfont iconiconwenhuajiaoyu',
        icon:'whjy',
        visible: true,
        url: 'industries/industriesTabs',
        children: [
          {
            title: '产业链全景',
            key: 3,
            url: 'industries/industriesTabs'
          },
          {
            title: '产业链招商',
            key: 3,
            url: 'industries/iotentialBusiness?largeName=新一代信息技术&middleName=交通信息化&smallName=公路交通信息系统&currentIndex=0&key=3'
          },
          {
            title: '以商招商',
            key: 3,
            url: 'industries/localEnterprises?largeName=新一代信息技术&middleName=人事服务&smallName=人力资源服务&currentIndex=0&key=3'
          },
          // {
          //   title: '企业画像',
          //   key: 3,
          //   url: 'industries/lotentiaPortrait?entName=广州市微柏软件股份有限公司&key=3'
          // },
          // {
          //   title: '靶向企业清单',
          //   key: 3,
          //   url: 'Industry'
          // },
          // {
          //   title: '靶向企业画像',
          //   key: 3,
          //   url: 'industryinfo'
          // }
        ]
      },
      {
        title: '大数据',
        key: 4,
        url: '',
        class: 'iconfont iconiconhuanjingzhiliang',
        icon: 'hjzl',
        visible: true,
        type: 'goto',
        url: 'http://zoucheng-cloud.xjoycity.com/manager/',
        children: [
          {
            title: '大数据管理',
            key: 4,
            type: 'goto',
            url: 'http://zoucheng-cloud.xjoycity.com/manager/'
          }
        ]
      }
    ]
  }
}
