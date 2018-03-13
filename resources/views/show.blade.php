@extends('layouts.base')

@section('css')
<link rel="stylesheet" type="text/css"  href="../js/umeditor/themes/default/css/umeditor.css" />
<link rel="stylesheet" type="text/css" href="../css/index.css" />
<link rel="stylesheet" type="text/css" href="../css/commonltr.css" />
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
			<i-content>
				<section :class="['model-search',docList.length>0?'has-result':'']">
					@include('layouts.templates.search')
					<section class="result-doc" v-if="docList.length == 0 && proModel.length>0">
						@include('layouts.templates.document')
					</section>
				</section>
			</i-content>
		</layout>
		<i-footer class="layout-footer-center">
			2018 &copy; {{env('SYSTEM_NAME')}}
		</i-footer>
	</layout>
</section>
@endsection
@section('script')
<script src="../js/seajs/sea.js"></script>
<script src="../js/vue/vue.min.js"></script>
<script src="../js/vue/iview.min.js"></script>
<script src="../js/mock/mock-min.js"></script>
<script src="../js/tree.js"></script>
<script src="../js/docs.js"></script>
<script>
seajs.use('../js/show.js', function(model) {});
</script>
@endsection
