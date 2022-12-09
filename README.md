Player With Rdio API
=======================
**⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️**

**⚠️⚠️⚠️⚠️⚠️⚠️ PROJECT ARCHIVE ⚠️⚠️⚠️⚠️⚠️⚠️**

**⚠️⚠️⚠️⚠️⚠️ NO LONGER MAINTAINED ⚠️⚠️⚠️⚠️**


**⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️**


Introduction
------------
Simple player using Rdio API and Zend Framework 2

Installation
------------
Go to project directory and use composer to install dependences
    php composer.phar install

Go to "/module/Application/config/module.config.php" and add your "key" and "secret" of Rdio API.

    'rdio' => array(
            'key' => '',
            'secret' => ''
    )


Remember of create a virtualhost or use this command in project directory to run(php 5.4 >).

    php -S 127.0.0.1:8888

Reference: https://www.rdio.com/developers/
    
