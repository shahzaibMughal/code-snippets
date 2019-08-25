<?php
/*
 * The easiest way to find out whether mod_rewrite is enabled
 * is to use apache_get_modules(), but this is available only
 * when PHP is loaded as an Apache module. It won't work when PHP
 * is run in CGI mode.
 */

if (function_exists('apache_get_modules')) {
    if (in_array('mod_rewrite', apache_get_modules())) {
        echo 'mod_rewrite is enabled';
    } else {
        echo 'mod_rewrite is not enabled';
    }
} elseif (isset($_SERVER['SERVER_SOFTWARE'])) {
    // Check if Apache is running in CGI mode
    if (substr(php_sapi_name(), 0, 3) == 'cgi' && stripos($_SERVER['SERVER_SOFTWARE'], 'Apache') !== false) {
        echo "You're running PHP in CGI mode on Apache";
        // Try to get the loaded modules
        $output = shell_exec(getApachePath() . 'apachectl -l');
        if ($output) {
            if (strpos($output, 'mod_rewrite') !== false) {
                echo ', and mod_rewrite is enabled';
            } else {
                echo ', but mod_rewrite is not enabled';
            }
        } else {
            echo ', but cannot determine whether mod_rewrite is enabled';
        }
    } elseif (stripos($_SERVER['SERVER_SOFTWARE'], 'nginx') !== false) {
        echo 'Your server is running on nginx';
    } else {
        echo 'Your server is running ' . $_SERVER['SERVER_SOFTWARE'];
    }
}else {
    echo "Can't determine server type";
}

function getApachePath() {
    // Turn on output buffering, and capture the output of phpinfo()
    ob_start();
    phpinfo();
    $output = ob_get_contents();
    ob_end_clean();

    // Find the Apache path from the Configure Command
    $start = strpos($output, '--with-apxs2');
    $end = strpos($output, '&#039;', $start);
    return substr($output, $start + 13, $end-$start-17);
}
