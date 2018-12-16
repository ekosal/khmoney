var statusLinkOn = 'pay_constand';
$(document).ready(function(){
	Common.datePickerRang('start_date','end_date');	
	checkUrlLink();
	
	$('#status').change(function(){
		if ($('#status').is(':checked')){
			$('#status_date').show();
		}else if (statusLinkOn == 'pay_constand'){
			pagConstand(1);
		}else if (statusLinkOn == 'pay_down'){
			pagDown(1);
		}else if (statusLinkOn == 'pay_count'){
			pagCount(1);
		}else{
			pageRatePayOnly(1);
		}
	});
	
	$('#tbl_search').click(function(){			
		if (statusLinkOn == 'pay_constand'){
			pagConstand(1);
		}else if (statusLinkOn == 'pay_down'){
			pagDown(1);
		}else if (obj == 'pay_down'){
			pagCount(1);
		}else if (statusLinkOn == 'pay_count'){
			pagCount(1);
		}else{
			pageRatePayOnly(1);
		}
	});
	$('#num_rows').change(function(){
		if (status == 'pay_constand'){
			pagConstand(1);
		}else if (obj == 'pay_down'){
			pagDown(1);
		}else if (obj == 'pay_count'){
			pagCount(1);
		}else{
			pageRatePayOnly(1);
		}
	});
});
function openTabLinke(evt, obj){
	
	$('.tabContents').hide();
	$('.tabLinks').parent('li').removeClass('on');
	$('#'+ obj).show();
	$(evt).parent('li').addClass('on');
	statusLinkOn = obj;
	if (obj == 'pay_constand'){
		pagConstand(1);
		
	}else if (obj == 'pay_down'){
		pagDown(1);
		
	}else if (obj == 'pay_count'){
		pagCount(1);
	}else{
		pageRatePayOnly(1);
	}
	// show button create new loan by tabLink
	checkTabLink();
	
}
function pagConstand(page){
	$('#loading').bPopup();
	var object = {
			'perPage'     : $('#num_rows').val(),
			'currentPage' : page,
			'search'      : $('#search').val(),
			'typePayment' : '',
			'startDate'   : '',
			'endDate'     : '',
			'decrementTxt': '',
			'loan_type'   : '1'
	}
	if ($('#status').is(':checked')){
		object['startDate'] = Common.formatDateToString($('#start_date').val().trim());
		object['endDate']   = Common.formatDateToString($('#end_date').val().trim());
	}
	if ($('#type_payment').val() != 'all'){
		object['typePayment']   = $('#type_payment').val();
	}
	//console.log(object);
	$.ajax({
		type:'GET',
		url :'/khmoney/loadingLoanListView',
		data:object,
		complete:function(xhr,statu){
			var json = $.parseJSON(xhr.responseText);
			console.log(json);
			if (json.status == '901') {
				Message.infor(null,json.message,Common.redictPage,json.path);              
                 return;
            }
			if (json.status == 'undefined' || json.status == '9999'){
				Message.infor(null,json.message);
				return;
			}
			var loanList = json.object.loanList;
			var typePayment = json.object.typePaymentList;
			var tbl = '',opt='<option value="">ទាំងអស់</option>';
			$('#pay_constand tbody').empty();
			$('#pay_constand tfoot').hide();
			$('#pay_constand tbody').show();

			if (loanList.length > 0 ){
				var i = (parseInt(page)-1) * parseInt($('#num_rows').text().replace(/[​\-]/g,''));
				$.each(loanList,function(index,value){
					var rate    = ((parseFloat(value.total_money) / parseFloat(value.time)) * parseFloat(value.rate)) / 100;
					if (value.loan_type == '3'){
						var total   = value.totalcount;
					}else{
						if (value.money_type == 'D'){
							var total   = parseFloat(rate) + (parseFloat(value.total_money) / parseFloat(value.time));
							    total   = total.toFixed(2);
						}else{
							var total   = parseFloat(rate) + (parseFloat(value.total_money) / parseFloat(value.time));
							total       = Common.ConvertZeroTwoDigit(Math.round(total)+'');
						}
						
					}
					
					var  tt     = Math.round(rate);
					    
				    var end_date  = '';
				    if (value.txt == '1'){
				    	end_date  = '';
				    }else{
				    	end_date = moment(value.end_date).format('DD/MM/YYYY');
				    }
				    var amount = '0';
				    //console.log(value.amount);
				    
				    
				    var money_symbol = ' ៛';				   
			    	if (value.money_type == 'D'){
			    		money_symbol = ' $';
			    		if (typeof value.amount != 'undefined' && typeof value.amount != ''){
					    	amount = Common.numberWithComma(value.amount);
					    }
			    	}else{
			    		if (typeof value.amount != 'undefined' && typeof value.amount != ''){
					    	amount = Common.numberWithComma(Common.ConvertZeroTwoDigit(Math.round(value.amount)+''));
					    }
			    	}
			    	
			    	
					tbl += '<tr>'
								/*+'<td><div class="t_center"><input type="checkbox"><input type="hidden" class="loaner_id" value="'+value.loaner_id+'"/></div></td>'*/
								+'<td><div>'+(i+1)+'</div></td>'
								+'<td><div>'+Common.numberWithComma(Common.leftPage(value.loan_id,9))+'</div></td>'
								+'<td><div>'+moment(value.start_dt).format('DD/MM/YYYY')+'</div></td>'
								+'<td><div class="t_right">'+Common.numberWithComma(value.total_money)+money_symbol+'</div></td>'
								+'<td><div class="t_right">'+value.rate+' %</div></td>'
								+'<td><div class="t_center">'+Common.numberWithComma(value.time)+' ដង</div></td>'
								+'<td><div class="t_right">'+Common.numberWithComma(total)+money_symbol+'</div></td>'
								+'<td><div class="t_right">'+amount+money_symbol+'</div></td>'
								+'<td><div>'+end_date+'</div></td>'
								+'<td><div class="t_center" style="margin:0px;text-decoration: underline;text-align:center;color:red;height: 20px;padding-top:10px;">'+(value.txt=='9'?'បានបញ្ចប់':'រង់ចាំ')+'</div></td>'
								+'<td><div><a href="/khmoney/loan/loan-view-detail?loaner_id='+value.loaner_id+'&loan_id='+value.loan_id+'&id=loan" style="width:30%;margin:0px;text-decoration: underline;text-align:center;color:blue;height:0px;">លំអិត</a>'
								+'         <a loan-type="'+value.loan_type+'" loan_id="'+value.loan_id+'" loaner_id="'+value.loaner_id+'" href="javascript:" onClick="loadingEditLoan(this)" txt="'+value.txt+'" style="width:30%;margin:0px;text-decoration: underline;text-align:center;color:blue;height:0px;">កែប្រែ</a>'
								+'         <a loan_id="'+value.loan_id+'" loaner_id="'+value.loaner_id+'" href="javascript:" onClick="Message.confirm(null,\'តើអ្នកពិតជាចង់លុបការខ្ចីប្រាក់នេះពិតមែន?\',loadingDeleteLoan,this);" txt="'+value.txt+'" style="width:30%;margin:0px;text-decoration: underline;text-align:center;color:blue;height:0px;">លុប</a></div></td>'
							+'</tr>';
					i++;
				});
			}else{
				$('#pay_constand tfoot').show();
				$('#pay_constand tbody').hide();
			}
			$('#pay_constand tbody').append(tbl);
			
			if ( json.object.pagination.total_page > 0 ){
				$('.paging_wrap').show();
			}else{
				$('.paging_wrap').hide();
			}
			 var option = {
        			total       : json.object.pagination.total_page,
    				maxVisible  : 10,
    				perPage     : $('#num_rows').val(),
    				currentPage : page,
    				numPage     : 1,
    				wrapClass   :'paging',
    				eventLink   :'pagConstand'
        	 }
		     pagination.showPage(option);
		     $('#loading').bPopup().close();
		},error:function(){
			
		}
	});
	
}
function pagDown(page){
	var object = {
			'perPage'     : $('#num_rows').val(),
			'currentPage' : page,
			'search'      : $('#search').val(),
			'typePayment' : '',
			'startDate'   : '',
			'endDate'     : '',
			'decrementTxt':'decrement',
			'loan_type'   : '2'
	}
	if ($('#status').is(':checked')){
	
		object['startDate'] = Common.formatDateToString($('#start_date').val().trim());
		object['endDate']   = Common.formatDateToString($('#end_date').val().trim());
	}
	if ($('#type_payment').val() != 'all'){
		object['typePayment']   = $('#type_payment').val();
	}
	console.log(object);
	$.ajax({
		type:'GET',
		url :'/khmoney/loadingLoanListView',
		data:object,
		complete:function(xhr,statu){
			var json = $.parseJSON(xhr.responseText);
			//console.log(json);
			if (json.status == '901') {
				Message.infor(null,json.message,Common.redictPage,json.path);
                return;
            }
			if (json.status == 'undefined' || json.status == '9999'){
				Message.infor(null,json.message);
				return;
			}
			var loanList = json.object.loanList;
			var typePayment = json.object.typePaymentList;
			var tbl = '',opt='<option value="">ទាំងអស់</option>';
			$('#pay_down tbody').empty();
			$('#pay_down tfoot').hide();
			$('#pay_down tbody').show();

			if (loanList.length > 0 ){
				var i = (parseInt(page)-1) * parseInt($('#num_rows').text().replace(/[​\-]/g,''));
				$.each(loanList,function(index,value){
					var rate      = (parseFloat(value.total_money) * parseFloat(value.rate)) / 100;					
				    var end_date  = '';
				    if (value.txt == '1'){
				    	end_date  = '';
				    }else{
				    	end_date = moment(value.end_date).format('DD/MM/YYYY');
				    }
				    var amount = '0';
				    //console.log(value.amount);
				    if (typeof value.amount != 'undefined' && typeof value.amount != ''){
				    	amount = Common.numberWithComma(Common.ConvertZeroTwoDigit(Math.round(value.amount)+''));
				    }
				    var money_symbol = ' ៛';				   
			    	if (value.money_type == 'D'){
			    		money_symbol = ' $';
			    	}
					tbl += '<tr>'
								/*+'<td><div class="t_center"><input type="checkbox"><input type="hidden" class="loaner_id" value="'+value.loaner_id+'"/></div></td>'*/
								+'<td><div>'+(i+1)+'</div></td>'
								+'<td><div>'+Common.numberWithComma(Common.leftPage(value.loan_id,9))+'</div></td>'
								+'<td><div>'+moment(value.start_dt).format('DD/MM/YYYY')+'</div></td>'
								+'<td><div class="t_right">'+Common.numberWithComma(value.total_money)+money_symbol+'</div></td>'
								+'<td><div class="t_right">'+value.rate+' %</div></td>'
								+'<td><div class="t_center">'+Common.numberWithComma(value.time)+' ដង</div></td>'
								+'<td><div class="t_right">'+Common.numberWithComma(value.decrement+'')+money_symbol+'</div></td>'
								+'<td><div class="t_right">'+amount+money_symbol+'</div></td>'
								+'<td><div>'+end_date+'</div></td>'
								+'<td><div class="t_center" style="text-decoration: underline;text-align:center;color:red;height: 20px;padding-top:10px;">'+(value.txt=='9'?'បានបញ្ចប់':'រង់ចាំ')+'</div></td>'
								+'<td><div><a href="/khmoney/loan/loan-view-detail?loaner_id='+value.loaner_id+'&loan_id='+value.loan_id+'&id=loan#loan-down" style="width:30%;margin:0px;text-decoration: underline;text-align:center;color:blue;height:0px;">លំអិត</a>'
								+'         <a loan-type="'+value.loan_type+'" loan_id="'+value.loan_id+'" loaner_id="'+value.loaner_id+'" href="javascript:;" onClick="loadingEditLoan(this)" txt="'+value.txt+'" style="width:30%;margin:0px;text-decoration: underline;text-align:center;color:blue;height:0px;">កែប្រែ</a>'
								+'         <a loan_id="'+value.loan_id+'" loaner_id="'+value.loaner_id+'" href="javascript:;" onClick="Message.confirm(null,\'តើអ្នកពិតជាចង់លុបការខ្ចីប្រាក់នេះពិតមែន?\',loadingDeleteLoan,this);" txt="'+value.txt+'" style="width:30%;margin:0px;text-decoration: underline;text-align:center;color:blue;height:0px;">លុប</a></div></td>'
							+'</tr>';
					i++;
				});
			}else{
				$('#pay_down tfoot').show();
				$('#pay_down tbody').hide();
			}
			//console.log(tbl);
			$('#pay_down tbody').append(tbl);
			
			if ( json.object.pagination.total_page > 0 ){
				$('.paging_wrap').show();
			}else{
				$('.paging_wrap').hide();
			}
			 var option = {
        			total       : json.object.pagination.total_page,
    				maxVisible  : 10,
    				perPage     : $('#num_rows').val(),
    				currentPage : page,
    				numPage     : 1,
    				wrapClass   :'paging',
    				eventLink   :'pagDown'
        	 }
		     pagination.showPage(option);
		     $('#loading').bPopup().close();
		},error:function(){
			
		}
	});
}

function pagCount(page){
	$('#loading').bPopup();
	var object = {
			'perPage'     : $('#num_rows').val(),
			'currentPage' : page,
			'search'      : $('#search').val(),
			'typePayment' : '',
			'startDate'   : '',
			'endDate'     : '',
			'decrementTxt': '',
			'loan_type'   : '3'
	}
	if ($('#status').is(':checked')){
		object['startDate'] = Common.formatDateToString($('#start_date').val().trim());
		object['endDate']   = Common.formatDateToString($('#end_date').val().trim());
	}
	
	if ($('#type_payment').val() != 'all'){
		object['typePayment']   = $('#type_payment').val();
	}
	console.log(object);
	$.ajax({
		type:'GET',
		url :'/khmoney/loadingLoanListView',
		data:object,
		complete:function(xhr,statu){
			var json = $.parseJSON(xhr.responseText);
			console.log(json);
			if (json.status == '901') {
				Message.infor(null,json.message,Common.redictPage,json.path);
                 return;
            }
			if (json.status == 'undefined' || json.status == '9999'){
				Message.infor(null,json.message);
				return;
			}
			var loanList = json.object.loanList;
			var typePayment = json.object.typePaymentList;
			var tbl = '',opt='<option value="">ទាំងអស់</option>';
			$('#pay_count tbody').empty();
			$('#pay_count tfoot').hide();
			$('#pay_count tbody').show();
		
			if (loanList.length > 0 ){
				var i = (parseInt(page)-1) * parseInt($('#num_rows').text().replace(/[​\-]/g,''));
				$.each(loanList,function(index,value){
					var rate    = ((parseInt(value.total_money) / parseInt(value.time)) * parseFloat(value.rate)) / 100;
					if (value.loan_type == '3'){
						var total   = value.totalcount;
					}else{
						var total   = parseFloat(rate) + (parseInt(value.total_money) / parseInt(value.time));
					}
					
					var  tt     = Math.round(rate);
					    total   = Math.round(total);
				    var end_date  = '';
				    if (value.txt == '1'){
				    	end_date  = '';
				    }else{
				    	end_date = moment(value.end_date).format('DD/MM/YYYY');
				    }
				    var amount = '0';
				    //console.log(value.amount);
				    if (typeof value.amount != 'undefined' && typeof value.amount != ''){
				    	amount = Common.numberWithComma(Common.ConvertZeroTwoDigit(Math.round(value.amount)+''));
				    }
				    
				   
				    var money_symbol = ' ៛';				   
			    	if (value.money_type == 'D'){
			    		money_symbol = ' $';
			    	}
				  
				    
					tbl += '<tr>'
								/*+'<td><div class="t_center"><input type="checkbox"><input type="hidden" class="loaner_id" value="'+value.loaner_id+'"/></div></td>'*/
								+'<td><div>'+(i+1)+'</div></td>'
								+'<td><div>'+Common.numberWithComma(Common.leftPage(value.loan_id,9))+'</div></td>'
								+'<td><div>'+moment(value.start_dt).format('DD/MM/YYYY')+'</div></td>'
								+'<td><div class="t_right">'+Common.numberWithComma(value.total_money)+money_symbol +'</div></td>'
								+'<td><div class="t_right">'+Common.numberWithComma(value.totalcount)+money_symbol+'</div></td>'
								+'<td><div class="t_center">'+Common.numberWithComma(value.time)+' ដង</div></td>'
								+'<td><div class="t_right">'+amount+money_symbol+'</div></td>'
								+'<td><div>'+end_date+'</div></td>'
								+'<td><div class="t_center" style="text-decoration: underline;text-align:center;color:red;height: 20px;padding-top:10px;">'+(value.txt=='9'?'បានបញ្ចប់':'រង់ចាំ')+'</div></td>'
								+'<td><div><a href="/khmoney/loan/loan-view-detail?loaner_id='+value.loaner_id+'&loan_id='+value.loan_id+'&id=loan#loan-count" style="width:30%;margin:0px;text-decoration: underline;text-align:center;color:blue;height:0px;">លំអិត</a>'
								+'         <a loan-type="'+value.loan_type+'" loan_id="'+value.loan_id+'" loaner_id="'+value.loaner_id+'" href="javascript:" onClick="loadingEditLoan(this)" txt="'+value.txt+'" style="width:30%;margin:0px;text-decoration: underline;text-align:center;color:blue;height:0px;">កែប្រែ</a>'
								+'         <a loan_id="'+value.loan_id+'" loaner_id="'+value.loaner_id+'" href="javascript:" onClick="Message.confirm(null,\'តើអ្នកពិតជាចង់លុបការខ្ចីប្រាក់នេះពិតមែន?\',loadingDeleteLoan,this);" txt="'+value.txt+'" style="width:30%;margin:0px;text-decoration: underline;text-align:center;color:blue;height:0px;">លុប</a></div></td>'
							+'</tr>';
					i++;
				});
			}else{
				$('#pay_count tfoot').show();
				$('#pay_count tbody').hide();
			}
			
			$('#pay_count tbody').append(tbl);
			
			if ( json.object.pagination.total_page > 0 ){
				$('.paging_wrap').show();
			}else{
				$('.paging_wrap').hide();
			}
			 var option = {
        			total       : json.object.pagination.total_page,
    				maxVisible  : 10,
    				perPage     : $('#num_rows').val(),
    				currentPage : page,
    				numPage     : 1,
    				wrapClass   :'paging',
    				eventLink   :'pagConstand'
        	 }
		     pagination.showPage(option);
		     $('#loading').bPopup().close();
		},error:function(){
			
		}
	});
	
}


function pageRatePayOnly(page){
	$('#loading').bPopup();
	var object = {
			'perPage'     : $('#num_rows').val(),
			'currentPage' : page,
			'search'      : $('#search').val(),
			'typePayment' : '',
			'startDate'   : '',
			'endDate'     : '',
			'decrementTxt': '',
			'loan_type'   : '4'
	}
	if ($('#status').is(':checked')){
		object['startDate'] = Common.formatDateToString($('#start_date').val().trim());
		object['endDate']   = Common.formatDateToString($('#end_date').val().trim());
	}
	
	if ($('#type_payment').val() != 'all'){
		object['typePayment']   = $('#type_payment').val();
	}
	//console.log(object);
	$.ajax({
		type:'GET',
		url :'/khmoney/loadingLoanListView',
		data:object,
		complete:function(xhr,statu){
			var json = $.parseJSON(xhr.responseText);
			console.log(json);
			if (json.status == '901') {
				Message.infor(null,json.message,Common.redictPage,json.path);
                 return;
            }
			if (json.status == 'undefined' || json.status == '9999'){
				Message.infor(null,json.message);
				return;
			}
			var loanList = json.object.loanList;
			var typePayment = json.object.typePaymentList;
			var tbl = '',opt='<option value="">ទាំងអស់</option>';
			$('#pay_only_rate tbody').empty();
			$('#pay_only_rate tfoot').hide();
			$('#pay_only_rate tbody').show();
		
			if (loanList.length > 0 ){
				var i = (parseInt(page)-1) * parseInt($('#num_rows').text().replace(/[​\-]/g,''));
				$.each(loanList,function(index,value){
					
				    var end_date  = '';
				    if (value.txt == '1'){
				    	end_date  = '';
				    }else{
				    	console.log(value.end_date);
				    	console.log(moment(value.end_date).format('DD/MM/YYYY'));
				    	end_date = moment(value.end_date).format('DD/MM/YYYY');
				    }
				    var amount = '0';
				    //console.log(value.amount);
				    if (typeof value.amount != 'undefined' && typeof value.amount != ''){
				    	amount = Common.numberWithComma(Common.ConvertZeroTwoDigit(Math.round(value.amount)+''));
				    }
				    
				    var rate           = value.rate + ' %' ;
				    var money_symbol   = ' ៛'              ;
				    var total_rate_txt = 0                 ;
				    if (value.money_type == 'R'){
				    	money_symbol   = ' ៛';
				    	
				    	if (value.rate_type == '2'){
				    		rate           = value.rate_money+ ' ៛' ;
				    		total_rate_txt = value.rate_money;
				    	}else{
				    		total_rate_txt = Common.ConvertZeroTwoDigit((parseFloat(value.total_money) * parseFloat(value.rate)) / 100 +'');
				    	}
				    	
				    }else{
				    	money_symbol = ' $';
				    	
				    	if (value.rate_type == '2'){
				    		rate           = value.rate_money + ' $' ;
				    		total_rate_txt = value.rate_money;
				    	}else{
				    		total_rate_txt = (parseFloat(value.total_money) * parseFloat(value.rate)) / 100 ;
				    	}
				    	
				    }
				    
				   /* var total_rate_txt = 0;
					if (value.money_type == 'D' ){
						if (value.rate_type == '1' ){							
							total_rate_txt= (parseInt(prak_derm) * parseFloat(total_rate_db) / 100 +'') + money_type;
						}else{							
							total_rate_txt= total_rate_db + money_type;
						}
					}else{
						if (value.rate_type == '1' ){							
							total_rate_txt= Common.ConvertZeroTwoDigit((parseInt(prak_derm) * parseFloat(total_rate_db)) / 100 +'') + money_type;
						}else{							
							total_rate_txt= total_rate_db + money_type;
						}
					}*/
				    
			
				    
					tbl += '<tr>'
								/*+'<td><div class="t_center"><input type="checkbox"><input type="hidden" class="loaner_id" value="'+value.loaner_id+'"/></div></td>'*/
								+'<td><div>'+(i+1)+'</div></td>'
								+'<td><div>'+Common.numberWithComma(Common.leftPage(value.loan_id,9))+'</div></td>'
								+'<td><div>'+moment(value.start_dt).format('DD/MM/YYYY')+'</div></td>'
								+'<td><div class="t_right">'+Common.numberWithComma(value.total_money)+money_symbol+'</div></td>'
								+'<td><div class="t_right">'+Common.numberWithComma(rate)+'</div></td>'
								+'<td><div class="t_center">'+Common.numberWithComma(value.time)+' ដង</div></td>'
								+'<td><div class="t_center">'+Common.numberWithComma(total_rate_txt)+money_symbol+'</div></td>'
								+'<td><div class="t_right">'+amount+money_symbol+'</div></td>'
								+'<td><div>'+end_date+'</div></td>'
								+'<td><div class="t_center" style="text-decoration: underline;text-align:center;color:red;height: 20px;padding-top:10px;">'+(value.txt=='9'?'បានបញ្ចប់':'រង់ចាំ')+'</div></td>'
								+'<td><div><a href="/khmoney/loan/loan-pay-only-rate-view?loaner_id='+value.loaner_id+'&loan_id='+value.loan_id+'&id=loan#loan-only-rate" style="width:30%;margin:0px;text-decoration: underline;text-align:center;color:blue;height:0px;">លំអិត</a>'
								+'         <a loan-type="'+value.loan_type+'" loan_id="'+value.loan_id+'" loaner_id="'+value.loaner_id+'" href="javascript:" onClick="loadingEditLoan(this)" txt="'+value.txt+'" style="width:30%;margin:0px;text-decoration: underline;text-align:center;color:blue;height:0px;">កែប្រែ</a>'
								+'         <a loan_id="'+value.loan_id+'" loaner_id="'+value.loaner_id+'" href="javascript:" onClick="Message.confirm(null,\'តើអ្នកពិតជាចង់លុបការខ្ចីប្រាក់នេះពិតមែន?\',loadingDeleteLoan,this);" txt="'+value.txt+'" style="width:30%;margin:0px;text-decoration: underline;text-align:center;color:blue;height:0px;">លុប</a></div></td>'
							+'</tr>';
					i++;
				});
			}else{
				$('#pay_only_rate tfoot').show();
				$('#pay_only_rate tbody').hide();
			}
			$('#pay_only_rate tbody').append(tbl);
			
			if ( json.object.pagination.total_page > 0 ){
				$('.paging_wrap').show();
			}else{
				$('.paging_wrap').hide();
			}
			
			 var option = {
        			total       : json.object.pagination.total_page,
    				maxVisible  : 10,
    				perPage     : $('#num_rows').val(),
    				currentPage : page,
    				numPage     : 1,
    				wrapClass   :'paging',
    				eventLink   :'pageRatePayOnly'
        	 }
		     pagination.showPage(option);
		     $('#loading').bPopup().close();
		},error:function(){
			
		}
	});
	
}

function loadingEditLoan(obj){
	
	if ($(obj).attr('txt') == '9'){
		Message.infor(null,"អ្នកមិនអាចធ្វើការកែប្រែបានទេ ពីព្រោះអ្នកខ្ចីបានបង់ប្រាក់អស់ហើយ!");
		return;
	}
	
	$.ajax({
		type:'GET',
		url :'/khmoney/loadingCheckLoanPayMent',
		data:'loan_id='+$(obj).attr('loan_id'),
		complete:function(xhr,statu){
			var json = $.parseJSON(xhr.responseText);
			console.log(json);
			if (json.status == '901') {
				 Message.infor(null,json.message,Common.redictPage,json.path);
				 return;
            }
			var count = json.object.count;
			if (parseInt(count) <= 0 ){
			
				if ($(obj).attr('loan-type') == '3'){
					window.location.href = '/khmoney/loan/loan-edit-count?loaner_id='+$(obj).attr('loaner_id')+'&loan_id='+$(obj).attr('loan_id') + '#loan-count';
					
				}else if ($(obj).attr('loan-type') == '4'){
					window.location.href = '/khmoney/loan/loan-pay-only-rate-edit?loaner_id='+$(obj).attr('loaner_id')+'&loan_id='+$(obj).attr('loan_id') + '#loan-only-rate';
				}else if ($(obj).attr('loan-type') == '2'){
					
					window.location.href = '/khmoney/loan/loan-edit?loaner_id='+$(obj).attr('loaner_id')+'&loan_id='+$(obj).attr('loan_id') + '#loan-down';
				}else{
					window.location.href = '/khmoney/loan/loan-edit?loaner_id='+$(obj).attr('loaner_id')+'&loan_id='+$(obj).attr('loan_id');
				}
				
				
			}else{
				Message.infor(null,"អ្នកមិនអាចធ្វើការកែប្រែបានទេ ពីព្រោះអ្នកខ្ចីបានបង់ប្រាក់ខ្លះហើយ!");
				return;
			}
		},error:function(){
			
		}
		
	});
	
}

function loadingDeleteLoan(obj){

	if ($(obj).attr('txt') == '9'){
		Message.infor(null,"អ្នកមិនអាចធ្វើការលុបបានទេ ពីព្រោះអ្នកខ្ចីបានបង់ប្រាក់អស់ហើយ!");
		return;
	}
	
	$.ajax({
		type:'GET',
		url :'/khmoney/loadingDeleteLoan',
		data:'loan_id='+$(obj).attr('loan_id')+'&loaner_id='+$(obj).attr('loaner_id'),
		complete:function(xhr,statu){
			var json = $.parseJSON(xhr.responseText);
			console.log(json);
			if (json.status == '901') {
				 Message.infor(null,json.message,Common.redictPage,json.path);
                 return;
            }
			if (json.status == 'undefined' || json.status == '9999'){
				 Message.infor(null,json.message);
				return;
			}else{
				if (statusLinkOn == 'pay_constand'){
					 Message.infor(null,json.message,pagConstand,1);
				}else if (statusLinkOn == 'pay_down'){
					Message.infor(null,json.message,pagDown,1);
					
				}else if (statusLinkOn == 'pay_count'){
					 Message.infor(null,json.message,pagCount,1);
					
				}else{
					Message.infor(null,json.message,pageRatePayOnly,1);
					
				}

			}
		},error:function(){
			
		}
		
	});
}

// check url for tab control link
function checkUrlLink(){
	$('.tabContents').hide();
	$('#tabcontroll ul li').removeClass('on');
	if ( window.location.hash == '#loan-down' ){		
		$('#tabcontroll ul li.tab-title-2').addClass('on');
		statusLinkOn = 'pay_down';
		$('#'+ statusLinkOn).show();
		pagDown(1);
	}else if ( window.location.hash == '#loan-count' ){
		$('#tabcontroll ul li.tab-title-3').addClass('on');
		statusLinkOn = 'pay_count';
		$('#'+ statusLinkOn).show();
		pagCount(1);
	}else if ( window.location.hash == '#loan-only-rate' ){
		$('#tabcontroll ul li.tab-title-4').addClass('on');
		statusLinkOn = 'pay_only_rate';
		$('#'+ statusLinkOn).show();
		pageRatePayOnly(1);
	}else{
		$('#tabcontroll ul li.tab-title-1').addClass('on');
		statusLinkOn = 'pay_constand';
		$('#'+ statusLinkOn).show();
		pagConstand(1);
	}
	// by button show by tab link
	checkTabLink();
	
}

function checkTabLink(){
	
	if (statusLinkOn == 'pay_constand'){
		$('#loanNew').show();
		$('#paydown').hide();
		$('#loanCount').hide();
		$('#loanOnlyRate').hide();
	} else if (statusLinkOn == 'pay_down'){
		$('#loanNew').hide();
		$('#paydown').show();
		$('#loanCount').hide();
		$('#loanOnlyRate').hide();
	}else if (statusLinkOn == 'pay_count'){
		$('#loanNew').hide();
		$('#paydown').hide();
		$('#loanCount').show();
		$('#loanOnlyRate').hide();
		
	}else{
		$('#loanNew').hide();
		$('#paydown').hide();
		$('#loanCount').hide();
		$('#loanOnlyRate').show();
		
	}
}