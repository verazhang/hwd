<template>
	<i-input autofocus="true" placeholder="输入关键字" v-model="qkeywords">
		<i-select v-model="qtypes" slot="prepend" filterable placeholder="请选择题型" @on-change="questionChange">
			<i-option dis-hover v-for="(item, index) in qtypes" :key="index" :value="item" v-text="item"></i-option>
		</i-select>
		<i-button @click.prevent="btnQuestionSearch" slot="append" icon="ios-search"></i-button>
		<i-button slot="append" type="primary" ico="plus-round">新增</i-button>
	</i-input>
</template>