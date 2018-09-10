(function () {
    window["FunctionInfo"] = {};
    var functionInfo = window["FunctionInfo"];

    /*******************************数据集函数*************************************/
    functionInfo["dSFunction"] = ["get", "group", "get1", "sum", "count", "avg", "max", "min", "last", "first", "cols", "field"];
    //数组对应信息说明：函数名，函数说明，语法，功能说明， 参数说明， 函数示例
    functionInfo["dSFunctionInfo"] = [
		["avg()", "<span style='color:red;'>函数说明：</span><br/> 从数据集中，从满足条件的记录中，算出给定字段或表达式的平均值<br/> <span style='color:red;'>语法：</span><br/>        datasetName.avg(selectExp{,filterExp})<br/>    <span style='color:red;'>参数说明：</span><br/>        selectExp        需要计算平均值的字段或表达式<br/>        filterExp        过滤条件表达式<br/>"],
		["cols()", "<span style='color:red;'>函数说明：</span><br/>        数据集的列数<br/>    <span style='color:red;'>语法：</span><br/>        datasetName.cols()"],
		["count()", "<span style='color:red;'>函数说明：</span><br/>        计算数据集中，满足条件的记录数<br/>    <span style='color:red;'>语法：</span><br/>        datasetName.count({filterExp})<br/>    <span style='color:red;'>参数说明：</span><br/>        filterExp        条件表达式   <br/>"],
		["field()", "<span style='color:red;'>函数说明：</span><br/>        取数据集的列<br/>    <span style='color:red;'>语法：</span><br/>        datasetName.field( stringExp )<br/>        datasetName.field( intExp )<br/>    <span style='color:red;'>参数说明：</span><br/>        stringExp     返回数据集列名的表达式<br/>        intExp        返回数据集列号的表达式   <br/>"],
		["first()", "<span style='color:red;'>函数说明：</span><br/>        从数据集满足条件的记录集合中，选出第一条记录，返回给定字段或表达式的值<br/>    <span style='color:red;'>语法：</span><br/>        datasetName.first(selectExp{,descExp{,filterExp{,sortExp}}})<br/>    <span style='color:red;'>参数说明：</span><br/>        selectExp        选出字段或表达式<br/>        descExp        排序的顺序，true代表逆序，false代表顺序<br/>        filterExp        过滤条件表达式<br/>        sortExp        排序依据表达式<br/>        <br/>"],
		["get()", "<span style='color:red;'>函数说明：</span><br/>        从当前数据组(由其主格决定)中选取符合条件的记录<br/>    <span style='color:red;'>语法：</span><br/>        datasetName.get( select_exp [, desc_exp, filter_exp, sort_exp] )<br/>    <br/>    功能说明：<br/>        数据源从数据库中读取的记录实际上是一个行列的二维表。<br/>        get()函数从数据源记录集中选取select_exp字段列中符合过滤条件的值。<br/>        在不需要排序或数据集中已经按需要排好序时，为提高效率请如下使用此函数<br/>            datasetName.get( select_exp, , filter_exp )<br/><br/>    <span style='color:red;'>参数说明：</span><br/>        select_exp：要选择的字段列，可以是字段列名，也可以是以“#列序号”的形式，<br/>                    #0表示记录行号，#1表示数据源中的第一个字段列......以此类推。<br/>        desc_exp:   指定数据排序的顺序，true表示降序排列，false表示升序排列。<br/>        filter_exp: 数据过滤表达式。<br/>        sort_exp:   数据排序表达式。当此项为空时先检查desc_exp是否为空，如果为空，<br/>                    则不排序，否则使用select_exp排序。<br/><br/>    <span style='color:red;'>函数示例：</span><br/>        ds1.get( name )  <br/>        从数据源ds1中选取name字段列的所有值, 不排序<br/>        <br/>        ds1.get( #2, true )  <br/>        从数据源ds1中选取第二个字段列的所有值并降序排列<br/>        <br/>        ds1.get( name,false,sex='0') <br/>        从数据源ds1中选取性别为男性的name字段列的值并升序排列<br/>        <br/>        ds1.get( name, true, sex='0', id )<br/>        从数据源ds1中选取性别为男性的name字段列的值并按id字段降序排列<br/>"],
		["get1()", "<span style='color:red;'>函数说明：</span><br/>        从数据集中根据选出字段或表达式以及选出条件，选出一个数据<br/>    <span style='color:red;'>语法：</span><br/>        datasetName.get1(selectExp{,filterExp})<br/>    <span style='color:red;'>参数说明：</span><br/>        selectExp        选出字段或表达式<br/>        filterExp        过滤条件<br/>        <br/><br/>"],
		["group()", "<span style='color:red;'>函数说明：</span><br/>        根据分组表达式，从数据集中选出一组组集。<br/>        在不需要排序或数据集中已经需要排好序时，为提高效率请如下使用此函数<br/>            datasetName.group( selectExp, , filterExp )<br/>    <span style='color:red;'>语法：</span><br/>        datasetName.group(selectExp{,descExp{,filterExp{,sortExp}}})<br/>    <span style='color:red;'>参数说明：</span><br/>        selectExp        选出的分组表达式<br/>        descExp        分组表达式结果数据的排序顺序，true为逆序，false为顺序<br/>        filterExp        过滤表达式<br/>        sortExp         排序依据表达式<br/>"],
		["last()", "<span style='color:red;'>函数说明：</span><br/>        从数据集满足条件的记录集合中，选出最后一条记录，返回给定字段或表达式的值<br/>    <span style='color:red;'>语法：</span><br/>        datasetName.last(selectExp{,descExp{,filterExp{,sortExp}}})<br/>    <span style='color:red;'>参数说明：</span><br/>        selectExp        选出字段或表达式<br/>        descExp        排序的顺序，true代表逆序，false代表顺序<br/>        filterExp        过滤条件表达式<br/>    sortExp        排序依据表达式<br/>"],
		["max()", "<span style='color:red;'>函数说明：</span><br/>        从数据集中，从满足条件的记录中，选出给定字段或表达式的最大值<br/>    <span style='color:red;'>语法：</span><br/>        datasetName.max(selectExp{,filterExp})<br/>    <span style='color:red;'>参数说明：</span><br/>        selectExp        需要获得最大值的字段或表达式<br/>        filterExp        过滤表达式<br/>"],
		["min()", "<span style='color:red;'>函数说明：</span><br/>        从数据集中，从满足条件的记录中，选出给定字段或表达式的最小值<br/>    <span style='color:red;'>语法：</span><br/>        datasetName.min(selectExp{,filterExp})<br/>    <span style='color:red;'>参数说明：</span><br/>        selectExp        需要获得最小值的字段或表达式<br/>        filterExp        过滤表达式<br/>"],
		["sum()", "<span style='color:red;'>函数说明：</span><br/>        从数据集中，从满足条件的记录中，算出给定字段或表达式的总和<br/>    <span style='color:red;'>语法：</span><br/>        datasetName.sum(selectExp{,filterExp})<br/>    <span style='color:red;'>参数说明：</span><br/>        selectExp        需求和的字段或表达式<br/>        filterExp        条件表达式<br/>"]];

    /*******************************单元格函数*************************************/
    functionInfo["cellFuction"] = ["sum", "avg", "max", "min"];
    functionInfo["cellFunctionInfo"] =
	[
		["avg()", "<span style='color:red;'>函数说明：</span><br/>        对可扩展单元格或集合表达式求平均值<br/>    <span style='color:red;'>语法：</span><br/>        avg(expression)<br/>    <span style='color:red;'>参数说明：</span><br/>        expression        需要求平均值的单元格或表达式，一般为可扩展单元格或集合表达式<br/>"],
		["max()", "<span style='color:red;'>函数说明：</span><br/>        对可扩展单元格或集合表达式求最大值<br/>    <span style='color:red;'>语法：</span><br/>        max(expression)<br/>    <span style='color:red;'>参数说明：</span><br/>        expression        需要求最大值的单元格或表达式，一般为可扩展单元格或集合表达式<br/>"],
		["min()", "<span style='color:red;'>函数说明：</span><br/>        对可扩展单元格或集合表达式求最小值<br/>    <span style='color:red;'>语法：</span><br/>        mix(expression)<br/>    <span style='color:red;'>参数说明：</span><br/>        expression        需要求最小值的单元格或表达式，一般为可扩展单元格或集合表达式<br/>"],
		["sum()", "<span style='color:red;'>函数说明：</span><br/>        对可扩展单元格或集合表达式进行求和<br/>    <span style='color:red;'>语法：</span><br/>        sum(expression)<br/>    <span style='color:red;'>参数说明：</span><br/>        expression    需要被求和的单元格或表达式，一般为可扩展单元格或集合表达式<br/>"]
	];
    /*******************************字符串函数*************************************/
    functionInfo["strFunction"] = ["left", "len", "lower", "substring", "trim", "upper", "char"];
    functionInfo["strFunctionInfo"] = [
		["char()", "<span style='color:red;'>函数说明：</span><br/>        根据给定的unicode编码取得其对应的字符<br/>    <span style='color:red;'>语法：</span><br/>        char( int )<br/>    <span style='color:red;'>参数说明：</span><br/>        int            整数表达式，返回unicode编码<br/>"],
		["left()", "<span style='color:red;'>函数说明：</span><br/>  获得字符串左边的子串<br/>    <span style='color:red;'>语法：</span><br/> left(string, n)<br/>        todouble( number )<br/>    <span style='color:red;'>参数说明：</span><br/>     string 	获得子串的源串<br/>n		获得子串的长度<br/> "],
		["len()", "<span style='color:red;'>函数说明：</span><br/>        计算字符串的长度<br/>    <span style='color:red;'>语法：</span><br/> len(s)<br/>            <span style='color:red;'>参数说明：</span><br/>     s		待计算长度的字符串<br/> "],
		["substring()", "<span style='color:red;'>函数说明：</span><br/>      substring(s, start{, end})<br/>    <span style='color:red;'>语法：</span><br/> substring(s, start{, end})<br/>            <span style='color:red;'>参数说明：</span><br/>   s		待获得子串的源串<br/> start		获得子串的起始位置 <br/>end		获得子串的结束位置，缺省为源串的长度<br/>"],
		["lower()", "<span style='color:red;'>函数说明：</span><br/>       将字符串转成小写<br/>    <span style='color:red;'>语法：</span><br/>  lower(s)<br/>    <span style='color:red;'>参数说明：</span><br/>     s		待转成小写的字符串<br/>"],
		["trim()", "<span style='color:red;'>函数说明：</span><br/>  去掉字符串左右的空串<br/>    <span style='color:red;'>语法：</span><br/> trim(s)<br/>    <span style='color:red;'>参数说明：</span><br/>     s	待去掉左右空串的源串<br/>"],
        ["upper()", "<span style='color:red;'>函数说明：</span><br/> 把字符串转成大写<br/>    <span style='color:red;'>语法：</span><br/> upper(s)<br/>    <span style='color:red;'>参数说明：</span><br/>   s		待转成大写的源串<br/>"]
	];
    /*******************************数学函数*************************************/
    functionInfo["mathFunction"] = ["abs", "cos", "sin", "tan", "Acos", "Asin", "Atan", "floor", "int", "log", "log10", "round", "sqrt", "inv", "square", "exp", "mod"];
    functionInfo["mathFunctionInfo"] = [
        ["abs()", "<span style='color:red;'>函数说明：</span><br/>        计算参数的绝对值<br/>    <span style='color:red;'>语法：</span><br/>        abs(numberExp)<br/>    <span style='color:red;'>参数说明：</span><br/>        numberExp        待计算绝对值的数据<br/>"],
		["cos()", "<span style='color:red;'>函数说明：</span><br/>        计算参数的余弦值，其中参数以弧度为单位<br/>    <span style='color:red;'>语法：</span><br/>        cos(numberExp)<br/>    <span style='color:red;'>参数说明：</span><br/>        numberExp        待计算余弦值的弧度数<br/>"],
        ["sin()", "<span style='color:red;'>函数说明：</span><br/>        计算参数的正弦值，其中参数以弧度为单位<br/>    <span style='color:red;'>语法：</span><br/>        sin(number)<br/>    <span style='color:red;'>参数说明：</span><br/>        number        需要计算正弦值的弧度数<br/>"],
        ["tan()", "<span style='color:red;'>函数说明：</span><br/>        计算参数的正切值，其中参数以弧度为单位<br/>    <span style='color:red;'>语法：</span><br/>        tan(number)<br/>    <span style='color:red;'>参数说明：</span><br/>        需要计算正切值的弧度数<br/>"],
        ["Acos()", "<span style='color:red;'>函数说明：</span><br/>       求指定数字余弦值的角度<br/>    <span style='color:red;'>语法：</span><br/>        Acos(numberExp)<br/>    <span style='color:red;'>参数说明：</span><br/>        numberExp       待计算正弦值角度的数字<br/>"],
        ["Asin()", "<span style='color:red;'>函数说明：</span><br/>        求指定数字正弦值的角度<br/>    <span style='color:red;'>语法：</span><br/>        sin(number)<br/>    <span style='color:red;'>参数说明：</span><br/>        number        待计算正弦值角度的数字<br/>"],
        ["Atan()", "<span style='color:red;'>函数说明：</span><br/>        指定数字正切值的角度<br/>    <span style='color:red;'>语法：</span><br/>        tan(number)<br/>    <span style='color:red;'>参数说明：</span><br/>        待计算正弦值角度的数字<br/>"],
		["floor()", "<span style='color:red;'>函数说明：</span><br/>      对参数进行取整，返回小于或等于原数据的整数。<br/>    <span style='color:red;'>语法：</span><br/>        floor(numberExp)<br/>    <span style='color:red;'>参数说明：</span><br/> numberExp		需要进行取整的数据<br/>"],
		["int()", "<span style='color:red;'>函数说明：</span><br/>        对参数进行取整，直接去掉小数部分，返回整数部分<br/>    <span style='color:red;'>语法：</span><br/>        int(numberExp)<br/>    <span style='color:red;'>参数说明：</span><br/>        numberExp        需要进行取整的数据<br/>"],
		["log()", "<span style='color:red;'>函数说明：</span><br/>        计算参数的自然对数<br/>    <span style='color:red;'>语法：</span><br/>        log(numberExp)<br/>    <span style='color:red;'>参数说明：</span><br/>        numberExp        需要计算自然对数的数据<br/>"],
		["log10()", "<span style='color:red;'>函数说明：</span><br/>        计算以10为底的对数<br/>    <span style='color:red;'>语法：</span><br/>        log10(numberExp)<br/>    <span style='color:red;'>参数说明：</span><br/>        numberExp        需要计算以10为底的对数的数据<br/>"],
		["round()", "<span style='color:red;'>函数说明：</span><br/>        对参数指定位置进行四舍五入取整<br/>    <span style='color:red;'>语法：</span><br/>        round(numberExp, nExp)<br/>    <span style='color:red;'>参数说明：</span><br/>        numberExp        需要进行四舍五入取整的数据<br/>        nExp            指定位置，为正表示小数点后四舍五入，为负表示小数点前四舍五入<br/>"],
		["sqrt()", "<span style='color:red;'>函数说明：</span><br/>        计算平方根<br/>    <span style='color:red;'>语法：</span><br/>        sqrt(number)<br/>    <span style='color:red;'>参数说明：</span><br/>        number        需要计算平方根的数据<br/>"],
        ["inv()", "<span style='color:red;'>函数说明：</span><br/>      求指定参数的倒数<br/>    <span style='color:red;'>语法：</span><br/>       inv(number)<br/>    <span style='color:red;'>参数说明：</span><br/>        number        需要计算倒数的数据<br/>"],
        ["square()", "<span style='color:red;'>函数说明：</span><br/>        求指定参数的平方<br/>    <span style='color:red;'>语法：</span><br/>        square(number)<br/>    <span style='color:red;'>参数说明：</span><br/>        number        需要计算平方的数据<br/>"],
        ["exp()", "<span style='color:red;'>函数说明：</span><br/>        求e的指定次幂<br/>    <span style='color:red;'>语法：</span><br/>        exp(number)<br/>    <span style='color:red;'>参数说明：</span><br/>        number        e的幂数<br/>"],
        ["mod()", "<span style='color:red;'>函数说明：</span><br/>      求一个数相对于另一个参数的余数<br/>    <span style='color:red;'>语法：</span><br/>        mod(number1, number2)<br/>    <span style='color:red;'>参数说明：</span><br/>        number1	被除数；<br/>  number1	除数；<br/>"]
		];
    /*******************************日期函数*************************************/
    functionInfo["datetimeFunction"] = ["now"];
    functionInfo["datetimeFunctionInfo"] = [["now()", "<span style='color:red;'>函数说明：</span><br/>        获得系统此刻的时间<br/>    <span style='color:red;'>语法：</span><br/>  now()<br/>"]];

    /*******************************函数类型*************************************/
    functionInfo["functionType"] = [["数据集函数", functionInfo["dSFunctionInfo"]], ["单元格函数", functionInfo["cellFunctionInfo"]], ["字符串函数", functionInfo["strFunctionInfo"]], ["数学函数", functionInfo["mathFunctionInfo"]], ["日期函数", functionInfo["datetimeFunctionInfo"]]];
})();

