<template>
	<i-input autofocus="true" placeholder="输入关键字" v-model="examinakeywords">
		<i-select v-model="examinaStatus" slot="prepend" filterable placeholder="请选择状态" @on-change="proChange">
			<i-option dis-hover v-for="(item, index) in examinaStatusList" :key="index" :value="item" v-text="item"></i-option>
		</i-select>
		<i-button @click.prevent="btnSearch" slot="append" icon="ios-search"></i-button>
		<i-button slot="append" type="primary" ico="plus-round" v-if="showDocEdit">
			新增
		</i-button>
	</i-input>
</template>