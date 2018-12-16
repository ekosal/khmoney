package kh.com.loan.utils;

import java.text.SimpleDateFormat;
import java.util.Date;

public class DateUtils {
	
	public static final String dt_format    = "yyyyMMdd";
	public static final String tm_format    = "HHmmss";
	public static final String dttm_format  = "yyyyMMddHHmmss";
	public static final String dttms_format = "yyyyMMddHHmmssS";
	
	public static String getCurrentDate(){
		
		SimpleDateFormat sdf = new SimpleDateFormat(dt_format);
		Date dt = new Date();
		return sdf.format(dt).toString();
		
	}
	
	public static String getTime(){
		SimpleDateFormat sdf = new SimpleDateFormat(tm_format);
		Date dt = new Date();
		return sdf.format(dt).toString();
	}
	
	public static String getDateTime(){
		
		SimpleDateFormat sdf = new SimpleDateFormat(dttm_format);
		Date dt = new Date();
		return sdf.format(dt).toString();
		
	}
	
	public static String getDTTimeSecond(){
		SimpleDateFormat sdf = new SimpleDateFormat(dttms_format);
		Date dt = new Date();
		return sdf.format(dt).toString();
	}
	
	public static String getDateTime(String formatter){
		SimpleDateFormat sdf = new SimpleDateFormat(formatter);
		Date dt = new Date();
		return sdf.format(dt).toString();
	}

}
