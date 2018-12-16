package kh.com.loan.enums;

public enum Gender {
	Male("M"),
	Female("F")
	;
	
	private String value;
	private Gender(String value){
		this.value = value;
	}
	public String getValue(){
		return this.value;
	}
	
	public static Gender fromValue(String value){
		for(Gender my: Gender.values()){
			if (my.value == value){
				return my;
			}
		}
		return null;
	}
	
	public static boolean contains(String value) {
	    for (Gender g : Gender.values()) {
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
