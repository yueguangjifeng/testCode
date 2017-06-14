
/*var user={loginName:'eee',loginId:'4492658731'};
 sessionStorage.setItem('userData',JSON.stringify(user));*/
/*
 var  loginInfo=JSON.parse(sessionStorage.getItem('userData'));
 var loginId=loginInfo.loginId;
 var loginName=loginInfo.loginName;
 var streetId=loginInfo.streetId;
 $('#loginAdmin_ym').html(loginName);
 */

var user={loginName:'aaa',loginId:'0445267831',streetId:'1446985237','img':'http://ok9xod9sy.bkt.clouddn.com/297a35d88c5449c69e3db96d682b66dc'};
var loginId=user.loginId;
var streetId=user.streetId;
var loginName=user.loginName;
var img=user.img;




$('#usersDataGroupList>li').click(function () {
    $(this).css('backgroundColor','#F1F3F8');
    $(this).siblings().css('backgroundColor','#DAE1E8');
});
var editor1;
var editor2;
function streAdd(){
    if(editor1!=undefined){
        console.log('富文本框1 已经有了!');
        editor1.destroy();
        editor1.undestroy();
        editor1=new wangEditor('commuPolcAdd');
    }else {
        console.log('富文本框1 还没有');
        editor1=new wangEditor('commuPolcAdd');
    }
    editor1.config.pasteFilter=true;
    editor1.config.fontsizes={
        3:'正文',
        4:'标题'
    };
    editor1.config.familys = [
        '宋体', '黑体', '楷体', '微软雅黑',
        'Arial', 'Verdana', 'Georgia'
    ];
    editor1.config.menus=[ 'source',
        '|',
        'bold',
        'img',
        'fontsize',
        'lineheight',
        'aligncenter',
        'alignleft',
        'alignright',
        // 'location',
    ];
    editor1.config.pasteText = true;
    editor1.config.uploadImgUrl='/api/uploadfile/ProcessRequest';
    editor1.config.uploadHeaders = {
        'Accept' : 'text/x-json'
    };
    editor1.config.uploadImgFns.onload = function (resultText, xhr) {
        var originalName = editor1.uploadImgOriginalName || '';
        editor1.command(null, 'insertHtml', '<img src="' + JSON.parse(resultText).obj + '" alt="' + originalName + '" style="width:100%;"/>');
        editor1.config.uploadImgFns.ontimeout = function (xhr) {
            // xhr 是 xmlHttpRequest 对象，IE8、9中不支持
            alert('上传超时');
        };
        // 自定义error事件
        editor1.config.uploadImgFns.onerror = function (xhr) {
            // xhr 是 xmlHttpRequest 对象，IE8、9中不支持
            alert('上传错误');
        };
    }

//        editor1.config.uploadImgUrl='http://test.jgsoft.org///api/uploadfile/ProcessRequest';
//        editor1.config.uploadHeaders={'Accept':'text/x-json'};
//        editor1.config.hideLinkImg=true;
//        editor1.config.uploadImgFns.onload= function (result, xhr) {
//            console.log('返回的图片地址是:');
//            console.log(result);
//        }
    editor1.create();
    editor1.$txt.append('<style>#commuPolcAdd{font-size:17px;font-family:"SimSun"; color:#333;margin:0px 15px;line-height:26px;text-align:justify;list-style:none; }#commuPolcAdd img{width: 100%;}</style>')

}
function streEdit(){
    console.log('要弹出 编辑模态框了');
    if(editor2!=undefined){
        console.log('富文本框2 已经有了!');
        editor2.destroy();
        editor2=new wangEditor('commuPolcEdit');
    }else {
        console.log('富文本框2 还没有');
        editor2=new wangEditor('commuPolcEdit')
    }
    editor2.config.pasteFilter=true;
    editor2.config.fontsizes={
        3:'正文',
        4:'标题'
    };
    editor2.config.familys = [
        '宋体', '黑体', '楷体', '微软雅黑',
        'Arial', 'Verdana', 'Georgia'
    ];
    editor2.config.menus=[ 'source',
        '|',
        'bold',
        'img',
        'fontsize',
        'lineheight',
        'aligncenter',
        'alignleft',
        'alignright',
        // 'location',
    ];

    editor2.config.uploadImgUrl='/api/uploadfile/ProcessRequest';
    editor2.config.uploadHeaders = {
        'Accept' : 'text/x-json'
    };
    editor2.config.uploadImgFns.onload = function (resultText, xhr) {
        var originalName = editor2.uploadImgOriginalName || '';
        editor2.command(null, 'insertHtml', '<img src="' + JSON.parse(resultText).obj + '" alt="' + originalName + '" style="width:100%;"/>');
        editor2.config.uploadImgFns.ontimeout = function (xhr) {
            // xhr 是 xmlHttpRequest 对象，IE8、9中不支持
            alert('上传超时');
        };
        // 自定义error事件
        editor2.config.uploadImgFns.onerror = function (xhr) {
            // xhr 是 xmlHttpRequest 对象，IE8、9中不支持
            alert('上传错误');
        };
    };



    editor2.create();
    editor2.$txt.append('<style>#commuPolcEdit{font-size:17px;font-family:"simsun"; color:#333;margin:0px 15px;line-height:26px;text-align:justify;list-style:none; }#commuPolcEdit img{width: 100%;}</style>')
}

function  rotateClick(){
    console.log('旋转');
    $('.rotate_ym').click(function () {
        if($('.rotate_ym>i').hasClass('fa-arrow-up')){
            $('.rotate_ym>i').removeClass('fa-arrow-up').addClass('fa-arrow-down');
        }else if($('.rotate_ym>i').hasClass('fa-arrow-down')) {
            $('.rotate_ym i').removeClass('fa-arrow-down').addClass('fa-arrow-up');
        }
    });
}
/*

 $('#upImgEditBox').on('click','.deleteEditSpan_ym',function (event) {
 console.log('删除span');
 console.log($(event.target).parent()[0].style.backgroundImage.split("(")[1].split(")")[0]);
 var index = arrImgListMultEdit.indexOf($(event.target).parent()[0].style.backgroundImage.split("(")[1].split(")")[0]);
 arrImgListMultEdit.splice(index, 1);
 $(this).parent().css('display', 'none');
 });


 */




/*   $('.rotate_ym').click(function () {

 });*/



/*商家页面 */

/*
 $('.orderStatus_ym').eq(0).change(function () {
 var nodValue=$('.orderStatus_ym option:selected').text();
 //console.log(nodValue.text());
 if(nodValue=='未安排'){
 $('.noArranged_ym').siblings(). css('display','none');
 $('.noArranged_ym').css('display','table-row');
 //alert('未安排')
 }else if(nodValue=='完成'){
 $('.complete_ym').siblings().css('display','none');
 $('.complete_ym').css('display','table-row');
 //alert('完成')
 }else if(nodValue=='已安排'){
 $('.arranged_ym').siblings().css('display','none');
 $('.arranged_ym').css('display','table-row');

 }else if(nodValue=='已取消'){
 $('.deleted_ym').siblings().css('display','none');
 $('.deleted_ym').css('display','table-row');
 }else {
 $('#tabCont_ym').children().children().css('display','table-row');
 }
 });*/




