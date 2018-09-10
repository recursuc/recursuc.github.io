/*
    sfk_accordion.js by zcj  2012-12-26
    
 
*/
(function () {
    var Accordion = $C.Create({
        initialize: function (options) {
            this.setOptions(options);
            this.panels = [];
            this.heTarget = this.options.target;
            this.heContainer = this.options.container;
            this.mode = this.options.mode;
            this.active = this.options.active;
            this.activePanel = null;

            var children = this.heTarget.children;
            this._expandOrFoldHandle = $F.bind(this, this.expandOrFold);
            this.totalTitleH = 0;
            for (var i = 0, len = children.length; i < len; i++) {
                var panel = this.makePanle(children[i].children[0]);
                if (panel != null) {
                    this.panels.push(panel);
                }
                this.totalTitleH += panel.heTarget.parentNode.offsetHeight; //panel.target.offsetHeight;
            }

            this.repaire();
        },
        setOptions: function (options) {
            this.options = {
                target: null,
                container: null,
                titleStyle: {},
                contentStyle: {},
                multiple: false,
                active: -1,
                mode: 1, //自动高度， 充满容器
                maxHeight: document.body.clientHeight
            };
            $O.extend(this.options, options || {});
        },
        getContainerSize: function () {
            return {
                height: this.heContainer.clientHeight || $ET.getStyleByPx(this.heContainer, "height"),
                width: this.heContainer.clientWidth || $ET.getStyleByPx(this.heContainer, "width")
            };
        },
        repaire: function () {
            var panel;
            if (this.heContainer) {
                var containerSize = this.getContainerSize(), pcH = containerSize.height - this.totalTitleH - $ET.getStyleByPx(this.heTarget, "marginTop") - $ET.getStyleByPx(this.heTarget, "marginBottom");
                if (!this.mode || pcH < 5) {
                    this.heContainer.style.overflow = "auto";
                    for (var i = 0, len = this.panels.length; i < len; i++) {
                        i != this.active && this.panels[i].fold();
                    }
                } else {
                    var hide = false, heTt = this.heTarget, heNSN = heTt.nextSibling, dispaly = null, shwoDiv = null;
                    while ($ET.getStyle(heTt, "display") != "none") {
                        heTt = heTt.parentNode;
                    }
                    if (heTt.nodeName != "BODY") {
                        hide = true;
                    }
                    if (hide) {
                        shwoDiv = document.createElement("div");
                        shwoDiv.style.width = containerSize.width + "px";
                        shwoDiv.style.height = containerSize.height + "px";
                        shwoDiv.style.visibility = "hidden";
                        display = $ET.getStyle(heTt, "display");
                        display == "none" && (heTt.style.display = "");
                        shwoDiv.appendChild(heTt);
                        document.body.insertBefore(shwoDiv, null);
                        for (var i = 0, len = heTt.children.length; i < len; i++) {
                            pcH -= heTt.children[i].offsetHeight; //panel.target.offsetHeight;
                        }
                    }
                    for (var i = 0, len = this.panels.length; i < len; i++) {
                        panel = this.panels[i]; showHandle = false;
                        panel.expand();
                        if (panel.heContent.clientHeight > pcH) {
                            panel.heContent.style.height = pcH + "px";
                            panel.heContent.style.overflow = "auto";
                        }
                        i != this.active ? panel.fold() : (this.activePanel = panel);
                    }
                    if (shwoDiv) {
                        dispaly != null && (heTt.style.display = display, dispaly = null);
                        this.heContainer.insertBefore(heTt, heNSN);
                        document.body.removeChild(shwoDiv);
                        shwoDiv = null;
                    }
                    /*  
            		     
                    for (var i = 0, len = this.panels.length; i < len; i++) {
                    panel = this.panels[i]; showHandle = false;
                    i == this.active && panel.expand();
                         
                    if(!panel.heContent.clientHeight){
                    showHandle = true;
                    heCP = panel.heContent.parentNode ; 
                    heNSN = panel.heContent.nextSibling;
                    pos = $ET.getStyle(panel.heContent, "position");
                    visibility =  $ET.getStyle(panel.heContent, "visibility");
                    panel.heContent.style.position = "relative";
                    panel.heContent.style.width  = containerSize.width + "px";
                    if( $ET.getStyle(panel.heContent, "display") == "none"){
                    panel.heContent.style.display = "";
                    display = "none";
                    }              
                    document.body.insertBefore(panel.heContent,  null);
                    }
                         
                     
                    if (panel.heContent.clientHeight > pcH) {
                    panel.heContent.style.height = pcH + "px";
                    panel.heContent.style.overflow="auto";
                    }
                          
                    if(showHandle){
                    panel.heContent.style.position = pos;
                    panel.heContent.style.width = "auto";
                    //panel.heContent.style.visibility = visibility;
                    heCP.insertBefore(panel.heContent,  heNSN);
                    display != null && ( panel.heContent.style.display = display, display = null);
                    } 
                          
                    }   
                    }else{ 
                	
                    }*/

                }
            }
        },
        makePanle: function (target) {
            var panel = null;
            if (target && target.nodeName) {
                panel = new Panel({
                    target: target,
                    state: "undock",
                    drag: target.children[0],
                    style: false,
                    //titleEvtType: "click",
                    titleHandle: this._expandOrFoldHandle,
                    title_oper: [
                            {
                                tagType: "a",
                                text: "on",
                                style: null,
                                onclick: this._expandOrFoldHandle
                            }
                ],
                    enableResize: false,
                    enableDrag: false,
                    container: this.heContainer
                });
                panel.heTitle.style.height = 20 + "px";
                panel.fold();
                p = target.parentNode;
                while (p != this.heTarget && p.nodeName != "BODY") {
                    p = p.parentNode;
                }

                if (p.nodeName == "BODY") {
                    this.addLi(target);
                }
                return panel;
            }
            return null;
        },
        addLi: function (node) {
            var heLI = document.createElement("li");
            heLi.appendChild(node);

            this.heTarget.appendChild(heLI);
        },
        expandOrFold: function (evt, panel) {
            panel.expandOrFold();
            this.activePanel && (this.activePanel != panel) && this.activePanel.fold();
            this.activePanel = panel;
            evt.stopPropagation();
            //if (!this.options.multiple) {
            //    this.activePanel.length > 0 && this.activePanel[0].fold();
            //    this.activePanel.push(panel);
            //}
        },
        foldAll: function () {
            for (var i = 0; i < this.panels.length; i++) {
                this.panels[i].fold();
            }
        }, expandAll: function () {
            for (var i = 0; i < this.panels.length; i++) {
                this.panels[i].expand();
            }
        }
    });

    window.Accordion = Accordion;
})()
