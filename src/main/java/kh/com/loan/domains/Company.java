package kh.com.loan.domains;

public class Company {
	
	private int    com_id             ;
	private String com_name           ;
	private String com_ph_num         ;
	private String com_email          ;
	private String com_address        ;
	private String com_website_address;
	private String com_sts            ;
	private String com_reg_dt         ;
	private String com_logo           ;
	
	private Pagination pagination     ;
	
	public int getCom_id() {
		return com_id;
	}
	public void setCom_id(int com_id) {
		this.com_id = com_id;
	}
	public String getCom_name() {
		return com_name;
	}
	public void setCom_name(String com_name) {
		this.com_name = com_name;
	}
	public String getCom_ph_num() {
		return com_ph_num;
	}
	public void setCom_ph_num(String com_ph_num) {
		this.com_ph_num = com_ph_num;
	}
	public String getCom_email() {
		return com_email;
	}
	public void setCom_email(String com_email) {
		this.com_email = com_email;
	}
	public String getCom_address() {
		return com_address;
	}
	public void setCom_address(String com_address) {
		this.com_address = com_address;
	}
	public String getCom_website_address() {
		return com_website_address;
	}
	public void setCom_website_address(String com_website_address) {
		this.com_website_address = com_website_address;
	}
	public String getCom_sts() {
		return com_sts;
	}
	public void setCom_sts(String com_sts) {
		this.com_sts = com_sts;
	}
	public String getCom_reg_dt() {
		return com_reg_dt;
	}
	public void setCom_reg_dt(String com_reg_dt) {
		this.com_reg_dt = com_reg_dt;
	}
	public String getCom_logo() {
		return com_logo;
	}
	public void setCom_logo(String com_logo) {
		this.com_logo = com_logo;
	}
	
	
	public Pagination getPagination() {
		return pagination;
	}
	public void setPagination(Pagination pagination) {
		this.pagination = pagination;
	}
	@Override
	public String toString() {
		// TODO Auto-generated method stub
		return "compnay id == " + this.com_id;
	}
	
	
}
