using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using NUnit.Framework;

namespace TestWebService
{
    [TestFixture]
    public class WebService1Tests
    {
        [Test]
        public void GetCityNotesReturnNotesTest()
        {
            var service = new WebService1.WebService1();
            var output = service.getCityNotes("Lenexa");

            Assert.IsTrue(!String.IsNullOrEmpty(output), "Expecting not null or empty ouput.");
        }

        [Test]
        public void GetCityNotesDoesNotReturnNotesTest()
        {
            var service = new WebService1.WebService1();
            var output = service.getCityNotes("InvalidCity");

            Assert.IsTrue(!output.Contains("<div"), "Expecting null ouput, but returned data.");
        }
    }
}
