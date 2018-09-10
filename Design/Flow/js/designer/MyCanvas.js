draw2d.MyCanvas=function(id){
		draw2d.Workflow.call(this,id);
		this.html.style.backgroundImage="";
		this.html.className="MyCanvas";
		this.disabled=false;
		//this.processCategory=null;
		//this.processId=null;
		//this.processName=null;
		//this.process=new draw2d.Process();
		//this.listeners=new draw2d.ArrayList();
		
		this.ExtAttributes = {
			DbId : "",
		    name : "流程",
		    Memo : "",
		    OwnerIds : "",
		    OwnerNames : "",
		    FlowState : "Draft",
		    FlowType : "Normal",
		    FlowClass : "3",
		    //FlowDataMode : "SingleForm",
		    MainFormId : "",
		    MainFormName : "",
		    FormMainTableName : "",
		    //ExtendFormIds : "",
		    FreeAppUserIds : "",
		    FreeAppUserNames : "",
		    FreeBeginUserIds : "",
		    FreeBeginUserNames : "",
		    CreateUserId : "",
		    CreateUserName : ""
	    };
};
draw2d.MyCanvas.prototype = new draw2d.Workflow();
draw2d.MyCanvas.prototype.type = "MyCanvas";
draw2d.MyCanvas.prototype.setDisabled = function(){
	this.disabled = true;
	return this.readOnly;
};
draw2d.MyCanvas.prototype.addFigure = function(figure, xPos, yPos){
	var parent = this.getBestCompartmentFigure(xPos,yPos);
	if(parent === null){
		draw2d.Workflow.prototype.addFigure.call(this,figure, xPos, yPos);
	}else{
		this.getCommandStack().execute(new draw2d.CommandAdd(this,figure,xPos,yPos,parent));
	}
};
draw2d.MyCanvas.prototype.addModel = function(figure, xPos, yPos){
	var parent = this.getBestCompartmentFigure(xPos,yPos);
	this.getCommandStack().execute(new draw2d.CommandAdd(this,figure,xPos,yPos,parent));
};
draw2d.MyCanvas.prototype.getContextMenu=function(){
	if(this.readOnly)return null;
	var menu =new draw2d.ContextMenu(100, 25);
	var data = {workflow:this};
	menu.appendMenuItem(new draw2d.ContextMenuItem("属性", "properties-icon",data,function(x,y)
	{
		var data = this.getData();
		var workflow = data.workflow;
		//var pid = workflow.processId;
		workflow.attrPage.location("Flow/attribute/flow.htm", {
            border: "0",
            scrolling: "no",
            autoSize: false,
            height: "100%",
            width: "100%"
        });
	}));
	return menu;
};
draw2d.MyCanvas.prototype.onContextMenu=function(x,y){
	if(this.readOnly)return;
	var f = this.getBestFigure(x, y);
	if(f==null)
		f = this.getBestLine(x, y);
	if(f !=null){
		var menu = f.getContextMenu();
		if (menu !== null) {
			this.showMenu(menu, x, y);
		}
	}else{
		var menu = this.getContextMenu();
		if (menu !== null) {
			this.showMenu(menu, x, y);
		}
	}
};
draw2d.MyCanvas.prototype.toXMLNode = function () {
	var extAttrs = this.ExtAttributes;
    var xml = '<sheet DbId="' + extAttrs.DbId + '" name="' + extAttrs.name + '" Memo="' + extAttrs.Memo + '" OwnerIds="' + extAttrs.OwnerIds + '" OwnerNames="'+extAttrs.OwnerNames+'" FlowState="'+extAttrs.FlowState+'" FlowType="'+extAttrs.FlowType+'" FlowClass="3" ' +
           'MainFormId="'+extAttrs.MainFormId+'" MainFormName="'+extAttrs.MainFormName+'" FormMainTableName="'+extAttrs.FormMainTableName+'" FreeAppUserIds="'+extAttrs.FreeAppUserIds+'" FreeAppUserNames="'+extAttrs.FreeAppUserNames+'" FreeBeginUserIds="'+extAttrs.FreeBeginUserIds+'" ' +
           'FreeBeginUserNames="'+extAttrs.FreeBeginUserNames+'" CreateUserId="" CreateUserName="" CreateTime="" LastEditUserId="" LastEditUserName="" LastEditTime="">\n';

    xml += '<Nodes>\n';
    var models = this.getFigures();
    for (var i = 0; i < models.getSize(); i++) {
        var model = models.get(i);
        for (var j = 0; j < DefaultModelTypeEnum.length; j++) {
            if (DefaultModelTypeEnum[j] == model.type) {
                xml = xml + model.toXML();
                break;
            }
        }
    }
    xml += '</Nodes>\n<Arrows>\n';
    var lines = this.getLines();
    for (var i = 0; i < lines.getSize(); i++) {
        var line = lines.get(i);
        for (var j = 0; j < DefaultModelTypeEnum.length; j++) {
            if (DefaultModelTypeEnum[j] == line.type) {
                xml = xml + line.toXML();
                break;
            }
        }
    }
    xml += '</Arrows>\n</sheet>';

    return formatXml(xml);
};
draw2d.MyCanvas.prototype.toXML = function () {
	var xml = '<RAD>\n<Doc>\n<Data>\n<sheets>\n';
	xml += this.toXMLNode();
	xml += '\n</sheets>\n</Data>\n<Result>\n<ResCode>0</ResCode>\n<ResDetail/>\n</Result>\n</Doc>\n</RAD>';
	return formatXml(xml);
};