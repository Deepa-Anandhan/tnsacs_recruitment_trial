# from weasyprint import HTML
from django.template.loader import render_to_string
from django.core.mail import send_mail , BadHeaderError
import smtplib
from rest_framework import generics, status
from rest_framework.response import Response
from .serializers import JobSerializer, SSLCSerializer, HSCSerializer, UGSerializer, PGSerializer, ExperienceSerializer, PreferedExperienceSerializer
from jobs.models import Job
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.utils import json
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.files.base import ContentFile
import base64
from .utils import get_list_dict
from user.api.utils import sendOTP
from rest_framework.authtoken.models import Token
from django.conf import settings
from django.db import transaction
from jobs.signals import my_custom_signal
from django.http import HttpResponse
from xhtml2pdf import pisa
from io import BytesIO

from django.shortcuts import render

import base64


class JobView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    authentication_classes = [TokenAuthentication]

    def post(self, request, format=None):
        token = request.auth

        validated_data = request.data
        sslc_data = {k.replace('sslc[', '').replace(
            ']', ''): v for k, v in validated_data.items() if k.startswith('sslc[')}
        hsc_data = {k.replace('hsc[', '').replace(
            ']', ''): v for k, v in validated_data.items() if k.startswith('hsc[')}
        ug_data = {k.replace('ug[', '').replace(
            ']', ''): v for k, v in validated_data.items() if k.startswith('ug[')}
        pg_data = get_list_dict(validated_data, 'pg', 'degree')
        experience_data = get_list_dict(validated_data, 'experience', 'degree')
        prefered_experience_data = get_list_dict(
            validated_data, 'prefered_experience', 'year')
        token = Token.objects.get(key=request.auth)

        position = validated_data['position']
        signature = validated_data['signature']


        # NOC = validated_data['NOC']
        with transaction.atomic():
            # print(prefered_experience_data)
            sslc_serializer = SSLCSerializer(data=sslc_data)
            hsc_serializer = HSCSerializer(data=hsc_data)
            ug_serializer = UGSerializer(data=ug_data)
            pg_serializer = PGSerializer(data=pg_data, many=True)
            experience_serializer = ExperienceSerializer(
                data=experience_data, many=True)
            prefered_experience_serializer = PreferedExperienceSerializer(
                data=prefered_experience_data, many=True)

            if sslc_serializer.is_valid() and hsc_serializer.is_valid() and ug_serializer.is_valid() and pg_serializer.is_valid() and experience_serializer.is_valid() and prefered_experience_serializer.is_valid():

                sslc,  hsc, ug = sslc_serializer.save(), hsc_serializer.save(
                ), ug_serializer.save()

                job_serializer = JobSerializer(
                    data={'position': position, 'sslc': sslc.id, 'hsc': hsc.id, 'ug': ug.id, 'user': token.user.id, 'signature': signature})

                if job_serializer.is_valid():
                    job = job_serializer.save()
                    pg_serializer.save(job=job)
                    experience_serializer.save(job=job)
                    prefered_experience_serializer.save(job=job)
                    applicant_email = job.user.username
                    applicant_name = job.user.profile.first_name
                    job_title = job.position
                    application_id = job.application_id
                    data = {'id': job.id, 'applicant_id': job.application_id}
                    send_application_email(
                        applicant_email, applicant_name, job_title, application_id , job.id)

                    my_custom_signal.send(sender=Job, instance=job)

                    return Response(data, status=status.HTTP_200_OK)
                print('job errors', job_serializer.errors)
            print('sslc errors', sslc_serializer.errors)
            print('hsc errors', hsc_serializer.errors)
            print('ug errors', ug_serializer.errors)
            print('pg errors', pg_serializer.errors)
            print('experience errors', experience_serializer.errors)
            print('prefered_experience errors',
                  prefered_experience_serializer.errors)
            errors = {
                'sslc_errors': sslc_serializer.errors,
                'hsc_errors': hsc_serializer.errors,
                'ug_errors': ug_serializer.errors,
                'pg_errors': pg_serializer.errors,
                'experience_errors': experience_serializer.errors,
                'prefered_experience_errors': prefered_experience_serializer.errors
            }

            print(errors)
            
            
        return Response(status=status.HTTP_400_BAD_REQUEST)


def send_application_email(applicant_email, applicant_name, job_title, application_id, id=None):
    subject = "Your Application ID: Next Steps Await!"
    html_content = render_to_string(
        'email.html',
        {
            'applicant_name': applicant_name,
            'job_title': job_title,
            'application_id': application_id,
            'id': id
        }
    )
    
    try:
        send_mail(
            subject,
            '',
            settings.EMAIL_HOST_USER,
            [applicant_email],
            html_message=html_content,
        )
    except (smtplib.SMTPException, BadHeaderError) as e:
        # Log error or handle it accordingly
        print(f"An error occurred while sending the email: {e}")


# def application_success(request, pk):
#     try:
#         obj = Job.objects.get(id=pk)
#         html_content = render_to_string(
#             "ApplicationSuccessPdf.html", {'job': obj})
#         pdf = HTML(string=html_content).write_pdf()

#         response = HttpResponse(pdf, content_type='application/pdf')
#         response['Content-Disposition'] = 'attachment; filename="Appliation.pdf"'
#         return response
#     except Job.DoesNotExist:
#         return HttpResponse("Product not found", status=404)

def aaaaa(request):
    return render(request, 'aaaaa.html')

# import os
# from django.conf import settings
# from django.http import HttpResponse
# from django.template.loader import get_template
# from xhtml2pdf import pisa
# from django.contrib.staticfiles import finders


# def link_callback(uri, rel):
#     """
#     Convert HTML URIs to absolute system paths so xhtml2pdf can access those resources.
#     """
#     sUrl = settings.STATIC_URL        # Typically /static/
#     sRoot = settings.STATIC_ROOT      # Typically /path/to/static/
#     mUrl = settings.MEDIA_URL         # Typically /media/
#     mRoot = settings.MEDIA_ROOT       # Typically /path/to/media/

#     path = None
#     print(uri , "this is the current uri")
#     if uri.startswith(mUrl):
#         path = os.path.join(mRoot, uri.replace(mUrl, ""))
#         print(path , "media")
#     elif uri.startswith(sUrl):
#         path = os.path.join(sRoot, uri.replace(sUrl, ""))
#         print(path , "static")
#     else:
#         # Attempt to find the file using the staticfiles finders
#         path = finders.find(uri)
#         if not path:
#             # Return the original URI if not found
#             return uri

#     # Convert path to an absolute path
#     path = os.path.realpath(path)

#     # Ensure the file exists
#     if not os.path.isfile(path):
#         raise RuntimeError(
#             'The file at path %s does not exist. Media URI must start with %s or %s.' % (path, sUrl, mUrl)
#         )

#     return path

def application_success(request, pk):
    try:
        obj = Job.objects.get(id=pk)

        html_content = render_to_string(
            "ApplicationSuccessPdf.html", {'job': obj})

        # Create a Django response object, and specify content_type as pdf
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="Application.pdf"'

        # Create a PDF buffer
        pdf = BytesIO()

        # Convert HTML content to PDF using xhtml2pdf and write it to the buffer
        pisa_status = pisa.CreatePDF(html_content, dest=pdf)

        # Seek to the beginning of the stream
        pdf.seek(0)

        # Return PDF as a response
        if pisa_status.err:
            return HttpResponse('We had some errors <pre>' + html_content + '</pre>')
        else:
            response.write(pdf.getvalue())
            return response

    except Job.DoesNotExist:
        print("not found")
        return HttpResponse("Job not found", status=404)


def application_summary_admin(request, pk):
    try:
        obj = Job.objects.get(id=pk)
        
        
        html_content = render_to_string(
            "ApplicationSuccessPdf_admin.html", {'job': obj})

        # Create a Django response object, and specify content_type as pdf
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="Application.pdf"'


        # template_path  = "ApplicationSuccessPdf_admin.html"
        # template = get_template(template_path)
        # html = template.render({'job': obj})
        # Create a PDF buffer
        pdf = BytesIO()

        # Convert HTML content to PDF using xhtml2pdf and write it to the buffer
        # pisa_status = pisa.CreatePDF(html_content, dest=pdf)
        
        # create a pdf
        # pisa_status = pisa.CreatePDF(
        #     html, dest=response, link_callback=link_callback)
        pisa_status = pisa.CreatePDF(
            html_content, dest=pdf)

        # Seek to the beginning of the stream
        # pdf.seek(0)

        # Return PDF as a response
        if pisa_status.err:
            return HttpResponse('We had some errors <pre>' + html_content + '</pre>')
        else:
            response.write(pdf.getvalue())
            # response['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
            # response['Pragma'] = 'no-cache'
            return response
        
        # return render(request ,"ApplicationSuccessPdf_admin.html" , {'job': obj})

    except Job.DoesNotExist:
        print("not found")
        return HttpResponse("Job not found", status=404)
    
def show_view(request):
    obj = Job.objects.get(id=1)
    return render(request ,'ApplicationSuccessPdf_admin.html' ,{'job':obj} )
