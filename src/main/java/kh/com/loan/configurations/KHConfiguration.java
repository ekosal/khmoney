package kh.com.loan.configurations;

import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.web.servlet.view.InternalResourceViewResolver;



@Configuration
@ComponentScan 
@EnableAutoConfiguration
public class KHConfiguration extends WebMvcConfigurerAdapter {

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		// TODO Auto-generated method stub
		registry.addResourceHandler("/resources/**")
				.addResourceLocations("/resources/");
	}

	@Bean
	public InternalResourceViewResolver viewResolver() {
		InternalResourceViewResolver resolver = new InternalResourceViewResolver();
		resolver.setPrefix("classpath:/templates/");
		resolver.setSuffix(".html");
		return resolver;
	}
	
	@Override
	public void addViewControllers(ViewControllerRegistry registry) {
		// TODO Auto-generated method stub
		//registry.addViewController("/").setViewName("index");
		//registry.addViewController("/login").setViewName("login");
		/*registry.addViewController("/loaner").setViewName("loaner");*/
		registry.addViewController("/mywallet").setViewName("mywallet");
		//registry.addViewController("/employee").setViewName("user");
		//registry.addViewController("/loan").setViewName("loan");
		//registry.addViewController("/loan/loanNew").setViewName("loan-new");
		/*registry.addViewController("/missing-payment").setViewName("missing-payment");*/
		//registry.addViewController("/setting").setViewName("setting");
		registry.addViewController("/listReport").setViewName("r_main");
		//registry.addViewController("/addressinfo").setViewName("addressInfo");
		
		// test api
		registry.addViewController("/api-test").setViewName("api/index");
	}

	
	
	
}
