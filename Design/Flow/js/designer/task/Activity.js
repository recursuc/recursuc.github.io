draw2d.Activity = function () {
    draw2d.Task.call(this);
    this.setIcon();
    
    this.ExtAttributes = {
	    DbId : "",
	    Name : "",
	    NodeType : 'ActivityNode',
	    AccepterIds  :  "",
	    AccepterNames  :  "",
	    BusinessUrl : "",
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
	    EndAPIPara : ""
    };
};
draw2d.Activity.prototype=new draw2d.Task();
draw2d.Activity.prototype.type="draw2d.Activity";
draw2d.Activity.prototype.setWorkflow=function(_5019){
	draw2d.Task.prototype.setWorkflow.call(this,_5019);
};
draw2d.Activity.prototype.getContextMenu=function(){
	var menu = draw2d.Task.prototype.getContextMenu.call(this);
	return menu;
};
draw2d.Activity.prototype.setIcon = function(){
	var icon=draw2d.Task.prototype.setIcon.call(this);
	icon.className="manual-task-icon";
};
draw2d.Activity.prototype.toXML=function(){
    var w = this.getWidth(),
        h = this.getHeight(),
        x = this.getAbsoluteX(),
        y = this.getAbsoluteY(),
        extAttrs = this.ExtAttributes;

    var xml = '<Node DbId="' + extAttrs.DbId + '" Name="' + extAttrs.Name + '" ClientId="' + this.id + '" NodeType="' + extAttrs.NodeType + '" W="' + w + '" H="' + h + '" X="' + x + '" Y="' + y + '" IsCodeterminant="'+extAttrs.IsCodeterminant+'" TerminateMansNumber="'+extAttrs.TerminateMansNumber+'" DecisionerManIds="'+extAttrs.DecisionerManIds+'" DecisionerManNames="'+extAttrs.DecisionerManNames+'" \n' +
		    'ParentNodeClientId="" BusinessUrl="' + extAttrs.BusinessUrl + '" SubFlowId="" AccepterIds="'+extAttrs.AccepterIds+'" AccepterNames="'+extAttrs.AccepterNames+'" RespondLimitNumber="'+extAttrs.RespondLimitNumber+'" RespondLimitTimeUnit="'+extAttrs.RespondLimitTimeUnit+'" DisposalLimitNumber="'+extAttrs.DisposalLimitNumber+'" IsSelfTurnNode="'+extAttrs.IsSelfTurnNode+'" \n' +
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
		        '<DataView BFormTypeId="" BFormId="">\n' +
		            //'<NodeFormState FormId="" FormAlias="" MainTable="" FormDataState="" FormStateId="" IsButtonForm="" NodeDataState=""/>\n'+
		        '</DataView>\n' +
		    '</Node>\n';

    return xml;
};