from django.db import models

# Create your models here.

class TalkingMailboxUser(models.Model):
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    username = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.email