package kh.com.loan.domains;

import java.util.List;

public class Commune {

	private int           comm_id  ;
	private String        name_kh  ;
	private String        name_en  ;
	private String        create_dt;
	private String        update_dt;
	private District      district ;
	private List<Village> villages ;
	public int getComm_id() {
		return comm_id;
	}
	public void setComm_id(int comm_id) {
		this.comm_id = comm_id;
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
	public District getDistrict() {
		return district;
	}
	public void setDistrict(District district) {
		this.district = district;
	}
	public List<Village> getVillages() {
		return villages;
	}
	public void setVillages(List<Village> villages) {
		this.villages = villages;
	}
	
	
	
}
