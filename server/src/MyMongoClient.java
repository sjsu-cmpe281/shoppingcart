/**************************
 * AUTHOR: RAKESH DATTA
 * DATE  : April 8,2016  
 **************************/

import com.mongodb.MongoClient;
import com.mongodb.MongoException;
import com.mongodb.WriteConcern;

import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;
import com.mongodb.DBCursor;

import com.mongodb.ServerAddress;
import java.util.Arrays;

public class MyMongoClient {

   public static void main( String args[] ) {

      String UserName = "cmpe281";
      String Password = "cmpe281";	
      try{
		
         // To connect to mongodb server
         MongoClient mongoClient = new MongoClient( "localhost" , 27017 );
			
         // Now connect to your databases
         DB db = mongoClient.getDB( "cmpe281" );
         System.out.println("Connected to database successfully");
         boolean auth = db.authenticate(UserName, Password);
         System.out.println("Authentication: "+auth);
			
      }catch(Exception exp){
         System.err.println( exp.getClass().getName() + ": " + e.getMessage() );
      }
   }
}
