/**
 * ���ǻ���html5��ǰ��ͼƬ���ߣ�ѹ�����ߡ�
 */
var ImageResizer=function(opts){
    var settings={
        resizeMode:"auto"//ѹ��ģʽ���ܹ�������  auto,width,height auto��ʾ�Զ��������Ŀ�ȼ��߶ȵȱ�ѹ����width��ʾֻ���ݿ�����ж��Ƿ���Ҫ�ȱ���ѹ����height���ơ�
        ,dataSource:"" //����Դ������Դ��ָ��Ҫѹ��������Դ�����������ͣ�imageͼƬԪ�أ�base64�ַ�����canvas���󣬻���ѡ���ļ�ʱ���file���󡣡���
        ,dataSourceType:"image" //image  base64 canvas
        ,maxWidth:500 //����������
        ,maxHeight:500 //��������߶ȡ�
        ,onTmpImgGenerate:function(img){} //���м�ͼƬ����ʱ���ִ�з����������ʱ���벻Ҫ���޸���ͼƬ����������ѹ����Ľ����
        ,success:function(resizeImgBase64,canvas){

        }//ѹ���ɹ���ͼƬ��base64�ַ������ݡ�
    };
    var appData={};
    $.extend(settings,opts);

    var innerTools={
        getBase4FromImgFile:function(file,callBack){

            var reader = new FileReader();
            reader.onload = function(e) {
                var base64Img= e.target.result;
                if(callBack){
                    callBack(base64Img);
                }
            };
            reader.readAsDataURL(file);
        },

        //--��������Դ������������������Դ�������ΪͼƬ���󣬷��㴦��
        getImgFromDataSource:function(datasource,dataSourceType,callback){
            var _me=this;
            var img1=new Image();
            if(dataSourceType=="img"||dataSourceType=="image"){
                img1.src=$(datasource).attr("src");
                if(callback){
                    callback(img1);
                }
            }
            else if(dataSourceType=="base64"){
                img1.src=datasource;
                if(callback){
                    callback(img1);
                }
            }
            else if(dataSourceType=="canvas"){
                img1.src = datasource.toDataURL("image/jpeg");
                if(callback){
                    callback(img1);
                }
            }
            else if(dataSourceType=="file"){
                _me.getBase4FromImgFile(function(base64str){
                    img1.src=base64str;
                    if(callback){
                        callback(img1);
                    }
                });
            }
        },

        //����ͼƬ����Ҫѹ���ĳߴ硣��Ȼ��ѹ��ģʽ��ѹ������ֱ�Ӵ�setting����ȡ������
        getResizeSizeFromImg:function(img){
            var _img_info={
                w:$(img)[0].naturalWidth,
                h:$(img)[0].naturalHeight
            };

            var _resize_info={
                w:0,
                h:0
            };

            if(_img_info.w <= settings.maxWidth && _img_info.h <= settings.maxHeight){
                return _img_info;
            }
            if(settings.resizeMode=="auto"){
                var _percent_scale=parseFloat(_img_info.w/_img_info.h);
                var _size1={
                    w:0,
                    h:0
                };
                var _size_by_mw={
                    w:settings.maxWidth,
                    h:parseInt(settings.maxWidth/_percent_scale)
                };
                var _size_by_mh={
                    w:parseInt(settings.maxHeight*_percent_scale),
                    h:settings.maxHeight
                };
                if(_size_by_mw.h <= settings.maxHeight){
                    return _size_by_mw;
                }
                if(_size_by_mh.w <= settings.maxWidth){
                    return _size_by_mh;
                }

                return {
                    w:settings.maxWidth,
                    h:settings.maxHeight
                };
            }
            if(settings.resizeMode=="width"){
                if(_img_info.w<=settings.maxWidth){
                    return _img_info;
                }
                var _size_by_mw={
                    w:settings.maxWidth
                    ,h:parseInt(settings.maxWidth/_percent_scale)
                };
                return _size_by_mw;
            }
            if(settings.resizeMode=="height"){
                if(_img_info.h<=settings.maxHeight){
                    return _img_info;
                }
                var _size_by_mh={
                    w:parseInt(settings.maxHeight*_percent_scale)
                    ,h:settings.maxHeight
                };
                return _size_by_mh;
            }
        },

        //--�����ͼƬ���󻭵�canvas����ȥ��
        drawToCanvas:function(img,theW,theH,realW,realH,callback){

            var canvas = document.createElement("canvas");
            canvas.width=theW;
            canvas.height=theH;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img,
                0,//sourceX,
                0,//sourceY,
                realW,//sourceWidth,
                realH,//sourceHeight,
                0,//destX,
                0,//destY,
                theW,//destWidth,
                theH//destHeight
            );

            //--��ȡbase64�ַ�����canvas���󴫸�success������
            var base64str=canvas.toDataURL("image/png");
            if(callback){
                callback(base64str,canvas);
            }
        }
    };

    //--��ʼ����
    (function(){
        innerTools.getImgFromDataSource(settings.dataSource,settings.dataSourceType,function(_tmp_img){
            var __tmpImg=_tmp_img;
            settings.onTmpImgGenerate(_tmp_img);

            //--����ߴ硣
            var _limitSizeInfo=innerTools.getResizeSizeFromImg(__tmpImg);
            var _img_info={
                w:$(__tmpImg)[0].naturalWidth,
                h:$(__tmpImg)[0].naturalHeight
            };

            innerTools.drawToCanvas(__tmpImg,_limitSizeInfo.w,_limitSizeInfo.h,_img_info.w,_img_info.h,function(base64str,canvas){
                settings.success(base64str,canvas);
            });
        });
    })();

    var returnObject={


    };

    return returnObject;
};

function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}
