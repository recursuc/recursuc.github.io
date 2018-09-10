/*
FlowSheet
*/
(function (win) {
    FlowSheet = $C.Create({
        include: [moduleSheet],
        initialize: function (sheet, pSheets) {
            this.setOptions(sheet || {});
            this.DOM = {};
            this.pSheets = pSheets;
            this.pGrid = pSheets.pGrid;
            var editPanel = '<div id="' + this.canvasId  + '" style="position: absolute;width: 1500px; height: 1000px" ></div>';// +
                //'<textarea id="' + this.canvasId + '_descriptor" rows="38" style="width: 100%;height:100%;padding: 0;border: 0;" readonly="readonly"></textarea>';
            this.pSheets.DOM["sheetsContainer"].insertAdjacentHTML("beforeend", "<div class='sheetPane mpb' style='display:block'>" + editPanel + "</div>");
            this.DOM["sheetContainer"] = $ET.lastElementChild(this.pSheets.DOM["sheetsContainer"]);

            this.initFlowDesigner($O.type(sheet) == "xml" ? sheet : sheet.xnSheet);
        },
        setOptions: function (options) {
            this.name = $O.type(options) == "xml" ? options.getAttribute("ChineseName") : options.name;
            this.canvasId = Sequence.create();
        },
        initFlowDesigner: function (xnSheet) {
            workflow = this.workflow = new draw2d.MyCanvas(this.canvasId);
            workflow.scrollArea = this.DOM["sheetContainer"];
            workflow.attrPage = this.pGrid.attrPagePanel;
            if (xnSheet != null) {
                this.parseFlowDefine(xnSheet);
            } else {
                var startObj = new draw2d.Start();
                startObj.id = startObj.eventId = "Start" + Sequence.create();
                startObj.ExtAttributes.Name = "开始1";
                workflow.addFigure(startObj, 200, 200);

                var endObj = new draw2d.End();
                endObj.id = endObj.eventId = "End" + Sequence.create();
                endObj.ExtAttributes.Name = "结束1";
                workflow.addFigure(endObj, 750, 200);

                var task = new draw2d.UserTask();
                task.id = task.taskId = "UserTask" + Sequence.create();
                task.ExtAttributes.Name = "处理1";
                task.setTitle(task.ExtAttributes.Name);
                task.setContent();
                workflow.addFigure(task, 450, 200);
            }
        },
        parseFlowDefine: function (xnSheet) {
            var definitions = xnSheet,
                nodes = definitions.selectSingleNode('.//Nodes'),
                lines = definitions.selectSingleNode('.//Arrows'),
                attrs = definitions.attributes,
                extAttrs = this.workflow.ExtAttributes,
                aName = ["OwnerNames", "FreeAppUserNames", "FreeBeginUserNames"], 
    	    	vName = ["OwnerViewNames", "FreeAppViewNames", "FreeBeginViewNames"],
    	    	aVal;
            
            //流程属性赋值
    	    for(var fi = attrs.length - 1; fi >= 0; fi--){
    	    	extAttrs[attrs[fi].name] = attrs[fi].value;
    	    }
    	    for(var ai = aName.length - 1; ai >= 0; ai--){
    	    	aVal = extAttrs[aName[ai]];
    	    	aVal != "" && (extAttrs[vName[ai]] = aVal.replace(/{/g, "").replace(/}/g, ";"));
    	    }
    	    
    	    //节点描绘
            var node, type, model, 
            aAPIType= ["Before", "End"], aAPILen, aType, 
            apiParams, aNodes, aLen;
            for (var i = nodes.childNodes.length - 1; i >= 0; i--) {
                node = nodes.childNodes[i];
                if(node.nodeType !== 1) continue;
                
                aAPILen = 1,
                type = node.getAttribute('NodeType'),
    	    	formListVal = "",
                xnDataView = node.selectSingleNode('.//DataView');

                switch (type) {
	                case "StartNode" : model = new draw2d.Start(); break;
	                case "EndNode" : model = new draw2d.End(); break;
	                case "ClusterNode" : model = new draw2d.UserTask(); break;
	                case "ActivityNode" : model = new draw2d.Activity(); break;
                }
                
                attrs = node.attributes,
                extAttrs = model.ExtAttributes;
        	    for(var mi = attrs.length - 1; mi >= 0; mi--){
        	    	extAttrs[attrs[mi].name] = attrs[mi].value;
        	    }
        	    
        	    extAttrs["FormTabsId"] = xnDataView.getAttribute("BFormId");
        	    extAttrs["FormTabsName"] =  xnDataView.getAttribute("BFormId");
        	    for(var n = 0, lt = xnDataView.childNodes.length;n < lt; n++){
        	    	var nodeFormState = xnDataView.childNodes[n];
        	    	if(nodeFormState.nodeType == 1){
        	    		var attrs = nodeFormState.attributes;
        	    		formListVal += attrs["FormId"].value + "," + attrs["FormAlias"].value + "," + attrs["FormStateId"].value+ "," + attrs["MainTable"].value + ";";
        	    	}
        	    }
        	    if(formListVal != "")
        	    	extAttrs["FormList"] = formListVal;
        	    
        	    model.id = extAttrs.ClientId,
        	    aVal = extAttrs["AccepterNames"];
        	    aVal != "" && (extAttrs["AccepterViewNames"] = aVal.replace(/{/g, "").replace(/}/g, ";"));
        	    model.setTitle ? 
        	    	(model.setTitle(extAttrs.Name), 
	    			 model.taskId = model.id, 
	    			 aVal = extAttrs["DecisionerManNames"],
	    			 aVal != "" && (extAttrs["DecisionerViewNames"] = aVal.replace(/{/g, "").replace(/}/g, ";"))) 
        	    : 
        	    	(model.eventId = model.id);
        	    
        	    while(aAPILen >= 0){
        	    	aType = aAPIType[aAPILen],
        	    	api = node.selectSingleNode(".//" + aType + "API"),
            	    aAttrs = api.attributes;                    	    	
        	    	for(var pi = aAttrs.length - 1; pi >= 0; pi--){
        	    		extAttrs[aType + aAttrs[pi].name] = aAttrs[pi].value;
            	    }
            	    apiParams = api.selectSingleNode('.//APIParams'),
            	    aNodes = apiParams.childNodes, aLen = aNodes.length - 1;
            	    while(aLen >= 0){
            	    	aNodes[aLen].nodeType == 1 && (extAttrs[aType + "APIPara"] = aNodes[aLen].getAttribute("APIParam"));
            	    	aLen--;
            	    }
            	    aAPILen--;
        	    }
        	    
                workflow.addFigure(model, parseInt(extAttrs.X), parseInt(extAttrs.Y));
            }

            //箭头描绘
            var line, lid, name, sourceRef, targetRef, source, target,
                startPort, endPort, startX, startY, endX, endY,
                sports, tports, si, ti, s, t, x, y, cmd, connection;
            for (var j = lines.childNodes.length - 1; j >= 0; j--) {
                line = lines.childNodes[j];
                if(line.nodeType !== 1) continue;
                
                lid = line.getAttribute('ClientId'),
                name = line.getAttribute('Name'),
                sourceRef = line.getAttribute('StartNodeClientId'),
                targetRef = line.getAttribute('EndNodeClientId'),
                source = workflow.getFigure(sourceRef),
                target = workflow.getFigure(targetRef),

                startPort = null,
                endPort = null,
                startX = line.getAttribute('BeginPointX'),
                startY = line.getAttribute('BeginPointY'),
                endX = line.getAttribute('EndPointX'),
                endY = line.getAttribute('EndPointY'),

                sports = source.getPorts();
                for (si = sports.getSize() - 1; si >= 0; si--) {
                    s = sports.get(si),
                    x = s.getAbsoluteX(),
                    y = s.getAbsoluteY();
                    if (x == startX && y == startY) {
                        startPort = s;
                        break;
                    }
                }

                tports = target.getPorts();
                for (ti = tports.getSize() - 1; ti >= 0; ti--) {
                    t = tports.get(ti),
                    x = t.getAbsoluteX(),
                    y = t.getAbsoluteY();
                    if (x == endX && y == endY) {
                        endPort = t;
                        break;
                    }
                }

                if (startPort != null && endPort != null) {
                    cmd = new draw2d.CommandConnect(workflow, startPort, endPort),
                    connection = new draw2d.DecoratedConnection(),
                    connection.id = lid,
                    connection.lineId = lid,
                    connection.lineName = name;
                    if (lid != name)
                        connection.setLabel(name);
                    cmd.setConnection(connection);
                    workflow.getCommandStack().execute(cmd);
                }
            }
        },
        toString: function () {
            var sb = new StringBuilder();
            sb.append("<sheet type=\"flow\" DbId=\"\" ClientId=\"\" ChineseName=\"\" SelectPageType=\"\" RowNumPerPage=\"\" ColNumPerPage=\"\">");
            sb.append(this.workflow.toXMLNode());
            sb.append("</sheet>");
            return sb.toString();
        },
        addModel: function (sType, x, y, extAttrs) {
        	workflow = this.workflow;
            var model = eval("new draw2d." + sType + ""), 
            curExtAttrs = model.ExtAttributes;
            if(extAttrs){
	            for(var key in extAttrs){
	            	curExtAttrs[key] = extAttrs[key];
	            }
	            curExtAttrs.DbId = "";
	        }
            model.id = sType + Sequence.create();
            curExtAttrs.Name = this.createName(sType);
            model.setTitle ? (model.setTitle(curExtAttrs.Name), model.taskId = model.id) : (model.eventId = model.id);
            this.workflow.addModel(model, x, y);
        },
        createName:function(type){
        	var modelName = {
    			Start:"开始",
    			End:"结束",
    			UserTask:"处理",
    			Activity:"活动",
    			DecoratedConnection:"流向"
        	},
        	wFigures = this.workflow.figures, data = wFigures.data, names = [],
        	num = 1, name = modelName[type] + num;        	
        	for(var i = wFigures.getSize() - 1; i >= 0; i--){
        		data[i].id.test(type) && names.push(data[i].ExtAttributes.Name);
        	}
        	
        	var z = names.length - 1;
        	while(z >= 0){
        		name == names[z] ? (name = modelName[type] + num++) : z--;
        	}
        	
        	return name;
        },
        show: function () {
            this.DOM["sheetContainer"].style.display = "";
        },
        hide: function () {
            this.DOM["sheetContainer"].style.display = "none";
        },
        setAttribute: function () {
        	this.pGrid.attrPagePanel.heIframe.contentWindow.SetForm();
        },
        reback: function () {
        	this.workflow.getCommandStack().undo();
        	this.setAttribute();
        },
        redo: function () {
        	this.workflow.getCommandStack().redo();
        	this.setAttribute();
        },
        cut: function () {
        	var cutObj = this.workflow.currentSelection;
        	cutObj && !cutObj.lineId ?
    			(this.workflow.clipBoard = cutObj,
        		 this.workflow.getCommandStack().execute(new draw2d.CommandDelete(cutObj)))
        	:
        		alert("请选中要剪切的节点！");
        },
        copy: function () {
        	var copyObj = this.workflow.currentSelection;
        	copyObj && !copyObj.lineId ? (this.workflow.clipBoard = copyObj) : alert("请选中要复制的节点！");
        },
        paste: function () {
        	var pasteObj = this.workflow.clipBoard;
        	pasteObj ?
	            (this.addModel(pasteObj.id.replace(/\d/g, ""), pasteObj.x + 15, pasteObj.y + 15, pasteObj.ExtAttributes))
        	:
        		alert("没有可粘贴的节点！");
        },
        resize: function () {
        }
    });

    win.FlowSheet = FlowSheet;
})(window);