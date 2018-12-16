package kh.com.loan.domains;


import java.util.List;


public class Province{

	private int            pro_id   ;
	private String         name_kh  ;
	private String         name_en  ;
	private String         create_dt;
	private String         update_dt;
	private List<District> districts;
	
	public int getPro_id() {
		return pro_id;
	}
	public void setPro_id(int pro_id) {
		this.pro_id = pro_id;
	}
	public String getName_kh() {
		return name_kh;
	}
	public void setName_kh(String name_kh) {
		this.name_kh = name_kh;
	}
	public String getName_en() {
		return name_en;
	}
	public void setName_en(String name_en) {
		this.name_en = name_en;
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
	public List<District> getDistricts() {
		return districts;
	}
	public void setDistricts(List<District> districts) {
		this.districts = districts;
	}
	@Override
	public String toString() {
		// TODO Auto-generated method stub
		return "pro_id == " + pro_id ;
	}
	
	
	
}
