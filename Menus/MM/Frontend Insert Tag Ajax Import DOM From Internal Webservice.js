function isDOMRequired()    { return false; }
function canAcceptCommand() { return true; }

// Pengaturan untuk judul dan argument menggunakan sparator ; dan nilai id akan menjadi argument
function getDynamicContent(itemID) {
   var retArray = new Array();
       retArray[0] = "Judul Untuk Menu;id='nilai_argument'";
return retArray;
}

// Proses menu terpilih
function receiveArguments() {
 alert( arguments[0] );
}