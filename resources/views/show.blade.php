@extends('layouts.base')

@section('css')
<link rel="stylesheet" type="text/css" href="./css/index.css" />
@endsection
@section('content')
<section class="app">
	@include('layouts.templates.document')
</section>
@endsection
@section('script')
<script src="./js/mock/mock-min.js"></script>
<script>seajs.use('./js/show.js', function(model) {});</script>
@endsection
