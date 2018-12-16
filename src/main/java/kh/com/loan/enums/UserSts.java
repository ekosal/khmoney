package kh.com.loan.enums;

public enum UserSts {
	ACTIVE("1"),   // user is using this system.
	DELETED("9")   // user is finished to use this system.
	;
	
	private String value;
	private UserSts(String value){
		this.value = value;
	}
	public String getValue(){
		return this.value;
	}
	
	public static UserSts fromValue(String value){
		for(UserSts my: UserSts.values()){
			if (my.value == value){
				return my;
			}
		}
		return null;
	}
	
	public static boolean contains(String value) {
	    for (UserSts g : UserSts.values()) {
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
