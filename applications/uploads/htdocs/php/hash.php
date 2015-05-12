<?php

include_once(dirname(__FILE__).'/S3.php');

function debug($obj)
{
    echo '<pre>';
    print_r($obj);
    echo '</pre>';
}

$ini = parse_ini_file(dirname(dirname(dirname(__FILE__))).'/config.ini', true);
$aws = $ini['aws'];
$salts = $ini['salts'];
$addresses = $ini['addresses'];

$file = false;
$files = false;
if(isset($_FILES))
{
    $files = $_FILES;
}

$results = Array(
    'n' => false,
    's' => false,
    'h' => false,
    'file' => false,
    'addresses' => $addresses
);

$bucket_name = $aws['bucket'];
$s3 = new S3($aws['key'], $aws['secret']);

if(isset($files['file'])) 
{
    $file = $files['file'];
    $name = $file['name'];
    $type = $file['type'];
    $name_array = explode('.', $name);
    $file_extension = array_pop($name_array);
    $file_hash = substr(hash('sha256', $salts['file_hash'].file_get_contents($file['tmp_name'])), 0, 32);
    $saved = false;
    
    $year = date('y');
    $month = date('m');
    $day = date('d');
    
    if($s3->putObjectFile(
        $file['tmp_name'], 
        $bucket_name, 'temp/'.$year.'/'.$month.'/'.$file_hash.'.'.$file_extension, 
        S3::ACL_PUBLIC_READ
    )){
        $saved = true;
    }
    
    $results = Array(
        'n' => $name,
        's' => hash('sha256', $salts['file_hash'].$file_hash),
        'h' => $file_hash,
        'amazon' => $saved,
        'type' => $type,
        'extension' => $file_extension,
        'addresses' => $addresses
    );
}

echo json_encode($results); exit;