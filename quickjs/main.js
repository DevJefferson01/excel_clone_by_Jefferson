let SELECTED_CELLS = [];
var ACTIVE_CELL = null;
var EDIT_MODE = false; 
var DONT_EDIT = [

	"employeeNumber"


	];

var tbody = document.querySelector(".js-tbody");

var main_menu = document.querySelector(".js_main-menu");

var sub_menu = document.querySelector(".js-sub-menu");

var row_info = document.querySelector(".js-row-info");
var column_info = document.querySelector(".js-column-info");
var column_name_info = document.querySelector(".js-column-name-info");

send_data({data_type:"read"});

//add eventListeners
window.document.body.addEventListener('keydown', key_was_pressed);

tbody.addEventListener('click',tbody_clicked);
tbody.addEventListener('contextmenu',show_sub_menu);

function show_main_menu(mode){

	if (mode) {
		main_menu.classList.remove('hide');
	}
	else{

		main_menu.classList.add('hide');

	}
	
}

function show_sub_menu(e)
{

	e.preventDefault();
	select_by_mouse(e);
	sub_menu.style.left = e.clientX + "px";
	sub_menu.style.top = e.clientY + "px";
	sub_menu.classList.remove('hide');
	show_main_menu(false);
	return false;
	
}

function send_data(data = ''){

var ajax = new XMLHttpRequest();
ajax.addEventListener('readystatechange',function(e){
	if(ajax.status == 200 && ajax.readyState == 4){
		handle_result(ajax.responseText);
	}
});
ajax.open("POST", "api.php",true);
ajax.send(JSON.stringify(data));

}

function handle_result(result)
{
	console.log(result);

	if(result == "") return;

	var OBJ = JSON.parse(result);
	if (OBJ.data_type == "read") {

		refresh_table(OBJ.data);
	}else
	if(OBJ.data_type == "save") {

		send_data({data_type:"read"});

	}
}

function refresh_table(data){
	
	var thead = document.querySelector(".js-thead");

	var temp = "";
	thead.innerHTML = "";
		temp += "<tr>";

		for(var key in data[0]){

			temp += `<th>${key}</th>`;
	}

	temp += "</tr>";
  thead.innerHTML = temp;
  


///////////////////////////////////////////////////

  var temp = "";
	tbody.innerHTML = "";
	for (var i = 0; i < data.length; i++) {
		temp += "<tr>";

		var number = 0;

		for(var key in data[i]){

			temp += `<td row = "${i}" column = "${number}" columnName="${key}">${data[i][key]}</td>`;

			number++;
	}

	temp += "</tr>";

}
  tbody.innerHTML = temp;
}

function edit(e)
{
	sub_menu.classList.add('hide');
	if (SELECTED_CELLS.length == 0)

		return;


	var column = SELECTED_CELLS[0].getAttribute("columnName");

	   	if (DONT_EDIT.includes(column)) {

	   		return;
	   	}




	var input = document.querySelector(".js-input");
	input.value = SELECTED_CELLS[0].innerHTML;
	ACTIVE_CELL = SELECTED_CELLS[0];

	SELECTED_CELLS[0].innerHTML = "";
	SELECTED_CELLS[0].insertBefore(input,null);
	input.classList.remove("hide");
	input.focus();

	EDIT_MODE = true;
}

function update_cell(e)
{
	var input_holder = document.querySelector(".js-input-holder");
	input_holder.insertBefore(e.target,null);


	ACTIVE_CELL.innerHTML = e.target.value;
	e.target.value = "";
	e.target.classList.add("hide");

	EDIT_MODE = false;
    
}

function key_was_pressed(e)
{
	if(e.key == "Enter")
	{
		if (EDIT_MODE) {

			update_cell(e)
		}
	}else

	if (e.key == "ArrowUp") {

		select_by_keyboard("up");

	}else

	if (e.key == "ArrowDown") {

		select_by_keyboard("down");


	}else

	if (e.key == "ArrowLeft") {

		select_by_keyboard("left");


	}else

	if (e.key == "ArrowRight") {

		select_by_keyboard("right");
	}else
		if (e.key == "Delete") {

			delete_content();

			
		}
}

function delete_content(){

	for (var i = 0; i < SELECTED_CELLS.length; i++) {
				var column = SELECTED_CELLS[i].getAttribute("columnName");
				if(DONT_EDIT.includes(column)){
					continue;
				}
				SELECTED_CELLS[i].innerHTML = "";
			}

			sub_menu.classList.add('hide');


}


function tbody_clicked(e)

{

	show_main_menu(false); 

  sub_menu.classList.add('hide');
	select_by_mouse(e);
}

function select_by_mouse(e)
{

	for (var i = 0; i < tbody.children.length; i++){

		var tr = tbody.children[i];
		for (var x = 0; x < tr.children.length; x++) {
			tr.children[x].classList.remove("selected");
		}


	}

	e.target.classList.add('selected');

	SELECTED_CELLS = [];
	SELECTED_CELLS.push(e.target);

	 update_cell_info();


}

function select_by_keyboard(mode)
{

	if (SELECTED_CELLS.length == 0) {

		return;
	}

	var to_select = cell_to_select(SELECTED_CELLS[0],mode);
	var new_cell = null;

	for (var i = 0; i < tbody.children.length; i++){

		var tr = tbody.children[i];
		for (var x = 0; x < tr.children.length; x++) {

			console.log()

			var row = tr.children[x].getAttribute("row");
			var column = tr.children[x].getAttribute("column");

			if(to_select.row == row && to_select.column == column){

				new_cell = tr.children[x];
				
				new_cell.classList.add('selected');
			}else{
				tr.children[x].classList.remove("selected");
			}	
			
		}


	}

	if (new_cell) {

		SELECTED_CELLS = [];
	    SELECTED_CELLS.push(new_cell);

	     update_cell_info();
	}

	


}

function update_cell_info(){
	if(SELECTED_CELLS.length == 0)
		return;

 row_info.innerHTML = SELECTED_CELLS[0].getAttribute("row");
 column_info.innerHTML = SELECTED_CELLS[0].getAttribute("column");
 column_name_info.innerHTML = SELECTED_CELLS[0].getAttribute("columnName");


}

function cell_to_select(selected_cell,mode){

	to_select = {
		row:0,
		column:0
	}

	var row = selected_cell.getAttribute("row");
	var column = selected_cell.getAttribute("column");

	if (mode == "up") {

		to_select.row = parseInt(row) > 0 ? (parseInt(row) - 1) : 0;
		to_select.column = column;

	}else

	if (mode == "down") {

		to_select.row = (parseInt(row) + 1);
		to_select.column = column;


	}else

	if (mode == "left") {

		to_select.row = row;
		to_select.column = parseInt(column) > 0 ? (parseInt(column) - 1) : 0;


	}else

	if (mode == "right") {

		to_select.row = row;
		to_select.column = (parseInt(column) + 1);
	}

	return to_select;


}

function collect_data(){

	if(!confirm("are you sure you want to save data??"))
	{
		return;
	}

	var tbody = document.querySelector(".js-tbody");
	var data =[];
	var object = {};

	for (var i = 0; i < tbody.children.length; i++) {
		object = {};
		for (var x = 0; x < tbody.children[x].children.length; x++) {
			var column = tbody.children[i].children[x].getAttribute("columnName");
			object[column] = tbody.children[i].children[x].innerHTML;
		}

		data.push(object);
	}

	
	var main_object = {
		data:data,
		data_type:"save"
	};

	send_data(main_object);
}
