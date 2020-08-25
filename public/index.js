
<!DOCTYPE html>
<html>
<!--
Welcome to the source code for gethttpsforfree.com!

This is an open source website that is meant to be auditable. Please read
through the code to see what's going on!

Original files:
    /index.html - This page
    /js/index.js - The interaction behavior for this page

Third-party libraries (all from asn1.js package):
    /js/asn1js/int10.js - Needed for asn1.js
    /js/asn1js/hex.js - Convert hex to binary array
    /js/asn1js/base64.js - Convert base64 to binary array
    /js/asn1js/asn1.js - Parse ASN.1 format used in x.509 certificates
    /js/asn1js/LICENSE - The license for the above asn1.js files

Released under MIT License. Enjoy!
-->
<head>
    <title>Get HTTPS for free!</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <style>
        *{box-sizing:border-box;}
        div{margin:15px 0px;}
        .small{font-size:14px;font-weight:normal;}
        .error{color:#ff1111;}
        .field{width:100%;max-width:600px;}
        body{background-color:#fafafa;}
        li{margin-bottom:10px;}
        h1{border-bottom:solid black 1px;padding-bottom:15px;}
        input[type="text"]{width:100%;}
        textarea{width:100%;height:120px;white-space:pre;}
        .help{float:right;font-size:12px;text-decoration:underline;cursor:pointer;}
        .help-checkbox{display:none;}
        .help-checkbox:checked + .help-content{display:inline-block;}
        .help-content{display:none;width:100%;max-width:600px;margin:5px 0px 10px 0px;padding:10px;background-color:#eeeeee;border:2px solid #bbbbbb;}
        code{display:inline-block;margin:5px 0px;padding:5px;background-color:#ffffff;}
        pre{margin:5px 0px;padding:5px;overflow:auto;background-color:#ffffff;}
        .challenges-wrapper{border:1px solid;width:100%;max-width:600px;}
        .challenges-status,.challenges-domain{padding-left:15px;font-size:14px;}
        .challenges{margin-bottom:0;}
        .tabs{margin-bottom:0;}
        .tabs > label{display:inline-block;margin:0px;padding:6px 12px 12px 12px;font-size:13px;text-decoration:underline;cursor:pointer;}
        .tabs input[type=radio]{display:none;}
        .tabs input[type=radio]:checked + label{background-color:#eeeeee;}
        .tabs input[type=radio].challenge_python:checked ~ .tab.challenge_python{display:block;}
        .tabs input[type=radio].challenge_file:checked ~ .tab.challenge_file{display:block;}
        .tabs input[type=radio].challenge_dns:checked ~ .tab.challenge_dns{display:block;}
        .tab{display:none;background-color:#eeeeee;padding:15px 15px 1px 15px;margin-top:0;margin-bottom:0;}
        .tab .help-content{background-color:#ffffff;}
        .tab .help-content a{display:inline-block;width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
        .tab code{background-color:#eeeeee;}
        .tab pre{background-color:#eeeeee;}
        .tab textarea{height:105px;}
        .footer{font-size:12px;}
    </style>
    <script src="js/asn1js/int10.js"></script>
    <script src="js/asn1js/base64.js"></script>
    <script src="js/asn1js/hex.js"></script>
    <script src="js/asn1js/asn1.js"></script>
</head>
<body>

    <!--#############-->
    <!--##  Intro  ##-->
    <!--#############-->
    <h1>
        Get HTTPS for free!
        <span class="small">Update: Added wildcard certificate support!</span>
    </h1>
    <h2 id="digest_error" class="error" style="display:none;">
        ERROR: Your browser is not compatible with this website (this website
        needs WebCryptoAPI's crypto.subtle.digest()). Please upgrade to a modern
        browser (Firefox, Chrome, Safari, Edge, IE 11+).
    </h2>
    <div>
        You can now get free https certificates (incuding wildcard certificates)
        from the non-profit certificate authority
        <a href="https://letsencrypt.org/" target="_blank" rel="noopener noreferrer">Let's Encrypt</a>!
        This is a website that will take you through the manual steps to get your free
        https certificate so you can make your own website use https! This website is
        <a href="https://github.com/diafygi/howtogetfreehttps" target="_blank" rel="noopener noreferrer">open source</a>
        and <strong>NEVER</strong> asks for your private keys. Never trust a website
        that asks for your private keys!
        <!--<a href="revoke.html">Click here</a> to revoke certs.-->
    </div>

    <div>
        <b>NOTE: This website is for people who know how to generate certificate signing
        requests (CSRs)!</b> If you're not familiar with how to do this, please use the
        official Let's Encrypt <a href="https://github.com/certbot/certbot" target="_blank" rel="noopener noreferrer">official client</a>
        that can automatically issue and install https certificates for you. This
        website is designed for people who know what they are doing and just want to get
        their free https certificate.
    </div>

    <div>
        If you need to renew a certificate, simply complete these steps below again.
    </div>

    <hr/>

    <!--############################-->
    <!--##  Step 1: Account Info  ##-->
    <!--############################-->
    <h2>Step 1: Account Info</h2>
    <div>
        Let's Encrypt requires that you register an account email and public key before
        issuing a certificate. The email is so that they can contact you if needed, and
        the public key is so you can securely sign your requests to issue/revoke/renew
        your certificates. <i><b>Keep your account private key secret!</b> Anyone who has it
        can impersonate you when making requests to Let's Encrypt!</i>
    </div>

    <form id="validate_account">
        <div class="field">
            <label for="email">Account Email:</label><br/>
            <input id="email" type="text" placeholder="(e.g. webmaster@yourdomain.com)"/>
        </div>

        <div class="field">
            <label for="howto_pubkey" class="help">(how do I generate this?)</label>
            <input id="howto_pubkey" type="checkbox" class="help-checkbox"/>
            <div class="help-content">
                How to generate a new account keypair using openssl:<br/>
                <ol>
                    <li>
                        Generate an account private key if you don't have one:<br/>
                        (KEEP ACCOUNT.KEY SECRET!)<br/>
                        <code>openssl genrsa 4096 > account.key</code>
                    </li>
                    <li>
                        Print your public key:<br/>
                        <code>openssl rsa -in account.key -pubout</code>
                    </li>
                    <li>
                        Copy and paste the public key into the box below.<br/>
                    </li>
                </ol>
            </div>
            <label for="pubkey">Account Public Key:</label><br/>
            <textarea id="pubkey" placeholder="-----BEGIN PUBLIC KEY----- ..."></textarea>
        </div>

        <div class="field">
            <input id="validate_account_submit" type="submit" value="Validate Account Info" disabled/>
            <span id="validate_account_status" style="display:none;"></span>
        </div>
    </form>

    <hr/>

    <!--###########################################-->
    <!--##  Step 2: Certificate Signing Request  ##-->
    <!--###########################################-->
    <h2>Step 2: Certificate Signing Request</h2>
    <div>
        This is the certificate signing request (CSR) that you send to Let's Encrypt
        in order to issue you a signed certificate. It contains the website domains you
        want to issue certs for and the public key of your TLS private key. <i><b>Keep your
        TLS private key secret!</b> Anyone who has it can man-in-the-middle your website!</i>
    </div>

    <form id="validate_csr">
        <div class="field">
            <label for="howto_csr" class="help">(how do I generate this?)</label>
            <input id="howto_csr" type="checkbox" class="help-checkbox"/>
            <div class="help-content">
                How to generate a new Certificate Signing Request (CSR):<br/>
                <ol>
                    <li>
                        Generate a TLS private key if you don't have one:<br/>
                        (KEEP DOMAIN.KEY SECRET!)<br/>
                        <code>openssl genrsa 4096 > domain.key</code>
                    </li>
                    <li>
                        Generate a CSR for your the domains you want certs for:</br>
                        (replace "foo.com" with your domain)</br>
                        Linux:
                        <pre>
    #change "/etc/ssl/openssl.cnf" as needed:
    #  Debian: /etc/ssl/openssl.cnf
    #  RHEL and CentOS: /etc/pki/tls/openssl.cnf
    #  Mac OSX: /System/Library/OpenSSL/openssl.cnf

    openssl req -new -sha256 -key domain.key -subj "/" \
      -reqexts SAN -config &lt;(cat /etc/ssl/openssl.cnf \
      &lt;(printf "\n[SAN]\nsubjectAltName=DNS:foo.com,DNS:www.foo.com"))
    </pre>
                    </li>
                    <li>
                        Copy and paste the CSR into the box below.<br/>
                    </li>
                </ol>
            </div>
            <label for="csr">Certificate Signing Request:</label><br/>
            <textarea id="csr" placeholder="-----BEGIN CERTIFICATE REQUEST----- ..."></textarea>
        </div>

        <div class="field">
            <input id="validate_csr_submit" type="submit" value="Validate CSR" disabled/>
            <span id="validate_csr_status" style="display:none;"></span>
        </div>
    </form>

    <hr/>

    <!--#############################-->
    <!--##  Step 3: Sign Requests  ##-->
    <!--#############################-->
    <h2>Step 3: Sign API Requests<span id="step3_pending"> (waiting...)</span></h2>
    <div id="step3" style="display:none;">
        <div>
            Let's Encrypt requires that you sign all of your requests to them with your
            account private key. Below are the requests that you will need to sign. The
            commands to do this are generated below so you can copy-and-paste them into your
            terminal. <i>Be sure to change the account private key location so it points to
            your real private key.</i>
        </div>

        <!-- Account Registration and Accept Terms -->
        <form id="validate_registration">
            <div class="field">
                <label for="howto_registration" class="help">(how do I do this?)</label>
                <input id="howto_registration" type="checkbox" class="help-checkbox"/>
                <div class="help-content">
                    This command asks to register your account key (or look it up if
                    you have already registered) and accepts the
                    <a id="howto_tos" href="#" target="_blank" rel="noopener noreferrer">terms and conditions</a>
                    for Let's Encrypt.<br/>
                    <br/>
                    How to generate this signature:<br/>
                    <ol>
                        <li>
                            Copy and paste the command below into your terminal (if your
                            account private key isn't at "./account.key", change "./account.key"
                            in the command to wherever it exists).
                        </li>
                        <li>
                            Copy and paste the hex encoded signature output from the command
                            into the text field below that command.
                        </li>
                    </ol>
                </div>
                <label>
                    Accept the Let's Encrypt
                    <a id="tos" href="#" target="_blank" rel="noopener noreferrer">terms and conditions</a>:
                </label><br/>
                <input id="registration_sig_cmd" type="text" value="echo ..." readonly/><br/>
                <input id="registration_sig" type="text" placeholder='Paste the hex output here (e.g. "(stdin)= f2cf67e4...")'/><br/>
            </div>
            <div class="field">
                <input id="validate_registration_sig" type="submit" value="Accept Terms"/>
                <span id="validate_registration_sig_status"></span>
            </div>
        </form>

        <!-- Account Update Contact Email -->
        <form id="validate_update">
            <div class="field">
                <label for="howto_update" class="help">(how do I do this?)</label>
                <input id="howto_update" type="checkbox" class="help-checkbox"/>
                <div class="help-content">
                    This command sets your account contact email to what you put
                    in Step 1. If you had already set this email when you ran these
                    commands previously, this command will simply set the same email
                    again.<br/>
                    <br/>
                    How to generate this signature:<br/>
                    <ol>
                        <li>
                            Copy and paste the command below into your terminal (if your
                            account private key isn't at "./account.key", change "./account.key"
                            in the command to wherever it exists).
                        </li>
                        <li>
                            Copy and paste the hex encoded signature output from the command
                            into the text field below that command.
                        </li>
                    </ol>
                </div>
                <label>Update your account email (<span id="account_email">foo@foo.com</span>):</label><br/>
                <input id="update_sig_cmd" type="text" value="waiting until terms are accepted..." disabled/><br/>
                <input id="update_sig" type="text" placeholder="waiting until terms are accepted..." disabled/><br/>
            </div>
            <div class="field">
                <input id="validate_update_sig" type="submit" value="Update Account" disabled/>
                <span id="validate_update_sig_status"></span>
            </div>
        </form>

        <!-- New Order Creation -->
        <form id="validate_order">
            <div class="field">
                <label for="howto_order" class="help">(how do I do this?)</label>
                <input id="howto_order" type="checkbox" class="help-checkbox"/>
                <div class="help-content">
                    This command creates an order for the domains you included in
                    your certificate signing request (CSR) in Step 2.<br/>
                    <br/>
                    How to generate this signature:<br/>
                    <ol>
                        <li>
                            Copy and paste the command below into your terminal (if your
                            account private key isn't at "./account.key", change "./account.key"
                            in the command to wherever it exists).
                        </li>
                        <li>
                            Copy and paste the hex encoded signature output from the command
                            into the text field below that command.
                        </li>
                    </ol>
                </div>
                <label>Create your certificate order:</label><br/>
                <input id="order_sig_cmd" type="text" value="waiting until account contact is updated..." disabled/><br/>
                <input id="order_sig" type="text" placeholder="waiting until account contact is updated..." disabled/><br/>
            </div>
            <div class="field">
                <input id="validate_order_sig" type="submit" value="Create Order" disabled/>
                <span id="validate_order_sig_status"></span>
            </div>
        </form>

    </div>

    <hr/>

    <!--##########################-->
    <!--##  Step 4: Challenges  ##-->
    <!--##########################-->
    <h2>Step 4: Verify Ownership<span id="step4_pending"> (waiting...)</span></h2>
    <div id="step4" style="display:none;">
        <div>
            Let's Encrypt requires you prove you own the domains you have in your CSR. You
            can do this by serving a specific file at a specific url under your domains.
            Below are the files you need to serve along with some copy-and-paste commands
            you can run on your website to start serving the file. Once you are serving
            the file on your website, click "I'm now running this on...". After that, you
            need to tell Let's Encrypt to check the above files to verify ownership of your
            domains. This request needs to be signed with your account private key. Below
            are the verification requests that you will need to sign. The commands to do
            this are generated below so you can copy-and-paste them into your terminal.
            <i>Be sure to change the account private key location so it points to your real
            private key.</i>
        </div>

        <div id="auths">
        </div>

        <div id="auth_template" style="display:none;">

            <!-- GET-as-POST Authorization -->
            <form class="auth_form">
                <div class="field">
                    <label class="howto_auth_sig_label help">(how do I do this?)</label>
                    <input type="checkbox" class="howto_auth_sig help-checkbox"/>
                    <div class="help-content">
                        This command requests the challenges you need to complete in order
                        to make sure you control a domain in your certificate order.<br/>
                        <br/>
                        How to generate this signature:<br/>
                        <ol>
                            <li>
                                Copy and paste the command below into your terminal (if your
                                account private key isn't at "./account.key", change "./account.key"
                                in the command to wherever it exists).
                            </li>
                            <li>
                                Copy and paste the hex encoded signature output from the command
                                into the text field below that command.
                            </li>
                        </ol>
                    </div>
                    <label>Load set of challenges (<span class="auth_i"></span>/<span class="auth_count"></span>):</label><br/>
                    <input class="auth_sig_cmd" type="text" value="waiting until previous challenges are complete..." disabled/><br/>
                    <input class="auth_sig" type="text" placeholder="waiting until previous challenges are complete..." disabled/><br/>
                </div>
                <div class="field">
                    <input class="validate_auth_sig" type="submit" value="Load Challenges" disabled/>
                    <span class="validate_auth_sig_status"></span>
                </div>
            </form>

            <!-- Authorization challenges -->
            <div class="challenges-wrapper">
                <div class="challenges-status">
                    <i>Challenges: not loaded yet</i>
                </div>
                <div class="challenges" style="display:none;">
                    <div class="challenges-domain">
                        <i>Challenges for:</i>
                        <b class="domain">foobar.com</b>
                    </div>
                    <div class="field tabs">
                        <input type="radio" class="challenge_python" checked/>
                        <label class="challenge_python">Option 1 - python server</label>

                        <input type="radio" class="challenge_file">
                        <label class="challenge_file">Option 2 - file-based</label>

                        <input type="radio" class="challenge_dns">
                        <label class="challenge_dns">Option 3 - DNS record</label>

                        <br/>

                        <!-- Option 1: python server method -->
                        <div class="tab challenge_python">
                            <label class="howto_python_label help">(how do I do this?)</label>
                            <input class="howto_python help-checkbox" type="checkbox"/>
                            <div class="help-content">
                                How to serve the challenge response on your domain:<br/>
                                <ol>
                                    <li>
                                        SSH into your domain as someone with sudo permissions:<br/>
                                        <code class="ssh">ssh ubuntu@foobar.com</code>
                                    </li>
                                    <li>
                                        Stop any webserver running on port 80, if any. If you had previously
                                        been running another python command, you can kill it with Ctrl+C):<br/>
                                        <code>sudo service nginx stop</code> &lt;-- example for nginx<br/>
                                        <code>sudo apachectl -k graceful-stop</code> &lt;-- example for apache
                                    </li>
                                    <li>
                                        Copy and paste the python command below into your terminal. This
                                        command starts a temporary webserver that serves nothing but the
                                        challenge response. You only need to keep this running briefly.
                                    </li>
                                    <li>
                                        Open the link in a new window to make sure it's working:<br/>
                                        <a class="python_link" href="#" target="_blank" rel="noopener noreferrer">http://foo.com/.well-known/acme-challenge/aaaaaaaaaaa</a>
                                    </li>
                                    <li>
                                        Click "I'm now running this command..." button when the file is being
                                        served on your domain.
                                    </li>
                                </ol>
                            </div>

                            <label>Run this command on <span class="python_domain">foobar.com</span>'s server:</label><br/>
                            <textarea class="python_server" readonly></textarea>
                            <form class="confirm_python">
                                <div>
                                    <input type="submit" class="confirm_python_submit" value="I'm now running this command on foobar.com"/>
                                    <span class="confirm_python_status"></span>
                                </div>
                            </form>

                            <!-- Submit challenge -->
                            <form class="validate_python_sig">
                                <div class="field">
                                    <label class="howto_python_sig_label help">(how do I do this?)</label>
                                    <input type="checkbox" class="howto_python_sig help-checkbox"/>
                                    <div class="help-content">
                                        This step tells Let's Encrypt that you're serving
                                        the correct data for this challenge on your server.
                                        When Let's Encrypt receives this submission, they
                                        will make a request to your server to verify you are
                                        serving the data correctly.<br/>
                                        <br/>
                                        How to generate this signature:<br/>
                                        <ol>
                                            <li>
                                                Copy and paste the command below into your terminal (if your
                                                account private key isn't at "./account.key", change "./account.key"
                                                in the command to wherever it exists).
                                            </li>
                                            <li>
                                                Copy and paste the hex encoded signature output from the command
                                                into the text field below that command.
                                            </li>
                                        </ol>
                                    </div>
                                    <label>Sign challenge command:</label><br/>
                                    <input type="text" class="python_sig_cmd" value="waiting until you confirm the above command is running..." disabled/><br/>
                                    <input type="text" class="python_sig" placeholder="waiting until you confirm the above command is running..." disabled/><br/>
                                </div>
                                <div class="field">
                                    <input type="submit" class="validate_python_sig_submit" value="Submit challenge for foobar.com" disabled/>
                                    <span class="python_sig_status"></span>
                                </div>
                            </form>

                            <!-- Check authorization status -->
                            <form class="validate_recheck_auth_python_sig">
                                <div class="field">
                                    <label class="howto_recheck_auth_python_sig_label help">(how do I do this?)</label>
                                    <input type="checkbox" class="howto_recheck_auth_python_sig help-checkbox"/>
                                    <div class="help-content">
                                        This step checks to see if Let's Encrypt has marked the
                                        challenge for this domain as complete.<br/>
                                        <br/>
                                        How to generate this signature:<br/>
                                        <ol>
                                            <li>
                                                Copy and paste the command below into your terminal (if your
                                                account private key isn't at "./account.key", change "./account.key"
                                                in the command to wherever it exists).
                                            </li>
                                            <li>
                                                Copy and paste the hex encoded signature output from the command
                                                into the text field below that command.
                                            </li>
                                        </ol>
                                    </div>
                                    <label>Check challenge status command:</label><br/>
                                    <input type="text" class="recheck_auth_python_sig_cmd" value="waiting until you submit the challenge above..." disabled/><br/>
                                    <input type="text" class="recheck_auth_python_sig" placeholder="waiting until you submit the challenge above..." disabled/><br/>
                                </div>
                                <div class="field">
                                    <input type="submit" class="validate_recheck_auth_python_sig_submit" value="Check challenge status" disabled/>
                                    <span class="validate_recheck_auth_python_sig_status"></span>
                                </div>
                            </form>

                        </div>

                        <!-- Option 2: file-based method -->
                        <div class="tab challenge_file">
                            <label class="howto_file_label help">(how do I do this?)</label>
                            <input class="howto_file help-checkbox" type="checkbox"/>
                            <div class="help-content">
                                How to host this file on your server:<br/>
                                <ol>
                                    <li>
                                        SSH into your domain as someone with write access to
                                        your static web directory:<br/>
                                        <pre class="ssh">ssh ubuntu@foobar.com</pre>
                                    </li>
                                    <li>
                                        Create the ".well-known/acme-challenge/" directory
                                        in your webserver's static file path:<br/>
                                        <pre class="wwwdir">mkdir -p /path/to/www/.well-known/acme-challenge/</pre>
                                    </li>
                                    <li>
                                        Add the static folder to your webserver's config
                                        (if you haven't already):<br/>
                                        <pre class="file_config">server {...</pre>
                                    </li>
                                    <li>
                                        Create the file with the necessary contents:<br/>
                                        <pre class="file_echo">echo ...</pre>
                                    </li>
                                    <li>
                                        Open the link in a new window to make sure it's working:<br/>
                                        <a class="file_link" href="#" target="_blank" rel="noopener noreferrer">http://foo.com/.well-known/acme-challenge/aaaaaaaaaaa</a>
                                    </li>
                                    <li>
                                        Click "I'm now serving this file..." button when the file is being
                                        served on your domain.
                                    </li>
                                </ol>
                            </div>
                            <label>Under this url:</label><br/>
                            <input type="text" class="file_url" value="" readonly/>
                            <div>
                                <label>Serve this content:</label>
                                <input type="text" class="file_data" value="" readonly/>
                            </div>
                            <form class="confirm_file">
                                <div>
                                    <input type="submit" class="confirm_file_submit" value="I'm now serving this file on foobar.com"/>
                                    <span class="confirm_file_status"></span>
                                </div>
                            </form>

                            <!-- Submit challenge -->
                            <form class="validate_file_sig">
                                <div class="field">
                                    <label class="howto_file_sig_label help">(how do I do this?)</label>
                                    <input type="checkbox" class="howto_file_sig help-checkbox"/>
                                    <div class="help-content">
                                        This step tells Let's Encrypt that you're serving
                                        the correct data for this challenge on your server.
                                        When Let's Encrypt receives this submission, they
                                        will make a request to your server to verify you are
                                        serving the data correctly.<br/>
                                        <br/>
                                        How to generate this signature:<br/>
                                        <ol>
                                            <li>
                                                Copy and paste the command below into your terminal (if your
                                                account private key isn't at "./account.key", change "./account.key"
                                                in the command to wherever it exists).
                                            </li>
                                            <li>
                                                Copy and paste the hex encoded signature output from the command
                                                into the text field below that command.
                                            </li>
                                        </ol>
                                    </div>
                                    <label>Sign challenge command:</label><br/>
                                    <input type="text" class="file_sig_cmd" value="waiting until you confirm the file is being served..." disabled/><br/>
                                    <input type="text" class="file_sig" placeholder="waiting until you confirm the file is being served..." disabled/><br/>
                                </div>
                                <div class="field">
                                    <input type="submit" class="validate_file_sig_submit" value="Submit challenge for foobar.com" disabled/>
                                    <span class="file_sig_status"></span>
                                </div>
                            </form>

                            <!-- Check authorization status -->
                            <form class="validate_recheck_auth_file_sig">
                                <div class="field">
                                    <label class="howto_recheck_auth_file_sig_label help">(how do I do this?)</label>
                                    <input type="checkbox" class="howto_recheck_auth_file_sig help-checkbox"/>
                                    <div class="help-content">
                                        This step checks to see if Let's Encrypt has marked the
                                        challenge for this domain as complete.<br/>
                                        <br/>
                                        How to generate this signature:<br/>
                                        <ol>
                                            <li>
                                                Copy and paste the command below into your terminal (if your
                                                account private key isn't at "./account.key", change "./account.key"
                                                in the command to wherever it exists).
                                            </li>
                                            <li>
                                                Copy and paste the hex encoded signature output from the command
                                                into the text field below that command.
                                            </li>
                                        </ol>
                                    </div>
                                    <label>Check challenge status command:</label><br/>
                                    <input type="text" class="recheck_auth_file_sig_cmd" value="waiting until you submit the challenge above..." disabled/><br/>
                                    <input type="text" class="recheck_auth_file_sig" placeholder="waiting until you submit the challenge above..." disabled/><br/>
                                </div>
                                <div class="field">
                                    <input type="submit" class="validate_recheck_auth_file_sig_submit" value="Check challenge status" disabled/>
                                    <span class="validate_recheck_auth_file_sig_status"></span>
                                </div>
                            </form>

                        </div>

                        <!-- Option 3: DNS TXT record -->
                        <div class="tab challenge_dns">
                            <label class="howto_dns_label help">(how do I do this?)</label>
                            <input class="howto_dns help-checkbox" type="checkbox"/>
                            <div class="help-content">
                                How to set this DNS record:<br/>
                                <ol>
                                    <li>
                                        Log into your domain name provider.
                                    </li>
                                    <li>
                                        Create a new DNS record on <span class="dns_domain">foo.com</span>:<br/>
                                        Type:<br/>
                                        <pre>TXT</pre>
                                        Name/Host/Alias:<br/>
                                        <pre>_acme-challenge</pre>
                                        Value/Answer/Destination:<br/>
                                        <pre class="dns_value">aaaaaaaaaaaaaaaaaaaaaa</pre>
                                        Time to Live (TTL):<br/>
                                        <pre>900</pre>
                                    </li>
                                    <li>
                                        Wait until the TXT record is being served (this can take a while).<br/>
                                        <pre class="dns_dig">dig +short @ns.yournameserver.com _acme_challenge.foo.com TXT</pre>
                                    </li>
                                    <li>
                                        Click "I can see the TXT record..." button when you can
                                        see that new TXT record has propagated.
                                    </li>
                                </ol>
                            </div>
                            <label>Under this DNS domain:</label><br/>
                            <input type="text" class="dns_subdomain" value="" readonly/>
                            <div>
                                <label>Set this TXT record:</label>
                                <input type="text" class="dns_data" value="" readonly/>
                            </div>
                            <form class="confirm_dns">
                                <div>
                                    <input type="submit" class="confirm_dns_submit" value="I can see the TXT record for foobar.com"/>
                                    <span class="confirm_dns_status"></span>
                                </div>
                            </form>

                            <!-- Submit challenge -->
                            <form class="validate_dns_sig">
                                <div class="field">
                                    <label class="howto_dns_sig_label help">(how do I do this?)</label>
                                    <input type="checkbox" class="howto_dns_sig help-checkbox"/>
                                    <div class="help-content">
                                        This step tells Let's Encrypt that you're serving
                                        the correct data for this challenge on your server.
                                        When Let's Encrypt receives this submission, they
                                        will make a request to your server to verify you are
                                        serving the data correctly.<br/>
                                        <br/>
                                        How to generate this signature:<br/>
                                        <ol>
                                            <li>
                                                Copy and paste the command below into your terminal (if your
                                                account private key isn't at "./account.key", change "./account.key"
                                                in the command to wherever it exists).
                                            </li>
                                            <li>
                                                Copy and paste the hex encoded signature output from the command
                                                into the text field below that command.
                                            </li>
                                        </ol>
                                    </div>
                                    <label>Sign challenge command:</label><br/>
                                    <input type="text" class="dns_sig_cmd" value="waiting until you confirm the TXT record is visible..." disabled/><br/>
                                    <input type="text" class="dns_sig" placeholder="waiting until you confirm the TXT record is visible..." disabled/><br/>
                                </div>
                                <div class="field">
                                    <input type="submit" class="validate_dns_sig_submit" value="Submit challenge for foobar.com" disabled/>
                                    <span class="dns_sig_status"></span>
                                </div>
                            </form>

                            <!-- Check authorization status -->
                            <form class="validate_recheck_auth_dns_sig">
                                <div class="field">
                                    <label class="howto_recheck_auth_dns_sig_label help">(how do I do this?)</label>
                                    <input type="checkbox" class="howto_recheck_auth_dns_sig help-checkbox"/>
                                    <div class="help-content">
                                        This step checks to see if Let's Encrypt has marked the
                                        challenge for this domain as complete.<br/>
                                        <br/>
                                        How to generate this signature:<br/>
                                        <ol>
                                            <li>
                                                Copy and paste the command below into your terminal (if your
                                                account private key isn't at "./account.key", change "./account.key"
                                                in the command to wherever it exists).
                                            </li>
                                            <li>
                                                Copy and paste the hex encoded signature output from the command
                                                into the text field below that command.
                                            </li>
                                        </ol>
                                    </div>
                                    <label>Check challenge status command:</label><br/>
                                    <input type="text" class="recheck_auth_dns_sig_cmd" value="waiting until you submit the challenge above..." disabled/><br/>
                                    <input type="text" class="recheck_auth_dns_sig" placeholder="waiting until you submit the challenge above..." disabled/><br/>
                                </div>
                                <div class="field">
                                    <input type="submit" class="validate_recheck_auth_dns_sig_submit" value="Check challenge status" disabled/>
                                    <span class="validate_recheck_auth_dns_sig_status"></span>
                                </div>
                            </form>

                        </div>

                    </div>
                </div>
            </div>

        </div>

        <!-- Finalize Order -->
        <form id="validate_finalize">
            <div class="field">
                <label for="howto_finalize" class="help">(how do I do this?)</label>
                <input id="howto_finalize" type="checkbox" class="help-checkbox"/>
                <div class="help-content">
                    This command finalizes your order and tells Let's Encrypt to
                    generate your new certificate.<br/>
                    <br/>
                    How to generate this signature:<br/>
                    <ol>
                        <li>
                            Copy and paste the command below into your terminal (if your
                            account private key isn't at "./account.key", change "./account.key"
                            in the command to wherever it exists).
                        </li>
                        <li>
                            Copy and paste the hex encoded signature output from the command
                            into the text field below that command.
                        </li>
                    </ol>
                </div>
                <label>Finalize order and generate certificate:</label><br/>
                <input id="finalize_sig_cmd" type="text" value="waiting until challenges are done..." disabled/><br/>
                <input id="finalize_sig" type="text" placeholder="waiting until challenges are done..." disabled/><br/>
            </div>
            <div class="field">
                <input id="validate_finalize_sig" type="submit" value="Finalize Order" disabled/>
                <span id="validate_finalize_sig_status"></span>
            </div>
        </form>

        <!-- Re-Check Order -->
        <form id="validate_recheck_order">
            <div class="field">
                <label for="howto_recheck_order" class="help">(how do I do this?)</label>
                <input id="howto_recheck_order" type="checkbox" class="help-checkbox"/>
                <div class="help-content">
                    This command checks the certificate status of
                    your order to see if it's been generated yet.<br/>
                    <br/>
                    How to generate this signature:<br/>
                    <ol>
                        <li>
                            Copy and paste the command below into your terminal (if your
                            account private key isn't at "./account.key", change "./account.key"
                            in the command to wherever it exists).
                        </li>
                        <li>
                            Copy and paste the hex encoded signature output from the command
                            into the text field below that command.
                        </li>
                    </ol>
                </div>
                <label>Check certificate generation status:</label><br/>
                <input id="recheck_order_sig_cmd" type="text" value="waiting until challenges are done..." disabled/><br/>
                <input id="recheck_order_sig" type="text" placeholder="waiting until challenges are done..." disabled/><br/>
            </div>
            <div class="field">
                <input id="validate_recheck_order_sig" type="submit" value="Check Certificate Status" disabled/>
                <span id="validate_recheck_order_sig_status"></span>
            </div>
        </form>

        <!-- Get Certificate -->
        <form id="validate_cert">
            <div class="field">
                <label for="howto_cert" class="help">(how do I do this?)</label>
                <input id="howto_cert" type="checkbox" class="help-checkbox"/>
                <div class="help-content">
                    This command downloads the final generated certificate.<br/>
                    <br/>
                    How to generate this signature:<br/>
                    <ol>
                        <li>
                            Copy and paste the command below into your terminal (if your
                            account private key isn't at "./account.key", change "./account.key"
                            in the command to wherever it exists).
                        </li>
                        <li>
                            Copy and paste the hex encoded signature output from the command
                            into the text field below that command.
                        </li>
                    </ol>
                </div>
                <label>Retrieve the generated certificate:</label><br/>
                <input id="cert_sig_cmd" type="text" value="waiting until challenges are done..." disabled/><br/>
                <input id="cert_sig" type="text" placeholder="waiting until challenges are done..." disabled/><br/>
            </div>
            <div class="field">
                <input id="validate_cert_sig" type="submit" value="Retrieve Certificate" disabled/>
                <span id="validate_cert_sig_status"></span>
            </div>
        </form>

    </div>

    <hr/>

    <!--#################################-->
    <!--##  Step 5: Issue Certificate  ##-->
    <!--#################################-->
    <h2>Step 5: Install Certificate (<span id="step5_pending">waiting...</span>)</h2>
    <div id="step5" style="display:none;">
        <div>
            Congratulations! Let's Encrypt has issued you a certificate for your domains!
            Below is the signed certificate you can use for your website.
        </div>

        <div class="field">
            <label for="howto_install" class="help">(how do I install this?)</label>
            <input id="howto_install" type="checkbox" class="help-checkbox"/>
            <div class="help-content">
                Nginx installation instructions:<br/>
                <ol>
                    <li>
                        Copy and paste the below certificates (the text contains
                        both your domain certificate and intermediate certificate)
                        into a text file called "chained.pem".
                    </li>
                    <li>
                        If not done already, generate non-default dhparams.<br/>
                        <code>openssl dhparam -out dhparam.pem 4096</code>
                    </li>
                    <li>
                        Copy "chained.pem" and "dhparam.pem" to /etc/ssl/certs/.<br/>
                        <pre>
scp chained.pem root@foo.com:/etc/ssl/certs/chained.pem
scp dhparam.pem root@foo.com:/etc/ssl/certs/dhparam.pem
</pre>
                    </li>
                    <li>
                        Copy "domain.key" /etc/ssl/private/.<br/>
                        <code>scp domain.key root@foo.com:/etc/ssl/private/domain.key</code><br/>
                    </li>
                    <li>
                        Update your webserver config to use https (examples below).<br/>
<pre>
server {
    listen 443;
    server_name foo.com;
    ssl on;
    ssl_certificate /etc/ssl/certs/chained.pem;
    ssl_certificate_key /etc/ssl/private/domain.key;
    ssl_session_timeout 5m;
    ssl_protocols TLSv1.2;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
    ssl_session_cache shared:SSL:50m;
    ssl_dhparam /etc/ssl/certs/dhparam.pem;
    ssl_prefer_server_ciphers on;

    location / {
        return 200 'Hello world!';
        add_header Content-Type text/plain;
    }
}
</pre>
                    </li>
                </ol>
                Apache installation instructions:<br/>
                <ol>
                    <li>
                        Copy and paste the first certificate section (e.g. the first
                        "-----BEGIN CERTIFICATE-----" section) into a text file
                        named "domain.crt".
                    </li>
                    <li>
                        Copy and paste the second certificate section (e.g. the second
                        "-----BEGIN CERTIFICATE-----" section) into a text file
                        named "intermediate.pem".
                    </li>
                    <li>
                        Copy "domain.crt" and "intermediate.pem" to /etc/ssl/certs/.<br/>
                        <pre>
scp domain.crt root@foo.com:/etc/ssl/certs/domain.crt
scp intermediate.pem root@foo.com:/etc/ssl/certs/intermediate.pem
</pre>
                    </li>
                    <li>
                        Copy "domain.key" /etc/ssl/private/.<br/>
                        <code>scp domain.key root@foo.com:/etc/ssl/private/domain.key</code><br/>
                    </li>
                    <li>
                        Update your webserver config to use https (examples below).<br/>
<pre>
&lt;VirtualHost _default_:443&gt;
        ServerName foo.com:443
        ServerAlias www.foo.com
        DocumentRoot /var/www/foo.com/html
        SSLEngine on
        SSLCertificateFile    /etc/ssl/certs/domain.crt
        SSLCertificateKeyFile /etc/ssl/private/domain.key
        SSLCertificateChainFile /etc/ssl/certs/intermediate.pem
        SSLProtocol TLSv1.2
        SSLCipherSuite ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384
        SSLHonorCipherOrder on
        &lt;Directory /var/www/foo.com/html&gt;
                Options Indexes FollowSymLinks MultiViews
                AllowOverride All
                Order allow,deny
                allow from all
        &lt;/Directory&gt;
&lt;/VirtualHost&gt;
</pre>
                    </li>
                </ol>
            </div>
            <label for="crt">Signed Certificate Chain:</label><br/>
            <textarea id="crt" readonly></textarea>
        </div>

        <div class="field">
            <form action="https://www.ssllabs.com/ssltest/analyze.html" target="_blank" rel="noopener noreferrer">
                <input id="ssltest_domain" type="hidden" name="d" value="example.com">
                <input type="submit" value="Test my install"/> (opens SSL Labs in new window)
            </form>
        </div>
    </div>

    <hr/>

    <div class="footer">
        This website is static, so it can be saved and loaded locally. Just right-click and "Save Page As.."!<br/>
        Released under MIT license |
        Source code: <a href="https://github.com/diafygi/gethttpsforfree" target="_blank" rel="noopener noreferrer">https://github.com/diafygi/gethttpsforfree</a>
    </div>
    <script src="js/index.js"></script>
</body>
</html>
