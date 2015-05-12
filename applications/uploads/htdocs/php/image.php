<?php

include_once(dirname(__FILE__).'/S3.php');
include_once(dirname(__FILE__).'/blockstrap.php');
include_once(dirname(__FILE__).'/api.php');
include_once(dirname(__FILE__).'/cache.php');

function debug($obj)
{
    echo '<pre>';
    print_r($obj);
    echo '</pre>';
}

function hex2str($hex) 
{
    $str = '';
    for($i=0;$i<strlen($hex);$i+=2)
    {
        $str.= chr(hexdec(substr($hex,$i,2)));
    }
    return $str;
}

$ini = parse_ini_file(dirname(dirname(dirname(__FILE__))).'/config.ini', true);
$salts = $ini['salts'];
$aws = $ini['aws'];

$txid = false;
$type = false;
$chain = false;
$file_extension = false;
$password = false;
$bucket_name = 'bsuploads';

if(isset($_GET) && isset($_GET['txid'])) $txid = $_GET['txid'];
if(isset($_GET) && isset($_GET['chain'])) $chain = $_GET['chain'];
if(isset($_GET) && isset($_GET['type'])) $type = $_GET['type'];
if(isset($_GET) && isset($_GET['extension'])) $file_extension = $_GET['extension'];

if(isset($_POST) && isset($_POST['password'])) $password = $_POST['password'];
$typed_pw = $password;

$results = Array(
    'success' => false,
    'url' => 'http://blockstrap.com',
    'msg' => 'Unable to copy or delete file'
);

$api = new bs_api();
$tx = $api->transaction(array(
    'chain' => $chain,
    'id' => $txid
));

if(
    isset($tx['time'])
    && isset($tx['outputs'])
    && isset($tx['outputs'][1])
    && isset($tx['outputs'][1]['script_pub_key'])
){
    $pub_key = hex2str($tx['outputs'][1]['script_pub_key']);
    
    // TODO - WHY IS THIS FLAKEY...?
    $key_array = explode('jI', $pub_key);
    if(!isset($key_array[1])) $key_array = explode('j:', $pub_key);
    if(strpos($pub_key, '{') == 2)
    {
        $msg = json_decode(substr($pub_key, 2), true);
    }
    else
    {
        $msg = json_decode($key_array[1], true);
    }
    
    $pw = 'false';
    if(isset($msg['p'])) $pw = $msg['p'];
    $hash = $msg['h'];
    $salt = hash('sha256', $salts['file_hash'].$hash);
    $password = substr(hash('sha256', $salt.$password), 0, 20);
    if($pw === 'false' || $pw != 'false' && $pw == $password)
    {
        $years_to_live = 1;
        if(isset($msg['y'])) $year_to_live = $msg['y'];

        $bucket_name = $aws['bucket'];
        $s3 = new S3($aws['key'], $aws['secret']);

        $year = date('y', $tx['time']);
        $month = date('m', $tx['time']);
        $day = date('d', $tx['time']);

        $location = 'paid/'.$year.'/'.$month.'/'.$day.'/'.$txid.'.'.$file_extension;
        $obj = $s3->getObject($bucket_name, $location);

        header('Content-Type: '.$type);
        echo $obj->body;
    }
    else
    {
        echo '<form action="" method="post">';
            if($typed_pw)
            {
                echo '<p><strong>Wrong Password!</strong> Please try again...</p>';   
            }
            echo '<input name="password" type="password" autocomplete="off" placeholder="enter password" />';
            echo '<input type="submit" value="submit" />';
        echo '</form>';
    }
}
else
{
    header("HTTP/1.0 404 Not Found");
    echo '404';
}
exit;
