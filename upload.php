<?php
	$fn = (isset($_SERVER['HTTP_FILE_NAME']) ? $_SERVER['HTTP_FILE_NAME'] : false);
	
	$upload_dir = (isset($_ENV['OPENSHIFT_DATA_DIR']) ? $_ENV['OPENSHIFT_DATA_DIR'] : "/var/www/");
	if ($fn && $upload_dir)
	{
		$raw_data = file_get_contents('php://input');
		$data = base64_decode($raw_data);
		$result = file_put_contents($upload_dir . '' . $fn, $data);
		if ($data)
		{
			echo "uploaded!" . $upload_dir . '/' . $fn;
		}
	}
	exit();
?>