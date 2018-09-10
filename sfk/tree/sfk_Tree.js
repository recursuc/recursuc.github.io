/*
    sfk_tree.js by zcj  2012-12-26
    Tree 树对象
    container：树节点所在容器元素
    CM:右键菜单数据对象

    TreeNode 树节点对象
    控制展开和折叠的图标 (+ 或者三角形)；
    显示线的图标(line.gif)； 如果显示线则控制展开和折叠也带有线
    节点自身的图标(默认文件件folder)
*/
(function () {
    var iconType = "plus", E = $E, O = $O, F = $F, ET = $ET,
        doc = document,
        heTxtEdit = null, nodeEdit = null,
        imgBasePath = "skin/blue/images/tree",
        folderopen = "/folderopen.gif", // 节点的展开和折叠图片路径
        folder = "/folder.gif",
        paddingLeft = 20, count = 0, uniqueId;

    TreeNode = $C.Create({
        initialize: function (options, pNode) {
            // 节点处理信息
            this.heNode = null;
            this.heSelf = null;
            this.heChildren = null;
            this.state = "expand";
            this.checked = 0;
            this.tree = null; // 所属那棵树
            this.isLeaf = true;
            this.pNode = pNode || null;
            this.previousSiblingNode = null;
            this.nextSiblingNode = null;
            this.childNodes = [];
            this.childCount = 0;
            this.level = 0;
            this.index = -1;

            options && this.setOptions(options);
        },
        setOptions: function (options, pNode) {
            // O.getType(options.data) == "object" && O.extend(this,
            // options.data);
            this.id = options.id || (uniqueId + "_" + count++);
            this.data = options.data;
            this.link = options.link;
            this.text = options.text || "";
            this.tips = options.tips || options.text;
            this.imgSrc = options.imgSrc; // 自身图标
            this.expandSrc = this.imgSrc || folderopen;
            this.collapseSrc = this.imgSrc || folder;
            this.showCheck = options.showCheck;
            options.isLeaf === false && (this.isLeaf = false);
            this.data = options.data || null;
            for (var prop in options.data) {
                (prop in this) || (this[prop] = options.data[prop]);
            }
            // this.onClick = options.onClick;
            // this.showLine = options.showLine;
        },
        createHtml: function (ecImgSrc) {// bLine, pNode, bLeaf
            var sChk = sImg = "", oNode;
            this.showCheck === false || (this.showCheck = this.tree.showCheck);
            this.showCheck && (sChk = "<input type='checkbox'/>");

            this.heNode = document.createElement("div");
            this.heNode.innerHTML = "<div id='" + this.id + "' class='tree_title' style='height:" + paddingLeft + "px;'>" + sChk + "<img src='" + this.expandSrc + "' class='tree_icon'/><span title='" + this.tips + "' class='tree_text'>" + this.text + "</span>";

            oNode = this.heSelf = this.heNode.firstChild;
            if (this.showCheck) {
                this.heCheck = oNode.children[0];
                $E.on(this.heCheck, "click", this.checkHandle, this);
                this.icon = oNode.children[1];
            } else {
                this.icon = oNode.children[0];
            }
            this.heContent = oNode.lastChild;
            E.on(this.icon, "click", this.toggle, this);
            E.on(this.heContent, "mouseover", this.mouseover, this);
            E.on(this.heContent, "mouseout", this.mouseout, this);
            this.tree.contentEditable && E.on(this.heContent, "dblclick", this.txtPosition, this);
            // $E.on(this.heContent, "click", this.clickHandle, this);
            // 添加默认展开折叠图标
            this.heECImg = document.createElement("img");
            this.heECImg.style.visibility = "hidden";
            ecImgSrc && (this.heECImg.src = ecImgSrc);
            this.heSelf.insertBefore(this.heECImg, this.heSelf.firstChild);
            $E.on(this.heECImg, "click", this.toggle, this);
            return this.heNode;
        },
        addLine: function () {
            if (this.heChildren) {
                this.heChildren.style.backgroundImage = "url(" + this.tree.vertline + ")";
                this.heChildren.style.backgroundRepeat = "repeat-y";
            }
            return;
            /*
            * 废弃 采用垂直重复铺图片 if (!this.tree.showLine) return; var node = this,
            * sDiv, total = 0; while (node.pNode && node.pNode.nextSiblingNode &&
            * node.pNode.level != 0) { total = total + paddingLeft; node =
            * node.pNode; }
            * 
            * if (this.heLine) { this.heLine.style.paddingLeft = -total + "px";
            * this.heLine.style.width = -total + "px"; } else { sDiv = '<div
            * style="position: absolute; margin-left:-' + total + 'px;
            * background-image: url(images/vertline.gif); width:' + total +
            * 'px; height: 20px;"></div>';
            * this.heSelf.insertAdjacentHTML("afterbegin", sDiv); this.heLine =
            * this.heNode.firstChild; }
            */
        },
        toggle: function (evt) {
            //evt && evt.preventDefault();
            evt && evt.type == "dblclick" && (window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty());
            this.state == "fold" ? this.expand() : this.fold();
        },
        fold: function () {
            var tree = this.tree;
            this.icon && (this.icon.src = this.collapseSrc);
            if (!this.isLeaf && this.heECImg) {
                tree.showLine ?
                    !this.previousSiblingNode && this.level == 1 ?
                        !this.nextSiblingNode ?
                            (this.heECImg.src = tree.collapseNull)
                        : (this.heECImg.src = tree.collapseRoot)
                    : (this.heECImg.src = tree.collapseLast)
                : (this.heECImg.src = tree.collapseSrc);
            }

            this.heChildren && (this.heChildren.style.display = "none");
            this.state = "fold";
        },
        expand: function () {
            var tree = this.tree;
            this.icon && (this.icon.src = this.expandSrc);
            if (!this.isLeaf && this.heECImg) {
                tree.showLine ?
                    !this.previousSiblingNode && this.level == 1 ?
                         !this.nextSiblingNode ?
                            (this.heECImg.src = tree.expandNull)
                        : (this.heECImg.src = tree.expandRoot)
                    : (this.heECImg.src = tree.expandLast)
                : (this.heECImg.src = tree.expandSrc);
            }
            this.heChildren && (this.heChildren.style.display = "");
            this.state = "expand";
        },
        setText: function (sText) {
            return sText ? (ET.text(this.heContent, sText), this.heContent.title = this.text = sText) : this.text;
        },
        mouseover: function () {
            this.heContent.style.backgroundColor = "#FFE8A6";
        },
        mouseout: function () {
            this.heContent.style.backgroundColor = "";
        },
        txtPosition: function () {
            var rect = ET.getRect(this.heContent);
            nodeEdit = this;
            heTxtEdit.value = ET.text(this.heContent);
            $ET.setCSS(heTxtEdit, {
                display: "",
                left: rect.left + "px",
                top: rect.top + "px",
                //width: rect.width + 30 + "px",
                height: rect.height + "px", //parseInt(Common.getStyle(oTd, "borderRightWidth"))
                //border: bw + "px double  #7DB3F3",
                zIndex: 1000
            });
            heTxtEdit.size = heTxtEdit.value.length;
            heTxtEdit.focus();
            heTxtEdit.select();
        },
        createHeChildren: function () {
            if (!this.heChildren) {
                this.heChildren = document.createElement('div');
                // !this.line &&
                this.heChildren.style.paddingLeft = paddingLeft + "px";
                // this.heChildren.style.overflow = "auto";
                // (this.heChildren.className = 'tree_childnodes');
                this.heNode.appendChild(this.heChildren);
            }
        },
        update: function () {
        },
        setLine: function () {

        },
        clickHandle: function (evt) {
            var tree = this.tree;
            tree.onClick && tree.onClick(evt, this);
        },
        findTree: function () {
            var node = this;
            while (node.pNode != null) { node = node.pNode; }
            return node;
        },
        setLeaf: function () {
            this.heLine && (this.heLine.src = imgBasePath + "/line.gif");
        },
        setFirstChild: function () {
            this.heLine && (this.heLine.src = imgBasePath + "/collapse_root.gif");
        },
        setLastChild: function () {
            this.heLine && (this.heLine.src = imgBasePath + "/collapse_last.gif");
        },
        setExpandCollapseImg: function () {
            if (this.heECImg) {
                this.previousSiblingNode == null ?
        				this.nextSiblingNode == null ?
        						(this.heECImg.src = this.tree.expandNull)
        				: this.level == 1 ?
        						(this.heECImg.src = this.tree.expandRoot)
        				  : (this.heECImg.src = this.tree.expandLast)
        		: (this.heECImg.src = this.tree.expandLast);
            }
        },
        appendChild: function (node) {
            if (!Tree.isNode(node)) { return; }
            node.pNode && node.pNode != this && node.pNode.removeChild(node);
            // 新建或更新节点间关系
            var lastIndex = this.childNodes.length - 1,
                psn = lastIndex > -1 ? this.childNodes[lastIndex] : null;
            node.pNode = this;
            node.tree = this.tree;
            node.level = this.level + 1;
            this.isLeaf = false;
            this.childNodes.push(node);

            node.previousSiblingNode = psn;
            psn && (psn.nextSiblingNode = node);
            node.nextSiblingNode = null;

            // 更新或生成UI
            node.heNode || node.createHtml(node.isLeaf ? node.tree.lineLast : node.tree.expandLast);
            this.createHeChildren();
            this.heChildren.appendChild(node.heNode);

            // 修改图标类型 线
            var tree = node.tree;
            if (node.tree.showLine) {
                if (!psn) {// 首次添加孩子
                    if (node.level == 1) {
                        if (node.isLeaf && node.childNodes.length == 0) {
                            node.heECImg.src = node.tree.lineNull;
                        } else {
                            node.heECImg.src = node.tree.expandNull;
                        }
                    }
                    if (this.heECImg) {
                        this.previousSiblingNode == null ?
                				this.nextSiblingNode == null ?
                						(this.heECImg.src = this.tree.expandNull)
                				: this.level == 1 ?
                						(this.heECImg.src = this.tree.expandRoot)
                				  : (this.heECImg.src = this.tree.expandLast)
                		: (this.heECImg.src = this.tree.expandLast); //
                    }
                    this.nextSiblingNode && this.addLine(); // 层级遍历
                } else {
                    if (psn.isLeaf && psn.childNodes.length == 0) {
                        psn.previousSiblingNode == null && psn.level == 1 ? (psn.heECImg.src = psn.tree.lineRoot) : (psn.heECImg.src = psn.tree.line);
                    } else {
                        psn.previousSiblingNode == null && psn.level == 1 ? (psn.heECImg.src = psn.tree.expandRoot) : (psn.heECImg.src = psn.tree.expandLast);
                        psn.addLine(); // 深度遍历
                    }
                }
                node.heECImg.style.visibility = "";
            }

            return node;
        },
        findChildNode: function (node) {
            for (var i = 0, len = this.childNodes.length; i < len; i++) {
                if (this.childNodes[i] == node) {
                    return i;
                }
            }
            return -1;
        },
        insertBefore: function (newNode, refNode) {
            if (!refNode) {
                return this.appendChild(newNode);
            }
            if (refNode.pNode != this) {
                throw "refNode not child！";
            }

            this.isLeaf = false;
            newNode.level = this.level + 1;
            newNode.pNode = this;
            newNode.tree = this.tree;

            var index = this.findChildNode(refNode), psn = refNode.previousSiblingNode;
            this.childNodes.splice(index, 0, newNode);

            newNode.nextSiblingNode = refNode;
            newNode.previousSiblingNode = psn;
            psn && (psn.nextSiblingNode = newNode);
            refNode.previousSiblingNode = newNode;

            // 更新或生成UI
            newNode.heNode || newNode.createHtml(newNode.tree.lineLast);
            this.heChildren.insertBefore(newNode.heNode, refNode.heNode);

            // 修改图标类型 线
            if (newNode.tree.showLine) {
                newNode.heECImg.src = newNode.tree.line;
                newNode.heECImg.style.visibility = "";

                // this.addLine();
            }

            return newNode;
        },
        removeChild: function (node) {
            if (!Tree.isNode(node)) { throw "must node"; }
            node.remove();
        },
        remove: function () {
            var psn = this.previousSiblingNode, nsn = this.nextSiblingNode;
            psn && (psn.nextSiblingNode = nsn);
            nsn && (nsn.previousSiblingNode = psn);
            var index = this.pNode.findChildNode(this);
            this.pNode.childNodes.splice(index, 1);

            this.pNode.heChildren.removeChild(this.heNode);
            this.pNode = null;
        },
        appendTo: function (pNode) {
            pNode && PNode.appendChild(this);
        },
        updateIndex: function (index) {

        },
        checkHandle: function (evt) {
            this.heCheck.checked ? this.selected() : this.unSelected();
        },
        selected: function () {
            if (!this.showCheck) { return; }
            this.checkedNode(2);
            this.selectedChild(2);

            this.selectedParentBySelf(this.pNode, 2);
        },
        selectedParentBySelf: function (pNode, iVal) {// 自己的checked状态0 或 2
            switch (iVal) {
                case 0:
                    {
                        while (pNode && pNode.level != 0) {
                            for (var i = 0, len = pNode.childNodes.length; i < len; i++) {
                                if (pNode.childNodes[i].checked == 2 || pNode.childNodes[i].checked == 1) {
                                    this.selectedParentBySelf(pNode, 1);
                                    return;
                                }
                            }
                            pNode.checkedNode(0);
                            pNode = pNode.pNode;
                        }
                        break;
                    }
                case 1: // 部分选中
                    {
                        while (pNode && pNode.level != 0) {
                            pNode.checkedNode(1);
                            pNode = pNode.pNode;
                        }
                        break;
                    }
                case 2:
                    {
                        while (pNode && pNode.level != 0) {
                            for (var i = 0, len = pNode.childNodes.length; i < len; i++) {
                                if (pNode.childNodes[i].checked != 2) {
                                    this.selectedParentBySelf(pNode, 1);
                                    return;
                                }
                            }
                            pNode.checkedNode(2);
                            pNode = pNode.pNode;
                        }
                        break;
                    }
                default:
                    throw "must 1-2 digital!";
            }
        },
        selectedChild: function (iVal) {
            if (!this.showCheck) { return; }
            this.checkedNode(iVal);
            for (var i = 0, len = this.childNodes.length; i < len; i++) {             
                this.childNodes[i].selectedChild(iVal);
            }
        },
        checkedNode: function (iVal) {
            if (!this.showCheck) { return; }

            switch (iVal) {
                case 0:
                    {
                        this.checked = 0;
                        this.heCheck.checked = false;
                        this.heCheck.indeterminate = false;
                        break;
                    }
                case 1: // 部分选中
                    {
                        this.checked = 1;
                        this.heCheck.checked = true;
                        this.heCheck.indeterminate = true;
                        break;
                    }
                case 2:
                    {
                        this.checked = 2;
                        this.heCheck.checked = true;
                        this.heCheck.indeterminate = false;
                        break;
                    }
                default:
                    throw "must 1-2 digital!";
            }
        },
        unSelected: function () {
            if (!this.showCheck) { return; }

            this.checkedNode(0);
            this.selectedChild(0);

            this.selectedParentBySelf(this.pNode, 0);
        },
        contains: function (node) {
            while (node && node.level > this.level) {
                if (node.pNode == this) {
                    return true;
                }
                node = node.pNode;
            }
            return false;
            /*
            * //父找子 for (var i = 0; i < this.childNodes.length; i++) { if
            * (this.childNodes[i] == node || this.childNodes[i].contains(node)) {
            * return true; } }
            */

            return false;
        },
        highlight: function () {
            this.heContent.style.color = "red";
        },
        unHighlight: function () {
            this.heContent.style.color = "";
        },
        setData: function (data) {
            this.data = data;
        }
    }),
    Tree = $C.Create({
        initialize: function (options) {
            var self = this,
                key = "root", roots;

            uniqueId = new Date().getTime();
            options.imgBasePath && (imgBasePath = options.imgBasePath);
            folderopen = imgBasePath + "folderopen.gif"; // 节点的展开和折叠图片路径
            folder = imgBasePath + "folder.gif";

            this.container = (options.container ?
                                typeof options.container == "string" ?
                                    document.getElementById(options.container) :
                                options.container
                            : document.body);

            this.showLevel = options.showLevel;
            if (!options.roots) {
                alert('没有找到根节点!');
            }
            this.contentEditable = options.contentEditable === true;
            this.onClick = options.onClick;
            this.showCheck = !!options.showCheck;
            this.showLine = !!options.showLine;
            this.onShowCM = options.onShowCM;
            this.enableCM = !!options.enableCM;
            this.contentEditable = !!options.contentEditable;

            if (options.CM) {
                this.srcHidden = options.CM.onHidden;
                options.CM.onHidden = $F.bind(this, this.cmHidden);
                this.CM = new ContextMenu(options.CM);
            }
            if (options.iconType == 0) {// "plus"
                if (!this.showLine) {
                    this.collapseSrc = imgBasePath + "collapse.gif";
                    this.expandSrc = imgBasePath + "expand.gif";
                } else {
                    this.collapseLast = imgBasePath + "collapse_last.gif";
                    this.collapseNull = imgBasePath + "collapse_null.gif";
                    this.collapseRoot = imgBasePath + "collapse_root.gif";

                    this.expandLast = imgBasePath + "expand_last.gif";
                    this.expandNull = imgBasePath + "expand_null.gif";
                    this.expandRoot = imgBasePath + "expand_root.gif";

                    this.lineLast = imgBasePath + "line_last.gif";
                    this.lineNull = imgBasePath + "line_null.gif";
                    this.line = imgBasePath + "line.gif";
                    this.vertline = imgBasePath + "vertline.gif";
                    this.lineRoot = imgBasePath + "line_root.gif";
                }
            } else if (options.iconType == 1) {// "triangel"
                this.collapseSrc = imgBasePath + "triangel_fold.gif";
                this.expandSrc = imgBasePath + "triangel_expand.gif";
                if (this.showLine) {
                    this.collapseRoot = this.collapseNull = this.collapseLast = this.collapseSrc;
                    this.expandRoot = this.expandNull = this.expandLast = this.expandSrc;

                    this.lineLast = imgBasePath + "line_last.gif";
                    this.lineNull = imgBasePath + "line_null.gif";
                    this.line = imgBasePath + "line.gif";
                    this.vertline = imgBasePath + "vertline.gif";
                    this.lineRoot = imgBasePath + "line_root.gif";
                }
            }

            this.activeNodes = [];
            this.root = new TreeNode();
            this.root.tree = this;
            this.root.heChildren = this.root.heNode = this.container;
            this.root.heNode.style.padding = "3px";
            this.root.level = 0;
            this.root.uniqueId = "";
            this.root.pNode = this;
            roots = options.roots;
            this.fnBindCM = F.bind(this, this.setCM);
            this.showLine ? this.appendByLevel(options.roots, this.root) : this.addNode(options.roots, this.root);
            // this.expand(this.showLevel);
            if (this.contentEditable) {
                if (!heTxtEdit) {
                    heTxtEdit = document.createElement("input");
                    heTxtEdit.type = "text";
                    heTxtEdit.style.position = "absolute";
                    heTxtEdit.style.display = "none";
                    document.body.appendChild(heTxtEdit);
                    //E.on(heTxtEdit, "keydown", function (evt) {
                    //    //var chr = String.fromCharCode(evt.keyCode), selText;
                    //    //alert(heTxtEdit.value)
                    //    //console.log(evt.keyCode + "   " + chr);
                    //    if (evt.keyCode != 8) {
                    //        heTxtEdit.size = heTxtEdit.value.length + 2; //.replace(/[A-Z\u4e00-\u9fa5]/, "**")
                    //    } else {
                    //        if (heTxtEdit.value.length > 0 && (heTxtEdit.selectionStart != 0 && heTxtEdit.selectionEnd != 0)) {
                    //            if (window.getSelection) {  // all browsers, except IE before version 9
                    //                selText = heTxtEdit.value.substring(heTxtEdit.selectionStart, heTxtEdit.selectionEnd);
                    //            } else if (document.selection.createRange) {       // Internet Explorer
                    //                var range = document.selection.createRange();
                    //                selText = range.text;
                    //            }
                    //            var len = heTxtEdit.value.length - (selText.length == 0 ? 1 : selText.length);
                    //            heTxtEdit.size = len ? len : 5; // (selText == "" ? 1 : selText.replace(/[A-Z\u4e00-\u9fa5]/, "**").length);
                    //        }
                    //    }
                    //});

                    E.on(heTxtEdit, "keyup", function (evt) {
                        heTxtEdit.size = heTxtEdit.value.replace(/[A-Z\u4e00-\u9fa5]/g, "**").length + 3; //
                    });

                    E.on(heTxtEdit, "blur", function (evt) {
                        if (nodeEdit) {
                            heTxtEdit.value != nodeEdit.text && nodeEdit.setText(heTxtEdit.value);
                            heTxtEdit.style.display = "none";
                            nodeEdit = null;
                        }
                    });
                }
                this.heTxtEdit = heTxtEdit;
            }
        },
        expand: function (level) {
            var node, queue = [this.root], i, len;
            level || (level = 2);

            while (queue.length > 0) {
                node = queue.shift();
                node.level < level ? node.expand() : node.fold();

                for (i = 0, len = node.childNodes.length; i < len; i++) {
                    queue.push(node.childNodes[i]);
                }
            }
        },
        findById: function (uniId, refNode) {// 从refnode开始找
            refNode = refNode || this.root;
            refNode.uniqueId = this.getUniqueId(refNode);
            var index = refNode.uniqueId.length + 1, node, i, len;

            if ($S.startWidth(uniId, refNode.uniqueId)) {
                if (refNode.uniqueId.length == refNode.uniqueId.length) {
                    return refNode;
                }
                while (index < uniId.length) {
                    refNode = refNode.childNodes[uniId.charAt(index)];
                    if (!refNode) {
                        return null;
                    }
                    index += 2;
                }
                return refNode;
            }

            return null;
        },
        findByContent: function (fnFilter, refNode) {// 从refnode开始找
            refNode = refNode || this.root;
            var sText, queue = [refNode], node, i, len, res = [], handle;
            typeof fnFilter != "function" && (sText = fnFilter, fnFilter = function (sContent) { return sContent == sText; });
            while (queue.length > 0) {
                node = queue.shift();
                handle = fnFilter(node.text);
                if (handle !== false) { // == sText
                    res.push(node);
                    if (handle == 1) {// 只找一个
                        return node;
                    }
                }
                for (i = 0, len = node.childNodes.length; i < len; i++) {
                    queue.push(node.childNodes[i]);
                }
            }

            return res;
        },
        getUniqueId: function (node) {
            var sPath = "";
            while (node != this.root) {
                sPath = node.index + sPath;
                node = node.pNode;
                if (!node) {
                    sPath = "_" + sPath;
                } else {
                    break;
                }
            }

            return sPath;
        },
        uniqueId: function (uniqueId, i) {
            this.uniqueId = function (uniqueId, i) {
                return uniqueId + "_" + i;
            }
            return i;
        },
        addNode: function (options, pNode) {
            if (options) {
                $O.getType(options) != "array" && (options = [options]);
                var first;
                for (var node, i = 0, len = options.length; i < len; i++) {
                    node = new TreeNode(options[i], pNode);
                    pNode.appendChild(node);

                    first || (first = node);
                    this.CM && E.on(node.heContent, "mousedown", this.cmHandle, this, node);
                    // node.heSelf.setAttribute("level", level);
                    this.addNode(options[i].childNodes, node);
                }

                return first;
            }
            return null;
        },
        appendByLevel: function (options, pNode) {
            if (!options) { return null; }
            $O.getType(options) != "array" && (options = [options]);
            var first = null, queue = options.slice(0), data, node, ecm = (this.CM || this.onShowCM);
            while (queue.length > 0) {
                data = queue.shift();
                if (Tree.isNode(data)) {
                    pNode = data;
                    continue;
                }
                node = new TreeNode(data, pNode); first || (first = node);
                pNode.appendChild(node);
                ecm && E.on(node.heContent, "mousedown", this.cmHandle, this, node);
                if (data.childNodes) {
                    queue.push(node);
                    for (var i = 0, len = data.childNodes.length; i < len; i++) {
                        queue.push(data.childNodes[i]);
                    }
                }
            }
            return first;
        },
        insert: function (options, refNode, sDir) {
            if (!options) { return null; }
            sDir || (sDir = "LC");
            $O.getType(options) != "array" && (options = [options]);
            switch (sDir) {
                case "PS": // PREIOUS_SIBLING
                    {
                        var pNode = refNode.pNode, first;
                        for (var node, i = 0, len = options.length; i < len; i++) {
                            node = new TreeNode(options[i], pNode);
                            first || (first = node);
                            pNode.insertBefore(node, refNode);
                            this.CM && $E.on(node.heContent, "mousedown", this.cmHandle, this, node);
                            this.showLine ? this.appendByLevel(options[i].childNodes, node) : this.addNode(options[i].childNodes, node);
                        }

                        return first;
                    }
                case "NS": // NEXT_SIBLING
                    {
                        return refNode.nextSiblingNode ? this.insert(options, refNode.nextSiblingNode, "PS") : this.insert(options, refNode.pNode, "LC");
                    }
                case "FC": // FIRST_CHILD
                    {
                        return refNode.childNodes[0] ? this.insert(options, refNode.childNodes[0], "PS") : this.addNode(options, refNode);
                    }
                case "LC": // LAST_CHILD
                    {
                        return this.addNode(options, refNode);
                    }
                default: break;
            }

            return null;
        },
        deleteNode: function (uniId) {
            var res = this.findById(uniId), node;
            for (var i = 0, len = res.length; i < len; i++) {
                node = res[i];
                node.pNode.removeChild(node);
            }
        },
        cmHandle: function (evt, node) {
            var bFound = this.isExist(node);
            if (evt.button != 2 || !bFound) {
                this.highlight(node, evt.ctrlKey);
                if (evt.button == 0) {
                    this.onClick && this.onClick(evt, node);
                } else {
                    if (evt.button == 1) {
                        this.onClick && this.onClick(evt, node);
                    }
                }
            }
            // this.CM.data = node;
            if (evt.button == 2 && this.enableCM) {
                var res = true;
                this.onShowCM && this.onShowCM(evt, this.activeNodes, this.fnBindCM) === false && (res = false); //onShowCM可以改变右键实例
                res && this.CM.showHandle(evt, this.activeNodes);
            };
            evt.stopPropagation();
            // alert(node.level);
        },
        isCM: function (cmObj) {
            return cmObj && typeof cmObj.showHandle == "function";
        },
        setCM: function (cmObj) {
            if (this.isCM(cmObj)) {
                this.CM != cmObj && (this.CM = cmObj);
                return true;
            }
            return false;
        },
        highlight: function (node, multiple) {
            var i = 0, found = false;
            if (multiple) {
                while (i < this.activeNodes.length) {
                    if (this.activeNodes[i] == node) {
                        found = true;
                        this.activeNodes[i].unHighlight();
                        this.activeNodes.splice(i, 1);
                        break;
                    }
                    i++;
                }
            } else {
                while (i < this.activeNodes.length) {
                    if (this.activeNodes[i] != node) {
                        this.activeNodes[i].unHighlight();
                        this.activeNodes.splice(i, 1);
                        continue;
                    }
                    i++;
                }
                found = this.activeNodes.length > 0; // this.activeNodes.length
                // == 0 &&
                // (this.activeNodes.push(node),
                // node.highlight());
            }

            !found && (this.activeNodes.push(node), node.highlight());
        },
        cmHidden: function (evt, nodes) {
            if (nodes) {
                $O.getType(nodes) != "array" && (nodes = [nodes]);
                for (var i = 0, len = nodes.length; i < len; i++) {
                    nodes[i].heContent.style.color = "";
                }
            }

            this.srcHidden && this.srcHidden();
            this.activeNodes.length = 0;
        },
        isExist: function (node) {
            for (var i = 0, len = this.activeNodes.length; i < len; i++) {
                if (this.activeNodes[i] == node) {
                    return true;
                }
            }
            return false;
        }
    });
    Tree.isNode = function (node) {
        return node && node.constructor == TreeNode;
    }
    window.Tree = Tree;
})();


/*
* findNode: function (uniId, refNode) {//从refnode开始找 refNode = refNode ||
* this.root; var index = refNode.uniqueId.length + 1, queue = [refNode], node,
* i, len;
* 
* //while (queue.length > 0) { // node = queue.shift(); // if
* (node.uniqueId.charAt(index) == uniId.charAt(index)) { // if (index + 1 ==
* uniId.length) { // return node; // } // index += 2; // for (i = 0, len =
* node.childNodes.length; i < len; i++) { // queue.push(node.childNodes[i]); // } // }
* //}
* 
* //var seachNode = function (uniId, index) { // var curNode; // for (i = 0,
* len = refNode.childNodes.length; i < len; i++) { // curNode =
* refNode.childNodes[i]; // if (curNode.uniqueId.charAt(index) ==
* uniId.charAt(index)) { // if (index + 1 == uniId.length) { // return curNode; // } //
* findNode(curNode, index + 2); // } // } // return null; //} (uniId, index);
* 
* return seachNode; },
* 
*/