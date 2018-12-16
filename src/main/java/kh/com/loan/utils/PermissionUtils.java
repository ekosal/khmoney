package kh.com.loan.utils;


import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import kh.com.loan.domains.Permission;
import kh.com.loan.domains.User;

public class PermissionUtils {
	
	public static boolean permissionAccess(String param){
		
		try{
			
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			
			if ( auth.getPrincipal().equals("anonymousUser")){
				return false;
			}
			
			User user = (User) auth.getPrincipal();
			
			if (user.getPermissions().size() == 0 ){				
				return false;
			}
			
			for ( Permission permission : user.getPermissions() ){
				System.out.println("permission url : : " + permission.getName_id());
				if (param.equals(permission.getName_id().trim().toString())){
					return true;
				}
			}
			
			
		}catch(Exception e){
			
		}
		
		return false;
		
	}

}
