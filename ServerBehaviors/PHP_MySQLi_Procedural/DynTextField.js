// Copyright 2002, 2003 Macromedia, Inc. All rights reserved.
/* Diekembangkan Senimandigital 2020 */

var HELP_DOC = MM.HELP_ssDynamicTextField;

var _input_type_text__tag = new TagMenu("DynTextField.htm", "input_type_text__tag", "INPUT/TEXT,TEXTAREA,INPUT/PASSWORD,INPUT/HIDDEN");
var _expression1 = new DynamicTextField("DynTextField.htm", "expression1", "");

function initializeUI()
{
  var elts;

  _input_type_text__tag.initializeUI();
  _expression1.initializeUI();

  elts = document.forms[0].elements;
  if (elts && elts.length)
    elts[0].focus();
}


function findServerBehaviors()
{
  var sbList = dwscripts.findSBs(MM.LABEL_DynamicTextfieldTitle);

  //Fixes the title for textarea instances. For dynamic textareas, we find directives, so
  //we can't get the name of the text area using a normal search pattern. Here we find
  //titles without names, and use the name from the parent node.
  for (var i=0; i<sbList.length; i++)
  {
    // remove items which are not textarea or input tags
    var tNode = sbList[i].parameters.input_type_text__tag;
    if (!tNode || !dw.nodeExists(tNode) || (tNode.tagName != "TEXTAREA" && tNode.tagName != "INPUT"))
    {
      sbList[i].deleted = true;
      continue;
    }
    
    if (sbList[i].title.indexOf("@@theName@@")!=-1 && sbList[i].parameters.input_type_text__tag)
    {
      var theName = sbList[i].parameters.input_type_text__tag.name;
      if (theName) {
        sbList[i].title = sbList[i].title.replace(/@@theName@@/,theName);
      }
    }
  }
  
  return sbList;
}

function canApplyServerBehavior(sbObj)
{
  var success = true;
  if (success)
  {
    success = _input_type_text__tag.canApplyServerBehavior(sbObj);
  }
  if (success)
  {
    success = _expression1.canApplyServerBehavior(sbObj);
  }
  if (success)
  {
    success = dwscripts.canApplySB(sbObj, false); // preventNesting is false
  }
  return success;
}


function applyServerBehavior(sbObj)
{
  var paramObj = new Object();
  var errStr = "";

  if (!errStr)
  {
    errStr = _input_type_text__tag.applyServerBehavior(sbObj, paramObj);

    if (paramObj.input_type_text__tag.tagName && paramObj.input_type_text__tag.tagName.toUpperCase() == "TEXTAREA") {
      paramObj.MM_subType = "textarea";
    }
  
  }
  if (!errStr)
  {
    errStr = _expression1.applyServerBehavior(sbObj, paramObj);
  }

  if (!errStr)
  {
    dwscripts.applySB(paramObj, sbObj)
  }
  return errStr;
}

function inspectServerBehavior(sbObj)
{
  _input_type_text__tag.inspectServerBehavior(sbObj);
  _expression1.inspectServerBehavior(sbObj);
}


function deleteServerBehavior(sbObj)
{
  _input_type_text__tag.deleteServerBehavior(sbObj);
  _expression1.deleteServerBehavior(sbObj);

  dwscripts.deleteSB(sbObj);
}


function analyzeServerBehavior(sbObj, allRecs)
{
  _input_type_text__tag.analyzeServerBehavior(sbObj, allRecs);
  _expression1.analyzeServerBehavior(sbObj, allRecs);
}


function displayHelp()
{
  // Replace the following call if you are modifying this file for your own use.
  dwscripts.displayDWHelp(HELP_DOC);
}


function updateUI(controlName, event)
{
  if (window["_" + controlName] != null)
  {
    var controlObj = window["_" + controlName];

    if (_input_type_text__tag.updateUI != null)
    {
      _input_type_text__tag.updateUI(controlObj, event);
    }
    if (_expression1.updateUI != null)
    {
      _expression1.updateUI(controlObj, event);
    }
  }
}
