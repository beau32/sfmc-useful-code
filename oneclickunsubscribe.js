<script runat=server>
Platform.Load("core","1.1.1");

/*
var list = Base64Decode(Attribute.GetValue('list'));
var jobid = Attribute.GetValue('jobid');
var foo = Base64Decode(Attribute.GetValue('foo'));
*/

/* test ids */
var foo = '{subscriberkey}';
var jobid = '{jobid}';
var list = "{listid}";

var MasterDE = 'Master Subscriber';
var SubscriberKeyName = "Contact ID";

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

 
function searchSubInDE(subkey, deName){

 var testDE = DataExtension.Init(MasterDE);
 var data = testDE.Rows.Lookup([SubscriberKeyName], [subkey]);

 return data;
}
function saveSubInDE(varset, subkeyvalue, deName, key){

 var testDE = DataExtension.Init(deName);
 var data = testDE.Rows.Update(varset, [key], [subkeyvalue]);

 return data;
}
function findlists(lists){
 var listArray = List.Retrieve({Property:"ListName",SimpleOperator:"IN",Value:publists}); 
}
function unsubtopub(listid, subscriberkey, EmailAddress) {
    var prox = new Script.Util.WSProxy();
    var props = { 
        SubscriberKey: subscriberkey,
        EmailAddress: EmailAddress,
        Lists: [{
            ID: obj.listid,
            Status: 'Unsubscribed'
        }]
    };
    var data = prox.updateItem("Subscriber", props, options);
    
    return data.Results[0].StatusCode;
}
function outputstr(any){
 Write(Stringify(any));
}

function updatesfobject(SubscriberKeyName, SubscriberKey, devars){
    var results = 0;
    
    var fieldArr = [];
    fieldArr.push('HasOptedOutOfEmail');
    fieldArr.push(devars['HasOptedOutOfEmail']);
    

    // detect Contact or Lead
    var sfObj = SubscriberKey.substring(1,3) == "003" ? "Contact" : "Lead";
    var updateSFObject = "";
    updateSFObject += "\%\%[ ";
    updateSFObject += "set @SFUpdateResults = UpdateSingleSalesforceObject('" + sfObj + "',";
    updateSFObject += "'" + SubscriberKey + "','"+  fieldArr.join("','") + "'";
    updateSFObject += ") ";
    updateSFObject += "output(concat(@SFUpdateResults)) ";
    updateSFObject += "]\%\%";

    try {
      results = Platform.Function.TreatAsContent(updateSFObject);
    } catch (e2) {
      if (debug) {
          Write("<br>error updatesfobject: " + outputstr(e2));
      }
    }
    return results;
  }
  
  try{
  
    var foo = Base64Decode(foo);

    if (debug){
      Platform.Response.Write('SubscriberKey: '+foo+"<br />"); 
      Platform.Response.Write('Master DE: '+MasterDE+"<br />"); 
      Platform.Response.Write('Subscriber Key Column: '+ SubscriberKeyName+"<br />"); 
    }

    var result = searchSubInDE(foo,MasterDE);

    if (result.length < 1) {
      Variable.SetValue("@error",'Subscriber not found');
    }else{

      if(debug)
        outputstr(result[0]);
      
      //update DE
      var varset = {
       'HasOptedOutOfEmail' : true
      }
      
      saveSubInDE(varset, foo,MasterDE, SubscriberKeyName );
      
      //update sfobject
      if (result[0]['Type']=="Contact" || result[0]['Type']=="Lead"){
          updatesfobject(SubscriberKeyName, SubscriberKey, devars);
      }
      //log unsub event
      unsubtopub(listid, foo, result[0].Email)
    
    }
    
  }catch(e){
    if(debug)
     Platform.Response.Write(e); 
  }
</script>

%%[ if empty(@error) then ]%%
<div id="success">
      <p>
        You are unsubscribed from Leaseplan.
      </p>
</div>
%%[else]%%
<div id="error">
      <p>
        Error: %%=v(@error)=%%
      </p>
</div>
%%[endif]%%
