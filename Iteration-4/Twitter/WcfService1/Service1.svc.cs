using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;
using System.Net;
using System.IO;

namespace WcfService1
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the class name "Service1" in code, svc and config file together.
    public class Service1 : IService1
    {
        [WebInvoke(Method = "GET",ResponseFormat = WebMessageFormat.Json,UriTemplate = "data/{id}")]

        public string GetData2(string id)
        {
             //lookup person with the requested id 
          //  return new Person()
           // {
           //     Id = Convert.ToInt32(id),
                
                
            //    Name = "Student"+id
                
         //   };

            //string token = GetToken(); ;
            string token = "AAAAAAAAAAAAAAAAAAAAAHdhWgAAAAAAA0b5qOfeH1NNUD%2F9OK%2FBLT%2Buslw%3DXjExF1FsnBrviy2aGL3MUFZI6vexb8NPmjNxAg5CvAJQNsxQXa";
            return GetTweets(token, id);
           
        }

        public string GetToken()
        {

            WebRequest request = WebRequest.Create("https://api.twitter.com/oauth2/token");

            string consumerKey = "mQ1Lf9xmdAI8YtRN7HdFHQ";
            string consumerSecret = "2pi1AvqnCzjFSmRzKSgo8cTDmHvPa7SQAroSCmWnAU";
            string consumerKeyAndSecret = String.Format("{0}:{1}", consumerKey, consumerSecret);

            request.Method = "POST";
            request.Headers.Add("Authorization", String.Format("Basic {0}", Convert.ToBase64String(Encoding.UTF8.GetBytes(consumerKeyAndSecret))));

            request.ContentType = "application/x-www-form-urlencoded;charset=UTF-8";

            string postData = "grant_type=client_credentials";
            byte[] byteArray = Encoding.UTF8.GetBytes(postData);
            request.ContentLength = byteArray.Length;
            Stream dataStream = request.GetRequestStream();
            dataStream.Write(byteArray, 0, byteArray.Length);
            dataStream.Close();

            WebResponse response = request.GetResponse();
            Stream receiveStream = response.GetResponseStream();
            Encoding encode = System.Text.Encoding.GetEncoding("utf-8");
            // Pipes the stream to a higher level stream reader with the required encoding format. 
            StreamReader readStream = new StreamReader(receiveStream, encode);
            Console.WriteLine("\r\nResponse stream received.");
            Char[] read = new Char[256];
            // Reads 256 characters at a time.     
            int count = readStream.Read(read, 0, 256);
            Console.WriteLine("HTML...\r\n");
            string token = "";
            while (count > 0)
            {
                // Dumps the 256 characters on a string and displays the string to the console.
                token += new String(read, 0, count);
                count = readStream.Read(read, 0, 256);
            }

            //dynamic result = JsonValue.Parse(webClient.DownloadString("https://api.foursquare.com/v2/users/self?oauth_token=XXXXXXX"));
            //Console.WriteLine(result.response.user.firstName);

            Console.WriteLine(token);
            // Releases the resources of the response.
            response.Close();
            // Releases the resources of the Stream.
            readStream.Close();
            return token;

        }

        public string GetTweets(string token1, string searchText)
        {

            WebRequest request = WebRequest.Create("https://api.twitter.com/1.1/search/tweets.json?q=energy%20saving&src=typd");
            request.Method = "GET";
            request.Headers.Add("Authorization", String.Format("Bearer {0}", token1));

            WebResponse response = request.GetResponse();
            Stream receiveStream = response.GetResponseStream();
            Encoding encode = System.Text.Encoding.GetEncoding("utf-8");
            // Pipes the stream to a higher level stream reader with the required encoding format. 
            StreamReader readStream = new StreamReader(receiveStream, encode);
            string token = "";
            while (readStream.Peek() >= 0)
            {
                token += readStream.ReadLine();
            }

            response.Close();
            readStream.Close();
            return token;

        }




        public string GetData(int value)
        {
            return string.Format("You entered: {0}", value);
        }

        public CompositeType GetDataUsingDataContract(CompositeType composite)
        {
            if (composite == null)
            {
                throw new ArgumentNullException("composite");
            }
            if (composite.BoolValue)
            {
                composite.StringValue += "Suffix";
            }
            return composite;
        }

       
        public string GetDateTime()
        {
            return DateTime.Now.ToString();
        }
    }


    public class Person
    {

        public int Id { get; set; }

        public string Name { get; set; }

    }
}
