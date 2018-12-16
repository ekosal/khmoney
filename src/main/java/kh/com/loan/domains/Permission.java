package kh.com.loan.domains;

public class Permission {
	
	private int    per_id     ; // column in table ld_permissions_info
	private String name       ; // column in table ld_permissions_info
	private String name_id    ; // column in table ld_permissions_info
	private String http_method; // column in table ld_permissions_info
	private String http_path  ; // column in table ld_permissions_info
	private String create_dt  ; // column in table ld_permissions_info
	private String update_dt  ; // column in table ld_permissions_info
	private String sts        ; // column in table ld_user_permission *
	private Menu   menu       ;
	private User   user       ;
	private Role   role       ;
	
	public int getPer_id() {
		return per_id;
	}
	public void setPer_id(int per_id) {
		this.per_id = per_id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getName_id() {
		return name_id;
	}
	public void setName_id(String name_id) {
		this.name_id = name_id;
	}
	public String getHttp_method() {
		return http_method;
	}
	public void setHttp_method(String http_method) {
		this.http_method = http_method;
	}
	public String getHttp_path() {
		return http_path;
	}
	public void setHttp_path(String http_path) {
		this.http_path = http_path;
	}
	public String getCreate_dt() {
		return create_dt;
	}
	public void setCreate_dt(String create_dt) {
		this.create_dt = create_dt;
	}
	public String getUpdate_dt() {
		return update_dt;
	}
	public void setUpdate_dt(String update_dt) {
		this.update_dt = update_dt;
	}
	public Menu getMenu() {
		return menu;
	}
	public void setMenu(Menu menu) {
		this.menu = menu;
	}
	public User getUser() {
		return user;
	}
	public void setUser(User user) {
		this.user = user;
	}
	public Role getRole() {
		return role;
	}
	public void setRole(Role role) {
		this.role = role;
	}
	public String getSts() {
		return sts;
	}
	public void setSts(String sts) {
		this.sts = sts;
	}
	
	
	
}
