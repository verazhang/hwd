"use strict";
define(function(require, exports, module) {
	var avh, pVue, opt, itemDoc;
	exports.init = function(opts) {
		opt = opts;
		avh = (window.innerHeight) ? window.innerHeight : (document.documentElement && document.documentElement.clientHeight) ? document.documentElement.clientHeight : document.body.offsetHeight;
		avh = avh - 64 - 43;
		initVueObject();
	}

	function initVueObject() {
		var Component = Vue.extend(getVueConfig());
		pVue = new Component().$mount('.app');
		//vue加载完成后关闭提示窗口
		pVue.$nextTick(function() {
			$('.ivu-spin').hide();
		});
	}
	/**
	 * 获取初始化界面配置参数
	 */
	function getVueConfig() {
		return {
			data() {
				return {
					layoutContentHeight: avh,
					spinShow: false, //加载等待窗口
					//试题部分
					partiList: getExamPartiList(), //试卷列表					
					partiCols: [{
							title: '序号',
							type: 'index'
						},
						{
							title: '姓名',
							key: 'user_name'
						},
						{
							title: '状态',
							key: 'status'
						}, {
							title: '分数',
							key: 'fraction'
						},{
							title: '试题',
							key: 'action',
							width: 200,
							align: 'center',
							render: (h, params) => {
								return h('div', [
									h('a', {
										props: {
											did: params['row']['_id']
										},
										style: {
											marginRight: '5px'
										},
										on: {
											click: () => {
												console.log(arguments, '预览操作');
												window.open('../exam/' + Mock.mock('@natural()'))
											}
										}
									}, '预览')
								]);
							}
						}
					],
				}
			},
			methods: {
				//编辑文档
				editDocItem: function(e) {
					this.modalAdd = true;
					document.body.classList.add('noscroll');
				},
				//单位选中
				unitSelected: function(n) {
					this.unit = n[0];
					this.userList = getUnitUserList();
					//如果是用户管理就加载用户列表数据
				},
				rowClassName: function(row, index) {
					return "";
				}
			}
		}
	}
	/**
	 * 获取试卷列表
	 */
	function getExamPartiList() {
		var len = 2,
			qds = [],
			qdl = [];
		for(var i = 0; i < len; i++) {
			qds.push({
				"_id": Mock.mock('@string(32)'),
				"title": i == 0 ? '传输设备（多选题）' : '传输设备（单选题）',
				"serialnum": Mock.mock({
					'regexp': /\d{6}/
				}).regexp,
				"examtime": Mock.mock('@datetime("yyyy-MM-dd HH:mm:ss")'),
				"fraction": Mock.mock('@integer(70,150)'),
				"user_name": Mock.mock('@cname'),
				"status": ['已交卷', '考试中', '未到'][Mock.mock('@integer(0,2)')],
				"create_at": Mock.mock('@datetime("yyyy-MM-dd HH:mm:ss")'),
				"update_at": Mock.mock('@datetime("yyyy-MM-dd HH:mm:ss")')
			});
		}
		return qds;
	}
});