<template>
	<card v-for="(exaq, idx) in exam.question" :key="idx" :did="exaq._id" class="exam-item">
		<p slot="title" v-text="(idx + 1) +'、' + exaq.question.title">
			<icon type="ios-film-outline"></icon>
		</p>
		<label v-if="exaq.question.type==0">
			<radio-group>
				<radio  v-for="(pcn, i) in exaq.question.options" :label="pcn.projectnum + '、' + pcn.title"></radio>
			</radio-group> 
		</label>
		<label v-if="exaq.question.type==1">
			 <checkbox-group>
		        <checkbox v-for="(pcn, i) in exaq.question.options" :label="pcn.projectnum + '、' + pcn.title"></checkbox>
		    </checkbox-group>
		</label>
		<label v-if="exaq.question.type==2">
			<radio-group>
				<radio label="对"></radio>
				<radio label="错"></radio>
			</radio-group> 
		</label>
		<label v-if="exaq.question.type==3" v-text="exaq.question.content"></label>
	</card>
</template>