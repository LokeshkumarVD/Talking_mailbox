from django.db import models
from django.contrib.auth.models import User
from django.conf import settings

# Create your models here.


class TalkingMailboxUser(models.Model):
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    username = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.email

class Email(models.Model):
    owner = models.ForeignKey(
        TalkingMailboxUser,
        on_delete=models.CASCADE,
        related_name='emails'  # This avoids the reverse conflict with the 'email' field
    )
    to = models.EmailField()
    subject = models.CharField(max_length=255)
    message = models.TextField()
    sent_at = models.DateTimeField(auto_now_add=True)
    folder = models.CharField(max_length=20, default='sent')  # sent/inbox/etc.

    def __str__(self):
        return f"{self.subject} to {self.to} ({self.owner.username})"
