draw2d.Start = function (_url) {
    this.imgPath = _url || "Flow/js/designer/icons/type.startevent.none.png";
    draw2d.ResizeImage.call(this, this.imgPath);
    this.rightOutputPort = null;
    this.leftOutputPort = null;
    this.topOutputPort = null;
    this.bottomOutputPort = null;
    //this.eventId = 'Start' + Sequence.create();
    this.setDimension(30, 30);
    
    this.ExtAttributes = {
		DbId : "",
	    Name : "",
	    NodeType : 'StartNode',
	    AccepterIds : "",
	    AccepterNames : "",
	    AllowAddAccepter : "0",
	    AllowDelegate : "0",
	    AllowJump : "0",
	    AllowCirculation : "0",
	    AllowBack : "0",
	    AllowBacks : "0",
	    AllowGetBack : "0",
	    RespondLimitNumber : "8",
	    RespondLimitTimeUnit : "Hour",
	    DisposalLimitNumber : "8",
	    DisposalLimitTimeUnit : "Day",
	    FormTabsId : "0",
	    FormTabsName : "",
	    FormList : ""
    };
};
draw2d.Start.prototype=new draw2d.Node();
draw2d.Start.prototype.type="draw2d.Start";
draw2d.Start.prototype.createHTMLElement=function(){
	var item = draw2d.ResizeImage.prototype.createHTMLElement.call(this);
	return item;
};
draw2d.Start.prototype.setDimension=function(w, h){
	draw2d.ResizeImage.prototype.setDimension.call(this, w, h);
};
draw2d.Start.prototype.setWorkflow=function(_4fe5){
	draw2d.ResizeImage.prototype.setWorkflow.call(this,_4fe5);
	if(_4fe5!==null&&this.rightOutputPort===null){
		this.rightOutputPort=new draw2d.MyOutputPort();
		this.rightOutputPort.setMaxFanOut(1);
		this.rightOutputPort.setWorkflow(_4fe5);
		this.rightOutputPort.setName("rightOutputPort");
		this.rightOutputPort.setBackgroundColor(new draw2d.Color(245,115,115));
		this.addPort(this.rightOutputPort,this.width,this.height/2);
	}
	if(_4fe5!==null&&this.leftOutputPort===null){
		this.leftOutputPort=new draw2d.MyOutputPort();
		this.leftOutputPort.setMaxFanOut(1);
		this.leftOutputPort.setWorkflow(_4fe5);
		this.leftOutputPort.setName("leftOutputPort");
		this.leftOutputPort.setBackgroundColor(new draw2d.Color(245,115,115));
		this.addPort(this.leftOutputPort,0,this.height/2);
	}
	if(_4fe5!==null&&this.topOutputPort===null){
		this.topOutputPort=new draw2d.MyOutputPort();
		this.topOutputPort.setMaxFanOut(1);
		this.topOutputPort.setWorkflow(_4fe5);
		this.topOutputPort.setName("topOutputPort");
		this.topOutputPort.setBackgroundColor(new draw2d.Color(245,115,115));
		this.addPort(this.topOutputPort,this.width/2,0);
	}
	if(_4fe5!==null&&this.bottomOutputPort===null){
		this.bottomOutputPort=new draw2d.MyOutputPort();
		this.bottomOutputPort.setMaxFanOut(1);
		this.bottomOutputPort.setWorkflow(_4fe5);
		this.bottomOutputPort.setName("bottomOutputPort");
		this.bottomOutputPort.setBackgroundColor(new draw2d.Color(245,115,115));
		this.addPort(this.bottomOutputPort,this.width/2,this.height);
	}
};
draw2d.Start.prototype.getContextMenu=function(){
	if(this.workflow.disabled)return null;
	var menu =new draw2d.ContextMenu(100, 25);
	var data = {event:this};
	menu.appendMenuItem(new draw2d.ContextMenuItem("属性", "properties-icon",data,function(x,y)
	{
		var data = this.getData();
		var event = data.event;
		var tid = event.getId();
		event.workflow.attrPage.location("Flow/attribute/start.htm?tid=" + tid, {
            border: "0",
            scrolling: "no",
            autoSize: false,
            height: "100%",
            width: "100%"
        });
	}));
	
	return menu;
};
draw2d.Start.prototype.toXML = function () {
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

    var xml = '<Node DbId="' + extAttrs.DbId + '" Name="' + extAttrs.Name + '" ClientId="' + this.eventId + '" NodeType="' + extAttrs.NodeType + '" W="' + w + '" H="' + h + '" X="' + x + '" Y="' + y + '" \n' +
            'ParentNodeClientId="" BusinessUrl="" SubFlowId="" AccepterIds="'+extAttrs.AccepterIds+'" AccepterNames="'+extAttrs.AccepterNames+'" RespondLimitNumber="'+extAttrs.RespondLimitNumber+'" RespondLimitTimeUnit="'+extAttrs.RespondLimitTimeUnit+'" DisposalLimitNumber="'+extAttrs.DisposalLimitNumber+'" \n' +
            'DisposalLimitTimeUnit="'+extAttrs.DisposalLimitTimeUnit+'" AllowAddAccepter="'+extAttrs.AllowAddAccepter+'" AllowGoCome="0" AllowDelegate="'+extAttrs.AllowDelegate+'" AllowCirculation="'+extAttrs.AllowCirculation+'" AllowBack="'+extAttrs.AllowBack+'" AllowBacks="'+extAttrs.AllowBacks+'" AllowJump="'+extAttrs.AllowJump+'" IsRememberSendUser="0" AllowGetBack="'+extAttrs.AllowGetBack+'">\n' +
                '<BeforeAPI APIType="Null" APIPath="" APIClass="" APIMethod="">\n' +
                    '<APIParams />\n' +
                '</BeforeAPI>\n' +
                '<EndAPI APIType="Null" APIPath="" APIClass="" APIMethod="">\n' +
                    '<APIParams />\n' +
                '</EndAPI>\n' +
                '<DataView BFormTypeId="' + extAttrs.FormTabsId + '" BFormId="' + extAttrs.FormTabsId + '">\n' + strNodeFormState +
                '</DataView>\n' +
            '</Node>\n';

    return xml;
};	
