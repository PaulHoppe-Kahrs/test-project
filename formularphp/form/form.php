<?php require_once '../main.php'; ?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="form.style.css">
  <title>Hello World</title>
</head>
<body>
  <form action="#" method="post">
    <h2 class="form-title">Sign-Up</h2>
    
    <div class="input-container">
      <label for="input-username">Username</label>
      <input type="text" name="username" id="input-username" placeholder="Username">
    </div>

    <div class="input-container">
      <label for="input-email">Email</label>
      <input type="email" name="email" id="input-email" placeholder="your@email.com">
    </div>

    <div class="input-container">
      <label for="input-age">Age</label>
      <input type="number" name="age" id="input-age" placeholder="Age">
    </div>

    <div class="input-container">
      <label for="input-password">Password</label>
      <input type="password" name="password" id="input-password" placeholder="Password">
    </div>

    <div class="button-container">
      <button type="submit" name="send-login">Submit</button>
    </div>
  </form>

  <small><?php echo $errormsg; ?></small>
</body>
</html>