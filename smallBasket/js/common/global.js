
(function($){
	var r20=/%20/g, //全部空格
	    rbracket = /\[\]$/;//结尾位置匹配中括号
	    
	    
	//ajaxJson请求方法
	$.fn.setAjaxJSON=function(url,data,callback){
		var $This=$(this);
		if(data==null || data==undefined){
			data = {};
			
		}
		$.ajax({
			type:"post",
			url:"url",
			data:data,
			dataType:"json",
			beforeSend:function(){
				$This.pregress();//显示进度
			}
			success:function(result){
				if(result.flag){
					if(callback !=null){
						callback(result,$This);
					}
				}else{
					$.messageBox(result.message,'错误');
				}
			},
			complete:function(){
				$.unprogress();
			},
			error:function(XMLHttpRequest, textStatus, errorThrown){
				$.messageBox($.getHttpError(XMLHttpRequest.status), "错误");
			}
			
		});
	};
	
	
	//
	$.fn.getAjaxJSON=function(){
		var $This=$(this);
		if(data==null || data==undefined){
			data = {};
			
		}
		$.ajax({
			type:"post",
			url:"url",
			data:$.customParam(data),
			dataType:"json",
			beforeSend:function(){
				$This.pregress();//显示进度
			}
			success:function(result){
				if(result.flag){
					if(callback !=null){
						callback(result,$This);
					}
				}else{
					$.messageBox(result.message,'错误');
				}
			},
			complete:function(){
				$.unprogress();
			},
			error:function(XMLHttpRequest, textStatus, errorThrown){
				$.messageBox($.getHttpError(XMLHttpRequest.status), "错误");
			}
			
		});
	};
	   
	//通过ajax获取Html页面内容
	$.fn.getAjaxHTML=function(){
				var $This = $(this);
		if ($This.length <= 0) return;
		$.ajax({
			type: "get",
            url: url,
            data: $.customParam(data),
			dataType: "html",
			beforeSend: function() {
				$This.progress();
			},
			success: function(result) {
				if (callback) callback(result, $This);
			},
			complete: function() {
				$.unProgress();
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				$.messageBox($.getHttpError(XMLHttpRequest.status), "错误");
			}
		});
	};
	   
	//进度显示
	$.fn.progress=function(){
		var $This=($(this).length<=0) ? $('body'):$(this);
		$This.addClass('progress-parent');
		$This.append('<div class="progress-content text-center"><i class="fa fa-spinner fa-pulse fa-1x fa-fw"></i></div>')
		$This=null;
	};
	
	
	    
	
	
})(JQuery)
