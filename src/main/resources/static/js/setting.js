$(document).ready(function(){
	loadingData('0');

});
function openTabLinke(evt, obj){

	$('.tabContents').hide();
	$('.tabLinks').parent('li').removeClass('on');
	$('#'+ obj).show();
	$(evt).parent('li').addClass('on');
	if (obj == 'pay_constand'){
		loadingData('0');
	}else{
		loadingData('1');
	}
	$('.tbl_input_dot').after()
}
function loadingData(id) {
	$('#loading').bPopup();
	 $.ajax({
         type: 'GET',
         url : '/khmoney/loadingListSetting',
         data: 'payTxt='+id,
         complete:function(xhr,statu){
 			var json = $.parseJSON(xhr.responseText);
 			if (json.status == '901') {
                 alert(json.message);
                 window.location = json.path;
                 return;
            }
         	$('#pay_constand').empty();
         	$('#pay_down').empty();
         	if (json.object == null || json.object == 'undefined'){
         		$('#pay_constand').append("There are no Setting ")
         		return;
         	}
         	$.each(json.object , function( index, value ) {
         		var tbl = '';         		
         		tbl += '<!-- title_wrap -->'
		    		   +'<div class="tit_wrap cboth">'
					   +'<div class="t_left">'
					   +'<div class="tit_h4"><h4>កំណត់ការបង់រំលោះ'+index+'</h4></div>'
				       +'</div>'
					   +'</div>'
					   +'<!-- //title_wrap -->';
         		tbl += '<!-- point_text -->'
    				   +'<p class="point_text">ការកំណត់បន្ថែមចំនួនថ្ងៃត្រូវបង់ប្រាក និងអត្រាការប្រាក់ទុកមុន</p>'   
    				   +'<!-- //point_text -->';
         		tbl += '<!-- table input dot -->'
					   +'<div class="tbl_input_dot">'
					   +'<table summary="">'
					   +'<caption></caption>'
					   +'<colgroup>'
					   +'<col style="width:100px;">'
					   +'<col style="width:150px;">'
					   +'<col style="width:100px;">'
					   +'<col style="width:200px;">'
					   +'<col style="width:100px;">'
					   +'</colgroup>'
					   +'<tbody>';
		         	   for(var i= 0 ;i < value.length; i++){
		         				tbl +='<tr>'
									+'<th><div>ចំនួន</div></th>'
									+'<td><div class="value_show">'+value[i].value+' ដង</div> <div style="display:none;" class="div_value"><input type="text" value="'+value[i].value+'" class="value"><input type="text" value="'+id+'" class="upOrdown"></div> </td>'
									+'<th><div>អត្រាការប្រាក់</div></th>'
									+'<td><div class="rate_show">'+value[i].rate+' %</div><div style="display:none;"  class="div_rate"><input type="text" value="'+value[i].rate+'" class="rate"></div></td>'
									+'<td>'
									+'<div>'
									+'<input type="hidden" value="'+index+'"         class="columns">'
		         				    +'<input type="hidden" value="'+value[i].type+'" class="type">'
		         				    +'<input type="hidden" value="'+value[i].day+'"  class="day">'
		         				    +'<input type="hidden" value="'+value[i].id+'"   class="id">'
									+'<a href="javascript:" class="btn_edit1"  onClick="showTextBoxEditData(this);"><span class="blind">edit </span></a>'
									+'<a href="javascript:" class="btn_save"   onClick="saveEditCountAndRate(this);" style="display:none;"><span class="blind">save </span></a>'
									if (value[i].txt == '2'){
										tbl += '<a href="javascript:" class="btn_delete_1" onClick="deleteSettingById(this)"><span class="blind">delete</span></a>'
									}
		         				    if ((i+1) == value.length){
		         				    	tbl += '<a href="javascript:" class="btn_add_1" onClick="addNewCountAndRate(this);"><span class="blind">add</span></a>'
		         				    }			         				    
								tbl	+='</div>'
									+'</td>'
									+'</tr>'
				         	
		         		}			
						+'</tbody>'
					    +'</table>'
				        +'</div>'
				        +'<!-- //table input dot -->';
						if (id == '0'){
							$('#pay_constand').append(tbl)
						}else{
							$('#pay_down').append(tbl)
						}			
						$('.value').autoNumeric('init',{ aSign: '​​ ដង',pSign: 's',aPad: false,vMax: '999',vMin: '0'});
						$('.rate').autoNumeric('init', { aSign: ' %',pSign: 's',aPad: false,vMax: '99',vMin: '00.00',mDec: 2,});
         	});
         	
         
         	
         },
         error : function(){
            console.log('error');
         }
     });
	 $('#loading').bPopup().close();
}

function showTextBoxEditData(obj){
	$(obj).parents('tr').find('.rate_show').hide();
	$(obj).parents('tr').find('.value_show').hide();
	$(obj).parents('tr').find('.div_rate').show();
	$(obj).parents('tr').find('.div_value').show();
	$(obj).parents('tr').find('.btn_save').show();
	$(obj).hide();
}

function removeTagTr(obj){
	$(obj).parents('tr').prev().find('.btn_add_1').show();
	$(obj).parents('tr').hide();
	
}

function saveEditCountAndRate(obj){
	var data = {
			value : $(obj).parents('tr').find('.div_value').find('.value').val().replace(/\ដង/g, '').trim(),
			rate  : $(obj).parents('tr').find('.div_rate').find('.rate').val().replace(/\%/g, '').trim(),
			id    : $(obj).parents('tr').find('.id').val()
	}
	 $.ajax({
         type: 'GET',
         url : '/khmoney/settingEditById',
         data: data,
         success : function(json){
        	 if (json.code == '9999'){
        		 alert(json.message);
        		 return;
        	 }
        	 alert(json.message);
        	 loadingData();
         },
         error:function(error){
        	 console.log(error);
         }
     });
}

function addNewCountAndRate(obj){
	$(obj).hide();
	var tbl ='<tr>'
		+'<th><div>ចំនួន</div></th>'
		+'<td><div class="div_value"><input type="text" value="" class="value"></div> </td>'
		+'<th><div>អត្រាការប្រាក់</div></th>'
		+'<td><div  class="div_rate"><input type="text" value="" class="rate"></div></td>'
		+'<td>'
		+'<div>'		
		+'<a href="javascript:" class="btn_save"  style="min-width:17px !important;background-color:transparent !important;"  onClick="saveNewCountAndRate(this);"><span class="blind">save</span></a>'
		/*+'<a href="javascript:" class="btn_delete_1"><span class="blind">delete</span></a>'*/
		+'<a href="javascript:" class="btn_delete_1"  onClick="removeTagTr(this);"><span class="blind">- </span></a>'
		+'</div>'
		+'</td>'
		+'</tr>';
	$(obj).parents('tr').after(tbl);
	$('.value').autoNumeric('init',{ aSign: '​ ដង',pSign: 's',aPad: false,vMax: '999',vMin: '0'});
	$('.rate').autoNumeric('init', { aSign: ' %',pSign: 's',aPad: false,vMax: '99',vMin: '00.00',mDec: 2,});
}

function saveNewCountAndRate(obj){
	var payTxt = $(obj).parents('tbody').find('.upOrdown').val();
	if ( payTxt == '1'){
		if (parseInt($(obj).parents('tr').find('.value').val().replace(/\ដង/g, '').trim()) > 15){
			alert ("Can not bigger than 15");
			return;
		}
	}
	
	var data = {
			value   :  $(obj).parents('tr').find('.value').val().replace(/\ដង/g, '').trim(),
			rate    :  $(obj).parents('tr').find('.rate').val().replace(/\%/g, '').trim(),
			columns :  $(obj).parents('tbody').find('.columns').val(),
			type    :  $(obj).parents('tbody').find('.type').val(),
			day     :  $(obj).parents('tbody').find('.day').val(),
			payTxt  :  payTxt
	}
	$.ajax({
         type: 'GET',
         url : '/khmoney/saveNewCountAndRate',
         data: data,
         success : function(json){
        	 if (json.code == '9999'){
        		 alert(json.message);
        		 return;
        	 }
        	 alert(json.message);
        	 loadingData(payTxt);
         },
         error:function(error){
        	 console.log(error);
         }
     });
	
}

function deleteSettingById(obj){
	    var value = $(obj).parents('tr').find('.value').val();
	    var rate  = $(obj).parents('tr').find('.rate').val();
		if (confirm('Do you to delete value='+ value + 'and rate ='+rate+' this Item.' )== true){
			$.ajax({
		         type: 'GET',
		         url : '/khmoney/deleteSettingById',
		         data: 'id='+$(obj).parents('tr').find('.id').val(),
		         success : function(json){
		        	 if (json.code == '9999'){
		        		 alert(json.message);
		        		 return;
		        	 }
		        	 alert(json.message);
		        	 loadingData();
		         },
		         error:function(error){
		        	 console.log(error);
		         }
		     });
		}
		
}