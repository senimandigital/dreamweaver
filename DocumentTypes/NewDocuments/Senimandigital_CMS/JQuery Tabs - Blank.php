<?php require_once('../Connections/senimandigital.php'); ?>
<table>
  <tr>
  <td role="article" valign="top">
  <section>
  <h3><?php echo $WEBSITE['DOMAIN']['SUB'] . $_SERVER['SCRIPT_NAME']; ?></h3>
  <?php include $WEBSITE['HOSTING']['TEMPLATES'] .'php/deskripsi.php'; ?>
  <div role="tabs" id="tabs">
    <ul>
      <li><a href="#tabs-main">main</a></li>
    </ul>
    <div id="tabs-main">
    <pre>$_SERVER = <?php print_r($_SERVER); ?></pre>
    <pre>$WEBSITE['DOMAIN']  = <?php print_r($WEBSITE['DOMAIN']); ?></pre>
    <pre>$WEBSITE['HOSTING'] = <?php print_r($WEBSITE['HOSTING']); ?></pre>
    </div>
  </div>
  </section>
  </td>
  <td role="aside">
    <?php include $WEBSITE['HOSTING']['TEMPLATES'] .'php/menu_samping.php'; ?></td>
  </tr>
</table>
