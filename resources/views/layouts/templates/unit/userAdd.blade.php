<template>
	<modal class="model-user-add" v-model="modalUserAdd" :title="user.username||'新增用户'" closable="false" @on-ok="modelUserAddOK" @on-cancel="modelUserAddCancel">
		<i-form :label-width="80">
			<form-item label="用户单位">
				<i-input v-model="user.unit && user.unit.title" placeholder="用户单位" disabled="true"></i-input>
			</form-item>
			<form-item label="用户姓名">
				<i-input v-model="user.username" placeholder="用户姓名"></i-input>
			</form-item>
			<form-item label="登录密码">
				<i-input type="password" v-model="user.passwd" placeholder="登录密码"></i-input>
			</form-item>
			<form-item label="用户身份">
				<i-select v-model="user.type" filterable>
					<i-option dis-hover v-for="(item, index) in userType" :key="index" :value="item" v-text="item"></i-option>
				</i-select>
			</form-item>
		</i-form>
	</modal>
</template>