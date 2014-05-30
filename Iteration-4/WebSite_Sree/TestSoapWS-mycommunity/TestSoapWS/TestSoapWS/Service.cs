using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NUnit.Framework;


namespace TestSoapWS
{
    [TestFixture]
    public class Service
    {
        [Test]
        public void SoapServiceInsertTest()
        {
            SoapWebReference.WebService ws = new SoapWebReference.WebService();
            string returnMsg = ws.InsertUserData("umkc1000", "pslp@gmail.com", "Spring", "Spring","65th Street", "8164688902");
            Assert.AreEqual("Success insert", returnMsg);
        }
        
        [Test]
        public void SoapServiceNoUserSelectTest()
        {
            SoapWebReference.WebService ws = new SoapWebReference.WebService();
            string returnMsg = ws.GetUserData("umkc1", "spring");
            Assert.Pass("info: user not exists", returnMsg);
        }

        [Test]
        public void SoapServiceSelectTest()
        {
            SoapWebReference.WebService ws = new SoapWebReference.WebService();
            string returnMsg = ws.GetUserData("pavanipenmetsa", "Pavani-10");
            Assert.Pass("info: user exists", returnMsg);
        }
        //selectcommunity

        [Test]
        public void SoapServiceSelectCommunityTest()
        {
            SoapWebReference.WebService ws = new SoapWebReference.WebService();
            string returnMsg = ws.selectCommunity("pavanipenmetsa1");
            Assert.Pass("info: User not in MyCommunity", returnMsg);
        }
        //Insert community
        [Test]
        public void SoapServiceInsertCommunityTest()
        {
            SoapWebReference.WebService ws = new SoapWebReference.WebService();
            string returnMsg = ws.InsertMyCommunity("pavanipenmetsa55", 900, 4, "Condo",
        "creeks", "5110 rockhill rd", "Kansas city", "MO", "64110", "38.9760518", "-94.5960809");
            Assert.Pass("info: Success insert", returnMsg);
        }

        //Insert utilities bill
        [Test]
        public void SoapServiceInsertUtilBillTest()
        {
            SoapWebReference.WebService ws = new SoapWebReference.WebService();
            string returnMsg = ws.InsertUtilityBill("pavanipenmetsa55", "765", "April", 2014);
            Assert.Pass("info: Success insert", returnMsg);
        }

        //Calculate Reward points
        [Test]
        public void SoapServiceCalRewardPoints()
        {
            SoapWebReference.WebService ws = new SoapWebReference.WebService();
            int returnMsg = ws.CalculateRewardPoints("pavanipenmetsa10", "765", "May", 2015);
            Assert.Pass("info: 3", returnMsg);
        }

        //Calculate community Reward points
        [Test]
        public void SoapServiceCalComnRewardPoints()
        {
            SoapWebReference.WebService ws = new SoapWebReference.WebService();
            string returnMsg = ws.CommunityRewardPoints("pavanipenmetsa10", "May", 2015);
            Assert.Pass("info: 3", returnMsg);
        }

        //Calculate nearby communities Reward points
        [Test]
        public void SoapServiceCalnearComnRewardPoints()
        {
            SoapWebReference.WebService ws = new SoapWebReference.WebService();
            string returnMsg = ws.RewardPointsByCommunity("May", 2015);
            Assert.Pass("info: 3", returnMsg);
        }

    }
}
