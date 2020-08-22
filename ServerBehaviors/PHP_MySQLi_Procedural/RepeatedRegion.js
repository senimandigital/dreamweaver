// Copyright 2001, 2002, 2003 Macromedia, Inc. All rights reserved.
var HELP_DOC = MM.HELP_ssRepeatedRegion;
var _RecordsetName = new RecordsetMenu("RepeatedRegion.htm", "RecordsetName", "");
var _PageSize = new NumericTextField("RepeatedRegion.htm", "PageSize", "");
var _Show = new RadioGroup("RepeatedRegion.htm", "Show", "");

function initializeUI() {
  var elts;

  _RecordsetName.initializeUI();
  _PageSize.initializeUI();
  _Show.initializeUI();

  elts = document.forms[0].elements;
  if (elts && elts.length)
    elts[0].focus();
}

function findServerBehaviors() {
  sbArray = dwscripts.findSBs(MM.LABEL_TitleRepeatRegion + " (@@RecordsetName@@)", SBRepeatedRegion);

  return sbArray;
}

function canApplyServerBehavior(sbObj) {
  var success = true;
  if (success)
  {
    success = _RecordsetName.canApplyServerBehavior(sbObj);
  }
  if (success)
  {
    success = _PageSize.canApplyServerBehavior(sbObj);
  }
  if (success)
  {
    success = dwscripts.canApplySB(sbObj, true); // dis-allow nesting
  }

  return success;
}

function applyServerBehavior(sbObj) {
  var newObj = null;
  var paramObj = "";
  
  if (sbObj)
  {
    newObj = sbObj.makeEditableCopy();
    paramObj = newObj.getParameters();
  }
  else
  {
    newObj = new SBRepeatedRegion();
    paramObj = newObj.getParameters();
  }
  
  var errStr = "";
  if (!errStr)
  {
    errStr = _RecordsetName.applyServerBehavior(sbObj, paramObj);
  }
  if (!errStr)
  {
    errStr = _PageSize.applyServerBehavior(sbObj, paramObj);
  }
  if (!errStr)
  {
    errStr = _Show.applyServerBehavior(sbObj, paramObj);
  }
  
  // Check if a repeat region already exists for this Recordset
  if (sbObj == null)  // new apply
  {
    var errStr = dwscripts.canInsertPageNavDisplay(paramObj["RecordsetName"], false);
  }
    
  if (!errStr)
  {
    if (!newObj.checkData(sbObj))
    {
      errStr = newObj.getErrorMessage();
    }
  }
  
  if (!errStr)
  {
    // update the old recordset if the selected RS changed
    if (sbObj && paramObj.RecordsetName != sbObj.getParameter("RecordsetName"))
    {
      var sbRecordset = dwscripts.getServerBehaviorByParam("Recordset.htm","RecordsetName",sbObj.getParameter("RecordsetName"));
      if (sbRecordset)
      {
        var oldRS = sbRecordset.makeEditableCopy() ;
        oldRS.updatePageSize(sbObj);
        oldRS.queueDocEdits();
      }
    }

    // PHP requires that we modify the recordset code when using 
    // PHP repeat region, the following code modifies the recordset 
    // so that it contains a new SQL statement that has limit functionality.  
    var sbRecordset = dwscripts.getServerBehaviorByParam("Recordset.htm","RecordsetName",paramObj["RecordsetName"]);
    if (sbRecordset)
    {
      var newRS = sbRecordset.makeEditableCopy() ;

      if (_Show.getValue() == "PageSize")
      {
        newRS.setPageSize(_PageSize.getValue());
        newRS.queueDocEdits();
      }
      else
      {
        newRS.updatePageSize(sbObj);
        newRS.queueDocEdits();
      }
    }
  }
  
  if (!errStr)
  {
    if (sbObj == null)
    {
      // first time insert
      dwscripts.fixUpSelection(dw.getDocumentDOM(), true, false);
      dwscripts.applySB(paramObj, null)
    }
    else
    {
      // edit the cfoutput tag by hand
      newObj.queueDocEdits();      
      dwscripts.applyDocEdits();
    }
  }
  
  return errStr;
}

function inspectServerBehavior(sbObj) {
  //strange images appear when we attempt to set the value of a disabled control.
  _PageSize.setDisabled(false);

  _RecordsetName.inspectServerBehavior(sbObj);
  _PageSize.inspectServerBehavior(sbObj);
  
  var sbRecordset = dwscripts.getServerBehaviorByParam("Recordset.htm","RecordsetName",sbObj.getParameter("RecordsetName"));
  if (sbRecordset)
  {
    var PageSize = sbRecordset.getPageSize() ;
    
    // Custom code added to handle the radio buttons
    if (PageSize)
    {
      _Show.pickValue("PageSize");
      _PageSize.setValue(PageSize);
    }
    else
    {
      _Show.pickValue("All");
      _PageSize.setValue("10");
    }
  }
  else
  {
    _Show.pickValue("All");
    _PageSize.setValue("10");
  }

  updateUI("Show");
}

function deleteServerBehavior(sbObj) {
  _RecordsetName.deleteServerBehavior(sbObj);
  _PageSize.deleteServerBehavior(sbObj);

  var sbRecordset = dwscripts.getServerBehaviorByParam("Recordset.htm","RecordsetName",sbObj.getParameter("RecordsetName"));
  if (sbRecordset)
  {
    var newRS = sbRecordset.makeEditableCopy() ;
    newRS.updatePageSize(sbObj);
    newRS.queueDocEdits();
  }
      
  dwscripts.deleteSB(sbObj);
}

function analyzeServerBehavior(sbObj, allRecs){
  _RecordsetName.analyzeServerBehavior(sbObj, allRecs);
  _PageSize.analyzeServerBehavior(sbObj, allRecs);

  sbObj.analyze(allRecs);

  var rsName = sbObj.getParameter("RecordsetName")
  sbObj.setParameter("NeedsPageSize_" + rsName, true);
}

function updateUI(controlName, event) {
  if (window["_" + controlName] != null)
  {
    var controlObj = window["_" + controlName];

    if (_RecordsetName.updateUI != null)
    {
      _RecordsetName.updateUI(controlObj, event);
    }
    if (_PageSize.updateUI != null)
    {
      _PageSize.updateUI(controlObj, event);
    }
  }

  // Custom code added to handle the radio buttons
  if (controlName == "Show")
  {
    if (_Show.getValue() == "PageSize")
    {
      _PageSize.setDisabled(false);
    }
    else if (_Show.getValue() == "All")
    {
      _PageSize.setDisabled(true);
    }
  }
}

function displayHelp() {
  dwscripts.displayDWHelp(HELP_DOC);
}

function SBRepeatedRegion(name, title, selectedNode) {
  // Use the init function for construction.
  this.initServerBehavior(name, title, selectedNode);
}

SBRepeatedRegion.prototype.__proto__ = ServerBehavior.prototype;
SBRepeatedRegion.prototype.analyze = SBRepeatedRegion_analyze;
SBRepeatedRegion.prototype.checkData = SBRepeatedRegion_checkData;
SBRepeatedRegion.prototype.getRecordsetName = SBRepeatedRegion_getRecordsetName;
SBRepeatedRegion.prototype.isPageNavigation = SBRepeatedRegion_isPageNavigation;
SBRepeatedRegion.prototype.getRecordset = SBRepeatedRegion_getRecordset ;

function SBRepeatedRegion_analyze(allRecs) {
  // remove our repeat region references if another SB claims the cfoutput
  // JALBANO: Understand this: this.deleteIfAlreadyReferenced(allRecs);
}

function SBRepeatedRegion_checkData(sbObj) {
  var isValid = true;
  var show = this.getParameter("Show");
   
  // Clear out the error message.
  this.setErrorMessage("");
  
  if (show == "PageSize")
  {
    // Check that pagesize is an integer greater than 0.
    var pageSize = this.getParameter("PageSize");
    if ((pageSize < 1) || (parseInt(pageSize) != pageSize))
    {
      this.appendErrorMessage(MM.MSG_InvalidPageSize);
      isValid = false;
    }
    
    // Start row and max row are not needed in this case. Make them "".
    this.setParameter("StartRow", "");
    this.setParameter("MaxRecords", "");
  }
  else if (show == "FixedRange")
  {
    var MaxRecords = this.getParameter("MaxRecords");
    if ((MaxRecords < 1) || (parseInt(MaxRecords) != MaxRecords))
    {
      this.appendErrorMessage(MM.MSG_InvalidMaxRows);
      isValid = false;
    }
    
    var startRow = this.getParameter("StartRow");
    if ((startRow < 1) || (parseInt(startRow) != startRow))
    {
      this.appendErrorMessage(MM.MSG_InvalidStartRow);
      isValid = false;
    }
    // PageSize is not needed. Make it "".
    this.setParameter("PageSize", "");
  }
  
  return isValid;
}


function SBRepeatedRegion_getRecordsetName() {

   return this.getParameter("RecordsetName");
}

function SBRepeatedRegion_isPageNavigation() {
  var retVal = false;

  if (this.getParameter("PageSize"))
  {
    retVal = true;
  }

  var rs = this.getRecordset() ;
  var PageSize = rs.getPageSize() ;

  if ( PageSize )
  {
    retVal = true ;
  }

  return retVal;
}


function SBRepeatedRegion_getRecordset() {
var sbObjs = dwscripts.getServerBehaviorsByFileName('Recordset.htm');
  
  if ( sbObjs.length == 1 )
  {
    retVal = sbObjs[0] ;
  }
  else
  {
    RecordsetName = this.getRecordsetName();
    for( i = 0; i < sbObjs.length; i++ )
    {
      if ( sbObjs[i].getParameter("RecordsetName") == RecordsetName )
      {
        retVal = sbObjs[i] ;
      }
    }
  }
  return retVal ;
}

