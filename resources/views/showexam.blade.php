@extends('layouts.base')

@section('css')
<link rel="stylesheet" type="text/css"  href="../js/umeditor/themes/default/css/umeditor.css" />
<link rel="stylesheet" type="text/css" href="../css/commonltr.css" />
<style>.app {
	padding: 0 11px;
}
.ivu-layout{
	background-color: transparent;
}
.exam-item {
	margin-bottom: 11px;
}
.ivu-layout-content{
	margin-top: 22px;
}
.ivu-radio-wrapper {
	width: 100%;
}</style>
@endsection
@section('content')
<section class="app">
	<layout :style="{height:layoutContentHeight+'px'}">
		<h3 v-text="exam.title"></h3>
		<label>试卷编号：<span v-text="exam.serialnum"></span></label>
		<label>录入者：<span v-text="exam.user_name"></span></label>
		<label>试卷总分：<span v-text="exam.fraction"></span></label>
		<label>出卷时间：<span v-text="exam.create_at"></span></label>
		<label>答题时间：<span v-text="exam.duration + '分钟'"></span></label>
		<i-content>
			@include('layouts.templates.question.exam-detail')
		</i-content>
	</layout>
</section>
@endsection
@section('script')
<script src="../js/seajs/sea.js"></script>
<script src="../js/jquery.min.js"></script>
<script src="../js/vue/vue.min.js"></script>
<script src="../js/vue/iview.min.js"></script>
<script src="../js/mock/mock-min.js"></script>
<script>seajs.use(['../js/showexam.js', '../js/lib/com.js'], function() {
	var args = arguments;
	args[0].init({
		model: args[1]
	});
});</script>
@endsection
