/**
 * http://usejsdoc.org/
 */
var choice = document.getElementById("choice");

var item_code=localStorage.getItem("item_code");

document.getElementById("choice").innerHTML = localStorage.setItem('item_code','value');

function SaveItem() {
	
	var name = document.forms.ShoppingList.name.value;
	var data = document.forms.ShoppingList.data.value;
	localStorage.setItem(name, data);
	doShowAll();
	
}

function doShowAll() {
	if (CheckBrowser()) {
		var key = "";
		var list = "<tr><th>Name</th><th>Value</th></tr>\n";
		var i = 0;
		for (i = 0; i <= localStorage.length - 1; i++) {
			key = localStorage.key(i);
			list += "<tr><td>" + key + "</td>\n<td>"
					+ localStorage.getItem(key) + "</td></tr>\n";
		}
		if (list == "<tr><th>Name</th><th>Value</th></tr>\n") {
			list += "<tr><td><i>empty</i></td>\n<td><i>empty</i></td></tr>\n";
		}
		document.getElementById('list').innerHTML = list;
	} else {
		alert('Cannot store shopping list as your browser do not support local storage');
	}
}