package kh.com.loan.enums;

public enum CompanySts {
	ACTIVE("1"),   // company is using this system.
	DELETED("9")   // company is finished to use this system.
	;
	
	private String value;
	private CompanySts(String value){
		this.value = value;
	}
	public String getValue(){
		return this.value;
	}
	
	public static CompanySts fromValue(String value){
		for(CompanySts my: CompanySts.values()){
			if (my.value == value){
				return my;
			}
		}
		return null;
	}
	
	public static boolean contains(String value) {
	    for (CompanySts g : CompanySts.values()) {
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
		}else if ("9".equals(value)){
			label = "DELETED";
		}
		
		return label;
	}
}
