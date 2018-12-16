$(document).ready(function(){
	init();	
	
	var url = $('#link-url').attr('href') + window.location.hash ;
	$('#link-url').attr('href',url);
	
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
		$('#popup_loan').bPopup().close();
	});
	
	$('#type_payment').change(function(){
		selectPayType();
	});
	
	$('input[name="rd_decrement"]').change(function(){
		$('#loadingDecrementTypeValue').hide();
		if($(this).val() == '2'){
			$('#loadingDecrementTypeValue').show();
			
		}
		
	});
	
	$('.btn_confirm').click(function(){
		$('#loading').bPopup();
		confrimCheck();
		$('#loading').bPopup().close();
	});
	
	$('#btn_save').click(function(){
		
		if ($('#type_loan').val() == '3'){
			loanSaveEdititemCount();
		}else{
			loanSaveEdittem();
		}
		
		
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
		
		$('#popup_total_money').val('');
		$('#popup_decrement').val('')  ;
		$('#popup_time').val('')       ;
		$('#popup_rate').val('')       ;
		
		$('#type_payment option[value="3"]').attr('selected','selected');
		
		selectPayType();
		
		Common.datePicker('popup_start_date');
		
		var money_type = ' ៛'        ;
		var money_num  = '999999999';
		var dec_type   = 0           ;
		
		if ($('input[type=radio][name=money_type]:checked').val() == 'D' ){
			money_type = ' $'     ;
			money_num  = '999999';
			dec_type   = 2       ;
		}
		$('#popup_total_money').autoNumeric('update',{ aSign: money_type,aSep:',',sGropu:'3',pSign: 's',aPad: false,vMax: money_num,vMin: '0'});
		$('#popup_decrement').autoNumeric('update',  { aSign: money_type,aSep:',',sGropu:'3',pSign: 's',aPad: false,vMax: money_num,vMin: '0',mDec : dec_type});

	    
	});

});

function init(){
	$('#loading').bPopup();
	loanerGetMaxId();
	Common.datePicker('popup_start_date');
	$('#popup_total_money').autoNumeric('init',{ aSign: '​​ ៛' ,aSep :',' ,sGropu:'3'   ,pSign: 's' ,aPad: false  ,vMax: '999999999',vMin: '0'});
	$('#popup_time').autoNumeric('init',       { aSign: '​​ ដង',pSign: 's',aPad  : false,vMax : '99',vMin: '0'    });
	$('#popup_rate').autoNumeric('init',       { aSign: ' %' ,pSign: 's',aPad  : false,vMax : '99',vMin: '00.00',mDec: 2,});
	$('#popup_decrement').autoNumeric('init',  { aSign: '​​ ៛'  ,aSep :',' ,sGropu:'3'  ,pSign : 's' ,aPad: false ,vMax: '999999',vMin: '0'});
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
				 Message.infor(null,json.message,Common.redictPage,json.path);
                return;
           }
			if (json.status == 'undefined' || json.status != '0000'){
				 Message.infor(null,json.message);
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
	    	
	    	var rate = json.object.loanObject.rate + ' %';
	    	var money_type  = ' ៛'        ;
	    	var money_type1 = ' រៀល(៛)'    ;
	    	var dec_type    = 0           ;
	    	var money_num   = '9999999999';
	    	
    		if (json.object.loanObject.money_type == 'D' ){
    			money_type  = ' $'     ;
    			money_type1 = ' ដុលារ($)';
    			dec_type    = 2        ;
    			money_num   = '9999999';
    		}
    		
    		var dt         = moment(json.object.loanObject.start_dt).format('DD/MM/YYYY').split('/');
  		    var start_date = new Date(dt[2],dt[1]-1,dt[0],0,0,0);
  		               day = json.object.loanObject.count_day;
  			start_date.setDate(start_date.getDate()+ parseInt(day));

    		$('#popup_total_money').autoNumeric('update',{ aSign: money_type,aSep:',',sGropu:'3',pSign: 's',aPad: false,vMax: money_num,vMin: '0'});
    		$('#popup_decrement').autoNumeric('update',  { aSign: money_type,aSep:',',sGropu:'3',pSign: 's',aPad: false,vMax: money_num,vMin: '0',mDec : dec_type});

   	
	    	$('#loan_code').val(Common.numberWithComma(Common.leftPage(json.object.loanObject.loan_id,9),"-"));
		    $('#total_money_txt').val(Common.numberWithComma(json.object.loanObject.total_money) +money_type);
		    $('#total_money_kh').val(Common.khmerMoney(json.object.loanObject.total_money) + money_type1);
		    $('#time_txt').val(Common.numberWithComma(json.object.loanObject.time) + ' ដង');
		    $('#start_date_txt').val(moment(json.object.loanObject.start_dt).format('DD/MM/YYYY'));
		    $('#type_payment_txt').val(a);
		    $('#rate_db').val(json.object.loanObject.rate);
		    
				
		   $('#first_date_txt').val(moment(start_date).format('DD/MM/YYYY'));
		   $('#rate_money_txt').val(json.object.loanObject.rate + ' %');
		   $('#decrement_txt').val(Common.numberWithComma(json.object.loanObject.decrement) + money_type);
		   $('#agent_txt').val(json.object.loanObject.user.full_name);
		  
		
		    $('#type_payment_db').val(json.object.loanObject.payment_type);
		    $('#day_db').val(json.object.loanObject.count_day);
		    $('#type_loan').val(json.object.loanObject.loan_type);
		    $('#agent').val(json.object.loanObject.user.full_name);
		    $('#rate_db').val(json.object.loanObject.rate);
	    	$('#rate_type_db').val(json.object.loanObject.rate_type);
	    	$('#money_type_db').val(json.object.loanObject.money_type);
		  
			
		
	       var tt = ((parseInt(json.object.loanObject.total_money) / parseInt(json.object.loanObject.time) ) * parseFloat(json.object.loanObject.rate)) / 100;
		   var tbl = '', d = 0,tem = 0;;
		   $('#tbl_lst1 tbody').empty();
		   $('#tbl_lst1 tbody').show();
		   $.each(json.object.loanPaymentList,function(index,value){
			    var a = 0 ;
			    if (json.object.loanObject.type_loan == '3'){
			    	   a   = parseInt(value.prak_derm)
			    }else if (json.object.loanObject.loan_type == '2'){
			    	
						if (tt - d > 0 ){				
							a   = parseFloat(value.total_rate)  + parseFloat(value.prak_derm) ;
							tem = parseFloat(value.total_rate)  + parseFloat(value.prak_derm) ;
						}else{
							a = tem ;	
						}

			    }else {
			    	a = parseFloat(value.total_rate) + parseFloat(value.prak_derm) ;
			    }
			    
			   if (json.object.loanObject.money_type == 'R'){
				   b = Common.ConvertZeroTwoDigit(Math.round(a) +'');
			   }else{
				   b = a.toFixed(2);
			   }
					
				var c = Common.numberWithComma(b+'') + money_type
				var bg = '';
				if (value.txt == '9'){
					bg = 'payment_already';
				}
			   tbl += '<tr>'
					+'<td class="'+bg+'"><div class="t_center">'+(index+1)+'</div></td>'
					+'<td class="'+bg+'"><div class="t_center">'+Common.ConvertDayToKhmer(start_date)   +'</div></td>'
					+'<td class="'+bg+'"><div class="t_right tbl_start_date">' +moment(start_date).format('DD/MM/YYYY')+'</div></td>'
					+'<td style="display:none;"><div class="t_right tbl_prak_derm"></div></td>'
					+'<td style="display:none;"><div class="tbl_total_rate"></div></td>'
					+'<td class="'+bg+'"><div class="t_right tbl_payment">'+c+'</div></td>'
					+'<td class="'+bg+'"><div></div></td>'
					+'<td style="display:none;"><div class="t_right tbl_left"></div></td>'
					+'<td style="display:none;"><div></div></td>'
					+'<td style="display:none;"><div></div></td>'
				+'</tr>';
			   
			    start_date.setDate(start_date.getDate() + parseInt(day));	 
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
	// 0. 
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
	
	// 1 
    $('input[type=radio][name=money_type][value="'+$('#money_type_db').val()+'"]').prop('checked',true);
    
    // 2.
    var money_type     = ' ៛'     ;
	var money_type_txt = ' រៀល​ (៛)';
	var money_num  = '9999999999';
	var dec_type   = 0           ;
	
	if ($('input[type=radio][name=money_type]:checked').val() == 'D' ){
		money_type     = ' $'     ;
		money_type_txt = ' ដុលារ($)';
		money_num      = '9999999';
		dec_type       = 2        ;
	}
	
	$('#popup_total_money').autoNumeric('update',{ aSign: money_type,aSep:',',sGropu:'3',pSign: 's',aPad: false,vMax: '999999999',vMin: '0'});
	$('#popup_decrement').autoNumeric('update', { aSign: money_type,aSep:',',sGropu:'3',pSign: 's',aPad: false,vMax: money_num,vMin: '0',mDec : dec_type});

	// 3.
    $('#popup_agent').val($('#agent').val()); 
    $('#popup_start_date').val($('#start_date_txt').val());
	$('#popup_total_money').val($("#total_money_txt").val());
	$('#popup_time').val($('#time_txt').val());	
	$('#popup_rate').val($('#rate_money_txt').val());
	$('input[name=rd_decrement][value='+$('#type_loan').val()+']').prop('checked',true);
	$('#type_payment option[value="'+$('#type_payment_db').val()+'"]').attr('selected','selected');
	// date type by #type_payment
	selectPayType();
	
    //  calculate count day  	
	var count_day =   $('#day_db').val() / parseInt($('#type_payment option:selected').attr('data'));
	
	// renew set "select[name="rate_count_day"]"
	var element = '';
	$('select[name="popu_count_day"] > option').each(function(i,v){
		if ( v.value == count_day ){
			element += '<option value="'+v.value+'" selected>'+v.text+'</option>'
		}else{
			element += '<option value="'+v.value+'">'+v.text+'</option>'
		}
	});	
	$('#popu_count_day').empty();
	$('#popu_count_day').append(element);
	// end
	
	
	if ($('#type_loan').val() == '2' ){
		$('#loadingDecrementTypeValue').show();
		$('#popup_decrement').val($('#decrement_txt').val());
	}
	// 4.
	$('#popup_loan').bPopup();
}



function confrimCheck(){
	var time,decrement=0,rate,total_money,total_rate,day;
	if ($('#popup_total_money').val() == '')
	{
		alert("សូមបញ្ចូលចំនួនទឹកប្រាក់សរុបដែលត្រូវខ្ចី!");
		$('#popup_total_money').focus();
		return;
	}
	
	if ($('input[name=rd_decrement]:checked').val() == '2'){
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
	 
	total_money = $('#popup_total_money').val().replace(/[​\u202f\៛\$\,]/g,'').trim();
	
	time = $('#popup_time').val().replace(/[​\u202f\ដង\,]/g,'');
	rate = $('#popup_rate').val().replace(/[​\u202f\%\,]/g,'');
	
	var dt         = $('#popup_start_date').val().split('/');
	var start_date = new Date(dt[2],dt[1]-1,dt[0],0,0,0);
               day = $('#type_payment option:selected').attr('data') * parseInt($('#popu_count_day').val());;
	start_date.setDate(start_date.getDate()+ parseInt(day));
	
	/*calculate rate and total money*/
	var tt         = ((parseInt(total_money) / time ) * parseFloat(rate)) / 100;
	var total_rate = Common.ConvertZeroTwoDigit(tt+'');
	var prak_derm  = parseInt(total_money) / time     ;	
	
	$('#type_loan').val('1');
	if ($('input[name=rd_decrement]:checked').val() == '2'){
		decrement = parseFloat($('#popup_decrement').val().replace(/[​\u202f\៛\$\,]/g,'').trim());
		$('#type_loan').val('2');
	}else{
		decrement = 0;
	}
	
	$('#first_date_txt').val(moment(start_date).format('DD/MM/YYYY'));	
	$("#total_money_txt").val($('#popup_total_money').val());
	$('#total_money_kh').val(Common.khmerMoney(total_money) + money_type_txt);
	$('#type_payment_txt').val($('#popu_count_day option:selected').val()+' '+$('#type_payment option:selected').text() + '/​ បង់ម្ដង');
	$('#start_date_txt').val($('#popup_start_date').val());
	$('#time_txt').val(time+' ដង');
	$('#rate_money_txt').val($('#popup_rate').val())
	$('#decrement_txt').val(Common.numberWithComma(decrement)+ money_type);
	$('#agent_txt').val($('#agent').val());
	
	$('#rate_db').val(rate);
	$('#money_type_db').val($('input[type=radio][name=money_type]:checked').val());
	$('#type_payment_db').val($('#type_payment option:selected').val());
	$("#day_db").val(day);
	

	
	var tbl = '', d = 0, tem = 0;
	$('#tbl_lst1 tbody').empty();
	$('#tbl_lst1 tbody').show();
	for (var i = 1; i <= time; i++){
		var a = 0 ;
		if ($('input[type=radio][name=rd_decrement]:checked').val() == '2'){
			console.log(d);
			if (tt - d > 0 ){				
				a   = (tt - d) + prak_derm ;
				tem = (tt - d) + prak_derm;
			}else{
				a = tem ;	
			}
		}else{
			
			a = tt + prak_derm ;
			
		}
		
		var b = 0;
		if ($('input[type=radio][name=money_type]:checked').val() == 'D'){
			b = a.toFixed(2);
		}else{
			b = Common.ConvertZeroTwoDigit(Math.round(a)+'');
		}
		
		var c = Common.numberWithComma(b) + money_type
		
		var left =  parseInt(total_money) -  (parseInt(prak_derm) * i)
		
		tbl += '<tr>'
					+'<td><div class="t_center">'+i+'</div></td>'
					+'<td><div class="t_center">'+Common.ConvertDayToKhmer(start_date)   +'</div></td>'
					+'<td><div class="t_right tbl_start_date">' +moment(start_date).format('DD/MM/YYYY')+'</div></td>'
					+'<td style="display:none;"><div class="t_right tbl_prak_derm">'+prak_derm+'</div></td>'
					+'<td style="display:none;"><div class="tbl_total_rate">'+(parseInt(tt) - parseInt(d))+'</div></td>'
					+'<td><div class="t_right tbl_payment">'+c+'</div></td>'
					+'<td><div></div></td>'
					+'<td style="display:none;"><div class="t_right tbl_left">'+left+'</div></td>'
					+'<td style="display:none;"><div></div></td>'
					+'<td style="display:none;"><div></div></td>'
				+'</tr>';
		
		//set end date
	    start_date.setDate(start_date.getDate() + parseInt(day));	 
	    d = d + decrement;
	   
	}
	$('#tbl_lst1 tfoot').hide();
	$('#tbl_lst1 tbody').append(tbl);
	$('#popup_loan').bPopup().close();
}


function loanSaveEdittem(){	
    $('#loading').bPopup();	
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
    
    // if money == D can decimal 
    var decrement;
    if ($('#money_type_db').val() == 'R'){
    	decrement = parseInt($('#decrement_txt').val().replace(/[​\u202f\៛\,]/g,'').trim());
    }else{
    	decrement = parseFloat($('#decrement_txt').val().replace(/[​\u202f\៛\,]/g,'').trim());
    }
    
	var loan = {
			'start_dt'    :Common.formatDateToString($('#start_date_txt').val().trim()),
			'loan_id'     :parseInt($('#loan_code').val().replace(/\-/g,'').trim()),
			'total_money' :parseInt($('#total_money_txt').val().replace(/[​\u202f\៛\,]/g,'').trim()),
			'rate'        :parseFloat($('#rate_db').val()),
			'rate_money'  :0,
			'payment_type':$('#type_payment_db').val(),
			'time'        :parseInt($('#time_txt').val().replace(/[​\u202f\ដង\,]/g,'').trim()),
			'decrement'   :decrement,
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
	var token = $('#_csrf').attr('content');
	var header = $('#_csrf_header').attr('content');
	console.log(data);
	$.ajax({
		type:'POST',
 		contentType : 'application/json; charset=utf-8',
        dataType : 'json',
        data: JSON.stringify(data),
		url :'/khmoney/loanSaveUdateItem',
		beforeSend: function(xhr) {
            xhr.setRequestHeader(header, token)
         },
         complete:function(xhr,statu){
 			var json = $.parseJSON(xhr.responseText);
			if (json.status == '901') {
				 Message.infor(null,json.message,Common.redictPage,json.path);
                return;
           }
			if (json.status == 'undefined' || json.status !=  '0000'){
				Message.infor(null,json.message);
				return;
			}
			Message.infor(null,json.message);			
		},error:function(json){
			console.log(json)
		}
	});
	$('#loading').bPopup().close();
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
				Message.infor(null,json.message);
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
function selectPayType(){
	var opt = '';
	if ($('#type_payment').val() == '1'){
		opt += '<option  value="1"> 1 ថ្ងៃ</option>';
		opt += '<option  value="2"> 2 ថ្ងៃ</option>';
		opt += '<option  value="3"> 3 ថ្ងៃ</option>';
		opt += '<option  value="4"> 4 ថ្ងៃ</option>';
		opt += '<option  value="5"> 5 ថ្ងៃ</option>';
	}else if ( $('#type_payment').val() == '2'){
		opt += '<option  value="1"> 1 អាទិត្យ</option>';
		opt += '<option  value="2"> 2 អាទិត្យ</option>';
		opt += '<option  value="3"> 3 អាទិត្យ</option>';
	}
	else if ( $('#type_payment').val() == '3'){
		opt += '<option  value="1"> 1 ខែ</option>';
		opt += '<option  value="2"> 2 ខែ</option>';
		opt += '<option  value="3"> 3 ខែ</option>';
		opt += '<option  value="4"> 4 ខែ</option>';
		opt += '<option  value="5"> 5 ខែ</option>';
		opt += '<option  value="6"> 6 ខែ</option>';
		
	}
	else if ( $('#type_payment').val() == '4'){
		opt += '<option  value="1"> 1 ឆ្នាំ</option>';
		opt += '<option  value="2"> 2 ឆ្នាំ</option>';			
	}
	$('#popu_count_day').empty();
	$('#popu_count_day').append(opt);
}

