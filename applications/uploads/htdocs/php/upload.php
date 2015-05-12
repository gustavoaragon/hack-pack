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
$urls = $ini['urls'];
$salts = $ini['salts'];
$addresses = $ini['addresses'];

$hash = false;
$type = false;
$txid = false;
$chain = false;
$save_file = false;
$file_extension = false;
$bucket_name = 'bsuploads';

if(isset($_POST) && isset($_POST['h'])) $hash = $_POST['h'];
if(isset($_POST) && isset($_POST['txid'])) $txid = $_POST['txid'];
if(isset($_POST) && isset($_POST['chain'])) $chain = $_POST['chain'];
if(isset($_POST) && isset($_POST['save'])) $save = $_POST['save'];
if(isset($_POST) && isset($_POST['type'])) $type = $_POST['type'];
if(isset($_POST) && isset($_POST['extension'])) $file_extension = $_POST['extension'];

$bucket_name = $aws['bucket'];
$s3 = new S3($aws['key'], $aws['secret']);

$results = Array(
    'success' => false,
    'url' => 'http://blockstrap.com',
    'msg' => 'Unable to copy or delete file'
);

$year = date('y');
$month = date('m');
$day = date('d');

$original_location = 'temp/'.$year.'/'.$month.'/'.$hash.'.'.$file_extension;
$new_location = 'paid/'.$year.'/'.$month.'/'.$day.'/'.$txid.'.'.$file_extension;
$vars = '?txid='.$txid.'&extension='.$file_extension.'&type='.$type.'&chain='.$chain;

if($save === true || $save === 'true')
{
    if($s3->copyObject(
        $bucket_name, 
        $original_location, 
        $bucket_name, 
        $new_location
    )){
        if($s3->deleteObject(
            $bucket_name, 
            $original_location
        )){
            $results['success'] = true;
            $results['url'] = $urls['image'].$vars;
            $results['msg'] = 'Copied and deleted file';
        }
        else
        {
            $results['msg'] = 'Unable to delete original file';
        }
    }
}
else
{
    if($s3->deleteObject(
        $bucket_name, 
        $original_location
    )){
        $results['success'] = true;
        $results['url'] = false;
        $results['msg'] = 'Deleted file';
    }
    else
    {
        $results['msg'] = 'Unable to delete file';
    }
}
echo json_encode($results);
exit;