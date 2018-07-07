from .events import send, broadcast

from .player_events import PlayerEvents
from .admin_events import AdminEvents

player_events = PlayerEvents()
admin_events = AdminEvents()

def on_event(event, *args, **kwargs):
    player_events.process(event, *args, **kwargs)
    admin_events.process(event, *args, **kwargs)
