package kh.com.loan.configurations;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

@Component
public class CustomAccessDeniedHandler implements AccessDeniedHandler{

	@Override
	public void handle(HttpServletRequest request, HttpServletResponse response,
			AccessDeniedException accessDeniedException) throws IOException, ServletException {
		// TODO Auto-generated method stub
		 Authentication auth = SecurityContextHolder.getContext().getAuthentication();
	     System.out.println("Access denied.....");  
		 if (auth != null) {
	            System.out.println("User: " + auth.getName() + " attempted to access the protected URL: "  + request.getRequestURI());
	        }
	 
	        response.sendRedirect(request.getContextPath() + "/" );
	}

}