<?php
/* POST request */
/* -------- HTTP HEADER -------- */
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: origin, x-requested-with, content-type");
header("Access-Control-Allow-Methods: GET, POST, OPTION");
/* -------------------------------- */


/* -------- ERROR LOGGING -------- */
$output = new stdClass();
$output->error = false;
$output->message = "ok";
	
// podmínka autentizace
if (false){
	$output->error = true;
	$output->message = "Unauthorized operation!";
	http_response_code(403);
	exit();
}

// overeni vstupu
$json = file_get_contents('php://input');
$obj = json_decode($json);

if (!$json){
	$output->error = true;
	$output->message = "Can not read the data!";
} else {
	if (!property_exists($obj, "type")) {
		$output->error = true;
		$output->message = "Can not read the data!";
	} else if (
		($obj->type == "range" && (!property_exists($obj, "from") || !property_exists($obj, "to"))) ||
		($obj->type == "times" && !property_exists($obj, "times")) ||
		($obj->type == "update" && !property_exists($obj, "last"))
	) {
		$output->error = true;
		$output->message = "Can not read the data!";
	}
}

/* -------------------------------- */

if (!$output->error){
	
	function format_time($time){
		// ISO-8601 timestamp format
		return date('Y-m-d\TH:i:s.uO', $time);
	}
		
	function date_range($first, $last, $step = '+1 second') {
    $dates = array();
    $current = strtotime($first);
    $last = strtotime($last);
    while( $current <= $last ) {
        $dates[] = format_time($current);
        $current = strtotime($step, $current);
    }
    return $dates;
	}		
	
	function update($from) {
		$dates = array();
		$current = strtotime('+1 second', strtotime($from));
		$now = strtotime("now");
		while( $current <= $now ) {
			$dates[] = format_time($current);
			$current = strtotime('+1 second', $current);
		}
		return $dates;
	}		
	
	function fill_output_data ($times){
		$values = array();
		foreach($times as $time){
			$value = new stdClass();
			$value->timestamp = $time;
			// cpu & ram % usage
			$value->cpu = rand(1,100);
			$value->ram = rand(30,60);
			// bits per second
			$value->bit_rate_in = rand(0,10000);
			$value->bit_rate_out = rand(1000,10000);
			// packets per second
			$value->packet_rate_in = rand(0,200);
			$value->packet_rate_out = rand(100,500);
			$value->tcp_established = rand(2,20);
			array_push($values, $value);
		}
		return $values;
	}		
	
	
	$output->data = array();
	
	array_push($output->data, new stdClass());
	$output->data[0]->info = new stdClass();
	$output->data[0]->info->name = "Device 1";
	$output->data[0]->info->ip = "192.168.0.101";
	$output->data[0]->info->os = "Debian";
	
	array_push($output->data, new stdClass());
	$output->data[1]->info = new stdClass();
	$output->data[1]->info->name = "Device 2";
	$output->data[1]->info->ip = "192.168.0.102";
	$output->data[1]->info->os = "Ubuntu";	
	

	if ($obj->type == "all") {
					
		$now = strtotime("now");
		$first = strtotime("-1 minute", $now);
		$output->data[0]->values = fill_output_data(date_range(format_time($first), format_time($now)));
		$output->data[1]->values = fill_output_data(date_range(format_time($first), format_time($now)));

	} else if ($obj->type == "update_temp") {
					
		$now = strtotime("now");
		$first = strtotime("-1 second", $now);
		$output->data[0]->values = fill_output_data(date_range(format_time($first), format_time($now)));
		$output->data[1]->values = fill_output_data(date_range(format_time($first), format_time($now)));

	} else if ($obj->type == "range") {
		
		$output->data[0]->values = fill_output_data(date_range(format_time(strtotime($obj->from)), format_time(strtotime($obj->to))));
		$output->data[1]->values = fill_output_data(date_range(format_time(strtotime($obj->from)), format_time(strtotime($obj->to))));
		
	} else if ($obj->type == "update") {
				
		$output->data[0]->values = fill_output_data(update(format_time(strtotime($obj->last))));
		$output->data[1]->values = fill_output_data(update(format_time(strtotime($obj->last))));

		
	} else if ($obj->type == "times") {
		
		$formated_times = array();
		foreach($obj->times as $time){
			array_push($formated_times, $time);
		}
		$output->data[0]->values = fill_output_data($formated_times);
		$output->data[1]->values = fill_output_data($formated_times);
		
	} else {
		$output->error = true;
		$output->message = "Can not read the data!";
	}

}

$conn = null;
echo $json_string = json_encode($output, JSON_PRETTY_PRINT);

?>

