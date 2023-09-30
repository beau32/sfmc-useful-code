<script runat=server>
Platform.Load("core","1.1.1");

/*
var jobid = Attribute.GetValue('jobid');
var foo = Base64Decode(Attribute.GetValue('foo'));
var listid = Base64Decode(Attribute.GetValue('list'));
*/

  
//var foo = Base64Decode('003N000001OOMZTIA5');
var foo =  '003N000001OOMZTIA5';
var jobid = '1120';
var listid = '1111';

var MasterDE = 'Master Sub with opt';
var SubscriberKeyName = "Subscriber Key";
var publists = ["Digital Marketing","Marketing Automation"];

var debug = true;

function unsubEvent(subkey,jid,lid,bid,Reason){
 var lue, lue_prop, Response;

 lue = Platform.Function.CreateObject("ExecuteRequest");
 Platform.Function.SetObjectProperty(lue,"Name","LogUnsubEvent");

 //For accounts using the subscriber key functionality
 lue_prop = Platform.Function.CreateObject("APIProperty");
 Platform.Function.SetObjectProperty(lue_prop, "Name", "SubscriberKey");
 Platform.Function.SetObjectProperty(lue_prop, "Value", subkey);
 Platform.Function.AddObjectArrayItem(lue, "Parameters", lue_prop);

 //For accounts not using the subscriber key functionality
 //lue_prop = Platform.Function.CreateObject("APIProperty");
 //Platform.Function.SetObjectProperty(lue_prop, "Name", "EmailAddress");
 //Platform.Function.SetObjectProperty(lue_prop, "Value", subkey);
 //Platform.Function.AddObjectArrayItem(lue, "Parameters", lue_prop);

 lue_prop = Platform.Function.CreateObject("APIProperty");
 Platform.Function.SetObjectProperty(lue_prop, "Name", "JobID");
 Platform.Function.SetObjectProperty(lue_prop, "Value", jid);
 Platform.Function.AddObjectArrayItem(lue, "Parameters", lue_prop);

 lue_prop = Platform.Function.CreateObject("APIProperty");
 Platform.Function.SetObjectProperty(lue_prop, "Name", "ListID");
 Platform.Function.SetObjectProperty(lue_prop, "Value", lid);
 Platform.Function.AddObjectArrayItem(lue, "Parameters", lue_prop);

 lue_prop = Platform.Function.CreateObject("APIProperty");
 Platform.Function.SetObjectProperty(lue_prop, "Name", "BatchID");
 Platform.Function.SetObjectProperty(lue_prop, "Value", bid);
 Platform.Function.AddObjectArrayItem(lue, "Parameters", lue_prop);                                                

 lue_prop = Platform.Function.CreateObject("APIProperty");
 Platform.Function.SetObjectProperty(lue_prop, "Name", "Reason");
 Platform.Function.SetObjectProperty(lue_prop, "Value", "One Click Unsubscribe");
 Platform.Function.AddObjectArrayItem(lue, "Parameters", lue_prop);

 var statusAndRequest = [0,0];

 Response = Platform.Function.InvokeExecute(lue, statusAndRequest);

 return Response;
}

function addSubtoList(subkey,email,ListID,attrs){
 var newSubscriber = {
    "EmailAddress": email,
    "SubscriberKey": subkey,
    "Attributes":attrs,
    "Lists": {"Status": "Unsubscribed", "ID": ListID, "Action": "Create"}
 };

 var status = Subscriber.Add(newSubscriber);

 return status;
}
function searchSubInDE(subkeyvalue, deName, key){

 var testDE = DataExtension.Init(deName);
 var data = testDE.Rows.Lookup([key], [subkeyvalue]);

 return data;
}
function saveSubInDE(varset, subkeyvalue, deName, key){

 var testDE = DataExtension.Init(deName);
 var data = testDE.Rows.Update(varset, [key], [subkeyvalue]);

 return data;
}

function findlists(lists){
 var listArray =     List.Retrieve({Property:"ListName",SimpleOperator:"IN",Value:lists}); 
 return listArray;
}

function outputstr(any){
 Write(Stringify(any));
}
 
// load the pub lists and locate the subscriber
try{
  
 if (debug){
   Platform.Response.Write('SubscriberKey: '+foo+"<br />"); 
   Platform.Response.Write('Master DE: '+MasterDE+"<br />"); 
   Platform.Response.Write('Subscriber Key Column: '+ SubscriberKeyName+"<br />"); 
 }
 
 //find the list objects using the pre defined list above
 var result = findlists(publists);

 var reslists = [];
 for (i=0; i<result.length; i++){
   reslists.push({id: result[i].ID, name:result[i].ListName});

 }
  Variable.SetValue("@sublists",reslists);
  if (debug){
    Platform.Response.Write("List Object: ");
    outputstr(reslists);
    Platform.Response.Write("<br />"); 
  }
  
 // locate the subscribe object
 var result = searchSubInDE(foo,MasterDE,SubscriberKeyName);

 if(debug){
   Platform.Response.Write("Subscribe Object: "); 
   outputstr(result[0]);
   Platform.Response.Write("<br />"); 
 }
  
 if(result.length>0){
   Variable.SetValue("@subscriber",result[0]);
   Variable.SetValue("@firstname",result[0]['First Name']); 
   Variable.SetValue("@lastname",result[0]['Last Name']); 
   Variable.SetValue("@birthdate",result[0]['BirthDate']); 
   Variable.SetValue("@phone",result[0]['Phone']); 
   Variable.SetValue("@email",result[0]['Email']); 

   Variable.SetValue("@HasOptedOutOfEmail",result[0]['HasOptedOutOfEmail']); 
   Variable.SetValue("@HasOptedOutOfTxt",result[0]['HasOptedOutOfTxt']);
   
 
 // process form post values
 //var requestMethod = Request.Method();
 //var unsub = Attribute.GetValue('unsub');
   var unsub = false;
   if (requestMethod=='POST' && unsub == true){
   
   var varset = {'Email' : Attribute.GetValue('email'),
    'BirthDate' : Attribute.GetValue('birthdate'),
    'First Name' : Attribute.GetValue('firstname'),
    'Last name' : Attribute.GetValue('lastname'),
    'Phone' : Attribute.GetValue('phone')}
   
   saveSubInDE(varset,MasterDE, SubscriberKeyName,foo);
   
   
   
   // process list preference
   //for (var val in publists)
    //Attribute.GetValue('')
   
   if(unsub)
    unsubEvent(foo,jobid,listid,0,"User unsubscribe from preference centre");
   }
   
 }else{
  Variable.SetValue("@error",'No Subscriber Found!'); 
 }
 
 
}catch (e){
 Platform.Response.Write(e); 
}



</script>

<html>
 <head>
 <title>Preference Centre</title>
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
<script type="text/javascript">

  $(document).ready(function(){
    $('input#HasOptedOutofEmail input#HasOptedOutOfTxt').change(function(e){
      $('#substatus').val("true");
    });
    $('input#unsub').on('checked',function(){
      if ($('input#HasOptedOutOfEmail').is( ":not(:checked)" ))
       $('input#HasOptedOutOfEmail, input#HasOptedOutOfTxt').prop("checked",true);
      elseif ($('input#HasOptedOutOfTxt').is( ":not(:checked)" ))
      $('input#HasOptedOutOfTxt').prop("checked",true);
    });

    $('#newObjectform').on('submit',function(){
        var chkArray = [];

      $("input#list.inputbox:checked").each(function() {
          console.log($(this).val());
          chkArray.push($(this).val());
      });  
      var listids = JSON.stringify(chkArray);
      $("input#listid").val(listids);

    })
  });

</script>
 </head>
<body style="font-family:Verdana;color:#aaaaaa;">


<div style="background-color:#e5e5e5;padding:15px;">
  <h2>Preference Centre</h2>
  <p>
        this is a pre form header
  </p>
</div>

%%[ if empty(@error) then ]%%

<div class="error">
    %%[ if @updateSfRecord == 1 then ]%%
         <p>SF Record Updated</p>
    %%[ elseif @updateSfRecord == 0 then ]%%
      <p>SF Update Failed</p>
    %%[ endif ]%%
</div>
<div style="overflow:auto">
  
  <div class="main">
    <form id="newObjectform"  action="%%= RequestParameter('PAGEURL') =%%" method="post">
     
      <div id="firstname" class="inputDiv">
       <label for="firstname" class="inputLabel" >First Name: </label>
       <input type="text" id="firstname" name="firstname" value="%%=v(@firstname)=%%" required maxlength="40">
      </div>
     
      <div id="lastname" class="inputDiv">
       <label for="lastname" class="inputLabel" >Last Name: </label>
       <input type="text" id="lastname" name="lastname" value="%%=v(@lastname)=%%" required maxlength="40">
      </div>
     
      <div id="phone" class="inputDiv">
       <label for="phone" class="inputLabel" >Phone: </label>
       <input type="text" id="phone" value="%%=v(@Phone)=%%" name="phone" required maxlength="40">
      </div>

      <div id="BirthDate" class="inputDiv">
       <label for="BirthDate" class="inputLabel">Birth Date: </label>
       <input type="date" id="BirthDate" value="%%=v(FormatDate(@BirthDate,'yyyy-MM-dd'))=%%" name="BirthDate" min="1930-01-01" max="%%=v(FormatDate(NOW(),'iso'))=%%">
      </div>
     
      <div id="email" class="inputDiv">
       <label for="email" class="inputLabel" >Email: </label>
       <input type="email" id="email" value="%%=v(@Email)=%%" name="email" required maxlength="40" required pattern="^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$">
      </div>
     
     
      <h4>Subscribed to:</h4>
     
      <script runat=server>
       var sublists = Variable.GetValue("@sublists");
       var subscriber = Variable.GetValue("@subscriber");
       
       for (var index in sublists){
         var checked='';
         if (debug) outputstr(index);
         var temp = index['name']+'';
         try{
           if (subscriber[temp]) {
             checked='checked';
           }
         }
         catch(e){
           checked = '';
           if (debug) outputstr(e);
         }
           
        Write('<div id="attributeName" class="inputDiv">');   
        Write('<label for="name" class="inputLabel">'+index["name"]+'</label>');   
        Write('<input type="checkbox" class="inputBox" value="'+index["id"] +'"id="list" name="'+index["name"]+'" value="'+index["id"]+'" '+checked+'>');
        Write('</div>');
       }
        
      </script>
     
      <h4 id="vsp">Actions </h4>
     
      <div id="unsub" class="inputDiv">
       <label for="unsub" class="inputLabel">Unsubscribe from all communications?</label>
       <input type="checkbox" class="inputBox" id="unsub" name="unsub">
      </div>
      
      <div id="HasOptedOutOfEmail" class="inputDiv">
       <label for="emailunsub" class="inputLabel">Unsubscribe from all emails?</label>
       <input type="checkbox" class="inputBox" id="HasOptedOutOfEmail" name="HasOptedOutOfEmail" value="true" %%[ if (@HasOptedOutofEmail == "true") then ]%% checked %%[ else ]%%  %%[ endif ]%%>
      </div>
      <div id="txtunsub" class="inputDiv">
       <label for="txtunsub" class="inputLabel">Unsubscribe from all Txt messages?</label>
       <input type="checkbox" class="inputBox" id="HasOptedOutOfTxt" name="HasOptedOutOfTxt" value="true" %%[ 
       if (@HasOptedOutOfTxt == "true") then ]%% checked %%[ else ]%%  %%[ endif ]%%>
      </div>

      <div id="buttonDiv" class="testClass">
        <input name="substatus" type="hidden" value="" id='substatus'/>
        <input name="listid" type="hidden" value="" id='listid'/>
        <button class="button3" type="submit"> Submit </button>
      </div>
    </form>
  </div>

</div>
%%[
ELSE
   outputLine(concat("Error Message: ", @error))
ENDIF
]%%

  
  </body>
</html>
