/**
 * 
 */
$(document).ready(function(){
	loadingUserList(1);
	$('#btn_addMore').click(function(){
		clearTextBox();
		$('#popup_employee').bPopup();
		loadingRoleList();
	});
	$('#btn_save').click(function(e){		
		employeeAddNew(e);
	});
	$(document).on('click','.btn_cancel,.btn_close',function(){
		$('.alert_wrap').bPopup().close();
	});
	
	$('#file').change(function(event){
		var tmppath = URL.createObjectURL(event.target.files[0]);
	    $("#photo").fadeIn("fast").attr('src',tmppath);    
	});
	$('#emp_phone').keyup(function(){
		$('#emp_phone').val(Common.phoneWithComma($('#emp_phone').val().replace(/\-/g, ''),"-"));
	});
	$('#btn_save_permission').click(function(){
		userUpdatePermission();
	});
});
function loadingUserList(page){
	$('#loading').bPopup();
	$.ajax({
		type:'GET',
		url :'/khmoney/loadingUserList',
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
			var userList = json.object.loadingUserList;
			var tbl = '';
			$('#tbl_user tbody').empty();
			$('#tbl_user tfoot').hide();
			$('#tbl_user tbody').show();
			if (userList.length > 0){
				var i = (parseInt(page)-1) * parseInt($('#num_rows').val().replace(/[​\-]/g,''));
				$.each(userList,function(index,value){
					tbl += '<tr>'
						+'<td><div><input type="checkbox"></div></td>'
						+'<td><div>'+(i+1)+'</div></td>'
						+'<td><div>'+value.full_name+'</div></td>'
						+'<td><div>'+(value.gender=='M'?'ប្រុស':'ស្រី')+'</div></td>'
						+'<td><div>'+Common.phoneWithComma(value.phone_nm.replace(/\-/g, ''),"-")+'</div></td>'
						+'<td><div>'+value.email+'</div></td>'
						+'<td><div>'+value.address+'</div></td>'
						+'<td><div>'+value.sts+'</div></td>'
						+'<td><div>' 					
						if (value.user_id != $('#user_id').val()){
					tbl +=	'         <a href="javascript:" data-id="'+value.user_id+'" onClick="deleteUserInformation(this);" style="width:30%;margin:0px;">លុប</a>|'
					tbl +=	'         <a href="permission-setting/'+parseInt(value.user_id)+'" data-id="'+value.user_id+'" /*onClick="setPermissionUser(this)"*/  style="width:30%;margin:0px;">សិទ្ធិ</a>' 
						}
					tbl +=	'</div></td></tr>';
					i++;
				});
				$('#tbl_user tbody').append(tbl);
				
			}else{
				$('#tbl_user tbody').hide();
				$('#tbl_user tfoot').show();
			}
			 var option = {
        			total       : json.object.loadingCountUserList,
    				maxVisible  : 10,
    				perPage     : $('#num_rows').val(),
    				currentPage : page,
    				numPage     : 1,
    				wrapClass   :'paging',
    				eventLink   :'goPageList'
        	 }
			 console.log(option);
		     pagination.showPage(option);
		     $('#loading').bPopup().close();
		},error:function(json){
			console.log(json);
		}
		
	});
}

function employeeAddNew(e){
	e.preventDefault();

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
	
	var role = [];
	$.each($('input[name="role"]:checked'),function(index,value){
		var d = {
			'role_id': parseInt($(this).attr('role-id'))
		}
		role.push(parseInt($(this).attr('role-id')));
	});
	
	if ( role.length <= 0 ){
		Message.infor(null,'pleasce select despartment');
		return;
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
	data.append('roles'             ,role);


	var token = $('#_csrf').attr('content');
	var header = $('#_csrf_header').attr('content');
	console.log(data);
	$.ajax({
		url:window.location.pathname+'-create',
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
        	Message.infor(null,json.message,loadingUserList,1);
        	 $('#popup_employee').bPopup().close();
        	 clearTextBox();
         }, error: function(result, options) {
        	 console.log(result); 
        	 console.log(options); 
         }
	});
	$('#loading').bPopup().close();
}


function deleteUserInformation(obj){
	if (!window.confirm("Do you really want to leave?")) { 
		return; 
	}	
	$.ajax({
		url:window.location.pathname+'-delete',
		type:'GET',
	    data:'userId='+$(obj).attr('data-id'),
	    complete:function(xhr,status){	
	    	var json =  $.parseJSON(xhr.responseText);   	
            if (json.status == '901') {            	 
            	Message.infor(null,json.message,Common.redictPage,json.path);      
                return;
            }
	    	if (json.status == 'undefined' || json.status != '0000'){
 				Message.infor(null,json.message);
 				return;
 			}
        	 Message.infor(null,json.message,loadingUserList,1);
	    	
	    }, error:function(json){
        	 console.log(json); 
         }
	});
	$('#loading').bPopup().close();
}

/*function setPermissionUser(obj){
	$.ajax({
		url:window.location.pathname+'SetPermission',
		type:'GET',
	    data:'userId='+$(obj).attr('data-id'),
        complete:function(xhr,status){        	
        	var json = $.parseJSON(xhr.responseText) ;
        	
        	 if (json.status == '901') {
                 alert(json.message);
                 window.location = json.path;
                 return;
            }
        	if (json.status == 'undefined' || json.status != '0000'){
 				Message.infor(null,json.message,null);
 			 }
        	console.log(json);
        	 var tbl = '';
        	 var list= json.object.listPermission;
        	 $('#user_permission table tbody').empty();
        	 if (list.length > 0 ){
        		 $.each(list,function(index,value){
        			 var permission = 'permission_off';
        			 if (value.sts == '1'){
        				 permission = 'permission_on' 
        			 }
        			 tbl += '<tr>'
							  +'<td  colspan="3">'
							  +'<div class="t_left">'+value.title.replace(/\<br>/g, '')+'<input type="hidden" value="'+value.user_id+'" class="user_id"/>'
							  +'<input type="hidden" value="'+value.p_id+'" class="p_id"/></div>'
							  +'</td>'
							  +'<td><div class="t_center '+permission+'" onClick="changePermission(this)" style="height:20px;position:absolute;right: 0px;top: 0px;width: 40px;cursor:pointer;"></div></td>'
							+'</tr>';
        		 });
        		 $('#user_permission table tbody').append(tbl);
        	 }
         },error:function(json){
        	 console.log(json); 
         }
	});
	
	$('#popup_employee_permission').bPopup();
	
}*/


function userUpdatePermission(){
	var obj  = [];
	var order= 1 ;
	$.each($('#user_permission table tbody tr'),function(index,value){
		var sts='0',data = {};
		if ($(value).find('td div').hasClass('permission_on')){
			sts = '1';
		}else{
			sts = '9'
		}
	
		data = {
				'userId':$(value).find('.user_id').val(),
				'pId'   :$(value).find('.p_id').val(),
				'sts'   :sts,
				'order' :order+''
		}
		order++;
		obj.push(data);
	});
	console.log(obj);
	var token = $('#_csrf').attr('content');
	var header = $('#_csrf_header').attr('content');
	$.ajax({
		url:window.location.pathname+'UpdatePermission',
		type:'POST',
	    contentType: 'application/json; charset=utf-8',
	    dataType:'json',
	    data:JSON.stringify(obj),
	    beforeSend: function(xhr) {
            xhr.setRequestHeader(header, token)
         },
         complete:function(xhr,status){
        	 var json = $.parseJSON(xhr.responseText);
        	 if (json.status == '901') {
        		 Message.infor(null,json.message,Common.redictPage,json.path);      
                 return;
            }
        	 if (json.status == 'undefined' || json.status != '0000'){
 				Message.infor(null,json.message);
 				return;
 			}
        	
        	 Message.infor(null,json.message,null);
        	 var tbl = '';
        	 var list= json.object.listPermission;
        	 $('#user_permission table tbody').empty();
        	 if (list.length > 0 ){
        		 $.each(list,function(index,value){
        			 var permission = 'permission_off';
        			 if (value.sts == '1'){
        				 permission = 'permission_on' 
        			 }
        			 tbl += '<tr>'
							  +'<td  colspan="3">'
							  +'<div class="t_left">'+value.title.replace(/\<br>/g, '')+'<input type="hidden" value="'+value.user_id+'" class="user_id"/>'
							  +'<input type="hidden" value="'+value.p_id+'" class="p_id"/></div>'
							  +'</td>'
							  +'<td><div class="t_center '+permission+'" onClick="changePermission(this)" style="height:20px;position:absolute;right: 0px;top: 0px;width: 40px;cursor:pointer;"></div></td>'
							+'</tr>';
        		 });
        		 
        		 $('#user_permission table tbody').append(tbl);
        	 }
         },error:function(json){
        	 console.log(json); 
         }
	});
	$('#loading').bPopup().close();
}
function clearTextBox(){
	$('#emp_name').val('');
	$('#emp_phone').val('') ;
	$('#emp_email').val('');
	$('#emp_address').val('') ;
	$('#user_name').val('');
	$('#password').val('') ;
	$('#confirm_password').val('');
	$('#male').prop('checked',true);
	$('#file').attr({ value: '' }); 
	$('#photo').attr('src','/khmoney/img/images/default_logo.png');
}
function isValidEmailAddress(emailAddress) {
    var pattern = new RegExp(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/);
    return pattern.test(emailAddress);
};
function loadingRoleList(){
	$('#loading').bPopup();
	$.ajax({
		type:'GET',
		url :'/khmoney/role-setting-list',
		data:'r_sts=3',
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
			var roleList = json.object;
			var tbl = '';
			 $('#department td').empty();
            if (roleList.length > 0 ){
            	$.each(roleList,function(index,value){
            		tbl += '<div><label><input type="checkbox" name="role" role-id="'+value.role_id+'" com-id="'+value.com_id+'">'+value.full_name+' ('+value.role_name+' )</label></div> ';
            	});
            }
			 $('#department td').append(tbl);
		 
		     $('#loading').bPopup().close();
		},error:function(json){
			console.log(json);
		}
		
	});
}