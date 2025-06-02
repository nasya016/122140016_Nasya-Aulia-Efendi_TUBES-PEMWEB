import logging
import logging.config
from ..config import get_config

config = get_config()

def setup_logging():
    """Setup logging configuration"""
    logging_config = {
        'version': 1,
        'disable_existing_loggers': False,
        'formatters': {
            'default': {
                'format': '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            },
            'detailed': {
                'format': '%(asctime)s - %(name)s - %(levelname)s - %(module)s - %(funcName)s - %(message)s',
            },
        },
        'handlers': {
            'console': {
                'class': 'logging.StreamHandler',
                'level': config.LOG_LEVEL,
                'formatter': 'default',
                'stream': 'ext://sys.stdout',
            },
            'file': {
                'class': 'logging.FileHandler',
                'level': 'INFO',
                'formatter': 'detailed',
                'filename': 'tugasku.log',
                'mode': 'a',
            },
        },
        'loggers': {
            'tugasku_backend': {
                'level': config.LOG_LEVEL,
                'handlers': ['console', 'file'],
                'propagate': False,
            },
        },
        'root': {
            'level': config.LOG_LEVEL,
            'handlers': ['console'],
        },
    }
    
    logging.config.dictConfig(logging_config)
