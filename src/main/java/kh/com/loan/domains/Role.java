package kh.com.loan.domains;


import java.util.List;

import org.springframework.security.core.GrantedAuthority;



/**
 * 
 *   @author 
 *	Created Date: 2017/10/27
 */
public class Role implements GrantedAuthority{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private int    role_id     ;
	private String role_name   ;
	private String full_name   ;
	private String r_sts       ;
	private String create_date ;
	private String update_date ;
	private List<Menu>       menus       ;
	private List<Permission> permissions ;
	private Company          company     ;
	
	public int getId() {
		return role_id;
	}
	public void setId(int id) {
		this.role_id = id;
	}
	public String getRole() {
		return role_name;
	}
	

	public void setRole(String role) {
		this.role_name = role;
	}
	@Override
	public String getAuthority() {
		// TODO Auto-generated method stub
		return role_name;
	}
	public List<Menu> getMenus() {
		return menus;
	}
	public void setMenus(List<Menu> menus) {
		this.menus = menus;
	}
	public String getFull_name() {
		return full_name;
	}
	public void setFull_name(String full_name) {
		this.full_name = full_name;
	}
	
	public String getR_sts() {
		return r_sts;
	}
	public void setR_sts(String r_sts) {
		this.r_sts = r_sts;
	}
	public String getCreate_date() {
		return create_date;
	}
	public void setCreate_date(String create_date) {
		this.create_date = create_date;
	}
	public String getUpdate_date() {
		return update_date;
	}
	public void setUpdate_date(String update_date) {
		this.update_date = update_date;
	}
	
	
	
	public int getRole_id() {
		return role_id;
	}
	public void setRole_id(int role_id) {
		this.role_id = role_id;
	}
	public String getRole_name() {
		return role_name;
	}
	public void setRole_name(String role_name) {
		this.role_name = role_name;
	}
	@Override
	public String toString() {
		// TODO Auto-generated method stub
		return   "role id = " + this.role_id
				+"role name = " + this.role_name
				+"full name = " + this.full_name
				+"menu = " + this.menus;
	}
	public Company getCompany() {
		return company;
	}
	public void setCompany(Company company) {
		this.company = company;
	}
	public List<Permission> getPermissions() {
		return permissions;
	}
	public void setPermissions(List<Permission> permissions) {
		this.permissions = permissions;
	}
	
	
	
	

	
	
}
