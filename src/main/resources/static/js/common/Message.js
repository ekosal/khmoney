/**
 * 
 */

var Message = {};
if (!Message) Message = {};
Message.infor = function (title,content,callBack,input){
	var title   = (typeof title   == 'undefined' || title   == null) ? 'ពត័មាន' : title;
	var content = (typeof content == 'undefined' || content == null) ? '' : content;
	$.confirm({
	    title: title,
	    content: content,
	    type: 'green',
	    boxWidth: '400px',
	    useBootstrap: false,
	    closeIcon: function(){
	    	if ($.isFunction(callBack)){
	    		if (typeof input != 'undefined' && input != null){
	    			callBack(input);
	    		}else{
	    			callBack();
	    		}
	    	}
	    },
	    buttons: {   
	        ok: {
	            text: "យល់ព្រម!",
	            btnClass: 'btn-primary',
	            keys: ['enter'],
	            action: function(){
	            	if ($.isFunction(callBack)){
	            		if (typeof input != 'undefined' && input != null){
	    	    			callBack(input);
	    	    		}else{
	    	    			callBack();
	    	    		}
	    	    	}
	            }
	        }
	    }
	});
	$('.jconfirm .jconfirm-box div.jconfirm-content-pane div.jconfirm-content').css('background-image','url(../img/icon/icon_success.png)');
	$('#loading').bPopup().close();	

}
Message.success = function (title,content,callBack){
	var title   = (typeof title   == 'undefined' || title   == null) ? 'ពត័មាន' : title;
	var content = (typeof content == 'undefined' || content == null) ? '' : content;
	$('.jconfirm .jconfirm-box div.jconfirm-content-pane div.jconfirm-content').css('background-image','url(../img/icon/icon_success.png);');
	$.confirm({
	    title: title,
	    content: content,
	    type: 'green',
	    boxWidth: '400px',
	    useBootstrap: false,
	    closeIcon: function(){
	    	if ($.isFunction(callBack)){
	    		callBack;
	    	}
	    },
	    buttons: {   
	        ok: {
	            text: "យល់ព្រម!",
	            btnClass: 'btn-primary',
	            keys: ['enter'],
	            action: function(){
	            	if ($.isFunction(callBack)){
	    	    		callBack;
	    	    	}
	            }
	        }
	    }
	});
}

Message.confirm = function (title,content,callBack,input){

	var title   = (typeof title   == 'undefined' || title   == null) ? 'ពត័មាន' : title;
	var content = (typeof content == 'undefined' || content == null) ? '' : content;
	
	$.confirm({
	    title: title,
	    content: content,
	    type: 'green',
	    boxWidth: '400px',
	    useBootstrap: false,
	    closeIcon: function(){
	    	return;
	    },
	    buttons: [{
			    	text: "យល់ព្រម!",
		            btnClass: 'btn-primary',
		            keys: ['enter'],
		            action: function () {
			        	
			        	if ($.isFunction(callBack)){
		            		if (typeof input != 'undefined' && input != null){
		    	    			callBack(input);
		    	    		}else{
		    	    			callBack();
		    	    		}
		    	    	} 
			        }
		        },{
			        text: "Cancel",
		            btnClass: 'btn-primary',
		            action: function () {
			           return;
			        }
		        
		      }]
		
	});	

	$('.jconfirm .jconfirm-box div.jconfirm-content-pane div.jconfirm-content').css('background-image','url(../img/icon/warning.png)');
	$('#loading').bPopup().close();	

}

