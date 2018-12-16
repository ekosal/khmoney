package kh.com.loan.enums;

public enum RoleSts {
	ADMINSTRATOR("1"),          // this status role for control administrator page only
	ADMINISTRATOR_COMPANY("2"), // this status role for control all menu in user page
	USER_COMPANY("3")           // this status role for control by page that "ADMINISTRATOR_COMPANY" assign.
	;
	
	private String value;
	private RoleSts(String value){
		this.value = value;
	}
	public String getValue(){
		return this.value;
	}
	
	public static RoleSts fromValue(String value){
		for(RoleSts my: RoleSts.values()){
			if (my.value == value){
				return my;
			}
		}
		return null;
	}
	
	public static boolean contains(String value) {
	    for (RoleSts g : RoleSts.values()) {
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
