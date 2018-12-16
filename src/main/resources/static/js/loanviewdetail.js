$(document).ready(function(){
	init();		
	var url = $('#link-url').attr('href') + window.location.hash ;
	$('#link-url').attr('href',url);
	$('#type_payment').change(function(){
		loanShowBytime();
	});
	$('#btn_print').click(function(){
		$(".wrap").printElement({
				overrideElementCSS:[
				'/khmoney/css/print.css', 
				{ href:'/khmoney/css/print.css',media:'print'}] 
			}); 

	});
});

function init(){
	$('#loading').bPopup();
	/*
	 * we click from form loaner so you didn't have loan_id
	 */	
	if ($('#loan_id').val() == ''){
		$.ajax({
			type:'GET',
			url :'/khmoney/loadingLoanview',
			data:'loaner_id='+$('#loaner_id').val()+'&id='+$('#id').val(),
			complete:function(xhr,statu){
				var json = $.parseJSON(xhr.responseText);
						
				loadingInformationLoaner(json);
				console.log(json);		
			},error:function(json){
				console.log(json);
			}
		});
	}/* * we click from form loan so you didn't have loan_id * */
	else{
		var data = {
				'loaner_id':$('#loaner_id').val(),
				'loan_id'  :$('#loan_id').val(),
				'id'       :$('#id').val()
		}
		console.log(data);
		$.ajax({
			type:'GET',
			url :'/khmoney/loadingLoanEdit',
			data:data,
			complete:function(xhr,statu){
				var json = $.parseJSON(xhr.responseText);
				console.log(json);				
				loadingInformationLoaner(json);
			},error:function(json){
				console.log(json);
			}
		});
	}
	$('#loading').bPopup().close();
	
}
/* * loading All information of loaner * */
function loadingInformationLoaner(json){	
		   //console.log('elo',json);
		   
			if (json.status != '0000'){
				Message.infor(null,json.message);   
				return;
			}
			$('#loaner_code').val(Common.numberWithComma(Common.leftPage(json.object.loanObject.loaner.loaner_id,9),"-"));
		    $('#loaner_name').val(json.object.loanObject.loaner.loaner_name);
		    $('#id_card').val(Common.phoneWithComma(json.object.loanObject.loaner.id_card));
		    $('#phone').val(Common.phoneWithComma(json.object.loanObject.loaner.phone_nm));
		    $('input[name=gender][value='+json.object.loanObject.loaner.gender+']').prop('checked',true);
		    $('#address').val('ខេត្ត '+json.object.loanObject.loaner.province.name_kh + '  ស្រុក  '+json.object.loanObject.loaner.district.name_kh + '  ឃុំ  '+json.object.loanObject.loaner.commune.name_kh+'  ភូមិ  '+json.object.loanObject.loaner.village.name_kh);
			
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
		    
		    console.log(json.object.loanObject.payment_type);
		    
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
    	
		    var dt         = moment(json.object.loanObject.start_dt).format('DD/MM/YYYY').split('/');
		    var start_date = new Date(dt[2],dt[1]-1,dt[0],0,0,0);
		               day = json.object.loanObject.count_day;
			start_date.setDate(start_date.getDate()+ parseInt(day));
	    			    
		    if (json.object.loanObject.loan_type == '3'){
		    	$('#c_form_information').show();
		    	$('#form_information').hide();
		    	$('.right_box label').hide();
		    	
		    	$('#c_loan_code').val(Common.numberWithComma(Common.leftPage(json.object.loanObject.loan_id,9),"-"));
		    	$('#c_first_date_txt').val(moment(json.object.loanObject.start_dt).format('DD/MM/YYYY'));	
		    	$("#c_total_money_txt").val(Common.numberWithComma(json.object.loanObject.total_money) +money_type);
		    	$('#c_total_money_kh').val(Common.khmerMoney(json.object.loanObject.total_money) + money_type1);	
		    	$('#c_start_date_txt').val(moment(json.object.loanObject.start_dt).format('DD/MM/YYYY'));
		    	$('#c_time_payment').val(Common.numberWithComma(json.object.loanObject.time) + ' ដង');
		    	$('#c_type_payment_txt').val(a);
		    	$('#c_money_one_payment').val(Common.numberWithComma(json.object.loanPaymentList[0].prak_derm) + money_type);
		    	$('#c_agent_txt').val(json.object.loanObject.user.full_name);
		    }else{
		    	$('#c_form_information').hide();
		    	$('#form_information').show();
		    	$('#loan_code').val(Common.numberWithComma(Common.leftPage(json.object.loanObject.loan_id,9),"-"));
			    $('#total_money_txt').val(Common.numberWithComma(json.object.loanObject.total_money) +money_type);
			    $('#total_money_kh').val(Common.khmerMoney(json.object.loanObject.total_money) + money_type1);
			    $('#time_txt').val(Common.numberWithComma(json.object.loanObject.time) + ' ដង');
			    $('#start_date_txt').val(moment(json.object.loanObject.start_dt).format('DD/MM/YYYY'));
			    $('#type_payment_txt').val(a);
			    $('#rate_db').val(json.object.loanObject.rate);
			    $('#type_payment_db').val(json.object.loanObject.payment_type);
			    $('#day_db').val(json.object.loanObject.count_day);
			    
			    var tt = ((parseInt(json.object.loanObject.total_money) / parseInt(json.object.loanObject.time) ) * parseFloat(json.object.loanObject.rate)) / 100;
			  /*  tt = Math.round(tt);
			    var total_rate = Common.ConvertZeroTwoDigit(tt+'');
			    if (parseInt(json.object.loanObject.decrement) == '2'){
				   tt = (parseInt(json.object.loanObject.total_money) * parseFloat(json.object.loanObject.rate)) / 100;
				   total_rate = Common.ConvertZeroTwoDigit(tt+'');
			    }*/
				
			   $('#first_date_txt').val(moment(start_date).format('DD/MM/YYYY'));
			   $('#rate_money_txt').val(json.object.loanObject.rate + ' %') ;
			   $('#decrement_txt').val(Common.numberWithComma(json.object.loanObject.decrement) + money_type);
			   $('#agent_txt').val(json.object.loanObject.user.full_name);
			  
		    }


		   var tbl = '', d = 0;
			$('#tbl_lst1 tbody').empty();
			$('#tbl_lst1 tbody').show();
		   $.each(json.object.loanPaymentList,function(index,value){
			   var a = 0 ;
			   if (json.object.loanObject.loan_type == '3'){
		    	   a   = parseFloat(value.prak_derm)
			   }else if (json.object.loanObject.loan_type == '2'){
					if (tt - d > 0 ){				
						a   = parseFloat(value.total_rate)  + parseFloat(value.prak_derm) ;
						tem = parseFloat(value.total_rate)  + parseFloat(value.prak_derm) ;
					}else{
						a = tem ;	
					}

			    }else {
			    	a = parseFloat(tt) + parseFloat(value.prak_derm) ;
			    }
			   
			   var b = 0;
			   
			   if (json.object.loanObject.money_type == 'R'){
				   b = Common.ConvertZeroTwoDigit(Math.round(a)+'');
			   }else{
				   b = a.toFixed(2);
			   }
				
				var c = Common.numberWithComma(b+'') + money_type
				var bg = '';
				if (value.txt == '9'){
					bg = 'payment_already';
				}else if(value.txt == '2'){
					bg = 'payment_all';
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
				if (index==1){
			    	$('#end_date_db').val(moment(start_date).format('YYYYMMDD'));
			    }
			    start_date.setDate(start_date.getDate() + parseInt(day));	 
			    d = parseFloat(d) + parseFloat(json.object.loanObject.decrement);	
		   });
			$('#tbl_lst1 tfoot').hide();
			$('#tbl_lst1 tbody').append(tbl);
		
}
/* * one Loaner loan many time * */
function loanShowBytime(){
	
	$.ajax({
		type:'GET',
		url :'/khmoney/loanShowBytime',
		data:'loaner_id='+$('#loaner_id').val()+'&loan_id='+$('#type_payment').val(),
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

		    $('#loan_code').val(Common.numberWithComma(Common.leftPage(json.object.loanerObject[0].loan_id,9),"-"));
		    $('#total_money_txt').val(Common.numberWithComma(json.object.loanerObject[0].total_money) +' ៛');
		    $('#total_money_kh').val(Common.khmerMoney(json.object.loanerObject[0].total_money+'') + " ៛");
		    $('#time_txt').val(Common.numberWithComma(json.object.loanerObject[0].time) + ' ដង');
		    $('#start_date_txt').val(moment(json.object.loanerObject[0].start_dt).format('DD/MM/YYYY'));
		    
		    if (json.object.listtypePayment.length > 0){
		    	  $.each(json.object.listtypePayment,function(index, value){
				    	if (value.type == json.object.loanerObject[0].payment_type){
				    		 $('#type_payment_txt').val(value.columns);
				    	}
				    });
		    }
		  
		    
		    var tt = ((parseInt(json.object.loanerObject[0].total_money) / parseInt(json.object.loanerObject[0].time) ) * parseFloat(json.object.loanerObject[0].rate)) / 100;
		    tt = Math.round(tt);
		    var total_rate = Common.ConvertZeroTwoDigit(tt+'');
		   if (json.object.loanerObject[0].decrement != 0){
			   tt = (parseInt(json.object.loanerObject[0].total_money) * parseFloat(json.object.loanerObject[0].time)) / 100;
			   total_rate = Common.ConvertZeroTwoDigit(tt+'');
		   }
		   
		    var dt         = moment(json.object.loanerObject[0].start_dt).format('DD/MM/YYYY').split('/');
		    var start_date = new Date(dt[2],dt[1]-1,dt[0],0,0,0);
		               day = json.object.loanerObject[0].count_day;
			start_date.setDate(start_date.getDate()+ parseInt(day));
		   $('#first_date_txt').val(moment(start_date).format('DD/MM/YYYY'));
		   $('#rate_money_txt').val(Common.numberWithComma(total_rate) + ' ៛');
		   $('#decrement_txt').val(Common.numberWithComma(json.object.loanerObject[0].decrement) + ' ៛');
		   $('#agent').val(json.object.loanerObject[0].full_name);
		   
		   var tbl = '', d = 0;
			$('#tbl_lst1 tbody').empty();
			$('#tbl_lst1 tbody').show();
		   $.each(json.object.loanPaymentList,function(index,value){
			   var a = 0 ;
				if (parseInt(tt) - parseInt(d) > 0 ){
					a = (parseInt(tt) - parseInt(d)) + parseInt(value.prak_derm) ;
				}
				var b = Common.ConvertZeroTwoDigit(a+'');
				var c = Common.numberWithComma(b) + ' ៛'
			   tbl += '<tr>'
					+'<td><div class="t_center">'+index+'</div></td>'
					+'<td><div class="t_center">'+Common.ConvertDayToKhmer(start_date)   +'</div></td>'
					+'<td><div class="t_right tbl_start_date">' +moment(start_date).format('DD/MM/YYYY')+'</div></td>'
					+'<td style="display:none;"><div class="t_right tbl_prak_derm"></div></td>'
					+'<td style="display:none;"><div class="tbl_total_rate"></div></td>'
					+'<td><div class="t_right tbl_payment">'+c+'</div></td>'
					+'<td><div></div></td>'
					+'<td style="display:none;"><div class="t_right tbl_left"></div></td>'
					+'<td style="display:none;"><div></div></td>'
					+'<td style="display:none;"><div></div></td>'
				+'</tr>';
				if (index==1){
			    	$('#end_date_db').val(moment(start_date).format('YYYYMMDD'));
			    }
			    start_date.setDate(start_date.getDate() + parseInt(day));	 
			    d = parseInt(d) + parseInt(json.object.loanerObject[0].decrement);	
		   });
			$('#tbl_lst1 tfoot').hide();
			$('#tbl_lst1 tbody').append(tbl);
		},error:function(json){
			console.log(json);
		}
	});
}

