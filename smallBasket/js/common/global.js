(function($) {
		var r20 = /%20/g, //全部空格
			rbracket = /\[\]$/; //结尾位置匹配中括号

		//ajaxJson请求方法
		$.fn.setAjaxJSON = function(url, data, callback) {
			var $This = $(this);
			if(data == null || data == undefined) {
				data = {};

			}
			$.ajax({
				type: "post",
				url: "url",
				data: data,
				dataType: "json",
				beforeSend: function() {
					$This.pregress(); //显示进度
				}
				success: function(result) {
					if(result.flag) {
						if(callback != null) {
							callback(result, $This);
						}
					} else {
						$.messageBox(result.message, '错误');
					}
				},
				complete: function() {
					$.unprogress();
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					$.messageBox($.getHttpError(XMLHttpRequest.status), "错误");
				}

			});
		};

		//
		$.fn.getAjaxJSON = function() {
			var $This = $(this);
			if(data == null || data == undefined) {
				data = {};

			}
			$.ajax({
				type: "post",
				url: "url",
				data: $.customParam(data),
				dataType: "json",
				beforeSend: function() {
					$This.pregress(); //显示进度
				}
				success: function(result) {
					if(result.flag) {
						if(callback != null) {
							callback(result, $This);
						}
					} else {
						$.messageBox(result.message, '错误');
					}
				},
				complete: function() {
					$.unprogress();
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					$.messageBox($.getHttpError(XMLHttpRequest.status), "错误");
				}

			});
		};

		//通过ajax获取Html页面内容
		$.fn.getAjaxHTML = function() {
			var $This = $(this);
			if($This.length <= 0) return;
			$.ajax({
				type: "get",
				url: url,
				data: $.customParam(data),
				dataType: "html",
				beforeSend: function() {
					$This.progress();
				},
				success: function(result) {
					if(callback) callback(result, $This);
				},
				complete: function() {
					$.unProgress();
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					$.messageBox($.getHttpError(XMLHttpRequest.status), "错误");
				}
			});
		};



      function htmlUrlVer(url){
      	var ver=getCookie('ver');
      	if(ver == null || ver == undefined || ver == 'undefined'){
      		ver = "";
      		return url +"?" + ver;
      	}
      }

		//进度显示
		$.fn.progress = function() {
			var $This = ($(this).length <= 0) ? $('body') : $(this);
			$This.addClass('progress-parent');
			$This.append('<div class="progress-content text-center"><i class="fa fa-spinner fa-pulse fa-1x fa-fw"></i></div>')
			$This = null;
		};


         //关闭进度
         jQuery.fn.unProgress = function(){
         	$('.progress-parent').removeClass('.pregress-parent');
         	$('.show-progress').remove();
         }


        jQuery.fn.openModalWindow = function(url,arg,title,callback){
        	var $This=$(this);
        	if(arg == undefined || arg == null){
        		arg ={};
        	}
        	if(title == null || title == undefined){
        		title = '';
        	}
        	
        	$('#globeModel').remove();
        	$('body').append(
              '<div id="globeModel" class="modal fade" role="dialog">' +
            '<div class="modal-dialog modal-lg" style="width: 80%;">' +
            '<div class="modal-content">' +
            '<div class="modal-header">' +
            '<button type="button" class="close" data-opr="close" data-dismiss="modal">&times;</button>' +
            '<h4 class="modal-title">Modal Header</h4>' +
            '</div>' +
            '<div class="modal-body" data-content="modal">' +
            '</div>' +
            '<div class="modal-footer">' +
            // '<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>'+
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>');
            
            var $popWindow = $('#globeModel');
                  $.ajax({
            type: "GET",
            url: htmlUrlVer(url),
            data: arg,
            dataType: "html",
            beforeSend: function(XHR) {
                $This.progress();
            },
            success: function(result) {
            	result=htmlPageVer(result);
                $('#globeModel .modal-body').html(result);
                var $panelTitle = $('#globeModel .modal-title');
                if ($panelTitle.length > 0) {
                    $panelTitle.text(title);
                }
                $popWindow.modal('toggle');
                $('#globeModel [data-opr="close"]').click(function() {
                    $popWindow.trigger('click.dismiss.bs.modal');

                });
                $popWindow.on('hidden.bs.modal', function() {
                    $popWindow.remove();
                });
                if (callback) {
                    callback($popWindow);
                }
            },
            complete: function() {
                $This.unProgress();
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                $(this).msgBoxError({
                    flag: false,
                    message: '访问 [' + url + "] 失败."
                });
            }
        });
            
            
        	
        }

        

		$.extend({
			customParam: function(a) {
				var s = [],
					add = function(key, value) {
						if(value == null || value == " " || value == "undefined" || value == undefined) {
							return;
						}

						value = jQuery.isFunction(value) ? value() : value;
						s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value);

					};
				if(jQuery.isArray(a) || (a.jquery && !jQuery.isPlainObject(a))) {
					jQuery.each(a, function() {
						add(this.name, this.value);
					});
				} else {
					for(var prefix in a) {
						buildParams(prefix, a[prefix], add);
					}
				}
				return s.join("&").replace(r20, "+");

			}
		});

		function buildParams(prefix, obj, add) {
			if(jQuery.isArray(obj)) {
				jQuery.each(obj, function(i, v)) {
					if(rbracket.test(prefix)) {
						add(prefix, v);
					} else {
						buildParams(prefix + "[" + (typeof v === "object" || jQuery.isArray(obj) ? i : "") + "]", v, add);

					}

				});
		} else if(obj != null && typeof obj === "object") {
			for(var name in obj) {
				buildParams(prefix + "." + name, obj[name], add);
			}
		} else {
			add(prefix, obj);
		}
	}

})(JQuery)