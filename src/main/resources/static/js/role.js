/**
 * 
 */
$(document).ready(function(){
	loadingRoleList(1);
	$('#btn_addMore').click(function(){
		$('.main_menu ul li').removeClass('active');
		$('#popup_role').bPopup();
		getListMenu();
		
	});
	$('#btn_save').click(function(e){		
		addNewRole(e);
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
function loadingRoleList(page){
	$('#loading').bPopup();
	$.ajax({
		type:'GET',
		url :window.location.pathname+'-list',
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
			$('#tbl_user tbody').empty();
			$('#tbl_user tfoot').hide();
			$('#tbl_user tbody').show();
			if (roleList.length > 0){				
				$.each(roleList,function(index,value){
					tbl += '<tr>'
						+'<td><div><input type="checkbox"></div></td>'
						+'<td><div>'+(index+1)+'</div></td>'
						+'<td><div>'+value.role_name+'</div></td>'
						+'<td><div>'+value.full_name+'</div></td>'
						+	'<td><div>'
						+	' <a href="javascript:" role-id="'+value.role_id+'" com-id="'+value.company.com_id+'" onClick="deleteRoleInformation(this);" style="width:100%;margin:0px;text-align:center;">លុប</a> '	
						+	'</div></td></tr>';
					
				});
	
				$('#tbl_user tbody').append(tbl);
				
			}else{
				$('#tbl_user tbody').hide();
				$('#tbl_user tfoot').show();
			}
			
		 
		     $('#loading').bPopup().close();
		},error:function(json){
			console.log(json);
		}
		
	});
}

function addNewRole(e){
	e.preventDefault();
	if ($('#role_name').val() == ''){
		Message.infor(null,'សូមបញ្ចូលឈ្មោះកាត់!',null);
		return;
	}
	if ($('#full_names').val() == ''){
		Message.infor(null,'សូមបញ្ចូលឈ្មោះពេញ!',null);
		return;
	}
	
	var data = {};
	
	console.log($('#full_names').val())
	//$('#loading').bPopup();
	
	
	var dt = [];
	$('.main_menu ul li').each(function(index){
		if ($(this).hasClass('active')){
			var d ={
					'menu_id': parseInt($(this).attr('data'))
					
			}
			dt.push(d);
		}
		
	});
	
	if ( dt.length <= 0 ){
		Message.infor(null,'Please select Menu Mode'); 
		return;
	}
	
	data = {
			'role_name'  : $('#role_name').val() ,
			'full_name'  : $('#full_names').val(),
			'r_sts'      :'3',
			'menus'      : dt
	}
	//console.log(data);
	var token = $('#_csrf').attr('content');
	var header = $('#_csrf_header').attr('content');
	console.log(data);
	$.ajax({
		url:window.location.pathname+'-create',
		type:'POST',
		contentType : 'application/json; charset=utf-8',
        dataType : 'json',
	    data:JSON.stringify(data),
	    beforeSend: function(xhr) {
            xhr.setRequestHeader(header, token)
         },
         complete: function(xhr, status) {
        	var json =  $.parseJSON(xhr.responseText);
 			console.log('json === '+xhr.responseText);
            if (json.status == '901') {
            	Message.infor(null,json.message,Common.redictPage,json.path);      
                return;
            }
            if (json.status == 'undefined' || json.status != '0000'){
 				Message.infor(null,json.message);
 				return;
 			}
        	Message.infor(null,json.message,loadingRoleList,1);
        	$('#popup_role').bPopup().close();
        	 clearTextBox();
         },error:function(json){
        	 console.log(json); 
         }
	});
	$('#loading').bPopup().close();
}

function deleteRoleInformation(obj){
	if (!window.confirm("Do you really want to leave?")) { 
		return; 
	}	
	var company = {
			com_id : parseInt($(obj).attr('com-id'))
	}
	var data = {
			role_id : parseInt($(obj).attr('role-id')),
			company : company
	}
	console.log(data);
	var token = $('#_csrf').attr('content');
	var header = $('#_csrf_header').attr('content');
	$.ajax({
		url:window.location.pathname+'-delete',
		type:'POST',
		contentType : 'application/json; charset=utf-8',
        dataType : 'json',
	    data:JSON.stringify(data),
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
        	Message.infor(null,json.message,loadingRoleList,1);
	    	
	    }, error:function(json){
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
	$('#photo').attr('src','/khmoney/img/images/employee.png');
}
function getListMenu(){
	$.ajax({
		url:'./menuList',
		type:'GET',
        complete:function(xhr,status){        	
        	 var json = $.parseJSON(xhr.responseText) ;  
        	 if (json.status == '901') {
        		 Message.infor(null,json.message,Common.redictPage,json.path);      
        		 return;
             }
        	 if (json.status == 'undefined' || json.status != '0000'){
 				Message.infor(null,json.message);
 			 }
        	 console.log(json);
        	 var tbl = '';
        	 var list= json.object;
        	 $('.main_menu ul').empty();
             if (list.length > 0 ){
            	 $.each(list,function(index,value){
            		 
            		 tbl += ' <li data="'+value.menu_id+'"  style="border-radius: 0px;width: 115px;border: 2px solid #fff;" onClick="setAction(this)" >'
            			 +  '<div style="height:70px;">'
            			 +  '<a href="javascript:">'
            			 +  '<img alt="loaner" src="img/logo/'+value.icon+'" width="70" height="70">'
            			 +  '</a>'
            			 +  '</div>'
            			 +  ' <a href="javascript:" style="font-size: 11px;height: 30px !important;line-height: 30px !important;" >'
            		     +  '<span>'+value.menu_name+'</span>'
            		     +  '</a>'
            		     +  '</li>';
            	 });
            	 $('.main_menu ul').append(tbl);
             }

         },error:function(json){
        	 console.log(json); 
         }
	});
}
function setAction(obj){
	if ($(obj).hasClass('active')){
		$(obj).removeClass('active');
	}else{
		$(obj).addClass('active');
	}
}
