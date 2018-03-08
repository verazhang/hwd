<template>
	<i-input autofocus="true" placeholder="输入关键字" v-model="qkeywords">
		<i-button @click.prevent="btnQuestionSearch" slot="append" icon="ios-search"></i-button>
		<i-button slot="append" type="primary" ico="plus-round">新增</i-button>
	</i-input>
</template>