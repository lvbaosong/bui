<?php  $title='选择器测试' ?>
<?php include("./templates/header.php"); ?>

  <div class="container">
    <div class="row">
      <div class="span8">
        <div id="l1"></div>
      </div>
       <div class="span8">
        <h2>一般选择器</h2>
        <input type="text" id="c1" />
        <input type="text" id="r2" />
      </div>
    </div>
  </div>
  
    <?php $url = 'bui/list'?>
    <?php include("./templates/script.php"); ?>

    <script type="text/javascript" src="specs/picker-spec.js"></script>

<?php include("./templates/footer.php"); ?>
