$(document).ready(function(){
	init();	
	$('#id_card').keyup(function(){
		$('#id_card').val(Common.numberWithComma($('#id_card').val().replace(/\-/g, ''),"-"));
	});
	$('#phone').keyup(function(){
		$('#phone').val(Common.phoneWithComma($('#phone').val().replace(/\-/g, ''),"-"));
	});
	
	$('#btn_addMore').click(function(){
		loadingSettingData('0');
		selectPayType();
	});
	
	$(document).on('click','.btn_cancel,.btn_close',function(){
		$('#popup_loan_pay_only_rate').bPopup().close();
	});
	
	$('input[name="rd_decrement"]').change(function(){
		$('#loadingDecrementTypeValue').hide();
		if($(this).val() == 'decrement'){
			$('#loadingDecrementTypeValue').show();			
		}
		
	});
	
	$('#rate_type_payments').change(function(){
		selectPayType();
	});
	
	$('.btn_confirm').click(function(){
		$('#loading').bPopup();
		confrimCheck();
		$('#loading').bPopup().close();
	});
	
	$('#btn_save').click(function(){		
		loanSaveLoanAgain();
		
	});
	
});

function init(){
	$('#loading').bPopup();
	loanerGetMaxId();
	Common.datePicker('popup_start_date');
	$('#rate_total_money').autoNumeric('init',{ aSign: '​​ ៛',aSep:',',sGropu:'3',pSign: 's',aPad: false,vMax: '999999999',vMin: '0'});
	$('#rate_payment_time').autoNumeric('init',{ aSign: '​​ ដង',pSign: 's',aPad: false,vMax: '99',vMin: '0'});
	$('#rate_rate').autoNumeric('init', { aSign: ' %',pSign: 's',aPad: false,vMax: '99',vMin: '00.00',mDec: 2,});
	$('#loading').bPopup().close();
	
}

function loanerGetMaxId(){
	$.ajax({
		type:'GET',
		url :'/khmoney/loan/loadingLoanAgain',
		data:'loaner_id='+$('#loaner_id').val(),
		complete:function(xhr,statu){
			var json = $.parseJSON(xhr.responseText);
			if (json.status == '901') {
				 Message.infor(null,json.message,Common.redictPage,json.path);
				 return;
          }
			if (json.status == 'undefined' || json.status != '0000'){
				 Message.infor(null,json.message);
				return;
			}
			/*$('#loaner_code').val(Common.numberWithComma(json.object.maxLoanerId,"-"));*/
			$('#loaner_code').val(Common.numberWithComma(Common.leftPage(json.object.loanerObject.loaner_id,9)));
		    $('#loaner_name').val(json.object.loanerObject.loaner_name);
		    $('#id_card').val(Common.phoneWithComma(json.object.loanerObject.id_card));
		    $('#phone').val(Common.phoneWithComma(json.object.loanerObject.phone_nm));
		    $('input[name=gender][value='+json.object.loanerObject.gender+']').prop('checked',true);
		    $('#address').val('ខេត្ត '+json.object.loanerObject.province.name_kh + '  ស្រុក  '+json.object.loanerObject.district.name_kh + '  ឃុំ  '+json.object.loanerObject.commune.name_kh+'  ភូមិ  '+json.object.loanerObject.village.name_kh);
			$('#loan_code').val(Common.numberWithComma(json.object.maxLoanId,"-"));
			$('#agent_txt').val($('#agent').val());
		},error:function(json){
			console.log(json);
		}
	});
}
/*ប្រភេទបង់ប្រាក់*/
function loadingSettingData(id){
	if (   $('#loaner_name').val() == '' 
	    || $('#phone').val()       == '' 
	    || $('#id_card').val()     == '' 
	    || $('#address').val()     == ''){
    	alert('សូមបំពេញពត៍មានរបស់អ្នកខ្ចីមុន ទើបអាចបំពេញទឹកប្រាក់ដែលត្រូវខ្ចីបាន!!');
    	return;
    }
	$('#popup_agent').val($('#agent').val());
	$('#popup_loan_pay_only_rate').bPopup();
}



function confrimCheck(){
	var time,decrement=0,rate,total_money,total_rate,day;
	if ($('#rate_total_money').val() == '')
	{
		Message.infor(null,"សូមបញ្ចូលចំនួនទឹកប្រាក់សរុបដែលត្រូវខ្ចី!",null);
		$('#rate_total_money').focus();
		return;
	}
	
	if ($('#rate_rate').val() == ''){
		Message.infor(null,"សូមជ្រើសរើសប្រភេទនៃការបង់ប្រាក់!",null);
		return;
	}
	
	if ($('#rate_payment_time').val() == ''){
		Message.infor(null,"សូមបញ្ចូលអត្រាការប្រាក់ ដើម្បីទូរទាត់ការប្រាក់!",null);
		return;
	}
		
	total_money = $('#rate_total_money').val().replace(/[​\u202f\៛\,]/g,'').trim();
	
	time = $('#rate_payment_time').val().replace(/[​\u202f\ដង\,]/g,'');
	rate = $('#rate_rate').val().replace(/[​\u202f\%\,]/g,'');
	
	var dt         = $('#popup_start_date').val().split('/');
	var start_dt = new Date(dt[2],dt[1]-1,dt[0],0,0,0);
               day = parseInt($('#rate_type_payments option:selected').attr('data')) * parseInt($('#rate_count_day').val());
	start_dt.setDate(start_dt.getDate()+ parseInt(day));
	
	/*calculate rate and total money*/
	var tt = parseInt(total_money)  * parseFloat(rate) / 100;
	    tt = Math.round(tt);
	var total_rate = Common.ConvertZeroTwoDigit(tt+'');
	var prak_derm  = total_money;	
	
	$('#type_loan').val("4");
	
	$("#total_money_txt").val($('#rate_total_money').val());
	$('#total_money_kh').val(Common.khmerMoney(total_money) + " ៛");
	$('#type_payment_txt').val($('#rate_count_day').val() + $('#rate_type_payments option:selected').text() + ' / ' + 'បង់ម្ដង');
	$('#start_date_txt').val($('#popup_start_date').val());
	$('#pay_time_money').val(time+' ដង');
	$('#rate_money_txt').val(rate+' %')
	$('#rate_db').val(rate);
	$('#type_payment_db').val($('#rate_type_payments option:selected').val());
	$("#day_db").val(day);
	$('#popup_agent').val($('#agent').val());
	
	
	var tbl = '', d = 0;
	$('#tbl_lst1 tbody').empty();
	$('#tbl_lst1 tbody').show();
	for (var i = 1; i <= time; i++){
		
		
		tbl += '<tr>'
					+'<td><div class="t_center">'+i+'</div></td>'
					+'<td><div class="t_center">'+Common.ConvertDayToKhmer(start_dt)   +'</div></td>'
					+'<td><div class="t_right tbl_start_dt">' +moment(start_dt).format('DD/MM/YYYY')+'</div></td>'
					+'<td style="display:none;"><div class="t_right tbl_prak_derm"></div></td>'
					+'<td style="display:none;"><div class="tbl_total_rate"></div></td>'
					+'<td><div class="t_right tbl_payment">'+Common.numberWithComma(total_rate)+' ៛</div></td>'
					+'<td><div></div></td>'
					+'<td style="display:none;"><div class="t_right tbl_left"></div></td>'
					+'<td style="display:none;"><div></div></td>'
					+'<td style="display:none;"><div></div></td>'
				+'</tr>';
		
		//set end date
	    start_dt.setDate(start_dt.getDate() + parseInt(day));	 
	    d = parseInt(d) + parseInt(decrement);
	   
	}
	$('#tbl_lst1 tfoot').hide();
	$('#tbl_lst1 tbody').append(tbl);
	$('#popup_loan_pay_only_rate').bPopup().close();
}



function loanSaveLoanAgain(){
	$('#loading').bPopup();	
 	var loan = {
 			'start_dt'    :Common.formatDateToString($('#start_date_txt').val().trim()),
 			'total_money' :parseInt($('#total_money_txt').val().replace(/[​\u202f\៛\,]/g,'').trim()),
 			'rate'        :parseFloat($('#rate_db').val()),
 			'type_payment':$('#type_payment_db').val(),
 			'time'        :parseInt($('#pay_time_money').val().replace(/[​\u202f\ដង\,]/g,'').trim()),
 			'decrement'   :0,
 			'count_day'   :parseInt($('#day_db').val()),
 			'type_loan'   :$('#type_loan').val()
 	}	
 	var arr_loan = [];
 	arr_loan.push(loan);
 	
 	
 	var data = {
 			'loaner_id'   :parseInt($('#loaner_id').val()), 			
 			'loans'       :arr_loan
 			
 	
 	};
 	console.log(data);
 	
 	var token = $('#_csrf').attr('content');
 	var header = $('#_csrf_header').attr('content');
 
 	$.ajax({
 		type:'POST',
  		contentType : 'application/json; charset=utf-8',
         dataType : 'json',
 		url :'/khmoney/loan/loan-save-loan-pay-only-rate-again',
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
 			if (typeof json.status == 'undefined' || json.status != '0000'){
 				Message.infor(null,json.message,null);
 				return;
 			}
 			Message.success(null,json.message,loanNew);
 		},error:function(json){
 			console.log(json)
 		}
 	});
	$('#loading').bPopup().close();
}
function loanNew(){
	window.location.href = '/khmoney/loan';
}
function selectPayType(){
	var opt = '';
	if ($('#rate_type_payments').val() == '1'){
		opt += '<option  value="1"> 1 ថ្ងៃ</option>';
		opt += '<option  value="2"> 2 ថ្ងៃ</option>';
		opt += '<option  value="3"> 3 ថ្ងៃ</option>';
		opt += '<option  value="4"> 4 ថ្ងៃ</option>';
		opt += '<option  value="5"> 5 ថ្ងៃ</option>';
	}else if ( $(rate_type_payments).val() == '2'){
		opt += '<option  value="1"> 1 អាទិត្យ</option>';
		opt += '<option  value="2"> 2 អាទិត្យ</option>';
		opt += '<option  value="3"> 3 អាទិត្យ</option>';
	}
	else if ( $('#rate_type_payments').val() == '3'){
		opt += '<option  value="1"> 1 ខែ</option>';
		opt += '<option  value="2"> 2 ខែ</option>';
		opt += '<option  value="3"> 3 ខែ</option>';
		opt += '<option  value="4"> 4 ខែ</option>';
		opt += '<option  value="5"> 5 ខែ</option>';
		opt += '<option  value="6"> 6 ខែ</option>';
	
	}
	else if ( $('#rate_type_payments').val() == '4'){
		opt += '<option  value="1"> 1 ឆ្នាំ</option>';
		opt += '<option  value="2"> 2 ឆ្នាំ</option>';			
	}
	$('#rate_count_day').empty();
	$('#rate_count_day').append(opt);
}

