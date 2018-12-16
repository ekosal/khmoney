package kh.com.loan.services;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kh.com.loan.domains.Message;
import kh.com.loan.domains.User;
import kh.com.loan.enums.UserSts;
import kh.com.loan.mappers.UserMapper;
import kh.com.loan.utils.Common;
import kh.com.loan.utils.KHRTException;
import kh.com.loan.utils.SessionUtils;

@Service
public class UserService {
	
	@Autowired
	private UserMapper userMapper;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	/**
	 *  ----------------------------------------------------------
	 *  get user information for log by username
	 *  @param username 
	 *  @return    user object : user information details
	 * ------------------------------------------------------------
	 */
	public User loadUserByUsername (String username) {		
		return userMapper.loadUserByUsername(username);		
		
	}
	
	public int loadingUserIdMax()
	{
		return userMapper.loadingUserIdMax();
	}
	/**
	 *  ----------------------------------------------------------
	 *  Get all Permission in personal employee
	 * @param user_id
	 * @return
	 * -----------------------------------------------------------
	 */
	
	public Message loadingUserList(User u_param) {
		try {
			
			HashMap<String, Object> result = new HashMap<>();
			User user = SessionUtils.getSubPermission();	
			
		
			user.setPagination(u_param.getPagination());
			u_param.getPagination().setTotalCount(userMapper.loadingCountAllUser(user.getCompany().getCom_id()));
	
			
			result.put("loadingUserList", userMapper.loadingAllUser(user));
			result.put("pagination"     , user.getPagination()           );
			
			return new Message("0000",result);
			
		}catch(Exception e) {
			throw new KHRTException("9999", e.getMessage());
		}
	}
	/*
	 * ----------------------------------------------------------
	 *  insert new employee into table ld_user_info
	 *  insert by company id
	 * ----------------------------------------------------------
	 */	
	@Transactional(value="transactionManager",rollbackFor={KHRTException.class,Exception.class})
	public Message insertNewUser(HashMap<String, Object> params) {
		try{
			/* -------------------------------------------------
			 *  initialize Variable 
			 * ------------------------------------------------
			 */
			User user = SessionUtils.getSubPermission();
		    User userNew = new User();
			/*check user login information */
		    /* -------------------------------------------------
			 *   Validations Variable 
			 * ------------------------------------------------
			 */
		   if (String.valueOf(params.get("photo")).equals("")){
			   params.put("photo","employee.png");
		   }
		   if (!String.valueOf(params.get("password")).equals(String.valueOf(params.get("confirmPassword")))){
			   throw new KHRTException("9999", "ពាក្យសំងាត់ និងបញ្ជាក់ពាក្យមិនត្រូវគ្នាទ!");
		   }
		   
		   if (userMapper.loadUserByUsername(params.get("username").toString()) != null) {
			   throw new KHRTException("9999", "ឈ្មោះអ្នកប្រើប្រាស់មានរួចហើយ សូមដាក់ឈ្មោះផ្សេងទៀត!");
		   }
		   /* -------------------------------------------------
			*   set value into userNew object
			* ------------------------------------------------
			*/		  
		   userNew.setFull_name(params.get("full_name").toString());
		   userNew.setGender(params.get("gender").toString());
		   userNew.setEmail(params.get("email").toString());
		   userNew.setAddress(params.get("address").toString());
		   userNew.setUsername(params.get("username").toString());
		   userNew.setPhone_nm(params.get("phone_nm").toString());
		   userNew.setPhoto(params.get("photo").toString());
		   userNew.setCompany(user.getCompany());
		   userNew.setPassword( passwordEncoder.encode(String.valueOf(params.get("password"))));
		   userNew.setSts(UserSts.ACTIVE.getValue());
		   userNew.setModify_dt(Common.getCurrentDate());
		   userNew.setModify_by(user.getUser_id());
	       userNew.setAction("បញ្ចូលពត័មានអំពីអ្នកប្រើប្រាស់ថ្មី!");
	       userNew.setUser_code("EMP-"+Common.padLeft(String.valueOf(userMapper.loadingUserIdMax()+1), 6));
	       //System.out.println(userNew.toString());
		  if (userMapper.insertNewUser(userNew) <= 0){
			   throw new KHRTException("9999", "ការបញ្ជូលទិន្នន័យរបស់លោកអ្នកទទួលជោគជ័យ!");
		   }
		   //System.out.println("a"+String.valueOf(params.get("roles"))+"b");
		  
		  /* -------------------------------------------------
		   *   insert into table ld_user_permissions
		   *   to set user can use MENU and allwo permission 
		   * ------------------------------------------------
		   */
		   HashMap<String, Object> param = new HashMap<>();
		   if (String.valueOf(params.get("roles")).length() > 0 ) {
			   System.out.println("hello");
			   String[] role_id = String.valueOf(params.get("roles")).trim().split(",");
			   System.out.println(role_id.length);
			   ArrayList<Integer> roleList = new ArrayList<>();
			   for ( int i=0; i < role_id.length ; i++) {
				   System.out.println(Integer.parseInt(role_id[i]));
				   roleList.add(Integer.parseInt(role_id[i]));				  
			   }
			   param.put("userId", userNew.getUser_id());
			   param.put("roleId", roleList);
			   //userMapper.insertUserMenuPermission(param);

		   }	   
		   
		   return new Message("0000","ការបញ្ជូលទិន្នន័យរបស់លោកអ្នកទទួលជោគជ័យ");
		   
		}catch(Exception e){
			e.printStackTrace();
			throw new KHRTException("9999", e.getMessage());
		}
	}
	public Message employeeGetById(int user_id) {
		HashMap<String,String> params = new HashMap<>();
		HashMap<String,Object> result = new HashMap<>();
		try{
			params.put("userId", String.valueOf(user_id));
			result.put("userEntry", userMapper.loadUserByCondition(params));
			return new Message("0000",result);
		}catch(Exception e){
			throw new KHRTException("9999", e.getMessage());
		}
	}
	
	public Message employeeChangePassword(HashMap<String,String> params) {
		User user = new User();
		try{
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			if (!auth.getPrincipal().equals("anonymousUser")) {
				user = (User) auth.getPrincipal();
				
			}else {
				throw new KHRTException("9999", "ការបញ្ជូលទិន្នន័យរបស់លោកអ្នកទទួលបរាជ័យ");
			}
			System.out.println(" user password === "+ String.valueOf(params.get("oldPassword")));
			if (!passwordEncoder.matches(String.valueOf(params.get("oldPassword")), user.getPassword())){
				throw new KHRTException("9999", "ពាក្យសំងាត់ចាស់មិនត្រឹមត្រូវទេ!");
			}
			if (!String.valueOf(params.get("newPassword")).equals(String.valueOf(params.get("confirmPassword")))){
				throw new KHRTException("9999", "ពាក្យសំងាត់ និងបញ្ជាក់ពាក្យមិនត្រូវគ្នាទ!");
			}
			System.out.println(" user password2 === "+ passwordEncoder.encode(String.valueOf(params.get("newPassword"))));
			user.setPassword(passwordEncoder.encode(String.valueOf(params.get("newPassword"))));
			user.setModify_by(user.getUser_id());
			user.setModify_dt(Common.getCurrentDate());
			user.setAction("ធ្វើការកែប្រែពាក្យសំងាត់ដោយ "+ user.getFull_name());
			System.out.println(" user password1 === "+ user.getPassword());
			userMapper.editUseById(user);
			return new Message("0000","ការកែប្រែពត័មានរបស់លោកអ្នកទទួលបានជោគជ័យហើយ!");
		}catch(Exception e){
			throw new KHRTException("9999", e.getMessage());
		}
	}
	
	public Message employeeChangeInformation(HashMap<String, String> params) {
		try{
			User user = SessionUtils.getSubPermission();
			/*check user login information */
			
		   user = userMapper.loadUserByCondition(params);
		   if (String.valueOf(params.get("photo")).equals("")){
			   params.put("photo",user.getPhoto());
		   }
		  		
           user.setFull_name(String.valueOf(params.get("fullName")));
           user.setGender(String.valueOf(params.get("gender")));
           user.setPhone_nm(String.valueOf(params.get("phone_nm")));
           user.setEmail(String.valueOf(params.get("email")));
           user.setAddress(String.valueOf(params.get("address")));
           user.setPhoto(String.valueOf(params.get("photo")));
		   user.setModify_by(user.getUser_id());
		   user.setModify_dt(Common.getCurrentDate());
		   user.setAction("ធ្វើការកែប្រែដោយ "+ user.getFull_name());
		   
		   userMapper.editUseById(user);
		   return new Message("0000","ការបញ្ជូលទិន្នន័យរបស់លោកអ្នកទទួលជោគជ័យ");			
		}catch(Exception e){
			throw new KHRTException("9999", e.getMessage());
		}
	}
 
	@Transactional(value="transactionManager",rollbackFor={KHRTException.class,Exception.class})
	public Message employeeDelete(int userId) {
		try{
			
			User user = SessionUtils.getSubPermission();
			// 1. get user that want to delete if user have and can delete this user
			User duser= new User();
			HashMap<String,String> params = new HashMap<>();
			params.put("userId", String.valueOf(userId));
			duser = userMapper.loadUserByCondition(params);
		    if (duser == null){
		    	throw new KHRTException("9999", "ការបញ្ជូលទិន្នន័យរបស់លោកអ្នកទទួលបរាជ័យ");
		    }
		    
		    // 2 user that delete is only change sts = 9 
		    duser.setCompany(user.getCompany());
		    duser.setSts("9");
		    duser.setModify_by(user.getUser_id());
		    duser.setModify_dt(Common.getCurrentDate());
		    duser.setAction("ធ្វើការកែប្រែដោយ "+ user.getFull_name());
		    userMapper.editUseById(duser);
		    
		    // 3. delete all permission of this user
		    //userMapper.deleteUserMenuPermissions(userId);
			return new Message("0000","ការបញ្ជូលទិន្នន័យរបស់លោកអ្នកទទួលជោគជ័យ");	
		}catch(Exception e){
			e.printStackTrace();
			throw new KHRTException("9999", e.getMessage());
		}
	}
	
	public Message employeeSetPermission(int userId) {
		HashMap<String,Object> result = new HashMap<>();
		try{
			//result.put("listPermission", userMapper.loadingAllPermission(userId));
			return new Message("0000",result);
		}catch(Exception e){
			throw new KHRTException("9999", e.getMessage());
		}
	}
	
	
	
	
	
}

	