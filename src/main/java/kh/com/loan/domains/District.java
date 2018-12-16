package kh.com.loan.domains;

import java.util.List;

public class District {

	private int           dis_id   ;
	private String        name_kh  ;
	private String        name_en  ;
	private String        create_dt;
	private String        update_dt;
	private Province      province ;
	private List<Commune> communes ;
		
	public int getDis_id() {
		return dis_id;
	}
	public void setDis_id(int dis_id) {
		this.dis_id = dis_id;
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
	public Province getProvince() {
		return province;
	}
	public void setProvince(Province province) {
		this.province = province;
	}
	public List<Commune> getCommunes() {
		return communes;
	}
	public void setCommunes(List<Commune> communes) {
		this.communes = communes;
	}
	
	
}
