import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.core.cache import cache

class CodeAuthConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.ws_token = self.scope['url_route']['kwargs']['ws_token']
        has_key = await cache.aget(self.ws_token)
        if (has_key):
            await cache.aset(self.ws_token, self.channel_name, timeout=10)
            await self.accept()
            
    async def disconnect(self, _close_code):
        await cache.adelete_many([self.ws_token])
        
        
    async def send_token(self, event):
        token = event['token']
        payload = {
            'type': 'token',
            'message': token
        }
        await self.send(text_data=json.dumps(payload))
