<template>
	<card v-for="(met, idx) in meExaminationList" :key="idx" :did="met._id" class="met-item" v-on:click.native.prevent="showSelectmet">
		<p slot="title" v-text="met.title">
			<icon type="ios-film-outline"></icon>
		</p>
		<a class="met-item-btn" href="#" title="编辑" slot="extra" :didx="idx" @click.prevent="editItem">
			<icon type="ivu-icon ivu-icon-edit"></icon>
		</a>
		<a class="met-item-btn" href="#" title="删除" slot="extra" :didx="idx" @click.prevent="delItem">
			<icon type="ivu-icon ivu-icon-trash-a"></icon>
		</a>
		<label class="met-item-footer">
			<span v-text="met.create_at"></span>
		</label>
	</card>
	<Page :total="100" show-sizer></Page>
</template>