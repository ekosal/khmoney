package kh.com.loan.domains;

public class Village {

	private int      vil_id   ;
	private String   name_kh  ;
	private String   name_en  ;
	private String   create_dt;
	private String   update_dt;
	private Commune  commune  ;
	public int getVil_id() {
		return vil_id;
	}
	public void setVil_id(int vil_id) {
		this.vil_id = vil_id;
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
	public Commune getCommune() {
		return commune;
	}
	public void setCommune(Commune commune) {
		this.commune = commune;
	}
	
	
}
