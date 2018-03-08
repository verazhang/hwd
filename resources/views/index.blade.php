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
						<breadcrumb-item to="/components/breadcrumb">
							<icon type="social-buffer-outline"></icon>
							张三
						</breadcrumb-item>
						<breadcrumb-item to="/components/breadcrumb">
							<icon type="pound"></icon>
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
				@include('layouts.templates.del-comfirm')
				@include('layouts.templates.edit')
			</i-content>
			<i-content v-else-if="activeMenu=='2'">
				<section v-if="menuID=='2-1'" class="model-question-bank">
					@include('layouts.templates.question.question-bank-search')
					@include('layouts.templates.question.question-list')
				</section>
				<section v-else-if="menuID=='2-2'" class="model-question">
					@include('layouts.templates.question.question-bank-search')
					@include('layouts.templates.question.question-doc')
				</section>
				<section v-else-if="menuID=='2-3'" class="model-examination">
					@include('layouts.templates.question.examination-search')
					@include('layouts.templates.question.examination')
				</section>
				<section v-else-if="menuID=='2-4'" class="model-me">
					@include('layouts.templates.question.me-examination-list')
				</section>
			</i-content>
			<i-content v-else-if="activeMenu=='3'">
				<section class="model-unit">
					<section class="model-unit-list" v-if="menuID=='3-1'" :style="{height:layoutContentHeight-38-16-2+'px'}">
						@include('layouts.templates.unit.unitTree')
					</section>
					<section class="model-user-list" v-else-if="menuID=='3-2'">
						@include('layouts.templates.unit.userList')
					</section>
				</section>
			</i-content>
		</layout>
		<i-footer class="layout-footer-center">
			2018 &copy; {{env('SYSTEM_NAME')}}
		</i-footer>
	</layout>
	</layout>
</section>
@endsection
@section('script')
<script src="./js/jquery.min.js"></script>
<script src="./js/umeditor/umeditor.min.js"></script>
<script src="./js/umeditor/umeditor.config.js"></script>
<script src="./js/mock/mock-min.js"></script>
<script src="./js/tree.js"></script>
<script src="./js/docs.js"></script>
<script>
seajs.use('./js/index.js', function(model) {});
</script>
@endsection
