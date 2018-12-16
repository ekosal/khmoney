package kh.com.loan.enums;

public enum LoanTxt {
	FININSH("9"),
	CANCEL("2"),
	ACTIVE("1")
	;
	private String value;
	private LoanTxt(String value){
		this.value = value;
	}
	public String getValue(){
		return this.value;
	}
	
	public static LoanTxt fromValue(String value){
		for(LoanTxt my: LoanTxt.values()){
			if (my.value == value){
				return my;
			}
		}
		return null;
	}
	
	public static boolean contains(String value) {
	    for (LoanTxt g : LoanTxt.values()) {
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
