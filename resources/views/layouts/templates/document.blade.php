<template>
	<layout>
		<sider hide-trigger class="doc-nav-tree">
			<tree :data="item.tree" ref="tree" @on-select-change="docMenuSelect" :style="{height:layoutContentHeight-38-11-2-11+'px'}"></tree>
		</sider>
		<layout>
			<breadcrumb class="doc-breadcrumb-list" :style="{margin: '24px 0'}">
				<breadcrumb-item v-for="(bc, ind) in breadcrumb" :key="ind" v-text="bc">
					<span class="ivu-breadcrumb-item-separator">/</span>
				</breadcrumb-item>
			</breadcrumb>
			<i-content class="doc-content" v-html="item.content.content || '该文档还不存在'" :style="{padding: '0 16px', minHeight: '280px'}"></i-content>
		</layout>
	</layout>
</template>