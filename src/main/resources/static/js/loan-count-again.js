$(document).ready(function(){
	init();	
	$('#id_card').keyup(function(){
		$('#id_card').val(Common.numberWithComma($('#id_card').val().replace(/\-/g, ''),"-"));
	});
	$('#phone').keyup(function(){
		$('#phone').val(Common.phoneWithComma($('#phone').val().replace(/\-/g, ''),"-"));
	});
	
	$('#btn_addMore').click(function(){
		loadingSettingData();
	});
	
	$(document).on('click','.btn_cancel,.btn_close',function(){
		$('#popup_loan_count').bPopup().close();
	});
	
	$('input[name="rd_decrement"]').change(function(){
		$('#loadingDecrementTypeValue').hide();
		if($(this).val() == 'decrement'){
			$('#loadingDecrementTypeValue').show();			
		}
		
	});
	
	$('#type_payments').change(function(){
		var opt = '';
		if ($(this).val() == '1'){
			opt += '<option  value="1"> 1 ថ្ងៃ</option>';
			opt += '<option  value="2"> 2 ថ្ងៃ</option>';
			opt += '<option  value="3"> 3 ថ្ងៃ</option>';
			opt += '<option  value="4"> 4 ថ្ងៃ</option>';
			opt += '<option  value="5"> 5 ថ្ងៃ</option>';
		}else if ( $(this).val() == '2'){
			opt += '<option  value="1"> 1 អាទិត្យ</option>';
			opt += '<option  value="2"> 2 អាទិត្យ</option>';
			opt += '<option  value="3"> 3 អាទិត្យ</option>';
		}
		else if ( $(this).val() == '3'){
			opt += '<option  value="1"> 1 ខែ</option>';
			opt += '<option  value="2"> 2 ខែ</option>';
			opt += '<option  value="3"> 3 ខែ</option>';
			opt += '<option  value="4"> 4 ខែ</option>';
			opt += '<option  value="5"> 5 ខែ</option>';
			opt += '<option  value="6"> 6 ខែ</option>';

		}
		else if ( $(this).val() == '4'){
			opt += '<option  value="1"> 1 ឆ្នាំ</option>';
			opt += '<option  value="2"> 2 ឆ្នាំ</option>';			
		}
		$('#count_day').empty();
		$('#count_day').append(opt);
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
	$('#count_total_money').autoNumeric('init',{ aSign: '​​ ៛',aSep:',',sGropu:'3',pSign: 's',aPad: false,vMax: '999999999',vMin: '0'});
	$('#count_payment_time').autoNumeric('init',{ aSign: '​​ ដង',pSign: 's',aPad: false,vMax: '999',vMin: '0'});
	$('#count_time').autoNumeric('init',{ pSign: 's',aPad: false,vMax: '99',vMin: '0'});
	$('#count_totalOneTime').autoNumeric('init', { aSign: '​​ ៛',aSep:',',sGropu:'3',pSign: 's',aPad: false,vMax: '999999',vMin: '0'});
	$('#loading').bPopup().close();
	
}

function loanerGetMaxId(){
	$.ajax({
		type:'GET',
		url :'/khmoney/loadingLoanAgain',
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
	if ($('#loaner_name').val() == '' || $('#phone').val() == '' || $('#id_card').val() == '' || $('#address').val() == ''){
    	alert('សូមបំពេញពត៍មានរបស់អ្នកខ្ចីមុន ទើបអាចបំពេញទឹកប្រាក់ដែលត្រូវខ្ចីបាន!!');
    	return;
    }
	$('#popup_agent').val($('#agent').val());
	$('#popup_loan_count').bPopup();
}




function confrimCheck(){
	var time,decrement=0,rate,total_money,total_rate,day;
	if ($('#popup_total_money').val() == '')
	{
		Message.infor(null,"សូមបញ្ចូលចំនួនទឹកប្រាក់សរុបដែលត្រូវខ្ចី!",null);
		$('#popup_total_money').focus();
		return;
	}
	
	if ($('input[name=rd_decrement]:checked').val() == 'decrement'){
		if ($('#popup_decrement').val() == ''){
			Message.infor(null,"សូមបញ្ចូលចំនួនទឹកប្រាក់ថយពីចំនួនទឹកប្រាក់សន្សំក្នុងពេលបង់មួយលើកៗ",null);
			$('#popup_decrement').focus();
			return;
		}		
	}
	
	if ($('#type_payment').val() == ''){
		Message.infor(null,"សូមជ្រើសរើសប្រភេទនៃការបង់ប្រាក់!",null);
		return;
	}
	
	if ($('#popup_time').val() == ''){
		Message.infor(null,"សូមជ្រើសរើសចំនួនដងដែលត្រូវបង់ប្រាក់!",null);
		return;
	}
	if ($('#popu_count_day').val() == '' || $('#popu_count_day').val() == '0'){
		Message.infor(null,"សូមជ្រើសរើសចំនួនដងដែលត្រូវបង់ប្រាក់!",null);
		return;
	}
	if ($('#popup_rate').val() == ''){
		Message.infor(null,"សូមបញ្ចូលអត្រាការប្រាក់ ដើម្បីទូរទាត់ការប្រាក់!",null);
		return;
	}
	
	var total_money = $('#count_total_money').val().replace(/[​\u202f\៛\,]/g,'').trim();
	var payOneTime  = $('#count_totalOneTime').val().replace(/[​\u202f\៛\,]/g,'').trim();
	var countTime   = parseInt($('#count_payment_time').val());
	
	var dt         = $('#popup_start_date').val().split('/');
	var start_date = new Date(dt[2],dt[1]-1,dt[0],0,0,0);
               day =parseInt($('#type_payments option:selected').attr('data')) * parseInt($('#count_day').val());
	start_date.setDate(start_date.getDate()+ parseInt(day));
	
	$('#first_date_txt').val(moment(start_date).format('DD/MM/YYYY'));	
	$("#total_money_txt").val($('#count_total_money').val());
	$('#total_money_kh').val(Common.khmerMoney(total_money) + " ៛");	
	$('#start_date_txt').val(moment(start_date).format('DD/MM/YYYY'));
	$('#time_payment').val($('#count_payment_time').val() );
	$('#type_payment_txt').val( $('#count_day').val() + $('#type_payments option:selected').text() + ' / ' + 'បង់ម្ដង');
	$('#money_one_payment').val($('#count_totalOneTime').val())	
	$('#agent_txt').val($('#popup_agent').val());
	$('#type_loan').val("3");
	$('#day_db').val(day);
	$('#type_payment_db').val($('#type_payments option:selected').val());
	var tbl = '', d = 0;
	$('#tbl_lst1 tbody').empty();
	$('#tbl_lst1 tbody').show();
	
	for (var i = 1; i <= countTime; i++){
        var left = total_money - (Math.round(total_money / countTime) * i)
		tbl += '<tr>'
					+'<td><div class="t_center">'+i+'</div></td>'
					+'<td><div class="t_center">'+Common.ConvertDayToKhmer(start_date)   +'</div></td>'
					+'<td><div class="t_right tbl_start_date">' +moment(start_date).format('DD/MM/YYYY')+'</div></td>'
					+'<td style="display:none;"><div class="t_right tbl_prak_derm">'+Math.round(total_money / countTime)+'</div></td>'
					+'<td style="display:none;"><div class="tbl_total_rate">0</div></td>'
					+'<td><div class="t_right tbl_payment">'+Common.numberWithComma($('#count_totalOneTime').val())+'</div></td>'
					+'<td><div></div></td>'
					+'<td style="display:none;"><div class="t_right tbl_left">'+left+'</div></td>'
					+'<td style="display:none;"><div></div></td>'
					+'<td style="display:none;"><div></div></td>'
				+'</tr>';
		
		//set end date
	    start_date.setDate(start_date.getDate() + parseInt(day));	 
	   
	}
	$('#tbl_lst1 tfoot').hide();
	$('#tbl_lst1 tbody').append(tbl);
	$('#popup_loan_count').bPopup().close();
}


function loanSaveLoanAgain(){

	if ($('#loaner_name').val() == ''){
    	alert('សូមបញ្ចូលឈ្មោះអ្នកដែលខ្ចីប្រាក់!');
    	return;
    }
    if ($('#phone').val() == ''){
    	alert('សូមបញ្ចូលលេខទូរស័ព្ទអ្នកដែលខ្ចីប្រាក់!');
    	return;
    }
    if ($('#id_card').val() == ''){
    	alert('សូមបញ្ចូលអត្ដសញ្ញាណប័ណ្ណអ្នកដែលខ្ចីប្រាក់!');
    	return;
    }
    if ($('#address').val() == ''){
    	alert('សូមបញ្ចូលអាស័យដ្ឋានអ្នកដែលខ្ចីប្រាក់!');
    	return;
    }	
	
    $('#loading').bPopup();

    var d = {
        	'prak_derm' : parseInt($('#money_one_payment').val().replace(/[​\u202f\៛\,]/g,'').trim())
        }
    
    var dd = [];
    dd.push(d);

    var loan = {
			'start_dt'    :Common.formatDateToString($('#start_date_txt').val().trim()),
			'total_money' :parseInt($('#total_money_txt').val().replace(/[​\u202f\៛\,]/g,'').trim()),
			'rate'        :0,
			'type_payment':$('#type_payment_db').val(),
			'time'        :parseInt($('#time_payment').val().replace(/[​\u202f\ដង\,]/g,'').trim()),
			'decrement'   :0,
			'count_day'   :parseInt($('#day_db').val()),
			'type_loan'   :$('#type_loan').val(),
			'loanpayments':dd
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
		url :'/khmoney/loan/loanSaveLoanCountAgain',
		data: JSON.stringify(data),
		beforeSend: function(xhr) {
            xhr.setRequestHeader(header, token)
         },
         complete:function(xhr,statu){
        	 console.log('error == ' + status);
        	var json = $.parseJSON(xhr.responseText);
        	if (json.status == '901') {
        		  Message.infor(null,json.message,Common.redictPage,json.path);
                  return;
             }
			if (typeof  json.status == 'undefined' || json.status != '0000'){
				Message.infor(null,json.message,null);
				return;
			}
			Message.infor(null,json.message,loanNew);
		},error:function(json){
			console.log(json)
		}
	});
	$('#loading').bPopup().close();
}
function loanNew(){
	window.location.href = '/khmoney/loan';
}
