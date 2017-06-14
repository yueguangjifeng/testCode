/*****
 * CONFIGURATION
 */
//Main navigation
$.navigation = $('nav > ul.nav');

$.panelIconOpened = 'icon-arrow-up';
$.panelIconClosed = 'icon-arrow-down';

//Default colours
$.brandPrimary = '#20a8d8';
$.brandSuccess = '#4dbd74';
$.brandInfo = '#63c2de';
$.brandWarning = '#f8cb00';
$.brandDanger = '#f86c6b';

$.grayDark = '#2a2c36';
$.gray = '#55595c';
$.grayLight = '#818a91';
$.grayLighter = '#d1d4d7';
$.grayLightest = '#f8f9fa';

'use strict';

/****
 * MAIN NAVIGATION
 */

$(document).ready(function ($) {

    // Add class .active to current link
    $.navigation.find('a').each(function () {

        var cUrl = String(window.location).split('?')[0];

        if (cUrl.substr(cUrl.length - 1) == '#') {
            cUrl = cUrl.slice(0, -1);
        }

        if ($($(this))[0].href == cUrl) {
            $(this).addClass('active');

            $(this).parents('ul').add(this).each(function () {
                $(this).parent().addClass('open');
            });
        }
    });

    // Dropdown Menu
    $.navigation.on('click', 'a', function (e) {

        if ($.ajaxLoad) {
            e.preventDefault();
        }

        if ($(this).hasClass('nav-dropdown-toggle')) {
            $(this).parent().toggleClass('open');
            resizeBroadcast();
        }

    });

    function resizeBroadcast() {

        var timesRun = 0;
        var interval = setInterval(function () {
            timesRun += 1;
            if (timesRun === 5) {
                clearInterval(interval);
            }
            window.dispatchEvent(new Event('resize'));
        }, 62.5);
    }

    /* ---------- Main Menu Open/Close, Min/Full ---------- */
    $('.navbar-toggler').click(function () {

        if ($(this).hasClass('sidebar-toggler')) {
            $('body').toggleClass('sidebar-hidden');
            resizeBroadcast();
        }

        if ($(this).hasClass('aside-menu-toggler')) {
            $('body').toggleClass('aside-menu-hidden');
            resizeBroadcast();
        }

        if ($(this).hasClass('mobile-sidebar-toggler')) {
            $('body').toggleClass('sidebar-mobile-show');
            resizeBroadcast();
        }

    });

    $('.sidebar-close').click(function () {
        $('body').toggleClass('sidebar-opened').parent().toggleClass('sidebar-opened');
    });

    /* ---------- Disable moving to top ---------- */
    $('a[href="#"][data-top!=true]').click(function (e) {
        e.preventDefault();
    });

});

/****
 * CARDS ACTIONS
 */

$(document).on('click', '.card-actions a', function (e) {
    e.preventDefault();

    if ($(this).hasClass('btn-close')) {
        $(this).parent().parent().parent().fadeOut();
    } else if ($(this).hasClass('btn-minimize')) {
        var $target = $(this).parent().parent().next('.card-block');
        if (!$(this).hasClass('collapsed')) {
            $('i', $(this)).removeClass($.panelIconOpened).addClass($.panelIconClosed);
        } else {
            $('i', $(this)).removeClass($.panelIconClosed).addClass($.panelIconOpened);
        }

    } else if ($(this).hasClass('btn-setting')) {
        $('#myModal').modal('show');
    }

});

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function init(url) {

    /* ---------- Tooltip ---------- */
    $('[rel="tooltip"],[data-rel="tooltip"]').tooltip({ "placement": "bottom", delay: { show: 400, hide: 200 } });

    /* ---------- Popover ---------- */
    $('[rel="popover"],[data-rel="popover"],[data-toggle="popover"]').popover();

}


//富文本
var editor;
function createdit(id) {

    //创建对象
    editor = new wangEditor(id);
    // 销毁编辑器
    editor.destroy();
    editor.undestroy();

    // 取消粘贴过滤
    editor.config.pasteFilter = true;

    // 字号
    editor.config.fontsizes = {
        3: '正文',
        4: '标题'
    };


    editor.config.menus = [
        'source',
        '|',     // '|' ??????×é??·?????
        'bold',
        'img',
        'fontsize',
        'lineheight',
        'aligncenter',
        // 'location',
    ];

    // 上传图片地址
    editor.config.uploadImgUrl = 'upload/file.aspx';

    //上传图片
    editor.config.uploadImgFns.onload = function (resultText, xhr) {
        var originalName = editor.uploadImgOriginalName || '';
        editor.command(null, 'insertHtml', '<img src="' + JSON.parse(resultText).obj + '" alt="' + originalName + '" style="width:100%;"/>');
    };

    editor.create();

    // onchange 事件
    editor.onchange = function () {
        var html = editor.$txt.html();
        var text =html;
        //编辑默认样式
        if(text.indexOf('<style>#text-intro{font-size:17px;color:#333;margin:0px 15px;text-align:justify;list-style:none; }#text-intro img{width: 100%;}</style>')==-1 && text.length>0)
        {
            text = '<style>#text-intro{font-size:17px;color:#333;margin:0px 15px;text-align:justify;list-style:none; }#text-intro img{width: 100%;}</style>'+text;
            editor.$txt.html(text.replace(/<table>/g, '').replace(/<ul>/g, '&nbsp;').replace(/<ol>/g, '').replace(/<a>/g,'<span>').replace(/<\/a>/g, '</span>').replace(/href/g,''));
        }

        if(text.indexOf('<a>')!=-1 || text.indexOf('<table>')!=-1 || text.indexOf('<ul>')!=-1 || text.indexOf('<ol>')!=-1 || text.indexOf('<span>')!=-1 )
        {
            editor.$txt.html(text.replace(/<table>/g, '').replace(/<ul>/g, '&nbsp;').replace(/<ol>/g, '').replace(/<a>/g,'<span>').replace(/<\/a>/g, '</span>').replace(/href/g,''));
        }

        //移除历史数据
        if(text.indexOf('<style>p img{width: 100%;}</style><div style="font-size:17px;color:#333;margin:0px 15px;text-align:justify;list-style:none;">')!=-1)
        {
            var textHtml =text.replace('<style>p img{width: 100%;}</style><div style="font-size:17px;color:#333;margin:0px 15px;text-align:justify;list-style:none;">','');
            editor.$txt.html(textHtml==undefined?"":textHtml);
        }



    };
}

//上传单张图片
function uploadimg(obj, id) {
    var formData = new FormData();
    formData.append("file", obj.files[0]);

    $.ajax({
        url: "upload/file.aspx",
        type: "POST",
        data: formData,
        contentType: false,
        processData: false,
        success: function (res) {
            res = JSON.parse(res);
            if (res.code == 200) {
                $(id).css({"background":'url('+res.obj+') no-repeat center',"backgroundSize":"160px 100px"});
                $('.imgsrc').attr('i',res.obj);
            }
            else {
                layer.msg(res.msg, { timer: 1000 });
            }
        }
    });
}

//上传多张图片、采用回调处理
function uploadimglist(obj,callback,id,count) {

    if($("#"+id).find(".thumb").length >= count)
    {
        layer.msg('上传图片已达上限',{time:1000})
        return;
    }
    var formData = new FormData();
    formData.append("file", obj.files[0]);
    $.ajax({
        url: "upload/file.aspx",
        type: "POST",
        data: formData,
        contentType: false,
        processData: false,
        success: function (res) {
            res = JSON.parse(res);
            if (res.code == 200) {
                var src =res.obj;
                window[callback](src);
            }
            else {
                layer.msg(res.msg, { timer: 1000 });
            }
        }
    });
}


//获取url中的参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return r[2]; return null; //返回参数值
}

//处理面包屑导航
function NavHome(type,text,path)
{
    var html = '<li class="breadcrumb-item"><a href="'+path+'">'+text+'</a></li>';
    //替换
    if(type == 1)
    {
        $("#navCrumbs").html(html);
    }//追加
    else
    {
        $("#navCrumbs").append(html);

    }

    //重新绑定事件
    $("#navCrumbs li a").unbind('click');
    $("#navCrumbs li a").on('click',function()
    {
        var clickText =$(this).text();
        var applocation = -1;
        for(var i=0;i<$("#navCrumbs li a").length;i++)
        {
            var item =$("#navCrumbs li a")[i];
            var itemtext =$(item).text();
            if(clickText==itemtext)
            {
                applocation =i;
            }
            if(applocation>-1)
            {
                $("#navCrumbs li:gt("+i+")").remove();
            }
        }
    })

}

//检测用户当前登录状态
function checkuserloginstate()
{
    var cookLog =$.cookie("jg_token");

    if(cookLog!="admin")
    {
        window.location.href="/pages-login.html";
    }

}