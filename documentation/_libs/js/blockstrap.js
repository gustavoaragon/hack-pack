var blockstrap = {
    // INITIALIZE
    init: function()
    {
        blockstrap.forms();
        blockstrap.snippets();
        $('body').on('click', '.ga-track', function(e)
        {
            e.preventDefault();
            var href = $(this).attr('href');
            var action = $(this).attr('data-action');
            var place = $(this).attr('data-place');
            blockstrap.track(e, href, action, place);
        });
    },
    forms: function()
    {
        $('#main-content table').each(function(i)
        {
            $(this).addClass('table table-striped');
        });
    },
    snippets: function()
    {
        $('*').contents().filter(function()
        {
            return this.nodeType == 8;
        }).each(function(i, e)
        {
            var contents = e.nodeValue;
            if(contents.indexOf('pre-') > -1)
            {
                var obj = contents.split('-');
                if(obj[0] == 'pre' && typeof obj[1] != 'undefined')
                {
                    $($(e).next()).snippet(obj[1], {style:'ide-eclipse'});
                }
            }
        });  
    },
    track: function(e, href, action, place)
    {
        e.preventDefault();
        _gaq.push(
            [
                '_trackEvent',
                action,
                place,
                href
            ]
        );
        setTimeout(function()
        {
            location.href = href;
        }, 200);
        return false;
    }
};

$(document).ready(function()
{
    blockstrap.init();
});