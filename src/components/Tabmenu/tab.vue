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
	width: 2.4rem;
	font-size: 0.18rem;
	/* background: #1f278a; */
	background: linear-gradient(-240deg, rgba(50, 95, 243, 0.3), rgba(24, 46, 21, 0.3));
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
  margin-top: .1rem;
}
.tab li {
	cursor: pointer;
  padding-left:.5rem;
  height: .9rem;
  line-height: .9rem;
}
.tab li span{
  display: block;
}
.tab .item {
	color: #87bdff;
}
.tab .item-active span{
	color: #ffffff;
	background: url('../../assets/img/tabImg/itemActive.png') no-repeat 0 -.3rem;
  width: 3.67rem;
  height: 1.54rem;
	background-size:3.67rem 1.54rem;
  margin-left: -1.1rem;
  padding-left: 1.1rem;
}
</style>
