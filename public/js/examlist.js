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
					examList: getQuestionDoc(), //试卷列表					
					examCols: [{
							title: '试卷编号',
							key: 'serialnum'
						},
						{
							title: '试卷名称',
							key: 'title',
							ellipsis: true,
							width: 320
						},
						{
							title: '总分',
							key: 'fraction'
						}, {
							title: '题数',
							key: 'update_at'
						}, {
							title: '时限',
							key: 'duration'
						}, {
							title: '出卷时间',
							key: 'create_at'
						}, {
							title: '录入者',
							key: 'user_name'
						}, {
							title: '操作',
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
									}, '预览'),
									h('a', {
										style: {
											marginRight: '5px'
										},
										on: {
											click: () => {
												this.$Modal.info({
													title: "提示信息",
													content: "功能完善中"
												});
											}
										}
									}, '修改'), h('a', {
										style: {
											marginRight: '5px'
										},
										on: {
											click: () => {
												this.$Modal.info({
													title: "提示信息",
													content: "功能完善中"
												});
											}
										}
									}, '删除'), h('a', {
										style: {
											marginRight: '5px'
										},
										on: {
											click: () => {
												this.$Modal.info({
													title: "提示信息",
													content: "功能完善中"
												});
											}
										}
									}, '编辑考题')
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
	function getQuestionDoc() {
		var len = 2,
			qds = [],
			qdl = [];
		for(var i = 0; i < len; i++) {
			qdl = getQuestionDocList();
			qds.push({
				"_id": Mock.mock('@string(32)'),
				"title": i == 0 ? '传输设备（多选题）' : '传输设备（单选题）',
				"question": qdl,
				"questiontext": analyQuestionDoc(qdl),
				"serialnum": Mock.mock({
					'regexp': /\d{6}/
				}).regexp,
				"examtime": Mock.mock('@datetime("yyyy-MM-dd HH:mm:ss")'),
				"fraction": Mock.mock('@integer(70,150)'),
				"testcnt": Mock.mock('@integer(1,10000)'),
				"viewcnt": Mock.mock('@integer(1,10000)'),
				"delay": '0',
				"duration": Mock.mock('@integer(30,120)'),
				"user_id": '',
				"user_name": Mock.mock('@cname'),
				"status": ['未考试', '考试中', '考试结束', '作废'][Mock.mock('@integer(0,3)')],
				"create_at": Mock.mock('@datetime("yyyy-MM-dd HH:mm:ss")'),
				"update_at": Mock.mock('@datetime("yyyy-MM-dd HH:mm:ss")')
			});
		}
		return qds;
	}
	/**
	 * 获取试题题目列表
	 */
	function getQuestionDocList() {
		var type = Mock.mock('@integer(0,3)'),
			qdl = [];
		for(var i = 0, l = 15; i < l; i++) {
			qdl.push({
				"questionid": Mock.mock('@string(32)'),
				"fraction": Mock.mock('@integer(1,2)'),
				"type": 2
			});
		}
		for(var i = 0, l = 20; i < l; i++) {
			qdl.push({
				"questionid": Mock.mock('@string(32)'),
				"fraction": Mock.mock('@integer(1,2)'),
				"type": 0
			});
		}
		for(var i = 0, l = 10; i < l; i++) {
			qdl.push({
				"questionid": Mock.mock('@string(32)'),
				"fraction": Mock.mock('@integer(2,5)'),
				"type": 1
			});
		}
		for(var i = 0, l = 5; i < l; i++) {
			qdl.push({
				"questionid": Mock.mock('@string(32)'),
				"fraction": Mock.mock('@integer(5,15)'),
				"type": 3
			});
		}
		return qdl;
	}
	/**
	 * 分析试卷题目
	 */
	function analyQuestionDoc(qdl) {
		var anqdl = {
			0: {
				cnt: 0,
				fraction: 0
			},
			1: {
				cnt: 0,
				fraction: 0
			},
			2: {
				cnt: 0,
				fraction: 0
			},
			3: {
				cnt: 0,
				fraction: 0
			}
		};
		for(var i = 0, l = qdl.length; i < l; i++) {
			anqdl[qdl[i]['type']]['fraction'] += qdl[i]['fraction'];
			anqdl[qdl[i]['type']]['cnt']++;
		}
		return anqdl;
	}
});