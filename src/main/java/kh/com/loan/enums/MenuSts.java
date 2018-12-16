package kh.com.loan.enums;

public enum MenuSts {
	Admin("1"), // this menu for administrator to control information user
	User("2")   // this menu for user control their company
	;
	
	private String value;
	private MenuSts(String value){
		this.value = value;
	}
	public String getValue(){
		return this.value;
	}
	
	public static MenuSts fromValue(String value){
		for(MenuSts my: MenuSts.values()){
			if (my.value == value){
				return my;
			}
		}
		return null;
	}
	
	public static boolean contains(String value) {
	    for (MenuSts g : MenuSts.values()) {
	        if (g.value.equals(value)) {
	            return true;
	        }
	    }
	    return false;
	}
	
	public String getLabel(){
		
		String label = "";
		if ("1".equals(value)){
			label = "ADMINISTRATOR";
		}else if ("2".equals(value)){
			label = "USER";
		}
		
		return label;
	}
}
