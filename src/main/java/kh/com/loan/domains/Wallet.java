package kh.com.loan.domains;

public class Wallet {

	private int id;
	private Long old_amount;
	private Long amount;
	private Long total_amount;
	private String type_amount;
	private int request_by;
	private int request_id;
	private String request_date;
	private int approve_by;
	private String approve_date;
	private String decription;
	
	public Wallet() {
		super();
		// TODO Auto-generated constructor stub
	}
	public Wallet(int id, Long old_amount, Long amount, Long total_amount, String type_amount, int request_by,
			int request_id, String request_date, int approve_by, String approve_date, String decription) {
		super();
		this.id = id;
		this.old_amount = old_amount;
		this.amount = amount;
		this.total_amount = total_amount;
		this.type_amount = type_amount;
		this.request_by = request_by;
		this.request_id = request_id;
		this.request_date = request_date;
		this.approve_by = approve_by;
		this.approve_date = approve_date;
		this.decription = decription;
	}
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public Long getOld_amount() {
		return old_amount;
	}
	public void setOld_amount(Long old_amount) {
		this.old_amount = old_amount;
	}
	public Long getAmount() {
		return amount;
	}
	public void setAmount(Long amount) {
		this.amount = amount;
	}
	public Long getTotal_amount() {
		return total_amount;
	}
	public void setTotal_amount(Long total_amount) {
		this.total_amount = total_amount;
	}
	public String getType_amount() {
		return type_amount;
	}
	public void setType_amount(String type_amount) {
		this.type_amount = type_amount;
	}
	public int getRequest_by() {
		return request_by;
	}
	public void setRequest_by(int request_by) {
		this.request_by = request_by;
	}
	public int getRequest_id() {
		return request_id;
	}
	public void setRequest_id(int request_id) {
		this.request_id = request_id;
	}
	public String getRequest_date() {
		return request_date;
	}
	public void setRequest_date(String request_date) {
		this.request_date = request_date;
	}
	public int getApprove_by() {
		return approve_by;
	}
	public void setApprove_by(int approve_by) {
		this.approve_by = approve_by;
	}
	public String getApprove_date() {
		return approve_date;
	}
	public void setApprove_date(String approve_date) {
		this.approve_date = approve_date;
	}
	public String getDecription() {
		return decription;
	}
	public void setDecription(String decription) {
		this.decription = decription;
	}
	
}
