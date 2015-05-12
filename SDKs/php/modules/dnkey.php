<?php

/*
 * 
 *  Blockstrap PHP SDK v1
 *  http://blockstrap.com
 *
 *  Designed, Developed and Maintained by Neuroware.io Inc
 *  All Work Released Under MIT License
 *  
 */

class bs_dnkey extends blockstrap
{   
    // INITIATE API CLASS
    function __construct($settings = array())
    {
        
    }
    
    public function api($options = array())
    {
        if(isset($options['chain']) && isset($options['id']))
        {
            $settings = array(
                'type' => $options['chain'],
                'host' => $options['id']
            );
            return $this->get($settings);
        }
        else
        {
            return false;
        }
    }
    
    public function get($options = array())
    {
        $defaults = array(
            'key' => 'dnkey',
            'keys' => 'dnkeys',
            'type' => 'btc',
            'host' => false
        );
        $settings = array_merge($defaults, $options);
        $query = $settings['key'].'-'.$settings['type'].'=';
        $raw = dns_get_record($settings['host'], DNS_TXT);
        $results = array(
            'success' => false
        );
        
        //$this->debug($raw);
        $raw_results = array();
        
        if(is_array($raw))
        {
            foreach($raw as $entry_key => $entry)
            {
                if(
                    isset($entry['entries']) 
                    && substr($entry['entries'][0], 0, strlen($settings['key'])) === $settings['key']
                ){
                    $key_array = explode('-', $entry['entries'][0]);
                    if(
                        isset($key_array[1]) 
                        && $key_array[1] == 'blockauth' 
                        && isset($key_array[2])
                        && (
                            $settings['type'] == 'multi'
                            || $settings['type'] == 'blockauth'
                            || !$settings['type']
                        )
                    ){
                        $auth_array = explode('=', $key_array[2]);
                        if(isset($auth_array[1]))
                        {
                            $auth_results_array = explode('_', $auth_array[1]);
                            if(isset($auth_results_array[1]))
                            {
                                if(!isset($raw_results[$key_array[1]]))
                                {
                                    $raw_results[$key_array[1]] = array();
                                }
                                if(!isset($raw_results[$key_array[1]][$auth_array[0]]))
                                {
                                    $raw_results[$key_array[1]][$auth_array[0]] = array();
                                }
                                $raw_results[$key_array[1]][$auth_array[0]][] = array(
                                    'uid' => $auth_results_array[0],
                                    'pwid' => $auth_results_array[1]
                                );
                                $results['success'] = true;
                            }
                        }
                    }
                    elseif(isset($key_array[1]))
                    {
                        $result_array = explode('=', $key_array[1]);
                        if(
                            isset($result_array[1])
                            && (
                                $result_array[0] == $settings['type']
                                || (
                                    $settings['type'] == 'multi'
                                    || !$settings['type']
                                )
                            )
                            
                        ){
                            if(!isset($raw_results[$result_array[0]]))
                            {
                                $raw_results[$result_array[0]] = array();
                            }
                            $raw_results[$result_array[0]][] = $result_array[1];
                            $results['success'] = true;
                        }
                    }
                }
            }
            if(count($raw_results) > 0)
            {
                $results['data'] = array(
                    $settings['keys'] => $raw_results
                );
            }
        }
        return $results;
    }
}