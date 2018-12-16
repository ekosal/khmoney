package kh.com.loan.utils;


import org.apache.commons.lang3.EnumUtils;
import org.apache.commons.lang3.StringUtils;

public class Validation {
	
	public static void isNumber(String str,String message)  {
		if (!StringUtils.isNumeric(str.replaceAll("\\P{Print}","").trim())) 
			throw new KHRTException("9999",message);
	}
	
	public static void isBlank(String str,String message) {
		if (StringUtils.isBlank(str)) throw new KHRTException("9999", message);
	}
	public static void isLengthCheck(String str,int number,String message){
		if (str.length() > number){
			throw new KHRTException("9999",message);
		}
	}
	public static <E extends Enum<E>> void isEnum(Class<E> clzz,String str, String message) {
		if (!EnumUtils.isValidEnum(clzz, str)){
			throw new KHRTException("9999", message);
		}
	}
	
	public static void isDouble(String str, String message)  {
		try {
			Double db = Double.valueOf(str);
		}catch(Exception e) {
			throw new KHRTException("9999", message);
		}
	}
	
}
