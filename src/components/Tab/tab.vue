<template>
	<div class="tab">
		<div class="title" v-if="tabList.title">
			<p>{{ tabList.title }}</p>
			<i></i>
		</div>
		<ul>
			<li :class="activeClass(index)" v-for="(item, index) of tabList.items" :key="index" @click="handleClick(item, index)"><span>{{ item.title }}</span></li>
		</ul>
	</div>
</template>

<script>
export default {
	name: '',
	props: ['tabList'],
	data() {
		return {
			currentIndex: 0

		};
	},
	methods: {
		handleClick(item, index) {
			this.$emit('onClick', item, index);
			this.currentIndex = index;
			this.$store.commit('setIndex',index);

		}
	},
	computed: {
		activeClass() {
			return function(index) {
				if (this.currentIndex === index) {
					return 'item-active';
				}
				return 'item';
			};
		}
	}
};
</script>

<style scoped="scoped">
.tab {
	width: 2rem;
	font-size: 0.18rem;
	/* background: #1f278a; */
  background:rgba(11, 65, 131, 0.3) ;
  height: 100%;
}
.tab .title {
	height: 0.85rem;
	line-height: 0.85rem;
	text-align: center;
	color: #87bdff;
}
.tab .title p {
	height: 0.83rem;
	font-size: .24rem;
}
.tab .title i {
	display: block;
	height: 0.02rem;
	background: url('../../assets/img/tabImg/line.png');
	background-position: center;
}
.tab ul{
  padding-top: .2rem;
}
.tab li {
	cursor: pointer;
  height: .7rem;
  line-height: .7rem;
  text-align: center;
}
.tab li span{
  display: block;
}
.tab .item {
	color: #87bdff;
}
.tab .item-active span{
	color: #ffffff;
	background: url('../../assets/img/tabImg/liActive.png') no-repeat;
  width: 1.89rem;
  height: .7rem;
	background-size:1.89rem .7rem;
  margin-left: .1rem;
}
</style>
