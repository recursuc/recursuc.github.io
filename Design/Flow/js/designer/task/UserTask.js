draw2d.UserTask = function () {
    draw2d.Task.call(this);
    //this.id = "UserTask"+Sequence.create();
    this.setIcon();
    
    this.ExtAttributes = {
	    DbId : "",
	    Name : "",
	    NodeType : 'ClusterNode',
	    AccepterIds  :  "",
	    AccepterNames  :  "",
	    AllowAddAccepter : "0",
	    AllowDelegate : "0",
	    AllowJump : "0",
	    AllowCirculation : "0",
	    AllowBack : "0",
	    AllowBacks : "0",
	    AllowGetBack : "0",
	    AllowGoCome : "0",
	    IsRememberSendUser : "0",
	    IsSelfTurnNode : "0",
	    IsCodeterminant : "0",
	    TerminateMansNumber : "0",
	    DecisionerManIds : "",
	    DecisionerManNames : "",
	    RespondLimitNumber : "8",
	    RespondLimitTimeUnit : "Hour",
	    DisposalLimitNumber : "8",
	    DisposalLimitTimeUnit : "Day",	    
	    BeforeAPIType : "Null",
	    BeforeAPIPath : "",
	    BeforeAPIClass : "",
	    BeforeAPIMethod : "",
	    BeforeAPIPara : "",
	    EndAPIType : "Null",
	    EndAPIPath : "",
	    EndAPIClass : "",
	    EndAPIMethod : "",
	    EndAPIPara : "",
	    FormTabsId : "0",
	    FormTabsName : "",
	    FormList : ""
    };
};
draw2d.UserTask.prototype=new draw2d.Task();
draw2d.UserTask.prototype.type="draw2d.UserTask";
draw2d.UserTask.prototype.setWorkflow=function(_5019){
	draw2d.Task.prototype.setWorkflow.call(this,_5019);
};
draw2d.UserTask.prototype.setContent=function(opts){
	if(typeof opts == "string"){
		draw2d.Task.prototype.setContent.call(this,opts);
	}else{
		var sHtml = "<div>是否允许回退：" + (this.ExtAttributes.AllowBack == "0" ? "否" : "是") + "</div>";
		draw2d.Task.prototype.setContent.call(this,sHtml);
	}
};
draw2d.UserTask.prototype.getContextMenu=function(){
	var menu = draw2d.Task.prototype.getContextMenu.call(this);
  return menu;
};
draw2d.UserTask.prototype.setIcon = function(){
	var icon=draw2d.Task.prototype.setIcon.call(this);
	icon.className="user-task-icon";
};
draw2d.UserTask.prototype.toXML=function(){
    var w = this.getWidth(),
        h = this.getHeight(),
        x = this.getAbsoluteX(),
        y = this.getAbsoluteY(),
        extAttrs = this.ExtAttributes,
        strNodeFormState = '',
        formList = extAttrs.FormList.split(';');
    for(var n = 0, l = formList.length; n < l; n++){
    	var form = formList[n];
    	if(form != ""){
    		var formAttr = form.split(','),
    			formId = formAttr[0],
    			formName = formAttr[1],
    			formStateId = formAttr[2],
    			mainTable = formAttr[3];
    		strNodeFormState += '<NodeFormState FormId="' + formId + '" FormAlias="' + formName + '" MainTable="' + mainTable + '" FormDataState="1" FormStateId="' + formStateId + '" NodeDataState="0" /> \n';
        }
    }

    var xml = '<Node DbId="' + extAttrs.DbId + '" Name="' + extAttrs.Name + '" ClientId="' + this.id + '" NodeType="' + extAttrs.NodeType + '" W="' + w + '" H="' + h + '" X="' + x + '" Y="' + y + '" IsCodeterminant="'+extAttrs.IsCodeterminant+'" TerminateMansNumber="'+extAttrs.TerminateMansNumber+'" DecisionerManIds="'+extAttrs.DecisionerManIds+'" DecisionerManNames="'+extAttrs.DecisionerManNames+'" \n' +
            'ParentNodeClientId="" BusinessUrl="" SubFlowId="" AccepterIds="'+extAttrs.AccepterIds+'" AccepterNames="'+extAttrs.AccepterNames+'" RespondLimitNumber="'+extAttrs.RespondLimitNumber+'" RespondLimitTimeUnit="'+extAttrs.RespondLimitTimeUnit+'" DisposalLimitNumber="'+extAttrs.DisposalLimitNumber+'" IsSelfTurnNode="'+extAttrs.IsSelfTurnNode+'" \n' +
            'DisposalLimitTimeUnit="'+extAttrs.DisposalLimitTimeUnit+'" AllowAddAccepter="'+extAttrs.AllowAddAccepter+'" AllowGoCome="'+extAttrs.AllowGoCome+'" AllowDelegate="'+extAttrs.AllowDelegate+'" AllowCirculation="'+extAttrs.AllowCirculation+'" AllowBack="'+extAttrs.AllowBack+'" AllowBacks="'+extAttrs.AllowBacks+'" AllowJump="'+extAttrs.AllowJump+'" IsRememberSendUser="'+extAttrs.IsRememberSendUser+'" AllowGetBack="'+extAttrs.AllowGetBack+'">\n' +
                '<BeforeAPI APIType="'+extAttrs.BeforeAPIType+'" APIPath="'+extAttrs.BeforeAPIPath+'" APIClass="'+extAttrs.BeforeAPIClass+'" APIMethod="'+extAttrs.BeforeAPIMethod+'">\n' +
	                (function(){
	                	if(extAttrs.BeforeAPIPara != "")
	                		return '<APIParams>\n<APIParam APIParam="'+extAttrs.BeforeAPIPara+'"></APIParam>\n</APIParams>\n';
	                	else
	                		return '<APIParams />\n';                    			
	                })() +
                '</BeforeAPI>\n' +
                '<EndAPI APIType="'+extAttrs.EndAPIType+'" APIPath="'+extAttrs.EndAPIPath+'" APIClass="'+extAttrs.EndAPIClass+'" APIMethod="'+extAttrs.EndAPIMethod+'">\n' +
	                (function(){
	                	if(extAttrs.EndAPIPara != "")
	                		return '<APIParams>\n<APIParam APIParam="'+extAttrs.EndAPIPara+'"></APIParam>\n</APIParams>\n';
	                	else
	                		return '<APIParams />\n';                    			
	                })() +
                '</EndAPI>\n' +
                '<DataView BFormTypeId="' + extAttrs.FormTabsId + '" BFormId="' + extAttrs.FormTabsId + '">\n' + strNodeFormState +
                '</DataView>\n' +
            '</Node>\n';

    return xml;
};