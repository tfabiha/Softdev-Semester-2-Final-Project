#!/usr/bin/python3
import sys
sys.path.insert(0,"/var/www/ccereal/")
sys.path.insert(0,"/var/www/ccereal/ccereal/")

import logging
logging.basicConfig(stream=sys.stderr)

from ccereal import app as application

