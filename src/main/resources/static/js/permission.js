/**
 * 
 */
$(document).ready(function(){
	getlistPermission();

	$('#btn_save').click(function(){
		Message.confirm(null,"Do you really want to update permission this employee?",updatePermission);
		
	});
	
	$('#btn_edit_role').click(function(){
		$('#loading').bPopup();		
		loadingRoleList();
	});
	
	$(document).on('click','.btn_cancel,.btn_close',function(){
		$('.alert_wrap').bPopup().close();
	});
	
	$('#btn_view_edit').click(function(){
		loadingPermission();
	});
});

function getlistPermission(){
	$('#loading').bPopup();
	console.log($('#per_user_id').val());
	$.ajax({
		type:'GET',
		url :'/khmoney/permission-list',
		data:'userId='+$('#per_user_id').val(),
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

			$('#user_id').val(json.object.user_id);
			$('#employee_code').val(json.object.user_code);
			$('#employee-name').val(json.object.full_name);
			$('input[name=gender][value='+json.object.gender+']').prop('checked',true)
			$('#phone').val(Common.phoneWithComma(json.object.phone_nm,'-')) ;
			$('#address').val(json.object.address);
			$('#email').val(json.object.email);
			
			var roles       = json.object.roles;			
			var tbl         = ''               ;
			
			$('#user_permission tbody').empty();
			$('#roles').empty();
			if ( roles.length > 0 ){
				$.each(roles,function(roleI,roleVal){
					// 1. read role list to view
					if (roles.length == (roleI +1)){
						$('#roles').append('<span class="role-permission" data-id="'+roleVal.role_id+'">'+roleVal.full_name +'('+roleVal.role_name+')</span> ')
					}else{
						$('#roles').append('<span class="role-permission" data-id="'+roleVal.role_id+'">'+roleVal.full_name +'('+roleVal.role_name+')</span> , ')
					}
					
					var menus       = roleVal.menus      ;
					var permissions = roleVal.permissions;
					
					if ( menus.length > 0 ){
						$.each(menus,function(index,value){
							// 2. read menu list to view 
							tbl += ' <tr>'
								+  '<th><div></div></th>'
								+  '<th><div>'+value.menu_name+'</div></th>'
								+  '<th><div> 	'
								+  '</div></th>'
								+  '<th><div style="height:20px;position:absolute;right: 20px;top: 0px;width: 40px;cursor:pointer;">'
								+  '</div></th></tr> ';
							if ( permissions.length > 0 ){
								$.each(permissions,function(i,val){
									var sts = 'permission_off'
									if ( val.sts == '1' ){
										 sts = 'permission_on'
									}
									// 3. read permission by menu id
									if (value.menu_id == val.menu.menu_id){
										tbl += '<tr class="permission">'
											+  '<td><div><input type="hidden" value="'+val.menu.menu_id+'" class="menu_id" ><input type="hidden" value="'+roleVal.role_id+'" class="role_id" ></div></td>'
											+  '<td><div><input type="hidden" value="'+json.object.user_id+'" class="user_id" ><input type="hidden" value="'+val.per_id+'" class="per_id" ></div></td>'
											+  '<td><div>'+val.name+'</div></td>'
											+  '<td><div class="per  '+sts+'" onClick="changePermission(this)" style="height:20px;position:absolute;right: 20px;top: 0px;width: 40px;cursor:pointer;"></div></td>'
											+  '</tr> ';									
									}
								});
							}
							
						});
					}
				});
			}
			$('#user_permission tbody').append(tbl);
		    $('#loading').bPopup().close();
		},error:function(json){
			console.log(json);
		}
		
	});
}

function updatePermission(){	
	
	
	$('#loading').bPopup();
	var permissions     = [];
	$.each($('.permission-setting tbody tr.permission'),function(){
		   var sts = '';
		   if ($(this).find('.per').hasClass('permission_on')){
			   sts = '1';
		   }else{
			   sts = '9';
		   }
		   // 1. menu object for Menu.class
		   var menu = {
				   'menu_id':$(this).find('.menu_id').val()   
		   }
		   // 2. menu object for Role.class
		   var role = {
				  'role_id':$(this).find('.role_id').val()  
		   }
		   // 3. menu object for User.class
		   var user = {
				  'user_id':$(this).find('.user_id').val()
		   }
		   
		   // 4. set permission parameter and object permission (menu,role,user)
		   var d = {
				
				'user'   :user,
				'role'   :role,
				'menu'   :menu,
				'per_id' :$(this).find('.per_id').val(),				
				'sts'    :sts
		         }
		   permissions.push(d);
	});
	
	
	
	var user = {
		'user_id'     : $('#per_user_id').val(),
		'permissions' : permissions
	}
	
	var token = $('#_csrf').attr('content');
	var header = $('#_csrf_header').attr('content');
	console.log(user);
	
	$.ajax({
		type:'POST',
		url :'/khmoney/permission-edit',
		contentType : 'application/json; charset=utf-8',
        dataType : 'json',
	    data:JSON.stringify(user),
	    beforeSend: function(xhr) {
            xhr.setRequestHeader(header, token)
         },
		complete:function(xhr,statu){
			var json = $.parseJSON(xhr.responseText);
			//console.log(json);
			if (json.status == '901') {
				Message.infor(null,json.message,Common.redictPage,json.path);   
                return;
            }
			if (json.status == 'undefined' || json.status != '0000'){
				Message.infor(null,json.message,null);
				return;
			}
			Message.infor(null,json.message,getlistPermission);
			$('#loading').bPopup().close();
		},error:function(json){
			console.log(json);
		}
		
	});
}

function changePermission(obj){
	var sts = '';
	if ($(obj).hasClass('permission_on')){
		$(obj).removeClass('permission_on');
		$(obj).addClass('permission_off');
		sts = '9';
	}else{
		$(obj).removeClass('permission_off');
		$(obj).addClass('permission_on');
		 sts = '1';
	}
	
	
		   
		  
   // 1. menu object for Menu.class
   var menu = {
		   'menu_id':parseInt($(obj).parents('tr').find('.menu_id').val()) 
   }
   // 2. menu object for Role.class
   var role = {
		  'role_id':parseInt($(obj).parents('tr').find('.role_id').val()) 
   }
   // 3. menu object for User.class
   var user = {
		  'user_id':parseInt($(obj).parents('tr').find('.user_id').val())
   }
   
   // 4. set permission parameter and object permission (menu,role,user)
   var permission = {
		
		'user'   :user,
		'role'   :role,
		'menu'   :menu,
		'per_id' :parseInt($(obj).parents('tr').find('.per_id').val()),				
		'sts'    :sts
         }
  
	
	
	
	
/*	var user = {
		'user_id'     : $('#per_user_id').val(),
		'permissions' : permissions
	}*/
	
	var token = $('#_csrf').attr('content');
	var header = $('#_csrf_header').attr('content');
	console.log(permission);

	$.ajax({
		type:'POST',
		url :'/khmoney/permission-edit-one',
		contentType : 'application/json; charset=utf-8',
        dataType : 'json',
	    data:JSON.stringify(permission),
	    beforeSend: function(xhr) {
            xhr.setRequestHeader(header, token)
         },
		complete:function(xhr,statu){
			var json = $.parseJSON(xhr.responseText);
			//console.log(json);
			if (json.status == '901') {
				Message.infor(null,json.message,Common.redictPage,json.path);   
                return;
            }
			if (json.status == 'undefined' || json.status != '0000'){
				Message.infor(null,json.message,null);
				return;
			}
			//getlistPermission();
			
		},error:function(json){
			console.log(json);
		}
		
	});
	
}

function loadingRoleList(){
	
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
            		var ch = '';
	            	$('#roles span').each(function(i,val){            		
	            			if (value.role_id == $(val).attr('data-id')){
	            				ch = 'checked';
	            			}
	            	});
	            	tbl += '<div><label><input type="checkbox" '+ch+' name="role" role-id="'+value.role_id+'" com-id="'+value.com_id+'">'+value.full_name+' ('+value.role_name+' )</label></div> ';
            	});
            }
			 $('#department td').append(tbl);
			 $('#popup_role_information').bPopup();
		     $('#loading').bPopup().close();
		},error:function(json){
			console.log(json);
		}
		
	});
}

function loadingPermission(){
	$('#loading').bPopup();
	console.log($('#per_user_id').val());
	
	var role = [];
	$.each($('input[name="role"]:checked'),function(index,value){
		var d = {
			'role_id': parseInt($(this).attr('role-id'))
		}
		role.push(d);
	});
	
	var user = {
			'roles'   : role
	}

	var token = $('#_csrf').attr('content');
	var header = $('#_csrf_header').attr('content');
	$.ajax({
		type:'POST',
		url :'/khmoney/check-permission-list',
		contentType: 'application/json; charset=utf-8',
		dataType:'json',
		data:JSON.stringify(user),
		beforeSend: function(xhr) {
            xhr.setRequestHeader(header, token)
         },
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

			var roles       = json.object.roles;
			
			var tbl         = ''                ;
			
			$('#user_permission tbody').empty();
			$('#roles').empty();
			if ( roles.length > 0 ){
				$.each(roles,function(roleI,roleVal){
					// 1. read role list to view
					if (roles.length == (roleI +1)){
						$('#roles').append('<span class="role-permission" data-id="'+roleVal.role_id+'">'+roleVal.full_name +'('+roleVal.role_name+')</span> ')
					}else{
						$('#roles').append('<span class="role-permission" data-id="'+roleVal.role_id+'">'+roleVal.full_name +'('+roleVal.role_name+')</span> , ')
					}
					
					var menus       = roleVal.menus      ;
					var permissions = roleVal.permissions;
					
					if ( menus.length > 0 ){
						$.each(menus,function(index,value){
							// 2. read menu list to view 
							tbl += ' <tr>'
								+  '<th><div></div></th>'
								+  '<th><div>'+value.menu_name+'</div></th>'
								+  '<th><div> 	'
								+  '</div></th>'
								+  '<th><div style="height:20px;position:absolute;right: 20px;top: 0px;width: 40px;cursor:pointer;">'
								+  '</div></th></tr> ';
							if ( permissions.length > 0 ){
								$.each(permissions,function(i,val){
									// 3. read permission by menu id
									if (value.menu_id == val.menu.menu_id){									
										tbl += '<tr class="permission">'
											+  '<td><div><input type="hidden" value="'+val.menu.menu_id+'" class="menu_id" ><input type="hidden" value="'+roleVal.role_id+'" class="role_id" ></div></td>'
											+  '<td><div><input type="hidden" value="'+$('#per_user_id').val()+'" class="user_id" ><input type="hidden" value="'+val.per_id+'" class="per_id" ></div></td>'
											+  '<td><div>'+val.name+'</div></td>'
											+  '<td><div class="per permission_on" onClick="changePermission(this)" style="height:20px;position:absolute;right: 20px;top: 0px;width: 40px;cursor:pointer;"></div></td>'
											+  '</tr> ';									
									}
								});
							}
							
						});
					}
				});
			}
			
			$('#user_permission tbody').append(tbl);
			$('#popup_role_information').bPopup().close();
		    $('#loading').bPopup().close();
		},error:function(json){
			console.log(json);
		}
		
	});
}