<template>
	<layout>
		<sider hide-trigger class="unit-nav-tree">
			<tree :data="unitTree" ref="tree" @on-select-change="unitSelected" :style="{height:layoutContentHeight-38-11-2-11+'px'}"></tree>
		</sider>
		<layout>
			<breadcrumb class="unit-breadcrumb-list" :style="{margin: '24px 0'}">
				<breadcrumb-item v-for="(bc, ind) in unitbreadcrumb" :key="ind" v-text="bc">
					<span class="ivu-breadcrumb-item-separator">/</span>
				</breadcrumb-item>
			</breadcrumb>
			<i-content class="unit-content" :style="{padding: '0 16px', minHeight: '280px'}">
				<!--
                	作者：fengzhu1131@126.com
                	时间：2018-03-07
                	描述：用户列表数据
                -->
                <i-table border :columns="userCols" :data="userList"></i-table>
			</i-content>
		</layout>
	</layout>
</template>