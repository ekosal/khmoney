
$(document).ready(function(){
	init();		
	$('#type_payment').change(function(){
		loanShowBytime();
	});
	$(document).on('click','.btn_cancel,.btn_close',function(){
		$('.alert_wrap').bPopup().close();
	});
	
	$(window).scroll(function(e){
		var scrollTop = $(window).scrollTop();
		if (scrollTop > 401){
			$('#paymentBar').addClass('topfix');
		}else{
			$('#paymentBar').removeClass('topfix');
		}
	});
	$('#btn_payment').click(function(){
		checkForPayment();
	});
	$('#btn_update').click(function(){
		loanPaymentSaveUpdate();
	});
});

function init(){
	$('#loading').bPopup();
	if ($('#loan_id').val() == ''){
		$.ajax({
			type:'GET',
			url :'/khmoney/loadingLoanview',
			data:'loaner_id='+$('#loaner_id').val()+'&id='+$('#id').val(),
			complete:function(xhr,statu){
				var json = $.parseJSON(xhr.responseText);
				if (json.status == '901') {
					Message.infor(null,json.message,Common.redictPage,json.path);   
	                return;
	           }
			   loanerGetMaxId(json);
			},error:function(json){
				console.log(json);
			}
		});
	}else{
		var data = {
				'loaner_id':$('#loaner_id').val(),
				'loan_id'  :$('#loan_id').val(),
				'id'       :$('#id').val()
		}
		$.ajax({
			type:'GET',
			url :'/khmoney/loadingLoanEdit',
			data:data,
			complete:function(xhr,statu){
				var json = $.parseJSON(xhr.responseText);
				if (json.status == '901') {
					Message.infor(null,json.message,Common.redictPage,json.path);   
	                return;
	           }
				loanerGetMaxId(json);
			},error:function(json){
				console.log(json);
			}
		});
	}
	$('#loading').bPopup().close();
	
}
function loanerGetMaxId(json){	
			console.log(json);
			if (json.status != '0000'){
				Message.infor(null,json.message);   
				return;
			}
			
			var opt = '';
		    if (typeof json.object.loanList != 'undefined'){
	    	   $.each(json.object.loanList,function(index,value){
			    	opt += '<option value="'+value.loan_id+'">លើទី'+(index+1)+'</option>';
			    });
	    	   $('#type_payment').append(opt);
	    	   $('#type_payment').show();
		    }else{
		    	$('#type_payment').hide();
		    }	
			    
			$('#loaner_code').val(Common.numberWithComma(Common.leftPage(json.object.loanObject.loaner.loaner_id,9),"-"));
		    $('#loaner_name').val(json.object.loanObject.loaner.loaner_name);
		    $('#id_card').val(Common.phoneWithComma(json.object.loanObject.loaner.id_card));
		    $('#phone').val(Common.phoneWithComma(json.object.loanObject.loaner.phone_nm));
		    $('input[name=gender][value='+json.object.loanObject.loaner.gender+']').prop('checked',true);
		    $('#address').val('ខេត្ត '+json.object.loanObject.loaner.province.name_kh + '  ស្រុក  '+json.object.loanObject.loaner.district.name_kh + '  ឃុំ  '+json.object.loanObject.loaner.commune.name_kh+'  ភូមិ  '+json.object.loanObject.loaner.village.name_kh);
		    $('#com_id').val( json.object.loanerObject.company.com_id);
		    $('#userid').val(json.object.loanerObject.user.user_id  );
		    $('#rate_type').val(json.object.loanObject.rate_type);
		    $('#total_money').val(json.object.loanObject.total_money);
		    $('#rate').val(json.object.loanObject.rate);
		    $('#money_type').val(json.object.loanObject.money_type);
		    $('#loan_type').val(json.object.loanObject.loan_type);
		    
		    var dt         = moment(json.object.loanObject.start_date).format('DD/MM/YYYY').split('/');
		    var start_date = new Date(dt[2],dt[1]-1,dt[0],0,0,0);
		               day = json.object.loanObject.count_day;
		    start_date.setDate(start_date.getDate()+ parseInt(day));
		    
		    var a = '';
	    	if (json.object.loanObject.payment_type == '1'){
	    		a = (parseInt(json.object.loanObject.count_day) / 1) + " ថ្ងៃ   / បង់ម្ដង";
	    	}else if (json.object.loanObject.payment_type == '2'){
	    		a = (parseInt(json.object.loanObject.count_day) / 7) + " អាទិត្យ​​ ​​ / បង់ម្ដង";
	    	}else if (json.object.loanObject.payment_type == '3'){
	    		a = (parseInt(json.object.loanObject.count_day) / 30) + " ខែ​  / បង់ម្ដង";
	    	}else if (json.object.loanObject.payment_type == '4'){
	    		a = (parseInt(json.object.loanObject.count_day) / 365) + "​ ឆ្នាំ ​ / បង់ម្ដង";
	    	}
	    	
	    	var rate = json.object.loanObject.rate + ' %';
	    	var money_type = ' ៛';
	    	var money_type1 = ' រៀល(៛)';
	    	
    		if (json.object.loanObject.money_type == 'D' ){
    			money_type = ' $' ;
    			money_type1 = ' ដុលារ($)';
    		}
    	
	    	

		    	$('#form_information').show();
		    	$('#loan_code').val(Common.numberWithComma(Common.leftPage(json.object.loanObject.loan_id,9),"-"));
			    $('#total_money_txt').val(Common.numberWithComma(json.object.loanObject.total_money) + money_type);
			    $('#total_money_kh').val(Common.khmerMoney(json.object.loanObject.total_money) + money_type1);
			    $('#time_txt').val(Common.numberWithComma(json.object.loanObject.time) + ' ដង');
			    $('#start_date_txt').val(moment(json.object.loanObject.start_date).format('DD/MM/YYYY'));
			    
			    $('#type_payment_txt').val(a);
			    var tt = ((parseInt(json.object.loanObject.total_money) / parseInt(json.object.loanObject.time) ) * parseFloat(json.object.loanObject.rate)) / 100;
			    /* tt = Math.round(tt);
			    var total_rate = Common.ConvertZeroTwoDigit(tt+'');
			    if (json.object.loanObject.decrement != 0){
				   tt = (parseInt(json.object.loanObject.total_money) * parseFloat(json.object.loanObject.time)) / 100;
				    total_rate = Common.ConvertZeroTwoDigit(tt+'');
			   }*/
			   
			  
			   $('#first_date_txt').val(moment(start_date).format('DD/MM/YYYY'));
			   $('#rate_money_txt').val(Common.numberWithComma(json.object.loanObject.rate) + ' %');
			   $('#decrement_txt').val(Common.numberWithComma(json.object.loanObject.decrement) + money_type);
			   $('#agent').val(json.object.loanObject.user.full_name);
			  
		   
		    
		    
		   var tbl = '', d = 0;
		   $('#tbl_payment tbody').empty();
		   $('#tbl_payment tbody').show();
		   $.each(json.object.loanPaymentList,function(index,value){

				var bg = '',readOnly='',dt='',user='',payment_id='',txt='',note='';
				dt      = value.end_dt    == null ? '-' :  moment(value.end_dt).format('DD/MM/YYYY');
				user    = value.loan.user == null ? '-' : value.loan.user.full_name					;
				
				
				if (value.txt == '9'){
					bg      = 'payment_already';
					readOnly='disabled="disabled" checked="checked"';					
					note    = value.note      == null ? ''  : value.note								;
				}else if(value.txt == '2'){
					bg = 'payment_all';
					readOnly='disabled="disabled" checked="checked"';					
					note    = value.note      == null ? '-' : value.note								;
				}else{
					payment_id=value.payment_id;
					txt       ='txt';
					note      = '<input type="text" style="width:100%;padding:0px !important;display:none;" class="note" maxlength="100"><a href="javascript:" class="btn_edit_img" style="position:absolute;right:5px;top:2px;"  onClick="hideMePlease(this);"><span class="blind">edit </span></a>';
				}
				
				
				var prak_derm = '', total_left = '';
				if (json.object.loanObject.money_type == 'R'){
			    	total_rate  = value.total_rate == '0' || value.total_rate == null ? '-' : Common.numberWithComma(Common.ConvertZeroTwoDigit(value.total_rate +''))  + money_type;
			    	prak_derm   = value.prak_derm  == '0' || value.prak_derm  == null ? '-' : Common.numberWithComma(Common.ConvertZeroTwoDigit(value.prak_derm  +''))  + money_type;
			    	total_left  = value.total_left == '0' || value.total_left == null ? '-' : Common.numberWithComma(Common.ConvertZeroTwoDigit(value.total_left +''))  + money_type;
			    	
				}else{
			    	total_rate  = value.total_rate == '0' || value.total_rate == null ? '-' : Common.numberWithComma(value.total_rate +'') + money_type;
			    	prak_derm   = value.prak_derm  == '0' || value.prak_derm  == null ? '-' : Common.numberWithComma(value.prak_derm)      + money_type;
			    	total_left  = value.total_left == '0' || value.total_left == null ? '-' : Common.numberWithComma(value.total_left +'') + money_type;
			    	
			    }

			   tbl += '<tr class="'+txt+'">'
				    +'<td><div class="t_center '+bg+'"							>   <input type="checkbox" name="payment_id" onChange="change(this)" '+readOnly+'>  </div></td>'
					+'<td class="'+bg+'"><div class="t_center index"			>'+ (index+1)+'                                                                     </div><input type="hidden" value="'+value.pay_id+'" class="pay_id"/><input type="hidden" value="'+value.pay_dt+'" class="pay_dt"/></td>'
					+'<td class="'+bg+'"><div class="t_center"					>'+ Common.ConvertDayToKhmer(start_date)   										  +'</div></td>'
					+'<td class="'+bg+'"><div class="t_center start_date"		>'+ moment(start_date).format('DD/MM/YYYY')										  +'</div></td>'
					+'<td class="'+bg+'"><div class="t_right prak_derm"         >'+ prak_derm																      +'</div></td>'
					+'<td class="'+bg+'"><div class="t_right total_rate"		>'+ total_rate																	  +'</div></td>'
					+'<td class="'+bg+'"><div class="t_right total_left"		>'+ total_left   																  +'</div></td>'
					+'<td class="'+bg+'"><div class="t_center"					>'+ dt																			  +'</div></td>'
					+'<td class="'+bg+'"><div									>'+ user																		  +'</div></td>'
					+'<td class="'+bg+'"><div style="position:relative;"		>'+ note																		  +'</div></td>'
				
				+'</tr>';
				if (index==1){
			    	$('#end_date_db').val(moment(start_date).format('YYYYMMDD'));
			    }
			    start_date.setDate(start_date.getDate() + parseInt(day));	 
			    d = parseInt(d) + parseInt(json.object.loanObject.decrement);	
		   });
			$('#tbl_payment tfoot').hide();
			$('#tbl_payment tbody').append(tbl);
		
}
function checkForPayment(){
	var i = 0,prak_derm = 0,rate = 0, total = 0,ok=false;
	var totalAmount = 0, totalPrakDermleft = 0, money_type = '' ;
	$('.tbl_input_pop tbody').empty();
	
	
	
	$('#tbl_payment tr.txt').each(function(index,value){
		if ($('#tbl_payment tr.txt').find('input[type=checkbox]:checked').length > 0){
			
			if ($('#payment_all').prop('checked') == true){
				
				if ($(this).find('input[type=checkbox]').prop('checked') == false){
				      
					totalPrakDermleft  += parseFloat($(this).find('.prak_derm').text().replace(/[​\u202f\៛\$\,]/g,'').trim())  ;
	
				}				
				
			}
			
			if ($(this).find('input[type=checkbox]').prop('checked') == true){
				
				var prak_derm  = parseFloat($(this).find('.prak_derm').text().replace(/[​\u202f\៛\$\,]/g,'').trim())  ;
				var total_rate = parseFloat($(this).find('.total_rate').text().replace(/[​\u202f\៛\$\,]/g,'').trim()) ;
				var start_date = $(this).find('.start_date').text()             ;
				var total      = prak_derm + total_rate            ;
				totalAmount    +=  prak_derm + total_rate          ;
				
				if ( $('#money_type').val() == 'R' ) {		
					money_type = '៛'	;
					console.log(totalPrakDermleft);
					prak_derm  = Common.numberWithComma(Common.ConvertZeroTwoDigit(prak_derm +'')) +   '៛';
					total_rate = Common.numberWithComma(Common.ConvertZeroTwoDigit(total_rate+'')) +   '៛';
					total      = Common.numberWithComma(Common.ConvertZeroTwoDigit(total     +'')) +   '៛';
				}else{		
					money_type = '$';
					prak_derm  = Common.numberWithComma(prak_derm)  +   '$';
					total_rate = Common.numberWithComma(total_rate) +   '$';
					total      = Common.numberWithComma(total     ) +   '$';
				}
				
				var tbl = '<tr style="display:;height:35px !important;" class="payment">'
					+ 	'<td>'						
					+ 		'<div style="padding-left: 0px !important;" class="t_center">                 ' + start_date  + '</div><input type="hidden" value="' + $(this).find('.pay_dt').val() + '"       class="pay_dt"  name="pay_dt"/>'
					+ 	'</td>'
					+ 	'<td>'						
					+ 		'<div style="padding-left: 0px !important;" class="t_right popup_prak_derm">  ' + prak_derm  + '</div><input type="hidden" value="' + $(this).find('.pay_id').val() + '" class="pay_id"  name="pay_id"/>'
					+ 	'</td>'
					+ 	'<td>'				 		
					+ 		'<div style="padding-left: 0px !important;" class="t_right popup_total_rate"> ' + total_rate + '</div>'
					+ 	'</td>'
					+ 	'<td>'				
					+ 		'<div style="padding-left: 0px !important;" class="t_right">            ' + total	   + '</div>'
					+ 	'</td>'
					+ '</tr>';
				
				$('.tbl_input_pop tbody').append(tbl);
				
			}
			
			
			ok = true;
		}else{
			Message.infor(null,'សូមធ្វើការជ្រើសរើសដើម្បីធ្វើការបង់ប្រាក់តាមតារាងខាងក្រោម​');   
			ok = false;
			return false;
		}
	})
	if (ok == false){
		return;
	}

	// last row for check all...
	if ($('#payment_all').prop('checked') == true){
		
		totalAmount = totalPrakDermleft + totalAmount  ;
		if ( $('#money_type').val() == 'R' ) {		
			money_type = '៛'	;
			console.log(totalPrakDermleft);
			totalPrakDermleft = Common.numberWithComma(Common.ConvertZeroTwoDigit(totalPrakDermleft+'')) +   '៛';
		}else{		
			money_type = '$';
			totalPrakDermleft = Common.numberWithComma(totalPrakDermleft) + '$';
		}
		
		var tbl = '<tr style="display:;height:35px !important;" class="">'
			+ 	'<td>'						
			+ 		'<div style="padding-left: 0px !important;" class="t_left"> - </div>'
			+ 	'</td>'
			+ 	'<td>'						
			+ 		'<div style="padding-left: 0px !important;" class="t_right popup_prak_derm"> ' + totalPrakDermleft + ' </div>'
			+ 	'</td>'
			+ 	'<td>'				 		
			+ 		'<div style="padding-left: 0px !important;" class="t_right popup_total_rate"> - </div>'
			+ 	'</td>'
			+ 	'<td>'				
			+ 		'<div style="padding-left: 0px !important;" class="t_right"> ' + totalPrakDermleft	+ '</div>'
			+ 	'</td>'
			+ '</tr>';		
		
		
		$('.tbl_input_pop tbody').append(tbl);
	}
	
	$('#total_amount').text(Common.numberWithComma(totalAmount) + money_type);
	$('#popu_alert_wrap').bPopup();
}
function change(obj){
	var tr = $(obj).parents('tbody');
	var i = $(obj).parents('tr').find('.index').text();
	$(tr).find('tr.txt').each(function(index,value){
		if ($(value).find('input[type=checkbox]').prop('checked') == false){
			if(parseInt(i) > parseInt($(value).find('.index').text())){
				Message.infor(null,'អ្នកមិនអាចធ្វើការបង់ប្រាក់ ដោយរំលងបានទេ'); 				
				$('#tbl_payment tbody tr.txt').find('input[type=checkbox]').prop('checked',false);
				return false;
			}
		}
	});
}

function loanPaymentSaveUpdate(){
	$('#loading').bPopup();
	 var obj = [];
	$('.tbl_input_pop table#prak-derm-payment tbody tr.payment').each(function(index,value){
		/*if ($(this).find('input[type=checkbox]').prop('checked') == true){
			var data ={
					'pay_id':$(this).find('.payment_id').val(),
					'note'  :$(this).find('.note').val()
			}
			obj.push(data);
		}*/
		
		 var prak_derm = $(this).find('.popup_prak_derm').text().replace(/[​\u202f\៛\$\,]/g,'').trim();
		 var rate      = $(this).find('.popup_total_rate').text().replace(/[​\u202f\៛\$\,]/g,'').trim();
		 if ( prak_derm == null || prak_derm == ''){
			 prak_derm = '0';
		 }
		 
		 if ( rate == null || rate == ''){
			 rate = '0';
		 }
	
		 var data ={
					'pay_id'     :$(this).find('.pay_id').val()  ,
					'loan_id'    :$('#loan_id').val()            ,
					'pay_dt'     :$(this).find('.pay_dt').val()  ,
					'prak_derm'  :prak_derm                      ,
					'total_rate' :rate                           ,
					'note'       :''
			}
			obj.push(data);
		 
	});
	var data = {}
	
	data['loanPayment'] = obj                     ;
	data['loan_id']     = $('#loan_id').val()     ;
	data['loaner_id']   = $('#loaner_id').val()   ;
	data['rate_type']   = $('#rate_type').val()   ;
	data['userid']      = $('#userid').val()      ;
	data['total_money'] = $('#total_money').val() ;
	data['rate']        = $('#rate').val()        ;
	data['com_id']      = $('#com_id').val()      ;
	data['loan_type']   = $('#loan_type').val()   ;
	data['totalAmount'] = $('#total_amount').text().replace(/[​\u202f\៛\$\,]/g,'').trim();
	
	
	data['paymentAll'] = 'false';
	if ($('#payment_all').is(':checked')){
		data['paymentAll'] = 'true';
	}
	var token = $('#_csrf').attr('content');
	var header = $('#_csrf_header').attr('content');
	console.log(data);

	$.ajax({
		type:'POST',
		contentType : 'application/json; charset=utf-8',
        dataType : 'json',
		url :'/khmoney/loanPaymentSaveUpdate', 
		data: JSON.stringify(data),
		beforeSend: function(xhr) {
            xhr.setRequestHeader(header, token)
         },
         complete:function(xhr,statu){
 			var json = $.parseJSON(xhr.responseText);
 			if (json.status == '901') {
 				Message.infor(null,json.message,Common.redictPage,json.path);   
                 return;
            }
			if (json.status == 'undefined' && json.status != '0000'){
				Message.infor(null,json.message);   
				return;
			}
			
			Message.infor(null,json.message,restart);  
			
		},error : function(XHR, textStatus, errorThrown) {
	        
		     console.log("Error: " + textStatus);      
		     console.log("Error: " + errorThrown);
		 
		 }
	});
	$('#loading').bPopup().close();
}

function restart(){
	window.location.href = '/khmoney/missing-payment/payment?loaner_id='+$('#loaner_id').val()+'&loan_id='+$('#loan_id').val()+'&loan_type='+$('#loan_type').val();
}


 function hideMePlease(obj){
	 $(obj).parents('td').find('input').show();
	 $(obj).hide();
 }
