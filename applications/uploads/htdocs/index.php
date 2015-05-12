<?php

/*

AUTHENTICATING VIA THE BLOCKCHAINS
Using - http://blockstrap.com

*/

error_reporting(-1);
$php_base = dirname(__FILE__);
$template = file_get_contents($php_base.'/html/index.html');
$options = json_decode(file_get_contents($php_base.'/json/index.json'), true);

include_once($php_base.'/php/uploads.php');
include_once($php_base.'/php/mustache.php');

$uploads = new bs_uploads();
$mustache = new MustachePHP();
$html = $mustache->render($template, $options);
    
echo $html;