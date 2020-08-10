<?php require_once('../Connections/senimandigital.php'); ?>
<table>
<tr>
<td role="article" valign="top">
<section>
<h3><?php echo $WEBSITE['DOMAIN']['SUB'] . $_SERVER['SCRIPT_NAME']; ?></h3>
<?php include $WEBSITE['HOSTING']['TEMPLATES'] .'php/deskripsi.php'; ?>
<?php
if     (preg_match('(tambah.php|insert.php)', $WEBSITE['HOSTING']['SCRIPT_FILENAME']) === 1) { include $WEBSITE['HOSTING']['TEMPLATES'] .'php/data_field_tambah.php'; }
elseif (preg_match('(edit.php|update.php)', $WEBSITE['HOSTING']['SCRIPT_FILENAME']) === 1)   { include $WEBSITE['HOSTING']['TEMPLATES'] .'php/data_field_edit.php'; }
elseif ($re = mysql_query('select 1 from `'. substr(basename($_SERVER['SCRIPT_NAME']), 0, -4) .'` LIMIT 1', $senimandigital) === FALSE) {    
	     include $WEBSITE['HOSTING']['TEMPLATES'] .'php/script_content_default.php'; if ($_GET['hapus']) unlink($WEBSITE['HOSTING']['SCRIPT_FILENAME']);
} else { include $WEBSITE['HOSTING']['TEMPLATES'] .'php/data_field_master.php'; }
?>
</section>
</td>
<td role="aside">
<?php include $WEBSITE['HOSTING']['TEMPLATES'] .'php/menu_samping.php'; ?>
</td>
</tr>
</table>
