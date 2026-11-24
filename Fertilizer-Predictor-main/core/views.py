from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_protect
from .models import ContactMessage
from .ml_model import predict_fertilizer, get_ml_metrics, SOIL_TYPES, CROP_TYPES, CATEGORIZED_CROP_TYPES

def home_view(request):
    return render(request, 'core/home.html')

def about_view(request):
    return render(request, 'core/about.html')

def analysis_view(request):
    metrics = get_ml_metrics()
    context = {
        'accuracy_pct': f"{metrics['accuracy'] * 100:.1f}%",
        'accuracy': metrics['accuracy'],
        'accuracy_dash': metrics['accuracy'] * 100,
        'features': metrics['features'],
        'feature_importances': metrics['feature_importances'],
        'confusion_matrix': metrics['confusion_matrix'],
        'fertilizers': metrics['fertilizers']
    }
    return render(request, 'core/analysis.html', context)

@csrf_protect
def predict_view(request):
    if request.method == 'POST':
        try:
            nitrogen = float(request.POST.get('nitrogen', 0))
            phosphorus = float(request.POST.get('phosphorus', 0))
            potassium = float(request.POST.get('potassium', 0))
            temperature = float(request.POST.get('temperature', 0))
            humidity = float(request.POST.get('humidity', 0))
            moisture = float(request.POST.get('moisture', 0))
            soil_type = request.POST.get('soil_type', '')
            crop_type = request.POST.get('crop_type', '')

            result = predict_fertilizer(
                nitrogen=nitrogen,
                phosphorus=phosphorus,
                potassium=potassium,
                temp=temperature,
                humidity=humidity,
                moisture=moisture,
                soil_type=soil_type,
                crop_type=crop_type
            )
            return JsonResponse(result)
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})

    # GET request
    context = {
        'soil_types': SOIL_TYPES,
        'categorized_crop_types': CATEGORIZED_CROP_TYPES
    }
    return render(request, 'core/predict.html', context)

def team_view(request):
    return render(request, 'core/team.html')

@csrf_protect
def contact_view(request):
    if request.method == 'POST':
        name = request.POST.get('name', '').strip()
        email = request.POST.get('email', '').strip()
        phone = request.POST.get('phone', '').strip()
        subject = request.POST.get('subject', '').strip()
        message = request.POST.get('message', '').strip()

        if not name or not email or not subject or not message:
            return JsonResponse({'success': False, 'error': 'Please fill in all required fields.'})

        try:
            ContactMessage.objects.create(
                name=name,
                email=email,
                phone=phone,
                subject=subject,
                message=message
            )
            return JsonResponse({'success': True, 'message': 'Your message has been submitted successfully! We will get back to you soon.'})
        except Exception as e:
            return JsonResponse({'success': False, 'error': f"Failed to save message: {str(e)}"})

    return render(request, 'core/contact.html')

def error_404_view(request, exception):
    return render(request, 'core/404.html', status=404)
