document.querySelectorAll('main header')[0].innerHTML  = '<h1>' + document.querySelectorAll('main header')[0].getAttribute('title') + '</h1>';
document.querySelectorAll('main header')[0].innerHTML += document.querySelectorAll('meta[name=description]')[0].getAttribute('content');

var $input = document.getElementsByTagName('input'); var $label = document.getElementsByTagName('label');
for(i = 0 ; i < $input.length ; i++) { if ($input.item(i).hasAttribute('required') !=true) continue;
for(l = 0 ; l < $label.length ; l++) { if ($label.item(l).getAttribute('for') != $input.item(i).getAttribute('name')) continue;
$label.item(l).innerHTML = $label.item(l).innerHTML + '<span class="required"> *</span>';
}}
