<template>
	<layout>
		<i-content class="exam-list-content" :style="{padding: '0 16px', minHeight: '280px'}">
			<i-table border :columns="examCols" :data="examList"></i-table>
		</i-content>
	</layout>
</template>