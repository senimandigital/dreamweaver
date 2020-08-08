//SHARE-IN-MEMORY=true

function Dropdown_Server_Model(behaviorName, paramName) {
  this.behaviorName = behaviorName;
  this.paramName = paramName;
  this.listControl = '';
}

Dropdown_Server_Model.prototype.initializeUI = Dropdown_Server_Model_initializeUI;

Dropdown_Server_Model.prototype.getValue = Dropdown_Server_Model_getValue;
Dropdown_Server_Model.prototype.pickValue = Dropdown_Server_Model_pickValue;
Dropdown_Server_Model.prototype.setDisabled = Dropdown_Server_Model_setDisabled;

Dropdown_Server_Model.prototype.applyServerBehavior = Dropdown_Server_Model_applyServerBehavior;
Dropdown_Server_Model.prototype.inspectServerBehavior = Dropdown_Server_Model_inspectServerBehavior;
Dropdown_Server_Model.prototype.findServerBehaviors = Dropdown_Server_Model_findServerBehaviors;
Dropdown_Server_Model.prototype.canApplyServerBehavior = Dropdown_Server_Model_canApplyServerBehavior;
Dropdown_Server_Model.prototype.deleteServerBehavior = Dropdown_Server_Model_deleteServerBehavior;
Dropdown_Server_Model.prototype.analyzeServerBehavior = Dropdown_Server_Model_analyzeServerBehavior;


function Dropdown_Server_Model_initializeUI(labelArray, valueArray) {
$option_label = Array(); $option_value = Array();
$server_models = dwscripts.listFolder( dw.getConfigurationPath() + '/ServerModels' );
for($i=0 ; $i < $server_models.length ; $i++ ) {
if ( dwscripts.getFileExtension( dw.getConfigurationPath() + '/ServerModels' + $server_models[$i]) != 'htm') continue;
 $option_value.push($server_models[$i]);
}
  this.listControl = new ListControl(this.paramName);
  this.listControl.setAll($option_value, $option_value);
}

function Dropdown_Server_Model_getValue() {
  return this.listControl.getValue();
}

function Dropdown_Server_Model_pickValue(theValue) {
 var retVal = this.listControl.pickValue(theValue);
 if (retVal && window.updateUI != null) {
     window.updateUI(this.paramName, "onPick");
    }
}

function Dropdown_Server_Model_setDisabled(theValue) {
  if (this.listControl)
  {
    if (theValue && !this.listControl.object.getAttribute("disabled"))
    {
      this.listControl.object.setAttribute("disabled", true);
    }
    else if (!theValue && this.listControl.object.getAttribute("disabled"))
    {
      this.listControl.object.removeAttribute("disabled");
    }
  }
}

function Dropdown_Server_Model_applyServerBehavior(sbObj, paramObj, emptyErrorMessage) {
  var retVal = "";
  paramObj[this.paramName] = this.listControl.getValue();
  if (emptyErrorMessage && paramObj[this.paramName] == "")  {
    retVal = emptyErrorMessage;
  }
  return retVal;
}

function Dropdown_Server_Model_inspectServerBehavior(sbObj) {
  var retVal = "";
  var value = sbObj.parameters[this.paramName];
  retVal = this.pickValue(value);
  var currText = this.listControl.get();
  retVal = this.listControl.pick(currText);
  
  if (!retVal)
  {
    //alert("Invalid value passed for parameter " + this.paramName);
  }
    
  return retVal;
}

function Dropdown_Server_Model_findServerBehaviors(paramObj) {
  // nothing needed here
}

function Dropdown_Server_Model_canApplyServerBehavior(sbObj, paramObj) {
  return true;
}

function Dropdown_Server_Model_deleteServerBehavior(sbObj) {
  // nothing needed here
}

function Dropdown_Server_Model_analyzeServerBehavior(sbObj, allRecs) {
  // nothing needed here
}