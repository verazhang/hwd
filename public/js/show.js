"use strict";
define(function(require, exports, module) {
	var avh, pVue, opt, itemDoc, proList;
	
	exports.init = function(opts) {
		opt = opts;
		avh = (window.innerHeight) ? window.innerHeight : (document.documentElement && document.documentElement.clientHeight) ? document.documentElement.clientHeight : document.body.offsetHeight;
		avh = avh - 64 - 43;
		getAjaxProListData();
		getAjaxDocsTreeData(initVueObject);
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
					modal_loading: false,
					showDocEdit: false, //是否显示编辑操作
					isDocProSelected:true,//文档查询下拉框是否可选
					docSpinShow: false, //文档加载提示信息
					item: itemDoc,
					//查询部分
					keyword: '',
					proModel: 'CE12812',
					proModels: getProModelsTestData(),
					docList: [],
					breadcrumb: [], //文档树节点
				}
			},
			methods: {
				//类型选中切换事件
				proChange: function(e) {
					this.proModel.length > 0 ? (this.keyword = '') : '';
					this.breadcrumb = [];
					this.breadcrumb.push(DocTree.pro);
				},
				btnSearch: function() {
					this.keyword.trim().length > 0 ? this.docList = getDocListTestData() : '';
				},
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
					console.log('节点点击', node);
					node && node[0] && node[0].targetid && getAjaxDocData(node[0].targetid);
				},
				getSelectedNodeParentNodesStr: function(nodes) {
					var str = [];
					nodes.forEach(function(el) {
						str.push(el.node.title);
					});
					return str;
				}
			}
		}
	}
	/**
	 * 获取异步数据接口
	 */
	function getAjaxDocsTreeData(callback) {
		opt.model._ajaxGetDataInterFace({
			inter: '../js/tree.json'
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
		if(itemDoc['docs'] && itemDoc['docs'].length > 0) {
			var docs = itemDoc['docs'].filter(function(el) {
				return el._id == tarid;
			});
			docs && docs.length > 0 ? pVue.item.content = docs[0] : pVue.item.content = null;
			pVue.$nextTick(function() {
				pVue.docSpinShow = false;
			});
		} else {
			opt.model._ajaxGetDataInterFace({
				inter: '../js/docs.json'
			}, function(result) {
				console.log('返回结果', result);
				if(result) {
					itemDoc['docs'] = result;
				}
				var docs = itemDoc['docs'].filter(function(el) {
					return el._id == tarid;
				});
				docs && docs.length > 0 ? pVue.item.content = docs[0] : pVue.item.content = null;
				pVue.$nextTick(function() {
					pVue.docSpinShow = false;
				});
			});
		}
	}
	/**
	 * 异步获取产品型号列表
	 */
	function getAjaxProListData(callback) {
		opt.model._ajaxGetDataInterFace({
			inter: '../js/pro.json'
		}, function(result) {
			//console.log('返回结果',result);
			if(result) {
				proList = result;
			}
			callback && callback.call();
		});
	}
	/**
	 * 获取产品型号列表
	 */
	function getProModelsTestData() {
		var len = proList.length,
			arr = [];
		for(var i = 0; i < len; i++) {
			proList[i].family == '交换机' ? arr.push(proList[i].type) : '';
		}
		return arr;
	}
});