using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace ReportSystem.Application.Design.Report.Handle
{
    public class JsonManager
    {
        private JsonManager() { }
        public static object DeserializeObject(string textJson, Type objectType)
        {
            return JsonConvert.DeserializeObject(textJson, objectType);
        }
        public static object SerializeObject(object obj)
        {
            return JsonConvert.SerializeObject(obj);
        }
    }
}