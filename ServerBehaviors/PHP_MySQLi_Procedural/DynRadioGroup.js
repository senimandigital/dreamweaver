// Copyright 2001, 2002, 2003, 2004, 2005 Macromedia, Inc. All rights reserved.

var HELP_DOC = MM.HELP_ssDynamicRadioGroup;

var GROUP_NAME = "DynRadioGroup";
var PART_CHECKED_ATTR = "DynRadioGroup_checkedAttr";
var _input_type_radio__tag = new TagMenu(GROUP_NAME, "input_type_radio__tag", "INPUT/RADIO");
var _DynValue = new DynamicTextField(GROUP_NAME, "DynValue", "");

function initializeUI()
{
  var elts;

  _input_type_radio__tag.initializeUI();
  _DynValue.initializeUI();

  elts = document.forms[0].elements;
  if (elts && elts.length)
    elts[0].focus();
}

function findServerBehaviors()
{
  var sbObjs = new Array();
  var radioGroups = _input_type_radio__tag.getTagElements();
  var nGroups = radioGroups.length;
  var searchPatt = extPart.getSearchPatterns(PART_CHECKED_ATTR);
  var quickSearch = extPart.getQuickSearch(PART_CHECKED_ATTR);
  var currPart, currRadio, currSB, currGroup, i, j, nRadios, aMatch;

  for (i=0;i<nGroups;i++) // traverse through groups
  {
    currSB = null;
    currGroup = radioGroups[i];
    nRadios = currGroup.length;
    for (j=0;j<nRadios;j++) // traverse through buttons within a group
    {
      currRadio = currGroup[j];
      nodeStr = currRadio.outerHTML;
      aMatch = extUtils.findPatternsInString(nodeStr, quickSearch, searchPatt)
      if (aMatch)
      {
        // create a new server behavior object, or add participant info
        // to existing server behavior object
        if (currSB==null)
        {
          currSB = new ServerBehavior();
          currSB.setTitle(MM.LABEL_DynamicRadioGroupTitle + " (" + currRadio.name + ")");
          currSB.ordinalOfGroup = i;
        }

		partParamObj = extUtils.extractParameters(searchPatt);

		if (partParamObj.RadioButtonValue != currRadio.value)
		{
		  currSB.incomplete = true;
		  currSB.errMsg = MM.MSG_RadioValuesHaveChanged;
		}
        currPart = new SBParticipant(PART_CHECKED_ATTR,currRadio,aMatch[0],aMatch[1],partParamObj);

        currSB.addParticipant(currPart);
		currSB.selectedNode = currPart.getNode();

      }

      // if there is a server behavior in this radio group, and we have collected
      // all of the participants, then add server behavior to server behavior array
      if ( j==(nRadios-1) && currSB != null)
	  {
	    currSB.DynValue = partParamObj.DynValue;
	    sbObjs.push(currSB);

      }

    } // end loop looping through radio buttons within a group
  }   // end loop looping through the groups

  return sbObjs;
}

function canApplyServerBehavior(sbObj)
{
  var success = true;
  if (success)
  {
    success = _input_type_radio__tag.canApplyServerBehavior(sbObj);
  }

  return success;

}

function applyServerBehavior(sbObj)
{
  var radioGroup = _input_type_radio__tag.listControl.getValue();
  var i, currButton=null, insertionStr = "", nButtons = radioGroup.length;
  var partParams, errStr = "",msg="",paramObj = new Object();

  errStr = _DynValue.applyServerBehavior(sbObj, paramObj, MM.MSG_NothingEntered);

  if (!errStr && !sbObj)
  {
    // If this is an insert, make sure a dynamic radio group does not already exist
    //   on the chosen one.
    var sbList = dw.sbi.getServerBehaviors();
    for (var i = 0; i < sbList.length; ++i)
    {
      if (   sbList[i].title.indexOf(MM.LABEL_DynamicRadioGroupTitle) == 0
          && radioGroup.length
          && dwscripts.findInArray(sbList[i].participants, radioGroup[0]) != -1
         )
      {
        errStr = MM.MSG_RadioGroupHasServerBehavior;
      }
    }
  }

  if (errStr)  return errStr;

  var newDynValue = getFieldFromDynDataCode(_DynValue.getValue());
  if (newDynValue == _DynValue.getValue())
  {
    // format properly: strip delimiters off, surround in quotes, etc.
    newDynValue = dwscripts.encodeDynamicExpression(_DynValue.getValue());
  }
  
  var partParams = new Object();

	partParams.checked = 'checked=\\"checked\\"';

  partParams.DynValue = newDynValue; // this value is the same for all participants

  // line up all of the edits for insertion (each radio button is an edit)

  if (sbObj) // if inspecting, instead of applying for the first time
  {
    var sbParts = sbObj.getParticipants();
    var nParts = sbObj.getParticipantCount(), currPart, currNodeSegment;
    var dynamicValueChanged = (newDynValue != sbObj.DynValue);
    var radioValueChanged,newInsertionStr,prevPartParams;

    for(i=0;i<nParts;i++)
    {
      currPart = sbParts[i];
      prevPartParams = currPart.getParameters();
      radioValueChanged = (prevPartParams.RadioButtonValue != currPart.getNode().value);

      // only edit the document if the dynamic expression or radio button value has changed
      if (dynamicValueChanged || radioValueChanged)
      {
        var priorNodeSegment = currPart.getNodeSegment();
        partParams.RadioButtonValue = currPart.getNode().value;
        newInsertionStr = extPart.getInsertString(GROUP_NAME,PART_CHECKED_ATTR,partParams,"nodeAttribute");

        docEdits_queue(newInsertionStr,priorNodeSegment,currPart.getWeight(),currPart.getNode());
      }
    }
  }
  else // we are applying the edits for the first time, not inspecting existing edits
  {
    var currRadio;
    for (i=0;i<nButtons;i++)
    {
      currRadio = radioGroup[i];
      partParams.RadioButtonValue = currRadio.value;
      insertionStr = extPart.getInsertString(GROUP_NAME,PART_CHECKED_ATTR,partParams,"nodeAttribute");
      dwscripts.queueDocEdit(insertionStr,"nodeAttribute",currRadio);
    }
  }

  // perform edits
  dwscripts.applyDocEdits();


  return errStr;
}


function inspectServerBehavior(sbObj)
{
  _input_type_radio__tag.listControl.setIndex(sbObj.ordinalOfGroup);
  _input_type_radio__tag.listControl.object.setAttribute("disabled","true");
  _DynValue.setValue(dwscripts.decodeDynamicExpression(sbObj.DynValue));

  // alert err msg if html radio button value does not match the server code
  if (sbObj.incomplete && sbObj.errMsg)
    alert(sbObj.errMsg);

}


function deleteServerBehavior(sbObj)
{
  _input_type_radio__tag.deleteServerBehavior(sbObj);
  _DynValue.deleteServerBehavior(sbObj);

  dwscripts.deleteSB(sbObj);
}


function analyzeServerBehavior(sbObj, allRecs)
{
  _input_type_radio__tag.analyzeServerBehavior(sbObj, allRecs);
  _DynValue.analyzeServerBehavior(sbObj, allRecs);
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

    if (_input_type_radio__tag.updateUI != null)
    {
      _input_type_radio__tag.updateUI(controlObj, event);
    }
    if (_DynValue.updateUI != null)
    {
      _DynValue.updateUI(controlObj, event);
    }
  }
}



function deleteDynamicCheckedAttributesFromGroup(groupArr)
{
  var nRadios = groupArr.length, i, nodeStr, currRadio, aMatch;
  var searchPatt = extPart.getSearchPatterns(PART_CHECKED_ATTR);
  var quickSearch = extPart.getQuickSearch(PART_CHECKED_ATTR);

  for (i=0;i<nRadios;i++)
  {
    currRadio = groupArr[i];
    nodeStr = currRadio.outerHTML;
    aMatch = extUtils.findPatternsInString(nodeStr, quickSearch, searchPatt)

  }

}

function getFieldFromDynDataCode(value)
{
  var pos = value.search(/(\$row_([^\r\n]*?)\[([^\r\n]*?)\])/i);
  if (pos != -1)
  {
    return RegExp.$1;
  }
  else
  {
  	return value;
  }
}

