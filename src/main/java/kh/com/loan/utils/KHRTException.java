package kh.com.loan.utils;

public class KHRTException extends RuntimeException{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private String status;
	private String message;
	private Object object;
	public KHRTException() {};
	
	public KHRTException(String status) {
		this.status = status;
	}

	public KHRTException(String status,String message) {
		this.status = status;
		this.message = message;
	}
	public KHRTException(String status,Object object) {
		this.status = status;
		this.object = object;
	}
	public String getMessage() {
		return this.message;
	}
	public String getCode() {
		return this.status;
	}
	
}
