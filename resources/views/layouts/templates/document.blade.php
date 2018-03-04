<template>
	<layout>
		<sider hide-trigger class="doc-nav-tree">
			<tree :data="item.tree" :style="{height:layoutContentHeight-38-11-2-11+'px'}"></tree>
		</sider>
		<layout>
			<breadcrumb :style="{margin: '24px 0'}">
				<breadcrumb-item>
					Home
				</breadcrumb-item>
				<breadcrumb-item>
					Components
				</breadcrumb-item>
				<breadcrumb-item>
					Layout
				</breadcrumb-item>
			</breadcrumb>
			<i-content class="doc-content" v-html="item.content.content" :style="{padding: '0 11px', minHeight: '280px'}"></i-content>
		</layout>
	</layout>
</template>