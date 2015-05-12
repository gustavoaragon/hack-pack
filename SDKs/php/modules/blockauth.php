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

class bs_blockauth extends blockstrap
{   
    private function hex2str($hex){
        $string='';
        for ($i=0; $i < strlen($hex)-1; $i+=2){
            $string .= chr(hexdec($hex[$i].$hex[$i+1]));
        }
        return $string;
    }
    
    function __construct($settings = array())
    {
        
    }
    
    public function check($txid, $uid, $blockchain, $pw)
    {
        if(class_exists('bs_api') && $blockchain && $pw)
        {
            $api = new bs_api();
            $tx = $api->transaction(array(
                'chain' => $blockchain,
                'id' => $txid
            ));
            if(isset($tx['outputs']) && is_array($tx['outputs']) && count($tx['outputs']) > 0)
            {
                foreach($tx['outputs'] as $out_key => $output)
                {
                    if($output['script_pub_key'] && !$output['pubkey_hash'])
                    {
                        $msg = $this->hex2str($output['script_pub_key']);
                        if($msg[3] == '{')
                        {
                            $msg = json_decode(substr($msg, 3, strlen($msg)), true);
                        }
                        if(isset($msg['n']) && isset($msg['pw']))
                        {
                            $password = hash('sha256', $uid.hash('sha256', $pw));
                            if($msg['pw'] == substr($password, 0, strlen($msg['pw'])))
                            {
                                return $msg['n'];
                            }
                        }
                    }
                }
            }
        }
        return false;
    }
    
    public function login($options = array())
    {
        $defaults = array(
            'dnkey' => false,
            'uid' => false,
            'pwid' => false,
            'chain' => false,
            'password' => false
        );
        $settings = array_merge($defaults, $options);
        if(class_exists('bs_dnkey') && $settings['dnkey'])
        {
            $dnkey = new bs_dnkey();
            $results = $dnkey->get(array(
                'type' => 'blockauth',
                'host' => $settings['dnkey']
            ));
            if(isset($results['success']) && $results['success'])
            {
                $auth = $results['data']['dnkeys']['blockauth'];
                if(is_array($auth))
                {
                    foreach($auth as $blockchain => $keys)
                    {
                        foreach($keys as $key => $obj)
                        {
                            if(isset($obj['uid']) && isset($obj['pwid']))
                            {
                                return $this->check($obj['pwid'], $obj['uid'], $blockchain, $settings['password']);
                            }
                        }
                    }
                }
            }
        }
        else
        {
            return $this->check($settings['pwid'], $settings['uid'], $settings['chain'], $settings['password']);
        }
    }
}