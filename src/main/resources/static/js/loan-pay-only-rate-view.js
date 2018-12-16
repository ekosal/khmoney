$(document).ready(function(){
	init();		
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
				console.log(json);				
				loadingInformationLoaner(json);
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
		
		$.ajax({
			type:'GET',
			url :'/khmoney/loadingLoanEdit',
			data:data,
			complete:function(xhr,statu){
				var json = $.parseJSON(xhr.responseText);
				//console.log(json);				
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
		   console.log(json);
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
		    	$('#first_date_txt').val(moment(json.object.loanObject.start_dt).format('DD/MM/YYYY'));	
		    	$("#total_money_txt").val(Common.numberWithComma(json.object.loanObject.total_money) +money_type);
		    	$('#total_money_kh').val(Common.khmerMoney(json.object.loanObject.total_money) + money_type1);	
		    	$('#start_date_txt').val(moment(json.object.loanObject.start_dt).format('DD/MM/YYYY'));
		    	$('#pay_time_money').val(Common.numberWithComma(json.object.loanObject.time) + ' ដង');
		    	$('#type_payment_txt').val(a);
		    	$('#type_money_txt').val(money_type1);
		    	//$('#money_one_payment').val(Common.numberWithComma(json.object.loanPaymentList[0].prak_derm) + ' ៛');
		    	$('#agent_txt').val(json.object.loanObject.user.full_name);
		    
			    
			 /*   var tt = ((parseInt(json.object.loanObject.total_money) / parseInt(json.object.loanObject.time) ) * parseFloat(json.object.loanObject.rate)) / 100;
			    tt = Math.round(tt);
			    var total_rate = Common.ConvertZeroTwoDigit(tt+'');
			   if (parseInt(json.object.loanObject.decrement) > 0){
				   tt = (parseInt(json.object.loanObject.total_money) * parseFloat(json.object.loanObject.rate)) / 100;
				   total_rate = Common.ConvertZeroTwoDigit(tt+'');
			   }*/
				
			   $('#first_date_txt').val(moment(start_dt).format('DD/MM/YYYY'));
			  /* $('#rate_money_txt').val(json.object.loanObject.rate + ' %');*/
				$('#rate_money_txt').val(rate);
		    	$('#type_payment_txt').val(a)	
			  // $('#decrement_txt').val(Common.numberWithComma(json.object.loanObject.decrement) + ' ៛');
			   $('#agent_txt').val(json.object.loanObject.user.full_name);
			  
		 

		    var dt         = moment(json.object.loanObject.start_dt).format('DD/MM/YYYY').split('/');
		    var start_dt = new Date(dt[2],dt[1]-1,dt[0],0,0,0);
		               day = json.object.loanObject.count_day;
			start_dt.setDate(start_dt.getDate()+ parseInt(day));
			
		 
			  
		   var tbl = '', d = 0;
			$('#tbl_lst1 tbody').empty();
			$('#tbl_lst1 tbody').show();
		   $.each(json.object.loanPaymentList,function(index,value){
			
				var bg = '';
				if (value.txt == '9'){
					bg = 'payment_already';
				}else if(value.txt == '2'){
					bg = 'payment_all';
				}
				
				var prak_derm = '';
				if (value.prak_derm == '0' || value.prak_derm == null ){
					prak_derm = '-';
				}else{
					prak_derm = value.prak_derm + money_type ;
				}
				
				var user = '' ;				
				if ( value.loan.user != null ){
					user = value.loan.user.full_name;
				}
				
				var end_dt = '';
				if ( value.txt == '9' ){
					end_dt = moment(value.end_dt).format('DD/MM/YYYY');
				}
				
				
			   tbl += '<tr>'
				     +'<td class="'+bg+'"><div class="t_center"               >   <input type="checkbox"/>                    </div></td>'
					 +'<td class="'+bg+'"><div class="t_center"               >' + (index+1)                                +'</div></td>'
					 +'<td class="'+bg+'"><div class="t_center"               >' + Common.ConvertDayToKhmer(start_dt)       +'</div></td>'
					 +'<td class="'+bg+'"><div class="t_right tbl_start_date" >' + moment(start_dt).format('DD/MM/YYYY')    +'</div></td>'
					 +'<td class="'+bg+'"><div class="t_right"                >' + Common.numberWithComma(prak_derm)        +'</div></td>'
					 +'<td class="'+bg+'"><div class="t_right tbl_payment"    >' + Common.numberWithComma(value.total_rate) + money_type +'</div></td>'
					 +'<td class="'+bg+'"><div class="t_right tbl_payment"    >' + Common.numberWithComma(value.total_left) + money_type +'</div></td>'				 
					 +'<td class="'+bg+'"><div class="t_center"               >' + user                                     +'</div></td>'
					 +'<td class="'+bg+'"><div class="t_center"               >' + end_dt                                   +'</div></td>'
					 +'<td class="'+bg+'"><div class="t_right tbl_payment"    >' + value.note                               +'</div></td>'					
				+'</tr>';
			   
				if (index==1){
			    	$('#end_date_db').val(moment(start_dt).format('YYYYMMDD'));
			    }
			    start_dt.setDate(start_dt.getDate() + parseInt(day));	 
			    	
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
		    var start_dt = new Date(dt[2],dt[1]-1,dt[0],0,0,0);
		               day = json.object.loanerObject[0].count_day;
			start_dt.setDate(start_dt.getDate()+ parseInt(day));
		   $('#first_date_txt').val(moment(start_dt).format('DD/MM/YYYY'));
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
					+'<td><div class="t_center">'+Common.ConvertDayToKhmer(start_dt)   +'</div></td>'
					+'<td><div class="t_right tbl_start_date">' +moment(start_dt).format('DD/MM/YYYY')+'</div></td>'
					+'<td style="display:none;"><div class="t_right tbl_prak_derm"></div></td>'
					+'<td style="display:none;"><div class="tbl_total_rate"></div></td>'
					+'<td><div class="t_right tbl_payment">'+c+'</div></td>'
					+'<td><div></div></td>'
					+'<td style="display:none;"><div class="t_right tbl_left"></div></td>'
					+'<td style="display:none;"><div></div></td>'
					+'<td style="display:none;"><div></div></td>'
				+'</tr>';
				if (index==1){
			    	$('#end_date_db').val(moment(start_dt).format('YYYYMMDD'));
			    }
			    start_dt.setDate(start_dt.getDate() + parseInt(day));	 
			    d = parseInt(d) + parseInt(json.object.loanerObject[0].decrement);	
		   });
			$('#tbl_lst1 tfoot').hide();
			$('#tbl_lst1 tbody').append(tbl);
		},error:function(json){
			console.log(json);
		}
	});
}

