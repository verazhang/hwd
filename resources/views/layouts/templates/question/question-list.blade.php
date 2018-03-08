<template>
	<card v-for="(ql, idx) in questionList" :key="idx" :did="doc._id" class="question-item" :data-pro="ql.type">
		<p slot="title" v-text="'【' + ql.type_text + '】' + ql.title">
			<icon type="ios-film-outline"></icon>
		</p>
		<a class="doc-item-btn" href="#" title="编辑" slot="extra" :didx="idx" @click.prevent="editQuestionItem">
			<icon type="ivu-icon ivu-icon-edit"></icon>
		</a>
		<a class="doc-item-btn" href="#" title="删除" slot="extra" :didx="idx" @click.prevent="delQuestionItem">
			<icon type="ivu-icon ivu-icon-trash-a"></icon>
		</a>
		<p v-if="ql.type==0 ">
			<span  v-for="(ops, i) in ql.options"  :key="i" v-text="ops.projectnum + '、' + ops.title"></span>
		</p>
		<p v-else-if="ql.type==1">
			<span  v-for="(ops, i) in ql.options"  :key="i" v-text="ops.projectnum + '、' + ops.title"></span>
		</p>
		<p v-else-if="ql.type==2"></p>
		<p v-else-if="ql.type==3" v-text="'参考答案:' + ql.content"></p>
		<label class="ql-item-footer">
			<span v-text="ql.update_at"></span>
			<span v-if="ql.type==0 || ql.type==1" v-text="'参考答案:' + ql.option"></span>
			<span v-if="ql.type==2" v-text="'参考答案:' + ql.option"></span>
		</label>
	</card>
	<Page :total="100" show-sizer></Page>
</template>