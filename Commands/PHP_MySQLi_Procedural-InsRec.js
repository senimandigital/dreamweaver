// Copyright 2000-2006 Adobe Macromedia Software LLC and its licensors. All rights reserved.

    
//**********************GLOBAL VARS********************

var helpDoc = MM.HELP_objInsertRecord;
var SB_FILE = dw.getConfigurationPath() + "/Commands/PHP_MySQLi_Procedural-InsRec.htm";

// stores separate file dom needed for dynamic UI
var domUIPieces = dw.getDocumentDOM( dw.getConfigurationPath() + "/Commands/ServerObject-FormEditHTML.htm"); 

// global form widget variables
var _DisplayAs, _SubmitAs, _ElemUp, _ElemDown, _ElemAdd, _ElemDel;
var _GoToURL, _ElementLabel, _ColumnNames;

var _ConnectionName = new ConnectionMenu("PHP_MySQLi_Procedural-InsRec.htm", "ConnectionName");
var _TableName = new ConnectionTableMenu("PHP_MySQLi_Procedural-InsRec.htm", "TableName");

var ColumnsToAdd = new Array();  // the list of columns available for adding
var ColumnTypes = new Array();

function commandButtons(){
  return new Array(MM.BTN_OK,     "clickedOK()", 
                   MM.BTN_Cancel, "clickedCancel()",
				   "Dokumentasi", "dreamweaver.browseDocument('http://dreamweaver.phpmysource.kom/redirect.php?target=tbl_structure.php&getSiteRoot='+ dw.getSiteRoot() +'&ConnectionName='+ _ConnectionName.getValue() +'&table='+ _TableName.getValue())", 
                   MM.BTN_Help,   "displayHelp()"); 
}

function canInsertObject() {
  var retVal = true;

  var errMsgStr = "";

  if (errMsgStr)
  {
    alert (errMsgStr);
    retVal = false;
  }

  return retVal;
}
 
function clickedOK() {
  var conn = _ConnectionName.getValue();
  var table = _TableName.getValue();
  var redirectURL   = (_GoToURL.value)?_GoToURL.value:"";
  var nRows, i, currRowInfoObj, fieldInfoObj;
  var sqlObj = new SQLStatement("");
  var columnInfoList = new Array(), columnInfoNode, ElementStrArr = new Array();
  var hiddenFieldNamesArr = new Array(), hiddenFieldValuesArr = new Array();

  rowInfoArr = _ColumnNames.valueList;
  nRows = rowInfoArr.length;

  // check for error conditions
  var errMsgStr = "";
  if (!conn)
  {
    errMsgStr = MM.MSG_NoConnection;
  }
  else if (!table)
  {
    errMsgStr = MM.MSG_NoTables;
  }
  else if (!nRows)
  {
    errMsgStr = MM.Msg_NoColumnsInTable;
  }   

  // if error condition, alert it and return
  if (errMsgStr)
  {
    alert (errMsgStr);
    return;
  }
    
  // if no error conditions, build the edits to apply to the document
  MM.setBusyCursor();

  // create parameter object used to provide variables for this edit op
  // server behavior
  var paramObj = new Object(); 

  paramObj.TableAlign   = "center";
  // Get a unique form name... // senimandigital
  var formName = dwscripts.getUniqueNameForTag("FORM", "form_" + _TableName.getValue() + "_tambah_");
  paramObj.FormName = formName;

  for (i = 0; i < nRows; i++)
  {
    currRowInfoObj = rowInfoArr[i];
    fieldInfoObj = currRowInfoObj.displayAs; 
    var columnName = currRowInfoObj.column;
    fieldInfoObj.fieldName = currRowInfoObj.fieldName;
    if (currRowInfoObj.submitAs && columnName)
    {
      columnInfoNode = dwscripts.getColumnValueNode(); // get platform specific ColumnValueNode
      columnInfoNode.setColumnName(columnName);
      columnInfoNode.setColumnType(fieldInfoObj.type);
      columnInfoNode.setVariableName(getVarNameFromFormField(fieldInfoObj.fieldName));
      columnInfoNode.setSubmitAs(currRowInfoObj.submitAs);
      columnInfoList.push(columnInfoNode);
    }
        
    // handle the hidden fields
    if (fieldInfoObj.type == "hiddenField")
    {
      hiddenFieldNamesArr.push(fieldInfoObj.fieldName);
      hiddenFieldValuesArr.push(fieldInfoObj.value);
    }  
  }
  
  // Also push the Insert hidden field into the array...
  hiddenFieldNamesArr.push("MM_insert");
  hiddenFieldValuesArr.push(formName);
  
  paramObj.HiddenFieldName = hiddenFieldNamesArr;
  paramObj.HiddenFieldValue = hiddenFieldValuesArr;
  
  // this will go through all the form elements and returns a string array...
  ElementStrArr = createFormElementStrings(rowInfoArr);
  
  paramObj.ElementString = ElementStrArr;
  paramObj.ButtonText = MM.BTN_InsertRecord;
  
  paramObj.Redirect_url = redirectURL;
  paramObj.ConnectionName = conn;
  //paramObj.COnnectionPath = dwscripts.getConnectionURL(conn);
	var bIsSiteRelative = false;
	var urlFormat = getConnectionsUrlFormat(dw.getDocumentDOM());
	if (urlFormat == "virtual")
	{
	  bIsSiteRelative=true;
	}
  paramObj.ConnectionPath = dwscripts.getConnectionURL(conn,bIsSiteRelative);
	if (urlFormat == "file")
	{
		urlFormat = "require_once";
	}	
	paramObj.UrlFormat = urlFormat;	

   
  var sqlVarList = sqlObj.createInsertStatement(table, columnInfoList);    
  var sqlString = sqlObj.getStatement(true);
  paramObj.SQLStatement = sqlString;
  paramObj.SQLVariableList = sqlVarList.join(",\n                       ");

  // correct the selection
  checkThatCursorIsNotInsideOfAForm();
  dwscripts.setCursorOutsideParagraph();
  dwscripts.fixUpSelection(dw.getDocumentDOM(), false, true);
  
  FieldTypes.prepareGetSQLValueStringUpgrade();

  // Senimandigital
  dwscripts.applyGroup("RecordInsertForm", paramObj);

  // Save the selected connection for next time if there's more
  // than one connection (if there's only one, it'll get selected
  // automatically; no need to save it).
  if (_ConnectionName.listControl.getLen() > 2)
  {
    dwscripts.saveExtensionData(SB_FILE,"lastConnection",conn);
  }

  MM.clearBusyCursor();
  window.close();
}

function clickedCancel() {
  MM.commandReturnValue = "";
  window.close();
}

function displayHelp() {
  // Replace the following call if you are modifying this file for your own use.
  dwscripts.displayDWHelp(helpDoc);
}

function initializeUI() {
  // define global form elements
  _DisplayAs = new ListControl("DisplayAs");
  _SubmitAs = new ListControl("SubmitAs");
  _GoToURL  = dwscripts.findDOMObject("GoToURL");
  _ElementLabel    = dwscripts.findDOMObject("ElementLabel");
  _ColumnNames = new TreeControlWithNavControls("ColumnNames");
  _ElemUp = dwscripts.findDOMObject("elemUp");
  _ElemDown = dwscripts.findDOMObject("elemDown");
  _ElemAdd = dwscripts.findDOMObject("elemAdd");
  _ElemDel = dwscripts.findDOMObject("elemDel");

  _ConnectionName.initializeUI();
  _TableName.initializeUI();

  _ColumnNames.setColumnNames(MM.LABEL_ColGrid);

  // senimandigital
  var displayAsArr = new Array(TEXTFIELD,TEXTAREA,MENU,HIDDENFIELD,CHECKBOX,RADIOGROUP,PASSWORDFIELD,STATICTEXT);

/* begin-auto-update-url: http://knowledge.senimandigital.kom/export_simple.php?knowledge_export_id=4&knowledge_type=javascript_data_bantuan */
/* digunakan pada: configuration/Commands/ServerObject-InsRecPHP.js */ 
displayAsArr.push(SDauto_increment); 
displayAsArr.push(SDbutton); 
displayAsArr.push(SDcheckbox_php); 
displayAsArr.push(SDcheckbox_php_delimiter); 
displayAsArr.push(SDeditor_css); 
displayAsArr.push(SDeditor_edml); 
displayAsArr.push(SDeditor_htm); 
displayAsArr.push(SDeditor_javascript); 
displayAsArr.push(SDeditor_php); 
displayAsArr.push(SDeditor_sql); 
displayAsArr.push(SDfile_image); 
displayAsArr.push(SDhidden); 
displayAsArr.push(SDjam); 
displayAsArr.push(SDlabel_php); 
displayAsArr.push(SDpassword); 
displayAsArr.push(SDphp_query_field_enum_edit); 
displayAsArr.push(SDphp_query_field_insert); 
displayAsArr.push(SDphp_query_field_rename); 
displayAsArr.push(SDphp_query_field_set_edit); 
displayAsArr.push(SDphp_query_table_rename); 
displayAsArr.push(SDradio_php); 
displayAsArr.push(SDradio_php_enum); 
displayAsArr.push(SDreset); 
displayAsArr.push(SDselect_html); 
displayAsArr.push(SDselect_javascript_json_encode); 
displayAsArr.push(SDselect_javascript_string_optgroup); 
displayAsArr.push(SDselect_javascript_string_option); 
displayAsArr.push(SDselect_php); 
displayAsArr.push(SDselect_php_distinct); 
displayAsArr.push(SDselect_php_editabel); 
displayAsArr.push(SDselect_php_enum); 
displayAsArr.push(SDselect_php_multiple); 
displayAsArr.push(SDselect_php_optgroup); 
displayAsArr.push(SDselect_php_redirect); 
displayAsArr.push(SDselect_php_set); 
displayAsArr.push(SDselect_php_tables); 
displayAsArr.push(SDselect_php_tree); 
displayAsArr.push(SDselect_php_urutan); 
displayAsArr.push(SDsubmit); 
displayAsArr.push(SDtanggal); 
displayAsArr.push(SDtanggal_jam); 
displayAsArr.push(SDtextarea_javascript_replace); 
displayAsArr.push(SDtextarea_php); 
displayAsArr.push(SDtextarea_php_delimiter); 
displayAsArr.push(SDtextbox_ajax_unik); 
displayAsArr.push(SDtextbox_ajax_unik_bertoken); 
displayAsArr.push(SDtextbox_javascript_slug); 
displayAsArr.push(SDtextbox_php); 
displayAsArr.push(SDtextbox_php_delimiter); 
displayAsArr.push(SDtextbox_php_delimiter_ganda); 
displayAsArr.push(SDtextbox_php_number); 
displayAsArr.push(SDwarna); 
/* end-auto-update-url: http://knowledge.senimandigital.kom/export_simple.php?knowledge_export_id=4&knowledge_type=javascript_data_bantuan */  
  
  _DisplayAs.setAll(displayAsArr, displayAsArr);
  
  _SubmitAs.init();  // get the values from the HTML

  // Retrieve the connection from last time if there's more
  // than one connection (if there's only one, it'll get selected
  // automatically).
  if (_ConnectionName.listControl.getLen() > 2)
  {
    var conn = dwscripts.retrieveExtensionData(SB_FILE,"lastConnection");
    if (conn)
      _ConnectionName.pickValue(conn);
  }

  // If a connection was picked automatically, act like the user
  // picked it and update the rest of the UI.
  if (_ConnectionName.listControl.getIndex() > 0)
    updateUI("ConnectionName", "onChange");

  elts = document.forms[0].elements;
  if (elts && elts.length)
  {
    elts[0].focus();
  }
}


//--------------------------------------------------------------------
// FUNCTION:
//   updateUI
//
// DESCRIPTION:
//   This function is called by the UI controls to handle UI updates
//
// ARGUMENTS:
//   control - string - the name of the control sending the event
//   event - string - the event which is being sent
//
// RETURNS:
//   nothing
//--------------------------------------------------------------------
function updateUI(control, event)
{
  if (control == "ConnectionName")
  {
    _TableName.updateUI(_ConnectionName, event); // this will trigger a recursive call to this function
  }
  else if (control == "TableName")
  {
    // clear additional column list
    // it lists columns that don't get populated in the grid, and needs to be cleared
    updateAdditionalColumnList('clear'); 

    // populate grid
    populateColumnGrid();
    
    // clear global field names array (used to check for dupe field names)
    STR_ELEMENT_NAMES = STR_DIVIDER;
    
    // populate UI according to first grid item
    displayGridFieldValues();
  }
  else if (control == "AddRow")
  {
    addGridRow();
    //EnableDisableUpDownBtns();
    //EnableDisableAddDelBtns();
  }
  else if (control == "DeleteRow")
  {
    deleteGridRow();
    //EnableDisableUpDownBtns();
    //EnableDisableAddDelBtns();
  }
  else if (control == "MoveRowUp")
  {
    _ColumnNames.moveRowUp();
    //EnableDisableUpDownBtns();
  }
  else if (control == "MoveRowDown")
  {
    _ColumnNames.moveRowDown();
    //EnableDisableUpDownBtns();
  }
  else if (control == "ColumnNames")
  {
    displayGridFieldValues();
	// Lokasi Fungsi: ServerObject-FormCmnPHP Line 898
  }
  else if (control == "ElementLabel")
  {
    updateGridRow('label');
  }
  else if (control == "SubmitAs")
  {
    updateGridRow('submitAs');
  }
  else if (control == "DisplayAs")
  {
    showDifferentParams(true);

    var newSubmitType = getSubmitTypeBasedOnElementType
      (_SubmitAs.getValue(),_DisplayAs.get(),ColumnTypes[ _ColumnNames.getRowValue().column ]);
    _SubmitAs.pickValue(newSubmitType);

    updateGridRow('displayAs')
  }
  else if (control == "GoToURL")
  {
    var theRedirect_url = dw.browseForFileURL("select", MM.LABEL_FileRedirect,0,0);
    
    if (theRedirect_url.length > 0)
    {
      // convert any script blocks to concat values
      theRedirect_url = theRedirect_url.replace(/<\?php\s+(?:echo\s+)?/gi, "\" . ");
      theRedirect_url = theRedirect_url.replace(/;?\s*\?>/gi, " . \"");
      
      _GoToURL.value = theRedirect_url;
    }
  }
}

function getVarNameFromFormField(value) {
  var varName = "";
  if (value)
  {
    var paramInfo = dwscripts.getParameterCodeFromType(MM.LABEL_PHP_Param_Types[1], value);
    varName = ((paramInfo) ? paramInfo.nameVal : "");
  }
  return varName;
}
