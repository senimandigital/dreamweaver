// Copyright 2001, 2002, 2003 Macromedia, Inc. All rights reserved.
// Diverifikasi Senimandigital 2020

var HELP_DOC = MM.HELP_ssMoveTo;
var SB_NAME = dwscripts.getSBFileName();

var _a__tag = new TagMenu(SB_NAME, "a__tag", "A");
var _RecordsetName = new RecordsetMenu(SB_NAME, "RecordsetName", "");
var _Parameters = new TextField(SB_NAME, "Parameters", "");

function initializeUI()
{
  var elts;

  _a__tag.initializeUI(MM.LABEL_NewMoveToNextLinkLabel);
  _RecordsetName.initializeUI();
  _Parameters.initializeUI();

  var rsToPick = dwscripts.getRecordsetNameWithPageNav();
  if (rsToPick)
  {
    _RecordsetName.pickValue(rsToPick);
  }

  elts = document.forms[0].elements;
  if (elts && elts.length > 1)
    elts[1].focus();
}

function findServerBehaviors()
{
  _a__tag.findServerBehaviors();
  _RecordsetName.findServerBehaviors();
  _Parameters.findServerBehaviors();

  sbArray = dwscripts.findSBs(MM.LABEL_TitleMoveToNextPage + " (@@RecordsetName@@)");

  return sbArray;
}

function canApplyServerBehavior(sbObj) {
  var success = true;
  if (success)
  {
    success = _a__tag.canApplyServerBehavior(sbObj);
  }
  if (success)
  {
    success = _RecordsetName.canApplyServerBehavior(sbObj);
  }
  if (success)
  {
    success = _Parameters.canApplyServerBehavior(sbObj);
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
    errStr = _a__tag.applyServerBehavior(sbObj, paramObj);
  }
  if (!errStr)
  {
    errStr = _RecordsetName.applyServerBehavior(sbObj, paramObj);
  }
  if (!errStr)
  {
    errStr = _Parameters.applyServerBehavior(sbObj, paramObj);
  }

  if (!errStr)
  {
    // check if a page navigation repeat region exists for this recordset
    dwscripts.warnIfNoPageNavDisplay(paramObj["RecordsetName"],true);
    
    var sbRecordset = dwscripts.getServerBehaviorByParam("Recordset.htm","RecordsetName",paramObj["RecordsetName"]);
    if (sbRecordset)
    {
      var newRS = sbRecordset.makeEditableCopy() ;
      newRS.setDefaultPageSize();
      newRS.queueDocEdits();
    }
  }

  if (!errStr)
  {
    dwscripts.fixUpSelection(dw.getDocumentDOM(), true, true);
    dwscripts.applySB(paramObj, sbObj)
  }
  return errStr;
}

function inspectServerBehavior(sbObj)
{
  _a__tag.inspectServerBehavior(sbObj);
  _RecordsetName.inspectServerBehavior(sbObj);
  _Parameters.inspectServerBehavior(sbObj);
}

function deleteServerBehavior(sbObj)
{
  _a__tag.deleteServerBehavior(sbObj);
  _RecordsetName.deleteServerBehavior(sbObj);
  _Parameters.deleteServerBehavior(sbObj);

  var sbRecordset = dwscripts.getServerBehaviorByParam("Recordset.htm","RecordsetName",sbObj.getParameter("RecordsetName"));
  if (sbRecordset)
  {
    var newRS = sbRecordset.makeEditableCopy() ;
    newRS.updatePageSize(sbObj);
    newRS.queueDocEdits();
  }

  dwscripts.deleteSB(sbObj);
}

function analyzeServerBehavior(sbObj, allRecs)
{
  _a__tag.analyzeServerBehavior(sbObj, allRecs);
  _RecordsetName.analyzeServerBehavior(sbObj, allRecs);
  _Parameters.analyzeServerBehavior(sbObj, allRecs);
  
  var rsName = sbObj.getParameter("RecordsetName")
  sbObj.setParameter("NeedsPageSize_" + rsName, true);
}


function updateUI(controlName, event)
{
  if (window["_" + controlName] != null)
  {
    var controlObj = window["_" + controlName];

    if (_a__tag.updateUI != null)
    {
      _a__tag.updateUI(controlObj, event);
    }
    if (_RecordsetName.updateUI != null)
    {
      _RecordsetName.updateUI(controlObj, event);
    }
    if (_Parameters.updateUI != null)
    {
      _Parameters.updateUI(controlObj, event);
    }
  }
}

function displayHelp() {
  dwscripts.displayDWHelp(HELP_DOC);
}
