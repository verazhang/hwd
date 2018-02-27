@extends('layouts.base')
@section('css')
<link href="../js/layer/skin/layer.css" rel="stylesheet" />
<link href="../css/login.css" rel="stylesheet" />
<style>.alert-danger {
	padding: 5px;
}</style>
@endsection

@section('content')
<div class="login-back">
	<div class="loginImg"><img src="../images/logo.png" alt="LOGO" /><span>&nbsp;网页版{{$env}}</span></div>
	<span>
		<form id="formControl" method="POST" action="../login">
			<div class="loginPhone"><img src="../images/phone.png" alt="账号" /><input type="text" placeholder="请输入11位手机号" maxlength="11" onLoad="document.user.username.focus()"  onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')"  id="txtUserName" name="username" required="required"/></div>
			<div class="loginPsd"><img src="../images/psd.png" alt="密码" /><input type="password" placeholder="输入密码" id="txtPassword" name="password" required="required" /></div>
			<i class="glyphicon glyphicon-eye-close pw-eye" title="显示密码"></i>
			<span class="login-back-btn">
				<input type="hidden" name="ref" value="{{urldecode($ref)}}" />
				<button type="submit" id="btnLogin">登录</button> 
			</span>
			{{ csrf_field() }}
			<input type="hidden" name="env" value="{{$env}}" />
		</form> 
	</span>
</div>
@endsection
@section('script')
<script src="../js/jQuery/jquery-1.11.2.min.js"></script>
<script src="../js/libs/md5.js"></script>
<script src="../js/seajs-2.2.3/dist/sea.js"></script>
<script>seajs.use('../js/login.js', function(m) {
	var msg = "";
	@if($errors)
	@foreach($errors -> all() as $error)
	msg = '{{ $error }}';
	@endforeach
	@endif
	m.start(msg);
});</script>

@endsection
