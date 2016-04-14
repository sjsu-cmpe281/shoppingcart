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
import java.util.ArrayList;
import java.util.List;
public class RiakClient1 {
    public static void main(String [] args) throws UnknownHostException {

        // Riak Client with supplied IP and Port
        List<String> sarat;
        sarat = new ArrayList();
        sarat.add("127.0.0.1");
        RiakClient client = RiakClient.newClient(8087, sarat);
        //RiakClient sarat = RiakClient.
        client.shutdown();
    }
    
}
