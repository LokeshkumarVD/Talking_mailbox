from django.shortcuts import render
from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.hashers import make_password  # For password hashing
from .models import TalkingMailboxUser

# Create your views here.

#view for Landing Page
def landing_page(request):
    return render(request, 'landing_page.html')

#view for Signup page
def signup(request):
    # your signup logic here
    return render(request, 'signup.html')

#view for process_signup page
def process_signup(request):
    # Just a temporary dummy view to fix the error
    if request.method == 'POST':
        # Get data from voice input (sent via AJAX/fetch)
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')
        
        # Create and save user (with hashed password)
        try:
            user = TalkingMailboxUser.objects.create(
                username=username,
                email=email,
                password=make_password(password),  # Hash the password
            )
            return redirect('dashboard')  # Redirect after successful signup
        except Exception as e:
            messages.error(request, f"Error: {e}")
            return redirect('signup')
    
    return redirect('signup')  # Fallback if not POST

# View for SignIn Page
def signin(request):
    if request.method == 'POST':
        # We'll later add voice-based login handling here
        return redirect('dashboard')  # After login, go to Inbox
    return render(request, 'signin.html')

# View for Compose Page
def compose_page(request):
    if request.method == 'POST':
        # We'll later add voice-based compose email handling here
        return redirect('inbox')  # After sending mail, go back to Inbox
    return render(request, 'compose.html')

# View for Inbox Page
def inbox_page(request):
    # In a real system, fetch emails from database
    return render(request, 'inbox.html')
