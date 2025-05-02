import json
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
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

@csrf_exempt  # Optional: Only needed for JSON requests without CSRF token
#view for Signup page
def signup(request):
    # your signup logic here
    if request.method == "POST":
        if request.content_type == 'application/json':
            try:
                data = json.loads(request.body)
                name = data.get('name')
                email = data.get('email')
                password = data.get('password')

                if name and email and password:
                    hashed_password = make_password(password)
                    user = TalkingMailboxUser(name=name, email=email, password=hashed_password)
                    user.save()
                    return JsonResponse({"status": "success"}, status=200)
                else:
                    return JsonResponse({"error": "Missing fields"}, status=400)
            except Exception as e:
                return JsonResponse({"error": str(e)}, status=500)
        else:
            # Handle regular HTML form post if needed
            name = request.POST.get('name')
            email = request.POST.get('email')
            password = request.POST.get('password')
            # (You can validate and save here too)
            return render(request, 'signup.html', {"message": "Form submission handled."})

    return render(request, 'signup.html')

#view for process_signup page
def process_signup(request):
    # Just a temporary dummy view to fix the error
    if request.method == 'POST' and request.content_type == 'application/json':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            email = data.get('email')
            password = data.get('password')

            if username and email and password:
                # Hash the password
                hashed_password = make_password(password)
                user = TalkingMailboxUser.objects.create(
                    username=username,
                    email=email,
                    password=hashed_password
                )
                return JsonResponse({"status": "success"}, status=200)
            else:
                return JsonResponse({"error": "Missing fields"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
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

# View for Dashboard Page
def dashboard_page(request):
    return render(request, 'dashboard.html')