<?php
error_reporting(E_ALL);
ini_set('display_errors', '0');

// CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Load local .env file if it exists (localhost development only)
$envFile = dirname(__DIR__) . '/.env';
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        if (strpos($line, '=') !== false) {
            list($nameVar, $valueVar) = explode('=', $line, 2);
            $nameVar  = trim($nameVar);
            $valueVar = trim(preg_replace('/^\"|\"$|^\'|\'$/', '', trim($valueVar)));
            putenv("{$nameVar}={$valueVar}");
            $_ENV[$nameVar]    = $valueVar;
            $_SERVER[$nameVar] = $valueVar;
        }
    }
}

// -------------------------------------------------------------------
// CONFIGURATION — loaded from environment variables
// -------------------------------------------------------------------
$clientId       = getenv('GMAIL_CLIENT_ID');
$clientSecret   = getenv('GMAIL_CLIENT_SECRET');
$refreshToken   = getenv('GMAIL_REFRESH_TOKEN');
$fromEmail      = getenv('GMAIL_FROM_EMAIL')  ?: 'vasanth2004vk@gmail.com';
$fromName       = getenv('GMAIL_FROM_NAME')   ?: 'Vasantha Kumar B';
$recipientEmail = getenv('VITE_CONTACT_RECIPIENT_EMAIL') ?: 'vasanthakumar4059@gmail.com';
// -------------------------------------------------------------------

// -------------------------------------------------------------------
// STEP 1: Get a fresh Access Token using the Refresh Token (No cURL needed)
// -------------------------------------------------------------------
function getGmailAccessToken($clientId, $clientSecret, $refreshToken) {
    $postData = http_build_query([
        'client_id'     => $clientId,
        'client_secret' => $clientSecret,
        'refresh_token' => $refreshToken,
        'grant_type'    => 'refresh_token',
    ]);
    
    $opts = [
        'http' => [
            'method'  => 'POST',
            'header'  => "Content-Type: application/x-www-form-urlencoded\r\n" .
                         "Content-Length: " . strlen($postData) . "\r\n",
            'content' => $postData,
            'timeout' => 15
        ],
        'ssl' => [
            'verify_peer'       => false,
            'verify_peer_name'  => false,
            'allow_self_signed' => true,
        ]
    ];
    
    $context = stream_context_create($opts);
    $response = @file_get_contents('https://oauth2.googleapis.com/token', false, $context);
    
    if ($response === false) {
        return null;
    }
    
    $data = json_decode($response, true);
    return $data['access_token'] ?? null;
}

// -------------------------------------------------------------------
// STEP 2: Send email via Gmail REST API (No cURL needed)
// -------------------------------------------------------------------
function sendViaGmailAPI($accessToken, $fromName, $fromEmail, $toEmail, $subject, $htmlBody, $replyTo = '') {
    // Build raw MIME message with base64 encoded HTML body
    $mime  = "MIME-Version: 1.0\r\n";
    $mime .= "From: =?utf-8?B?" . base64_encode($fromName) . "?= <{$fromEmail}>\r\n";
    $mime .= "To: {$toEmail}\r\n";
    if (!empty($replyTo)) {
        $mime .= "Reply-To: <{$replyTo}>\r\n";
    }
    $mime .= "Subject: =?utf-8?B?" . base64_encode($subject) . "?=\r\n";
    $mime .= "Content-Type: text/html; charset=utf-8\r\n";
    $mime .= "Content-Transfer-Encoding: base64\r\n";
    $mime .= "\r\n";
    $mime .= chunk_split(base64_encode($htmlBody));

    // Gmail API requires base64url encoding of the entire MIME message
    $encoded = rtrim(strtr(base64_encode($mime), '+/', '-_'), '=');
    $payload = json_encode(['raw' => $encoded]);

    $opts = [
        'http' => [
            'method'        => 'POST',
            'header'        => "Authorization: Bearer {$accessToken}\r\n" .
                               "Content-Type: application/json\r\n" .
                               "Content-Length: " . strlen($payload) . "\r\n",
            'content'       => $payload,
            'timeout'       => 15,
            'ignore_errors' => true // allows reading response body on non-200 HTTP codes
        ],
        'ssl' => [
            'verify_peer'       => false,
            'verify_peer_name'  => false,
            'allow_self_signed' => true,
        ]
    ];
    
    $context  = stream_context_create($opts);
    $response = @file_get_contents('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', false, $context);
    
    // Extract HTTP Response Code
    $httpCode = 500;
    $hdrVar = 'http_response_header';
    $headers = function_exists('http_get_last_response_headers') ? http_get_last_response_headers() : (isset($$hdrVar) ? $$hdrVar : null);
    if (isset($headers) && isset($headers[0])) {
        preg_match('{HTTP\/\S*\s(\d{3})}', $headers[0], $match);
        $httpCode = isset($match[1]) ? (int)$match[1] : 500;
    }
    
    return [
        'success'  => ($httpCode >= 200 && $httpCode < 300),
        'httpCode' => $httpCode,
        'response' => $response,
        'error'    => $response === false ? 'Connection failed' : '',
    ];
}

// -------------------------------------------------------------------
// READ & VALIDATE POST DATA
// -------------------------------------------------------------------
$data = json_decode(file_get_contents("php://input"), true);
if (!$data) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "No data provided."]);
    exit();
}

$name    = isset($data['name'])    ? trim($data['name'])    : '';
$email   = isset($data['email'])   ? trim($data['email'])   : '';
$phone   = isset($data['phone'])   ? trim($data['phone'])   : '';
$message = isset($data['message']) ? trim($data['message']) : '';

$errors = [];
if (empty($name))    $errors[] = "Name is required.";
if (empty($email))   $errors[] = "Email is required.";
elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = "Invalid email address.";
if (empty($message)) $errors[] = "Message is required.";

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => implode(" ", $errors)]);
    exit();
}

$nameSafe    = htmlspecialchars($name);
$emailSafe   = htmlspecialchars($email);
$phoneSafe   = htmlspecialchars($phone);
$messageSafe = htmlspecialchars($message);

// -------------------------------------------------------------------
// NOTIFICATION EMAIL HTML (sent to you)
// -------------------------------------------------------------------
$notifyHtml = "
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', sans-serif; background:#08080f; color:#e2e8f0; margin:0; padding:0; }
    .container { max-width:600px; margin:20px auto; background:#111119; border-radius:12px; overflow:hidden; border:1px solid rgba(255,255,255,0.06); }
    .header { background:linear-gradient(90deg,#8b5cf6,#06b6d4); color:#fff; padding:40px 30px; text-align:center; }
    .header h1 { margin:0; font-size:20px; font-weight:700; letter-spacing:2px; text-transform:uppercase; }
    .content { padding:40px; }
    .content h2 { color:#8b5cf6; font-size:14px; text-transform:uppercase; letter-spacing:1px; border-bottom:1px solid rgba(255,255,255,0.07); padding-bottom:10px; }
    .field { margin-bottom:22px; }
    .label { font-size:10px; font-weight:700; color:#64748b; text-transform:uppercase; letter-spacing:1.5px; display:block; margin-bottom:5px; }
    .value { font-size:16px; color:#e2e8f0; }
    .message-box { background:rgba(255,255,255,0.03); border-left:4px solid #8b5cf6; padding:20px; border-radius:6px; line-height:1.8; font-style:italic; }
    .footer { margin-top:30px; padding-top:20px; border-top:1px solid rgba(255,255,255,0.06); font-size:11px; color:#64748b; text-align:center; }
  </style>
</head>
<body>
  <div class='container'>
    <div class='header'><h1>New Portfolio Message</h1></div>
    <div class='content'>
      <h2>Contact Details</h2>
      <div class='field'><span class='label'>Name</span><span class='value'>{$nameSafe}</span></div>
      <div class='field'><span class='label'>Email</span><span class='value'><a href='mailto:{$emailSafe}' style='color:#06b6d4;text-decoration:none;'>{$emailSafe}</a></span></div>
      " . (!empty($phoneSafe) ? "<div class='field'><span class='label'>Phone</span><span class='value'>{$phoneSafe}</span></div>" : "") . "
      <h2>Message</h2>
      <div class='message-box'>" . nl2br($messageSafe) . "</div>
      <div class='footer'>Sent from Portfolio Website Contact Form</div>
    </div>
  </div>
</body>
</html>
";

// -------------------------------------------------------------------
// AUTO-REPLY EMAIL HTML (sent to visitor)
// -------------------------------------------------------------------
$ackHtml = "
<!DOCTYPE html>
<html lang='en'>
<head>
<meta charset='UTF-8'>
<style>
  body { font-family: 'Segoe UI', sans-serif; background-color:#F5F0E8; margin:0; padding:0; }
  .card { max-width:600px; margin:30px auto; background:#0E0D0B; border-radius:6px; overflow:hidden; }
  .hero { padding:48px 48px 0; }
  .big { font-size:64px; line-height:0.92; color:#F5F0E8; letter-spacing:-0.02em; font-weight:700; }
  .accent { color:#8b5cf6; font-style:italic; }
  .rule { height:1px; background:#2A2822; margin:36px 48px; }
  .body { padding:0 48px; color:#A8A197; font-size:16px; line-height:1.8; }
  .sig { padding:32px 48px; }
  .sig-name { font-size:28px; color:#F5F0E8; font-weight:700; }
  .sig-sub { font-size:13px; color:#7A7567; margin-top:4px; }
  .links { margin:0 48px; background:#141310; border:1px solid #1E1D19; border-radius:4px; padding:14px 18px; }
  .links a { color:#7A7567; text-decoration:none; font-size:12px; text-transform:uppercase; margin-right:20px; }
  .footer { padding:24px 48px 40px; font-size:9px; color:#3A3830; text-transform:uppercase; }
</style>
</head>
<body>
<div class='card'>
  <div class='hero'>
    <div class='big'>Got<br>your<br><span class='accent'>note.</span></div>
  </div>
  <div class='rule'></div>
  <div class='body'>
    <p>Hi {$nameSafe},</p>
    <p>Thanks for reaching out through my portfolio. I've received your message and will get back to you as soon as possible.</p>
    <p>Have a great day!</p>
  </div>
  <div class='sig'>
    <div class='sig-name'>Vasantha Kumar B</div>
    <div class='sig-sub'>Full Stack Developer — Tiruppur, Tamil Nadu, IN</div>
  </div>
  <div class='links'>
    <a href='https://github.com/vasanthvk77' target='_blank'>↗ GitHub</a>
    <a href='linkedin.com/in/vasanthakumar-b-6a9102293' target='_blank'>↗ LinkedIn</a>
    <a href='https://vasanth-portfolio-six.vercel.app' target='_blank'>↗ Portfolio</a>
  </div>
  <div class='footer'>Automated acknowledgement · Portfolio Contact Form</div>
</div>
</body>
</html>
";

// -------------------------------------------------------------------
// GET ACCESS TOKEN
// -------------------------------------------------------------------
$accessToken = getGmailAccessToken($clientId, $clientSecret, $refreshToken);
$logFile     = __DIR__ . '/mailer_log.txt';
$timestamp   = date('Y-m-d H:i:s');

if (!$accessToken) {
    file_put_contents($logFile, "[{$timestamp}] ERROR: Failed to obtain Gmail access token.\n", FILE_APPEND);
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Authentication error. Please try again later."]);
    exit();
}

// -------------------------------------------------------------------
// SEND NOTIFICATION EMAIL → to you (vasanthakumar4059@gmail.com)
// -------------------------------------------------------------------
$result = sendViaGmailAPI(
    $accessToken,
    $fromName,
    $fromEmail,
    $recipientEmail,
    "New Contact Form Submission from {$nameSafe}",
    $notifyHtml,
    $email   // reply-to: visitor's email so you can reply directly
);

if ($result['success']) {
    file_put_contents($logFile, "[{$timestamp}] SUCCESS: Notification sent to {$recipientEmail}\n", FILE_APPEND);

    // SEND AUTO-REPLY → to visitor
    $ackResult = sendViaGmailAPI(
        $accessToken,
        $fromName,
        $fromEmail,
        $email,
        "Message Received — Vasantha Kumar B",
        $ackHtml
    );

    if ($ackResult['success']) {
        file_put_contents($logFile, "[{$timestamp}] SUCCESS: Auto-ACK sent to {$email}\n", FILE_APPEND);
    } else {
        file_put_contents($logFile, "[{$timestamp}] WARNING: Auto-ACK failed. HTTP:{$ackResult['httpCode']} Err:{$ackResult['error']}\n", FILE_APPEND);
    }

    echo json_encode(["status" => "success", "message" => "Message received. We will get back to you soon!"]);
} else {
    file_put_contents($logFile, "[{$timestamp}] ERROR: Notification failed. HTTP:{$result['httpCode']} Res:{$result['response']} Err:{$result['error']}\n", FILE_APPEND);
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Failed to send message. Please try again."]);
}

exit();
