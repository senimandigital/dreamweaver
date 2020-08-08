//SHARE-IN-MEMORY=true

function Dropdown_Element_Name(behaviorName, paramName) {
  this.behaviorName = behaviorName;
  this.paramName = paramName;
  this.listControl = '';
}

Dropdown_Element_Name.prototype.initializeUI = Dropdown_Element_Name_initializeUI;

Dropdown_Element_Name.prototype.getValue = Dropdown_Element_Name_getValue;
Dropdown_Element_Name.prototype.pickValue = Dropdown_Element_Name_pickValue;
Dropdown_Element_Name.prototype.setDisabled = Dropdown_Element_Name_setDisabled;
Dropdown_Element_Name.prototype.applyServerBehavior = Dropdown_Element_Name_applyServerBehavior;
Dropdown_Element_Name.prototype.inspectServerBehavior = Dropdown_Element_Name_inspectServerBehavior;
Dropdown_Element_Name.prototype.findServerBehaviors = Dropdown_Element_Name_findServerBehaviors;
Dropdown_Element_Name.prototype.canApplyServerBehavior = Dropdown_Element_Name_canApplyServerBehavior;
Dropdown_Element_Name.prototype.deleteServerBehavior = Dropdown_Element_Name_deleteServerBehavior;
Dropdown_Element_Name.prototype.analyzeServerBehavior = Dropdown_Element_Name_analyzeServerBehavior;

function Dropdown_Element_Name_initializeUI(labelArray, valueArray) {
  this.listControl = new ListControl(this.paramName);
  var senimandigital_file_list = dw.getDocumentDOM().body.innerHTML.match(/name="(.*?)"/g);
      for (var i=0; i < senimandigital_file_list.length; i++) {
        senimandigital_file_list[i] = senimandigital_file_list[i].substring(6, senimandigital_file_list[i].length -1);
      }

  this.listControl.setAll(senimandigital_file_list, senimandigital_file_list);

  if (labelArray) {
      if (valueArray){ this.listControl.setAll(labelArray, valueArray); } else { this.listControl.setAll(labelArray, this.labelArray); }
  } else {
    this.listControl.init();
    var found = false;
    for (var i=0; i < this.listControl.valueList.length; i++)
    {
      if (this.listControl.valueList[i] != '')
      {
        found = true;
      }
    }

    // if no values are found, set them equal to the labels
    if (!found)
    {
      for (var i=0; i < this.listControl.valueList.length; i++)
      {
        this.listControl.valueList[i] = this.listControl.list[i];
      }
    }
  }
}

function Dropdown_Element_Name_getValue() {
  return this.listControl.getValue();
}

function Dropdown_Element_Name_pickValue(theValue) {
  var retVal = this.listControl.pickValue(theValue);
  if (retVal && window.updateUI != null) {
    window.updateUI(this.paramName, "onPick");
  }
}

function Dropdown_Element_Name_setDisabled(theValue) {
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

function Dropdown_Element_Name_applyServerBehavior(sbObj, paramObj, emptyErrorMessage) {
  var retVal = "";
  paramObj[this.paramName] = this.listControl.getValue();
  if (emptyErrorMessage && paramObj[this.paramName] == "")  {
    retVal = emptyErrorMessage;
  }
  return retVal;
}

function Dropdown_Element_Name_inspectServerBehavior(sbObj){
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

function Dropdown_Element_Name_findServerBehaviors(paramObj) { }
function Dropdown_Element_Name_canApplyServerBehavior(sbObj, paramObj) {  return true; }
function Dropdown_Element_Name_deleteServerBehavior(sbObj) { }
function Dropdown_Element_Name_analyzeServerBehavior(sbObj, allRecs) { }
