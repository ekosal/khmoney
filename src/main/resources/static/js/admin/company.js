/**
 * 
 */
$(document).ready(function(){
	loadingCompanyInformation(1);
	$('#btn-create-company').click(function(){
		$('#popup_company').bPopup();
	});
	$(document).on('click','.btn_cancel,.btn_close',function(){
		$('.alert_wrap').bPopup().close();
	});
	
	$('#btn_create').click(function(e){
		createCompanyInformation(e);
	});
	
	$('#btn_save').click(function(){
		createUserForCompany();
	});
	
	$('#num_rows').change(function(e){
		loadingCompanyInformation(1);
	});
});
function loadingCompanyInformation(page){
	$('#loading').bPopup();
	var pagin = {
			'current_page' : page,
			'per_page'     : parseInt($('#num_rows').val())
	}
	var data = {	
			
			'pagination'  : pagin
			
	}
	
	var token = $('#_csrf').attr('content');
	var header = $('#_csrf_header').attr('content');
	$.ajax({
		url :'/khmoney/admin/loading-company-list',
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
			if (json.status == 'undefined' || json.status != '0000'){
				Message.infor(null,json.message);
				return;
			}	
			
			var lsCompany = json.object.companyList;
		
			if (lsCompany.length > 0 ){
				
				var tbl = '';
				$('#tbl_company tbody').empty();
				$('#tbl_company tfoot').hide();
				$('#tbl_company tbody').show();
				var i = (parseInt(page)-1) * parseInt($('#num_rows').val().replace(/[​\-]/g,''));
				$.each(lsCompany,function(index,value){
					tbl += '<tr>'
						+'<td><div><input type="checkbox"></div></td>'
						+'<td><div>'+(i+1)+'</div></td>'
						+'<td><div>'+value.com_name+'</div></td>'
						+'<td><div>'+Common.phoneWithComma(value.com_ph_num,"-")+'</div></td>'
						+'<td><div>'+value.com_email+'</div></td>'
						+'<td><div>'+value.com_address+'</div></td>'
						+'<td><div>'+value.com_website_address+'</div></td>'
						+'<td><div>'+value.com_logo+'</div></td>'
						+'<td><div>' 					
						if (value.user_id != $('#user_id').val()){
							tbl +=	'         <a href="javascript:" data-id="'+value.com_id+'"   style="width:20%;margin:0px;text-decoration: underline;text-align:center;color:blue;">លុប</a>|'
							tbl +=	'         <a href="javascript:" data-id="'+value.com_id+'"   style="width:20%;margin:0px;text-decoration: underline;text-align:center;color:blue;">កែប្រែ</a> | '
							tbl +=	'         <a href="javascript:" com-id="'+value.com_id+'" onClick="loadingFormCreateUser(this)"   style="width:50%;margin:0px;text-decoration: underline;text-align:center;color:blue;">បង្កើតអ្នកប្រើប្រាស់</a>' 
						}
						tbl +=	'</div></td></tr>';
					i++;
				});
				$('#tbl_company tbody').append(tbl);
			}else{
				$('#tbl_company tbody').hide();
				$('#tbl_company tfoot').show();
			}
			 var option = {
        			total       : json.object.companyCountList,
    				maxVisible  : 10,
    				perPage     : $('#num_rows').val(),
    				currentPage : page,
    				numPage     : 1,
    				wrapClass   :'paging',
    				eventLink   :'loadingCompanyInformation'
        	 }
			 console.log(option);
		     pagination.showPage(option);
		     $('#loading').bPopup().close();
			
			
			$('#loading').bPopup().close();
		},error:function(json){
			console.log(json);
		}
	
	});
	
}

function createCompanyInformation(e){
	e.preventDefault();

	if ($('#popup-company-name').val() == ''){
		Message.infor(null,'សូមបញ្ចូលឈ្មោះបុគ្គលិក!',null);
		return;
	}
	if ($('#popup-company-phone').val() == ''){
		Message.infor(null,'សូមបញ្ចូលលេខទូរស័ព្ទបុគ្គលិក!',null);
		return;
	}
	if ($('#popup-company-email').val() == ''){
		Message.infor(null,'សូមបញ្ចូលអ៊ីមែលបុគ្គលិក!',null);
		return;
	}
	if ($('#popup_company_address').val() == ''){
		Message.infor(null,'សូមបញ្ចូលអាស័យដ្ឋានបុគ្គលិក!',null);
		return;
	}
	if ($('#popup_company_website').val() == ''){
		Message.infor(null,'សូមបញ្ចូលឈ្មោះបុគ្គលិកសំរាប់ប្រើក្នុងប្រព័ន្ធ!',null);
		return;
	}
	
	
	if (!isValidEmailAddress($('#popup-company-email').val())){
		Message.infor(null,'អ៊ីមែលបុគ្គលិកមិនត្រូវទេ!!',null);
		return ;
	}
	
	var data = new FormData();
	var file = document.getElementById('file_company');
	if (file.files.length > 0){
		console.log(file.files[0]);
		data.append('file',file.files[0]);
	}else{
		data.append('file',null);
	}
	
	
	
	
	//console.log($('#file').prop('files')[0])
	$('#loading').bPopup();
	data.append('com_name'           ,$('#popup-company-name').val());
	data.append('com_ph_num'         ,$('#popup-company-phone').val().replace(/\-/g,'').trim());
	data.append('com_email'          ,$('#popup-company-email').val());
	data.append('com_address'        ,$('#popup_company_address').val());
	data.append('com_website_address',$('#popup_company_website').val());




	var token = $('#_csrf').attr('content');
	var header = $('#_csrf_header').attr('content');

	$.ajax({
		url:'/khmoney/admin/company-create',
		type:'POST',
		processData: false,
	    contentType: false,
	    data:data,
	    beforeSend: function(xhr) {
            xhr.setRequestHeader(header, token)
         },
         complete: function(xhr, status) {
        	var json =  $.parseJSON(xhr.responseText);
 			console.log('json === '+xhr.responseText + "  "+status);
            if (json.status == '901') {
            	Message.infor(null,json.message,Common.redictPage,json.path);      
                return;
            }
            if (json.status == 'undefined' || json.status != '0000'){
 				Message.infor(null,json.message);
 				return;
 			}
        	Message.infor(null,json.message,loadingCompanyInformation,1);
        	$('#popup_employee').bPopup().close();
        	 clearTextBox();
         }, error: function(result, options) {
        	 console.log(result); 
        	 console.log(options); 
         }
	});
	$('#loading').bPopup().close();
}

function loadingFormCreateUser(obj){
	$('#com_id').val($(obj).attr('com-id'));
	$('#popup_employee').bPopup();
}


function createUserForCompany(){	
	
	
	if ($('#emp_name').val() == ''){
		Message.infor(null,'សូមបញ្ចូលឈ្មោះបុគ្គលិក!',null);
		return;
	}
	if ($('#emp_phone').val() == ''){
		Message.infor(null,'សូមបញ្ចូលលេខទូរស័ព្ទបុគ្គលិក!',null);
		return;
	}
	if ($('#emp_email').val() == ''){
		Message.infor(null,'សូមបញ្ចូលអ៊ីមែលបុគ្គលិក!',null);
		return;
	}
	if ($('#emp_address').val() == ''){
		Message.infor(null,'សូមបញ្ចូលអាស័យដ្ឋានបុគ្គលិក!',null);
		return;
	}
	if ($('#user_name').val() == ''){
		Message.infor(null,'សូមបញ្ចូលឈ្មោះបុគ្គលិកសំរាប់ប្រើក្នុងប្រព័ន្ធ!',null);
		return;
	}
	if ($('#password').val() == ''){
		Message.infor(null,'សូមបញ្ចូលពាក្យសំងាត់បុគ្គលិក!',null);
		return;	
	}
	
	if ($('#confirm_password').val() == ''){
		Message.infor(null,'សូមបញ្ចូលបញ្ជាក់ពាក្យសំងាត់បុគ្គលិក!',null);
		return;
	}
	if ($('#confirm_password').val() != $('#password').val()){
		Message.infor(null,'សូមបញ្ចូលពាក្យសំងាត់ និងបញ្ជាក់ពាក្យសំងាត់បុគ្គលិក!',null);
		return;
	}

	if ($('#com_id').val() == ''){
		Message.infor(null,'com_id!',null);
		return;
	}
	
	if (!isValidEmailAddress($('#emp_email').val())){
		Message.infor(null,'អ៊ីមែលបុគ្គលិកមិនត្រូវទេ!!',null);
		return ;
	}
	
	var data = new FormData();
	var file = document.getElementById('file');
	if (file.files.length > 0){
		console.log(file.files[0]);
		data.append('file',file.files[0]);
	}else{
		data.append('file',null);
	}
	
	
	
	//console.log($('#file').prop('files')[0])
	$('#loading').bPopup();
	data.append('full_name'         ,$('#emp_name').val());
	data.append('gender'            ,$('input[name=gender]:checked').val());
	data.append('phone_nm'          ,$('#emp_phone').val().replace(/\-/g,'').trim());
	data.append('email'             ,$('#emp_email').val());
	data.append('address'           ,$('#emp_address').val());
	data.append('username'          ,$('#user_name').val());
	data.append('password'          ,$('#password').val());
	data.append('confirmPassword'   ,$('#confirm_password').val());
	data.append('com_id'            ,$('#com_id').val());


	var token = $('#_csrf').attr('content');
	var header = $('#_csrf_header').attr('content');
	console.log(data);
	$.ajax({
		url:'/khmoney/admin/user-create',
		type:'POST',
		processData: false,
	    contentType: false,
	    data:data,
	    beforeSend: function(xhr) {
            xhr.setRequestHeader(header, token)
         },
         complete: function(xhr, status) {
        	var json =  $.parseJSON(xhr.responseText);
 			console.log('json === '+xhr.responseText + "  "+status);
            if (json.status == '901') {
            	Message.infor(null,json.message,Common.redictPage,json.path);      
                return;
            }
            if (json.status == 'undefined' || json.status != '0000'){
 				Message.infor(null,json.message);
 				return;
 			}
        	Message.infor(null,json.message);
        	$('#popup_employee').bPopup().close();
        	 clearTextBox();
         }, error: function(result, options) {
        	 console.log(result); 
        	 console.log(options); 
         }
	});
	$('#loading').bPopup().close();
	
}


function deleteCompanyInformation(obj){
	
}

function isValidEmailAddress(emailAddress) {
    var pattern = new RegExp(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/);
    return pattern.test(emailAddress);
};
