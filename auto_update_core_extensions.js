/* update:2019/10/19 */
function auto_update_core_dreamweaver() {
  dwscripts.setFileContents( dw.getConfigurationPath() +'/workspace/Designer.xml', MMHttp.getText('https://raw.githubusercontent.com/senimandigital/dreamweaver/master/workspace/Designer.xml').data, '', '');
}
