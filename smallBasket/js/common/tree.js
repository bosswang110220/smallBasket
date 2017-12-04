(function($){
	
	$.fn.treeSelectList = function (label,data,click,initTree){
		var $Container = $(label);
		$(this).getTree(data,function(){
			var nodes = tree.getSelectedNodes();
			if(nodes.length>0 && $Container.length>0){
				$Container.text(nodes[0].name);
				$Container.val(nodes[0].name);
				$Container.attr("route-id",nodes[0].id);
			}
			if(initTree){
				initTree(tree);
			}
			
		},function(event,treeId,node){
			if($Container.length>0){
				$Container.text(node.name);
				$Container.val(node.name);
				$Container.attr('route-id',node.id);
			}
			$('#'+treeId).closest('.open').removeClass();
			if(click == undefined || click == null){
				
			}else{
				click(event,treeId,node);
			}
		});
	};
	
	
	
	$.fn.getTree = function(data,gettree,click){
		var $This=this;
		
		var bindTree = function(sector,data,gettree,click){
			var type = sector.attr('tree-type');
			var arg = getSetting(data,click,'data/treeRegion,json');			
			switch(type){
				case:regionChina:
				arg.url="";
			default:
					break;
			}
			loadTree(sector, arg, gettree);
		};

			var getSetting = function(data, click, url) {
			if(data == undefined || data == null) {
				data = {
					authority: true,
					url: url,
					setting: {}
				}
			}

			if(data.authority == undefined) {
				data.authority = true;
			}
			if(data.authority) {
				data.url = data.url + "?userId=" +
					$('[data-content="user"]').parent().attr('route-id');
			}

			if(data.setting == null || data.setting == undefined) {
				data.setting = {
					callback: {}
				}
			}
			if(data.setting.callback == null || data.setting.callback == undefined) {
				data.setting.callback = {};
			}
			/*if(data.setting.code != null && data.setting.code != undefined) {
				if(data.authority) {
					data.url = data.url + "&code="+data.setting.code;
					alert(data.url);
				} else {
					data.url = data.url + "?code="+data.setting.code;
				}
			}
			*/

			if(click == null || click == undefined) {

			} else {
				data.setting.callback.onClick = click;
			}

			data.setting.data = {
				simpleData: {
					enable: true,
					idKey: "id",
					pIdKey: "pId"
				}
			};
			return data;
		};
		var loadTree = function(sector, data, gettree) {
			var arg = {};
			if(data.arg) {
				arg = data.arg;
			}
			if(data.authority) {
				arg.userId = $('[data-content="user"]').parent().attr('route-id');
			}
			if(data.setting.code != null && data.setting.code != undefined) {
				arg.code = data.setting.code;

			}
			$(sector).ajaxGetJson(data.url, arg, function(result) {
				if(result.flag) {
					sector.removeClass('ztree').addClass('ztree');
					var zNodes = result.data.nodes ? result.data.nodes : [];

					if(data.defaultItem) {
						//						zNodes.push(data.defaultItem);
						zNodes.unshift(data.defaultItem);
					}

					$.each(zNodes, function(idx, node) {
						zNodes[idx].pId = node.pId ? node.pId : 0;
					});

					var obj = $.fn.zTree.init(sector, data.setting, zNodes);
					var selectNodeid = data.defaultItem ? data.defaultItem.id : result.data.selectNodeId;
					if(!selectNodeid) {
						if(zNodes) {
							if(zNodes.length > 0) {
								selectNodeid = zNodes[0].id;
							}
						}
					}
					var selNodes = obj.getNodesByParam("id", selectNodeid);
					if(selNodes) {
						obj.selectNode(selNodes[0]);
						obj.expandNode(selNodes[0], true, false, true);
					}

					if(gettree == null || gettree == undefined) {

					} else {
						gettree(obj);
					}
				} else {
					$(this).msg(result.message);
				}
			});
		};
		return bindTree($This, data, gettree, click);
	}
})(jQuery)
