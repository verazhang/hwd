<template>
	<i-input autofocus="true" placeholder="输入关键字" v-model="keyword">
		<i-select v-model="proModel" slot="prepend" :disabled="isDocProSelected" filterable placeholder="请选择型号" @on-change="proChange">
			<i-option dis-hover v-for="(item, index) in proModels" :key="index" :value="item" v-text="item"></i-option>
		</i-select>
		<i-button @click.prevent="btnSearch" slot="append" icon="ios-search"></i-button>
		<i-button @click.prevent="btnAddDoc" slot="append" type="primary" ico="plus-round" v-if="showDocEdit">新增</i-button>
	</i-input>
</template>