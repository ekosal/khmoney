package kh.com.loan.enums;

public enum LoanType {
	PAYMENT("1")    ,
	PAYDOWN("2")    ,
	PAYCOUNT("3")   ,
	PAYONLYRATE("4")
	;
	private String value;
	private LoanType(String value){
		this.value = value;
	}
	public String getValue(){
		return this.value;
	}
	
	public static LoanType fromValue(String value){
		for(LoanType my: LoanType.values()){
			if (my.value == value){
				return my;
			}
		}
		return null;
	}
	
	public static boolean contains(String value) {
	    for (LoanType g : LoanType.values()) {
	        if (g.value.equals(value)) {
	            return true;
	        }
	    }
	    return false;
	}
	
	public String getLabel(){
		
		String label = "";
		if ("1".equals(value)){
			label = "ACTIVE";
		}else if ("2".equals(value)){
			label = "INACTIVE";
		}else{
			label = "DELETE";
		}
		
		return label;
	}
}
