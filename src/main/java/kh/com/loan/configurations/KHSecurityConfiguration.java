package kh.com.loan.configurations;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.security.SecurityProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.LoginUrlAuthenticationEntryPoint;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import kh.com.loan.services.CustomAuthenticationProvider;
import kh.com.loan.services.CustomUserDetailsService;
import kh.com.loan.utils.KHRTException;


@Configuration
@Order(1)
public class KHSecurityConfiguration extends WebSecurityConfigurerAdapter{

	/*@Autowired
	private CustomAuthenticationProvider customAuthenticationProvider;*/
	@Autowired
	private AjaxAuthenticationSuccessHandler ajaxAuthenticationSuccessHandler;
	@Autowired
	private AjaxAuthenticationFailureHandler ajaxAuthenticationFailureHandler;
	/*@Autowired
	private CustomAuthenticationProvider customAuthenticationProvider;*/
	
	/*@Autowired
	private UserDetailsService userDetailsService;*/
	
	
	@Override
	protected void configure(HttpSecurity http) throws Exception {
		 
	      http.exceptionHandling().authenticationEntryPoint((request, response, authException) -> {
		        String requestType = request.getHeader("x-requested-with");
		        System.out.println("session " + requestType);
		        if (!StringUtils.isEmpty(requestType)) {
		            response.setStatus(HttpServletResponse.SC_OK);
		            response.getWriter().print("{\"status\": \"901\" , \"message\":\" session invalid.\"}");
		            response.getWriter().flush();
		        } else {
		            response.sendRedirect("/login");
		        }
		    });
		 
		http
			.authorizeRequests()
				.antMatchers("/register").permitAll()
			    .antMatchers("/login").permitAll()			  
				.antMatchers("/admin/**").access("hasRole('ROLE_ADMIN')")
				.anyRequest().authenticated()
			.and()
			.formLogin()
				.loginPage("/login")
				.usernameParameter("username")
				.passwordParameter("password")
				.failureUrl("/login?error")
				//.successForwardUrl("/home")
				.successHandler(ajaxAuthenticationSuccessHandler)
				.failureHandler(ajaxAuthenticationFailureHandler)
				.permitAll()
			.and()
				.logout()
				.permitAll()
			.and()
			.exceptionHandling().accessDeniedPage("/error/403");
			
			//.exceptionHandling().accessDeniedHandler(accessDeniedHandler);
	}
	
	/*@Bean
	public AuthenticationEntryPoint loginUrlauthenticationEntryPoint(){
	    return new LoginUrlAuthenticationEntryPoint("/userLogin");
	}
	         
	@Bean
	public AuthenticationEntryPoint loginUrlauthenticationEntryPointWithWarning(){
	    return new LoginUrlAuthenticationEntryPoint("/userLoginWithWarning");
	}
	*/
	/*@Override
	protected void configure(AuthenticationManagerBuilder auth) throws Exception {
		auth
			.inMemoryAuthentication()
				.withUser("user").password("123").roles("USER")
				.and()
				.withUser("admin").password("123").roles("ADMIN");
	
		
		auth.userDetailsService(userDetailsService)
			.passwordEncoder(passwordEncoder());
				
		auth.authenticationProvider(this.customAuthenticationProvider);
		
	}*/

	@Override
	public void configure(WebSecurity web) throws Exception {
		web.ignoring().antMatchers("/resources/**");
		web.ignoring().antMatchers("/static/**");
	}
	
	@Bean
	public PasswordEncoder passwordEncoder(){		
		return new BCryptPasswordEncoder();
	}	
}
