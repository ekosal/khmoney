/**
 * 
 */
$(document).ready(function(){
	
	Common.datePickerRang('start_date','end_date');	
	loadingUserList();
	
	$('#btn_print').click(function(){
		$(".cnt_wrap").printElement({
				overrideElementCSS:[
				'/khmoney/css/print.css', 
				{ href:'/khmoney/css/print.css',media:'print'}] 
			}); 

	});
	
	$('#tbl_search').click(function(){
		loadingUserList();
	});

});
function loadingUserList(){
	
	$('#loading').bPopup();
    
	var data = 
	{
			  'end_dt'	  : Common.formatDateToString($('#end_date').val().trim())
			, 'start_dt'  : Common.formatDateToString($('#start_date').val().trim())
			, 'money_type': $('#money_type').val()
			, 'user_name' : $('#search').val()
	}
	
	$('#start_dt').text($('#start_date').val().trim());
	$('#end_dt').text($('#end_date').val().trim());
	
	if ($('#money_type').val() == 'D' )
		{
		
			$('#money_type_title').text(' ដុល្លា ​ ($)');
			
		
		}
	else if ($('#money_type').val() == 'R' )
		{
			$('#money_type_title').text(' រៀល  ​(៛)');
		}
	else
		{
			$('#money_type_title').text(' រៀល  ​(៛) / ដុល្លា ​ ($)');
		}
	
	//console.log(data);
	var token = $('#_csrf').attr('content');
	var header = $('#_csrf_header').attr('content');
	$.ajax({
		url :'/khmoney/report-loan-out-list',
		type:'GET',
		data:data,
	    beforeSend: function(xhr) {
            xhr.setRequestHeader(header, token)
         },complete:function(xhr,status){	
        	 var json = $.parseJSON(xhr.responseText);
        	 console.log(json);
        	
        	 $('#tbl_report_loan_out tbody').empty();
        	 $('#tbl_report_loan_out tbody').empty();
        	 $('#tbl_report_loan_out tbody').show();
        	 $('#tbl_report_loan_out tfoot').hide();
        	 var arrCon = [];
        	 
        	 if (json.object.length > 0 ){
	        	 $.each(json.object,function(index,value){
	        		
	        		 var condition = value.company.com_id+':'+value.user.user_id;
	        		 
	        		 var reil   = 0 ;
	            	 var dolla  = 0 ;
	            	 var tbl = '';
	        		 console.log(jQuery.inArray(condition, arrCon ));
	        		 if (jQuery.inArray(condition, arrCon ) == -1)
	        		 {
	        			
	        			 arrCon.push(condition);
	        			 tbl += '<tr >'
		        			 +  '<td colspan="12"><div class="t_left"> ឈ្មោះភ្នាក់ងារឥទាន : '+value.loaner.user.full_name+'</div></td>'	        			
		        			 +  '</tr>';
	        			
	        			 var tt_amount = 0;
	            		 $.each(json.object,function(i,val){
	            			 
	            			 var con = val.company.com_id+':'+val.user.user_id;           			 
	           			 
	            			 if ( con == condition )
	        				 {
	            				 var money_type = ' រៀល​' ;
	            				 if (val.money_type == 'D' )
		            				{
		            					 money_type = ' ដុល្លា​';
		            					 dolla += parseFloat(val.total_money) ;
		            				}
	            				 else
	            					{
	            					 	 reil   += parseFloat(val.total_money) ;
	            					}
	            				 
	            				 tbl += '<tr>'
	        	        			 +  '<td><div class="t_center">'+ (i + 1) +'</div></td>'
	        	        			 +  '<td><div class="t_center">'+ Common.numberWithComma(Common.leftPage(val.loan_id,9),'-')  +'</div></td>'
	        	        			 +  '<td><div class="t_left">'+val.loaner.loaner_name+'</div></td>'
	        	        			 +  '<td><div class="t_right">'+Common.numberWithComma(val.total_money,',') + money_type +'</div></td>'
	        	        			 +  '<td><div class="t_center">'+ moment(val.start_dt).format('DD/MM/YYYY')+'</div></td>'
	        	        			 +  '<td><div class="t_center">'+ (val.end_dt == null ? '-' : moment(val.end_dt).format('DD/MM/YYYY')) +'</div></td>'
	        	        			 +  '<td><div class="t_right"></div></td>'
	        	        			 +  '<td><div class="t_center">'+ (val.loaner.gender ? 'ប្រុស' : '​ស្រី' )+'</div></td>'
	        	        			 +  '<td><div>213434</div></td>'
	        	        			 +  '<td><div class="t_right">'+val.loaner.district.name_kh+'</div></td>'
	        	        			 +  '<td><div class="t_right">'+val.loaner.commune.name_kh+'</div></td>'
	        	        			 +  '<td><div class="t_right">'+val.loaner.village.name_kh+'</div></td>'
	        	        			 +  '</tr>';
	            				 tt_amount += parseFloat(val.total_money);
	        				 }
	    	        		
	            			
	            		 
	            		 });
	            		 tbl += '<tr >'
		        			 +  '<td colspan="3"><div class="t_right">សរុបទឹកប្រាក់​  : </div></td>'	  
		        			 +  '<td colspan="3"><div class="t_left" style="font-weight:bold;">'+ Common.numberWithComma(dolla,',')+' ដុល្លា​ </div></td>'
		        			 +  '<td colspan="3"><div class="t_right">សរុបទឹកប្រាក់​  : </div></td>'	  
		        			 +  '<td colspan="3"><div class="t_left" style="font-weight:bold;">'+ Common.numberWithComma(reil,',')+' រៀល </div></td>'
		        			 +  '</tr>';
	            		 $('#tbl_report_loan_out tbody').append(tbl);
	            		 
	        		 } 
	        		
	        	 });
        	 }
        	 else
    		 {
            	 $('#tbl_report_loan_out tbody').hide();
            	 $('#tbl_report_loan_out tfoot').show();
    		 }
        	 
			$('#loading').bPopup().close();
		},error:function(json){
			console.log(json);
		}
		
	});
	
}