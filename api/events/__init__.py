from .events import send, broadcast

processors = []

def get_processors():
    global processors

    if not processors:
        from .player_events import PlayerEvents
        from .admin_events import AdminEvents

        processors = [
            PlayerEvents(),
            AdminEvents(),
        ]

    return processors


def on_event(event, *args, **kwargs):
    for processor in get_processors():
        processor.process(event, *args, **kwargs)
