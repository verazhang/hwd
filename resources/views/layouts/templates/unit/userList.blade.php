<template>
	<layout>
		<sider hide-trigger class="unit-nav-tree">
			<tree :data="unitTree" ref="tree" @on-select-change="unitSelected" :style="{height:layoutContentHeight-38-11-2-11+'px'}"></tree>
		</sider>
		<layout>
			<i-content class="unit-content" :style="{padding: '0 16px', minHeight: '280px'}">
				<row style="text-align: right;">
					<i-col span="24" style="text-align: right;margin-bottom: 22px;">
						<i-button @click.prevent="editUser">
							新增
						</i-button>
					</i-col>
				</row>
				<i-table border :columns="userCols" :data="userList"></i-table>
			</i-content>
		</layout>
	</layout>
</template>