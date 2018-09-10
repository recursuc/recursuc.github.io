draw2d.End = function (_url) {
    this.imgPath = _url || "Flow/js/designer/icons/type.endevent.none.png";
    draw2d.ResizeImage.call(this, this.imgPath);
    this.rightInputPort = null;
    this.leftInputPort = null;
    this.topInputPort = null;
    this.bottomInputPort = null;
    //this.eventId = 'End' + Sequence.create();
    this.setDimension(30, 30);
    
    this.ExtAttributes = {
		DbId : "",
	    Name : "",
	    NodeType : "EndNode",    
	    BeforeAPIType : "Null",
	    BeforeAPIPath : "",
	    BeforeAPIClass : "",
	    BeforeAPIMethod : "",
	    BeforeAPIPara : ""
    };    
};
draw2d.End.prototype=new draw2d.Node();
draw2d.End.prototype.type="draw2d.End";
draw2d.End.prototype.createHTMLElement=function(){
	var item = draw2d.ResizeImage.prototype.createHTMLElement.call(this);
	return item;
};
draw2d.End.prototype.setDimension=function(w, h){
	draw2d.ResizeImage.prototype.setDimension.call(this, w, h);
};
draw2d.End.prototype.setWorkflow=function(_505d){
	draw2d.ResizeImage.prototype.setWorkflow.call(this,_505d);
	if(_505d!==null&&this.rightInputPort===null){
		this.rightInputPort=new draw2d.MyInputPort();
		this.rightInputPort.setName("RightInputPort");
		this.rightInputPort.setWorkflow(_505d);
		this.rightInputPort.setBackgroundColor(new draw2d.Color(115,115,245));
		this.addPort(this.rightInputPort,this.width,this.height/2);
	}
	if(_505d!==null&&this.leftInputPort===null){
		this.leftInputPort=new draw2d.MyInputPort();
		this.leftInputPort.setName("leftInputPort");
		this.leftInputPort.setWorkflow(_505d);
		this.leftInputPort.setBackgroundColor(new draw2d.Color(115,115,245));
		this.addPort(this.leftInputPort,0,this.height/2);
	}
	if(_505d!==null&&this.topInputPort===null){
		this.topInputPort=new draw2d.MyInputPort();
		this.topInputPort.setName("RightInputPort");
		this.topInputPort.setWorkflow(_505d);
		this.topInputPort.setBackgroundColor(new draw2d.Color(115,115,245));
		this.addPort(this.topInputPort,this.width/2,0);
	}
	if(_505d!==null&&this.bottomInputPort===null){
		this.bottomInputPort=new draw2d.MyInputPort();
		this.bottomInputPort.setName("RightInputPort");
		this.bottomInputPort.setWorkflow(_505d);
		this.bottomInputPort.setBackgroundColor(new draw2d.Color(115,115,245));
		this.addPort(this.bottomInputPort,this.width/2,this.height);
	}
};
draw2d.End.prototype.getContextMenu=function(){
	if(this.workflow.disabled)return null;
	var menu =new draw2d.ContextMenu(100, 25);
	var data = {event:this};
	menu.appendMenuItem(new draw2d.ContextMenuItem("属性", "properties-icon",data,function(x,y)
	{
		var data = this.getData();
		var event = data.event;
		var tid = event.getId();
		event.workflow.attrPage.location("Flow/attribute/end.htm?tid=" + tid, {
            border: "0",
            scrolling: "no",
            autoSize: false,
            height: "100%",
            width: "100%"
        });
	}));
	
	return menu;
};
draw2d.End.prototype.toXML=function(){
    var w = this.getWidth(),
        h = this.getHeight(),
        x = this.getAbsoluteX(),
        y = this.getAbsoluteY(),
        extAttrs = this.ExtAttributes;

    var xml = '<Node DbId="'+extAttrs.DbId+'" Name="' + extAttrs.Name + '" ClientId="' + this.eventId + '" NodeType="' + extAttrs.NodeType + '" W="' + w + '" H="' + h + '" X="' + x + '" Y="' + y + '" \n' +
            'ParentNodeClientId="" BusinessUrl="" SubFlowId="" AccepterIds="" AccepterNames="" RespondLimitNumber="8" RespondLimitTimeUnit="Hour" DisposalLimitNumber="8" \n' +
            'DisposalLimitTimeUnit="Day" AllowAddAccepter="0" AllowGoCome="0" AllowDelegate="0" AllowCirculation="0" AllowBack="0" AllowBacks="0" AllowJump="0" IsRememberSendUser="0" AllowGetBack="0">\n' +
                '<BeforeAPI APIType="'+extAttrs.BeforeAPIType+'" APIPath="'+extAttrs.BeforeAPIPath+'" APIClass="'+extAttrs.BeforeAPIClass+'" APIMethod="'+extAttrs.BeforeAPIMethod+'">\n' +
                    (function(){
                    	if(extAttrs.BeforeAPIPara != "")
                    		return '<APIParams>\n<APIParam APIParam="'+extAttrs.BeforeAPIPara+'"></APIParam>\n</APIParams>\n';
                    	else
                    		return '<APIParams />\n';                    			
                    })() +
                '</BeforeAPI>\n' +
                '<EndAPI APIType="Null" APIPath="" APIClass="" APIMethod="">\n' +
                    '<APIParams />\n' +
                '</EndAPI>\n' +
                '<DataView BFormTypeId="" BFormId="">\n' +
                    //'<NodeFormState FormId="" FormAlias="" MainTable="" FormDataState="" FormStateId="" IsButtonForm="" NodeDataState=""/>\n'+
                '</DataView>\n' +
            '</Node>\n';

	return xml;
};
