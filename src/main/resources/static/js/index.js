/**
 * 
 */
$(document).ready(function(){
	//loadingMenuUser();
});
function loadingMenuUser(){
	$('#loading').bPopup();
	$.ajax({
		url:'loadingMenuUser',
		type:'GET',
		success:function(json){
			console.log(json);
			var topMenu = '<li><a th:href="@{/}">ទំព័រដើម</a></li>';
			var mainMenu= '';
			var list = json.object.listPermission;
			if (list.length > 0){
				$.each(list,function(index,value){
					if (value.sts == '1'){
						var menuTitle = value.title.split('|');
						var menuLogo  = value.logo.split('|');
						var menuLinke = value.url.split('|');					
						if (menuTitle.length > 1){
							topMenu  += '<li><a href="/khmoney'+menuLinke[0]+'">'+menuTitle[0].replace(/\<br>/g, '')+'</a></li>';
							topMenu  += '<li><a href="/khmoney'+menuLinke[1]+'">'+menuTitle[1].replace(/\<br>/g, '')+'</a></li>'
							mainMenu += '<li style="border:none !important;"><div style="height:100px;"><a href="/khmoney'+menuLinke[0]+'">'
										+'<img alt="loaner"src="/khmoney/img/logo/'+menuLogo[0].replace(/\<br>/g, '')+'"></div>'
										+'<span>'+menuTitle[0].replace(/\<br>/g, '')+'</span>'
										+'</a></li>';
							mainMenu += '<li style="border:none !important;"><div style="height:100px;"><a href="/khmoney'+menuLinke[1]+'">'
										+'<img alt="loaner" src="/khmoney/img/logo/'+menuLogo[1].replace(/\<br>/g, '')+'"></div>'
										+'<span>'+menuTitle[1].replace(/\<br>/g, '')+'</span>'
										+'</a></li>';
						}else{
							topMenu  += '<li><a href="/khmoney'+menuLinke[0]+'">'+menuTitle[0].replace(/\<br>/g, '')+'</a></li>';
							mainMenu += '<li style="border:none !important;"><div style="height:100px;"><a href="/khmoney'+menuLinke[0]+'">'
										+'<img alt="loaner" src="/khmoney/img/logo/'+menuLogo[0].replace(/\<br>/g, '')+'"></div>'
										+'<span>'+menuTitle[0].replace(/\<br>/g, '')+'</span>'
										+'</a></li>';
						}						
						
					}					
				});
				$('#top_menu').append(topMenu);
				$('#main_menu').append(mainMenu);
			}
		},error:function(json){
			console.log(json);
		}
	});
	$('#loading').bPopup().close();
}