<script runat="server">
Platform.Load("core","1.1.1");

var foo = Base64Decode('{subscriberkey}');

var MasterDE = 'EngagementEvent';
var SubscriberKeyName = "Subscriber Key";
var debug = false;

function outputstr(any){
 Write(Stringify(any));
}
  
function searchSubInDE(subkeyvalue, deName, key){

 var testDE = DataExtension.Init(deName);
 var data = testDE.Rows.Lookup([key], [subkeyvalue]);

 return data;
}
// load the pub lists and locate the subscriber
try{
  
 if (debug){
   Platform.Response.Write('SubscriberKey: '+foo+"<br />"); 
   Platform.Response.Write('Master DE: '+MasterDE+"<br />"); 
   Platform.Response.Write('Subscriber Key Column: '+ SubscriberKeyName+"<br />"); 
 }
  
 // process form post values
 var requestMethod = Request.Method();
 
 if (requestMethod=='POST'){
     
   // locate the subscribe object
     var result = searchSubInDE(foo,MasterDE,SubscriberKeyName);

     if(result.length>0){
      if(debug){
       Platform.Response.Write("Subscriber Object: "); 
       outputstr(result);
       Platform.Response.Write("<br />"); 
     }
       Variable.SetValue("@res",result); 
     }else{
       Variable.SetValue("@error",'No Subscriber Found!'); 
     
     }
 }
  
}catch (e){
  Platform.Response.Write(e); 
  Variable.SetValue("@error",'Error Occured!'); 
}



</script>


 
 <title>Event Activity Search</title>
 <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
  <style>
    * {
      box-sizing: border-box;
    }
    
    .main {
      float:left;
      width:60%;
      padding:0 20px;
    }
    .right {
      background-color:#e5e5e5;
      float:left;
      width:20%;
      padding:15px;
      margin-top:7px;
      text-align:center;
    }
    @media only screen and (max-width:620px) {
      /* For mobile phones: */
      .menu, .main, .right {
        width:100%;
      }
    }
    input[type=text], input[type=date], input[type=email],select {
      width: 100%;
      padding: 12px 20px;
      margin: 8px 0;
      display: inline-block;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-sizing: border-box;
    }

    input[type=submit], button {
      width: 100%;
      background-color: #4CAF50;
      color: white;
      padding: 14px 20px;
      margin: 8px 0;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    input[type=submit]:hover, button:hover {
      background-color: #45a049;
    }

    div {
      border-radius: 5px;
      background-color: #f2f2f2;
      padding: 20px;
    }
@media only screen and (max-width:480px){
/* MOBILE GLOBAL STYLES - DO NOT CHANGE */
body, .tb_properties{font-family: Arial !important; font-size: 16px !important; color: #808080 !important; line-height: 1 !important; padding: 0px !important; }.buttonstyles{font-family: Arial !important; font-size: 16px !important; color: #FFFFFF !important; padding: 0px !important; }h1{font-family: Arial !important; font-size: 22px !important; color: #202020 !important; line-height: 1 !important; }h2{font-family: Arial !important; font-size: 20px !important; color: #202020 !important; line-height: 1 !important; }h3{font-family: Arial !important; font-size: 18px !important; color: #202020 !important; line-height: 1 !important; }a:not(.buttonstyles){line-height: 1 !important; }.mobile-hidden{display: none !important; }.responsive-td {width: 100% !important; display: block !important; padding: 0 !important;}
/* END OF MOBILE GLOBAL STYLES - DO NOT CHANGE */
}</style>
   
 



<div style="background-color:#e5e5e5;padding:15px;">
  <h2>Event Activity Search</h2>
</div>

%%[ if empty(@error) then ]%%

<div style="overflow:auto">
  
  <div class="main">
    <form id="newObjectform" action="%%= RequestParameter('PAGEURL') =%%" method="post">
      
       <label class="inputLabel">Subscriber Key: </label>
       <input type="text" name="subscriberkey" value="" required="" maxlength="40">
      
        <button class="button3" type="submit"> Search </button>
      
    </form>
  </div>
  
  <div class="">
   <script runat="server">
     var result = Variable.GetValue("@res");
     Write('<table><tr><th>Type</th>');
     Write('<th>Event Date</th>');
     Write('<th>Name</th>');
     Write('<th>Job Name</th></tr>');
     
     for (var index in result){
       Write('<tr>');
       Write('<td>Type: '+index["Type"]+'</td>');
       Write('<td>Event Date: '+index["Event Date"]+'</td>');
       Write('<td>Name: '+index["Name"]+'</td>');
       Write('<td>Job Name: '+index["Job Name"]+'</td>');
       Write('</tr>');

     }
     Write('</table>');
    </script>
  </div>

</div>
%%[
ELSE
   outputLine(concat("Error Message: ", @error))
ENDIF
]%%
<div style="background-color:#e5e5e5;padding:10px;margin-top:7px;">© copyright Lavabox</div>

  
  
