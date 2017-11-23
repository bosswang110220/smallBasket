(function($) {
	var f = {
		getMap: function(map, options, target) {
			var svg = Snap(map.selector);
			Snap.load('js/lib/JMap/map/' + options.data.arg.code + "-1.svg", function(f) {
				g = f.select("svg");
				map.empty();
				svg.append(g);

				if(target) {
					g.attr('route-rcode', target);
					$('[data-map="return"]').append('<a class="btn btn-primary">返回</a>');
				} else {
					$('[data-map="return"]').empty();
				}
				g.attr('route-selected', options.data.arg.code);
				map.find('[type="area"]').css('fill', '#0088aa');
				map.find('[type="data"]>text').css('cursor', 'pointer');
				map.find('[type="data"]>text').empty();
				/*
				 * 填充数据显示区域各数据值
				*/
				map.setmapData(options.data,function(sum){
					if(options.setTitle){
						options.setTitle($('[data-map="title"]'),$('[data-map="subTitle"]'),sum);
					}
				});
				
			});
		},
		events: function(map) {
			map.on('mouseover', '[type="area"]', function(e) {
				$(this).css('fill', '#fee74c');
			});
			map.on('mouseout', '[type="area"]', function(e) {
				$(this).css('fill', '#0088aa');
			});
			map.on('mouseover', '[type="data"]>text', function(e) {
				var sector = '[code="' + $(this).parent().attr('code') + '"]';
				$(sector).css('fill', '#fee74c');
			});
			map.on('mouseout', '[type="data"]>text', function(e) {
				var sector = '[code="' + $(this).parent().attr('code') + '"]';
				$(sector).css('fill', '#0088aa');
			});
		},
		iniContainer: function(options) {
			var html = '<div class="text-center">';
			html += '<h4 data-map="title"></h4>';
			html += '<div class="text-center" data-map="subTitle"></div>';
			html += '</div>';
			html += '<div class="text-right"  data-map="return">';
			html += '</div>';
			html += '<div data-map="map">';
			html += '</div>';
			return html;
		}

	};
	var setEvent = {
		click: function(map, options) {
			map.on('click', '[type="area"]',  function(e) {
				var obj = $(this);
				var child = obj.attr('isChild');
				//var targetCode = options.data.arg.code;
				var targetCode = map.find('svg').attr('route-selected');
				options.data.arg.code = obj.attr('code');
				options.data.arg.type=$('[name="optionsRadios"]:checked').val();
				if(child) {
					f.getMap(map, options, targetCode);
				}
			});
		},
		nodeClick: function(map, callback) {
			map.on('click', '[type="data"]>text', function(e) {
				var obj = $(this);
				if(callback) {
					callback(obj, obj.parent().attr('code'), obj.text());
				}
			});
		},
		returnMap: function(map, options) {
			$('[data-map="return"]').on('click', function(e) {
				
				var rcode = map.children('svg').attr('route-rcode');
				if(!rcode) {
					rcode = map.children('svg').attr('route-selected');
				}
				options.data.arg.code = rcode;
				var target = options.data.arg.code.substr(0,rcode.length-2);
				f.getMap(map, options,target);
			});
		}
	};

	/*options:{
	 * 			
	 	code:"53", --要显示的地图区域代码
	 	//地图区域块单击事件
		//obj表示点击的地图上区域块
		//obj存在有属性code:表示点击的地图区域块的区域代码
		mapClick:function(obj，code){
			alert(obj.attr('code'));
		},
		//地图上显示数据的单击事件
		//参数说明：
		//    obj:单击的数据节点对象
		//    code:表示单击的数据节点所表示的区域
		//    txt:表示数据标签上的数值
		nodeClick:function(obj,code,txt){
			
			alert('code:' + code + ',txt:' + txt);
		},
		//获取要在数据标签上显示数据的数据源
		//传到后台参数:code
		//返回格式：{
			[
				{
					"code": 5301, --区域代码
					"value": "19", --值
					"unit": "tce" --单位
				},
				...
			]
		}
		url:"data/home/mapdata.json"
	}
	 */
	$.fn.setmapData = function(arg,completed) {
		
		$.fn.ajaxGetJson(arg.url, arg.arg, function(result, obj) {
			var sum = 0;		
			$('[data-map="map"]').find('[type="data"]>text').text('');
			var unit=null;
			$.each(result.data, function(idx, item) {
				var txtSector = '#text' + item.code + '-lc';
				var txt = $(txtSector);
				sum += parseFloat(item.value);
				if(unit == null)
				{
				   unit=item.unit;
				}
				var bislevel = null;
				if(item.code.substring(2,4)=='00'||item.code.substring(4,6)=='00')
				{
					if(item.code==arg.arg.code+'00')
					{
						bislevel = ' (其中 '+item.islevelname+' '+item.value+' '+unit+')';
						unit = unit+bislevel;
					}
					
				}
				txt.text(item.value);				
			});
			if(completed){
				completed(sum,unit);
			}
		});
	};
	
	$.fn.setTitle = function(title,sub,sum){
		$('[data-map="subTitle"]').text('共 ' + sum + " " + sub);
		$('[data-map="title"]').text(title);
	}

	$.fn.map = function(options) {
		if(!options) {
			options = {};
		}
		if(!options.data.arg.code) {
			alert('指定要加载的地图区域代码参数.');
			return;
		}

		var html = f.iniContainer(options);
		$(this).empty();
		$(this).append(html);
		var $map = $('[data-map="map"]');

		f.events($map);
		setEvent.click($map, options); //绑定单击事件
		setEvent.nodeClick($map, options.nodeClick);
		setEvent.returnMap($map, options);

		f.getMap($map,options,null);
		//填充数据
	};
})(jQuery);