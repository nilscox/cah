#!/usr/bin/env python
import os
import sys

if __name__ == "__main__":
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "cah.settings")
    try:
        from django.core.management import execute_from_command_line
    except ImportError:
        # The above import may fail for some other reason. Ensure that the
        # issue is really that Django is missing to avoid masking other
        # exceptions on Python 2.
        try:
            import django
        except ImportError:
            raise ImportError(
                "Couldn't import Django. Are you sure it's installed and "
                "available on your PYTHONPATH environment variable? Did you "
                "forget to activate a virtual environment?"
            )
        raise

    from django.conf import settings

    print('=== CAH SETTINGS ===')
    print('DEBUG', settings.DEBUG)
    print('ALLOWED_HOSTS', settings.ALLOWED_HOSTS)
    print('CORS_ALLOW_CREDENTIALS', settings.CORS_ALLOW_CREDENTIALS)
    print('CORS_ORIGIN_ALLOW_ALL', settings.CORS_ORIGIN_ALLOW_ALL)
    print('CORS_ORIGIN_WHITELIST', settings.CORS_ORIGIN_WHITELIST)
    print('MEDIA_URL', settings.MEDIA_URL)
    print('MEDIA_ROOT', settings.MEDIA_ROOT)

    execute_from_command_line(sys.argv)
