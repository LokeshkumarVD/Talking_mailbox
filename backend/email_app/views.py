import json
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth.hashers import make_password, check_password
from .models import TalkingMailboxUser, Email
from django.contrib.auth import authenticate, login

# View for Landing Page
def landing_page(request):
    return render(request, 'landing_page.html')


# View for Signup
@csrf_exempt
def signup(request):
    if request.method == "POST":
        if request.content_type == 'application/json':
            try:
                data = json.loads(request.body)
                username = data.get('username')
                email = data.get('email')
                password = data.get('password')

                if username and email and password:
                    hashed_password = make_password(password)
                    user = TalkingMailboxUser(username=username, email=email, password=hashed_password)
                    user.save()
                    request.session['user_id'] = user.id
                    return JsonResponse({"status": "success", "redirect_url": "/dashboard/"}, status=200)
                else:
                    return JsonResponse({"error": "Missing fields"}, status=400)
            except Exception as e:
                return JsonResponse({"error": str(e)}, status=500)
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
                return JsonResponse({"status": "success","redirect_url": "/dashboard/"}, status=200)
            else:
                return JsonResponse({"error": "Missing fields"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    return redirect('signup')  # Fallback if not POST


# View for Signin
def signin(request):
    if request.method == "POST":
        email = request.POST['email']
        password = request.POST['password']
        user = authenticate(request, username=email, password=password)
        if user:
            login(request, user)
            return redirect('dashboard')
        else:
            return render(request, 'signin.html', {'error': 'Invalid credentials'})
    return render(request, 'signin.html')

#view for process_signin page
@csrf_exempt  # If you use @csrf_exempt, make sure CSRF is handled in AJAX (which your JS does)
def process_signin(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get('email', '').strip()
            password = data.get('password', '').strip()
        except Exception:
            return JsonResponse({'success': False, 'message': 'Invalid data.'})

        try:
            user_obj = TalkingMailboxUser.objects.get(email=email)
        except TalkingMailboxUser.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Invalid email or password.'})

        if check_password(password, user_obj.password):
            request.session['user_id'] = user_obj.id
            return JsonResponse({'success': True, 'redirect_url': '/dashboard/'})
        else:
            return JsonResponse({'success': False, 'message': 'Invalid email or password.'})
    return JsonResponse({'success': False, 'message': 'Invalid request.'})

# View for Dashboard
def dashboard_page(request):
    user_id = request.session.get('user_id')
    if not user_id:
        return redirect('signin')

    user = TalkingMailboxUser.objects.get(id=user_id)
    return render(request, 'dashboard.html', {'user_name': user.username})


# View for Compose
@csrf_exempt
def compose_page(request):
    user_id = request.session.get('user_id')
    if not user_id:
        return redirect('signin')

    user = TalkingMailboxUser.objects.get(id=user_id)

    if request.method == "POST" and request.content_type == 'application/json':
        try:
            data = json.loads(request.body)
            to = data.get('to')
            subject = data.get('subject')
            message = data.get('message')

            Email.objects.create(
                owner=user,
                to=to,
                subject=subject,
                message=message,
                folder='sent'
            )
            return JsonResponse({"success": True})
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)})
    return render(request, "compose.html")

#View for Sent mail
def sent_mail_page(request):
    user_id = request.session.get('user_id')
    if not user_id:
        return redirect('signin')
    user = TalkingMailboxUser.objects.get(id=user_id)
    sent_mails = Email.objects.filter(owner=user, folder='sent').order_by('-sent_at')
    return render(request, 'sent.html', {'sent_mails': sent_mails})


# View for Inbox
def inbox_page(request):
    user_id = request.session.get('user_id')
    if not user_id:
        return redirect('signin')

    user = TalkingMailboxUser.objects.get(id=user_id)
    emails = Email.objects.filter(to=user.email, folder='inbox').order_by('-sent_at')
    return render(request, 'inbox.html', {'emails': emails})


# View for Sent
def sent_page(request):
    user_id = request.session.get('user_id')
    if not user_id:
        return redirect('signin')

    user = TalkingMailboxUser.objects.get(id=user_id)
    emails = Email.objects.filter(owner=user, folder='sent').order_by('-sent_at')
    return render(request, 'sent.html', {'emails': emails})


# View for Starred
def star_page(request):
    user_id = request.session.get('user_id')
    if not user_id:
        return redirect('signin')

    user = TalkingMailboxUser.objects.get(id=user_id)
    emails = Email.objects.filter(owner=user, folder='starred').order_by('-sent_at')
    return render(request, 'starred.html', {'emails': emails})


# View for Trash
def trash_page(request):
    user_id = request.session.get('user_id')
    if not user_id:
        return redirect('signin')

    user = TalkingMailboxUser.objects.get(id=user_id)
    emails = Email.objects.filter(owner=user, folder='trash').order_by('-sent_at')
    return render(request, 'trash.html', {'emails': emails})


# View for Archive
def archive_page(request):
    user_id = request.session.get('user_id')
    if not user_id:
        return redirect('signin')

    user = TalkingMailboxUser.objects.get(id=user_id)
    emails = Email.objects.filter(owner=user, folder='archive').order_by('-sent_at')
    return render(request, 'archive.html', {'emails': emails})


# Logout View
def logout_view(request):
    request.session.flush()
    return redirect('signin')
