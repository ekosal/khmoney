package kh.com.loan.domains;

public class Message {
	private String status  ;
	private Object objec   ;
	private String message ;
	public Message() {};
	
	public Message(String status) {
		this.status = status;
	}
	public Message (Object object) {
		this.objec = object;
	}
	public Message(String status,Object object) {
		this.status = status;
		this.objec = object;
	}
	public Message(String status,String message) {
		this.status = status;
		this.message = message;
	}
	public Message(String status,String message,Object object) {
		this.status = status;
		this.message = message;
		this.objec = object;
	}
	public String getStatus() {
		return this.status;
	}
	public Object getObject() {
		return this.objec;
	}
	
	public String getMessage() {
		return this.message;
	}
	
}
