<template>
    <div class="basebox">
        <el-table class="basetable" :data="tableData" 
            v-loading="loading" element-loading-spinner="el-icon-loading" element-loading-text="加载中" element-loading-background="rgba(0, 0, 0, 0.8)"
        >
            <el-table-column v-for="(item,index) in column" :prop="item.prop||''" :label="item.label" :width="item.width||''" :key="index" >
                <template slot-scope="scope" >
                    <template v-if="item.status == 1" >
                        <a class="pointer" @click="handleClick({type:scope.row.type,tableType})">
                            <span class="text_box">
                                <span class="icon icon_health"></span>
                                <span class="first_text green_text">{{scope.row.health}}</span>
                            </span>
                            <span class="text_box">
                                <span class="icon icon_bad"></span>
                                <span class="yellow_text">{{scope.row.bad}}</span>
                            </span>
                        </a>
                    </template>
                    <template v-else-if="item.status == 2">
                        <a class="pointer text_box" @click="handleClick({type:scope.row.type,tableType})">
                        <span class="icon icon_health"></span>
                        <span class="green_text">{{scope.row[item.prop]}}</span>
                        </a>
                    </template>
                    <template v-else-if="item.status == 3">
                        <a class="pointer" @click="handleClick({type:scope.row.type,tableType})">
                        <span >{{scope.row[item.prop]}}</span>
                        <span class="blue_text">
                            <span class="iconfont iconchakanziliaoicon"></span>
                            <span>查看人员资料</span>
                        </span>
                        </a>
                    </template>
                    <template v-else-if="item.status == 4">
                        <a class="pointer" @click="handleClick({type:scope.row.type,pointx:scope.row.pointx,pointy:scope.row.pointy})">
                        <span class="first_text">{{scope.row[item.prop]}}</span>
                        <span class="iconfont icondingweiicon yellow_text"></span>
                        </a>
                    </template>
                    <template v-else-if="item.status == 5">
                        <a class="pointer" @click="handleClick({type:scope.row.type,pointx:scope.row.pointx,pointy:scope.row.pointy})">
                        <span class="first_text">{{scope.row[item.prop]}}</span>
                        <span class="iconfont icondingweiicon green_text"></span>
                        </a>
                    </template>
                    <template v-else >
                        <a class="pointer" @click="handleClick({type:scope.row.type,tableType})">{{scope.row[item.prop]}}</a>
                    </template>
                </template>
            </el-table-column>
        </el-table>
        <span class="leftline"></span>
        <span class="rightline"></span>
    </div>
</template>

<script>
/* eslint-disable */
export default {
    props:['column','tableData','tableType','loading'],
    data (){
        return {

        }
    },
    
    methods:{
        handleClick(value){
            this.$emit('handleClick',value)
        }
    },
    components:{

    }
}
</script>

<style>
.basebox{
    position: relative;
}
.leftline,.rightline{
    display: block;
    height: 100%;
    width: .02rem;
    background: url(../../assets/img/col_line.png) 100% 100% no-repeat;
    background-size: cover;
    position: absolute;
    top: 0
}
.leftline{
    left: 0;
}
.rightline{
    right: .01rem;
}
.basetable{
    border-top: .01rem solid rgba(68,169,255,0.5);
    background: rgba(0,0,0,0);
}
.basetable .el-table__header{
    border-right: .01rem solid rgba(6,42,95,0.8);
}
.basetable .el-table__header-wrapper{
    border-right: 1px solid rgba(6,42,95,0.8);
}
.basetable .el-table__header-wrapper .el-table__header th{
    background: rgba(6,42,95,0.8);
    color: #84B7DA;
    font-size: .16rem;
    font-weight: 100;
}
.basetable .el-table__body-wrapper {
    border-right: 1px solid rgba(6,42,95,0.8);
    color: #fff;
    font-size: .14rem;
    font-weight: 100;
}
.basetable .el-table__body-wrapper .el-table__body tr{
    background: rgba(6,42,95,0.8);
}
.basetable .el-table__body-wrapper .el-table__row:hover{
    background: rgba(6,42,95,0.8);
}
.basetable.el-table th, .basetable.el-table tr{
    background: rgba(0,0,0,0)
}
.basetable.el-table td, .basetable.el-table th{
    padding: 10px 0;
}
.basetable.el-table td,.basetable.el-table th.is-leaf{
    border-bottom: .01rem solid rgba(68,169,255,0.5)!important;
}
.basetable.el-table::before{
    height: 0;
}
.basetable.el-table--enable-row-hover .el-table__body tr:hover>td{
    background: rgba(6,42,95,0);
}
.basetable .iconfont{
    font-size: .16rem;
}
.basetable .icon{
    display: inline-block;
    width: .18rem;
    height: .18rem;
    margin-right: .08rem;
}
.basetable .text_box{
    float: left;
    width: 50%;
}
.basetable .text_box span{
    float: left;
    line-height: normal;
}
.basetable .blue_text{
    margin-left: .05rem;
    color: #62C5FF;
}
.basetable .green_text{
    color: #2EE867;
}
.basetable .yellow_text{
    color: #FF631B;
}
.basetable .first_text{
    margin-right: .1rem;
}
.basetable .icon_health{
    background: url(../../assets/img/icon_zhengchang.svg) 50% 100% no-repeat;
    background-size: 100%;
}
.basetable .icon_bad{
    background: url(../../assets/img/icon_guzhang.svg) 50% 100% no-repeat;
    background-size: 100%;
}
.basetable .pointer{
    cursor: pointer;
    user-select:none;
}
.basetable .el-table__empty-block{
    background: rgba(6,42,95,0.8);
}
.basetable .el-table__empty-block .el-table__empty-text{
    color: #fff;
}
</style>
