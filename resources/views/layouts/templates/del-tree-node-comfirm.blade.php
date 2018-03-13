<template>
	<modal v-model="delTreeNodeComfirm" width="360">
		<p slot="header" style="color:#f60;text-align:left">
			<icon type="information-circled"></icon>
			<span>您确定删除该节点?</span>
		</p>
		<div>
			<p>
				节点的下级节点也将被删除
			</p>
		</div>
		<div slot="footer">
			<i-button type="error" size="large" long :loading="modal_loading" @click="delTreeNode">
				删除
			</i-button>
		</div>
	</modal>
</template>