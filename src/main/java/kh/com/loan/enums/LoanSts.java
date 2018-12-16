package kh.com.loan.enums;

public enum LoanSts {
   ACTIVE("1"),
   DELETED("9")
   ;
	private String value;
	private LoanSts(String value){
		this.value = value;
	}
	public String getValue(){
		return this.value;
	}
	
	public static LoanSts fromValue(String value){
		for(LoanSts my: LoanSts.values()){
			if (my.value == value){
				return my;
			}
		}
		return null;
	}
	
	public static boolean contains(String value) {
	    for (LoanSts g : LoanSts.values()) {
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
