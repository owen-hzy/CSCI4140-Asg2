<?php
error_reporting(E_ALL); ini_set('display_errors', 1);

require_once 'db.inc.php';

function upload()
{
	$fn = (isset($_SERVER['HTTP_FILE_NAME']) ? $_SERVER['HTTP_FILE_NAME'] : false);
	$MAX_FILE_SIZE = 1000000;
	$upload_dir = (isset($_ENV['OPENSHIFT_DATA_DIR']) ? $_ENV['OPENSHIFT_DATA_DIR'] : "/var/www/asg2/data/");
	if ($fn && $upload_dir)
	{
		$raw_data = file_get_contents('php://input');
		$data = base64_decode($raw_data);
		$image_dir = $upload_dir . '' . $fn;
		$name_extension = explode(".", $fn);
		$name = $name_extension[0];
		$extension = $name_extension[1]; 
		$thumbname = $name . "_thumb." . $extension;
		$up_time = system("/bin/date +%s");
		
		// Put the file into a directory and return the size if succeed
		$result = file_put_contents($image_dir, $data);
		// Get the MIME type 
		$type = finfo_file(finfo_open(FILEINFO_MIME_TYPE), $image_dir);
		// Server side validation on upload file
		if ($result && $result <= $MAX_FILE_SIZE && ($type == 'image/jpeg' || $type == 'image/png' || $type == 'image/gif'))
		{
			system("/usr/bin/convert " . $image_dir . " -resize 30% " . $upload_dir . "" . $thumbname);
			global $db;
			$db = db_connect("asg2");
			
			if (check_duplicate($fn) == 0) {
				$q = $db->prepare("INSERT INTO photos (name, thumb_name, size, upload_time) VALUES (:name, :thumb_name, :size, :upload_time)");
				if(! $q->execute(array(":name" => $fn, ":thumb_name" => $thumbname, ":size" => $result, ":upload_time" => $up_time)))
				{
					throw new PDOException("ERROR_UPLOAD_INSERT");
				}
			}
			else 
			{
				$q = $db->prepare("UPDATE photos SET size=(:size), upload_time=(:upload_time) WHERE name=(:name)");
				if (! $q->execute(array(":size" => $result, ":upload_time" => $up_time, ":name" => $fn)))
				{
					throw new PDOException("ERROR_UPLOAD_UPDATE");
				}
			}
			return $fn;
		}
		else 
		{
			system('/bin/rm -f ' . $image_dir);
			system('/bin/rm -f ' . $upload_dir . "" . $thumbname);
			return "File type or size is not correct!";
		}		
	}
}

function check_duplicate($filename)
{
	global $db;
	$db = db_connect("asg2");
	
	$q = $db->prepare("SELECT COUNT(*) FROM photos WHERE name = (:name)");
	$q->execute(array(":name" => $filename));
	$r = $q->fetch();
	return $r["COUNT(*)"];
}

header("Content-Type: application/json");
try {
	if (($returnVal = call_user_func($_REQUEST["action"])) === false)
	{
		echo json_encode(array("failed" => "1"));
	}
	echo json_encode(array("success" => $returnVal));
}
catch (PDOException $e)
{
	error_log($e->getMessage());
	echo json_encode(array("failed" => "error db"));
}
catch (Exception $e)
{
	echo json_encode(array("failed" => $e->getMessage()));
}

?>