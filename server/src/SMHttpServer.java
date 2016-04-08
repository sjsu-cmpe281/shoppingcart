
import java.util.*;
import java.io.*;
import java.net.*;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;


import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.io.InputStream;
import java.util.Scanner;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.Headers;

public class SMHttpServer {
    private static MySM sm = new MySM();
    private static MySM.MyHashMap map = sm.new MyHashMap();

    private static String myRole;  
    private static String slave1IP ;  
    private static String slave2IP ; 
    private static String masterIP;  

    public static String getKeyFromJson(String keyValue) throws Exception {
           String jsonStr = "{" + keyValue + "}";
           JSONObject jsonObj = (JSONObject)new JSONParser().parse(jsonStr);

           Set keys = jsonObj.keySet();
           Iterator a = keys.iterator();
           while(a.hasNext()) {
               String key = (String)a.next();
               String value = (String)jsonObj.get(key);
               System.out.println("[INFO]: key   = "+key);
               System.out.println("[INFO]: value = "+value);
               return key;
           }
           return null;
    }


    public static SM.OID createRecord(MySM sm, String keyValue) throws Exception {
            Record found   = null;
            SM.OID rec_oid = null;
            SM.OID found_oid = null;
            Record rec     = new Record(20);

	    rec.setBytes(keyValue.getBytes());
            rec_oid        = (SM.OID) sm.store(rec);
            return rec_oid;
    }

    public static boolean replication(String myRole, String method, String body, String srcIP, String destIP) throws Exception {
            String cmd = "";
            System.out.println("[INFO]: Replication: Checking if "+destIP+" is alive");  
	    if (isDead(destIP, 8080) == 0) {
               cmd = "curl -X "+method+" -d "+body+" "+destIP+":80 -H 'X-FORWARDED-FOR: "+srcIP+"'";
	       //System.out.println(cmd);	
   	       Runtime.getRuntime().exec(cmd);
               return true;
            } else {		
               return false;
            }
    }

   public static String handlePost (MySM sm, String body) throws Exception {
		SM.OID oid = createRecord(sm, body);
                String key = getKeyFromJson(body);
                map.create (oid, key);
                SM.OID found_oid  = map.read(key);
                Record found   = (Record) sm.fetch(found_oid);
		System.out.println("[INFO]: NewRecord  = ");
                System.out.write(found.getBytes(0,0));
                System.out.println("");
                return "SUCCESS\n";

   }

   public static String handlePut (MySM sm, String body) throws Exception {
                String key   = getKeyFromJson(body);
                SM.OID oid   = map.read(key);
                Record rec   = new Record(20);
                rec.setBytes(body.getBytes());
                SM.OID new_oid = (SM.OID) sm.update(oid, rec);
		map.increaseVer(key);
                Record found   = (Record) sm.fetch(new_oid);
                System.out.print("[INFO]: UpdRecord:  New Record = ") ;
                System.out.write(found.getBytes(0,0));
                System.out.println("");
		return "SUCCESS\n";

   }

   public static String handleDel (MySM sm, String body) throws Exception {
                SM.OID oid   = map.read(body);
                sm.delete(oid);
                map.delete(body);
                System.out.println("[INFO]: Record Deleted\n");
	        return "SUCCESS\n";

   }

   public static String handleRequest  (MySM sm, String method, String body, String myRole,
					String myIP, String masterIP, String slave1IP,
					String slave2IP, String srcip,
					String partitionMode) throws Exception { 
            String response = " ";
   	    if (myRole.contains("MASTER")) {
                switch (method) {
                  case "POST":    response = handlePost (sm, body);
                                  break;
	
                  case "PUT":     response = handlePut (sm, body);
                                  break;

                  case "DELETE":  response = handleDel (sm, body);
                                  break;

                  default:
                                  response = "ERROR\n";
                }
						  
		if(!replication (myRole, method, body, masterIP, slave1IP)) {
			System.out.println("[ERROR]: Slave "+slave1IP+" is partitioned..."+method+" not forwarded to Slave.");
		} else {
			System.out.println("[INFO]: Slave "+slave1IP+" is Alive..."+method+" forwarded.");
                }

		if(!replication (myRole, method, body, masterIP, slave2IP)){
			System.out.println("[ERROR]: Slave "+slave2IP+" is partitioned..."+method+" not forwarded to Slave");
		} else {
			System.out.println("[INFO]: Slave "+slave2IP+" is Alive..."+method+" forwarded.");
		}

	    } else if (myRole.contains("SLAVE")) {
 		if (srcip.contains(masterIP)) {
		        System.out.println("[INFO]: Slave Received "+method+" from Master.. ");
                        switch (method) {
                  	 case "POST":    response = handlePost (sm, body);
                                   	 break;

                  	 case "PUT":     response = handlePut (sm, body);
                                  	 break;

                  	 case "DELETE":  response = handleDel (sm, body);
                                         break;

                  	 default:
                                  	 response = "ERROR\n";
                	}

		} else {
		        System.out.println("[INFO]: Slave Received "+method+" from external n/w.. ");
		        System.out.println("[INFO]: Forwaring "+method+" to Master.. ");
		        if(!replication (myRole, method, body, myIP, masterIP)) {
                            System.out.println("[ERROR]: Master is not reachable..."+method+" not forwarded");
                            System.out.println("[ERROR]: "+partitionMode+" mode enabled");
                            System.out.println("[ERROR]: "+method+" not handled");
                            response = "ERROR\n";
                        } else {
                            System.out.println("[INFO]: Master is reachable..."+method+" forwarded.");
                            response = "SUCCESS\n";
                        }
                 }
    	    }

            return response;

    }


    public static int isDead(String ip, int port) throws Exception {
           //String cmd = "ping -c 1 "+ip;
           String cmd = "curl -X OPTIONS "+ip+":"+port+" --connect-timeout 5";
           Process p = Runtime.getRuntime().exec(cmd);
           int returnVal = p.waitFor();
           return returnVal;
    }

    public static void main(String[] args) throws Exception {

            HttpServer server = null;
	    int port = 80;
	    int admin_port = 8080;
            server = HttpServer.create(new InetSocketAddress(port), 0);

            /***** Load Configuration Properties *******************/
            Properties prop   = new Properties();
            InputStream input = null;
            input             = new FileInputStream("config.properties");

            // load a properties file
            prop.load(input);
 
            String partitionMode = prop.getProperty("partitionMode");
            String myRole        = prop.getProperty("myRole");
	    String masterIP      = prop.getProperty("masterIP");
            String slave1IP      = prop.getProperty("slave1IP");
            String slave2IP      = prop.getProperty("slave2IP");
            String myIP          = prop.getProperty("myIP");

	    // get the property value and print it out

	    System.out.println("partitionMode = "+partitionMode+",");
	    System.out.println("myRole        = "+myRole+",");
	    System.out.println("masterIP      = "+masterIP+",");
	    System.out.println("slave1IP      = "+slave1IP+",");
	    System.out.println("slave2IP      = "+slave2IP+",");
	    System.out.println("myIP          = "+myIP+",");

	    /********************************************************/

            HttpHandler handler = new HttpHandler() {
                    @Override
		    public void handle(HttpExchange msg) throws IOException {
                        
			String body = " ";
 			String cmd  = " ";

                        System.out.println("[INFO]: ================= NEW MESSAGE ==================");

			System.out.println("[INFO]: URI: "+ msg.getRequestURI());
                        System.out.println("[INFO]: METHOD: "+ msg.getRequestMethod());

                        InputStream in = msg.getRequestBody();
                        if (0 != in.available()) {
				body = new Scanner(in,"UTF-8").useDelimiter("\\A").next();
                        	System.out.println("[INFO]: BODY: "+ body);
		        } else {
                        	System.out.println("[WARNING]: Empty message body");
                        }
     
                        Headers h = msg.getRequestHeaders();
                        String srcip = h.getFirst("X-FORWARDED-FOR");
            		if (srcip == null) {
                		srcip = msg.getRemoteAddress().toString();
            		}


                    	System.out.println("[WARNING]: masterIP:"+masterIP+" srcip:"+srcip);
                        String response = " ";

                        switch(msg.getRequestMethod()){
                                case "POST":    System.out.println("[INFO]: POST request received");
						try{
					            response = handleRequest(sm, msg.getRequestMethod(), 
									     body, myRole, myIP, masterIP, 
									     slave1IP, slave2IP, srcip,
									     partitionMode);
                                     
						} catch (Exception e) {
                                                  System.out.println("[ERROR]: POST request cant be handled");
                                                  response = "ERROR\n";
						}
                                                break;

                                case "GET":     System.out.println("[INFO]: GET request received");
						try{
						  if (myRole.contains("SLAVE") && 
						      (isDead(masterIP, 8080) != 0) && 
					               partitionMode.contains("CP")) {
                                                      	  System.out.println("[ERROR]: Network is Partitioned..");
                                                          System.out.println("[ERROR]: Slave is in CP mode..");
                                                          System.out.println("[ERROR]: GET request not handled..");
					                  response = "ERROR\n";		
                                                  } else {
						      SM.OID oid   = map.read(body);
						      Record rec   = (Record) sm.fetch(oid);
						      System.out.print("[INFO]: GetRecord:  Record = ") ;
            					      System.out.write(rec.getBytes(0,0));
					              System.out.println("");
            					      response = new String (rec.getBytes(0,0));
            					      response = response + ",\n"+"\"node_ip\":\""+myIP+"\""+",\n";

						      String ver = map.readVer(body);	
            					      response = response + "\"version\":\""+ver+"\""+"\n";
						  }
						} catch (Exception e) {
                                                  System.out.println("[ERROR]: GET request cant be handled");
                                                  response = "ERROR\n";
						}
						break;

                                case "PUT":     System.out.println("[INFO]: PUT request received");
				                try{
					          response = handleRequest(sm, msg.getRequestMethod(), 
									     body, myRole, myIP, masterIP, 
									     slave1IP, slave2IP, srcip,
									     partitionMode);
                                                } catch (Exception e) {
                                                  System.out.println("[ERROR]: PUT request cant be handled");
                                                  response = "ERROR\n";
                                                }

                                                break;

                                case "DELETE":  System.out.println("[INFO]: DELETE request received");
					        try{
					          response = handleRequest(sm, msg.getRequestMethod(), 
									     body, myRole, myIP, masterIP, 
									     slave1IP, slave2IP, srcip,
									     partitionMode);
                                                } catch (Exception e) {
                                                  System.out.println("[ERROR]: DELETE request cant be handled");
                                                  response = "ERROR\n";
                                                }

                                                break;
		                case "OPTIONS": System.out.println("[INFO]: HEARTBEAT Check.. Received OPTIONS");
                                                response = "ALIVE";
					
						break;

                                default:        System.out.println("[ERROR]: Method Not Supported");
                                                response = "ALIVEMethod Not Supported\n";

                        }
                        msg.sendResponseHeaders(200, response.length());
                        OutputStream os = msg.getResponseBody();
                        os.write(response.getBytes());
                        os.close();
                   }
                };

		server.createContext("/", handler);
		server.setExecutor(null); // creates a default executor
		server.start();
		System.out.println("[INFO]: HTTP Server started at port "+port);
		System.out.println("        ========================================");

                /* Admin Server */
		HttpServer adminserver = null;
                adminserver = HttpServer.create(new InetSocketAddress(admin_port), 0);
 		HttpHandler adminhandler = new HttpHandler() {
                    @Override
                    public void handle(HttpExchange msg) throws IOException {
			String resp = " ";
	 		switch(msg.getRequestMethod()){
			case "OPTIONS" :
 					System.out.println("[INFO]: HEARTBEAT Check.. Received OPTIONS");
			        	resp = "ALIVE";

                                 	break;

			default: 
					resp = "ALIVE";
					break;
			}
		
			msg.sendResponseHeaders(200, resp.length());
                        OutputStream os2 = msg.getResponseBody();
                        os2.write(resp.getBytes());
                        os2.close();

		    }
		};

		adminserver.createContext("/", adminhandler);
		adminserver.setExecutor(null); // creates a default executor
		adminserver.start();

  	}

}
