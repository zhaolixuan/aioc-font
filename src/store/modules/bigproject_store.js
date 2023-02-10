/* eslint-disable */
export default {
    state:{
        companyListData:[],
        rateData:[],
        scrollData:[],
        listData:[],
        subStages:[],
        projectNumber:0,
        warningNumber:0,

        geoCoordMap:{},
        size:0,
        pointData:[],

        checkedProjectId: 0,

        //地图标注用色
        legendColor: ['#FC9E50','#FFC26D','#03F1C3','#FFF3A3','#ADFBFF','#ADFBFD','#ADFBFB'],
        //地图JSON
        newGeoJson: {
            "type": "FeatureCollection", 
            "features": [{
                "type":"Feature",
                "properties":{
                    "name":"冷水江市",
                    "id":"431381"
                },
                "geometry":{
                    "type":"MultiPolygon",
                    "coordinates":[[[[116.685115,36.99168],[116.873688,36.722787],[117.216337,36.732506],[117.313498,37.081559],[116.685115,36.99168]]]]
                }
            }
        ]},
    },
    mutations:{
        setCompanyListData:function(state,value){
            state.companyListData = value
        },
        setRateData:function(state,value){
            state.rateData = value
        },
        setScrollData:function(state,value){
            state.scrollData = value
        },
        setListData:function(state,value){
            state.listData = value
        },
        setSubStages:function(state,value){
            state.subStages = value
        },
        setProjectNumber:function(state,value){
            state.projectNumber = value
        },
        setWarningNumber:function(state,value){
            state.warningNumber = value
        },
        setGeoCoordMap:function(state,value){
            state.geoCoordMap = value
        },
        setPointData:function(state,value){
            state.pointData = value
        },
        changeCheckedId:function(state,value){
            state.checkedProjectId = value
        }
    },
    
}