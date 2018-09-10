
;(function(__context){
    var module = {
        id : "cbe43021524329ec41fef1e945318440" , 
        filename : "file.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    
window.initUpload = function() {
	var uploadBtnTxt = $('#uploadimg').find('span');
 	var orgTxt = '一键上传';
	var conTxt = '继续上传';
	
    var uploader = new plupload.Uploader({
        runtimes:'flash,html5,gear,silverlight,browserplus',
        browse_button:'uploadimg',
        container:'uploadcontainer',
        max_file_size:'100mb',
        url:'/upload.uploadApi',//'http://byupload.qunar.com/postcomm/upload.jsp',
        flash_swf_url:'/app/workflow/config/h/upload/plupload.flash.swf',
        silverlight_xap_url:'/app/workflow/config/h/upload/plupload.silverlight.xap',
        multipart:true,
        file_data_name:"Filedata",
        filters:[
            {title:"Image files", extensions:"txt,jpg,zip,doc,rar,gif,xls,xlsx,png,docx,zip,wav,mp3"}
        ]
    });

    uploader.bind('Init', function (up, params) {
        uploader.currentRuntime = params.runtime;
        $('#uploadimg').css('visibility', 'visible');
    });

    /*$('#uploadfiles').click(function (e) {
     uploader.start();
     e.preventDefault();
     });*/

    uploader.init();

    uploader.bind('FilesAdded', function (up, files) {
        if ($.isArray(files)){
            var isFail=false;
            $.each(files,function(i,file){
                if (file.size<=0){
                    (new Q.ui.ugc.CommonAlert()).show('图片上传失败!', "图片"+file.name+"格式不正确！");
                    isFail=true;
                    up.removeFile(file);
                    return false;
                }
            });
            if (isFail){
                return;
            }
        }
    	uploadBtnTxt.text(conTxt);
        //$.each(files, function (i, file) {
        //   imgUpload.addFile(file.id, file.name);
        //});
        uploader.start();
        uploader.refresh(); // Reposition Flash/Silverlight
    });

    uploader.bind('UploadProgress', function (up, file) {
       // imgUpload.progress(file.id, file.percent);
    });

    uploader.bind('Error', function (up, err) {
        //(new Q.ui.ugc.CommonAlert()).show('图片上传失败!', ['图片不能超过20M', '请检查您的网络设置', '你可以刷新页面后重试']);

        up.refresh(); // Reposition Flash/Silverlight
    });

    uploader.bind('FileUploaded', function (up, file, response) {
        $('#' + file.id + " b").html("100%");
        response = $.parseJSON(response.response);
	    if($("#uploadfilebox")){
		    $("#uploadfilebox").append("<div><a href='javascript:void(0);return false;' target='_blank'>"+ file.name +"</a><a class='delete_file js-deletefile'>删除</a><input name='fileInfoId' style='display:none' value='"+response.data[0].fileInfoId+"'/><div>");
	    }

        //imgUpload.complete(file.id, response.FILEID, response.w, response.h,( file.name || "" ));
    });
    
    //$(imgUpload).bind("deletedImg", function (e) {
    //	!$("#img_list").find('.js-img-div').length && uploadBtnTxt.text(orgTxt);
    //});
}



    })( module.exports , module , __context );
    __context.____MODULES[ "cbe43021524329ec41fef1e945318440" ] = module.exports;
})(this);
