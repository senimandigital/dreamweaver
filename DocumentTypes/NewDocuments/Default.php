<?php if (isset($_GET['dom'])) goto dom_article; ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Senimandigital</title>
<meta name="description" content="Deskripsikan halaman disini, tulisan ini dapat diubah melalui meta tag." />
<?php echo $WEBSITE['SCRIPT']['HEADER']; ?>
<?php echo $WEBSITE['STYLE']['HEADER']; ?>
</head>
<body>
<?php if (!isset($_GET['popup'])) { echo $WEBSITE['TEMPLATE']['MENUATAS']; } ?>
<main>
<table width="100%" border="0" cellpadding="0" cellspacing="0">
<tr>
  <td valign="top">
  <?php dom_article: ?>
  <article>
    <section>
    <h3>ERROR... !</h3>
      <content class="alert under-construction">
      Under Construction
      <style> h3 { border-bottom-color:#999999; border-bottom-style:double; padding-bottom:10px; } </style>
      </content>
    </section>
  </article>
  <?php if (isset($_GET['dom'])) exit; ?>
  </td>
  <?php if (!isset($_GET['popup'])) { ?>
  <td width="225" valign="top">
  <aside>
  <content class="panel-description">
  <h3 class="article">DESCRIPTION</h3>
  <script language="javascript">
  for(var i=0; i<document.getElementsByTagName('meta').length; i++) {
      if(document.getElementsByTagName('meta').item(i).name.toLowerCase() != 'description') continue;
         document.write('<p>'+ document.getElementsByTagName('meta').item(i).content + '</p>');
     }
  </script>
  </content>
  </aside>
  </td>
  <?php } /* if (!isset($_GET['popup'])) */ ?>
</tr>
</table>
</main>
<?php echo $WEBSITE['TEMPLATE']['FOTTER']; ?>
</body>
</html>
