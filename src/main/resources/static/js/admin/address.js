/**
 * 
 */

$(document).ready(function(){
	
	provinceListAll();
	
	$(document).on('click','.btn_cancel,.btn_close',function(){
		$('#popup_province').bPopup().close();
		$('#popup_district').bPopup().close();
		$('#popup_commune').bPopup().close();
		$('#popup_village').bPopup().close();		
	});
	
	$('#btn_add_province').click(function(){
		provinceSaveNew();
	});
	$('#btn_add_district').click(function(){
		districtSaveNew();
	});
	$('#btn_add_commune').click(function(){
		communeSaveNew();
	});
	
	$('#btn_add_village').click(function(){
		villageSaveNew();
	});
});

function provinceListAll(){
	$('#loading').bPopup();
	$.ajax({
		type:'GET',
		url :'/khmoney/admin/provinceListAll',
		complete:function(xhr,status){
			var json = $.parseJSON(xhr.responseText);
			console.log(json);
			 if (json.status == '901') {
                 alert(json.message);
                 window.location = json.path;
            }
			if (json.status == 'undefined' || json.status != '0000'){
				Message.infor(null,json.message);
				return;
			}
			var province = json.object;
			var opt       = '';
			$('#cssmenu>ul').empty();
			$.each(province,function(index,value){
				opt += '<li class="has-sub"><a href="javascript:" class="province" data-id="'+value.pro_id+'" onClick="districtsListByProId(this)"><span>'+value.name_kh+'</span></a></li>';
			});
			opt += '<li><a href="javascript:" onClick="provinceAddNew()"><span>បន្ថែមខេត្ដថ្មី</span></a></li>';
			$('#cssmenu>ul').append(opt);
		},error:function(json){
			console.log(json);
		}
	});
	$('#loading').bPopup().close();
}
function districtsListByProId(obj){	
	if ($(obj).parent('li').hasClass('has-sub')){
		$(obj).parent('li').removeClass('has-sub');
		$(obj).parent('li').addClass('active');
	}else{
		$(obj).parent('li').addClass('has-sub');
		$(obj).parent('li').removeClass('active');
		$(obj).next('ul').hide('slow');
		return;
	}
	$('#loading').bPopup();
	$.ajax({
		type:'GET',
		url :'/khmoney/admin/districtsListByProId',
		data:'proId='+$(obj).attr('data-id'),
		complete:function(xhr,status){
			var json = $.parseJSON(xhr.responseText);
			 if (json.status == '901') {
                 alert(json.message);
                 window.location = json.path;
            }
			if (json.status == 'undefined' || json.status == '9999'){
				Message.infor(null,json.message,null);
				return;
			}
			var districts = json.object.listDistricts;
			var opt       = '<ul>';
			$(obj).next().remove();
			$.each(districts,function(index,value){
				opt += '<li class="has-sub"><a href="javascript:" class="district" data-id="'+value.dis_id+'" onClick="communesListByDisId(this)"><span>'+value.name_kh+'</span></a></li>';
			});
			opt += '<li><a href="javascript:" onClick="districtAddNew(this)"><span>បន្ថែមស្រុកថ្មី</span></a></li>';
			opt += '</ul>'
			$(obj).parent('li').append(opt).hide().show('slow');
		},error:function(json){
			console.log(json);
		}
	});
	$('#loading').bPopup().close();
}
function communesListByDisId(obj){
	if ($(obj).parent('li').hasClass('has-sub')){
		$(obj).parent('li').removeClass('has-sub');
		$(obj).parent('li').addClass('active');
	}else{
		$(obj).parent('li').addClass('has-sub');
		$(obj).parent('li').removeClass('active');
		$(obj).next('ul').hide('slow');
		return;
	}
	$('#loading').bPopup();
	$.ajax({
		type:'GET',
		url :'/khmoney/admin/communesListByDisId',
		data:'comDisId='+$(obj).attr('data-id'),
		complete:function(xhr,status){
			var json = $.parseJSON(xhr.responseText);
			 if (json.status == '901') {
                 alert(json.message);
                 window.location = json.path;
            }
			if (json.status == 'undefined' || json.status == '9999'){
				Message.infor(null,json.message,null);
				return;
			}
			var communes = json.object.listCommunes;
			var opt       = '<ul>';
			$(obj).next().remove();
			$.each(communes,function(index,value){
				opt += '<li class="has-sub"><a href="javascript:" class="commune" data-id="'+value.comm_id+'" onClick="villageListByComId(this)"><span>'+value.name_kh+'</span></a></li>';
			});
			opt += '<li><a href="javascript:" onClick="communeAddNew(this)"><span>បន្ថែមឃុំថ្មី</span></a></li>';
			opt += '</ul>'
			$(obj).parent('li').append(opt).hide().show('slow');
		},error:function(json){
			console.log(json);
		}
	});
	$('#loading').bPopup().close();
}
function villageListByComId(obj){
	if ($(obj).parent('li').hasClass('has-sub')){
		$(obj).parent('li').removeClass('has-sub');
		$(obj).parent('li').addClass('active');
	}else{
		$(obj).parent('li').addClass('has-sub');
		$(obj).parent('li').removeClass('active');
		$(obj).next('ul').hide('slow');
		return;
	}
	$('#loading').bPopup();
	$.ajax({
		type:'GET',
		url :'/khmoney/admin/villageListByComId',
		data:'vilComId='+$(obj).attr('data-id'),
		complete:function(xhr,status){
			var json = $.parseJSON(xhr.responseText);
			 if (json.status == '901') {
                 alert(json.message);
                 window.location = json.path;
            }
			if (json.status == 'undefined' || json.status == '9999'){
				Message.infor(null,json.message,null);
				return;
			}
			var villages = json.object.listVillages;
			var opt       = '<ul>';
			$(obj).next().remove();
			$.each(villages,function(index,value){
				opt += '<li><a href="javascript:" class="villages"><span>'+value.name_kh+'</span></a></li>';
			});
			opt += '<li><a href="javascript:" onClick="villageAddNew(this)"><span>បន្ថែមភូមិថ្មី</span></a></li>';
			opt += '</ul>'
			$(obj).parent('li').append(opt).hide().show('slow');
		},error:function(json){
			console.log(json);
		}
	});
	$('#loading').bPopup().close();
}

function provinceAddNew(){
	$('#popup_province').bPopup();
}
function districtAddNew(obj){
	$('#popup_district').bPopup();
	var address = $(obj).parent('li').parent('ul').parent('li').find('a.province span').text();
	var id      = $(obj).parent('li').parent('ul').parent('li').find('a.province').attr('data-id'); 
	$('#disProId').val(id);
	$('#address div').text(address);
	
}
function communeAddNew(obj){
	$('#popup_commune').bPopup();
	var address  = 'ខេត្ដ '+$(obj).parent('li').parent('ul').parent('li').parent('ul').parent('li').find('a.province span').text();
	    address += ' ស្រុក ' +$(obj).parent('li').parent('ul').parent('li').find('a.district span').text();
	var id      = $(obj).parent('li').parent('ul').parent('li').find('a.district').attr('data-id'); 
	$('#comDisId').val(id);
	$('#address_commune div').text(address);
	
}
function villageAddNew(obj){
	$('#popup_village').bPopup();
	var address = ' ខេត្ដ  ' +$(obj).parent('li').parent('ul').parent('li').parent('ul').parent('li').parent('ul').parent('li').find('a.province span').text();
	   address += ' ស្រុក ' +$(obj).parent('li').parent('ul').parent('li').parent('ul').parent('li').find('a.district span').text();   
	   address += '  ឃុំ  ' +$(obj).parent('li').parent('ul').parent('li').find('a.commune span').text();
	var id      = $(obj).parent('li').parent('ul').parent('li').find('a.commune').attr('data-id'); 
	$('#vilComId').val(id);
	$('#address_villages div').text(address);
	
}
function provinceSaveNew(){
	$('#loading').bPopup();
	var data = {
			'proName'  : $('#proName').val(),
			'proStatus': '1'
	}
	//console.log(data);
	$.ajax({
		type:'GET',
		url :'/khmoney/admin/provinceSaveNew',
		data:data,
		complete:function(xhr,status){
			var json = $.parseJSON(xhr.responseText);
			 if (json.status == '901') {
                 alert(json.message);
                 window.location = json.path;
            }
			if (json.status == 'undefined' || json.status == '9999'){
				Message.infor(null,json.message,null);
				return;
			}
			$('#proName').val('');
			$('#popup_province').bPopup().close();
			Message.infor(null,json.message,provinceListAll());
		},error:function(json){
			console.log(json);
		}
	});
	$('#loading').bPopup().close();
}
function districtSaveNew(){
	var data = {
			'disProId' : $('#disProId').val()  ,
			'disName'  : $('#disName').val()   ,
			'disStatus': '1' 
	}
	//console.log(data);
	$('#loading').bPopup();
	$.ajax({
		type:'GET',
		url :'/khmoney/admin/districtSaveNew',
		data:data,
		complete:function(xhr,status){
			var json = $.parseJSON(xhr.responseText);
			 if (json.status == '901') {
                 alert(json.message);
                 window.location = json.path;
            }
			if (json.status == 'undefined' || json.status == '9999'){
				Message.infor(null,json.message,null);
				return;
			}
			$('#disName').val('');
			$('#popup_district').bPopup().close();
			Message.infor(null,json.message,null);
		},error:function(json){
			console.log(json);
		}
	});
	$('#loading').bPopup().close();
}

function communeSaveNew(){
	var data = {
			'comDisId' : $('#comDisId').val()  ,
			'comName'  : $('#comName').val()   ,
			'comStatus': '1' 
	}
	console.log(data);
	$('#loading').bPopup();
	$.ajax({
		type:'GET',
		url :'/khmoney/admin/communeSaveNew',
		data:data,
		complete:function(xhr,status){
			var json = $.parseJSON(xhr.responseText);
			 if (json.status == '901') {
                 alert(json.message);
                 window.location = json.path;
            }
			if (json.status == 'undefined' || json.status == '9999'){
				Message.infor(null,json.message,null);
				return;
			}
			$('#comName').val('');
			$('#popup_commune').bPopup().close();
			Message.infor(null,json.message,null);
		},error:function(json){
			console.log(json);
		}
	});
	$('#loading').bPopup().close();
}

function villageSaveNew(){
	var data = {
			'vilComId' : $('#vilComId').val()  ,
			'vilName'  : $('#vilName').val()   ,
			'vilStatus': '1' 
	}
	console.log(data);
	$('#loading').bPopup();
	$.ajax({
		type:'GET',
		url :'/khmoney/admin/villageSaveNew',
		data:data,
		complete:function(xhr,status){
			var json = $.parseJSON(xhr.responseText)
			 if (json.status == '901') {
                 alert(json.message);
                 window.location = json.path;
            }
			if (json.status == 'undefined' || json.status == '9999'){
				Message.infor(null,json.message,null);
				return;
			}
			$('#vilName').val('');
			$('#popup_village').bPopup().close();
			Message.infor(null,json.message,null);
		},error:function(json){
			console.log(json);
		}
	});
	$('#loading').bPopup().close();
}
