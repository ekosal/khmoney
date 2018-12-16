/**
 * 
 */
$(document).ready(function(){
	checkUserInformation();
	$('#user_infor').click(function(){
		$('.dropdown-profile').toggle(500);
	});
	$(document).click(function(e){
        if(!$(e.target).closest('.navbar-right>li>a, .dropdown-menu').length){
            $(".dropdown-profile").hide();
        }
    });
	$(document).on('click','.btn_cancel,.btn_close',function(){
		$('#popup_employee_edit').bPopup().close();
		$('#popup_employee_change_password').bPopup().close();
		$('#popup_employee_permission').bPopup().close();
	});
	$('#change_passowrd').click(function(){
		$('#popup_employee_change_password').bPopup();
	});
	$('#change_profile').click(function(){
		$('#popup_employee_edit').bPopup();
		loadingUserEdit(this);
	});
	$('#btn_edit').click(function(){
		userEditInformation();
	});
	
	$('#btn_save_password').click(function(){
		employeeChangePassword();
	});
	$('#emp_edit_phone').keyup(function(){
		$('#emp_edit_phone').val(Common.phoneWithComma($('#emp_edit_phone').val().replace(/\-/g, ''),"-"));
	});

});

function checkUserInformation(){
	$.ajax({
		url:'/khmoney/checkUserInformation',
		type:'GET',
		complete:function(xhr,statu){
	       	 console.log('error == ' + status);
	       	var json = $.parseJSON(xhr.responseText);
	       	if (json.status == '901') {
	       		  Message.infor(null,json.message,redictPage,json.path);
                 return;
            }
			if (typeof  json.status == 'undefined' || json.status != '0000'){
				Message.infor(null,json.message);
				return;
			}
			$('.profile').attr('src','/khmoney/img/images/'+json.object.photo)
			$('#full_name').text(json.object.full_name);
			$('#change_profile').attr('data-id',json.object.user_id);
			$('#user_id').val(json.object.user_id);
		},error:function(json){
			
		}
	});
}
function loadingUserEdit(obj){
	 $('#popup_employee_edit').bPopup();
	 $.ajax({
		 url:'/khmoney/employeeGetById',
		 type:'GET',
		 data:'user_id='+$(obj).attr('data-id'),
		 complete:function(xhr,statu){
        	 console.log('error == ' + status);
        	var json = $.parseJSON(xhr.responseText);
        	if (json.status == '901') {
        		  Message.infor(null,json.message,redictPage,json.path);
                  return;
             }
			if (typeof  json.status == 'undefined' || json.status != '0000'){
				Message.infor(null,json.message);
				return;
			}
			setValueForEdit(json);
		 },error:function(json){
			 console.log(json);
		 }
	 });
}

function userEditInformation(){
	if ($('#emp_edit_name').val() == ''){
		Message.infor(null,'សូមបញ្ចូលឈ្មោះបុគ្គលិក!',null);
		return;
	}
	if ($('#emp_edit_phone').val() == ''){
		Message.infor(null,'សូមបញ្ចូលលេខទូរស័ព្ទបុគ្គលិក!',null);
		return;
	}
	if ($('#emp_edit_email').val() == ''){
		Message.infor(null,'សូមបញ្ចូលអ៊ីមែលបុគ្គលិក!',null);
		return;
	}
	if ($('#emp_edit_address').val() == ''){
		Message.infor(null,'សូមបញ្ចូលអាស័យដ្ឋានបុគ្គលិក!',null);
		return;
	}
	
	var data = new FormData();
	var file = document.getElementById('edit_file');
	if (file.files.length > 0){
		console.log(file.files[0]);
		data.append('file',file.files[0]);
	}else{
		data.append('file',null);
	}
	$('#loading').bPopup();
	data.append('userId'            ,$('#user_id').val());
	data.append('fullName'          ,$('#emp_edit_name').val());
	data.append('gender'            ,$('input[name=edit_gender]:checked').val());
	data.append('phone_nm'             ,$('#emp_edit_phone').val().replace(/\-/g,'').trim());
	data.append('email'             ,$('#emp_edit_email').val());
	data.append('address'           ,$('#emp_edit_address').val());
	console.log($('#user_id').val());
	var token = $('#_csrf').attr('content');
	var header = $('#_csrf_header').attr('content');
	$.ajax({
		url:'/khmoney/employeeChangeInformation',
		type:'POST',
		//dataType: 'text',
	    processData: false,
	    contentType: false,
	    data:data,
	    beforeSend: function(xhr) {
            xhr.setRequestHeader(header, token)
         },
         complete:function(xhr,status){	
  	    	var json = $.parseJSON(xhr.responseText);
 			console.log(json);
 			if (json.status == '901') {
 				Message.infor(null,json.message,redictPage,json.path);
 				$('#loading').bPopup().close();
 				return;
 			}
        	 Message.infor(null,json.message,loadingLoginAgain);
        	 $('#popup_employee').bPopup().close();
        	 clearTextBox();
         },error:function(json){
        	 console.log(json); 
         }
	});
	$('#loading').bPopup().close();
}

function employeeChangePassword(){
	var data = {};	
	if ($('#p_password').val() == ''){
		Message.infor(null,'សូមបញ្ចូលបញ្ជាក់ពាក្យសំងាត់បុគ្គលិក!',null);
		return;
	}
	if ($('#p_new_password').val() == ''){
		Message.infor(null,'សូមបញ្ចូលបញ្ជាក់ពាក្យសំងាត់បុគ្គលិក!',null);
		return;
	}
	if ($('#p_new_confirm_password').val() == ''){
		Message.infor(null,'សូមបញ្ចូលបញ្ជាក់ពាក្យសំងាត់បុគ្គលិក!',null);
		return;
	}
	if ($('#p_new_password').val() != $('#p_new_confirm_password').val()){
		Message.infor(null,'សូមបញ្ចូលពាក្យសំងាត់ និងបញ្ជាក់ពាក្យសំងាត់បុគ្គលិក!',null);
		return;
	}
	$('#loading').bPopup();
	data['oldPassword']      = $('#p_password').val();
	data['newPassword']      = $('#p_new_password').val();
	data['confirmPassword']  = $('#p_new_confirm_password').val();
    console.log(data);
	var token = $('#_csrf').attr('content');
	var header = $('#_csrf_header').attr('content');
	$.ajax({
		url:'/khmoney/employeeChangePassword',
		type:'POST',
		contentType : 'application/json; charset=utf-8',
        dataType : 'json',
	    data:JSON.stringify(data),
	    beforeSend: function(xhr) {
            xhr.setRequestHeader(header, token)
         },
         complete:function(xhr,status){	
  	    	var json = $.parseJSON(xhr.responseText);
 			console.log(json);
 			if (json.status == '901') {
 				 Message.infor(null,json.message,redictPage,json.path);
 				 return;
            }
        	 if (json.code == 'undefined' || json.code != '0000'){
 				Message.infor(null,json.message);
 				$('#loading').bPopup().close();
 				return;
 			}
        	 Message.infor(null,json.message,loadingLoginAgain);
        	 $('#popup_employee').bPopup().close();
        	 clearTextBox();
         },error:function(json){
        	 console.log(json); 
         }
	});
	$('#loading').bPopup().close();
}


function setValueForEdit(json){
	$('#emp_edit_id').val(json.object.userEntry.user_id);
	$('#emp_edit_name').val(json.object.userEntry.full_name);
	$('#emp_edit_id').val(json.object.userEntry.user_id)
	$('#emp_edit_phone').val(Common.phoneWithComma(json.object.userEntry.phone_nm,'-')) ;
	$('#emp_edit_email').val(json.object.userEntry.email);
	$('#emp_edit_address').val(json.object.userEntry.address) ;
	$('input[name=edit_gender][value='+json.object.userEntry.gender+']').prop('checked',true);
	$('#edit_file').attr({ value: '' }); 
	$('#edit_photo').attr('src','/khmoney/img/images/'+json.object.userEntry.photo);
}
function loadingLoginAgain(){
	window.location.href = "/khmoney/logout";
}
