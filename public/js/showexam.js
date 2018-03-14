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
		console.log(pVue.exam);
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
					exam: {
						"_id": Mock.mock('@string(32)'),
						"title": '传输设备（多选题）',
						"question": getQuestionDocList(),
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
					}, //试卷列表					
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
				}
			}
		}
	}
	/**
	 * 获取试题题目列表
	 */
	function getQuestionDocList() {
		var qbs = getQuestionBank(),
			qdl0 = [],
			qdl1 = [],
			qdl2 = [],
			qdl3 = [];
		for(var i = 0, l = qbs.length; i < l; i++) {
			if(qbs[i].type == 0) {
				qdl0.push({
					"questionid": Mock.mock('@string(32)'),
					"question": qbs[i],
					"fraction": Mock.mock('@integer(1,2)')
				})
			}
			if(qbs[i].type == 1) {
				qdl1.push({
					"questionid": Mock.mock('@string(32)'),
					"question": qbs[i],
					"fraction": Mock.mock('@integer(1,2)')
				})
			}
			if(qbs[i].type == 2) {
				qdl2.push({
					"questionid": Mock.mock('@string(32)'),
					"question": qbs[i],
					"fraction": Mock.mock('@integer(1,2)')
				})
			}
			if(qbs[i].type == 3) {
				qdl3.push({
					"questionid": Mock.mock('@string(32)'),
					"question": qbs[i],
					"fraction": Mock.mock('@integer(1,2)')
				})
			}
		}
		return [].concat(qdl0, qdl1, qdl2, qdl3);
	}

	function getQuestionBank() {
		var len = Mock.mock('@integer(2, 50)'),
			qbs = [],
			type = '',
			ops, op;
		for(var i = 0; i < len; i++) {
			type = Mock.mock('@integer(0,3)');
			[ops, op] = getQuestionAnswer(type);
			if(type == 2) {
				op = [
					['正确', '错误'][Mock.mock('@integer(0,1)')]
				];
			}
			qbs.push({
				"_id": Mock.mock('@string(32)'),
				"type": type,
				"type_text": ['单选', '多选', '判断', '问答'][type],
				"title": Mock.mock('@ctitle(10, 30)'),
				"content": (type == 0 || type == 1) ? '' : Mock.mock('@cparagraph()'),
				"options": ops,
				"option": op.join('、'),
				"user_id": '',
				"status": ['删除', '发布', '新建'][Mock.mock('@integer(0,2)')],
				"create_at": Mock.mock('@datetime("yyyy-MM-dd HH:mm:ss")'),
				"update_at": Mock.mock('@datetime("yyyy-MM-dd HH:mm:ss")')
			});
		}
		return qbs;
	}

	function getQuestionAnswer(type) {
		var qas = [],
			qa = [],
			a = ['A', 'B', 'C', 'D', 'E', 'F'];
		if(type == 0) {
			for(var i = 0, len = 4; i < len; i++) {
				qas.push({
					'title': Mock.mock('@cparagraph()'),
					'projectnum': a[i]
				});

			}
			qa.push(a[Mock.mock('@integer(1,4)')]);
		}
		if(type == 1) {
			for(var i = 0, len = Mock.mock('@integer(5,6)'); i < len; i++) {
				qas.push({
					'title': Mock.mock('@cparagraph()'),
					'projectnum': a[i]
				});

			}
			qa.push(a[Mock.mock('@integer(1,6)')]);
			qa.push(a[Mock.mock('@integer(1,6)')]);
			qa.push(a[Mock.mock('@integer(1,6)')]);
		}
		return [qas, qa];
	}
});