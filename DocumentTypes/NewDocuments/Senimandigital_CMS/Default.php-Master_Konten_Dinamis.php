<?php require_once('../Connections/senimandigital.php'); ?>
<table>
<tr>
<td role="article" valign="top">
<section>
<h3><?php echo $WEBSITE['DOMAIN']['SUB'] . $_SERVER['SCRIPT_NAME']; ?></h3>
<?php include $WEBSITE['HOSTING']['TEMPLATES'] .'php/deskripsi.php'; ?>
<?php include $WEBSITE['HOSTING']['TEMPLATES'] .'php/konten.php'; ?>
</section>
</td>
<td role="aside">
<section>
<h3>Tabel Referensi</h3>
<ul data-filter="true" active="<?php $_GET['table']; ?>">
<?php do { // } while ($row_show_tables = mysql_fetch_assoc($show_tables));  ?>
<li active="="><a href="?referensi[<?php echo $row_show_tables['Tables_in_'. $database_senimandigital]; ?>]"><input url-change="parameter" name="referensi[<?php echo $row_show_tables['Tables_in_'. $database_senimandigital]; ?>]" type="checkbox" value="" /><?php echo $row_show_tables['Tables_in_'. $database_senimandigital]; ?></a></li>
<?php } while ($row_show_tables = mysql_fetch_assoc($show_tables)); $rows = mysql_num_rows($show_tables); if($rows > 0) { mysql_data_seek($show_tables, 0); $row_show_tables = mysql_fetch_assoc($show_tables); } ?>
</ul>
</section>
</td>
</tr>
</table>
