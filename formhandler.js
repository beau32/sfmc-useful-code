<script runat="server">
  
  Platform.Load("core","1.1.1");

  function out(s){
      Write(Stringify(s));  
  }
  
  var debug= false;
  if (Request.GetFormField('d')) debug = true;
  
  if (debug) Write('v3');

  var jsonpost = Platform.Request.GetPostData();
  
  try{
  //var dataextension = 'OnlineForms';
  var dataextension = Request.GetFormField('DE')
  var requestMethod = Request.Method();
  //var fields = "FirstName,LastName";
  var fields= Request.GetFormField('Fields');
    
  var fieldvalues=[];


  if (requestMethod=='POST' && dataextension.length>0 && fields.length>0 ) {
    fields = fields.split(',');
  }else{
    throw 'Parameters are missing!';
  }
    
 
  for( var i=0;i<fields.length; i++){
    fieldvalues[i]= Request.GetFormField(fields[i]);
    
  }
  if(debug){
   out(fields);
   out(fieldvalues);
  }
  var rows = Platform.Function.InsertData(dataextension,fields,fieldvalues);    
    
  Write('{status:200, msg: "Succeed"}');  
  
    
  }catch(e){
    
   if (debug) out(e);
   Write('{status:500, msg: "Error"}');
   
  }
</script>
