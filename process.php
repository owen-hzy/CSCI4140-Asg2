<?php
	$fn = (isset($_SERVER['HTTP_FILE_NAME']) ? $_SERVER['HTTP_FILE_NAME'] : false);
	$MAX_FILE_SIZE = 1000000;
	$upload_dir = (isset($_ENV['OPENSHIFT_DATA_DIR']) ? $_ENV['OPENSHIFT_DATA_DIR'] : "/var/www/asg2/data/");
	if ($fn && $upload_dir)
	{
		$raw_data = file_get_contents('php://input');
		$data = base64_decode($raw_data);
		$image_dir = $upload_dir . '' . $fn; 
		
		// Put the file into a directory and return the size if succeed
		$result = file_put_contents($image_dir, $data);
		// Get the MIME type 
		$type = finfo_file(finfo_open(FILEINFO_MIME_TYPE), $image_dir);
		// Server side validation on upload file
		if ($result && $result <= $MAX_FILE_SIZE && ($type == 'image/jpeg' || $type == 'image/png' || $type == 'image/gif'))
		{
			echo "uploaded!" . $image_dir;
		}
		else 
		{
			system('/bin/rm -f ' . $image_dir);
			echo 'deleted';
		}		
	}
?>