package kh.com.loan.domains;

public class LoanPayment {
	private int    pay_id;
	private int    loan_id   ;
	private int    modify_by ;
	
	private Double prak_derm ;
	private Double total_rate;
	private Double total_left;
	
	private String pay_dt    ;
	private String end_dt    ;
	private int    agent_id  ;
	private String txt       ;
	private String modify_dt ;	
	private String action    ;
	private String note      ;
	
	private Loan   loan      ;
	
	public LoanPayment() {
		super();
		// TODO Auto-generated constructor stub
	}
	public LoanPayment(int payment_id, int loan_id, String pay_dt, Double total_payment, Double prak_derm,
			Double total_rate, Double total_left, String txt, String modify_dt, int modify_by, String action,
			String note) {
		super();
		this.pay_id = payment_id;
		this.loan_id = loan_id;
		this.pay_dt = pay_dt;
		this.prak_derm = prak_derm;
		this.total_rate = total_rate;
		this.total_left = total_left;
		this.txt = txt;
		this.modify_dt = modify_dt;
		this.modify_by = modify_by;
		this.action = action;
		this.note = note;
	}
	
	public int getPay_id() {
		return pay_id;
	}
	public void setPay_id(int pay_id) {
		this.pay_id = pay_id;
	}
	public int getLoan_id() {
		return loan_id;
	}
	public void setLoan_id(int loan_id) {
		this.loan_id = loan_id;
	}

	
	public String getPay_dt() {
		return pay_dt;
	}
	public void setPay_dt(String pay_dt) {
		this.pay_dt = pay_dt;
	}
	
	public String getEnd_dt() {
		return end_dt;
	}
	public void setEnd_dt(String end_dt) {
		this.end_dt = end_dt;
	}
	
	public int getAgent_id() {
		return agent_id;
	}
	public void setAgent_id(int agent_id) {
		this.agent_id = agent_id;
	}
	public Double getPrak_derm() {
		return prak_derm;
	}
	public void setPrak_derm(Double prak_derm) {
		this.prak_derm = prak_derm;
	}
	public Double getTotal_rate() {
		return total_rate;
	}
	public void setTotal_rate(Double total_rate) {
		this.total_rate = total_rate;
	}
	public Double getTotal_left() {
		return total_left;
	}
	public void setTotal_left(Double total_left) {
		this.total_left = total_left;
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
	public String getNote() {
		return note;
	}
	public void setNote(String note) {
		this.note = note;
	}
	public Loan getLoan() {
		return loan;
	}
	public void setLoan(Loan loan) {
		this.loan = loan;
	}
	@Override
	public String toString() {
		return "LoanPayment [pay_id     = " + pay_id     +"\n"+ 
				          ", loan_id    = " + loan_id    +"\n"+ 
				          ", modify_by  = " + modify_by  +"\n"+ 
				          ", prak_derm  = " + prak_derm  +"\n"+ 
				          ", total_rate = " + total_rate +"\n"+ 
				          ", total_left = " + total_left +"\n"+ 
				          ", pay_dt     = " + pay_dt	 +"\n"+ 
				          ", end_dt     = " + end_dt     +"\n"+ 
				          ", agent_id   = " + agent_id   +"\n"+ 
				          ", txt        = " + txt        +"\n"+ 
				          ", modify_dt  = " + modify_dt  +"\n"+ 
				          ", action     = " + action     +"\n"+ 
				          ", note       = " + note       +"\n"+ 
				          ", loan       = " + loan + "]";
	}
	
	
	
}
