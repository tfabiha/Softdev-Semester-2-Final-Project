# cerealmafia

Tabassum Fabiha (PM), Imad Belkebir, Rachel Ng, Mai Rachlevsky

## Launch Codes

### Install and Run on Localhost

1. Clone this repository into your folder of choice
    ```
    $ git clone <ssh link> <repo name> // using SSH
    ```
    or
    ```
    $ git clone <https link> <repo name> // using HTTPS
    ```
2. Move to the root directory of this repository in terminal
    ```
    $ cd <repo name>
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
    $ mkdir <repo name>
    $ cd <repo name>
    ```
5. Clone this repository
    ```
    $ git clone <ssh link> <repo name> // using SSH
    ```
    or
    ```
    $ git clone <https link> <repo name> // using HTTPS
    ```
    
