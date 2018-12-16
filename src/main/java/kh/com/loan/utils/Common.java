package kh.com.loan.utils;

import java.text.SimpleDateFormat;
import java.util.Date;

public class Common {

	private static String dtst = "yyyyMMdd";
	public static String padLeft(String str, String symbol,int number) {
		if (symbol == null) {
			symbol = "0";
		}
		if (str != null){
			return String.format("%"+number+"s", str).replace(" ", symbol);
		}
		return null;
	}
	public static String padLeft(String str,int number) {
		return padLeft(str, null, number);
	}
	public static String getCurrentDate(){
		SimpleDateFormat df = new SimpleDateFormat(dtst);
		Date dt = new Date();
		return df.format(dt).toString();
	}
	
	/**
	 * ------------------------------------------------------------
	 * @param phone : phone number 
	 * @param fmt   : formatter like "-" "," .....
	 * @return
	 * ------------------------------------------------------------
	 */
	public static String phoneFormatting(String phone, String fmt) {
		
		String result = phone;
		String p1="",p2="",p3="";
		if ( phone.length() < 7 && phone.length() > 3 ) {
			p1 = result.substring(0,3);
			p2 = result.substring(3, result.length() - 1);
			return p1+fmt+p2;
		}else if ( phone.length() >= 7 ) {
			p1 = result.substring(0,3);
			p2 = result.substring(3, 6);
			p3 = result.substring(6, result.length() - 1);
			return p1+fmt+p2+fmt+p3;
		}else {
			return	phone;
		}
		
	}

}
