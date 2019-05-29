# cerealmafia

Tabassum Fabiha (PM), Imad Belkebir, Rachel Ng, Mai Rachlevsky

## Description

Catatonic Cereal is a digitized version of the popular card game, Unstable Unicorns. Users of the site will be able to play the base game of Unstable Unicorns against an AI. They will also be able to obtain their win/loss streak on their user profile and be able to compete on the leaderboards. 

## Launch Codes

### Install and Run on Localhost

1. Clone this repository into your folder of choice
    ```
    $ git clone git@github.com:tfabiha/cerealmafia.git ccereal // using SSH
    ```
    or
    ```
    $ git clone https://github.com/tfabiha/cerealmafia.git ccereal // using HTTPS
    ```
2. Move to the root directory of this repository in terminal
    ```
    $ cd ccereal
    ```
3. Activate your virtual environment
    ```
    $ python3 -m venv venv
    $ . path/to/venv/bin/activate
    ```
4. Upgrade pip and install the dependencies using `requirements.txt`
    ```
    (venv) $ pip install --upgrade pip
    (venv) $ pip install -r requirements.txt
    ```
5. Run the python file (starting the Flask server)
    ```
    (venv) $ python app.py
    ```
6. Open one of the following in your browser
    ```
    http://127.0.0.1:5000/
    http://localhost:5000/
    ```

### Install and Run on Apache2 Server

1. SSH into your droplet
    ```
    $ ssh <username>@<ip address>
    ```
2. Gain superuser access
    ```
    $ sudo su
    ```
3. Move to the following directory
    ```
    $ cd /var/www/
    ```
4. Create and move into a new directory ```ccereal```
    ```
    $ mkdir ccereal
    $ cd ccereal
    ```
5. Clone this repository
    ```
    $ git clone git@github.com:tfabiha/cerealmafia.git ccereal // using SSH
    ```
    or
    ```
    $ git clone https://github.com/tfabiha/cerealmafia.git ccereal // using HTTPS
    ```
6. Add write permissions to ccereal
    ```
    chgrp -R www-data ccereal
    chmod -R g+w ccereal
    ```
7. Change Server Name in ```./ccereal/doc/apachesaurus-rex/ccereal.conf``` to your IP address.
8. Move the ```.conf and .wsgi files in ./ccereal/doc/apachesaurus-rex``` to their appropriate locations
    ```
    $ mv ./ccereal/doc/apachesaurus-rex/ccereal.conf /etc/apache2/sites-enabled/
    $ mv ./ccereal/doc/apachesaurus-rex/ccereal.wsgi ./
    ```
9. Enable and reload the site
    ```
    $ a2ensite ccereal
    $ service apache2 reload
    ```
10. Open the following on your browser
    ```
    <ip address>
    ```
