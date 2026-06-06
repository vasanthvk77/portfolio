<?php
// Prevent PHP from outputting HTML warnings which break the JSON response
error_reporting(E_ALL);
ini_set('display_errors', '0');
date_default_timezone_set('UTC'); // Fixes warning for date() if timezone isn't set in php.ini

// Allow cross-origin requests for local testing (React frontend)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("HTTP/1.1 200 OK");
    exit();
}

// Automatically load local .env file if it exists (for local testing)
$envFile = dirname(__DIR__) . '/.env';
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        if (strpos($line, '=') !== false) {
            list($nameVar, $valueVar) = explode('=', $line, 2);
            $nameVar = trim($nameVar);
            $valueVar = trim(preg_replace('/^"|"$|^\'|\'$/', '', trim($valueVar))); // Strip quotes
            if (!getenv($nameVar)) {
                putenv("{$nameVar}={$valueVar}");
                $_ENV[$nameVar] = $valueVar;
                $_SERVER[$nameVar] = $valueVar;
            }
        }
    }
}

/**
 * Enhanced SMTP Mailer Class
 * Handles authenticated SMTP without external dependencies
 */
class SimpleSMTP {
    private $host;
    private $port;
    private $user;
    private $pass;
    private $lastError = "";

    public function __construct($host, $port, $user, $pass) {
        $this->host = $host;
        $this->port = (int)$port;
        $this->user = $user;
        $this->pass = $pass;
    }

    public function getLastError() {
        return $this->lastError;
    }

    public function send($toAddresses, $subject, $htmlContent, $plainTextContent, $fromName, $replyTo = "", $isAutoResponse = false) {
        $timeout = 10;
        $boundary = "----=_Part_" . md5(time());

        // SSL context - disabling peer verification for local dev compatibility
        $context = stream_context_create([
            'ssl' => [
                'verify_peer'       => false,
                'verify_peer_name'  => false,
                'allow_self_signed' => true,
            ]
        ]);

        if ($this->port == 465) {
            $socket = @stream_socket_client("ssl://{$this->host}:{$this->port}", $errno, $errstr, $timeout, STREAM_CLIENT_CONNECT, $context);
        } else {
            $socket = @stream_socket_client("tcp://{$this->host}:{$this->port}", $errno, $errstr, $timeout, STREAM_CLIENT_CONNECT, $context);
        }

        if (!$socket) {
            $this->lastError = "SMTP Connection Error: $errstr ($errno)";
            return false;
        }

        if (!$this->expect($socket, "220")) return false;
        if (!$this->sendCommand($socket, "EHLO " . $this->host, "250")) return false;

        if ($this->port == 587) {
            if (!$this->sendCommand($socket, "STARTTLS", "220")) return false;
            if (!stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
                $error = error_get_last();
                $this->lastError = "TLS Encryption failed. " . ($error ? $error['message'] : '');
                return false;
            }
            if (!$this->sendCommand($socket, "EHLO " . $this->host, "250")) return false;
        }

        if (!$this->sendCommand($socket, "AUTH LOGIN", "334")) return false;
        if (!$this->sendCommand($socket, base64_encode($this->user), "334")) return false;
        if (!$this->sendCommand($socket, base64_encode($this->pass), "235")) {
            $this->lastError = "Authentication failed";
            return false;
        }

        if (!$this->sendCommand($socket, "MAIL FROM: <{$this->user}>", "250")) return false;
        
        foreach ((array)$toAddresses as $to) {
            if (!$this->sendCommand($socket, "RCPT TO: <{$to}>", "250")) return false;
        }

        if (!$this->sendCommand($socket, "DATA", "354")) return false;

        // Extract domain from sender address for Message-ID header
        $domain = substr(strrchr($this->user, "@"), 1) ?: "localhost";
        $messageId = "<" . time() . '.' . uniqid('smtp', true) . '@' . $domain . ">";

        $headers = "MIME-Version: 1.0\r\n";
        $headers .= "To: " . (is_array($toAddresses) ? implode(', ', $toAddresses) : $toAddresses) . "\r\n";
        $headers .= "From: $fromName <{$this->user}>\r\n";
        if (!empty($replyTo)) {
            $headers .= "Reply-To: <$replyTo>\r\n";
        }
        $headers .= "Message-ID: $messageId\r\n";
        $headers .= "Subject: $subject\r\n";
        $headers .= "Date: " . date('r') . "\r\n";
        $headers .= "X-Mailer: SimpleSMTP\r\n";
        if ($isAutoResponse) {
            $headers .= "Auto-Submitted: auto-replied\r\n";
        }
        $headers .= "Content-Type: multipart/alternative; boundary=\"$boundary\"\r\n";

        $body = "--$boundary\r\n";
        $body .= "Content-Type: text/plain; charset=utf-8\r\n";
        $body .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
        $body .= $plainTextContent . "\r\n\r\n";
        $body .= "--$boundary\r\n";
        $body .= "Content-Type: text/html; charset=utf-8\r\n";
        $body .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
        $body .= $htmlContent . "\r\n\r\n";
        $body .= "--$boundary--";

        fputs($socket, $headers . "\r\n" . $body . "\r\n.\r\n");
        if (!$this->expect($socket, "250")) return false;

        $this->sendCommand($socket, "QUIT", "221");
        fclose($socket);
        return true;
    }

    private function sendCommand($socket, $cmd, $expected) {
        fputs($socket, $cmd . "\r\n");
        return $this->expect($socket, $expected);
    }

    private function expect($socket, $code) {
        $response = "";
        while ($line = @fgets($socket, 515)) {
            $response .= $line;
            if (isset($line[3]) && $line[3] == " ") break;
        }
        if (substr($response, 0, 3) !== $code) {
            $this->lastError = "Expected $code but received: " . $response;
            return false;
        }
        return true;
    }
}

// -------------------------------------------------------------------
// EMAIL CONFIGURATION — loaded directly from environment variables
// -------------------------------------------------------------------
$emailConfig = [
    'host'     => getenv('SMTP_HOST') ?: 'smtp.gmail.com',
    'port'     => (int)(getenv('SMTP_PORT') ?: 587),
    'username' => getenv('SMTP_USER') ?: 'vasanth2004vk@gmail.com',
    'password' => getenv('SMTP_PASSWORD') ?: '',
    'fromName' => getenv('SMTP_FROM_NAME') ?: 'Portfolio Contact Form',
];
$toEmails = getenv('CONTACT_RECIPIENT_EMAIL') ?: 'vasanthakumar4059@gmail.com';
// -------------------------------------------------------------------

// Retrieve POST data
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["status" => "error", "message" => "No data provided."]);
    exit();
}

$name    = isset($data['name'])    ? trim($data['name'])    : '';
$email   = isset($data['email'])   ? trim($data['email'])   : '';
$phone   = isset($data['phone'])   ? trim($data['phone'])   : '';
$message = isset($data['message']) ? trim($data['message']) : '';

// --- Server-side validation ---
$validationErrors = [];
if (empty($name))                           $validationErrors[] = "Name is required.";
if (empty($email))                          $validationErrors[] = "Email is required.";
elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) $validationErrors[] = "Invalid email address.";
if (empty($message))                        $validationErrors[] = "Message is required.";

if (!empty($validationErrors)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => implode(" ", $validationErrors)]);
    exit();
}

// Sanitize after validation
$name    = htmlspecialchars($name);
$email   = htmlspecialchars($email);
$phone   = htmlspecialchars($phone);
$messageRaw = $message; // Keep raw for text version
$message = htmlspecialchars($message);

$mailer = new SimpleSMTP($emailConfig['host'], $emailConfig['port'], $emailConfig['username'], $emailConfig['password']);

// PROFESSIONAL HTML TEMPLATE
$htmlContent = "
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #08080f; }
        .container { 
            max-width: 600px; 
            margin: 20px auto; 
            background: #111119; 
            border-radius: 12px; 
            overflow: hidden; 
            box-shadow: 0 10px 50px rgba(0, 0, 0, 0.4); 
            border: 1px solid rgba(255,255,255,0.06); 
        }
        .header { 
            background: linear-gradient(90deg, #8b5cf6 0%, #06b6d4 100%); 
            color: #ffffff; 
            padding: 40px 30px; 
            text-align: center; 
            border-bottom: 1px solid rgba(255,255,255,0.05); 
        }
        .header h1 { margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; }
        .content { padding: 40px; color: #ffffff; }
        .content h2 { color: #8b5cf6; margin-top: 0; font-size: 16px; border-bottom: 2px solid rgba(255,255,255,0.05); padding-bottom: 12px; margin-bottom: 25px; text-transform: uppercase; letter-spacing: 1px; }
        .field { margin-bottom: 25px; }
        .label { font-weight: 700; color: #64748b; font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; display: block; margin-bottom: 6px; }
        .value { font-size: 16px; color: #e2e8f0; font-weight: 500; }
        .message-box { background-color: rgba(255,255,255,0.02); padding: 25px; border-radius: 8px; border-left: 4px solid #8b5cf6; font-style: italic; margin-bottom: 35px; color: #e2e8f0; line-height: 1.8; box-shadow: inset 0 0 10px rgba(0,0,0,0.02); }
        .footer-inner { margin-top: 40px; padding-top: 25px; border-top: 1px solid rgba(255,255,255,0.05); text-align: center; font-size: 11px; color: #64748b; letter-spacing: 0.5px; }
    </style>
</head> 
<body>
    <div class='container'>
        <div class='header'>
            <h1>Mail from portfolio</h1>
        </div>
        <div class='content'>
            <h2>Contact Details</h2>
            <div class='field'>
                <span class='label'>Name</span>
                <span class='value'>{$name}</span>
            </div>
            <div class='field'>
                <span class='label'>Email Address</span>
                <span class='value'><a href='mailto:{$email}' style='color: #06b6d4; text-decoration: none;'>{$email}</a></span>
            </div>
            " . (!empty($phone) ? "
            <div class='field'>
                <span class='label'>Phone Number</span>
                <span class='value'>{$phone}</span>
            </div>
            " : "") . "
            <h2>Message</h2>
            <div class='message-box'>
                " . nl2br($message) . "
            </div>
            
            
        </div>
    </div>
</body>
</html>
";

// PLAIN TEXT FALLBACK
// PLAIN TEXT FALLBACK
$plainTextContent = "
NEW CONTACT FORM SUBMISSION
===========================

Name: {$name}
Email: {$email}
" . (!empty($phone) ? "Phone: {$phone}\n" : "") . "
Message:
---------------------------
{$messageRaw}
---------------------------

Sent from Portfolio Website.
";// PROFESSIONAL HTML TEMPLATE FOR AUTO-ACKNOWLEDGEMENT
$ackHtmlContent = <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Message Received — Vasantha Kumar B</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&family=Outfit:wght@300;400;600&display=swap" rel="stylesheet">
<style>
  body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
  table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
  img { -ms-interpolation-mode: bicubic; }

  body {
    margin: 0;
    padding: 0;
    width: 100% !important;
    height: 100% !important;
    background-color: #F5F0E8;
    font-family: 'Outfit', sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  /* Responsive styling */
  @media screen and (max-width: 600px) {
    .shell { padding: 16px 8px !important; }
    .hero { padding: 32px 24px 0 !important; }
    .rule { margin: 24px !important; }
    .body-area { padding: 0 24px !important; }
    .section-label { margin: 24px 24px 16px !important; }
    .sig-area { padding: 0 24px 24px !important; }
    .links-strip { margin: 20px 24px 0 !important; padding: 15px !important; }
    .footer { margin: 20px 24px 32px !important; }
    .big-word { font-size: 56px !important; }
  }
</style>
</head>
<body style="background-color: #F5F0E8; margin: 0; padding: 0;">

<table border="0" cellpadding="0" cellspacing="0" width="100%">
  <tr>
    <td align="center" style="background-color: #F5F0E8; padding: 32px 8px 48px;" class="shell">
      
      <!-- CARD CONTAINER -->
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #0E0D0B; border-radius: 6px; overflow: hidden; border-collapse: collapse;">


        <!-- HERO -->
        <tr>
          <td style="padding: 48px 48px 0;" class="hero">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td style="padding-bottom: 24px;">
                  <table border="0" cellpadding="0" cellspacing="0" align="left">
                    <tr>
                      <td width="8" height="8" style="background-color: #06b6d4; border-radius: 50%;"></td>
                      <td style="padding-left: 10px; font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: .12em; color: #7A7567; text-transform: uppercase;">
                        Acknowledgement &nbsp;·&nbsp; Auto-dispatch
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="font-family: 'DM Serif Display', serif; font-size: 72px; line-height: 0.92; color: #F5F0E8; letter-spacing: -.02em;" class="big-word">
                  Got<br>
                  your<br>
                  <span style="color: #8b5cf6; font-style: italic;">note.</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- DIVIDER -->
        <tr>
          <td>
            <div style="height: 1px; background-color: #2A2822; margin: 40px 48px;" class="rule"></div>
          </td>
        </tr>

        <!-- BODY -->
        <tr>
          <td style="padding: 0 48px;" class="body-area">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
              <!-- TO NAME -->
              <tr>
                <td style="padding-bottom: 28px;">
                  <span style="font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: .14em; color: #4A4740; text-transform: uppercase; vertical-align: middle; margin-right: 10px;">To</span>
                  <span style="font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 600; color: #F5F0E8; background-color: #1E1D19; padding: 6px 14px; border-radius: 4px; border: 1px solid #2E2D28; display: inline-block;">
                    {$name}
                  </span>
                </td>
              </tr>
              <!-- MESSAGE TEXT -->
              <tr>
                <td style="font-family: 'Outfit', sans-serif; font-size: 16px; font-weight: 300; line-height: 1.8; color: #A8A197; padding-bottom: 20px;">
                  Thanks for reaching out through my portfolio.
                </td>
              </tr>
              <tr>
                <td style="font-family: 'Outfit', sans-serif; font-size: 16px; font-weight: 300; line-height: 1.8; color: #A8A197; padding-bottom: 20px;">
                  I've received your message and will respond as soon as possible. I appreciate your time and interest.
                </td>
              </tr>
              <tr>
                <td style="font-family: 'Outfit', sans-serif; font-size: 16px; font-weight: 300; line-height: 1.8; color: #A8A197; padding-bottom: 24px;">
                  Have a great day!
                </td>
              </tr>

            </table>
          </td>
        </tr>

        <!-- SEPARATOR -->
        <tr>
          <td style="padding: 32px 48px 24px;" class="section-label">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td width="1%" style="font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: .14em; color: #4A4740; text-transform: uppercase; white-space: nowrap; padding-right: 16px;">
                  Sender
                </td>
                <td style="background-color: #2A2822; height: 1px;"></td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- SIGNATURE -->
        <tr>
          <td style="padding: 0 48px 40px;" class="sig-area">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td>
                  <div style="font-family: 'DM Serif Display', serif; font-size: 34px; line-height: 1.1; color: #F5F0E8; letter-spacing: -.01em;">
                    Vasantha Kumar B
                  </div>
                  <div style="font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 400; color: #7A7567; margin-top: 6px; letter-spacing: .04em;">
                    Full Stack Developer — Coimbatore, Tamil Nadu, IN
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- LINKS -->
        <tr>
          <td style="padding: 0 48px;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #141310; border: 1px solid #1E1D19; border-radius: 4px;">
              <tr>
                <td style="padding: 16px 20px;" class="links-strip">
                  <a href="https://github.com/vasanthvk77" target="_blank" style="font-family: 'DM Mono', monospace; font-size: 12px; letter-spacing: .15em; color: #7A7567; text-decoration: none; text-transform: uppercase; margin-right: 24px; display: inline-block;">↗ GitHub</a>
                  <a href="https://linkedin.com/in/vasantha-kumar-b" target="_blank" style="font-family: 'DM Mono', monospace; font-size: 12px; letter-spacing: .15em; color: #7A7567; text-decoration: none; text-transform: uppercase; margin-right: 24px; display: inline-block;">↗ LinkedIn</a>
                  <a href="https://vasanthakumar.dev" target="_blank" style="font-family: 'DM Mono', monospace; font-size: 12px; letter-spacing: .15em; color: #7A7567; text-decoration: none; text-transform: uppercase; display: inline-block;">↗ Portfolio</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="padding: 32px 48px 48px;" class="footer">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-top: 1px solid #1E1D19; padding-top: 20px;">
              <tr>
                <td style="font-family: 'DM Mono', monospace; font-size: 8px; letter-spacing: .1em; color: #3A3830; text-transform: uppercase;">
                  This is an automated acknowledgement
                </td>
                <td align="right" style="font-family: 'DM Serif Display', serif; font-size: 10px; color: #2A2822; letter-spacing: .04em;">
                  VasanthaKumar B
                </td>
              </tr>
            </table>
          </td>
        </tr>

      </table>

      <!-- OUTER NOTE -->
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; text-align: center;">
        <tr>
          <td style="font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: .12em; color: #7A7567; text-transform: uppercase; padding-top: 24px;" class="outer-note">
            Sent via Portfolio Contact Form
          </td>
        </tr>
      </table>

    </td>
  </tr>
</table>

</body>
</html>
HTML;

// PLAIN TEXT TEMPLATE FOR AUTO-ACKNOWLEDGEMENT
$ackPlainTextContent = "
Hello {$name},

Thank you for reaching out through my portfolio.

I've received your message and will respond as soon as possible. I appreciate your time and interest.

Have a great day!

Best Regards,
Vasantha Kumar B
";

// -------------------------------------------------------------------
// SEND SUCCESS RESPONSE IMMEDIATELY
// This allows the user to see the success message without waiting 
// for the SMTP handshake which can take several seconds.
// -------------------------------------------------------------------
ignore_user_abort(true);
set_time_limit(300); // Give SMTP enough time in background

// Buffering to send response first
ob_start();
echo json_encode(["status" => "success", "message" => "Message received. We will get back to you soon!"]);
$size = ob_get_length();
header("Content-Length: $size");
header("Connection: close");
ob_end_flush();
ob_flush();
flush();

// For servers using FastCGI (like many production hosts)
if (function_exists('fastcgi_finish_request')) {
    fastcgi_finish_request();
}

// -------------------------------------------------------------------
// NOW PROCESS THE EMAIL IN THE BACKGROUND
// -------------------------------------------------------------------
$result = $mailer->send($toEmails, "New Contact Us Form Submission from $name", $htmlContent, $plainTextContent, $emailConfig['fromName'], $email);

$logFile = __DIR__ . '/mailer_log.txt';
$timestamp = date('Y-m-d H:i:s');
if ($result) {
    file_put_contents($logFile, "[$timestamp] Success: Mail sent successfully to " . $toEmails . "\n", FILE_APPEND);
    
    // Send auto-acknowledgement email to the sender
    $ackResult = $mailer->send($email, "Message Received", $ackHtmlContent, $ackPlainTextContent, "Vasantha Kumar B", "", true);
    if ($ackResult) {
        file_put_contents($logFile, "[$timestamp] Success: Auto-ACK sent to " . $email . "\n", FILE_APPEND);
    } else {
        file_put_contents($logFile, "[$timestamp] Error: Auto-ACK failed to send to " . $email . ". Error: " . $mailer->getLastError() . "\n", FILE_APPEND);
    }
} else {
    file_put_contents($logFile, "[$timestamp] Error: Mail failed to send. Error: " . $mailer->getLastError() . "\n", FILE_APPEND);
}

exit();
