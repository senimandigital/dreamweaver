// Copyright 2001-2007 Adobe Systems Incorporated.  All rights reserved.
function initializeUI() {}
function findServerBehaviors() {
  var sbObj;
  var sbList = dwscripts.findSBs(MM.LABEL_TitleRecordset + " (@@RecordsetName@@)", SBRecordsetPHP);
  for (var i=0; i < sbList.length; i++) {
  var rsName = sbList[i].getParameter("RecordsetName");
  if (rsName) {
  var baseTitle = dw.loadString("serverBehavior/title/" + sbList[i].name);
  if( !baseTitle )baseTitle = sbList[i].name;
  sbList[i].setTitle(baseTitle + " (" + rsName + ")");
  if (!sbList[i].getParameter('MM_subType') && sbList[i].subType) {
       sbList[i].setParameter('MM_subType', sbList[i].subType);
  }
 }

		//fill specific parameters for every rsType

		for (var j = 0;j < MM.rsTypes.length;j++) {

			if (MM.rsTypes[j].serverModel == dw.getDocumentDOM().serverModel.getServerName()) {

				domCommand = dw.getDocumentDOM(dw.getConfigurationPath() + "/Commands/" + MM.rsTypes[j].command); 

				if (domCommand) {

					windowCommand = domCommand.parentWindow;

					if (windowCommand.fillAditionalParameters) {

						sbList[i] = windowCommand.fillAditionalParameters(sbList[i]);

					}

				}

			}

		}

  }



  return sbList;

}

function canApplyServerBehavior(sbObj) {

  var success = true;



  if (success)

  {

    dwscripts.canApplySB(sbObj, false); // preventNesting is false

  }



  return success;

}





//--------------------------------------------------------------------

// FUNCTION:

//   applyServerBehavior

//

// DESCRIPTION:

//   Collects values from the form elements in the dialog box and

//   adds the Server Behavior to the user's document

//

// ARGUMENTS:

//   priorSBRecordset - SBRecordsetPHP object - one of the objects returned

//     from findServerBehaviors

//

// RETURNS:

//   string - empty upon success, or an error message

//--------------------------------------------------------------------



function applyServerBehavior(priorSBRecordset)

{

  var paramObj = new Object();

  var errStr = "";

  

  var sbObj = priorSBRecordset;

  if (!sbObj)

  {

    sbObj = new SBRecordsetPHP();

    

    // Check if any default values are set for us (i.e., drag and drop 

    //   operations from the database panel set the default connection

    //   and table name values and invoke the recordset sb).  

    if (MM.recordsetSBDefaults)

    {

      // RST: added to enable the posibility of creating fake SBs to 

      // behave like Recordsets

      sbObj.name = MM.RecordsetPriorRec;

    	

      sbObj.setConnectionName(MM.recordsetSBDefaults.connectionName);

      sbObj.setDatabaseCall(MM.recordsetSBDefaults.sql, new Array());

      

      // Clear out the default values.

      MM.recordsetSBDefaults = null;

    }

  }

  var newSBRecordset = recordsetDialog.display(sbObj);

  

  if (newSBRecordset)

  {

    dwscripts.fixUpSelection(dw.getDocumentDOM(), true, true);



    FieldTypes.prepareGetSQLValueStringUpgrade(priorSBRecordset);

    dwscripts.applySB(newSBRecordset.getParameters(), priorSBRecordset);



    // Refresh the cache for recordset.

    MMDB.refreshCache(true);

    

    // Update references to the recordset on name change.

    newSBRecordset.updateRecordsetRefs();

    

    MM.RecordsetApplied = true;

  }

  

  return errStr;

}

function inspectServerBehavior(sbObj){}
function deleteServerBehavior(sbObj){
	var smName = dw.getDocumentDOM().serverModel.getServerName();
	var domCommand;
	var shouldDelete = true;
	for (var j=0; j<MM.rsTypes.length; j++) {
  	if (MM.rsTypes[j].serverModel == smName) {
 	domCommand = dw.getDocumentDOM(dw.getConfigurationPath() + "/Commands/" + MM.rsTypes[j].command);
 	if (domCommand) {
   	windowCommand = domCommand.parentWindow;
        				if (windowCommand.onDelete) {
        					shouldDelete = shouldDelete & windowCommand.onDelete(sbObj);



			}

		}

	}

	

	if (shouldDelete) {

		dwscripts.deleteSB(sbObj);

	}

}

function analyzeServerBehavior(sbObj, allRecs) {
   sbObj.analyze()
}

function updateUI(controlName, event) { }
function copyServerBehavior(sbObj) {
  var smName = dw.getDocumentDOM().serverModel.getServerName();
  var domCommand;
  var isCopyAllowed = true;
  for (var j=0; j<MM.rsTypes.length; j++) {
	if (MM.rsTypes[j].serverModel == smName) {
	domCommand = dw.getDocumentDOM(dw.getConfigurationPath() + "/Commands/" + MM.rsTypes[j].command);
	if (domCommand) {
	windowCommand = domCommand.parentWindow;
	if (windowCommand.onCopy) {
		isCopyAllowed = isCopyAllowed & windowCommand.onCopy(sbObj);
	}
			}

		}

	}
	if (isCopyAllowed) {
  		sbObj.preprocessForSerialize();
	}

	return isCopyAllowed;

}

function fixVariableName(varNames, rsName)

{

	if (varNames && varNames.length)

	{

		for (var i=0; i<varNames.length; i++)

		{

			if(rsName.length && varNames[i].indexOf("_"+rsName) >= 0)

			{

				varNames[i] = varNames[i].substring(0, varNames[i].indexOf("_"+rsName));

			}

		}

	}

}

function pasteServerBehavior(sbObj)

{

	var smName = dw.getDocumentDOM().serverModel.getServerName();

	var domCommand;

	var isPasteAllowed = true;



	for (var j=0; j<MM.rsTypes.length; j++) {

		if (MM.rsTypes[j].serverModel == smName) {

			domCommand = dw.getDocumentDOM(dw.getConfigurationPath() + "/Commands/" + MM.rsTypes[j].command); 

			if (domCommand) {

				windowCommand = domCommand.parentWindow;

				if (windowCommand.onPaste) {

					isPasteAllowed = isPasteAllowed & windowCommand.onPaste(sbObj);

				}

			}

		}

	}

 

	if (isPasteAllowed && sbObj && sbObj.parameterNames) {

  		sbObj.postprocessForDeserialize();

  		sbObj.setPageSize("0"); // do not paste any paging code

  		var rsName = sbObj.getRecordsetName();



		if (!sbObj.isUniqueRecordsetName(rsName, ""))

		{

			var oldRsName = rsName;

			rsName = sbObj.getUniqueRecordsetName(); 

			//replace the old recordset name with the new recordset name

			var varRefList = sbObj.getParameter(sbObj.EXT_DATA_SQL_VAR_REF_LIST);

			if (varRefList)

			{

				var oldRegEx = new RegExp(oldRsName,"g");

				varRefList = varRefList.replace(oldRegEx,rsName);

				sbObj.setParameter(sbObj.EXT_DATA_SQL_VAR_REF_LIST, varRefList);

			}

			sbObj.setRecordsetName(rsName);

		}



		var varRefList = sbObj.getParameter(sbObj.EXT_DATA_SQL_VAR_REF_LIST);

		if (varRefList) {

			// Due to the fact that there should be other value within sbObj.EXT_DATA_SQL_VAR_REF_LIST

			// parameter (it actually is - if you place a Logging.alert(sbObj) somewhere after deserialize

			// and before apply you'll se the real value, the one from the original recordset

			// having GetSQLValueString methods surrounding the parameters). Just to make sure

			// if we don't find any GetSQLValueString we'll try to add ones...

			var varNames = sbObj.getParameter(sbObj.EXT_DATA_SQL_VAR_NAMES);

			var varTypes = sbObj.getParameter(sbObj.EXT_DATA_SQL_VAR_TYPES);

			var varRefListArray = varRefList.split(",");

			for (var i=0; i<varRefListArray.length; i++) {

				if (!extPart.findInString("SQLParam", varRefListArray[i])) {

					var regExp = new RegExp("^\\$(\\w+?)_" + rsName + "$", "");

					var matches = varRefListArray[i].match(regExp);

					var index = -1

					if (matches && matches[1]) {

						index = dwscripts.findInArray(varNames, matches[1]);

						if ((index != -1) && (varTypes && varTypes[index])) {

							varRefListArray[i] = FieldTypes.getParameterExpression(varRefListArray[i], varTypes[index]);

						}

					}

				}

			}

			varRefList = varRefListArray.join(",");

			// At this point, if everything was fine, we should have correct SQL Variable List



			sbObj.setParameter(sbObj.EXT_DATA_SQL_VAR_REF_LIST, varRefList);

		}



  		// Apply the edits.

  		sbObj.queueDocEdits(false);



  		dwscripts.applyDocEdits();

	}

}



//--------------------------------------------------------------------

// FUNCTION:

//   createServerBehaviorObj

//

// DESCRIPTION:

//   This function is called from UltraDev when pasting a ServerBehavior.

//   If you plan to implement copyServerBehavior and pasteServerBehavior for 

//   your SB, you must implement this function to return an empty instance of  

//   the ServerBehavior object or of your subclass of ServerBehavior. 

//

// ARGUMENTS:

//   none

//

// RETURNS:

//   empty ServerBehavior instance

//--------------------------------------------------------------------

function createServerBehaviorObj()

{

  return new SBRecordsetPHP();

}







//--------------------------------------------------------------------

// CLASS:

//   SBRecordsetPHP

//

// DESCRIPTION:

//   Subclass of SBDatabaseCall which includes PHP recordset specific functionality.

//

// PUBLIC PROPERTIES:

//   

// Available parameter types. These are the localized strings describing 

//   the parameter types as found in the MM.LABEL_PHP_Param_Types array.

//   SBRecordsetPHP.PARAM_TYPE_URL_PARAM

//   SBRecordsetPHP.PARAM_TYPE_FORM_VAR

//   SBRecordsetPHP.PARAM_TYPE_COOKIE

//   SBRecordsetPHP.PARAM_TYPE_SESSION_VAR

//   SBRecordsetPHP.PARAM_TYPE_APP_VAR

//   SBRecordsetPHP.PARAM_TYPE_ENTERED_VAL

//

// PUBLIC FUNCTIONS:

//   INSPECTORS:

//

//   Overriden functions inherited from SBDatabaseCall:

//   getVariableTypeArray() - Get list of available parameter types.

//   isLiteralVariableType(varType) - Determine if the variable type

//       is a literal value.

//   getVariableCodeFromType(varType, varNameOrValue) - Get the runtime  

//       code and default value for the variable type. 

//   getVariableTypeFromCode(runtimeValue, defaultValue) - Get variable 

//       type and name from its runtime and default values.

//

//

//   CONSTRUCTION:

//

//   initSBRecordsetPHP() - base class constructor for subclasses.

//

//   TODO: add a method for adding the LIMIT keyword to the SQL.

//         this is needed for Repeat Region

//   TODO: add a method for getting the record count SQL.

//         this is needed for the Move To's and RS stats

//

// INCLUDE:

//   ServerBehaviorClass.js

//   SBDatabaseCallClass.js

//--------------------------------------------------------------------



function SBRecordsetPHP(name, title, selectedNode)

{

  // array for storing value prompts for sql parameters

  this.paramValuePromptArray = null;

  

  this.initSBRecordsetPHP(name, title, selectedNode);

}





//--------------------------------------------------------------------

// FUNCTION:

//   SBRecordsetPHP.initSBRecordsetPHP

//

// DESCRIPTION:

//   SBRecordsetPHP 'constructor' for subclasses. In JS, subclasses cannot call

//   the base class constructor to initialize it's properties for the subclass

//   instance. Calls directly to the contructor set the base class properties for

//   all instances of the subclass! We provide this init function for subclasses 

//   to call instead of the constructor. Calls to this 'constructor' initialize

//   the base class properties only for the subclass instance. The SBRecordsetPHP 

//   constructor calls into this function as well.

//

// ARGUMENTS:

//   name - string. recordset name

//   title - string. 

//   selectedNode - document node ptr. node to select when SB selected in SBPanel.

//

// RETURNS:

//   none

//--------------------------------------------------------------------



function SBRecordsetPHP_initSBRecordsetPHP(name, title, selectedNode)

{

  // First, initialize base class.

  this.initSBDatabaseCall(name, title, selectedNode);

}



// Inherit from the SBDatabaseCall class.

SBRecordsetPHP.prototype.__proto__ = SBDatabaseCall.prototype;





// PUBLIC METHODS



// Inspectors:

SBRecordsetPHP.prototype.getDatabaseCall = SBRecordsetPHP_getDatabaseCall;



// Updaters:

SBRecordsetPHP.prototype.setDatabaseCall = SBRecordsetPHP_setDatabaseCall;



SBRecordsetPHP.prototype.checkData = SBRecordsetPHP_checkData ;

SBRecordsetPHP.prototype.checkDatabaseCall = SBRecordsetPHP_checkDatabaseCall;

SBRecordsetPHP.prototype.checkPlatformSpecific = SBRecordsetPHP_checkPlatformSpecific;



// SQL Utilities

SBRecordsetPHP.prototype.isSimpleColumnName = SBRecordsetPHP_isSimpleColumnName;

SBRecordsetPHP.prototype.getSimpleWhereInfo = SBRecordsetPHP_getSimpleWhereInfo;

SBRecordsetPHP.prototype.getSimpleOrderByInfo = SBRecordsetPHP_getSimpleOrderByInfo;

SBRecordsetPHP.prototype.addSimpleWhere = SBRecordsetPHP_addSimpleWhere;



// Construction

SBRecordsetPHP.prototype.initSBRecordsetPHP = SBRecordsetPHP_initSBRecordsetPHP;

SBRecordsetPHP.prototype.analyzeDatabaseCall = SBRecordsetPHP_analyzeDatabaseCall;

SBRecordsetPHP.prototype.analyzePlatformSpecific = SBRecordsetPHP_analyzePlatformSpecific;



SBRecordsetPHP.prototype.getPageSize = SBRecordsetPHP_getPageSize;

SBRecordsetPHP.prototype.setPageSize = SBRecordsetPHP_setPageSize;

SBRecordsetPHP.prototype.setDefaultPageSize = SBRecordsetPHP_setDefaultPageSize;

SBRecordsetPHP.prototype.updatePageSize = SBRecordsetPHP_updatePageSize;





// PRIVATE METHODS

SBRecordsetPHP.prototype.encodeVarRefs = SBRecordsetPHP_encodeVarRefs;

SBRecordsetPHP.prototype.decodeVarRefs = SBRecordsetPHP_decodeVarRefs;

SBRecordsetPHP.prototype.stripPHPTags = SBRecordsetPHP_stripPHPTags;

SBRecordsetPHP.prototype.replaceParamsWithVals = SBRecordsetPHP_replaceParamsWithVals;

SBRecordsetPHP.prototype.getSQLForRecordsetBindings = SBRecordsetPHP_getSQLForRecordsetBindings;

SBRecordsetPHP.prototype.getSQLForTest = SBRecordsetPHP_getSQLForTest;





// PUBLIC PROPERTIES

// CLASS CONSTANTS

// Override of SBDatabaseCall.prototype.EXT_DATA_* constants. Stores names of

// common extension data elements. See SBDatabaseCall.prototype.EXT_DATA_* for 

// details. 

SBRecordsetPHP.prototype.EXT_DATA_RS_NAME         = "RecordsetName";

SBRecordsetPHP.prototype.EXT_DATA_CONN_NAME       = "ConnectionName";

SBRecordsetPHP.prototype.EXT_DATA_CONN_PATH       = "ConnectionPath";

SBRecordsetPHP.prototype.EXT_DATA_DB_CALL_TEXT    = "SQLStatement";

SBRecordsetPHP.prototype.EXT_DATA_CONN_URLFORMAT       = "UrlFormat";



SBRecordsetPHP.prototype.EXT_DATA_SQL_VAR_REF_LIST = "SQLVariableList";



SBRecordsetPHP.prototype.EXT_DATA_SQL_VAR_NAMES   = "Variable";

SBRecordsetPHP.prototype.EXT_DATA_SQL_VAR_TYPES = "VariableType";

SBRecordsetPHP.prototype.EXT_DATA_SQL_VAR_RUNTIME = "RuntimeValue";

SBRecordsetPHP.prototype.EXT_DATA_SQL_VAR_DEFAULT = "DefaultValue";



SBRecordsetPHP.prototype.EXT_DATA_RR_PAGE_SIZE     = "PageSize"

SBRecordsetPHP.prototype.EXT_DATA_RR_START_RECORD  = "StartRecord"





// Available parameter types. These are the localized strings describing the 

//   parameter types as found in the MM.LABEL_PHP_Param_Types array.

SBRecordsetPHP.VAR_TYPE_URL_PARAM   = MM.LABEL_PHP_Param_Types[0];

SBRecordsetPHP.VAR_TYPE_FORM_VAR    = MM.LABEL_PHP_Param_Types[1];

SBRecordsetPHP.VAR_TYPE_COOKIE      = MM.LABEL_PHP_Param_Types[2];

SBRecordsetPHP.VAR_TYPE_SESSION_VAR = MM.LABEL_PHP_Param_Types[3];

SBRecordsetPHP.VAR_TYPE_APP_VAR     = MM.LABEL_PHP_Param_Types[4];

SBRecordsetPHP.VAR_TYPE_ENTERED_VAL = MM.LABEL_PHP_Param_Types[5];





//--------------------------------------------------------------------

// FUNCTION:

//   SBRecordsetPHP.getDatabaseCall

//

// DESCRIPTION:

//   Get the recordset sql for display to the user. That is, all variable 

//   references are removed. Also get the variable references used.

//

// ARGUMENTS:

//   returnedSQLParams - array. pass in an empty array. 

//

// RETURNS:

//   string - decoded sql. null if not set.

//   returnedSQLParams - array of objects. contains var references from the SQL.

//     elements have the following properties: varName, defaultValue, runtimeValue.

//--------------------------------------------------------------------



function SBRecordsetPHP_getDatabaseCall(returnedSQLParams)

{

  var decodedSQL = this.getParameter(this.EXT_DATA_DB_CALL_TEXT);

  var sqlVariableList = this.getParameter(this.EXT_DATA_SQL_VAR_REF_LIST);

  var varRefNames = new Array();



  var begins = new Array();

  var ends = new Array();

  var ix = 0;

 

  var patterns = extPart.getSearchPatterns("SQLParam");

  var matches = null;

  if (patterns && patterns[0]) {

    matches = patterns[0].pattern.match(/^\/(.*)\/([igmx]*)$/i);

  }



	if (matches && decodedSQL && sqlVariableList) {

		var varNames = this.getParameter(this.EXT_DATA_SQL_VAR_NAMES);

        fixVariableName(varNames, this.getParameter(this.EXT_DATA_RS_NAME)[0]);

		var varTypes = this.getParameter(this.EXT_DATA_SQL_VAR_TYPES);

		var defaultValues = this.getParameter(this.EXT_DATA_SQL_VAR_DEFAULT);

		var runtimeValues = this.getParameter(this.EXT_DATA_SQL_VAR_RUNTIME);

		

		if (!varNames) {

			varNames = new Array();

			varTypes = new Array();

			defaultValues = new Array();

			runtimeValues = new Array();

		} else if (!varTypes) {

			varTypes = new Array(varNames.length);

		}



		var body = matches[1];

		var flag = matches[2];

		var regExp = new RegExp(body, flag);

		var match;

		var index;

		var searchString = "_" + this.getRecordsetName();



		do {

			match = sqlVariableList.match(regExp);

			if (match && match[0]) {

				var tempObj = extPart.findInString("SQLParam", match[0]);

				if (tempObj) {

					sqlVariableList = sqlVariableList.replace(match[0], tempObj.parameterValue);

					tempVarName = tempObj.parameterValue.replace(/(?:^%?#|#%?$)/gi, "");



					var start = tempVarName.indexOf("$");

					var end = tempVarName.indexOf(searchString);

					var found = tempVarName.match(/((?:"%"\s\.\s)?)(\$\w+)((?:\s\.\s"%")?)/);

					if(found) {

						if(found[1]) {

							begins[ix] = "%"

						} else {

							begins[ix] = "";

						}

						if(found[3]) {

							ends[ix] = "%";

						} else {

							ends[ix] = "";

						}

					}

					ix++

					if (start != -1 && end != -1) {

						tempVarName = tempVarName.substring(start+1,end);

					}



					index = -1;

					for (var i=0; i<varNames.length; i++) {

						if (varNames[i] == tempVarName) {

							index = i;

							break;

						}

					}

					

					if (index == -1) {

						varNames.push(tempVarName);

						varTypes.push(tempObj.parameterType);

						defaultValues.push(tempObj.parameterMaxLength ? tempObj.parameterMaxLength : "-1");

						runtimeValues.push("");

					} else {

						varTypes[index] = tempObj.parameterType;

					}

				}

			}

		} while (match && match[0]);

		

//		this.setParameter(this.EXT_DATA_SQL_VAR_REF_LIST, sqlVariableList);

		this.setParameter(this.EXT_DATA_SQL_VAR_NAMES, varNames);

		this.setParameter(this.EXT_DATA_SQL_VAR_TYPES, varTypes);

		this.setParameter(this.EXT_DATA_SQL_VAR_DEFAULT, defaultValues);

		this.setParameter(this.EXT_DATA_SQL_VAR_RUNTIME, runtimeValues);

		

		ix = 0;

        decodedSQL = decodedSQL.replace

          (/%s/g,

             function (str,p1,p2,offset,s) {

                if(typeof begins[ix] != 'undefined' || typeof ends[ix] != 'undefined') {

                    return begins[ix] + "%s" + ends[ix++];

                } else {

                    return '%s';

                }

             }

          )

	}

	

  decodedSQL = this.decodeVarRefs(decodedSQL, varRefNames);

  if (returnedSQLParams != null)

  {

    // Populate the sql parameters array with the variable values

    var varNames = this.getParameter(this.EXT_DATA_SQL_VAR_NAMES);

    var varTypes = this.getParameter(this.EXT_DATA_SQL_VAR_TYPES);

    var defaultValues = this.getParameter(this.EXT_DATA_SQL_VAR_DEFAULT);

    var runtimeValues = this.getParameter(this.EXT_DATA_SQL_VAR_RUNTIME);



    for (var j=0; varNames && j < varNames.length; j++) 

    {

      var paramObj = new Object();

      paramObj.varName = varNames[j];

      paramObj.varType = (varTypes && varTypes[j]) ? varTypes[j] : "";

      

      // If we don't have a type for this parameter AND we have only one parameter (a simple where clause)

      // we'll try to extract the field from SQL and inspect the type automatically

      if (!paramObj.varType && (varNames.length == 1)) {

        var sqlObj = new SQLStatement(decodedSQL);

        var whereObj = this.getSimpleWhereInfo(sqlObj);



        // If we have a simple where

        if (whereObj && whereObj.lval) {

          var connectionName = this.getParameter(this.EXT_DATA_CONN_NAME);

          var tables = FieldTypes.getTablesFromSQL(connectionName, decodedSQL);

          var fieldObj = FieldTypes.getFieldObj(connectionName, tables, whereObj.lval);

          paramObj.varType = FieldTypes.getFieldTypeFromObj(fieldObj)

        }

      }

	  

      if (defaultValues[j] != null) 

      {

        paramObj.defaultValue = defaultValues[j];

      } 

      else 

      {

        paramObj.defaultValue = "";

      }



      paramObj.runtimeValue = runtimeValues[j];



      returnedSQLParams.push(paramObj);

    }

  }

  

  return decodedSQL;

}





//--------------------------------------------------------------------

// FUNCTION:

//   SBRecordsetPHP.decodeVarRefs

//

// DESCRIPTION:

//   Takes an SQL string and decodes the

//   variable references into a form presentable to the user.  These

//   references are returned in the varNameArray parameter.

//

// ARGUMENTS:

//   theSQL - string. the SQL extracted from the code

//   varNameArray - an array to populate with the referenced variables

//

// RETURNS:

//   string - the SQL with variable references removed

//   varNameArray - output parameter set with all variables found

//--------------------------------------------------------------------



function SBRecordsetPHP_decodeVarRefs(theSQL, varNameArray) 

{

  var retVal = (theSQL != null) ? theSQL : "";

	// in case of upgrade from 2004 all like params are sourounded by '

	var myRe = /'(%*%s%*)'/;

	retVal = retVal.replace

      (/like\s+'%*%s%*'/ig,

         function (str,offset,s) {

         	var p = myRe.exec(str);

            return 'LIKE ' + p[1];

         }

      )

  

  var sqlVar = new Participant("SQLParam");

  var sqlParamRegExp = eval(sqlVar.searchPatterns[0].pattern); //get the search expression



  var varRefList = this.getParameter(this.EXT_DATA_SQL_VAR_REF_LIST);

  var varRefNames = new Array();

  if (varRefList)

  {

  	var found = false;

  	var tempObj = null;

    do {

		var matches = varRefList.match(sqlParamRegExp);

		if (matches && matches[1]) {

    		varRefList = varRefList.replace(matches[0], matches[1]);

		}

    } while (matches && matches[0]);

    var searchString = "_" + this.getRecordsetName();

    

    var varRefArray = varRefList.split(",");

    for (var i=0; i < varRefArray.length; i++)

    {

      var start = varRefArray[i].indexOf("$");

      var end = varRefArray[i].indexOf(searchString);

      

      if (start != -1 && end != -1)

      {

        varRefNames.push(varRefArray[i].substring(start+1,end));

      }

      else

      {

        varRefNames.push(varRefArray[i]);

      }

    }

  }



  if (varRefNames.length)

  {

    // replace %s with the values in the varRefNames array

    for (var i=0; i < varRefNames.length; i++)

    {

      retVal = retVal.replace(/%s/, varRefNames[i]);

      varNameArray.push(varRefNames[i]);

    }

  }

  

  // if we escaped the percent signs for use in the sprintf statement,

  //  then unescape them

  if (retVal.indexOf("%%") != -1)

  {

    retVal = retVal.replace(/%%/g, "%");

  }

 

  return retVal;

}

function SBRecordsetPHP_setDatabaseCall(decodedSQL, sqlParameters)

{

  var varNames = new Array();

  var defaultValues = new Array();

  var runtimeValues = new Array();

  var varTypes = new Array();

  this.paramValuePromptArray = new Array();



  if (sqlParameters != null)

  {

    var paramCount = sqlParameters.length;

    for (var i = 0; i < paramCount; ++i)

    {

      var param = sqlParameters[i];    

      varNames.push(param.varName);

      varTypes.push(param.varType ? param.varType : "");

      defaultValues.push(param.defaultValue);

      runtimeValues.push(param.runtimeValue);



//      var regExp = new RegExp("'?(%?)" + paramName.replace(/\./gi, "\\.") + "(%?)'?", "");

//      var regExp2 = new RegExp('GetSQLValueString\\("' + paramName.replace(/\./gi, "\\.") + ",", "gi");

//      while (decodedSQL && decodedSQL.match(regExp) && !decodedSQL.match(regExp2)) {

//        var replaceWith = getCFParameter("$1#" + paramName + "#$2", paramType, paramSize);

//        decodedSQL = decodedSQL.replace(regExp, replaceWith);

//      }



      this.paramValuePromptArray.push(param.valuePrompt ? param.valuePrompt : "");

    }

  }



  var varRefs = new Array();

  var encodedSQL = this.encodeVarRefs(decodedSQL, varNames, varRefs);

  

	var begins = new Array();

	var ends = new Array();

	var myRe = /(%?)%s(%?)/;

	encodedSQL = encodedSQL.replace

      (/%?%s%?/g,

         function (str,offset,s) {

         	var p = myRe.exec(str);

         	if(p[1]) {

         		begins.push('"%" . ');

         	} else {

         		begins.push("");

         	}

         	if(p[2]) {

         		ends.push(' . "%"');

         	} else {

         		ends.push("");

         	}

            return "%s";

         }

      )

 

  this.setParameter(this.EXT_DATA_DB_CALL_TEXT, encodedSQL);

  this.setParameter(this.EXT_DATA_SQL_VAR_NAMES, varNames);

  this.setParameter(this.EXT_DATA_SQL_VAR_DEFAULT, defaultValues);

  this.setParameter(this.EXT_DATA_SQL_VAR_TYPES, varTypes);

  this.setParameter(this.EXT_DATA_SQL_VAR_RUNTIME, runtimeValues);

  // we need default parametsr for all the new variables needed for repeat region

  // without these values we get Javascript syntax errors

  if (!this.getParameter(this.EXT_DATA_RR_START_RECORD))

  {

    this.setParameter(this.EXT_DATA_RR_START_RECORD, "0" ) ;

  }

  if (!this.getParameter(this.EXT_DATA_RR_PAGE_SIZE))

  {

    this.setParameter(this.EXT_DATA_RR_PAGE_SIZE, "" ) ;

  }

	

	

  var rsName = this.getRecordsetName();

    

  var varRefArray = new Array();

  for (var i=0; i < varRefs.length; i++)

  {

  	// varNames and varTypes are in the same order given by parameter list

  	// varRefs order is the one from the sql statement

  	var index = dwscripts.findInArray(varNames, varRefs[i]);

	var vr = begins[i] + "$" + varRefs[i] + "_" + rsName + ends[i];

    varRefArray.push(FieldTypes.getParameterExpression(vr, varTypes[index]));

  }

  this.setParameter(this.EXT_DATA_SQL_VAR_REF_LIST, varRefArray.join(","));

}


function SBRecordsetPHP_encodeVarRefs(theSQL, varNameArray, varRefsArray)

{

  var retVal = theSQL;



  //strip out all new lines and CRs.

  retVal = retVal.replace(/[\r\n]+/g," ");

  

  //convert any variables

  if (varNameArray.length != 0) 

  {

    // if we have variables, escape the percent signs in the SQL statement,

    //  for use within the sprintf function

    retVal = retVal.replace(/%/g, "%%");

  

    //convert each variable reference

    var varExpr = new RegExp("\\b(" + varNameArray.join("|") + ")\\b","ig");



    var match = theSQL.match(varExpr);

    if (match)

    {

      for (var i=0; i < match.length; i++)

      {

        varRefsArray.push(match[i]);

      }



      retVal = retVal.replace(varExpr, "%s");

      

	  // Revert %'s back to single instances for the ones located next to %s

	  // By doing this, we'll make sure that only spare % caracters are escaped (to %% form)

	  retVal = retVal.replace(/'?%%%s%%'?/gi, "%%s%");

      retVal = retVal.replace(/'?%%%s'?/gi, "%%s");

      retVal = retVal.replace(/'?%s%%'?/gi, "%s%");

      retVal = retVal.replace(/'%s'/gi, "%s");

      //retVal = retVal.replace(/'((?:%%)?%s(?:%%)?)'/i, "$1");

//      retVal = retVal.replace(/'%s'/i, "$1");

    }

  }



  return retVal;

}


function SBRecordsetPHP_analyzeDatabaseCall()

{

  

  // work-around a bug in the C find code

  var varName = this.getParameter(this.EXT_DATA_SQL_VAR_NAMES);

  if (typeof varNames == "string")

  {

    this.setParameter(this.EXT_DATA_SQL_VAR_NAMES, (varNames) ? new Array(varNames) : new Array());

  }

  var defaultValues = this.getParameter(this.EXT_DATA_SQL_VAR_DEFAULT);

  if (typeof defaultValues == "string")

  {

    this.setParameter(this.EXT_DATA_SQL_VAR_DEFAULT, (defaultValues) ? new Array(defaultValues) : new Array());

  }

  var runtimeValues = this.getParameter(this.EXT_DATA_SQL_VAR_RUNTIME);

  if (typeof runtimeValues == "string")

  {

    this.setParameter(this.EXT_DATA_SQL_VAR_RUNTIME, (runtimeValues) ? new Array(runtimeValues) : new Array());

  }

  // end: work-around

  

    

  // Check the variable blocks against the references in the sql. If they are not

  // the same, the found instance is incomplete.

  var partVarRefNames = this.getParameter(this.EXT_DATA_SQL_VAR_NAMES);

  fixVariableName(partVarRefNames, this.getParameter(this.EXT_DATA_RS_NAME)[0]);

  

  var sqlVarRefNames = new Array();

  this.decodeVarRefs(this.getParameter(this.EXT_DATA_DB_CALL_TEXT), sqlVarRefNames);

  

  if ((!partVarRefNames && sqlVarRefNames.length) || (partVarRefNames && !sqlVarRefNames))

  {

    this.setIsIncomplete(true);

    //TODO: this.appendErrorMessage();

  } 

  else if (partVarRefNames && partVarRefNames.length && 

           sqlVarRefNames && sqlVarRefNames.length)

  {

    for (var j=0; !this.getIsIncomplete() && j < sqlVarRefNames.length; j++) 

    {

      var found = false;

      for (var k=0; !found && k < partVarRefNames.length; k++) 

      {

        if (sqlVarRefNames[j] == partVarRefNames[k]) 

        {

          found = true;

        }

      }

      if (!found) 

      {

        this.setIsIncomplete(true);

        //TODO: this.appendErrorMessage();

      }

    }

  }  

}






function SBRecordsetPHP_analyzePlatformSpecific() { }
function SBRecordsetPHP_checkData(bIsForTest) {
  if (arguments.length == 0)  {
    var bIsForTest = false;
  }

  var isValid = true;
  this.setErrorMessage("");
  isValid = this.checkRecordsetName(bIsForTest) && isValid;
  var bSiteRelative = this.IsSiteRelativePath();
  var urlFormat = "require_once";
  if (bSiteRelative){
	urlFormat = "virtual";
	}
  this.setParameter(this.EXT_DATA_CONN_URLFORMAT,urlFormat);
  isValid = this.checkConnectionName(bIsForTest,bSiteRelative) && isValid;
  if (isValid)  {
    isValid = this.checkDatabaseCall(bIsForTest) && isValid;
    isValid = this.checkPlatformSpecific(bIsForTest) && isValid;
    var sqlParams = new Array();
    var theSQL = this.getDatabaseCall(sqlParams);
    if ( bIsForTest == false )    {
      this.setDatabaseCall( theSQL, sqlParams );
    }
  }
  return isValid;
}

function SBRecordsetPHP_checkDatabaseCall(bIsForTest) {
  var isValidRS = true;
  var sqlParams = new Array();
  var theSQL = this.getDatabaseCall(sqlParams);
  if (dwscripts.stripChars(theSQL, " \r\n\t") == "")
  {
    isValidRS = false;
    this.appendErrorMessage(MM.MSG_NoSelectStatement);
  }
  else  {
    var sqlObj = new SQLStatement(theSQL);
    if (   !sqlObj ||
            (sqlObj.getType() != SQLStatement.STMT_TYPE_SELECT

             && sqlObj.type != SQLStatement.STMT_TYPE_STORED_PROC)

       )

    {

      isValidRS = false;

      this.appendErrorMessage(MM.MSG_NoSelectStatement);

    }

  }



  for (var i = 0; i < sqlParams.length; i++)

  {

    var param = sqlParams[i];



    var theName = dwscripts.trim(param.varName);

    var theType = dwscripts.trim(param.varType);

    var theDefaultVal = dwscripts.trim(param.defaultValue);

    var theRunTimeVal = dwscripts.trim(param.runtimeValue);



    if (theName == "")

    {

      this.appendErrorMessage(MM.MSG_MissingParamNames);

      isValidRS = false;

      // Return here since we need the param name to label further parameter errors.

      return isValidRS;

    }

    else

    {

      if (!dwscripts.isValidVarName(theName))

      {

        isValidRS = false;

        this.appendErrorMessage(theName + " " + MM.MSG_InvalidParamName);

      }

      else

      {

        var re = new RegExp("\\b" + theName + "\\b");

        if (theSQL.search(re) == -1)

        {

          isValidRS = false;

          this.appendErrorMessage(theName + " " + MM.MSG_InvalidParamNameNotInSQL);

        }

      }



      if (theDefaultVal == "")

      {

        isValidRS = false;

        this.appendErrorMessage(MM.MSG_DefaultValMissing + theName);

      }

  

      if (theType == "")

      {

        isValidRS = false;

        this.appendErrorMessage(MM.MSG_TypeMissing + theName);

      }

  

      if (!bIsForTest)

      {

        if (theRunTimeVal == "")

        {

          isValidRS = false;

          this.appendErrorMessage(MM.MSG_RunTimeValMissing + theName);

        }

      } 

    }

  }



  return isValidRS;

}





//--------------------------------------------------------------------

// FUNCTION:

//   SBRecordsetPHP.checkPlatformSpecific

//

// DESCRIPTION:

//   Check that the platform specific parameters are valid, and provide

//   the proper defaults if no values were provided.

//

// ARGUMENTS:

//   bIsForTest - boolean - indicates if this check is for the test button

//

// RETURNS:

//   boolean

//--------------------------------------------------------------------



function SBRecordsetPHP_checkPlatformSpecific(bIsForText)

{

  var isValidRS = true;

  

  return isValidRS;

}





//--------------------------------------------------------------------

// FUNCTION:

//   SBRecordsetPHP.getSQLForRecordsetBindings

//

// DESCRIPTION:

//   Returns the SQL statement that should be used to get the meta data

//   for this Recordset

//

// ARGUMENTS:

//   none

//

// RETURNS:

//   string - sql statement

//--------------------------------------------------------------------



function SBRecordsetPHP_getSQLForRecordsetBindings()

{

  var sqlParams = new Array();

  var sql = this.getDatabaseCall(sqlParams);



  // To keep the fix minimized, we do it for simple SQL Statement only.



  var sqlObj = new SQLStatement(sql); 



  var tempSQL = sqlObj.getStatementForMMDB(); 

  if (tempSQL)  {

    sql = tempSQL;

  }



//  sql = this.replaceParamsWithVals(sql, sqlParams);

  return sql;

}





//--------------------------------------------------------------------

// FUNCTION:

//   SBRecordsetPHP.getSQLForTest

//

// DESCRIPTION:

//   Returns the SQL statement that should be used when displaying 

//   the test dialog.

//

// ARGUMENTS:

//   none

//

// RETURNS:

//   string - sql statement

//--------------------------------------------------------------------



function SBRecordsetPHP_getSQLForTest()

{

  var sqlParams = new Array();

  var sql = this.getDatabaseCall(sqlParams);

  var enclosingToken;

  

  // remove SQL comments

  sql = SQLStatement.stripComments(sql);

  

  for (var i = 0; i < sqlParams.length; i++)

  {

    var theParamVal = "";

    

    if (this.paramValuePromptArray && this.paramValuePromptArray[i])

    {

      // ask the user for the value to replace

      // Pop up a dialog to get the default value to use in the test  

      MM.paramName = this.paramValuePromptArray[i]

      dw.runCommand("GetTestValue");

      if (MM.clickedOK)

      {

        theParamVal = MM.retVal.replace(/'/g, "''");

      }

      else

      {

        // user clicked cancel, so exit and set statement to blank

        sql = "";

        break;

      }

    }

    else

    {

      theParamVal = String(sqlParams[i].defaultValue).replace(/'/g, "''");

    }

    

    enclosingToken = "";

    if (sqlParams[i] && sqlParams[i].varType && sqlParams[i].varType != "int") {

    	enclosingToken = "'";

    }

    

    // If we have Begins with/Ends with/Contains statements => we'll add by default single quotes

    if (sql.match(new RegExp("%" + sqlParams[i].varName, "g")) || sql.match(new RegExp(sqlParams[i].varName + "%", "g"))) {

    	enclosingToken = "'";

    }



    var varRef = new RegExp("(\\b|%)" + sqlParams[i].varName + "(%|\\b)","g");

    sql = sql.replace(varRef, enclosingToken + "$1" + theParamVal + "$2" + enclosingToken);

  }

  return sql;

}





//--------------------------------------------------------------------

// FUNCTION:

//   SBRecordsetPHP.replaceParamsWithVals

//

// DESCRIPTION:

//   Replace the parameter names in the sql with the associated values.

//   override of a SBDatabaseCall.replaceParamsWithVals

//

// ARGUMENTS:

//   sql - string. sql string in which to replace the parameter names.

//   sqlParams - SQLParameters. describes the parameters in the sql.

//

// RETURNS:

//   string - sql with parameters replaced.

//--------------------------------------------------------------------



function SBRecordsetPHP_replaceParamsWithVals(sql, sqlParams)

{

  var statement = sql;

  var theParam;

  var enclosingToken;

  

  for (var i = 0; i < sqlParams.length; i++)

  {

    theParam = sqlParams[i];



    // copied the same logic from "GetSQLForTest". It replaces the params with default values.

    enclosingToken = "";

    if (sqlParams[i] && sqlParams[i].varType && sqlParams[i].varType != "int") {

    	enclosingToken = "'";

    }

    

    // If we have Begins with/Ends with/Contains statements => we'll add by default single quotes

    if (sql.match(new RegExp("%" + sqlParams[i].varName, "g")) || sql.match(new RegExp(sqlParams[i].varName + "%", "g"))) {

    	enclosingToken = "'";

    }



    // If we have Begins with/Ends with/Contains statements => we'll add by default single quotes

    if (sql.match(new RegExp("%" + theParam.varName, "g")) || sql.match(new RegExp(theParam.varName + "%", "g"))) {

      // Add single quotes only if not existing

      if (sql.match(new RegExp("(^|[^'])%" + theParam.varName, "g")) || sql.match(new RegExp(theParam.varName + "%([^']|$)", "g"))) {

        statement = statement.replace(new RegExp("(%?" + theParam.varName + "%?)", "g"), "'$1'");

      }

      enclosingToken = "";

    }



    if (sql.match(new RegExp("'" + theParam.varName + "'", "g"))) {

      enclosingToken = "";

    }



    var theParamVal = String(theParam.defaultValue).replace(/'/g, "''");

    var myRe = new RegExp("(\\b|%)" + sqlParams[i].varName + "(%|\\b)","g");

    statement = statement.replace(myRe, enclosingToken + "$1" + theParamVal + "$2" + enclosingToken);

  }

  

  return statement;

}





//--------------------------------------------------------------------

// FUNCTION:

//   SBRecordsetPHP_stripPHPTags

//

// DESCRIPTION:

//   Helper function for SBRecordsetPHP_getParamObject to strip the ASP 

//   directives.

//

// ARGUMENTS:

//   inStr - string. string to strip.

//

// RETURNS:

//   string - with ASP directives stripped.

//--------------------------------------------------------------------



function SBRecordsetPHP_stripPHPTags(inStr)

{

  var theStr = String(inStr);

  theStr = theStr.replace(/(<\?\s*php\s*echo)*/gi,"");    //remove open tags  

  theStr = theStr.replace(/(\?>)*/gi,"");  //remove close tags

  return theStr;

}





//--------------------------------------------------------------------

// FUNCTION:

//   isSimpleColumnName

//

// DESCRIPTION:

//   Returns true if the given column name is not a renamed or 

//   calculated column

//

// ARGUMENTS:

//   columnName - string - the column to check

//

// RETURNS:

//   boolean

//--------------------------------------------------------------------



function SBRecordsetPHP_isSimpleColumnName(columnName)

{

  var retVal = false;

  

  var colName = dwscripts.trim(columnName);



  if (colName == '*' || ((colName.search(/^[\w\. ]*$/) == 0) && 

       (colName.search(/\bas\b/i) == -1)))



  {

    retVal = true;

  }



  return retVal;

}





//--------------------------------------------------------------------

// FUNCTION:

//   getSimpleWhereInfo

//

// DESCRIPTION:

//   Returns an object with information about the current where clause,

//   if it is based on a single parameter.

//   Returns an empty object if the where clause is empty, and null 

//   if the where clause is not a simple parameter comparison

//

// ARGUMENTS:

//   none

//

// RETURNS:

//   object - has 4 properties: lval, rval, operator, isString

//--------------------------------------------------------------------



function SBRecordsetPHP_getSimpleWhereInfo(sqlObj)

{

  var retVal = null;



  var whereStr = dwscripts.trim(sqlObj.whereClause);

   

  var info = new Object();

  info.lval = "";

  info.rval = "";

  info.operator = "";

  info.isString = false;



  if (whereStr != "")

  {

    if (whereStr.search(/^\s*([\w\. `]+?)\s*([=><])\s*([\w\. ]+?)\s*$/) != -1)

    {

      info.lval = RegExp.$1

      info.operator = RegExp.$2

      info.rval = RegExp.$3

    }

    else if (whereStr.search(/^\s*([\w\. `]+?)\s*([=><])\s*'([\w\. ]+?)'\s*$/) != -1)

    {

      info.lval = RegExp.$1

      info.operator = RegExp.$2

      info.rval = RegExp.$3

      info.isString = true

    }   

    else if (whereStr.search(/^\s*([\w\. `]+?)\s*((<>)|(>=)|(<=))\s*([\w\. ]+?)\s*$/) != -1)

    {

      info.lval = RegExp.$1

      info.operator = RegExp.$2

      info.rval = RegExp.$6

    }   

    else if (whereStr.search(/^\s*([\w\. `]+?)\s*((<>)|(>=)|(<=))\s*'([\w\. ]+?)'\s*$/) != -1)

    {

      info.lval = RegExp.$1

      info.operator = RegExp.$2

      info.rval = RegExp.$6

      info.isString = true

    }

    else if (whereStr.search(/^\s*([\w\. `]+?)\s*(like)\s*('?%([\w\. ]+?)%'?)\s*$/i) != -1)

    {

      info.lval = RegExp.$1

      info.operator = "contains"

      info.rval = RegExp.$4

      info.isString = true

    }

    else if (whereStr.search(/^\s*([\w\. `]+?)\s*(like)\s*('?%([\w\. ]+?)'?)\s*$/i) != -1)

    {

      info.lval = RegExp.$1

      info.operator = "ends with"

      info.rval = RegExp.$4

      info.isString = true

    }

    else if (whereStr.search(/^\s*([\w\. `]+?)\s*(like)\s*('?([\w\. ]+?)%'?)\s*$/i) != -1)

    {

      info.lval = RegExp.$1

      info.operator = "begins with"

      info.rval = RegExp.$4

      info.isString = true

    }

    else

    {

      info = null;

    }

  }

  

  if (info && info.lval)

  {

    info.lval = dwscripts.decodeSQLColumnRef(info.lval);

  }



  retVal = info;



  return retVal;

}





//--------------------------------------------------------------------

// FUNCTION:

//   addSimpleWhere

//

// DESCRIPTION:

//   <description>

//

// ARGUMENTS:

//   <arg1> - <type and description>

//

// RETURNS:

//   <type and description>

//--------------------------------------------------------------------



function SBRecordsetPHP_addSimpleWhere(sqlObj, columnName, operatorType, parameterName)

{



  switch (operatorType)

  {

  case "=":

  case ">":

  case "<":

  case ">=":

  case "<=":

  case "<>":

    sqlObj.whereClause = dwscripts.encodeSQLColumnRef("" ,columnName) + " " + operatorType + " " + parameterName;

    break;

  case "begins with":

    sqlObj.whereClause = dwscripts.encodeSQLColumnRef("" ,columnName) + " LIKE '" + dwscripts.trimQuotes(parameterName) + "%'";

    break;

  case "ends with":

    sqlObj.whereClause = dwscripts.encodeSQLColumnRef("" ,columnName) + " LIKE '%" + dwscripts.trimQuotes(parameterName) + "'";

    break;

  case "contains":

    sqlObj.whereClause = dwscripts.encodeSQLColumnRef("" ,columnName) + " LIKE '%" + dwscripts.trimQuotes(parameterName) + "%'";

    break;

  }



  if (sqlObj.whereClause && !sqlObj.whereKeyword)

  {

    sqlObj.whereKeyword = SQLStatement.WHERE_KEYWORD;

  }

}





//--------------------------------------------------------------------

// FUNCTION:

//   getSimpleOrderByInfo

//

// DESCRIPTION:

//   Returns an object with information about the current order by clause,

//   if it is based on a single column.

//   Returns an empty object if the where clause is empty, and null if 

//   the order by clause is not a single column

//

// ARGUMENTS:

//   none

//

// RETURNS:

//   objcet - 2 parameters: column, direction

//--------------------------------------------------------------------



function SBRecordsetPHP_getSimpleOrderByInfo(sqlObj)

{

  var retVal = null;



  var orderByStr = dwscripts.trim(sqlObj.orderByClause);



  var info = new Object();

  info.column = "";

  info.direction = "";



  if (orderByStr != "")

  {

    // Note: The order of these regexp checks is important. The third regexp matches

    //   the case where no order (ASC, DESC) is specified; however, it will match 

    //   the first two cases where an order is specified. When matching these cases,

    //   it extracts the incorrect value for the column. So, we perform the more 

    //   specific regexp matches first.

    if (orderByStr.search(/^\s*([\w\. `]+)\s+asc\s*$/i) != -1)

    {

      info.column = RegExp.$1    

      info.direction = "ASC"

    }

    else if (orderByStr.search(/^\s*([\w\. `]+)\s+desc\s*$/i) != -1)

    {

      info.column = RegExp.$1    

      info.direction = "DESC"

    }

    else if (orderByStr.search(/^\s*([\w\. `]+)\s*$/i) != -1)

    {

      info.column = RegExp.$1    

      info.direction = "ASC"

    }

    else

    {

      info = null;

    }

    

    if (info && info.column)

    {

      info.column = dwscripts.decodeSQLColumnRef(info.column);

    }

    

    retVal = info;

   }

   else

   {

    retVal = new Object();

   }



   return retVal;

}





//--------------------------------------------------------------------

// FUNCTION:

//   SBRecordsetPHP.getPageSize

//

// DESCRIPTION:

//   Returns the PageSize currently set for this recordset

//

// ARGUMENTS:

//   none

//

// RETURNS:

//   string

//--------------------------------------------------------------------



function SBRecordsetPHP_getPageSize()

{

   return this.getParameter(this.EXT_DATA_RR_PAGE_SIZE) ;

}





//--------------------------------------------------------------------

// FUNCTION:

//   SBRecordsetPHP.setPageSize

//

// DESCRIPTION:

//   Sets the page size for the current recordset.  Passing in 0 will

//   cause the page size related code to be removed.

//

// ARGUMENTS:

//   pageSize - integer - the page size to use with this recordset, or

//     0 to remove the page size code.

//

// RETURNS:

//   nothing

//--------------------------------------------------------------------



function SBRecordsetPHP_setPageSize(pageSize)

{

  pageSize = (pageSize != null) ? pageSize.toString() : "1";

  

  if (pageSize == "0")

  {

    pageSize = "";

  }

  

  this.setParameter(this.EXT_DATA_RR_START_RECORD, "0" );



  this.setParameter(this.EXT_DATA_RR_PAGE_SIZE, pageSize );

}





//--------------------------------------------------------------------

// FUNCTION:

//   SBRecordsetPHP.setDefaultPageSize

//

// DESCRIPTION:

//   This function is called by SB's which require paging, but do

//   not have the UI to collect a page size.  This function will

//   set a valid default value.

//

// ARGUMENTS:

//   none

//

// RETURNS:

//   nothing

//--------------------------------------------------------------------



function SBRecordsetPHP_setDefaultPageSize()

{

  if (!this.getParameter(this.EXT_DATA_RR_PAGE_SIZE))

  {

    // if we have a Repeat Region on the page, set the page size to 10,

    //  otherwise set it to 1

    var sbObj = dwscripts.getServerBehaviorByParam("RepeatedRegion.htm","RecordsetName", this.getParameter("RecordsetName"));

    if (sbObj)

    {

      this.setPageSize(10);

    }

    else

    {

      this.setPageSize(1);

    }

  }

}





//--------------------------------------------------------------------

// FUNCTION:

//   SBRecordsetPHP.updatePageSize

//

// DESCRIPTION:

//   This function is called when a Server Behavior which depends on

//   the page size is deleted.  This will check to see if any other 

//   Server Behaviors depend on the page size, and remove it if no 

//   dependencies are found.

//

// ARGUMENTS:

//   removedSBObj - Server Behavior object - the object being removed

//

// RETURNS:

//   nothing

//--------------------------------------------------------------------



function SBRecordsetPHP_updatePageSize(removedSBObj)

{

  if (this.getPageSize())

  {

    var rsName = this.getParameter("RecordsetName");

    

    var depFound = false;

    var allSBs = dw.serverBehaviorInspector.getServerBehaviors();

    for (var i=0; i < allSBs.length; i++)

    {

      if (allSBs[i] != removedSBObj &&

          allSBs[i].getParameter != null &&

          allSBs[i].getParameter("NeedsPageSize_" + rsName))

      {

        depFound = true;

        break;

      }

    }



    if (!depFound)

    {

      this.setPageSize(0);

    }

  }

}

