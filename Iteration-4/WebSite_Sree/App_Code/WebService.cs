using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
using System.Text;
//using System.String;

/// <summary>
/// Summary description for WebService
/// </summary>
[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
// To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
// [System.Web.Script.Services.ScriptService]
public class WebService : System.Web.Services.WebService
{

    /*   public WebService()
       {

           //Uncomment the following line if using designed components 
           //InitializeComponent(); 
       }
       */
    // Get user data from users table for login verification.
    [WebMethod]
    public string GetUserData(string user_name1, string password)
    {

        //Declare Connection by passing the connection string from the web config file
        SqlConnection conn = new SqlConnection(ConfigurationManager.ConnectionStrings["dbString"].ConnectionString);

        //Open the connection
        conn.Open();

        string user_name_users = "";
        string result = "";
        SqlCommand cmd = new SqlCommand("Select a.user_name1 user_a From users a where a.user_name1='"
            + user_name1 + "'" + " and a.password='" + password + "'", conn);

        SqlDataReader reader = cmd.ExecuteReader();
        while (reader.Read())
        {
            user_name_users = reader["user_a"].ToString();
        }
        reader.Close();
        //close the connection
        conn.Close();

        if (string.IsNullOrEmpty(user_name_users))
        {
            result = "user not exists";
        }
        else
        {
            result = "user exists";
        }
        return result;

    }

    // Insert user information when user registers.
    [WebMethod]
    public string InsertUserData(string user_name1, string email, string password, string password_confirm, string address, string phonenumber)
    {
        //Declare Connection by passing the connection string from the web config file
        SqlConnection conn = new SqlConnection(ConfigurationManager.ConnectionStrings["dbString"].ConnectionString);

        //Open the connection
        conn.Open();

        //Declare the sql command
        SqlCommand cmd = new SqlCommand
            ("Insert into users(user_name1,email,password,password_confirm,address,phonenumber)values('" + user_name1 + "','" + email + "','" + password + "','" + password_confirm + "','" + address + "','" + phonenumber + "')", conn);

        //Execute the insert query
        cmd.ExecuteNonQuery();
        cmd.Dispose();
        //close the connection
        conn.Close();

        return "Success insert";

    }
    // Get Current month and current year.
    [WebMethod]
    public string getCurrentMonthYear()
    {

        string CurrentYear_db = "";
        string CurrentMonth_db = "";
        string CurrentMonth = "";

        //Declare Connection by passing the connection string from the web config file
        SqlConnection conn = new SqlConnection(ConfigurationManager.ConnectionStrings["dbString"].ConnectionString);

        //Open the connection
        conn.Open();


        SqlCommand cmd = new SqlCommand("SELECT YEAR(GETDATE()) AS CurrentYear, MONTH(GETDATE()) AS CurrentMonth", conn);

        SqlDataReader reader = cmd.ExecuteReader();
        while (reader.Read())
        {
            CurrentYear_db = reader["CurrentYear"].ToString();
            CurrentMonth_db = reader["CurrentMonth"].ToString();
        }
        reader.Close();
        //close the connection
        conn.Close();

        if (CurrentMonth_db == "1")
            CurrentMonth = "January";
        else if (CurrentMonth_db == "2")
            CurrentMonth = "Febraury";
        else if (CurrentMonth_db == "3")
            CurrentMonth = "March";
        else if (CurrentMonth_db == "4")
            CurrentMonth = "April";
        else if (CurrentMonth_db == "5")
            CurrentMonth = "May";
        else if (CurrentMonth_db == "6")
            CurrentMonth = "June";
        else if (CurrentMonth_db == "7")
            CurrentMonth = "July";
        else if (CurrentMonth_db == "8")
            CurrentMonth = "August";
        else if (CurrentMonth_db == "9")
            CurrentMonth = "September";
        else if (CurrentMonth_db == "10")
            CurrentMonth = "October";
        else if (CurrentMonth_db == "11")
            CurrentMonth = "November";
        else if (CurrentMonth_db == "12")
            CurrentMonth = "December";


        return CurrentYear_db + "," + CurrentMonth;
        //if (string.IsNullOrEmpty(user_name_db)) return "0";
        //else return "success";

    }
    // Check user in MyCommunity
    [WebMethod]
    public string selectCommunity(string user_name1)
    {
        string MonthYear = getCurrentMonthYear();
        //
        // Split string on spaces.
        // ... This will separate all the words.
        //
        string Year = MonthYear.Substring(0, 4);
        string Month = MonthYear.Substring(5);

        //Declare Connection by passing the connection string from the web config file
        SqlConnection conn = new SqlConnection(ConfigurationManager.ConnectionStrings["dbString"].ConnectionString);

        //Open the connection
        conn.Open();

        string user_name_db = "";
        string utilitybill_db = "";
        string year_db = "";
        string month_db = "";
        string result = "";


        SqlCommand cmd = new SqlCommand("Select a.user_name1 user_a, b.utility_bill utilitybill_b, b.year year_b, b.month month_b From MyCommunity a LEFT JOIN utility_bills b ON a.user_name1 = b.user_name1 and b.year='" + Year + "'" + " and b.month='" + Month + "' where a.user_name1='"
            + user_name1
            + "'", conn);

        SqlDataReader reader = cmd.ExecuteReader();
        while (reader.Read())
        {
            user_name_db = reader["user_a"].ToString();
            utilitybill_db = reader["utilitybill_b"].ToString();
            year_db = reader["year_b"].ToString();
            month_db = reader["month_b"].ToString();
        }
        reader.Close();
        //close the connection
        conn.Close();

        if (string.IsNullOrEmpty(user_name_db))
        {
            result = "User not in MyCommunity";
        }
        else
        {
            if (string.IsNullOrEmpty(utilitybill_db))
            {
                result = "no utilitybill for current month";
            }
            else result = utilitybill_db + "," + year_db + "," + month_db;
        }
        return result;

    }
    // Insert into MyCommunity.
    [WebMethod]
    public string InsertMyCommunity(string user_name1, int householdsize, string housetype, string zipcode,
        string community)
    {
        //Declare Connection by passing the connection string from the web config file
        SqlConnection conn = new SqlConnection(ConfigurationManager.ConnectionStrings["dbString"].ConnectionString);

        //Open the connection
        conn.Open();

        //Declare the sql command
        SqlCommand cmd = new SqlCommand
            ("Insert into MyCommunity(user_name1,householdsize,housetype,zipcode,community)values('"
            + user_name1 + "','" + householdsize + "','" + housetype + "','" + zipcode + "','" + community + "')", conn);


        //Execute the insert query
        cmd.ExecuteNonQuery();
        cmd.Dispose();
        //close the connection
        conn.Close();

        return "Success insert";

    }
    // Insert utility bills.
    [WebMethod]
    public string InsertUtilityBill(string user_name1, string utilitybill, string month, int year)
    {
        //Declare Connection by passing the connection string from the web config file
        SqlConnection conn = new SqlConnection(ConfigurationManager.ConnectionStrings["dbString"].ConnectionString);

        //Open the connection
        conn.Open();

        //Declare the sql command
        SqlCommand cmd = new SqlCommand
            ("Insert into utility_bills (user_name1,utility_bill, month, year)values('"
            + user_name1 + "','" + utilitybill + "','" + month + "','" + year + "')", conn);


        //Execute the insert query
        cmd.ExecuteNonQuery();
        cmd.Dispose();
        //close the connection
        conn.Close();

        return "Success insert";

    }
    // Update utility bill data.
    [WebMethod]
    public string UpdateUtilityBill(string user_name1, string utilitybill, string month, int year)
    {
        //Declare Connection by passing the connection string from the web config file
        SqlConnection conn = new SqlConnection(ConfigurationManager.ConnectionStrings["dbString"].ConnectionString);

        //Open the connection
        conn.Open();

        //Declare the sql command
        SqlCommand cmd = new SqlCommand
            ("Update utility_bills set utility_bill = '" + utilitybill + "'" + " where user_name1 ='" + user_name1 + "'" + " and year='" + year + "'" + " and month='" + month + "'", conn);


        //Execute the insert query
        cmd.ExecuteNonQuery();
        cmd.Dispose();
        //close the connection
        conn.Close();

        return "Success update";

    }
    // Calculate Reward points.
    [WebMethod]
    public int CalculateRewardPoints(string user_name1, string utilitybill, string month, int year)
    {
        float utilitybill_int = 0;
        string utilitybill_db = "";
        string result = "";
        int rewards = 0;
        float utilitybill_avg = 0;

        //Declare Connection by passing the connection string from the web config file
        SqlConnection conn = new SqlConnection(ConfigurationManager.ConnectionStrings["dbString"].ConnectionString);

        //Open the connection
        conn.Open();

        //Declare the sql command
        SqlCommand cmd = new SqlCommand
            ("Select utility_bill From utility_bills where user_name1 ='" + user_name1 + "'" + " and year='" + year + "'" + " and month='" + month + "'", conn);


        //Execute the insert query
        cmd.ExecuteNonQuery();
        cmd.Dispose();
        //close the connection
        /*object value = cmd.Parameters["utility_bill"].Value;
        if (!value.Equals(DBNull.Value))
            utilitybill_int = (int)value;*/
        //utilitybill_int = (float) Convert.ToDecimal("utility_bill");

        SqlDataReader reader = cmd.ExecuteReader();
        while (reader.Read())
        {
            //utilitybill_int = (reader["utility_bill"];
            utilitybill_int = (float)Convert.ToDecimal(reader["utility_bill"]);
            utilitybill_db = reader["utility_bill"].ToString();
        }
        reader.Close();
        //utilitybill_db = utilitybill;
        //close the connection
        conn.Close();

        if (string.IsNullOrEmpty(utilitybill_db))
        {
            result = InsertUtilityBill(user_name1, utilitybill, month, year);
        }
        else
        {
            result = UpdateUtilityBill(user_name1, utilitybill, month, year);
        }

        if (result == "Success insert" || result == "Success update")
        {
            utilitybill_avg = GetUtilityBillAverage(user_name1, month, year);
        }

        return CalculateRewards(utilitybill_int, utilitybill_avg);

    }

    // Community Reward Points.
    [WebMethod]
    public string CommunityRewardPoints(string username, string month, int year)
    {
        int householdsize_int = 0;
        string housetype_db = "";
        int zipcode_db = 0;
        string community_db = "";
        System.Web.Script.Serialization.JavaScriptSerializer serializer = new System.Web.Script.Serialization.JavaScriptSerializer();
        List<Dictionary<string, object>> rows = new List<Dictionary<string, object>>();

        string result = "";

        //Declare Connection by passing the connection string from the web config file
        SqlConnection conn = new SqlConnection(ConfigurationManager.ConnectionStrings["dbString"].ConnectionString);


        StringBuilder sb = new StringBuilder();
        sb.Append(" select b.user_name1, utility_bill ");
        sb.Append(" from MyCommunity a");
        sb.Append(" inner join  utility_bills b ");
        sb.Append(" on a.user_name1 = b.user_name1");
        sb.Append(" inner join (select householdsize, housetype, community ");
        sb.Append(string.Format(" from MyCommunity where user_name1 = '{0}') c", username));
        sb.Append(" on  a.householdsize = c.householdsize");
        sb.Append(" and a.community = c.community");
        sb.Append(" and a.housetype = c.housetype");
        sb.Append(string.Format(" where b.month = '{0}'", month));
        sb.Append(string.Format(" and b.year = '{0}'", year));


        SqlDataAdapter adap = new SqlDataAdapter(sb.ToString(), conn);
        DataSet ds = new DataSet();
        adap.Fill(ds);

        if (ds != null)
        {
            if (ds.Tables[0].Rows.Count > 0)
            {
                DataTable dt = ds.Tables[0];
                DataColumn dc = new DataColumn("RewardPoints");
                dt.Columns.Add(dc);

                float utilitybill_avg = GetUtilityBillAverage(username, month, year);
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    float utilityBill = 0.0F;
                    int rewards = 0;
                    float.TryParse(dt.Rows[i]["utility_bill"].ToString(), out utilityBill);
                    rewards = CalculateRewards(utilityBill, utilitybill_avg);
                    dt.Rows[i]["RewardPoints"] = rewards;
                }


                dt.Columns.Remove("utility_bill");
                Dictionary<string, object> row;
                foreach (DataRow dr in dt.Rows)
                {
                    row = new Dictionary<string, object>();
                    foreach (DataColumn col in dt.Columns)
                    {
                        row.Add(col.ColumnName, dr[col]);
                    }
                    rows.Add(row);
                }
            }
        }
        return serializer.Serialize(rows);

    }

    private int CalculateRewards(float utilityBill, float utilityBillAverage)
    {
        int retRewards = 0;

        if (utilityBill < utilityBillAverage - 30)
        {
            retRewards = 5;
        }
        else if (utilityBill >= utilityBillAverage - 30 && utilityBill < utilityBillAverage - 10)
        {
            retRewards = 4;
        }
        else if (utilityBill >= utilityBillAverage - 10 && utilityBill <= utilityBillAverage + 10)
        {
            retRewards = 3;
        }
        else if (utilityBill > utilityBillAverage + 10 && utilityBill <= utilityBillAverage + 30)
        {
            retRewards = 2;
        }
        else if (utilityBill > utilityBillAverage + 30)
        {
            retRewards = 1;
        }

        return retRewards;
    }


    private float GetUtilityBillAverage(string username, string month, int year)
    {
        float retFloat = 0.0F;
        //Declare Connection by passing the connection string from the web config file
        SqlConnection conn = new SqlConnection(ConfigurationManager.ConnectionStrings["dbString"].ConnectionString);


        StringBuilder sb = new StringBuilder();
        sb.Append(" select Avg(utility_bill) UtilityBillAverage ");
        sb.Append(" from MyCommunity a");
        sb.Append(" inner join  utility_bills b ");
        sb.Append(" on a.user_name1 = b.user_name1");
        sb.Append(" inner join (select householdsize, housetype, community ");
        sb.Append(string.Format(" from MyCommunity where user_name1 = '{0}') c", username));
        sb.Append(" on  a.householdsize = c.householdsize");
        sb.Append(" and a.community = c.community");
        sb.Append(" and a.housetype = c.housetype");
        sb.Append(string.Format(" where b.month = '{0}'", month));
        sb.Append(string.Format(" and b.year = '{0}'", year));


        SqlDataAdapter adap = new SqlDataAdapter(sb.ToString(), conn);
        DataSet ds = new DataSet();
        adap.Fill(ds);
        if (ds != null)
            if (ds.Tables[0].Rows.Count > 0)
                float.TryParse(ds.Tables[0].Rows[0][0].ToString(), out retFloat);
        return retFloat;
    }
}
