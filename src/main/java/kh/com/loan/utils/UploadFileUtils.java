package kh.com.loan.utils;


import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.io.FileUtils;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.multipart.MultipartFile;

import kh.com.loan.domains.Images;



public class UploadFileUtils {
	/**
	 * 
	 * @param image : name of image that uploaded.
	 * @param file  : image that is going to upload.
	 * @param path  : path that upload image this path.
	 * @return 
	 */
	public static boolean UploadSingleFile(Images image, MultipartFile file,String path){
		
		if (file != null){

			try {
				System.out.println(DateUtils.getDateTime(DateUtils.dttms_format));
				// * --------------------------------------------------------------------
				// * initialize parameter for this method 
				// *---------------------------------------------------------------------
			    String exstention  = file.getOriginalFilename().substring(file.getOriginalFilename().indexOf("."),file.getOriginalFilename().length());			    
				String destination = path + File.separator + file.getOriginalFilename();         // path that to upload image.
				String file_name   = DateUtils.getDateTime(DateUtils.dttms_format)+ exstention ; // file name that change already
				
				// * --------------------------------------------------------------------
				// * create new file image 
				// *---------------------------------------------------------------------
				File f = new File(destination);
				File nf= new File(path + File.separator + file_name);
				
				// * --------------------------------------------------------------------
				// * copy file to new file and than move file to another file.
				// *---------------------------------------------------------------------
				FileCopyUtils.copy(file.getBytes(), f);				
				FileUtils.moveFile(f, nf);
				
				// * --------------------------------------------------------------------
				// * set file name to insert in table
				// *---------------------------------------------------------------------
				image.setImage(file_name);
				
				return true;
				
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				return false;
			}
			
			
		}else{
			// * --------------------------------------------------------------------
			// * if you didn't upload image 
			// * system will be upload default image
			// *---------------------------------------------------------------------
			image.setImage("default_logo.png");  
			return true;
		}
		
	}
	/**
	 * method : upload multiple image  
	 * @param image
	 * @param files
	 * @param path
	 * @return
	 */
	public static boolean UploadMultiFile(Images image, MultipartFile[] files, String path){
		
		List<String> lst_f_name = new ArrayList<>();
		
		try{
			
			for ( MultipartFile file : files ){
				// * --------------------------------------------------------------------
				// * if this file didn't have image than different image will be upload.
				// *---------------------------------------------------------------------
				if ( file.isEmpty() ){
					continue;
				}
				
				// * --------------------------------------------------------------------
				// * initialize parameter for this method 
				// *---------------------------------------------------------------------
				String exstention  = file.getOriginalFilename().substring(file.getOriginalFilename().indexOf("."),file.getOriginalFilename().length());						
				String destination = path + File.separator + file.getOriginalFilename();
				String file_name   = DateUtils.getDateTime(DateUtils.dttms_format)+ exstention ;
				// * --------------------------------------------------------------------
				// * create new file image 
				// *---------------------------------------------------------------------
				File f = new File(destination);
				File nf= new File(path + File.separator + file_name);
				// * --------------------------------------------------------------------
				// * copy file to new file and than move file to another file.
				// *---------------------------------------------------------------------
				FileCopyUtils.copy(file.getBytes(), f);				
				FileUtils.moveFile(f, nf);
				// * --------------------------------------------------------------------
				// * set temporary file name list
				// *---------------------------------------------------------------------
				lst_f_name.add(file_name);
				
			}
			// * --------------------------------------------------------------------
			// * set file name to insert in table
			// *---------------------------------------------------------------------
			image.setListImage(lst_f_name);
			
			return true;
			
		}catch(Exception e){
			e.printStackTrace();
			return false;
			
		}
		
		
		
	}
	
}
