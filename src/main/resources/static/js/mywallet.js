$(document).ready(function(){
	goPageList(1);
	$('#num_rows').change(function(){
		goPageList(1);
	});
	$('#btn_addMore').click(function(){
		$('#popup_wallet').bPopup();
	});
	$('#btn_wallet').click(function(){
		walletTransaction();
	});
	
	$(document).on('click','.btn_cancel,.btn_close',function(){
		$('#popup_wallet').bPopup().close();
	});
});

function goPageList(page){
	$('#wallet_total_money').autoNumeric('init',{ aSign: '​​ ៛',aSep:',',sGropu:'3',pSign: 's',aPad: false,vMax: '999999999',vMin: '0'});
	$('#loading').bPopup();
	var data = {
			'currentPage' : page,
			'perPage'     : $('#num_rows').val(),
			'search'      : ''
	}
	console.log(data);
	$.ajax({
		type:'GET',
		url :'/khmoney/loadingWalletListInformation',
		data: data,
		success:function(json){
			if (json.code == '9999' || typeof json.code == 'undefined'){
				alert(json.message);
				return;
			}
			console.log(json);
			$('#totalAmount h1 b').text(Common.numberWithComma(json.object.TotalAmount.total_amount)+' រៀល');
			var walletList = json.object.walletList;
			var tbl = '';
			$('#tbl_loan tfoot').hide();
			$('#tbl_loan tbody').show();
			$('#tbl_loan tbody').empty();
			if (walletList.length <= 0 || walletList == null){
				$('#tbl_loan tfoot').show();
				$('#tbl_loan tbody').hide();
			}else{
				var i = (parseInt(page)-1) * parseInt($('#num_rows').val().replace(/[​\-]/g,''));
				$.each(walletList,function(index,value){				
					tbl += '<tr>'
								+'<td><div><input type="checkbox"></div></td>'
								+'<td><div>'+(i+1)+'</div></td>'
								+'<td><div  class="t_right">'+Common.numberWithComma(value.old_amount)+' ៛</div></td>'
								+'<td><div  class="t_right">'+Common.numberWithComma(value.amount)+' ៛</div></td>'
								+'<td><div  class="t_right">'+Common.numberWithComma(value.total_amount)+' ៛</div></td>'
								+'<td><div  class="t_center">'+(value.type_amount == '1'? 'ឥណពន្ធ' : 'ឥណទាន')+'</div></td>'
								+'<td><div>'+value.approve_by+'</div></td>'
								+'<td><div>'+moment(value.approve_date).format('DD/MM/YYYY')+'</div></td>'
								+'<td><div>'+value.request_by+'</div></td>'
								+'<td><div style="display: block;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">'+value.decription+'</div></td>'
							+'</tr>';
					  i++;
				});
			}
			
			$('#tbl_loan tbody').append(tbl);
		    var option = {
        			total       : json.object.loadingTotalCountRows,
    				maxVisible  : 10,
    				perPage     : $('#num_rows').val(),
    				currentPage : page,
    				numPage     : 1,
    				wrapClass   :'paging',
    				eventLink   :'goPageList'
        	 }
		     pagination.showPage(option);
		     $('#loading').bPopup().close();

		},error:function(json){
			
		}
	});
	
}
function walletTransaction(){
	if ($('#wallet_total_money').val() == ''){
		alert('ldskfja');
		return;
	}
	if ($('#wallet_type_money').val() == ''){
		alert('ldskfja');
		return;
		}
	if ($('#wallet_decription').val() == ''){
		alert('ldskfja');
		return;
	}
	var data = {
			'totalAmount':$('#wallet_total_money').val().replace(/[​\u202f\៛\,]/g,'').trim(),
			'typeAmonut' :$('#wallet_type_money').val(),
			'decription' :$('#wallet_decription').val()
	}
	var token = $('#_csrf').attr('content');
	var header = $('#_csrf_header').attr('content');
	console.log(data);
	$.ajax({
		type:'POST',
		url :'/khmoney/walletTransaction',
		data:JSON.stringify(data),
		contentType : 'application/json; charset=utf-8',
        dataType : 'json',  
		beforeSend: function(xhr) {
            xhr.setRequestHeader(header, token)
         },success:function(json){
        	 if (json.code == '9999' || typeof json.code == 'undefined'){
 				alert(json.message);
 				return;
 			}
        	goPageList(1);
        	$('#popup_wallet').bPopup().close();
         },error:function(error){
        	 console.log(error);
         }
		
	});
}
