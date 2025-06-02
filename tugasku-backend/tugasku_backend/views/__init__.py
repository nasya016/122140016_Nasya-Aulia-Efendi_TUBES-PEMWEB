def includeme(config):
    """Include all view configurations"""
    # Include view modules
    config.include('.auth')
    config.include('.tasks')
    config.include('.categories')
    config.include('.dashboard')
