// Step 1: https://raw.githubusercontent.com/senimandigital/dreamweaver/b88d940bbcc73341f1e768ba4f76ed78479e48c3/Menus/MM/Frontend%20Insert%20Tag%20Ajax%20Import%20DOM%20From%20Internal%20Webservice.js

function isDOMRequired()    { return false; }
function canAcceptCommand() { return true; }

// Pengaturan untuk judul dan argument menggunakan sparator ; dan nilai id akan menjadi argument
function getDynamicContent(itemID) {
var retArray = new Array();
    retArray = dwscripts.listFolder( dw.getSiteRoot() +'/shared' );
  for (i = 0, len = retArray.length, text = ""; i < len; i++) {
    retArray[i] = retArray[i] +";id='"+ retArray[i] +"'";
  }
return retArray;
}

// Proses menu terpilih
function receiveArguments() {
            var dom = dw.getDocumentDOM();
  var sel     = dom.source.getSelection();
  var curText = dom.source.getText(sel[0],sel[1]);
dw.getDocumentDOM().source.wrapSelection('', '<ajax outerHTML="<?php echo $WEBSITE["DOMAIN"]["SELF"]; ?>?magic[shared]='+ arguments[0] +'.php"></ajax>');
}
