package kh.com.loan.controllers;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import kh.com.loan.domains.Message;
import kh.com.loan.domains.Role;
import kh.com.loan.domains.User;
import kh.com.loan.utils.KHException;


@Controller
public class KHController {
	
	@RequestMapping(value ="/permission-not-allwo" , method = RequestMethod.GET)
	public String permissionNotAllow() {
		return "permission-setting";
	}
	
	@RequestMapping(value = "/register" , method = RequestMethod.GET)
	public String loadingRegister() {
		return "register";
	}
	
	
	@RequestMapping(value = "/" , method = RequestMethod.GET)
	public String loadingIndex() {
		
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if(!auth.getPrincipal().equals("anonymousUser")){			
			User user = (User) auth.getPrincipal();
			for (Role role : user.getRoles()) {
				if (role.getRole_name().equals("ROLE_ADMIN")) {
					SecurityContextHolder.clearContext();
					return "login";
				}
			}
			
			
		}
		return "index";
	}
	
	@RequestMapping(value = "/login", method = RequestMethod.GET)
	public String loginPage(ModelMap model){
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if(!auth.getPrincipal().equals("anonymousUser")){			
			User user = (User) auth.getPrincipal();
			System.out.println(user.getFull_name());
			model.addAttribute("user",user);
			return "redirect:/khmoney/";
		}
		return "login";
	}

	@RequestMapping(value = "/checkUserInformation", method = RequestMethod.GET)
	public @ResponseBody Message indexCheckPage() throws KHException{
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		User user = new User();
		if(!auth.getPrincipal().equals("anonymousUser")){			
			 user = (User) auth.getPrincipal();
		}else {
			throw new KHException("9999", "ការបញ្ជូលទិន្នន័យរបស់លោកអ្នកទទួលបរាជ័យ");
		}
		return new Message("0000",user);
	}
	
	
	
	@RequestMapping(value="/logout", method = RequestMethod.GET)
	public String logoutPage (HttpServletRequest request, HttpServletResponse response) {
	    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
	    if (auth != null){    
	        new SecurityContextLogoutHandler().logout(request, response, auth);
	    }
	    return "redirect:/login";//You can redirect wherever you want, but generally it's a good practice to show login screen again.
	}
	

}
