<template>
	<card v-for="(exl, idx) in examinaList" :key="idx" :did="exl.id" class="exl-item" v-on:click.native.prevent="showSelectexl">
		<p slot="title" v-text="exl.title">
			<icon type="ios-film-outline"></icon>
		</p>
		<a class="exl-item-btn" href="#" title="编辑" slot="extra" :didx="idx" @click.prevent="editItem">
			<icon type="ivu-icon ivu-icon-edit"></icon>
		</a>
		<a class="exl-item-btn" href="#" title="删除" slot="extra" :didx="idx" @click.prevent="delItem">
			<icon type="ivu-icon ivu-icon-trash-a"></icon>
		</a>
		<label class="exl-item-footer">
			<span v-text="exl.create_at"></span>
		</label>
	</card>
	<Page :total="100" show-sizer></Page>
</template>