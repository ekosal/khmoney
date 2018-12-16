$(document).ready(function(){
	goPageList(1);
	$(document).click(function(e){		
        if(!$(e.target).closest('.loan-again, .loan-again>div, .loan-again>div>a').length){
            $(".loan-again>div").hide();
        }
    });
	$('#btn_combo_down').click(function(){
		 $(this).parent('.combo_style').find('ul').toggle();
	});

	$('#tbl_search').click(function(){
		goPageList(1);
	});
	
	$(document).on('click','.btn_cancel,.btn_close',function(){
		$('.alert_wrap').bPopup().close();
	});
	
	$(document).on('click','#tbl_loan table tbody tr td .again',function(){
		$('#tbl_loan table tbody tr td .loan-again div').hide();
		$(this).parent('div').find('div').show();
	});
});

function goPageList(page){
	$('#loading').bPopup();
	var intRegex  = /^\d+$/;
	var loaner_id;
	var str = $('#search').val();
	if(intRegex.test(str)) {
		loaner_id = parseInt(str);
	}
	var pagin = {
			'current_page' : page,
			'per_page'     : parseInt($('#num_rows').val())
	}
	var data = {			
			'loaner_id'   : loaner_id,
			'loaner_name' : $('#search').val(),
			'id_card'     : $('#search').val(),
			'phone_nm'    : $('#search').val(),
			'pagination'  : pagin
			
	}
	console.log(data);
	var token = $('#_csrf').attr('content');
	var header = $('#_csrf_header').attr('content');
	$.ajax({
		url :'/khmoney/loadingLoanerListInformation',
		type:'POST',
		contentType : 'application/json; charset=utf-8',
        dataType : 'json',
	    data:JSON.stringify(data),
	    beforeSend: function(xhr) {
            xhr.setRequestHeader(header, token)
         },complete:function(xhr,status){	
 	    	var json = $.parseJSON(xhr.responseText);
			console.log(json);
			if (json.status == '901') {
				 Message.infor(null,json.message,Common.redictPage,json.path);
				 return;
           }
			if (json.status != '0000'){
				Message.infor(null,json.message);
				return;
			}
			var loanerList = json.object.loanerList;
			var tbl = '';
			$('#tbl_loan tfoot').hide();
			$('#tbl_loan tbody').show();
			$('#tbl_loan tbody').empty();
			if (loanerList.length <= 0 || loanerList == null){
				$('#tbl_loan tfoot').show();
				$('#tbl_loan tbody').hide();
			}else{
				var i = (parseInt(page)-1) * parseInt($('#num_rows').val().replace(/[​\-]/g,''));
				$.each(loanerList,function(index,value){				
					tbl += '<tr>'
								+'<td><div><input type="checkbox"><input type="hidden" value="'+value.loaner_id+'"</div></td>'
								+'<td><div>'+(i+1)+'</div></td>'
								+'<td><div>'+Common.numberWithComma(Common.leftPage(value.loaner_id,9))+'</div></td>'
								+'<td><div>'+value.loaner_name+'</div></td>'
								+'<td><div>'+(value.gender == 'M' ? 'ប្រុស' : 'ស្រី')+'</div></td>'
								+'<td><div>'+Common.phoneWithComma(value.phone_nm)+'</div></td>'
								+'<td><div>'+Common.phoneWithComma(value.id_card)+'</div></td>'
								+'<td><div style="cursor:pointer;text-decoration: underline;text-align:center;color:blue;" onClick="loanViewDetail('+value.loaner_id+')">'+(value.txt == '9' ? 'បានបញ្ចប់' : 'រងចាំ')+'</div></td>'
								+'<td><div style="position: relative;" class="loan-again">'
								if (value.txt == '1'){
									var type_loan = '/khmoney/loan/loan-again/'+value.loaner_id+"/"+value.loan_id;
									if (value.type_loan == '3'){
										type_loan = '/khmoney/loan/loan-again/loan-count/'+value.loaner_id+"/"+value.loan_id;
									}else if (value.type_loan == '4'){
										type_loan = '/khmoney/loan/loan-again/loan-pay-only-rate/'+value.loaner_id+"/"+value.loan_id;
									}
									
								    tbl +='<a class="again" href="'+type_loan+'"  style="width:100%">ខ្ចីបន្ថែម</a>'
								}else{
								tbl	+='<a class="again" href="javascript:"  style="width:100%">ខ្ចីម្ដងទៀត</a>'
									+ '<div>'
										+'<a  href="/khmoney/loan/loan-again/'+value.loaner_id+'">កម្ចី សង់ប្រាក់ដើម និងការប្រាក់ថេរ ឬការប្រាក់ថយ </a>'
										+'<a  href="/khmoney/loan/loan-again/loan-count/'+value.loaner_id+'">កម្ចី សង់ថេរ</a>'
										+'<a  href="/khmoney/loan/loan-again/loan-pay-only-rate/'+value.loaner_id+'">កម្ចី បង់ការប្រាក់</a>'
									+'</div>'
								}
									
								+'</div></td>'
							+'</tr>';
					  i++;
				});
			}
			
			$('#tbl_loan tbody').append(tbl);
			  $('#loading').bPopup().close();
		    var option = {
        			total       : json.object.pagination.totalCount,
    				maxVisible  : 10,
    				perPage     : $('#num_rows').val(),
    				currentPage : page,
    				numPage     : 1,
    				wrapClass   :'paging',
    				eventLink   :'goPageList'
        	 }
		     pagination.showPage(option);
		  

		},error:function(json){
			
		}
	});
	
}

function loanAgain(loaner_id){
	 $('#popup_type_loan').bPopup();
	 
	//window.location.href = '/khmoney/loan/loan-again/'+loaner_id;
}
function loanViewDetail(loaner_id,txt){
	/*if (){
		
	}else if(){
		
	}else{
		window.location.href = '/khmoney/loan/loaner-view-detail?loaner_id='+loaner_id+'&id=loaner';
	}
	*/
}