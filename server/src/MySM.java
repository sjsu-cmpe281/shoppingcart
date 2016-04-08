
import java.util.*;
import java.io.*;

/**
 *  Description of the Class
 *
 *@author     RAKESH DATTA
 *@created    April 5, 2016
 */
public class MySM implements SM {

	private SM sm;


	/**
	 *  Constructor for the MySM object
	 *
	 *@since
	 */
	public MySM() {
		this.sm = SMFactory.getInstance();
	}



	/**
	 *  Description of the Method
	 *
	 *@param  rec              Description of Parameter
	 *@return                  Description of the Returned Value
	 *@exception  IOException  Description of Exception
	 *@since
	 */
	public SM.OID store(Record rec) throws IOException {
		return sm.store(rec);
	}


	/**
	 *  Description of the Method
	 *
	 *@param  oid                    Description of Parameter
	 *@return                        Description of the Returned Value
	 *@exception  NotFoundException  Description of Exception
	 *@exception  IOException        Description of Exception
	 *@since
	 */
	public Record fetch(SM.OID oid) throws NotFoundException, IOException {
		return sm.fetch(oid);
	}


	/**
	 *  Description of the Method
	 *
	 *@exception  SM.IOException  Description of Exception
	 *@since
	 */
	public void close() throws SM.IOException {
		sm.close();
	}


	/**
	 *  Description of the Method
	 *
	 *@exception  SM.IOException  Description of Exception
	 *@since
	 */
	public void flush()  {
		try { sm.flush(); } catch (Exception e) {}
	}



	/**
	 *  Description of the Method
	 *
	 *@param  oid                    Description of Parameter
	 *@param  rec                    Description of Parameter
	 *@return                        Description of the Returned Value
	 *@exception  NotFoundException  Description of Exception
	 *@exception  IOException        Description of Exception
	 *@since
	 */
	public SM.OID update(SM.OID oid, Record rec) throws NotFoundException, IOException {
		return sm.update(oid, rec);
	}


	/**
	 *  Description of the Method
	 *
	 *@param  oid                        Description of Parameter
	 *@exception  NotFoundException      Description of Exception
	 *@exception  CannotDeleteException  Description of Exception
	 *@since
	 */
	public void delete(SM.OID oid) throws NotFoundException, CannotDeleteException {
		sm.delete(oid);
	}

        public SM.OID getOID( byte[] oidbytes ) {
        	return sm.getOID( oidbytes ) ;	  
        } 


	public class MyHashMap {
    		private Map<String, String> map = new HashMap<String, String>();
    		private Map<String, String> map1 = new HashMap<String, String>();

    		MyHashMap(){

    		};

    		public void create(SM.OID oid, String key){
        	   //System.out.println("guid: "+oid.toBytes());
        	   //String guid = new String (oid.getKey());

        	   String guid = new String (oid.toBytes());
        	   System.out.println("[INFO]: map_create:key/guid  = "+guid);
        	   System.out.println("[INFO]: map_create:value     = "+key);

        	   map.put(guid, key);

        	   map1.put(guid, "1");
    		};

    		public SM.OID read(String value){
        	   //System.out.println("[INFO]: map_read:value  = "+value);
        	   String guid = null;
        
        	   for (Object o : map.keySet()) {
            	      if (map.get(o).equals(value)) {
                          //System.out.println(o);
                          guid = o.toString();
                      }
        	   }

        	   System.out.println("[INFO]: map_read:guid   = "+guid);
                   return getOID(guid.getBytes());
                };

                public void delete(String value){
                   System.out.println("[INFO]: map_delete:value  = "+value);
                   String guid = null;

                   for (Object o : map.keySet()) {
                      if (map.get(o).equals(value)) {
                          //System.out.println(o);
                          guid = o.toString();
                      }
                   }

                   System.out.println("[INFO]: map_delete:guid   = "+guid);
	           map.remove(guid);		
                };

    		public void increaseVer(String value){
		   String guid = null;

                   for (Object o : map.keySet()) {
                      if (map.get(o).equals(value)) {
                          guid = o.toString();
           
 			  String version = map1.get(guid);
                          int ver = Integer.parseInt(version);
                          ver++;
        	          map1.put(guid, String.valueOf(ver));
			  
                      }

                 
                   }
                };

		public String readVer(String value){
                   String guid = null;
                  
                   for (Object o : map.keySet()) {
                        if (map.get(o).equals(value)) {
                            guid = o.toString();
                            return map1.get(guid);
                        }
	           }
                   return "0";
                };
        }


}

