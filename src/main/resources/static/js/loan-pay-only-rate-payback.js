
$(document).ready(function(){
	init();		
	$('#type_payment').change(function(){
		loanShowBytime();
	});
	$(document).on('click','.btn_cancel,.btn_close',function(){
		$('.alert_wrap').bPopup().close();
	});
	
	$('#popup_prak_derm').keyup(function(){
		var prak_derm = $('#popup_prak_derm').val().replace(/[​\u202f\៛\$\,]/g,'').trim();
		var total_rate= $('#popup_total').text().replace(/[​\u202f\៛\$\,]/g,'').trim();
		var total     = parseFloat(prak_derm) + parseFloat(total_rate);
		$('#total_money').text(Common.numberWithComma(total+'') + $('#money_type').val());
	});
	
	$('#popup_prak_derm_check').change(function(){
		
		if ($(this).is(':checked') ){
			$('#prak-derm-payment').show();
		}else{
			$('#prak-derm-payment').hide();
		}
		
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
		//alert(12345);
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
		    $('#loan_type').val(json.object.loanObject.loan_type);
		    
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
		    
	    	 var rate = json.object.loanObject.rate + ' %'
			 var money_type  = ' ៛';
	    	 var money_type1 = ' រៀល(៛)';
	    	 var dec_type    = 0   ;
	    	 var min_val     = '0'  ;
		     if (json.object.loanObject.money_type == 'R'){
			    	money_type  = ' ៛';
			    	money_type1 = ' រៀល(៛)';
			    	if (json.object.loanObject.rate_type == '2'){
			    		rate = Common.numberWithComma(json.object.loanObject.rate_money);
			    		rate = rate + ' ៛';
			    		//total_rate_txt= json.object.loanObject.rate_money + money_type;
			    	}else{
			    		//total_rate_txt= Common.ConvertZeroTwoDigit((parseInt(json.object.loanObject.total_money) * parseFloat(json.object.loanObject.rate)) / 100 +'') + money_type;
			    	}
		     }else{
			    	money_type  = ' $'   ;
			    	dec_type    =  2     ;
			    	min_val     =  '0.00';
			    	money_type1 = ' ដុលារ($)';
			    	if (json.object.loanObject.rate_type == '2'){
			    		rate = Common.numberWithComma(json.object.loanObject.rate_money);
			    		rate = rate + ' $';	
			    		//total_rate_txt= json.object.loanObject.rate_money + money_type;
			    	}else{
			    		//total_rate_txt= parseInt(json.object.loanObject.total_money) * parseFloat(json.object.loanObject.rate) / 100 + money_type;
			    	}
			    }
			    
		        $('#money_type').val(money_type);
			    $('#popup_prak_derm').autoNumeric('init',{ aSign: money_type,aSep:',',sGropu:'3',pSign: 's',aPad: false,vMax: '999999999',vMin: min_val,mDec : dec_type});
	    	
		    	$('#loan_code').val(Common.numberWithComma(Common.leftPage(json.object.loanObject.loan_id,9),"-"));
		    	$('#first_date_txt').val(moment(json.object.loanObject.start_dt).format('DD/MM/YYYY'));	
		    	$("#total_money_txt").val(Common.numberWithComma(json.object.loanObject.total_money) +money_type);
		    	$('#total_money_kh').val(Common.khmerMoney(json.object.loanObject.total_money) + money_type1);	
		    	$('#start_date_txt').val(moment(json.object.loanObject.start_dt).format('DD/MM/YYYY'));
		    	$('#pay_time_money').val(Common.numberWithComma(json.object.loanObject.time) + ' ដង');
		    	$('#type_payment_txt').val(a);
		    	$('#type_money_txt').val(money_type1);
		    	//$('#money_one_payment').val(Common.numberWithComma(json.object.loanPaymentList[0].prak_derm) + ' ៛');
		    	//$('#agent_txt').val(json.object.loanObject.user.full_name);
		    	//$('#money_type').val(money_type)
		    	
			    
			   //$('#first_date_txt').val(moment(start_dt).format('DD/MM/YYYY'));
			  /* $('#rate_money_txt').val(json.object.loanObject.rate + ' %');*/
				$('#rate_money_txt').val(rate);
		    	$('#type_payment_txt').val(a)	
			  // $('#decrement_txt').val(Common.numberWithComma(json.object.loanObject.decrement) + ' ៛');
			   $('#agent_txt').val(json.object.loanObject.user.full_name);
			  

		   var tbl = '', d = 0;
		   $('#tbl_payment tbody').empty();
		   $('#tbl_payment tbody').show();
		   $.each(json.object.loanPaymentList,function(index,value){
			   //console.log(value);
				var bg = '',readOnly='',dt='',user='',payment_id='',txt='',note='';
			    var dt       = moment(value.pay_dt).format('DD/MM/YYYY').split('/');
			    var start_dt = new Date(dt[2],dt[1]-1,dt[0],0,0,0);
			   			
				/*if ( value.loan.user != null ){
					user = value.loan.user.full_name;
				}*/
				
				if (value.txt == '9'){
					bg        = 'payment_already';
					readOnly  = 'disabled="disabled" checked="checked"';
					//end_dt    = moment(value.end_dt).format('DD/MM/YYYY');					
					note      = value.note;
				}else if(value.txt == '2'){
					bg        = 'payment_all';
					readOnly  = 'disabled="disabled" checked="checked"';
					//end_dt    = moment(value.end_dt).format('DD/MM/YYYY');
					note      = value.note;
				}else{
					payment_id=value.payment_id;
					txt       = 'txt';
					note      = '<input type="text" style="width:100%;padding:0px !important;display:none;" class="note" maxlength="100"><a href="javascript:" class="btn_edit_img" style="position:absolute;right:5px;top:2px;"  onClick="hideMePlease(this);"><span class="blind">edit </span></a>';
				}
				
				if (json.object.loanObject.money_type == 'R'){
			    	money_type  = ' ៛';
			    	if (json.object.loanObject.rate_type == '2'){
			    		total_rate_txt= value.total_rate == '0' ? '-' : value.total_rate + money_type;
			    	}else{
			    		total_rate_txt= value.total_rate == '0' ? '-' : Common.ConvertZeroTwoDigit(value.total_rate +'') + money_type;
			    	}
				}else{
			    	money_type  = ' $'   ;
			    	/*if (json.object.loanObject.rate_type == '2'){
			    		total_rate_txt= value.total_rate + money_type;
			    	}else{
			    		total_rate_txt= value.total_rate + money_type;
			    	}*/
			    	total_rate_txt =  value.total_rate == '0' ? '-' : value.total_rate + money_type;
			    }
				
				var prak_derm  = (value.prak_derm == '0' || value.prak_derm == null)  ? '-'                 : value.prak_derm + money_type							 ;		
				var status     = json.object.loanPaymentList.length == (index + 1) 	  ? status = 'last_row' : '' 									                 ;
				var end_dt     = value.end_dt     == null || value.end_dt == ''       ? '-'                 : moment(value.end_dt).format('DD/MM/YYYY')              ;					
				var total_left = value.total_left == '0'                         	  ? '-'                 : Common.numberWithComma(value.total_left) + money_type  ;				
				var user       = value.loan.user  == null                             ? '-'                 : value.loan.user.full_name 							 ;
				
			   tbl += '<tr class="'+txt+ ' ' + status +'">'
				    +'<td class="'+bg+'"><div class="t_center"                >    <input type="checkbox" name="payment_id" onChange="change(this)" '+readOnly+'></div></td>'
					+'<td class="'+bg+'"><div class="t_center index"          >' + (index+1)                                             +'</div><input type="hidden" value="'+value.pay_dt+'" class="pay_dt"/><input type="hidden" value="'+value.pay_id+'" class="payment_id"/></td>'
					+'<td class="'+bg+'"><div class="t_center"                >' + Common.ConvertDayToKhmer(start_dt)                    +'</div></td>'
					+'<td class="'+bg+'"><div class="t_center tbl_start_date" >' + moment(start_dt).format('DD/MM/YYYY')                 +'</div></td>'		
					+'<td class="'+bg+'"><div class="t_right  total_left"     >' + Common.numberWithComma(prak_derm)                     +'</div></td>'
					+'<td class="'+bg+'"><div class="t_right  tbl_total_rate" >' + Common.numberWithComma(total_rate_txt)                +'</div></td>'
					+'<td class="'+bg+'"><div class="t_right  prak_derm"      >' + total_left                                            +'</div></td>'
					+'<td class="'+bg+'"><div                                 >' + user                                                  +'</div></td>'
					+'<td class="'+bg+'"><div class="t_center"                >' + end_dt                                                +'</div></td>'					
					+'<td class="'+bg+'"><div style="position:relative;"      >' + note                                                  +'</div></td>'
					+'<td style="display:none;"><div class="t_right"          >' + value.prak_derm                                       +'</div></td>'
					+'<td style="display:none;"><div class="rate"             >                                                            </div></td>'
					+'<td style="display:none;"><div class="total_left"       >' + value.total_left                                      +'</div></td>'
				+'</tr>';
				if (index==1){
			    	$('#end_date_db').val(moment(start_dt).format('YYYYMMDD'));
			    }
				//start_dt.setDate(start_dt.getDate() + parseInt(day));	 
			    d = parseInt(d) + parseInt(json.object.loanObject.decrement);	
		   });
			$('#tbl_payment tfoot').hide();
			$('#tbl_payment tbody').append(tbl);
		
}
function checkForPayment(){
	//alert(12345);
	var i = 0,prak_derm = 0,rate = 0, total = 0,ok=false;
	$('.tbl_input_pop table tbody').empty();
	var tblSelectlen = $('#tbl_payment tr.txt').find('input[type=checkbox]:checked').length;
	//alert($('.tbl_input_pop table tbody tr').length);
	$('#tbl_payment tr.txt').each(function(index,value){
	
		if ( tblSelectlen > 0 ){		
			
			var readOnly   = 'disabled="disabled"  placeholder="0"';	
			var total_left = '';
			
			
			if ($('#payment_all').prop('checked') == true){
				
				if ( tblSelectlen == (index + 1 )){					
					total_left = $(this).find('.prak_derm').text().replace(/[​\u202f\៛\$\,]/g,'').trim();
					 console.log(total + '  ' + total_left);
					total = parseFloat(total) + parseFloat(total_left);
				   
				}
				
			}else{
				

				if ( tblSelectlen <= (index + 1 )){	
					
					readOnly   = 'placeholder="0"';	

				}
				
				if ( $(this).hasClass('last_row')){
					readOnly   = 'disabled="disabled"  placeholder="0"';
					total_left = $(this).find('.prak_derm').text().replace(/[​\u202f\៛\$\,]/g,'').trim();
				}
				
				
				
			}
			
			if ($(this).find('input[type=checkbox][name="payment_id"]').prop('checked') == true){
				
				var tbl = '<tr class="prak-derm-payment" style="display:;" class="payment">'
					+ 	'<td>'
					+ 		'<label>ប្រាក់ដើម</label>'
					+ 		'<div style="padding-left: 0px !important;">'
					+ 			'<input type="hidden" class="pay_dt" value="'+$(this).find('.pay_dt').val()+'"/>'
					+			'<input type="hidden" class="pay_id" value="'+$(this).find('.payment_id').val()+'"/>'
					+			'<input type="text" onkeyup=" CountInPrakDerm()" '+readOnly+' value="'+total_left+'" style="text-align: right;font-size: 16px;font-weight: bold;" name="" class="popup_prak_derm" placeholder="0">'
					+ 		'</div>'
					+ 	'</td>'
					+ 	'<td>'
					+ 		'<label>ការប្រាក់ត្រូវបង់</label><span style="width:200px !important; text-align:right;">'+$(this).find('.tbl_start_date').text()+'</span>'
					+ 		'<div style="padding-left: 0px !important;">'
					+ 			'<input type="text" value="'+$(this).find('.tbl_total_rate').text()+'" style="text-align: right;font-size: 16px;font-weight: bold;" name="" class="popup_rate" placeholder="" disabled="disabled">'
					+ 		'</div>'
					+ 	'</td>'
					+ '</tr>';
				
				
				$('.tbl_input_pop table#tbl_input_pop tbody').append(tbl);
				
				total += parseFloat( $(this).find('.tbl_total_rate').text().replace(/[​\u202f\៛\$\,]/g,'').trim());
				
				$('.popup_prak_derm').autoNumeric('init',{ aSign: $('#money_type').val(),aSep:',',sGropu:'3',pSign: 's',aPad: false,vMax: '999999999',vMin: '0'});
				
			}
			
			
			$('#total_amount').text(Common.numberWithComma(total)+$('#money_type').val());
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
	
	$('#popup_total').text(Common.numberWithComma(Common.ConvertZeroTwoDigit(total+''))+' ៛');
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
	$('.tbl_input_pop table#tbl_input_pop tbody tr').each(function(index,value){
		/*if ($(this).find('input[type=checkbox]').prop('checked') == true){
			var data ={
					'pay_id':$(this).find('.payment_id').val(),
					'note'  :$(this).find('.note').val()
			}
			obj.push(data);
		}*/
		
		 var prak_derm = $(this).find('.popup_prak_derm').val() ;
		 var rate      = $(this).find('.popup_rate').val();
		 if ( prak_derm == null || prak_derm == ''){
			 prak_derm = '0';
		 }else {
			 prak_derm = prak_derm.replace(/[\u202f\៛\$\,]/g,'').trim();
		 }
		 
		 if ( rate == null || rate == ''){
			 rate      = '0';
		 }else {
			 rate = rate.replace(/[\u202f\៛\$\,]/g,'').trim();
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
	data['loanPayment'] = obj                    ;
	data['loan_id']     = $('#loan_id').val()    ;
	data['loaner_id']   = $('#loaner_id').val()  ;
	data['rate_type']   = $('#rate_type').val()  ;
	data['userid']      = $('#userid').val()     ;
	data['total_money'] = $('#total_money').val();
	data['rate']        = $('#rate').val()       ;
	data['com_id']      = $('#com_id').val()     ;
	data['paymentAll']  = 'false'                ;
	data['loan_type']   = $('#loan_type').val()  ;
	data['totalAmount'] = $('#total_amount').text().replace(/[​\u202f\៛\$\,]/g,'').trim();
	
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

 
 function CountInPrakDerm(){
	 
	 var total = 0;
	 //console.log( $('.tbl_input_pop table#tbl_input_pop tbody tr').length);
	 $('.tbl_input_pop table#tbl_input_pop tbody tr').each(function(val,index){
		 var prak_derm = $(this).find('.popup_prak_derm').val().replace(/[​\u202f\៛\$\,]/g,'').trim();
		 var rate      = $(this).find('.popup_rate').val().replace(/[​\u202f\៛\$\,]/g,'').trim();
		 if ( prak_derm == null || prak_derm == ''){
			 prak_derm = 0;
		 }
		 
		 if ( rate == null || rate == ''){
			 rate = 0;
		 }
	
		 
		 total += (parseFloat(prak_derm) + parseFloat(rate));
		
	 });
	 
	 $('#total_amount').text(Common.numberWithComma(total)+$('#money_type').val());
 }