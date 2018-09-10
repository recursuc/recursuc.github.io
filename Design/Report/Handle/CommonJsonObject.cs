using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ReportSystem.Application.Design.Report.Handle
{
	public class CommonJsonObject
	{
        public CommonJsonObject() { }
        private string name = "";
        private string value = "";

        public string Name
        {
            get { return name; }
            set { name = value; }
        }
        public string Value
        {
            get { return this.value; }
            set { this.value = value; }
        }
	}
    public class CommonJsonObjectList
    {
        public CommonJsonObjectList() { }
        private List<CommonJsonObject> _keyValueList = new List<CommonJsonObject>();

        public List<CommonJsonObject> KeyValueList
        {
            get { return _keyValueList; }
            set { _keyValueList = value; }
        }
        public Dictionary<string,string> ListToDictionary()
        {
            Dictionary<string, string> dic = new Dictionary<string, string>();
            foreach (CommonJsonObject commonObject in this.KeyValueList)
            {
                if (!dic.ContainsKey(commonObject.Name))
                {
                    dic.Add(commonObject.Name, commonObject.Value);
                }
            }
            return dic;
        }
    }
}