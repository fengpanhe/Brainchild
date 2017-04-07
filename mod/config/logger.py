import logging
import sys
logging.basicConfig(stream=sys.stdout)
logger = logging.getLogger()
handler = logging.StreamHandler()
formatter = logging.Formatter(
        '%(asctime)s %(name)s %(levelname)s %(pathname)s  %(lineno)d %(funcName)s %(message)s')
handler.setFormatter(formatter)
logger.addHandler(handler)