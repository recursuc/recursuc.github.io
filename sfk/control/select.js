/*
simple selectControl/ zouchao / 2012-09-08
*/
(function (win, doc) {
    Select = $C.Create({
        initialize: function (options) {
            if (!this.id) {
                alert("not find target !!");
                return;
            }

            this.obj = doc.getElementById(options.id);
            this.selectedValue = options.selectedValue;
            this.data = options.data ?
                            $O.getType(options.data) == "array" ?
                                options.data
                            : [options.data]
                        : [];
            this.heSelect = null;
            this.childNodes = options.childNodes || [];
            this.defaultOption = options.defaultOption || true;

            this.onPreproccess = options.onPreproccess;
            this.onProccess = options.onProccess;
            this.onProccessed = options.onProccessed;
        },
        setOptions: function (options) {

        },
        start: function () {
            this.onPreproccess && this.onPreproccess();
            this.createHtml();
            this.onProccessed && this.onProccessed();

            return this;
        },
        createHtml: function () {
            var sHtml = "";
            if (this.defaultOption)
                sHtml += "<option value='null'>---请选择---</option>";

            for (var i = 0, len = this.data.length; i < len; i++) {
                sHtml += "<option value='" + this.data[i] + "'>" + this.data[i] + "</option>";
            }
            this.obj.innerHTML = sHtml;
        },
        recover: function () {

        }
    });

    win.Select = Select;
})(window, document);