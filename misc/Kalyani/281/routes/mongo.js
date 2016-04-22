/**
 * http://usejsdoc.org/
 */
//1
var ejs= require('ejs');
var readline = require('readline');

var readInput = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

var MongoClient = require('mongodb').MongoClient;
var dbURL = 'mongodb://localhost:27017/db_bag';
var myDB = "bags";
var dbConnection;

//1

var bagInsertHandler = function(err, recs){
  if(err) throw err;
  console.log("Successfully inserted the bag");
  
  readInput.question("Do you want to continue? (Y/N) ", function(answer){
	  if(answer.toLowerCase()=='y')
			printMain(dbConnection);
		else	
			console.log("Press Ctrl+C to exit the program");
	  return;
  });
}


var insertBook = function(db){
  readInput.question("ID of the bag: ", function(id){
     readInput.question("Type of the bag: ", function(type){
      readInput.question("Gender: ", function(gender){
         readInput.question("Price: ", function(price){
			 readInput.question("Count: ",function(count){
           db.collection(myDB).find({id: id},{},{}).toArray(
             function(err, docs){
               if ( docs.length > 0){
                 console.log("Bag with ID " + id + " already exists");
                 printMain(dbConnection);
               }else{
                 db.collection(myDB).insert({
                    'id':id,
                    'type': type,
                    'gender': gender,
                    'price': price,
					'count': count
                  }, bagInsertHandler);
               }
             }
           );
         });
		 });
       });
     });
  });
}

var bagUpdateHandler = function(err, recs){
  if(err) throw err;
  console.log("Successfully updated the bag");
  
  readInput.question("Do you want to continue? (Y/N) ", function(answer){
	  if(answer.toLowerCase()=='y')
			printMain(dbConnection);
		else	
			console.log("Press Ctrl+C to exit the program");
	  return;
  });
}

 
var updateBag = function(db){

  readInput.question("Enter the ID of the bag you want to update: ", function(answer){

    db.collection(myDB).find({id: answer},{},{}).toArray(

      function(err, docs){
        if ( docs.length == 0){
          console.log("Bag with ID " + id + " not found");
          
		    readInput.question("Do you want to continue? (Y/N) ", function(answer){
	  if(answer.toLowerCase()=='y')
			printMain(dbConnection);
		else	
			console.log("Press Ctrl+C to exit the program");
	  return;
  });
		  
        }else{
          readInput.question("Enter the type of the bag: ", function(type){
               readInput.question("Gender: ", function(gender){
                 readInput.question("Price: ", function(price){
					 readInput.question("Count: ", function(count){
                         db.collection(myDB).update({"id":answer}, {
                            'type':type,
                            'gender':gender,
                            'price':price,
                            'count':count
                          }, bagUpdateHandler);
                 });
               });
		  });
          });
        }
      });
  });
}

var bagDeleteHandler = function(err, recs){
  if(err) throw err;
  console.log("Successfully deleted the bag");
  
 readInput.question("Do you want to continue? (Y/N) ", function(answer){
	  if(answer.toLowerCase()=='y')
			printMain(dbConnection);
		else	
			console.log("Press Ctrl+C to exit the program");
	  return;
  });
  
}


 var deleteBag = function(db){
  readInput.question("Enter the ID of the bag you want to delete: ", function(answer){
    db.collection(myDB).find({id: answer},{},{}).toArray(
      function(err, docs){
        if ( docs.length == 0){
          console.log("Bag with ID " + answer + " not found");
          
		    readInput.question("Do you want to continue? (Y/N) ", function(answer){
	  if(answer.toLowerCase()=='y')
			printMain(dbConnection);
		else	
			console.log("Press Ctrl+C to exit the program");
	  return;
  });
		  
        }else{
          db.collection(myDB).remove({"id":answer}, bagDeleteHandler);
        }
      });
  });
}


MongoClient.connect(dbURL, function(err, db){
  if ( err ) throw err;
  dbConnection = db;

  printMain();

});

var printMain = function(db){
  console.log("Welcome to GUESS Bags");
  console.log("1. Add a new Bag");
  console.log("2. List all Bags");
  console.log("3. Update a Bag by ID");
  console.log("4. Delete the bag by ID");
  console.log("5. Find a Bag by type: ");
  console.log("6. Quit");
  readInput.question("Enter your choice: ", function(answer){
//    console.log("Choice entered is: " + answer);

    switch(answer){
      case "1":
        insertBook(dbConnection);
        break;

		case "2":
        listBags(dbConnection);
        break;

		case "3":
        updateBag(dbConnection);
        break;

     case "4":
        deleteBag(dbConnection);
        break;
		
	case "5":
		findBag(dbConnection);
		break;

      case "6":
        console.log("Press Ctrl+C to exit the program");
        return;
    }

  })

}

 
var listBags = function(db){
  db.collection(myDB).find({},{},{}).toArray(
    function(err, docs){
      for(loop in docs){
        console.log(docs[loop]);
      }
     
	 readInput.question("Do you want to continue? (Y/N) ", function(answer){
	  if(answer.toLowerCase()=='y')
			printMain(dbConnection);
		else	
			console.log("Press Ctrl+C to exit the program");
	  return;
  });
	 
    }
  );
}



var findBag = function(db){
	
	readInput.question("Type of bag: ", function(answer){
		
		db.collection(myDB).find({type: answer},{},{}).toArray(
		function(err, docs){
			 if ( docs.length == 0){
          console.log("Bag not found");
		  
           readInput.question("Do you want to continue? (Y/N) ", function(answer){
	  if(answer.toLowerCase()=='y')
			printMain(dbConnection);
		else	
			console.log("Press Ctrl+C to exit the program");
	  return;
  });
        }else{
      for(loop in docs){
		  
        console.log(docs[loop]);
      }
      
	  readInput.question("Do you want to continue? (Y/N) ", function(answer){
	  if(answer.toLowerCase()=='y')
			printMain(dbConnection);
		else	
			console.log("Press Ctrl+C to exit the program");
	  return;
  });
	  
		}
    }
		)
	});
}




