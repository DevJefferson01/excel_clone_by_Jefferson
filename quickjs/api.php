<?php 

session_start();
$database_name ="my_data";
$table = "employees";
$primary_key = "id";



if(!$con = mysqli_connect('localhost', 'root', '', $database_name)){

	die("failed to connect");
}

 $primary_key = get_primary_key($con,$table);

$data = file_get_contents("php://input");
$OBJ = json_decode($data);

if (is_object($OBJ)) {
	$info = (object)[];
	$info->data_type = $OBJ->data_type;
	
	if($OBJ->data_type == "read"){
		$arr = array();

		$query ="select * from $table order by $primary_key asc";
		$result = mysqli_query($con, $query);
		if($result){

			if (mysqli_num_rows($result) >0) {
				while ($row = mysqli_fetch_assoc($result)) {

					$arr[] = (object)$row;					

				}

				$info->data = $arr;

				echo json_encode($info);
			}
		}


	}else
	 if($OBJ->data_type == "save") {

	 	
	 	if(is_array($OBJ->data)){
	 		foreach ($OBJ->data as  $row) {
	 			$query = "update $table set ";

	 			$primary_key_value = "";

	 			foreach ($row as $key => $value) {

	 				if($key == $primary_key){

	 					$primary_key_value = $value;
	 				}else{

	 				$query .= $key . "= '" . mysqli_real_escape_string($con,$value) . "',";
	 				}
	 			}

	 			$query = trim($query,",");

	 			$query .= " where $primary_key = '$primary_key_value' limit 1";

	 			$result = mysqli_query($con, $query);
	 		}
	 	}
	 	
		
	}
}

function get_primary_key($con,$table){

	$query ="show columns from $table ";
		$result = mysqli_query($con, $query);
		if($result){

			if (mysqli_num_rows($result) >0) {
				while ($row = mysqli_fetch_assoc($result)) {

					if($row['Key'] == "PRI"){

						return $row['Field'];
					}				

				}

			}
		}
			return "id";
}