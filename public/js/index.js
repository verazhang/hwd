"use strict";
define(function(require, exports, module) {
	var avh, pVue, opt, itemDoc, proList;
	exports.init = function(opts) {
		opt = opts;
		avh = (window.innerHeight) ? window.innerHeight : (document.documentElement && document.documentElement.clientHeight) ? document.documentElement.clientHeight : document.body.offsetHeight;
		avh = avh - 64 - 43;
		getAjaxProListData();
	}

	function initVueObject() {
		var Component = Vue.extend(getVueConfig());
		pVue = new Component().$mount('.app');
		//pVue.proModel = pVue.proModels[parseInt(Math.random() * pVue.proModels.length) - 1];
		var um = UM.getEditor('editor', {
			//imageUrl: serverPath + "imageUp.php",
			//imagePath: serverPath,
			lang: /^zh/.test(navigator.language || navigator.browserLanguage || navigator.userLanguage) ? 'zh-cn' : 'en',
			langPath: UMEDITOR_CONFIG.UMEDITOR_HOME_URL + "lang/",
			autoHeightEnabled: true,
			initialFrameHeight: 240
		});
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
					modal_loading: false,
					delDocComfirm: false, //删除文档操作
					delTreeNodeComfirm: false, //删除文档树节点
					modalAdd: false,
					showDocEdit: false, //是否显示编辑操作
					spinShow: false, //加载等待窗口
					isDocProSelected: false, //文档查询下拉框是否可选
					activeMenu: '3', //左侧菜单树选中主节点
					menuID: '', //左侧导航树节点ID
					newTreeNodeTitle: '', //新增节点标题
					addNewTreeNodeTitle: false, //增加节点窗口控制显示
					addParentNode: null, //添加节点原父节点
					delParentNode: null, //删除节点参数信息
					docSpinShow: false, //文档加载提示信息
					item: itemDoc,
					//查询部分
					keyword: '',
					proModel: 'CE12812',
					proModels: proList,
					docList: [],
					breadcrumb: [], //文档树节点
					//单位管理
					unitTree: getUnitTree(), //单位树
					userCols: [{
							title: '姓名',
							key: 'username'
						},
						{
							title: '身份',
							key: 'type'
						},
						{
							title: '状态',
							key: 'status'
						}, {
							title: '更新时间',
							key: 'update_at'
						}, {
							title: '操作',
							key: 'action',
							align: 'center',
							width: 200,
							render: (h, params) => {
								return h('div', [
									h('Button', {
										props: {
											type: 'primary',
											size: 'small'
										},
										style: {
											marginRight: '5px'
										},
										on: {
											click: () => {
												this.modalUserAdd = true;
												this.user['username'] = params['row']['username'];
												this.user['_id'] = params['row']['_id'];
												this.user['type'] = params['row']['type'];
												//修改密码就直接将密码置为空
												this.user['passwd'] = '';
												this.user['pw'] = params['row']['passwd'];
											}
										}
									}, '编辑'),
									h('Button', {
										props: {
											type: 'error',
											size: 'small'
										},
										style: {
											marginRight: '5px'
										},
										on: {
											click: () => {
												this.$Modal.confirm({
													title: '删除确认',
													content: '<p>您确定删除用户"' + params['row']['username'] + '"?</p>',
													onOk: () => {
														this.removeUser(params['row']['_id'])
													},
													onCancel: () => {}
												});
											}
										}
									}, '删除'),
									h('Button', {
										props: {
											type: 'primary',
											size: 'small'
										},
										on: {
											click: () => {

											}
										}
									}, '重置密码')
								]);
							}
						}
					],
					userList: getUnitUserList(), //单位对应的用户
					unitbreadcrumb: [], //单位面包屑
					unit: {}, //选中的单位信息
					modalUserAdd: false, //是否显示编辑用户信息窗口
					userType: ['老师', '一般用户'], //用户类型
					user: {
						type: '一般用户'
					}, //用户信息
					showUnitEdit: false,
					//试题部分
					qtype: '', //选中题型
					qtypes: ['单选题', '多选题', '判断题', '简答题'], //题型
					qkeywords: '', //题库管理关键字
					questionList: getQuestionBank(), //题库资料
					modalQuestionAdd: false,
					newQuestionList: {
						ques1: {
							title: '',
							options: []
						},
						ques2: {
							title: '',
							options: []
						},
						ques3: {
							title: '',
							options: []
						},
						ques4: {
							title: '',
							content: ''
						}
					}, //新增题目
					newQuestionOption: '', //选项内容
					ques1Option:'',//单选题选中题目
					ques2Option:[],//多选题选中
					meExaminationStartDate: '', //考试开始时间
					meExaminationEndDate: '', //考试结束时间
					//meExaminationList: getMeExaminationList(), //我的试卷列表
					examinaStatus: '考试中', //考试状态选择
					examinaStatusList: ['未开始', '考试中', '已结束'], //考试状态列表
					examinakeywords: '', //考试管理关键词
					examinaList: getMeExaminationList(), //考试管理试卷
					examCollapseValue: ['1', '2', '3'], //试卷管理展示
					examList: getQuestionDoc(), //试卷列表					
					examCols: [{
							title: '试卷编号',
							key: 'serialnum'
						},
						{
							title: '试卷名称',
							key: 'title',
							ellipsis: true,
							width: 150
						},
						{
							title: '总分',
							key: 'fraction'
						}, {
							title: '题数',
							key: 'question',
							render: (h, params) => {
								return h('span', {}, params['row']['question'].length);
							}
						}, {
							title: '时限',
							key: 'duration'
						}, {
							title: '查阅',
							key: 'viewcnt'
						}, {
							title: '测试',
							key: 'testcnt'
						}, {
							title: '出卷时间',
							key: 'create_at',
							width: 150
						}, {
							title: '录入者',
							key: 'user_name'
						}, {
							title: '操作',
							key: 'action',
							width: 150,
							align: 'center',
							render: (h, params) => {
								return h('div', [
									h('Button', {
										props: {
											type: 'primary',
											size: 'small'
										},
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
									}, '查看'),
									h('Button', {
										props: {
											type: 'error',
											size: 'small'
										},
										on: {
											click: () => {
												this.$Modal.info({
													title: "提示信息",
													content: "功能完善中"
												});
											}
										}
									}, '测试')
								]);
							}
						}
					],
				}
			},
			methods: {
				proChange: function(e) {
					this.proModel.length > 0 ? (this.keyword = '') : '';
					this.breadcrumb = [];
					this.breadcrumb.push(DocTree.pro);
				},
				//添加文档
				btnAddDoc: function(e) {
					this.modalAdd = true;
					document.body.classList.add('noscroll');
				},
				//题库类型选中切换
				questionChange: function(e) {
					this.qtype.length > 0 ? (this.qtypes = '') : '';
				},
				//文档选中按钮点击事件
				btnSearch: function() {
					this.keyword.trim().length > 0 ? this.docList = getDocListTestData() : '';
				},
				//编辑文档
				editDocItem: function(e) {
					this.modalAdd = true;
					document.body.classList.add('noscroll');
				},
				//删除文档操作提示
				delDocItem: function(e) {
					this.delDocComfirm = true;
				},
				//删除文档操作
				delDoc: function() {
					this.modal_loading = true;
					setTimeout(() => {
						this.modal_loading = false;
						this.delDocComfirm = false;
						this.$Message.success('删除成功');
					}, 2000);
				},
				//菜单操作
				menuActive: function(menuID) {
					this.spinShow = true;
					this.menuID = menuID;
					var ms = menuID.split('-');
					menuID == '1-2' ? this.showDocEdit = true : this.showDocEdit = false;
					menuID == '3-1' ? this.showUnitEdit = true : this.showUnitEdit = false;
					menuID == '2-3' ? (this.examTableCols(), this.examTableData()) : '';
					menuID == '2-4' ? (this.meExamTableCols(), this.meExamTableData()) : '';
					this.activeMenu = ms[0];
					this.$nextTick(function() {
						this.spinShow = false;
					});
				},
				editUser: function() {
					this.modalUserAdd = true;
					//将原用户信息置空
					this.user['username'] = '';
					this.user['_id'] = '';
					this.user['type'] = '';
					this.user['passwd'] = '';
					this.user['pw'] = '';
				},
				//添加/修改用户窗口点击确定按钮
				modelUserAddOK: function() {
					//提交的时候需要将用户密码进行md5加密
					this.user.pw = hex_md5(this.user.passwd);
					//如果存在_id值，就是更新用户信息，否则为添加用户信息
					//更新用户信息的话需要修改原数据列表信息
					//重置密码也是修改用户信息，直接生成一个简单的随机密码即可，然后提交显示给用户
					this.user._id ? ajaxEditUser(this.user) : ajaxAddUser(this.user);
				},
				//添加/修改用户窗口点击取消按钮
				modelUserAddCancel: function() {

				},
				//添加/修改单位
				btnAddUnit: function() {

				},
				examTableCols: function() {
					this.examCols = [{
							title: '考试编号',
							key: 'examnum'
						}, {
							title: '试卷编号',
							key: 'serialnum'
						},
						{
							title: '试卷名称',
							key: 'title',
							ellipsis: true,
							width: 150
						},
						{
							title: '总分',
							key: 'fraction'
						}, {
							title: '题数',
							key: 'question',
							render: (h, params) => {
								return h('span', {}, params['row']['question'].length);
							}
						}, {
							title: '时限',
							key: 'duration'
						}, {
							title: '开始时间',
							key: 'create_at',
							width: 150
						}, {
							title: '录入者',
							key: 'user_name'
						}, {
							title: '考试状态',
							key: 'status'
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
												window.open('../examparti/' + Mock.mock('@natural()'))
											}
										}
									}, '参考人员')
								]);
							}
						}
					];
				},
				examTableData: function() {
					this.examList = getQuestionDoc();
				},
				meExamTableCols: function() {
					this.examCols = [{
							title: '考试编号',
							key: 'examnum'
						}, {
							title: '试卷编号',
							key: 'serialnum'
						},
						{
							title: '试卷名称',
							key: 'title',
							ellipsis: true,
							width: 150
						},
						{
							title: '总分',
							key: 'fraction'
						}, {
							title: '题数',
							key: 'question',
							render: (h, params) => {
								return h('span', {}, params['row']['question'].length);
							}
						}, {
							title: '时限',
							key: 'duration'
						}, {
							title: '开始时间',
							key: 'create_at',
							width: 150
						}, {
							title: '录入者',
							key: 'user_name'
						}, {
							title: '考试状态',
							key: 'status'
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
									}, '查看结果'),
									h('a', {
										style: {
											marginRight: '5px'
										},
										on: {
											click: () => {
												window.open('../exam/' + Mock.mock('@natural()'))
											}
										}
									}, '参与考试')
								]);
							}
						}
					];
				},
				meExamTableData: function() {
					this.examList = getQuestionDoc();
				},
				showAddQuesOptionsModel: function(dtype) {
					this.$Modal.confirm({
						render: (h) => {
							return h('Input', {
								props: {
									value: this.newQuestionOption,
									autofocus: true,
									placeholder: '请输入选项内容'
								},
								on: {
									input: (val) => {
										this.newQuestionOption = val;

									}
								}
							});
						},
						onOk: function() {
							pVue.newQuestionList[dtype].options.push({
								projectnum: ['A', 'B', 'C', 'D', 'E', 'F'][pVue.newQuestionList[dtype].options.length],
								title: pVue.newQuestionOption
							});
							pVue.newQuestionOption = '';
						}
					});
				},
				//添加题目
				addQuesOptions: function(e) {
					var tar = e.currentTarget,
						dtype = tar.getAttribute('dtype');
					this.showAddQuesOptionsModel(dtype);
				},
				//点击添加题目按钮显示添加界面
				btnQuestionAdd: function() {
					this.modalQuestionAdd = true;
				},
				//添加题目确定按钮
				modelQuestionAddOK: function() {
					var nql = this.newQuestionList,nqlopts=[];
					for(var nq in nql) {
						if(nql[nq].title) {
							nqlopts = [].slice.call(nql[nq].options,0);
							ajaxAddExam({
								type: nq.replace('ques', ''),
								title: nql[nq].title,
								content: nql[nq].content || '',
								options: nql[nq].options || '',
								'option': this[nq + 'Option']
							});
						}
					}
				},
				//添加题目取消按钮
				modelQuestionAddCancel: function() {},
				//文档菜单节点选中事件
				docMenuSelect: function(node) {
					var tr = this.$refs.tree,
						selNodes = tr.getSelectedNodes(true);
					if(selNodes.length > 0) {
						var pNodes = tr.getSelectedNodeOfParentNodes(selNodes[0]),
							str = this.getSelectedNodeParentNodesStr(pNodes);
						var bdc = this.breadcrumb.splice(0, 1);
						this.breadcrumb = bdc.concat(str);
					}
					this.docSpinShow = true;
					node && node[0] && node[0].targetid && getAjaxDocData(node[0].targetid);
				},
				//获取文档节点选中后节点列表标题数组
				getSelectedNodeParentNodesStr: function(nodes) {
					var str = [];
					nodes.forEach(function(el) {
						str.push(el.node.title);
					});
					return str;
				},
				//显示文档内容
				showSelectDoc: function(e) {
					var tar = e.currentTarget,
						pro = tar.getAttribute('data-pro');
					this.proModel = pro;
					//弹出新窗口显示详细信息
					window.open('../doc/' + tar.getAttribute('did'));
				},
				//单位选中
				unitSelected: function(n) {
					this.unit = n[0];
					this.user['unit'] = this.unit;
					this.userList = getUnitUserList();
					//如果是用户管理就加载用户列表数据
				},
				//删除用户操作
				removeUser: function($_id) {
					ajaxDelUser($_id);
				},
				rowClassName: function(row, index) {
					/*if(row['status'] =='考试中'){
						return 'exam-list-row-working';
					}
					if(row['status'] =='未考试'){
						return 'exam-list-row-begun';
					}
					if(row['status'] =='考试结束'){
						return 'exam-list-row-finish';
					}
					if(row['status'] =='作废'){
						return 'exam-list-row-cancellation';
					}*/
					return "";
				},
				//编辑文档导航树节点
				renderDocTree: function(h, {
					root,
					node,
					data
				}) {
					return h('span', {
						style: {
							display: 'inline-block',
							width: '100%'
						}
					}, [
						h('span', [
							h('Icon', {
								props: {
									type: 'ios-paper-outline'
								},
								style: {
									marginRight: '8px'
								}
							}),
							h('span', data.title)
						]),
						h('span', {
							style: {
								display: 'inline-block',
								float: 'right',
								marginRight: '32px'
							}
						}, [
							h('Button', {
								props: Object.assign({}, this.buttonProps, {
									icon: 'ios-plus-empty'
								}),
								style: {
									marginRight: '8px'
								},
								on: {
									click: function(e) {
										pVue.addParentNode = data;
										pVue.addNewTreeNodeTitle = true;
										pVue.$Modal.confirm({
											title: '添加节点名称',
											render: (h) => {
												return h('Input', {
													props: {
														value: pVue.newTreeNodeTitle,
														autofocus: true,
														placeholder: '请输入节点名称...'
													},
													on: {
														input: function(e) {
															pVue.newTreeNodeTitle = e;
														}
													}
												})
											},
											onOk: function() {
												if(pVue.newTreeNodeTitle) {
													pVue.appendNode(pVue.addParentNode);
												}
											}
										})
									}
								}
							}),
							h('Button', {
								props: Object.assign({}, this.buttonProps, {
									icon: 'ios-minus-empty'
								}),
								on: {
									click: function() {
										pVue.delTreeNodeComfirm = true;
										pVue.delParentNode = [root, node, data];
									}
								}
							})
						])
					]);
				},
				appendNode: function(data) {
					const children = data.children || [];
					children.push({
						title: this.newTreeNodeTitle,
						expand: true
					});
					this.$set(data, 'children', children);
				},
				removeNode: function(root, node, data) {
					const parentKey = root.find(el => el === node).parent;
					if(parentKey) {
						const parent = root.find(el => el.nodeKey === parentKey).node;
						const index = parent.children.indexOf(data);
						parent.children.splice(index, 1);
					} else {
						const index = root.findIndex(el => el.nodeKey === node.nodeKey);
						root.splice(index, 1);
						pVue.item.tree = root;
					}
					this.$nextTick(function() {
						pVue.delTreeNodeComfirm = false;
					});
				},
				delTreeNode: function() {
					var root, node, data;
					pVue.delParentNode && pVue.delParentNode.length > 0 ? ([root, node, data] = pVue.delParentNode, this.removeNode(root, node, data)) : ''
				}
			},
			mounted() {
				this.menuActive("1-1");
			}
		}

	}
	/**
	 * 获取查询结果数据列表
	 */
	function getDocListTestData() {
		var len = Math.random() * 30,
			arr = [],
			plen = proList.length;
		for(var i = 0; i < len; i++) {
			arr.push({
				id: Mock.mock('@id()'),
				title: Mock.mock('@title'),
				desc: Mock.mock('@cparagraph'),
				pro: proList[parseInt(Math.random() * (plen - 1))],
				date: Mock.mock('@datetime("yyyy-MM-dd HH:mm:ss")')
			});
		}
		return arr;
	}
	/**
	 * 构建单位树
	 */
	function getUnitTree() {
		return [{
			"_id": Mock.mock('@string(32)'),
			"title": "湖北省公司",
			"unitid": Mock.mock('@string(32)'),
			"expand": true,
			"children": [{
					"_id": Mock.mock('@string(32)'),
					"title": "武汉市分公司",
					"unitid": Mock.mock('@string(32)'),
					"children": []
				},
				{
					"_id": Mock.mock('@string(32)'),
					"title": "孝感分公司",
					"unitid": Mock.mock('@string(32)'),
					"children": []
				},
				{
					"_id": Mock.mock('@string(32)'),
					"title": "随州分公司",
					"unitid": Mock.mock('@string(32)'),
					"children": []
				}
			]
		}, {
			"_id": Mock.mock('@string(32)'),
			"title": "北京公司",
			"unitid": Mock.mock('@string(32)'),
			"expand": true,
			"children": [{
					"_id": Mock.mock('@string(32)'),
					"title": "朝阳区分公司",
					"unitid": Mock.mock('@string(32)'),
					"children": []
				},
				{
					"_id": Mock.mock('@string(32)'),
					"title": "西城区分公司",
					"unitid": Mock.mock('@string(32)'),
					"children": []
				},
				{
					"_id": Mock.mock('@string(32)'),
					"title": "东城区分公司",
					"unitid": Mock.mock('@string(32)'),
					"children": []
				},
				{
					"_id": Mock.mock('@string(32)'),
					"title": "海淀区分公司",
					"unitid": Mock.mock('@string(32)'),
					"children": []
				}
			]
		}];

	}

	function getUnitUserList() {
		var len = Mock.mock('@integer(2, 10)'),
			userList = [];
		for(var i = 0; i < len; i++) {
			userList.push({
				"_id": Mock.mock('@string(32)'),
				"username": Mock.mock('@cname'),
				"unitid": '',
				"type": ['老师', '一般用户'][Mock.mock('@integer(0,1)')],
				"iadmin": ['是', '否'][Mock.mock('@integer(0,1)')],
				"status": ['正常', '注销'][Mock.mock('@integer(0,1)')],
				"create_at": Mock.mock('@datetime("yyyy-MM-dd HH:mm:ss")'),
				"update_at": Mock.mock('@datetime("yyyy-MM-dd HH:mm:ss")')
			});
		}
		return userList;
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

	/**
	 * 获取我的试卷列表
	 */
	function getMeExaminationList() {
		var len = Mock.mock('@integer(1, 50)'),
			examinaList = [];
		for(var i = 0; i < len; i++) {
			examinaList.push({
				"_id": Mock.mock('@string(32)'),
				"examinationid": Mock.mock('@cname'),
				"user_id": '',
				"title": Mock.mock('@ctitle(3, 15)'),
				"fraction": Mock.mock('@integer(0, 100)'),
				"start_time": Mock.mock('@datetime("yyyy-MM-dd HH:mm:ss")'),
				"end_time": Mock.mock('@datetime("yyyy-MM-dd HH:mm:ss")'),
				"consum": Mock.mock('@integer(1, 50)'),
				"create_at": Mock.mock('@datetime("yyyy-MM-dd HH:mm:ss")'),
				"update_at": Mock.mock('@datetime("yyyy-MM-dd HH:mm:ss")')
			});
		}
		return examinaList;
	}
	/**
	 * 获取异步数据接口
	 */
	function getAjaxDocsTreeData(callback) {
		opt.model._ajaxGetDataInterFace({
			inter: 'data/tree.json',
			method: 'GET'
		}, function(result) {
			//console.log('返回结果',result);
			if(result) {
				itemDoc = { //添加编辑对象
					ispublish: false, //编辑是否发布
					title: result.pro, //编辑标题
					proModel: result.pro,
					tree: result.navtree, //导航树
					content: {} //内容
				}
			}
			callback && callback.call();
		});
	}
	/**
	 * 获取异步数据接口
	 */
	function getAjaxDocData(tarid) {
		if(itemDoc && itemDoc['cacheDocs'] && itemDoc['cacheDocs'][tarid]) {
			pVue.item.content = itemDoc['cacheDocs'][tarid];
			pVue.$nextTick(function() {
				pVue.docSpinShow = false;
			});
		} else {
			opt.model._ajaxGetDataInterFace({
				inter: 'document/content/' + tarid,
				method: 'GET'
			}, function(result) {
				if(result && result.success == 1 && result.data) {
					itemDoc['cacheDocs'] ? '' : itemDoc['cacheDocs'] = {};
					itemDoc['cacheDocs'][tarid] = result.data;
					result.data['content'] ? pVue.item.content = result.data : pVue.item.content = {};
				}
				pVue.$nextTick(function() {
					pVue.docSpinShow = false;
				});
			});
		}
	}
	/**
	 * 异步获取产品型号列表
	 */
	function getAjaxProListData() {
		opt.model._ajaxGetDataInterFace({
			inter: 'document/type',
			method: 'GET'
		}, function(result) {
			console.log('返回结果', result);
			if(result) {
				proList = result.data;
			}
			getAjaxDocsTreeData(initVueObject)
		});
	}
	/**
	 * 添加用户
	 */
	function ajaxAddUser($user) {
		opt.model._ajaxGetDataInterFace({
			inter: 'user/add',
			method: 'POST',
			unitid: $user['unit']['_id'],
			username: $user['username'],
			type: $user['type'],
			isadmin: '0',
			'password': $user['pw']
		}, function(result) {
			if(result && result.success == 1) {
				pVue.$Message.success('添加成功');
			} else {
				pVue.$Message.warning('添加失败');
			}
		});
	}
	/**
	 * 编辑用户
	 */
	function ajaxEditUser($user) {
		opt.model._ajaxGetDataInterFace({
			inter: 'user/edit/' + $user['_id'],
			method: 'POST',
			unitid: $user['unit']['_id'],
			username: $user['username'],
			type: $user['type'],
			isadmin: '0',
			'password': $user['pw']
		}, function(result) {
			if(result && result.success == 1) {
				pVue.$Message.success('修改成功');
			} else {
				pVue.$Message.warning('修改失败');
			}
		});
	}
	/**
	 * 删除用户
	 */
	function ajaxDelUser($_id) {
		opt.model._ajaxGetDataInterFace({
			inter: 'user/delete/' + $_id,
			method: 'POST'
		}, function(result) {
			if(result && result.success == 1) {
				pVue.$Message.success('删除成功');
			} else {
				pVue.$Message.warning('删除失败');
			}
		});
	}
	/**
	 * 添加题目
	 */
	function ajaxAddExam($data) {
		opt.model._ajaxGetDataInterFace({
			inter: 'examcontent/add',
			method: 'POST',
			type: $data['type'],
			title: $data['title'],
			content: $data['content'],
			options: $data['options'],
			'option': $data['option']
		}, function(result) {
			if(result && result.success == 1) {
				pVue.$Message.success('添加成功');
			} else {
				pVue.$Message.warning('添加失败');
			}
		});
	}
	/**
	 * 获取试卷列表
	 */
	function getQuestionDoc() {
		var len = 2,
			qds = [],
			k = 0,
			qdl = [];
		for(var i = 0; i < len; i++) {
			qdl = getQuestionDocList();
			k = Mock.mock('@integer(0,3)');
			qds.push({
				"_id": Mock.mock('@string(32)'),
				"title": i % 2 == 0 ? '传输设备（多选题）' : '传输设备（单选题）',
				"question": qdl,
				"questiontext": analyQuestionDoc(qdl),
				"examnum": Mock.mock('@integer(2, 20)'),
				"serialnum": Mock.mock({
					'regexp|3': /\d{2}/
				}).regexp,
				"examtime": Mock.mock('@datetime("yyyy-MM-dd HH:mm:ss")'),
				"fraction": Mock.mock('@integer(70,150)'),
				"testcnt": Mock.mock('@integer(1,10000)'),
				"viewcnt": Mock.mock('@integer(1,10000)'),
				"delay": '0',
				"duration": Mock.mock('@integer(30,120)'),
				"user_id": '',
				"user_name": Mock.mock('@cname'),
				"status": ['未考试', '考试中', '考试结束', '作废'][k],
				"cellClassName": {
					status: 'exam-list-row-' + ['begun', 'working', 'finish', 'cancellation'][k]
				},
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