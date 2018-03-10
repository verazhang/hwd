<template>
	<row>
		<i-col span="11">
			<date-picker type="datetime" placeholder="Select date" v-model="meExaminationStartDate"></date-picker>
		</i-col>
		<i-col span="2" style="text-align: center">
			-
		</i-col>
		<i-col span="11">
			<time-picker type="datetime" placeholder="Select time" v-model="meExaminationEndDate"></time-picker>
		</i-col>
		<i-button @click.prevent="btnQuestionSearch" slot="append" icon="ios-search"></i-button>
	</row>
</template>