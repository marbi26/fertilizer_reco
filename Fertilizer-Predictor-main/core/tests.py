from django.test import TestCase, Client
from django.urls import reverse
from .models import ContactMessage
from .ml_model import predict_fertilizer, get_ml_metrics

class CoreViewsTests(TestCase):
    def setUp(self):
        self.client = Client()

    def test_pages_status_code(self):
        """Test that all pages render successfully with code 200."""
        pages = ['core:home', 'core:about', 'core:analysis', 'core:predict', 'core:team', 'core:contact']
        for page in pages:
            response = self.client.get(reverse(page))
            self.assertEqual(response.status_code, 200, f"Page {page} failed to render.")

    def test_custom_404_handler(self):
        """Test that a non-existent URL triggers our custom 404 template."""
        response = self.client.get('/this-path-does-not-exist/')
        self.assertEqual(response.status_code, 404)
        self.assertTemplateUsed(response, 'core/404.html')

    def test_contact_form_submission_success(self):
        """Test sending a valid message through the contact form saves to DB and returns success JSON."""
        post_data = {
            'name': 'Test Farmer',
            'email': 'farmer@example.com',
            'phone': '9876543210',
            'subject': 'Soil pH Inquiry',
            'message': 'This is a test query about soil testing services.'
        }
        response = self.client.post(reverse('core:contact'), post_data)
        
        # Verify JSON response
        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(
            str(response.content, encoding='utf8'),
            {'success': True, 'message': 'Your message has been submitted successfully! We will get back to you soon.'}
        )

        # Verify DB entry
        message = ContactMessage.objects.first()
        self.assertIsNotNone(message)
        self.assertEqual(message.name, 'Test Farmer')
        self.assertEqual(message.subject, 'Soil pH Inquiry')

    def test_contact_form_submission_validation(self):
        """Test that sending incomplete data through contact form returns validation error JSON."""
        post_data = {
            'name': 'Incomplete User',
            'email': '',  # missing email
            'subject': '',
            'message': 'Hello'
        }
        response = self.client.post(reverse('core:contact'), post_data)
        self.assertEqual(response.status_code, 200)
        
        data = response.json()
        self.assertFalse(data['success'])
        self.assertIn('error', data)

    def test_predict_view_success(self):
        """Test sending NPK metrics to the prediction view returns recommendation details."""
        post_data = {
            'nitrogen': '12',
            'phosphorus': '42',
            'potassium': '38',
            'temperature': '25',
            'humidity': '70',
            'moisture': '50',
            'soil_type': 'Loamy',
            'crop_type': 'Rice'
        }
        response = self.client.post(reverse('core:predict'), post_data)
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        self.assertTrue(data['success'])
        self.assertIn('fertilizer', data)
        self.assertIn('confidence', data)
        self.assertIn('description', data)
        self.assertIn('precautions', data)
        self.assertIn('suitable_crops', data)

    def test_ml_model_prediction_helper(self):
        """Test the predict_fertilizer backend helper function directly."""
        # Test Case 1: Exact matches from compiled CSV dataset for Urea
        result = predict_fertilizer(90, 36, 49, 20, 83, 26, 'Clayey', 'Rice')
        self.assertTrue(result['success'])
        self.assertEqual(result['fertilizer'], 'Urea')
        
        # Test Case 2: Exact matches from compiled CSV dataset for DAP
        result = predict_fertilizer(13, 36, 0, 29, 58, 52, 'Loamy', 'Wheat')
        self.assertTrue(result['success'])
        self.assertEqual(result['fertilizer'], 'DAP')

    def test_ml_metrics_helper(self):
        """Test that get_ml_metrics returns the expected diagnostic metrics."""
        metrics = get_ml_metrics()
        self.assertIn('accuracy', metrics)
        self.assertIn('features', metrics)
        self.assertIn('feature_importances', metrics)
        self.assertIn('confusion_matrix', metrics)
        self.assertIn('fertilizers', metrics)
        
        self.assertEqual(len(metrics['features']), 8)
        self.assertEqual(len(metrics['feature_importances']), 8)
        self.assertEqual(len(metrics['confusion_matrix']), 14)
        self.assertEqual(len(metrics['fertilizers']), 14)
