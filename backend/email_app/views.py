from django.shortcuts import render
from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.decorators import login_required

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
    return render(request, 'signup_success.html')  # (make sure you have this template or adjust as needed)

# View for Login Page
def login_page(request):
    if request.method == 'POST':
        # We'll later add voice-based login handling here
        return redirect('inbox')  # After login, go to Inbox
    return render(request, 'login.html')

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
