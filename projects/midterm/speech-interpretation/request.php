<?php
$request_url = "http://text-processing.com/api/sentiment/";

$input = $_GET['text'];

$api_call = curl_init( $request_url );
curl_setopt( $api_call, CURLOPT_POST, 1 );
curl_setopt( $api_call, CURLOPT_POSTFIELDS, "text=" . $input );
curl_setopt( $api_call, CURLOPT_RETURNTRANSFER, true );

$output = curl_exec( $api_call );
curl_close( $api_call );

echo $output;


?>