/*
 * 
 *  Blockstrap v0.5.0.2
 *  http://blockstrap.com
 *
 *  Designed, Developed and Maintained by Neuroware.io Inc
 *  All Work Released Under MIT License
 *  
 */

(function($) 
{
    var filters = {};
    
    filters.accounts = function(blockstrap, data)
    {
        var accounts = [];
        if(localStorage)
        {
            $.each(localStorage, function(key, account)
            {
                if(key.substring(0, 12) === 'nw_accounts_')
                {
                    var this_account = $.parseJSON(account);
                    this_account.balance = parseInt(this_account.balance) / 100000000;
                    accounts.push(this_account);
                }
            });
        }
        return accounts;
    }
    
    filters.avatars = function(blockstrap, data)
    {
        var photo = blockstrap.data.option('your_photo');
        if(!photo && data.default) photo = data.default;
        var image = '<img class="avatar" src="'+photo+'" />';
        return image;
    }
    
    filters.balances = function(blockstrap, data)
    {
        var data = [];
        var balances = blockstrap.accounts.balances();
        if($.isPlainObject(balances))
        {
            $.each(balances, function(k, v)
            {
                data.push({
                    code: k,
                    blockchain: v.name,
                    count: v.count,
                    balance: v.balance
                });
            });
        }
        return data;
    }
    
    filters.bootstrap = function(blockstrap, data)
    {
        var snippet = blockstrap.snippets[data.type];
        var html = Mustache.render(snippet, data);
        return html;
    }
    
    filters.contacts = function(blockstrap, data)
    {
        var contacts = [];
        if(localStorage)
        {
            $.each(localStorage, function(key, contact)
            {
                if(key.substring(0, 12) === 'nw_contacts_')
                {
                    contacts.push($.parseJSON(contact));
                }
            });
        }
        return contacts;
    }
    
    filters.get = function(blockstrap, data)
    {
        if(data.collection && data.key)
        {
            var obj = localStorage.getItem('nw_'+data.collection+'_'+data.key);
            if(blockstrap_functions.json(obj)) return $.parseJSON(obj);
            else return obj;
        }
        else return false;
    }
    
    filters.got = function(blockstrap, data)
    {
        if(data.collection && data.key)
        {
            var obj = localStorage.getItem('nw_'+data.collection+'_'+data.key);
            if(obj) return true;
            else return false;
        }
        else return false;
    }
    
    filters.last = function(blockstrap, data)
    {
        var html = '';
        var type = 'tx';
        var alternative = false;
        if(data.html) html = data.html;
        if(data.type) type = data.type;
        if(data.alternative) alternative = data.alternative;
        if(type == 'tx')
        {
            var latest = 0;
            var accounts = $.fn.blockstrap.accounts.get();
            if($.isArray(accounts) && blockstrap_functions.array_length(accounts) > 0)
            {
                $.each(accounts, function(k, account)
                {
                    if($.isPlainObject(account.txs) && blockstrap_functions.array_length(account.txs) > 0)
                    {
                        $.each(account.txs, function(key, tx)
                        {
                            if(tx.time && tx.time > latest) latest = tx.time;
                        });
                    };
                });
                if(latest > 0)
                {
                    var ago = $.fn.blockstrap.core.ago(latest);
                    var placeholders = ['ago'];
                    var replacements = [ago];
                    return $.fn.blockstrap.templates.filter(html, placeholders, replacements);
                }
                else
                {
                    return alternative;
                }
            }
            else if(alternative)
            {
                return alternative;
            }
        }
        else
        {
            return data;
        }
    }
    
    filters.plugin = function(blockstrap, data)
    {
        if(data.name && data.call && data.data)
        {
            if(blockstrap.plugins[data.name] && $.isFunction(blockstrap.plugins[data.name][data.call]))
            {
                return blockstrap.plugins[data.name][data.call](data.data);
            }
            else return data;
        }
        else return data;
    } 
    
    filters.settings = function(blockstrap, data)
    {
        return blockstrap.settings;
    }
    
    filters.setup = function(blockstrap, data)
    {
        if(data.step)
        {
            var step = parseInt(data.step) - 1;
            return blockstrap.core.filter(blockstrap_setup_steps[step]);
        }
        else return data;
    }
    
    filters.total = function(blockstrap, data)
    {
        var rate = 'usd';
        var prefix = 'US$';
        if(data.rate) rate = data.rate;
        if(data.prefix) prefix = data.prefix;
        return blockstrap.accounts.total(rate, prefix);
    }
    
    filters.txs = function(blockstrap, data)
    {
        var txs = [];
        var items = [];
        var id = false;
        var limit = 7;
        if(data.id) id = data.id;
        if(data.limit) limit = parseInt(data.limit);
        var accounts = $.fn.blockstrap.accounts.get();
        if(id)
        {
            accounts = [];
            accounts.push($.fn.blockstrap.accounts.get(id));
        }
        if(blockstrap_functions.array_length(accounts) > 0)
        {
            $.each(accounts, function(key, account)
            {
                if(account.txs && blockstrap_functions.array_length(account.txs) > 0)
                {
                    $.each(account.txs, function(k, transaction)
                    {
                        transaction.acc = account.address;
                        if(transaction.block === null || typeof transaction.block === 'undefined')
                        {
                            // Need to update otdated TXs if now in confirmed blocks?
                            $.fn.blockstrap.api.transactions(
                                account.address, 
                                account.blockchain.code, 
                                function(transactions)
                                {
                                    $.each(transactions, function(key, value)
                                    {
                                        if(value.txid = transaction.txid)
                                        {
                                            transaction.block = value.block;
                                            transaction.time = value.time;
                                            account.txs['txid_'+transaction.txid] = transaction;
                                            $.fn.blockstrap.data.save(
                                                'accounts', 
                                                account.id, 
                                                account, 
                                                function(updated_account)
                                                {
                                                    // No need to inform anyone?
                                                }
                                            );
                                        }
                                    });
                                }
                            );
                        }
                        txs.push(transaction);
                    });
                }
            });
            txs.sort(function(a,b) 
            { 
                return parseInt(b.time) - parseInt(a.time) 
            });
            $.each(txs.slice(0, limit), function(k, tx)
            {
                var css = 'from';
                var address = false;
                var txc = tx.blockchain;
                var value = parseInt(tx.value) / 100000000;
                var verb = 'to';
                if(tx.value < 0)
                {
                    value = Math.abs(value);
                    css = 'to';
                    verb = 'from';
                }
                var base = $.fn.blockstrap.settings.base_url;
                var intro = value + ' ' + $.fn.blockstrap.settings.blockchains[txc].blockchain;
                var html = '<a href="' + base + '?txid=' + tx.txid +'#transaction">' + intro + '</a>';
                
                var this_account = false;
                $.each(localStorage, function(k, v)
                {
                    var values = v;
                    if(blockstrap_functions.json(values))
                    {
                        values = $.parseJSON(values);
                    }
                    if(
                        typeof values.address != 'undefined'
                        && values.address == tx.acc
                    )
                    {
                        this_account = values;
                    }
                });
                address = '<a href="' +base+ '?key='+tx.acc+'#address">' + this_account.name + '</a>';
                html+= ' '+verb+' ' + address;
                
                items.push({
                    css: css,
                    html: html,
                    buttons: [
                        {
                            href: '',
                            css: 'btn-disabled disabled btn-xs pull-right',
                            text: $.fn.blockstrap.core.ago(tx.time)
                        }
                    ]
                });
            });
            var lists = $.fn.blockstrap.templates.bootstrap('lists');
            var html = $.fn.blockstrap.templates.process({
                objects: [
                    {
                        items: items,
                        missing: '<p>You do not have any transactions yet.</p><p>You may want to create a new <a href="#accounts" class="btn-page">account</a> or <a href="#" data-target="#send-modal" data-toggle="modal">send</a> some to one of your <a href="#contacts" class="btn-page">contacts</a>.</p>'
                    }
                ]
            }, lists);
            return html;
        }
        var lists = $.fn.blockstrap.templates.bootstrap('lists');
        var html = $.fn.blockstrap.templates.process({
            objects: [
                {
                    items: items,
                    missing: '<p>You do not have any transactions yet.</p><p>You may want to create a new <a href="#accounts" class="btn-page">account</a> or <a href="#" data-target="#send-modal" data-toggle="modal">send</a> some to one of your <a href="#contacts" class="btn-page">contacts</a>.</p>'
                }
            ]
        }, lists);
        return html;
    }
    
    // MERGE THE NEW FUNCTIONS WITH CORE
    $.extend(true, $.fn.blockstrap, {filters:filters});
})
(jQuery);


