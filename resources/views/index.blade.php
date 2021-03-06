@extends('layouts.base')

@section('css')
<link rel="stylesheet" type="text/css"  href="./js/umeditor/themes/default/css/umeditor.css" />
<link rel="stylesheet" type="text/css" href="./css/index.css" />
<link rel="stylesheet" type="text/css" href="./css/commonltr.css" />
@endsection
@section('content')
<section class="app">
	<layout>
		<i-header>
			<i-menu mode="horizontal" theme="light" active-name="1">
				<div class="layout-logo">
					{{env('SYSTEM_NAME')}}
				</div>
				<div class="layout-nav">
					<breadcrumb>
						<breadcrumb-item to="/">
							<icon type="ios-home-outline"></icon>
							某某单位
						</breadcrumb-item>
						<breadcrumb-item to="/">
							<icon type="social-buffer-outline"></icon>
							张三
						</breadcrumb-item>
						<breadcrumb-item to="/">
							<icon type="log-out"></icon>
							退出
						</breadcrumb-item>
					</breadcrumb>
				</div>
			</i-menu>
		</i-header>
		<layout :style="{height:layoutContentHeight+'px'}">
			<sider>
				@include('layouts.templates.nav-menu')
			</sider>
			<i-content v-if="activeMenu=='1'">
				<section :class="['model-search',docList.length>0?'has-result':'']">
					@include('layouts.templates.search')
					<section class="result-list" v-if="docList.length>0" :style="{height:layoutContentHeight-38-16-2+'px'}">
						@include('layouts.templates.card-doc')
					</section>
					<section class="result-doc" v-if="docList.length == 0 && proModel.length>0">
						@include('layouts.templates.document')
					</section>
				</section>
				@include('layouts.templates.del-doc-comfirm')
				@include('layouts.templates.edit')
				@include('layouts.templates.del-tree-node-comfirm')
			</i-content>
			<i-content v-else-if="activeMenu=='2'">
				<section v-if="menuID=='2-1'" class="model-question-bank">
					@include('layouts.templates.question.question-bank-search')
					@include('layouts.templates.question.question-list')
					@include('layouts.templates.question.add-question')
				</section>
				<section v-else-if="menuID=='2-2'" class="model-question">
					@include('layouts.templates.question.exam-nav')
				</section>
				<section v-else-if="menuID=='2-3'" class="model-examination">
					<row style="margin-top: 22px;margin-bottom: 22px;">
						<i-col span="18">
							<h4>考试列表 </h4>
						</i-col>
						<i-col span="6" style="text-align: right;">
							<i-button>
								新增
							</i-button>
						</i-col>
					</row>
					@include('layouts.templates.question.exam-list')
					<!--<Page :total="100" show-sizer></Page>-->
				</section>
				<section v-else-if="menuID=='2-4'" class="model-me">
					<row style="margin-top: 22px;margin-bottom: 22px;">
						<i-col span="18">
							<h4>我的考试 </h4>
						</i-col>
					</row>
					@include('layouts.templates.question.exam-list')
					<!--<Page :total="100" show-sizer></Page>-->
				</section>
			</i-content>
			<i-content v-else-if="activeMenu=='3'">
				<section class="model-unit">
					<section class="model-unit-list" v-if="menuID=='3-1'" :style="{height:layoutContentHeight-38-16-2+'px'}">
						@include('layouts.templates.unit.unitTree')
					</section>
					<section class="model-user-list" v-else-if="menuID=='3-2'">
						@include('layouts.templates.unit.userList')
						@include('layouts.templates.unit.userAdd')
					</section>
				</section>
			</i-content>
		</layout>
		<i-footer class="layout-footer-center">
			2018 &copy; {{env('SYSTEM_NAME')}}
		</i-footer>
	</layout>
	<spin size="large" fix v-if="spinShow"></spin>
	<div class="ivu-spin ivu-spin-large ivu-spin-fix">
		<div class="ivu-spin-main">
			<span class="ivu-spin-dot"></span>
			<div class="ivu-spin-text"></div>
		</div>
	</div>
</section>
@endsection
@section('script')
<script src="js/seajs/sea.js"></script>
<script src="js/vue/vue.min.js"></script>
<script src="js/vue/iview.min.js"></script>
<script src="./js/jquery.min.js"></script>
<script src="./js/umeditor/umeditor.min.js"></script>
<script src="./js/umeditor/umeditor.config.js"></script>
<script src="./js/lib/md5.js"></script>
<script src="./js/mock/mock-min.js"></script>
<script>seajs.use(['./js/index.js', './js/lib/com.js'], function() {
	var args = arguments;
	args[0].init({
		model: args[1]
	});
});</script>
@endsection
