<?php

/*
 * 
 *  Blockstrap PHP SDK v1
 *  http://blockstrap.com
 *
 *  Designed, Developed and Maintained by Neuroware.io Inc
 *  All Work Released Under MIT License
 *
 *  -- Inclusion of core is required "blockstrap/blockstrap.php"
 *  -- Other modules extend the blockstrap class
 *  -- The API module requires the cache module
 *  
 */

// INCLUDE CORE CLASS
include_once(dirname(__FILE__).'/modules/blockstrap.php');

// INCLUDE ADDITIONAL COMPONENTS
include_once(dirname(__FILE__).'/modules/api.php');
include_once(dirname(__FILE__).'/modules/cache.php');
include_once(dirname(__FILE__).'/modules/dnkey.php');
include_once(dirname(__FILE__).'/modules/blockauth.php');

// INITIATE API
$api = new bs_api();

// SET DEFAULTS
$function = $api->get_var('function', 'address');
$chain = $api->get_var('chain', 'btc');
$id = $api->get_var('id', false);
$sample = '1JsoyFgFugGRRY7qkPGTHaKVQpeqf67VVb';
$link = '<a href="?function=address&chain=btc&id='.$sample.'">'.$sample.'</a>';
$results = 'Waiting for Query ID. Try making an API call to the following Bitcoin address '.$link.'.';

// DEFAULT EXAMPLE CONTENT AND STYLING
include_once(dirname(__FILE__).'/examples/console.php');

// CHECK FOR AND CALL FUNCTION
if(method_exists($api, $function) && ($function == 'dnkey' || $id))
{
    $results = $api->$function(array(
        'chain' => $chain, // Choose from 8 supported chains
        'id' => $id, // All queries require an ID of some kind
        'debug' => true // This prints the requested URL to page
    ));
}

// DISPLAY RESULTS
$api->debug($results);

// DEFAULT EXAMPLE CONTENT AND STYLING
include_once(dirname(__FILE__).'/examples/blockauth.php');