<!DOCTYPE html>
<html lang="en" >
<head>
  <meta charset="UTF-8">
  <title>Interactive globe</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="src/css/style.css">
  <script src="https://kit.fontawesome.com/be275233c5.js" crossorigin="anonymous"></script>
</head>
<body>

<div id="globe_controls">

  <button class="btn" id="counterClockwise"><i class="fa fa-arrow-rotate-left"></i></button>
  <button class="btn" id="pause"><i class="fa fa-pause"></i></button>
  <button class="btn" id="center"><i class="fa fa-bullseye"></i></button>
  <button class="btn" id="clockwise"><i class="fa fa-arrow-rotate-right"></i></button>

</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r79/three.min.js"></script>
<script type="module" src="src/js/script.js"></script>

</body>
</html>
