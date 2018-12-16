package kh.com.loan.domains;

import java.util.List;

public class Loan {
	
	private int     loan_id     ;
	private int     count_day   ;
	private int     time        ;
	private int     modify_by   ;
	private Long    total_money ;
	private Double  decrement   ;
	private Double  rate        ;	
	private Double  rate_money  ;
	private String  payment_type;
	private String  start_dt    ;	
	private String  end_dt      ;
	private String  money_type  ;
	private String  sts         ;
	private String  txt         ;
	private String  rate_type   ;
	private String  loan_type   ;   
	private String  modify_dt   ;
	private String  action      ;
	private Company company     ;
	private User    user        ;
	private Loaner  loaner      ;
	private List<LoanPayment> loanpayments;
	
	public Loan() {
		super();
		// TODO Auto-generated constructor stub
	}
	public Loan(int loan_id, int loaner_id, int user_id, String loand_code, String start_date, int count_day,
			Long total_money, Double rate, String payment_type, int time, Double decrement, String money_type,
			String sts, String txt, String modify_date, int modify_by, String action) {
		super();
		this.loan_id = loan_id;
		
		this.start_dt = start_date;
		this.count_day = count_day;
		this.total_money = total_money;
		this.rate = rate;
		this.payment_type = payment_type;
		this.time = time;
		this.decrement = decrement;
		this.money_type = money_type;
		this.sts = sts;
		this.txt = txt;
		this.modify_dt = modify_date;
		this.modify_by = modify_by;
		this.action = action;
	}

	public int getLoan_id() {
		return loan_id;
	}
	public void setLoan_id(int loan_id) {
		this.loan_id = loan_id;
	}
	

	public int getCount_day() {
		return count_day;
	}
	public void setCount_day(int count_day) {
		this.count_day = count_day;
	}
	public int getTime() {
		return time;
	}
	public void setTime(int time) {
		this.time = time;
	}
	
	public Double getDecrement() {
		return decrement;
	}
	public void setDecrement(Double decrement) {
		this.decrement = decrement;
	}
	public int getModify_by() {
		return modify_by;
	}
	public void setModify_by(int modify_by) {
		this.modify_by = modify_by;
	}
	public Long getTotal_money() {
		return total_money;
	}
	public void setTotal_money(Long total_money) {
		this.total_money = total_money;
	}
	public Double getRate() {
		return rate;
	}
	public void setRate(Double rate) {
		this.rate = rate;
	}
	
	public String getPayment_type() {
		return payment_type;
	}
	public void setPayment_type(String payment_type) {
		this.payment_type = payment_type;
	}
	public String getStart_dt() {
		return start_dt;
	}
	public void setStart_dt(String start_dt) {
		this.start_dt = start_dt;
	}
	
	public String getMoney_type() {
		return money_type;
	}
	public void setMoney_type(String money_type) {
		this.money_type = money_type;
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
	public String getAction() {
		return action;
	}
	public void setAction(String action) {
		this.action = action;
	}
	
	
	public Company getCompany() {
		return company;
	}
	public void setCompany(Company company) {
		this.company = company;
	}
	public User getUser() {
		return user;
	}
	public void setUser(User user) {
		this.user = user;
	}
	public List<LoanPayment> getLoanpayments() {
		return loanpayments;
	}
	public void setLoanpayments(List<LoanPayment> loanpayments) {
		this.loanpayments = loanpayments;
	}
	
	
	
	public Loaner getLoaner() {
		return loaner;
	}
	public void setLoaner(Loaner loaner) {
		this.loaner = loaner;
	}
	
	
	public String getLoan_type() {
		return loan_type;
	}
	public void setLoan_type(String loan_type) {
		this.loan_type = loan_type;
	}
	
	
	
	
	
	public Double getRate_money() {
		return rate_money;
	}
	public void setRate_money(Double rate_money) {
		this.rate_money = rate_money;
	}
	public String getEnd_dt() {
		return end_dt;
	}
	public void setEnd_dt(String end_dt) {
		this.end_dt = end_dt;
	}
	public String getRate_type() {
		return rate_type;
	}
	public void setRate_type(String rate_type) {
		this.rate_type = rate_type;
	}
	@Override
	public String toString() {
		// TODO Auto-generated method stub
		return  "loan id     ==  " + this.loan_id     +"\n"+
				"total money ==  " + this.total_money +"\n"+
				"count_day   ==  " + this.count_day   +"\n"+
				"time        ==  " + this.time        +"\n"+
				"decrement   ==  " + this.decrement   +"\n"+
				"modify_by   ==  " + this.modify_by   +"\n"+
				"total_money ==  " + this.total_money +"\n"+
				"rate        ==  " + this.rate        +"\n"+
				"type_payment==  " + this.payment_type+"\n"+
				"start_dt    ==  " + this.start_dt    +"\n"+
				"type_money  ==  " + this.money_type  +"\n"+
				"sts         ==  " + this.sts         +"\n"+
				"txt         ==  " + this.txt         +"\n"+
				"modify_dt   ==  " + this.modify_dt   +"\n"+
				"type_loan   ==  " + this.loan_type   +"\n"+
				"action      ==  " + this.action;
	}
	
}
