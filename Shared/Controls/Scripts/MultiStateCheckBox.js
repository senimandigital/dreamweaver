//SHARE-IN-MEMORY=true
// Copyright 2001 Macromedia, Inc. All rights reserved.


//--------------------------------------------------------------------
// CLASS:
//   MultiStateCheckBox
//
// DESCRIPTION:
//   This class represents a multistatecheckbox control
//
// PUBLIC PROPERTIES:
//
// PUBLIC FUNCTIONS:
//
//   initializeUI()
//
//   setCheckedState(isChecked)
//   getCheckedState()
//   enable()
//
//--------------------------------------------------------------------

var configPath = dw.getConfigurationPath(); 

var chImagePathChecked   = configPath + "/Shared/MM/Images/checkbox_sel.gif"; 
var cbImagePathUnchecked = configPath + "/Shared/MM/Images/checkbox.gif"; 
var cbImagePathDisabled  = configPath + "/Shared/MM/Images/checkbox_dis.gif"; 


//-------------------------------------------------------------------
// FUNCTION:
//   MultiStateCheckBox
//
// DESCRIPTION:
//   Constructor function for the multistatecheckbox control
//
// ARGUMENTS:
//   paramName - the name of the parameter to be controlled.
//
// RETURNS:
//--------------------------------------------------------------------

function MultiStateCheckBox(paramName) 
{
  this.paramName = paramName;
  this.multicheckBox = dwscripts.findDOMObject(paramName);
  // alert("this.paramName: " + this.paramName + "\nthis.multicheckBox: " + this.multicheckBox + "\nthis.multicheckBox.outerHTML:\n" + this.multicheckBox.outerHTML); 
}

//public methods
MultiStateCheckBox.prototype.initializeUI = MultiStateCheckBox_initializeUI;
MultiStateCheckBox.prototype.setCheckedState = MultiStateCheckBox_setCheckedState;
MultiStateCheckBox.prototype.getCheckedState = MultiStateCheckBox_getCheckedState;
MultiStateCheckBox.prototype.updateUI = MultiStateCheckBox_updateUI;
//--------------------------------------------------------------------
// FUNCTION:
//   initializeUI()
//
// DESCRIPTION:
//
// ARGUMENTS: 
//
// RETURNS:
//--------------------------------------------------------------------
function MultiStateCheckBox_initializeUI() 
{
  // nothing needed here 
}


//--------------------------------------------------------------------
// FUNCTION:
//   setCheckedState
//
// DESCRIPTION:
//   Sets the multistatecheckbox to the given state
//
// ARGUMENTS: 
//   isChecked - boolean - true to check the checkbox, false otherwise
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function MultiStateCheckBox_setCheckedState(checkedState) 
{
  checkedState = checkedState.toLowerCase()

  // disabled -> checked
  if (checkedState == "disabled")
  {
    this.multicheckBox.setAttribute("value","disabled"); 
    this.multicheckBox.setAttribute("src",cbImagePathDisabled);  
  }
  // checked -> unchecked
  else if (checkedState == "checked")
  {
    this.multicheckBox.setAttribute("value","checked"); 
    this.multicheckBox.setAttribute("src",chImagePathChecked);         
  }
  // unchecked -> disabled 
  else if (checkedState == "unchecked") 
  {
    this.multicheckBox.setAttribute("value","unchecked"); 
    this.multicheckBox.setAttribute("src",cbImagePathUnchecked);        
  }
  else{
    alert("Unknown 'checkedstate'. Valid checked states are disabled, checked, and unchecked."); 
  }
}



//--------------------------------------------------------------------
// FUNCTION:
//   getCheckedState
//
// DESCRIPTION:
//   Gets the checked state
//
// ARGUMENTS: 
//   none
//
// RETURNS:
//   true or false 
//--------------------------------------------------------------------
function MultiStateCheckBox_getCheckedState()
{
  // todo: to be filled in later (or merged possible) 
  var retValue; 
  

  
  return retValue; 
}



//--------------------------------------------------------------------
// FUNCTION:
//   CheckBox_updateUI
//
// DESCRIPTION:
//   Enables the list control
//
// ARGUMENTS:
//   none
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------

function MultiStateCheckBox_updateUI()
{
  // disabled -> checked
  if (this.multicheckBox.getAttribute("value") == "disabled")
  {
    this.multicheckBox.setAttribute("value","checked"); 
    this.multicheckBox.setAttribute("src",chImagePathChecked);         
  }
  // checked -> unchecked
  else if (this.multicheckBox.getAttribute("value") == "checked")
  {
    this.multicheckBox.setAttribute("value","unchecked"); 
    this.multicheckBox.setAttribute("src",cbImagePathUnchecked);        
  }
  // unchecked -> disabled 
  else if (this.multicheckBox.getAttribute("value") == "unchecked") 
  {
    this.multicheckBox.setAttribute("value","disabled"); 
    this.multicheckBox.setAttribute("src",cbImagePathDisabled);            
  }
  else{
    // do nothing   
  }
}


