var global_markets = false;
var global_addresses = false;
var current_file = false;
var current_results = false;

var bs_uploads = 
{
    checks: function(timeout)
    {
        if(typeof timeout == 'undefined')
        {
            timeout = 30000;
        }
        setTimeout(function () 
        {
            if($('.check-if-paid').length > 0)
            {
                $('.check-if-paid').each(function(i)
                {
                    var $this = this;
                    var bs = $.fn.blockstrap;
                    var $select = $('#initial-blockchain-selection');
                    var address = $(this).val();
                    var key = $($this).parent().find('input[name="key"]').val();
                    var chain = $($select).val();
                    var hash = $($select).attr('data-hash');
                    var salt = $($select).attr('data-salt');
                    var amount_per_year = 0;
                    
                    if($(this).attr('data-cost')) 
                    {
                        amount_per_year = parseFloat($(this).attr('data-cost')) * 100000000;
                    }
                    
                    var return_address = global_addresses[chain];
                    var pw = $('#optional-password').val();
                    var password = false;
                    
                    if(pw)
                    {
                        password = bitcoin.crypto.sha256(salt+pw).toString('hex').substr(0, 20);
                    }

                    var fee = $.fn.blockstrap.settings.blockchains[chain].fee * 100000000;
                    var op_limit = $.fn.blockstrap.settings.blockchains[chain].op_limit - 1;
                    var json_value = '{"p":"'+password+'","h":"'+hash+'","y":1}';
                    
                    if(chain == 'btc')
                    {
                        json_value = '{"h":"'+hash+'"}';
                    }
                    
                    var json_length = json_value.length;

                    if(json_length > op_limit)
                    {
                        bs_uploads.modal('Error', 'Blockchain cannot support that much information', 'modal-status');
                    }
                    else
                    {
                        var total = 0;
                        var inputs = [];
                        var data = json_value;

                        $.fn.blockstrap.api.unspents(address, chain, function(unspents)
                        {
                            if($.isArray(unspents) && blockstrap_functions.array_length(unspents) > 0)
                            {
                                $.each(unspents, function(k, unspent)
                                {
                                    inputs.push({
                                        txid: unspent.txid,
                                        n: unspent.index,
                                        script: unspent.script,
                                        value: unspent.value,
                                    });
                                    total = total + unspent.value
                                });

                                var outputs = [{
                                    address: return_address,
                                    value: total - fee
                                }];
                                
                                var save_file = false;
                                var amount_to_send_back = total - fee;
                                if(
                                    amount_to_send_back > fee 
                                    && amount_to_send_back >= amount_per_year - fee
                                ){
                                    save_file = true;
                                    if(
                                        typeof data == 'string'
                                        && data.indexOf('"y":1') > -1
                                    ){
                                        var years = parseInt((amount_to_send_back + fee) / amount_per_year);
                                        data = data.replace('"y":1', '"y":'+years);
                                    }
                                }

                                var raw = $.fn.blockstrap.blockchains.raw(
                                    return_address, 
                                    key, 
                                    inputs, 
                                    outputs, 
                                    fee, 
                                    amount_to_send_back, 
                                    data
                                );

                                $.fn.blockstrap.api.relay(raw, chain, function(obj)
                                {
                                    if(typeof obj.txid != 'undefined' && obj.txid)
                                    {
                                        if(save_file)
                                        {
                                            current_results.txid = obj.txid;
                                            current_results.chain = chain;
                                            current_results.save = save_file;
                                            $.ajax({
                                                url: 'php/upload.php',
                                                data: current_results,
                                                dataType: 'json',
                                                method: 'post',
                                                success: function(results)
                                                {
                                                    if(
                                                        typeof results.success != 'undefined'
                                                        && typeof results.url != 'undefined'
                                                        && results.success === true
                                                        && results.url
                                                    ){
                                                        bs_uploads.details(obj.txid, save_file, results.url);
                                                    }
                                                    else
                                                    {
                                                        bs_uploads.details(obj.txid, save_file);
                                                    }
                                                }
                                            });
                                        }
                                        else
                                        {
                                            bs_uploads.details(obj.txid, save_file);
                                        }
                                    }
                                    else
                                    {
                                        bs_uploads.checks();
                                    }
                                });
                            }
                            else
                            {
                                bs_uploads.checks();
                            }
                        });
                    }
                });
            }
            else
            {
                bs_uploads.checks();
            }
        }, timeout);
    },
    details: function(txid, save_file, file_url)
    {
        var title = 'Success';
        var content = '<p>You have successfully uploaded a record of this file to the blockchain.</p><p>The transaction ID is:</p><p><strong>'+txid+'</strong></p><p>A record of this can be found within the <a href="http://api.blockstrap.com/v0/doget/transaction/id/'+txid+'?showtxnio=1&prettyprint=1">blockchain</a>. The <code>script_pub_key</code> from the last output in this transaction should contain an encoded hash of the file you just uploaded.</p><p><strong>PLEASE KEEP A COPY OF THE TRANSACTION ID ABOVE</strong></p><p>Without the transaction ID, you will not be able to access the file later.</p>';
        if(save_file && file_url)
        {
            content+= '<p>Your file is stored at the following URL:</p>'
            content+= '<pre><code><a href="'+file_url+'">'+file_url+'</a></code></pre>';
        }
        else if(save_file)
        {
            content+= '<p><strong>Error uploading file to Amazon S3</strong></p>'
        }
        bs_uploads.modal(title, content, 'modal-status');
    },
    forms: function()
    {
        bs_uploads.form_chain();
        bs_uploads.form_check();
    },
    form_chain()
    {
        $('body').on('change', '#initial-blockchain-selection', function(e)
        {
            e.preventDefault();
            var $this = this;
            var bs = $.fn.blockstrap;
            var chain = $($this).val();
            var chain_name = bs.settings.blockchains[chain].blockchain;
            var hash = $($this).attr('data-hash');
            var salt = $($this).attr('data-salt');
            var bytes = $($this).attr('data-bytes');
            var key_hash = bitcoin.crypto.sha256(salt+hash).toString('hex');
            var keys = bs.blockchains.keys(key_hash, chain);
            var address = keys.pub;
            var key = keys.priv;
            var mining_fee = bs.settings.blockchains[chain].fee;
            var hash_cost = (((mining_fee * 100000000) * 2) / 100000000).toFixed(8);
            var kb = (bytes * 100000000) / 1000;
            var usd_cost = kb / 100;
            $($this).addClass('loading');
            if(!global_markets)
            {
                bs.api.market('multi', '', function(results)
                {
                    $($this).removeClass('loading');
                    if(typeof results.data != 'undefined')
                    {
                        global_markets = results.data.markets;
                        var usd_for_chain = global_markets[chain].fiat_usd_now;
                        if(usd_for_chain)
                        {
                            var the_cost = ((usd_cost / usd_for_chain) / 100000000).toFixed(8);
                            var annual_cost = the_cost + ' ' + chain_name;
                            bs_uploads.generate(address, key, hash_cost + ' ' + chain_name, annual_cost, the_cost);
                        }
                        else
                        {
                            bs_uploads.generate(address, key, hash_cost + ' ' + chain_name, false);
                        }
                    }
                    else
                    {

                    }
                }, 'blockstrap', true);
            }
            else
            {
                $($this).removeClass('loading');
                var usd_for_chain = global_markets[chain].fiat_usd_now;
                if(usd_for_chain)
                {
                    var the_cost = ((usd_cost / usd_for_chain) / 100000000).toFixed(8);
                    var annual_cost = the_cost + ' ' + chain_name;
                    bs_uploads.generate(address, key, hash_cost + ' ' + chain_name, annual_cost, the_cost);
                }
                else
                {
                    bs_uploads.generate(address, key, hash_cost + ' ' + chain_name, false);
                }
            }
        });
    },
    form_check: function()
    {
        $('body').on('submit','#verify-from-blockchain', function(e)
        {
            e.preventDefault();
            var form = this;
            var bs = $.fn.blockstrap;
            var button = $(form).find('button[type="submit"]');
            var txid = $(form).find('input[name="txid"]').val();
            var chain = $(form).find('select[name="chain"]').val();
            var typed_pw = $(form).find('input[name="pw"]').val();
            var salt = $(form).find('input[name="salt"]').val();
            $(button).addClass('loading');
            bs.api.transaction(txid+'?showtxnio=1', chain, function(results)
            {
                $(button).removeClass('loading');
                if(typeof results.outputs != 'undefined' && typeof results.outputs[1] != 'undefined')
                {
                    var output = results.outputs[1].script_pub_key;
                    var date = new Date(results.time * 1000).toDateString();
                    var msg = bs.blockchains.decode(output);
                    var obj = $.parseJSON(msg);
                    var pw = obj.p;
                    var hash = obj.h;
                    var years_to_live = obj.y;
                    if(pw == 'false') pw = false;
                    var encoded_password = 'N/A';
                    if(salt && typed_pw)
                    {
                        encoded_password = bitcoin.crypto.sha256(salt+typed_pw).toString('hex').substr(0, 20);
                    }
                    if((pw || typed_pw) && pw == encoded_password)
                    {
                        if(hash == $(form).attr('data-hash'))
                        {
                            var intro = '<p>You can indeed prove ownership!</p><p>Originally uploaded on <strong>'+date+'</strong></p>';
                            bs_uploads.modal('Congratulations', intro, 'modal-verify');
                        }
                        else
                        {
                            bs_uploads.modal('Warning', 'You cannot prove ownership!', 'modal-verify');
                        }
                    }
                    else
                    {
                        if(hash == $(form).attr('data-hash') && !pw)
                        {
                            var intro = '<p>You can indeed prove ownership!</p><p>Originally uploaded on <strong>'+date+'</strong></p><p>(without password protection / confirmation)</p>';
                            bs_uploads.modal('Congratulations', intro, 'modal-verify');
                        }
                        else
                        {
                            bs_uploads.modal('Warning', 'You cannot prove ownership!', 'modal-verify');
                        }
                    }
                }
                else
                {
                    bs_uploads.modal('Warning', 'You cannot prove ownership!', 'modal-verify');
                }
            }, 'blockstrap', true);
        });
    },
    generate: function(address, key, hash_cost, annual_cost, the_cost)
    {
        $('#save-to-blockchain').find('input[name="address"]').val(address);
        $('#save-to-blockchain').find('input[name="key"]').val(key);
        $('#save-to-blockchain').find('.hash-cost').text(hash_cost);
        if(annual_cost)
        {
            $('#save-to-blockchain').find('.long-life').show(0);
            $('#save-to-blockchain').find('.annual-cost').text(annual_cost);
            $('#save-to-blockchain').find('.check-if-paid').attr('data-cost', the_cost);
        }
        else
        {
            $('#save-to-blockchain').find('.long-life').hide(0);
            $('#save-to-blockchain').find('.check-if-paid').attr('data-cost', 0);
        }
        $('#save-to-blockchain').find('#hidden-section').show(350);
        bs_uploads.checks(1);
    },
    init: function()
    {
        bs_uploads.forms();
        bs_uploads.zones();
    },
    modal: function(title, content, id)
    {
        if(typeof id == 'undefined') id = 'default-modal';
        $('.modal').each(function(i)
        {
            $(this).modal('hide');
        });
        $('#'+id).find('.modal-title').text(title);
        if($('#'+id).find('#modal-content').length > 0)
        {
            $('#'+id).find('#modal-content').html(content);
        }
        else
        {
            $('#'+id).find('.modal-body').html(content);
        }
        $('#'+id).modal('show');
    },
    zones: function()
    {
        $('.bs-dropzone').each(function(i)
        {
            var zone = this;
            var url = '';
            var clickable = false;
            var previews = '';
            var max = 0;
            var id = $(zone).attr('id');
            if($(zone).attr('data-url')) url = $(zone).attr('data-url');
            if($(zone).attr('data-clickable')) clickable = $(zone).attr('data-clickable');
            if($(zone).attr('data-previews')) previews = $(zone).attr('data-previews');
            if($(zone).attr('data-max')) max = $(zone).attr('data-max');
            if(typeof clickcable != 'undefined' && (clickabke === 'true' || clickable === true)) clickable = true;
            else clickable = false;
            if(id != 'bs-uploads') previews = false;
            var drop = $(zone).dropzone({
                url: url,
                clickable: clickable,
                previewsContainer: previews,
                maxFilesize: max,
                uploadMultiple: false,
                thumbnailWidth: null,
                thumbnailHeight: null,
                success: function(file, results)
                {
                    var obj = $.parseJSON(results);
                    current_file = file;
                    current_results = obj;
                    $('#'+id).removeClass('loading');
                    if(id == 'bs-uploads')
                    {
                        var bytes = file.upload.total;
                        var name = obj.n;
                        var hash = obj.h;
                        var salt = obj.s;
                        var content = '<p>You are trying to store a hash of the following file on the blockchain:</p>';
                        var form = '<form id="save-to-blockchain">';
                            form+= '<p>The hash you are trying to store is <strong>'+hash+'</strong></p>';
                            form+= '<p>In order to store it on a blockchain, you first need to choose which chain:</p>';
                            form+= '<p><select id="initial-blockchain-selection" name="chain" class="form-control" data-hash="'+hash+'" data-salt="'+salt+'" data-bytes="'+bytes+'">';
                                form+= '<option value="">Select Preferred Chain</option>';
                                form+= '<option value="btc">Bitcoin (can upload to S3 for extra)</option>';
                                form+= '<option value="dash">DashPay (can upload to S3 for extra)</option>';
                                form+= '<option value="doge">Dogecoin (can upload to S3 for extra)</option>';
                                form+= '<option value="ltc">Litecoin (can upload to S3 for extra)</option>';
                                form+= '<option value="">-- Testnets --</option>';
                                form+= '<option value="btct">Bitcoin Test (hash-only, no uploads)</option>';
                                form+= '<option value="dasht">DashPay Test (hash-only, no uploads)</option>';
                                form+= '<option value="doget">Dogecoin Test (hash-only, no uploads)</option>';
                                form+= '<option value="ltct">Litecoin Test (hash-only, no uploads)</option>';
                            form+= '</select></p>';
                            form+= '<div id="hidden-section" style="display: none;">';
                                form+= '<hr><p>In order to encode this hash onto the blockchain, you will need to send <span class="hash-cost"></span> to the address listed below and then wait for confirmation.</p><p class="long-life">If you would like the file to be stored on Amazon S3 it will cost <span class="annual-cost"></span> to store the file for one year. You may pay multiples of the annual cost for it to be stored multiple years. The price is calculated at US$0.01 per KB per annum.</p><hr>';
                                form+= '<input type="text" readonly="readonly" class="form-control check-if-paid" name="address" style="text-align: center; color: firebrick;" />';
                                form+= '<hr><input type="password" class="form-control" name="pw" placeholder="optional password to add extra protection" id="optional-password" autocomplete="off" />';
                                form+= '<input type="hidden" name="key" />';
                            form+= '</div>';
                        form+= '</form>';
                        global_addresses = obj.addresses;
                        bs_uploads.modal('Results', content);
                        $('#save-to-blockchain').remove();
                        $('#dropzone-preview').after(form);
                    }
                    else if(id == 'bs-verify')
                    {
                        var name = obj.n;
                        var hash = obj.h;
                        var salt = obj.s;
                        var form = '<form id="verify-from-blockchain" data-name="'+name+'" data-hash="'+hash+'" data-salt="'+salt+'">';
                            form+= '<input type="text" name="txid" class="form-control" placeholder="Transaction ID" autocomplete="off" /><hr>';
                            form+= '<input type="password" name="pw" class="form-control" placeholder="Optional Password" autocomplete="off" />';
                            form+= '<input type="hidden" name="salt" value="'+salt+'" />';
                            form+= '<hr>';
                            form+= '<div class="row">';
                                form+= '<div class="col-sm-6">';
                                    form+= '<select name="chain" class="form-control">';
                                        form+= '<option value="">Select Blockchain</option>';
                                        form+= '<option value="btc">Bitcoin</option>';
                                        form+= '<option value="dash">DashPay</option>';
                                        form+= '<option value="doge">Dogecoin</option>';
                                        form+= '<option value="ltc">Litecoin';
                                        form+= '<option value="btct">Bitcoin Testnet</option>';
                                        form+= '<option value="dasht">DashPay Testnet</option>';
                                        form+= '<option value="doget">Dogecoin Testnet</option>';
                                        form+= '<option value="ltct">Litecoin Testnet</option>';
                                    form+= '</select>';
                                form+= '</div>';
                                form+= '<div class="col-sm-6">';
                                    form+= '<button type="submit" class="btn btn-success btn-block">';
                                        form+= 'Verify Ownership';
                                    form+= '</button>';
                                form+= '</div>';
                            form+= '<d/iv>';
                        form+= '</form>';
                        bs_uploads.modal('Verification', form, 'modal-status');
                    }
                    else
                    {
                        bs_uploadse.modal('Error', 'Unsupported ID', 'modal-status');
                    }
                },
                init: function()
                {
                    var $this = this;
                    $this.on('drop', function(file)
                    {
                        $('#'+id).addClass('loading');
                    });
                    $this.on('sending', function(file)
                    {
                        $('#'+id).addClass('loading');
                        $this.removeAllFiles();
                    });
                }
            });
        });
    }
};

$(document).ready(function()
{
    bs_uploads.init();
});

