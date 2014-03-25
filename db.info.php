<?php

$db_host = (isset($_ENV['OPENSHIFT_MYSQL_DB_HOST'])) ? $_ENV['OPENSHIFT_MYSQL_DB_HOST'] : 'localhost';
$db_port = (isset($_ENV['OPENSHIFT_MYSQL_DB_PORT'])) ? $_ENV['OPENSHIFT_MYSQL_DB_PORT'] : '3306';
$db_username = (isset($_ENV['OPENSHIFT_MYSQL_DB_USERNAME'])) ? $_ENV['OPENSHIFT_MYSQL_DB_USERNAME'] : 'asg2';
$db_password = (isset($_ENV['OPENSHIFT_MYSQL_DB_PASSWORD'])) ? $_ENV['OPENSHIFT_MYSQL_DB_PASSWORD'] : 'asg2';

?>