package kh.com.loan.domains;

import java.util.List;

/*import kh.com.loan.utils.PaginationUtils;
*/

public class Loaner {
	
	private int      loaner_id  ;
	private String   loaner_name;
	private String   id_card    ;
	private String   gender     ;
	private String   phone_nm   ;
	private String   sts        ;
	private String   txt        ;
	private String   modify_dt  ;
	private int      modify_by  ;
	private String   action     ;
	private Company  company    ;
	private User     user       ;
	private Province province   ;
	private District district   ;
	private Commune  commune    ;
	private Village  village    ;
	private Pagination pagination;
	
	private List<Loan> loans  ;
	
	public Loaner() {
		super();
		// TODO Auto-generated constructor stub
	}
	public Loaner(int loaner_id, int user_id,String loaner_name, String id_card, String gender,
			String phone, String sts, String txt, String modify_date, int modify_by, String action) {
		super();
		this.loaner_id = loaner_id;
		/*this.user_id = user_id;*/
		this.loaner_name = loaner_name;
		this.id_card = id_card;
		this.gender = gender;
		this.phone_nm = phone;
		this.sts = sts;
		this.txt = txt;
		this.modify_dt = modify_date;
		this.modify_by = modify_by;
		this.action = action;
	}
	
	public int getLoaner_id() {
		return loaner_id;
	}
	public void setLoaner_id(int loaner_id) {
		this.loaner_id = loaner_id;
	}
	
	

	public String getLoaner_name() {
		return loaner_name;
	}
	public void setLoaner_name(String loaner_name) {
		this.loaner_name = loaner_name;
	}
	public String getId_card() {
		return id_card;
	}
	public void setId_card(String id_card) {
		this.id_card = id_card;
	}
	public String getGender() {
		return gender;
	}
	public void setGender(String gender) {
		this.gender = gender;
	}
	
	
	public String getPhone_nm() {
		return phone_nm;
	}
	public void setPhone_nm(String phone_nm) {
		this.phone_nm = phone_nm;
	}
	public String getSts() {
		return sts;
	}
	public void setSts(String sts) {
		this.sts = sts;
	}
	public String getTxt() {
		return txt;
	}
	public void setTxt(String txt) {
		this.txt = txt;
	}
	public String getModify_dt() {
		return modify_dt;
	}
	public void setModify_dt(String modify_dt) {
		this.modify_dt = modify_dt;
	}
	public int getModify_by() {
		return modify_by;
	}
	public void setModify_by(int modify_by) {
		this.modify_by = modify_by;
	}
	public String getAction() {
		return action;
	}
	public void setAction(String action) {
		this.action = action;
	}

	
	public List<Loan> getLoans() {
		return loans;
	}
	public void setLoans(List<Loan> loans) {
		this.loans = loans;
	}
	
	
	public User getUser() {
		return user;
	}
	public void setUser(User user) {
		this.user = user;
	}
	
	
	public Company getCompany() {
		return company;
	}
	public void setCompany(Company company) {
		this.company = company;
	}
	public Province getProvince() {
		return province;
	}
	public void setProvince(Province province) {
		this.province = province;
	}
	public District getDistrict() {
		return district;
	}
	public void setDistrict(District district) {
		this.district = district;
	}
	public Commune getCommune() {
		return commune;
	}
	public void setCommune(Commune commune) {
		this.commune = commune;
	}
	public Village getVillage() {
		return village;
	}
	public void setVillage(Village village) {
		this.village = village;
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
		return 
				"loaner id = " + this.loaner_id      +"\n"+
			   "pagination = " + this.pagination     +"\n"+
			   "company    = " + this.company        +"\n"+
			   "loaner_name= " + this.loaner_name    +"\n"+
			   "id_card    = " + this.id_card        +"\n"+
			   "gender     = " + this.gender         +"\n"+
			   "phone_nm   = " + this.phone_nm       +"\n"+
			   "sts        = " + this.sts            +"\n"+
			   "txt        = " + this.txt            +"\n"+
			   "modify_dt  = " + this.modify_dt      +"\n"+
			   "modify_by  = " + this.modify_by      +"\n"+
			   "action     = " + this.action         +"\n"+
			   "user       = " + this.user           +"\n"+
			   "province   = " + this.province       +"\n"+
			   "district   = " + this.district       +"\n"+
			   "commune    = " + this.commune        +"\n"+
			   "village    = " + this.village        +"\n"+
			   "loan       = " + this.loans
			   ;
	}
	

}
