<?php

$auth = new bs_blockauth();
$uid = $auth->get_var('uid', false);
$pwid = $auth->get_var('pwid', false);
$form = $auth->get_var('form', false);
$chain = $auth->get_var('chain', false);
$dnkey = $auth->get_var('dnkey', false);
$password = $auth->get_var('password', false);
$login = $auth->login(array(
    'uid' => $uid,
    'pwid' => $pwid,
    'chain' => $chain,
    'dnkey' => $dnkey,
    'password' => $password
));

?>

<p class="clearfix">&nbsp;</p>
<hr>

<h1>BlockAuth Login (with DNKeys)</h1>

<?php

if($login && $form == 'with')
{
    echo '<span class="alert alert-success">SUCCESSFULLY LOGGED-IN<br />Welcome back <strong>'.$login.'</strong></span>';
}
elseif($form == 'with')
{
    echo '<span class="alert alert-danger">IN-CORRECT LOGIN CREDENTIALS</span>';
}

?>

<form class="blockauth-login" method="post" action="">  
    <div class="col-sm-5">
        <input 
            type="text" 
            name="dnkey" 
            placeholder="Enter Your DNKey-Based Username" 
            autocomplete="off" 
            class="form-control" 
        />
    </div>
    <div class="col-sm-5">
        <input 
            type="password" 
            name="password" 
            placeholder="Enter Your Password" 
            autocomplete="off" 
            class="form-control"
        />
    </div>
    <div class="col-sm-2">
        <input type="hidden" name="form" value="with" />
        <button type="submit" class="btn btn-success btn-block">Submit</button>
    </div>
</form>

<p class="clearfix">&nbsp;</p>
<hr>

<h1>BlockAuth Login (without DNKeys)</h1>

<?php

if($login && $form == 'without')
{
    echo '<span class="alert alert-success">SUCCESSFULLY LOGGED-IN<br />Welcome back <strong>'.$login.'</strong></span>';
}
elseif($form == 'without')
{
    echo '<span class="alert alert-danger">IN-CORRECT LOGIN CREDENTIALS</span>';
}

?>

<form class="blockauth-login" method="post" action="">  
    <div class="col-sm-6">
        <input 
            type="text" 
            name="uid" 
            placeholder="Enter Your UID" 
            autocomplete="off" 
            class="form-control" 
        />
    </div>
    <div class="col-sm-6">
        <input 
            type="text" 
            name="pwid" 
            placeholder="Enter Your PWID" 
            autocomplete="off" 
            class="form-control" 
        />
    </div>
    <div class="col-sm-5">
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
        </select>
    </div>
    <div class="col-sm-5">
        <input 
            type="password" 
            name="password" 
            placeholder="Enter Your Password" 
            autocomplete="off" 
            class="form-control"
        />
    </div>
    <div class="col-sm-2">
        <input type="hidden" name="form" value="without" />
        <button type="submit" class="btn btn-success btn-block">Submit</button>
    </div>
</form>

<p class="clearfix">&nbsp;</p>
<hr>