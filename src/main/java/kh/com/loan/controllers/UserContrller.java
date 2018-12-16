package kh.com.loan.controllers;



import java.util.HashMap;
import java.util.List;


import javax.servlet.http.HttpServletRequest;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import kh.com.loan.domains.Images;
import kh.com.loan.domains.Message;
import kh.com.loan.domains.User;
import kh.com.loan.services.UserService;
import kh.com.loan.utils.ConstsUtils;
import kh.com.loan.utils.KHException;
import kh.com.loan.utils.PermissionUtils;
import kh.com.loan.utils.SessionUtils;
import kh.com.loan.utils.UploadFileUtils;


@Controller
public class UserContrller {
	
	@Autowired
	private UserService userService;
	@Autowired
	private Environment env;
	
	@RequestMapping(value = "/loadingUserList", method = RequestMethod.POST)
	public @ResponseBody Message loadingUserList(@RequestBody User user) throws KHException {
		if ( !PermissionUtils.permissionAccess(ConstsUtils.EMPLOYEE_PERMISSION_LIST)){
			return new Message(ConstsUtils.ERROR_PERMISSIONS_CODE, "not allow list employee");
		}
		return userService.loadingUserList(user);
	}
	
	@RequestMapping(value = "/employee", method = RequestMethod.GET)
	public String loadingEmployee() throws KHException {
		if ( !PermissionUtils.permissionAccess(ConstsUtils.EMPLOYEE_PERMISSION_LIST)){
			return "redirect:/permission-not-allwo";
		}
		return "user";
	}
	
	@RequestMapping(value = "/employee-create", method = RequestMethod.POST)
	public @ResponseBody Message employee(@RequestParam HashMap<String, Object> params,@RequestParam(name = "file", required = false) MultipartFile file,HttpServletRequest request) {
		System.out.println(" Hello ===="+params+"  "+file);
		
		if ( ! PermissionUtils.permissionAccess(ConstsUtils.EMPLOYEE_PERMISSION)){
			return new Message(ConstsUtils.ERROR_PERMISSIONS_CODE, "not allow permission");
		}
		// * --------------------------------------------------------------------
		// * 
		// *---------------------------------------------------------------------
		String path  = System.getProperty("user.dir") + env.getProperty(ConstsUtils.PATH_PROFILE_USER_IMAGE);
		Images image = new Images();
		System.out.println(" Hello ===="+path);
		
		
		// * --------------------------------------------------------------------
		// * 
		// *---------------------------------------------------------------------
		//System.out.println(path);
		//System.out.println(UploadFileUtils.UploadSingleFile(image, file, path));
		if (UploadFileUtils.UploadSingleFile(image, file, path)){
		   params.put("photo", image.getImage());
		}
		//System.out.println(image.getImage());
		
		return userService.insertNewUser(params);
		
		
	}
	
	@RequestMapping(value = "/employeeGetById" , method = RequestMethod.GET)
	public @ResponseBody Message employeeGetById(@RequestParam int user_id) throws KHException {
		return userService.employeeGetById(user_id);
	}
	
	@RequestMapping(value = "/employeeChangePassword" , method = RequestMethod.POST)
	public @ResponseBody Message employeeChangePassword(@RequestBody HashMap<String, String> params) throws KHException{
		System.out.println(params);
		return userService.employeeChangePassword(params);
	}
	
	@RequestMapping(value = "/employeeChangeInformation" , method = RequestMethod.POST)
	public @ResponseBody Message employeeChangeInformation(@RequestParam HashMap<String, String> params,@RequestParam(name = "file", required = false) MultipartFile file) {
		    System.out.println("user == " + params);

			String path  = System.getProperty("user.dir") + env.getProperty(ConstsUtils.PATH_PROFILE_USER_IMAGE);
			Images image = new Images();
			// * --------------------------------------------------------------------
			// * 
			// *---------------------------------------------------------------------
			//System.out.println(path);
			//System.out.println(UploadFileUtils.UploadSingleFile(image, file, path));
			//System.out.println(" not null ");
			if (UploadFileUtils.UploadSingleFile(image, file, path)){	
				if ( file == null) {
					params.put("photo", "");
				}else {
					params.put("photo", image.getImage());
				}
			   
			}
			//System.out.println(image.getImage());
			return userService.employeeChangeInformation(params);
		
	}
	
	@RequestMapping(value = "/employee-delete" , method = RequestMethod.GET)
	public @ResponseBody Message employeeDelete(@RequestParam int userId) throws KHException{
		if ( !PermissionUtils.permissionAccess(ConstsUtils.EMPLOYEE_PERMISSION_DELETE)){
			return new Message(ConstsUtils.ERROR_PERMISSIONS_CODE,"not allow to delete user aother!");
		}
		return userService.employeeDelete(userId);
	}
	
	/*@RequestMapping(value = "/employeeSetPermission" , method = RequestMethod.GET)
	public @ResponseBody Message employeeSetPermission(@RequestParam int userId) throws KHException{
		return userService.employeeSetPermission(userId);
	}
	
	@RequestMapping(value = "/employeeUpdatePermission" , method = RequestMethod.POST)
	public @ResponseBody Message employeeUpdatePermission(@RequestBody List<HashMap<String,String>> params) throws KHException{
		
		int userId = Integer.valueOf(params.get(0).get("userId"));
		if ( ! PermissionUtils.permissionAccess(ConstsUtils.EMPLOYEE_PERMISSION)){
			return new Message("8888", "not allow change permission",userService.employeeSetPermissions(userId));
		}
		
		return userService.insertOrUpdateUserInformation(params);
	}*/
	
	
	
	@RequestMapping(value = "/loadingMenuUser" , method = RequestMethod.GET)
	public @ResponseBody Message loadingMenuUser(){
		
		User user = SessionUtils.getSubPermission();		
		return userService.employeeSetPermission(user.getUser_id());
	}
	
	
 
}
