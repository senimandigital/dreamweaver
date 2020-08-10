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
<?php include $WEBSITE['HOSTING']['TEMPLATES'] .'php/menu_samping.php'; ?>
</td>
</tr>
</table>
