package kh.com.loan.mappers;


import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Param;

import kh.com.loan.domains.Menu;
import kh.com.loan.domains.Permission;
import kh.com.loan.domains.Role;
import kh.com.loan.domains.User;


public interface UserMapper {
	/*
	 * check user name
	 * */
	public User loadUserByUsername(@Param("username") String username);
	public List<User> loadingAllUser(User user);
	public int loadingCountAllUser(@Param("comId") int comId);
	public int insertNewUser(User user);
	public int loadingUserIdMax();
	public User loadUserByCondition(HashMap<String,String> params);
	public int editUseById(User user);
	public List<HashMap<String,String>> loadingAllPermission(@Param("userId") int userId);
	public int insertOrUpdateUserInformation(HashMap<String,String> params);
	
	public List<Role> getGrantedAuthority(@Param("userId") int userId);
	public List<Permission> getGrantedPermission(@Param("userId") int userId);
	public List<Role> getAllRolesInCompany(@Param("comId") int com_id);
	public List<Menu> getAllMenu(@Param("userId") int userId);
	
	public int insertUserMenuPermission(HashMap<String, Object> param);
	
	public int deleteUserPermissions(@Param("userId") int userId);
	public int deleteUserMenuPermissions(@Param("userId") int userId);
	
	public User loadUserByConditionByUserId(User user);
	
	
}
