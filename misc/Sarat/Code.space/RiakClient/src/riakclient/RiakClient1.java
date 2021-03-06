/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package riakclient;

/**
 *
 * @author saratvemulapalli
 */
import java.net.UnknownHostException;
import com.basho.riak.client.api.RiakClient;
import com.basho.riak.client.api.commands.kv.FetchValue;
import com.basho.riak.client.api.commands.kv.StoreValue;
import com.basho.riak.client.core.query.Location;
import com.basho.riak.client.core.query.Namespace;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;
public class RiakClient1 {
    public static void main(String [] args) throws UnknownHostException, ExecutionException, InterruptedException {

        // Riak Client with supplied IP and Port
        List<String> sarat;
        sarat = new ArrayList();
        sarat.add("127.0.0.1");
        RiakClient client = RiakClient.newClient(8087, sarat);
        
        //Storing data 
        Location location = new Location(new Namespace("TestBucket"), "TestKey");
        String myData = "This is my data";
        StoreValue sv = new StoreValue.Builder(myData).withLocation(location).build();
        StoreValue.Response svResponse = client.execute(sv);
        
        //Fetching data
        FetchValue fv = new FetchValue.Builder(location).build();
        FetchValue.Response response = client.execute(fv);
        String value = response.getValue(String.class);
        System.out.println(value);//*/
        
        client.shutdown();
    }
    
}
