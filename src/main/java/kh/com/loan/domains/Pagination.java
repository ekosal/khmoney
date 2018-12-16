package kh.com.loan.domains;

public class Pagination {
	
	private int current_page ;
	private int per_page     ;
	private int total_page   ;
	private int totalCount   ;
	private int offset       ;
	
	public Pagination() {
		this(1,15,0,0);
	}
	
	public Pagination(int page, int limit) {
		this.current_page = page      ;
		this.per_page     = limit     ;
		this.total_page   = 0         ;
		this.totalCount   = 0         ;
	}
	
	
	public Pagination(int page, int limit, int totalPage, int totalCount) {
		this.current_page = page      ;
		this.per_page     = limit     ;
		this.total_page   = totalPage ;
		this.totalCount   = totalCount;
	}
	public int getCurrent_page() {
		return current_page;
	}
	public void setCurrent_page(int current_page) {
		this.current_page = current_page;
	}
	public int getPer_page() {
		return per_page;
	}
	
	public int offPage() {
		this.offset = (this.current_page-1)* per_page;
		return this.offset;
	}
	
	public void setPer_page(int per_page) {
		this.per_page = per_page;
	}

	public int getTotal_page() {
		return total_page;
	}
	public void setTotal_page(int total_page) {
		this.total_page = total_page;
	}
	
	
	public int getTotalCount() {
		return totalCount;
	}

	public void setTotalCount(int totalCount) {
		this.totalCount = totalCount  ;
		this.total_page = totalPages();
	}
	
	public int totalPages(){
		return (int) Math.ceil((double)this.totalCount/per_page);
		
	}


	public int getOffset() {
		return offset;
	}

	public void setOffset(int offset) {
		this.offset = offset;
	}

	@Override
	public String toString() {
		// TODO Auto-generated method stub
		return  "current page == " + this.current_page + "\n" + 
				"Per Page     == " + this.per_page     + "\n" +
		        "Total        == " + this.total_page   + "\n" +
		        "offset       == " + this.offset       + "\n" ;
	}
	
	

}
