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
import com.basho.riak.client.api.RiakClient;
import com.basho.riak.client.api.commands.kv.FetchValue;
import com.basho.riak.client.core.query.Location;
import com.basho.riak.client.core.query.Namespace;

import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

public class FetchObject {

    // { "foo":"Some String", "bar":"some other string","foobar":5 }
    static class Pojo {
        public String str;
        public String str2;
        public int value;
    }

    public static void main(String [] args) throws UnknownHostException, ExecutionException, InterruptedException {

        List<String> sarat;
        sarat = new ArrayList();
        sarat.add("127.0.0.1");
        RiakClient client = RiakClient.newClient(8087, sarat);
        Location location = new Location(new Namespace("TestBucket"), "TestKey");

        FetchValue fv = new FetchValue.Builder(location).build();
        FetchValue.Response response = client.execute(fv);

        // Fetch object as Pojo class (map json to object)
        Pojo myObject = response.getValue(Pojo.class);
        System.out.println(myObject.str);

        client.shutdown();
    }
}