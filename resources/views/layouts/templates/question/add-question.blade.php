<template>
	<modal class="model-question-add" v-model="modalQuestionAdd" :title="'新增题目'" closable="false" @on-ok="modelQuestionAddOK" ok-text="保存全部" @on-cancel="modelQuestionAddCancel">
		<tabs value="ques1">
			<tab-pane label="单选题" name="ques1">
				<i-form :label-width="80">
					<form-item label="题目">
						<i-input v-model="newQuestionList.ques1.title" placeholder="题目内容"></i-input>
						<i-button v-if="newQuestionList.ques1.options.length<4" type="default" dtype="ques1" @click="addQuesOptions">
							增加选项
						</i-button>
					</form-item>
					<radio-group vertical v-model="ques1Option">
						<radio v-for="(pcn, i) in newQuestionList.ques1.options" :label="pcn.projectnum">
							<span v-text="pcn.projectnum + '、' + pcn.title"></span>
						</radio>
					</radio-group>
				</i-form>
			</tab-pane>
			<tab-pane label="多选题" name="ques2">
				<i-form :label-width="80">
					<form-item label="题目">
						<i-input v-model="newQuestionList.ques2.title" placeholder="题目内容"></i-input>
						<i-button v-if="newQuestionList.ques2.options.length<6" type="default" dtype="ques2" @click="addQuesOptions">
							增加选项
						</i-button>
					</form-item>
					<checkbox-group v-model="ques2Option">
						<checkbox v-for="(pcn, i) in newQuestionList.ques2.options" :label="pcn.projectnum">
							<span v-text="pcn.projectnum + '、' + pcn.title"></span>
						</checkbox>
					</checkbox-group>
				</i-form>
			</tab-pane>
			<tab-pane label="判断题" name="ques3">
				<i-form :label-width="80">
					<form-item label="题目">
						<i-input v-model="newQuestionList.ques3.title" placeholder="题目内容"></i-input>
					</form-item>
					<radio-group>
						<radio label="对"></radio>
						<radio label="错"></radio>
					</radio-group>
				</i-form>
			</tab-pane>
			<tab-pane label="简答题" name="ques4">
				<i-form :label-width="80">
					<form-item label="题目">
						<i-input v-model="newQuestionList.ques4.title" placeholder="题目内容"></i-input>
					</form-item>
					<form-item label="参考答案">
						<i-input type="textarea" v-model="newQuestionList.ques4.content" placeholder="参考答案"></i-input>
					</form-item>
				</i-form>
			</tab-pane>
		</tabs>
	</modal>
</template>