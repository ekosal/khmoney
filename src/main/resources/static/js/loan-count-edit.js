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
	});
	
	$(document).on('click','.btn_cancel,.btn_close',function(){
		$('#popup_loan_count').bPopup().close();
	});
	
	$('#type_payments').change(function(){
		selectTypePayment();
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
		
		$('#count_total_money').val('');
		$('#count_totalOneTime').val('');
		$('#count_payment_time').val('');
		
		var money_type = ' ៛'        ;
		var money_num  = '999999999' ;
		var dec_type   = 0           ;
		if ($('input[type=radio][name=money_type]:checked').val() == 'D' ){
			money_type = ' $';
			money_num  = '999999';
			dec_type   = 2       ;
		}
		$('#count_total_money').autoNumeric('update',  { aSign: money_type,aSep:',',sGropu:'3',pSign: 's',aPad: false,vMax: money_num,vMin: '0'});
		$('#count_totalOneTime').autoNumeric('update', { aSign: money_type,aSep:',',sGropu:'3',pSign: 's',aPad: false,vMax: money_num,vMin: '0',mDec : dec_type});

	    
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
	var data = {
			'loaner_id':$('#loaner_id').val(),
			'loan_id'  :$('#loan_id').val()
	}
	console.log(data);
	$.ajax({
		type:'GET',
		url :'/khmoney/loadingLoanEdit',
		data:data,
		complete:function(xhr,statu){
			var json = $.parseJSON(xhr.responseText);
			console.log(json);
			if (json.status == '901') {
                alert(json.message);
                window.location = json.path;
                return;
           }
			if (json.status == 'undefined'){
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
   	
	    	var money_type = ' ៛';
	    	var money_type1 = ' រៀល(៛)';
	    
    		if (json.object.loanObject.money_type == 'D' ){
    			money_type = ' $' ;
    			money_type1 = ' ដុលារ($)';
    		}
    	
	    	
	    	$('#loan_code').val(Common.numberWithComma(Common.leftPage(json.object.loanObject.loan_id,9),"-"));	
	    	$("#total_money_txt").val(Common.numberWithComma(json.object.loanObject.total_money) +money_type);
	    	$('#total_money_kh').val(Common.khmerMoney(json.object.loanObject.total_money) + money_type1);	
	    	$('#start_date_txt').val(moment(json.object.loanObject.start_dt).format('DD/MM/YYYY'));
	    	$('#time_payment').val(Common.numberWithComma(json.object.loanObject.time) + ' ដង');
	    	$('#type_payment_txt').val(a);
	    	$("#type_money_txt").val(money_type1);
	    	$('#money_one_payment').val(Common.numberWithComma(json.object.loanPaymentList[0].prak_derm) + money_type)	
	    	$('#agent_txt').val(json.object.loanObject.user.full_name);
	    	$('#type_loan').val(json.object.loanObject.loan_type);
	    	$('#rate_db').val(json.object.loanObject.rate);
	    	$('#rate_type_db').val(json.object.loanObject.rate_type);
	    	$('#money_type_db').val(json.object.loanObject.money_type);
	    	$('#day_db').val(json.object.loanObject.count_day);
	    	$('#type_payment_db').val(json.object.loanObject.payment_type);
	    
		    
		    var tt = ((parseInt(json.object.loanObject.total_money) / parseInt(json.object.loanObject.time) ) * parseFloat(json.object.loanObject.rate)) / 100;
		    tt = Math.round(tt);
		    var total_rate = Common.ConvertZeroTwoDigit(tt+'');
		   if (parseInt(json.object.loanObject.decrement) > 0){
			   tt = (parseInt(json.object.loanObject.total_money) * parseFloat(json.object.loanObject.rate)) / 100;
			   total_rate = Common.ConvertZeroTwoDigit(tt+'');
		   }

		    var dt         = moment(json.object.loanObject.start_dt).format('DD/MM/YYYY').split('/');
		    var start_dt = new Date(dt[2],dt[1]-1,dt[0],0,0,0);
		               day = json.object.loanObject.count_day;
			start_dt.setDate(start_dt.getDate()+ parseInt(day));
			
		
		   
		   var tbl = '', d = 0;
		   $('#tbl_lst1 tbody').empty();
		   $('#tbl_lst1 tbody').show();
		   $.each(json.object.loanPaymentList,function(index,value){
			    var a = 0 ;
			    if (json.object.loanObject.loan_type == '3'){
			    	   a   = value.prak_derm;
				    }
				
				var b = a;
			    if (json.object.loanObject.money_type == 'R'){
				   b = Common.ConvertZeroTwoDigit(a+'');
			    }
					
				var c = Common.numberWithComma(b) + money_type
				var bg = '';
				if (value.txt == '9'){
					bg = 'payment_already';
				}
			   tbl += '<tr>'
					+'<td class="'+bg+'"><div class="t_center">'+(index+1)+'</div></td>'
					+'<td class="'+bg+'"><div class="t_center">'+Common.ConvertDayToKhmer(start_dt)   +'</div></td>'
					+'<td class="'+bg+'"><div class="t_right tbl_start_dt">' +moment(start_dt).format('DD/MM/YYYY')+'</div></td>'
					+'<td style="display:none;"><div class="t_right tbl_prak_derm"></div></td>'
					+'<td style="display:none;"><div class="tbl_total_rate"></div></td>'
					+'<td class="'+bg+'"><div class="t_right tbl_payment">'+c+'</div></td>'
					+'<td class="'+bg+'"><div></div></td>'
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
		Message.infor(null,'សូមបញ្ចូលឈ្មោះអ្នកដែលខ្ចីប្រាក់!',null);
    	return;
    }
    if ($('#phone').val() == ''){
    	Message.infor(null,'សូមបញ្ចូលលេខទូរស័ព្ទអ្នកដែលខ្ចីប្រាក់!',null);
    	return;
    }
    if ($('#id_card').val() == ''){
    	Message.infor(null,'សូមបញ្ចូលអត្ដសញ្ញាណប័ណ្ណអ្នកដែលខ្ចីប្រាក់!',null);
    	return;
    }
    if ($('#list_provinces').val() == '0'){
    	Message.infor(null,'សូមបញ្ចូលខេត្ដអ្នកដែលខ្ចីប្រាក់រស់នៅ!',null);
    	return;
    }	
    if ($('#list_districts').val() == '0'){
    	Message.infor(null,'សូមបញ្ចូលស្រុកអ្នកដែលខ្ចីប្រាក់រស់នៅ!',null);
    	return;
    }	
    if ($('#list_communes').val() == '0'){
    	Message.infor(null,'សូមបញ្ចូលឃុំអ្នកដែលខ្ចីប្រាក់រស់នៅ!',null);
    	return;
    }	
    if ($('#list_village').val() == '0'){
    	Message.infor(null,'សូមបញ្ចូលភូមិអ្នកដែលខ្ចីប្រាក់រស់នៅ!',null);
    	return;
    }	

    $('input[type=radio][name=money_type][value="'+$('#money_type_db').val()+'"]').prop('checked',true);
    
    var money_type = ' ៛'        ;
	var money_num  = '9999999999';
	var dec_type   = 0           ;
	if ($('input[type=radio][name=money_type]:checked').val() == 'D' ){
		money_type = ' $';
		money_num  = '999999';
		dec_type   = 2       ;
	}
	$('#count_total_money').autoNumeric('update',  { aSign: money_type,aSep:',',sGropu:'3',pSign: 's',aPad: false,vMax: money_num,vMin: '0'});
	$('#count_totalOneTime').autoNumeric('update', { aSign: money_type,aSep:',',sGropu:'3',pSign: 's',aPad: false,vMax: money_num,vMin: '0',mDec : dec_type});

    
   
    // value from view to popup view
	$("#count_total_money").val($('#total_money_txt').val());
	$('#count_totalOneTime').val($('#money_one_payment').val());
	$('#count_payment_time').val($('#time_payment').val()); 
	$('#popup_start_date').val($('#start_date_txt').val());
	$('select[name="type_payment"] option[value="'+$('#type_payment_db').val()+'"]').attr('selected','selected');
	
	selectTypePayment();
	//  calculate count day  	
	var count_day =   $('#day_db').val() / parseInt($('#type_payments option:selected').attr('data'));
	
	// renew set "select[name="rate_count_day"]"
	var element = '';
	$('select[name="count_day"] > option').each(function(i,v){
		if ( v.value == count_day ){
			element += '<option value="'+v.value+'" selected>'+v.text+'</option>'
		}else{
			element += '<option value="'+v.value+'">'+v.text+'</option>'
		}
	});	
	$('#count_day').empty();
	$('#count_day').append(element);
	// end
    
    $('#popup_agent').val($('#agent_txt').val());
	$('#popup_loan_count').bPopup();
}



function confrimCheck(){
	var time,decrement=0,rate,total_money,total_rate,day;
	if ($('#popup_total_money').val() == '')
	{
		alert("សូមបញ្ចូលចំនួនទឹកប្រាក់សរុបដែលត្រូវខ្ចី!");
		$('#popup_total_money').focus();
		return;
	}
	
	if ($('input[name=rd_decrement]:checked').val() == 'decrement'){
		if ($('#popup_decrement').val() == ''){
			alert("សូមបញ្ចូលចំនួនទឹកប្រាក់ថយពីចំនួនទឹកប្រាក់សន្សំក្នុងពេលបង់មួយលើកៗ");
			$('#popup_decrement').focus();
			return;
		}		
	}
	
	if ($('#type_payment').val() == ''){
		alert("សូមជ្រើសរើសប្រភេទនៃការបង់ប្រាក់!");
		return;
	}
	/*if (!$('input[name=time]').is(':checked')){
		alert("សូមជ្រើសរើសចំនួនដងដែលត្រូវបង់ប្រាក់!")
		return;
	}*/
	if ($('#popup_time').val() == ''){
		alert("សូមជ្រើសរើសចំនួនដងដែលត្រូវបង់ប្រាក់!");
		return;
	}
	if ($('#popup_rate').val() == ''){
		alert("សូមបញ្ចូលអត្រាការប្រាក់ ដើម្បីទូរទាត់ការប្រាក់!");
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
	
	var total_money = $('#count_total_money').val().replace(/[​\u202f\៛\$\,]/g,'').trim();
	var payOneTime  = $('#count_totalOneTime').val().replace(/[​\u202f\៛\$\,]/g,'').trim();
	var countTime   = parseInt($('#count_payment_time').val());
	
	var dt         = $('#popup_start_date').val().split('/');
	var start_date = new Date(dt[2],dt[1]-1,dt[0],0,0,0);
               day =parseInt($('#type_payments option:selected').attr('data')) * parseInt($('#count_day').val());
	start_date.setDate(start_date.getDate()+ parseInt(day));
	
	$('#first_date_txt').val(moment(start_date).format('DD/MM/YYYY'));	
	$("#total_money_txt").val($('#count_total_money').val());
	$('#total_money_kh').val(Common.khmerMoney(total_money) + money_type_txt);	
	$('#start_date_txt').val(moment(start_date).format('DD/MM/YYYY'));
	$('#time_payment').val($('#count_payment_time').val() );
	$('#type_payment_txt').val( $('#count_day').val() + $('#type_payments option:selected').text() + ' / ' + 'បង់ម្ដង');
	$('#money_one_payment').val($('#count_totalOneTime').val())	
	$('#agent_txt').val($('#popup_agent').val());
	$('#type_loan').val("3");
	$('#day_db').val(day);
	$('#rate_db').val('0.0');
	$('#rate_type_db').val('0')
	$('#money_type_db').val($('input[type=radio][name=money_type]:checked').val());
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
    var d = {
        	'prak_derm' : $('#money_one_payment').val().replace(/[​\u202f\៛\$\,]/g,'').trim()
        }
        var dd = [];
        dd.push(d);
        
    	var loan = {
    			'start_dt'    :Common.formatDateToString($('#start_date_txt').val().trim()),
    			'loan_id'     :parseInt($('#loan_code').val().replace(/\-/g,'').trim()),
    			'total_money' :parseInt($('#total_money_txt').val().replace(/[​\u202f\៛\,]/g,'').trim()),
    			'rate'        :parseFloat($('#rate_db').val()),
    			'rate_money'  :parseFloat($('#rate_db').val()),
    			'rate_type'   :$('#rate_type_db').val(),
    			'money_type'  :$('#money_type_db').val(),
    			'payment_type':$('#type_payment_db').val(),
    			'time'        :parseInt($('#time_payment').val().replace(/[​\u202f\ដង\,]/g,'').trim()),
    			'decrement'   :0,
    			'count_day'   :$('#day_db').val(),
    			'loan_type'   :$('#type_loan').val(),
    			'loanpayments':dd
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
    	//console.log(data);
    	$.ajax({
    		type:'POST',
     		contentType : 'application/json; charset=utf-8',
            dataType : 'json',
    		url :'/khmoney/loanSaveEdititemCount',
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

function selectTypePayment(){
	var opt = '';
	if ($('#type_payments').val() == '1'){
		opt += '<option  value="1"> 1 ថ្ងៃ</option>';
		opt += '<option  value="2"> 2 ថ្ងៃ</option>';
		opt += '<option  value="3"> 3 ថ្ងៃ</option>';
		opt += '<option  value="4"> 4 ថ្ងៃ</option>';
		opt += '<option  value="5"> 5 ថ្ងៃ</option>';
	}else if ( $('#type_payments').val() == '2'){
		opt += '<option  value="1"> 1 អាទិត្យ</option>';
		opt += '<option  value="2"> 2 អាទិត្យ</option>';
		opt += '<option  value="3"> 3 អាទិត្យ</option>';
	}
	else if ( $('#type_payments').val() == '3'){
		opt += '<option  value="1"> 1 ខែ</option>';
		opt += '<option  value="2"> 2 ខែ</option>';
		opt += '<option  value="3"> 3 ខែ</option>';
		opt += '<option  value="4"> 4 ខែ</option>';
		opt += '<option  value="5"> 5 ខែ</option>';
		opt += '<option  value="6"> 6 ខែ</option>';
		
	}
	else if ( $('#type_payments').val() == '4'){
		opt += '<option  value="1"> 1 ឆ្នាំ</option>';
		opt += '<option  value="2"> 2 ឆ្នាំ</option>';			
	}
	$('#count_day').empty();
	$('#count_day').append(opt);
}