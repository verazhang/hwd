<template>
	<card v-for="(qd, idx) in questionDoc" :key="idx" :did="doc._id" class="question-item" :data-pro="qd.type">
		<p slot="title" v-text="qd.title">
			<icon type="ios-film-outline"></icon>
		</p>
		<a class="doc-item-btn" href="#" title="编辑" slot="extra" :didx="idx" @click.prevent="editQuestionItem">
			<icon type="ivu-icon ivu-icon-edit"></icon>
		</a>
		<a class="doc-item-btn" href="#" title="删除" slot="extra" :didx="idx" @click.prevent="delQuestionItem">
			<icon type="ivu-icon ivu-icon-trash-a"></icon>
		</a>
		<p>
			<span v-for="(ops, i) in qd.questiontext"  :key="i" v-text="'【'+['单选', '多选', '判断', '问答'][i]+'】' + ops.cnt + ' 分数:' + ops.fraction"></span>
		</p>
		<label class="qd-item-footer">
			<span v-text="qd.update_at"></span>
			<span v-text="qd.status"></span>
			<span v-text=" '考试日期:' + qd.examtime"></span>
			<span v-text=" '考试时长:' + qd.duration + '分钟'"></span>
		</label>
	</card>
	<Page :total="100" show-sizer></Page>
</template>