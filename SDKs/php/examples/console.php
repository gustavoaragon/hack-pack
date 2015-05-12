<link rel="stylesheet" href="examples/assets/css/bootstrap.css" type="text/css" media="screen" />
<link rel="stylesheet" href="examples/assets/css/console.css" type="text/css" media="screen" />

<a href="http://blockstrap.com" class="logo">Blockstrap</a>
<h6 style="text-align: center;">BLOCKSTRAP PHP SDK</h6>

<p class="clearfix">&nbsp;</p>
<hr>

<h1>API Console</h1>

<form class="api-examples">  
    <div class="col-sm-4">
        <select name="function" autocomplete="off" class="form-control">
            <option value="address" <?php if($function == 'address'){ ?>selected="selected"<?php } ?>>
                Get Address from Public Key :: $api->address()
            </option>
            <option value="block" <?php if($function == 'block'){ ?>selected="selected"<?php } ?>>
                Get Block from Block ID :: $api->block()
            </option>
            <option value="blocks" <?php if($function == 'blocks'){ ?>selected="selected"<?php } ?>>
                Get Latest Blocks :: $api->blocks()
            </option>
            <option value="decode" <?php if($function == 'decode'){ ?>selected="selected"<?php } ?>>
                Decode Raw Transaction :: $api->decode()
            </option>
            <option value="dnkey" <?php if($function == 'dnkey'){ ?>selected="selected"<?php } ?>>
                DNKey Lookup :: $api->dnkey()
            </option>
            <option value="height" <?php if($function == 'height'){ ?>selected="selected"<?php } ?>>
                Get Block from Height :: $api->height()
            </option>
            <option value="market" <?php if($function == 'market'){ ?>selected="selected"<?php } ?>>
                Get Market Conditions :: $api->market()
            </option>
            <option value="relay" <?php if($function == 'relay'){ ?>selected="selected"<?php } ?>>
                Relay Raw Transaction :: $api->relay()
            </option>
            <option value="transaction" <?php if($function == 'transaction'){ ?>selected="selected"<?php } ?>>
                Get Transaction from TXID :: $api->transaction()
            </option>
        </select>
    </div>
    <div class="col-sm-2">
        <select name="chain" class="form-control">
            <option value="btc" <?php if($chain == 'btc'){ ?>selected="selected"<?php } ?>>
                Bitcoin :: btc
            </option>
            <option value="dash" <?php if($chain == 'dash'){ ?>selected="selected"<?php } ?>>
                Dash :: dash
            </option>
            <option value="doge" <?php if($chain == 'doge'){ ?>selected="selected"<?php } ?>>
                Dogecoin :: doge
            </option>
            <option value="ltc" <?php if($chain == 'ltc'){ ?>selected="selected"<?php } ?>>
                Litecoin :: ltc
            </option>
            <option value="btct" <?php if($chain == 'btct'){ ?>selected="selected"<?php } ?>>
                Bitcoin Testnet :: btct
            </option>
            <option value="dasht" <?php if($chain == 'dasht'){ ?>selected="selected"<?php } ?>>
                Dash Testnet :: dasht
            </option>
            <option value="doget" <?php if($chain == 'doget'){ ?>selected="selected"<?php } ?>>
                Dogecoin Testnet :: doget
            </option>
            <option value="ltct" <?php if($chain == 'ltct'){ ?>selected="selected"<?php } ?>>
                Litecoin Testnet :: ltct
            </option>
            <option value="multi" <?php if($chain == 'multi'){ ?>selected="selected"<?php } ?>>
                Multiple Chains :: multi
            </option>
        </select>
    </div>
    <div class="col-sm-4">
        <input 
            id="id" 
            name="id" 
            class="form-control"
            placeholder="Query ID? Such as Address, Block Height, etc" 
            value="<?php echo $id; ?>" 
        />
    </div>
    <div class="col-sm-2">
        <input type="submit" value="Request" class="btn btn-success btn-block" />
    </div>
</form>