package kh.com.loan.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import kh.com.loan.domains.User;

@Service("customUserDetailsService")
public class CustomUserDetailsService implements UserDetailsService {

	@Autowired 
	private UserService userService;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		// TODO Auto-generated method stub
		
			System.out.println(" User Name = "+ username);
			User user = (User) userService.loadUserByUsername(username);
		
			
			if (user == null) {
				throw new UsernameNotFoundException("User not found!");
			}
			
			
			
		    // permission user login
		 
			//user.setRoles(userService.getGrantedAuthority(user.getUser_id()));    
			//user.setPermissions(userService.getGrantedPermission(user.getUser_id()));
			///user.setMenus(userService.getAllMenu(user.getUser_id()));
			
				
			return user;
		
	}
	/*private List<GrantedAuthority> getGrantedAuthorities(User User){		
		List<GrantedAuthority> authorities = new ArrayList<GrantedAuthority>();				
		String txt = User.getTxt().equals("1") ? "AMIN" : "USER";
		authorities.add(new SimpleGrantedAuthority("ROLE_"+txt));
		return authorities;
	}*/
	
}
