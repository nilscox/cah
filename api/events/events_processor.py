class EventProcessor:

    def process(self, event, *args, **kwargs):
        method = getattr(self, "on_" + event, None)

        if method:
            method(*args, **kwargs)
