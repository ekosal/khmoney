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
		$('#popup_loan_pay_only_rate').bPopup().close();
	});
	
	$('#rate_type_payments').change(function(){
		selectPayType();
	});
	
	$('input[name="rd_decrement"]').change(function(){
		$('#loadingDecrementTypeValue').hide();
	
		
	});
	
	$('.btn_confirm').click(function(){
		$('#loading').bPopup();
		confrimCheck();
		$('#loading').bPopup().close();
	});
	
	$('#btn_save').click(function(){
		
		
			loanSaveEdititemCount();
	
		
		
	});
	
	$('#list_provinces').change(function(){
		districtsListByProId();
	});
	$('#list_districts').change(function(){
		communesListByDisId();
	});
	$('#list_communes').change(function(){
		villageListByComId();
	});
	
	
	$('input[type=radio][name=money_type]').change(function(){
		moneyType ();
	});
	
	$('select[name=rate_type]').change(function(){
		$('#rate_rate').val('');
		$('#rate_payment_time').val('');
		var money_type = ' ៛';
		var dec_type   = 0  ;
		if ($('input[type=radio][name=money_type]:checked').val() == 'D' ){
			money_type = ' $';
			dec_type   = 2   ;
		}
		
		$('#rate_total_money').autoNumeric('update',{ aSign: money_type,aSep:',',sGropu:'3',pSign: 's',aPad: false,vMax: '999999',vMin: '0'});
		
		
		if ($('#rate_type option:selected').val() == '2'){
			$('#rate_rate').autoNumeric('update', { aSign: money_type,aSep:',',sGropu:'3',pSign: 's',aPad: false,vMax: '999999999',vMin: '0',mDec : dec_type});
		}else{
			$('#rate_rate').autoNumeric('update', { aSign: ' %',pSign: 's',aPad: false,vMax: '99',vMin: '00.00',mDec: dec_type});
		}
	    
				
	});
	

});

function init(){
	$('#loading').bPopup();
	loanerGetMaxId();
	Common.datePicker('popup_start_date');
	$('#rate_total_money').autoNumeric('init',{ aSign: '​​ ៛',aSep:',',sGropu:'3',pSign: 's',aPad: false,vMax: '999999999',vMin: '0'});
	$('#rate_payment_time').autoNumeric('init',{ aSign: '​​ ដង',pSign: 's',aPad: false,vMax: '99',vMin: '0'});
	$('#rate_rate').autoNumeric('init', { aSign: ' %',pSign: 's',aPad: false,vMax: '99',vMin: '00.00',mDec: 2,});
	$('#rate_rate_money').autoNumeric('init',{ aSign: '​​ ៛',aSep:',',sGropu:'3',pSign: 's',aPad: false,vMax: '999999999',vMin: '0'});
	
	$('#loading').bPopup().close();
	
}

function loanerGetMaxId(){
	
	var data = {
			'loaner_id':$('#loaner_id').val(),
			'loan_id'  :$('#loan_id').val()
	}
	console.log(data);
	$.ajax({
		type:'GET',
		url :'/khmoney/loan/loan-pay-only-edit-view',
		data:data,
		complete:function(xhr,statu){
			var json = $.parseJSON(xhr.responseText);
			console.log(json);
			if (json.status == '901') {
                alert(json.message);
                window.location = json.path;
                return;
           }
			if (json.status == 'undefined' || json.status != '0000'){
				alert(json.message);
				return;
			}
			$('#loaner_code').val(Common.numberWithComma(Common.leftPage(json.object.loanObject.loaner.loaner_id,9),'-'));
		    $('#loaner_name').val(json.object.loanObject.loaner.loaner_name);
		    $('#id_card').val(Common.phoneWithComma(json.object.loanObject.loaner.id_card));
		    $('#phone').val(Common.phoneWithComma(json.object.loanObject.loaner.phone_nm));
		    $('input[name=gender][value='+json.object.loanObject.loaner.gender+']').prop('checked',true);
		    
		    var provinces = json.object.listProvinces;
			var opt       = '<option value="0" selected>ជ្រើសរើសខេត្ដ</option>';
			$('#list_provinces').empty();
			$.each(provinces,function(index,value){
				if (value.pro_id == json.object.loanObject.loaner.province.pro_id){
					opt += '<option value="'+value.pro_id+'" selected="selected">'+value.name_kh+'</option>'
				}else{
					opt += '<option value="'+value.pro_id+'">'+value.name_kh+'</option>'
				}				
			});
			$('#list_provinces').append(opt);
			
			var districts = json.object.listDistricts;
			var opt       = '<option value="0" selected>ជ្រើសរើសស្រុក</option>';
			$('#list_districts').empty();
			$.each(districts,function(index,value){
				if (value.dis_id == json.object.loanObject.loaner.district.dis_id){
					opt += '<option value="'+value.dis_id+'" selected="selected">'+value.name_kh+'</option>'
				}else{
					opt += '<option value="'+value.dis_id+'">'+value.name_kh+'</option>'
				}	
			});
			$('#list_districts').append(opt);
			
			var communes = json.object.listCommunes;
			var opt       = '<option value="0" selected>ជ្រើសរើសឃុំ</option>';
			$('#list_communes').empty();
			$.each(communes,function(index,value){
				if (value.com_id == json.object.loanObject.loaner.commune.com_id){
					opt += '<option value="'+value.comm_id+'" selected="selected">'+value.name_kh+'</option>'
				}else{
					opt += '<option value="'+value.comm_id+'">'+value.name_kh+'</option>'
				}	
			});
			$('#list_communes').append(opt);
		    
			var villages = json.object.listVillages;
			var opt       = '<option value="0" selected>ជ្រើសរើសភូមិ</option>';
			$('#list_village').empty();
			$.each(villages,function(index,value){
				if (value.vil_id == json.object.loanObject.loaner.village.vil_id){
					opt += '<option value="'+value.vil_id+'" selected="selected">'+value.name_kh+'</option>'
				}else{
					opt += '<option value="'+value.vil_id+'">'+value.name_kh+'</option>'
				}	
			});
			$('#list_village').append(opt);
			
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
   	
	    	/*var rate = json.object.loanObject.rate + ' %';
	    	var money_type = ' ៛';
	    	var money_type1 = ' រៀល(៛)';
	    	if (json.object.loanObject.rate_type == '2'){
	    		rate = Common.numberWithComma(json.object.loanObject.rate_money);
	    		if (json.object.loanObject.money_type == 'R' ){
	    			rate = rate + ' ៛';
	    		}else{
	    			rate       = rate + ' $';
	    			money_type = ' $' ;
	    			money_type1 = ' ដុលារ($)';
	    		}
	    	}
	    	*/
	    	
	    	 var rate = json.object.loanObject.rate + ' %'
			 var money_type  = ' ៛';
	    	 var money_type1 = ' រៀល(៛)';
			    if (json.object.loanObject.money_type == 'R'){
			    	money_type  = ' ៛';
			    	money_type1 = ' រៀល(៛)';
			    	if (json.object.loanObject.rate_type == '2'){
			    		rate = Common.numberWithComma(json.object.loanObject.rate_money);
			    		rate = rate + ' ៛';
			    		total_rate_txt= json.object.loanObject.rate_money + money_type;
			    	}else{
			    		total_rate_txt= Common.ConvertZeroTwoDigit((parseInt(json.object.loanObject.total_money) * parseFloat(json.object.loanObject.rate)) / 100 +'') + money_type;
			    	}
			    }else{
			    	money_type  = ' $';
			    	money_type1 = ' ដុលារ($)';
			    	if (json.object.loanObject.rate_type == '2'){
			    		rate = Common.numberWithComma(json.object.loanObject.rate_money);
			    		rate = rate + ' $';	
			    		total_rate_txt= json.object.loanObject.rate_money + money_type;
			    	}else{
			    		total_rate_txt= parseInt(json.object.loanObject.total_money) * parseFloat(json.object.loanObject.rate) / 100 + money_type;
			    	}
			    }
	    	
		  
	    	$('#loan_code').val(Common.numberWithComma(Common.leftPage(json.object.loanObject.loan_id,9),"-"));	
	    	$("#total_money_txt").val(Common.numberWithComma(json.object.loanObject.total_money) + money_type);
	    	$('#total_money_kh').val(Common.khmerMoney(json.object.loanObject.total_money) + money_type1);	
	    	$('#start_date_txt').val(moment(json.object.loanObject.start_dt).format('DD/MM/YYYY'));
	    	$('#pay_time_money').val(Common.numberWithComma(json.object.loanObject.time) + ' ដង');
	    	$('#type_money_txt').val(money_type1);
	    	$('#rate_money_txt').val(rate);
	    	$('#type_payment_txt').val(a)	
	    	
	    	var rate = json.object.loanObject.rate;
	    	if (json.object.loanObject.rate_type == '2'){
	    		rate = json.object.loanObject.rate_money;
	    	}
	    	$('#agent_txt').val(json.object.loanObject.user.full_name);
	    	$('#type_loan').val(json.object.loanObject.loan_type);
	    	$('#day_db').val(json.object.loanObject.count_day);
	    	$('#type_payment_db').val(json.object.loanObject.payment_type);
	    	$('#rate_db').val(rate);
	    	$('#rate_type_db').val(json.object.loanObject.rate_type);
	    	$('#money_type_db').val(json.object.loanObject.money_type);
	    	
		    var dt         = moment(json.object.loanObject.start_dt).format('DD/MM/YYYY').split('/');
		    var start_dt = new Date(dt[2],dt[1]-1,dt[0],0,0,0);
		               day = json.object.loanObject.count_day;
			start_dt.setDate(start_dt.getDate()+ parseInt(day));
			
		    console.log(start_dt);
		   

		   var tbl = '', d = 0;
		   $('#tbl_lst1 tbody').empty();
		   $('#tbl_lst1 tbody').show();
		   $.each(json.object.loanPaymentList,function(index,value){
			   
			   tbl += '<tr>'
					+'<td><div class="t_center">'+(index+1)+'</div></td>'
					+'<td><div class="t_center">'+Common.ConvertDayToKhmer(start_dt)   +'</div></td>'
					+'<td><div class="t_right tbl_start_dt">' +moment(start_dt).format('DD/MM/YYYY')+'</div></td>'
					+'<td style="display:none;"><div class="t_right tbl_prak_derm"></div></td>'
					+'<td style="display:none;"><div class="tbl_total_rate"></div></td>'
					+'<td><div class="t_right tbl_payment">'+Common.numberWithComma(total_rate_txt) +'</div></td>'
					+'<td><div></div></td>'
					+'<td style="display:none;"><div class="t_right tbl_left"></div></td>'
					+'<td style="display:none;"><div></div></td>'
					+'<td style="display:none;"><div></div></td>'
				+'</tr>';
			   
			    start_dt.setDate(start_dt.getDate() + parseInt(day));	 
			    d = parseInt(d) + parseInt(json.object.loanObject.decrement);	
		   });
			$('#tbl_lst1 tfoot').hide();
			$('#tbl_lst1 tbody').append(tbl);
		},error:function(json){
			console.log(json);
		}
	});
}
/*ប្រភេទបង់ប្រាក់*/
function loadingSettingData(){
	if ($('#loaner_name').val() == ''){
		Message.infor(null,'សូមបញ្ចូលឈ្មោះអ្នកដែលខ្ចីប្រាក់!');
    	return;
    }
    if ($('#phone').val() == ''){
    	Message.infor(null,'សូមបញ្ចូលលេខទូរស័ព្ទអ្នកដែលខ្ចីប្រាក់!');
    	return;
    }
    if ($('#id_card').val() == ''){
    	Message.infor(null,'សូមបញ្ចូលអត្ដសញ្ញាណប័ណ្ណអ្នកដែលខ្ចីប្រាក់!');
    	return;
    }
    if ($('#list_provinces').val() == '0'){
    	Message.infor(null,'សូមបញ្ចូលខេត្ដអ្នកដែលខ្ចីប្រាក់រស់នៅ!');
    	return;
    }	
    if ($('#list_districts').val() == '0'){
    	Message.infor(null,'សូមបញ្ចូលស្រុកអ្នកដែលខ្ចីប្រាក់រស់នៅ!');
    	return;
    }	
    if ($('#list_communes').val() == '0'){
    	Message.infor(null,'សូមបញ្ចូលឃុំអ្នកដែលខ្ចីប្រាក់រស់នៅ!');
    	return;
    }	
    if ($('#list_village').val() == '0'){
    	Message.infor(null,'សូមបញ្ចូលភូមិអ្នកដែលខ្ចីប្រាក់រស់នៅ!');
    	return;
    }	

    
	
    // 1. value from view to popup view
    $('input[type=radio][name=money_type][value="'+$('#money_type_db').val()+'"]').prop('checked',true);
    $('select[name="rate_type"] option[value="'+$('#rate_type_db').val()+'"]').attr('selected','selected');
	
    // 2. set money type after set radio 'money_tye'
	moneyType ();
	
	$("#rate_total_money").val($('#total_money_txt').val());
	$('#popup_start_date').val($('#start_date_txt').val());
	$('#rate_rate').val($('#rate_money_txt').val());
	$('#rate_payment_time').val($('#pay_time_money').val());
	$('select[name="rate_type_payment"] option[value="'+$('#type_payment_db').val()+'"]').attr('selected','selected');
	
	selectPayType();
	//  calculate count day  	
	var count_day =   $('#day_db').val() / parseInt($('#rate_type_payments option:selected').attr('data'));
	
	// renew set "select[name="rate_count_day"]"
	var element = '';
	$('select[name="rate_count_day"] > option').each(function(i,v){
		console.log( v.value +' '+count_day);
		if ( v.value == count_day ){
			console.log( v.value);
			element += '<option value="'+v.value+'" selected>'+v.text+'</option>'
		}else{
			element += '<option value="'+v.value+'">'+v.text+'</option>'
		}
	});	
	
	
	
	$('#rate_count_day').empty();
	$('#rate_count_day').append(element);
	// end
	
    $('#popup_agent').val($('#agent_txt').val());
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
	
	// type money that loaner loan (៛ ) or ($)
	var money_type     = ' ៛'    ;
	var money_type_txt = ' រៀល​ (៛)';
	if ($('input[type=radio][name=money_type]:checked').val() == 'D' ){
		money_type     = ' $';
		money_type_txt = ' ដុលារ($)';
	}
	
	// set type money (៛) or ($)
	$('#money_type_txt').val(money_type_txt);
		
	total_money = $('#rate_total_money').val().replace(/[​\u202f\៛\,]/g,'').trim();	
	time = $('#rate_payment_time').val().replace(/[​\u202f\ដង\,]/g,'');
	
	// set rate percent or amount money (៛/$?
	var rate_type = ' %';
	if ($('select[name=rate_type] option:selected').val() == '2'){
		rate_type = money_type;
	}
	
	var dt         = $('#popup_start_date').val().split('/');
	var start_dt = new Date(dt[2],dt[1]-1,dt[0],0,0,0);
               day = parseInt($('#rate_type_payments option:selected').attr('data')) * parseInt($('#rate_count_day').val());
	start_dt.setDate(start_dt.getDate()+ parseInt(day));
	
	/*calculate rate and total money*/
	// type rate percent(%) or cash
	var prak_derm      = total_money;	
	var total_rate     = 0          ;
	var total_rate_db  = $('#rate_rate').val().replace(/[\u202f\៛\%\$\,]/g,'').trim();
	var total_rate_txt = 0;
	if ($('input[type=radio][name=money_type]:checked').val() == 'D' ){
		if ($('select[name=rate_type] option:selected').val() == '1' ){
			total_rate    = $('#rate_rate').val().replace(/[\u202f\%\,]/g,'') + rate_type;
			total_rate_txt= (parseInt(prak_derm) * parseFloat(total_rate_db) / 100 +'') + money_type;
		}else{
			total_rate    = $('#rate_rate').val().replace(/[\u202f\៛\$\,]/g,'').trim() + money_type;
			total_rate_txt= total_rate_db + money_type;
		}
	}else{
		if ($('select[name=rate_type] option:selected').val() == '1' ){
			total_rate    = $('#rate_rate').val().replace(/[\u202f\%\,]/g,'') + rate_type;
			total_rate_txt= Common.ConvertZeroTwoDigit((parseInt(prak_derm) * parseFloat(total_rate_db)) / 100 +'') + money_type;
		}else{
			total_rate    = $('#rate_rate').val().replace(/[\u202f\៛\$\,]/g,'').trim() + money_type;
			total_rate_txt= total_rate_db + money_type;
		}
	}
	
	
	/*calculate rate and total money*/
/*	var tt = parseInt(total_money)  * parseFloat(rate) / 100;
	    tt = Math.round(tt);
	var total_rate = Common.ConvertZeroTwoDigit(tt+'');*/
	//var prak_derm  = total_money;	
	
	$('#type_loan').val("4");
	
	$("#total_money_txt").val($('#rate_total_money').val());
	$('#total_money_kh').val(Common.khmerMoney(total_money) +money_type_txt);
	$('#type_payment_txt').val($('#rate_count_day').val() + $('#rate_type_payments option:selected').text() + ' / ' + 'បង់ម្ដង');
	$('#start_date_txt').val($('#popup_start_date').val());
	$('#pay_time_money').val(time+' ដង');
	$('#rate_money_txt').val(total_rate)

	$('#type_payment_db').val($('#rate_type_payments option:selected').val());
	$("#day_db").val(day);
	// set for save to database
	$('#rate_db').val(total_rate_db);
	$('#rate_type_db').val($('select[name=rate_type] option:selected').val());
	$('#money_type_db').val($('input[type=radio][name=money_type]:checked').val());
	$('#type_payment_db').val($('select[name=rate_type_payment] option:selected').val());
	$('#popup_agent').val($('#agent').val());
	
	
	var tbl = '', d = 0;
	$('#tbl_lst1 tbody').empty();
	$('#tbl_lst1 tbody').show();
	for (var i = 1; i <= time; i++){
		
		
		tbl += '<tr>'
					+'<td><div class="t_center">'+i+'</div></td>'
					+'<td><div class="t_center">'+Common.ConvertDayToKhmer(start_dt)   +'</div></td>'
					+'<td><div class="t_right tbl_start_date">' +moment(start_dt).format('DD/MM/YYYY')+'</div></td>'
					+'<td style="display:none;"><div class="t_right tbl_prak_derm"></div></td>'
					+'<td style="display:none;"><div class="tbl_total_rate"></div></td>'
					+'<td><div class="t_right tbl_payment">'+Common.numberWithComma(total_rate_txt)+'</div></td>'
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



function districtsListByProId(){

	$.ajax({
		type:'GET',
		url :'/khmoney/districtsListByProId',
		data:'proId='+$('#list_provinces').val(),
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
			var districts = json.object.listDistricts;
			var opt       = '<option value="0" selected>ជ្រើសរើសស្រុក</option>';
			$('#list_districts').empty();
			$.each(districts,function(index,value){
				opt += '<option value="'+value.dis_id+'">'+value.dis_name+'</option>';
			});
			$('#list_districts').append(opt);
		},error:function(json){
			console.log(json);
		}
	});
}
function communesListByDisId(){

	$.ajax({
		type:'GET',
		url :'/khmoney/communesListByDisId',
		data:'comDisId='+$('#list_districts').val(),
		complete:function(xhr,statu){
			var json = $.parseJSON(xhr.responseText);
			if (json.status == '901') {
				 Message.infor(null,json.message,Common.redictPage,json.path);
                return;
           }
			if (json.status == 'undefined' || json.status != '0000'){
				Message.infor(null,json.message,null);
				return;
			}
			var communes = json.object.listCommunes;
			var opt       = '<option value="0" selected>ជ្រើសរើសឃុំ</option>';
			$('#list_communes').empty();
			$.each(communes,function(index,value){
				opt += '<option value="'+value.com_id+'">'+value.com_name+'</option>';
			});
			$('#list_communes').append(opt);
		},error:function(json){
			console.log(json);
		}
	});
}
function villageListByComId(){
	
	$.ajax({
		type:'GET',
		url :'/khmoney/villageListByComId',
		data:'vilComId='+$('#list_communes').val(),
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
			var villages = json.object.listVillages;
			var opt       = '<option value="0" selected>ជ្រើសរើសភូមិ</option>';
			$('#list_village').empty();
			$.each(villages,function(index,value){
				opt += '<option value="'+value.vil_id+'">'+value.vil_name+'</option>';
			});
			$('#list_village').append(opt);
		},error:function(json){
			console.log(json);
		}
	});
}


function loanSaveEdititemCount(){	
    $('#loading').bPopup();	
      
        
    	var loan = {
    			'start_dt'    :Common.formatDateToString($('#start_date_txt').val().trim()),
    			'loan_id'     :parseInt($('#loan_code').val().replace(/\-/g,'').trim()),
    			'total_money' :parseInt($('#total_money_txt').val().replace(/[​\u202f\៛\,]/g,'').trim()),
    			'rate'        :parseFloat($('#rate_db').val()),
    			'rate_money'  :parseFloat($('#rate_db').val()),
    			'payment_type':$('#type_payment_db').val(),
    			'time'        :parseInt($('#pay_time_money').val().replace(/[​\u202f\ដង\,]/g,'').trim()),
    			'decrement'   :0,
    			'count_day'   :$('#day_db').val(),
    			'loan_type'   :$('#type_loan').val(),
    			'rate_type'   :$('#rate_type_db').val(),
    			'money_type'  :$('#money_type_db').val()
    	}	
    	var arr_loan = [];
    	arr_loan.push(loan);
    	
    	var province = {
    			pro_id : parseInt($('#list_provinces').val())
    	}

        var district = {
    			dis_id : parseInt($('#list_districts').val())
    	}
    	var commune = {
    			comm_id : parseInt($('#list_communes').val())
    	}
    	var village = {
    			vil_id : parseInt($('#list_village').val())
    	}
    	var data = {
    			'loaner_id'   :parseInt($('#loaner_code').val().replace(/\-/g,'').trim()),
    			'loaner_name' :$('#loaner_name').val(),
    			'gender'      :$('input[name=gender]:checked').val(),
    			'id_card'     :$('#id_card').val().replace(/\-/g,'').trim(),
    			'phone_nm'    :$('#phone').val().replace(/\-/g,'').trim(),
    			'province'    :province,
    			'district'    :district,
    			'commune'     :commune,
    			'village'     :village,
    			'loans'       :arr_loan
    			
    	
    	};
    	console.log(data);
    	var token = $('#_csrf').attr('content');
    	var header = $('#_csrf_header').attr('content');
    	console.log(data);
    	$.ajax({
    		type:'POST',
     		contentType : 'application/json; charset=utf-8',
            dataType : 'json',
    		url :'/khmoney/loan/loan-save-edit-only-rate',
    		data: JSON.stringify(data),
    		beforeSend: function(xhr) {
                xhr.setRequestHeader(header, token)
             },
             complete:function(xhr,statu){
     			var json = $.parseJSON(xhr.responseText);
     			console.log(json);
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

function moneyType (){
	
	$('#rate_total_money').val('');
	$('#rate_rate').val('');
	$('#rate_payment_time').val('');
	
	var money_type = ' ៛';
	var money_num  = '999999999';
	var dec_type   = 0   ;
	if ($('input[type=radio][name=money_type]:checked').val() == 'D' ){
		money_type = ' $';
		money_num  = '999999';
		dec_type   = 2   ;
		
	}
	
	$('#rate_total_money').autoNumeric('update',{ aSign: money_type,aSep:',',sGropu:'3',pSign: 's',aPad: false,vMax: money_num,vMin: '0'});
	
    
	if ($('#rate_type option:selected').val() == '2'){
		$('#rate_rate').autoNumeric('update', { aSign: money_type,aSep:',',sGropu:'3',pSign: 's',aPad: false,vMax: money_num,vMin: '0',mDec : dec_type});
	}else{
		$('#rate_rate').autoNumeric('update', { aSign: ' %',pSign: 's',aPad: false,vMax: '99',vMin: '00.00',mDec: 2});
	}
    
}
