import json
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth.hashers import make_password, check_password
from .models import TalkingMailboxUser, Email

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
@csrf_exempt
def signin(request):
    if request.method == 'POST':
        if request.content_type == 'application/json':
            try:
                data = json.loads(request.body)
                email = data.get('email')
                password = data.get('password')

                user = TalkingMailboxUser.objects.get(email=email)

                if check_password(password, user.password):
                    request.session['user_id'] = user.id
                    return JsonResponse({"status": "success", "redirect_url": "/dashboard/"})
                else:
                    return JsonResponse({"error": "Invalid password"}, status=400)
            except TalkingMailboxUser.DoesNotExist:
                return JsonResponse({"error": "User not found"}, status=404)
            except Exception as e:
                return JsonResponse({"error": str(e)}, status=500)
    return render(request, 'signin.html')


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
