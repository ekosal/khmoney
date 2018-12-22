package kh.com.loan.services;

import java.util.Collection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import kh.com.loan.domains.User;

@Component
public class CustomAuthenticationProvider implements AuthenticationProvider{

	@Autowired
	private CustomUserDetailsService customUserDetailsService;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	@Override
	public Authentication authenticate(Authentication authentication) throws AuthenticationException {
		// TODO Auto-generated method stub
		
		String username = (String) authentication.getName();
		String password = (String) authentication.getCredentials();
		//System.out.println(" user name = " + username + "  password = " + password );
		if ( username.equals("") || username.length() == 0){
			throw new UsernameNotFoundException("Please input username!");
		}
		
		if ( password.equals("") || password.length() == 0){
			throw new UsernameNotFoundException("Please input password!");
		}
		
		User user = (User) customUserDetailsService.loadUserByUsername(username);
		

		
		if ( !passwordEncoder.matches(password, user.getPassword())){
			
			throw new UsernameNotFoundException("password not match!!");
			
		}
		
		if ( !user.isEnabled() ) {
			throw new UsernameNotFoundException("User is disabled.");
		}
		
		
		
		//Collection< ? extends GrantedAuthority> authorties = user.getAuthorities();		
		return new UsernamePasswordAuthenticationToken(user, user.getPassword(), null);
	}

	@Override
	public boolean supports(Class<?> authentication) {
		// TODO Auto-generated method stub
		return (UsernamePasswordAuthenticationToken.class.isAssignableFrom(authentication));
	}

}
