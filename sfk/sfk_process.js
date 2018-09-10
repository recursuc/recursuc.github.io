var ProcessBar = function (iDelay) {
    if ($("#divLoading") != null) {
        return;
    }
    this.container = document.createElement("div");
    this.container.id = "divLoading";
    this.container.style.position = "absolute";
    this.container.style.diplay = "none";
    this.oImg = document.createElement("img");
    this.oImg.src = "skins/blue/images/run_progress_bar.gif";
    this.oImg.alt = "Loading";
    this.container.appendChild(this.oImg);

    this.oP = document.createElement("p");
    this.oP.style.fontSize = "12px";
    this.oP.innerText = "加载中,请稍等……";
    this.container.appendChild(this.oP);
    document.body.appendChild(this.container);

    this.iDelay = 350;
}

ProcessBar.prototype = {
    initProcess: function (iCurSeq) {
        if (this.container != null && this.container.style.display == "none") this.container.style.display = "block";
        var arrDis = this.sDis.split(""),
                 iLen = arrDis.length,
                 iCur = iCurSeq,
                 iForward = 1,
                 iPLen = parseInt(this.oP.style.fontSize) * iLen;

        this.oImg.style.marginLeft = Math.floor((iPLen - oImg.width) / 2).toString() + "px";
        this.container.style.left = Math.round((document.body.offsetWidth - Math.max(this.oImg.width, iPLen)) / 2).toString() + "px";
        this.container.style.top = Math.round((document.body.offsetHeight - Math.max(this.oImg.height, parseInt(this.oP.style.fontSize))) / 2).toString() + "px";

        return function () {
            if (iForward == 1) {
                if (iCur < iLen) {
                    this.oP.innerText += arrDis[iCur++];
                } else {
                    iForward *= -1;
                }
            } else {
                if (iCur >= 0) {
                    this.oP.innerText = this.sDis.substring(0, iCur--);
                } else {
                    iForward *= -1;
                    iCur = 0;
                }
            }
        };
    },
    show: function (sDisText, sDelay) {
        if (!this.isExist()) return;

        this.oP.innerText = sDisText;
        this.iDelay = sDelay;
        var fnDis = this.initProcess(0);
        this.iInterId = window.setInterval(fnDis, 350);
    },
    stop: function (sDisText) {
        if (!this.isExist()) return;

        if (this.iInterId) {
            window.clearInterval(this.iInterId);
        }
        this.oP.innerText = sDisText || "已成功!";
        this.container.style.display = "none";
    },
    isExist: function () {
        if (!this.container) { return false; }
        return true;
    }
}