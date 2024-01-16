
from locale import currency
from unicodedata import name
from weakref import ref
from django.shortcuts import render,get_object_or_404,HttpResponseRedirect, redirect
from django.http import HttpResponse,StreamingHttpResponse
from django.contrib.auth.models import User,Group
from django.urls import reverse
from django.core import mail

from django.db import connection
from django.http import JsonResponse
from auth_api.views import response_json
import hashlib
from django.utils.crypto import get_random_string
from dateutil.relativedelta import relativedelta
from django.views.decorators.csrf import csrf_protect, csrf_exempt
from django.contrib import messages
from django.contrib.auth.decorators import login_required,permission_required
import csv
from cross_marketing.models import cross_marketing_products, cross_marketing_strategy, website_enteries
from django.db.models import Q,Sum ,Prefetch, Count, Case, When , Max, F
from django.db.models.functions import Coalesce
from auth_api.decorators import  has_cloud_api_permission
from .models import Department, MultiUserDetails, PostContent, contentDept, customer_details, department,job_description
# from customers.models import customers_setting,clients_account,emi_payment_details,finance_setting,customer_details,customers_grouped,clients_account, import_customer_file,jmdCustomerVehicle,jmdCustServicingDetails,jmd_cust_insurance_details,MultiUserDetails,MultiUserPermissionFields,MultiUserPermission,finance_details
from offers.models import *
from outlets.models import outlet_details,user_allowed_outlets
# from customers.models import customer_details,privileged_customers_subgroup,customer_groups, customer_in_group, privileged_customer,privilege_customer_groups
from customers.models import *
from utils.extraFunctions import dictfetchall
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from uuid import getnode as get_mac 
from auth_merchant.models import MerchantProfile, CarDetails, Country
from django.contrib.auth.hashers import make_password
from auth_customer.models import CustomerProfile
from django.db.models import Q,Sum
import os
import re
from subcriptions.models import subcription_transactions, plan_subcriptions,childtransactions,Xircls_Commission_On_Reward,PriceDeductions
from auth_merchant.decorators import check_user_subcription, redirectMerchantAsPerProgress,user_permission_by_root_user
from offers.models import OfferIssueKits,JmdEmailTemplate,JmdOrders,JmdInsurance,OutletOfferInfo
from customers.customerclass import CustomerClass
from broadcast.broadcastclass import BroadcastClass

from django.template.loader import render_to_string
from utils.tasks import send_offer_email_user,sendSMS,send_JMD_email_user,send_JMD_email_user_no_cc,send_email_user,send_email_user_merchant
import ast
from Prospects.models import new_Addcall_details,JMD_Admin_Details
from offers.models import JmdNotificationReminderDetails,MyOffers
from urllib.parse import quote,unquote
import requests,json
from make_your_circle.models import privileged_xircl_info,sponsor_privileged_xircl_info,host_privileged_info,subXirclsInfo,selected_Offer
from customers.models import privil_cust_pending_transactions
from make_your_circle.models import sponsor_to_host_transactn_details
from reports.models import privilege_customer_report
from products.models import *
from eventlog.models import XirclsEventLog
from django.core.mail import EmailMessage

from xircls.settings import SERVER_UPLOAD_URL
import base64
from auth_merchant.decorators import multi_user_permission,xirclsOnly
from cloud_business_api.models import reward_points_earned_on_action,reward_points_redeem_on_action
from utils.tasks import send_email_user_admin,sendSMS,send_email_user,send_emails
# from . import privileged_customer_details_info
from auth_merchant.models import All_Countries_Complete_Info
			
from cross_marketing.models import EmailActionSetting,cross_marketing_products
from datetime import timedelta, date, datetime
from xhtml2pdf import pisa
from json import dumps
from pytz import timezone
from django.utils import timezone as ts
from auth_api.views import response_json, decrypt
from outlet_category.models import OutletCategory
import pyqrcode

import logging
logger = logging.getLogger(__name__)


# @login_required(login_url='/merchant-login/')
# ##@multi_user_permission('View_Customers')
# @redirectMerchantAsPerProgress("MY_CUSTOMERS")
# @multi_user_permission('view', 'Customers')
# @permission_required(['customers.add_customer_details','customers.change_customer_details','customers.delete_customer_details'],raise_exception=True)
# def get_my_customers(request, template_name='merchant_site/customers/my_customers.html'):
# 	print("++71++")
# 	active_page_name = "my_customers_page"
# 	multi_user_id = request.session.get("multi_user_id")
# 	print(multi_user_id,"+++++++++++++++++++++++++++++++++++++++")
# 	isSAdmin = False
# 	if multi_user_id is None:
# 		isSAdmin = True
# 	display_department_date = 'all'
# 	pagename_string = request.GET.get('pagename')
# 	page_number = int(request.GET.get('page') if request.GET.get('page') else 1)

# 	out_id = request.session.get('outlet_id')
# 	invoice_count = 0
# 	try:
# 		invoice_ob =inovice_details.objects.filter(outlet_id=out_id)
# 		invoice_count=len(invoice_ob)
# 	except:
# 		invoice_ob= None
		
# 	# selected_cust = 100
# 	if request.session.get('is_logged_in_superuser') == False:
# 		outlet_list = outlet_details.objects.filter(id__in=request.session.get('allowed_outlets_list'),company_id = request.session.get('company_id'),is_active=1,is_verified = 1)
# 	elif request.session.get('is_logged_in_superuser') == True:
# 		outlet_list = outlet_details.objects.filter(company_id = request.session.get('company_id'),is_active=1,is_verified = 1)
	
# 	cursor = connection.cursor()

# 	offersObj = getOutletOffers(request)

# 	outletid = None
# 	if request.session.get('outlet_id') and outletid == None:
# 		outletid = int(request.session.get('outlet_id'))    
 
# 	if outletid:
# 		try:
# 			outletObj = get_object_or_404(outlet_details, id = outletid)
# 		except:
# 			outletObj = None
# 		else:
# 			currency_obj = get_object_or_404(All_Countries_Complete_Info, name = outletObj.outlet_country)
# 		areas = []
# 		cust_grps = []
# 		customers_list = customer_details.objects.filter(outlet_id=outletid).order_by('-created_at')
# 		customer_count = len(customers_list)
# 		customerObj = CustomerClass()

# 		########################## Statistics ####################################
# 		try:
# 			customer_settings_obj = get_object_or_404(customers_setting,outlet_id = out_id)
# 		except:
# 			customer_settings_obj = None


# 		earnings_today = 0
# 		diff_month = 0
# 		active_cust_count = 0
# 		inactive_cust_count = 0
# 		now = datetime.now()

# 		cursor = connection.cursor()
# 		cursor.execute(''' select max(created_at) as created_at,customer_id from xl925_inovice_details WHERE outlet_id ={0} 
# 							 GROUP BY customer_id DESC '''.format(out_id))
# 		new_inv_obj = dictfetchall(cursor)
# 		for inv in invoice_ob:
			
# 			if inv.created_at.date() == now.date():
# 				if inv.status == "ACT":
# 					earnings_today = float(earnings_today) + float(inv.total_amount_after_gst)

# 		for inv in new_inv_obj:
		 
# 			diff_month = (now.date() - inv['created_at'].date()).days / 30
			
# 			if customer_settings_obj :
# 				if diff_month <= int(customer_settings_obj.active_months):
# 					active_cust_count = active_cust_count + 1
			   
# 			else :
# 				if diff_month <= 6:
# 					active_cust_count = active_cust_count + 1
				

# 		inactive_cust_count = customer_count - active_cust_count
		
# 		if multi_user_id is None:
# 			customers_obj = customer_details.objects.filter(outlet_id=outletid)
# 		else:
# 			try:
# 				MultiUserObj = MultiUserDetails.objects.get(user_id = multi_user_id)
# 			except:
# 				MultiUserObj = None
# 			if MultiUserObj:
# 				customers_obj = customer_details.objects.filter(multi_user_id_id=MultiUserObj.id)
		
		

		
			
# 		#############################################################################


# 		for cust_areas in customers_list:
# 			if cust_areas.area_building != None or cust_areas.area_building != None:
# 				areas.append(cust_areas.area_building)
# 			try:
# 				privileged_customers_subgroup_obj = get_object_or_404(privileged_customers_subgroup, customer_id =cust_areas.id,outlet_id_id = outletObj.id)
# 			except:
# 				privileged_customers_subgroup_obj = None    
# 			if privileged_customers_subgroup_obj:
# 				print("#######")
# 				cust_grps.append(privileged_customers_subgroup_obj)
		
# 		print(cust_grps)        
			
		
# 		areas = set(areas)
# 		if outletObj.is_jmd == True:
# 			template_name = 'merchant_site/customers/jmd_my_customers.html'
# 			for_user_id = request.session.get('user_obj')
# 			print(for_user_id)
# 			print("@2222222222222222222222")
# 			print(outletid)
# 			if outletid == 423 and for_user_id == None:
# 				print("CCCCCCCCCCCCCC")
# 				for_user_id = None
# 				customers_obj = customerObj.getJMDAllCustomers(outletObj.id,for_user_id)
# 			else:
# 				print("CCCCCCCCCCCCCC111111111")
# 				customers_obj = customerObj.getJMDAllCustomers(outletObj.id,for_user_id)
# 			if customers_obj:
# 				number_of_cust=len(customers_obj)

# 				todays_date = datetime.today()
# 				last_one_year = todays_date + timedelta(days=-365)           
				
# 				cursor.execute( '''SELECT COUNT(DISTINCT(cd.id)) as active_customers  FROM xl925_customer_details as cd
# 						INNER JOIN xl925_jmd_cust_servicing_details as csd on cd.id = csd.customer_id
# 						WHERE cd.outlet_id ={0} and csd.service_invoice_date <= '{1}' and  csd.service_invoice_date >= '{2}' '''.format(outletid,todays_date,last_one_year))
# 				active_customers = dictfetchall(cursor)[0]

# 				inactive_customers = number_of_cust - active_customers['active_customers']
				
# 				cursor.execute('''SELECT * FROM xl925_customer_details as cd INNER JOIN xl925_jmd_cust_servicing_details as csd on cd.id = csd.customer_id WHERE cd.outlet_id ={0} and 
# 					csd.service_invoice_date <= '{1}' '''.format(outletid,last_one_year))
# 				inact_cust = dictfetchall(cursor)
# 				temp=list(customers_obj)
# 				reportObj = None
# 				if len(temp) > 0:
# 					paginator = Paginator(temp, 25)  # Show 25 contacts per page
# 					page = request.GET.get('page')
# 					try:
# 						reportObj = paginator.page(page)
# 					except PageNotAnInteger:
# 						# If page is not an integer, deliver first page.
# 						reportObj = paginator.page(1)
# 					except EmptyPage:
# 						# If page is out of range (e.g. 9999), deliver last page of results.
# 						reportObj = paginator.page(paginator.num_pages)
# 	if request.GET.get('number'):
# 		selected_cust = int(request.GET.get('number'))
# 	else:
# 		selected_cust = 100   
# 	typeSelected = "my"
	
# 	if request.method == 'POST':
# 		postdata = request.POST.copy()
# 		press_btn = postdata.get("press_btn", None)
# 		customerid = postdata.get("customer_id", None)
# 		offerid = postdata.get("offer_id", None)
# 		display_department_date = postdata.get("filter_by_department", None) 
# 		customerdelete = postdata.get("customerdelete",None)
# 		custid = postdata.get("custid",None)
# 		print(custid)
# 		print(customerdelete)
		
		
# 		search = postdata.get("customer_search", None)
# 		print(search)
# 		try:
# 			outlet_info = get_object_or_404(outlet_details, id = request.session.get('outlet_id'))
# 		except:
# 			outlet_info = None

# 		outlet_info.customer_search_text=search
# 		outlet_info.save()
# 		if press_btn == "filter_by_area":
			
# 			area_name = postdata.get('filter_type',None)
# 			area_text = area_name
# 			if area_name:
# 				if outletObj.is_jmd != True:
# 					cursor.execute(''' SELECT cd.id, cd.phone_no, cd.customer_name, cd.entry_point, cd.email, cd.outlet_id,cd.area_building
# 								FROM `xl925_customer_details` as cd
# 								WHERE cd.outlet_id = {0} AND (cd.area_building LIKE '%{1}%' ) '''.format(
# 								outletid, area_name))                
# 					customers_list = dictfetchall(cursor)
# 					customers_obj = dictfetchall(cursor)

# 		if outletObj.is_jmd == True: 
# 			if postdata.get("display_days"):
# 				if postdata.get("display_days") == "all":
# 					selected_days = "all"                                    
# 				else :    
# 					selected_days = int(postdata.get("display_days"))                                  
# 					days = todays_date + timedelta(days=selected_days)           
# 					cursor = connection.cursor()               
# 					cursor.execute( '''SELECT cd.id as cust_id, cd.phone_no, cd.customer_name, cd.entry_point, cd.email, cd.outlet_id,jcv.vehicle_number,ci.service_invoice_date
# 							FROM xl925_jmd_cust_servicing_details as ci
# 							INNER JOIN xl925_customer_details as cd   ON    cd.id =ci.customer_id
# 							INNER JOIN xl925_jmd_customers_vehicle as jcv
# 							on jcv.id = ci.vehicle_id
# 							WHERE service_expiry_date >= '{0}' AND  service_expiry_date <= '{1}' And cd.outlet_id={2}
# 							GROUP BY ci.customer_id '''.format(todays_date,days,outletid))
# 					customers_obj = dictfetchall(cursor)            
# 		if press_btn == "SUBMIT"  : 
# 			from_date = postdata.get('from_date',None)
			
# 			if from_date and from_date != "" :
# 				from_date = datetime.strptime(from_date, '%d-%m-%Y')
# 				display_from_date = from_date
# 				from_date = from_date.strftime('%Y-%m-%d %H:%M:%S') 
# 			to_date = postdata.get('to_date',None)
# 			if to_date and to_date != "" :
# 				to_date = datetime.strptime(to_date, '%d-%m-%Y')
# 				display_to_date = to_date
# 				to_date = to_date.strftime('%Y-%m-%d %H:%M:%S')
# 			cursor.execute( '''SELECT cd.id as cust_id, cd.is_trash, cd.phone_no, cd.customer_name, cd.entry_point, cd.email, cd.outlet_id,jcv.vehicle_number,ci.service_invoice_date, ji.policy_purchase_date,
# 							 (select created_at from xl925_jmd_notification_reminder_details where customer_id = cd.id and is_reminder = True order by created_at DESC limit 1) as reminder_last_sent_date,
# 							 (select created_at from xl925_jmd_notification_reminder_details where customer_id = cd.id and is_notification = True order by created_at DESC limit 1) as notification_last_sent_date,
# 							 (select created_at from xl925_jmd_notification_reminder_details where customer_id = cd.id and is_offer = True order by created_at DESC limit 1) as offer_last_sent_date,
# 							 (select service_invoice_date from xl925_jmd_cust_servicing_details where user_id = cd.user_id  order by service_invoice_date DESC limit 1) as service_invoice_date,
# 							 (select policy_expiry_date FROM `xl925_jmd_cust_insurance_details` where user_id = cd.user_id order by `policy_expiry_date` DESC limit 1) as policy_expiry_date,
# 							 (select policy_purchase_date FROM `xl925_jmd_cust_insurance_details` where user_id = cd.user_id order by `policy_purchase_date` DESC limit 1) as policy_purchase_date
# 							 FROM xl925_customer_details  as cd
# 							 LEFT  JOIN xl925_jmd_customers_vehicle as jcv on jcv.customer_id =cd.id
# 							 LEFT JOIN xl925_jmd_cust_servicing_details as ci on ci.customer_id = cd.id LEFT JOIN xl925_jmd_cust_insurance_details as ji on ji.customer_id=cd.id
# 							 WHERE ci.service_invoice_date >= '{0}' AND  ci.service_invoice_date <= '{1}' AND cd.outlet_id ={2} 
# 							 GROUP BY ci.customer_id '''.format(from_date,to_date,outletid))
# 			customers_obj = dictfetchall(cursor) 

		
  
# 		if press_btn == "SEND_NOTIFICATION":
# 			broadcastObj = BroadcastClass()
# 			respObj = broadcastObj.sendNotificationEmail(request, outletid, customerid, offerid)
# 			if respObj['status'] == "success":
# 				messages.add_message(request, messages.SUCCESS, respObj['message'], fail_silently=True)
# 				return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
# 			else:
# 				messages.add_message(request, messages.ERROR, respObj['message'],fail_silently=True)
# 				return HttpResponseRedirect(request.META.get('HTTP_REFERER'))

# 		if press_btn == "SEND_SMS":
# 			broadcastObj = BroadcastClass()
# 			respObj = broadcastObj.sendNotificationSMS(request, outletid, customerid, offerid)
# 			if respObj['status'] == "success":
# 				messages.add_message(request, messages.SUCCESS, respObj['message'], fail_silently=True)
# 				return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
# 			else:
# 				messages.add_message(request, messages.ERROR, respObj['message'],fail_silently=True)
# 				return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
# 		elif press_btn == 'SEARCH':
# 			search_txt = postdata.get('customer_search', None)
# 			if search_txt:
# 				if outletObj.is_jmd != True:
# 					cursor.execute(''' SELECT cd.id, cd.phone_no, cd.customer_name, cd.entry_point, cd.email, cd.outlet_id
# 								FROM `xl925_customer_details` as cd
# 								WHERE cd.outlet_id = {0} AND (cd.phone_no LIKE '%{1}%' OR cd.customer_name LIKE '%{1}%' OR cd.email LIKE '%{1}%') '''.format(
# 								outletid, search_txt))                
# 					customers_list = dictfetchall(cursor)
# 				elif outletObj.is_jmd == True:  

# 					#14-10-2019start
# 					cursor.execute('''SELECT cd.id as cust_id,cd.is_trash, cd.phone_no, cd.customer_name, cd.entry_point, cd.email, cd.outlet_id ,jcv.vehicle_number, ji.policy_purchase_date,  (select created_at from xl925_jmd_notification_reminder_details where customer_id = cd.id and is_reminder = True order by created_at DESC limit 1) as reminder_last_sent_date,
# 									(select created_at from xl925_jmd_notification_reminder_details where customer_id = cd.id and is_notification = True order by created_at DESC limit 1) as notification_last_sent_date,
# 									(select created_at from xl925_jmd_notification_reminder_details where customer_id = cd.id and is_offer = True order by created_at DESC limit 1) as offer_last_sent_date,
# 									(select service_invoice_date from xl925_jmd_cust_servicing_details where user_id = cd.user_id  order by service_invoice_date DESC limit 1) as service_invoice_date,
# 									(select policy_expiry_date FROM `xl925_jmd_cust_insurance_details` where user_id = cd.user_id order by `policy_expiry_date` DESC limit 1) as policy_expiry_date,
# 									(select policy_purchase_date FROM `xl925_jmd_cust_insurance_details` where user_id = cd.user_id order by `policy_purchase_date` DESC limit 1) as policy_purchase_date
# 					from `xl925_customer_details` as cd inner join `xl925_jmd_customers_vehicle` as jcv on jcv.customer_id = cd.id 
# 					LEFT JOIN xl925_jmd_cust_servicing_details as ci on ci.customer_id = cd.id 
# 					LEFT JOIN xl925_jmd_cust_insurance_details as ji on ji.customer_id = cd.id
# 					where cd.outlet_id in (408,423) and (cd.phone_no LIKE '%{0}%' OR cd.customer_name LIKE '%{0}%' OR cd.email LIKE '%{0}%') '''.format(search_txt))        
# 					customers_obj = dictfetchall(cursor)
					
# 		elif press_btn == 'EXPORT':
# 			# export(request,postdata,outletid)     
# 			display_department_date = postdata.get("filter_by_department", None)
# 			search_txt = postdata.get('customer_search', None)
# 			if search_txt.strip() == "":
# 				search_txt = None
# 			selected_days = postdata.get("display_days")
# 			from_date = postdata.get('from_date',None)      
# 			if from_date.strip() == "":
# 				from_date = None
# 			to_date = postdata.get('to_date',None)  
# 			if to_date.strip() == "":
# 				to_date = None
# 			# url = reverse('customers:export_to_csv',kwargs={'display_department_date': str(display_department_date),"search_txt":str(search_txt),"selected_days":str(selected_days),"from_date":str(from_date),"to_date":str(to_date)})
# 			url = reverse('customers:export_to_csv',kwargs={'display_department_date': display_department_date,"search_txt":search_txt,"selected_days":selected_days,"from_date":from_date,"to_date":to_date})
# 			return HttpResponseRedirect(url)               
			

# 		if postdata.get("display_cust"):    
# 			selected_cust = int(postdata.get("display_cust"))

	
# 		if display_department_date and display_department_date != "all":
# 			customers_obj_temp = customers_obj
# 			customers_obj = [] 
# 			for data in customers_obj_temp:
# 				if display_department_date == "service_invoice_date":
# 					if data['service_invoice_date'] == None or data['service_invoice_date'] == "" :
# 						customers_obj.append(data)  
# 				elif display_department_date == "insurance_policy_date" :
# 					if data['policy_expiry_date'] == None or data['policy_expiry_date'] == "" :
# 						customers_obj.append(data)  
# 				elif display_department_date == "both" :                            
# 					if data['policy_expiry_date'] != None and data['policy_expiry_date'] != "" and data['service_invoice_date'] != None and data['service_invoice_date'] != "":
# 						customers_obj.append(data)
# 				elif display_department_date == "insurance_from_jmd":           #11-10-2019 (only one condition applied ie. insurance policy expiry date)
# 					if data['policy_expiry_date'] != None or data['policy_expiry_date'] != "" and data['policy_purchase_date'] != None and data['policy_purchase_date'] != "":
# 						customers_obj.append(data)
# 				#uncomment it when there is policy purchase date available with policy expiry date and comment the above elif 
# 				# elif display_department_date == "insurance_from_jmd":
# 				#     if data['policy_expiry_date'] != None or data['policy_expiry_date'] != "" and data['policy_purchase_date'] != None or data['policy_purchase_date'] != "":
# 				#         customers_obj.append(data)
# 				elif display_department_date == "insurance_from_others":        #11-10-2019 done
# 					if data['vehicle_id'] == None or data['vehicle_id'] == "":
# 						if data['policy_expiry_date'] != None and data['policy_expiry_date'] != "" and data['service_invoice_date'] != None and data['service_invoice_date'] != "":
# 							if data['policy_purchase_date'] == None or data['policy_purchase_date'] == "":
# 								customers_obj.append(data)

# 				elif display_department_date == "insurance_cust":        #11-10-2019 done
# 					if data['outlet_id'] == 408:
# 						customers_obj.append(data)

# 				elif display_department_date == "service_cust":
# 					if data['outlet_id'] == 423:
# 						customers_obj.append(data)

# 		print('oooooooooooooooooooooooooooooooo')
# 		if custid:
# 			print('sadjsahjdhsalkoooooooooooooooooooo')
# 			deletecustobj = get_object_or_404(customer_details, id=custid)
# 			# sub_xircle_infoobj = finance_details.objects.filter(id=11)
# 			print(deletecustobj)
# 			print('fdjsjkdhofiaspsj')
# 			print(deletecustobj.is_trash)
# 			deletecustobj.is_trash = 1

# 			# print(deleteobj.is_trash)
# 			# sub_xircle_infoobj.is_trash=1
# 			print('fdjsjkdhofiaspsj')
# 			deletecustobj.save()
# 			messages.add_message(request, messages.SUCCESS, 'Your Customer is successfully deleted',fail_silently=True)
# 			url = reverse('customers:get_my_customers')
# 			return HttpResponseRedirect(url)

# 		elif postdata.get('type') == "my":
			
# 			pass
# 			print("[LeadDash] After For")
				
			
		
# 		elif postdata.get('type') == "every":
# 			typeSelected = 'every'
# 			customers_obj = customer_details.objects.filter(outlet_id=outletid,is_trash=0)
# 			return render(request,template_name,locals())
# 	customers_obj1 = []             
				
# 	if request.GET.get('page'):
# 		page = int(request.GET.get('page'))
# 		display_department_date = request.GET.get('filter')
# 		print(display_department_date)
# 		print("YAHOOOOOOOOOO")

# 		if display_department_date and display_department_date != "all":
# 			customers_obj_temp = customers_obj
			
# 			for data in customers_obj_temp:
# 				if display_department_date == "service_invoice_date":
# 					print("SERVICE INVOICE DATEEEEEEEEEEEEEEE")
# 					if data['service_invoice_date'] == None or data['service_invoice_date'] == "" :

# 						customers_obj1.append(data)  
# 				elif display_department_date == "insurance_policy_date" :
# 					print("insurance_policy_date")
# 					if data['policy_expiry_date'] == None or data['policy_expiry_date'] == "" :
# 						print("insurance_policy_date")
# 						customers_obj1.append(data)  
# 				elif display_department_date == "both" : 
# 					print("both")                           
# 					if data['policy_expiry_date'] != None and data['policy_expiry_date'] != "" and data['service_invoice_date'] != None and data['service_invoice_date'] != "":
# 						customers_obj1.append(data)
# 				elif display_department_date == "insurance_from_jmd":           #11-10-2019 (only one condition applied ie. insurance policy expiry date)
# 					print("insurance_from_jmd")
# 					if data['policy_expiry_date'] != None or data['policy_expiry_date'] != "" and data['policy_purchase_date'] != None and data['policy_purchase_date'] != "":
# 						customers_obj1.append(data)
# 				#uncomment it when there is policy purchase date available with policy expiry date and comment the above elif 
# 				# elif display_department_date == "insurance_from_jmd":
# 				#     if data['policy_expiry_date'] != None or data['policy_expiry_date'] != "" and data['policy_purchase_date'] != None or data['policy_purchase_date'] != "":
# 				#         customers_obj.append(data)
# 				elif display_department_date == "insurance_from_others":        #11-10-2019 done
# 					if data['vehicle_id'] == None or data['vehicle_id'] == "":
# 						if data['policy_expiry_date'] != None and data['policy_expiry_date'] != "" and data['service_invoice_date'] != None and data['service_invoice_date'] != "":
# 							if data['policy_purchase_date'] == None or data['policy_purchase_date'] == "":
# 								customers_obj1.append(data)


# 				elif display_department_date == "insurance_cust":        #11-10-2019 done
# 					print("CCCCCCCCCCCCCCCC")
# 					if data['outlet_id'] == 408:
# 						customers_obj1.append(data)

# 				elif display_department_date == "service_cust":        #11-10-2019 done
# 					print("CCCCCCCCCCCCCCCC")
# 					if data['outlet_id'] == 423:
# 						customers_obj1.append(data)
# 		print(len(customers_obj1),"XXXXXXXXXXXXXXXXXXXXXXXXXXXXXx")

# 	else:
# 		page = 1     
	
# 	if outletObj.is_jmd == True:
# 		print("SSSSSSSSSSSSSSSSss")
# 		#print(customers_obj)
# 		print(selected_cust)
# 		if customers_obj1:
# 			#paginator = Paginator(customers_obj1, selected_cust) # Show 25 contacts per page
# 			customers_obj = customers_obj1
# 		else:
# 			#paginator = Paginator(customers_obj, selected_cust)
# 			customers_obj = customers_obj
	
# 	return render(request,template_name,locals())


@login_required(login_url='/merchant-login/')
##@multi_user_permission('View_Customers')
@redirectMerchantAsPerProgress("MY_CUSTOMERS")
@multi_user_permission('view', 'Customers')
@permission_required(['customers.add_customer_details','customers.change_customer_details','customers.delete_customer_details'],raise_exception=True)
def get_my_customers_b2b(request, template_name='merchant_site/customers/my_customers_b2b.html'):
	print("++71++")
	active_page_name = "my_customers_page"
	multi_user_id = request.session.get("multi_user_id")
	print(multi_user_id,"+++++++++++++++++++++++++++++++++++++++")
	isSAdmin = False
	if multi_user_id is None:
		isSAdmin = True

	if request.session.get('multi_user_id'):
		userId = request.session.get('multi_user_id')
	else:
		userId = request.user.id
	display_department_date = 'all'
	pagename_string = request.GET.get('pagename')
	page_number = int(request.GET.get('page') if request.GET.get('page') else 1)

	out_id = request.session.get('outlet_id')
	invoice_count = 0
	try:
		invoice_ob =inovice_details.objects.filter(outlet_id=out_id)
		invoice_count=len(invoice_ob)
	except:
		invoice_ob= None
		
	# selected_cust = 100
	if request.session.get('is_logged_in_superuser') == False:
		outlet_list = outlet_details.objects.filter(id__in=request.session.get('allowed_outlets_list'),company_id = request.session.get('company_id'),is_active=1,is_verified = 1)
	elif request.session.get('is_logged_in_superuser') == True:
		outlet_list = outlet_details.objects.filter(company_id = request.session.get('company_id'),is_active=1,is_verified = 1)
	
	cursor = connection.cursor()

	offersObj = getOutletOffers(request)

	outletid = None
	if request.session.get('outlet_id') and outletid == None:
		outletid = int(request.session.get('outlet_id'))    
 
	if outletid:
		try:
			outletObj = get_object_or_404(outlet_details, id = outletid)
		except:
			outletObj = None

		#Company Customers
		
		companyCust = clients_account.objects.filter(created_by=userId,is_trash=False,type="Customer")



		areas = []
		cust_grps = []
		customers_list = customer_details.objects.filter(outlet_id=outletid).order_by('-created_at')
		customer_count = len(customers_list)
		customerObj = CustomerClass()

		########################## Statistics ####################################
		try:
			customer_settings_obj = get_object_or_404(customers_setting,outlet_id = out_id)
		except:
			customer_settings_obj = None


		earnings_today = 0
		diff_month = 0
		active_cust_count = 0
		inactive_cust_count = 0
		now = datetime.now()

		cursor = connection.cursor()
		cursor.execute(''' select max(created_at) as created_at,customer_id from xl925_inovice_details WHERE outlet_id ={0} 
							 GROUP BY customer_id DESC '''.format(out_id))
		new_inv_obj = dictfetchall(cursor)
		for inv in invoice_ob:
			
			if inv.created_at.date() == now.date():
				if inv.status == "ACT":
					earnings_today = float(earnings_today) + float(inv.total_amount_after_gst)

		for inv in new_inv_obj:
		 
			diff_month = (now.date() - inv['created_at'].date()).days / 30
			
			if customer_settings_obj :
				if diff_month <= int(customer_settings_obj.active_months):
					active_cust_count = active_cust_count + 1
			   
			else :
				if diff_month <= 6:
					active_cust_count = active_cust_count + 1
				

		inactive_cust_count = customer_count - active_cust_count
		
		if multi_user_id is None:
			customers_obj = customer_details.objects.filter(outlet_id=outletid)
		else:
			try:
				MultiUserObj = MultiUserDetails.objects.get(user_id = multi_user_id)
			except:
				MultiUserObj = None
			if MultiUserObj:
				customers_obj = customer_details.objects.filter(multi_user_id_id=MultiUserObj.id)
		
		for cust_areas in customers_list:
			if cust_areas.area_building != None or cust_areas.area_building != None:
				areas.append(cust_areas.area_building)
			try:
				privileged_customers_subgroup_obj = get_object_or_404(privileged_customers_subgroup, customer_id =cust_areas.id,outlet_id_id = outletObj.id)
			except:
				privileged_customers_subgroup_obj = None    
			if privileged_customers_subgroup_obj:
				print("#######")
				cust_grps.append(privileged_customers_subgroup_obj)
		
		print(cust_grps)        
			
		
		areas = set(areas)
		if outletObj.is_jmd == True:
			template_name = 'merchant_site/customers/jmd_my_customers.html'
			for_user_id = request.session.get('user_obj')
			print(for_user_id)
			print("@2222222222222222222222")
			print(outletid)
			if outletid == 423 and for_user_id == None:
				print("CCCCCCCCCCCCCC")
				for_user_id = None
				customers_obj = customerObj.getJMDAllCustomers(outletObj.id,for_user_id)
			else:
				print("CCCCCCCCCCCCCC111111111")
				customers_obj = customerObj.getJMDAllCustomers(outletObj.id,for_user_id)
			if customers_obj!=None:
				l= []
				for i in customers_obj:
					l.append(i)
			if customers_obj:
				number_of_cust=len(customers_obj)

				todays_date = datetime.today()
				last_one_year = todays_date + timedelta(days=-365)           
				
				cursor.execute( '''SELECT COUNT(DISTINCT(cd.id)) as active_customers  FROM xl925_customer_details as cd
						INNER JOIN xl925_jmd_cust_servicing_details as csd on cd.id = csd.customer_id
						WHERE cd.outlet_id ={0} and csd.service_invoice_date <= '{1}' and  csd.service_invoice_date >= '{2}' '''.format(outletid,todays_date,last_one_year))
				active_customers = dictfetchall(cursor)[0]

				inactive_customers = number_of_cust - active_customers['active_customers']
				
				cursor.execute('''SELECT * FROM xl925_customer_details as cd INNER JOIN xl925_jmd_cust_servicing_details as csd on cd.id = csd.customer_id WHERE cd.outlet_id ={0} and 
					csd.service_invoice_date <= '{1}' '''.format(outletid,last_one_year))
				inact_cust = dictfetchall(cursor)
				
				temp = []
				for i in customers_obj:
					temp.append(i)
				
				reportObj = None
				if len(temp) > 0:
					paginator = Paginator(temp, 25)  # Show 25 contacts per page
					page = request.GET.get('page')
					try:
						reportObj = paginator.page(page)
					except PageNotAnInteger:
						# If page is not an integer, deliver first page.
						reportObj = paginator.page(1)
					except EmptyPage:
						# If page is out of range (e.g. 9999), deliver last page of results.
						reportObj = paginator.page(paginator.num_pages)
	if request.GET.get('number'):
		selected_cust = int(request.GET.get('number'))
	else:
		selected_cust = 100   
	typeSelected = "my"
	
	if request.method == 'POST':
		postdata = request.POST.copy()
		press_btn = postdata.get("press_btn", None)
		customerid = postdata.get("customer_id", None)
		offerid = postdata.get("offer_id", None)
		display_department_date = postdata.get("filter_by_department", None) 
		customerdelete = postdata.get("customerdelete",None)
		custid = postdata.get("custid",None)
		print(custid)
		print(customerdelete)
		print('nsdalndskalksakllj')
		search = postdata.get("customer_search", None)
		print(search)
		try:
			outlet_info = get_object_or_404(outlet_details, id = request.session.get('outlet_id'))
		except:
			outlet_info = None

		outlet_info.customer_search_text=search
		outlet_info.save()  
		 

		if press_btn == "filter_by_area":
			
			area_name = postdata.get('filter_type',None)
			area_text = area_name
			if area_name:
				if outletObj.is_jmd != True:
					cursor.execute(''' SELECT cd.id, cd.phone_no, cd.customer_name, cd.entry_point, cd.email, cd.outlet_id,cd.area_building
								FROM `xl925_customer_details` as cd
								WHERE cd.outlet_id = {0} AND (cd.area_building LIKE '%{1}%' ) '''.format(
								outletid, area_name))                
					customers_list = dictfetchall(cursor)
					customers_obj = dictfetchall(cursor)

		
		
		if outletObj.is_jmd == True: 
			if postdata.get("display_days"):
				if postdata.get("display_days") == "all":
					selected_days = "all"                                    
				else :    
					selected_days = int(postdata.get("display_days"))                                  
					days = todays_date + timedelta(days=selected_days)           
					cursor = connection.cursor()               
					cursor.execute( '''SELECT cd.id as cust_id, cd.phone_no, cd.customer_name, cd.entry_point, cd.email, cd.outlet_id,jcv.vehicle_number,ci.service_invoice_date
							FROM xl925_jmd_cust_servicing_details as ci
							INNER JOIN xl925_customer_details as cd   ON    cd.id =ci.customer_id
							INNER JOIN xl925_jmd_customers_vehicle as jcv
							on jcv.id = ci.vehicle_id
							WHERE service_expiry_date >= '{0}' AND  service_expiry_date <= '{1}' And cd.outlet_id={2}
							GROUP BY ci.customer_id '''.format(todays_date,days,outletid))
					customers_obj = dictfetchall(cursor)            
		if press_btn == "SUBMIT"  : 
			from_date = postdata.get('from_date',None)
			
			if from_date and from_date != "" :
				from_date = datetime.strptime(from_date, '%d-%m-%Y')
				display_from_date = from_date
				from_date = from_date.strftime('%Y-%m-%d %H:%M:%S') 
			to_date = postdata.get('to_date',None)
			if to_date and to_date != "" :
				to_date = datetime.strptime(to_date, '%d-%m-%Y')
				display_to_date = to_date
				to_date = to_date.strftime('%Y-%m-%d %H:%M:%S')
			cursor.execute( '''SELECT cd.id as cust_id, cd.is_trash, cd.phone_no, cd.customer_name, cd.entry_point, cd.email, cd.outlet_id,jcv.vehicle_number,ci.service_invoice_date, ji.policy_purchase_date,
							 (select created_at from xl925_jmd_notification_reminder_details where customer_id = cd.id and is_reminder = True order by created_at DESC limit 1) as reminder_last_sent_date,
							 (select created_at from xl925_jmd_notification_reminder_details where customer_id = cd.id and is_notification = True order by created_at DESC limit 1) as notification_last_sent_date,
							 (select created_at from xl925_jmd_notification_reminder_details where customer_id = cd.id and is_offer = True order by created_at DESC limit 1) as offer_last_sent_date,
							 (select service_invoice_date from xl925_jmd_cust_servicing_details where user_id = cd.user_id  order by service_invoice_date DESC limit 1) as service_invoice_date,
							 (select policy_expiry_date FROM `xl925_jmd_cust_insurance_details` where user_id = cd.user_id order by `policy_expiry_date` DESC limit 1) as policy_expiry_date,
							 (select policy_purchase_date FROM `xl925_jmd_cust_insurance_details` where user_id = cd.user_id order by `policy_purchase_date` DESC limit 1) as policy_purchase_date
							 FROM xl925_customer_details  as cd
							 LEFT  JOIN xl925_jmd_customers_vehicle as jcv on jcv.customer_id =cd.id
							 LEFT JOIN xl925_jmd_cust_servicing_details as ci on ci.customer_id = cd.id LEFT JOIN xl925_jmd_cust_insurance_details as ji on ji.customer_id=cd.id
							 WHERE ci.service_invoice_date >= '{0}' AND  ci.service_invoice_date <= '{1}' AND cd.outlet_id ={2} 
							 GROUP BY ci.customer_id '''.format(from_date,to_date,outletid))
			customers_obj = dictfetchall(cursor) 

		
  
		if press_btn == "SEND_NOTIFICATION":
			broadcastObj = BroadcastClass()
			respObj = broadcastObj.sendNotificationEmail(request, outletid, customerid, offerid)
			if respObj['status'] == "success":
				messages.add_message(request, messages.SUCCESS, respObj['message'], fail_silently=True)
				return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
			else:
				messages.add_message(request, messages.ERROR, respObj['message'],fail_silently=True)
				return HttpResponseRedirect(request.META.get('HTTP_REFERER'))

		if press_btn == "SEND_SMS":
			broadcastObj = BroadcastClass()
			respObj = broadcastObj.sendNotificationSMS(request, outletid, customerid, offerid)
			if respObj['status'] == "success":
				messages.add_message(request, messages.SUCCESS, respObj['message'], fail_silently=True)
				return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
			else:
				messages.add_message(request, messages.ERROR, respObj['message'],fail_silently=True)
				return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
		elif press_btn == 'SEARCH':
			search_txt = postdata.get('customer_search', None)
			if search_txt:
				if outletObj.is_jmd != True:
					cursor.execute(''' SELECT cd.id, cd.phone_no, cd.customer_name, cd.entry_point, cd.email, cd.outlet_id
								FROM `xl925_customer_details` as cd
								WHERE cd.outlet_id = {0} AND (cd.phone_no LIKE '%{1}%' OR cd.customer_name LIKE '%{1}%' OR cd.email LIKE '%{1}%') '''.format(
								outletid, search_txt))                
					customers_list = dictfetchall(cursor)
				elif outletObj.is_jmd == True:  

					#14-10-2019start
					cursor.execute('''SELECT cd.id as cust_id,cd.is_trash, cd.phone_no, cd.customer_name, cd.entry_point, cd.email, cd.outlet_id ,jcv.vehicle_number, ji.policy_purchase_date,  (select created_at from xl925_jmd_notification_reminder_details where customer_id = cd.id and is_reminder = True order by created_at DESC limit 1) as reminder_last_sent_date,
									(select created_at from xl925_jmd_notification_reminder_details where customer_id = cd.id and is_notification = True order by created_at DESC limit 1) as notification_last_sent_date,
									(select created_at from xl925_jmd_notification_reminder_details where customer_id = cd.id and is_offer = True order by created_at DESC limit 1) as offer_last_sent_date,
									(select service_invoice_date from xl925_jmd_cust_servicing_details where user_id = cd.user_id  order by service_invoice_date DESC limit 1) as service_invoice_date,
									(select policy_expiry_date FROM `xl925_jmd_cust_insurance_details` where user_id = cd.user_id order by `policy_expiry_date` DESC limit 1) as policy_expiry_date,
									(select policy_purchase_date FROM `xl925_jmd_cust_insurance_details` where user_id = cd.user_id order by `policy_purchase_date` DESC limit 1) as policy_purchase_date
					from `xl925_customer_details` as cd inner join `xl925_jmd_customers_vehicle` as jcv on jcv.customer_id = cd.id 
					LEFT JOIN xl925_jmd_cust_servicing_details as ci on ci.customer_id = cd.id 
					LEFT JOIN xl925_jmd_cust_insurance_details as ji on ji.customer_id = cd.id
					where cd.outlet_id in (408,423) and (cd.phone_no LIKE '%{0}%' OR cd.customer_name LIKE '%{0}%' OR cd.email LIKE '%{0}%') '''.format(search_txt))
				        
					customers_obj = dictfetchall(cursor)
					
		elif press_btn == 'EXPORT':
			# export(request,postdata,outletid)     
			display_department_date = postdata.get("filter_by_department", None)
			search_txt = postdata.get('customer_search', None)
			if search_txt.strip() == "":
				search_txt = None
			selected_days = postdata.get("display_days")
			from_date = postdata.get('from_date',None)      
			if from_date.strip() == "":
				from_date = None
			to_date = postdata.get('to_date',None)  
			if to_date.strip() == "":
				to_date = None
			# url = reverse('customers:export_to_csv',kwargs={'display_department_date': str(display_department_date),"search_txt":str(search_txt),"selected_days":str(selected_days),"from_date":str(from_date),"to_date":str(to_date)})
			url = reverse('customers:export_to_csv',kwargs={'display_department_date': display_department_date,"search_txt":search_txt,"selected_days":selected_days,"from_date":from_date,"to_date":to_date})
			return HttpResponseRedirect(url)               
			

		if postdata.get("display_cust"):    
			selected_cust = int(postdata.get("display_cust"))

	
		if display_department_date and display_department_date != "all":
			customers_obj_temp = customers_obj
			customers_obj = [] 
			for data in customers_obj_temp:
				if display_department_date == "service_invoice_date":
					if data['service_invoice_date'] == None or data['service_invoice_date'] == "" :
						customers_obj.append(data)  
				elif display_department_date == "insurance_policy_date" :
					if data['policy_expiry_date'] == None or data['policy_expiry_date'] == "" :
						customers_obj.append(data)  
				elif display_department_date == "both" :                            
					if data['policy_expiry_date'] != None and data['policy_expiry_date'] != "" and data['service_invoice_date'] != None and data['service_invoice_date'] != "":
						customers_obj.append(data)
				elif display_department_date == "insurance_from_jmd":           #11-10-2019 (only one condition applied ie. insurance policy expiry date)
					if data['policy_expiry_date'] != None or data['policy_expiry_date'] != "" and data['policy_purchase_date'] != None and data['policy_purchase_date'] != "":
						customers_obj.append(data)
				#uncomment it when there is policy purchase date available with policy expiry date and comment the above elif 
				# elif display_department_date == "insurance_from_jmd":
				#     if data['policy_expiry_date'] != None or data['policy_expiry_date'] != "" and data['policy_purchase_date'] != None or data['policy_purchase_date'] != "":
				#         customers_obj.append(data)
				elif display_department_date == "insurance_from_others":        #11-10-2019 done
					if data['vehicle_id'] == None or data['vehicle_id'] == "":
						if data['policy_expiry_date'] != None and data['policy_expiry_date'] != "" and data['service_invoice_date'] != None and data['service_invoice_date'] != "":
							if data['policy_purchase_date'] == None or data['policy_purchase_date'] == "":
								customers_obj.append(data)

				elif display_department_date == "insurance_cust":        #11-10-2019 done
					if data['outlet_id'] == 408:
						customers_obj.append(data)

				elif display_department_date == "service_cust":
					if data['outlet_id'] == 423:
						customers_obj.append(data)

		print('oooooooooooooooooooooooooooooooo')
		if custid:
			print('sadjsahjdhsalkoooooooooooooooooooo')
			deletecustobj = get_object_or_404(customer_details, id=custid)
			# sub_xircle_infoobj = finance_details.objects.filter(id=11)
			print(deletecustobj)
			print('fdjsjkdhofiaspsj')
			print(deletecustobj.is_trash)
			deletecustobj.is_trash = 1

			# print(deleteobj.is_trash)
			# sub_xircle_infoobj.is_trash=1
			print('fdjsjkdhofiaspsj')
			deletecustobj.save()
			messages.add_message(request, messages.SUCCESS, 'Your Customer is successfully deleted',fail_silently=True)
			url = reverse('customers:get_my_customers')
			return HttpResponseRedirect(url)

		elif postdata.get('type') == "my":
			
			pass
			print("[LeadDash] After For")
				
			
		
		elif postdata.get('type') == "every":
			typeSelected = 'every'
			customers_obj = customer_details.objects.filter(outlet_id=outletid,is_trash=0)
			return render(request,template_name,locals())
	customers_obj1 = []             
				
	if request.GET.get('page'):
		page = int(request.GET.get('page'))
		display_department_date = request.GET.get('filter')
		print(display_department_date)
		print("YAHOOOOOOOOOO")

		if display_department_date and display_department_date != "all":
			customers_obj_temp = customers_obj
			
			for data in customers_obj_temp:
				if display_department_date == "service_invoice_date":
					print("SERVICE INVOICE DATEEEEEEEEEEEEEEE")
					if data['service_invoice_date'] == None or data['service_invoice_date'] == "" :

						customers_obj1.append(data)  
				elif display_department_date == "insurance_policy_date" :
					print("insurance_policy_date")
					if data['policy_expiry_date'] == None or data['policy_expiry_date'] == "" :
						print("insurance_policy_date")
						customers_obj1.append(data)  
				elif display_department_date == "both" : 
					print("both")                           
					if data['policy_expiry_date'] != None and data['policy_expiry_date'] != "" and data['service_invoice_date'] != None and data['service_invoice_date'] != "":
						customers_obj1.append(data)
				elif display_department_date == "insurance_from_jmd":           #11-10-2019 (only one condition applied ie. insurance policy expiry date)
					print("insurance_from_jmd")
					if data['policy_expiry_date'] != None or data['policy_expiry_date'] != "" and data['policy_purchase_date'] != None and data['policy_purchase_date'] != "":
						customers_obj1.append(data)
				#uncomment it when there is policy purchase date available with policy expiry date and comment the above elif 
				# elif display_department_date == "insurance_from_jmd":
				#     if data['policy_expiry_date'] != None or data['policy_expiry_date'] != "" and data['policy_purchase_date'] != None or data['policy_purchase_date'] != "":
				#         customers_obj.append(data)
				elif display_department_date == "insurance_from_others":        #11-10-2019 done
					if data['vehicle_id'] == None or data['vehicle_id'] == "":
						if data['policy_expiry_date'] != None and data['policy_expiry_date'] != "" and data['service_invoice_date'] != None and data['service_invoice_date'] != "":
							if data['policy_purchase_date'] == None or data['policy_purchase_date'] == "":
								customers_obj1.append(data)


				elif display_department_date == "insurance_cust":        #11-10-2019 done
					print("CCCCCCCCCCCCCCCC")
					if data['outlet_id'] == 408:
						customers_obj1.append(data)

				elif display_department_date == "service_cust":        #11-10-2019 done
					print("CCCCCCCCCCCCCCCC")
					if data['outlet_id'] == 423:
						customers_obj1.append(data)
		print(len(customers_obj1),"XXXXXXXXXXXXXXXXXXXXXXXXXXXXXx")

	else:
		page = 1     
	
	if outletObj.is_jmd == True:
		print("SSSSSSSSSSSSSSSSss")
		#print(customers_obj)
		print(selected_cust)
		if customers_obj1:
			#paginator = Paginator(customers_obj1, selected_cust) # Show 25 contacts per page
			customers_obj = customers_obj1
		else:
			#paginator = Paginator(customers_obj, selected_cust)
			customers_obj = customers_obj
	return render(request,template_name,locals())

class Echo(object):
	"""An object that implements just the write method of the file-like
	interface.
	"""
	def write(self, value):
		"""Write the value by returning it, instead of storing in a buffer."""
		return value

def export_to_csv(request,display_department_date="",search_txt="",selected_days="",from_date="",to_date=""):
            
    outletid = request.session.get('outlet_id')
    
    if (search_txt is not None and search_txt.strip() == "") or search_txt == "None":

        search_txt = None
    
    if from_date and from_date != "" and from_date != "None":
        from_date = datetime.strptime(from_date, '%d-%m-%Y').date()        
    else:
        from_date = None     

    if to_date and to_date != "" and to_date != "None":
        to_date = datetime.strptime(to_date, '%d-%m-%Y').date()
    else:
        to_date = None  


    customerObj = CustomerClass()    
    customers_obj = customerObj.getJMDAllCustomers(outletid)

    customer_filter = []
    for customers_data in customers_obj:
        match = True
        if search_txt is not None:
            search_txt = search_txt.lower()

            if search_txt in customers_data['customer_name'].lower() or search_txt in customers_data['email'].lower() or  search_txt in customers_data['phone_no'].lower() or  search_txt in customers_data['vehicle_number'].lower() :
                pass
            else:
                match = False

        if selected_days is not None and selected_days != "all":
            todays_date = datetime.today()        
            days = todays_date + timedelta(days=int(selected_days))
            # print(todays_date,days,customers_data['service_expiry_date'])
            if customers_data['service_expiry_date']:
                if customers_data['service_expiry_date'] >= todays_date and customers_data['service_expiry_date'] <= days :
                    pass
                else:
                    match = False
            else:
                match = False  

        if from_date != None and to_date != None:
            if customers_data['service_invoice_date'] != None:
                if customers_data['service_invoice_date'].date() >= from_date and customers_data['service_invoice_date'].date() <= to_date :
                    pass
                else:
                    match = False  
            else:
                match = False       

        if display_department_date != None and display_department_date != "all" :
            if display_department_date == "service_invoice_date":
                if customers_data['service_invoice_date'] == None or customers_data['service_invoice_date'] == "" :
                    pass
                else:
                    match = False      
            elif display_department_date == "insurance_policy_date" :
                if customers_data['policy_expiry_date'] == None or customers_data['policy_expiry_date'] == "" :
                    pass
                else:
                    match = False    
            elif display_department_date == "both" :                            
                if customers_data['policy_expiry_date'] != None and customers_data['policy_expiry_date'] != "" and customers_data['service_invoice_date'] != None and customers_data['service_invoice_date'] != "":
                    pass
                else:
                    match = False  
            elif display_department_date == "insurance_from_others":
                if customers_data['vehicle_id'] == None or customers_data['vehicle_id'] == "":
                    if customers_data['policy_expiry_date'] != None and customers_data['policy_expiry_date'] != "" and customers_data['service_invoice_date'] != None and customers_data['service_invoice_date'] != "":
                        if customers_data['policy_purchase_date'] == None or customers_data['policy_purchase_date'] == "":
                            
                            pass
                else:
                    match = False
        

    
        if match == True:
            customer_filter.append(customers_data)   
            
    header = ["customer name","phone number","email","vehicle number","car model","service invoice date","service expiry date","policy expiry date","repair_type"]

    rows = []
    rows.append(header)
    for data in customer_filter:        
        temp = []
        if data['customer_name'] != None:
            temp.append(data['customer_name'].strip())
        else:
            temp.append(data['customer_name'])

        if data['phone_no'] != None:    
            temp.append(data['phone_no'].strip())
        else:    
            temp.append(data['phone_no'])

        if data['email'] != None:    
            temp.append(data['email'].strip())
        else:    
            temp.append(data['email'])

        if data['vehicle_number'] != None:    
            temp.append(data['vehicle_number'].strip())
        else:
            temp.append(data['vehicle_number'])

        if data['car_model'] != None:    
            temp.append(data['car_model'].strip())
        else:    
            temp.append(data['car_model'])


        if data['service_invoice_date'] and data['service_invoice_date'] != "" :
            service_invoice = data['service_invoice_date'].date()
            service_invoice = service_invoice.strftime('%d-%m-%Y')
        else:
            service_invoice = None     
        temp.append(service_invoice)


        if data['service_expiry_date'] and data['service_expiry_date'] != "" :
            service_expiry = data['service_expiry_date'].date()
            service_expiry = service_expiry.strftime('%d-%m-%Y')
        else:
            service_expiry = None     
        temp.append(service_expiry)


        if data['policy_expiry_date'] and data['policy_expiry_date'] != "" :
            policy_expiry = data['policy_expiry_date'].date()
            policy_expiry = policy_expiry.strftime('%d-%m-%Y')
        else:
            policy_expiry = None     
        temp.append(policy_expiry)


        if data['repair_type'] and data['policy_expiry_date'] != "" :
            repair_type = data['repair_type']
        else:
            repair_type = None     
        temp.append(repair_type)


        rows.append(temp)
    
    pseudo_buffer = Echo()
    writer = csv.writer(pseudo_buffer)
    
    response = StreamingHttpResponse((writer.writerow(row) for row in rows),
                                    content_type="text/csv")
    if request.session.get('is_jmd_servicing'):
        response['Content-Disposition'] = 'attachment; filename="XIRCLS_Export_Servicing.csv"'
    elif request.session.get('is_jmd_insurance'):
        response['Content-Disposition'] = 'attachment; filename="XIRCLS_Export_Insurance.csv"'
    else:
        response['Content-Disposition'] = 'attachment; filename="XIRCLS_Export_Sheet.csv"'    
    
    return response
	
@login_required(login_url='/merchant-login/')
# @redirectMerchantAsPerProgress("MY_CUSTOMERS")
@multi_user_permission('add', 'Vehicle')
@permission_required(['customers.add_customer_details','customers.change_customer_details','customers.delete_customer_details'],raise_exception=True)
def jmd_add_vehicle_customers_list(request, template_name='merchant_site/customers/jmd_add_vehicle.html'):
	active_page_name = "add_vehicle_page"
	if request.session.get('is_logged_in_superuser') == False:
		outlet_list = outlet_details.objects.filter(id__in=request.session.get('allowed_outlets_list'),company_id = request.session.get('company_id'),is_active=1,is_verified = 1)
	elif request.session.get('is_logged_in_superuser') == True:
		outlet_list = outlet_details.objects.filter(company_id = request.session.get('company_id'),is_active=1,is_verified = 1)
	
	cursor = connection.cursor()

	offersObj = getOutletOffers(request)

	outletid = None
	if request.session.get('outlet_id') and outletid == None:
		outletid = int(request.session.get('outlet_id'))    
 
	if outletid:
		try:
			outletObj = get_object_or_404(outlet_details, id = outletid)
		except:
			outletObj = None

		customers_list = customer_details.objects.filter(outlet_id=outletid).order_by('customer_name')
		customerObj = CustomerClass()

		if outletObj.is_jmd == True: 
			template_name='merchant_site/customers/JMD_add_vehicle.html'     
			
			try:
				for_user_id = request.session.get('user_obj')
			except:
				for_user_id = None
			customers_obj = customerObj.get_outlet_vehicle_customers(outletObj.id)
		elif outletObj.is_outlet_vehicle:
			customers_obj = customerObj.get_outlet_vehicle_customers(outletObj.id)                                
	else:
		customers_obj = None   
	
	 
	if request.method == 'POST':
		postdata = request.POST.copy()
		press_btn = postdata.get("press_btn", None)
		customerid = postdata.get("customer_id", None)
		offerid = postdata.get("offer_id", None)
		
		if press_btn == "SEND_NOTIFICATION":
			broadcastObj = BroadcastClass()
			respObj = broadcastObj.sendNotificationEmail(request, outletid, customerid, offerid)
			if respObj['status'] == "success":
				messages.add_message(request, messages.SUCCESS, respObj['message'], fail_silently=True)
				return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
			else:
				messages.add_message(request, messages.ERROR, respObj['message'],fail_silently=True)
				return HttpResponseRedirect(request.META.get('HTTP_REFERER'))

		if press_btn == "SEND_SMS":
			broadcastObj = BroadcastClass()
			respObj = broadcastObj.sendNotificationSMS(request, outletid, customerid, offerid)
			if respObj['status'] == "success":
				messages.add_message(request, messages.SUCCESS, respObj['message'], fail_silently=True)
				return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
			else:
				messages.add_message(request, messages.ERROR, respObj['message'],fail_silently=True)
				return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
		elif press_btn == 'SEARCH':

			search_txt = postdata.get('customer_search', None)
			print(postdata)
			if search_txt:                                
				cursor.execute(''' SELECT cd.id as cust_id, cd.phone_no, cd.customer_name, cd.entry_point, cd.email, cd.outlet_id
							FROM `xl925_customer_details` as cd
							WHERE cd.outlet_id = {0} AND (cd.phone_no LIKE '%{1}%' OR cd.customer_name LIKE '%{1}%' OR cd.email LIKE '%{1}%') '''.format(
							outletid, search_txt))                
				customers_obj = dictfetchall(cursor)                

	if not customers_obj:
		customers_obj = None  

	if customers_obj:            
		paginator = Paginator(customers_obj, 100) # Show 100 contacts per page
		page = request.GET.get('page')
		try:
			customers_obj = paginator.page(page)
		except PageNotAnInteger:
			# If page is not an integer, deliver first page.
			customers_obj = paginator.page(1)
		except EmptyPage:
			# If page is out of range (e.g. 9999), deliver last page of results.
			customers_obj = paginator.page(paginator.num_pages)                         

	return render(request,template_name,locals())

@login_required(login_url='/merchant-login/')
@redirectMerchantAsPerProgress("MY_CUSTOMERS")
@multi_user_permission('add', 'Servicing')
@permission_required(['customers.add_customer_details','customers.change_customer_details','customers.delete_customer_details'],raise_exception=True)
def jmd_add_servicing_customers_list(request, template_name='merchant_site/customers/jmd_add_servicing.html'):
	active_page_name = "add_servicing_page"

	if request.session.get('is_logged_in_superuser') == False:
		outlet_list = outlet_details.objects.filter(id__in=request.session.get('allowed_outlets_list'),company_id = request.session.get('company_id'),is_active=1,is_verified = 1)
	elif request.session.get('is_logged_in_superuser') == True:
		outlet_list = outlet_details.objects.filter(company_id = request.session.get('company_id'),is_active=1,is_verified = 1)
	
	cursor = connection.cursor()

	offersObj = getOutletOffers(request)

	outletid = None
	if request.session.get('outlet_id') and outletid == None:
		outletid = int(request.session.get('outlet_id'))    
 
	if outletid:
		try:
			outletObj = get_object_or_404(outlet_details, id = outletid)
		except:
			outletObj = None
		
		customers_list = customer_details.objects.filter(outlet_id=outletid).order_by('customer_name')
		customerObj = CustomerClass()
		try:
			for_user_id = request.session.get('user_obj')
		except:
			for_user_id = None
		if outletObj.is_jmd == True:
			template_name='merchant_site/customers/JMD_add_servicing.html'
			customers_obj = customerObj.getJMDAllCustomers(outletObj.id,for_user_id)
		elif outletObj.is_outlet_vehicle:
			customers_obj = customerObj.get_outlet_vehicle_customers(outletObj.id)                
	else:
		customers_obj = None  
		page= "new_merchant_base.html"
 
	
	 
	if request.method == 'POST':
		postdata = request.POST.copy()
		press_btn = postdata.get("press_btn", None)
		customerid = postdata.get("customer_id", None)
		offerid = postdata.get("offer_id", None)
		
		if press_btn == "SEND_NOTIFICATION":
			broadcastObj = BroadcastClass()
			respObj = broadcastObj.sendNotificationEmail(request, outletid, customerid, offerid)
			if respObj['status'] == "success":
				messages.add_message(request, messages.SUCCESS, respObj['message'], fail_silently=True)
				return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
			else:
				messages.add_message(request, messages.ERROR, respObj['message'],fail_silently=True)
				return HttpResponseRedirect(request.META.get('HTTP_REFERER'))

		if press_btn == "SEND_SMS":
			broadcastObj = BroadcastClass()
			respObj = broadcastObj.sendNotificationSMS(request, outletid, customerid, offerid)
			if respObj['status'] == "success":
				messages.add_message(request, messages.SUCCESS, respObj['message'], fail_silently=True)
				return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
			else:
				messages.add_message(request, messages.ERROR, respObj['message'],fail_silently=True)
				return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
		elif press_btn == 'SEARCH':

			search_txt = postdata.get('customer_search', None)

			if search_txt:                

				cursor.execute(''' SELECT cd.id as cust_id, cd.phone_no, cd.customer_name, cd.entry_point, cd.email, cd.outlet_id
							FROM `xl925_customer_details` as cd
							WHERE cd.outlet_id = {0} AND (cd.phone_no LIKE '%{1}%' OR cd.customer_name LIKE '%{1}%' OR cd.email LIKE '%{1}%') '''.format(
							outletid, search_txt))                
				customers_obj = dictfetchall(cursor)

			 
	if not customers_obj:
		customers_obj = None       

	if customers_obj:            
		paginator = Paginator(customers_obj, 100) # Show 100 contacts per page
		page = request.GET.get('page')
		try:
			customers_obj = paginator.page(page)
		except PageNotAnInteger:
			# If page is not an integer, deliver first page.
			customers_obj = paginator.page(1)
		except EmptyPage:
			# If page is out of range (e.g. 9999), deliver last page of results.
			customers_obj = paginator.page(paginator.num_pages)       


				   
	return render(request,template_name,locals())

@login_required(login_url='/merchant-login/')
@redirectMerchantAsPerProgress("MY_CUSTOMERS")
@multi_user_permission('add', 'Insurance')
@permission_required(['customers.add_customer_details','customers.change_customer_details','customers.delete_customer_details'],raise_exception=True)
def jmd_add_insurance_customers_list(request, template_name='merchant_site/customers/jmd_add_insurance.html'):
	active_page_name = "add_insurance_page"
	pagename_string = request.GET.get('pagename')
	page_number = int(request.GET.get('page') if request.GET.get('page') else 1)	

	if request.session.get('is_logged_in_superuser') == False:
		outlet_list = outlet_details.objects.filter(id__in=request.session.get('allowed_outlets_list'),company_id = request.session.get('company_id'),is_active=1,is_verified = 1)
	elif request.session.get('is_logged_in_superuser') == True:
		outlet_list = outlet_details.objects.filter(company_id = request.session.get('company_id'),is_active=1,is_verified = 1)
	
	cursor = connection.cursor()

	offersObj = getOutletOffers(request)

	outletid = None
	if request.session.get('outlet_id') and outletid == None:
		outletid = int(request.session.get('outlet_id'))    

	if outletid:
		try:
			outletObj = get_object_or_404(outlet_details, id = outletid)
		except:
			outletObj = None
		customers_list = customer_details.objects.filter(outlet_id=outletid).order_by('customer_name')
		customerObj = CustomerClass()

		if outletObj.is_jmd == True:
			template_name='merchant_site/customers/JMD_add_insurance.html'

			try:
				for_user_id = request.session.get('user_obj')
			except:
				for_user_id = None
			
			customers_obj = customerObj.getJMDAllCustomers(outletObj.id,for_user_id)   
	else:
		customers_obj = None   
	
	if customers_obj:
		temp = []
		for i in customers_obj:
			temp.append(i)
		
		reportObj = None
		if len(temp) > 0:
			paginator = Paginator(temp, 25)  # Show 25 contacts per page
			page = request.GET.get('page')
			try:
				reportObj = paginator.page(page)
			except PageNotAnInteger:
				# If page is not an integer, deliver first page.
				reportObj = paginator.page(1)
			except EmptyPage:
				# If page is out of range (e.g. 9999), deliver last page of results.
				reportObj = paginator.page(paginator.num_pages)

	if request.method == 'POST':
		postdata = request.POST.copy()
		press_btn = postdata.get("press_btn", None)
		customerid = postdata.get("customer_id", None)
		offerid = postdata.get("offer_id", None)
		
		if press_btn == "SEND_NOTIFICATION":
			broadcastObj = BroadcastClass()
			respObj = broadcastObj.sendNotificationEmail(request, outletid, customerid, offerid)
			if respObj['status'] == "success":
				messages.add_message(request, messages.SUCCESS, respObj['message'], fail_silently=True)
				return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
			else:
				messages.add_message(request, messages.ERROR, respObj['message'],fail_silently=True)
				return HttpResponseRedirect(request.META.get('HTTP_REFERER'))

		if press_btn == "SEND_SMS":
			broadcastObj = BroadcastClass()
			respObj = broadcastObj.sendNotificationSMS(request, outletid, customerid, offerid)
			if respObj['status'] == "success":
				messages.add_message(request, messages.SUCCESS, respObj['message'], fail_silently=True)
				return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
			else:
				messages.add_message(request, messages.ERROR, respObj['message'],fail_silently=True)
				return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
		elif press_btn == 'SEARCH':

			search_txt = postdata.get('customer_search', None)

			if search_txt:
				cursor.execute(''' SELECT cd.id as cust_id, cd.phone_no, cd.customer_name, cd.entry_point, cd.email, cd.outlet_id
							FROM `xl925_customer_details` as cd
							WHERE cd.outlet_id = {0} AND (cd.phone_no LIKE '%{1}%' OR cd.customer_name LIKE '%{1}%' OR cd.email LIKE '%{1}%') '''.format(
							outletid, search_txt))                
				customers_obj = dictfetchall(cursor)

	if not customers_obj:
		customers_obj = None        

	if customers_obj:            
		paginator = Paginator(customers_obj, 100) # Show 100 contacts per page
		page = request.GET.get('page')
		try:
			customers_obj = paginator.page(page)
		except PageNotAnInteger:
			# If page is not an integer, deliver first page.
			customers_obj = paginator.page(1)
		except EmptyPage:
			# If page is out of range (e.g. 9999), deliver last page of results.
			customers_obj = paginator.page(paginator.num_pages)       
		

				   
	return render(request,template_name,locals())

@login_required(login_url='/merchant-login/')
@redirectMerchantAsPerProgress("ADD_CUSTOMER")
@permission_required(['customers.add_customer_details','customers.change_customer_details','customers.delete_customer_details'],raise_exception=True)
# @check_user_subcription('ADD_SINGLE_CUSTOMER')
##@multi_user_permission('Add_Customer')
@multi_user_permission('add', 'Customers')
def add_new_customers(request, template_name='merchant_site/customers/add_customer.html'):
	active_page_name = "add_customers_page"

	if request.session.get('is_logged_in_superuser') == False:
		outlet_list = outlet_details.objects.filter(id__in=request.session.get('allowed_outlets_list'),company_id = request.session.get('company_id'),is_active=1,is_verified = 1)
	elif request.session.get('is_logged_in_superuser') == True:
		outlet_list = outlet_details.objects.filter(company_id = request.session.get('company_id'),is_active=1,is_verified = 1)
	
	outletid = None
	if request.session.get('outlet_id') and outletid == None:
		outletid = int(request.session.get('outlet_id'))    

	try:
		outletObj = get_object_or_404(outlet_details, id = outletid)
	except:
		outletObj = None    

	country_obj = Country.objects.all()

	clients_account_obj = clients_account.objects.filter(outlet=outletid,is_trash=False)
	from json import dumps
	clients_account_list = []

	for cli in clients_account_obj:
		temp={}
		temp['comapny_id'] = cli.id
		temp['company_name'] = cli.company_name
		temp['company_phone'] = cli.company_phone
		temp['company_email'] = cli.company_email
		temp['company_website'] = cli.company_website
		temp['company_gst'] = cli.company_gst
		temp['company_fb'] = cli.company_fb
		temp['company_insta'] = cli.company_insta
		temp['company_twitter'] = cli.company_twitter
		temp['company_pancard'] = cli.company_pancard
		temp['com_address'] = cli.address_line1
		temp['com_street'] = cli.street
		temp['com_area_building'] = cli.area_building
		temp['com_city'] = cli.city
		temp['com_state'] = cli.state
		temp['com_pincode'] = cli.pincode
		temp['com_country_selection'] = cli.country
		temp['is_parent'] = cli.is_parent
		if cli.is_parent == True:
			temp['parent_id'] = str(cli.parent_id.id) if cli.parent_id else "None"
			
			new_Dictionary = temp
			 
		else:
			try:
				parent_id = cli.parent_id.id
				temp['parent_id'] = str(cli.parent_id.id)
				temp['par_comapny_id'] = cli.parent_id.id
				temp['par_company_name'] = cli.parent_id.company_name
				temp['par_industry'] = cli.parent_id.industry
				temp['par_company_phone'] = cli.parent_id.company_phone
				temp['par_company_email'] = cli.parent_id.company_email
				temp['par_company_website'] = cli.parent_id.company_website
				temp['par_company_gst'] = cli.parent_id.company_gst
				temp['par_company_fb'] = cli.parent_id.company_fb
				temp['par_company_insta'] = cli.parent_id.company_insta
				temp['par_company_twitter'] = cli.parent_id.company_twitter
				temp['par_company_pancard'] = cli.parent_id.company_pancard
				temp['par_com_address'] = cli.parent_id.address_line1
				temp['par_com_street'] = cli.parent_id.street
				temp['par_com_area_building'] = cli.parent_id.area_building
				temp['par_com_landmark'] = cli.parent_id.landmark
				temp['par_com_city'] = cli.parent_id.city
				temp['par_com_state'] = cli.parent_id.state
				temp['par_com_pincode'] = cli.parent_id.pincode
				temp['par_com_country_selection'] = cli.parent_id.country
				new_Dictionary = temp
			except:		
				parent_id = "None"
				temp['parent_id'] = parent_id 
				new_Dictionary = temp
			
		
			
			
		clients_account_list.append(new_Dictionary)
	clients_account_dataJSON = dumps(clients_account_list)

	if outletObj.is_jmd == True:        
		url = reverse('customers:jmd_add_new_customers')
		return HttpResponseRedirect(url)

	out_id = request.session.get('outlet_id')

	try:
		customer_group_obj = privilege_customer_groups.objects.filter(outlet=outletObj)
	except:
		customer_group_obj = None

	# car_details_obj = CarDetails.objects.filter(is_active=True)
	# if car_details_obj.count() == 0:
	#     car_details_obj = None    
				   
	if request.method == 'POST':
		postdata = request.POST.copy()
		print(postdata)

		press_btn = postdata.get('press_btn', None)
		selected_outletid = outletid
		title = postdata.get('title',None)
		cust_first_name = postdata.get('cust_first_name',None)
		cust_last_name = postdata.get('cust_last_name',None)
		cust_email = postdata.get('email',None)
		mobno = postdata.get('mob_no',None)
		landline1 = postdata.get('landline1',None)
		landline2 = postdata.get('landline2',None)
		cust_birth_date = postdata.get('birth_date',None)


		cust_gst_no = postdata.get('cust_gst_no',None)
		ship_address1 = postdata.get('shipping_address',None)
		ship_address2 = postdata.get('shipping_street',None)
		ship_landmark = postdata.get('shipping_landmark',None)
		ship_area_building = postdata.get('shipping_area_building',None)
		ship_cust_city = postdata.get('shipping_city',None)
		ship_state = postdata.get('shipping_state',None)
		ship_cust_pincode = postdata.get('shipping_pincode',None)
		ship_cust_country = postdata.get('shipping_country',None)

		industry = postdata.get('industry',None)
		designation = postdata.get('designation',None)
		company_phone = postdata.get('company_phone',None)
		company_email = postdata.get('company_email',None)
		company_website = postdata.get('company_website',None)
		ship_fname=postdata.get('shipping_cust_fname',None)
		ship_lname=postdata.get('shipping_cust_lname',None)

		
		privileged_opt = postdata.get("privileged") 
		company_name = postdata.get('comp_name',None)
		industry = postdata.get('industry',None)
		company_gst = postdata.get('company_gst',None)
		company_phone = postdata.get('company_phone',None)
		company_email = postdata.get('company_email',None)
		company_website = postdata.get('company_website',None)

		com_address = postdata.get('com_address',None)
		com_street = postdata.get('com_street',None)
		com_area_building = postdata.get('com_area_building',None)
		com_landmark = postdata.get('com_landmark',None)
		com_city = postdata.get('com_city',None)
		com_state = postdata.get('com_state',None)
		com_pincode = postdata.get('com_pincode',None)
		com_country = postdata.get('com_country',None)
		company_pancard = postdata.get('company_pancard_name',None)
		com_fb=postdata.get('company_facebook_link',None)
		com_insta=postdata.get('company_instagram_link',None)
		com_tw=postdata.get('company_twitter_link',None)
		company_pancard = postdata.get('company_pancard_name',None)


		if cust_birth_date and cust_birth_date != "":
			cust_birth_date = datetime.strptime(cust_birth_date, '%d-%m-%Y')
			cust_birth_date = cust_birth_date.strftime('%Y-%m-%d %H:%M:%S')
		else:
			cust_birth_date = None 

		dropdown = postdata.get('dropdown')
		print("------------ dropdown ---------",dropdown)  

		lates_cust_entry = customer_details.objects.latest("id")
		print(lates_cust_entry.id,"-----------")

		name_of_file =""
		name_of_file_pan = ""
		if lates_cust_entry:
			if postdata.get('is_aadhar_file') == '1':
				print(request.FILES['aadhar_file'],"===llooo")
				if request.FILES['aadhar_file']:
					image_file = request.FILES.get('aadhar_file')
					encodedImage = base64.b64encode(image_file.read())
					imageExt = str(image_file).split(".")
					data = base64.b64decode(encodedImage)
					save_path = SERVER_UPLOAD_URL+'customers/aadhar_file/'
					name_of_file = "cust_aadhar_" + str(lates_cust_entry.id+1)+ "_" + str(imageExt[0]) + "." + str(imageExt[1])
					completeImageName = os.path.join(save_path, name_of_file)
					file1 = open(completeImageName, "wb")
					file1.write(data)
					file1.close()
					# print("adhar pres",imageExt)
					# return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
			
			if postdata.get('is_pan_file') == '1':
				if request.FILES['pan_file']:
					image_file_pan = request.FILES.get('pan_file')
					encodedImage2 = base64.b64encode(image_file_pan.read())
					imageExt2 = str(image_file_pan).split(".")
					data2 = base64.b64decode(encodedImage2)
					save_path2 = SERVER_UPLOAD_URL+'customers/pancard_file/'
					name_of_file_pan = "cust_pan_"+ str(lates_cust_entry.id+1)+"_"+str(imageExt2[0])+"."+str(imageExt2[1])
					completeImageName2 = os.path.join(save_path2,name_of_file_pan)
					file2 = open(completeImageName2,"wb")
					file2.write(data2)
					file2.close() 

			name_of_user_profile = ""
			if postdata.get('is_user_profile') == '1':
				if request.FILES['user_profile_img']:
					image_user_profile = request.FILES.get('user_profile_img')
					encodedImage3 = base64.b64encode(image_user_profile.read())
					imageExt3 = str(image_user_profile).split(".")
					data3 = base64.b64decode(encodedImage3)
					save_path3 = SERVER_UPLOAD_URL+'customers/user_profile_img/'
					name_of_user_profile = "user_profile_img_"+ str(lates_cust_entry.id+1)+"_"+str(imageExt3[0])+"."+str(imageExt3[1])
					completeImageName3 = os.path.join(save_path3,name_of_user_profile)
					file3 = open(completeImageName3,"wb")
					file3.write(data3)
					file3.close()      
		                           
				
		if press_btn == 'SAVE' or press_btn == 'SAVE & CLOSE':
			cust_avail = check_customer_isAvailabel(request, selected_outletid, cust_email, mobno)
			if request.method == 'POST':
				postdata = request.POST.copy();

				if postdata.get('cust_type_dropdown') != '':
					cust_type_dropdown = postdata.get('cust_type_dropdown')
				else:
					cust_type_dropdown = 'Contact'

				if postdata.get('cust_status_dropdown') != '':
					cust_status_dropdown = postdata.get('cust_status_dropdown')
				else:
					cust_status_dropdown = 'Cold'

				# regular_customer = postdata.get('regular')
				# print("-------- aya kya reg ----------",regular_customer)

			 
			if cust_avail:                
				messages.add_message(request, messages.SUCCESS, 'This customer already exists in your database', fail_silently=True)
				return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
			 
			if cust_avail == False:
				if cust_email !=None and cust_email.strip() == "":
					cust_email = None

				if mobno != None and mobno.strip() == "":
					mobno = None   
				
				try:
					user_obj = get_object_or_404(User, Q(username=cust_email) | Q(username=mobno))
				except:
					user_obj = None

				try:
					cust_profile_obj = get_object_or_404(CustomerProfile, phone_no=mobno)
				except:
					cust_profile_obj = None

				if user_obj == None and cust_profile_obj == None:
					mac = get_mac()                                                                                
					if mobno:
						username = mobno
					elif cust_email:
						username = cust_email                                            
					pwd = 'XlC16269'+username+'XlC16269' #create a hash password with salt
					encrypt_pwd = make_password(pwd)           
					customer_user = User()
					customer_user.username = username
					customer_user.email = cust_email if cust_email else ''    
					customer_user.password = encrypt_pwd
					customer_user.is_active = 0
					customer_user.save()

					userid = customer_user.id 
					  
					profile = CustomerProfile()
					profile.user_id = customer_user
					profile.phone_no = mobno
					profile.desktop_mac_id = mac          
					profile.entry_point ='INDV'
					profile.ip_address = request.META.get('REMOTE_ADDR')
					profile.issuance_city = postdata.get('city',None)
					profile.issuance_country  = postdata.get('country',None)
					profile.issuance_pincode = postdata.get('pincode',None)
					profile.email_id = cust_email if cust_email != None else None
					profile.save()
					customer_user.groups.add(Group.objects.get(name='Customer'))
					  
				elif user_obj:
					userid = user_obj.id
					  
				elif cust_profile_obj:
					userid = cust_profile_obj.user_id_id

				print("+++++++++++++++++++++++++++++++ regular_customer", dropdown)
				if dropdown == 'regular' or dropdown == 'privi_group':
					customer_obj = customer_details()
					title = postdata.get('title',None)
					occupation = postdata.get('occupation',None)
					customer_obj.title = title 
					customer_obj.occupation = occupation
					customer_obj.phone_no = str(mobno)
					customer_obj.customer_name = cust_first_name + " " +cust_last_name
					customer_obj.email = cust_email
					customer_obj.landline1 = postdata.get('landline1',None)
					customer_obj.entry_point = 'INDV'
					customer_obj.created_by_id = request.user.id
					customer_obj.outlet_id = selected_outletid
					customer_obj.user_id = userid
					customer_obj.cust_dob = cust_birth_date
					customer_obj.address_line1 = postdata.get('address',None)
					customer_obj.address_line2= postdata.get('street',None)
					customer_obj.area_building = postdata.get('area_building',None)
					customer_obj.landmark = postdata.get('landmark',None)
					customer_obj.city = postdata.get('city',None)
					customer_obj.state = postdata.get('state',None)
					customer_obj.pincode = postdata.get('pincode',None)
					customer_obj.country = postdata.get('country',None)

					clients_account_id = postdata.get('select_comp_id',None)
					customer_obj.clients_account_id = clients_account_id
					customer_obj.clients_acc_id = clients_account_id
					##shipping##
					customer_obj.shipping_first_name = ship_fname.capitalize() 
					customer_obj.shipping_last_name = ship_lname.capitalize()
					customer_obj.shipping_address1 = postdata.get('shipping_address',None)
					customer_obj.shipping_address2= postdata.get('shipping_street',None)
					customer_obj.shipping_area_building = postdata.get('shipping_area_building',None)
					customer_obj.shipping_landmark = postdata.get('shipping_landmark',None)
					customer_obj.shipping_city = postdata.get('shipping_city',None)
					customer_obj.shipping_state = postdata.get('shipping_state',None)
					customer_obj.shipping_pincode = postdata.get('shipping_pincode',None)
					customer_obj.shipping_country = postdata.get('shipping_country',None)
					customer_obj.company_pancard = postdata.get("company_pancard_name")
					## shipping

					customer_obj.pancard = postdata.get('pancard_name',None)
					customer_obj.gender = postdata.get('gender',None)
					customer_obj.children = postdata.get('children',None)


					customer_obj.cust_type_dropdown = cust_type_dropdown
					customer_obj.cust_status_dropdown = cust_status_dropdown

					if customer_obj.children == 'Yes':
						customer_obj.NO_Of_Children = postdata.get('countchildren',None)
					else:
						customer_obj.NO_Of_Children = None
					
						
					customer_obj.company_name = company_name
					customer_obj.industry = industry
					customer_obj.designation = designation
					customer_obj.company_phone = company_phone
					customer_obj.company_email = company_email
					customer_obj.company_website = company_website

					customer_obj.social_fb = postdata.get("twitter_link",None)
					customer_obj.social_insta = postdata.get("facebook_link",None)
					customer_obj.social_twitter = postdata.get("instagram_link",None)

					customer_obj.landline2 = postdata.get('landline2',None)
					customer_obj.phone_no2 = postdata.get('mob_no2',None)
					customer_obj.company_fb = postdata.get('company_facebook_link',None)
					customer_obj.company_twitter = postdata.get('company_twitter_link',None)
					customer_obj.company_insta = postdata.get('company_instagram_link',None)
					customer_obj.company_gst  = postdata.get('company_gst',None)
					customer_obj.user_password  = postdata.get('cust_password',None)
					
					
					try:
						if request.session['multi_user_id']:
							multiUserObj = MultiUserDetails.objects.get(user = request.session['multi_user_id'])
							print("[AddCust] name:", multiUserObj.first_name)
							customer_obj.multi_user_id_id = multiUserObj.id
					except:
						pass
					
					if len(name_of_file) > 0:
						customer_obj.aadhar_pdf_file = "customers/aadhar_file/" + str(name_of_file)
			
					if len(name_of_file_pan) > 0:
						customer_obj.pan_pdf_file = "customers/pancard_file/" + str(name_of_file_pan)
					
					if len(name_of_user_profile) > 0:
						customer_obj.user_profile_img = "customers/user_profile_img/" + str(name_of_user_profile)

					customer_obj.Adharcard = postdata.get('Adharcard',None)
					customer_obj.marital_status = postdata.get('marital_status',None)

					marr_anni = postdata.get('marriage_anniversery')       
					if marr_anni and marr_anni != "":
						marr_anni = datetime.strptime(marr_anni, '%d-%m-%Y')
						marr_anni = marr_anni.strftime('%Y-%m-%d %H:%M:%S')
					else:
						marr_anni = None 
					customer_obj.marriage_anniversery = marr_anni                  
					customer_obj.category = postdata.get('employed',None)
					customer_obj.cust_gst_no = cust_gst_no
					print(postdata)

					customer_obj.customer_type = postdata.get("customer_type")
					
					customer_obj.save()

					customers_grouped_obj = customers_grouped()

					try:
						out_id_obj = get_object_or_404(outlet_details, id=out_id)
					except:
						out_id_obj = None

					customers_grouped_obj.outlet_id = out_id_obj
					if dropdown == 'regular':
						customers_grouped_obj.is_regular = "1"
					elif dropdown == 'privi_group':
						customers_grouped_obj.is_privileged = "1"
					else:
						pass
					customers_grouped_obj.customer_id = customer_obj.id
					customers_grouped_obj.save()

					if dropdown == 'privi_group':

						if request.method == 'POST':
							postdata = request.POST.copy();
							sub_group = postdata.get('priv_sub_group')

							privileged_customers_subgroup_obj = privileged_customers_subgroup()

							try:
								outlet_obj = get_object_or_404(outlet_details,id = out_id)
							except:
								outlet_obj = None                               
							privileged_customers_subgroup_obj.outlet_id = outlet_obj

							try:
								priv_cust = get_object_or_404(customers_grouped, id =customers_grouped_obj.id)
							except:
								priv_cust = None
							privileged_customers_subgroup_obj.cust_group_id = priv_cust

							try:
								group_name_obj = get_object_or_404(privilege_customer_groups,id=sub_group)
							except:
								group_name_obj = None

							if group_name_obj:
								privileged_customers_subgroup_obj.sub_group_name = group_name_obj.group_name
								privileged_customers_subgroup_obj.privilege_cust_group = group_name_obj

							privileged_customers_subgroup_obj.customer_id = customer_obj.id


							privileged_customers_subgroup_obj.save()

				'''save customer'''
				# customer_obj = customer_details()
				# customer_obj.phone_no = mobno
				# customer_obj.customer_name = cust_first_name + " " +cust_last_name
				# customer_obj.email = cust_email
				# customer_obj.landline1 = postdata.get('landline1',None)
				# customer_obj.entry_point = 'INDV'
				# customer_obj.created_by_id = request.user.id
				# customer_obj.outlet_id = selected_outletid
				# customer_obj.user_id = userid
				# customer_obj.cust_dob = cust_birth_date
				# customer_obj.address_line1 = postdata.get('address',None)
				# customer_obj.address_line2= postdata.get('street',None)
				# customer_obj.area_building = postdata.get('area_building',None)
				# customer_obj.landmark = postdata.get('landmark',None)
				# customer_obj.city = postdata.get('city',None)
				# customer_obj.state = postdata.get('state',None)
				# customer_obj.pincode = postdata.get('pincode',None)
				# customer_obj.country = postdata.get('country',None)
				# customer_obj.pancard = postdata.get('pancard_name',None)
				# customer_obj.gender = postdata.get('gender',None)
				# customer_obj.children = postdata.get('children',None)
				# if customer_obj.children == 'Yes':
				#     customer_obj.NO_Of_Children = postdata.get('countchildren',None)
				# else:
				#     customer_obj.NO_Of_Children = None

				# customer_obj.Adharcard = postdata.get('Adharcard',None)
				# customer_obj.marital_status = postdata.get('marital_status',None)
				# # marr_anni=datetime.now()
				# marr_anni = postdata.get('marriage_anniversery')
				# print(marr_anni,"==========================")
				# # if postdata.get('marriage_anniversery'):
				# if marr_anni and marr_anni != "":
				#     marr_anni = datetime.strptime(marr_anni, '%d-%m-%Y')
				#     marr_anni = marr_anni.strftime('%Y-%m-%d %H:%M:%S')
				# else:
				#     marr_anni = None 


				#     # anni=postdata.get('marriage_anniversery')
				#     # print(anni)

				#     # marr_anni = datetime.strptime(anni,"%Y-%m-%d").strftime("%Y-%m-%d")
				#     #marr_anni=anni.strftime("%Y-%m-%d")
				# customer_obj.marriage_anniversery = marr_anni
				# print("-----------------------------------------------LOLOLOLOLOLOLOLOL-----------------------------------------------------",customer_obj.marriage_anniversery, marr_anni)
				# customer_obj.occupation = postdata.get('occupation',None)
				# customer_obj.category = postdata.get('employed',None)
				# print(postdata)
				
				# # Added for jmd only
				# # customer_obj.landline1 = landline1
				# # customer_obj.landline2 = landline2
				# # customer_obj.cust_dob = cust_birth_date
				# # customer_obj.city = cust_city
				# # customer_obj.country = cust_country
				# # customer_obj.landmark = landmark
				# # customer_obj.pincode = cust_pincode
				# # customer_obj.state = state
				# # customer_obj.area_building = area_building
				# # customer_obj.address_line1 = address1
				# # customer_obj.address_line2 = address2
				# customer_obj.save()

				try:
					print('ADDDDDDDDDDDDDDDDDDDDDDINGGGGGGGGGGGG')
					if request.session['multi_user_id']:
						multiUserId = request.session['multi_user_id']
						print('MULLLLLLTIIII---->',multiUserId)
						multiUserObj = MultiUserDetails.objects.get(user = multiUserId)
						multiUserObj.totalInt = int(multiUserObj.totalInt) + 1
						multiUserObj.save()
						today = datetime.now()
						taskDb = task_details.objects.filter(taskType__name = "Add Customer",start_date__lte=today, due_date__gte = today).exclude(status = "Completed")
						for task in taskDb:
							print("[TASK]", task.task_name, task.assign_to)
							if task.assign_to == "User":
								print("[TASK] In User")
								print("[TASK]", multiUserObj)
								if task.assignToUser == multiUserObj:
									print("[TASK] In User if")
									if int(task.remaining) > 0:
										task.remaining = int(task.remaining) - 1
										if int(task.remaining) > 0:
											task.status = "In Process"
										else:
											task.status = "Completed"
									task.save()
							elif task.assign_to == "Dept":
								print("[TASK] In Dept")
								print("[TASK]", multiUserObj.first_name)
								deptObj = Multipartment.objects.get(user = multiUserObj)
								if task.assignToDept == deptObj.dept:
									if int(task.remaining) > 0:
										print("[TASK] In Dept if")
										task.remaining = int(task.remaining) - 1
										if int(task.remaining) > 0:
											task.status = "In Process"
										else:
											task.status = "Completed"
							elif task.assign_to == "subDept":
								print("[TASK] In subDept")
								print("[TASK]", multiUserObj.first_name)
								deptObj = Multipartment.objects.get(user = multiUserObj)
								if task.assignToSub == deptObj.subDept:
									if int(task.remaining) > 0:
										print("[TASK] In subDept if")
										task.remaining = int(task.remaining) - 1
										if int(task.remaining) > 0:
											task.status = "In Process"
										else:
											task.status = "Completed"
							notes = f'{multiUserObj.first_name} Added Customer {customer_obj.customer_name}'
							print('CHEKKKCKKDIFNKSDJA------>',notes)
							history_obj = task_history(task=task,notes=notes,type_id=customer_obj.id, user=multiUserObj)
							history_obj.save()
							task.save()
				except Exception as e:
					print("[TASK] Exception:", e)
				
				messages.add_message(request, messages.SUCCESS, 'Your customer was added successfully', fail_silently=True)

				if press_btn == 'SAVE':
					url = reverse('customers:edit_customers', kwargs={'custCode': customer_obj.id})
					return HttpResponseRedirect(url)
				elif press_btn == 'SAVE & CLOSE':
					url = reverse('customers:get_my_customers')
					return HttpResponseRedirect(url)
			
	return render(request,template_name,locals())


@login_required(login_url='/merchant-login/')
@redirectMerchantAsPerProgress("ADD_CUSTOMER")
@permission_required(['customers.add_customer_details','customers.change_customer_details','customers.delete_customer_details'],raise_exception=True)
@check_user_subcription('ADD_SINGLE_CUSTOMER')
##@multi_user_permission('Add_Customer')
@multi_user_permission('add', 'Customers')
def add_new_customers_b2b(request, template_name='merchant_site/customers/add_new_customers_b2b.html'):
	active_page_name = "add_customers_b2b_page"
   
	if request.session.get('is_logged_in_superuser') == False:
		outlet_list = outlet_details.objects.filter(id__in=request.session.get('allowed_outlets_list'),company_id = request.session.get('company_id'),is_active=1,is_verified = 1)
	elif request.session.get('is_logged_in_superuser') == True:
		outlet_list = outlet_details.objects.filter(company_id = request.session.get('company_id'),is_active=1,is_verified = 1)
	
	if request.session.get('multi_user_id'):
		userId = request.session.get('multi_user_id')
	else:
		userId = request.user.id

	outletid = None
	if request.session.get('outlet_id') and outletid == None:
		outletid = int(request.session.get('outlet_id'))    

	try:
		outletObj = get_object_or_404(outlet_details, id = outletid)
	except:
		outletObj = None

	from json import dumps
	country_obj = Country.objects.all()
	country_list = []
	for i in country_obj:
		new_Dictionary = { 
			'name':i.name,
			'phone':i.phonecode,
			
			}
		country_list.append(new_Dictionary)
	country_dataJSON = dumps(country_list)
	clients_account_obj = clients_account.objects.filter(outlet=outletid,is_trash=0)

	from json import dumps
	clients_account_list = []
	for cli in clients_account_obj:
		new_Dictionary = { 
			'comapny_id':cli.id,
			'company_name':cli.company_name,
			'industry':cli.industry,
			'company_phone':cli.company_phone,
			'company_email':cli.company_email,
			'company_website':cli.company_website,
			'company_gst':cli.company_gst,
			'company_fb':cli.company_fb,
			'company_insta':cli.company_insta,
			'company_twitter':cli.company_twitter,
			'company_pancard':cli.company_pancard,
			'com_address':cli.address_line1,
			'com_street':cli.street,
			'com_area_building':cli.area_building,
			'com_landmark':cli.landmark,
			'com_city':cli.city,
			'com_state':cli.state,
			'com_pincode':cli.pincode,
			'com_country_selection':cli.country,
			}
		clients_account_list.append(new_Dictionary)
	clients_account_dataJSON = dumps(clients_account_list)
	print(clients_account_obj,"llddddddddddddddddd")
	if outletObj.is_jmd == True:        
		url = reverse('customers:jmd_add_new_customers')
		return HttpResponseRedirect(url)

	out_id = request.session.get('outlet_id')

	try:
		customer_group_obj = privilege_customer_groups.objects.filter(outlet=outletObj)
	except:
		customer_group_obj = None

	# car_details_obj = CarDetails.objects.filter(is_active=True)
	# if car_details_obj.count() == 0:
	#     car_details_obj = None    
				   
	if request.method == 'POST':
		postdata = request.POST.copy();
		print(postdata)

		press_btn = postdata.get('press_btn', None)
		selected_outletid = outletid
		title = postdata.get('title',None)
		cust_first_name = postdata.get('cust_first_name',None)
		cust_last_name = postdata.get('cust_last_name',None)
		cust_email = postdata.get('email',None)
		mobno = postdata.get('mob_no',None)
		landline1 = postdata.get('landline1',None)
		landline2 = postdata.get('landline2',None)
		cust_birth_date = postdata.get('birth_date',None)
		
		phone_code = postdata.get('phone_code',None)
		cust_gst_no = postdata.get('cust_gst_no',None)
		ship_address1 = postdata.get('shipping_address',None)
		ship_address2 = postdata.get('shipping_street',None)
		ship_landmark = postdata.get('shipping_landmark',None)
		ship_area_building = postdata.get('shipping_area_building',None)
		ship_cust_city = postdata.get('shipping_city',None)
		ship_state = postdata.get('shipping_state',None)
		ship_cust_pincode = postdata.get('shipping_pincode',None)
		ship_cust_country = postdata.get('shipping_country',None)

		# industry = postdata.get('industry',None)
		# designation = postdata.get('designation',None)
		# company_phone = postdata.get('company_phone',None)
		# company_email = postdata.get('company_email',None)
		# company_website = postdata.get('company_website',None)
		ship_fname=postdata.get('shipping_cust_fname',None)
		ship_lname=postdata.get('shipping_cust_lname',None)

		
		privileged_opt = postdata.get("privileged") 
		# company_name = postdata.get('comp_name',None)
		# industry = postdata.get('industry',None)
		# company_gst = postdata.get('company_gst',None)
		# company_phone = postdata.get('company_phone',None)
		# company_email = postdata.get('company_email',None)
		# company_website = postdata.get('company_website',None)

		# com_address = postdata.get('com_address',None)
		# com_street = postdata.get('com_street',None)
		# com_area_building = postdata.get('com_area_building',None)
		# com_landmark = postdata.get('com_landmark',None)
		# com_city = postdata.get('com_city',None)
		# com_state = postdata.get('com_state',None)
		# com_pincode = postdata.get('com_pincode',None)
		# com_country = postdata.get('com_country',None)
		# company_pancard = postdata.get('company_pancard_name',None)
		# com_fb=postdata.get('company_facebook_link',None)
		# com_insta=postdata.get('company_instagram_link',None)
		# com_tw=postdata.get('company_twitter_link',None)
		# company_pancard = postdata.get('company_pancard_name',None)

		mark_as_parent = postdata.get('mark_parent',None)
		company_name = postdata.get('company_name',None)
		industry = postdata.get('company_industry',None)
		company_gst = postdata.get('company_gst',None)
		company_phone = postdata.get('company_phone',None)
		company_email = postdata.get('company_email',None)
		company_website = postdata.get('company_website',None)

		com_address = postdata.get('address_com',None)
		com_street = postdata.get('street_com',None)
		com_area_building = postdata.get('area_building_com',None)
		com_landmark = postdata.get('landmark_com',None)
		com_city = postdata.get('city_com',None)
		com_state = postdata.get('state_com',None)
		com_pincode = postdata.get('pincode_com',None)
		com_country = postdata.get('country_selection_com',None)
		company_pancard = postdata.get('company_pancard_name',None)
		com_fb=postdata.get('company_facebook_link',None)
		com_insta=postdata.get('company_instagram_link',None)
		com_tw=postdata.get('company_twitter_link',None)
		company_pancard = postdata.get('company_pancard_name',None)

		par_company_name = postdata.get('par_company_name',None)
		par_industry = postdata.get('par_industry',None)
		par_company_gst = postdata.get('par_company_gst',None)
		par_company_phone = postdata.get('par_company_phone',None)
		par_company_email = postdata.get('par_company_email',None)
		par_company_website = postdata.get('par_company_website',None)

		par_com_address = postdata.get('par_address_com',None)
		par_com_street = postdata.get('par_street_com',None)
		par_com_area_building = postdata.get('par_area_building_com',None)
		par_com_landmark = postdata.get('par_landmark_com',None)
		par_com_city = postdata.get('par_city_com',None)
		par_com_state = postdata.get('par_state_com',None)
		par_com_pincode = postdata.get('par_pincode_com',None)
		par_com_country = postdata.get('par_country_selection_com',None)
		par_company_pancard = postdata.get('par_company_pancard_name',None)
		par_com_fb=postdata.get('par_company_facebook_link',None)
		par_com_insta=postdata.get('par_company_instagram_link',None)
		par_com_tw=postdata.get('par_company_twitter_link',None)
		par_company_pancard = postdata.get('par_company_pancard_name',None)

		if cust_birth_date and cust_birth_date != "":
			cust_birth_date = datetime.strptime(cust_birth_date, '%d-%m-%Y')
			cust_birth_date = cust_birth_date.strftime('%Y-%m-%d %H:%M:%S')
		else:
			cust_birth_date = None 

		dropdown = postdata.get('dropdown')
		print("------------ dropdown ---------",dropdown)  

		lates_cust_entry = customer_details.objects.latest("id")
		print(lates_cust_entry.id,"-----------")

		name_of_file =""
		name_of_file_pan = ""
		if lates_cust_entry:
			if postdata.get('is_aadhar_file') == '1':
				print(request.FILES['aadhar_file'],"===llooo")
				if request.FILES['aadhar_file']:
					image_file = request.FILES.get('aadhar_file')
					encodedImage = base64.b64encode(image_file.read())
					imageExt = str(image_file).split(".")
					data = base64.b64decode(encodedImage)
					save_path = SERVER_UPLOAD_URL+'customers/aadhar_file/'
					name_of_file = "cust_aadhar_" + str(lates_cust_entry.id+1)+ "_" + str(imageExt[0]) + "." + str(imageExt[1])
					completeImageName = os.path.join(save_path, name_of_file)
					file1 = open(completeImageName, "wb")
					file1.write(data)
					file1.close()
					# print("adhar pres",imageExt)
					# return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
			
			if postdata.get('is_pan_file') == '1':
				if request.FILES['pan_file']:
					image_file_pan = request.FILES.get('pan_file')
					encodedImage2 = base64.b64encode(image_file_pan.read())
					imageExt2 = str(image_file_pan).split(".")
					data2 = base64.b64decode(encodedImage2)
					save_path2 = SERVER_UPLOAD_URL+'customers/pancard_file/'
					name_of_file_pan = "cust_pan_"+ str(lates_cust_entry.id+1)+"_"+str(imageExt2[0])+"."+str(imageExt2[1])
					completeImageName2 = os.path.join(save_path2,name_of_file_pan)
					file2 = open(completeImageName2,"wb")
					file2.write(data2)
					file2.close() 

			name_of_user_profile = ""
			if postdata.get('is_user_profile') == '1':
				if request.FILES['user_profile_img']:
					image_user_profile = request.FILES.get('user_profile_img')
					encodedImage3 = base64.b64encode(image_user_profile.read())
					imageExt3 = str(image_user_profile).split(".")
					data3 = base64.b64decode(encodedImage3)
					save_path3 = SERVER_UPLOAD_URL+'customers/user_profile_img/'
					name_of_user_profile = "user_profile_img_"+ str(lates_cust_entry.id+1)+"_"+str(imageExt3[0])+"."+str(imageExt3[1])
					completeImageName3 = os.path.join(save_path3,name_of_user_profile)
					file3 = open(completeImageName3,"wb")
					file3.write(data3)
					file3.close()      
							
				
		if press_btn == 'SAVE' or press_btn == 'SAVE & CLOSE':
			cust_avail = check_customer_isAvailabel(request, selected_outletid, cust_email, mobno)
			if request.method == 'POST':
				postdata = request.POST.copy()

				if postdata.get('cust_type_dropdown') != '':
					cust_type_dropdown = postdata.get('cust_type_dropdown')
				else:
					cust_type_dropdown = 'Contact'

				if postdata.get('cust_status_dropdown') != '':
					cust_status_dropdown = postdata.get('cust_status_dropdown')
				else:
					cust_status_dropdown = 'Cold'

			 
			if cust_avail:                
				messages.add_message(request, messages.ERROR, 'This customer already exists in your database', fail_silently=True)
				return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
			 
			if cust_avail == False:
				if cust_email !=None and cust_email.strip() == "":
					cust_email = None

				if mobno != None and mobno.strip() == "":
					mobno = None   
				
				try:
					user_obj = get_object_or_404(User, Q(username=cust_email) | Q(username=mobno))
				except:
					user_obj = None

				try:
					cust_profile_obj = get_object_or_404(CustomerProfile, phone_no=mobno)
				except:
					cust_profile_obj = None

				if user_obj == None and cust_profile_obj == None:
					mac = get_mac()                                                                                
					if mobno:
						username = mobno
					elif cust_email:
						username = cust_email                                            
					pwd = 'XlC16269'+username+'XlC16269' #create a hash password with salt
					encrypt_pwd = make_password(pwd)           
					customer_user = User()
					customer_user.username = username
					customer_user.email = cust_email if cust_email else ''    
					customer_user.password = encrypt_pwd
					customer_user.is_active = 0
					customer_user.save()

					userid = customer_user.id 
					  
					profile = CustomerProfile()
					profile.user_id = customer_user
					profile.phone_no = mobno
					profile.desktop_mac_id = mac          
					profile.entry_point ='INDV'
					profile.ip_address = request.META.get('REMOTE_ADDR')
					profile.issuance_city = postdata.get('city',None)
					profile.issuance_country  = postdata.get('country',None)
					profile.issuance_pincode = postdata.get('pincode',None)
					profile.email_id = cust_email if cust_email != None else None
					profile.save()
					customer_user.groups.add(Group.objects.get(name='Customer'))
					  
				elif user_obj:
					userid = user_obj.id
					  
				elif cust_profile_obj:
					userid = cust_profile_obj.user_id_id

				print("+++++++++++++++++++++++++++++++ regular_customer", dropdown)
				if dropdown == 'regular' or dropdown == 'privi_group':
					try:
						clientObj = clients_account.objects.get(company_email=company_email,company_website=company_website,outlet_id=selected_outletid)
						
					except:
						clientObj = None

					if clientObj:
						messages.add_message(request, messages.ERROR, 'This customer already exists in your database', fail_silently=True)
						return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
					else:
						clientObj = clients_account()
						

					clientObj.company_name = company_name
					clientObj.industry = industry
					clientObj.company_gst = company_gst
					clientObj.company_phone = company_phone
					clientObj.company_email = company_email
					clientObj.company_website = company_website
					clientObj.outlet = outletObj

					clientObj.company_twitter = com_tw
					clientObj.company_fb = com_fb
					clientObj.company_insta =com_insta

					clientObj.area_building = com_area_building
					clientObj.address_line1 = com_address
					clientObj.landmark = com_landmark
					clientObj.city = com_city
					clientObj.state = com_state
					clientObj.street = com_street
					clientObj.pincode = com_pincode
					clientObj.country = com_country
					clientObj.company_pancard = company_pancard
					clientObj.created_by_id = userId
					clientObj.type = 'Customer'
					if mark_as_parent == 'yes':
						clientObj.is_parent = True
					clientObj.save()
					

					if mark_as_parent == 'no':
						try:
							par_clients_account_obj = get_object_or_404(clients_account,company_email=par_company_email,company_website=par_company_website,outlet_id=selected_outletid)
						except:
							par_clients_account_obj = clients_account()

						par_clients_account_obj.company_name = par_company_name
						par_clients_account_obj.industry = par_industry
						par_clients_account_obj.company_gst = par_company_gst
						par_clients_account_obj.company_phone = par_company_phone
						par_clients_account_obj.company_email = par_company_email
						par_clients_account_obj.company_website = par_company_website
						par_clients_account_obj.outlet = outletObj

						par_clients_account_obj.company_twitter = par_com_tw
						par_clients_account_obj.company_fb = par_com_fb
						par_clients_account_obj.company_insta =par_com_insta

						par_clients_account_obj.area_building = par_com_area_building
						par_clients_account_obj.address_line1 = par_com_address
						par_clients_account_obj.landmark = par_com_landmark
						par_clients_account_obj.city = par_com_city
						par_clients_account_obj.state = par_com_state
						par_clients_account_obj.street = par_com_street
						par_clients_account_obj.pincode = par_com_pincode
						par_clients_account_obj.country = par_com_country
						par_clients_account_obj.company_pancard = par_company_pancard
						par_clients_account_obj.country = par_com_country
						par_clients_account_obj.is_parent = True
						par_clients_account_obj.created_by_id = userId
						
						par_clients_account_obj.save()
						clientObj.parent_id = par_clients_account_obj
						clientObj.save()

					
					try:
						custObj = get_object_or_404(customer_details,email=cust_email,outlet_id=selected_outletid,is_trash=0)
					except:
						custObj = None
					custFor = 'CompanyContactPerson'

					if custObj == None:
							
						custObj = customer_details()
						if postdata.get('mark_primary') == 'yes':
							primaryCustObj = customer_details.objects.filter(outlet_id=selected_outletid,is_trash=0,clients_account_id=clientObj.id,is_primary=True)
							for i in primaryCustObj:
								i.is_primary = False
								i.save()
							custObj.is_primary = True
						title = postdata.get('title',None)
						custObj.clients_acc = clientObj
						custObj.clients_account_id = clientObj.id if clientObj else None
						occupation = postdata.get('occupation',None)
						custObj.title = title 
						custObj.occupation = occupation
						custObj.phone_no = mobno
						custObj.customer_name = cust_first_name + " " +cust_last_name
						custObj.email = cust_email
						custObj.phone_code = phone_code
						custObj.landline1 = postdata.get('landline1',None)
						custObj.entry_point = 'INDV'
						custObj.custFor = custFor
						
						custObj.outlet_id = selected_outletid
						
						custObj.cust_dob = cust_birth_date

						custObj.address_line1 = postdata.get('address',None)
						custObj.address_line2= postdata.get('street',None)
						custObj.area_building = postdata.get('area_building',None)
						custObj.landmark = postdata.get('landmark',None)
						custObj.city = postdata.get('city',None)
						custObj.state = postdata.get('state',None)
						custObj.pincode = postdata.get('pincode',None)
						custObj.country = postdata.get('country_selection',None)

						##shipping##
						custObj.shipping_first_name = ship_fname
						custObj.shipping_last_name = ship_lname
						custObj.shipping_address1 = postdata.get('shipping_address',None)
						custObj.shipping_address2= postdata.get('shipping_street',None)
						custObj.shipping_area_building = postdata.get('shipping_area_building',None)
						custObj.shipping_landmark = postdata.get('shipping_landmark',None)
						custObj.shipping_city = postdata.get('shipping_city',None)
						custObj.shipping_state = postdata.get('shipping_state',None)
						custObj.shipping_pincode = postdata.get('shipping_pincode',None)
						custObj.shipping_country = postdata.get('shipping_country',None)
						## shipping

						custObj.pancard = postdata.get('pancard_name',None)
						custObj.gender = postdata.get('gender',None)
						custObj.children = postdata.get('children',None)

						custObj.cust_type_dropdown = cust_type_dropdown
						
						custObj.customer_type = postdata.get('customer_type')
						custObj.created_by_id = userId
						custObj.user_id = userid

						if custObj.children == 'Yes':
							custObj.NO_Of_Children = postdata.get('countchildren',None)
						else:
							custObj.NO_Of_Children = None
						custObj.marital_status = postdata.get('marital_status',None)

										
						custObj.category = postdata.get('employed',None)
						if len(name_of_file) > 0:
							custObj.aadhar_pdf_file = "customers/aadhar_file/" + str(name_of_file)
				
						if len(name_of_file_pan) > 0:
							custObj.pan_pdf_file = "customers/pancard_file/" + str(name_of_file_pan)
						
						if len(name_of_user_profile) > 0:
							custObj.user_profile_img = "customers/user_profile_img/" + str(name_of_user_profile)

						custObj.Adharcard = postdata.get('Adharcard',None)
						custObj.social_fb = postdata.get("twitter_link")
						custObj.social_insta = postdata.get("facebook_link")
						custObj.social_twitter = postdata.get("instagram_link")
						custObj.save()
					else:
						messages.add_message(request, messages.ERROR, 'This customer already exists in your database', fail_silently=True)
						return HttpResponseRedirect(request.META.get('HTTP_REFERER'))   
							
					customers_grouped_obj = customers_grouped()

					try:
						out_id_obj = get_object_or_404(outlet_details, id=out_id)
					except:
						out_id_obj = None

					customers_grouped_obj.outlet_id = out_id_obj
					if dropdown == 'regular':
						customers_grouped_obj.is_regular = "1"
					elif dropdown == 'privi_group':
						customers_grouped_obj.is_privileged = "1"
					else:
						pass
					customers_grouped_obj.customer_id = custObj.id
					customers_grouped_obj.save()

					if dropdown == 'privi_group':

						if request.method == 'POST':
							postdata = request.POST.copy()
							sub_group = postdata.get('priv_sub_group')

							privileged_customers_subgroup_obj = privileged_customers_subgroup()

							try:
								outlet_obj = get_object_or_404(outlet_details,id = out_id)
							except:
								outlet_obj = None                               
							privileged_customers_subgroup_obj.outlet_id = outlet_obj

							try:
								priv_cust = get_object_or_404(customers_grouped, id =customers_grouped_obj.id)
							except:
								priv_cust = None
							privileged_customers_subgroup_obj.cust_group_id = priv_cust

							try:
								group_name_obj = get_object_or_404(privilege_customer_groups,id=sub_group)
							except:
								group_name_obj = None

							if group_name_obj:
								privileged_customers_subgroup_obj.sub_group_name = group_name_obj.group_name
								privileged_customers_subgroup_obj.privilege_cust_group = group_name_obj

							privileged_customers_subgroup_obj.customer_id = custObj.id


							privileged_customers_subgroup_obj.save()

			   
				messages.add_message(request, messages.SUCCESS, 'Your customer was added successfully', fail_silently=True)

				if press_btn == 'SAVE':
					url = reverse('customers:edit_customers', kwargs={'custCode': custObj.id})
					return HttpResponseRedirect(url)
				elif press_btn == 'SAVE & CLOSE':
					url = reverse('customers:get_my_customers')
					return HttpResponseRedirect(url)
			
	return render(request,template_name,locals())




def jmd_add_new_customers(request, template_name='merchant_site/customers/jmd_add_customer.html'):
	active_page_name = "add_customers_page"

	if request.session.get('is_logged_in_superuser') == False:
		outlet_list = outlet_details.objects.filter(id__in=request.session.get('allowed_outlets_list'),company_id = request.session.get('company_id'),is_active=1,is_verified = 1)
	elif request.session.get('is_logged_in_superuser') == True:
		outlet_list = outlet_details.objects.filter(company_id = request.session.get('company_id'),is_active=1,is_verified = 1)
	
	outletid = None
	if request.session.get('outlet_id') and outletid == None:
		outletid = int(request.session.get('outlet_id'))    

	try:
		outletObj = get_object_or_404(outlet_details, id = outletid)
	except:
		outletObj = None    

	country_obj = Country.objects.all()
	if outletObj.is_jmd == True:
		template_name = 'merchant_site/customers/jmd_add_customer.html'
		# customers_obj = customerObj.getJMDAllCustomers(outletObj.id)    

	car_details_obj = CarDetails.objects.filter(is_active=True)
	if car_details_obj.count() == 0:
		car_details_obj = None    

	# a=[1,2,3,4,5,6,7,8,9,10]
	b=[]
	for abh in range(1,5):
		print(abh)
		b.append(abh)

	if request.method == 'POST':
		postdata = request.POST.copy();
		press_btn = postdata.get('press_btn', None)
		title = postdata.get('title',None)
		selected_outletid = outletid
		cust_first_name = postdata.get('cust_first_name',None)
		cust_last_name = postdata.get('cust_last_name',None)
		cust_email = postdata.get('email',None)
		mobno = postdata.get('mob_no',None)
		mobno2 =  postdata.get('mob_no2',None)
		landline1 = postdata.get('landline1',None)
		landline2 = postdata.get('landline2',None)
		# outletid = int(postdata.get('select_outlet')) if postdata.get('select_outlet') else None
		cust_start_date = postdata.get('start_date',None)
		cust_service_date = postdata.get('service_date',None)
		cust_country = postdata.get('country',None)
		cust_bill = postdata.get('order_amt',None)
		cust_city = postdata.get('city',None)
		cust_pincode = postdata.get('pincode',None)
		service_name = postdata.get('service_name',None)
		area_building = postdata.get('area_building',None)
		address1 = postdata.get('address',None)
		address2 = postdata.get('street',None)
		landmark = postdata.get('landmark',None)
		pancard = postdata.get('pancard_name',None)
		Adharcard = postdata.get('Adharcard',None)
		gender = postdata.get('gender',None)
		marital_status = postdata.get('marital_status',None)
		marriage_anniversery = postdata.get('marriage_anniversery',None)
		children = postdata.get('children',None)
		NO_Of_Children = postdata.get('countchildren',None)
		occupation = postdata.get('occupation',None)
		category = postdata.get('category',None)
		sub_category = postdata.get('sub_category',None)


		state = postdata.get('state',None)
		service_vehicle_number =  postdata.get('vehicle_no',None)
		car_id =  postdata.get('car_selection',None)
		if car_id:
			try:
				carObj = get_object_or_404(CarDetails, id=car_id)
			except:
				carObj = None
		else:        
			carObj = None               
				
		if press_btn == 'SAVE' or press_btn == 'SAVE & CLOSE':
			cust_avail = check_customer_isAvailabel(request, selected_outletid, cust_email, mobno)
			 
			if cust_avail:                
				messages.add_message(request, messages.SUCCESS, 'This customer already exists in your database', fail_silently=True)
				return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
			 
			if cust_avail == False:
				try:
					user_obj = get_object_or_404(User, Q(username=cust_email) | Q(username=mobno))
				except:
					user_obj = None

				try:
					cust_profile_obj = get_object_or_404(CustomerProfile, phone_no=mobno)
				except:
					cust_profile_obj = None

				if user_obj == None and cust_profile_obj == None:
					mac = get_mac()
					pwd = 'XlC16269' + mobno + 'XlC16269'  # create a hash password with salt
					encrypt_pwd = make_password(pwd)
					customer_user = User()
					customer_user.username = mobno
					customer_user.password = encrypt_pwd
					customer_user.is_active = 0
					customer_user.save()

					userid = customer_user.id

					profile = CustomerProfile()
					profile.user_id = customer_user
					profile.phone_no = mobno
					profile.desktop_mac_id = mac
					profile.entry_point = 'INDV'
					profile.ip_address = request.META.get('REMOTE_ADDR')
					profile.save()
					customer_user.groups.add(Group.objects.get(name='Customer'))

				elif user_obj:
					userid = user_obj.id

				elif cust_profile_obj:
					userid = cust_profile_obj.user_id_id

				'''save customer'''
				customer_obj = customer_details()
				customer_obj.title = title 
				customer_obj.phone_no = mobno
				customer_obj.phone_no2 = mobno2
				customer_obj.customer_name = cust_first_name + " " +cust_last_name
				customer_obj.email = cust_email
				customer_obj.entry_point = 'INDV'
				customer_obj.created_by_id = request.user.id
				customer_obj.outlet_id = selected_outletid
				customer_obj.user_id = userid
				
				customer_obj.landline1 = landline1
				customer_obj.landline2 = landline2

				cust_birth_date = postdata.get('birth_date',None)
				if cust_birth_date and cust_birth_date != "":
					cust_birth_date = datetime.strptime(cust_birth_date, '%d-%m-%Y')
					cust_birth_date = cust_birth_date.strftime('%Y-%m-%d %H:%M:%S')
				else:
					cust_birth_date = None         

				customer_obj.cust_dob = cust_birth_date
				customer_obj.city = cust_city
				customer_obj.country = cust_country
				customer_obj.landmark = landmark
				customer_obj.pincode = cust_pincode
				customer_obj.state = state
				customer_obj.area_building = area_building
				customer_obj.address_line1 = address1
				customer_obj.address_line2 = address2

				customer_obj.pancard = pancard
				customer_obj.Adharcard = Adharcard
				customer_obj.gender = gender 
				customer_obj.marital_status = marital_status
				customer_obj.marriage_anniversery = marriage_anniversery
				customer_obj.children = children 
				customer_obj.NOOfChildren = NO_Of_Children
				customer_obj.occupation = occupation
				customer_obj.category = category
				customer_obj.sub_category = sub_category
				customer_obj.save()

				customer_id = customer_obj.id

				# ################JMD VEHICLE#####################
				# customer_vehicle_obj = jmdCustomerVehicle()
				# customer_vehicle_obj.vehicle_number = postdata.get('vehicle_no',None)
				# customer_vehicle_obj.vehicle_type = postdata.get('vehicle_type',None)
				# customer_vehicle_obj.registration_number = postdata.get('registration_number',None)                             

				# if car_id:
				#     customer_vehicle_obj.car_id = car_id
				# if carObj:
				#     customer_vehicle_obj.car_name = carObj.carname
				#     customer_vehicle_obj.variant = carObj.variant
				#     customer_vehicle_obj.brand = carObj.brand
				#     customer_vehicle_obj.car_model = carObj.carmodel
				#     customer_vehicle_obj.service_schedule = carObj.service_schedule    

				# delivery_date = postdata.get('delivery_date',None)
				# if delivery_date and delivery_date != "" :
				#     delivery_date = datetime.strptime(delivery_date, '%d-%m-%Y')
				#     delivery_date = delivery_date.strftime('%Y-%m-%d %H:%M:%S')    

				# customer_vehicle_obj.delivery_date = delivery_date
				# customer_vehicle_obj.invoice_location = postdata.get('invoice_location',None)
				# customer_vehicle_obj.sales_person = postdata.get('sales_person',None)

				# customer_vehicle_obj.sold_by = postdata.get('sold_by',None)

				# customer_vehicle_obj.customer_id = customer_id
				# customer_vehicle_obj.outlet_id = outletid
				# customer_vehicle_obj.save()

				# vehicle_id = customer_vehicle_obj.id


				# ################JMD SERVICING$####################
				# customer_service_obj = jmdCustServicingDetails()
				# customer_service_obj.service_location = postdata.get('service_location',None)
				# customer_service_obj.repair_type = postdata.get('repair_type',None)
				# customer_service_obj.service_advisor = postdata.get('service_advisor',None)     

				# service_invoice_date = postdata.get('service_invoice_date',None)
				# if service_invoice_date and service_invoice_date != "" :
				#     service_invoice_date = datetime.strptime(service_invoice_date, '%d-%m-%Y')
				#     service_invoice_date = service_invoice_date.strftime('%Y-%m-%d %H:%M:%S')               

				# customer_service_obj.service_invoice_date = service_invoice_date
				# # customer_service_obj.service_exipry_date = postdata.get('service_location',None)
				# customer_service_obj.customer_id = customer_id
				# customer_service_obj.outlet_id = outletid
				# customer_service_obj.vehicle_id = vehicle_id

				# job_card_date = postdata.get('job_card_date',None)
				# if job_card_date and job_card_date != "" :
				#     job_card_date = datetime.strptime(job_card_date, '%d-%m-%Y')
				#     job_card_date = job_card_date.strftime('%Y-%m-%d %H:%M:%S')     

				# customer_service_obj.job_card_date = postdata.get('job_card_date',None)
				# customer_service_obj.save()

				# ################JMD INSURANCE#####################
				# customer_insurance_obj = jmd_cust_insurance_details()
				# customer_insurance_obj.policy_number = postdata.get('policy_no',None)
				# customer_insurance_obj.insurance_company = postdata.get('insurance_company',None)

				# policy_expiry_date = postdata.get('policy_exp_date',None)
				# if policy_expiry_date and policy_expiry_date != "" :
				#     policy_expiry_date = datetime.strptime(policy_expiry_date, '%d-%m-%Y')
				#     policy_expiry_date = policy_expiry_date.strftime('%Y-%m-%d %H:%M:%S')

				# customer_insurance_obj.policy_expiry_date = policy_expiry_date
				# customer_insurance_obj.executive_name = postdata.get('executive_name',None) 
				# customer_insurance_obj.amount = postdata.get('amount',None)
				# customer_insurance_obj.customer_id = customer_id
				# customer_insurance_obj.outlet_id = outletid
				# customer_insurance_obj.vehicle_id = vehicle_id
				# customer_insurance_obj.save()
				
				messages.add_message(request, messages.SUCCESS, 'Your customer was added successfully', fail_silently=True)

				if press_btn == 'SAVE':
					url = reverse('customers:edit_customers', kwargs={'custCode': customer_obj.id})
					return HttpResponseRedirect(url)
				elif press_btn == 'SAVE & CLOSE':
					url = reverse('customers:get_my_customers')
					return HttpResponseRedirect(url)
			
	return render(request,template_name,locals())

@login_required(login_url='/merchant-login/')
@permission_required(['customers.add_customer_details','customers.change_customer_details','customers.delete_customer_details'],raise_exception=True)
##@multi_user_permission('Edit_Customer')
@multi_user_permission('edit', 'Customers')
def edit_customers(request, custCode='0', template_name='merchant_site/customers/jmd_edit_customer.html'):
	active_page_name = "edit_customers_page"

	# get session
	if request.session.get('is_logged_in_superuser') == False:
		outlet_list = outlet_details.objects.filter(id__in=request.session.get('allowed_outlets_list'),company_id = request.session.get('company_id'),is_active=1,is_verified = 1)
	elif request.session.get('is_logged_in_superuser') == True:
		outlet_list = outlet_details.objects.filter(company_id = request.session.get('company_id'),is_active=1,is_verified = 1)
	
	# get outlet id from session
	outletid = None
	if request.session.get('outlet_id') and outletid == None:
		outletid = int(request.session.get('outlet_id'))    

	# get outlet details
	try:
		outletObj = get_object_or_404(outlet_details, id = outletid)
	except:
		outletObj = None  

	clients_account_obj = clients_account.objects.filter(outlet=outletid,is_trash=0)  
	from json import dumps
	clients_account_list = []
	for cli in clients_account_obj:
		new_Dictionary = { 
			'comapny_id':cli.id,
			'company_name':cli.company_name,
			'industry':cli.industry,
			'company_phone':cli.company_phone,
			'company_email':cli.company_email,
			'company_website':cli.company_website,
			'company_gst':cli.company_gst,
			'company_fb':cli.company_fb,
			'company_insta':cli.company_insta,
			'company_twitter':cli.company_twitter,
			'company_pancard':cli.company_pancard,
			'com_address':cli.address_line1,
			'com_street':cli.street,
			'com_area_building':cli.area_building,
			'com_landmark':cli.landmark,
			'com_city':cli.city,
			'com_state':cli.state,
			'com_pincode':cli.pincode,
			'com_country_selection':cli.country,
			}
		clients_account_list.append(new_Dictionary)
	clients_account_dataJSON = dumps(clients_account_list)  

	# get outlet is jmd
	country_obj = Country.objects.all()
	if outletObj.is_jmd == True:
		template_name = 'merchant_site/customers/jmd_edit_customer.html'  

	# get car details from id
	car_details_obj = CarDetails.objects.filter(is_active=True)
	if car_details_obj.count() == 0:
		car_details_obj = None
	selected_client_acc = ''
	custfirstname = ""
	custlastname = ""
	if custCode != 0 or custCode != None:
		try:
			customer_details_obj = get_object_or_404(customer_details, id=custCode)
			outletid = int(customer_details_obj.outlet_id)
			if customer_details_obj.clients_account_id:
				selected_client_acc = int(customer_details_obj.clients_account_id)
			if customer_details_obj.customer_name:
				custname = str(customer_details_obj.customer_name).split()
				if len(custname) > 1:
					custfirstname = custname[0]
					custlastname = custname[1]
				else:
					custfirstname = custname[0]
			if customer_details_obj.aadhar_pdf_file:
				prefix_pdf_name = "customers/aadhar_file/cust_aadhar_"+str(custCode)+"_"
				aahar_pdf_name = (str(customer_details_obj.aadhar_pdf_file)).replace(prefix_pdf_name,"")
			
			if customer_details_obj.pan_pdf_file:
				prefix_pdf_name_pan = "customers/pancard_file/cust_pan_"+str(custCode)+"_"
				pancard_pdf_name = (str(customer_details_obj.pan_pdf_file)).replace(prefix_pdf_name_pan,"")
		except:
			customer_details_obj = None
	else:
		customer_details_obj = None

	if selected_client_acc:
		try:
			client_acc_obj = get_object_or_404(clients_account,id=selected_client_acc)
		except:
			client_acc_obj = None
	first_name, last_name = "", ""
	customer_birthdate = ""

	if customer_details_obj:
		try:
			privilege_customer_groups_obj = privilege_customer_groups.objects.filter(outlet_id = outletid)
		except:
			privilege_customer_groups_obj = None

		
		cust_group_id =""
		try:
			customer_in_group_obj = get_object_or_404(privileged_customers_subgroup,customer_id=custCode)
			cust_group_id = customer_in_group_obj.privilege_cust_group_id
		except:
			customer_in_group_obj = None
		
		try:
			out_id_obj = get_object_or_404(outlet_details, id=outletid)
		except:
			out_id_obj = None

		try:
			customers_grouped_obj = get_object_or_404(customers_grouped,outlet_id=out_id_obj,customer_id=custCode)
		except:
			customers_grouped_obj = None
		cust_group_type  = ""
		if customers_grouped_obj:
			if customers_grouped_obj.is_regular == 1:
				cust_group_type = "Regular"
			if customers_grouped_obj.is_privileged == 1:
				try:
					privileged_customers_SUBgr_obj = get_object_or_404(privileged_customers_subgroup,customer_id=custCode)
					sub_group_name = privileged_customers_SUBgr_obj.sub_group_name
				except:
					pass
				cust_group_type = "Privilege"
		if customer_details_obj.customer_name:
			full_name = (customer_details_obj.customer_name).split(" ")
			if full_name:
				try:
					first_name = full_name[0]
				except:
					first_name = None
				try:
					last_name = full_name[1]
				except:
					last_name = None

		if customer_details_obj.cust_dob:
			split_dob_datettime = str(customer_details_obj.cust_dob).split(" ")
			split_dob = str(split_dob_datettime[0]).split("-")
			customer_birthdate = split_dob[2]+"-"+split_dob[1]+"-"+split_dob[0]    


	if request.method == 'POST':
		postdata = request.POST.copy();
		print(postdata)
		

		press_btn = postdata.get('press_btn', None)
		title = postdata.get('title',None)
		cust_first_name = postdata.get('cust_first_name',None)
		cust_last_name = postdata.get('cust_last_name',None)
		cust_email = postdata.get('email',None)
		mobno = postdata.get('mob_no',None)
		landline1 = postdata.get('landline1',None)
		landline2 = postdata.get('landline2',None)      
		cust_birth_date = postdata.get('birth_date',None)
		cust_country = postdata.get('country',None)
		cust_bill = postdata.get('order_amt',None)
		cust_city = postdata.get('city',None)
		cust_pincode = postdata.get('pincode',None)
		service_name = postdata.get('service_name',None)
		area_building = postdata.get('area_building',None)
		address1 = postdata.get('address',None)
		address2 = postdata.get('street',None)
		landmark = postdata.get('landmark',None)
		state = postdata.get('state',None)
		company_name = postdata.get('company_name',None)
		industry = postdata.get('industry',None)
		designation = postdata.get('designation',None)
		company_phone = postdata.get('company_phone',None)
		company_email = postdata.get('company_email',None)
		company_website = postdata.get('company_website',None)

		mobno2 =  postdata.get('mob_no2',None)
		cust_gst_no =  postdata.get('cust_gst_no',None)
		
		# outletid = int(postdata.get('select_outlet')) if postdata.get('select_outlet') else None
		cust_start_date = postdata.get('start_date',None)
		cust_service_date = postdata.get('service_date',None)
		
		
		
		
		
		pancard = postdata.get('pancard_name',None)
		Adharcard = postdata.get('Adharcard',None)
		gender = postdata.get('gender',None)
		marital_status = postdata.get('marital_status',None)
		marr_anniv = postdata.get('marriage_anniversery',None)
		children = postdata.get('children',None)
		NO_Of_Children = postdata.get('countchildren',None)
		occupation = postdata.get('occupation',None)
		category = postdata.get('category',None)
		sub_category = postdata.get('sub_category',None)

		service_vehicle_number =  postdata.get('vehicle_no',None)
		ship_fname=postdata.get('shipping_cust_fname',None)
		ship_lname=postdata.get('shipping_cust_lname',None)
		comp_add=postdata.get('comp_add',None)
		company_name = postdata.get('comp_name',None)
		industry = postdata.get('industry',None)
		company_gst = postdata.get('company_gst',None)
		company_phone = postdata.get('company_phone',None)
		company_email = postdata.get('company_email',None)
		company_website = postdata.get('company_website',None)

		twitter_link = postdata.get('twitter_link',None)
		facebook_link = postdata.get('facebook_link',None)
		instagram_link = postdata.get('instagram_link',None)

		com_address = postdata.get('com_address',None)
		com_street = postdata.get('com_street',None)
		com_area_building = postdata.get('com_area_building',None)
		com_landmark = postdata.get('com_landmark',None)
		com_city = postdata.get('com_city',None)
		com_state = postdata.get('com_state',None)
		com_pincode = postdata.get('com_pincode',None)
		com_country = postdata.get('com_country',None)
		company_pancard = postdata.get('company_pancard_name',None)
		com_fb=postdata.get('company_facebook_link',None)
		com_insta=postdata.get('company_instagram_link',None)
		com_tw=postdata.get('company_twitter_link',None)
		name_of_file =""
		if postdata.get('is_aadhar_file') == '1':
			if request.FILES['aadhar_file']:
				image_file = request.FILES.get('aadhar_file')
				encodedImage = base64.b64encode(image_file.read())
				imageExt = str(image_file).split(".")
				data = base64.b64decode(encodedImage)
				save_path = SERVER_UPLOAD_URL+'customers/aadhar_file/'
				name_of_file = "cust_aadhar_" + str(custCode)+ "_" + str(imageExt[0]) + "." + str(imageExt[1])
				completeImageName = os.path.join(save_path, name_of_file)
				file1 = open(completeImageName, "wb")
				file1.write(data)
				file1.close()
				# print("adhar pres",imageExt)
				# return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
		
		name_of_file_pan = ""
		if postdata.get('is_pan_file') == '1':
			if request.FILES['pan_file']:
				image_file_pan = request.FILES.get('pan_file')
				encodedImage2 = base64.b64encode(image_file_pan.read())
				imageExt2 = str(image_file_pan).split(".")
				data2 = base64.b64decode(encodedImage2)
				save_path2 = SERVER_UPLOAD_URL+'customers/pancard_file/'
				name_of_file_pan = "cust_pan_"+ str(custCode)+"_"+str(imageExt2[0])+"."+str(imageExt2[1])
				completeImageName2 = os.path.join(save_path2,name_of_file_pan)
				file2 = open(completeImageName2,"wb")
				file2.write(data2)
				file2.close()

		name_of_user_profile = ""
		if postdata.get('is_user_profile') == '1':
			if request.FILES['user_profile_img']:
				image_user_profile = request.FILES.get('user_profile_img')
				encodedImage3 = base64.b64encode(image_user_profile.read())
				imageExt3 = str(image_user_profile).split(".")
				data3 = base64.b64decode(encodedImage3)
				save_path3 = SERVER_UPLOAD_URL+'customers/user_profile_img/'
				name_of_user_profile = "user_profile_img_"+ str(custCode)+"_"+str(imageExt3[0])+"."+str(imageExt3[1])
				completeImageName3 = os.path.join(save_path3,name_of_user_profile)
				file3 = open(completeImageName3,"wb")
				file3.write(data3)
				file3.close()
	   
		if cust_birth_date and cust_birth_date != "":
			cust_birth_date = datetime.strptime(cust_birth_date, '%d-%m-%Y')
			cust_birth_date = cust_birth_date.strftime('%Y-%m-%d %H:%M:%S')
		else:
			cust_birth_date = None   

		print(marr_anniv)
		print(type(marr_anniv))
		if marr_anniv != None and marr_anniv != "":
			print('oooooooooo')
			marr_anniv = datetime.strptime(marr_anniv, '%d-%m-%Y')
			marr_anniv = marr_anniv.strftime('%Y-%m-%d %H:%M:%S')
		else:
			print('kkkkkkkkkkkkkkkkkk')
			marr_anniv = None                

		print(" ---------------------------------------------------------- Is is coming till here?????????????????????",marr_anniv)
		print(" ---------------------------------------------------------- ayaaaaa kyaaa????????????????????", cust_birth_date)
		if press_btn == 'SAVE' or press_btn == 'SAVE & CLOSE' or press_btn == 'Save From Acount' or press_btn == "Remove User Image" or press_btn == "Save Billing Info" or press_btn == "Save From Company":
			'''save customer'''
			customer_details_obj = customer_details.objects.get(id=custCode)
			customer_details_obj.title = title 
			customer_details_obj.phone_no = mobno
			customer_details_obj.customer_name = cust_first_name + " " +cust_last_name
			customer_details_obj.email = cust_email
			customer_details_obj.entry_point = 'INDV'
			customer_details_obj.created_by_id = request.user.id
			customer_details_obj.last_modified_by_id = request.user.id #01-10-2019
			if outletid:
				customer_details_obj.outlet_id = outletid
			# Added for jmd only
			customer_details_obj.landline1 = landline1
			customer_details_obj.landline2 = landline2
			customer_details_obj.cust_dob = cust_birth_date

			
			


			customer_details_obj.pancard = pancard
			customer_details_obj.Adharcard = Adharcard
			customer_details_obj.gender = gender 
			customer_details_obj.marital_status = marital_status
			customer_details_obj.marriage_anniversery = marr_anniv
			customer_details_obj.children = children 
			customer_details_obj.NO_Of_Children = NO_Of_Children
			customer_details_obj.occupation = occupation
			customer_details_obj.category = category
			customer_details_obj.sub_category = sub_category
			customer_details_obj.cust_gst_no = cust_gst_no
			customer_details_obj.phone_no2 = mobno2

			customer_details_obj.designation = designation

			customer_details_obj.social_fb = postdata.get("twitter_link")
			customer_details_obj.social_insta = postdata.get("facebook_link")
			customer_details_obj.social_twitter = postdata.get("instagram_link")

			customer_details_obj.company_pancard = postdata.get("company_pancard_name")
			clients_account_id = postdata.get("select_comp_id")
			customer_details_obj.city = cust_city
			customer_details_obj.country = cust_country
			customer_details_obj.landmark = landmark
			customer_details_obj.pincode = cust_pincode
			customer_details_obj.state = state
			customer_details_obj.area_building = area_building
			customer_details_obj.address_line1 = address1
			customer_details_obj.address_line2 = address2


			##shipping##
			customer_details_obj.shipping_first_name = ship_fname.capitalize() 
			customer_details_obj.shipping_last_name = ship_lname.capitalize()
			customer_details_obj.shipping_address1 = postdata.get('shipping_address',None)
			customer_details_obj.shipping_address2= postdata.get('shipping_street',None)
			customer_details_obj.shipping_area_building = postdata.get('shipping_area_building',None)
			customer_details_obj.shipping_landmark= postdata.get('shipping_landmark',None)
			customer_details_obj.shipping_city = postdata.get('shipping_city',None)
			customer_details_obj.shipping_state = postdata.get('shipping_state',None)
			customer_details_obj.shipping_pincode = postdata.get('shipping_pincode',None)
			customer_details_obj.shipping_country = postdata.get('shipping_country',None)
			## shipping
			# try:
			#     clients_account_obj2 = get_object_or_404(clients_account,id=clients_account_id)
			#     company_name = clients_account_obj2.company_name
			# except:
			#     company_name = postdata.get('company_name',None)

			# if press_btn == "Save From Company":
			#     customer_details_obj.company_name = company_name
			#     customer_details_obj.industry = industry
			#     customer_details_obj.company_phone = company_phone
			#     customer_details_obj.company_email = company_email
			#     customer_details_obj.company_website = company_website
			#     customer_details_obj.company_fb = postdata.get('company_facebook_link',None)
			#     customer_details_obj.company_twitter = postdata.get('company_twitter_link',None)
			#     customer_details_obj.company_insta = postdata.get('company_instagram_link',None)
			#     customer_details_obj.company_gst  = postdata.get('company_gst',None)
			#     customer_details_obj.customer_type = postdata.get("customer_type")
			# company_name = postdata.get('comp_name',None)
			# company_industry = postdata.get('industry',None)
			# company_gst = postdata.get('company_gst',None)
			# company_phone = postdata.get('company_phone',None)
			# company_email = postdata.get('company_email',None)
			# company_website = postdata.get('company_website',None)

			# company_twitter_link = postdata.get('company_facebook_link',None)
			# company_facebook_link = postdata.get('company_facebook_link',None)
			# company_instagram_link = postdata.get('company_instagram_link',None)

			# company_address = postdata.get('com_address',None)
			# company_street = postdata.get('com_street',None)
			# company_area_building = postdata.get('com_area_building',None)
			# company_landmark = postdata.get('com_landmark',None)
			# company_city = postdata.get('com_city',None)
			# company_state = postdata.get('com_state',None)
			# company_pincode = postdata.get('com_pincode',None)
			# company_country = postdata.get('com_country_selection',None)
			# company_pancard = postdata.get('company_pancard_name',None)


			
			# if comp_add == '1':
			#     clients_account_object_add = clients_account()
			#     clients_account_object_add.company_name = company_name
			#     clients_account_object_add.industry = company_industry
			#     clients_account_object_add.company_gst = company_gst
			#     clients_account_object_add.company_phone = company_phone
			#     clients_account_object_add.company_email = company_email
			#     clients_account_object_add.company_website = company_website
			#     clients_account_object_add.outlet = outletObj


			#     clients_account_object_add.company_twitter = company_twitter_link
			#     clients_account_object_add.company_fb = company_facebook_link
			#     clients_account_object_add.company_insta = company_instagram_link

			#     clients_account_object_add.area_building = company_area_building
			#     clients_account_object_add.address_line1 = company_address
			#     clients_account_object_add.landmark = company_landmark
			#     clients_account_object_add.city = company_city
			#     clients_account_object_add.state = company_state
			#     clients_account_object_add.street = company_street
			#     clients_account_object_add.pincode = company_pincode
			#     clients_account_object_add.country = company_country
			#     clients_account_object_add.company_pancard = company_pancard
			#     clients_account_object_add.save()
			#     customer_details_obj.clients_account_id = clients_account_object_add.id
			# else:
			#     try:
			#         clients_account_obj2 = get_object_or_404(clients_account,id=clients_account_id)
			#         com_name = clients_account_obj2.company_name
			#     except:
			#         clients_account_obj2=None
			   
			#     if clients_account_obj2:
			#         clients_account_obj2.company_name = com_name
			#         clients_account_obj2.industry = industry
			#         clients_account_obj2.company_gst = company_gst
			#         clients_account_obj2.company_phone = company_phone
			#         clients_account_obj2.company_email = company_email
			#         clients_account_obj2.company_website = company_website
			#         clients_account_obj2.outlet = outletObj


			#         clients_account_obj2.company_twitter = company_twitter_link
			#         clients_account_obj2.company_fb = company_facebook_link
			#         clients_account_obj2.company_insta = company_instagram_link

			#         clients_account_obj2.area_building = company_area_building
			#         clients_account_obj2.address_line1 = company_address
			#         clients_account_obj2.landmark = company_landmark
			#         clients_account_obj2.city = company_city
			#         clients_account_obj2.state = company_state
			#         clients_account_obj2.street = company_street
			#         clients_account_obj2.pincode = company_pincode
			#         clients_account_obj2.country = company_country
			#         clients_account_obj2.company_pancard = company_pancard
			#         clients_account_obj2.save()
			#         customer_details_obj.clients_account_id = clients_account_id
			
			try:
				clients_account_obj = get_object_or_404(clients_account,company_gst=company_gst)
			   
			except:
				clients_account_obj = clients_account()
				
			
			clients_account_obj.company_name = company_name
			clients_account_obj.industry = industry
			clients_account_obj.company_gst = company_gst
			clients_account_obj.company_phone = company_phone
			clients_account_obj.company_email = company_email
			clients_account_obj.company_website = company_website
			clients_account_obj.outlet = outletObj


			clients_account_obj.company_twitter = com_tw
			clients_account_obj.company_fb = com_fb
			clients_account_obj.company_insta =com_insta

			clients_account_obj.area_building = com_area_building
			clients_account_obj.address_line1 = com_address
			clients_account_obj.landmark = com_landmark
			clients_account_obj.city = com_city
			clients_account_obj.state = com_state
			clients_account_obj.street = com_street
			clients_account_obj.pincode = com_pincode
			clients_account_obj.country = com_country
			clients_account_obj.company_pancard = company_pancard
			clients_account_obj.save()
			customer_details_obj.clients_account_id = clients_account_obj.id

			if press_btn == "Save From Acount":
				print("-------------------------------------,,,,,,,,,,,,,")
				customer_details_obj.customer_name = postdata.get('edit_name')
				customer_details_obj.email = cust_email
				customer_details_obj.user_password = postdata.get('cust_password')
				
				try:
					customers_grouped_obj = get_object_or_404(customers_grouped,customer_id=custCode)
				except:
					customers_grouped_obj = None
				try:
					out_id_obj = get_object_or_404(outlet_details, id=outletid)
				except:
					out_id_obj = None
				if customers_grouped_obj:
					customers_grouped_obj.outlet_id = out_id_obj
					if postdata.get('dropdown') == 'regular':
						customers_grouped_obj.is_regular = "1"
						customers_grouped_obj.is_privileged = "0"
					elif postdata.get('dropdown') == 'privi_group':
						customers_grouped_obj.is_privileged = "1"
						customers_grouped_obj.is_regular = "0"
					else:
						pass
					customers_grouped_obj.customer_id = custCode
					customers_grouped_obj.save()

				if postdata.get('dropdown') == "regular":
					try:
						privileged_customers_subgroup_obj2 = get_object_or_404(privileged_customers_subgroup,customer_id=custCode,outlet_id_id=outletid)
					except:
						privileged_customers_subgroup_obj2 = None

					if privileged_customers_subgroup_obj2:
						privileged_customers_subgroup_obj2.delete()

				if postdata.get('dropdown') == "privi_group":
					if request.method == 'POST':
						postdata = request.POST.copy();
						sub_group = postdata.get('priv_sub_group')
						try:
							privileged_customers_subgroup_obj = get_object_or_404(privileged_customers_subgroup,customer_id=custCode,outlet_id_id=outletid)
						except:
							privileged_customers_subgroup_obj = None

						if privileged_customers_subgroup_obj:
							print("==",sub_group)
							try:
								group_name_obj = get_object_or_404(privilege_customer_groups,id=sub_group)
							except:
								group_name_obj = None
							if group_name_obj:
								privileged_customers_subgroup_obj.sub_group_name = group_name_obj.group_name
								privileged_customers_subgroup_obj.privilege_cust_group = group_name_obj
							privileged_customers_subgroup_obj.save()
						else:
							print("ppppelseeeeeeeeeeeeeeeeeeeeee--------")
							privileged_customers_subgroup_obj_n = privileged_customers_subgroup()
							try:
								outlet_obj = get_object_or_404(outlet_details,id = outletid)
							except:
								outlet_obj = None                               
							privileged_customers_subgroup_obj_n.outlet_id = outlet_obj
							try:
								customers_grouped_OBJ = get_object_or_404(customers_grouped,customer_id=custCode)
							except:
								customers_grouped_OBJ = None

							try:
								priv_cust = get_object_or_404(customers_grouped, id =customers_grouped_OBJ.id)
							except:
								priv_cust = None
							privileged_customers_subgroup_obj_n.cust_group_id = priv_cust

							try:
								group_name_obj = get_object_or_404(privilege_customer_groups,id=sub_group)
							except:
								group_name_obj = None

							if group_name_obj:
								privileged_customers_subgroup_obj_n.sub_group_name = group_name_obj.group_name
								privileged_customers_subgroup_obj_n.privilege_cust_group = group_name_obj
							print("lxxxxmlsnnl==========")
							privileged_customers_subgroup_obj_n.customer_id = custCode
							privileged_customers_subgroup_obj_n.save()
			if len(name_of_file) > 0:
				customer_details_obj.aadhar_pdf_file = "customers/aadhar_file/" + str(name_of_file)
			
			if len(name_of_file_pan) > 0:
				customer_details_obj.pan_pdf_file = "customers/pancard_file/" + str(name_of_file_pan)

			if len(name_of_user_profile) > 0:
				customer_details_obj.user_profile_img = "customers/user_profile_img/" + str(name_of_user_profile)
			
			if press_btn == "Remove User Image":
				customer_details_obj.user_profile_img = None
			
			# if press_btn == "Save Billing Info":
			

			customer_details_obj.save()

			messages.add_message(request, messages.SUCCESS, 'Your Customer details was edited successfully', fail_silently=True)

			if press_btn == "Save From Acount":
				return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
				url = reverse('customers:edit_customers', kwargs={'custCode': custCode})
			if press_btn == "SAVE":
				return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
			elif press_btn == 'SAVE & CLOSE':
				url = reverse('customers:get_view_customer',kwargs={'custCode': custCode})
				return HttpResponseRedirect(url)   
			url = reverse('customers:edit_customers', kwargs={'custCode': custCode})
			return HttpResponseRedirect(url)
	return render(request,template_name,locals())


@login_required(login_url='/merchant-login/')
@permission_required(['customers.add_customer_details','customers.change_customer_details','customers.delete_customer_details'],raise_exception=True)
##@multi_user_permission('Edit_Customer')
@multi_user_permission('edit', 'Customers')
def edit_customers_b2b(request, custCode='0', template_name='merchant_site/customers/edit_customers_b2b.html'):
	active_page_name = "edit_customers_b2b_page"

	# get session
	if request.session.get('is_logged_in_superuser') == False:
		outlet_list = outlet_details.objects.filter(id__in=request.session.get('allowed_outlets_list'),company_id = request.session.get('company_id'),is_active=1,is_verified = 1)
	elif request.session.get('is_logged_in_superuser') == True:
		outlet_list = outlet_details.objects.filter(company_id = request.session.get('company_id'),is_active=1,is_verified = 1)
	
	# get outlet id from session
	outletid = None
	if request.session.get('outlet_id') and outletid == None:
		outletid = int(request.session.get('outlet_id'))    

	# get outlet details
	try:
		outletObj = get_object_or_404(outlet_details, id = outletid)
	except:
		outletObj = None  

	clients_account_obj = clients_account.objects.filter(outlet=outletid,is_trash=0)  
	from json import dumps
	clients_account_list = []
	for cli in clients_account_obj:
		new_Dictionary = { 
			'comapny_id':cli.id,
			'company_name':cli.company_name,
			'industry':cli.industry,
			'company_phone':cli.company_phone,
			'company_email':cli.company_email,
			'company_website':cli.company_website,
			'company_gst':cli.company_gst,
			'company_fb':cli.company_fb,
			'company_insta':cli.company_insta,
			'company_twitter':cli.company_twitter,
			'company_pancard':cli.company_pancard,
			'com_address':cli.address_line1,
			'com_street':cli.street,
			'com_area_building':cli.area_building,
			'com_landmark':cli.landmark,
			'com_city':cli.city,
			'com_state':cli.state,
			'com_pincode':cli.pincode,
			'com_country_selection':cli.country,
			}
		clients_account_list.append(new_Dictionary)
	clients_account_dataJSON = dumps(clients_account_list)  

	# get outlet is jmd
	country_obj = Country.objects.all()
	if outletObj.is_jmd == True:
		template_name = 'merchant_site/customers/jmd_edit_customer.html'  

	# get car details from id
	car_details_obj = CarDetails.objects.filter(is_active=True)
	if car_details_obj.count() == 0:
		car_details_obj = None
	selected_client_acc = ''
	custfirstname = ""
	custlastname = ""
	if custCode != 0 or custCode != None:
		try:
			customer_details_obj = get_object_or_404(customer_details, id=custCode)
			outletid = int(customer_details_obj.outlet_id)
			if customer_details_obj.clients_account_id:
				selected_client_acc = int(customer_details_obj.clients_account_id)
			if customer_details_obj.customer_name:
				custname = str(customer_details_obj.customer_name).split()
				if len(custname) > 1:
					custfirstname = custname[0]
					custlastname = custname[1]
				else:
					custfirstname = custname[0]
			if customer_details_obj.aadhar_pdf_file:
				prefix_pdf_name = "customers/aadhar_file/cust_aadhar_"+str(custCode)+"_"
				aahar_pdf_name = (str(customer_details_obj.aadhar_pdf_file)).replace(prefix_pdf_name,"")
			
			if customer_details_obj.pan_pdf_file:
				prefix_pdf_name_pan = "customers/pancard_file/cust_pan_"+str(custCode)+"_"
				pancard_pdf_name = (str(customer_details_obj.pan_pdf_file)).replace(prefix_pdf_name_pan,"")
		except:
			customer_details_obj = None
	else:
		customer_details_obj = None

	if selected_client_acc:
		try:
			client_acc_obj = get_object_or_404(clients_account,id=selected_client_acc)
		except:
			client_acc_obj = None
	first_name, last_name = "", ""
	customer_birthdate = ""

	if customer_details_obj:
		try:
			privilege_customer_groups_obj = privilege_customer_groups.objects.filter(outlet_id = outletid)
		except:
			privilege_customer_groups_obj = None

		
		cust_group_id =""
		try:
			customer_in_group_obj = get_object_or_404(privileged_customers_subgroup,customer_id=custCode)
			cust_group_id = customer_in_group_obj.privilege_cust_group_id
		except:
			customer_in_group_obj = None
		
		try:
			out_id_obj = get_object_or_404(outlet_details, id=outletid)
		except:
			out_id_obj = None

		try:
			customers_grouped_obj = get_object_or_404(customers_grouped,outlet_id=out_id_obj,customer_id=custCode)
		except:
			customers_grouped_obj = None
		cust_group_type  = ""
		if customers_grouped_obj:
			if customers_grouped_obj.is_regular == 1:
				cust_group_type = "Regular"
			if customers_grouped_obj.is_privileged == 1:
				try:
					privileged_customers_SUBgr_obj = get_object_or_404(privileged_customers_subgroup,customer_id=custCode)
					sub_group_name = privileged_customers_SUBgr_obj.sub_group_name
				except:
					pass
				cust_group_type = "Privilege"
		if customer_details_obj.customer_name:
			full_name = (customer_details_obj.customer_name).split(" ")
			if full_name:
				try:
					first_name = full_name[0]
				except:
					first_name = None
				try:
					last_name = full_name[1]
				except:
					last_name = None

		if customer_details_obj.cust_dob:
			split_dob_datettime = str(customer_details_obj.cust_dob).split(" ")
			split_dob = str(split_dob_datettime[0]).split("-")
			customer_birthdate = split_dob[2]+"-"+split_dob[1]+"-"+split_dob[0]    


	if request.method == 'POST':
		postdata = request.POST.copy();
		print(postdata)
		

		press_btn = postdata.get('press_btn', None)
		title = postdata.get('title',None)
		cust_first_name = postdata.get('cust_first_name',None)
		cust_last_name = postdata.get('cust_last_name',None)
		cust_email = postdata.get('email',None)
		mobno = postdata.get('mob_no',None)
		landline1 = postdata.get('landline1',None)
		landline2 = postdata.get('landline2',None)      
		cust_birth_date = postdata.get('birth_date',None)
		cust_country = postdata.get('country',None)
		cust_bill = postdata.get('order_amt',None)
		cust_city = postdata.get('city',None)
		cust_pincode = postdata.get('pincode',None)
		service_name = postdata.get('service_name',None)
		area_building = postdata.get('area_building',None)
		address1 = postdata.get('address',None)
		address2 = postdata.get('street',None)
		landmark = postdata.get('landmark',None)
		state = postdata.get('state',None)
		company_name = postdata.get('company_name',None)
		industry = postdata.get('industry',None)
		designation = postdata.get('designation',None)
		company_phone = postdata.get('company_phone',None)
		company_email = postdata.get('company_email',None)
		company_website = postdata.get('company_website',None)

		mobno2 =  postdata.get('mob_no2',None)
		cust_gst_no =  postdata.get('cust_gst_no',None)
		
		# outletid = int(postdata.get('select_outlet')) if postdata.get('select_outlet') else None
		cust_start_date = postdata.get('start_date',None)
		cust_service_date = postdata.get('service_date',None)
		
		
		
		
		
		pancard = postdata.get('pancard_name',None)
		Adharcard = postdata.get('Adharcard',None)
		gender = postdata.get('gender',None)
		marital_status = postdata.get('marital_status',None)
		marr_anniv = postdata.get('marriage_anniversery',None)
		children = postdata.get('children',None)
		NO_Of_Children = postdata.get('countchildren',None)
		occupation = postdata.get('occupation',None)
		category = postdata.get('category',None)
		sub_category = postdata.get('sub_category',None)

		service_vehicle_number =  postdata.get('vehicle_no',None)
		ship_fname=postdata.get('shipping_cust_fname',None)
		ship_lname=postdata.get('shipping_cust_lname',None)
		comp_add=postdata.get('comp_add',None)
		company_name = postdata.get('comp_name',None)
		industry = postdata.get('industry',None)
		company_gst = postdata.get('company_gst',None)
		company_phone = postdata.get('company_phone',None)
		company_email = postdata.get('company_email',None)
		company_website = postdata.get('company_website',None)

		twitter_link = postdata.get('twitter_link',None)
		facebook_link = postdata.get('facebook_link',None)
		instagram_link = postdata.get('instagram_link',None)

		com_address = postdata.get('com_address',None)
		com_street = postdata.get('com_street',None)
		com_area_building = postdata.get('com_area_building',None)
		com_landmark = postdata.get('com_landmark',None)
		com_city = postdata.get('com_city',None)
		com_state = postdata.get('com_state',None)
		com_pincode = postdata.get('com_pincode',None)
		com_country = postdata.get('com_country',None)
		company_pancard = postdata.get('company_pancard_name',None)
		com_fb=postdata.get('company_facebook_link',None)
		com_insta=postdata.get('company_instagram_link',None)
		com_tw=postdata.get('company_twitter_link',None)
		name_of_file =""
		if postdata.get('is_aadhar_file') == '1':
			if request.FILES['aadhar_file']:
				image_file = request.FILES.get('aadhar_file')
				encodedImage = base64.b64encode(image_file.read())
				imageExt = str(image_file).split(".")
				data = base64.b64decode(encodedImage)
				save_path = SERVER_UPLOAD_URL+'customers/aadhar_file/'
				name_of_file = "cust_aadhar_" + str(custCode)+ "_" + str(imageExt[0]) + "." + str(imageExt[1])
				completeImageName = os.path.join(save_path, name_of_file)
				file1 = open(completeImageName, "wb")
				file1.write(data)
				file1.close()
				# print("adhar pres",imageExt)
				# return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
		
		name_of_file_pan = ""
		if postdata.get('is_pan_file') == '1':
			if request.FILES['pan_file']:
				image_file_pan = request.FILES.get('pan_file')
				encodedImage2 = base64.b64encode(image_file_pan.read())
				imageExt2 = str(image_file_pan).split(".")
				data2 = base64.b64decode(encodedImage2)
				save_path2 = SERVER_UPLOAD_URL+'customers/pancard_file/'
				name_of_file_pan = "cust_pan_"+ str(custCode)+"_"+str(imageExt2[0])+"."+str(imageExt2[1])
				completeImageName2 = os.path.join(save_path2,name_of_file_pan)
				file2 = open(completeImageName2,"wb")
				file2.write(data2)
				file2.close()

		name_of_user_profile = ""
		if postdata.get('is_user_profile') == '1':
			if request.FILES['user_profile_img']:
				image_user_profile = request.FILES.get('user_profile_img')
				encodedImage3 = base64.b64encode(image_user_profile.read())
				imageExt3 = str(image_user_profile).split(".")
				data3 = base64.b64decode(encodedImage3)
				save_path3 = SERVER_UPLOAD_URL+'customers/user_profile_img/'
				name_of_user_profile = "user_profile_img_"+ str(custCode)+"_"+str(imageExt3[0])+"."+str(imageExt3[1])
				completeImageName3 = os.path.join(save_path3,name_of_user_profile)
				file3 = open(completeImageName3,"wb")
				file3.write(data3)
				file3.close()
	   
		if cust_birth_date and cust_birth_date != "":
			cust_birth_date = datetime.strptime(cust_birth_date, '%d-%m-%Y')
			cust_birth_date = cust_birth_date.strftime('%Y-%m-%d %H:%M:%S')
		else:
			cust_birth_date = None   

		print(marr_anniv)
		print(type(marr_anniv))
		if marr_anniv != None and marr_anniv != "":
			print('oooooooooo')
			marr_anniv = datetime.strptime(marr_anniv, '%d-%m-%Y')
			marr_anniv = marr_anniv.strftime('%Y-%m-%d %H:%M:%S')
		else:
			print('kkkkkkkkkkkkkkkkkk')
			marr_anniv = None                

		print(" ---------------------------------------------------------- Is is coming till here?????????????????????",marr_anniv)
		print(" ---------------------------------------------------------- ayaaaaa kyaaa????????????????????", cust_birth_date)
		if press_btn == 'SAVE' or press_btn == 'SAVE & CLOSE' or press_btn == 'Save From Acount' or press_btn == "Remove User Image" or press_btn == "Save Billing Info" or press_btn == "Save From Company":
			'''save customer'''
			customer_details_obj = customer_details.objects.get(id=custCode)
			customer_details_obj.title = title 
			customer_details_obj.phone_no = mobno
			customer_details_obj.customer_name = cust_first_name + " " +cust_last_name
			customer_details_obj.email = cust_email
			customer_details_obj.entry_point = 'INDV'
			customer_details_obj.created_by_id = request.user.id
			customer_details_obj.last_modified_by_id = request.user.id #01-10-2019
			if outletid:
				customer_details_obj.outlet_id = outletid
			# Added for jmd only
			customer_details_obj.landline1 = landline1
			customer_details_obj.landline2 = landline2
			customer_details_obj.cust_dob = cust_birth_date

			
			


			customer_details_obj.pancard = pancard
			customer_details_obj.Adharcard = Adharcard
			customer_details_obj.gender = gender 
			customer_details_obj.marital_status = marital_status
			customer_details_obj.marriage_anniversery = marr_anniv
			customer_details_obj.children = children 
			customer_details_obj.NO_Of_Children = NO_Of_Children
			customer_details_obj.occupation = occupation
			customer_details_obj.category = category
			customer_details_obj.sub_category = sub_category
			customer_details_obj.cust_gst_no = cust_gst_no
			customer_details_obj.phone_no2 = mobno2

			customer_details_obj.designation = designation

			customer_details_obj.social_fb = postdata.get("twitter_link")
			customer_details_obj.social_insta = postdata.get("facebook_link")
			customer_details_obj.social_twitter = postdata.get("instagram_link")

			customer_details_obj.company_pancard = postdata.get("company_pancard_name")
			clients_account_id = postdata.get("select_comp_id")
			customer_details_obj.city = cust_city
			customer_details_obj.country = cust_country
			customer_details_obj.landmark = landmark
			customer_details_obj.pincode = cust_pincode
			customer_details_obj.state = state
			customer_details_obj.area_building = area_building
			customer_details_obj.address_line1 = address1
			customer_details_obj.address_line2 = address2


			##shipping##
			customer_details_obj.shipping_first_name = ship_fname.capitalize() 
			customer_details_obj.shipping_last_name = ship_lname.capitalize()
			customer_details_obj.shipping_address1 = postdata.get('shipping_address',None)
			customer_details_obj.shipping_address2= postdata.get('shipping_street',None)
			customer_details_obj.shipping_area_building = postdata.get('shipping_area_building',None)
			customer_details_obj.shipping_landmark= postdata.get('shipping_landmark',None)
			customer_details_obj.shipping_city = postdata.get('shipping_city',None)
			customer_details_obj.shipping_state = postdata.get('shipping_state',None)
			customer_details_obj.shipping_pincode = postdata.get('shipping_pincode',None)
			customer_details_obj.shipping_country = postdata.get('shipping_country',None)
			## shipping
			# try:
			#     clients_account_obj2 = get_object_or_404(clients_account,id=clients_account_id)
			#     company_name = clients_account_obj2.company_name
			# except:
			#     company_name = postdata.get('company_name',None)

			# if press_btn == "Save From Company":
			#     customer_details_obj.company_name = company_name
			#     customer_details_obj.industry = industry
			#     customer_details_obj.company_phone = company_phone
			#     customer_details_obj.company_email = company_email
			#     customer_details_obj.company_website = company_website
			#     customer_details_obj.company_fb = postdata.get('company_facebook_link',None)
			#     customer_details_obj.company_twitter = postdata.get('company_twitter_link',None)
			#     customer_details_obj.company_insta = postdata.get('company_instagram_link',None)
			#     customer_details_obj.company_gst  = postdata.get('company_gst',None)
			#     customer_details_obj.customer_type = postdata.get("customer_type")
			# company_name = postdata.get('comp_name',None)
			# company_industry = postdata.get('industry',None)
			# company_gst = postdata.get('company_gst',None)
			# company_phone = postdata.get('company_phone',None)
			# company_email = postdata.get('company_email',None)
			# company_website = postdata.get('company_website',None)

			# company_twitter_link = postdata.get('company_facebook_link',None)
			# company_facebook_link = postdata.get('company_facebook_link',None)
			# company_instagram_link = postdata.get('company_instagram_link',None)

			# company_address = postdata.get('com_address',None)
			# company_street = postdata.get('com_street',None)
			# company_area_building = postdata.get('com_area_building',None)
			# company_landmark = postdata.get('com_landmark',None)
			# company_city = postdata.get('com_city',None)
			# company_state = postdata.get('com_state',None)
			# company_pincode = postdata.get('com_pincode',None)
			# company_country = postdata.get('com_country_selection',None)
			# company_pancard = postdata.get('company_pancard_name',None)


			
			# if comp_add == '1':
			#     clients_account_object_add = clients_account()
			#     clients_account_object_add.company_name = company_name
			#     clients_account_object_add.industry = company_industry
			#     clients_account_object_add.company_gst = company_gst
			#     clients_account_object_add.company_phone = company_phone
			#     clients_account_object_add.company_email = company_email
			#     clients_account_object_add.company_website = company_website
			#     clients_account_object_add.outlet = outletObj


			#     clients_account_object_add.company_twitter = company_twitter_link
			#     clients_account_object_add.company_fb = company_facebook_link
			#     clients_account_object_add.company_insta = company_instagram_link

			#     clients_account_object_add.area_building = company_area_building
			#     clients_account_object_add.address_line1 = company_address
			#     clients_account_object_add.landmark = company_landmark
			#     clients_account_object_add.city = company_city
			#     clients_account_object_add.state = company_state
			#     clients_account_object_add.street = company_street
			#     clients_account_object_add.pincode = company_pincode
			#     clients_account_object_add.country = company_country
			#     clients_account_object_add.company_pancard = company_pancard
			#     clients_account_object_add.save()
			#     customer_details_obj.clients_account_id = clients_account_object_add.id
			# else:
			#     try:
			#         clients_account_obj2 = get_object_or_404(clients_account,id=clients_account_id)
			#         com_name = clients_account_obj2.company_name
			#     except:
			#         clients_account_obj2=None
			   
			#     if clients_account_obj2:
			#         clients_account_obj2.company_name = com_name
			#         clients_account_obj2.industry = industry
			#         clients_account_obj2.company_gst = company_gst
			#         clients_account_obj2.company_phone = company_phone
			#         clients_account_obj2.company_email = company_email
			#         clients_account_obj2.company_website = company_website
			#         clients_account_obj2.outlet = outletObj


			#         clients_account_obj2.company_twitter = company_twitter_link
			#         clients_account_obj2.company_fb = company_facebook_link
			#         clients_account_obj2.company_insta = company_instagram_link

			#         clients_account_obj2.area_building = company_area_building
			#         clients_account_obj2.address_line1 = company_address
			#         clients_account_obj2.landmark = company_landmark
			#         clients_account_obj2.city = company_city
			#         clients_account_obj2.state = company_state
			#         clients_account_obj2.street = company_street
			#         clients_account_obj2.pincode = company_pincode
			#         clients_account_obj2.country = company_country
			#         clients_account_obj2.company_pancard = company_pancard
			#         clients_account_obj2.save()
			#         customer_details_obj.clients_account_id = clients_account_id
			
			try:
				clients_account_obj = get_object_or_404(clients_account,company_gst=company_gst)
			   
			except:
				clients_account_obj = clients_account()
				
			
			clients_account_obj.company_name = company_name
			clients_account_obj.industry = industry
			clients_account_obj.company_gst = company_gst
			clients_account_obj.company_phone = company_phone
			clients_account_obj.company_email = company_email
			clients_account_obj.company_website = company_website
			clients_account_obj.outlet = outletObj


			clients_account_obj.company_twitter = com_tw
			clients_account_obj.company_fb = com_fb
			clients_account_obj.company_insta =com_insta

			clients_account_obj.area_building = com_area_building
			clients_account_obj.address_line1 = com_address
			clients_account_obj.landmark = com_landmark
			clients_account_obj.city = com_city
			clients_account_obj.state = com_state
			clients_account_obj.street = com_street
			clients_account_obj.pincode = com_pincode
			clients_account_obj.country = com_country
			clients_account_obj.company_pancard = company_pancard
			clients_account_obj.save()
			customer_details_obj.clients_account_id = clients_account_obj.id

			if press_btn == "Save From Acount":
				print("-------------------------------------,,,,,,,,,,,,,")
				customer_details_obj.customer_name = postdata.get('edit_name')
				customer_details_obj.email = cust_email
				customer_details_obj.user_password = postdata.get('cust_password')
				
				try:
					customers_grouped_obj = get_object_or_404(customers_grouped,customer_id=custCode)
				except:
					customers_grouped_obj = None
				try:
					out_id_obj = get_object_or_404(outlet_details, id=outletid)
				except:
					out_id_obj = None
				if customers_grouped_obj:
					customers_grouped_obj.outlet_id = out_id_obj
					if postdata.get('dropdown') == 'regular':
						customers_grouped_obj.is_regular = "1"
						customers_grouped_obj.is_privileged = "0"
					elif postdata.get('dropdown') == 'privi_group':
						customers_grouped_obj.is_privileged = "1"
						customers_grouped_obj.is_regular = "0"
					else:
						pass
					customers_grouped_obj.customer_id = custCode
					customers_grouped_obj.save()

				if postdata.get('dropdown') == "regular":
					try:
						privileged_customers_subgroup_obj2 = get_object_or_404(privileged_customers_subgroup,customer_id=custCode,outlet_id_id=outletid)
					except:
						privileged_customers_subgroup_obj2 = None

					if privileged_customers_subgroup_obj2:
						privileged_customers_subgroup_obj2.delete()

				if postdata.get('dropdown') == "privi_group":
					if request.method == 'POST':
						postdata = request.POST.copy();
						sub_group = postdata.get('priv_sub_group')
						try:
							privileged_customers_subgroup_obj = get_object_or_404(privileged_customers_subgroup,customer_id=custCode,outlet_id_id=outletid)
						except:
							privileged_customers_subgroup_obj = None

						if privileged_customers_subgroup_obj:
							print("==",sub_group)
							try:
								group_name_obj = get_object_or_404(privilege_customer_groups,id=sub_group)
							except:
								group_name_obj = None
							if group_name_obj:
								privileged_customers_subgroup_obj.sub_group_name = group_name_obj.group_name
								privileged_customers_subgroup_obj.privilege_cust_group = group_name_obj
							privileged_customers_subgroup_obj.save()
						else:
							print("ppppelseeeeeeeeeeeeeeeeeeeeee--------")
							privileged_customers_subgroup_obj_n = privileged_customers_subgroup()
							try:
								outlet_obj = get_object_or_404(outlet_details,id = outletid)
							except:
								outlet_obj = None                               
							privileged_customers_subgroup_obj_n.outlet_id = outlet_obj
							try:
								customers_grouped_OBJ = get_object_or_404(customers_grouped,customer_id=custCode)
							except:
								customers_grouped_OBJ = None

							try:
								priv_cust = get_object_or_404(customers_grouped, id =customers_grouped_OBJ.id)
							except:
								priv_cust = None
							privileged_customers_subgroup_obj_n.cust_group_id = priv_cust

							try:
								group_name_obj = get_object_or_404(privilege_customer_groups,id=sub_group)
							except:
								group_name_obj = None

							if group_name_obj:
								privileged_customers_subgroup_obj_n.sub_group_name = group_name_obj.group_name
								privileged_customers_subgroup_obj_n.privilege_cust_group = group_name_obj
							print("lxxxxmlsnnl==========")
							privileged_customers_subgroup_obj_n.customer_id = custCode
							privileged_customers_subgroup_obj_n.save()
			if len(name_of_file) > 0:
				customer_details_obj.aadhar_pdf_file = "customers/aadhar_file/" + str(name_of_file)
			
			if len(name_of_file_pan) > 0:
				customer_details_obj.pan_pdf_file = "customers/pancard_file/" + str(name_of_file_pan)

			if len(name_of_user_profile) > 0:
				customer_details_obj.user_profile_img = "customers/user_profile_img/" + str(name_of_user_profile)
			
			if press_btn == "Remove User Image":
				customer_details_obj.user_profile_img = None
			
			# if press_btn == "Save Billing Info":
			

			customer_details_obj.save()

			messages.add_message(request, messages.SUCCESS, 'Your Customer details was edited successfully', fail_silently=True)

			if press_btn == "Save From Acount":
				return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
				url = reverse('customers:edit_customers', kwargs={'custCode': custCode})
			if press_btn == "SAVE":
				return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
			elif press_btn == 'SAVE & CLOSE':
				url = reverse('customers:get_view_customer',kwargs={'custCode': custCode})
				return HttpResponseRedirect(url)   
			url = reverse('customers:edit_customers', kwargs={'custCode': custCode})
			return HttpResponseRedirect(url)
	return render(request,template_name,locals())




@login_required(login_url='/merchant-login/')
@redirectMerchantAsPerProgress("IMPORT_CUSTOMERS")
@permission_required(['customers.add_customer_details','customers.change_customer_details','customers.delete_customer_details'],raise_exception=True)
@check_user_subcription('ADD_BULK_CUSTOMER')
def upload_customers_info(request, template_name='merchant_site/customers/import_customers.html'):
	active_page_name = "import_customers_page"

	if request.session.get('is_logged_in_superuser') == False:
		outlet_list = outlet_details.objects.filter(id__in=request.session.get('allowed_outlets_list'),company_id = request.session.get('company_id'),is_active=1,is_verified = 1)
	elif request.session.get('is_logged_in_superuser') == True:
		outlet_list = outlet_details.objects.filter(company_id = request.session.get('company_id'),is_active=1,is_verified = 1)
	

	outletid = None
	if request.session.get('outlet_id') and outletid == None:
		outletid = int(request.session.get('outlet_id'))   
		print(outletid)
	if request.method == 'POST':
		postdata = request.POST.copy();   

		customer_file = request.FILES.get('customer_sheet', None)   
		# try:
		#     outletid = postdata.get('select_outlet')
		#     # outletid = postdata.get('select_outlet',None)
		# except:
		outletid = int(request.session.get('outlet_id'))   
		if postdata['importPage'] == 'SAVE' or postdata['importPage'] == 'SAVE & CLOSE':
			if customer_file and outletid:
				# filepath = "C:/"+ str(customer_file)
				import_file_obj = import_customer_file()
				print("1111111111111111111111111")
				print(import_file_obj.id)
				import_file_obj.file_name = customer_file
				import_file_obj.outlet_id = outletid
				import_file_obj.created_by = request.user
				print(import_file_obj.id)
				print(import_file_obj.file_name)
				print(import_file_obj.outlet_id)
				print(import_file_obj.created_by)

				import_file_obj.save()
				
				# filepath = "/home/xircls/xircls/static/"+str(import_file_obj.file_name)                
				# filepath = "./static/"+str(import_file_obj.file_name)                
				BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
				filepath = os.path.join(BASE_DIR, "static",str(import_file_obj.file_name))                 
			  
				with open(filepath , encoding='utf-8',errors='ignore') as data_file:
					cursor = connection.cursor() 
					reader = csv.reader(data_file)
					not_save_count = 0
					save_count = 0
					not_valid_count = 0
					
					for row in reader:
						if row[0] != 'name':
							cust_name = row[0]
							cust_email = row[1]
							phone_number = row[2]
							entry = 'IMPORT'
							
							valid_record = check_import_file_record(cust_name, cust_email, phone_number) 
							if valid_record == False:
								not_valid_count += 1
							else: 
								cust_avail = check_customer_isAvailabel(request, outletid, cust_email, phone_number)
								if cust_avail == False:
									try:
										user_obj = get_object_or_404(User, Q(username = cust_email) | Q(username = phone_number))
									except:
										user_obj = None
										 
									try:
										cust_profile_obj = get_object_or_404(CustomerProfile, phone_no = phone_number)
									except:
										cust_profile_obj = None
										 
									if user_obj == None and cust_profile_obj == None:
										mac = get_mac()
										pwd = 'XlC16269'+phone_number+'XlC16269' #create a hash password with salt
										encrypt_pwd = make_password(pwd)       
										customer_user = User()
										customer_user.username = phone_number
										customer_user.password = encrypt_pwd
										customer_user.is_active = 0
										customer_user.save()
					
										userid = customer_user.id 
										  
										profile = CustomerProfile()
										profile.user_id = customer_user
										profile.phone_no = phone_number
										profile.desktop_mac_id = mac          
										profile.entry_point ='INDV'
										profile.ip_address = request.META.get('REMOTE_ADDR')
										profile.save()
										customer_user.groups.add(Group.objects.get(name='Customer'))
										  
									elif user_obj:
										userid = user_obj.id
										  
									elif cust_profile_obj:
										userid = cust_profile_obj.user_id_id
								 
									'''save customer'''  
									customer_obj = customer_details()
									customer_obj.phone_no = phone_number
									customer_obj.customer_name = cust_name
									customer_obj.email = cust_email
									customer_obj.entry_point = entry
									customer_obj.created_by_id = request.user.id
									customer_obj.outlet_id = outletid
									customer_obj.user_id = userid
									customer_obj.company_id = request.session.get('company_id')
									customer_obj.save()
									save_count += 1
								else:
									not_save_count += 1    
							  
					messages.add_message(request, messages.SUCCESS, str(save_count)+' customers added',fail_silently=True)
					 
					if not_save_count > 0:
						messages.add_message(request, messages.ERROR, str(not_save_count)+' customers not added because they already exist',fail_silently=True)
					 
					# if not_valid_count > 0:
					#   messages.add_message(request, messages.SUCCESS, str(not_valid_count)+' Records are not valid, please check it',fail_silently=True)
						 
					request.session['outlet_id'] = outletid       
					 
					if postdata['importPage'] == 'SAVE':
						pass
					elif postdata['importPage'] == 'SAVE & CLOSE':                                
						url = reverse('customers:get_my_customers')
						return HttpResponseRedirect(url)    
			else:
				messages.add_message(request, messages.ERROR, 'File Not import',fail_silently=True)
								
	return render(request,template_name,locals())

@login_required(login_url='/merchant-login/')
@redirectMerchantAsPerProgress("IMPORT_CUSTOMERS")
def jmd_upload_customers_info_servicing(request, template_name='merchant_site/customers/jmd_import_customers.html'):
    active_page_name = "import_customers_page"

    if request.session.get('is_logged_in_superuser') == False:
        outlet_list = outlet_details.objects.filter(id__in=request.session.get('allowed_outlets_list'),company_id = request.session.get('company_id'),is_active=1,is_verified = 1)
    elif request.session.get('is_logged_in_superuser') == True:
        outlet_list = outlet_details.objects.filter(company_id = request.session.get('company_id'),is_active=1,is_verified = 1)
    

    outletid = None
    if request.session.get('outlet_id') and outletid == None:
        outletid = int(request.session.get('outlet_id'))   
        
    if request.method == 'POST':
        postdata = request.POST.copy();           
        customer_file = request.FILES.get('customer_sheet', None)   
        outletid = postdata.get('select_outlet',None)

        if outletid == None or outletid == '0':
            outletid = int(request.session.get('outlet_id'))
            

        if postdata['importPage'] == 'SAVE' or postdata['importPage'] == 'SAVE & CLOSE':
            if customer_file and outletid:
                import_file_obj = import_customer_file()
                import_file_obj.file_name = customer_file
                import_file_obj.outlet_id = outletid
                import_file_obj.created_by = request.user
                import_file_obj.save()
                
                # filepath = "/home/xircls/xircls/static/"+str(import_file_obj.file_name)                
                # filepath = "./static/"+str(import_file_obj.file_name)                
                BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
                filepath = os.path.join(BASE_DIR, "static",str(import_file_obj.file_name))                 
            
                with open(filepath , encoding='utf-8',errors='ignore') as data_file:
                    cursor = connection.cursor() 
                    reader = csv.reader(data_file)
                    not_save_count = 0
                    save_count = 0
                    not_valid_count = 0
                    no_data = 0
                    
                    for row in reader:
                        if row[0] != 'INV LOCATION':
                            entry = 'IMPORT'
                            location = row[0]
                            date = row[1]
                            job_date = row[2]
                            repair_type = row[3]
                            service_advisor = row[4]
                            car_brand = row[5]
                            model = row[6] 
                            title = row[7]                            
                            cust_name = row[8]
                            phone_number = row[9]
                            cust_email = row[10]                            
                            registration_number = row[11].replace(" ", "")
                            registration_number = registration_number.replace("-", "")
                            address1 = row[12]
                            address2 = row[13]
                            address3 = row[14]
                            landline_number = row[15]

                            #insurance_policy_expire_date = row[16]         #04-10-2019
                            
                            # car_obj = CarDetails.objects.filter(carmodel__contains=model).last()

                            # if car_obj:
                            #     car_brand = car_obj.brand
                            # else:
                            #     car_brand = None  
                            
                            try:
                                if "/" in date:
                                    date = datetime.strptime(date, '%d/%m/%Y').date()
                                elif "-" in job_date:
                                    date = datetime.strptime(date, '%d-%m-%Y').date()                                
                                date = date.strftime('%Y-%m-%d %H:%M:%S')
                            except:                                
                                date = None

                            try:
                                if "/" in job_date:
                                    job_date = datetime.strptime(job_date, '%d/%m/%Y').date()
                                elif "-" in job_date:    
                                    job_date = datetime.strptime(job_date, '%d-%m-%Y').date()
                                job_date = job_date.strftime('%Y-%m-%d %H:%M:%S')
                            except:
                                job_date  = None
                            
                            #04-10-2019
                            # try:
                            #     if "/" in insurance_policy_expire_date:
                            #         insurance_policy_expire_date = datetime.strptime(insurance_policy_expire_date, '%d/%m/%Y').date()
                            #     elif "-" in insurance_policy_expire_date:    
                            #         insurance_policy_expire_date = datetime.strptime(insurance_policy_expire_date, '%d-%m-%Y').date()
                            #     insurance_policy_expire_date = insurance_policy_expire_date.strftime('%Y-%m-%d %H:%M:%S')
                            # except:
                            #    insurance_policy_expire_date  = None


                            if phone_number.strip() == "" and cust_email.strip() == "":
                                no_data += 1
                                continue
                            
                            # valid_record = check_import_file_record(cust_name, cust_email, phone_number) 
                            valid_record = True # Use valid record function for valdition of name ,email,number if necessary 
                            if valid_record == False:
                                not_valid_count += 1                                                            
                            else:                                 
                                cust_avail = check_customer_isAvailabel(request, outletid, cust_email, phone_number)

                                if cust_avail == False:

                                    if cust_email !=None and cust_email.strip() == "":
                                        cust_email = None

                                    if phone_number != None and phone_number.strip() == "":
                                        phone_number = None   
                                        
                                    try:
                                        user_obj = get_object_or_404(User, Q(username = cust_email) | Q(username = phone_number))
                                    except:
                                        user_obj = None
                                        
                                    try:
                                        cust_profile_obj = get_object_or_404(CustomerProfile, phone_no = phone_number)
                                    except:
                                        cust_profile_obj = None
                                        
                                    if user_obj == None and cust_profile_obj == None:
                                        mac = get_mac()                                                                                
                                        if phone_number:
                                            username = phone_number
                                        elif cust_email:
                                            username = cust_email                                            
                                        pwd = 'XlC16269'+username+'XlC16269' #create a hash password with salt
                                        encrypt_pwd = make_password(pwd)           
                                        customer_user = User()
                                        customer_user.username = username
                                        customer_user.email = cust_email if cust_email else ''    
                                        customer_user.password = encrypt_pwd
                                        customer_user.is_active = 0
                                        customer_user.save()
                    
                                        userid = customer_user.id 
                                        
                                        profile = CustomerProfile()
                                        profile.user_id = customer_user
                                        profile.phone_no = phone_number
                                        profile.desktop_mac_id = mac          
                                        profile.entry_point ='INDV'
                                        profile.ip_address = request.META.get('REMOTE_ADDR')
                                        profile.email_id = cust_email if cust_email != None else None
                                        profile.save()
                                        customer_user.groups.add(Group.objects.get(name='Customer'))
                                        
                                    elif user_obj:
                                        userid = user_obj.id
                                        
                                    elif cust_profile_obj:
                                        userid = cust_profile_obj.user_id_id
                                
                                    '''save customer'''  
                                    customer_obj = customer_details()
                                    customer_obj.phone_no = phone_number if phone_number else ''
                                    customer_obj.customer_name = cust_name
                                    customer_obj.email = cust_email if cust_email else ""
                                    customer_obj.entry_point = entry
                                    customer_obj.created_by_id = request.user.id
                                    customer_obj.outlet_id = outletid
                                    customer_obj.user_id = userid
                                    customer_obj.company_id = request.session.get('company_id')
                                    customer_obj.title = title
                                    customer_obj.address_line1 = address1
                                    customer_obj.address_line2 = address2
                                    customer_obj.area_building = address3
                                    customer_obj.landline1 = landline_number 
                                    customer_obj.save()

                                    customer_vehicle_obj = jmdCustomerVehicle()
                                    customer_vehicle_obj.vehicle_number = registration_number
                                    customer_vehicle_obj.car_model = model
                                    customer_vehicle_obj.brand = car_brand
                                    # customer_vehicle_obj.invoice_location = location
                                    customer_vehicle_obj.customer_id = customer_obj.id
                                    customer_vehicle_obj.outlet_id = outletid
                                    customer_vehicle_obj.user_id = userid
                                    customer_vehicle_obj.save()

                                    customer_servicing_obj = jmdCustServicingDetails() 
                                    customer_servicing_obj.repair_type = repair_type
                                    customer_servicing_obj.service_advisor = service_advisor
                                    customer_servicing_obj.job_card_date = job_date
                                    customer_servicing_obj.service_invoice_date = date
                                    customer_servicing_obj.service_location = location
                                    customer_servicing_obj.customer_id =customer_obj.id
                                    customer_servicing_obj.outlet_id = outletid
                                    customer_servicing_obj.vehicle_id = customer_vehicle_obj.id
                                    customer_servicing_obj.user_id = userid
                                    customer_servicing_obj.save()

                                    #04-10-2019
                                    customer_insurance_obj = jmd_cust_insurance_details()
                                    customer_insurance_obj.policy_expiry_date = insurance_policy_expire_date
                                    customer_insurance_obj.customer_id = customer_obj.id
                                    customer_insurance_obj.outlet_id = outletid
                                    customer_insurance_obj.user_id = userid
                                    customer_insurance_obj.save()

                                    save_count += 1
                                else:
                                    not_save_count += 1   

                                    #04-10-2019 
                                    # to import data which needs only insurance policy expire date to be imported
                                    # jmd_cust_insurance_details.objects.filter(user_id=cust_avail).update(policy_expiry_date=insurance_policy_expire_date)
                            
                    messages.add_message(request, messages.SUCCESS, str(save_count)+' customers added',fail_silently=True)
                    
                    if not_save_count > 0:
                        messages.add_message(request, messages.ERROR, str(not_save_count)+' customers not added because they already exist',fail_silently=True)

                    if no_data > 0:
                        messages.add_message(request, messages.ERROR, str(no_data)+' customers not added because mobile number and email id not found',fail_silently=True)                        
                                            
                    request.session['outlet_id'] = outletid       
                    
                    if postdata['importPage'] == 'SAVE':
                        pass
                    elif postdata['importPage'] == 'SAVE & CLOSE':                                
                        url = reverse('customers:get_my_customers')
                        return HttpResponseRedirect(url)    
            else:
                messages.add_message(request, messages.ERROR, 'File Not import',fail_silently=True)
                                
    return render(request,template_name,locals())

@login_required(login_url='/merchant-login/')
@redirectMerchantAsPerProgress("IMPORT_CUSTOMERS")
def jmd_upload_customers_info_insurance(request, template_name='merchant_site/customers/jmd_import_customers.html'):

    active_page_name = "import_customers_page"

    if request.session.get('is_logged_in_superuser') == False:
        outlet_list = outlet_details.objects.filter(id__in=request.session.get('allowed_outlets_list'),company_id = request.session.get('company_id'),is_active=1,is_verified = 1)
    elif request.session.get('is_logged_in_superuser') == True:
        outlet_list = outlet_details.objects.filter(company_id = request.session.get('company_id'),is_active=1,is_verified = 1)
    

    outletid = None
    if request.session.get('outlet_id') and outletid == None:
        outletid = int(request.session.get('outlet_id'))   
        
    if request.method == 'POST':
        postdata = request.POST.copy();           
        customer_file = request.FILES.get('customer_sheet', None)   
        outletid = postdata.get('select_outlet',None)

        if outletid == None or outletid == '0':
            outletid = int(request.session.get('outlet_id'))
            

        if postdata['importPage'] == 'SAVE' or postdata['importPage'] == 'SAVE & CLOSE':
            if customer_file and outletid:
                import_file_obj = import_customer_file()
                import_file_obj.file_name = customer_file
                import_file_obj.outlet_id = outletid
                import_file_obj.created_by = request.user
                import_file_obj.save()
                
                # filepath = "/home/xircls/xircls/static/"+str(import_file_obj.file_name)                
                BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
                filepath = os.path.join(BASE_DIR, "static",str(import_file_obj.file_name))                 
                with open(filepath , encoding='utf-8',errors='ignore') as data_file:
                    cursor = connection.cursor() 
                    reader = csv.reader(data_file)
                    not_save_count = 0
                    save_count = 0
                    not_valid_count = 0
                    no_data = 0
                        
                    for row in reader:
                        if row[0] != 'TITLE':
                            if row[0].strip() == "":
                                continue
                            entry = 'IMPORT'
                            title = row[0]
                            first_name = row[1]
                            last_name = row[2]
                            insurance_company = row[3]
                            insurance_policy_number = row[4]
                            policy_expiry_date = row[5]
                            insurance_executive = row[6]
                            registration_number = row[7].replace(" ", "")
                            registration_number = registration_number.replace("-", "")
                            vehicle_brand = row[8]
                            vehicle_model = row[9]                            
                            flat_building = row[10] if len(row[10]) < 100 else None
                            street_lane = row[11] 
                            area_locality = row[12]
                            landmark = row[13]
                            city = row[14]
                            pincode = row[15]
                            state = row[16]
                            country = row[17]
                            cust_email = row[18]
                            landline1 = row[19]
                            phone_number = row[20]
                            policy_purchase_date = row[21]      #16-10-2019


                            cust_name =  first_name.strip() + ' ' +last_name.strip()                                   
                            
                            try:
                                if "/" in policy_expiry_date:
                                    policy_expiry_date = datetime.strptime(policy_expiry_date, '%d/%m/%Y').date()
                                elif "-" in policy_expiry_date:    
                                    policy_expiry_date = datetime.strptime(policy_expiry_date, '%d-%m-%Y').date()
                                policy_expiry_date = policy_expiry_date.strftime('%Y-%m-%d %H:%M:%S')
                            except:
                                policy_expiry_date  = None

                            try:
                                if "/" in policy_purchase_date:
                                    policy_purchase_date = datetime.strptime(policy_purchase_date, '%d/%m/%Y').date()
                                elif "-" in policy_purchase_date:    
                                    policy_purchase_date = datetime.strptime(policy_purchase_date, '%d-%m-%Y').date()
                                policy_purchase_date = policy_purchase_date.strftime('%Y-%m-%d %H:%M:%S')
                            except:
                                policy_purchase_date  = None

                            if phone_number.strip() == "" and cust_email.strip() == "":
                                no_data += 1
                                continue

                            if len(phone_number) != 10:
                                phone_number = None
                            # valid_record = check_import_file_record(cust_name, cust_email, phone_number) 
                            valid_record = True # Use valid record function for valdition of name ,email,number if necessary 
                            if valid_record == False:
                                not_valid_count += 1                                                            
                            else:                                 
                                cust_avail = check_customer_isAvailabel(request, outletid, cust_email, phone_number)

                                if cust_avail == False:

                                    if cust_email != None and cust_email.strip() == "":
                                        cust_email = None

                                    if phone_number != None and phone_number.strip() == "":
                                        phone_number = None   
                                        
                                    try:
                                        user_obj = get_object_or_404(User, Q(username = cust_email) | Q(username = phone_number))
                                    except:
                                        user_obj = None                                                                             
                                    
                                    if phone_number:
                                        try:
                                            cust_profile_obj = get_object_or_404(CustomerProfile, phone_no = phone_number)
                                        except:
                                            cust_profile_obj = None
                                    elif cust_email:
                                        try:
                                            cust_profile_obj = get_object_or_404(CustomerProfile, email_id = cust_email)
                                        except:
                                            cust_profile_obj = None
                                    else:
                                        cust_profile_obj = None            
                                        
                                    if user_obj == None and cust_profile_obj == None:
                                        mac = get_mac()
                                        if phone_number:
                                            username = phone_number
                                        elif cust_email:
                                            username = cust_email
                                        pwd = 'XlC16269'+username+'XlC16269' #create a hash password with salt
                                        encrypt_pwd = make_password(pwd)       
                                        customer_user = User()                                        
                                        customer_user.username = username                                        
                                        customer_user.email = cust_email if cust_email else ''    
                                        customer_user.password = encrypt_pwd
                                        customer_user.is_active = 0
                                        customer_user.save()
                    
                                        userid = customer_user.id 
                                        
                                        profile = CustomerProfile()
                                        profile.user_id = customer_user
                                        profile.phone_no = phone_number
                                        profile.desktop_mac_id = mac          
                                        profile.entry_point ='INDV'
                                        profile.ip_address = request.META.get('REMOTE_ADDR')
                                        profile.email_id = cust_email if cust_email != None else None
                                        profile.save()
                                        customer_user.groups.add(Group.objects.get(name='Customer'))
                                        
                                    elif user_obj:
                                        userid = user_obj.id
                                        
                                    elif cust_profile_obj:
                                        userid = cust_profile_obj.user_id_id
                                
                                    '''save customer'''  
                                    customer_obj = customer_details()
                                    customer_obj.phone_no = phone_number if phone_number else ''
                                    customer_obj.customer_name = cust_name
                                    customer_obj.email = cust_email if cust_email else ""
                                    customer_obj.entry_point = entry
                                    customer_obj.created_by_id = request.user.id
                                    customer_obj.outlet_id = outletid
                                    customer_obj.user_id = userid
                                    customer_obj.company_id = request.session.get('company_id')
                                    customer_obj.title = title
                                    customer_obj.address_line1 = flat_building
                                    customer_obj.address_line2 = street_lane
                                    customer_obj.area_building = str(area_locality) + ' ' + str(landmark)
                                    customer_obj.city = city
                                    customer_obj.pincode = pincode
                                    customer_obj.state = state
                                    customer_obj.country = country

                                    customer_obj.landline1 = landline1 
                                    customer_obj.save()

                                    customer_vehicle_obj = jmdCustomerVehicle()
                                    customer_vehicle_obj.vehicle_number = registration_number
                                    customer_vehicle_obj.car_model = vehicle_model
                                    customer_vehicle_obj.brand = vehicle_brand
                                    # customer_vehicle_obj.invoice_location = location
                                    customer_vehicle_obj.customer_id = customer_obj.id
                                    customer_vehicle_obj.outlet_id = outletid
                                    customer_vehicle_obj.user_id = userid 
                                    customer_vehicle_obj.save()

                                    customer_insurance_obj = jmd_cust_insurance_details()
                                    customer_insurance_obj.policy_number = insurance_policy_number
                                    customer_insurance_obj.policy_expiry_date = policy_expiry_date
                                    
                                    customer_insurance_obj.insurance_company = insurance_company
                                    customer_insurance_obj.executive_name = insurance_executive
                                    customer_insurance_obj.vehicle_id = customer_vehicle_obj.id
                                    customer_insurance_obj.customer_id = customer_obj.id
                                    customer_insurance_obj.user_id = userid
                                    customer_insurance_obj.outlet_id = outletid
                                    
                                    customer_insurance_obj.save()

                                    save_count += 1
                                else:
                                    
                                    jmd_cust_insurance_details.objects.filter(user_id=cust_avail).update(policy_purchase_date = policy_purchase_date) #16-10-2019
                                    not_save_count += 1  
                            
                    messages.add_message(request, messages.SUCCESS, str(save_count)+' customers added',fail_silently=True)
                    
                    if not_save_count > 0:
                        messages.add_message(request, messages.ERROR, str(not_save_count)+' customers not added because they already exist',fail_silently=True)

                    if no_data > 0:
                        messages.add_message(request, messages.ERROR, str(no_data)+' customers not added because mobile number and email id not found',fail_silently=True)                        
                                            
                    request.session['outlet_id'] = outletid       
                    
                    if postdata['importPage'] == 'SAVE':
                        pass
                    elif postdata['importPage'] == 'SAVE & CLOSE':                                
                        url = reverse('customers:get_my_customers')
                        return HttpResponseRedirect(url)    
            else:
                messages.add_message(request, messages.ERROR, 'File Not import',fail_silently=True)
                                
    return render(request,template_name,locals())

@login_required(login_url='/merchant-login/')
@permission_required(['customers.add_customer_groups','customers.change_customer_groups','customers.delete_customer_groups'],raise_exception=True)
def get_my_groups(request, template_name='merchant_site/customers/group_list.html'):
	
	if request.session.get('is_logged_in_superuser') == False:
		outlet_list = outlet_details.objects.filter(id__in=request.session.get('allowed_outlets_list'),company_id = request.session.get('company_id'),is_active=1,is_verified = 1)
	elif request.session.get('is_logged_in_superuser') == True:
		outlet_list = outlet_details.objects.filter(company_id = request.session.get('company_id'),is_active=1,is_verified = 1)
	
	outletid = None
	if request.session.get('outlet_id') and outletid == None:
		outletid = int(request.session.get('outlet_id')) 
		
	my_group_obj = None    
	if outletid:
		my_group_obj = customer_groups.objects.filter(outlet_id = outletid)
		
		if not my_group_obj:
			my_group_obj = None    
		
	if request.method == 'POST':
		postdata = request.POST.copy();
		group_list = postdata.getlist('outlet_cust_groups', None)
		
		if postdata['my_groups_page'] == 'EDIT':
			if not group_list:
				messages.add_message(request, messages.ERROR, 'Please choose a group to edit',fail_silently=True)
			else:
				url = reverse('customers:edit_customer_groups', kwargs={'groupCode': group_list[0]})
				return HttpResponseRedirect(url)
			
		elif postdata['my_groups_page'] == 'DELETE':
			if not group_list:
				messages.add_message(request, messages.ERROR, 'Please choose a group to delete',fail_silently=True)
			else:
				customer_groups.objects.filter(id__in = group_list).delete()
				messages.add_message(request, messages.SUCCESS, 'Record Deleted Successfully',fail_silently=True)
				return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
			
		elif postdata['my_groups_page'] == 'outlet':
			outletid =int(postdata.get('group_page_outlet')) if postdata.get('group_page_outlet') else None 
			
			if outletid:
				request.session['outlet_id'] = postdata.get('group_page_outlet') 
				my_group_obj = customer_groups.objects.filter(outlet_id = outletid)
		
				if not my_group_obj:
					my_group_obj = None    
				
	return render(request,template_name,locals())

@login_required(login_url='/merchant-login/')
@multi_user_permission('add', 'Customer Groups')
@permission_required(['customers.add_customer_groups','customers.change_customer_groups','customers.delete_customer_groups'],raise_exception=True)
def create_customer_groups(request, template_name='merchant_site/customers/create_group.html'):
	
	if request.session.get('is_logged_in_superuser') == False:
		outlet_list = outlet_details.objects.filter(id__in=request.session.get('allowed_outlets_list'),company_id = request.session.get('company_id'),is_active=1,is_verified = 1)
	elif request.session.get('is_logged_in_superuser') == True:
		outlet_list = outlet_details.objects.filter(company_id = request.session.get('company_id'),is_active=1,is_verified = 1)
	

	outletid = None
	if request.session.get('outlet_id') and outletid == None:
		outletid = int(request.session.get('outlet_id'))  
		
	if request.method == 'POST':
		postdata = request.POST.copy();   

		outletid = int(postdata.get('select_outlet')) if postdata.get('select_outlet') else None 
		group_title = postdata.get('title', None)   
		group_descr = postdata.get('description',None)

		if postdata['createCustomerGroup'] == 'SAVE':
			if outletid and group_title and group_descr:
				group_obj = customer_groups()
				group_obj.group_name = group_title
				group_obj.description = group_descr
				group_obj.outlet_id = outletid
				group_obj.created_by_id = request.user.id
				group_obj.save()
				
				messages.add_message(request, messages.SUCCESS, 'Group Created Successfully',fail_silently=True)
				url = reverse('customers:add_customers_in_group', kwargs={'groupCode': group_obj.id})
				return HttpResponseRedirect(url)
			else:
				messages.add_message(request, messages.ERROR, 'Group Not Created',fail_silently=True)    
		 
	return render(request,template_name,locals())

@login_required(login_url='/merchant-login/')
@multi_user_permission('edit', 'Customer Groups')
@permission_required(['customers.add_customer_groups','customers.change_customer_groups','customers.delete_customer_groups'],raise_exception=True)
def edit_customer_groups(request, groupCode = '0', template_name='merchant_site/customers/create_group.html'):
	
	if request.session.get('is_logged_in_superuser') == False:
		outlet_list = outlet_details.objects.filter(id__in=request.session.get('allowed_outlets_list'),company_id = request.session.get('company_id'),is_active=1,is_verified = 1)
	elif request.session.get('is_logged_in_superuser') == True:
		outlet_list = outlet_details.objects.filter(company_id = request.session.get('company_id'),is_active=1,is_verified = 1)
	

	outletid = None
	if request.session.get('outlet_id') and outletid == None:
		outletid = int(request.session.get('outlet_id'))  
	
	try:
		group_obj = get_object_or_404(customer_groups, id = groupCode)
		outletid = int(group_obj.outlet_id)
	except:
		group_obj = None    
			
	if request.method == 'POST':
		postdata = request.POST.copy();   

		outletid = int(postdata.get('select_outlet')) if postdata.get('select_outlet') else None 
		group_title = postdata.get('title', None)   
		group_descr = postdata.get('description',None)

		if postdata['createCustomerGroup'] == 'SAVE':
			if outletid and group_title and group_descr:
				if group_obj:
					group_obj.group_name = group_title
					group_obj.description = group_descr
					group_obj.outlet_id = outletid
					group_obj.created_by_id = request.user.id
					group_obj.save()
					
					messages.add_message(request, messages.SUCCESS, 'Your group information was edited successfully',fail_silently=True)
					url = reverse('customers:add_customers_in_group', kwargs={'groupCode': group_obj.id})
					return HttpResponseRedirect(url)
				else:
					messages.add_message(request, messages.ERROR, 'Your group information not saved',fail_silently=True)
			else:
				messages.add_message(request, messages.ERROR, 'Group not created',fail_silently=True)    
		 
	return render(request,template_name,locals())

@login_required(login_url='/merchant-login/')
@multi_user_permission('add', 'Customer Groups')
@permission_required(['customers.add_customer_groups','customers.change_customer_groups','customers.delete_customer_groups'],raise_exception=True)
def add_customers_in_group(request, groupCode = '0', template_name='merchant_site/customers/add_customers_to_group.html'):
	
	cursor = connection.cursor()
	
	try:
		group_obj = get_object_or_404(customer_groups, id = groupCode)
	except:
		group_obj = None    
	
	group_customers_obj = None
	customers_obj = None 
	group_cust_obj = None
	other_cust_obj = None
	
	if group_obj:
		outletid = group_obj.outlet_id
		
		if outletid:
			customers_obj = customer_details.objects.filter(outlet_id = outletid)    
		else:
			customers_obj = None  
			
		'''customer in group'''
		cursor.execute(''' SELECT cd.id, cd.phone_no, cd.customer_name, cd.entry_point, cd.email, cd.outlet_id, cg.customer_id, cg.group_id 
				FROM `xl925_customer_details` as cd
				LEFT JOIN `xl925_customer_in_group` as cg ON cg.customer_id = cd.id
				WHERE cg.group_id = {0} '''.format(group_obj.id))
		group_cust_obj_list = dictfetchall(cursor) 
		
		group_cust_ids = None
		if len(group_cust_obj_list) > 0:
			'''FOR PAGINATION'''
			paginator = Paginator(group_cust_obj_list, 5) # Show 25 contacts per page
			page = request.GET.get('page',1)
			try:
				group_cust_obj = paginator.page(page)
			except PageNotAnInteger:
				# If page is not an integer, deliver first page.
				group_cust_obj = paginator.page(1)
			except EmptyPage:
				# If page is out of range (e.g. 9999), deliver last page of results.
				group_cust_obj = paginator.page(paginator.num_pages)
			'''END FOR PAGINATION'''
				
			cust_arr = []
			for res in group_cust_obj_list:
				cust_arr.append(res['customer_id'])
		
			group_cust_ids = ",".join(map(str,cust_arr))
		
		if group_cust_ids:
			cust_code = "cd.id NOT IN ("+group_cust_ids+")"
		else:
			cust_code = True
			
		'''END customer in group''' 
		 
			
		'''other customers'''   
		cursor.execute(''' SELECT cd.id, cd.phone_no, cd.customer_name, cd.entry_point, cd.email, cd.outlet_id
				FROM `xl925_customer_details` as cd
				WHERE {0} AND cd.outlet_id = {1} '''.format(cust_code, outletid))
		other_cust_obj_list = dictfetchall(cursor) 
		
		if len(other_cust_obj_list) == 0:
			other_cust_obj = None
		else:
			'''FOR PAGINATION'''
			other_paginator = Paginator(other_cust_obj_list, 5) # Show 25 contacts per page
			page = request.GET.get('page',1)
			try:
				other_cust_obj = other_paginator.page(page)
			except PageNotAnInteger:
				# If page is not an integer, deliver first page.
				other_cust_obj = other_paginator.page(1)
			except EmptyPage:
				# If page is out of range (e.g. 9999), deliver last page of results.
				other_cust_obj = other_paginator.page(paginator.num_pages)
			'''END FOR PAGINATION'''
				
		'''END other customers'''  
				
	if request.method == 'POST':
		postdata = request.POST.copy();   
	
		if postdata['group_customer_page'] == 'SAVE':
			cust_list = postdata.getlist('other_customers', None)   
			if len(cust_list) > 0:
				for res in cust_list:
					cust_group_obj = customer_in_group()
					cust_group_obj.group_id = groupCode 
					cust_group_obj.customer_id = res
					cust_group_obj.save()
					 
				messages.add_message(request, messages.SUCCESS, 'Customer/s added to Group successfully',fail_silently=True)
				return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
			else:
				messages.add_message(request, messages.ERROR, 'Please select customers to add',fail_silently=True)
		
		elif postdata['group_customer_page'] == 'DELETE':
			cust_list = postdata.getlist('my_customers', None)               
			if len(cust_list) > 0:
				customer_in_group.objects.filter(customer_id__in = cust_list, group_id = group_obj.id).delete() 
					 
				messages.add_message(request, messages.SUCCESS, 'Customer/s removed from Group successfully',fail_silently=True)
				return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
			else:
				messages.add_message(request, messages.ERROR, 'Please select customers to delete',fail_silently=True)
							
	return render(request,template_name,locals())
	
def check_customer_isAvailabel(request, outletid, emailid, phone_no):
	
	if phone_no and phone_no.strip() != "":
		phone = phone_no
	else:
		phone = None
	if emailid and emailid.strip() != "":
		email = emailid
	else:
		email = None    
	cursor = connection.cursor()
	
	if phone:
		phone_code = "phone_no = '{0}'".format(phone)
	else:
		phone_code = True
		
	if email:
		email_code = "email = \'"+str(email)+"\'"
	else:
		email_code = True      
	 
	if email and phone:   
		email_query =   phone_code+" OR "+email_code
	elif email:
		email_query =   email_code
	elif phone_code:
		email_query = phone_code  

	try:
		cursor.execute(''' SELECT id, phone_no, customer_name, entry_point, email, outlet_id, user_id
		FROM `xl925_customer_details` WHERE outlet_id = {0} AND ({1}) '''.format(outletid,email_query))
		cust_obj = dictfetchall(cursor)
	except:
		cust_obj = None

	try:
		user_ka_id = cust_obj[0]['user_id']    #07-10-2019
	except:
		user_ka_id = None

	if len(cust_obj) > 0:
		'''Here TRUE means Customer is Availabale
			FALSE means Customer is Not Available 
		'''
		return user_ka_id              # 07-10-2019
		#return True
	else:
		return False 
	
'''created by sunil 12-06-2017'''
def check_import_file_record(cust_name, cust_email, phone_number):
	cust_bool = True
	email_bool = True
	phone_num_bool = True
	
	'''check name contain speials characters or numbers'''
	special_characters = "~`!@#$%^&*()_+={}[]:>;',</?*-+"    
	for i in cust_name:
		if i in special_characters:
			cust_bool = False

		if i.isdigit() == True:
			cust_bool = False     
	
	'''check email is valid or not'''
	match = re.match('^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$', cust_email)
	if match == None:     
		email_bool = False
		
	'''check phone number length and it is all digits or not'''
	if len(phone_number) == 10 and phone_number.isdigit() == True:
		phone_num_bool = True
	else:    
		phone_num_bool = False
	
	
	if cust_bool == True and email_bool == True and phone_num_bool == True:
		return True
	else:
		return False
	
def save_outside_customers(request, data):
	   
	save_count = 0
	
	for res in data:
		outletid = res['outlet_id']
		cust_name = res['cust_name']
		phone = res['phone_no']
		emailid = res['email']
		entrypoint = res['entry_point']
				
		cust_avail = check_customer_isAvailabel(request, outletid, emailid, phone)

		if cust_avail == False:
			customer_obj = customer_details()
			customer_obj.phone_no = res['phone_no']
			customer_obj.customer_name = res['cust_name']
			if res['email']:
				customer_obj.email = res['email']
			customer_obj.entry_point = res['entry_point']
			customer_obj.created_by_id = request.user.id
			customer_obj.user_id = res['user_id']
			customer_obj.outlet_id = res['outlet_id']
			customer_obj.company_id = request.session.get('company_id')
			customer_obj.save()
	return True

def getOutletCustomers(request):
	outletid = request.session.get('outlet_id', None)
	customers_obj = None
	if outletid:
		try:
			outletObj = get_object_or_404(outlet_details, id=outletid)
		except:
			outletObj = None

		customers_list = customer_details.objects.filter(outlet_id=outletid).order_by('customer_name')

		if outletObj.is_jmd == True:
			template_name = 'merchant_site/customers/jmd_my_customers.html'
			customers_obj = []
			customers_dict = {}
			if customers_list.count() > 0:
				for res in customers_list:
					customers_dict['id'] = res.id
					customers_dict['customer_name'] = res.customer_name
					customers_dict['email'] = res.email
					customers_dict['phone_no'] = res.phone_no

					try:
						offerKitObj = OfferIssueKits.objects.filter(outlet_id=outletObj.id,
																	customer_user_id=res.user_id).last()
					except:
						offerKitObj = None

					if offerKitObj:
						try:
							carObj = get_object_or_404(CarDetails, id=offerKitObj.car_id)
						except:
							carObj = None

						if carObj:
							customers_dict['car_model'] = carObj.carmodel
							customers_dict['car_version'] = carObj.brand
							customers_dict['service_due'] = carObj.service_schedule
							customers_dict['created_at'] = offerKitObj.created_at

					customers_obj.append(customers_dict.copy())

		else:
			customers_obj = customers_list

	return customers_obj

#Temperory
def getOutletOffers(request):
	from cross_marketing.models import CrossMarketingProductSetting
	outletid = request.session.get('outlet_id', None)
	cursor = connection.cursor()
	offerList = []

	if outletid:
		try:
			cross_market_product_settingObj = get_object_or_404(CrossMarketingProductSetting, outlet_id = outletid)
		except:
			cross_market_product_settingObj = None

		if cross_market_product_settingObj:
			if cross_market_product_settingObj.product_id == 1:
				cursor.execute(''' SELECT * FROM `xl925_outlet_offer_info` as ofi WHERE ofi.outlet_id = ({0}) and ofi.is_critical = 1 and ofi.critical_template_id != "" and ofi.is_active = 1 '''.format(outletid))
				offersObj = dictfetchall(cursor)
			elif cross_market_product_settingObj.product_id == 2:
				cursor.execute(''' SELECT * FROM `xl925_outlet_offer_info` as ofi WHERE ofi.outlet_id = ({0}) and ofi.is_critical = 0 and ofi.is_active = 1 '''.format(outletid))
				offersObj = dictfetchall(cursor)
			elif cross_market_product_settingObj.product_id == 3:
				cursor.execute(''' SELECT * FROM `xl925_outlet_offer_info` as ofi WHERE ofi.outlet_id = ({0}) and ofi.is_critical = 0 and ofi.is_active = 1 '''.format(outletid))
				offersObj = dictfetchall(cursor)

			offerDict = {}

			if "8000" in str(request.META['HTTP_HOST']):
				http_text = "http"
			else:
				http_text = "https"

			if len(offersObj) > 0:
				for offer_res in offersObj:
					for k in offer_res.keys():
						if str(k) == "offer_image":
							offerDict[str(k)] = str(http_text) + "://" + request.META['HTTP_HOST'] + "/static/" + str(offer_res[k])
						else:
							offerDict[str(k)] = offer_res[k]
					offerList.append(offerDict)
					offerDict = {}

	if len(offerList) == 0:
		offerList = None

	return offerList

@login_required(login_url='/merchant-login/')
@redirectMerchantAsPerProgress("MY_CUSTOMERS")
@multi_user_permission('add', 'Vehicle')
def get_add_vehicle(request, custCode=0, template_name='merchant_site/customers/add_vehicle.html'):
	active_page_name = "get_add_vehicle"
	if request.session.get('is_logged_in_superuser') == False:
		outlet_list = outlet_details.objects.filter(id__in=request.session.get('allowed_outlets_list'),
													company_id=request.session.get('company_id'), is_active=1,
													is_verified=1)
	elif request.session.get('is_logged_in_superuser') == True:
		outlet_list = outlet_details.objects.filter(company_id=request.session.get('company_id'), is_active=1,
													is_verified=1)
	#for get outlet
	outletid = None
	if request.session.get('outlet_id') and outletid == None:
		outletid = int(request.session.get('outlet_id'))
	try:
		outletObj = get_object_or_404(outlet_details, id=outletid)
	except:
		outletObj = None
	my_all_customer_details_obj = customer_details.objects.filter(outlet_id=outletid)
	from json import dumps
	my_cust_list = []
	for cust in my_all_customer_details_obj:
		new_dataDictionary = { 'cust_id': cust.id,'cust_email': cust.email,  'cust_mobile': cust.phone_no, }
		my_cust_list.append(new_dataDictionary)
	cust_dataJSON = dumps(my_cust_list)
	print(cust_dataJSON)

	# for get selected customer
	try:
		customer_details_obj = get_object_or_404(customer_details, id=custCode)
		outletid = int(customer_details_obj.outlet_id)
		customer_id = customer_details_obj.id
		user_id = customer_details_obj.user_id
	except:
		customer_id = None
		user_id = None

	car_details_obj = CarDetails.objects.filter(is_active=True)

	cursor = connection.cursor()
	cursor.execute(''' select distinct(carname) from xl925_car_details order by carname''')
	car_name_obj = dictfetchall(cursor)

	cursor.execute(''' select distinct(variant) from xl925_car_details order by variant''')
	car_variant_obj = dictfetchall(cursor)

	cursor.execute(''' select distinct(brand) from xl925_car_details order by brand''')
	car_brand_obj = dictfetchall(cursor)

	cursor.execute(''' select distinct(carmodel) from xl925_car_details where carmodel != "" order by carmodel''')
	car_model_obj = dictfetchall(cursor)

	cursor.execute(''' select distinct(service_schedule) from xl925_car_details order by service_schedule''')
	car_service_schedule_obj = dictfetchall(cursor)
	
	if car_details_obj.count() == 0:
		car_details_obj = None
		

	if request.method == 'POST':
		postdata = request.POST.copy();
		press_btn = postdata.get('press_btn', None)

		customer_vehicle_obj = jmdCustomerVehicle()
		customer_vehicle_obj.registration_number = postdata.get('vehicle_no',None)
		customer_vehicle_obj.vehicle_number = postdata.get('vin',None)
		# customer_vehicle_obj.vehicle_number = postdata.get('vehicle_no',None)
		# customer_vehicle_obj.vehicle_type = postdata.get('vehicle_type',None)
		# customer_vehicle_obj.registration_number = postdata.get('registration_number',None)                             

		delivery_date =  datetime.strptime(postdata.get('vehdd'), '%d-%m-%Y')
		registeration_date =  datetime.strptime(postdata.get('vehrd'), '%d-%m-%Y')

		if delivery_date and delivery_date != "" :
			delivery_date = delivery_date.strftime('%Y-%m-%d')    

		if registeration_date and registeration_date != "" :
			registeration_date = registeration_date.strftime('%Y-%m-%d')  
		# customer_vehicle_obj.delivery_date = delivery_date
		# customer_vehicle_obj.invoice_location = postdata.get('invoice_location',None)
		customer_vehicle_obj.delivery_date = delivery_date 
		customer_vehicle_obj.vehicle_type = postdata.get('vehtype',None)
		customer_vehicle_obj.registeration_date =registeration_date
		customer_vehicle_obj.engine_no = postdata.get('engine',None)        
		customer_vehicle_obj.sales_person = postdata.get('sales_person',None)
		customer_vehicle_obj.sold_by = postdata.get('sold_by',None)
		# customer_vehicle_obj.car_name = postdata.get('car_selection',None)       
		customer_vehicle_obj.variant = postdata.get('car_variant',None)
		customer_vehicle_obj.brand = postdata.get('car_brand',None)      
		customer_vehicle_obj.car_model = postdata.get('car_model',None)   
		customer_vehicle_obj.service_schedule = postdata.get('service_schedule',None)

		customer_vehicle_obj.sold_by = postdata.get('sold_by',None)
		selectedObj = customer_vehicle_obj.sold_by

		if selectedObj == "JMD":
			customer_vehicle_obj.sales_location = postdata.get('sales_location',None)
			customer_vehicle_obj.sales_executive = postdata.get('sales_executive',None)

			date_of_sale = postdata.get('date_of_sale',None)
			if date_of_sale and date_of_sale != "" :
				date_of_sale = datetime.strptime(date_of_sale, '%d-%m-%Y')
				date_of_sale = date_of_sale.strftime('%Y-%m-%d %H:%M:%S')
				customer_vehicle_obj.date_of_sale = date_of_sale
		elif selectedObj == "DSA":
			customer_vehicle_obj.sales_location = None
			customer_vehicle_obj.sales_executive = None
			customer_vehicle_obj.date_of_sale = None
		elif selectedObj == "Other":
			customer_vehicle_obj.sales_location = None
			customer_vehicle_obj.sales_executive = None
			customer_vehicle_obj.date_of_sale = None 

		customer_vehicle_obj.customer_id = customer_id
		customer_vehicle_obj.outlet_id = outletid
		customer_vehicle_obj.user_id = user_id
		customer_vehicle_obj.save()

		vehicle_id = customer_vehicle_obj.id
		
		messages.add_message(request, messages.SUCCESS, 'Vehicle details added successfully.', fail_silently=True)

		if press_btn == 'Save':
			return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
		elif press_btn == 'Save & Close':
			url = reverse('customers:get_my_customers')
			return HttpResponseRedirect(url)
			
	return render(request,template_name,locals())

@login_required(login_url='/merchant-login/')
@multi_user_permission('edit', 'Vehicle')
def get_edit_vehicle(request, vehicleId=0, template_name='merchant_site/customers/add_vehicle.html'):
	edit = True
	active_page_name = "get_edit_vehicle"
	if request.session.get('is_logged_in_superuser') == False:
		outlet_list = outlet_details.objects.filter(id__in=request.session.get('allowed_outlets_list'),
													company_id=request.session.get('company_id'), is_active=1,
													is_verified=1)
	elif request.session.get('is_logged_in_superuser') == True:
		outlet_list = outlet_details.objects.filter(company_id=request.session.get('company_id'), is_active=1,
													is_verified=1)
	#for get outlet
	outletid = None
	if request.session.get('outlet_id') and outletid == None:
		outletid = int(request.session.get('outlet_id'))
	try:
		outletObj = get_object_or_404(outlet_details, id=outletid)
	except:
		outletObj = None

	try:
		vehicleObj = get_object_or_404(jmdCustomerVehicle, id=vehicleId)
	except:
		vehicleObj = None    

	car_details_obj = CarDetails.objects.filter(is_active=True)

	cursor = connection.cursor()
	cursor.execute(''' select distinct(carname) from xl925_car_details order by carname''')
	car_name_obj = dictfetchall(cursor)

	cursor.execute(''' select distinct(variant) from xl925_car_details order by variant''')
	car_variant_obj = dictfetchall(cursor)

	cursor.execute(''' select distinct(brand) from xl925_car_details order by brand''')
	car_brand_obj = dictfetchall(cursor)

	cursor.execute(''' select distinct(carmodel) from xl925_car_details where carmodel != "" order by carmodel''')
	car_model_obj = dictfetchall(cursor)

	cursor.execute(''' select distinct(service_schedule) from xl925_car_details order by service_schedule''')
	car_service_schedule_obj = dictfetchall(cursor)

	# for get selected customer
	if vehicleObj:
		try:
			customer_details_obj = get_object_or_404(customer_details, id=vehicleObj.customer_id)
			outletid = int(customer_details_obj.outlet_id)
			customer_id = customer_details_obj.id
		except:
			customer_details_obj = None

	# vehicle_obj = jmdCustomerVehicle.objects.filter(outlet_id=outletid, customer_id=customer_id)
	
		if customer_details_obj: 

			if request.method == 'POST':
				postdata = request.POST.copy();
				press_btn = postdata.get('press_btn', None)
				vehicle_id_obj = postdata.get('vehicle_id', None)
				try:
					customer_vehicle_obj = get_object_or_404(jmdCustomerVehicle, id=vehicle_id_obj)
				except:
					customer_vehicle_obj = None

				if customer_vehicle_obj:    
					customer_vehicle_obj.registration_number = postdata.get('vehicle_no',None)
					customer_vehicle_obj.vehicle_number = postdata.get('vin',None)                    
					customer_vehicle_obj.vehicle_type = postdata.get('vehicle_type',None)
					# customer_vehicle_obj.registration_number = postdata.get('registration_number',None)                             

					delivery_date =  datetime.strptime(postdata.get('vehdd'), '%d-%m-%Y')
					registeration_date =  datetime.strptime(postdata.get('vehrd'), '%d-%m-%Y')
					if delivery_date and delivery_date != "" :
						delivery_date = delivery_date.strftime('%Y-%m-%d')    

					if registeration_date and registeration_date != "" :
						registeration_date = registeration_date.strftime('%Y-%m-%d')                      
					# if delivery_date and delivery_date != "" :
					#     delivery_date = datetime.strptime(delivery_date, '%d-%m-%Y')
					#     delivery_date = delivery_date.strftime('%Y-%m-%d %H:%M:%S')    

					customer_vehicle_obj.delivery_date = delivery_date
					customer_vehicle_obj.vehicle_type = postdata.get('vehtype',None)
					customer_vehicle_obj.registeration_date =  registeration_date
					customer_vehicle_obj.engine_no = postdata.get('engine',None)
					# customer_vehicle_obj.invoice_location = postdata.get('invoice_location',None)
					customer_vehicle_obj.sales_person = postdata.get('sales_person',None)
					customer_vehicle_obj.sold_by = postdata.get('sold_by',None)
					# customer_vehicle_obj.car_name = postdata.get('car_selection',None)       
					customer_vehicle_obj.variant = postdata.get('car_variant',None)
					customer_vehicle_obj.brand = postdata.get('car_brand',None)      
					customer_vehicle_obj.car_model = postdata.get('car_model',None)   
					customer_vehicle_obj.service_schedule = postdata.get('service_schedule',None)

					customer_vehicle_obj.sold_by = postdata.get('sold_by',None)
					selectedObj = customer_vehicle_obj.sold_by

					if selectedObj == "JMD":
						customer_vehicle_obj.sales_location = postdata.get('sales_location',None)
						customer_vehicle_obj.sales_executive = postdata.get('sales_executive',None)

						date_of_sale = postdata.get('date_of_sale',None)
						if date_of_sale and date_of_sale != "" :
							date_of_sale = datetime.strptime(date_of_sale, '%d-%m-%Y')
							date_of_sale = date_of_sale.strftime('%Y-%m-%d %H:%M:%S')
							customer_vehicle_obj.date_of_sale = date_of_sale
					elif selectedObj == "DSA":
						customer_vehicle_obj.sales_location = None
						customer_vehicle_obj.sales_executive = None
						customer_vehicle_obj.date_of_sale = None
					elif selectedObj == "Other":
						customer_vehicle_obj.sales_location = None
						customer_vehicle_obj.sales_executive = None
						customer_vehicle_obj.date_of_sale = None

					customer_vehicle_obj.customer_id = customer_id
					customer_vehicle_obj.outlet_id = outletid
					customer_vehicle_obj.save()

					vehicle_id = customer_vehicle_obj.id


					
					messages.add_message(request, messages.SUCCESS, 'Vehicle details edited successfully.', fail_silently=True)

					if press_btn == 'Save':
						# url = reverse('customers:get_my_customers', kwargs={'custCode': customer_obj.id})                        
						return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
					elif press_btn == 'Save & Close':
						url = reverse('customers:get_my_customers')
						return HttpResponseRedirect(url)
			
	return render(request,template_name,locals())    

@login_required(login_url='/merchant-login/')
@redirectMerchantAsPerProgress("MY_CUSTOMERS")
@multi_user_permission('add', 'Servicing')
def get_add_servicing(request,custCode=0, template_name='merchant_site/customers/add_servicing.html'):
	active_page_name = "get_add_servicing"
	if request.session.get('is_logged_in_superuser') == False:
		outlet_list = outlet_details.objects.filter(id__in=request.session.get('allowed_outlets_list'),
													company_id=request.session.get('company_id'), is_active=1,
													is_verified=1)
	elif request.session.get('is_logged_in_superuser') == True:
		outlet_list = outlet_details.objects.filter(company_id=request.session.get('company_id'), is_active=1,
													is_verified=1)
	#for get outlet
	outletid = None
	if request.session.get('outlet_id') and outletid == None:
		outletid = int(request.session.get('outlet_id'))
	try:
		outletObj = get_object_or_404(outlet_details, id=outletid)
	except:
		outletObj = None
	my_all_customer_details_obj = customer_details.objects.filter(outlet_id=outletid)
	from json import dumps
	my_cust_list = []
	for cust in my_all_customer_details_obj:
		new_dataDictionary = { 'cust_id': cust.id,'cust_email': cust.email,  'cust_mobile': cust.phone_no, }
		my_cust_list.append(new_dataDictionary)
	cust_dataJSON = dumps(my_cust_list)
	print(cust_dataJSON)

	# for get selected customer
	try:
		customer_details_obj = get_object_or_404(customer_details, id=custCode)
		outletid = int(customer_details_obj.outlet_id)
		customer_id = customer_details_obj.id
		user_id = customer_details_obj.user_id
	except:
		customer_id = None
		user_id = None

	vehicle_obj = jmdCustomerVehicle.objects.filter(outlet_id=outletid, customer_id=customer_id)
	# for res in vehicle_obj:
	#     print(res.vehicle_number)

	if request.method == 'POST':
		postdata = request.POST.copy()
		press_btn = postdata.get('press_btn', None)

		customer_service_obj = jmdCustServicingDetails()
		customer_service_obj.service_location = postdata.get('service_location',None)
		customer_service_obj.repair_type = postdata.get('repair_type',None)
		customer_service_obj.service_advisor = postdata.get('service_advisor',None)     
		customer_service_obj.service_invoice_amount=postdata.get('service_invoice_amount',None) #29/04/19
		service_invoice_date = postdata.get('service_invoice_date',None)
		if service_invoice_date and service_invoice_date != "" :
			service_invoice_date = datetime.strptime(service_invoice_date, '%d-%m-%Y')
			service_invoice_date = service_invoice_date.strftime('%Y-%m-%d %H:%M:%S')               
			service_invoice_date = datetime.strptime(service_invoice_date, '%Y-%m-%d %H:%M:%S')              
		else:
			service_invoice_date = None        
		customer_service_obj.service_invoice_date = service_invoice_date
		# customer_service_obj.service_exipry_date = postdata.get('service_location',None)
		customer_service_obj.customer_id = customer_id
		customer_service_obj.outlet_id = outletid
		customer_service_obj.vehicle_id = postdata.get('vehicle_number',None)

		job_card_date = postdata.get('job_card_date',None)
		if job_card_date and job_card_date != "" :
			job_card_date = datetime.strptime(job_card_date, '%d-%m-%Y')
			job_card_date = job_card_date.strftime('%Y-%m-%d %H:%M:%S')     
		else:
			job_card_date = None        

		next_service_date = postdata.get('next_service_date',None)
		if next_service_date and next_service_date != "" :
			next_service_date = datetime.strptime(next_service_date, '%d-%m-%Y')
			next_service_date = next_service_date.strftime('%Y-%m-%d %H:%M:%S')                                   
		else:
			next_service_date = None                

		customer_service_obj.service_expiry_date = next_service_date  
		customer_service_obj.job_card_date = job_card_date
		customer_service_obj.user_id = user_id
		customer_service_obj.save()

		
		messages.add_message(request, messages.SUCCESS, 'Servicing details added successfully.', fail_silently=True)

		if press_btn == 'Save':
			return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
		elif press_btn == 'Save & Close':
			url = reverse('customers:get_my_customers')
			return HttpResponseRedirect(url)        
			
	return render(request, template_name, locals())

@login_required(login_url='/merchant-login/')
@multi_user_permission('edit', 'Servicing')
def get_edit_servicing(request,servicingId=0, template_name='merchant_site/customers/add_servicing.html'):
	edit = True
	active_page_name = "get_edit_servicing"
	if request.session.get('is_logged_in_superuser') == False:
		outlet_list = outlet_details.objects.filter(id__in=request.session.get('allowed_outlets_list'),
													company_id=request.session.get('company_id'), is_active=1,
													is_verified=1)
	elif request.session.get('is_logged_in_superuser') == True:
		outlet_list = outlet_details.objects.filter(company_id=request.session.get('company_id'), is_active=1,
													is_verified=1)
	#for get outlet
	outletid = None
	if request.session.get('outlet_id') and outletid == None:
		outletid = int(request.session.get('outlet_id'))
	try:
		outletObj = get_object_or_404(outlet_details, id=outletid)
	except:
		outletObj = None

	try:
		servicingObj = get_object_or_404(jmdCustServicingDetails, id=servicingId)
	except:
		servicingObj = None 

	vehicle_obj = get_object_or_404(jmdCustomerVehicle, id=servicingObj.vehicle_id)
	outletid = int(vehicle_obj.outlet_id)
	customer_id = vehicle_obj.customer_id
	try:
		vehicle_obj = get_object_or_404(jmdCustomerVehicle, id=servicingObj.vehicle_id)
		outletid = int(vehicle_obj.outlet_id)
		customer_id = vehicle_obj.customer_id
	except:
		vehicle_obj = None 

	# for get selected customer
	if servicingObj:
		try:
			customer_details_obj = get_object_or_404(customer_details, id=servicingObj.customer_id)
			outletid = int(customer_details_obj.outlet_id)
			customer_id = customer_details_obj.id
		except:
			customer_details_obj = None        
	
		if customer_details_obj: 
			cursor = connection.cursor()
			
			# for servicing details            
			cursor.execute('''select * from xl925_jmd_cust_servicing_details as jcsd INNER JOIN xl925_jmd_customers_vehicle as jcv 
							on jcv.id = jcsd.vehicle_id where jcsd.outlet_id = {0} and jcv.customer_id = {1} '''.format(outletid,customer_id))
			jmd_servicing_obj = dictfetchall(cursor)
	
			if request.method == 'POST':
				postdata = request.POST.copy();
				press_btn = postdata.get('press_btn', None)
				servicing_id_obj = postdata.get('servicing_id', None)
				try:
					customer_service_obj = get_object_or_404(jmdCustServicingDetails, id=servicing_id_obj)
				except:
					customer_service_obj = None

				if customer_service_obj:
					customer_service_obj.service_location = postdata.get('service_location',None)
					customer_service_obj.repair_type = postdata.get('repair_type',None)
					customer_service_obj.service_advisor = postdata.get('service_advisor',None)     
					customer_service_obj.service_invoice_amount = postdata.get('service_invoice_amount',None)#29/04/19
					service_invoice_date = postdata.get('service_invoice_date',None)
					if service_invoice_date and service_invoice_date != "" :
						service_invoice_date = datetime.strptime(service_invoice_date, '%d-%m-%Y')
						service_invoice_date = service_invoice_date.strftime('%Y-%m-%d %H:%M:%S')               
					else:
						service_invoice_date = None    

					customer_service_obj.service_invoice_date = service_invoice_date

					job_card_date = postdata.get('job_card_date',None)
					if job_card_date and job_card_date != "" :
						job_card_date = datetime.strptime(job_card_date, '%d-%m-%Y')
						job_card_date = job_card_date.strftime('%Y-%m-%d %H:%M:%S')     
					else:    
						job_card_date = None

					next_service_date = postdata.get('next_service_date',None)
					if next_service_date and next_service_date != "" :
						next_service_date = datetime.strptime(next_service_date, '%d-%m-%Y')
						next_service_date = next_service_date.strftime('%Y-%m-%d %H:%M:%S') 
					else:
						next_service_date = None    
			
					customer_service_obj.service_expiry_date = next_service_date
					customer_service_obj.job_card_date = job_card_date
					customer_service_obj.save()
				
					messages.add_message(request, messages.SUCCESS, 'Servicing details edited successfully.', fail_silently=True)

					if press_btn == 'Save':                        
						return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
					elif press_btn == 'Save & Close':
						url = reverse('customers:get_my_customers')
						return HttpResponseRedirect(url)                    
			
	return render(request, template_name, locals())    

@login_required(login_url='/merchant-login/')
@redirectMerchantAsPerProgress("MY_CUSTOMERS")
@multi_user_permission('add', 'Insurance')
def get_add_insurance(request,custCode=0, template_name='merchant_site/customers/add_insurance.html'):
	active_page_name = "get_add_insurance"
	if request.session.get('is_logged_in_superuser') == False:
		outlet_list = outlet_details.objects.filter(id__in=request.session.get('allowed_outlets_list'),
													company_id=request.session.get('company_id'), is_active=1,
													is_verified=1)
	elif request.session.get('is_logged_in_superuser') == True:
		outlet_list = outlet_details.objects.filter(company_id=request.session.get('company_id'), is_active=1,
													is_verified=1)
	#for get outlet
	outletid = None
	if request.session.get('outlet_id') and outletid == None:
		outletid = int(request.session.get('outlet_id'))
	try:
		outletObj = get_object_or_404(outlet_details, id=outletid)
	except:
		outletObj = None

	my_all_customer_details_obj = customer_details.objects.filter(outlet_id=outletid)
	from json import dumps
	my_cust_list = []
	for cust in my_all_customer_details_obj:
		new_dataDictionary = { 'cust_id': cust.id,'cust_email': cust.email,  'cust_mobile': cust.phone_no, }
		my_cust_list.append(new_dataDictionary)
	cust_dataJSON = dumps(my_cust_list)
	print(cust_dataJSON)

	# for get selected customer
	try:
		customer_details_obj = get_object_or_404(customer_details, id=custCode)
		outletid = int(customer_details_obj.outlet_id)
		customer_id = customer_details_obj.id
		user_id = customer_details_obj.user_id        
	except:
		customer_id = None
		user_id = None

	vehicle_obj = jmdCustomerVehicle.objects.filter(outlet_id=outletid, customer_id=customer_id)

	if request.method == 'POST':
		postdata = request.POST.copy();
		press_btn = postdata.get('press_btn', None)

		customer_insurance_obj = jmd_cust_insurance_details()
		customer_insurance_obj.policy_number = postdata.get('policy_no',None)
		customer_insurance_obj.insurance_company = postdata.get('insurance_company',None)

		policy_expiry_date = postdata.get('policy_exp_date',None)
		if policy_expiry_date and policy_expiry_date != "" :
			policy_expiry_date = datetime.strptime(policy_expiry_date, '%d-%m-%Y')
			policy_expiry_date = policy_expiry_date.strftime('%Y-%m-%d %H:%M:%S')

		customer_insurance_obj.policy_expiry_date = policy_expiry_date
		customer_insurance_obj.executive_name = postdata.get('executive_name',None) 
		customer_insurance_obj.amount = postdata.get('amount',None)
		customer_insurance_obj.customer_id = customer_id
		customer_insurance_obj.outlet_id = outletid
		customer_insurance_obj.vehicle_id = postdata.get('vehicle_number',None)
		customer_insurance_obj.insurance_product_name = postdata.get('insurance_product_name',None) 
		print(customer_insurance_obj.vehicle_id)
		customer_insurance_obj.user_id = user_id
		customer_insurance_obj.save()
		
		messages.add_message(request, messages.SUCCESS, 'Insurance details added successfully.', fail_silently=True)

		if press_btn == 'SAVE':
			url = reverse('customers:get_my_customers', kwargs={'custCode': customer_obj.id})
			return HttpResponseRedirect(url)
		elif press_btn == 'SAVE & CLOSE':
			url = reverse('customers:get_my_customers')
			return HttpResponseRedirect(url)
			

	return render(request, template_name, locals())

@login_required(login_url='/merchant-login/')
@multi_user_permission('edit', 'Insurance')
def get_edit_insurance(request,insuranceId=0, template_name='merchant_site/customers/add_insurance.html'):
	edit = True
	active_page_name = "get_edit_servicing"
	if request.session.get('is_logged_in_superuser') == False:
		outlet_list = outlet_details.objects.filter(id__in=request.session.get('allowed_outlets_list'),
													company_id=request.session.get('company_id'), is_active=1,
													is_verified=1)
	elif request.session.get('is_logged_in_superuser') == True:
		outlet_list = outlet_details.objects.filter(company_id=request.session.get('company_id'), is_active=1,
													is_verified=1)
	#for get outlet
	outletid = None
	if request.session.get('outlet_id') and outletid == None:
		outletid = int(request.session.get('outlet_id'))
	try:
		outletObj = get_object_or_404(outlet_details, id=outletid)
	except:
		outletObj = None

	try:
		insuranceObj = get_object_or_404(jmd_cust_insurance_details, id=insuranceId)
	except:
		insuranceObj = None    
	
	# for get selected customer
	if insuranceObj:
		try:
			vehicle_obj = get_object_or_404(jmdCustomerVehicle, id=insuranceObj.vehicle_id)
			outletid = int(vehicle_obj.outlet_id)
			customer_id = vehicle_obj.customer_id
		except:
			vehicle_obj = None   

		try:
			customer_details_obj = get_object_or_404(customer_details, id=insuranceObj.customer_id)            
			outletid = int(customer_details_obj.outlet_id)
			customer_id = customer_details_obj.id
		except:
			customer_details_obj = None

	if request.method == 'POST':
		postdata = request.POST.copy();
		press_btn = postdata.get('press_btn', None)
		print(postdata)

		try:
			customer_insurance_obj = get_object_or_404(jmd_cust_insurance_details, id=postdata.get('insurance_id'))
		except:
			customer_insurance_obj = None

		if customer_insurance_obj:
			customer_insurance_obj.policy_number = postdata.get('policy_no', None)
			customer_insurance_obj.insurance_company = postdata.get('insurance_company', None)

			#11-10-2019            
			policy_purchase_date = postdata.get('policy_purchase_date', None)
			if policy_purchase_date and policy_purchase_date != "":
				policy_purchase_date = datetime.strptime(policy_purchase_date, '%d-%m-%Y')
				policy_purchase_date = policy_purchase_date.strftime('%Y-%m-%d %H:%M:%S')
			#11-10-2019

			policy_expiry_date = postdata.get('policy_exp_date',None)
			if policy_expiry_date and policy_expiry_date != "" :
				policy_expiry_date = datetime.strptime(policy_expiry_date, '%d-%m-%Y')
				policy_expiry_date = policy_expiry_date.strftime('%Y-%m-%d %H:%M:%S')

			customer_insurance_obj.policy_purchase_date = policy_purchase_date  #11-10-2019          
			customer_insurance_obj.policy_expiry_date = policy_expiry_date
			customer_insurance_obj.amount = postdata.get('amount', None)
			customer_insurance_obj.executive_name = postdata.get('executive_name', None)
			customer_insurance_obj.save()

			messages.add_message(request, messages.SUCCESS, 'Insurance details edited successfully.', fail_silently=True)

			if press_btn == 'Save':                
				return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
			elif press_btn == 'Save & Close':
				url = reverse('customers:get_my_customers')
				return HttpResponseRedirect(url)
				

	return render(request,template_name,locals())    

@login_required(login_url='/merchant-login/')
@multi_user_permission('view', 'Customers')
@permission_required(['customers.add_customer_details','customers.change_customer_details','customers.delete_customer_details'],raise_exception=True)
def get_view_customer(request, custCode='0', template_name='merchant_site/customers/view_customer.html'):
	cursor = connection.cursor()
	active_page_name = "get_view_customer"
	edit = True
	country_obj = Country.objects.all()


	if request.session.get('is_logged_in_superuser') == False:
		outlet_list = outlet_details.objects.filter(id__in=request.session.get('allowed_outlets_list'),company_id = request.session.get('company_id'),is_active=1,is_verified = 1)
	elif request.session.get('is_logged_in_superuser') == True:
		outlet_list = outlet_details.objects.filter(company_id = request.session.get('company_id'),is_active=1,is_verified = 1)
	
	outletid = None
	if request.session.get('outlet_id') and outletid == None:
		outletid = int(request.session.get('outlet_id'))    

	try:
		outletObj = get_object_or_404(outlet_details, id = outletid)
	except:
		outletObj = None   
	else:
		try:
			county_obj = All_Countries_Complete_Info.objects.filter(currency=outletObj.outlet_currency)
			currency_sym = county_obj[0].currency_symbol
		except Exception as a:
			county_obj = get_object_or_404(All_Countries_Complete_Info,currency='INR')
			currency_sym = county_obj.currency_symbol
		if outletObj.is_jmd == True:
			template_name='merchant_site/customers/JMD_view_customer.html'
	
	# clients_account_obj = clients_account.objects.filter(outlet=outletid,is_trash=0)
	clients_account_obj = clients_account.objects.filter(outlet=outletid,is_trash=0)

	from json import dumps
	clients_account_list = []
	for cli in clients_account_obj:
		new_Dictionary = { 
			'comapny_id':cli.id,
			'company_name':cli.company_name,
			'industry':cli.industry,
			'company_phone':cli.company_phone,
			'company_email':cli.company_email,
			'company_website':cli.company_website,
			'company_gst':cli.company_gst,
			'company_fb':cli.company_fb,
			'company_insta':cli.company_insta,
			'company_twitter':cli.company_twitter,
			'company_pancard':cli.company_pancard,
			'com_address':cli.address_line1,
			'com_street':cli.street,
			'com_area_building':cli.area_building,
			'com_landmark':cli.landmark,
			'com_city':cli.city,
			'com_state':cli.state,
			'com_pincode':cli.pincode,
			'com_country_selection':cli.country,
			}
		clients_account_list.append(new_Dictionary)
	clients_account_dataJSON = dumps(clients_account_list)
	try:
		inovice_details_obj = inovice_details.objects.filter(customer_id=custCode,status='ACT')
	except:
		inovice_details_obj = None
	try:
		inovice_details_obj_paid = inovice_details.objects.filter(customer_id=custCode,payment_status='paid')
	except:
		inovice_details_obj_paid = None
	
	total_revenue = 0
	total_inv = 0
	if inovice_details_obj:
		total_inv = len(inovice_details_obj)
		for ino in inovice_details_obj_paid:
			total_revenue = total_revenue + float(ino.total_amount_after_gst)
	try:
		customer_details_obj = get_object_or_404(customer_details, id=custCode)
		outletid = int(customer_details_obj.outlet_id)
		customer_id = customer_details_obj.id
		user_id = customer_details_obj.user_id
	except:
		user_id = None
		customer_id = None


	try:
		inovice_details_obj2 = inovice_details.objects.filter(customer_id=custCode,payment_status='unpaid')
		balance_to_pay = 0.0
		if inovice_details_obj2:
			for ino in inovice_details_obj2:
				invoice_payment_details_obj = invoice_payment_details.objects.filter(customer_id=custCode,outlet_id=outletid,inovice_number_id=ino.id).last()      
			
				if invoice_payment_details_obj:
					balance_to_pay += float(invoice_payment_details_obj.remain_amount)
				else:
					balance_to_pay += float(ino.total_amount)
	except:
		pass
		
	

	print(user_id)
	print('zindagi naa milegi dobaara')

	print(outletObj)
	print('kasie hua kasie hua....................')
	print(custCode)
	custfirstname = ""
	custlastname = ""
	if custCode != 0 or custCode != None:
		try:
			customer_details_obj = get_object_or_404(customer_details, id=custCode)
			outletid = int(customer_details_obj.outlet_id)
			customer_id = customer_details_obj.id
			customer_user_id=customer_details_obj.user_id
			selected_client_acc = customer_details_obj.clients_account_id
			if customer_details_obj.customer_name:
				custname = str(customer_details_obj.customer_name).split()
				if len(custname) > 1:
					custfirstname = custname[0]
					custlastname = custname[1]
				else:
					custfirstname = custname[0]
		except:
			customer_details_obj = None
	else:
		customer_details_obj = None 
	if selected_client_acc:
		try:
			client_acc_obj = get_object_or_404(clients_account,id=selected_client_acc)
		except:
			client_acc_obj = None
	if customer_user_id:
		# cursor.execute('''SELECT ooi.offer_name,ok.transaction_id,mo.expired_at,mo.created_at,ok.order_amount,mo.is_redeem,ooi.seller_ref_code from `xl925_my_offers` as mo INNER JOIN `xl925_offer_kits` as ok ON mo.kit_id = ok.id 
		#          INNER JOIN `xl925_outlet_offer_info` as ooi ON mo.offer_id = ooi.id
		#         where ok.customer_user_id = {0} and ooi.outlet_id = {1} GROUP by ok.id'''.format(customer_user_id,outletid))
		# customer_details_objs = dictfetchall(cursor)   
		cursor.execute('''SELECT ooi.offer_name,mo.expired_at,mo.created_at,ok.order_amount,mo.is_redeem,ooi.seller_ref_code, ok.id as kit_id , mo.offer_id , ok.reminders_sent, ok.outlet_id from `xl925_my_offers` as mo INNER JOIN `xl925_offer_kits` as ok ON mo.kit_id = ok.id 
				 INNER JOIN `xl925_outlet_offer_info` as ooi ON mo.offer_id = ooi.id
				where ok.customer_user_id = {0} and ooi.outlet_id = {1} GROUP by ok.id'''.format(customer_user_id,outletid))
		customer_details_objs = dictfetchall(cursor) 
		'''Get Reminder dates'''
		try:
			ActionEmailSetting_obj = get_object_or_404(EmailActionSetting, root_user = request.user.id, outlet = outletid)
		except:
			ActionEmailSetting_obj = None

		if ActionEmailSetting_obj:
			import ast 
			try:
				if ActionEmailSetting_obj.email_reminders:
					reminders = ast.literal_eval(ActionEmailSetting_obj.email_reminders)
				else:
					reminders=None
			except:
				pass
			if reminders:
				print("length--->",len(reminders))
				print(reminders)
				reminders_list = list(reminders.values())
				print('========>',reminders_list)
				try:
					for i in customer_details_objs:
						# if not i['root_offer_kit_id']:
						'''To get offers issue with reminders sent'''
						all_reminders = []
						date = i['created_at']
						reminder_sent=[]
						reminder_data_list=[]
						for days in reminders_list:
							temp={}
							temp['date']=(date + timedelta(days=int(days))).strftime('%d-%m-%Y')
							temp['sent']=0
							reminder_sent.append(temp)
						# 
						reminder_data_list.append(reminder_sent)
						
						i['all_reminders'] = reminder_data_list
						print(i['all_reminders'],"=======================================")

						if len(i['reminders_sent']) > 0:
							print(i['outlet_id'])
							import ast
							print('Reminders sent',i['reminders_sent'])
							reminders_sent_list = ast.literal_eval((i['reminders_sent']))
							print(type(reminders_sent_list))
							print(len(reminders_sent_list))
							print("reminders sent--------->",reminders_sent_list)
							print('first element of the list',reminders_sent_list[0])
							ele = 0
							for reminder in reminders_sent_list:
								print(reminder)

								print(ele)
								
								try:
									i['all_reminders'][0][ele]['date']= datetime.strptime(reminder, "%Y-%m-%d").strftime('%d-%m-%Y')
									i['all_reminders'][0][ele]['sent'] = 1
								except Exception as e:
									# i['all_reminders'][ele][0] = reminder
									# i['all_reminders'][ele][1] = 1
									print("----------------------------->>>>>",e)
								   
								# i['all_reminders'][ele] = datetime.strptime(reminder, "%Y-%m-%d").strftime('%d-%m-%Y')+" (sent) "
								ele =ele+1
							print("----------------->",i['all_reminders'])
					else:
						pass
					'''End'''
					
				except Exception as e:
					print('error--->',e)
					pass
		'''Get Reminders End'''
		print(customer_details_objs)
		print('jaaneeeeee jaaaaaaaaaaa dhundhta fir rha hu.....')

	if customer_id:
		user_obj = customer_details.objects.filter(id=customer_id).first()
		user_id = user_obj.user_id             
	result_list = []
	now = datetime.now()


	# all reward points of this customer
	reward_point = 0
	temp_points_list = []
	total_reward_point_redeemed = 0
	reward_points_obj = reward_points_earned_on_action.objects.filter(customer_id=custCode).order_by('-id')
	for rob in reward_points_obj:
		reward_point += float(rob.rewards_point)
		temp1 = {
			'created_at':rob.created_at,
			'action':rob.action,
			'point':rob.rewards_point,
			'amount_spend':rob.amount_spend,
			'type':'Earned',
		}
		temp_points_list.append(temp1)

	# all redeemed points of this customer
	redeemed_points_obj = reward_points_redeem_on_action.objects.filter(customer_id=custCode).order_by('-id')
	for red in redeemed_points_obj:
		total_reward_point_redeemed += float(red.redeemed_point)
		temp2 = {
			'created_at':red.created_at,
			'action':red.action,
			'point':red.redeemed_point,
			'amount_spend':'--',
			'type':'Redeemed',
		}
		temp_points_list.append(temp2)
	
	loyalty_points_list = sorted(temp_points_list, key = lambda i: i['created_at'],reverse=True)
	
	
	# remian reward points
	reward_point = round(reward_point - total_reward_point_redeemed,2)

	# add call and ticket obj
	addcallobj = new_Addcall_details.objects.filter(customer = custCode,outlet_id=request.session.get('outlet_id'))
	# Ticket_history_obj = Ticket_history.objects.filter(customer_id=custCode,outlet_id=request.session.get('outlet_id')).order_by('-id')

	print(addcallobj,"--addcallobj--addcallobj")  

	total_revenue = 0
	total_sales = 0
	lifetime_value = 0
	last_invoice_amount = 0
	try:
		qs=inovice_details.objects.filter(outlet_id=request.session.get('outlet_id'),customer_id=customer_details_obj.id,payment_status="paid")
		if qs.exists():
			
			total_revenue = qs.aggregate(Sum('total_amount_after_gst')).get('total_amount_after_gst__sum')
			total_sales = qs.count()

			first = qs.first().created_at
			days = (datetime.today().date() - first.date()).days
			lifetime_value = total_revenue * total_sales * days
			lifetime_value=round(lifetime_value,2)

			last_invoice_amount = qs.last().total_amount_after_gst
			last_invoice_date = qs.last().created_at
		else:
			lifetime_value = 0
	except:
		total_revenue = 0

	#########################last Purchase############################
	last_invoice_obj = inovice_details.objects.filter(outlet_id=request.session.get('outlet_id'),customer_id=customer_details_obj.id).last()
	import ast 
	if last_invoice_obj:
		billing_dict = ast.literal_eval(last_invoice_obj.billing_discription)

		billing = billing_dict[0]
	else:
		billing_dict=""

		
	if customer_details_obj:
		try:
			appointment_booking_obj = appointment_booking.objects.filter(outlet_id=request.session.get('outlet_id'),is_trash=0,customer_id=customer_details_obj.id).order_by('-id')
		except:
			appointment_booking_obj = None
		
		if appointment_booking_obj:
			for appointment in appointment_booking_obj:
				temp = {}

				date_time_str = appointment.appointment_date+ ' ' +appointment.appointment_time
				# print(date_time_str)
				try:
					date_time_obj = datetime.strptime(date_time_str, '%Y-%m-%d %H:%M:%S')
				except:
					date_time_obj = datetime.strptime(date_time_str, '%Y-%m-%d %H:%M')

				if appointment.status == 'CAN':
					temp['status'] = 'Cancelled'
				else:	
					if now > date_time_obj:
						temp['status'] = 'Expired'
					else:
						temp['status'] = 'Upcoming' 



				prod_id_str = appointment.product_id
				
				import ast
				prod_id_list = ast.literal_eval(prod_id_str)
			  

				temp['no_of_prod'] = len(prod_id_list)
				temp['prod_price'] = appointment.product_price
				
				

				try:
					service_master_info_obj = get_object_or_404(service_master_info,id=appointment.service_master_id)
					temp['service_master_name'] = service_master_info_obj.service_master_name
					temp['service_master_id'] = appointment.service_master_id
				except :
					service_master_info_obj = None
					temp['service_master_name'] = None
					temp['service_master_id'] = None

				temp['id'] = appointment.id
				temp['cust_name'] = customer_details_obj.customer_name
				temp['cust_id'] = customer_details_obj.id
				temp['created_at'] = appointment.created_at
				# temp['appointment_date'] = appointment.appointment_date
				temp['appointment_time'] = appointment.appointment_time
				dt = datetime.strptime(appointment.appointment_date, '%Y-%m-%d')
				temp['appointment_date'] = dt.date()
				
				result_list.append(temp)
		try:
			inovice_details_obj = inovice_details.objects.filter(outlet_id=request.session.get('outlet_id'),customer_id=customer_details_obj.id).order_by('-id')
		except:
			inovice_details_obj = None
		result_list2 = []
		if inovice_details_obj:
			for invoice in inovice_details_obj:
				temp2 = {}
				date_time_obj = invoice.created_at
				temp2['total_amount'] = invoice.total_amount_after_gst
				products = ast.literal_eval(invoice.billing_discription)
				prod_name_list = []
				for prod_name in products:
					if prod_name['prod_name']:
						prod_name_list.append(prod_name['prod_name'])	   
				prod_data = ' , '.join(prod_name_list)
				temp2['prod_name_list'] = prod_data
				try:
					service_master_info_obj = get_object_or_404(service_master_info,id=invoice.service_master_id)
					temp2['service_master_name'] = service_master_info_obj.service_master_name
					temp2['service_master_id'] = invoice.service_master_id
				except :
					service_master_info_obj = None
					temp2['service_master_name'] = None
					temp2['service_master_id'] = None

				temp2['inovice_number'] = invoice.inovice_number
				temp2['cust_name'] = customer_details_obj.customer_name
				temp2['cust_email'] = customer_details_obj.email
				temp2['cust_number'] = customer_details_obj.phone_no
				temp2['no_of_prod'] = 1
				temp2['created_at'] = invoice.created_at
				temp2['is_partially_payment'] = invoice.is_partially_payment

				result_list2.append(temp2)
	if request.method == "POST":
		temp_post = request.POST.copy()
		print(temp_post,"pppppppppppp")
		if temp_post.get("submit_from_wallet") == "submit_from_wallet":
			cust_obj = get_object_or_404(customer_details,id=custCode)
			if cust_obj.credit_amount:
				cust_obj.credit_amount = float(cust_obj.credit_amount) + float(temp_post.get('amount_to_add'))
			else:
				cust_obj.credit_amount = temp_post.get('amount_to_add')
			cust_obj.save()
			messages.add_message(request, messages.SUCCESS, 'Added To Wallet',fail_silently=True)

		if temp_post.get("submit_from_points") == "submit_from_points":
			cust_obj = get_object_or_404(customer_details,id=custCode)
			reward_obj2 = reward_points_earned_on_action()
			reward_obj2.outlet_id = outletid
			reward_obj2.customer_id = cust_obj.id
			reward_obj2.email_id = cust_obj.email
			reward_obj2.action = "manual"
			reward_obj2.rewards_point = temp_post.get('point_to_add')
			reward_obj2.amount_spend = 0
			reward_obj2.save()
			messages.add_message(request, messages.SUCCESS, 'Points Added',fail_silently=True)
		url = reverse('customers:get_view_customer', kwargs={'custCode': custCode})
		return HttpResponseRedirect(url)

	if customer_details_obj and (request.session.get('is_jmd') or request.session.get('outlet_vehicle')):
				
		if request.session.get('is_jmd'):
			cursor.execute('''SELECT * FROM xl925_jmd_customers_vehicle where user_id = '{0}' 
							  and (select is_jmd from xl925_outlet_basic_details where id = outlet_id) = True
							  GROUP by vehicle_number'''.format(user_id))
		elif request.session.get('outlet_vehicle'):
			cursor.execute('''SELECT * FROM xl925_jmd_customers_vehicle where user_id = '{0}' 
							  and (select is_outlet_vehicle from xl925_outlet_basic_details where id = outlet_id) = True
							  GROUP by vehicle_number'''.format(user_id))
				
		vehicleObj = dictfetchall(cursor)                                

		if len(vehicleObj) > 0:

			if request.session.get('is_jmd'):
				cursor = connection.cursor()

				# for servicing details            
				cursor.execute('''SELECT jcv.vehicle_number,jcsd.is_trash,jcsd.service_invoice_date,jcsd.service_expiry_date,jcsd.id,jcsd.repair_type,jcsd.service_location,jcsd.service_advisor,jcsd.service_invoice_amount,jcsd.job_card_date ,jcsd.service_expiry_date
								from xl925_jmd_cust_servicing_details as jcsd INNER JOIN xl925_jmd_customers_vehicle as jcv 
								on jcv.id = jcsd.vehicle_id where jcv.user_id = {0} '''.format(user_id))
				jmd_servicing_obj = dictfetchall(cursor)

				# for Insurance details            
				cursor.execute('''SELECT jcv.vehicle_number,jcid.id,jcid.is_trash,jcid.policy_number,jcid.policy_expiry_date,jcid.executive_name,jcid.amount
								from xl925_jmd_cust_insurance_details as jcid 
								INNER JOIN xl925_jmd_customers_vehicle as jcv 
								on jcv.id = jcid.vehicle_id where jcv.user_id = {0} '''.format(user_id))  
				print('''SELECT jcv.vehicle_number,jcid.id,jcid.policy_number,jcid.policy_expiry_date,jcid.executive_name,jcid.amount
								from xl925_jmd_cust_insurance_details as jcid 
								INNER JOIN xl925_jmd_customers_vehicle as jcv 
								on jcv.id = jcid.vehicle_id where jcv.user_id = {0} '''.format(user_id))            
				jmd_insurance_obj = dictfetchall(cursor)          
			   
				print(jmd_insurance_obj)
				print('poppppopularrrrrrr bankkkkkkkk chevckecd hear')

				#for finance details 03-12-2019

				cursor.execute('''SELECT jcv.vehicle_number,jfd.id,jfd.Bank_Name,jfd.is_trash,jfd.Loan_Number,jfd.Loan_amount,jfd.Emi_Amount,jfd.Emi_End_Date
								from xl925_jmd_finance_details as jfd 
								INNER JOIN xl925_jmd_customers_vehicle as jcv 
								on jcv.id = jfd.vehicle_id where jcv.user_id = {0} '''.format(user_id)) 

				jmd_finance_obj = dictfetchall(cursor)
				

				print(jmd_finance_obj)

			elif request.session.get('outlet_vehicle'):
				cursor.execute('''SELECT jcv.vehicle_number,jcsd.service_invoice_date,jcsd.service_expiry_date,jcsd.id,jcsd.repair_type,jcsd.service_location,jcsd.service_advisor,jcsd.service_invoice_amount,jcsd.job_card_date ,jcsd.service_expiry_date
								from xl925_jmd_cust_servicing_details as jcsd INNER JOIN xl925_jmd_customers_vehicle as jcv 
								on jcv.id = jcsd.vehicle_id where (SELECT is_outlet_vehicle from xl925_outlet_basic_details where id = jcsd.outlet_id) = True
								and jcv.user_id = {0} '''.format(user_id))
				outlet_vehicle_service_obj = dictfetchall(cursor)   
				print(outlet_vehicle_service_obj)
				print('lalalalalalalalalalalallallallallalallallallallalallalallalalala') 

		if request.method == 'POST':   
   
			postdata = request.POST.copy()        
			press_btn = postdata.get('press_btn', None)
			postdata = request.POST.copy()  # collect post data
			delete=postdata.get("deletefield")
			delete1=postdata.get("insurancedelete")
			delete2 = postdata.get("servicedelete")
			vehicle_number = postdata.getlist('vehicle_number')
			finance = postdata.get('deleteid')
			insurance = postdata.get('insuranceid')
			serviceid = postdata.get('serviceid')
			servicedelete = postdata.get('servicedelete',None)
			vehicledelete = postdata.get('vehicledelete',None)
			Calldelete = postdata.get('calldelete',None)
			#print(serviceid)
			print(postdata)
			
			print('i am bacccccccccccck with a banhggggggggggggggg')
			
			deletefield=delete
			print(deletefield)
			insurancedelete = delete1

			servicedelete = serviceid

			print(finance)
			print('aisa desh hai mera haaaa')
			print(delete1)

			print(insurance)
			print('yaara teri ko mene to khuda manaa')
				

			if vehicledelete:

				vehicledelobj = get_object_or_404(jmdCustomerVehicle, id=vehicledelete)

				print(vehicledelobj)

				vehicledelobj.is_trash = 1
				vehicledelobj.save()
				messages.add_message(request, messages.SUCCESS, 'Your Vehicle Detail is successfully deleted',fail_silently=True)
				url = reverse('customers:get_view_customer',kwargs={'custCode':custCode})
				return HttpResponseRedirect(url)


			if finance:
				print('asdkjksajkdjsakjdskj')
				
			   
				print(user_id)
				deleteobj = get_object_or_404(finance_details, id=finance)
				# sub_xircle_infoobj = finance_details.objects.filter(id=11)
				print(deleteobj)
				print('fdjsjkdhofiaspsj')
				deleteobj.is_trash=1
				# print(deleteobj.is_trash)
				# sub_xircle_infoobj.is_trash=1
				# sub_xircle_infoobj.is_active=0
				deleteobj.save()
				messages.add_message(request, messages.SUCCESS, 'Your Finance Detail is successfully deleted',fail_silently=True)
				url = reverse('customers:get_view_customer',kwargs={'custCode':custCode})
				return HttpResponseRedirect(url)
				# deleteobj.save()
				# print(a)

			if insurancedelete:
				print('asdkjksajkdjsakjdskj')
				
			   
				print(user_id)
				insurancedeleteobj = get_object_or_404(jmd_cust_insurance_details, id=insurancedelete)
				# sub_xircle_infoobj = finance_details.objects.filter(id=11)
			   
				print('fdjsjkdhofiaspsj')
				insurancedeleteobj.is_trash=1
				# print(deleteobj.is_trash)
				# sub_xircle_infoobj.is_trash=1
				# sub_xircle_infoobj.is_active=0
				insurancedeleteobj.save()
				messages.add_message(request, messages.SUCCESS, 'Your Insurance Detail is successfully deleted',fail_silently=True)
				url = reverse('customers:get_view_customer',kwargs={'custCode':custCode})
				return HttpResponseRedirect(url)

			if servicedelete:
				print('asdkjksajkdjsakjdskj')
				
			   
				print(user_id)
				servicedeleteobj = get_object_or_404(jmdCustServicingDetails, id=serviceid)
				# sub_xircle_infoobj = finance_details.objects.filter(id=11)
			   
				print('fdjsjkdhofiaspsj')
				servicedeleteobj.is_trash=1
				# print(deleteobj.is_trash)
				# sub_xircle_infoobj.is_trash=1
				# sub_xircle_infoobj.is_active=0
				servicedeleteobj.save()
				messages.add_message(request, messages.SUCCESS, 'Your Service Detail is successfully deleted',fail_silently=True)
				url = reverse('customers:get_view_customer',kwargs={'custCode':custCode})
				return HttpResponseRedirect(url)

			print('dsaladl;sa;lk;l')

			if Calldelete:
				callhistoryobj = get_object_or_404(new_Addcall_details,id = Calldelete)
				print('dkfkdhfjdsh')

				print(callhistoryobj)

				callhistoryobj.is_trash = 1
				print('njkdfsdfkklfdkjfhdjfh')
				callhistoryobj.save()
				messages.add_message(request, messages.SUCCESS, 'Your Call  History is successfully deleted',fail_silently=True)
				url = reverse('customers:get_view_customer', kwargs={'custCode': custCode})
				return HttpResponseRedirect(url)
	if request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest':
		postdata = request.POST.copy()
		print(postdata)
		press_btn = postdata.get('press_btn',None)
   
		title = postdata.get('title',None)
   
		fname = postdata.get('fname',None)
	   
		lname = postdata.get('lname',None)
		cust_email = postdata.get('email',None)
 
		mobno = postdata.get('mobno',None)
		mobno2 = postdata.get('mobno2',None)

		landline1 = postdata.get('lan1',None)
		landline2 = postdata.get('lan2',None)      
		cust_birth_date = postdata.get('date_of_birth',None)
		gender = postdata.get('gender',None)
		marital_status = postdata.get('marital_status',None)
		marr_anniv = postdata.get('marriage_anniversery',None)
		children = postdata.get('children',None)
		NO_Of_Children = postdata.get('countchildren',None)
		occupation = postdata.get('occupation',None)


		
		pancard = postdata.get('pancard',None)
		Adharcard = postdata.get('txtAadhar',None)

		
		
		address1 = postdata.get('address',None)
		address2 = postdata.get('street',None)
		area_building = postdata.get('area_building',None)
		landmark = postdata.get('landmark',None)
		cust_city = postdata.get('city',None)
		cust_pincode = postdata.get('pincode',None)
		state = postdata.get('state',None)
		cust_country = postdata.get('country_selection',None)



		shipping_address = postdata.get('shipping_address',None)
		shipping_street = postdata.get('shipping_street',None)
		shipping_area_building = postdata.get('shipping_area_building',None)
		shipping_landmark = postdata.get('shipping_landmark',None)
		shipping_city = postdata.get('shipping_city',None)
		shipping_state = postdata.get('shipping_state',None)
		shipping_country_selection = postdata.get('shipping_country_selection',None)
		shipping_pincode = postdata.get('shipping_pincode',None)

		company_name = postdata.get('company_name',None)
		industry = postdata.get('industry',None)
		designation = postdata.get('designation',None)
		company_phone = postdata.get('company_phone',None)
		company_email = postdata.get('company_email',None)
		company_website = postdata.get('company_website',None)

		customer_type = postdata.get("customer_type",None)
		
		# outletid = int(postdata.get('select_outlet')) if postdata.get('select_outlet') else None
		cust_start_date = postdata.get('start_date',None)
		cust_service_date = postdata.get('service_date',None)
		
		twitter = postdata.get('twitter_link',None)
		fb=postdata.get('facebook_link',None)
		insta=postdata.get('instagram_link',None)
		
		print(cust_birth_date)

		name_of_file =""
		if postdata.get('is_aadhar_file') == '1':
			if request.FILES['aadhar_file']:
				image_file = request.FILES.get('aadhar_file')
				encodedImage = base64.b64encode(image_file.read())
				imageExt = str(image_file).split(".")
				data = base64.b64decode(encodedImage)
				save_path = SERVER_UPLOAD_URL+'customers/aadhar_file/'
				name_of_file = "cust_aadhar_" + str(custCode)+ "_" + str(imageExt[0]) + "." + str(imageExt[1])
				completeImageName = os.path.join(save_path, name_of_file)
				file1 = open(completeImageName, "wb")
				file1.write(data)
				file1.close()
				# print("adhar pres",imageExt)
				# return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
		
		name_of_file_pan = ""
		if postdata.get('is_pan_file') == '1':
			if request.FILES['pan_file']:
				image_file_pan = request.FILES.get('pan_file')
				encodedImage2 = base64.b64encode(image_file_pan.read())
				imageExt2 = str(image_file_pan).split(".")
				data2 = base64.b64decode(encodedImage2)
				save_path2 = SERVER_UPLOAD_URL+'customers/pancard_file/'
				name_of_file_pan = "cust_pan_"+ str(custCode)+"_"+str(imageExt2[0])+"."+str(imageExt2[1])
				completeImageName2 = os.path.join(save_path2,name_of_file_pan)
				file2 = open(completeImageName2,"wb")
				file2.write(data2)
				file2.close()

		name_of_user_profile = ""
		if postdata.get('is_user_profile') == '1':
			if request.FILES['user_profile_img']:
				image_user_profile = request.FILES.get('user_profile_img')
				encodedImage3 = base64.b64encode(image_user_profile.read())
				imageExt3 = str(image_user_profile).split(".")
				data3 = base64.b64decode(encodedImage3)
				save_path3 = SERVER_UPLOAD_URL+'customers/user_profile_img/'
				name_of_user_profile = "user_profile_img_"+ str(custCode)+"_"+str(imageExt3[0])+"."+str(imageExt3[1])
				completeImageName3 = os.path.join(save_path3,name_of_user_profile)
				file3 = open(completeImageName3,"wb")
				file3.write(data3)
				file3.close()
	   

		if cust_birth_date and cust_birth_date != "":
			cust_birth_date = datetime.strptime(cust_birth_date, '%d-%m-%Y')
			cust_birth_date = cust_birth_date.strftime('%Y-%m-%d %H:%M:%S')
		else:
			cust_birth_date = None

		print(marr_anniv)
		print(type(marr_anniv))
		#if marr_anniv != "None" and marr_anniv != "":
		#    print('oooooooooo')
		#    marr_anniv = datetime.strptime(marr_anniv, '%d-%m-%Y')
		#    marr_anniv = marr_anniv.strftime('%Y-%m-%d %H:%M:%S')
		#else:
		#    print('kkkkkkkkkkkkkkkkkk')
		#    marr_anniv = None                

		print(" ---------------------------------------------------------- Is is coming till here?????????????????????",marr_anniv)
		print(" ---------------------------------------------------------- ayaaaaa kyaaa????????????????????", cust_birth_date)
		if press_btn == 'SAVE' :
			'''save customer'''
			customer_details_obj = customer_details.objects.get(id=custCode)
			
			
			print(customer_details_obj.email)
			customer_details_obj.entry_point = 'INDV'
			customer_details_obj.created_by_id = request.user.id
			customer_details_obj.last_modified_by_id = request.user.id #01-10-2019
			if outletid:
				customer_details_obj.outlet_id = outletid
			# Added for jmd only
			
			customer_details_obj.title = title 
			customer_details_obj.customer_name = postdata.get('fname') + " " +postdata.get('lname')
			customer_details_obj.phone_no = mobno
			customer_details_obj.phone_no2 = mobno2
			customer_details_obj.email = cust_email
			customer_details_obj.landline1 = landline1
			customer_details_obj.landline2 = landline2



			customer_details_obj.city = cust_city
			customer_details_obj.country = cust_country
			customer_details_obj.landmark = landmark
			customer_details_obj.pincode = cust_pincode
			customer_details_obj.state = state
			customer_details_obj.area_building = area_building
			customer_details_obj.address_line1 = address1
			customer_details_obj.address_line2 = address2

			customer_details_obj.cust_dob = cust_birth_date
			customer_details_obj.gender = gender 
			customer_details_obj.marital_status = marital_status
			customer_details_obj.marriage_anniversery = marr_anniv
			customer_details_obj.children = children 
			customer_details_obj.NO_Of_Children = NO_Of_Children
			customer_details_obj.occupation = occupation
			customer_details_obj.social_fb = fb
			customer_details_obj.social_insta = insta
			customer_details_obj.social_twitter = twitter


			##shipping##
			customer_details_obj.shipping_address1 =shipping_address
			customer_details_obj.shipping_address2= shipping_street
			customer_details_obj.shipping_area_building = shipping_area_building
			customer_details_obj.shipping_landmark= shipping_landmark
			customer_details_obj.shipping_city = shipping_city
			customer_details_obj.shipping_state = shipping_state
			customer_details_obj.shipping_pincode = shipping_pincode
			customer_details_obj.shipping_country = shipping_country_selection 
			## shipping
   
			customer_details_obj.pancard = pancard
			customer_details_obj.Adharcard = Adharcard
		

		
		
			customer_details_obj.company_name = company_name
			customer_details_obj.industry = industry
			customer_details_obj.designation = designation
			customer_details_obj.company_phone = company_phone
			customer_details_obj.company_email = company_email
			customer_details_obj.company_website = company_website
			customer_details_obj.customer_type = customer_type

			customer_details_obj.company_fb = postdata.get('company_facebook_link',None)
			customer_details_obj.company_twitter = postdata.get('company_twitter_link',None)
			customer_details_obj.company_insta = postdata.get('company_instagram_link',None)
			customer_details_obj.company_gst  = postdata.get('company_gst',None)
			


			customer_details_obj.clients_account_id = postdata.get('select_comp_id',None)

			
			#customer_details_obj.customer_name = postdata.get('edit_name')
			customer_details_obj.email = postdata.get('edit_email')
			
			customer_details_obj.user_password = postdata.get('edit_password')
			try:
				customers_grouped_obj = get_object_or_404(customers_grouped,customer_id=custCode)
			except:
				customers_grouped_obj = None
			try:
				out_id_obj = get_object_or_404(outlet_details, id=outletid)
			except:
				out_id_obj = None
			if customers_grouped_obj:
				customers_grouped_obj.outlet_id = out_id_obj
				if postdata.get('dropdown') == 'regular':
					customers_grouped_obj.is_regular = "1"
					customers_grouped_obj.is_privileged = "0"
				elif postdata.get('dropdown') == 'privi_group':
					customers_grouped_obj.is_privileged = "1"
					customers_grouped_obj.is_regular = "0"
				else:
					pass
				customers_grouped_obj.customer_id = custCode
				customers_grouped_obj.save()

				
				
			if len(name_of_file) > 0:
				customer_details_obj.aadhar_pdf_file = "customers/aadhar_file/" + str(name_of_file)
			
			if len(name_of_file_pan) > 0:
				customer_details_obj.pan_pdf_file = "customers/pancard_file/" + str(name_of_file_pan)

			if len(name_of_user_profile) > 0:
				customer_details_obj.user_profile_img = "customers/user_profile_img/" + str(name_of_user_profile)
			
			if press_btn == "Remove User Image":
				customer_details_obj.user_profile_img = None
			
			
			customer_details_obj.social_fb = postdata.get("facebook_link")
			customer_details_obj.social_insta = postdata.get("instagram_link")
			customer_details_obj.social_twitter = postdata.get("twitter_link")

			customer_details_obj.save()
			response = response_json(request, 'success', '200', '', 'Customer Edited successfully', '')
			return JsonResponse(response)





	##################################VehicleOBJect#####################################

	#######################Add to  group#################################################
	
	
	outlet_id=request.session.get('outlet_id')
	vehicleOBJECT=jmdCustomerVehicle.objects.filter(outlet_id=outlet_id,customer_id=custCode)
	customer_obj=customer_details.objects.get(id=custCode)
	

					   
	return render(request,template_name,locals())

# @login_required(login_url='/merchant-login/')
# @permission_required(['customers.add_customer_details','customers.change_customer_details','customers.delete_customer_details'],raise_exception=True)
# def get_view_customer(request, custCode='0', template_name='merchant_site/customers/view_customer.html'):
#     cursor = connection.cursor()
#     active_page_name = "get_view_customer"
#     edit = True

#     if request.session.get('is_logged_in_superuser') == False:
#         outlet_list = outlet_details.objects.filter(id__in=request.session.get('allowed_outlets_list'),company_id = request.session.get('company_id'),is_active=1,is_verified = 1)
#     elif request.session.get('is_logged_in_superuser') == True:
#         outlet_list = outlet_details.objects.filter(company_id = request.session.get('company_id'),is_active=1,is_verified = 1)
	

#     outletid = None
#     if request.session.get('outlet_id') and outletid == None:
#         outletid = int(request.session.get('outlet_id'))    

#     try:
#         outletObj = get_object_or_404(outlet_details, id = outletid)
#     except:
#         outletObj = None    

#     custfirstname = ""
#     custlastname = ""
#     if custCode != 0 or custCode != None:
#         try:
#             customer_details_obj = get_object_or_404(customer_details, id=custCode)
#             outletid = int(customer_details_obj.outlet_id)
#             customer_id = customer_details_obj.id
#             customer_user_id=customer_details_obj.user_id
#             if customer_details_obj.customer_name:
#                 custname = str(customer_details_obj.customer_name).split()
#                 if len(custname) > 1:
#                     custfirstname = custname[0]
#                     custlastname = custname[1]
#                 else:
#                     custfirstname = custname[0]
#         except:
#             customer_details_obj = None
#     else:
#         customer_details_obj = None 

#     todays_date=datetime.now()    
#     cursor = connection.cursor()
#     cursor.execute('''select ooi.offer_name,mo.expired_at,mo.created_at,ok.order_amount,mo.is_redeem,ooi.seller_ref_code from `xl925_my_offers` as mo INNER JOIN `xl925_offer_kits` as ok ON mo.kit_id = ok.id 
#              INNER JOIN `xl925_outlet_offer_info` as ooi ON mo.offer_id = ooi.id
#             where ok.customer_user_id = {0} and ooi.outlet_id = {1} GROUP by ok.id'''.format(customer_user_id,outletid))
#     customer_details_objs = dictfetchall(cursor)    

#     if customer_id:
#         user_obj = customer_details.objects.filter(id=customer_id).first()
#         user_id = user_obj.user_id            

#     if customer_details_obj:
		
#         # vehicleObj = jmdCustomerVehicle.objects.filter(user_id=user_id)        
#         cursor.execute('''SELECT * FROM xl925_jmd_customers_vehicle
#                           where user_id = '{0}' GROUP by vehicle_number'''.format(user_id))
#         vehicleObj = dictfetchall(cursor)

#         if len(vehicleObj) > 0:
			
#             cursor = connection.cursor()
#             # for vehicle details            
#             # cursor.execute('''select jcv.id,cd.customer_id,jcv.vehicle_number,jcv.registration_number,jcv.car_name,jcv.variant,jcv.brand,jcv.car_model,jcv.service_schedule
#             #                  from xl925_jmd_customers_vehicle as jcv INNER JOIN xl925_customer_details as cd 
#             #                 on cd.id = jcv.customer_id where jcv.outlet_id = {0} and cd.id = {1} '''.format(outletid,customer_id))
#             # jmd_order_obj = dictfetchall(cursor)
#             # print(jmd_order_obj)

#             # for servicing details
#             cursor.execute('''select jcv.vehicle_number,jcsd.service_invoice_date,jcsd.service_expiry_date,jcsd.id,jcsd.repair_type,jcsd.service_location,jcsd.service_advisor,jcsd.service_invoice_amount,jcsd.job_card_date ,jcsd.service_expiry_date
#                             from xl925_jmd_cust_servicing_details as jcsd INNER JOIN xl925_jmd_customers_vehicle as jcv 
#                             on jcv.id = jcsd.vehicle_id where jcv.user_id = {0} '''.format(user_id))
#             jmd_servicing_obj = dictfetchall(cursor)

#             # for servicing details
#             cursor.execute('''select jcv.vehicle_number,jcid.id,jcid.policy_number,jcid.policy_expiry_date,jcid.executive_name,jcid.amount
#                             from xl925_jmd_cust_insurance_details as jcid 
#                             INNER JOIN xl925_jmd_customers_vehicle as jcv 
#                             on jcv.id = jcid.vehicle_id where jcv.user_id = {0} '''.format(user_id))            
#             jmd_insurance_obj = dictfetchall(cursor)
					   
#     return render(request,template_name,locals())

@login_required(login_url='/merchant-login/')
@permission_required(['customers.add_customer_details','customers.change_customer_details','customers.delete_customer_details'],raise_exception=True)
def customer_send_reminder(request, custCode='0', template_name='merchant_site/customers/cust_send_reminder.html'):
	active_page_name = "cust_send_reminder"

	if request.session.get('is_logged_in_superuser') == False:
		outlet_list = outlet_details.objects.filter(id__in=request.session.get('allowed_outlets_list'),company_id = request.session.get('company_id'),is_active=1,is_verified = 1)
	elif request.session.get('is_logged_in_superuser') == True:
		outlet_list = outlet_details.objects.filter(company_id = request.session.get('company_id'),is_active=1,is_verified = 1)
	
	template_list = JmdEmailTemplate.objects.filter(active=True,reminder=True)
	if template_list:
		template_subject = template_list[0].subject


	outletid = None
	if request.session.get('outlet_id') and outletid == None:
		outletid = int(request.session.get('outlet_id'))    

	try:
		outletObj = get_object_or_404(outlet_details, id = outletid)
	except:
		outletObj = None

	if custCode != 0 or custCode != None:
		try:
			customer_details_obj = get_object_or_404(customer_details, id=custCode)
			outletid = int(customer_details_obj.outlet_id)
		except:
			customer_details_obj = None
	else:
		customer_details_obj = None

	if custCode != 0 or custCode != None:
		vehicle_list = jmdCustomerVehicle.objects.filter(customer_id=custCode)            

	if request.method == 'POST':    
		postdata = request.POST.copy()
		
		if postdata.get('customer_id'):
			template_id = postdata.get('select_template',None)
			email_subject = postdata.get('email_subject',None) 
			vehicle_id = postdata.get('selected_vehicle',None) 
			try:
				template_obj = get_object_or_404(JmdEmailTemplate, id=postdata.get('select_template'))
			except:
				template_obj = None                          

			cursor = connection.cursor()
			if request.session.get('is_jmd_insurance'):
				jmd_insurance_obj = None  
				cursor.execute(''' select * from xl925_jmd_cust_insurance_details 
								   where vehicle_id={} order by policy_expiry_date DESC limit 1'''.format(vehicle_id))
				jmd_insurance_obj = dictfetchall(cursor)
				if len(jmd_insurance_obj) > 0:
					jmd_insurance_obj = jmd_insurance_obj[0]            
			elif request.session.get('is_jmd_servicing'):    
				jmd_servicing_obj = None  
				cursor.execute(''' select * from xl925_jmd_cust_servicing_details
								   where vehicle_id={} order by service_expiry_date DESC limit 1'''.format(vehicle_id))
				jmd_servicing_obj = dictfetchall(cursor)
				if len(jmd_servicing_obj) > 0:
					jmd_servicing_obj = jmd_servicing_obj[0]
			

		if postdata.get('press_btn') == "email":
			broadcastObj = BroadcastClass()
			
			if request.session.get('is_jmd_insurance'):
				respObj = broadcastObj.sendJmdReminderEmailInsurance(request, outletid, jmd_insurance_obj,template_obj,email_subject,template_id,customer_details_obj)
			elif request.session.get('is_jmd_servicing'):
				respObj = broadcastObj.sendJmdReminderEmailServicing(request, outletid, jmd_servicing_obj,template_obj,email_subject,template_id,customer_details_obj)           
			if respObj['status'] == "success":
				messages.add_message(request, messages.SUCCESS, respObj['message'], fail_silently=True)
				return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
			else:
				messages.add_message(request, messages.ERROR, respObj['message'],fail_silently=True)
				return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
		
	return render(request,template_name,locals())

@login_required(login_url='/merchant-login/')
@permission_required(['customers.add_customer_details','customers.change_customer_details','customers.delete_customer_details'],raise_exception=True)
def customer_send_notifications(request, custCode='0', template_name='merchant_site/customers/cust_send_notification.html'):
	# active_page_name = "cust_send_reminder"

	if request.session.get('is_logged_in_superuser') == False:
		outlet_list = outlet_details.objects.filter(id__in=request.session.get('allowed_outlets_list'),company_id = request.session.get('company_id'),is_active=1,is_verified = 1)
	elif request.session.get('is_logged_in_superuser') == True:
		outlet_list = outlet_details.objects.filter(company_id = request.session.get('company_id'),is_active=1,is_verified = 1)
	
	template_list = JmdEmailTemplate.objects.filter(active=True,notification=True)
	if template_list:
		template_subject = template_list[0].subject


	outletid = None
	if request.session.get('outlet_id') and outletid == None:
		outletid = int(request.session.get('outlet_id'))    

	try:
		outletObj = get_object_or_404(outlet_details, id = outletid)
	except:
		outletObj = None

	if custCode != 0 or custCode != None:
		try:
			customer_details_obj = get_object_or_404(customer_details, id=custCode)
			outletid = int(customer_details_obj.outlet_id)
		except:
			customer_details_obj = None
	else:
		customer_details_obj = None

	if custCode != 0 or custCode != None:
		vehicle_list = jmdCustomerVehicle.objects.filter(customer_id=custCode)                


	if request.method == 'POST':    
		postdata = request.POST.copy()
		if postdata.get('customer_id'):
			template_id = postdata.get('select_template',None)
			email_subject = postdata.get('email_subject')  
			vehicle_id = postdata.get('selected_vehicle',None)          
			
			try:
				template_obj = get_object_or_404(JmdEmailTemplate, id=postdata.get('select_template'))
			except:
				template_obj = None

			jmd_servicing_obj = None    
			jmd_insurance_obj = None
			cursor = connection.cursor()
			if request.session.get('is_jmd_insurance'):
				cursor.execute(''' select * from xl925_jmd_cust_insurance_details 
									where vehicle_id={} order by policy_expiry_date limit 1'''.format(vehicle_id))
				jmd_insurance_obj = dictfetchall(cursor)
				if len(jmd_insurance_obj) != 0: 
					jmd_insurance_obj = jmd_insurance_obj[0]
			
			if request.session.get('is_jmd_servicing'):
				cursor.execute(''' select * from xl925_jmd_cust_servicing_details
								   where vehicle_id={} order by service_expiry_date limit 1'''.format(vehicle_id))            
				jmd_servicing_obj = dictfetchall(cursor)
				if len(jmd_servicing_obj) != 0 :
					jmd_servicing_obj = jmd_servicing_obj[0]


		if postdata.get('press_btn') == "email":
			broadcastObj = BroadcastClass()
			if request.session.get('is_jmd_insurance'):
				respObj = broadcastObj.sendJmdNotificationEmailInsurance(request, outletid, jmd_insurance_obj,template_obj,email_subject,template_id,customer_details_obj)
			elif request.session.get('is_jmd_servicing'):
				respObj = broadcastObj.sendJmdNotificationEmailServicing(request, outletid, jmd_servicing_obj,template_obj,email_subject,template_id,customer_details_obj)                
			
			if respObj['status'] == "success":
				messages.add_message(request, messages.SUCCESS, respObj['message'], fail_silently=True)
				return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
			else:
				messages.add_message(request, messages.ERROR, respObj['message'],fail_silently=True)
				return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
		
	return render(request,template_name,locals())        

@login_required(login_url='/merchant-login/')
@permission_required(['customers.add_customer_details','customers.change_customer_details','customers.delete_customer_details'],raise_exception=True)
def customer_send_offer(request, custCode='0', template_name='merchant_site/customers/cust_send_offer.html', customerid='0'):
	active_page_name = "cust_send_offer"

	if request.session.get('is_logged_in_superuser') == False:
		outlet_list = outlet_details.objects.filter(id__in=request.session.get('allowed_outlets_list'),company_id = request.session.get('company_id'),is_active=1,is_verified = 1)
	elif request.session.get('is_logged_in_superuser') == True:
		outlet_list = outlet_details.objects.filter(company_id = request.session.get('company_id'),is_active=1,is_verified = 1)
	

	outletid = None
	if request.session.get('outlet_id') and outletid == None:
		outletid = int(request.session.get('outlet_id')) 

	jmdOffersObj = getOutletOffers(request)

	try:
		outletObj = get_object_or_404(outlet_details, id = outletid)
	except:
		outletObj = None


	offerObj = OutletOfferInfo.objects.filter(outlet_id = outletid)

	if custCode != 0 or custCode != None:
		try:
			customer_details_obj = get_object_or_404(customer_details, id=custCode)
			outletid = int(customer_details_obj.outlet_id)
		except:
			customer_details_obj = None
	else:
		customer_details_obj = None

	cust_email = customer_details_obj.email

	if request.method == 'POST':
		postdata = request.POST.copy();
		press_btn = postdata.get('press_btn', None)
		try:
			selectedOfferObj = get_object_or_404(OutletOfferInfo, id = postdata.get('select_outlet_offer'))
		except:
			selectedOfferObj = None

		callouts_obj = ast.literal_eval(selectedOfferObj.callouts)
		offer_img = "http://" + request.META['HTTP_HOST'] + "/static/" + str(selectedOfferObj.offer_image)


		if press_btn == 'Send':            
			if outletObj and offerObj :
				if outletObj.is_allow_email == True:
					if customer_details_obj.email:
						offer_sent_track = JmdNotificationReminderDetails()
						offer_sent_track.customer_id = custCode
						offer_sent_track.success_flag = True
						offer_sent_track.outlet_id = outletid
						offer_sent_track.sender_user_id =  request.session.get('root_user_id')
						offer_sent_track.is_offer = True
						offer_sent_track.save()

						email_title = "Look inside for a special gift just for you!"
						message = render_to_string('merchant_site/emails/offer_test_email.html', locals())
						user_email = (email_title, message, cust_email, offer_sent_track.id, outletid, customer_details_obj.user_id)
						r = send_offer_email_user(user_email, outletObj)
												
						messages.add_message(request, messages.SUCCESS, 'Your offer has been sent successfully',fail_silently=True)
					else:
						messages.add_message(request, messages.ERROR, 'Email of customer not found',fail_silently=True)    
				else:
					messages.add_message(request, messages.ERROR, 'Permission Denied',fail_silently=True)    

	return render(request,template_name,locals())  

def jmd_customer_details_insurance(request,display_days=30,template_name="merchant_site/customers/jmd_customer_servicing_details.html"):

	outlet_id = request.session.get('outlet_id')
	todays_date = datetime.now().date()
	if display_days != "all":
		selected_days = int(display_days)
		delivery_date = datetime.now().date() + datetime.timedelta(days=selected_days)
		cursor = connection.cursor()        
		cursor.execute('''select * from xl925_jmd_cust_insurance_details as ji 
								INNER JOIN xl925_customer_details as cd on cd.id = ji.customer_id
								INNER JOIN xl925_jmd_customers_vehicle as jcv on jcv.id = ji.vehicle_id
								where date(ji.policy_expiry_date) <= '{0}'
								and date(ji.policy_expiry_date) >= '{1}' and ji.outlet_id = {2}  order by policy_expiry_date '''.format(delivery_date,todays_date,outlet_id))
	else:
		selected_days = display_days        
		cursor = connection.cursor()                
		cursor.execute('''select * from xl925_jmd_cust_insurance_details as ji 
								INNER JOIN xl925_customer_details as cd on cd.id = ji.customer_id
								INNER JOIN xl925_jmd_customers_vehicle as jcv on jcv.id = ji.vehicle_id
								where date(ji.policy_expiry_date) >= '{0}' and ji.outlet_id = {1}
								order by policy_expiry_date '''.format(todays_date,outlet_id))
	jmd_order_obj = dictfetchall(cursor)     

	if request.method == 'POST':
		postdata = request.POST.copy()
		press_btn = postdata.get('press_btn', None)
		
		if press_btn == 'SEARCH':            
			search_value = postdata.get('search_val') 
			if postdata.get("display_days") == "all":
				selected_days = "all"
			else:
				selected_days = int(postdata.get("display_days",'30'))     
			
			customer_name = "cd.customer_name LIKE '%"+search_value+"%'"
			carname_search = "jcv.car_name LIKE '%"+search_value+"%'"
			vehicle_num = "jcv.vehicle_number LIKE '%"+search_value+"%'"
			next_service_date = " DATE_FORMAT(ji.policy_expiry_date, '%d-%m-%Y')  LIKE '%"+search_value+"%'"

			if selected_days == "all":                                            
				cursor.execute('''select * from xl925_jmd_cust_insurance_details as ji 
									INNER JOIN xl925_customer_details as cd on cd.id = ji.customer_id
									INNER JOIN xl925_jmd_customers_vehicle as jcv on jcv.id = ji.vehicle_id
									where date(ji.policy_expiry_date) >= '{4}' and ji.outlet_id = {5} and ({0} or {1} or {2} or {3}) order by ji.policy_expiry_date  '''.format(customer_name,carname_search,vehicle_num,next_service_date,todays_date,outlet_id))                
			else:      
				delivery_date = datetime.now().date() + datetime.timedelta(days=selected_days)                                  
				cursor.execute('''select * from xl925_jmd_cust_insurance_details as ji 
									INNER JOIN xl925_customer_details as cd on cd.id = ji.customer_id
									INNER JOIN xl925_jmd_customers_vehicle as jcv on jcv.id = ji.vehicle_id
									where date(ji.policy_expiry_date) >= '{4}' and ji.outlet_id = {6} and date(ji.policy_expiry_date) <= '{5}' and ({0} or {1} or {2} or {3}) order by ji.policy_expiry_date  '''.format(customer_name,carname_search,vehicle_num,next_service_date,todays_date,delivery_date,outlet_id))
			
			jmd_order_obj = dictfetchall(cursor)             
		elif press_btn == 'DAYS':
			if postdata.get("display_days") == "all":
				selected_days = "all"                
				cursor = connection.cursor()    
				cursor.execute('''select * from xl925_jmd_cust_insurance_details as ji 
									INNER JOIN xl925_customer_details as cd on cd.id = ji.customer_id
									INNER JOIN xl925_jmd_customers_vehicle as jcv on jcv.id = ji.vehicle_id
									where date(ji.policy_expiry_date) >= '{0}' and ji.outlet_id = {1}
									order by policy_expiry_date '''.format(todays_date,outlet_id))
				jmd_order_obj = dictfetchall(cursor)
			else:    
				# if selected days not found then default date will be 30
				selected_days = int(postdata.get("display_days",'30')) 
				delivery_date = datetime.now().date() + datetime.timedelta(days=selected_days)
				cursor = connection.cursor()    
				cursor.execute('''select * from xl925_jmd_cust_insurance_details as ji 
									INNER JOIN xl925_customer_details as cd on cd.id = ji.customer_id
									INNER JOIN xl925_jmd_customers_vehicle as jcv on jcv.id = ji.vehicle_id
									where date(ji.policy_expiry_date) <= '{0}' and date(ji.policy_expiry_date) >= '{1}' and ji.outlet_id = {2} order by policy_expiry_date '''.format(delivery_date,todays_date,outlet_id))
				jmd_order_obj = dictfetchall(cursor)    
	
	return render(request,template_name,locals())

def jmd_customer_details_servicing(request,display_days=30,template_name="merchant_site/customers/jmd_customer_servicing_details.html"):

	outlet_id = request.session.get('outlet_id')
	todays_date = datetime.now().date()
	if display_days != "all":
		selected_days = int(display_days)
		delivery_date = datetime.now().date() + timedelta(days=selected_days)
		cursor = connection.cursor()        
		cursor.execute('''select * from xl925_jmd_cust_servicing_details as jsd
						INNER JOIN xl925_customer_details as cd on cd.id = jsd.customer_id
						INNER JOIN xl925_jmd_customers_vehicle as jcv on jcv.id = jsd.vehicle_id
						where date(jsd.service_expiry_date) <= '{0}'
						and date(jsd.service_expiry_date) >= '{1}' and jsd.outlet_id = {2} 
						order by service_expiry_date '''.format(delivery_date,todays_date,outlet_id))
	else:
		selected_days = display_days        
		cursor = connection.cursor()                
		cursor.execute('''select * from xl925_jmd_cust_servicing_details as jsd 
						INNER JOIN xl925_customer_details as cd on cd.id = jsd.customer_id
						INNER JOIN xl925_jmd_customers_vehicle as jcv on jcv.id = jsd.vehicle_id
						where date(jsd.service_expiry_date) >= '{0}' and jsd.outlet_id = {1}
						order by service_expiry_date '''
						.format(todays_date,outlet_id))
	jmd_order_obj = dictfetchall(cursor)     

	if request.method == 'POST':
		postdata = request.POST.copy()
		press_btn = postdata.get('press_btn', None)
		
		if press_btn == 'SEARCH':            
			search_value = postdata.get('search_val') 
			if postdata.get("display_days") == "all":
				selected_days = "all"
			else:
				selected_days = int(postdata.get("display_days",'30'))     
			
			customer_name = "cd.customer_name LIKE '%"+search_value+"%'"
			carname_search = "jcv.car_name LIKE '%"+search_value+"%'"
			vehicle_num = "jcv.vehicle_number LIKE '%"+search_value+"%'"
			next_service_date = " DATE_FORMAT(jsd.service_expiry_date, '%d-%m-%Y')  LIKE '%"+search_value+"%'"

			if selected_days == "all":                                            
				cursor.execute('''select * from xl925_jmd_cust_servicing_details as jsd 
								INNER JOIN xl925_customer_details as cd on cd.id = jsd.customer_id
								INNER JOIN xl925_jmd_customers_vehicle as jcv on jcv.id = jsd.vehicle_id
								where date(jsd.service_expiry_date) >= '{4}' and jsd.outlet_id = {5} and
								({0} or {1} or {2} or {3}) order by jsd.service_expiry_date  
								'''.format(customer_name,carname_search,vehicle_num,next_service_date,todays_date,outlet_id))                
			else:      
				delivery_date = datetime.now().date() + datetime.timedelta(days=selected_days)                                  
				cursor.execute('''select * from xl925_jmd_cust_servicing_details as jsd 
								INNER JOIN xl925_customer_details as cd on cd.id = jsd.customer_id
								INNER JOIN xl925_jmd_customers_vehicle as jcv on jcv.id = jsd.vehicle_id
								where date(jsd.service_expiry_date) >= '{4}' and jsd.outlet_id = {6} 
								and date(jsd.service_expiry_date) <= '{5}' and ({0} or {1} or {2} or {3})
								order by jsd.service_expiry_date  '''
								.format(customer_name,carname_search,vehicle_num,next_service_date,todays_date,delivery_date,outlet_id))            
			jmd_order_obj = dictfetchall(cursor)             
		elif press_btn == 'DAYS':
			if postdata.get("display_days") == "all":
				selected_days = "all"                
				cursor = connection.cursor()    
				cursor.execute('''select * from xl925_jmd_cust_servicing_details as jsd 
								INNER JOIN xl925_customer_details as cd on cd.id = jsd.customer_id
								INNER JOIN xl925_jmd_customers_vehicle as jcv on jcv.id = jsd.vehicle_id
								where date(jsd.service_expiry_date) >= '{0}' and jsd.outlet_id = {1}
								order by service_expiry_date '''.format(todays_date,outlet_id))
				jmd_order_obj = dictfetchall(cursor)
			else:    
				# if selected days not found then default date will be 30
				selected_days = int(postdata.get("display_days",'30')) 
				delivery_date = datetime.now().date() + datetime.timedelta(days=selected_days)
				cursor = connection.cursor()    
				cursor.execute('''select * from xl925_jmd_cust_servicing_details as jsd 
								INNER JOIN xl925_customer_details as cd on cd.id = jsd.customer_id
								INNER JOIN xl925_jmd_customers_vehicle as jcv on jcv.id = jsd.vehicle_id
								where date(jsd.service_expiry_date) <= '{0}' and date(jsd.service_expiry_date) >= '{1}' and jsd.outlet_id = {2} order by service_expiry_date '''.format(delivery_date,todays_date,outlet_id))
				jmd_order_obj = dictfetchall(cursor)

	return render(request,template_name,locals())

def jmd_finance_customers_list(request, template_name='merchant_site/customers/jmd_finance_customer_list.html'):
	active_page_name = "finance_customer_page"
	pagename_string = request.GET.get('pagename')
	page_number = int(request.GET.get('page') if request.GET.get('page') else 1)

	

	if request.session.get('is_logged_in_superuser') == False:
		outlet_list = outlet_details.objects.filter(id__in=request.session.get('allowed_outlets_list'),company_id = request.session.get('company_id'),is_active=1,is_verified = 1)
	elif request.session.get('is_logged_in_superuser') == True:
		outlet_list = outlet_details.objects.filter(company_id = request.session.get('company_id'),is_active=1,is_verified = 1)
	
	cursor = connection.cursor()

	offersObj = getOutletOffers(request)

	outletid = None
	if request.session.get('outlet_id') and outletid == None:
		outletid = int(request.session.get('outlet_id'))    
	

	if outletid:
		try:
			outletObj = get_object_or_404(outlet_details, id = outletid)
		except:
			outletObj = None

		customers_list = customer_details.objects.filter(outlet_id=outletid).order_by('customer_name')
		FinanceObj = CustomerClass()

		if outletObj.is_jmd == True:
			template_name='merchant_site/customers/JMD_get_finance_customer_list.html'
			try:
				for_user_id = request.session.get('user_obj')
			except:
				for_user_id = None
			finance_obj = FinanceObj.getJMDAllCustomers(outletObj.id,for_user_id)   
		elif outletObj.is_outlet_vehicle:
			finance_obj = FinanceObj.get_outlet_vehicle_customers(outletObj.id) 

	else:
		finance_obj = None

	if finance_obj:
		temp = []
		for i in finance_obj:
			temp.append(i)
		
		reportObj = None
		if len(temp) > 0:
			paginator = Paginator(temp, 25)  # Show 25 contacts per page
			page = request.GET.get('page')
			try:
				reportObj = paginator.page(page)
			except PageNotAnInteger:
				# If page is not an integer, deliver first page.
				reportObj = paginator.page(1)
			except EmptyPage:
				# If page is out of range (e.g. 9999), deliver last page of results.
				reportObj = paginator.page(paginator.num_pages)   

	if request.method == 'POST':
		postdata = request.POST.copy()

		press_btn = postdata.get("press_btn", None)
		customerid = postdata.get("customer_id", None)
		offerid = postdata.get("offer_id", None)
		delete=postdata.getlist("deletefield")
		

		deletefield=delete
		print(postdata)
		print('kaklsjdklasjdlk')
		print(deletefield)
		print('djjksahdsadhlk')

		# if deletefield:
		#     print("in delete formmmmmmmmmmmm")
		#     try:
		#         sub_xircle_infoobj = get_object_or_404(finance_details, name=userid)
		#     except:
		#         sub_xircle_infoobj = None
		#     print('hdjfhasjdhsahds')
		#     print(sub_xircle_infoobj)
		#     sub_xircle_infoobj.is_trash=1
		#     sub_xircle_infoobj.is_active=0
		#     sub_xircle_infoobj.save()
		#     messages.add_message(request, messages.SUCCESS, 'successfully deleted',fail_silently=True)
		#     url = reverse('make_your_circle:my_circle')
		#     return HttpResponseRedirect(url)
		
		if press_btn == "SEND_NOTIFICATION":
			broadcastObj = BroadcastClass()
			respObj = broadcastObj.sendNotificationEmail(request, outletid, customerid, offerid)
			if respObj['status'] == "success":
				messages.add_message(request, messages.SUCCESS, respObj['message'], fail_silently=True)
				return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
			else:
				messages.add_message(request, messages.ERROR, respObj['message'],fail_silently=True)
				return HttpResponseRedirect(request.META.get('HTTP_REFERER'))

		if press_btn == "SEND_SMS":
			broadcastObj = BroadcastClass()
			respObj = broadcastObj.sendNotificationSMS(request, outletid, customerid, offerid)
			if respObj['status'] == "success":
				messages.add_message(request, messages.SUCCESS, respObj['message'], fail_silently=True)
				return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
			else:
				messages.add_message(request, messages.ERROR, respObj['message'],fail_silently=True)
				return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
		elif press_btn == 'SEARCH':

			search_txt = postdata.get('customer_search', None)
			if search_txt:                                
				cursor.execute(''' SELECT cd.id as cust_id, cd.phone_no, cd.customer_name, cd.entry_point, cd.email, cd.outlet_id
							FROM `xl925_customer_details` as cd
							WHERE cd.outlet_id = {0} AND (cd.phone_no LIKE '%{1}%' OR cd.customer_name LIKE '%{1}%' OR cd.email LIKE '%{1}%') '''.format(
							outletid, search_txt))                
				finance_obj = dictfetchall(cursor)

	# if postdata.get('deletefield') == 'Delete':
	#     print("in delete formmmmmmmmmmmm")
	#     sub_xircle_infoobj = get_object_or_404(subXirclsInfo, name=del_circl_name)
	#     sub_xircle_infoobj.is_trash=1
	#     sub_xircle_infoobj.is_active=0
	#     sub_xircle_infoobj.save()
	#     messages.add_message(request, messages.SUCCESS, 'successfully deleted',fail_silently=True)
	#     url = reverse('make_your_circle:my_circle')
	#     return HttpResponseRedirect(url)
							 
	if not finance_obj:
		finance_obj = None                        

	if finance_obj:            
		paginator = Paginator(finance_obj, 100) # Show 100 contacts per page
		page = request.GET.get('page')
		try:
			finance_obj = paginator.page(page)
		except PageNotAnInteger:
			# If page is not an integer, deliver first page.
			finance_obj = paginator.page(1)
		except EmptyPage:
			# If page is out of range (e.g. 9999), deliver last page of results.
			finance_obj = paginator.page(paginator.num_pages)       
								
	return render(request,template_name,locals())

@login_required(login_url='/merchant-login/')
@redirectMerchantAsPerProgress("MY_CUSTOMERS")
def jmd_finance(request, custCode=0,template_name='merchant_site/customers/jmd_finace.html'):
	active_page_name = "my_finance_page"
	if request.session.get('is_logged_in_superuser') == False:
		outlet_list = outlet_details.objects.filter(id__in=request.session.get('allowed_outlets_list'),company_id = request.session.get('company_id'),is_active=1,is_verified = 1)
	elif request.session.get('is_logged_in_superuser') == True:
		outlet_list = outlet_details.objects.filter(company_id = request.session.get('company_id'),is_active=1,is_verified = 1)
	
	outletid = None
	if request.session.get('outlet_id') and outletid == None:
		outletid = int(request.session.get('outlet_id'))    

	try:
		outletObj = get_object_or_404(outlet_details, id = outletid)
	except:
		outletObj = None  

	# vehicle_details_obj = jmdCustomerVehicle.objects.filter(user_id=43437)
	# vehicle_id1 = []
	# for i in vehicle_details_obj:
	#     print(i.id)
	#     vehicle_id1.append(i.id)
	#     vehicle_id2 = ",".join(str(e) for e in vehicle_id1)
	# a=vehicle_id2[0]
	my_all_customer_details_obj = customer_details.objects.filter(outlet_id=outletid)
	all_products_obj = product_details.objects.filter(outlet_id=outletid)
	from json import dumps
	my_cust_list = []
	for cust in my_all_customer_details_obj:
		new_dataDictionary = { 'cust_id': cust.id,'cust_email': cust.email,  'cust_mobile': cust.phone_no, }
		my_cust_list.append(new_dataDictionary)
	cust_dataJSON = dumps(my_cust_list)
	try:
		customer_details_obj = get_object_or_404(customer_details, id=custCode)
		outletid = int(customer_details_obj.outlet_id)
		customer_id = customer_details_obj.id
		user_id = customer_details_obj.user_id
	except:        
		customer_id = None
		user_id = None
		# vehicle_id = None
	

	if outletid:
		try:
			outletObj = get_object_or_404(outlet_details, id = outletid)
		except:
			outletObj = None

		customers_list = customer_details.objects.filter(outlet_id=outletid).order_by('customer_name')
		FinanceObj = CustomerClass()

		finance_obj = FinanceObj.get_outlet_vehicle_customers(outletObj.id)                    
	else:
		finance_obj = None   

	# print(finance_obj)
	cursor = connection.cursor()
	cursor.execute(''' SELECT jcv.id,cd.customer_name,cd.email,cd.phone_no,jcid.policy_expiry_date,
								jcv.vehicle_number
								from xl925_customer_details as cd 
								LEFT JOIN xl925_jmd_customers_vehicle as jcv ON cd.id = jcv.customer_id
								LEFT JOIN xl925_jmd_cust_insurance_details as jcid ON cd.id = jcid.customer_id   
								WHERE cd.outlet_id= {0}
								
								GROUP BY cd.user_id order by cd.created_at DESC'''.format(outletid))
	customers_listObj = dictfetchall(cursor)
	customer_vehicle_obj = jmdCustomerVehicle()

	noofchildren = []
	for num in range(1,5):
		# print(num)
		noofchildren.append(num)



	# if outletObj.is_jmd == True:
	#     template_name = 'merchant_site/customers/jmd_finace.html'
	
	if request.method == 'POST':
		postdata = request.POST.copy();
		press_btn = postdata.get('press_btn', None)
		bankname = postdata.get('bank_name', None)
		selected_outletid = outletid
		loantype = postdata.get('loan_type',None)
		customer = customer_id
		vehicle_number = postdata.get('vehicle_number',None)
		ROI = postdata.get('ROI',None)
		loannum = postdata.get('loan_num',None)
		banknumber = postdata.get('bank_number',None)
		loanamount =  postdata.get('loan_amount',None)
		loanrate = postdata.get('loan_rate',None)
		tenor = postdata.get('tenor',None)
		# outletid = int(postdata.get('select_outlet')) if postdata.get('select_outlet') else None       
		emiamount = postdata.get('emi_amount',None)
		emistartdate = postdata.get('emi_startdate',None)        
		cust_country = postdata.get('country',None)
		bankhypothecation = postdata.get('bank_hypothecation',None)
		emienddate = postdata.get('emi_enddate',None)
		title = postdata.get('title',None)
		selected_outletid = outletid
		
		cust_first_name = postdata.get('cust_first_name',None)
		cust_last_name = postdata.get('cust_last_name',None)
		cust_email = postdata.get('email',None)
		mobno = postdata.get('mob_no',None)
		mobno2 =  postdata.get('mob_no2',None)
		landline1 = postdata.get('landline1',None)
		landline2 = postdata.get('landline2',None)
		# outletid = int(postdata.get('select_outlet')) if postdata.get('select_outlet') else None       
		cust_start_date = postdata.get('start_date',None)
		cust_service_date = postdata.get('service_date',None)        
		cust_country = postdata.get('country',None)
		cust_bill = postdata.get('order_amt',None)
		cust_city = postdata.get('city',None)
		cust_pincode = postdata.get('pincode',None)
		service_name = postdata.get('service_name',None)
		area_building = postdata.get('area_building',None)
		address1 = postdata.get('address',None)
		address2 = postdata.get('street',None)
		landmark = postdata.get('landmark',None)
		pancard = postdata.get('pancard_name',None)
		Adharcard = postdata.get('Adharcard',None)
		gender = postdata.get('gender',None)
		marital_status = postdata.get('marital_status',None)
		marriage_anniversery = postdata.get('marriage_anniversery',None)
		children = postdata.get('children',None)
		NO_Of_Children = postdata.get('countchildren',None)
		occupation = postdata.get('occupation',None)
		category = postdata.get('category',None)
		sub_category = postdata.get('sub_category',None)
		state = postdata.get('state',None)
		cust_birth_date = postdata.get('birth_date',None)
		print(marriage_anniversery)
		print("MARRIAGEEEEEEEEEEEEEEEEEEe")
		if cust_birth_date and cust_birth_date != "":
			cust_birth_date = datetime.strptime(cust_birth_date, '%d-%m-%Y')
			cust_birth_date = cust_birth_date.strftime('%Y-%m-%d')
		else:
			cust_birth_date = None     

		if marriage_anniversery and marriage_anniversery != "":
			marriage_anniversery = datetime.strptime(marriage_anniversery, '%d-%m-%Y')
			marriage_anniversery = marriage_anniversery.strftime('%Y-%m-%d')
		else:
			cust_birth_date = None 

		if loanrate and loanrate != "":
			loanrate = datetime.strptime(loanrate, '%d-%m-%Y')
			loanrate = loanrate.strftime('%Y-%m-%d')
		else:
			loanrate = None 


		if emistartdate and emistartdate != "":
			emistartdate = datetime.strptime(emistartdate, '%d-%m-%Y')
			emistartdate = emistartdate.strftime('%Y-%m-%d')
		else:
			loanrate = None

		if emienddate and emienddate != "":
			emienddate = datetime.strptime(emienddate, '%d-%m-%Y')
			emienddate = emienddate.strftime('%Y-%m-%d')
		else:
			emienddate = None            

		customer_vehicle_obj = jmdCustomerVehicle()
		if press_btn == 'SAVE' or press_btn == 'SAVE & CLOSE':
			print('saviiiiiiiiingggggggggggggg filllllllllllesssssssssssssssssssss')
			
			finance_obj = finance_details()
			finance_obj.Bank_Name = bankname
			finance_obj.vehicle_number = vehicle_number
			finance_obj.Loan_Number = loannum
			finance_obj.Loan_Type = loantype
			finance_obj.Rate_of_Interest = ROI
			finance_obj.Loan_amount = loanamount
			finance_obj.Bank_Number = banknumber
			finance_obj.Loan_Rate = loanrate
			finance_obj.Tenor = tenor
			finance_obj.Emi_Amount = emiamount
			finance_obj.Emi_Start_Date = emistartdate
			finance_obj.Bank_Hypothecation = bankhypothecation
			finance_obj.Emi_End_Date = emienddate
			finance_obj.title = title 
			finance_obj.phone_no = mobno
			finance_obj.phone_no2 = mobno2
			if cust_first_name or cust_last_name:
				finance_obj.customer_name = cust_first_name + " " +cust_last_name
			finance_obj.email = cust_email
			# finance_obj.entry_point = 'INDV'
			finance_obj.user_id = user_id 
			finance_obj.outlet_id = selected_outletid
			# finance_obj.user_id = userid
			
			finance_obj.landline1 = landline1
			finance_obj.landline2 = landline2

			

			finance_obj.cust_dob = cust_birth_date
			finance_obj.city = cust_city
			finance_obj.country = cust_country
			finance_obj.landmark = landmark
			finance_obj.pincode = cust_pincode
			finance_obj.state = state
			finance_obj.area_building = area_building
			finance_obj.address_line1 = address1
			finance_obj.address_line2 = address2
			finance_obj.pancard = pancard
			finance_obj.Adharcard = Adharcard
			finance_obj.gender = gender 
			finance_obj.marital_status = marital_status
			# if marriage_anniversery:
			finance_obj.marriage_anniversery = marriage_anniversery
			finance_obj.children = children 
			finance_obj.NOOfChildren = NO_Of_Children
			finance_obj.occupation = occupation
			finance_obj.category = category
			finance_obj.sub_category = sub_category
			finance_obj.customer = customer_details_obj
			finance_obj.finance_product_name = postdata.get('finance_product_name',None) 
			finance_obj.frequency = postdata.get('frequency',None) 
			finance_obj.no_of_installment = postdata.get('no_of_installment',None) 
			finance_obj.no_of_tenure = postdata.get('no_of_tenure',None) 
			finance_obj.Loan_Disbursement_Date = postdata.get('disbursement_date',None) 
			# finance_obj.vehicle_number = customers_listObj.vehicle_number
			print('dsajjdfashjkdhs00000000000000000000alkhlsakhlk')
			# print(finance_obj.vehicle_number)
			finance_obj.vehicle_id = postdata.get('vehicle_number',None)
			print(finance_obj.vehicle_id)
			print('dsajjdfashjkdhs00000000000000000000alkhlsakhlk012345')
			finance_obj.save()





			print(finance_obj.vehicle_number)

			print('dsajjdfashjkdhs00000000000000000000alkhlsakhlk')
			print(customer_id)
			customer_id = finance_obj.id
			print(finance_obj.id)
			print('kkkkkkkkkkkkkk')

			messages.add_message(request, messages.SUCCESS, 'Loan was added successfully.', fail_silently=True)
			print(custCode)
			print('samkdkslajkldfhajklfhdlas')
			if press_btn == 'SAVE':
				url = reverse('customers:all_cust_dashboard', kwargs={'slug': 'add_finance'})
				return HttpResponseRedirect(url)
			elif press_btn == 'SAVE & CLOSE':
				url = reverse('customers:all_cust_dashboard', kwargs={'slug': 'add_finance'})
				print(custCode)
				return HttpResponseRedirect(url)
	
	print('post nhi ho rha haiiiiiiiiii')
	return render(request,template_name,locals())    

#end here 30-11-2019
@login_required(login_url='/merchant-login/')
# @permission_required(['customers.add_customer_details','customers.change_customer_details','customers.delete_customer_details'],raise_exception=True)
def edit_finance_details(request, financeId=0, template_name='merchant_site/customers/jmd_edit_finance_customer.html'):
	edit = True
	active_page_name = "edit_finance_page"



	# get session
	if request.session.get('is_logged_in_superuser') == False:
		outlet_list = outlet_details.objects.filter(id__in=request.session.get('allowed_outlets_list'),company_id = request.session.get('company_id'),is_active=1,is_verified = 1)
	elif request.session.get('is_logged_in_superuser') == True:
		outlet_list = outlet_details.objects.filter(company_id = request.session.get('company_id'),is_active=1,is_verified = 1)

	outletid = None
	if request.session.get('outlet_id') and outletid == None:
		outletid = int(request.session.get('outlet_id'))
	try:
		outletObj = get_object_or_404(outlet_details, id=outletid)
	except:
		outletObj = None

	try:
		vehicleObj = get_object_or_404(finance_details, id=financeId)
	except:
		vehicleObj = None  
	
	print(vehicleObj.user_id)

	custCode = vehicleObj.user_id
	print('jkjjkkjhkjhjkhjkh')

	
	customer_details_obj = get_object_or_404(customer_details, user_id=custCode)
	outletid = int(customer_details_obj.outlet_id)
	customer_id = customer_details_obj.id
	user_id = customer_details_obj.user_id
	print(customer_details_obj.customer_name)
	print(user_id)
	print('slkasjjsadidjasi')

	print('slkasjjsadidjasi')
	# print(vehicle_details_obj)
	# vehicle_id = vehicle_details_obj.id
			
		# customer_id = None
		# user_id = None
		# # vehicle_id = None
	
	# print(customer_details_obj.customer_name)
	print('daskldjksljlkdj;lk')
	cursor = connection.cursor()
	cursor.execute(''' SELECT jcv.id,cd.customer_name,cd.email,cd.phone_no,jcid.policy_expiry_date,
								jcv.vehicle_number
								from xl925_customer_details as cd 
								LEFT JOIN xl925_jmd_customers_vehicle as jcv ON cd.id = jcv.customer_id
								LEFT JOIN xl925_jmd_cust_insurance_details as jcid ON cd.id = jcid.customer_id   
								WHERE cd.outlet_id= {0}
								
								GROUP BY cd.user_id order by cd.created_at DESC'''.format(outletid))
	customers_listObj = dictfetchall(cursor)

	# print(customers_listObj)
	print('hiiiiiiiiiiiiiiiiiiiiii')

	editfinanceobj = finance_details.objects.filter(id= financeId)
	print(editfinanceobj)
	
	cursor.execute('''SELECT * FROM `xl925_jmd_finance_details` WHERE id = {0}'''.format(financeId))    
	editfinanceobj = dictfetchall(cursor)
	
	# customer_details_obj = get_object_or_404(customer_details, id=custCode)

	if request.method == 'POST':
		postdata = request.POST.copy();
		press_btn = postdata.get('press_btn', None)
		bankname = postdata.get('bank_name', None)
		selected_outletid = outletid
		loantype = postdata.get('loan_type',None)
		
		vehicle_number = postdata.get('vehicle_number',None)
		ROI = postdata.get('ROI',None)
		loannum = postdata.get('loan_num',None)
		banknumber = postdata.get('bank_number',None)
		loanamount =  postdata.get('loanamount',None)
		loanrate = postdata.get('loan_rate',None)
		tenor = postdata.get('tenor',None)
		# outletid = int(postdata.get('select_outlet')) if postdata.get('select_outlet') else None       
		emiamount = postdata.get('emi_amount',None)
		emistartdate = postdata.get('emi_startdate',None)        
		cust_country = postdata.get('country',None)
		bankhypothecation = postdata.get('bank_hypothecation',None)
		emienddate = postdata.get('emi_enddate',None)
		title = postdata.get('title',None)
		selected_outletid = outletid
		
		cust_first_name = postdata.get('cust_first_name',None)
		cust_last_name = postdata.get('cust_last_name',None)
		cust_email = postdata.get('email',None)
		mobno = postdata.get('mob_no',None)
		mobno2 =  postdata.get('mob_no2',None)
		landline1 = postdata.get('landline1',None)
		landline2 = postdata.get('landline2',None)
		# outletid = int(postdata.get('select_outlet')) if postdata.get('select_outlet') else None       
		cust_start_date = postdata.get('start_date',None)
		cust_service_date = postdata.get('service_date',None)        
		cust_country = postdata.get('country',None)
		cust_bill = postdata.get('order_amt',None)
		cust_city = postdata.get('city',None)
		cust_pincode = postdata.get('pincode',None)
		service_name = postdata.get('service_name',None)
		area_building = postdata.get('area_building',None)
		address1 = postdata.get('address',None)
		address2 = postdata.get('street',None)
		landmark = postdata.get('landmark',None)
		pancard = postdata.get('pancard_name',None)
		Adharcard = postdata.get('Adharcard',None)
		gender = postdata.get('gender',None)
		marital_status = postdata.get('marital_status',None)
		marriage_anniversery = postdata.get('marriage_anniversery',None)


		if marriage_anniversery and marriage_anniversery != "":
			marriage_anniversery = datetime.strptime(marriage_anniversery, '%d-%m-%Y')
			marriage_anniversery = marriage_anniversery.strftime('%Y-%m-%d %H:%M:%S')
		else:
			marriage_anniversery = None 
		

		children = postdata.get('children',None)
		NO_Of_Children = postdata.get('countchildren',None)
		occupation = postdata.get('occupation',None)
		category = postdata.get('category',None)
		sub_category = postdata.get('sub_category',None)
		state = postdata.get('state',None)
		cust_birth_date = postdata.get('birth_date',None)
		
	   

		if cust_birth_date and cust_birth_date != "":
			cust_birth_date = datetime.strptime(cust_birth_date, '%d-%m-%Y')
			cust_birth_date = cust_birth_date.strftime('%Y-%m-%d %H:%M:%S')
		else:
			cust_birth_date = None                  

		
		if press_btn == 'SAVE' or press_btn == 'SAVE & CLOSE':
			'''save customer'''
			try:
				finance_details_obj = get_object_or_404(jmd_cust_insurance_details, id=postdata.get('custCode'))
			except:
				finance_details_obj = None
			print(financeId)
			print('saddjsahdjsahdsahkldsakldsajkdslajkldsajklsdaj')
			financeuserobj = finance_details.objects.filter(id= financeId)
			
			print(financeuserobj)
			newfinanceobj = []

			for newfinanceobj in financeuserobj:
				# newfinanceobj.append(i)
				# print(i.Bank_Name)
			


			
				newfinanceobj.Bank_Name = bankname
				newfinanceobj.vehicle_number = vehicle_number
				newfinanceobj.Loan_Number = loannum
				newfinanceobj.Loan_Type = loantype
				newfinanceobj.Rate_of_Interest = ROI
				newfinanceobj.Loan_amount = loanamount
				newfinanceobj.Bank_Number = banknumber
				newfinanceobj.Loan_Rate = loanrate
				newfinanceobj.Tenor = tenor
				newfinanceobj.Emi_Amount = emiamount
				print('dsababdkjdskaldslkn')  
				newfinanceobj.Emi_Start_Date = emistartdate
				print('oooooooooo challllllllaaaaaaaaaaaaaa')
				newfinanceobj.Bank_Hypothecation = bankhypothecation
				print('asksdakdsaamsdms,amd')
				newfinanceobj.Emi_End_Date = emienddate

				newfinanceobj.title = title 
				newfinanceobj.phone_no = mobno
				newfinanceobj.phone_no2 = mobno2
				newfinanceobj.email = cust_email
				# finance_obj.entry_point = 'INDV'
				newfinanceobj.user_id = user_id 
				newfinanceobj.outlet_id = selected_outletid
				# finance_obj.user_id = userid
				
				newfinanceobj.landline1 = landline1
				newfinanceobj.landline2 = landline2

				

				
				newfinanceobj.city = cust_city
				newfinanceobj.country = cust_country
				newfinanceobj.landmark = landmark
				newfinanceobj.pincode = cust_pincode
				newfinanceobj.state = state
				newfinanceobj.area_building = area_building
				newfinanceobj.address_line1 = address1
				newfinanceobj.address_line2 = address2
				newfinanceobj.pancard = pancard
				newfinanceobj.Adharcard = Adharcard
				newfinanceobj.gender = gender 
				print('adsjdksajdksahdsakjhdsa')
				newfinanceobj.marital_status = marital_status
				if marriage_anniversery:
					newfinanceobj.marriage_anniversery = marriage_anniversery
				print('adhjfhdajshfjkhdsfooooooooooooooooooooooooooo')
				newfinanceobj.children = children 
				newfinanceobj.NOOfChildren = NO_Of_Children
				newfinanceobj.occupation = occupation
				newfinanceobj.category = category
				newfinanceobj.sub_category = sub_category
				newfinanceobj.title = title 
				newfinanceobj.phone_no = mobno
				newfinanceobj.customer_name = cust_first_name + " " +cust_last_name
				newfinanceobj.email = cust_email
				print('opeeejkjkjmskdkskdskdsnkdskjmmmmmmmmmmm')
				# customer_details_obj.entry_point = 'INDV'
				newfinanceobj.created_by_id = request.user.id
				newfinanceobj.last_modified_by_id = request.user.id #01-10-2019
				if outletid:
					customer_details_obj.outlet_id = outletid
				# Added for jmd only
				print('kooooooooooooooooooooooooooooooooooooooo')
				newfinanceobj.save()

			messages.add_message(request, messages.SUCCESS, 'Your Customer details was edited successfully', fail_silently=True)

			if press_btn == "SAVE":
				return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
			elif press_btn == 'SAVE & CLOSE':
				url = reverse('customers:get_my_customers')
				return HttpResponseRedirect(url)   
	return render(request,template_name,locals())


# added on 01-10-2019 for add new user
@login_required(login_url='/merchant-login/')
# #@multi_user_permission('Add_Users')
@multi_user_permission('add','Users')
def add_new_user(request, template_name="merchant_site/customers/add_user_outlet.html"):

	try:
		outlet_details_obj = get_object_or_404(outlet_details, id = request.session.get('outlet_id'))
	except:
		outlet_details_obj = None
		page= "new_merchant_base.html"
	else:
		print(outlet_details_obj, "Uday==")
		if outlet_details_obj.is_jmd:
			page= "merchant_base.html"
		else:
			page= "new_merchant_base.html"

	active_page_name = "add_user_page"
	
	user_obj = request.user.id  #root_id user se user_obj  lete hai i.e current merchant profile    
	company_obj = request.session.get('company_id')     # company id lete hai from multiuser table
	current_outlet_obj = request.session.get('outlet_id')   # current outlet 
	commission = Commission_details.objects.filter(outlet=current_outlet_obj)
	permDb = MultiUserPermissionsField.objects.all()
	# print(commission)
	moduleDb = MultiUserPermissionsField.objects.all()
	moduleList = [i.forHtml for i in moduleDb]
	deptDb = department.objects.filter(isDeactivated = False)
	user_permi_list = ['Admin','Manager','Executive']
	login_multi_user_id = request.session.get('multi_user_id')
	temp_list = []

	try:
		MultiUserDetails_obj = get_object_or_404(MultiUserDetails,user_id=login_multi_user_id)
		user_obj = login_multi_user_id
	except:
		MultiUserDetails_obj = None

	if MultiUserDetails_obj:
		if str(MultiUserDetails_obj.is_admin) == '1':
			user_permi_list = ['Admin','Manager','Executive']

		if str(MultiUserDetails_obj.is_manager) == '1':
			user_permi_list = ['Manager','Executive']
			print("--aya")

		if str(MultiUserDetails_obj.is_executive) == '1':
			user_permi_list = []

	user_permission_list = MultiUserPermissionFields.objects.filter(is_active=True)

	cursor = connection.cursor()
	cursor.execute('''SELECT `field_name`, `field_code`, `is_active`, `parent_field`, `parent_id` FROM `xl925_multi_user_permission_field`''')

	outlet_services = dictfetchall(cursor)
	
	try:
		outlet_details_obj = get_object_or_404(outlet_details,id= request.session.get('outlet_id'))
	except:
		outlet_details_obj = None
	
	try:
		company_details_obj = get_object_or_404(CompanyProfile,id=company_obj)
	except:
		company_details_obj = None

	
	outlet_obj = outlet_details.objects.filter(created_by_id=user_obj, company_id=company_obj) 

	"""
	For Default Permissions, 
	store permissions directly from phpmyadmin
	"""
	superadmin_default_temp = []
	admin_default_temp = []
	manager_default_temp = []
	executive_default_temp = []
	default_permissions = DefaultPermissions.objects.all()
	import ast
	for dp in default_permissions:
		if dp.role == "Super Admin":
			# superadmin_default_temp = ast.literal_eval(dp.permissions)
			continue
		if dp.role == "Admin":
			admin_default_temp = ast.literal_eval(dp.permissions)
			print(dp.permissions)
		if dp.role == "Manager":
			manager_default_temp = ast.literal_eval(dp.permissions)
		if dp.role == "Executive":
			executive_default_temp = ast.literal_eval(dp.permissions)
	from json import dumps
	superadmin_default_json = dumps(superadmin_default_temp)
	print("S.Admin",superadmin_default_json)

	admin_default_json = dumps(admin_default_temp)
	print(type(admin_default_temp),"--admin_default_temp")  

	manager_default_json = dumps(manager_default_temp)
	print("manager",manager_default_json)

	executive_default_json = dumps(executive_default_temp)
	print("executive",executive_default_temp)

	# for permission_ in default_permissions:
	
	tempList = [i.forHtml for i in permDb]
	moduleList = dumps(tempList)

	if request.method == 'POST':

		postdata = request.POST.copy()  

		print("\n\n User Data ------>",postdata)

		press_btn = postdata.get('press_btn', None)
		postdata = request.POST.copy()  # collect post data
		first_name = postdata.get('firstname','')
		last_name = postdata.get('lastname','')
		username = postdata.get('username', '')
		# mobile = postdata.get('mobile','')
		password1 = postdata.get('password1', '')
		password2 = postdata.get('password2', '')
		startdate = postdata.get('start-date', '')
		#terms_of_use = postdata.get('terms_of_use', '')
		encrypt_pwd = make_password(password2)
		roles = postdata.get('roles', None)
		mac = get_mac()

		
		# Check if the merchant has registered with the username and email
		db_user = User.objects.filter(Q(username=username) | Q(email=username)) 

		# user_permission_data = postdata.getlist('user_permission_fields', None)         #konsa field choose kiya hai user permission me usko number wise bataya hai eg agar network,outlet, customer, reports so 1,2,5,6

		# permModules = ["Customers","Leads","Accounts","CustomerGroups","Support","Vehicle","Finance","Servicing","Insurance","Bookings","Invoice","ProFroma","DeliveryNote","Category","Product","ServicePerson","Offers","Settings","DomainEmailVerifications","InnerXIRCLS","PrivilegeXIRCLS","Users","Forms","SubscriptionManager","AllTransactions","PendingTransactions","Wallets","Partner","ManagerPartner","PartnerRequests","InviteBusiness","SendInvites","BlockedOutlets","NetworkAlerts","IssueReedemOffers","Teams","AssignTaskTargets","IssueRewards"]
		
		if password1 != password2:
			messages.error(request,"Passwords don't match.")
		# elif db_user.exists():            
		#     messages.error(request,'This email address is already exist')               
		else:
			try:
				user = User.objects.get(username = username)
				print("[addNewUser] In Try")
				userId = user.id
			except Exception as e:
				print(e)
				user = User()
				# user = authMultiUser()
			print("[addNewUser] In except")
			user.first_name = first_name
			user.last_name = last_name
			user.username = username
			user.email = username
			user.password = encrypt_pwd
			user.is_active = 1
			user.save()
			userId = user.id

			try:
				new_user = MultiUserDetails.objects.get(user = userId)
			except:
				new_user = MultiUserDetails()       #all details of multiusers


			# if postdata.get("parent_manager") == "Manager" :
			#     new_user.is_admin = 0
			#     new_user.is_manager = 1
			#     new_user.is_user = 0
			# elif postdata.get("parent_user") == "User" :
			#     new_user.is_admin = 0
			#     new_user.is_manager = 0
			#     new_user.is_user = 1
			new_user.first_name = first_name
			new_user.last_name = last_name
			new_user.username =username
			new_user.email = username
			new_user.is_trash=0
			new_user.user_startDate = startdate
			new_user_created_id = ''

			if postdata.get("roles") == "Super Admin":
				new_user.is_active = 1
				new_user.is_admin = 0
				new_user.is_manager = 0
				new_user.is_user = 0
				new_user.is_executive = 0
			elif postdata.get("roles") == "Admin":
				new_user.is_active = 1
				new_user.is_admin = 1
				new_user.is_manager = 0
				new_user.is_user = 0
				new_user.is_executive = 0
			elif postdata.get("roles") == "Manager":
				new_user.is_active = 1
				new_user.is_admin = 0
				new_user.is_manager = 1
				new_user.is_user = 0
				new_user.is_executive = 0
			elif postdata.get("roles") == "Executive":
				new_user.is_active = 1
				new_user.is_admin = 0
				new_user.is_manager = 0
				new_user.is_user = 0
				new_user.is_executive = 1

			new_user.created_by_id = user_obj
			new_user.outlet_id = current_outlet_obj
			new_user.parent_id = request.user.id
			
			# asd
			
			# new_user.dept = department.objects.get(id = postdata.get('dept'))
			# new_user.subDept = postdata.get('subdept')
			# new_user.dept = subDict
			print("[addNewUser]", postdata.get('commission'))
			new_user.commission_status= Commission_details.objects.get(id = postdata.get('commission'))
			new_user.user_id = userId
			new_user.save()
			
			### New Permissions Save! ###
			permModules = MultiUserPermissionsField.objects.all()
			mainModules = []

			print("[Perms]", permModules)
			for mods in permModules:
				print("[Perms]", mods.fieldName)
				mod = postdata.get(mods.forHtml, None)
				if mod is not None:
					lis = []
					lis.append(mod)
					lis.append(postdata.get('Add_'+mods.forHtml, None))
					lis.append(postdata.get('Edit_'+mods.forHtml, None))
					lis.append(postdata.get('View_'+mods.forHtml, None))
					lis.append(postdata.get('Delete_'+mods.forHtml, None))
					mainModules.append(lis)

			print("[Perms]", mainModules)
			
			for mods in mainModules:
				permObj = MultiUserPermissions()
				permObj.user = new_user
				permObj.field = MultiUserPermissionsField.objects.get(id = mods[0])
				permObj.add = True if mods[1] else False
				permObj.edit = True if mods[2] else False
				permObj.view = True if mods[3] else False
				permObj.delete = True if mods[4] else False
				permObj.save()
				
			### --------------------- ###
			
			new_user_created_id =  userId

			deptList = request.POST.getlist("dept")
			subDeptList = request.POST.getlist("subdept")
			
			print("[addNewUser]",deptList)
			print("[addNewUser]",subDeptList)
			
			for i in deptList:
				deptObj = department.objects.get(id = i)
				subDbList = []
				for sub in subDeptList:
					subObj = subDepartment.objects.get(id = sub)
					print("[addNewUser]",sub.split("-"))
					if "-" in sub:
						subSplit = sub.split("-")
						if subSplit[1] == deptObj.dept_name:
							subDbList.append(subSplit[1])
					else:
						subDbList.append(sub)
						
					Multipartment.objects.create(user_id = new_user.id, dept = deptObj, subDept = subObj)

		   

			current_user_merchant_profile = get_object_or_404(MerchantProfile,user_id=user_obj)
		
			outlet_type = current_user_merchant_profile.outlet_type_selected
			# print(outlet_type)
			is_progress = current_user_merchant_profile.is_progress_complete
			# print(is_progress)
			is_network = current_user_merchant_profile.is_network_do_later
			# print(is_network)
			is_trail_plan = current_user_merchant_profile.has_assign_trail_plan
			# print(is_trail_plan)
			signup_stage_status = current_user_merchant_profile.signup_stage_status
			# print(signup_stage_status)
			# print('at the moment kaam difficult hai')


			# save the profile of the merchant
			profile = MerchantProfile()
			profile.user = user
			# profile.phone_no = mobile
			profile.desktop_mac_id = mac
			profile.ip_address = request.META.get('REMOTE_ADDR')
			profile.signup_stage_status = '1'
			profile.terms_of_use = 1

			if postdata.get("roles") == "Super Admin":
				profile.is_superuser = 1
			else:
				profile.is_superuser = 0

			profile.is_phone_verify = False
			profile.is_email_verify = False
			profile.outlet_type_selected = outlet_type
			profile.is_progress_complete = is_progress
			profile.is_network_do_later = is_network
			profile.has_assign_trail_plan = is_trail_plan  
			profile.signup_stage_status = signup_stage_status
			profile.root_user_id = request.session.get('root_user_id')
			profile.save()
			user.groups.add(Group.objects.get(name='User'))

			outlet_allowed_obj = user_allowed_outlets()
			outlet_allowed_obj.outlet_id = request.session.get('outlet_id')
			outlet_allowed_obj.user_id = user.id
			outlet_allowed_obj.save()

			# if roles != 'Super Admin':
			
			#     for field in user_permission_data:
					
			#         user_permission = MultiUserPermission()                
			#         user_permission.field_id = field

			#         user_permission.user_id = new_user_created_id
			#         # if MultiUserDetails_obj:
			#         #     print("User:--->", user_permission.user_id)
			#         # else:
			#         #     user_permission.user_id = user_obj
			#         #     print("User:--->", user_permission.user_id)
						
			#         user_permission.outlet_id = request.session.get('outlet_id')
			#         user_permission.save()
			messages.success(request,"User Created successfully.") 
			url = reverse('customers:manage_user_outlet')
			return HttpResponseRedirect(url)





	return render(request,template_name,locals())

@login_required(login_url='/merchant-login/')
##@multi_user_permission('Manage_User_Permissions')
@multi_user_permission('view', 'Users')
def manage_user_outlet(request, template_name="merchant_site/customers/manage_user_outlet.html"):
   
	active_page_name = "manage_user_page"
	
	user_obj = request.session.get('root_user_id')  #root_id user se user_obj  lete hai i.e current merchant profile    
	company_obj = request.session.get('company_id')     # company id lete hai from multiuser table
	outletId = request.session.get('outlet_id')   # current outlet 

	print(user_obj)
	print(user_obj)
	print(outletId)


	user_permission_list = MultiUserPermissionFields.objects.filter(is_active=True)

	login_multi_user_id = request.session.get('multi_user_id')

	try:
		outlet_details_obj = get_object_or_404(outlet_details, id = request.session.get('outlet_id'))
	except:
		outlet_details_obj = None
		page= "new_merchant_base.html"
	else:
		print(outlet_details_obj, "Uday==")
		if outlet_details_obj.is_jmd:
			page= "merchant_base.html"
		else:
			page= "new_merchant_base.html"

	try:
		MultiUserDetails_obj = get_object_or_404(MultiUserDetails,user_id=login_multi_user_id)
	except:
		MultiUserDetails_obj = None

	print(user_permission_list)

	
	outlet_obj = outlet_details.objects.filter(created_by_id=user_obj, company_id=company_obj) 

	print(user_obj,"---user_obj--user_obj")

	if MultiUserDetails_obj:
		if str(MultiUserDetails_obj.is_admin) == '1':
			multiuser_obj = MultiUserDetails.objects.filter(outlet = outletId, is_trash=0)

		if str(MultiUserDetails_obj.is_manager) == '1':
			multiuser_obj = MultiUserDetails.objects.filter(outlet = outletId, created_by_id=login_multi_user_id, is_trash=0)

		if str(MultiUserDetails_obj.is_executive) == '1':
			multiuser_obj = MultiUserDetails.objects.filter(outlet = outletId, created_by_id=login_multi_user_id, is_trash=0)
		
	else:
		multiuser_obj = MultiUserDetails.objects.filter(outlet = outletId, parent_id=user_obj, is_trash=0)
		# raise Exception([i.id for i in multiuser_obj ])
	users = []
	
	for multi_user in multiuser_obj:
		try:
			multipartment_obj=Multipartment.objects.get(user_id=multi_user.id)
		except:
			continue
		print(multipartment_obj,multi_user.id,"check multiii")
		print(multipartment_obj.dept_id)
		dept_check=multipartment_obj.dept_id
		dept_obj=department.objects.get(id=dept_check)
		
		temp = {}
		temp['department_name']=dept_obj.dept_name
		temp['id'] = multi_user.id
		temp['name'] = multi_user.first_name + ' ' + multi_user.last_name
		temp['email'] = multi_user.email
		temp['created_at'] = multi_user.created_at
		temp['is_admin'] = multi_user.is_admin
		temp['is_manager'] = multi_user.is_manager
		temp['is_executive'] = multi_user.is_executive
		temp['active'] = multi_user.active
		temp['status'] = multi_user.deactivateStatus
		temp['user_id'] = multi_user.user_id
		temp['created_by'] = multi_user.created_by_id
		temp['slug'] = 'user_' + str(multi_user.user_id)

		users.append(temp)
	print("UserCHECK=--->?>?", users)

	# csmDb = commission_summary_details.objects.get(user_name = multiuser_obj)
	# commDb = commission_report_details.objects.filter(user_name = multiuser_obj)
	
	cursor = connection.cursor()
	cursor.execute(''' SELECT obd.is_jmd_insurance,obd.is_jmd_vehicle_service,mud.id,mud.is_trash,mud.outlet_id,mud.active,mud.email,mud.first_name,mud.created_at FROM xl925_multi_user_details as mud INNER JOIN xl925_outlet_basic_details as obd ON obd.id = mud.outlet_id WHERE outlet_id = {0}'''.format(outletId))

	manageuserobj = dictfetchall(cursor)
	print(manageuserobj)

	if request.method == "POST":
		postdata = request.POST.copy()        
		press_btn = postdata.get('press_btn', None)
		print('kyu kush hai sab',postdata)
		userid = postdata.get('userid')
		print(userid)
		userdelete = postdata.get('deleteuser')
		print(userdelete)
		print('dubi dubi dub dub')


		# if userid:
		#     print('asdkjksajkdjsakjdskj')
					
				   
		  
		#     deleteuserobj = get_object_or_404(MultiUserDetails, id=userid)
		#     # sub_xircle_infoobj = finance_details.objects.filter(id=11)
		   
		#     print('fdjsjkdhofiaspsj')
		#     deleteuserobj.is_trash = 1
		#     # print(deleteobj.is_trash)
		#     # sub_xircle_infoobj.is_trash=1
		#     deleteuserobj.active = 0
		#     deleteuserobj.save()
		#     messages.add_message(request, messages.SUCCESS, 'Your User is successfully deleted',fail_silently=True)
		#     url = reverse('customers:manage_user_outlet')
		#     return HttpResponseRedirect(url)

		if postdata.get('delete_xircl') == 'Yes':
			del_user_obj = get_object_or_404(MultiUserDetails, id=postdata.get('slug_to_delete'))
			del_user_obj.is_trash = True
			del_user_obj.save()
			del_user_dept = get_object_or_404(Multipartment, user_id=postdata.get('slug_to_delete'))
			del_user_dept.delete()
			del_user_dept.save()
			messages.add_message(request, messages.SUCCESS, 'User successfully deleted.', fail_silently=True)
			url = reverse('customers:manage_user_outlet')
			return HttpResponseRedirect(url)
		elif postdata.get('deactivateButt') == 'Yes':
			id5=postdata.get('slug_to_delete')
			print("[Deactivate] id:", id5)
			userDbObj = MultiUserDetails.objects.get(id=id5)
			userDbObj.deactivateStatus = True
			userDbObj.save()
			messages.add_message(request, messages.SUCCESS,
								 'User Deativated deleted.', fail_silently=True)
			url = reverse('customers:manage_user_outlet')
			return HttpResponseRedirect(url)
		
		elif postdata.get('activateButt') == 'Yes':
			id5=postdata.get('slug_to_delete')
			userDbObj = MultiUserDetails.objects.get(id=id5)
			userDbObj.deactivateStatus = False
			userDbObj.save()
			messages.add_message(request, messages.SUCCESS,
								 'User Activated deleted.', fail_silently=True)
			url = reverse('customers:manage_user_outlet')
			return HttpResponseRedirect(url)
		

	return render(request,template_name,locals())

@login_required(login_url='/merchant-login/')
@multi_user_permission('edit', 'Users')
def edit_manage_user_outlet(request,slug,template_name="merchant_site/customers/edit_manage_user_outlet.html"):
	edit = True
	active_page_name = "manage_user_outlet"
	
	user_obj = request.session.get('root_user_id')  #root_id user se user_obj  lete hai i.e current merchant profile    
	company_obj = request.session.get('company_id')     # company id lete hai from multiuser table
	current_outlet_obj = request.session.get('outlet_id')   # current outlet 
	
	# user_permi_list = ['Super Admin','Admin','Manager','Executive']
	user_permi_list = ['Admin','Manager','Executive']
	login_multi_user_id = request.session.get('multi_user_id')
	print("[EditUser]slug:", slug)

	moduleDb = MultiUserPermissionsField.objects.all()
	moduleList = [i.forHtml for i in moduleDb]

	try:
		MultiUserDetails_obj = get_object_or_404(MultiUserDetails,user_id=slug)
		if login_multi_user_id:
			user_obj = login_multi_user_id
		else:
			user_ibj = request.user.id
	except:
		MultiUserDetails_obj = None

	if MultiUserDetails_obj:
		if str(MultiUserDetails_obj.is_admin) == '1':
			user_permi_list = ['Admin','Manager','Executive']

		if str(MultiUserDetails_obj.is_manager) == '1':
			user_permi_list = ['Manager','Executive']
			print("--aya")

		if str(MultiUserDetails_obj.is_executive) == '1':
			user_permi_list = []

	user_permission_list = MultiUserPermissionFields.objects.filter(is_active=1)
	
	commObj = Commission_details.objects.all()
	permDb = MultiUserPermissionsField.objects.all()
	
	print("[EditUser]MultiUserDetails_obj:", MultiUserDetails_obj.id)
	multiDeptObj = Multipartment.objects.filter(user = MultiUserDetails_obj)
	
	hasMultiDept = False
	if len(multiDeptObj) > 1:
		hasMultiDept = True
	
	deptList = []
	subDeptList = []
	# print("[EditUser]multiDeptObj:", multiDeptObj)
	# for i in multiDeptObj:
	#     deptList.append(i.dept.id)
	#     print("[EditUser]dept_name:", i.dept.dept_name)
	#     print("[EditUser]subDept:", i.subDept)
	#     sub = i.subDept.replace("'","")
	#     sub = sub.replace("[","")
	#     sub = sub.replace("]","")
	#     subTempList = sub.split(",")
	#     print("[EditUser]subsss:", sub, subTempList)
	#     for j in subTempList:
	#         subDeptList.append(j)
			
	#     print("[EditUser]deptList:", deptList)
	#     print("[EditUser]subDeptList:", subDeptList)

	for i in multiDeptObj:
		if i.dept:
			deptList.append(i.dept.id)
		try:
			if i.subDept:
				subDeptList.append(i.subDept.id)
		except:
			print('No sub department')
		# print("[EditUser]dept_name:", i.dept.dept_name)
		# print("[EditUser]subDept:", i.subDept.name)
			
		# print("[EditUser]deptList:", deptList)
		# print("[EditUser]subDeptList:", subDeptList)
		
	json_list = json.dumps(subDeptList)
	
	outlet_obj = outlet_details.objects.filter(created_by_id=user_obj, company_id=company_obj) 
	# print(userid)
	print(user_obj)
	print('aaaaaaaaaaabbbbbbbbbbbhishkakljlk')
	cursor = connection.cursor()
	user_id = get_object_or_404(MultiUserDetails, user_id=slug)
	user_auth_id = get_object_or_404(User, id=slug)
	print("User Check Permissions:--->OK ", user_auth_id)
	# print(user _id)
   

	# abhi2 = (user_id.id)
	# abhi1 = (user_id.user_id)
	# print(abhi1)
	# print(abhi2)
	# cursor.execute('''SELECT mud.active,mud.user_id,mud.email,mud.first_name,mud.last_name,mud.username,
	#             mup.is_active, mup.field_id, mup.user_id,mup.outlet_id FROM `xl925_multi_user_details` as mud 
	#             INNER JOIN `xl925_multi_user_permission` as mup on mud.user_id = mup.user_id
	#             WHERE mup.user_id = {0}'''.format(abhi1))
	# print('''SELECT mud.active,mud.user_id,mud.email,mud.first_name,mud.last_name,mud.username,
	#             mup.is_active, mup.field_id, mup.user_id,mup.outlet_id FROM `xl925_multi_user_details` as mud 
	#             INNER JOIN `xl925_multi_user_permission` as mup on mud.user_id = mup.user_id
	#             WHERE mup.user_id = {0}'''.format(abhi1))
	# newuserobj = dictfetchall(cursor)
	
	# print(newuserobj)
	# abhi= []
	# field_ids = []
	# field_names = []
	# for i in newuserobj:
	#     print('saadsahdjhsjahjh')
	#     print(i)

	#     abhi = i['user_id']
	#     field_ids.append(i['field_id'])
	# print(abhi)
	# print('uyaaaaaaaaaaaashaskldhklasdkljs')

	# user_permissionobj = MultiUserPermission.objects.filter(user_id = request.get.session('user_id'))

	# if len(field_ids) > 1:
	#     field_tuple = tuple(field_ids)
	#     user_permission_list = MultiUserPermissionFields.objects.filter(is_active=True,id__in = field_tuple)
	# else:
	#     user_permission_list = MultiUserPermissionFields.objects.filter(is_active=True,id = field_ids)
	# print(user_permission_list)
	
	# for names in user_permission_list:
	#     print(names.field_name)
	#     field_names.append(names.field_name)


	# print(field_names)
	"""
	For Default Permissions, 
	store permissions directly through phpmyadmin
	"""
	superadmin_default_temp = []
	admin_default_temp = []
	manager_default_temp = []
	executive_default_temp = []

	default_permissions = DefaultPermissions.objects.all()

	import ast
	for dp in default_permissions:
		if dp.role == "Super Admin":
			# superadmin_default_temp = ast.literal_eval(dp.permissions)
			continue

		if dp.role == "Admin":
			admin_default_temp = ast.literal_eval(dp.permissions)
			print(dp.permissions)

		if dp.role == "Manager":
			manager_default_temp = ast.literal_eval(dp.permissions)
		
		if dp.role == "Executive":
			executive_default_temp = ast.literal_eval(dp.permissions)
	
	from json import dumps
	superadmin_default_json = dumps(superadmin_default_temp)
	print("S.Admin",superadmin_default_json)

	admin_default_json = dumps(admin_default_temp)
	print(type(admin_default_temp),"--admin_default_temp")  

	manager_default_json = dumps(manager_default_temp)
	print("manager",manager_default_json)

	executive_default_json = dumps(executive_default_temp)
	print("executive",executive_default_temp)


	user_permission_check = MultiUserPermission.objects.filter(user_id=slug,is_active=1)
	fields = []
	for permission in user_permission_check:
		permission_id = permission.field.field_name
		fields.append(permission_id)
	print("Permission Fields List:--->",fields)

	# userDbDeptDict = user_id.dept
	# userDbDeptDict = userDbDeptDict.replace("'", '"')
	# print("[EDIT]", userDbDeptDict, type(userDbDeptDict))
	# userDeptDict = json.loads(userDbDeptDict)
	# print("[EDIT]", userDeptDict, type(userDeptDict))
	
	# for key in userDeptDict:
	#     print("[EDIT]", key)

	# if user_id.dept.isDeactivated == False:
	#     deptDb = department.objects.filter(isDeactivated = False)
	# else:
	#     deptDb = department.objects.all()
	deptDb = department.objects.all()
	
	try:
		mainPermList = []
		print("[Perms | Try] mainPermList:", mainPermList)
		permObj = MultiUserPermissions.objects.filter(user = MultiUserDetails_obj)
		for perm in permObj:
			dic = {}
			dic["name"] = perm.field.forHtml
			dic["add"] = 1 if perm.add else 0
			dic["edit"] = 1 if perm.edit else 0
			dic["view"] = 1 if perm.view else 0
			dic["delete"] = 1 if perm.delete else 0
			mainPermList.append(dic)
		print("[Perms | Try] mainPermList:", mainPermList)
	except Exception as e:
		mainPermList = []
		print("[Perms | Except] mainPermList:", mainPermList)
		print("[Perms | Except] Exception:", e)

	if request.method == 'POST':  
		# print('ahdfjashjhdkjsa')

		# try:
		#     newuserobj = get_object_or_404(MultiUserDetails, id=slug)
		# except:
		#     newuserobj = None   
		
		# print(newuserobj)
		# print('johny johnyyyyyyyyyyyyyyyyyy')

		postdata = request.POST.copy()        
		press_btn = postdata.get('press_btn', None)
		first_name = postdata.get('firstname')
		last_name = postdata.get('lastname','')
		username = postdata.get('username', '')
		# # mobile = postdata.get('mobile','')
		password = postdata.get('password', '')
		password1 = postdata.get('password1', '')
		password2 = postdata.get('password2', '')
		#terms_of_use = postdata.get('terms_of_use', '')
		encrypt_pwd = make_password(password2)
		postdata.get('roles', None)
		mac = get_mac()


		db_user = User.objects.filter(Q(username=username) | Q(email=username)) 
		# db_user = User.objects.filter(Q(username=username)) 

		'''
		customers = postdata.get('customers', None)
		Add_Customer = postdata.get('Add_Customer', None)
		Edit_Customer = postdata.get('Edit_Customer', None)
		View_Customer = postdata.get('View_Customers', None)
		Delete_Customer = postdata.get('Delete_Customer', None)
	   
		leads = postdata.get('leads', None)
		Add_Lead = postdata.get('Add_Lead', None)
		Edit_Lead = postdata.get('Edit_Lead', None)
		View_Lead = postdata.get('View_Lead', None)
		Delete_Lead = postdata.get('Delete_Lead', None)

		Add_Account = postdata.get('Add_Account', None)
		Edit_Account = postdata.get('Edit_Account', None)
		View_Account = postdata.get('View_Account', None)
		Delete_Account = postdata.get('Delete_Account', None)

		Add_Vehicles = postdata.get('Add_Vehicles', None)
		Edit_Vehicles = postdata.get('Edit_Vehicles', None)
		View_Vehicles = postdata.get('View_Vehicles', None)
		Delete_Vehicles = postdata.get('Delete_Vehicles', None)

		Add_Finance = postdata.get('Add_Finance', None)
		Edit_Finance = postdata.get('Edit_Finance', None)
		View_Finance_History = postdata.get('View_Finance_History', None)
		Delete_Finance = postdata.get('Delete_Finance', None)

		Add_Servicing = postdata.get('Add_Servicing', None)
		Edit_Servicing = postdata.get('Edit_Servicing', None)
		View_Servicing_History = postdata.get('View_Servicing_History', None)
		Delete_Servicing = postdata.get('Delete_Servicing', None)

		Add_Insurance = postdata.get('Add_Insurance', None)
		Edit_Insurance = postdata.get('Edit_Insurance', None)
		View_Insurance_History = postdata.get('View_Insurance_History', None)
		Delete_Insurance = postdata.get('Delete_Insurance', None)

		Add_Support = postdata.get('Add_Support', None)
		Edit_Support = postdata.get('Edit_Support', None)
		View_Support = postdata.get('View_Support', None)
		Delete_Support = postdata.get('Delete_Support', None)

		Add_Customer_Group = postdata.get('Add_Customer_Group', None)
		Edit_Customer_Group = postdata.get('Edit_Customer_Group', None)
		View_Customer_Group = postdata.get('View_Customer_Group', None)
		Delete_Customer_Group = postdata.get('Delete_Customer_Group', None)

		Add_Booking = postdata.get('Add_Booking', None)
		Edit_Booking = postdata.get('Edit_Booking', None)
		View_Booking = postdata.get('View_Booking', None)
		Delete_Booking = postdata.get('Delete_Booking', None)

		Add_Invoice = postdata.get('Add_Invoice', None)
		Edit_Invoice = postdata.get('Edit_Invoice', None)
		View_Invoice = postdata.get('View_Invoice', None)
		Delete_Invoice = postdata.get('Delete_Invoice', None)

		Add_Delivery = postdata.get('Add_Delivery', None)
		Edit_Delivery = postdata.get('Edit_Delivery', None)
		View_Delivery = postdata.get('View_Delivery', None)
		Delete_Delivery = postdata.get('Delete_Delivery', None)

		Add_Proforma = postdata.get('Add_Proforma', None)
		Edit_Proforma = postdata.get('Edit_Proforma', None)
		View_Proforma = postdata.get('View_Proforma', None)
		Delete_Proforma = postdata.get('Delete_Proforma', None)
	   
		Add_Users = postdata.get('Add_Users', None)
		Edit_Users = postdata.get('Edit_Users', None)
		Manage_User_Permissions = postdata.get('Manage_User_Permissions', None)
		Delete_Users = postdata.get('Delete_Users', None)

		Add_Category = postdata.get('Add_Category', None)
		Edit_Category = postdata.get('Edit_Category', None)
		View_Category = postdata.get('View_Category', None)
		Delete_Category = postdata.get('Delete_Category', None)

		Add_Product = postdata.get('Add_Product', None)
		Edit_Product = postdata.get('Edit_Product', None)
		View_Product = postdata.get('View_Product', None)
		Delete_Product = postdata.get('Delete_Product', None)

		Add_Service_Person = postdata.get('Add_Service_Person', None)
		Edit_Service_Person = postdata.get('Edit_Service_Person', None)
		View_Service_Person = postdata.get('View_Service_Person', None)
		Delete_Service_Person = postdata.get('Delete_Service_Person', None)



		Add_Offers = postdata.get('Add_Offers', None)
		Edit_Offers = postdata.get('Edit_Offers', None)
		View_Offers = postdata.get('View_Offers', None)
		Delete_Offers = postdata.get('Delete_Offers', None)

		Add_Settings = postdata.get('Add_Settings', None)
		Edit_Settings = postdata.get('Edit_Settings', None)
		View_Settings = postdata.get('View_Settings', None)
		Delete_Settings = postdata.get('Delete_Settings', None)

		Add_DEV = postdata.get('Add_DEV', None)
		Edit_DEV = postdata.get('Edit_DEV', None)
		View_DEV = postdata.get('View_DEV', None)
		Delete_DEV = postdata.get('Delete_DEV', None)

		Add_Inner = postdata.get('Add_Inner', None)
		Edit_Inner = postdata.get('Edit_Inner', None)
		View_Inner = postdata.get('View_Inner', None)
		Delete_Inner = postdata.get('Delete_Inner', None)

		Add_Privilege = postdata.get('Add_Privilege', None)
		Edit_Privilege = postdata.get('Edit_Privilege', None)
		View_Privilege = postdata.get('View_Privilege', None)
		Delete_Privilege = postdata.get('Delete_Privilege', None)

		Add_Transactions= postdata.get('Add_Transactions', None)

		Add_Pending_Transaction = postdata.get('Add_Pending_Transaction', None)
		Edit_Pending_Transaction = postdata.get('Edit_Pending_Transaction', None)
		View_Pending_Transaction = postdata.get('View_Pending_Transaction', None)
		Delete_Pending_Transaction 	 = postdata.get('Delete_Pending_Transaction', None)

		Add_Bills = postdata.get('Add_Bills', None)

		Add_Wallets = postdata.get('Add_Wallets', None)
		Edit_Wallets = postdata.get('Edit_Wallets', None)
		View_Wallets = postdata.get('View_Wallets', None)
		Delete_Wallets = postdata.get('Delete_Wallets', None)
		
		Add_Partner = postdata.get('Add_Partner', None)
		Edit_Partner = postdata.get('Edit_Partner', None)
		View_Partner = postdata.get('View_Partner', None)
		Delete_Partner = postdata.get('Delete_Partner', None)

		Add_Manage_Partner = postdata.get('Add_Manage_Partner', None)
		Edit_Manage_Partner = postdata.get('Edit_Manage_Partner', None)
		View_Manage_Partner = postdata.get('View_Manage_Partner', None)
		Delete_Manage_Partner = postdata.get('Delete_Manage_Partner', None)



		Add_Partner_Request = postdata.get('Add_Partner_Request', None)
		View_Partner_Request = postdata.get('View_Partner_Request', None)
		Delete_Partner_Request = postdata.get('Delete_Partner_Request', None)

		Add_Invite_B = postdata.get('Add_Invite_B', None)

		Add_Invite_S = postdata.get('Add_Invite_S', None)
		Edit_Invite_S = postdata.get('Edit_Invite_S', None)
		View_Invite_S = postdata.get('View_Invite_S', None)

		Add_Block_Outlets = postdata.get('Add_Block_Outlets', None)
		View_Block_Outlets = postdata.get('View_Block_Outlets', None)
		Delete_Block_Outlets = postdata.get('Delete_Block_Outlets', None)

		Add_Network_Alert = postdata.get('Add_Network_Alert', None)

		Add_Issue_Offer = postdata.get('Add_Issue_Offer', None)
		Edit_Issue_Offer = postdata.get('Edit_Issue_Offer', None)
		View_Issue_Offer = postdata.get('View_Issue_Offer', None)
		Delete_Issue_Offer = postdata.get('Delete_Issue_Offer', None)

		Add_Team = postdata.get('Add_Team', None)
		Edit_Team = postdata.get('Edit_Team', None)
		View_Team = postdata.get('View_Team', None)
		Delete_Team = postdata.get('Delete_Team', None)

		Add_Task = postdata.get('Add_Task', None)
		Edit_Task = postdata.get('Edit_Task', None)
		View_Task = postdata.get('View_Task', None)
		Delete_Task = postdata.get('Delete_Task', None)

		Add_Issue_Rewards = postdata.get('Add_Issue_Rewards', None)
		Edit_Issue_Rewards = postdata.get('Edit_Issue_Rewards', None)
		View_Issue_Rewards = postdata.get('View_Issue_Rewards', None)
		Delete_Issue_Rewards = postdata.get('Delete_Issue_Rewards', None)


		print('---------------------------------------------')
		
		list1=[]
		
		if(customers!=None or Add_Customer!=None or Edit_Customer!=None or Delete_Customer!=None or View_Customer!=None 
			or leads!=None or Add_Lead!=None or Edit_Lead!=None or View_Lead!=None or Delete_Lead!=None 
			or Add_Account!=None or Edit_Account!=None or View_Account!=None or Delete_Account!=None 
			or Add_Vehicles!=None or Edit_Vehicles!=None or View_Vehicles!=None or Delete_Vehicles!=None 
			or Add_Finance!=None or Edit_Finance!=None or View_Finance_History!=None or Delete_Finance!=None 
			or Add_Servicing!=None or Edit_Servicing!=None or View_Servicing_History!=None or Delete_Servicing!=None 
			or Add_Insurance!=None or Edit_Insurance!=None or View_Insurance_History!=None or Delete_Insurance!=None 
			or Add_Support!=None or Edit_Support!=None or View_Support!=None or Delete_Support!=None 
			or Add_Customer_Group!=None or Edit_Customer_Group!=None or View_Customer_Group!=None or Delete_Customer_Group!=None 
			or Add_Booking!=None or Edit_Booking!=None or View_Booking!=None or Delete_Booking!=None 
			or Add_Invoice!=None or Edit_Invoice!=None or View_Invoice!=None or Delete_Invoice!=None
			or Add_Delivery!=None or Edit_Delivery!=None or View_Delivery!=None or Delete_Delivery!=None
			or Add_Proforma!=None or Edit_Proforma!=None or View_Proforma!=None or Delete_Proforma!=None
			or Add_Users!=None or Edit_Users!=None or Manage_User_Permissions!=None or Delete_Users!=None
			or Add_Category!=None or Edit_Category!=None or View_Category!=None or Delete_Category!=None
			or Add_Product!=None or Edit_Product!=None or View_Product!=None or Delete_Product!=None
			or Add_Service_Person!=None or Edit_Service_Person!=None or View_Service_Person!=None or Delete_Service_Person!=None
			or Add_Offers!=None or Edit_Offers!=None or View_Offers!=None or Delete_Offers!=None
			or Add_Settings!=None or Edit_Settings!=None or View_Settings!=None or Delete_Settings!=None
			or Add_DEV!=None or Edit_DEV!=None or View_DEV!=None or Delete_DEV!=None
			or Add_Inner!=None or Edit_Inner!=None or View_Inner!=None or Delete_Inner!=None
			or Add_Privilege!=None or Edit_Privilege!=None or View_Privilege!=None or Delete_Privilege!=None
			or Add_Transactions!=None 
			or Add_Pending_Transaction!=None or Edit_Pending_Transaction!=None or View_Pending_Transaction!=None or Delete_Pending_Transaction!=None
			or Add_Bills!=None 
			or Add_Wallets!=None or Edit_Wallets!=None or View_Wallets!=None or Delete_Wallets!=None
			or Add_Partner!=None or Edit_Partner!=None or View_Partner!=None or Delete_Partner!=None
			or Add_Manage_Partner!=None or Edit_Manage_Partner!=None or View_Manage_Partner!=None or View_Manage_Partner!=None
			or Add_Partner_Request!=None or View_Partner_Request!=None or Delete_Partner_Request!=None 
			or Add_Invite_B!=None 
			or Add_Invite_S!=None or Edit_Invite_S!=None or View_Invite_S!=None 
			or Add_Block_Outlets!=None or View_Block_Outlets!=None or Delete_Block_Outlets!=None 
			or Add_Network_Alert!=None
			or Add_Issue_Offer!=None or Edit_Issue_Offer!=None or View_Issue_Offer!=None or Delete_Issue_Offer!=None
			or Add_Team!=None or Edit_Team!=None or View_Team!=None or Delete_Team!=None
			or Add_Task!=None or Edit_Task!=None or View_Task!=None or Delete_Task!=None
			or Add_Issue_Rewards!=None or Edit_Issue_Rewards!=None or View_Issue_Rewards!=None or Delete_Issue_Rewards!=None):
			
			list1.append(customers)
			list1.append(Add_Customer)
			list1.append(Edit_Customer)
			list1.append(Delete_Customer)
			list1.append(View_Customer)

			list1.append(leads)
			list1.append(Add_Lead)
			list1.append(Edit_Lead)
			list1.append(View_Lead)
			list1.append(Delete_Lead)

			list1.append(Add_Account)
			list1.append(Edit_Account)
			list1.append(View_Account)
			list1.append(Delete_Account)


			list1.append(Add_Vehicles)
			list1.append(Edit_Vehicles)
			list1.append(View_Vehicles)
			list1.append(Delete_Vehicles)
			
			list1.append(Add_Finance)
			list1.append(Edit_Finance)
			list1.append(View_Finance_History)
			list1.append(Delete_Finance)

			list1.append(Add_Servicing)
			list1.append(Edit_Servicing)
			list1.append(View_Servicing_History)
			list1.append(Delete_Servicing)

			list1.append(Add_Insurance)
			list1.append(Edit_Insurance)
			list1.append(View_Insurance_History)
			list1.append(Delete_Insurance)

			list1.append(Add_Support)
			list1.append(Edit_Support)
			list1.append(View_Support)
			list1.append(Delete_Support)

			list1.append(Add_Customer_Group)
			list1.append(Edit_Customer_Group)
			list1.append(View_Customer_Group)
			list1.append(Delete_Customer_Group)

			list1.append(Add_Booking)
			list1.append(Edit_Booking)
			list1.append(View_Booking)
			list1.append(Delete_Booking)

			list1.append(Add_Invoice)
			list1.append(Edit_Invoice)
			list1.append(View_Invoice)
			list1.append(Delete_Invoice)

			list1.append(Add_Delivery)
			list1.append(Edit_Delivery)
			list1.append(View_Delivery)
			list1.append(Delete_Delivery)

			list1.append(Add_Proforma)
			list1.append(Edit_Proforma)
			list1.append(View_Proforma)
			list1.append(Delete_Proforma)

			list1.append(Add_Users)
			list1.append(Edit_Users)
			list1.append(Manage_User_Permissions)
			list1.append(Delete_Users)

			list1.append(Add_Category)
			list1.append(Edit_Category)
			list1.append(View_Category)
			list1.append(Delete_Category)

			list1.append(Add_Product)
			list1.append(Edit_Product)
			list1.append(View_Product)
			list1.append(Delete_Product)

			list1.append(Add_Service_Person)
			list1.append(Edit_Service_Person)
			list1.append(View_Service_Person)
			list1.append(Delete_Service_Person)

			list1.append(Add_Offers)
			list1.append(Edit_Offers)
			list1.append(View_Offers)
			list1.append(Delete_Offers)

			list1.append(Add_Settings)
			list1.append(Edit_Settings)
			list1.append(View_Settings)
			list1.append(Delete_Settings)

			list1.append(Add_DEV)
			list1.append(Edit_DEV)
			list1.append(View_DEV)
			list1.append(Delete_DEV)

			list1.append(Add_Inner)
			list1.append(Edit_Inner)
			list1.append(View_Inner)
			list1.append(Delete_Inner)

			list1.append(Add_Privilege)
			list1.append(Edit_Privilege)
			list1.append(View_Privilege)
			list1.append(Delete_Privilege)

			list1.append(Add_Transactions)

			list1.append(Add_Pending_Transaction)
			list1.append(Edit_Pending_Transaction)
			list1.append(View_Pending_Transaction)
			list1.append(Delete_Pending_Transaction)

			list1.append(Add_Bills)

			list1.append(Add_Wallets)
			list1.append(Edit_Wallets)
			list1.append(View_Wallets)
			list1.append(Delete_Wallets)

			list1.append(Add_Partner)
			list1.append(Edit_Partner)
			list1.append(View_Partner)
			list1.append(Delete_Partner)

			list1.append(Add_Manage_Partner)
			list1.append(Edit_Manage_Partner)
			list1.append(View_Manage_Partner)
			list1.append(Delete_Manage_Partner)

			list1.append(Add_Partner_Request)
			list1.append(View_Partner_Request)
			list1.append(Delete_Partner_Request)

			list1.append(Add_Invite_B)

			list1.append(Add_Invite_S)
			list1.append(Edit_Invite_S)
			list1.append(View_Invite_S)

			list1.append(Add_Block_Outlets)
			list1.append(View_Block_Outlets)
			list1.append(Delete_Block_Outlets)

			list1.append(Add_Network_Alert)

			list1.append(Add_Issue_Offer)
			list1.append(Edit_Issue_Offer)
			list1.append(View_Issue_Offer)
			list1.append(Delete_Issue_Offer)

			list1.append(Add_Team)
			list1.append(Edit_Team)
			list1.append(View_Team)
			list1.append(Delete_Team)

			list1.append(Add_Task)
			list1.append(Edit_Task)
			list1.append(View_Task)
			list1.append(Delete_Task)

			list1.append(Add_Issue_Rewards)
			list1.append(Edit_Issue_Rewards)
			list1.append(View_Issue_Rewards)
			list1.append(Delete_Issue_Rewards)


		print("Manage User LIST-->",list1)
	   
		# print('sajkdhaskjdkj')
		list3 =list(filter(None,list1))
		print("Manage LIST3--->",list3)

		abc = MultiUserPermissionFields.objects.filter(field_name__in=list3)
		'''
		user_permission_data = []
		# for i in abc:
		#     print("Field ID->",i.id)
		#     user_permission_data.append(i.id)

		print("Field ID lists",user_permission_data)
		# Check if the merchant has registered with the username and email
		# db_user = User.objects.filter(Q(username=newuserobj.username) | Q(email=newuserobj.username))                 #what is this?
		
		# selected_outlet = postdata.get('outlet_name', '')
		# user_permission_data = postdata.getlist('user_permission_fields', None)         #konsa field choose kiya hai user permission me usko number wise bataya hai eg agar network,outlet, customer, reports so 1,2,5,6
	   
		
		# if password1 != password2:
		#     messages.error(request,"Passwords don't match.")
		print(db_user.exists(),"------db_user.exists()")
		if not db_user.exists():            
			messages.error(request,'This email address is already exist')               
		else:
			# user = User()
			try:
				user = get_object_or_404(User,id=slug)
			except:
				user = None
			user.first_name = first_name
			user.last_name = last_name
			user.username = username
			user.email = username
			# if password1 and password2 != None or password1 and password2 != '':
			#     if password1 != password2:
			#         messages.ERROR(request, "Password Didn't Match.")
			#     else:
			#         user.password = encrypt_pwd

			print("[EditPass]name:", user.first_name," pass:", password)
			if password != '':
				encrypt_pwd = make_password(password)   
				user.password = encrypt_pwd
			user.is_active = 1
			user.save()

			# new_user = MultiUserDetails() 
				 #all details of multiusers
			print('jaaaaaai  hoooooooooooooooo ')
			


			# if postdata.get("parent_manager") == "Manager" :
			#     new_user.is_admin = 0
			#     new_user.is_manager = 1
			#     new_user.is_user = 0
			# elif postdata.get("parent_user") == "User" :
			#     new_user.is_admin = 0
			#     new_user.is_manager = 0
			#     new_user.is_user = 1
			try:
				newuserobj1 = get_object_or_404(MultiUserDetails, user_id=slug)
			except:
				newuserobj1 = MultiUserDetails()  

			newuserobj1.first_name = first_name
			newuserobj1.last_name = last_name
			# newuserobj1.username =username
			# newuserobj1.email = username
			new_user_created_id = ''

			if postdata.get("roles") == "Super Admin":
				newuserobj1.is_active = 1
				newuserobj1.is_admin = 0
				newuserobj1.is_manager = 0
				newuserobj1.is_user = 0
				newuserobj1.is_executive = 0
			elif postdata.get("roles") == "Admin":
				newuserobj1.is_active = 1
				newuserobj1.is_admin = 1
				newuserobj1.is_manager = 0
				newuserobj1.is_user = 0
				newuserobj1_executive = 0
			elif postdata.get("roles") == "Manager":
				newuserobj1.is_active = 1
				newuserobj1.is_admin = 0
				newuserobj1.is_manager = 1
				newuserobj1.is_user = 0
				newuserobj1.is_executive = 0
			elif postdata.get("roles") == "Executive":
				newuserobj1.is_active = 1
				newuserobj1.is_admin = 0
				newuserobj1.is_manager = 0
				newuserobj1.is_user = 0
				newuserobj1.is_executive = 1

		   
			newuserobj1.created_by_id = user_obj
			newuserobj1.outlet_id = current_outlet_obj
			newuserobj1.parent_id = user_obj
			newuserobj1.user_id = user.id
			# newuserobj1.dept = department.objects.get(id = postdata.get("dept"))
			# newuserobj1.subDept = postdata.get("subdept", None)
			newuserobj1.commission_status = Commission_details.objects.get(id=postdata.get("comm", None))
			newuserobj1.save()
			new_user_created_id =  user.id
			
			### New Permissions Save! ###
			permModules = MultiUserPermissionsField.objects.all()
			mainModules = []

			print("[Perms]", permModules)
			for mods in permModules:
				print("[Perms]", mods.fieldName)
				mod = postdata.get(mods.forHtml, None)
				if mod is not None:
					lis = []
					lis.append(mod)
					lis.append(postdata.get('Add_'+mods.forHtml, None))
					lis.append(postdata.get('Edit_'+mods.forHtml, None))
					lis.append(postdata.get('View_'+mods.forHtml, None))
					lis.append(postdata.get('Delete_'+mods.forHtml, None))
					mainModules.append(lis)

			print("[Perms]", mainModules)

			MultiUserPermissions.objects.filter(user=newuserobj1).delete()
			
			for mods in mainModules:
				try:
					modObj = MultiUserPermissionsField.objects.get(id = mods[0])
					permObj = MultiUserPermissions.objects.get(user = newuserobj1, field = modObj)
					print("[Perms] In try!")
				except Exception as e:
					permObj = MultiUserPermissions()
					print("[Perms] In except! -->", e)
					
				permObj.user = newuserobj1
				permObj.field = MultiUserPermissionsField.objects.get(id = mods[0])
				permObj.add = True if mods[1] else False
				permObj.edit = True if mods[2] else False
				permObj.view = True if mods[3] else False
				permObj.delete = True if mods[4] else False
				permObj.save()
				print("[Perms] Saved!")
				
			### --------------------- ###

			deptList = request.POST.getlist("dept")
			subDeptList = request.POST.getlist("subdept")
			
			for i in deptList:
				deptObj = department.objects.get(id = i)
				subDbList = []
				for sub in subDeptList:
					subObj = subDepartment.objects.get(id = sub)
					print("[addNewUser]",sub.split("-"))
					if "-" in sub:
						subSplit = sub.split("-")
						if subSplit[1] == deptObj.dept_name:
							subDbList.append(subSplit[1])
					else:
						subDbList.append(sub)
			
			# print("[addNewUser | Before Try]",deptObj)
			# print("[addNewUser | Before Try]",subObj)
			
			try:
				multiDeptObj = Multipartment.objects.get(user = newuserobj1.id)
				multiDeptObj.dept = deptObj
				multiDeptObj.subDept = subObj
				multiDeptObj.save()
			except:
				Multipartment.objects.create(user_id = newuserobj1.id, dept = deptObj, subDept = subObj)

	
			print(newuserobj1.user_id)

			current_user_merchant_profile = get_object_or_404(MerchantProfile,user=newuserobj1.user_id)
		
			outlet_type = current_user_merchant_profile.outlet_type_selected
			# print(outlet_type)
			is_progress = current_user_merchant_profile.is_progress_complete
			# print(is_progress)
			is_network = current_user_merchant_profile.is_network_do_later
			# print(is_network)
			is_trail_plan = current_user_merchant_profile.has_assign_trail_plan
			# print(is_trail_plan)
			signup_stage_status = current_user_merchant_profile.signup_stage_status
			# print(signup_stage_status)
			# print('at the moment kaam difficult hai')


			# save the profile of the merchant

			# print('lagta hai dar mujeeeeeeeeeeeeeee')

			# print(abhi1)
			# user_permissionobj1 = MultiUserPermission.objects.filter(user_id = request.session.get('user_id')) 
			
			# print(user_permissionobj[0].user_id)
			# for res in user_permissionobj:
			
			#     # user_permissionobj = MultiUserPermission.objects.filter(user_id = abhi) 
			#     print(user_permissionobj)               
			#     user_permissionobj[0].field_id = user_permissionobj1[0].field
			#     user_permissionobj[0].user_id = user_permissionobj1[0].user.id
				
			#     user_permissionobj[0].save()
 

			all_permission_field = MultiUserPermission.objects.filter(user_id=slug)
			edit_id_list = []
			print(user_permission_data,"---user_permission_data")
			for apf in all_permission_field:
				print(apf.field_id,"---all fi")
				if apf.field_id not in user_permission_data:
					edit_id_list.append(apf.field_id)
				# else:
				#     user_permission_data.append(apf.field_id)
			

			print(edit_id_list,"-------field to edit ")

			# To Give Permission 
			for nj in user_permission_data:
				try:
					user_permissions_obj2 = get_object_or_404(MultiUserPermission,user_id=slug, field_id=nj)
				except:
					user_permissions_obj2 = None

				if user_permissions_obj2:
					user_permissions_obj2.is_active = 1
					user_permissions_obj2.save()
				else:
					user_permissions_obj2 = MultiUserPermission()
					user_permissions_obj2.field_id = nj
					user_permissions_obj2.user_id = new_user_created_id
					user_permissions_obj2.outlet_id = request.session.get('outlet_id')
					user_permissions_obj2.save()

			
			# To Remove Permission
			for field in edit_id_list:
				user_permissions_obj = get_object_or_404(MultiUserPermission,user_id=slug, field_id=field)
				if user_permissions_obj:
					print(user_permissions_obj.field_id,"field id",edit_id_list)
					user_permissions_obj.is_active = 0
					user_permissions_obj.save()

				# try:
				# except:
				#     user_permissions = MultiUserPermission()

				# user_permission = MultiUserPermission.objects.filter(user_id=slug)
				# print("\nUser Permission-->", user_permission)
				# user_permission.field_id = field

				# user_permission.user_id = new_user_created_id
				# user_permission.outlet_id = request.session.get('outlet_id')
				# user_permission.updated_at
				# user_permission.save()

			

			messages.success(request," User Edited successfully.") 
			url = reverse('customers:manage_user_outlet')
			return HttpResponseRedirect(url)

	return render(request,template_name,locals())

@login_required
def Customer_Add_Calls(request,custCode=0, template_name="merchant_site/customers/Customer_Add_Calls.html"):


	active_page_name = "Add_Call_Page"
	user_id=request.session.get("user_obj")
	print(user_id)
	print('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++')
	users=[]
	multi_details_obj=MultiUserDetails.objects.filter(outlet_id = request.session.get('outlet_id'))
	for multi in multi_details_obj:
		if not multi.first_name:
			continue
		temp = {}	
		name=""
		if multi.first_name:
			name+=multi.first_name
		if multi.last_name:
			name+= " " + multi.last_name
		temp['name']= name
		temp['user_id']=multi.user_id
		users.append(temp) 
	print("UserCHECK", users)
	

	if request.session.get('is_logged_in_superuser') == False:
		outlet_list = outlet_details.objects.filter(id__in=request.session.get('allowed_outlets_list'),company_id = request.session.get('company_id'),is_active=1,is_verified = 1)
	elif request.session.get('is_logged_in_superuser') == True:
		outlet_list = outlet_details.objects.filter(company_id = request.session.get('company_id'),is_active=1,is_verified = 1)
	

	# print(outlet_list)
	print('pychhhhhhhhhhhhharrrrrrrrrrrtttttttttttttt')
	print(request.session.get('outlet_id'))
	

	outletid = None
	if request.session.get('outlet_id') and outletid == None:
		outletid = int(request.session.get('outlet_id'))



	try:
		custobj = customer_details.objects.filter(id=custCode)
	except:
		custobj = None  

	try:
		customerobj = get_object_or_404(customer_details,id=custCode)
	except:
		customerobj = None

	# try:
	#     customerobj = get_object_or_404(customer_details,id=custCode,outlet_id=408 )
	# except:
	#     customerobj = get_object_or_404(customer_details,id=custCode,outlet_id=423 )

	# print(customerobj.customer_name)
	# print(customerobj.phone_no)
	# print(customerobj.email)
	
	
	Emails = customerobj.email
	user_mobile = customerobj.phone_no

	print(",,,,,,,,,,,,,,,xxxxxxxxx")


	if request.method == 'POST':
		postdata = request.POST.copy();
		press_btn = postdata.get('press_btn', None)
		customer_name = postdata.get('customer_name',None)
		call_status = postdata.get('call_status',None)
		notes = postdata.get('notes',None)
		interested = postdata.get('interested',None)
		product = postdata.get('product',None)
		call_purpose =  postdata.get('call_purpose',None)
		lead_status = postdata.get('lead_status',None)
		sendemail= postdata.get('send_email',None)
		sendsms = postdata.get('send_sms',None)

		print(postdata)
		print(customer_name)
		print('kksajdkjsadhjkashkdjsak')
		print(press_btn)
		print(lead_status)
		print(sendemail)
		print(sendsms)
		print('dsahksahkhdslhds')
		print(interested)
		print('producttttttttttttttttttttsssssssss batttttttttaaaaaaaaaa')
		print(product)
		startDT=postdata.get('startDT',None)
		endDT=postdata.get('endDT',None)
		schedwith=postdata.get('scheWith',None)
		print("START DATE",startDT)
		print(postdata,"postdata")
  
  
		tz = request.POST.get("timezone")
		print(tz,"TIMEZONEEEEEEEE")
		# tz = timezone(tz)

		print("[Inter]", startDT)
		print("[Inter]", endDT)

		startDT = startDT.split(":")
		print("startt",startDT)
		year = int(startDT[0])
		month = int(startDT[1])
		day = int(startDT[2])
		hour = int(startDT[3])
		minute = int(startDT[4])
		sec = int(startDT[5])
		startDTLocal = datetime(year, month, day, hour, minute, sec)
		startDTLocal.isoweekday()
		
		endDT = endDT.split(":")
		year = int(endDT[0])
		month = int(endDT[1])
		day = int(endDT[2])
		hour = int(endDT[3])
		minute = int(endDT[4])
		sec = int(endDT[5])
		endDTLocal = datetime(year, month, day, hour, minute, sec)

		print("[Inter] After:", startDT)
		print("[Inter] After:", endDT)

		if tz == "Asia/Kolkata" or "Asia/Calcutta" :
			startDT = startDTLocal
			endDT = endDTLocal
		else:
			startDTUTC = startDTLocal.astimezone(timezone("utc"))
			endDTUTC = endDTLocal.astimezone(timezone("utc"))
			today = datetime.now()
			currentTime  = today.astimezone(timezone("utc"))
			print('[currentTime]',currentTime)

			print("[Inter]", startDTUTC.strftime('%Z'))
			print("[Inter]",tz)
			
			startDTReplace = timezone(tz).localize(startDTUTC.replace(tzinfo= None))
			endDTReplace = timezone(tz).localize(endDTUTC.replace(tzinfo= None))
			
			print("[Inter]", startDTReplace.strftime('%Z'))
			
			startDT = startDTReplace.astimezone(timezone("Asia/Kolkata"))
			endDT = endDTReplace.astimezone(timezone("Asia/Kolkata"))
			
			print("[Inter]", startDT.strftime('%Z'))
			print("[Inter]", startDT.tzinfo)
	
		startDT = startDT.replace(tzinfo=None)
		endDT = endDT.replace(tzinfo=None)
		# startDT = str(startDT)
		# callTime = startDT.split(' ')[1]
		# startDT = startDT.split(' ')[0]
		try:
			cust_obj=customer_details.objects.get(id=custCode)
			print("cust-name",cust_obj.customer_name)
		except:
			cust_obj.customer_name = None

		kalnirnay_obj=Kalnirnay()
		kalnirnay_obj.title="Interaction with"+" "+cust_obj.customer_name
		kalnirnay_obj.customers=cust_obj
		kalnirnay_obj.color="#FFDAB9"
		kalnirnay_obj.daysOfWeek=startDTLocal.isoweekday()
		kalnirnay_obj.startTime=startDT
		kalnirnay_obj.endTime=endDT
		kalnirnay_obj.eventType="Customer"
		kalnirnay_obj.timeZone=tz
		kalnirnay_obj.recurring=postdata.get('eventPeriod',None)
		kalnirnay_obj.user_id=schedwith
		kalnirnay_obj.save()
  
		startDT = str(startDT)
		callTime = startDT.split(' ')[1]
		startDT = startDT.split(' ')[0]

		try:
			next_call = postdata.get("next_call",None)
		except:
			next_call = None

		if next_call:
			next_call_date = postdata.get("call_date",None)
			#converting date in proper format
			format_str = '%Y-%m-%d'  # The format
			datetime_obj =datetime.strptime(startDT, format_str)
			format_time_str = '%H:%M:%S'
			calldata = datetime.strptime(callTime, format_time_str)
			callTime=callTime.split(':')[1]
			calldata = str(calldata.hour)+':'+str(callTime)
			next_call_date1 = datetime_obj.date()
			next_call_time = calldata
		mobile_number = postdata.get("phone" ,None)
		
		addcallobj = new_Addcall_details()
		addcallobj.Prospect_Name = customer_name 

		addcallobj.Call_Status = call_status
		addcallobj.Notes = notes
		addcallobj.Interested = interested
		addcallobj.Products = product
		addcallobj.Call_Purpose = call_purpose
		addcallobj.Lead_Status = lead_status
		if outletid == 423:
			addcallobj.outlet_id = 423
		else:
			addcallobj.outlet_id = 408

		addcallobj.customer = custCode
		addcallobj.Mobile = mobile_number
		if user_id:
			addcallobj.user_id = user_id
		else:
			addcallobj.user_id = request.session.get('root_user_id')
		addcallobj.is_customer = 1
		if next_call == 'on' :
			addcallobj.schedule_Next_Call = 1
			addcallobj.schedule_Next_Call_date = next_call_date1
			addcallobj.schedule_Next_Call_time = next_call_time



		addcallobj.save()


		new_Addcall_details.objects.filter(customer=custCode).update(last_call=datetime.now())

		firstname = customer_name.strip().split(' ')[0]
		lastname = ' '.join((customer_name + ' ').split(' ')[1:]).strip()

		if sendemail == 'on':
			print('asdkljksaajdksjkjksjksjkjkjs')
			if interested == 'No':
				print('emailemaliemalaiemelaiemelaiemekle')
				message = render_to_string('merchant_site/emails/prospects/prospects_email1.html', locals())
			 
				user_email = ('We’re right here whenever you need us!', message, [Emails])
				#r = send_JMD_email_user(user_email)
				r = send_JMD_email_user_no_cc(user_email)
			elif interested == 'Yes':
				print('hiiiiiiiiiiiiiiiiiiiiiiiiiiiii')
				if product == 'Sales-Skoda':
					jmd_admin_detailsobj = get_object_or_404(JMD_Admin_Details,Product=product)
					# Admin_Email = jmd_admin_detailsobj.Email_Address
					print('sdjshdjkshukuj')
					#Admin_Email = 'valet.gonsalves@jmdcars.com'
					#Admin_Email = 'ruchi.w@skodajmd.com'
					Admin_Email = 'Prashanna.shetty@skodajmd.com'
					#Admin_Email = 'rahul@nucleusads.com'
					
					
				elif product == 'Sales-ISUZU-Passenger': 
					jmd_admin_detailsobj = get_object_or_404(JMD_Admin_Details,Product=product)
					# Admin_Email = jmd_admin_detailsobj.Email_Address
					# Admin_Email = 'rahul@nucleusads.com'
					# Admin_Email = 'uttarika@nucleus.in'
					# Admin_Email = 'drupad.menda@jmdcars.com'
					Admin_Email = 'luv.sherigar@jmdisuzu.com'

				elif product == 'Sales-ISUZU-Commercial': 
					jmd_admin_detailsobj = get_object_or_404(JMD_Admin_Details,Product=product)
					# Admin_Email = jmd_admin_detailsobj.Email_Address 
					Admin_Email = 'vipin.petkar@jmdisuzu.com'
					 
				elif product == 'Sales-All Other New Cars': 
					jmd_admin_detailsobj = get_object_or_404(JMD_Admin_Details,Product=product)
					# Admin_Email = jmd_admin_detailsobj.Email_Address 
					Admin_Email = 'kavita.thadani@jmdcars.com'
					
				elif product == 'User Cars_Buy / Sell': 
					jmd_admin_detailsobj = get_object_or_404(JMD_Admin_Details,Product=product)
					# Admin_Email = jmd_admin_detailsobj.Email_Address 
					Admin_Email = 'abhishek.shelke@jmdcars.com'
				  
				elif product == 'Insurance': 
					jmd_admin_detailsobj = get_object_or_404(JMD_Admin_Details,Product=product)
					# Admin_Email = jmd_admin_detailsobj.Email_Address 
					Admin_Email = 'geeta.todur@jmdcars.com'
					
				elif product == 'Service - All Cars': 
					jmd_admin_detailsobj = get_object_or_404(JMD_Admin_Details,Product=product)
					# Admin_Email = jmd_admin_detailsobj.Email_Address 
					Admin_Email = 'wm.nerul@skodajmd.com'
				   
				elif product == 'Finance - Additional Car Loans': 
					jmd_admin_detailsobj = get_object_or_404(JMD_Admin_Details,Product=product)
					# Admin_Email = jmd_admin_detailsobj.Email_Address 
					Admin_Email = 'valet.gonsalves@jmdcars.com'
					
				elif product == 'Finance - Additional Home Loans for New / Existing':
					jmd_admin_detailsobj = get_object_or_404(JMD_Admin_Details,Product=product)
					# Admin_Email = jmd_admin_detailsobj.Email_Address 
					# Admin_Email = 'vijay.shinde@jmdcars.com'
					Admin_Email = 'vijay.negi@jmdcars.com'

				elif product == 'Car Leasing':
					jmd_admin_detailsobj = get_object_or_404(JMD_Admin_Details,Product=product)
					# Admin_Email = jmd_admin_detailsobj.Email_Address 
					Admin_Email = 'kavita.thadani@jmdcars.com'

				elif product == 'Car Grooming':
					jmd_admin_detailsobj = get_object_or_404(JMD_Admin_Details,Product=product)
					# Admin_Email = jmd_admin_detailsobj.Email_Address
					# Admin_Email = 'renu.rupani@jmdcars.com'
					Admin_Email = 'renu.rupani@jmdcars.com'

				contact_name =jmd_admin_detailsobj.JMD_Contact_Person
				print(contact_name)

				jmdadmin_first_name = contact_name.strip().split(' ')[0]
				jmdadmin_lastname = ' '.join((contact_name + ' ').split(' ')[1:]).strip()

				print(jmdadmin_first_name)
				caller_id = request.session.get('user_obj')
				print("CALLLLLLLLLLLERRRRRRRRRRRRRRRRRRRRRRRRRRRR")
				if caller_id:
					print(caller_id)
					my_user_obj = get_object_or_404(User, id=caller_id)
					print(my_user_obj.first_name)
					full_name = my_user_obj.first_name +' '+ my_user_obj.last_name
					print(full_name)
					print("CALLLLLLLLLLLERRRRRRRRRRRRRRRRRRRRRRRRRRRR")

				else:
					caller_id = request.session.get('root_user_id')
					my_user_obj = get_object_or_404(User, id=caller_id)
					full_name = my_user_obj.first_name +' '+ my_user_obj.last_name
				message = render_to_string('merchant_site/emails/prospects/prospects_email11.html', locals())
				admin_email = ('You’ve received a new lead!', message, [Admin_Email])

				r = send_JMD_email_user(admin_email)

			if product != None:
				print('knkldnlkaslkdjsalkdskljhdsj')
				if  product == 'Sales-Skoda':
					message = render_to_string('merchant_site/emails/prospects/prospects_email2.html', locals())
					user_email = ('Thank you for your interest in a Skoda car!', message, [Emails])
				elif product == 'Sales-ISUZU-Passenger': 
					message = render_to_string('merchant_site/emails/prospects/prospects_email3.html', locals())
					user_email = ('Thank you for your interest in an ISUZU car!', message, [Emails])
				elif product == 'Sales-ISUZU-Commercial': 
					message = render_to_string('merchant_site/emails/prospects/prospects_email4.html', locals())
					user_email = ('Thank you for your interest in an ISUZU car!', message, [Emails])
				elif product == 'Sales-All Other New Cars': 
					message = render_to_string('merchant_site/emails/prospects/prospects_email5.html', locals())
					user_email = ('Thank you for your interest in buying a new car!', message, [Emails])
				elif product == 'User Cars_Buy / Sell': 
					message = render_to_string('merchant_site/emails/prospects/prospects_email6.html', locals())
					user_email = ('Thank you for your interest in buying / selling a used car!', message, [Emails])
				elif product == 'Insurance': 
					message = render_to_string('merchant_site/emails/prospects/prospects_email7.html', locals())
					user_email = ('Thank you for your interest in purchasing insurance!', message, [Emails])
				elif product == 'Service - All Cars': 
					message = render_to_string('merchant_site/emails/prospects/prospects_email8.html', locals())
					user_email = ('Thank you for your interest in getting your car serviced!', message, [Emails])
				elif product == 'Finance - Additional Car Loans': 
					message = render_to_string('merchant_site/emails/prospects/prospects_email9.html', locals())
					user_email = ('Thank you for your interest in acquiring a car loan!', message, [Emails])
				elif product == 'Finance - Additional Home Loans for New / Existing':
					message = render_to_string('merchant_site/emails/prospects/prospects_email10.html', locals())
					user_email = ('Thank you for your interest in acquiring a home loan!', message, [Emails])
				elif product == 'Car Leasing':
					message = render_to_string('merchant_site/emails/prospects/prospects_email12.html', locals())
					user_email = ('Thank you for your interest in car leasing!', message, [Emails])

				elif product == 'Car Grooming':
					message = render_to_string('merchant_site/emails/prospects/prospects_email13.html', locals())
					user_email = ('Thank you for your interest in getting your car groomed!', message, [Emails]) 

				
				r = send_JMD_email_user_no_cc(user_email)

		if sendsms == 'on':
			if interested == 'No':
				print('ssmsmsmsmsmsmsmsmsmsmsmsmsmmsmsmsmsmsmsm')
				sms1="We appreciate that you are not inclined to avail our services at this moment."
				sms2=" We would love to be of service to you in the future."
				sms3= "Please call Renu Rupani - 9867551846."
				smsMessage = str(sms1)+str(sms2)+str(sms3)
				print(smsMessage)
				quotedSMS = quote(smsMessage)
				print("kkkkkkkk")
				#url = 'http://ems-api.startenterprise.com:8080/bulksms/bulksms?username=NUCLEUSD&password=myself30&type=5&dlr=1&destination='+user_mobile+'&source=XIRCLS&message='+quotedSMS+'&url='   
				#url = 'http://www.smsjust.com​/sms/user/urlsms.php?username=jmdautoindia&pass=$s8U2n@K&senderid=JMDCAR&dest_mobileno='+user_mobile+'&message='+quotedSMS+'&response=Y'
				url = 'http://www.smsjust.com​/sms/user/urlsms.php?username=jmdautoindia&pass=$s8U2n@K&senderid=JMDCAR&dest_mobileno='+user_mobile+'&message='+quotedSMS+'&response=Y'
				print(url)
				r = requests.get(url)

			elif interested == 'Yes':

				smsMessage = ' New Lead :' + ' ' + str(customer_name)+ ' - ' + str(user_mobile) +'.'+' Interested in ' + str(product) + '. ' + str(notes)
				if product == 'Sales-Skoda':
					jmd_admin_detailsobj = get_object_or_404(JMD_Admin_Details,Product=product)
					# Admin_mobile = jmd_admin_detailsobj.Mobile 
					#Admin_mobile = '7981991923'
					#manager_mobile = '8805040795'
					# Admin_mobile = '9870036363'
					# Admin_mobile = '9820957207'
					# Admin_mobile = '9867551844'
					# Admin_mobile = '7738333900'
					Admin_mobile = '7738150497'
					manager_mobile = '9867551846'

				elif product == 'Sales-ISUZU-Passenger': 
					jmd_admin_detailsobj = get_object_or_404(JMD_Admin_Details,Product=product)
					# Admin_mobile = jmd_admin_detailsobj.Mobile 
					Admin_mobile = '9867551867'
					manager_mobile = '9867551846'

				elif product == 'Sales-ISUZU-Commercial': 
					jmd_admin_detailsobj = get_object_or_404(JMD_Admin_Details,Product=product)
					# Admin_mobile = jmd_admin_detailsobj.Mobile 
					Admin_mobile = '9004033349'
					manager_mobile = '9867551846'

				elif product == 'Sales-All Other New Cars': 
					jmd_admin_detailsobj = get_object_or_404(JMD_Admin_Details,Product=product)
					# Admin_mobile = jmd_admin_detailsobj.Mobile 
					Admin_mobile = '9867551829'
					manager_mobile = '9867551846'

				elif product == 'User Cars_Buy / Sell': 
					jmd_admin_detailsobj = get_object_or_404(JMD_Admin_Details,Product=product)
					# Admin_mobile = jmd_admin_detailsobj.Mobile 
					Admin_mobile = '9987163634'
					manager_mobile = '9867551846'

				elif product == 'Insurance': 
					jmd_admin_detailsobj = get_object_or_404(JMD_Admin_Details,Product=product)
					# Admin_mobile = jmd_admin_detailsobj.Mobile 
					Admin_mobile = '9867503114'
					manager_mobile = '9867551846'

				elif product == 'Service - All Cars': 
					jmd_admin_detailsobj = get_object_or_404(JMD_Admin_Details,Product=product)
					# Admin_mobile = jmd_admin_detailsobj.Mobile 
					Admin_mobile = '9867532035'
					manager_mobile = '9867551846'

				elif product == 'Finance - Additional Car Loans': 
					jmd_admin_detailsobj = get_object_or_404(JMD_Admin_Details,Product=product)
					# Admin_mobile = jmd_admin_detailsobj.Mobile 
					Admin_mobile = '9867551844'
					manager_mobile = '9867551846'
					
				elif product == 'Finance - Additional Home Loans for New / Existing':
					jmd_admin_detailsobj = get_object_or_404(JMD_Admin_Details,Product=product)
					# Admin_mobile = jmd_admin_detailsobj.Mobile 
					# Admin_mobile = '9867551862'
					Admin_mobile = '7738150555'
					manager_mobile = '9867551846'
					
				elif product == 'Car Leasing':
					jmd_admin_detailsobj = get_object_or_404(JMD_Admin_Details,Product=product)
					# Admin_mobile = jmd_admin_detailsobj.Mobile 
					Admin_mobile = '9867551829'
					manager_mobile = '9867551846'

				elif product == 'Car Grooming':
					jmd_admin_detailsobj = get_object_or_404(JMD_Admin_Details,Product=product)
					# Admin_mobile = jmd_admin_detailsobj.Mobile 
					Admin_mobile = '9867551846'
					manager_mobile = '9867551846'



				quotedSMS = quote(smsMessage)
				print("kkkkkkkk")
				#url = 'http://ems-api.startenterprise.com:8080/bulksms/bulksms?username=NUCLEUSD&password=myself30&type=5&dlr=1&destination='+Admin_mobile+'&source=XIRCLS&message='+quotedSMS+'&url='
				#url_admin = 'http://ems-api.startenterprise.com:8080/bulksms/bulksms?username=NUCLEUSD&password=myself30&type=5&dlr=1&destination='+manager_mobile+'&source=XIRCLS&message='+quotedSMS+'&url='
				#url = 'http://www.smsjust.com​/sms/user/urlsms.php?username=jmdautoindia&pass=$s8U2n@K&senderid=JMDCAR&dest_mobileno='+Admin_mobile+'&message='+quotedSMS+'&response=Y'
				#url_admin = 'http://www.smsjust.com​/sms/user/urlsms.php?username=jmdautoindia&pass=$s8U2n@K&senderid=JMDCAR&dest_mobileno='+manager_mobile+'&message='+quotedSMS+'&response=Y'

				url = 'http://www.smsjust.com​/sms/user/urlsms.php?username=jmdautoindia&pass=$s8U2n@K&senderid=JMDCAR&dest_mobileno='+Admin_mobile+'&message='+quotedSMS+'&response=Y'
				url_admin = 'http://www.smsjust.com​/sms/user/urlsms.php?username=jmdautoindia&pass=$s8U2n@K&senderid=JMDCAR&dest_mobileno='+manager_mobile+'&message='+quotedSMS+'&response=Y'
				print(url)
				print(url_admin)
				
				r = requests.get(url)
				r = requests.get(url_admin)

			if product != None :
				print('jklsdfdjkhjdsfhjklfdshljhfdj')
				if  product == 'Sales-Skoda':
					smsMessage = "Thank you for your interest in a Skoda car. Ruchi from our Skoda Sales Team will call you shortly."
				elif product == 'Sales-ISUZU-Passenger': 
					smsMessage = "Thank you for your interest in an ISUZU car. Luv from our ISUZU Sales Team will call you shortly."
				elif product == 'Sales-ISUZU-Commercial': 
					smsMessage = "Thank you for your interest in an ISUZU car. Vipin from our ISUZU Sales Team will call you shortly."
				elif product == 'Sales-All Other New Cars': 
					smsMessage = "Thank you for your interest in an ISUZU car. Kavita from our Car Sales Team will call you shortly."
				elif product == 'User Cars_Buy / Sell': 
					smsMessage = "Thank you for your interest in buying / selling a used car. Abhishek from our Car Sales Team will call you shortly."
				elif product == 'Insurance': 
					smsMessage = "Thank you for your interest in purchasing insurance. Geeta from our Insurance Team will call you shortly."
				elif product == 'Service - All Cars': 
					smsMessage = "Thank you for your interest in purchasing a car. Prem from our Car Servicing Team will call you shortly."
				elif product == 'Finance - Additional Car Loans': 
					smsMessage = "Thank you for your interest in acquiring an additional car loan on your existing car. Valet from our Finance Team will call you shortly."
				elif product == 'Finance - Additional Home Loans for New / Existing':
					smsMessage = "Thank you for your interest in acquiring a home loan/ additional home loan. Vijay from our Finance Team will call you shortly."
				elif product == 'Car Leasing':
					smsMessage = "Thank you for your interest in car leasing. Kavita from our Car Leasing Team will call you shortly."
				elif product == 'Car Grooming':
					smsMessage = "Thank you for your interest in getting your car groomed. Renu from the JMD Team will call you shortly."
				 
				quotedSMS = quote(smsMessage)
				print("kkkkkkkk")
				#url = 'http://ems-api.startenterprise.com:8080/bulksms/bulksms?username=NUCLEUSD&password=myself30&type=5&dlr=1&destination='+user_mobile+'&source=XIRCLS&message='+quotedSMS+'&url='
				##url = 'http://www.smsjust.com​/sms/user/urlsms.php?username=jmdautoindia&pass=$s8U2n@K&senderid=JMDCAR&dest_mobileno='+user_mobile+'&message='+quotedSMS+'&response=Y'
				url = 'http://www.smsjust.com​/sms/user/urlsms.php?username=jmdautoindia&pass=$s8U2n@K&senderid=JMDCAR&dest_mobileno='+user_mobile+'&message='+quotedSMS+'&response=Y'
				#url = 'http://www.smsjust.com​/sms/user/urlsms.php?username=jmdautoindia&pass=$s8U2n@K&senderid=JMDCAR&dest_mobileno=8898134861&message=XXXX&response=Y'
				print(url)
				print('ssssssssssssssssssssssssssssssssssssssssssssss')
				r = requests.get(url)


		try:
			if request.session['multi_user_id']:
				multiUserId = request.session['multi_user_id']
				print('MULLLLLLTIIII---->',multiUserId)
				multiUserObj = MultiUserDetails.objects.get(user = multiUserId)
				multiUserObj.totalInt = int(multiUserObj.totalInt) + 1
				multiUserObj.save()
				today = datetime.now()
				print(today)
				taskDb = task_details.objects.filter(taskType__name = "Interaction with customers", start_date__lte=today, due_date__gte = today).exclude(status = "Completed")
				for task in taskDb:
					print("[TASK]", task.task_name, task.assign_to)
					if task.assign_to == "User":
						print("[TASK] In User")
						print("[TASK]", multiUserObj)
						if task.assignToUser == multiUserObj:
							print("[TASK] In User if")
							if int(task.remaining) > 0:
								task.remaining = int(task.remaining) - 1
								if int(task.remaining) > 0:
									task.status = "In Process"
								else:
									task.status = "Completed"
							task.save()
					elif task.assign_to == "Dept":
						print("[TASK] In Dept")
						print("[TASK]", multiUserObj.first_name)
						deptObj = Multipartment.objects.get(user = multiUserObj)
						if task.assignToDept == deptObj.dept:
							if int(task.remaining) > 0:
								print("[TASK] In Dept if")
								task.remaining = int(task.remaining) - 1
								if int(task.remaining) > 0:
									task.status = "In Process"
								else:
									task.status = "Completed"
					elif task.assign_to == "subDept":
						print("[TASK] In subDept")
						print("[TASK]", multiUserObj.first_name)
						deptObj = Multipartment.objects.get(user = multiUserObj)
						if task.assignToSub == deptObj.subDept:
							if int(task.remaining) > 0:
								print("[TASK] In subDept if")
								task.remaining = int(task.remaining) - 1
								if int(task.remaining) > 0:
									task.status = "In Process"
								else:
									task.status = "Completed"
					notes = f'{multiUserObj.first_name} interacted with customer {customerobj.customer_name}'
					print('NOTESSSSSSSSSSSSS--->',notes)
					task_history_obj = task_history(task= task, user= multiUserObj, notes=notes, type_id=customerobj.id)
					task_history_obj.save()
					task.save()
		except Exception as e:
			print("[TASK] Exception:", e)

		messages.add_message(request, messages.SUCCESS, 'Your call was added successfully', fail_silently=True)
		# if press_btn == 'SAVE':
		#     url = reverse('customers:Customer_Add_Calls', kwargs={'custCode': custCode})
		#     return HttpResponseRedirect(url)
		if press_btn == 'SAVE & CLOSE':
			# url = reverse('prospects:view_prospect', kwargs={'custCode': custCode})\
			url = reverse('customers:get_my_customers')
			return HttpResponseRedirect(url)

	return render(request,template_name,locals())

@login_required
def lead_Add_Calls(request,leadCode=0, template_name="merchant_site/customers/lead_Add_Calls.html"):
    
	users=[]
	dept_obj=department.objects.get(id=3)
	logger.info('info test')
	logger.debug('debug test')
	multipartment_obj=Multipartment.objects.filter(dept_id=3)
	for multipartment in multipartment_obj:
		logger.warning("usersss"+str(multipartment.user_id))
		temp = {}
		user_id=multipartment.user_id
		print("usersss",user_id)
		logger.debug("usersss",user_id)
		try:
			multi_details=MultiUserDetails.objects.get(id=user_id,is_trash=0)
			temp['name']= multi_details.first_name + ' ' + multi_details.last_name
			temp['user_id']=multi_details.user_id
			users.append(temp)
		except:pass
	print("UserCHECK", users)

	active_page_name = "lead_Add_Call_Page"
	user_id=request.session.get("user_obj")
	print(user_id)
	print(leadCode,"lead no")
	if request.session.get('is_logged_in_superuser') == False:
		outlet_list = outlet_details.objects.filter(id__in=request.session.get('allowed_outlets_list'),company_id = request.session.get('company_id'),is_active=1,is_verified = 1)
	elif request.session.get('is_logged_in_superuser') == True:
		outlet_list = outlet_details.objects.filter(company_id = request.session.get('company_id'),is_active=1,is_verified = 1)

	outletid = None

	call_obj = new_Addcall_details.objects.filter(lead_id=leadCode).order_by('id')

	if call_obj:
		all_call_list = []
		for onm in call_obj:
			temp={}
			try:
				prod_obj = get_object_or_404(product_details,id=onm.Products)
				temp['Products'] = prod_obj.product_name
			except:
				prod_obj = None
			temp['Call_Purpose'] = onm.Call_Purpose
			temp['Call_Status'] = onm.Call_Status
			temp['Interested'] = onm.Interested
			temp['schedule_Next_Call'] = int(onm.schedule_Next_Call)
			temp['schedule_Next_Call_date'] = onm.schedule_Next_Call_date
			temp['schedule_Next_Call_time'] = onm.schedule_Next_Call_time
			temp['last_call'] = onm.last_call
			temp['id'] = onm.id
			all_call_list.append(temp)


	if request.session.get('outlet_id') and outletid == None:
		outletid = int(request.session.get('outlet_id'))
		product_details_obj = product_details.objects.filter(outlet_id=outletid,is_trash=0)

	outlet_email_id = "info@xircls.com"
	try:
		lead_obj = get_object_or_404(lead_details,id=leadCode)
		
		outlet_obj = get_object_or_404(outlet_details,id=outletid)
		if outlet_obj.outlet_sender_id:
			outlet_email_id = outlet_obj.outlet_sender_id
	except:
		lead_obj = None
		outlet_obj = None
		
	to_email = lead_obj.email
	user_mobile = lead_obj.phone_no

	if request.method == 'POST':
		postdata = request.POST.copy()
		press_btn = postdata.get('press_btn', None)
		customer_name = postdata.get('customer_name',None)
		call_status = postdata.get('call_status',None)
		notes = postdata.get('notes',None)
		interested = postdata.get('interested',None)
		product = postdata.get('product',None)
		call_purpose =  postdata.get('call_purpose',None)
		lead_status = postdata.get('lead_status',None)
		sendemail= postdata.get('send_email',None)
		sendsms = postdata.get('send_sms',None)
		startDT=postdata.get('startDT',None)
		endDT=postdata.get('endDT',None)
		schedwith=postdata.get('scheWith',None)
		# print("START DATE",startDT)
		# print(postdata,"postdata")

		tz = request.POST.get("timezone")
		# print(tz,"TIMEZONEEEEEEEE")
		# tz = timezone(tz)
		try:
			next_call = postdata.get("next_call",None)
		except:
			next_call = None
# 
		# print("[Inter]", startDT)
		# print("[Inter]", endDT)
		if next_call == 'on':
			startDT = startDT.split(":")

			print("startt",startDT)
			year = int(startDT[0])
			month = int(startDT[1])
			day = int(startDT[2])
			hour = int(startDT[3])
			minute = int(startDT[4])
			sec = int(startDT[5])
			startDTLocal = datetime(year, month, day, hour, minute, sec)
			startDTLocal.isoweekday()
			endDT = endDT.split(":")
			year = int(endDT[0])
			month = int(endDT[1])
			day = int(endDT[2])
			hour = int(endDT[3])
			minute = int(endDT[4])
			sec = int(endDT[5])
			endDTLocal = datetime(year, month, day, hour, minute, sec)

			print("[Inter] After:", startDT)
			print("[Inter] After:", endDT)
		if next_call == 'on' :
			if tz == "Asia/Kolkata" or "Asia/Calcutta" :
				startDT = startDTLocal
				endDT = endDTLocal
			else:
				startDTUTC = startDTLocal.astimezone(timezone("utc"))
				endDTUTC = endDTLocal.astimezone(timezone("utc"))
				today = datetime.now()
				currentTime  = today.astimezone(timezone("utc"))
				print('[currentTime]',currentTime)

				print("[Inter]", startDTUTC.strftime('%Z'))
				print("[Inter]",tz)
				
				startDTReplace = timezone(tz).localize(startDTUTC.replace(tzinfo= None))
				endDTReplace = timezone(tz).localize(endDTUTC.replace(tzinfo= None))
				
				print("[Inter]", startDTReplace.strftime('%Z'))
				
				startDT = startDTReplace.astimezone(timezone("Asia/Kolkata"))
				endDT = endDTReplace.astimezone(timezone("Asia/Kolkata"))
				
				print("[Inter]", startDT.strftime('%Z'))
				print("[Inter]", startDT.tzinfo)
		
			startDT = startDT.replace(tzinfo=None)
			endDT = endDT.replace(tzinfo=None)

		
			kalnirnay_obj=Kalnirnay()
			kalnirnay_obj.title="Interaction with"+" "+lead_obj.customer_name
			kalnirnay_obj.leads=lead_obj
			kalnirnay_obj.color="green"
			
			kalnirnay_obj.daysOfWeek=startDTLocal.isoweekday()
			kalnirnay_obj.startTime=startDT
			kalnirnay_obj.endTime=endDT
			kalnirnay_obj.eventType="Lead"
			kalnirnay_obj.timeZone=tz
			kalnirnay_obj.recurring=postdata.get('eventPeriod',None)
			kalnirnay_obj.user_id=schedwith
			kalnirnay_obj.save()

			startDT = str(startDT)
			callTime = startDT.split(' ')[1]
			startDT = startDT.split(' ')[0]
  
		
		if next_call:
			# next_call_date = postdata.get("call_date",None)
			#converting date in proper format
			format_str = '%Y-%m-%d' # The format
			# format_str = '%d-%m-%Y' # The format
			datetime_obj = datetime.strptime(startDT, format_str)
			format_time_str = '%H:%M:%S'
			calldata = datetime.strptime(callTime, format_time_str)
			callTime=callTime.split(':')[1]
			calldata = str(calldata.hour)+':'+str(callTime)
			next_call_date1 = datetime_obj.date()
			#converting date in proper format

			next_call_time = calldata
			# raise Exception ('this is startDT---'+str(startDT)+'---'+str(next_call)+'-----'+str(next_call_date1)+'-----'+str(next_call_time))
		mobile_number = postdata.get("phone" ,None)
		
		addcallobj = new_Addcall_details()
		addcallobj.Prospect_Name = customer_name 

		addcallobj.Call_Status = call_status
		addcallobj.Notes = notes
		addcallobj.Interested = interested
		addcallobj.Products = product
		addcallobj.Call_Purpose = call_purpose
		addcallobj.Lead_Status = lead_status
		addcallobj.outlet = outlet_obj

		lead_de = get_object_or_404(lead_details,id=leadCode)
		
		addcallobj.lead_id = lead_de
		addcallobj.Mobile = mobile_number
		if user_id:
			addcallobj.user_id = user_id
		else:
			addcallobj.user_id = request.session.get('root_user_id')
		
		if next_call == 'on' :
			addcallobj.schedule_Next_Call = 1
			addcallobj.schedule_Next_Call_date = next_call_date1
			addcallobj.schedule_Next_Call_time = next_call_time
			
		addcallobj.save()

		try:
			if request.session['multi_user_id']:
				multiUserId = request.session['multi_user_id']
				print('MULLLLLLTIIII---->',multiUserId)
				multiUserObj = MultiUserDetails.objects.get(user = multiUserId)
				multiUserObj.totalInt = int(multiUserObj.totalInt) + 1
				multiUserObj.save()
				today = datetime.now()
				taskDb = task_details.objects.filter(taskType__name = "Interaction with leads",start_date__lte=today, due_date__gte = today).exclude(status = "Completed")
				for task in taskDb:
					print("[TASK]", task.task_name, task.assign_to)
					if task.assign_to == "User":
						print("[TASK] In User")
						print("[TASK]", multiUserObj)
						if task.assignToUser == multiUserObj:
							print("[TASK] In User if")
							if int(task.remaining) > 0:
								task.remaining = int(task.remaining) - 1
								if int(task.remaining) > 0:
									task.status = "In Process"
								else:
									task.status = "Completed"
							task.save()
					elif task.assign_to == "Dept":
						print("[TASK] In Dept")
						print("[TASK]", multiUserObj.first_name)
						deptObj = Multipartment.objects.get(user = multiUserObj)
						if task.assignToDept == deptObj.dept:
							if int(task.remaining) > 0:
								print("[TASK] In Dept if")
								task.remaining = int(task.remaining) - 1
								if int(task.remaining) > 0:
									task.status = "In Process"
								else:
									task.status = "Completed"
					elif task.assign_to == "subDept":
						print("[TASK] In subDept")
						print("[TASK]", multiUserObj.first_name)
						deptObj = Multipartment.objects.get(user = multiUserObj)
						if task.assignToSub == deptObj.subDept:
							if int(task.remaining) > 0:
								print("[TASK] In subDept if")
								task.remaining = int(task.remaining) - 1
								if int(task.remaining) > 0:
									task.status = "In Process"
								else:
									task.status = "Completed"

					notes = f'{multiUserObj.first_name} interacted with lead {customer_name}'
					print('NOTESSSSSSSSSSSSS--->',notes)
					task_history_obj = task_history(task= task, user= multiUserObj, notes=notes, type_id=lead_de.id)
					task_history_obj.save()
					task.save()
		except Exception as e:
			print("[TASK] Exception:", e)

		leadObj = lead_details.objects.get(id = leadCode)
		leadObj.last_call_date = datetime.now()
		leadObj.save()


		

		print('interested',interested,"sendsms",sendsms,"sendemail",sendemail)
		if sendemail == 'on':
			Admin_Email = outlet_email_id
			if interested == 'No':
				message = "We’re right here whenever you need us!"
			 
				email = EmailMessage(customer_name, body=message, from_email=Admin_Email,to=[to_email])
				email.content_subtype = 'html'
				email.send()
			elif interested == 'Yes':
				message = "You’ve received a new lead!"
				email = EmailMessage(customer_name, body=message, from_email=Admin_Email,to=[to_email])
				email.content_subtype = 'html'
				email.send()


		if sendsms == 'on':
			if interested == 'No':
				sms1="We appreciate that you are not inclined to avail our services at this moment."
				sms2=" We would love to be of service to you in the future."
				smsMessage = str(sms1)+str(sms2)
				quotedSMS = quote(smsMessage)
				url = 'http://ems-api.startenterprise.com:8080/bulksms/bulksms?username=NUCLEUSD&password=myself30&type=5&dlr=1&destination='+user_mobile+'&source=XIRCLS&message='+quotedSMS+'&url='   
				print(url)
				r = requests.get(url)


		messages.add_message(request, messages.SUCCESS, 'Your call was added successfully', fail_silently=True)

		if press_btn == 'SAVE':
			url = reverse('customers:add_calls_lead',kwargs={'leadCode':leadCode})
			return HttpResponseRedirect(url)
		if press_btn == 'SAVE & CLOSE':
			url = reverse('customers:leads_dashboard')
			return HttpResponseRedirect(url)

	return render(request,template_name,locals())

@login_required(login_url='/merchant-login/')
def scheduled_Call_list(request, template_name='merchant_site/customers/Cust_schedule_Call_list.html'):

	outletid = request.session.get('outlet_id') 
	print(outletid)
	todays_date = datetime.now().date()
	xx=todays_date.strftime('%Y%m%d')
	print(outletid)
	cursor = connection.cursor()
	try:
		# cursor.execute('''SELECT * FROM `xl925_new_Add_Call_Details` WHERE  `schedule_Next_Call` = '1'  AND `outlet_id` = {1}
		#     AND `schedule_Next_Call_date` >= '{1}' ORDER BY `schedule_Next_Call_date` ASC
		#     '''.format(outletid,xx,outletid))
		print("CCCCCCCCCCC2222222222")
		if outletid == 423:
			print("CCCCCCCCCCC2222222222333333333")
			cursor.execute('''SELECT * FROM `xl925_new_Add_Call_Details` WHERE  `schedule_Next_Call` = '1'  AND `outlet_id` = 423
				AND `schedule_Next_Call_date` >= '{0}' ORDER BY `schedule_Next_Call_date` ASC
				'''.format(xx))
			addcallobj = dictfetchall(cursor) 
		else:
			print("CCCCCCC3333333333")
			cursor.execute('''SELECT * FROM `xl925_new_Add_Call_Details` WHERE  `schedule_Next_Call` = '1'  AND `outlet_id` = 408
				AND `schedule_Next_Call_date` >= '{0}' ORDER BY `schedule_Next_Call_date` ASC
				'''.format(xx))
			addcallobj = dictfetchall(cursor)   
	except:
		addcallobj = None

	print(addcallobj)
	list1=[]
	for i in addcallobj:
		list1.append(i)
	print(list1)
	print(len(list1))    


	if addcallobj:
		addcallobj_list=[]
		for i in addcallobj:
			if i['schedule_Next_Call_date']  >= todays_date:
				addcallobj_list.append(i) 

		print(addcallobj_list)  


		offerreportCount = len(addcallobj)
		print(offerreportCount)
		reportObj = None
		if offerreportCount > 0:        
			paginator = Paginator((addcallobj), 25)  # Show 25 contacts per page
			page = request.GET.get('page')
			try:
				reportObj = paginator.page(page)
			except PageNotAnInteger:
				# If page is not an integer, deliver first page.
				reportObj = paginator.page(1)
			except EmptyPage:
				# If page is out of range (e.g. 9999), deliver last page of results.
				reportObj = paginator.page(paginator.num_pages)



	return render(request,template_name,locals())

def allcustomerdetails(request):

	print("yessssssssss111111")
	# outlet_id=request.session.get('outlet_id')
	
	if request.method == "POST":
		postdata =request.POST.copy()
		print(postdata)
		outlet_id = postdata.get('outlet_id')
		print("000000 outlet id",outlet_id)
		cust_mob = postdata.get('mobilenumber')
		print('customer mobileeeeeee',cust_mob)
		send_mail = postdata.get('send_mail')
		print('customers mailllllllllll',send_mail)
		customer_id = postdata.get('customer_id')
		print('customers iddddd',customer_id)
		spon_reward_id = postdata.get('spon_reward_id')



	data = ""
	showpoup = False
	message = ""
	todays_date = datetime.now()
	if cust_mob:
		customers_list = customer_details.objects.filter(Q(phone_no=cust_mob) | Q(email=cust_mob)).order_by('-created_at')

		result_data = []
		for customers in customers_list:

			cust_id = customers.id
			cust_name = customers.customer_name 
			print(cust_id)

			try:
				is_pivileged_obj = get_object_or_404(privileged_customers_subgroup,~Q(outlet_id=outlet_id),customer_id = customers.id)
			except:
				is_pivileged_obj = None

			try:
				host_obj = get_object_or_404(host_privileged_info, outlet_id = outlet_id,is_active=1)
				discount_rewarded = host_obj.discount
			except:
				host_obj = None
				discount_rewarded = None
				

			if is_pivileged_obj and host_obj:
				print("22222222222-- here--------22")

				
				cust_id = customers.id
				cust_name = customers.customer_name
				cust_grp = is_pivileged_obj.sub_group_name
				

				sponsor_amount ,fixed_amount,frequency,start_date,end_date,sponsorship_expiry_date,max_spend_range,min_spend_range,reward_category,reward_subcategory,outletname = 0,0,0,"","","",0,0,"","",""
				# print(is_pivileged_obj.outlet_id.id)
				# print('@@@@@@@@@@@@@@@')
				##based on what type of privillege customer group fetch exact same sponsered rewards
				# sponsor_privileged_xircl_info_obj = get_object_or_404(sponsor_privileged_xircl_info,host_outlet=outlet_id,outlet_id = is_pivileged_obj.outlet_id.id,customer_category=cust_grp)
				
				try:
					sponsor_privileged_xircl_info_obj = get_object_or_404(sponsor_privileged_xircl_info,host_outlet=outlet_id,outlet_id = is_pivileged_obj.outlet_id.id,customer_category=cust_grp,is_active=1)
				except:
					sponsor_privileged_xircl_info_obj = None
				
			   
				# sponsor_privileged_xircl_info_obj = get_object_or_404(sponsor_privileged_xircl_info,host_outlet=outlet_id,outlet_id = is_pivileged_obj.outlet_id.id)
				
			
				if sponsor_privileged_xircl_info_obj:
					#check expeiry date , frequency & amount fixed amount
					sponsorship_start_date = sponsor_privileged_xircl_info_obj.sponsorship_start_date
					sponsorship_expiry_date = sponsor_privileged_xircl_info_obj.sponsorship_expiry_date
					frequency_per_cust = sponsor_privileged_xircl_info_obj.frequency_per_cust
					fixed_amount_per_transaction = sponsor_privileged_xircl_info_obj.fixed_amount_per_transaction
					number_of_months = sponsor_privileged_xircl_info_obj.number_of_months

					sponsor_amount = sponsor_privileged_xircl_info_obj.sponsor_amount
					sponsor_amt_monthly_limit = sponsor_privileged_xircl_info_obj.sponsor_amt_monthly_limit 


					print(sponsorship_start_date)
					print(type(sponsorship_start_date))
					print(sponsorship_expiry_date)
					print(type(sponsorship_expiry_date))
					date_today = datetime.now()
					print(date_today)
					print(number_of_months)
					print(sponsor_amount)
					print(sponsor_amt_monthly_limit)
				

				
					#1. check start and end date
					is_valid_for_trans = False
					status = ''

					in_valid_date = sponsorship_start_date < date_today < sponsorship_expiry_date
					if in_valid_date:
						is_valid_for_trans = in_valid_date
					else:
						status = 'sponsorship_date_not_in_range'


					remaining_amount_lst = []
					#2. check hole reward_amount_limit
					if is_valid_for_trans :
						all_privil_cust_pending_transactions_obj = privil_cust_pending_transactions.objects.filter(sponsor_reward_id = sponsor_privileged_xircl_info_obj.id,sponsor_outlet_id = is_pivileged_obj.outlet_id.id,host_outlet_id = outlet_id,transaction_is_pending=True,transaction_date__range=(sponsorship_start_date, sponsorship_expiry_date))

						all_trans_value = 0
						for trans in all_privil_cust_pending_transactions_obj:
							print(trans.amount_rewarded_by_sponser)
							print(type(trans.amount_rewarded_by_sponser))
							try:
								all_trans_value = all_trans_value + float(trans.amount_rewarded_by_sponser)
							except:
								all_trans_value = all_trans_value + 0

						print(sponsor_amount)
						print(all_trans_value)
						print("############################################")

						if float(sponsor_amount) > float(all_trans_value):
							is_valid_for_trans = True
							remaining_amount_tans = float(sponsor_amount) - all_trans_value
							status = ''
							
						else:
							is_valid_for_trans = False
							remaining_amount_tans = 0
							status = 'reward_amount_limit_exceed'

						remaining_amount_lst.append(remaining_amount_tans)
						print('--------------')
						print(sponsor_amount)
						print(all_trans_value)
						print(remaining_amount_tans)
						print(remaining_amount_lst)
				


					#. if TRUE check frequency per cutomer 
					if is_valid_for_trans :
						
						all_month_duration = []
						temp_lst = [sponsorship_start_date.date(),sponsorship_start_date.date() + timedelta(days=30)]
						all_month_duration.append(temp_lst)

						for month in range(int(number_of_months)-1):
							# print(all_month_duration)
							# print(all_month_duration[-1])
							# print(all_month_duration[-1][-1])

							last_index = all_month_duration[-1]
							last_date_of_last_index = last_index[-1]

							nxt_month_lst = []
							nxt_month_start_date = last_date_of_last_index + timedelta(days=1)
							nxt_month_end_date = nxt_month_start_date + timedelta(days=30)
							nxt_month_lst.append(nxt_month_start_date)
							nxt_month_lst.append(nxt_month_end_date)

							all_month_duration.append(nxt_month_lst)
						
						#change last months last date to sponsorship_expiry_date
						all_month_duration[-1][-1] = sponsorship_expiry_date.date()  
						print(all_month_duration)
						print('---------------')

						for grp_mnth in all_month_duration:
							print(grp_mnth[0])
							print(grp_mnth[1])
							print(date_today.date())
							if grp_mnth[0] <= date_today.date() < grp_mnth[1]:
								check_date_from = grp_mnth[0]
								check_date_to = grp_mnth[1]

						# print(check_date_from)
						# print(check_date_to)

						#3 check monthly reward limit for all custmoner
						this_month_all_privil_cust_pending_transactions_obj = privil_cust_pending_transactions.objects.filter(sponsor_reward_id = sponsor_privileged_xircl_info_obj.id,sponsor_outlet_id = is_pivileged_obj.outlet_id.id,host_outlet_id = outlet_id,transaction_is_pending=True,transaction_date__range=(check_date_from, check_date_to))
						trans_value = 0
						for trans in this_month_all_privil_cust_pending_transactions_obj:
							print(trans.amount_rewarded_by_sponser)
							print(type(trans.amount_rewarded_by_sponser))
							try:
								# trans_value = trans_value + float(trans.amount_rewarded_by_sponser)
								trans_value = trans_value + float(trans.cust_amount_spent)
							except:
								trans_value = trans_value + 0
						# print(sponsor_amt_monthly_limit)
						# print(trans_value)
						if float(sponsor_amt_monthly_limit) > trans_value:
							is_valid_for_trans = True
							remaining_amount_tans = float(sponsor_amt_monthly_limit) - trans_value
						else:
							is_valid_for_trans = False
							remaining_amount_tans = 0
							status = 'sponser_monthly_amount_limit_exceed'

						remaining_amount_lst.append(remaining_amount_tans)
						print('--------------')
						print(sponsor_amt_monthly_limit)
						print(trans_value)
						print(remaining_amount_tans)
						print(remaining_amount_lst)
					
					
				   
						if is_valid_for_trans :
							#4 check indivudual customer transaction limit & reward limit
							privil_cust_pending_transactions_obj = privil_cust_pending_transactions.objects.filter(sponsor_reward_id = sponsor_privileged_xircl_info_obj.id,customer_id=customers.id,sponsor_outlet_id = is_pivileged_obj.outlet_id.id,host_outlet_id = outlet_id,transaction_is_pending=True,transaction_date__range=(check_date_from, check_date_to))
							print(len(privil_cust_pending_transactions_obj))
							print(customers.id)
							
							trans_value = 0
							for trans in privil_cust_pending_transactions_obj:
								print(trans.amount_rewarded_by_sponser)
								print(type(trans.amount_rewarded_by_sponser))
								try:
									# trans_value = trans_value + float(trans.amount_rewarded_by_sponser)
									trans_value = trans_value + float(trans.cust_amount_spent)
								except:
									trans_value = trans_value + 0

							print(trans_value)   
							print(len(privil_cust_pending_transactions_obj))

							## uncomment if need to check customer frequence

							# if int(frequency_per_cust) > len(privil_cust_pending_transactions_obj):
							#     frequency_per_cust_status = True
							#     is_valid_for_trans = True
							# else:
							#     frequency_per_cust_status = False
							#     is_valid_for_trans = False
							#     status = 'frequency_per_cust_limit_exceed'


							#3. if TRUE check fixed amount per cutomer
							# if is_valid_for_trans:
							print(fixed_amount_per_transaction)
							print(trans_value)

							if int(fixed_amount_per_transaction) > trans_value:
								is_valid_for_trans = True
								remaining_amount_tans = int(fixed_amount_per_transaction) - trans_value
							else:
								is_valid_for_trans = False
								remaining_amount_tans = 0
								status = 'fixed_amount_for_customer_limit_exceed'

							remaining_amount_lst.append(remaining_amount_tans)

							print('--------------')
							print(fixed_amount_per_transaction,"111")
							print(trans_value,"222")
							print(remaining_amount_tans,"333")
							print(remaining_amount_lst,"4444")
							
						# print(remaining_amount_tans)
						print(is_valid_for_trans)
						print(status)
						print(remaining_amount_lst)
				
					max_allowed_amount = min(remaining_amount_lst)
					print(max_allowed_amount)
					# max_allowed_amount = (min(remaining_amount_lst) / 100 * int(discount_rewarded)) + min(remaining_amount_lst)
					print(remaining_amount_lst)
					

					  

					#print(sponsor_privileged_xircl_info_obj,"1111")
					print("Kya?")

				if sponsor_privileged_xircl_info_obj:
					showpoup = True
					try:
						outlet_obj = get_object_or_404(outlet_details,id=outlet_id)
					except:
						outlet_obj = None

					privilege_customer_report_obj  = privilege_customer_report()
					privilege_customer_report_obj.host_outlet_id = outlet_obj
					privilege_customer_report_obj.sponser_outlet_id = is_pivileged_obj.outlet_id.id
					privilege_customer_report_obj.customer_id = cust_id
					privilege_customer_report_obj.save()
					message2 = render_to_string('merchant_site/emails/customer_visits_at_host_email.html', locals())
					user_obj = get_object_or_404(User,id=is_pivileged_obj.outlet_id.created_by_id)
					user_obj2 = get_object_or_404(customer_details, id=cust_id)
					# email_id = "rahul@nucleusads.com" #user_obj.email
					# user_email = ('Your Privilege Customer '+str(user_obj.first_name)+' Visited '+ outlet_obj.outlet_name,message2,[email_id])
					# r = send_email_user(user_email)
					# privilege_customer_report_obj.is_sponsered = outlet_obj.id
					


					eventLogObj = XirclsEventLog()
					eventLogObj.event_log_type = "AL"
					eventLogObj.event_type = "PRI_CUS_VST"
					eventLogObj.log_text = "Your Privilege Customer "+str(user_obj2.customer_name)+" Visited " + str(outlet_obj.outlet_name)
					eventLogObj.user_to_notify_id = is_pivileged_obj.outlet_id.created_by_id
					eventLogObj.user_who_fired_event_id = outlet_obj.created_by_id
					eventLogObj.outlet_to_notify_id = is_pivileged_obj.outlet_id.id
					eventLogObj.outlet_who_fired_event_id = outlet_obj.id
					eventLogObj.company_id = is_pivileged_obj.outlet_id.company_id
					eventLogObj.save()


					eventLogObj = XirclsEventLog()
					eventLogObj.event_log_type = "AL"
					eventLogObj.event_type = "PRI_CUS_VST"
					eventLogObj.log_text = "Privilege Customer from "+str(is_pivileged_obj.outlet_id.outlet_name)+" visited your store" 
					eventLogObj.user_to_notify_id = outlet_obj.created_by_id
					eventLogObj.user_who_fired_event_id = is_pivileged_obj.outlet_id.created_by_id
					eventLogObj.outlet_to_notify_id = outlet_obj.id
					eventLogObj.outlet_who_fired_event_id = is_pivileged_obj.outlet_id.id
					eventLogObj.company_id = outlet_obj.company_id
					eventLogObj.save()


					outletname = is_pivileged_obj.outlet_id.outlet_name                    
					print("YESSSS idharrrrrrrrrrrrrrr")
					# sponsor_amount = sponsor_privileged_xircl_info_obj.sponsor_amount
					fixed_amount = sponsor_privileged_xircl_info_obj.fixed_amount_per_transaction
					# frequency = sponsor_privileged_xircl_info_obj.frequency
					# start_date = sponsor_privileged_xircl_info_obj.start_date
					# end_date = sponsor_privileged_xircl_info_obj.end_date
					# sponsorship_expiry_date = sponsor_privileged_xircl_info_obj.sponsorship_expiry_date
					max_spend_range = sponsor_privileged_xircl_info_obj.max_spend_range
					min_spend_range = sponsor_privileged_xircl_info_obj.min_spend_range
					reward_category = sponsor_privileged_xircl_info_obj.reward_category
					reward_subcategory = sponsor_privileged_xircl_info_obj.reward_subcategory                                        
					
					data = {
							'showpoup' : showpoup,
							'is_valid_for_trans' : is_valid_for_trans,
							'status' : status,
							'outletname' : outletname,
							'fixed_amount' : fixed_amount,
							'max_spend_range' : max_spend_range,
							'min_spend_range' : min_spend_range,
							'reward_category' : reward_category,
							'reward_subcategory' : reward_subcategory,
							'cust_id' : cust_id,
							'cust_name': cust_name,
							'max_allowed_amount' : max_allowed_amount,
							'outlet_logo': "https://hr.xircls.com/static/"+str(is_pivileged_obj.outlet_id.outlet_logo),
							'cust_grp' : cust_grp,
							'spon_reward_id' : sponsor_privileged_xircl_info_obj.id,
							}
				
				
			result_data.append(data)

		print(result_data)
		

	if customer_id:
		print("3333333333333333333333-------------------------3333333333333333333333333")
		print(customer_id)
		cust_id = customer_id

		try:
			is_pivileged_obj = get_object_or_404(privileged_customers_subgroup,customer_id = cust_id)
		except:
			is_pivileged_obj = None

		sponsor_id = is_pivileged_obj.outlet_id.id

		sponsor_reward_obj = get_object_or_404(sponsor_privileged_xircl_info,host_outlet=outlet_id,outlet_id =sponsor_id,id=spon_reward_id)

		

		fixed_amount = sponsor_reward_obj.fixed_amount_per_transaction
		max_spend_range = sponsor_reward_obj.max_spend_range
		min_spend_range = sponsor_reward_obj.min_spend_range
		reward_category = sponsor_reward_obj.reward_category
		reward_subcategory = sponsor_reward_obj.reward_subcategory

		privi_cust_pending_transactions_obj = privil_cust_pending_transactions()

		privi_cust_pending_transactions_obj.customer_id = cust_id
		privi_cust_pending_transactions_obj.spons_fixed_reward_amount = fixed_amount
		#privi_cust_pending_transactions_obj.spons_min_reward_amt = min_spend_range
		privi_cust_pending_transactions_obj.spons_max_reward_amt = max_spend_range
		privi_cust_pending_transactions_obj.sponsor_outlet_id = sponsor_id
		privi_cust_pending_transactions_obj.host_outlet_id = outlet_id
		privi_cust_pending_transactions_obj.reward_category = reward_category
		privi_cust_pending_transactions_obj.reward_subcategory = reward_subcategory
		privi_cust_pending_transactions_obj.sponsor_reward_id = spon_reward_id
		privi_cust_pending_transactions_obj.host_reward_id = sponsor_reward_obj.host_reward.id

		activationkey = generate_activation_key(cust_id)
		print("------------- key generated?------------",activationkey)
		privi_cust_pending_transactions_obj.activationkey = activationkey

		privi_cust_pending_transactions_obj.save()


		try:
			outlet_obj1 = get_object_or_404(outlet_details,id=sponsor_id)
		except:
			outlet_obj1 = None


		try:
			outlet_obj2 = get_object_or_404(outlet_details,id=outlet_id)
		except:
			outlet_obj2 = None

		# user_obj = get_object_or_404(User,id=cust_id)
		# user_obj = get_object_or_404(User,id=outlet_obj1.created_by_id)
		user_obj2 = get_object_or_404(customer_details, id=cust_id)
		eventLogObj = XirclsEventLog()
		eventLogObj.event_log_type = "AL"
		eventLogObj.event_type = "PRI_CUS_VST"
		eventLogObj.log_text = "Your Privilege Customer "+str(user_obj2.customer_name)+" have checked in " + str(outlet_obj2.outlet_name)
		eventLogObj.user_to_notify_id = outlet_obj1.created_by_id
		eventLogObj.user_who_fired_event_id = outlet_obj2.created_by_id
		eventLogObj.outlet_to_notify_id = sponsor_id
		eventLogObj.outlet_who_fired_event_id = outlet_id
		eventLogObj.company_id = outlet_obj1.company_id
		eventLogObj.save()

		eventLogObj = XirclsEventLog()
		eventLogObj.event_log_type = "AL"
		eventLogObj.event_type = "PRI_CUS_VST"
		eventLogObj.log_text = "Privilege Customer from "+str(outlet_obj1.outlet_name)+" made a purchase from your store" 
		eventLogObj.user_to_notify_id = outlet_obj2.created_by_id
		eventLogObj.user_who_fired_event_id = outlet_obj1.created_by_id
		eventLogObj.outlet_to_notify_id = outlet_id
		eventLogObj.outlet_who_fired_event_id = sponsor_id
		eventLogObj.company_id = outlet_obj2.company_id
		eventLogObj.save()


		##### for  user check in email #####
		outlet_obj = get_object_or_404(outlet_details,id=outlet_id)
		sponsor_outlet_obj = get_object_or_404(outlet_details,id=sponsor_id)

		try:
			customers_obj = get_object_or_404(customer_details,id = customer_id)   
		except:
			customers_obj = None

		try:
			host_obj = get_object_or_404(host_privileged_info, outlet_id = outlet_id,is_active=1)
			RewardName = host_obj.reward_name
			DiscountedAmount = host_obj.discount
		except:
			host_obj = None
			RewardName = None
			DiscountedAmount = None

		cust_name = customers_obj.customer_name
		print(cust_name)
		temp_dict = {
					'cust_name':cust_name,
					'outlet_name':outlet_obj.outlet_name,
					'outlet_logo':outlet_obj.outlet_logo,
					'RewardName' :RewardName,
					'DiscountedAmount' :DiscountedAmount,
					'SponsorOutletName' :sponsor_outlet_obj.outlet_name,
					'SponsorManagerName' :sponsor_outlet_obj.StoreManager,
					'SponsorManagerMobileNo' :sponsor_outlet_obj.DM_mobileNo,
					'SponsorManagerEmailAddress' :sponsor_outlet_obj.DM_email,
		}
		print(temp_dict)
		
		
		message2 = render_to_string('merchant_site/emails/check_in_mail.html', locals())
		email_id = customers_obj.email
		user_email = ("You're at "+ str(outlet_obj.outlet_name) + ". We have something waiting for you!",message2,[email_id])
		r = send_email_user_merchant(user_email,sponsor_outlet_obj.outlet_name)




		print("------------------- saved -------------------------")



		# customers_list = customer_details.objects.filter(phone_no=cust_mob).order_by('-created_at')
		# print("44444444444444444444444444444444444")
		# for customers in customers_list:
		#     # print("55555555555555")
		#     try:
		#         is_pivileged_obj = get_object_or_404(privileged_customers_subgroup,customer_id = customers.id)
		#     except:
		#         is_pivileged_obj = None

			

		#     if is_pivileged_obj:

		#         print(customers.email,"333333")

		#         message2 = render_to_string('merchant_site/emails/send_customer_verification_email.html', locals())
		#         email_id = customers.email
		#         user_email = ('Confirm Email!',message2,[email_id])
				#r = send_email_user(user_email)
				# messages.add_message(request, messages.SUCCESS, 'Email invite has been sent to ' + email_id,fail_silently=True)


	print(result_data)
	print('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
	response = response_json(request, 'success', '200', result_data, message, '')
	return JsonResponse(response) 

# def customerverify(request):

#     print("yessssssssss111111")
#     if request.method == "POST":
#         postdata =request.POST.copy()
#         print(postdata)
#         send_mail = postdata.get('send_mail')
#         cust_mo
#     data = ""
#     showpoup = False
#     message = ""

#     print("_______________________________")

#     if send_mail == "true":


#     # customers_list = customer_details.objects.filter(phone_no=cust_mob).order_by('-created_at')
#     # for customers in customers_list:
#     #     print(customers)
#     #     print(customers.id)
#     #     is_privileged_obj = get_object_or_404(privileged_customers_subgroup,customer_id = customers.id)

#     #     print(is_privileged_obj.outlet_id.id)

#     #     if is_privileged_obj:
#     #         showpoup = True
#     #         outletname = is_privileged_obj.outlet_id.outlet_name
#     #         message = ""
#     data = {
#         'showpoup' : showpoup,
		
#         }

#     response = response_json(request, 'success', '200', data, message, '')
#     return JsonResponse(response) 

def generate_activation_key(cust_id):
	print("&&&&&&&&&&&&&&&&&&&&&&&&",cust_id)
	chars = 'abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*(-_=+)'
	secret_key = get_random_string(20, chars)
	print("---------------------------------------",secret_key)
	return hashlib.sha256((secret_key + cust_id).encode('utf-8')).hexdigest()

def privi_customer_verification_link(request, key=""):
   

	verification_key = key
	print("----- key -----",key)

	privil_cust_pending_transactions_obj = get_object_or_404(privil_cust_pending_transactions, activationkey=key)

	if privil_cust_pending_transactions_obj and privil_cust_pending_transactions_obj.transaction_is_pending == False:

		privil_cust_pending_transactions_obj.is_email_sent = True
		privil_cust_pending_transactions_obj.transaction_is_pending = True
		import datetime
		date = datetime.date.today()
		
		print("------------------------------------------------------ Today's date --------------------------",date)
		privil_cust_pending_transactions_obj.transaction_date = date
		print(privil_cust_pending_transactions_obj.is_email_sent)
		privil_cust_pending_transactions_obj.save()
		print("::::::::::::::::::::::::::: transaction date ::::::::::::::::::::::::",privil_cust_pending_transactions_obj.transaction_date)
		# url = reverse('auth_merchant:email_verification_succeed')
		# return HttpResponseRedirect(url)              
		# return HttpResponseRedirect(url)
		if privil_cust_pending_transactions_obj.is_email_sent == True:
			try:
				host_privileged_info_obj = get_object_or_404(host_privileged_info,id=privil_cust_pending_transactions_obj.host_reward_id)
				if host_privileged_info_obj:
					discount = host_privileged_info_obj.discount
					if host_privileged_info_obj.gst_percentage:
						gst_percentage =  host_privileged_info_obj.gst_percentage
					else:
						gst_percentage = 0
				else:
					discount = 0
					gst_percentage = 0
			except:
				discount = 0
				gst_percentage = 0

			print(privil_cust_pending_transactions_obj.host_outlet_id)
			print(privil_cust_pending_transactions_obj.sponsor_outlet_id)
			sponsor_privileged_xircl_info_obj = get_object_or_404(sponsor_privileged_xircl_info,host_outlet=privil_cust_pending_transactions_obj.host_outlet_id, outlet=privil_cust_pending_transactions_obj.sponsor_outlet_id)

			total_sponsor_amt = sponsor_privileged_xircl_info_obj.sponsor_amount
			print("---- total sponsor amount ----",total_sponsor_amt)
			reward_amt = privil_cust_pending_transactions_obj.spons_fixed_reward_amount
			reward_amt_max = privil_cust_pending_transactions_obj.spons_max_reward_amt
			customer_spent = privil_cust_pending_transactions_obj.cust_amount_spent
			print("llllllll",reward_amt)
			print("---------- reward amount ----------",reward_amt)
			print(reward_amt)
			print(total_sponsor_amt)
			
			
			if reward_amt:
				deduct_amt = float(reward_amt) * float(discount)/100
				# deduct_amt = float(deduct_amt) + float(deduct_amt * gst_percentage/100)
				deducted_amount = float(total_sponsor_amt) - float(deduct_amt)
			else:
				deduct_amt = float(reward_amt_max) * float(discount)/100
				deducted_amount = float(total_sponsor_amt) - float(reward_amt_max)

			sponsor_privileged_xircl_info_obj.sponsor_amount = deducted_amount
			print('------------ deduct hua? ------------',sponsor_privileged_xircl_info_obj.sponsor_amount)
			sponsor_privileged_xircl_info_obj.save()

	#for getting user id by outlet id

		#for sponsor
			outlet_obj = get_object_or_404(outlet_details, id=privil_cust_pending_transactions_obj.sponsor_outlet_id)
			outlet_ID = privil_cust_pending_transactions_obj.sponsor_outlet_id
			print("0000000000000",outlet_obj.created_by_id)
			# user_obj = get_object_or_404(subcription_transactions, user_id = outlet_obj.created_by_id)
			# bal_amount = user_obj.balance_amount
			# print(" iiiiiiiii balance amount of sponsor iiiiiiii",bal_amount)

			user_obj = plan_subcriptions.objects.get(user_id =outlet_obj.created_by_id,status='AC')
			balance_amt = user_obj.remaining_amount
			print(balance_amt)
			print("::::::::: balance amount of host :::::::::::",balance_amt)
			print(user_obj.remaining_amount)

			try:
				childtransactions_obj = childtransactions.objects.filter(outlet_id=outlet_obj.id).last()
			except:
				childtransactions_obj = None
			print(childtransactions_obj,"CHILDDDDDDDDDDDDDDDDDDDDDDDD")
			if childtransactions_obj:
				topup = childtransactions_obj.topup
				original_balance_amount =  childtransactions_obj.original_balance_amount
				plan_id  = user_obj.membership_plan.id
				host_outlet_id  = outlet_obj.id
				deduction_method = childtransactions_obj.plan_deduction_type
				payment_status = "DR"
				kit_id = None
				own_transactions = childtransactions_obj.own_transactions
				customer_reach = childtransactions_obj.customer_reach
				
				# if reward_amt:
				#     deduct_amt = float(reward_amt) - float(reward_amt) * float(discount)/100
				#     balance_amount = float(childtransactions_obj.balance_amount) - float(deduct_amt)
				#     debit_amount = float(deduct_amt)
				# else:
				#     deduct_amt = float(reward_amt_max) - float(reward_amt_max) * float(discount)/100
				#     balance_amount = float(childtransactions_obj.balance_amount) - float(deduct_amt)
				#     debit_amount = float(deduct_amt)
				deduct_amt = float(customer_spent) - float(customer_spent) * float(discount)/100
				deduction_without_gst = deduct_amt
				deduct_amt = float(deduct_amt) + (float(deduct_amt) * (float(gst_percentage)/100))
				balance_amount = float(childtransactions_obj.balance_amount) - float(deduct_amt)
				debit_amount = float(deduct_amt)                
				credit_amount = 0
				remark = "Sponsorship Amount Sent."
				is_paid = childtransactions_obj.is_paid

				user_obj2 = get_object_or_404(customer_details, id=privil_cust_pending_transactions_obj.customer_id)


				try:
					outlet_obj1 = get_object_or_404(outlet_details,id=outlet_obj.id)
				except:
					outlet_obj1 = None

				try:
					outlet_obj2 = get_object_or_404(outlet_details,id=privil_cust_pending_transactions_obj.host_outlet_id)
				except:
					outlet_obj2 = None

				eventLogObj = XirclsEventLog()
				eventLogObj.event_type = "PRI_CUS_VST"
				eventLogObj.event_log_type = "AL"
				eventLogObj.log_text = "Your privilege customer "+str(user_obj2.customer_name)+" have confirmed the bill payment from " + str(outlet_obj2.outlet_name)+ " and Rs "+str(debit_amount)+ " deducted from your account"
				eventLogObj.user_to_notify_id = outlet_obj1.created_by_id
				eventLogObj.user_who_fired_event_id = outlet_obj2.created_by_id
				eventLogObj.outlet_to_notify_id = outlet_obj1.id
				eventLogObj.outlet_who_fired_event_id = outlet_obj2.id
				eventLogObj.company_id = outlet_obj1.company_id
				eventLogObj.save()

				# eventLogObj = XirclsEventLog()
				# eventLogObj.event_log_type = "AL"
				# eventLogObj.event_type = "PRI_CUS_VST"
				# eventLogObj.log_text = "Bill confirmation email sent to privilege customer of "+str(outlet_obj1.outlet_name)
				# eventLogObj.user_to_notify_id = outlet_obj2.created_by_id
				# eventLogObj.user_who_fired_event_id = outlet_obj1.created_by_id
				# eventLogObj.outlet_to_notify_id = outlet_obj2.id
				# eventLogObj.outlet_who_fired_event_id = outlet_obj1.id
				# eventLogObj.company_id = outlet_obj2.company_id
				# eventLogObj.save()
				is_privilege_wallet = True
				bill_available = True
				commission_percentage = 0
				gst_perc = gst_percentage
				calculated_from = deduction_without_gst             
				store_transactions(original_balance_amount,plan_id,outlet_obj.id,kit_id,deduction_method,payment_status,balance_amount,debit_amount,credit_amount,remark,is_paid,customer_reach,own_transactions,topup,is_privilege_wallet,bill_available,commission_percentage,gst_perc,calculated_from)
				deduct_xircls_commission(host_outlet_id,privil_cust_pending_transactions_obj.host_reward_id,debit_amount)        
			# if user_obj.last_amount != None:
			#     if reward_amt:
			#         user_obj.last_amount = int(user_obj.last_amount) - int(reward_amt)
			#     else:
			#         user_obj.last_amount = int(user_obj.last_amount) - int(reward_amt_max)
			# if user_obj.remaining_amount != None:
			#     if reward_amt:
			#         user_obj.remaining_amount = int(user_obj.remaining_amount) - int(reward_amt)
			#     else:
			#         user_obj.remaining_amount = int(user_obj.remaining_amount) - int(reward_amt_max)
			# print("---- reward amount which gone to host ----",user_obj.remaining_amount)
			# print(user_obj.remaining_amount)
			
			user_obj.save()

		#for host
			
			out_obj = get_object_or_404(outlet_details, id=privil_cust_pending_transactions_obj.host_outlet_id)
			# user_object = get_object_or_404(plan_subcriptions, user_id =out_obj.created_by_id,status='AC')
			# balance_amt = user_object.remaining_amount
			# print("::::::::: balance amount of host :::::::::::",balance_amt)
			# user_object.balance_amount = int(user_object.remaining_amount) + int(reward_amt)
			# print("---- reward amount which gone to host ----",user_object.balance_amount)
			print(out_obj.created_by_id)
			print(out_obj.id)
			user_object = plan_subcriptions.objects.get(user_id =out_obj.created_by_id,status='AC')
			balance_amt = user_object.remaining_amount
			
			print("::::::::::: balance amount of host :::::::::::::",balance_amt)
			print(user_object.last_amount)
			print(user_object.remaining_amount)


			try:
				childtransactions_obj1 = childtransactions.objects.filter(outlet_id=out_obj.id).last()
			except:
				childtransactions_obj1 = None

			if childtransactions_obj1:
				topup = childtransactions_obj1.topup
				original_balance_amount =  childtransactions_obj1.original_balance_amount
				plan_id  = user_object.membership_plan.id
				host_outlet_id  = out_obj.id
				deduction_method = childtransactions_obj1.plan_deduction_type
				payment_status = "DR"
				kit_id = None
				own_transactions = childtransactions_obj1.own_transactions
				customer_reach = childtransactions_obj1.customer_reach                
				deduct_amt = float(customer_spent)
				balance_amount = float(childtransactions_obj1.balance_amount)
				credit_amount = 0

				debit_amount = float(deduct_amt)
				
				is_paid = childtransactions_obj1.is_paid
				
				user_obj2 = get_object_or_404(customer_details, id=privil_cust_pending_transactions_obj.customer_id)

				try:
					outlet_obj1 = get_object_or_404(outlet_details,id=privil_cust_pending_transactions_obj.sponsor_outlet_id)
				except:
					outlet_obj1 = None
				remark = "Amount Rewarded To Privilege Customer of "+str(outlet_obj1.outlet_name)
				try:
					outlet_obj2 = get_object_or_404(outlet_details,id=out_obj.id)
				except:
					outlet_obj2 = None
				is_privilege_wallet = True
				bill_available = False

				commission_percentage = 0
				gst_perc = 0    
				calculated_from = 0
				store_transactions(original_balance_amount,plan_id,out_obj.id,kit_id,deduction_method,payment_status,balance_amount,debit_amount,credit_amount,remark,is_paid,customer_reach,own_transactions,topup,is_privilege_wallet,bill_available,commission_percentage,gst_perc,calculated_from)


			try:
				childtransactions_obj2 = childtransactions.objects.filter(outlet_id=out_obj.id).last()
			except:
				childtransactions_obj2 = None

			if childtransactions_obj2:
				topup = childtransactions_obj2.topup
				original_balance_amount =  childtransactions_obj2.original_balance_amount
				plan_id  = user_object.membership_plan.id
				host_outlet_id  = out_obj.id
				deduction_method = childtransactions_obj2.plan_deduction_type
				payment_status = "DR"
				kit_id = None
				own_transactions = childtransactions_obj2.own_transactions
				customer_reach = childtransactions_obj2.customer_reach                
				deduct_amt = float(customer_spent)
				balance_amount = float(childtransactions_obj2.balance_amount)
				credit_amount = 0

				debit_amount = float(customer_spent) * float(discount)/100
				
				is_paid = childtransactions_obj2.is_paid
				
				user_obj2 = get_object_or_404(customer_details, id=privil_cust_pending_transactions_obj.customer_id)

				try:
					outlet_obj1 = get_object_or_404(outlet_details,id=privil_cust_pending_transactions_obj.sponsor_outlet_id)
				except:
					outlet_obj1 = None
				remark = "Discounted Amount"
				print(debit_amount)
				try:
					outlet_obj2 = get_object_or_404(outlet_details,id=out_obj.id)
				except:
					outlet_obj2 = None
				is_privilege_wallet = True
				commission_percentage = 0
				gst_perc = 0             
				calculated_from = 0
				store_transactions(original_balance_amount,plan_id,out_obj.id,kit_id,deduction_method,payment_status,balance_amount,debit_amount,credit_amount,remark,is_paid,customer_reach,own_transactions,topup,is_privilege_wallet,bill_available,commission_percentage,gst_perc,calculated_from)

			try:
				childtransactions_obj = childtransactions.objects.filter(outlet_id=out_obj.id).last()
			except:
				childtransactions_obj = None

			if childtransactions_obj:
				topup = childtransactions_obj.topup
				original_balance_amount =  childtransactions_obj.original_balance_amount
				plan_id  = user_object.membership_plan.id
				host_outlet_id  = out_obj.id
				deduction_method = childtransactions_obj.plan_deduction_type
				payment_status = "CR"
				kit_id = None
				own_transactions = childtransactions_obj.own_transactions
				customer_reach = childtransactions_obj.customer_reach
				# if reward_amt:
				#     deduct_amt = float(reward_amt) - float(reward_amt) * float(discount)/100
				#     balance_amount = float(childtransactions_obj.balance_amount) + float(deduct_amt)
				#     credit_amount = float(deduct_amt)
				# else:
				#     deduct_amt = float(reward_amt_max) - float(reward_amt_max) * float(discount)/100
				#     balance_amount = float(childtransactions_obj.balance_amount) + float(deduct_amt)
				#     credit_amount = float(deduct_amt)
				
				deduct_amt = float(customer_spent) - float(customer_spent) * float(discount)/100
				deduction_without_gst = deduct_amt
				deduct_amt = float(deduct_amt) + float(deduct_amt) * float(gst_percentage)/100
				balance_amount = float(childtransactions_obj.balance_amount) + float(deduct_amt)
				credit_amount = float(deduct_amt)

				debit_amount = 0
				remark = "Sponsorship Amount Received."
				is_paid = childtransactions_obj.is_paid
				
				user_obj2 = get_object_or_404(customer_details, id=privil_cust_pending_transactions_obj.customer_id)

				try:
					outlet_obj1 = get_object_or_404(outlet_details,id=privil_cust_pending_transactions_obj.sponsor_outlet_id)
				except:
					outlet_obj1 = None

				try:
					outlet_obj2 = get_object_or_404(outlet_details,id=out_obj.id)
				except:
					outlet_obj2 = None

				eventLogObj = XirclsEventLog()
				eventLogObj.event_log_type = "AL"
				eventLogObj.event_type = "PRI_CUS_VST"
				eventLogObj.log_text = "A Privilege Customer from " +str(outlet_obj1.outlet_name)+" have confirmed the bill payment and Rs "+str(credit_amount)+ " credited to your account"
				eventLogObj.user_to_notify_id = outlet_obj2.created_by_id
				eventLogObj.user_who_fired_event_id = outlet_obj1.created_by_id
				eventLogObj.outlet_to_notify_id = outlet_obj2.id
				eventLogObj.outlet_who_fired_event_id = outlet_obj1.id
				eventLogObj.company_id = outlet_obj2.company_id
				eventLogObj.save()
				
				
				is_privilege_wallet = True
				bill_available = True
				commission_percentage = 0
				gst_perc = gst_percentage          
				calculated_from = deduction_without_gst
				store_transactions(original_balance_amount,plan_id,out_obj.id,kit_id,deduction_method,payment_status,balance_amount,debit_amount,credit_amount,remark,is_paid,customer_reach,own_transactions,topup,is_privilege_wallet,bill_available,commission_percentage,gst_perc,calculated_from)
				### amount sent to xircls

				deduct_xircls_commission(out_obj.id,privil_cust_pending_transactions_obj.host_reward_id,credit_amount)        
			else:
				topup = 0
				original_balance_amount =  0
				plan_id  = 11
				host_outlet_id  = out_obj.id
				deduction_method = 1
				payment_status = "CR"
				kit_id = None
				own_transactions = 0 
				customer_reach = 0
				# if reward_amt:
				#     deduct_amt = float(reward_amt) - float(reward_amt) * float(discount)/100
				#     balance_amount = float(childtransactions_obj.balance_amount) + float(deduct_amt)
				#     credit_amount = float(deduct_amt)
				# else:
				#     deduct_amt = float(reward_amt_max) - float(reward_amt_max) * float(discount)/100
				#     balance_amount = float(childtransactions_obj.balance_amount) + float(deduct_amt)
				#     credit_amount = float(deduct_amt)
				
				deduct_amt = float(customer_spent) - float(customer_spent) * float(discount)/100
				deduction_without_gst = deduct_amt
				deduct_amt = float(deduct_amt) + float(deduct_amt) * float(gst_percentage)/100
				balance_amount = 0 + float(deduct_amt)
				credit_amount = float(deduct_amt)

				debit_amount = 0
				remark = "Sponsorship Amount Received."
				is_paid = 1
				
				user_obj2 = get_object_or_404(customer_details, id=privil_cust_pending_transactions_obj.customer_id)

				try:
					outlet_obj1 = get_object_or_404(outlet_details,id=privil_cust_pending_transactions_obj.sponsor_outlet_id)
				except:
					outlet_obj1 = None

				try:
					outlet_obj2 = get_object_or_404(outlet_details,id=out_obj.id)
				except:
					outlet_obj2 = None

				eventLogObj = XirclsEventLog()
				eventLogObj.event_log_type = "AL"
				eventLogObj.event_type = "PRI_CUS_VST"
				eventLogObj.log_text = "A Privilege Customer from " +str(outlet_obj1.outlet_name)+" have confirmed the bill payment and Rs "+str(credit_amount)+ " credited to your account"
				eventLogObj.user_to_notify_id = outlet_obj2.created_by_id
				eventLogObj.user_who_fired_event_id = outlet_obj1.created_by_id
				eventLogObj.outlet_to_notify_id = outlet_obj2.id
				eventLogObj.outlet_who_fired_event_id = outlet_obj1.id
				eventLogObj.company_id = outlet_obj2.company_id
				eventLogObj.save()
				
				
				is_privilege_wallet = True
				bill_available = True
				commission_percentage = 0
				gst_perc = gst_percentage          
				calculated_from = deduction_without_gst
				store_transactions(original_balance_amount,plan_id,out_obj.id,kit_id,deduction_method,payment_status,balance_amount,debit_amount,credit_amount,remark,is_paid,customer_reach,own_transactions,topup,is_privilege_wallet,bill_available,commission_percentage,gst_perc,calculated_from)
				### amount sent to xircls

				deduct_xircls_commission(out_obj.id,privil_cust_pending_transactions_obj.host_reward_id,credit_amount)        






			user_object.save()





			import datetime
			today_date = datetime.date.today()
			sponsor_to_host_transactn_details_obj = sponsor_to_host_transactn_details()
			sponsor_to_host_transactn_details_obj.host_outlet = privil_cust_pending_transactions_obj.host_outlet_id
			sponsor_to_host_transactn_details_obj.sponsor_outlet = privil_cust_pending_transactions_obj.sponsor_outlet_id
			if reward_amt:
				sponsor_to_host_transactn_details_obj.amt_to_host = reward_amt
			else:
				sponsor_to_host_transactn_details_obj.amt_to_host = reward_amt_max
			if reward_amt:
				sponsor_to_host_transactn_details_obj.amt_by_sponsor = reward_amt
			else:
				sponsor_to_host_transactn_details_obj.amt_by_sponsor = reward_amt_max
			sponsor_to_host_transactn_details_obj.transaction_date = datetime.now()
			sponsor_to_host_transactn_details_obj.cust_details = privil_cust_pending_transactions_obj.customer_id
			sponsor_to_host_transactn_details_obj.save()

		   
		url = reverse('customers:cust_transaction_verification',kwargs={'outcode': sponsor_to_host_transactn_details_obj.sponsor_outlet})
		return HttpResponseRedirect(url)
	elif privil_cust_pending_transactions_obj and privil_cust_pending_transactions_obj.transaction_is_pending == True:
		url = reverse('customers:cust_transaction_verification_completed',kwargs={'outcode': privil_cust_pending_transactions_obj.sponsor_outlet_id})
		return HttpResponseRedirect(url)        
# def test(request, key=""):
#     print("SSSSSSSSSSSSSS")

#     url = reverse('auth_merchant:email_verification_succeed')
#     return HttpResponseRedirect(url)

def cust_transaction_verification(request,outcode='0',template_name='merchant_site/make_your_circle/privileged_xircl/customer_reward_confirm.html'):
	try:
		outletobj = get_object_or_404(outlet_details,id=outcode)
	except:
		outletobj = None
	if outletobj:
		outlet_image = "https://hr.xircls.com/static/"+str(outletobj.outlet_logo)
	else:
		outlet_image = "https://hr.xircls.com/static/xirclslogo.png"

	return render(request,template_name,locals())

def cust_transaction_verification_completed(request,outcode='0',template_name='merchant_site/make_your_circle/privileged_xircl/customer_reward_confirm_verified.html'):
	try:
		outletobj = get_object_or_404(outlet_details,id=outcode)
	except:
		outletobj = None
	if outletobj:
		outlet_image = "https://hr.xircls.com/static/"+str(outletobj.outlet_logo)
	else:
		outlet_image = "https://hr.xircls.com/static/xirclslogo.png"

	return render(request,template_name,locals())

def store_transactions(original_balance_amount,plan_id,outlet_id,kit_id,deduction_method,payment_status,balance_amount,debit_amount,credit_amount,remark,is_paid,customer_reach,own_transactions,topup,is_privilege_wallet,bill_available,commission_percentage,gst_perc,calculated_from):
	print("222222222||||||||||||||||||||||")
	print(original_balance_amount)
	print(plan_id)
	print(outlet_id)
	print(kit_id)
	print(deduction_method)
	print(payment_status)
	print(balance_amount)
	print(debit_amount)
	print(credit_amount)
	print(remark)

	childtransactions_obj = childtransactions()
	# childtransactions_obj.transaction_no = 
	childtransactions_obj.plan_subcription = plan_id
	childtransactions_obj.plan_deduction_type = deduction_method
	childtransactions_obj.payment_status = payment_status
	childtransactions_obj.payment_date = datetime.now()
	childtransactions_obj.original_balance_amount = original_balance_amount
	childtransactions_obj.balance_amount = balance_amount
	childtransactions_obj.debit_amount = debit_amount
	childtransactions_obj.credit_amount = credit_amount
	childtransactions_obj.outlet_id  = outlet_id
	childtransactions_obj.kit_id = kit_id
	childtransactions_obj.remarks = remark
	childtransactions_obj.is_paid = is_paid
	childtransactions_obj.customer_reach = customer_reach
	childtransactions_obj.own_transactions = own_transactions  
	childtransactions_obj.topup = topup  
	childtransactions_obj.save()
	childtransactions_obj.transaction_no = childtransactions_obj.id
	childtransactions_obj.is_privilege_wallet = is_privilege_wallet
	childtransactions_obj.bill_available = bill_available
	childtransactions_obj.commission_percentage = commission_percentage
	childtransactions_obj.gst_perc = gst_perc
	childtransactions_obj.calculated_from = calculated_from
	childtransactions_obj.save()

def exportcustomerdetails(request):

	# Create the HttpResponse object with the appropriate CSV header.
	outlet_id = request.session.get('outlet_id')
	print(outlet_id)
	
	response = HttpResponse(content_type='text/csv')
	response['Content-Disposition'] = 'attachment; filename="my_customers'+ \
	str(datetime.now())+'.csv"'

	writer = csv.writer(response)
	writer.writerow(['Name', 'Email', 'Phone', 'Address1', 'Address2', 'City', 'State', 'Country', 'Pincode', 'Date Of Birth', 'Gender', 'Marital Status','Marriage Anniversery', 'Children', 'Occupation', 'Pancard', 'Adharcard'])
	# writer.writerow(['Second row', 'A', 'B', 'C', '"Testing"', "Here's a quote"])
	customers = customer_details.objects.filter(outlet_id=outlet_id)
	# ,cust.city,cust.state,cust.country,cust.pincode,cust.cust_dob,cust.gender,cust.marital_status,cust.marriage_anniversery.cust.children,cust.occupation,cust.pancard,cust.Adharcard
	for cust in customers:
		writer.writerow([cust.customer_name,cust.email,cust.phone_no,cust.address_line1,cust.address_line2,cust.city,cust.state,cust.country,cust.pincode,cust.cust_dob,cust.gender,cust.marital_status,cust.marriage_anniversery,cust.children,cust.occupation,cust.pancard,cust.Adharcard])
	
	return response

	# print(data)
	# response = response_json(request, 'success', '200', data, message, '')
	# return JsonResponse(response) 

def cust_add_to_privilege(request):
	data = {}
	message = ""
	
	if request.method == "POST":
		postdata =request.POST.copy()
		print(postdata)
		
		outlet_id = postdata.get('outlet_id')
		cust_ids = postdata.getlist('cust_ids[]')
		group_name = postdata.get('selected_group')
		customer_id = postdata.get('cust_ids',None)
		try:
			outlet_id = request.session.get('outlet_id')
		except:
			outlet_id = None    
		
		print(outlet_id)
		privileged_customers_subgroup_obj_new = privileged_customers_subgroup()
		try:
			outlet_obj = get_object_or_404(outlet_details,id = outlet_id)
		except:
			outlet_obj = None
		if outlet_obj:
			#privileged_customers_subgroup_obj = privileged_customers_subgroup.objects.filter(outlet_id_id = outlet_obj.id)
			customers_grouped_obj_new = customers_grouped()
			# customers_grouped_obj = customers_grouped.objects.filter(outlet_id_id =  outlet_obj.id)
			# if customers_grouped_obj:
			
			if group_name == "Individual_Group":
				try:
					customers_grouped_obj = get_object_or_404(customers_grouped,outlet_id_id =  outlet_obj.id,customer_id = customer_id)
				except:
					customers_grouped_obj = None
					
				if customers_grouped_obj and customers_grouped_obj.is_privileged == False:
					customers_grouped_obj.customer_id = customer_id
					customers_grouped_obj.outlet_id_id = outlet_obj.id
					customers_grouped_obj.is_privileged = True
					customers_grouped_obj.is_regular = False
					customers_grouped_obj.save()

					privileged_customers_subgroup_obj_new.customer_id = customer_id
					privileged_customers_subgroup_obj_new.cust_group_id_id = customers_grouped_obj.id
					privileged_customers_subgroup_obj_new.outlet_id_id = outlet_obj.id
					privileged_customers_subgroup_obj_new.sub_group_name = group_name
					privileged_customers_subgroup_obj_new.save()
					
					message = "Customer added to Privilege"
				elif customers_grouped_obj and customers_grouped_obj.is_privileged == True:
					try:
						privileged_customers_subgroup_obj2 = get_object_or_404(privileged_customers_subgroup,customer_id = customer_id,outlet_id_id=outlet_obj.id)
					except:
						privileged_customers_subgroup_obj2 = None
					if privileged_customers_subgroup_obj2 and privileged_customers_subgroup_obj2.sub_group_name != group_name:
						privileged_customers_subgroup_obj2.sub_group_name = group_name
						privileged_customers_subgroup_obj2.save()
					elif privileged_customers_subgroup_obj2 == None:
						privileged_customers_subgroup_obj_new.customer_id = customer_id
						privileged_customers_subgroup_obj_new.cust_group_id_id = customers_grouped_obj_new.id
						privileged_customers_subgroup_obj_new.outlet_id_id = outlet_obj.id
						privileged_customers_subgroup_obj_new.sub_group_name = group_name
						privileged_customers_subgroup_obj_new.save()
						message = "Customer added to Privilege"


				else:
					customers_grouped_obj_new = customers_grouped()
					customers_grouped_obj_new.customer_id = customer_id
					customers_grouped_obj_new.outlet_id_id = outlet_obj.id
					customers_grouped_obj_new.is_privileged = True
					customers_grouped_obj_new.is_regular = False
					customers_grouped_obj_new.save()
				
					privileged_customers_subgroup_obj_new = privileged_customers_subgroup()
					privileged_customers_subgroup_obj_new.customer_id = customer_id
					privileged_customers_subgroup_obj_new.cust_group_id_id = customers_grouped_obj_new.id
					privileged_customers_subgroup_obj_new.outlet_id_id = outlet_obj.id
					privileged_customers_subgroup_obj_new.sub_group_name = group_name
					privileged_customers_subgroup_obj_new.save()
					message = "Customer changed from regular to Privilege"                
			
			else:
				for ids in cust_ids:
					try:
						customers_grouped_obj = get_object_or_404(customers_grouped,outlet_id_id =  outlet_obj.id,customer_id = ids)
					except:
						customers_grouped_obj = None
					print(customers_grouped_obj)
					if customers_grouped_obj and customers_grouped_obj.is_privileged == False:
						customers_grouped_obj.customer_id = ids
						customers_grouped_obj.outlet_id_id = outlet_obj.id
						customers_grouped_obj.is_privileged = True
						customers_grouped_obj.is_regular = False
						customers_grouped_obj.save()

						privileged_customers_subgroup_obj_new.customer_id = ids
						privileged_customers_subgroup_obj_new.cust_group_id_id = customers_grouped_obj.id
						privileged_customers_subgroup_obj_new.outlet_id_id = outlet_obj.id
						privileged_customers_subgroup_obj_new.sub_group_name = group_name
						privileged_customers_subgroup_obj_new.save()
						
						message = "Customer added to Privilege"
					elif customers_grouped_obj and customers_grouped_obj.is_privileged == True:
						try:
							privileged_customers_subgroup_obj2 = get_object_or_404(privileged_customers_subgroup,customer_id = ids,outlet_id_id=outlet_obj.id)
						except:
							privileged_customers_subgroup_obj2 = None
						if privileged_customers_subgroup_obj2 and privileged_customers_subgroup_obj2.sub_group_name != group_name:
							privileged_customers_subgroup_obj2.sub_group_name = group_name
							privileged_customers_subgroup_obj2.save()
						elif privileged_customers_subgroup_obj2 == None:
							privileged_customers_subgroup_obj_new.customer_id = ids
							privileged_customers_subgroup_obj_new.cust_group_id_id = customers_grouped_obj_new.id
							privileged_customers_subgroup_obj_new.outlet_id_id = outlet_obj.id
							privileged_customers_subgroup_obj_new.sub_group_name = group_name
							privileged_customers_subgroup_obj_new.save()
							message = "Customer added to Privilege"


					else:
						customers_grouped_obj_new = customers_grouped()
						customers_grouped_obj_new.customer_id = ids
						customers_grouped_obj_new.outlet_id_id = outlet_obj.id
						customers_grouped_obj_new.is_privileged = True
						customers_grouped_obj_new.is_regular = False
						customers_grouped_obj_new.save()
					
						privileged_customers_subgroup_obj_new = privileged_customers_subgroup()
						privileged_customers_subgroup_obj_new.customer_id = ids
						privileged_customers_subgroup_obj_new.cust_group_id_id = customers_grouped_obj_new.id
						privileged_customers_subgroup_obj_new.outlet_id_id = outlet_obj.id
						privileged_customers_subgroup_obj_new.sub_group_name = group_name
						privileged_customers_subgroup_obj_new.save()
						message = "Customer changed from regular to Privilege"
		else:
			message = "Error"

	response = response_json(request, 'success', '200', data, message, '')
	return JsonResponse(response) 

def cust_add_to_group(request,template_name='merchant_site/customers/add_customer_group.html'):
	try:
		outletobj = get_object_or_404(outlet_details,id=request.session.get('outlet_id'))
	except:
		outletobj = None
	try:
		user_obj = get_object_or_404(User,id=request.session.get('root_user_id'))
	except:
		user_obj = None
	
	privilege_customer_groups_obj = privilege_customer_groups.objects.filter(outlet_id=request.session.get("outlet_id"))
	data = []
	for pcg in privilege_customer_groups_obj:
		temp = {
			"name":pcg.group_name
		}
		data.append(temp)
	import json
	customer_group_list = json.dumps(data)
	
	if request.method == "POST":
		postdata = request.POST.copy()
		print(postdata)
		group_names = postdata.getlist('group')
		remarks = postdata.getlist('remark')

		for i in range(len(group_names)):
			privilege_customer_groups_obj = privilege_customer_groups()
			privilege_customer_groups_obj.group_name = group_names[i]
			privilege_customer_groups_obj.description = remarks[i]
			privilege_customer_groups_obj.outlet_id = outletobj.id
			privilege_customer_groups_obj.created_by_id = user_obj.id
			privilege_customer_groups_obj.save()

		
		url = reverse('customers:customer_groups')
		return HttpResponseRedirect(url)
	# if outletobj:
	#     outlet_image = "https://hr.xircls.com/static/"+str(outletobj.outlet_logo)
	# else:
	#     outlet_image = "https://hr.xircls.com/static/xirclslogo.png"

	return render(request,template_name,locals())

@login_required(login_url='/merchant-login/')
def jmd_finance_view(request,finance_id, template_name='merchant_site/customers/jmd_finance_view.html'):
	outletid = request.session.get('outlet_id')
	active_page_name = 'jmd_finance_view'
	todays_date = datetime.today()

	outlet_details_obj = get_object_or_404(outlet_details,id=outletid)
	all_finance = get_object_or_404(finance_details,outlet = outletid,id=finance_id)
	all_products_obj = product_details.objects.filter(outlet_id=outletid)
	total_loan_amount = all_finance.Loan_amount
	rp_loan_amount = 0
	rp_emi_paid = 0
	rp_emi_remain = 0
	emi_payment_details_obj = emi_payment_details.objects.filter(outlet_id = outletid,finance_details_id=finance_id)
	if emi_payment_details_obj:
		for nm in emi_payment_details_obj:
			rp_emi_paid = float(rp_emi_paid) + float(nm.amount_paid)
			rp_loan_amount = nm.total_amount   
			rp_emi_remain = nm.remain_amount

	try:
		last_emi_payment_obj = emi_payment_details.objects.filter(outlet_id = outletid,finance_details_id=finance_id).last()
		emi_amt_remain = float(last_emi_payment_obj.remain_amount)
		total_amount_to_pay2 = last_emi_payment_obj.remain_amount
	except:
		last_emi_payment_obj = None
		emi_amt_remain = float(total_loan_amount)
		total_amount_to_pay2 = total_loan_amount
		rp_loan_amount = total_loan_amount

	if request.method == 'POST':
		postdata = request.POST.copy()
		print(postdata)
		if postdata.get('temp_add_emi_payment_btn') == "add_emi_payment_btn":
			transaction_id = postdata.get('transaction_id')
			payment_date = postdata.get('payment_date')
			total_amount_side = postdata.get('total_amount_side')
			amount_remain = postdata.get('amount_remain')
			emi_amount_payment = postdata.get('emi_amount_payment')
			payment_status_side = postdata.get('payment_status_side')
			payment_method = postdata.get('payment_method') 

			emi_payment_details_new = emi_payment_details()
			emi_payment_details_new.transaction_id = transaction_id
			emi_payment_details_new.payment_date = datetime.strptime(payment_date, '%d-%m-%Y')
			emi_payment_details_new.total_amount = total_amount_side
			emi_payment_details_new.payment_status = payment_status_side
			emi_payment_details_new.payment_method = payment_method
			emi_payment_details_new.created_at = todays_date
			emi_payment_details_new.customer_id = all_finance.customer_id
			emi_payment_details_new.outlet = outlet_details_obj
			emi_payment_details_new.finance_details_id = all_finance
			
			emi_payment_details_new.amount_paid = emi_amount_payment

			emi_amt_remain = float(total_amount_to_pay2) - float(emi_amount_payment)
			emi_payment_details_new.remain_amount = emi_amt_remain
			emi_payment_details_new.save()


			try:
				finance_setting_obj = get_object_or_404(finance_setting,outlet_id=outletid)
			except:
				finance_setting_obj = None
			if finance_setting_obj:
				offer_issue = finance_setting_obj.issue_offer

			try:
				if offer_issue == True:
					emi_payment_offer_issuance(request,finance_id,emi_amount_payment)
					messages.add_message(request, messages.SUCCESS, 'Offer issued.',fail_silently=True)
			except:
				pass

			messages.add_message(request, messages.SUCCESS, 'EMI Added Successfully', fail_silently=True)
			url = reverse('customers:jmd_finance_view' ,kwargs={'finance_id': finance_id})
			return HttpResponseRedirect(url)
	result_list = []
	return render(request,template_name,locals())

@multi_user_permission('view', 'customers')
@login_required(login_url='/merchant-login/')
def all_cust_detail_list(request,slug, template_name='merchant_site/customers/all_cust_detail_list.html'):

	outletid = request.session.get('outlet_id')
	active_page_name = ''

	if slug == 'add_vehicle':
		active_page_name = 'All Vehicle'
	elif slug == 'add_finance':
		active_page_name = 'All Finance'
	elif slug == 'add_insurance':
		active_page_name = 'All Insurance'
	elif slug == 'add_servicing':
		active_page_name = 'All Servicing'
	else:
		active_page_name = None

   
	result_list = []
	if slug == 'add_vehicle':
		all_vehicle = jmdCustomerVehicle.objects.filter(outlet_id = outletid)
		
		for i in all_vehicle:
			temp_ict = {}
			
			try:
				customer_details_obj = get_object_or_404(customer_details, id = i.customer_id)
				temp_ict['customer_id'] = customer_details_obj.id
				temp_ict['customer_name'] = customer_details_obj.customer_name
				temp_ict['customer_email'] = customer_details_obj.email
				temp_ict['phone_no'] = customer_details_obj.phone_no
			except:
				temp_ict['customer_id'] = ''
				temp_ict['customer_name'] = ''
				temp_ict['customer_email'] = ''
				temp_ict['phone_no'] = ''

			temp_ict['vehicle_number'] = i.vehicle_number
			temp_ict['vehicle_type'] = i.vehicle_type
			temp_ict['registration_number'] = i.registration_number
			temp_ict['brand'] = i.brand
			temp_ict['variant'] = i.variant
			temp_ict['car_model'] = i.car_model

			temp_ict['service_schedule'] = i.service_schedule
			temp_ict['delivery_date'] = i.delivery_date
			temp_ict['date_of_sale'] = i.date_of_sale
			temp_ict['sales_executive'] = i.sales_executive

			temp_ict['sales_location'] = i.sales_location
			temp_ict['created_at'] = i.created_at

			result_list.append(temp_ict)

		print(result_list)
	
	elif slug == 'add_finance':    

		all_finance = finance_details.objects.filter(outlet_id = outletid)
		for i in all_finance:
			temp_ict = {}
			
			try:
				customer_details_obj = get_object_or_404(customer_details, id = i.customer_id)
				temp_ict['customer_id'] = customer_details_obj.id
				temp_ict['customer_name'] = customer_details_obj.customer_name
				temp_ict['customer_email'] = customer_details_obj.email
				temp_ict['phone_no'] = customer_details_obj.phone_no
			except:
				temp_ict['customer_id'] = ''
				temp_ict['customer_name'] = ''
				temp_ict['customer_email'] = ''
				temp_ict['phone_no'] = ''

			temp_ict['Loan_Number'] = i.Loan_Number
			temp_ict['Loan_Type'] = i.Loan_Type
			temp_ict['Rate_of_Interest'] = i.Rate_of_Interest
			temp_ict['Loan_amount'] = i.Loan_amount

			temp_ict['Emi_Amount'] = i.Emi_Amount
			temp_ict['Emi_Start_Date'] = i.Emi_Start_Date
			temp_ict['Emi_End_Date'] = i.Emi_End_Date
			

			result_list.append(temp_ict)

	elif slug == 'add_insurance':

		all_insurance = jmd_cust_insurance_details.objects.filter(outlet_id = outletid)
		for i in all_insurance:
			temp_ict = {}
			
			try:
				customer_details_obj = get_object_or_404(customer_details, id = i.customer_id)
				temp_ict['customer_id'] = customer_details_obj.id
				temp_ict['customer_name'] = customer_details_obj.customer_name
				temp_ict['customer_email'] = customer_details_obj.email
				temp_ict['phone_no'] = customer_details_obj.phone_no
			except:
				temp_ict['customer_id'] = ''
				temp_ict['customer_name'] = ''
				temp_ict['customer_email'] = ''
				temp_ict['phone_no'] = ''

			try:
				vehicle_obj = get_object_or_404(jmdCustomerVehicle,id=i.vehicle_id)
				temp_ict['brand'] = vehicle_obj.brand
				temp_ict['variant'] = vehicle_obj.variant
				temp_ict['car_model'] = vehicle_obj.car_model
			except:
				temp_ict['brand'] = ''
				temp_ict['variant'] = ''
				temp_ict['car_model'] = ''

			temp_ict['policy_number'] = i.policy_number
			temp_ict['insurance_company'] = i.insurance_company
			temp_ict['policy_purchase_date'] = i.policy_purchase_date
			temp_ict['policy_expiry_date'] = i.policy_expiry_date
			temp_ict['amount'] = i.amount
			
			result_list.append(temp_ict)

	elif slug == 'add_servicing':

		all_servicing = jmdCustServicingDetails.objects.filter(outlet_id = outletid)
		for i in all_servicing:
			temp_ict = {}
			
			try:
				customer_details_obj = get_object_or_404(customer_details, id = i.customer_id)
				temp_ict['customer_id'] = customer_details_obj.id
				temp_ict['customer_name'] = customer_details_obj.customer_name
				temp_ict['customer_email'] = customer_details_obj.email
				temp_ict['phone_no'] = customer_details_obj.phone_no
			except:
				temp_ict['customer_id'] = ''
				temp_ict['customer_name'] = ''
				temp_ict['customer_email'] = ''
				temp_ict['phone_no'] = ''

			try:
				vehicle_obj = get_object_or_404(jmdCustomerVehicle,id=i.vehicle_id)
				temp_ict['brand'] = vehicle_obj.brand
				temp_ict['variant'] = vehicle_obj.variant
				temp_ict['car_model'] = vehicle_obj.car_model
			except:
				temp_ict['brand'] = ''
				temp_ict['variant'] = ''
				temp_ict['car_model'] = ''



			temp_ict['service_location'] = i.service_location
			temp_ict['job_card_date'] = i.job_card_date
			temp_ict['service_invoice_date'] = i.service_invoice_date
			temp_ict['service_expiry_date'] = i.service_expiry_date
			temp_ict['service_invoice_amount'] = i.service_invoice_amount

			

			result_list.append(temp_ict)

	else:
		print('kkkkkkkkkkkkkkkkkk')
		result_list = []

	# print(result_list)

	reportObj = None
	if len(result_list) > 0:
		paginator = Paginator(result_list, 25)  # Show 25 contacts per page
		page = request.GET.get('page')
		try:
			reportObj = paginator.page(page)
		except PageNotAnInteger:
			# If page is not an integer, deliver first page.
			reportObj = paginator.page(1)
		except EmptyPage:
			# If page is out of range (e.g. 9999), deliver last page of results.
			reportObj = paginator.page(paginator.num_pages)   
	


	return render(request,template_name,locals())

# @login_required(login_url='/merchant-login/')
@login_required(login_url='/merchant-login/')
@multi_user_permission('view', 'customers')
@redirectMerchantAsPerProgress("MY_CUSTOMERS")
def all_cust_dashboard(request,slug, template_name='merchant_site/customers/all_cust_dashboard.html'):

	outletid = request.session.get('outlet_id')
	active_page_name = ''
	todays_date = datetime.today()


	if slug == 'add_vehicle':
		active_page_name = 'All Vehicle'
	elif slug == 'add_finance':
		active_page_name = 'All Finance'
	elif slug == 'add_insurance':
		active_page_name = 'All Insurance'
	elif slug == 'add_servicing':
		active_page_name = 'All Servicing'
	else:
		active_page_name = None

   
	result_list = []
	todays_result_list = []
	upcoming_result_list = []

	if slug == 'add_vehicle':
		all_vehicle = jmdCustomerVehicle.objects.filter(outlet_id = outletid)
		delivery_today_list = []
		for i in all_vehicle:
			temp_ict = {}
			
			try:
				customer_details_obj = get_object_or_404(customer_details, id = i.customer_id)
				temp_ict['customer_id'] = customer_details_obj.id
				temp_ict['customer_name'] = customer_details_obj.customer_name
				temp_ict['customer_email'] = customer_details_obj.email
				temp_ict['phone_no'] = customer_details_obj.phone_no
			except:
				temp_ict['customer_id'] = ''
				temp_ict['customer_name'] = ''
				temp_ict['customer_email'] = ''
				temp_ict['phone_no'] = ''

			temp_ict['vehicle_number'] = i.vehicle_number
			temp_ict['vehicle_type'] = i.vehicle_type
			temp_ict['registration_number'] = i.registration_number
			temp_ict['brand'] = i.brand
			temp_ict['variant'] = i.variant
			temp_ict['car_model'] = i.car_model

			temp_ict['service_schedule'] = i.service_schedule
			temp_ict['delivery_date'] = i.delivery_date
			temp_ict['date_of_sale'] = i.date_of_sale
			temp_ict['sales_executive'] = i.sales_executive

			temp_ict['sales_location'] = i.sales_location
			temp_ict['created_at'] = i.created_at

			result_list.append(temp_ict)

			if i.created_at.date() == todays_date.date():
				todays_result_list.append(temp_ict)
			if i.delivery_date:
				if i.delivery_date.date() == todays_date.date():
					delivery_today_list.append(temp_ict)

	elif slug == 'add_finance':    

		all_finance = finance_details.objects.filter(outlet_id = outletid)
		total_loan_amount = 0
		for i in all_finance:
			temp_ict = {}
			emi_payment_details_obj = emi_payment_details.objects.filter(finance_details_id_id=i.id).order_by('created_at').last()
			
			try:
				customer_details_obj = get_object_or_404(customer_details, id = i.customer_id)
				temp_ict['customer_id'] = customer_details_obj.id
				temp_ict['customer_name'] = customer_details_obj.customer_name
				temp_ict['customer_email'] = customer_details_obj.email
				temp_ict['phone_no'] = customer_details_obj.phone_no
			except:
				temp_ict['customer_id'] = ''
				temp_ict['customer_name'] = ''
				temp_ict['customer_email'] = ''
				temp_ict['phone_no'] = ''

			temp_ict['Loan_Number'] = i.Loan_Number
			temp_ict['Loan_Type'] = i.Loan_Type
			temp_ict['id'] = i.id
			temp_ict['Rate_of_Interest'] = i.Rate_of_Interest
			temp_ict['Loan_amount'] = i.Loan_amount

			temp_ict['Emi_Amount'] = i.Emi_Amount
			temp_ict['Emi_Start_Date'] = i.Emi_Start_Date
			temp_ict['Emi_End_Date'] = i.Emi_End_Date
			if i.Loan_amount:
				total_loan_amount = total_loan_amount + int(i.Loan_amount)
			result_list.append(temp_ict)

			if i.created_at.date() == todays_date.date():
				todays_result_list.append(temp_ict)
			
				
		emi_pay_obj = emi_payment_details.objects.filter(outlet_id=outletid)
		total_emi_amt = 0
		for epo in emi_pay_obj:
			total_emi_amt = total_emi_amt + int(epo.amount_paid) 
		total_loan_amount_remain = total_loan_amount - total_emi_amt
		from json import dumps
		finance_data = dumps(result_list)

	elif slug == 'add_insurance':

		all_insurance = jmd_cust_insurance_details.objects.filter(outlet_id = outletid)
		total_amount = 0
		cursor = connection.cursor()
		cursor.execute('''SELECT DISTINCT  `customer_id` FROM `xl925_jmd_cust_insurance_details` WHERE outlet_id={0} '''.format(outletid))
		total_customers = dictfetchall(cursor)
		for i in all_insurance:
			temp_ict = {}
			
			try:
				customer_details_obj = get_object_or_404(customer_details, id = i.customer_id)
				temp_ict['customer_id'] = customer_details_obj.id
				temp_ict['customer_name'] = customer_details_obj.customer_name
				temp_ict['customer_email'] = customer_details_obj.email
				temp_ict['phone_no'] = customer_details_obj.phone_no
			except:
				temp_ict['customer_id'] = ''
				temp_ict['customer_name'] = ''
				temp_ict['customer_email'] = ''
				temp_ict['phone_no'] = ''

			try:
				vehicle_obj = get_object_or_404(jmdCustomerVehicle,id=i.vehicle_id)
				temp_ict['brand'] = vehicle_obj.brand
				temp_ict['variant'] = vehicle_obj.variant
				temp_ict['car_model'] = vehicle_obj.car_model
			except:
				temp_ict['brand'] = ''
				temp_ict['variant'] = ''
				temp_ict['car_model'] = ''

			temp_ict['policy_number'] = i.policy_number
			temp_ict['insurance_company'] = i.insurance_company
			temp_ict['policy_purchase_date'] = i.policy_purchase_date
			temp_ict['policy_expiry_date'] = i.policy_expiry_date
			temp_ict['amount'] = i.amount
			total_amount = total_amount + int(i.amount)

			if i.created_at.date() == todays_date.date():
				todays_result_list.append(temp_ict)
			result_list.append(temp_ict)


	elif slug == 'add_servicing':

		all_servicing = jmdCustServicingDetails.objects.filter(outlet_id = outletid)
		cursor = connection.cursor()
		cursor.execute('''SELECT DISTINCT  `customer_id` FROM `xl925_jmd_cust_servicing_details` WHERE outlet_id={0} '''.format(outletid))
		total_customers = dictfetchall(cursor)
		total_amount = 0
		for i in all_servicing:
			temp_ict = {}
			
			try:
				customer_details_obj = get_object_or_404(customer_details, id = i.customer_id)
				temp_ict['customer_id'] = customer_details_obj.id
				temp_ict['customer_name'] = customer_details_obj.customer_name
				temp_ict['customer_email'] = customer_details_obj.email
				temp_ict['phone_no'] = customer_details_obj.phone_no
			except:
				temp_ict['customer_id'] = ''
				temp_ict['customer_name'] = ''
				temp_ict['customer_email'] = ''
				temp_ict['phone_no'] = ''

			try:
				vehicle_obj = get_object_or_404(jmdCustomerVehicle,id=i.vehicle_id)
				temp_ict['brand'] = vehicle_obj.brand
				temp_ict['variant'] = vehicle_obj.variant
				temp_ict['car_model'] = vehicle_obj.car_model
			except:
				temp_ict['brand'] = ''
				temp_ict['variant'] = ''
				temp_ict['car_model'] = ''



			temp_ict['service_location'] = i.service_location
			temp_ict['job_card_date'] = i.job_card_date
			temp_ict['service_invoice_date'] = i.service_invoice_date
			temp_ict['service_expiry_date'] = i.service_expiry_date
			temp_ict['service_invoice_amount'] = i.service_invoice_amount
			total_amount = total_amount + int(i.service_invoice_amount)

			result_list.append(temp_ict)
			if i.service_invoice_date.date() == todays_date.date():
				todays_result_list.append(temp_ict)

			if i.created_at.date() > todays_date.date():
				todays_result_list.append(temp_ict)

	else:
		print('kkkkkkkkkkkkkkkkkk')
		result_list = []

	# print(result_list)

	reportObj = None
	if len(result_list) > 0:
		paginator = Paginator(result_list, 25)  # Show 25 contacts per page
		page = request.GET.get('page')
		try:
			reportObj = paginator.page(page)
		except PageNotAnInteger:
			# If page is not an integer, deliver first page.
			reportObj = paginator.page(1)
		except EmptyPage:
			# If page is out of range (e.g. 9999), deliver last page of results.
			reportObj = paginator.page(paginator.num_pages)   
	


	return render(request,template_name,locals())

#
@login_required
def add_support_ticket(request,template_name="merchant_site/customers/add_support_ticket.html"):
	page_name = "add_support_ticket"
	outlet_id = request.session.get('outlet_id')

	# print(request.session.get('outlet_id'),"/'/'/'")
	my_all_customer_details_obj = customer_details.objects.filter(outlet_id=outlet_id)

	my_cust_list = []
	from json import dumps
	for cust in my_all_customer_details_obj:
		new_dataDictionary = { 
			'cust_id': cust.id,
			'cust_email': cust.email,  
			'cust_mobile': cust.phone_no, 
			}
		my_cust_list.append(new_dataDictionary)
	cust_dataJSON = dumps(my_cust_list)

	if request.method == 'POST':
		postdata = request.POST.copy()
		cust_id = postdata.get("cust_name")
		Department = postdata.get("Department")
		Product = postdata.get("Product")
		ticket_status = postdata.get("ticket_status")
		priority = postdata.get("priority")
		Remark = postdata.get("Remark")

		try:
			customer_details_obj = get_object_or_404(customer_details,id=cust_id)
		except:
			customer_details_obj = None
		
		try:
			outlet_details_obj = get_object_or_404(outlet_details,id=outlet_id)
		except:
			outlet_details_obj = None

		Ticket_details_obj = Ticket_detail()
		Ticket_details_obj.customer_id = customer_details_obj
		Ticket_details_obj.outlet_id = outlet_details_obj
		Ticket_details_obj.Department = Department
		Ticket_details_obj.Product = Product
		Ticket_details_obj.Status = ticket_status
		Ticket_details_obj.Priority = priority
		Ticket_details_obj.Remark = Remark
		Ticket_details_obj.save()

		Ticket_history_obj = Ticket_history()
		Ticket_history_obj.ticket_id = Ticket_details_obj.id
		Ticket_history_obj.customer_id = customer_details_obj
		Ticket_history_obj.outlet_id = outlet_details_obj
		Ticket_history_obj.Department = Department
		Ticket_history_obj.Product = Product
		Ticket_history_obj.Status = ticket_status
		Ticket_history_obj.Priority = priority
		Ticket_history_obj.Remark = Remark
		Ticket_history_obj.save()

		if postdata.get("press_btn") == 'SAVE':
			messages.add_message(request, messages.SUCCESS, 'Ticket Added successfully',fail_silently=True)
			url = reverse('customers:all_suport_tickets')
			return HttpResponseRedirect(url)
		# print(Ticket_details_obj.id,"..............")
		# print(customer_details_obj.id,"customer_details_objcustomer_details_obj") 
	return render(request,template_name,locals())

def all_suport_tickets(request,template_name="merchant_site/customers/all_support_ticket_list.html"):
	page_name = "all_support_ticket"
	outlet_id =request.session.get("outlet_id")
	Ticket_details_obj  = Ticket_detail.objects.filter(outlet_id=outlet_id).order_by('-id')
	total_tickets = len(Ticket_details_obj)
	# print(Ticket_details_obj)

	if request.method == 'POST':
		postdata = request.POST.copy()
		filter_type = postdata.get("support_filter")
		if filter_type=="view_all":
			Ticket_details_obj  = Ticket_detail.objects.filter(outlet_id=outlet_id).order_by('-id')
		elif filter_type =="Low" or filter_type=="Medium" or filter_type =="High" or filter_type=="Urgent":
			Ticket_details_obj = Ticket_detail.objects.filter(Priority=filter_type,outlet_id=outlet_id)
		else:
			Ticket_details_obj  = Ticket_detail.objects.filter(Status=filter_type,outlet_id=outlet_id).order_by('-id')
	return render(request,template_name,locals())

def edit_support_ticket(request,ticketCode="",template_name="merchant_site/customers/edit_support_ticket_list.html"):
	page_name = "edit_support_ticket"
	outlet_id =request.session.get("outlet_id")

	if ticketCode != 0 or ticketCode != None:
		try:
			Ticket_details_obj  = get_object_or_404(Ticket_detail,id=ticketCode)
		except:
			Ticket_details_obj = None
	else:
		Ticket_details_obj = None 
	# print(Ticket_details_obj,"nnnnnnnnnnnn")

	if request.method == 'POST':
		postdata = request.POST.copy()
		# print(postdata,"///////")
		cust_id = postdata.get("cust_id")
		Department = postdata.get("Department")
		Product = postdata.get("Product")
		ticket_status = postdata.get("ticket_status")
		priority = postdata.get("priority")
		Remark = postdata.get("Remark")

		try:
			customer_details_obj = get_object_or_404(customer_details,id=cust_id)
		except:
			customer_details_obj = None
		
		try:
			outlet_details_obj = get_object_or_404(outlet_details,id=outlet_id)
		except:
			outlet_details_obj = None

		# print(cust_id,"customer_details_objcustomer_details_obj")

		Ticket_history_obj = Ticket_history()
		Ticket_history_obj.ticket_id = ticketCode
		Ticket_history_obj.customer_id = customer_details_obj
		Ticket_history_obj.outlet_id = outlet_details_obj
		Ticket_history_obj.Department = Department
		Ticket_history_obj.Product = Product
		Ticket_history_obj.Status = ticket_status
		Ticket_history_obj.Priority = priority
		Ticket_history_obj.Remark = Remark
		Ticket_history_obj.save()


		Ticket_details_obj = get_object_or_404(Ticket_detail,id=ticketCode)
		# print(Ticket_details_obj,"Ticket_details_objTicket_details_obj")
		Ticket_details_obj.customer_id = customer_details_obj
		Ticket_details_obj.outlet_id = outlet_details_obj
		Ticket_details_obj.Department = Department
		Ticket_details_obj.Product = Product
		Ticket_details_obj.Status = ticket_status
		Ticket_details_obj.Priority = priority
		Ticket_details_obj.Remark = Remark
		Ticket_details_obj.save()

		if postdata.get("press_btn") == 'SAVE':
			messages.add_message(request, messages.SUCCESS, 'Ticket Edited successfully',fail_silently=True)
			url = reverse('customers:all_suport_tickets')
			return HttpResponseRedirect(url)



	# print(ticketCode,"--------------")
	return render(request,template_name,locals())

def suport_tickets_history(request,CustCode="",template_name="merchant_site/customers/suport_tickets_history.html"):
	page_name = "suport_tickets_history"
	outlet_id =request.session.get("outlet_id")

	Ticket_history_obj = Ticket_history.objects.filter(customer_id=CustCode,outlet_id=outlet_id).order_by('-id')
	# print(Ticket_history_obj,"Ticket_history_objTicket_history_obj")

	return render(request,template_name,locals())

def view_suport_ticket(request,ticketCode="",template_name="merchant_site/customers/view_suport_ticket.html"):
	page_name = "view_suport_ticket"
	outlet_id =request.session.get("outlet_id")

	Ticket_history_obj = get_object_or_404(Ticket_history,id=ticketCode,outlet_id=outlet_id)
	
	return render(request,template_name,locals())

def deduct_xircls_commission(outletid,reward_id,credit_amount):
	print(outletid)


	try:
		commission_obj = get_object_or_404(Xircls_Commission_On_Reward,host_reward_name_id = reward_id)
	except:
		commission_obj = None

	deduction_value = 0
	is_flat = None
	deduction = 0
	gst_deduct = 0
	if commission_obj:
		print(commission_obj.flat_value)
		print(commission_obj.percentage_value)
		
		if commission_obj.flat_value:
			deduction_value = commission_obj.flat_value
			is_flat = "1"
		elif commission_obj.percentage_value:
			deduction_value = commission_obj.percentage_value
			is_flat = "0"
	# print(deduction_value)
	# print(is_flat)
	try:
		childtransactions_obj = childtransactions.objects.filter(outlet_id=outletid).last()
	except:
		childtransactions_obj = None

	if childtransactions_obj:
		topup = childtransactions_obj.topup
		original_balance_amount =  childtransactions_obj.original_balance_amount
		plan_id  = childtransactions_obj.plan_subcription
		host_outlet_id  = outletid
		deduction_method = childtransactions_obj.plan_deduction_type
		payment_status = "DR"
		kit_id = None
		own_transactions = childtransactions_obj.own_transactions
		customer_reach = childtransactions_obj.customer_reach

		if deduction_value and is_flat == "1":
			deduction = float(credit_amount) * float(deduction_value)
			print(deduction)
			# balance_amount = float(childtransactions_obj.balance_amount) - float(deduction_value)
			# debit_amount = float(deduction)
		elif deduction_value and is_flat == "0":
			deduction = float(credit_amount) * (float(deduction_value) / 100)
			print(deduction)
		gst_deduct = float(deduction) + float(deduction * 18 / 100)
		print(gst_deduct)
		balance_amount = float(childtransactions_obj.balance_amount) - float(gst_deduct)
		debit_amount = float(gst_deduct)
		calculated_from = credit_amount
		credit_amount = 0
		remark = "Amount Paid To Xircls."
		is_paid = childtransactions_obj.is_paid
		
		is_privilege_wallet = True
		bill_available = True
		commission_percentage = deduction_value
		gst_perc = 18
		store_transactions(original_balance_amount,plan_id,host_outlet_id,kit_id,deduction_method,payment_status,balance_amount,debit_amount,credit_amount,remark,is_paid,customer_reach,own_transactions,topup,is_privilege_wallet,bill_available,commission_percentage,gst_perc,calculated_from)
		# try:
		#     outlet_obj2 = get_object_or_404(outlet_details,id=outletid)
		# except:
		#     outlet_obj2 = None

		# eventLogObj = XirclsEventLog()
		# eventLogObj.event_log_type = "AL"
		# eventLogObj.event_type = "XIRCLS_DEDUC"
		# eventLogObj.log_text = "Amoun"
		# eventLogObj.user_to_notify_id = outlet_obj2.created_by_id
		# eventLogObj.user_who_fired_event_id = outlet_obj1.created_by_id
		# eventLogObj.outlet_to_notify_id = outlet_obj2.id
		# eventLogObj.outlet_who_fired_event_id = outlet_obj1.id
		# eventLogObj.company_id = outlet_obj2.company_id
		# eventLogObj.save()

def customer_groups(request,template_name="merchant_site/customers/customer_groups.html"):
	page_name = "customer_group"
	outlet_id =request.session.get("outlet_id")

	privilege_customer_groups_obj = privilege_customer_groups.objects.filter(outlet_id=outlet_id)
	
	# cust_id = Ticket_history_obj.customer_id.id
	# print(Ticket_history_obj.Remark,"Ticket_history_objTicket_history_obj=====================")

	cust_dict = {}
	
	cust_list = []
	for details in privilege_customer_groups_obj:
		# print(host.outlet_id)
		cust_dict['group_name'] = details.group_name
		cust_dict['description'] = details.description
		try:
			privileged_customers_subgroup_obj = privileged_customers_subgroup.objects.filter(sub_group_name =details.group_name,outlet_id_id = outlet_id).count()
		except:
			privileged_customers_subgroup_obj = None    

		cust_dict['no_of_customer'] = privileged_customers_subgroup_obj
		cust_list.append(cust_dict.copy())
	

	return render(request,template_name,locals())

def add_company_details(request,template_name='merchant_site/customers/add_company_details.html'):
	active_page_name = "add_company_details"
	outletid = request.session.get('outlet_id')
	try:
		outletObj = get_object_or_404(outlet_details, id = outletid)
	except:
		outletObj = None    
	if request.session.get('multi_user_id'):
		userId = request.session.get('multi_user_id')
	else:
		userId = request.user.id
	country_obj = Country.objects.all()
	print("pp-------------------------")

	if request.method == 'POST':
		postdata = request.POST.copy()
		print(postdata,"ppoo")
		try:
			clientObj = clients_account.objects.get(company_email=postdata.get('company_email'),company_website=postdata.get('company_website'),outlet_id=outletid)
		except:
			clientObj = None

		if clientObj == None:
			company_name = postdata.get('company_name',None)
			industry = postdata.get('Company_industry',None)
			company_gst = postdata.get('company_gst',None)
			company_phone = postdata.get('company_phone',None)
			company_email = postdata.get('company_email',None)
			company_website = postdata.get('company_website',None)
			
			press_btn = postdata.get('press_btn', None)
			# selected_outletid = outletid

			address = postdata.get('address_com',None)
			street = postdata.get('street_com',None)
			area_building = postdata.get('area_building_com',None)
			landmark = postdata.get('landmark_com',None)
			city = postdata.get('city_com',None)
			state = postdata.get('state_com',None)
			pincode = postdata.get('pincode_com',None)
			country = postdata.get('country_selection_com',None)
			company_pancard = postdata.get('company_pancard_name',None)


			clients_account_obj = clients_account()
			clients_account_obj.company_name = company_name
			clients_account_obj.industry = industry
			clients_account_obj.company_gst = company_gst
			clients_account_obj.company_phone = company_phone
			clients_account_obj.company_email = company_email
			clients_account_obj.company_website = company_website
			clients_account_obj.outlet = outletObj
			clients_account_obj.created_by_id = userId
			
			clients_account_obj.company_twitter = postdata.get('company_twitter_link',None)
			clients_account_obj.company_fb = postdata.get('company_facebook_link',None)
			clients_account_obj.company_insta = postdata.get('company_instagram_link',None)
			clients_account_obj.area_building = area_building
			clients_account_obj.address_line1 = address
			clients_account_obj.landmark = landmark
			clients_account_obj.city = city
			clients_account_obj.state = state
			clients_account_obj.street = street
			clients_account_obj.pincode = pincode
			clients_account_obj.country = country
			clients_account_obj.company_pancard = company_pancard
			# clients_account_obj.type = postdata.get('companyFor',None)
			clients_account_obj.save()
			
			if postdata.get('mark_parent') == 'no':
				try:
					parclientObj = clients_account.objects.get(company_email=postdata.get('par_company_email'),company_website=postdata.get('par_company_website'),outlet_id=selected_outletid)
				except:
					parclientObj = None

				if parclientObj == None:
					company_name = postdata.get('par_company_name',None)
					industry = postdata.get('par_industry',None)
					company_gst = postdata.get('par_company_gst',None)
					company_phone = postdata.get('par_company_phone',None)
					company_email = postdata.get('par_company_email',None)
					company_website = postdata.get('par_company_website',None)
					company_pancard = postdata.get('par_company_pancard_name',None)
					

					address = postdata.get('par_address_com',None)
					street = postdata.get('par_street_com',None)
					area_building = postdata.get('par_area_building_com',None)
					landmark = postdata.get('par_landmark_com',None)
					city = postdata.get('par_city_com',None)
					state = postdata.get('par_state_com',None)
					pincode = postdata.get('par_pincode_com',None)
					country = postdata.get('par_country_selection_com',None)


					par_clients_account_obj = clients_account()
					par_clients_account_obj.company_name = company_name
					par_clients_account_obj.industry = industry
					par_clients_account_obj.company_gst = company_gst
					par_clients_account_obj.company_phone = company_phone
					par_clients_account_obj.company_email = company_email
					par_clients_account_obj.company_website = company_website
					par_clients_account_obj.outlet = outletObj
					par_clients_account_obj.created_by_id = userId
					par_clients_account_obj.is_parent = True
					par_clients_account_obj.company_twitter = postdata.get('par_company_twitter_link',None)
					par_clients_account_obj.company_fb = postdata.get('par_company_facebook_link',None)
					par_clients_account_obj.company_insta = postdata.get('par_company_instagram_link',None)
					par_clients_account_obj.area_building = area_building
					par_clients_account_obj.address_line1 = address
					par_clients_account_obj.landmark = landmark
					par_clients_account_obj.city = city
					par_clients_account_obj.state = state
					par_clients_account_obj.street = street
					par_clients_account_obj.pincode = pincode
					par_clients_account_obj.country = country
					par_clients_account_obj.company_pancard = company_pancard
					par_clients_account_obj.save()
					clients_account_obj.parent_id = par_clients_account_obj
					clients_account_obj.save()
			else:
				clients_account_obj.is_parent = True
				clients_account_obj.save()
		print(postdata.get("add_company_from_add"),"ooo")
		if postdata.get("add_company_from_add") == "yes":
			temp = clients_account.objects.latest('id')
			print(temp,",:lll")
			data_new = { 
			'comapny_id':temp.id,
			'company_name':company_name,
			'industry':industry,
			'company_phone':company_phone,
			'company_email':company_email,
			'company_website':company_website,
			'company_gst':company_gst,
			'company_pancard_name':company_pancard
			}
			print("oooo---------------------------")
			response = response_json(request, 'success', '200', data_new, 'Company added successfully .', '')
			return JsonResponse(response)
		messages.add_message(request, messages.SUCCESS, ' Company added successfully',fail_silently=True)
		url = reverse('customers:all_company_details')
		return HttpResponseRedirect(url)

	return render(request,template_name,locals())



def edit_company_details(request,page='',client_acc_id='',template_name='merchant_site/customers/edit_company_details.html'):

	active_page_name = "edit_company_details"
	outletid = request.session.get('outlet_id')
	try:
		outletObj = get_object_or_404(outlet_details, id = outletid)
	except:
		outletObj = None   
	clients_account_obj = get_object_or_404(clients_account,id=client_acc_id,outlet_id=outletid)
	clients_acc = get_object_or_404(clients_account,id=client_acc_id,outlet_id=outletid)
	try:
		par_clients_account_obj = clients_account.objects.get(id=clients_account_obj.parent_id_id)
	except:
		par_clients_account_obj = None

	if clients_account_obj.is_parent == True:
		hasSubCompany = False
		subAcc = clients_account.objects.filter(parent_id_id = clients_account_obj.id)
		if len(subAcc) > 0:
			hasSubCompany = True
			subList = []
			for i in subAcc:
				subList.append(i.company_name)
			clients_account_obj.subCompList = subList

	country_obj = Country.objects.all()
	if request.method == 'POST':
		postdata = request.POST.copy()
		print(postdata,"ppoo")

	
		company_name = postdata.get('company_name',None)
		industry = postdata.get('Company_industry',None)
		company_gst = postdata.get('company_gst',None)
		company_phone = postdata.get('company_phone',None)
		company_email = postdata.get('company_email',None)
		company_website = postdata.get('company_website',None)
		
		press_btn = postdata.get('press_btn', None)
		# selected_outletid = outletid

		address = postdata.get('address_com',None)
		street = postdata.get('street_com',None)
		area_building = postdata.get('area_building_com',None)
		landmark = postdata.get('landmark_com',None)
		city = postdata.get('city_com',None)
		state = postdata.get('state_com',None)
		pincode = postdata.get('pincode_com',None)
		country = postdata.get('country_selection_com',None)
		company_pancard = postdata.get('company_pancard_name',None)

		
		if clients_acc:
			clients_acc.company_name = company_name
			clients_acc.industry = industry
			clients_acc.company_gst = company_gst
			clients_acc.company_phone = company_phone
			clients_acc.company_email = company_email
			clients_acc.company_website = company_website
			
			
			
			clients_acc.company_twitter = postdata.get('company_twitter_link',None)
			clients_acc.company_fb = postdata.get('company_facebook_link',None)
			clients_acc.company_insta = postdata.get('company_instagram_link',None)
			clients_acc.area_building = area_building
			clients_acc.address_line1 = address
			clients_acc.landmark = landmark
			clients_acc.city = city
			clients_acc.state = state
			clients_acc.street = street
			clients_acc.pincode = pincode
			clients_acc.country = country
			clients_acc.company_pancard = company_pancard
			clients_acc.save()
			
			
		

		if par_clients_account_obj:
			company_name = postdata.get('par_company_name',None)
			industry = postdata.get('par_industry',None)
			company_gst = postdata.get('par_company_gst',None)
			company_phone = postdata.get('par_company_phone',None)
			company_email = postdata.get('par_company_email',None)
			company_website = postdata.get('par_company_website',None)
			company_pancard = postdata.get('par_company_pancard_name',None)
			

			address = postdata.get('par_address_com',None)
			street = postdata.get('par_street_com',None)
			area_building = postdata.get('par_area_building_com',None)
			landmark = postdata.get('par_landmark_com',None)
			city = postdata.get('par_city_com',None)
			state = postdata.get('par_state_com',None)
			pincode = postdata.get('par_pincode_com',None)
			country = postdata.get('par_country_selection_com',None)


			
			par_clients_account_obj.company_name = company_name
			par_clients_account_obj.industry = industry
			par_clients_account_obj.company_gst = company_gst
			par_clients_account_obj.company_phone = company_phone
			par_clients_account_obj.company_email = company_email
			par_clients_account_obj.company_website = company_website
			par_clients_account_obj.outlet = outletObj
			
			
			par_clients_account_obj.company_twitter = postdata.get('par_company_twitter_link',None)
			par_clients_account_obj.company_fb = postdata.get('par_company_facebook_link',None)
			par_clients_account_obj.company_insta = postdata.get('par_company_instagram_link',None)
			par_clients_account_obj.area_building = area_building
			par_clients_account_obj.address_line1 = address
			par_clients_account_obj.landmark = landmark
			par_clients_account_obj.city = city
			par_clients_account_obj.state = state
			par_clients_account_obj.street = street
			par_clients_account_obj.pincode = pincode
			par_clients_account_obj.country = country
			par_clients_account_obj.company_pancard = company_pancard
			par_clients_account_obj.save()

		

		messages.add_message(request, messages.SUCCESS, ' Company edited successfully',fail_silently=True)
		if page == 'Customer':
			url = reverse('customers:get_my_customers_b2b')
		elif page == 'Lead':
			url = reverse('customers:leads_dashboard_b2b')
		elif page == 'Company':
			url = reverse('customers:all_company_details')
			
		return HttpResponseRedirect(url)
	return render(request,template_name,locals())

def all_company_details(request,template_name='merchant_site/customers/all_company_details.html'):
	active_page_name = "all_company_details"
	outletid = request.session.get('outlet_id')
	# for i in customer_details.objects.all():
	#     i.clients_acc_id = i.clients_account_id
	#     i.save()
	if request.session.get('multi_user_id'):
		userId = request.session.get('multi_user_id')
	else:
		userId = request.user.id
	clients_account_obj = clients_account.objects.filter(created_by_id=userId,is_trash=0).order_by('-id')
	CompanyList = []
	for i in clients_account_obj:
		temp={}
		compId = i.id
		if i.is_parent == True:
			hasSubCompany = False
			subAcc = clients_account.objects.filter(parent_id_id = i.id)
			if len(subAcc) > 0:
				hasSubCompany = True
				compId = None
		temp['id']=compId
		temp['company_name']=i.company_name
		temp['company_email']=i.company_email
		temp['company_phone']=i.company_phone
		temp['state']=i.state
		CompanyList.append(temp)

			
				
	if request.method == 'POST':
		postdata = request.POST.copy()
		print(postdata)
		if postdata.get('del_comp'):
			clients_account_ob = get_object_or_404(clients_account,id=postdata.get('del_comp'),created_by_id=userId)
			clients_account_ob.is_trash = 1
			clients_account_ob.save()
			messages.add_message(request, messages.SUCCESS, ' Company deleted successfully',fail_silently=True)
			url = reverse('customers:all_company_details')
			return HttpResponseRedirect(url)
	clients_account_obj = clients_account.objects.filter(created_by_id=userId,is_trash=0).order_by('-id')
	return render(request,template_name,locals())

@login_required(login_url='/merchant-login/')
@redirectMerchantAsPerProgress("MY_CUSTOMERS")
def emi_payment_offer_issuance(request,finance_id,emi_amount_payment):

	finance_details_obj = get_object_or_404(finance_details,id=finance_id)
	apikey = ""
	if finance_details_obj:
		offer_issue = False
		try:
			finance_setting_obj = get_object_or_404(finance_setting,outlet_id=finance_details_obj.outlet_id)
			customer_details_obj = get_object_or_404(customer_details,id = finance_details_obj.customer.id)
			outlet_obj = get_object_or_404(outlet_details,id=finance_details_obj.outlet.id)
			apikey = outlet_obj.api_key
			offer_issue = finance_setting_obj.issue_offer
		except:
			offer_issue = False
			finance_setting_obj = None
			apikey = ""


		if offer_issue == True:
			
			issue_kit_api_url = "https://hr.xircls.com/api/v1/confirm_order/"
			
			headers = {
				'Content-Type': 'application/x-www-form-urlencoded',
				'accept': 'application/json',
				'Authorization': str(apikey),
			}
			order_amt = emi_amount_payment
			
			order_data = {
				"customer_first_name":str(customer_details_obj.customer_name),
				"customer_mobile": str(customer_details_obj.phone_no),
				"customer_email": str(customer_details_obj.email),
				"pincode":str(customer_details_obj.pincode),
				"city":str(customer_details_obj.city),
				"country":str(customer_details_obj.country),
				"merchant_ref_code":"",
				"price_before_apply_offer": "",
				"price_after_apply_offer": str(order_amt),
				"entry_point": "DASH"
			}
			cust_confirm_order = json.loads(requests.post(issue_kit_api_url, data=order_data, headers=headers).text)

def finance_setting_details(request,template_name="merchant_site/customers/finance_setting.html"):

	active_page_name = 'finance_offer_issue_settings'
	outlet_id = request.session.get('outlet_id')
	now = datetime.now()

	offer_issue = False
	try:
		finance_setting_obj = get_object_or_404(finance_setting,outlet_id=outlet_id)
	except:
		finance_setting_obj = None
	if finance_setting_obj:
		offer_issue = finance_setting_obj.issue_offer
	if request.method == "POST":
		postdata = request.POST.copy()
		offer_setting = postdata.get('example-sw-success-lg2')
		print(offer_setting)

		if finance_setting_obj:
			if offer_setting == "on":
				boolean = True
			else:
				boolean = False
			finance_setting_obj.issue_offer = boolean
			finance_setting_obj.save()
		else:
			finance_setting_obj2 = finance_setting()
			finance_setting_obj2.issue_offer = True
			finance_setting_obj2.outlet_id = outlet_id
			finance_setting_obj2.save()
			boolean = True
		if boolean == False:
			messages.add_message(request, messages.ERROR, 'No offer will be issued.',fail_silently=True)
		else:
			messages.add_message(request, messages.SUCCESS, 'Offer will be issued.',fail_silently=True)
		url = reverse('customers:finance_setting_details')
		return HttpResponseRedirect(url)
	return render(request,template_name,locals())

def all_finance(request,template_name='merchant_site/customers/all_finance.html'):
	active_page_name = "all_finance"
	outletid = request.session.get('outlet_id')
	all_finance = finance_details.objects.filter(outlet_id = outletid)
	result_list = []
	for i in all_finance:
		temp_ict = {}
		
		try:
			customer_details_obj = get_object_or_404(customer_details, id = i.customer_id)
			temp_ict['customer_id'] = customer_details_obj.id
			temp_ict['customer_name'] = customer_details_obj.customer_name
			temp_ict['customer_email'] = customer_details_obj.email
			temp_ict['phone_no'] = customer_details_obj.phone_no
		except:
			temp_ict['customer_id'] = ''
			temp_ict['customer_name'] = ''
			temp_ict['customer_email'] = ''
			temp_ict['phone_no'] = ''

		temp_ict['Loan_Number'] = i.Loan_Number
		temp_ict['Loan_Type'] = i.Loan_Type
		temp_ict['Rate_of_Interest'] = i.Rate_of_Interest
		temp_ict['Loan_amount'] = i.Loan_amount

		temp_ict['Emi_Amount'] = i.Emi_Amount
		temp_ict['Emi_Start_Date'] = i.Emi_Start_Date
		temp_ict['Emi_End_Date'] = i.Emi_End_Date
		temp_ict['id'] = i.id
		

		result_list.append(temp_ict)

	return render(request,template_name,locals())

# @login_required
# def calendar(request, template_name='merchant_site/customers/all_calendar.html'):

# 	outlet_id = request.session.get('outlet_id')
# 	user_id = request.session.get('user_obj')


# 	from json import dumps

# 	"""
# 	Appointment Booking Data
# 	"""
# 	appointment_list = []

# 	appointment_booking_obj = appointment_booking.objects.filter(outlet_id=outlet_id, is_trash=0).order_by('-id')

# 	for bookings in appointment_booking_obj:
# 		try:
# 			cust_details = get_object_or_404(customer_details, id=bookings.customer_id)
# 			cust_name = cust_details.customer_name
# 			print("CustomerName", cust_name)
# 		except:
# 			cust_details = None
# 			cust_name = ""

# 		appointments = {
# 			'appointment_id': bookings.id,
# 			'appointment_date': bookings.appointment_date,
# 			'appointment_time': bookings.appointment_time,  
# 			'booking_note': bookings.booking_note, 
# 			'cust_id' : bookings.customer_id,
# 			'cust_name' : cust_name,
# 			'status' : bookings.status
# 		}
# 		appointment_list.append(appointments)
# 	appointment_data = dumps(appointment_list)
# 	print("AppointmentDumps--", appointment_data)

# 	"""
# 	Invoice Data
# 	"""
# 	total_due=[]

# 	orders= inovice_details.objects.filter(outlet_id=outlet_id).order_by('-id')
# 	for inv_d in orders:
# 		try:
# 			cust_details = get_object_or_404(customer_details, id=inv_d.customer_id)
# 			cust_name = cust_details.customer_name
# 		except:
# 			cust_details = None
# 			cust_name = ""
			
# 		if inv_d.due_date :
# 			invoicedict = { 
# 				'id': inv_d.id,
# 				'due_date': str((inv_d.due_date).date()),
# 				'cust_name':inv_d.customer_name,
# 				'invoice_number':inv_d.inovice_number
# 				}
# 			total_due.append(invoicedict)
# 	todays_data = dumps(total_due)
# 	print(todays_data,"---todays_data")


# 	"""
# 	Calls -> Customers/Lead 
# 	"""
# 	# Customers

# 	customer_calls = []

# 	calls = new_Addcall_details.objects.filter(outlet_id=outlet_id).order_by('-id')
# 	for cust_calls in calls:
# 		try:
# 			cust_details = get_object_or_404(customer_details, id=cust_calls.customer,is_trash=0)
# 			cust_name = cust_details.customer_name
# 		except:
# 			cust_details = None
# 			cust_name = ""

# 		try:
			
# 			lead_details_obj = get_object_or_404(lead_details,id=cust_calls.lead_id.id,is_trash=0)
# 			lead_name = lead_details_obj.customer_name
# 			lead_id = lead_details_obj.id
# 		except:
# 			lead_details_obj = None
# 			lead_name = ""
# 			lead_id = ""


# 		# try:
# 		#     schedule_Next_Call_date = datetime.strptime(cust_calls.schedule_Next_Call_time, '%H:%M').time()
# 		#     schedule_Next_Call_time = (schedule_Next_Call_date).strftime("%I:%M %p")
# 		# except:
# 		#     pass
# 		customer_call = {
# 			'call_id': cust_calls.id,
# 			'customer_id': cust_calls.customer,
# 			'lead_id': lead_id,
# 			'schedule_call_date': cust_calls.schedule_Next_Call_date,
# 			'schedule_call_time': cust_calls.schedule_Next_Call_time,
# 			'is_customer': cust_calls.is_customer,
# 			'cust_name' : cust_name,
# 			'lead_name': lead_name
# 		}
# 		customer_calls.append(customer_call)
# 	call_data = dumps(customer_calls, default=str)
# 	print("\n Customer Calls--", call_data)

# 	return render(request, template_name, locals())

@login_required(login_url='/merchant-login/')
@redirectMerchantAsPerProgress("ADD_CUSTOMER")
@permission_required(['customers.add_customer_details','customers.change_customer_details','customers.delete_customer_details'],raise_exception=True)
def customer_settings(request, template_name='merchant_site/customers/customers_settings.html'):
	active_page_name = "customers_settings"
	outletid = request.session.get('outlet_id')

	try:
		outlet_obj = get_object_or_404(outlet_details,id=outletid)
	except:
		outlet_obj = None

	try:
		customer_settings_obj = get_object_or_404(customers_setting,outlet_id = outlet_obj)
	except:
		customer_settings_obj = customers_setting()
		customer_settings_obj.outlet_id = outlet_obj

	if request.method == 'POST':
		postdata = request.POST.copy()
		print(postdata)

		press_btn = postdata.get('press_btn',None)
		active_month = postdata.get('active_month',None)

		
		customer_settings_obj.active_months = active_month
		customer_settings_obj.save()
	   


		if press_btn == 'SAVE':
			return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
		elif press_btn == 'SAVE & CLOSE':
			url = reverse('customers:get_my_customers')
			return HttpResponseRedirect(url)
			
		messages.add_message(request, messages.SUCCESS, ' Saved successfully .',fail_silently=True)
		
	return render(request,template_name,locals())

@multi_user_permission('view', 'customers')
@login_required(login_url='/merchant-login/')
@redirectMerchantAsPerProgress("MY_CUSTOMERS")
@permission_required(['customers.add_customer_details','customers.change_customer_details','customers.delete_customer_details'],raise_exception=True)
def get_all_customers(request, template_name='merchant_site/customers/all_customers.html'):
	active_page_name = "my_customers_page"
	display_department_date = 'all'
	pagename_string = request.GET.get('pagename')
	page_number = int(request.GET.get('page') if request.GET.get('page') else 1)

	out_id = request.session.get('outlet_id')
	print("--------------------------++++++++++++++++++++++++++++++______________outlet id milali ka?----",out_id)
	groups = ['Gold' ,'Silver', 'Platinum' ]

	Insurance_count = 0
	try:
		jmd_cust_insurance_details_obj = jmd_cust_insurance_details.objects.filter(outlet=out_id)
		Insurance_count = len(jmd_cust_insurance_details_obj)
	except:
		jmd_cust_insurance_details_obj = None

	Servicing_count = 0
	try:
		jmd_customer_servicing_expiry_obj = jmdCustServicingDetails.objects.filter(outlet=out_id)
		Servicing_count = len(jmd_customer_servicing_expiry_obj)
	except:
		jmd_customer_servicing_expiry_obj = None
	
	finance_count = 0
	try:
		jmd_finance_obj = finance_details.objects.filter(outlet=out_id)
		finance_count = len(jmd_finance_obj)
	except:
		jmd_finance_obj = None
	
	invoice_count = 0
	try:
		invoice_ob =inovice_details.objects.filter(outlet_id=out_id)
		invoice_count=len(invoice_ob)
	except:
		invoice_ob= None
		
	# selected_cust = 100
	if request.session.get('is_logged_in_superuser') == False:
		outlet_list = outlet_details.objects.filter(id__in=request.session.get('allowed_outlets_list'),company_id = request.session.get('company_id'),is_active=1,is_verified = 1)
	elif request.session.get('is_logged_in_superuser') == True:
		outlet_list = outlet_details.objects.filter(company_id = request.session.get('company_id'),is_active=1,is_verified = 1)
	
	cursor = connection.cursor()

	offersObj = getOutletOffers(request)

	outletid = None
	if request.session.get('outlet_id') and outletid == None:
		outletid = int(request.session.get('outlet_id'))    
 
	if outletid:
		try:
			outletObj = get_object_or_404(outlet_details, id = outletid)
		except:
			outletObj = None
		areas = []
		cust_grps = []
		customers_list = customer_details.objects.filter(outlet_id=outletid).order_by('-created_at')
		customer_count = len(customers_list)
		customerObj = CustomerClass()
		for cust_areas in customers_list:
			if cust_areas.area_building != None or cust_areas.area_building != None:
				areas.append(cust_areas.area_building)
			try:
				privileged_customers_subgroup_obj = get_object_or_404(privileged_customers_subgroup, customer_id =cust_areas.id,outlet_id_id = outletObj.id)
			except:
				privileged_customers_subgroup_obj = None    
			if privileged_customers_subgroup_obj:
				print("#######")
				cust_grps.append(privileged_customers_subgroup_obj)
		
		print(cust_grps)        
			
		
		areas = set(areas)
			



		if outletObj.is_jmd == True:
			template_name = 'merchant_site/customers/jmd_my_customers.html'
			for_user_id = request.session.get('user_obj')
			print(for_user_id)
			print("@2222222222222222222222")
			print(outletid)
			if outletid == 423 and for_user_id == None:
				print("CCCCCCCCCCCCCC")
				for_user_id = None
				customers_obj = customerObj.getJMDAllCustomers(outletObj.id,for_user_id)
			else:
				print("CCCCCCCCCCCCCC111111111")
				customers_obj = customerObj.getJMDAllCustomers(outletObj.id,for_user_id)

			
			#print(for_user_id)
			if customers_obj!=None:
				l= []
				for i in customers_obj:
					l.append(i)

				# print(l)
			print('sjdksjakjdkljsdlkjasl')


			# if request.method == 'POST':
			#     postdata = request.POST.copy()
			#     customerdelete = postdata.get("customerdelete",None)
			#     print(customerdelete) 
			#     print(postdata)
			#     print('dsdjsaghjdhsajkhdskj')

			# if customerdelete:
			
			if customers_obj:
				number_of_cust=len(customers_obj)

				todays_date = datetime.today()
				last_one_year = todays_date + timedelta(days=-365)           
				
				cursor.execute( '''SELECT COUNT(DISTINCT(cd.id)) as active_customers  FROM xl925_customer_details as cd
						INNER JOIN xl925_jmd_cust_servicing_details as csd on cd.id = csd.customer_id
						WHERE cd.outlet_id ={0} and csd.service_invoice_date <= '{1}' and  csd.service_invoice_date >= '{2}' '''.format(outletid,todays_date,last_one_year))
				active_customers = dictfetchall(cursor)[0]

				inactive_customers = number_of_cust - active_customers['active_customers']
				
				cursor.execute('''SELECT * FROM xl925_customer_details as cd INNER JOIN xl925_jmd_cust_servicing_details as csd on cd.id = csd.customer_id WHERE cd.outlet_id ={0} and 
					csd.service_invoice_date <= '{1}' '''.format(outletid,last_one_year))
				inact_cust = dictfetchall(cursor)
				

				
				temp = []
				for i in customers_obj:
					temp.append(i)
				
				reportObj = None
				if len(temp) > 0:
					paginator = Paginator(temp, 25)  # Show 25 contacts per page
					page = request.GET.get('page')
					try:
						reportObj = paginator.page(page)
					except PageNotAnInteger:
						# If page is not an integer, deliver first page.
						reportObj = paginator.page(1)
					except EmptyPage:
						# If page is out of range (e.g. 9999), deliver last page of results.
						reportObj = paginator.page(paginator.num_pages)


				# with open('dormant_customers.csv', 'w') as csvfile:
				#     writer = csv.writer(csvfile)
				#     for key, value in inact_cust.items():
				#         writer.writerow([key, value])
				# csvfile.close()

	#     if outletObj.is_jmd == True:
	#         paginator = Paginator(customers_obj, 100) # Show 25 contacts per page
	#     else:    
	#         paginator = Paginator(customers_list, 100) # Show 25 contacts per page
	#     page = request.GET.get('page')
	#     try:
	#         customers_obj = paginator.page(page)
	#     except PageNotAnInteger:
	#         # If page is not an integer, deliver first page.
	#         customers_obj = paginator.page(1)
	#     except EmptyPage:
	#         # If page is out of range (e.g. 9999), deliver last page of results.
	#         customers_obj = paginator.page(paginator.num_pages)   
	# else:
	#     customers_obj = None       

	if request.GET.get('number'):
		selected_cust = int(request.GET.get('number'))
	else:
		selected_cust = 100   


	 
	if request.method == 'POST':
		postdata = request.POST.copy()
		press_btn = postdata.get("press_btn", None)
		customerid = postdata.get("customer_id", None)
		offerid = postdata.get("offer_id", None)
		display_department_date = postdata.get("filter_by_department", None) 
		customerdelete = postdata.get("customerdelete",None)
		custid = postdata.get("custid",None)
		print(custid)
		print(customerdelete)
		print('nsdalndskalksakllj')

	   #23-12-2019
		
		search = postdata.get("customer_search", None)
		print(search)
		try:
			outlet_info = get_object_or_404(outlet_details, id = request.session.get('outlet_id'))
		except:
			outlet_info = None

		outlet_info.customer_search_text=search
		outlet_info.save()  
		 

		if press_btn == "filter_by_area":
			
			area_name = postdata.get('filter_type',None)
			area_text = area_name
			if area_name:
				if outletObj.is_jmd != True:
					cursor.execute(''' SELECT cd.id, cd.phone_no, cd.customer_name, cd.entry_point, cd.email, cd.outlet_id
								FROM `xl925_customer_details` as cd
								WHERE cd.outlet_id = {0} AND (cd.area_building LIKE '%{1}%' ) '''.format(
								outletid, area_name))                
					customers_list = dictfetchall(cursor)
					customers_obj = dictfetchall(cursor)

		
		
		if outletObj.is_jmd == True: 
			if postdata.get("display_days"):
				if postdata.get("display_days") == "all":
					selected_days = "all"                                    
				else :    
					selected_days = int(postdata.get("display_days"))                                  
					days = todays_date + timedelta(days=selected_days)           
					cursor = connection.cursor()               
					cursor.execute( '''SELECT cd.id as cust_id, cd.phone_no, cd.customer_name, cd.entry_point, cd.email, cd.outlet_id,jcv.vehicle_number,ci.service_invoice_date
							FROM xl925_jmd_cust_servicing_details as ci
							INNER JOIN xl925_customer_details as cd   ON    cd.id =ci.customer_id
							INNER JOIN xl925_jmd_customers_vehicle as jcv
							on jcv.id = ci.vehicle_id
							WHERE service_expiry_date >= '{0}' AND  service_expiry_date <= '{1}' And cd.outlet_id={2}
							GROUP BY ci.customer_id '''.format(todays_date,days,outletid))
					customers_obj = dictfetchall(cursor)            
		if press_btn == "SUBMIT"  : 
			from_date = postdata.get('from_date',None)
			
			if from_date and from_date != "" :
				from_date = datetime.strptime(from_date, '%d-%m-%Y')
				display_from_date = from_date
				from_date = from_date.strftime('%Y-%m-%d %H:%M:%S') 
			to_date = postdata.get('to_date',None)
			if to_date and to_date != "" :
				to_date = datetime.strptime(to_date, '%d-%m-%Y')
				display_to_date = to_date
				to_date = to_date.strftime('%Y-%m-%d %H:%M:%S')
			cursor.execute( '''SELECT cd.id as cust_id, cd.is_trash, cd.phone_no, cd.customer_name, cd.entry_point, cd.email, cd.outlet_id,jcv.vehicle_number,ci.service_invoice_date, ji.policy_purchase_date,
							 (select created_at from xl925_jmd_notification_reminder_details where customer_id = cd.id and is_reminder = True order by created_at DESC limit 1) as reminder_last_sent_date,
							 (select created_at from xl925_jmd_notification_reminder_details where customer_id = cd.id and is_notification = True order by created_at DESC limit 1) as notification_last_sent_date,
							 (select created_at from xl925_jmd_notification_reminder_details where customer_id = cd.id and is_offer = True order by created_at DESC limit 1) as offer_last_sent_date,
							 (select service_invoice_date from xl925_jmd_cust_servicing_details where user_id = cd.user_id  order by service_invoice_date DESC limit 1) as service_invoice_date,
							 (select policy_expiry_date FROM `xl925_jmd_cust_insurance_details` where user_id = cd.user_id order by `policy_expiry_date` DESC limit 1) as policy_expiry_date,
							 (select policy_purchase_date FROM `xl925_jmd_cust_insurance_details` where user_id = cd.user_id order by `policy_purchase_date` DESC limit 1) as policy_purchase_date
							 FROM xl925_customer_details  as cd
							 LEFT  JOIN xl925_jmd_customers_vehicle as jcv on jcv.customer_id =cd.id
							 LEFT JOIN xl925_jmd_cust_servicing_details as ci on ci.customer_id = cd.id LEFT JOIN xl925_jmd_cust_insurance_details as ji on ji.customer_id=cd.id
							 WHERE ci.service_invoice_date >= '{0}' AND  ci.service_invoice_date <= '{1}' AND cd.outlet_id ={2} 
							 GROUP BY ci.customer_id '''.format(from_date,to_date,outletid))
			customers_obj = dictfetchall(cursor) 

		
  
		if press_btn == "SEND_NOTIFICATION":
			broadcastObj = BroadcastClass()
			respObj = broadcastObj.sendNotificationEmail(request, outletid, customerid, offerid)
			if respObj['status'] == "success":
				messages.add_message(request, messages.SUCCESS, respObj['message'], fail_silently=True)
				return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
			else:
				messages.add_message(request, messages.ERROR, respObj['message'],fail_silently=True)
				return HttpResponseRedirect(request.META.get('HTTP_REFERER'))

		if press_btn == "SEND_SMS":
			broadcastObj = BroadcastClass()
			respObj = broadcastObj.sendNotificationSMS(request, outletid, customerid, offerid)
			if respObj['status'] == "success":
				messages.add_message(request, messages.SUCCESS, respObj['message'], fail_silently=True)
				return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
			else:
				messages.add_message(request, messages.ERROR, respObj['message'],fail_silently=True)
				return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
		elif press_btn == 'SEARCH':
			search_txt = postdata.get('customer_search', None)
			if search_txt:
				if outletObj.is_jmd != True:
					cursor.execute(''' SELECT cd.id, cd.phone_no, cd.customer_name, cd.entry_point, cd.email, cd.outlet_id
								FROM `xl925_customer_details` as cd
								WHERE cd.outlet_id = {0} AND (cd.phone_no LIKE '%{1}%' OR cd.customer_name LIKE '%{1}%' OR cd.email LIKE '%{1}%') '''.format(
								outletid, search_txt))                
					customers_list = dictfetchall(cursor)
				elif outletObj.is_jmd == True:  

					#14-10-2019start
					cursor.execute('''SELECT cd.id as cust_id,cd.is_trash, cd.phone_no, cd.customer_name, cd.entry_point, cd.email, cd.outlet_id ,jcv.vehicle_number, ji.policy_purchase_date,  (select created_at from xl925_jmd_notification_reminder_details where customer_id = cd.id and is_reminder = True order by created_at DESC limit 1) as reminder_last_sent_date,
									(select created_at from xl925_jmd_notification_reminder_details where customer_id = cd.id and is_notification = True order by created_at DESC limit 1) as notification_last_sent_date,
									(select created_at from xl925_jmd_notification_reminder_details where customer_id = cd.id and is_offer = True order by created_at DESC limit 1) as offer_last_sent_date,
									(select service_invoice_date from xl925_jmd_cust_servicing_details where user_id = cd.user_id  order by service_invoice_date DESC limit 1) as service_invoice_date,
									(select policy_expiry_date FROM `xl925_jmd_cust_insurance_details` where user_id = cd.user_id order by `policy_expiry_date` DESC limit 1) as policy_expiry_date,
									(select policy_purchase_date FROM `xl925_jmd_cust_insurance_details` where user_id = cd.user_id order by `policy_purchase_date` DESC limit 1) as policy_purchase_date
					from `xl925_customer_details` as cd inner join `xl925_jmd_customers_vehicle` as jcv on jcv.customer_id = cd.id 
					LEFT JOIN xl925_jmd_cust_servicing_details as ci on ci.customer_id = cd.id 
					LEFT JOIN xl925_jmd_cust_insurance_details as ji on ji.customer_id = cd.id
					where cd.outlet_id in (408,423) and (cd.phone_no LIKE '%{0}%' OR cd.customer_name LIKE '%{0}%' OR cd.email LIKE '%{0}%' OR cd.phone_no2 LIKE '%{0}%' OR jcv.vehicle_number LIKE '%{0}%') '''.format(search_txt))
	
					customers_obj = dictfetchall(cursor)
					
		elif press_btn == 'EXPORT':
			# export(request,postdata,outletid)     
			display_department_date = postdata.get("filter_by_department", None)
			search_txt = postdata.get('customer_search', None)
			if search_txt.strip() == "":
				search_txt = None
			selected_days = postdata.get("display_days")
			from_date = postdata.get('from_date',None)      
			if from_date.strip() == "":
				from_date = None
			to_date = postdata.get('to_date',None)  
			if to_date.strip() == "":
				to_date = None
			# url = reverse('customers:export_to_csv',kwargs={'display_department_date': str(display_department_date),"search_txt":str(search_txt),"selected_days":str(selected_days),"from_date":str(from_date),"to_date":str(to_date)})
			url = reverse('customers:export_to_csv',kwargs={'display_department_date': display_department_date,"search_txt":search_txt,"selected_days":selected_days,"from_date":from_date,"to_date":to_date})
			return HttpResponseRedirect(url)               
			

		if postdata.get("display_cust"):    
			selected_cust = int(postdata.get("display_cust"))

	
		if display_department_date and display_department_date != "all":
			customers_obj_temp = customers_obj
			customers_obj = [] 
			for data in customers_obj_temp:
				if display_department_date == "service_invoice_date":
					if data['service_invoice_date'] == None or data['service_invoice_date'] == "" :
						customers_obj.append(data)  
				elif display_department_date == "insurance_policy_date" :
					if data['policy_expiry_date'] == None or data['policy_expiry_date'] == "" :
						customers_obj.append(data)  
				elif display_department_date == "both" :                            
					if data['policy_expiry_date'] != None and data['policy_expiry_date'] != "" and data['service_invoice_date'] != None and data['service_invoice_date'] != "":
						customers_obj.append(data)
				elif display_department_date == "insurance_from_jmd":           #11-10-2019 (only one condition applied ie. insurance policy expiry date)
					if data['policy_expiry_date'] != None or data['policy_expiry_date'] != "" and data['policy_purchase_date'] != None and data['policy_purchase_date'] != "":
						customers_obj.append(data)
				#uncomment it when there is policy purchase date available with policy expiry date and comment the above elif 
				# elif display_department_date == "insurance_from_jmd":
				#     if data['policy_expiry_date'] != None or data['policy_expiry_date'] != "" and data['policy_purchase_date'] != None or data['policy_purchase_date'] != "":
				#         customers_obj.append(data)
				elif display_department_date == "insurance_from_others":        #11-10-2019 done
					if data['vehicle_id'] == None or data['vehicle_id'] == "":
						if data['policy_expiry_date'] != None and data['policy_expiry_date'] != "" and data['service_invoice_date'] != None and data['service_invoice_date'] != "":
							if data['policy_purchase_date'] == None or data['policy_purchase_date'] == "":
								customers_obj.append(data)

				elif display_department_date == "insurance_cust":        #11-10-2019 done
					if data['outlet_id'] == 408:
						customers_obj.append(data)

				elif display_department_date == "service_cust":
					if data['outlet_id'] == 423:
						customers_obj.append(data)


		
		# outletDict = {}
		# query_customers_list = []
		# for outlet_res in customers_obj:                    
		#     for k in outlet_res.keys():                                                             
		#         outletDict[str(k)] = outlet_res[k]
		#     query_customers_list.append(outletDict.copy()) 
		print('oooooooooooooooooooooooooooooooo')
		if custid:
			print('sadjsahjdhsalkoooooooooooooooooooo')
			deletecustobj = get_object_or_404(customer_details, id=custid)
			# sub_xircle_infoobj = finance_details.objects.filter(id=11)
			print(deletecustobj)
			print('fdjsjkdhofiaspsj')
			print(deletecustobj.is_trash)
			deletecustobj.is_trash = 1

			# print(deleteobj.is_trash)
			# sub_xircle_infoobj.is_trash=1
			print('fdjsjkdhofiaspsj')
			deletecustobj.save()
			messages.add_message(request, messages.SUCCESS, 'Your Customer is successfully deleted',fail_silently=True)
			url = reverse('customers:get_my_customers')
			return HttpResponseRedirect(url)
	customers_obj1 = []             
				
	if request.GET.get('page'):
		page = int(request.GET.get('page'))
		display_department_date = request.GET.get('filter')
		print(display_department_date)
		print("YAHOOOOOOOOOO")

		if display_department_date and display_department_date != "all":
			customers_obj_temp = customers_obj
			
			for data in customers_obj_temp:
				if display_department_date == "service_invoice_date":
					print("SERVICE INVOICE DATEEEEEEEEEEEEEEE")
					if data['service_invoice_date'] == None or data['service_invoice_date'] == "" :

						customers_obj1.append(data)  
				elif display_department_date == "insurance_policy_date" :
					print("insurance_policy_date")
					if data['policy_expiry_date'] == None or data['policy_expiry_date'] == "" :
						print("insurance_policy_date")
						customers_obj1.append(data)  
				elif display_department_date == "both" : 
					print("both")                           
					if data['policy_expiry_date'] != None and data['policy_expiry_date'] != "" and data['service_invoice_date'] != None and data['service_invoice_date'] != "":
						customers_obj1.append(data)
				elif display_department_date == "insurance_from_jmd":           #11-10-2019 (only one condition applied ie. insurance policy expiry date)
					print("insurance_from_jmd")
					if data['policy_expiry_date'] != None or data['policy_expiry_date'] != "" and data['policy_purchase_date'] != None and data['policy_purchase_date'] != "":
						customers_obj1.append(data)
				#uncomment it when there is policy purchase date available with policy expiry date and comment the above elif 
				# elif display_department_date == "insurance_from_jmd":
				#     if data['policy_expiry_date'] != None or data['policy_expiry_date'] != "" and data['policy_purchase_date'] != None or data['policy_purchase_date'] != "":
				#         customers_obj.append(data)
				elif display_department_date == "insurance_from_others":        #11-10-2019 done
					if data['vehicle_id'] == None or data['vehicle_id'] == "":
						if data['policy_expiry_date'] != None and data['policy_expiry_date'] != "" and data['service_invoice_date'] != None and data['service_invoice_date'] != "":
							if data['policy_purchase_date'] == None or data['policy_purchase_date'] == "":
								customers_obj1.append(data)


				elif display_department_date == "insurance_cust":        #11-10-2019 done
					print("CCCCCCCCCCCCCCCC")
					if data['outlet_id'] == 408:
						customers_obj1.append(data)

				elif display_department_date == "service_cust":        #11-10-2019 done
					print("CCCCCCCCCCCCCCCC")
					if data['outlet_id'] == 423:
						customers_obj1.append(data)
		print(len(customers_obj1),"XXXXXXXXXXXXXXXXXXXXXXXXXXXXXx")

	else:
		page = 1     
	
	if outletObj.is_jmd == True:
		print("SSSSSSSSSSSSSSSSss")
		#print(customers_obj)
		print(selected_cust)
		if customers_obj1:
			paginator = Paginator(customers_obj1, selected_cust) # Show 25 contacts per page
		else:
			paginator = Paginator(customers_obj, selected_cust)
	else:    
		paginator = Paginator(customers_list, selected_cust) # Show 25 contacts per page

	try:
		customers_obj = paginator.page(page)
	except PageNotAnInteger:
		# If page is not an integer, deliver first page.
		customers_obj = paginator.page(1)
	except EmptyPage:
		# If page is out of range (e.g. 9999), deliver last page of results.
		customers_obj = paginator.page(paginator.num_pages)
	except:
		customers_obj = None    

	if not customers_obj:
		customers_obj = None             

				   
	return render(request,template_name,locals())

########################################################################################################
########################################################################################################
######################################### --CRM  ONLY FOR XIRCLS-- #####################################
########################################################################################################
########################################################################################################

# ########## LEADS ###########
def checkLeads():
	print("--in check leads--")
	leadObj = lead_details.objects.filter(parked_funnel = False)
	print("lead obj",len(leadObj))
	for lead in leadObj:
		try:
			print("[LeadCheck] lead: ", lead.id)
			historyObj = lead_history.objects.filter(lead = lead, parked_funnel = False)
			# print("[LeadCheck] if:", len(historyObj))
			if len(historyObj) > 1:
				historyStat = []
				historyDate = []
				# print("[LeadCheck] in if before for")
				for history in historyObj:
					historyDate.append(history.created_at)
					historyStat.append(history.stage_id)
				diffDays = historyDate[-1] - historyDate[-2]
				# print("[LeadCheck] after for")
				if diffDays.days >= 60 and historyStat[-1] != historyStat[-2]:
					leadChange = lead_details.objects.get(id = lead.id)
					leadChange.parked_funnel = True
					leadChange.assigned_to = None
					leadChange.save()
				
					lead_history.objects.create(lead = leadChange, parked_funnel = True, stage_id = 26)
					# print("[LeadCheck] saved!")
			else:
				# print("[LeadCheck] else")
				try:
					historyObj = lead_history.objects.get(lead = lead, parked_funnel = False)
					# print("[LeadCheck] else:", historyObj)
					
					todayDate = date.today()
					
					thatDate = historyObj.created_at
					year = thatDate.strftime("%Y")
					month = thatDate.strftime("%m")
					day = thatDate.strftime("%d")
					thatDate = date(int(year), int(month), int(day))
					
					diffdate = todayDate - thatDate
					# print("[LeadCheck]", todayDate, thatDate, diffdate)
					
					if diffdate.days >= 60:
						# print("[LeadCheck] 60+ days" )
						leadChange = lead_details.objects.get(id = lead.id)
						leadChange.parked_funnel = True
						leadChange.assigned_to = None
						leadChange.save()
						lead_history.objects.create(lead = leadChange, parked_funnel = True, stage_id = 26)
					else:
						# print("[LeadCheck] days:", diffdate.days)
						pass
					# print("[LeadCheck]", len(leadObj))
				except Exception as e:
					print("[LeadCheck] Exception:", e)
					
		except Exception as e:
			print("[LeadCheck] in except",e)
			
	return True

# @xirclsOnly()
# #@multi_user_permission('Add_Lead')
@multi_user_permission('add', 'Leads')
def add_new_lead(request,template_name='merchant_site/customers/add_new_lead.html'):
	print("--------------------------------------[in add lead]--------------------------------------------------")
	outletid = request.session.get('outlet_id')
	active_page_name = ''
	country_obj = Country.objects.all()
	try:
		outletObj = get_object_or_404(outlet_details, id = outletid)
	except:
		outletObj = None
	clients_account_obj = clients_account.objects.filter(outlet=outletid,is_trash=False).order_by('-id')
	from json import dumps
	clients_account_list = []

	categories_obj  = OutletCategory.objects.filter(is_active=True)
	categories  = categories_obj.filter(parent_id__isnull = True)
	sub_categories  = categories_obj.filter(parent_id__isnull = False)


	for cli in clients_account_obj:
		temp={}
		temp['comapny_id'] = cli.id
		temp['company_name'] = cli.company_name
		temp['company_phone'] = cli.company_phone
		temp['company_email'] = cli.company_email
		temp['company_website'] = cli.company_website
		temp['company_gst'] = cli.company_gst
		temp['company_fb'] = cli.company_fb
		temp['company_insta'] = cli.company_insta
		temp['company_twitter'] = cli.company_twitter
		temp['company_pancard'] = cli.company_pancard
		temp['com_address'] = cli.address_line1
		temp['com_street'] = cli.street
		temp['com_area_building'] = cli.area_building
		temp['com_city'] = cli.city
		temp['com_state'] = cli.state
		temp['com_pincode'] = cli.pincode
		temp['com_country_selection'] = cli.country
		temp['is_parent'] = cli.is_parent
		if cli.is_parent == True:
			temp['parent_id'] = str(cli.parent_id.id) if cli.parent_id else "None"	
			new_Dictionary = temp 
		else:
			try:
				parent_id = cli.parent_id.id
				temp['parent_id'] = str(cli.parent_id.id)
				temp['par_comapny_id'] = cli.parent_id.id
				temp['par_company_name'] = cli.parent_id.company_name
				temp['par_industry'] = cli.parent_id.industry
				temp['par_company_phone'] = cli.parent_id.company_phone
				temp['par_company_email'] = cli.parent_id.company_email
				temp['par_company_website'] = cli.parent_id.company_website
				temp['par_company_gst'] = cli.parent_id.company_gst
				temp['par_company_fb'] = cli.parent_id.company_fb
				temp['par_company_insta'] = cli.parent_id.company_insta
				temp['par_company_twitter'] = cli.parent_id.company_twitter
				temp['par_company_pancard'] = cli.parent_id.company_pancard
				temp['par_com_address'] = cli.parent_id.address_line1
				temp['par_com_street'] = cli.parent_id.street
				temp['par_com_area_building'] = cli.parent_id.area_building
				temp['par_com_landmark'] = cli.parent_id.landmark
				temp['par_com_city'] = cli.parent_id.city
				temp['par_com_state'] = cli.parent_id.state
				temp['par_com_pincode'] = cli.parent_id.pincode
				temp['par_com_country_selection'] = cli.parent_id.country
				new_Dictionary = temp
			except:			
				parent_id = "None"	
				temp['parent_id'] = parent_id	
				new_Dictionary = temp			
		clients_account_list.append(new_Dictionary)
	clients_account_dataJSON = dumps(clients_account_list)
	country_list = []
	for i in country_obj:
		new_Dictionary = { 
			'name':i.name,
			'phone':i.phonecode,	
			}
		country_list.append(new_Dictionary)
	country_dataJSON = dumps(country_list)

	if request.method == 'POST':
		postdata = request.POST.copy();
		# print(postdata)
		
		if postdata.get('cust_type_dropdown') != '':
			cust_type_dropdown = postdata.get('cust_type_dropdown')
		else:
			cust_type_dropdown = 'Contact'

		if postdata.get('cust_status_dropdown') != '':
			cust_status_dropdown = postdata.get('cust_status_dropdown')
		else:
			cust_status_dropdown = 'Cold'

		if postdata.get('cust_source_dropdown') != '':
			cust_source_dropdown = postdata.get('cust_source_dropdown')
		else:
			cust_source_dropdown = 'Walk-In'
		cust_type_dropdown = "Lead"

		press_btn = postdata.get('press_btn', None)
		selected_outletid = outletid
		cust_first_name = postdata.get('cust_first_name',None)
		cust_last_name = postdata.get('cust_last_name',None)
		cust_email = postdata.get('email',None)
		phone_code = postdata.get('phone_code',None)
		mobno = postdata.get('mob_no',None)
		platform = postdata.get('platform',None)
		other_platform = postdata.get('other_platform',None)
		cust_birth_date = postdata.get('birth_date',None)
		cust_status_dropdown = postdata.get('cust_status_dropdown',None)
		cust_source_dropdown = postdata.get('cust_source_dropdown',None)
		cust_other_source = postdata.get('other_source',None)
		cust_rating = postdata.get('cust_rating_dropdown',None)
		cust_lead_stage = postdata.get('cust_leadstage_dropdown',None)
		cust_lead_stage_closed_lost = postdata.get('cust_Closed_Lost_dropdown',None)
		if cust_birth_date and cust_birth_date != "":
			cust_birth_date = datetime.strptime(cust_birth_date, '%d-%m-%Y')
			cust_birth_date = cust_birth_date.strftime('%Y-%m-%d %H:%M:%S')
		else:
			cust_birth_date = None     

		dropdown = postdata.get('dropdown')
		if press_btn == 'SAVE' or press_btn == 'SAVE & CLOSE':
			if cust_type_dropdown == 'Customer':
				cust_avail = check_customer_isAvailabel(request, selected_outletid, cust_email, mobno)
				if cust_avail:
					messages.add_message(request, messages.SUCCESS, 'This customer already exists in your database', fail_silently=True)
					url = reverse('customers:get_my_customers')
					return HttpResponseRedirect(url)
				if cust_avail == False:
					customer_obj = customer_details()
					print('11111')
			else:   
				#check already available or not
				try:
					lead_obj = get_object_or_404(lead_details,email=cust_email,outlet_id=selected_outletid,is_trash=0)
					messages.add_message(request, messages.ERROR, 'This Lead already exists in your database', fail_silently=True)
					url = reverse('customers:leads_dashboard')
					return HttpResponseRedirect(url)
				except:
					customer_obj = lead_details()
			title = postdata.get('title',None)
			occupation = postdata.get('occupation',None)
			if platform == "Other":
				customer_obj.company_platform = other_platform
			else:
				customer_obj.company_platform = platform
			customer_obj.title = title 
			customer_obj.occupation = occupation
			customer_obj.phone_no = mobno
			customer_obj.customer_name = cust_first_name + " " +cust_last_name
			customer_obj.email = cust_email
			customer_obj.phone_code = phone_code
			customer_obj.landline1 = postdata.get('landline1',None)
			customer_obj.entry_point = 'INDV'

			customer_obj.outlet_id = selected_outletid

			customer_obj.cust_dob = cust_birth_date
			customer_obj.address_line1 = postdata.get('address',None)
			customer_obj.address_line2= postdata.get('street',None)
			customer_obj.area_building = postdata.get('area_building',None)
			customer_obj.landmark = postdata.get('landmark',None)
			customer_obj.city = postdata.get('city',None)
			customer_obj.state = postdata.get('state',None)
			customer_obj.pincode = postdata.get('pincode',None)
			customer_obj.country = postdata.get('country_selection',None)
			customer_obj.pancard = postdata.get('pancard_name',None)
			customer_obj.gender = postdata.get('gender',None)
			customer_obj.children = postdata.get('children',None)
			customer_obj.customer_type = postdata.get('customer_type')
			customer_obj.cust_type_dropdown = cust_type_dropdown
			##shipping##
			customer_obj.shipping_address1 = postdata.get('shipping_address',None)
			customer_obj.shipping_address2= postdata.get('shipping_street',None)
			customer_obj.shipping_area_building = postdata.get('shipping_area_building',None)
			customer_obj.shipping_landmark = postdata.get('shipping_landmark',None)
			customer_obj.shipping_city = postdata.get('shipping_city',None)
			customer_obj.shipping_state = postdata.get('shipping_state',None)
			customer_obj.shipping_pincode = postdata.get('shipping_pincode',None)
			customer_obj.shipping_country = postdata.get('shipping_country',None)
			
			## shipping

			clients_account_id = postdata.get('select_comp_id',None)
			customer_obj.clients_account_id_id = clients_account_id
		
			customer_obj.pancard = postdata.get('pancard_name',None)
			customer_obj.gender = postdata.get('gender',None)
			customer_obj.children = postdata.get('children',None)
	  
			customer_obj.cust_status_dropdown = cust_status_dropdown
			customer_obj.cust_source_dropdown = cust_source_dropdown
			customer_obj.cust_rating = cust_rating
			if request.session.get('multi_user_id'):
				customer_obj.assigned_to = get_object_or_404(MultiUserDetails,user_id=request.session.get('multi_user_id'))
			else:
				customer_obj.assigned_to = None
			leadStageObj = lead_stage.objects.get(id = cust_lead_stage)
			customer_obj.cust_lead_stage = leadStageObj
			customer_obj.cust_lead_stage_closed_lost = cust_lead_stage_closed_lost
			customer_obj.cust_other_source = cust_other_source
			
			login_multi_user_id = request.session.get('multi_user_id')
			try:
				MultiUserDetails_obj = get_object_or_404(MultiUserDetails,user_id=login_multi_user_id)
				user_obj = MultiUserDetails_obj
				# print("MULTI_USER_SAVE-->",user_obj)
				customer_obj.created_by_id = MultiUserDetails_obj.id
				customer_obj.assigned_to = MultiUserDetails_obj
			except Exception as e:
				pass
				# print("----errrororo---",e) 
				user_obj = None
			customer_obj.parent_id = request.session.get('root_user_id')
			customer_obj.assign_team_id = postdata.get('assign_to_team')

			customer_obj.cust_type_dropdown = cust_type_dropdown

			if customer_obj.children == 'Yes':
				customer_obj.NO_Of_Children = postdata.get('countchildren',None)
			else:
				customer_obj.NO_Of_Children = None
			customer_obj.Adharcard = postdata.get('Adharcard',None)
			customer_obj.marital_status = postdata.get('marital_status',None)

			marr_anni = postdata.get('marriage_anniversery')       
			if marr_anni and marr_anni != "":
				marr_anni = datetime.strptime(marr_anni, '%d-%m-%Y')
				marr_anni = marr_anni.strftime('%Y-%m-%d %H:%M:%S')
			else:
				marr_anni = None 
			customer_obj.marriage_anniversery = marr_anni                  
			customer_obj.category = postdata.get('employed',None)
			customer_obj.save()
			lead = lead_details.objects.get(email = cust_email)
			lead_history.objects.create(lead = lead, stage = lead_stage.objects.get(id = cust_lead_stage))

			try:
				print('ADDDDDDDDDDDDDDDDDDDDDDINGGGGGGGGGGGG')
				if request.session['multi_user_id']:
					multiUserId = request.session['multi_user_id']
					# print('MULLLLLLTIIII---->',multiUserId)
					multiUserObj = MultiUserDetails.objects.get(user = multiUserId)
					multiUserObj.totalInt = int(multiUserObj.totalInt) + 1
					multiUserObj.save()
					today = datetime.now()
					taskDb = task_details.objects.filter(taskType__name = "Add Lead",start_date__lte=today, due_date__gte = today).exclude(status = "Completed")
					for task in taskDb:
						# print("[TASK]", task.task_name, task.assign_to)
						if task.assign_to == "User":
							print("[TASK] In User")
							# print("[TASK]", multiUserObj)
							if task.assignToUser == multiUserObj:
								print("[TASK] In User if")
								if int(task.remaining) > 0:
									task.remaining = int(task.remaining) - 1
									if int(task.remaining) > 0:
										task.status = "In Process"
									else:
										task.status = "Completed"
								task.save()
						elif task.assign_to == "Dept":
							# print("[TASK] In Dept")
							# print("[TASK]", multiUserObj.first_name)
							deptObj = Multipartment.objects.get(user = multiUserObj)
							if task.assignToDept == deptObj.dept:
								if int(task.remaining) > 0:
									# print("[TASK] In Dept if")
									task.remaining = int(task.remaining) - 1
									if int(task.remaining) > 0:
										task.status = "In Process"
									else:
										task.status = "Completed"
						elif task.assign_to == "subDept":
							# print("[TASK] In subDept")
							# print("[TASK]", multiUserObj.first_name)
							deptObj = Multipartment.objects.get(user = multiUserObj)
							if task.assignToSub == deptObj.subDept:
								if int(task.remaining) > 0:
									# print("[TASK] In subDept if")
									task.remaining = int(task.remaining) - 1
									if int(task.remaining) > 0:
										task.status = "In Process"
									else:
										task.status = "Completed"
						notes = f'{multiUserObj.first_name} Added lead {customer_obj.customer_name}'
						# print('NOTESSSSSSSSSSSSS--->',notes)
						task_history_obj = task_history(task= task, user= multiUserObj, notes=notes, type_id=customer_obj.id)
						task_history_obj.save()
						task.save()
			except Exception as e:
				pass
				# logger.info("[TASK] Exception:"+str(e))	
			if press_btn == 'SAVE':
				url = reverse('customers:edit_lead', kwargs={'slug': customer_obj.id})
				return HttpResponseRedirect(url)  
			elif press_btn == 'SAVE & CLOSE':
				url = reverse('customers:leads_dashboard')
				return HttpResponseRedirect(url)
			url = reverse('customers:leads_dashboard')
			return HttpResponseRedirect(url)
	leadStageObj = lead_stage.objects.all()
	return render(request, template_name, locals())
#@multi_user_permission('Add_Lead')
@multi_user_permission('add', 'Leads')
def add_new_lead_b2b(request,template_name='merchant_site/customers/add_new_lead_b2b.html'):

	checkLeads()
	if request.session.get('multi_user_id'):
		userId = request.session.get('multi_user_id')
	else:
		userId = request.user.id
	outletid = request.session.get('outlet_id')
	active_page_name = ''
	country_obj = Country.objects.all()
	print('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
	try:
		outletObj = get_object_or_404(outlet_details, id = outletid)
	except:
		outletObj = None  
	# team_details_obj = team_details.objects.filter(outlet_id=outletid,is_trash=0)
	clients_account_obj = clients_account.objects.filter(outlet=outletid)
	from json import dumps
	clients_account_list = []
	for cli in clients_account_obj:
		new_Dictionary = { 
			'comapny_id':cli.id,
			'company_name':cli.company_name,
			'industry':cli.industry,
			'company_phone':cli.company_phone,
			'company_email':cli.company_email,
			'company_website':cli.company_website,
			'company_gst':cli.company_gst,
			'company_fb':cli.company_fb,
			'company_insta':cli.company_insta,
			'company_twitter':cli.company_twitter,
			'company_pancard':cli.company_pancard
			}
		clients_account_list.append(new_Dictionary)
	clients_account_dataJSON = dumps(clients_account_list)

	country_list = []
	for i in country_obj:
		new_Dictionary = { 
			'name':i.name,
			'phone':i.phonecode,
			
			}
		country_list.append(new_Dictionary)
	country_dataJSON = dumps(country_list)

	currency_country_info  = All_Countries_Complete_Info.objects.all()
	

	if request.method == 'POST':
		postdata = request.POST.copy();
		print(postdata)
		
		if postdata.get('cust_type_dropdown') != '':
			cust_type_dropdown = postdata.get('cust_type_dropdown')
		else:
			cust_type_dropdown = 'Contact'

		if postdata.get('cust_status_dropdown') != '':
			cust_status_dropdown = postdata.get('cust_status_dropdown')
		else:
			cust_status_dropdown = 'Cold'

		if postdata.get('cust_source_dropdown') != '':
			cust_source_dropdown = postdata.get('cust_source_dropdown')
		else:
			cust_source_dropdown = 'Walk-In'
		cust_type_dropdown = "Lead"

		press_btn = postdata.get('press_btn', None)
		selected_outletid = outletid
		cust_first_name = postdata.get('cust_first_name',None)
		cust_last_name = postdata.get('cust_last_name',None)
		cust_email = postdata.get('email',None)
		phone_code = postdata.get('phone_code',None)
		mobno = postdata.get('mob_no',None)
		landline1 = postdata.get('landline1',None)
		landline2 = postdata.get('landline2',None)
		cust_birth_date = postdata.get('birth_date',None)

		cust_gst_no = postdata.get('cust_gst_no',None)
		ship_address1 = postdata.get('shipping_address',None)
		ship_address2 = postdata.get('shipping_street',None)
		ship_landmark = postdata.get('shipping_landmark',None)
		ship_area_building = postdata.get('shipping_area_building',None)
		ship_cust_city = postdata.get('shipping_city',None)
		ship_state = postdata.get('shipping_state',None)
		ship_cust_pincode = postdata.get('shipping_pincode',None)
		ship_cust_country = postdata.get('shipping_country',None)

		company_name = postdata.get('company_name',None)
		industry = postdata.get('industry',None)
		designation = postdata.get('designation',None)
		company_phone = postdata.get('company_phone',None)
		company_email = postdata.get('company_email',None)
		company_website = postdata.get('company_website',None)
		
		cust_status_dropdown = postdata.get('cust_status_dropdown',None)
		cust_source_dropdown = postdata.get('cust_source_dropdown',None)
		cust_other_source = postdata.get('other_source',None)
		cust_rating = postdata.get('cust_rating_dropdown',None)
		cust_lead_stage = postdata.get('cust_leadstage_dropdown',None)
		cust_lead_stage_closed_lost = postdata.get('cust_Closed_Lost_dropdown',None)


		privileged_opt = postdata.get("privileged") 

		mark_as_parent = postdata.get('mark_parent',None)
		company_name = postdata.get('company_name',None)
		industry = postdata.get('company_industry',None)
		company_gst = postdata.get('company_gst',None)
		company_phone = postdata.get('company_phone',None)
		company_email = postdata.get('company_email',None)
		company_website = postdata.get('company_website',None)

		com_address = postdata.get('address_com',None)
		com_street = postdata.get('street_com',None)
		com_area_building = postdata.get('area_building_com',None)
		com_landmark = postdata.get('landmark_com',None)
		com_city = postdata.get('city_com',None)
		com_state = postdata.get('state_com',None)
		com_pincode = postdata.get('pincode_com',None)
		com_country = postdata.get('country_selection_com',None)
		company_pancard = postdata.get('company_pancard_name',None)
		com_fb=postdata.get('company_facebook_link',None)
		com_insta=postdata.get('company_instagram_link',None)
		com_tw=postdata.get('company_twitter_link',None)
		company_pancard = postdata.get('company_pancard_name',None)

		par_company_name = postdata.get('par_company_name',None)
		par_industry = postdata.get('par_industry',None)
		par_company_gst = postdata.get('par_company_gst',None)
		par_company_phone = postdata.get('par_company_phone',None)
		par_company_email = postdata.get('par_company_email',None)
		par_company_website = postdata.get('par_company_website',None)

		par_com_address = postdata.get('par_address_com',None)
		par_com_street = postdata.get('par_street_com',None)
		par_com_area_building = postdata.get('par_area_building_com',None)
		par_com_landmark = postdata.get('par_landmark_com',None)
		par_com_city = postdata.get('par_city_com',None)
		par_com_state = postdata.get('par_state_com',None)
		par_com_pincode = postdata.get('par_pincode_com',None)
		par_com_country = postdata.get('par_country_selection_com',None)
		par_company_pancard = postdata.get('par_company_pancard_name',None)
		par_com_fb=postdata.get('par_company_facebook_link',None)
		par_com_insta=postdata.get('par_company_instagram_link',None)
		par_com_tw=postdata.get('par_company_twitter_link',None)
		par_company_pancard = postdata.get('par_company_pancard_name',None)

		if cust_birth_date and cust_birth_date != "":
			cust_birth_date = datetime.strptime(cust_birth_date, '%d-%m-%Y')
			cust_birth_date = cust_birth_date.strftime('%Y-%m-%d %H:%M:%S')
		else:
			cust_birth_date = None     

		dropdown = postdata.get('dropdown')
		if press_btn == 'SAVE' or press_btn == 'SAVE & CLOSE':

			try:
				clientObj = clients_account.objects.get(company_email=company_email,company_website=company_website,outlet_id=selected_outletid)
			except:
				clientObj = None

			if clientObj:
				# try:
				#     lead_acc_obj = get_object_or_404(lead_details,outlet_id=selected_outletid,is_trash=0,clients_account=clientObj,leadFor = 'Company')
				# except:
				#     lead_acc_obj = None
				messages.add_message(request, messages.ERROR, 'This lead already exists in your database', fail_silently=True)
				return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
			else:
				clientObj = clients_account()
				lead_acc_obj = None

			clientObj.company_name = company_name
			clientObj.industry = industry
			clientObj.company_gst = company_gst
			clientObj.company_phone = company_phone
			clientObj.company_email = company_email
			clientObj.company_website = company_website
			clientObj.outlet = outletObj

			clientObj.company_twitter = com_tw
			clientObj.company_fb = com_fb
			clientObj.company_insta =com_insta

			clientObj.area_building = com_area_building
			clientObj.address_line1 = com_address
			clientObj.landmark = com_landmark
			clientObj.city = com_city
			clientObj.state = com_state
			clientObj.street = com_street
			clientObj.pincode = com_pincode
			clientObj.country = com_country
			clientObj.company_pancard = company_pancard
			clientObj.created_by_id = userId
			clientObj.type = 'Lead'
			if mark_as_parent == 'yes':
				clientObj.is_parent = True
			clientObj.save()
			

			if mark_as_parent == 'no':
				try:
					par_clients_account_obj = get_object_or_404(clients_account,company_email=par_company_email,company_website=par_company_website,outlet_id=selected_outletid)
				except:
					par_clients_account_obj = clients_account()

				par_clients_account_obj.company_name = par_company_name
				par_clients_account_obj.industry = par_industry
				par_clients_account_obj.company_gst = par_company_gst
				par_clients_account_obj.company_phone = par_company_phone
				par_clients_account_obj.company_email = par_company_email
				par_clients_account_obj.company_website = par_company_website
				par_clients_account_obj.outlet = outletObj

				par_clients_account_obj.company_twitter = par_com_tw
				par_clients_account_obj.company_fb = par_com_fb
				par_clients_account_obj.company_insta =par_com_insta

				par_clients_account_obj.area_building = par_com_area_building
				par_clients_account_obj.address_line1 = par_com_address
				par_clients_account_obj.landmark = par_com_landmark
				par_clients_account_obj.city = par_com_city
				par_clients_account_obj.state = par_com_state
				par_clients_account_obj.street = par_com_street
				par_clients_account_obj.pincode = par_com_pincode
				par_clients_account_obj.country = par_com_country
				par_clients_account_obj.company_pancard = par_company_pancard
				par_clients_account_obj.country = par_com_country
				par_clients_account_obj.is_parent = True
				par_clients_account_obj.created_by_id = userId
				
				par_clients_account_obj.save()
				clientObj.parent_id = par_clients_account_obj
				clientObj.save()

			if lead_acc_obj == None:
				lead_acc_obj = lead_details()
				lead_acc_obj.clients_account_id = clientObj
				leadFor = 'Company'
				lead_acc_obj.entry_point = 'INDV'
				lead_acc_obj.leadFor = leadFor
				# lead_acc_obj.created_by_id = request.user.id
				lead_acc_obj.outlet_id = selected_outletid
				lead_acc_obj.cust_status_dropdown = cust_status_dropdown
				lead_acc_obj.cust_source_dropdown = cust_source_dropdown
				lead_acc_obj.cust_rating = cust_rating
				lead_acc_obj.customer_type = postdata.get('customer_type')
				if request.session.get('multi_user_id'):
					lead_acc_obj.assigned_to = get_object_or_404(MultiUserDetails,user_id=request.session.get('multi_user_id'))
				else:
					lead_acc_obj.assigned_to = None
				leadStageObj = lead_stage.objects.get(id = cust_lead_stage)
				lead_acc_obj.cust_lead_stage = leadStageObj
				lead_acc_obj.cust_lead_stage_closed_lost = cust_lead_stage_closed_lost
				lead_acc_obj.cust_other_source = cust_other_source
				
				login_multi_user_id = request.session.get('multi_user_id')
				try:
					MultiUserDetails_obj = get_object_or_404(MultiUserDetails,user_id=login_multi_user_id)
					user_obj = MultiUserDetails_obj
					print("MULTI_USER_SAVE-->",user_obj)
					lead_acc_obj.created_by_id = MultiUserDetails_obj.id
					lead_acc_obj.assigned_to = MultiUserDetails_obj
				except Exception as e:
					print("----errrororo---",e) 
					user_obj = None
				
				lead_acc_obj.parent_id = request.session.get('root_user_id')
				
				lead_acc_obj.assign_team_id = postdata.get('assign_to_team')
				lead_acc_obj.save()
				lead_history.objects.create(lead = lead_acc_obj, stage = lead_stage.objects.get(id = cust_lead_stage))

		   
			if cust_email == None or cust_email == '':
				pass
			else:
				try:
					lead_obj = get_object_or_404(lead_details,email=cust_email,outlet_id=selected_outletid,is_trash=0)
					messages.add_message(request, messages.ERROR, 'This contact person already exists', fail_silently=True)
					return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
				
				except:
					lead_obj = None
				leadFor = 'CompanyContactPerson'

				if lead_obj == None:
					
					lead_obj = lead_details()
					if postdata.get('mark_primary') == 'yes':
						primarylead_obj = lead_details.objects.filter(outlet_id=selected_outletid,is_trash=0,clients_account=clientObj,is_primary=True)
						for i in primarylead_obj:
							i.is_primary = False
							i.save()
						lead_obj.is_primary = True
					title = postdata.get('title',None)
					lead_obj.clients_account_id = clientObj
					occupation = postdata.get('occupation',None)
					lead_obj.title = title 
					lead_obj.occupation = occupation
					lead_obj.phone_no = mobno
					lead_obj.customer_name = cust_first_name + " " +cust_last_name
					lead_obj.email = cust_email
					lead_obj.phone_code = phone_code
					lead_obj.landline1 = postdata.get('landline1',None)
					lead_obj.entry_point = 'INDV'
					lead_obj.leadFor = leadFor
					
					lead_obj.outlet_id = selected_outletid
					
					lead_obj.cust_dob = cust_birth_date
					lead_obj.address_line1 = postdata.get('address',None)
					lead_obj.address_line2= postdata.get('street',None)
					lead_obj.area_building = postdata.get('area_building',None)
					lead_obj.landmark = postdata.get('landmark',None)
					lead_obj.city = postdata.get('city',None)
					lead_obj.state = postdata.get('state',None)
					lead_obj.pincode = postdata.get('pincode',None)
					lead_obj.country = postdata.get('country_selection',None)
					lead_obj.pancard = postdata.get('pancard_name',None)
					lead_obj.gender = postdata.get('gender',None)
					lead_obj.children = postdata.get('children',None)
					##shipping##
					lead_obj.shipping_address1 = postdata.get('shipping_address',None)
					lead_obj.shipping_address2= postdata.get('shipping_street',None)
					lead_obj.shipping_area_building = postdata.get('shipping_area_building',None)
					lead_obj.shipping_landmark = postdata.get('shipping_landmark',None)
					lead_obj.shipping_city = postdata.get('shipping_city',None)
					lead_obj.shipping_state = postdata.get('shipping_state',None)
					lead_obj.shipping_pincode = postdata.get('shipping_pincode',None)
					lead_obj.shipping_country = postdata.get('shipping_country',None)
					
					## shipping

					lead_obj.cust_type_dropdown = cust_type_dropdown
					
					lead_obj.pancard = postdata.get('pancard_name',None)
					lead_obj.gender = postdata.get('gender',None)
					lead_obj.children = postdata.get('children',None)
			
					lead_obj.cust_status_dropdown = cust_status_dropdown
					lead_obj.cust_source_dropdown = cust_source_dropdown
					lead_obj.cust_rating = cust_rating
					lead_obj.customer_type = postdata.get('customer_type')
					if request.session.get('multi_user_id'):
						lead_obj.assigned_to = get_object_or_404(MultiUserDetails,user_id=request.session.get('multi_user_id'))
					else:
						lead_obj.assigned_to = None
					leadStageObj = lead_stage.objects.get(id = cust_lead_stage)
					lead_obj.cust_lead_stage = leadStageObj
					lead_obj.cust_lead_stage_closed_lost = cust_lead_stage_closed_lost
					lead_obj.cust_other_source = cust_other_source
					
					login_multi_user_id = request.session.get('multi_user_id')
					try:
						MultiUserDetails_obj = get_object_or_404(MultiUserDetails,user_id=login_multi_user_id)
						user_obj = MultiUserDetails_obj
						print("MULTI_USER_SAVE-->",user_obj)
						lead_obj.created_by_id = MultiUserDetails_obj.id
						lead_obj.assigned_to = MultiUserDetails_obj
					except Exception as e:
						print("----errrororo---",e) 
						user_obj = None
					
					lead_obj.parent_id = request.session.get('root_user_id')
					
					lead_obj.assign_team_id = postdata.get('assign_to_team')

					lead_obj.cust_type_dropdown = cust_type_dropdown

					if lead_obj.children == 'Yes':
						lead_obj.NO_Of_Children = postdata.get('countchildren',None)
					else:
						lead_obj.NO_Of_Children = None
					lead_obj.marital_status = postdata.get('marital_status',None)

									
					lead_obj.category = postdata.get('employed',None)
					lead_obj.leadParent = lead_acc_obj
					
					lead_obj.save()
					
					lead_history.objects.create(lead = lead_obj, stage = lead_stage.objects.get(id = cust_lead_stage))

			if press_btn == 'SAVE':
				url = reverse('customers:edit_lead', kwargs={'slug': lead_acc_obj.id})
				return HttpResponseRedirect(url)
			  
			elif press_btn == 'SAVE & CLOSE':
				url = reverse('customers:leads_dashboard')
				return HttpResponseRedirect(url)

		   
			url = reverse('customers:leads_dashboard')
			return HttpResponseRedirect(url)

	leadStageObj = lead_stage.objects.all()
	return render(request, template_name, locals())



# #@multi_user_permission('Edit_Lead')
@multi_user_permission('edit', 'Leads')
def edit_lead(request,slug,template_name='merchant_site/customers/edit_lead.html'):

	outletid = request.session.get('outlet_id')
	try:
		outletObj = get_object_or_404(outlet_details, id = outletid)
	except:
		outletObj = None
	active_page_name = ''
	checkLeads()
	parent_user_id = request.session.get('root_user_id')
	login_multi_user_id = request.session.get('multi_user_id')
	# Get the current logged in user
	if login_multi_user_id:
		current_login_user_id = login_multi_user_id
	else:
		current_login_user_id = parent_user_id
	lead_details_obj = lead_details.objects.get(id = slug)
	try:
		client_obj = clients_account.objects.get(id=lead_details_obj.clients_account_id.id)
	except:
		client_obj = None
	customer_details_obj = get_object_or_404(lead_details, id=slug)
	country_obj = Country.objects.all()
	print('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
	clients_account_obj = clients_account.objects.filter(outlet=outletid)
	
	print(lead_details_obj.cust_lead_stage_id)
	leadStageObj = lead_stage.objects.all()

	from json import dumps
	country_list = []
	for i in country_obj:
		new_Dictionary = { 
			'name':i.name,
			'phone':i.phonecode,
			
			}
		country_list.append(new_Dictionary)
	country_dataJSON = dumps(country_list)

	custfirstname = ""
	custlastname = ""
	if slug != 0 or slug != None:
		try:
			customer_details_obj = get_object_or_404(lead_details, id=slug)
			outletid = int(customer_details_obj.outlet_id)
			if customer_details_obj.clients_account_id:
				selected_client_acc = int(customer_details_obj.clients_account_id.id)
			if customer_details_obj.customer_name:
				custname = str(customer_details_obj.customer_name).split()
				if len(custname) > 1:
					custfirstname = custname[0]
					custlastname = custname[1]
				else:
					custfirstname = custname[0]
		except:
			customer_details_obj = None
	else:
		customer_details_obj = None


	if request.method == 'POST':
		postdata = request.POST.copy()
		company_name = postdata.get('company_name',None)
		industry = postdata.get('industry',None)
		designation = postdata.get('designation',None)
		company_phone = postdata.get('company_phone',None)
		company_email = postdata.get('company_email',None)
		company_website = postdata.get('company_website',None)
		phone_code = postdata.get('phone_code',None)
		
		cust_status_dropdown = postdata.get('cust_status_dropdown',None)
		cust_source_dropdown = postdata.get('cust_source_dropdown',None)
		cust_other_source = postdata.get('other_source',None)
		cust_rating = postdata.get('cust_rating_dropdown',None)
		cust_lead_stage = postdata.get('cust_leadstage_dropdown',None)
		cust_lead_stage_closed_lost = postdata.get('cust_Closed_Lost_dropdown',None)


		privileged_opt = postdata.get("privileged") 

		mark_as_parent = postdata.get('mark_parent',None)
		company_name = postdata.get('company_name',None)
		industry = postdata.get('industry',None)
		company_gst = postdata.get('company_gst',None)
		company_phone = postdata.get('company_phone',None)
		company_email = postdata.get('company_email',None)
		company_website = postdata.get('company_website',None)

		com_address = postdata.get('address_com',None)
		com_street = postdata.get('street_com',None)
		com_area_building = postdata.get('area_building_com',None)
		com_landmark = postdata.get('landmark_com',None)
		com_city = postdata.get('city_com',None)
		com_state = postdata.get('state_com',None)
		com_pincode = postdata.get('pincode_com',None)
		com_country = postdata.get('country_selection_com',None)
		company_pancard = postdata.get('company_pancard_name',None)
		com_fb=postdata.get('company_facebook_link',None)
		com_insta=postdata.get('company_instagram_link',None)
		com_tw=postdata.get('company_twitter_link',None)
		company_pancard = postdata.get('company_pancard_name',None)

		par_company_name = postdata.get('par_company_name',None)
		par_industry = postdata.get('par_industry',None)
		par_company_gst = postdata.get('par_company_gst',None)
		par_company_phone = postdata.get('par_company_phone',None)
		par_company_email = postdata.get('par_company_email',None)
		par_company_website = postdata.get('par_company_website',None)

		par_com_address = postdata.get('par_address_com',None)
		par_com_street = postdata.get('par_street_com',None)
		par_com_area_building = postdata.get('par_area_building_com',None)
		par_com_landmark = postdata.get('par_landmark_com',None)
		par_com_city = postdata.get('par_city_com',None)
		par_com_state = postdata.get('par_state_com',None)
		par_com_pincode = postdata.get('par_pincode_com',None)
		par_com_country = postdata.get('par_country_selection_com',None)
		par_company_pancard = postdata.get('par_company_pancard_name',None)
		par_com_fb=postdata.get('par_company_facebook_link',None)
		par_com_insta=postdata.get('par_company_instagram_link',None)
		par_com_tw=postdata.get('par_company_twitter_link',None)
		par_company_pancard = postdata.get('par_company_pancard_name',None)
		
		# get the logged in MultiUserDetails id
		try:
			current_login_multi_user_id = get_object_or_404(MultiUserDetails,user_id=current_login_user_id)
		except:
			current_login_multi_user_id = None
		
		# checks if loggin user is assigned with this lead or not or is a admin
		# if current_login_multi_user_id and current_login_multi_user_id.is_admin == '0':

		#     # check if current user in present in team with this lead id
		#     try:
		#         team_user_details_obj = get_object_or_404(team_user_details,team_id=customer_details_obj.assign_team_id,multi_user=current_login_multi_user_id.id)
		#     except:
		#         team_user_details_obj = None
			
		#     # if logged in user in not assigned with this lead 
		#     if not team_user_details_obj:
		#         messages.error(request,"Can not edit this lead.") 
		#         return HttpResponseRedirect(request.META.get('HTTP_REFERER'))

		# if postdata.get('cust_type_dropdown') != '':
		#     cust_type_dropdown = postdata.get('cust_type_dropdown')
		# else:
		#     cust_type_dropdown = 'Lead'

		if postdata.get('cust_status_dropdown') != '':
			cust_status_dropdown = postdata.get('cust_status_dropdown')
		else:
			cust_status_dropdown = 'Cold'

		if postdata.get('cust_source_dropdown') != '':
			cust_source_dropdown = postdata.get('cust_source_dropdown')
		else:
			cust_source_dropdown = 'Walk-In'


		cust_type_dropdown = "Lead"


		press_btn = postdata.get('press_btn', None)
		selected_outletid = outletid
		cust_first_name = postdata.get('cust_first_name',None)
		cust_last_name = postdata.get('cust_last_name',None)
		cust_email = postdata.get('email',None)
		mobno = postdata.get('mob_no',None)
		landline1 = postdata.get('landline1',None)
		landline2 = postdata.get('landline2',None)
		cust_birth_date = postdata.get('birth_date',None)
		privileged_opt = postdata.get("privileged") 


		cust_status_dropdown = postdata.get('cust_status_dropdown',None)
		cust_source_dropdown = postdata.get('cust_source_dropdown',None)
		cust_rating = postdata.get('cust_rating_dropdown',None)
		cust_lead_stage = postdata.get('cust_leadstage_dropdown',None)
		cust_lead_stage_closed_lost = postdata.get('cust_Closed_Lost_dropdown',None)
		cust_other_source = postdata.get('cust_other_source',None)

		
		if cust_birth_date and cust_birth_date != "":
			cust_birth_date = datetime.strptime(cust_birth_date, '%d-%m-%Y')
			cust_birth_date = cust_birth_date.strftime('%Y-%m-%d %H:%M:%S')
		else:
			cust_birth_date = None     

		dropdown = postdata.get('dropdown')
		if press_btn == 'SAVE' or press_btn == 'SAVE & CLOSE' or press_btn == 'Save From Acount' or press_btn == "Save Social Info" or press_btn == "Save From Company" :
			# customer_obj = lead_details()

			if cust_type_dropdown == 'Customer':
				cust_avail = check_customer_isAvailabel(request, selected_outletid, cust_email, mobno)
				if cust_avail:                
					messages.add_message(request, messages.SUCCESS, 'This customer already exists in your database', fail_silently=True)
					return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
			
				if cust_avail == False:
					customer_obj = customer_details()
					print('11111')
			
			
			title = postdata.get('title',None)
			occupation = postdata.get('occupation',None)
			customer_details_obj.title = title 
			customer_details_obj.occupation = occupation
			customer_details_obj.phone_no = mobno
			customer_details_obj.phone_code = phone_code
			customer_details_obj.customer_name = cust_first_name + " " +cust_last_name
			customer_details_obj.email = cust_email
			customer_details_obj.landline1 = postdata.get('landline1',None)
			customer_details_obj.entry_point = 'INDV'
			# customer_obj.created_by_id = request.user.id
			customer_details_obj.outlet_id = selected_outletid
			# customer_obj.user_id = userid
			customer_details_obj.cust_dob = cust_birth_date
			customer_details_obj.address_line1 = postdata.get('address',None)
			customer_details_obj.address_line2= postdata.get('street',None)
			customer_details_obj.area_building = postdata.get('area_building',None)
			customer_details_obj.landmark = postdata.get('landmark',None)
			customer_details_obj.city = postdata.get('city',None)
			customer_details_obj.state = postdata.get('state',None)
			customer_details_obj.pincode = postdata.get('pincode',None)
			customer_details_obj.country = postdata.get('country_selection',None)
			customer_details_obj.pancard = postdata.get('pancard_name',None)
			customer_details_obj.gender = postdata.get('gender',None)
			customer_details_obj.children = postdata.get('children',None)

			customer_details_obj.cust_type_dropdown = cust_type_dropdown
			customer_details_obj.cust_status_dropdown = cust_status_dropdown
			customer_details_obj.cust_source_dropdown = cust_source_dropdown
			customer_details_obj.customer_type = postdata.get('customer_type')     
			customer_details_obj.cust_rating = postdata.get('cust_rating_dropdown',None)
			customer_details_obj.cust_lead_stage = lead_stage.objects.get(stage = postdata.get('cust_leadstage_dropdown', None))
			customer_details_obj.cust_lead_stage_closed_lost = postdata.get('cust_Closed_Lost_dropdown',None)
			customer_details_obj.cust_other_source = postdata.get('cust_other_source',None)       

			if customer_details_obj.children == 'Yes':
				customer_details_obj.NO_Of_Children = postdata.get('countchildren',None)
			else:
				customer_details_obj.NO_Of_Children = None

			customer_details_obj.Adharcard = postdata.get('Adharcard',None)
			customer_details_obj.marital_status = postdata.get('marital_status',None)

			marr_anni = postdata.get('marriage_anniversery')       
			if marr_anni and marr_anni != "":
				marr_anni = datetime.strptime(marr_anni, '%d-%m-%Y')
				marr_anni = marr_anni.strftime('%Y-%m-%d %H:%M:%S')
			else:
				marr_anni = None 
			customer_details_obj.marriage_anniversery = marr_anni   
			customer_details_obj.last_modified_by_id = current_login_user_id               
			customer_details_obj.category = postdata.get('employed',None)

			if company_name == '' or company_name == None:
				print("inside if aree re")
				
			else:

				print("inside else aree re")
				try:
					clients_account_obj = get_object_or_404(clients_account,Q(company_name=company_name) | Q(company_email=company_email))
				except:
					clients_account_obj = clients_account()
				clients_account_obj.company_name = company_name
				clients_account_obj.industry = industry
				clients_account_obj.company_gst = company_gst
				clients_account_obj.company_phone = company_phone
				clients_account_obj.company_email = company_email
				clients_account_obj.company_website = company_website
				clients_account_obj.outlet = outletObj


				clients_account_obj.company_twitter = com_tw
				clients_account_obj.company_fb = com_fb
				clients_account_obj.company_insta =com_insta

				clients_account_obj.area_building = com_area_building
				clients_account_obj.address_line1 = com_address
				clients_account_obj.landmark = com_landmark
				clients_account_obj.city = com_city
				clients_account_obj.state = com_state
				clients_account_obj.street = com_street
				clients_account_obj.pincode = com_pincode
				clients_account_obj.country = com_country
				clients_account_obj.company_pancard = company_pancard
				clients_account_obj.save()
				customer_details_obj.clients_account_id = clients_account_obj

				if mark_as_parent == 'no':
					try:
						par_clients_account_obj = get_object_or_404(clients_account,Q(company_name=par_company_name) | Q(company_email=par_company_email))
					except:
						par_clients_account_obj = clients_account()
					par_clients_account_obj.company_name = par_company_name
					par_clients_account_obj.industry = par_industry
					par_clients_account_obj.company_gst = par_company_gst
					par_clients_account_obj.company_phone = par_company_phone
					par_clients_account_obj.company_email = par_company_email
					par_clients_account_obj.company_website = par_company_website
					par_clients_account_obj.outlet = outletObj


					par_clients_account_obj.company_twitter = par_com_tw
					par_clients_account_obj.company_fb = par_com_fb
					par_clients_account_obj.company_insta =par_com_insta

					par_clients_account_obj.area_building = par_com_area_building
					par_clients_account_obj.address_line1 = par_com_address
					par_clients_account_obj.landmark = par_com_landmark
					par_clients_account_obj.city = par_com_city
					par_clients_account_obj.state = par_com_state
					par_clients_account_obj.street = par_com_street
					par_clients_account_obj.pincode = par_com_pincode
					par_clients_account_obj.country = par_com_country
					par_clients_account_obj.company_pancard = par_company_pancard
					par_clients_account_obj.country = par_com_country
					par_clients_account_obj.save()
					clients_account_obj.parent_id = par_clients_account_obj
					clients_account_obj.save()
				

			# if press_btn == "Save From Company":
			#     try:
			#         cli_act_obj =get_object_or_404(clients_account,id=postdata.get("select_comp_id"))
			#         customer_details_obj.clients_account_id = cli_act_obj
			#     except:
			#         pass
			

			customer_details_obj.social_fb = postdata.get("twitter_link")
			customer_details_obj.social_insta = postdata.get("facebook_link")
			customer_details_obj.social_twitter = postdata.get("instagram_link")
			
			lead_id = customer_details_obj.id
			customer_details_obj.save()

			leadObj = lead_details.objects.get(id = lead_id)
			historyObj = lead_history.objects.filter(lead = leadObj)
			if len(historyObj) > 0:
				ind = len(historyObj) - 1
				print("[LEAD EDIT]", ind, len(historyObj))
				historyObj = historyObj[ind]
				if leadObj.cust_lead_stage_id != historyObj.stage_id:
					stageObj = lead_stage.objects.get(id = leadObj.cust_lead_stage_id)
					lead_history.objects.create(lead = leadObj, stage = stageObj)
			else:
				stageObj = lead_stage.objects.get(id = leadObj.cust_lead_stage_id)
				lead_history.objects.create(lead = leadObj, stage = stageObj)

			messages.add_message(request, messages.SUCCESS, 'Lead Edited successfully', fail_silently=True)
			if press_btn == "SAVE":
				return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
			elif press_btn == 'SAVE & CLOSE':
				url = reverse('customers:leads_dashboard')
				return HttpResponseRedirect(url)
			return HttpResponseRedirect(request.META.get('HTTP_REFERER'))

	return render(request,template_name,locals())



# #@multi_user_permission('Edit_Lead')
@multi_user_permission('edit', 'Leads')
def edit_lead_b2b(request,slug,template_name='merchant_site/customers/edit_lead_b2b.html'):

	outletid = request.session.get('outlet_id')
	try:
		outletObj = get_object_or_404(outlet_details, id = outletid)
	except:
		outletObj = None
	active_page_name = ''
	checkLeads()
	parent_user_id = request.session.get('root_user_id')
	login_multi_user_id = request.session.get('multi_user_id')
	# Get the current logged in user
	if login_multi_user_id:
		current_login_user_id = login_multi_user_id
	else:
		current_login_user_id = parent_user_id
	lead_details_obj = lead_details.objects.get(id = slug)
	try:
		client_obj = clients_account.objects.get(id=lead_details_obj.clients_account_id.id)
	except:
		client_obj = None
	customer_details_obj = get_object_or_404(lead_details, id=slug)
	country_obj = Country.objects.all()
	print('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
	clients_account_obj = clients_account.objects.filter(outlet=outletid)
	
	print(lead_details_obj.cust_lead_stage_id)
	leadStageObj = lead_stage.objects.all()

	from json import dumps
	country_list = []
	for i in country_obj:
		new_Dictionary = { 
			'name':i.name,
			'phone':i.phonecode,
			
			}
		country_list.append(new_Dictionary)
	country_dataJSON = dumps(country_list)

	custfirstname = ""
	custlastname = ""
	if slug != 0 or slug != None:
		try:
			customer_details_obj = get_object_or_404(lead_details, id=slug)
			outletid = int(customer_details_obj.outlet_id)
			if customer_details_obj.clients_account_id:
				selected_client_acc = int(customer_details_obj.clients_account_id.id)
			if customer_details_obj.customer_name:
				custname = str(customer_details_obj.customer_name).split()
				if len(custname) > 1:
					custfirstname = custname[0]
					custlastname = custname[1]
				else:
					custfirstname = custname[0]
		except:
			customer_details_obj = None
	else:
		customer_details_obj = None


	if request.method == 'POST':
		postdata = request.POST.copy()
		
		phone_code = postdata.get('phone_code',None)
		
		cust_status_dropdown = postdata.get('cust_status_dropdown',None)
		cust_source_dropdown = postdata.get('cust_source_dropdown',None)
		cust_other_source = postdata.get('other_source',None)
		cust_rating = postdata.get('cust_rating_dropdown',None)
		cust_lead_stage = postdata.get('cust_leadstage_dropdown',None)
		cust_lead_stage_closed_lost = postdata.get('cust_Closed_Lost_dropdown',None)


		mark_as_parent = postdata.get('mark_parent',None)
		company_name = postdata.get('company_name',None)
		industry = postdata.get('Company_industry',None)
		company_gst = postdata.get('company_gst',None)
		company_phone = postdata.get('company_phone',None)
		company_email = postdata.get('company_email',None)
		company_website = postdata.get('company_website',None)

		com_address = postdata.get('address_com',None)
		com_street = postdata.get('street_com',None)
		com_area_building = postdata.get('area_building_com',None)
		com_landmark = postdata.get('landmark_com',None)
		com_city = postdata.get('city_com',None)
		com_state = postdata.get('state_com',None)
		com_pincode = postdata.get('pincode_com',None)
		com_country = postdata.get('country_selection_com',None)
		company_pancard = postdata.get('company_pancard_name',None)
		com_fb=postdata.get('company_facebook_link',None)
		com_insta=postdata.get('company_instagram_link',None)
		com_tw=postdata.get('company_twitter_link',None)
		company_pancard = postdata.get('company_pancard_name',None)

		par_company_name = postdata.get('par_company_name',None)
		par_industry = postdata.get('par_industry',None)
		par_company_gst = postdata.get('par_company_gst',None)
		par_company_phone = postdata.get('par_company_phone',None)
		par_company_email = postdata.get('par_company_email',None)
		par_company_website = postdata.get('par_company_website',None)

		par_com_address = postdata.get('par_address_com',None)
		par_com_street = postdata.get('par_street_com',None)
		par_com_area_building = postdata.get('par_area_building_com',None)
		par_com_landmark = postdata.get('par_landmark_com',None)
		par_com_city = postdata.get('par_city_com',None)
		par_com_state = postdata.get('par_state_com',None)
		par_com_pincode = postdata.get('par_pincode_com',None)
		par_com_country = postdata.get('par_country_selection_com',None)
		par_company_pancard = postdata.get('par_company_pancard_name',None)
		par_com_fb=postdata.get('par_company_facebook_link',None)
		par_com_insta=postdata.get('par_company_instagram_link',None)
		par_com_tw=postdata.get('par_company_twitter_link',None)
		par_company_pancard = postdata.get('par_company_pancard_name',None)
		
		# get the logged in MultiUserDetails id
		try:
			current_login_multi_user_id = get_object_or_404(MultiUserDetails,user_id=current_login_user_id)
		except:
			current_login_multi_user_id = None
		
		# checks if loggin user is assigned with this lead or not or is a admin
		# if current_login_multi_user_id and current_login_multi_user_id.is_admin == '0':

		#     # check if current user in present in team with this lead id
		#     try:
		#         team_user_details_obj = get_object_or_404(team_user_details,team_id=customer_details_obj.assign_team_id,multi_user=current_login_multi_user_id.id)
		#     except:
		#         team_user_details_obj = None
			
		#     # if logged in user in not assigned with this lead 
		#     if not team_user_details_obj:
		#         messages.error(request,"Can not edit this lead.") 
		#         return HttpResponseRedirect(request.META.get('HTTP_REFERER'))

		# if postdata.get('cust_type_dropdown') != '':
		#     cust_type_dropdown = postdata.get('cust_type_dropdown')
		# else:
		#     cust_type_dropdown = 'Lead'

		if postdata.get('cust_status_dropdown') != '':
			cust_status_dropdown = postdata.get('cust_status_dropdown')
		else:
			cust_status_dropdown = 'Cold'

		if postdata.get('cust_source_dropdown') != '':
			cust_source_dropdown = postdata.get('cust_source_dropdown')
		else:
			cust_source_dropdown = 'Walk-In'


		


		press_btn = postdata.get('press_btn', None)
		selected_outletid = outletid
		

		cust_status_dropdown = postdata.get('cust_status_dropdown',None)
		cust_source_dropdown = postdata.get('cust_source_dropdown',None)
		cust_rating = postdata.get('cust_rating_dropdown',None)
		cust_lead_stage = postdata.get('cust_leadstage_dropdown',None)
		cust_lead_stage_closed_lost = postdata.get('cust_Closed_Lost_dropdown',None)
		cust_other_source = postdata.get('cust_other_source',None)

		
		
		dropdown = postdata.get('dropdown')
		if press_btn == 'SAVE' or press_btn == 'SAVE & CLOSE' or press_btn == 'Save From Acount' or press_btn == "Save Social Info" or press_btn == "Save From Company" :
			# customer_obj = lead_details()

			
			
			
			customer_details_obj.cust_status_dropdown = cust_status_dropdown
			customer_details_obj.cust_source_dropdown = cust_source_dropdown
			customer_details_obj.customer_type = postdata.get('customer_type')     
			customer_details_obj.cust_rating = postdata.get('cust_rating_dropdown',None)
			customer_details_obj.cust_lead_stage = lead_stage.objects.get(id = postdata.get('cust_leadstage_dropdown', None))
			customer_details_obj.cust_lead_stage_closed_lost = postdata.get('cust_Closed_Lost_dropdown',None)
			customer_details_obj.cust_other_source = postdata.get('cust_other_source',None)       

			
			try:
				clients_account_obj = get_object_or_404(clients_account,id=customer_details_obj.clients_account_id_id)
			except:
				clients_account_obj = None

			if clients_account_obj:
				clients_account_obj.company_name = company_name
				clients_account_obj.industry = industry
				clients_account_obj.company_gst = company_gst
				clients_account_obj.company_phone = company_phone
				clients_account_obj.company_email = company_email
				clients_account_obj.company_website = company_website
				clients_account_obj.outlet = outletObj


				clients_account_obj.company_twitter = com_tw
				clients_account_obj.company_fb = com_fb
				clients_account_obj.company_insta =com_insta

				clients_account_obj.area_building = com_area_building
				clients_account_obj.address_line1 = com_address
				clients_account_obj.landmark = com_landmark
				clients_account_obj.city = com_city
				clients_account_obj.state = com_state
				clients_account_obj.street = com_street
				clients_account_obj.pincode = com_pincode
				clients_account_obj.country = com_country
				clients_account_obj.company_pancard = company_pancard
				clients_account_obj.save()
				

		
				try:
					par_clients_account_obj = get_object_or_404(clients_account,id=clients_account_obj.parent_id_id)
				except:
					par_clients_account_obj = None
				if par_clients_account_obj:
					par_clients_account_obj.company_name = par_company_name
					par_clients_account_obj.industry = par_industry
					par_clients_account_obj.company_gst = par_company_gst
					par_clients_account_obj.company_phone = par_company_phone
					par_clients_account_obj.company_email = par_company_email
					par_clients_account_obj.company_website = par_company_website
					par_clients_account_obj.outlet = outletObj


					par_clients_account_obj.company_twitter = par_com_tw
					par_clients_account_obj.company_fb = par_com_fb
					par_clients_account_obj.company_insta =par_com_insta

					par_clients_account_obj.area_building = par_com_area_building
					par_clients_account_obj.address_line1 = par_com_address
					par_clients_account_obj.landmark = par_com_landmark
					par_clients_account_obj.city = par_com_city
					par_clients_account_obj.state = par_com_state
					par_clients_account_obj.street = par_com_street
					par_clients_account_obj.pincode = par_com_pincode
					par_clients_account_obj.country = par_com_country
					par_clients_account_obj.company_pancard = par_company_pancard
					par_clients_account_obj.country = par_com_country
					par_clients_account_obj.save()
					

			customer_details_obj.save()

			
			messages.add_message(request, messages.SUCCESS, 'Lead Edited successfully', fail_silently=True)
			if press_btn == "SAVE":
				return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
			elif press_btn == 'SAVE & CLOSE':
				url = reverse('customers:leads_dashboard')
				return HttpResponseRedirect(url)
			return HttpResponseRedirect(request.META.get('HTTP_REFERER'))

	return render(request,template_name,locals())




# #@multi_user_permission('View_Lead')
@multi_user_permission('view', 'Leads')
def all_lead(request,slug='',roleSlug='',template_name='merchant_site/customers/all_lead.html'):

	outletid = request.session.get('outlet_id')
	active_page_name = ''
	report_type = 'All'


	if slug == 'Contact':
		leads_obj = lead_details.objects.filter(outlet_id=outletid,cust_type_dropdown='Contact',is_trash=0)
	elif slug == 'Lead':
		leads_obj = lead_details.objects.filter(outlet_id=outletid,cust_type_dropdown='Lead',is_trash=0)
		leads_obj_list = []

		total_hot_lead = 0
		total_cold_lead = 0
		total_warm_lead = 0

		for i in leads_obj:
			if i.cust_status_dropdown == "Cold":
				total_cold_lead += 1
			if i.cust_status_dropdown == "Warm":
				total_warm_lead += 1
			if i.cust_status_dropdown == "Hot":
				total_hot_lead += 1
			temp = {}
			temp['id'] = i.id
			temp['customer_name'] = i.customer_name

			try:
				call_obj = new_Addcall_details.objects.filter(lead_id=i.id).order_by('id').last()
			except:
				call_obj = None
			if call_obj:
				temp['last_call'] = call_obj.last_call
				temp['schedule_Next_Call'] = call_obj.schedule_Next_Call
				temp['follow_up'] = call_obj.schedule_Next_Call_date
				try:
					datetime_str = datetime.strptime(call_obj.schedule_Next_Call_time, '%H:%M').time()
					temp['follow_up_time'] = (datetime_str).strftime("%I:%M %p")
				except:
					pass
				
			temp['phone_no'] = i.phone_no
			temp['email'] = i.email
			temp['cust_type_dropdown'] = i.cust_type_dropdown
			temp['cust_status_dropdown'] = i.cust_status_dropdown
			temp['cust_source_dropdown'] = i.cust_source_dropdown
			temp['slug'] = 'lead_'+ str(i.id)

			leads_obj_list.append(temp)
	elif slug == 'Prospect':    
		leads_obj = lead_details.objects.filter(outlet_id=outletid,cust_type_dropdown='Prospect',is_trash=0)
	elif slug == 'Customer':
		leads_obj = lead_details.objects.filter(outlet_id=outletid,cust_type_dropdown='Customer',is_trash=0)
	else:
		leads_obj = None




	if request.method == 'POST':
		postdata = request.POST.copy()
		print(postdata)

		lead_type = postdata.get('lead_type')
		lead_status = postdata.get('report_type')

		if lead_status == 'All':
			leads_obj = lead_details.objects.filter(outlet_id=outletid,cust_type_dropdown=lead_type,is_trash=0)
		else:
			leads_obj = lead_details.objects.filter(outlet_id=outletid,cust_type_dropdown=lead_type,cust_status_dropdown=lead_status,is_trash=0)
		report_type =  lead_status   

		has_permission = user_has_permissions(request,"Delete_Lead")
		if postdata.get('delete_xircl') == 'Yes':
			if has_permission:
				del_leads_obj = get_object_or_404(lead_details,id=postdata.get('slug_to_delete'))
				del_leads_obj.is_trash = True
				del_leads_obj.save()

				messages.add_message(request, messages.SUCCESS, 'Lead Deleted successfully', fail_silently=True)
				url = reverse('customers:all_lead' ,kwargs={'slug': slug})
				return HttpResponseRedirect(url)


	reportObj = None
	if len(leads_obj) > 0:
		paginator = Paginator(leads_obj, 25)  # Show 25 contacts per page
		page = request.GET.get('page')
		try:
			reportObj = paginator.page(page)
		except PageNotAnInteger:
			# If page is not an integer, deliver first page.
			reportObj = paginator.page(1)
		except EmptyPage:
			# If page is out of range (e.g. 9999), deliver last page of results.
			reportObj = paginator.page(paginator.num_pages)
	return render(request, template_name, locals())

# #@multi_user_permission('View_Lead')
@multi_user_permission('view', 'Leads')
def leads_dashboard(request, slug='', template_name='merchant_site/customers/leads_dashboard.html'):

	outletid = request.session.get('outlet_id')
	active_page_name = ''
	
	user_id = request.session.get("multi_user_id")

	isSAdmin = False
	if user_id is None:
		isSAdmin = True
	try:
		user_obj = User.objects.get(id=request.session.get('root_user_id'))
	except:
		user_obj = None
	checkLeads()

	print(user_id,isSAdmin)

	"""query optmz"""
	all_leads=lead_details.objects.all().order_by("-created_at")
	try:
		website_enteries_obj = website_enteries.objects.all()
	except:
		website_enteries_obj = None

		
	all_lead_obj = all_leads.filter(outlet_id=outletid,is_trash=0)
	
	if user_id is None:
		leads_obj = all_lead_obj
	else:
		MultiUserObj = MultiUserDetails.objects.get(user = user_id)
		leads_obj = all_leads.filter(outlet_id=outletid, created_by = MultiUserObj, cust_type_dropdown='Lead',is_trash=0, parked_funnel = False)
	
	leads_obj_count=leads_obj.count()
	lead_type= leads_obj.aggregate(
										total_hot_lead=Coalesce(Sum(
											Case(When(cust_rating = "Hot",then=1),default=0, output_field= models.IntegerField())
										),0),
										total_cold_lead=Coalesce(Sum(
											Case(When(cust_rating = "COld",then=1),default=0, output_field= models.IntegerField())
										),0),
										total_warm_lead=Coalesce(Sum(
											Case(When(cust_rating = "Warm",then=1),default=0, output_field= models.IntegerField())
										),0),
									)
	
	""" assigned count in old variable so that the frontend work properly """
	total_hot_lead = lead_type["total_hot_lead"]
	total_cold_lead = lead_type["total_cold_lead"]
	total_warm_lead = lead_type["total_warm_lead"]


	
	if request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest' and request.method =="POST":
		print("sfklsjfsdjflksdfjlsdjfs")
		datatables = request.POST
		table_name=datatables.get("table_name")

		draw = int(datatables.get('draw'))
		start = int(datatables.get('start'))
		length = int(datatables.get('length'))
		over_all_search = datatables.get('search[value]',None)


		customer_name=datatables.get("columns[0][search][value]",None)
		phone_no=datatables.get("columns[1][search][value]", None)
		email=datatables.get("columns[2][search][value]", None)
		source=datatables.get("columns[4][search][value]",None)
		contacted_date=datatables.get("columns[5][search][value]",None)


		if table_name == "allLeadTable":
			"""selecting lead object based on the user or multiuser"""
			leads=leads_obj.select_related(
											"created_by",
											"created_by__user", 
											"clients_account_id", 
											"parent",
											"cust_lead_stage"
									).prefetch_related(
										Prefetch("lead_history_set", queryset=lead_history.objects.select_related("stage").order_by("-created_at"), to_attr="historyObj")
									).prefetch_related(
										Prefetch("new_addcall_details_set", queryset=new_Addcall_details.objects.order_by("-created_at"), to_attr="call_obj")
									)
			leads_obj_data=leads
			leads_obj_data_count=leads.count()

					
		if table_name =="parkedFunnelTable":
			"""filtering parked_funnel lead from all_lead"""
			leads=all_leads.filter(parked_funnel = True).select_related(
													"created_by",
													"created_by__user", 
													"clients_account_id", 
													"parent",
													"cust_lead_stage"
								).prefetch_related(
									Prefetch("lead_history_set", queryset=lead_history.objects.select_related("stage").order_by("-created_at"), to_attr="historyObj")
								).prefetch_related(
									Prefetch("new_addcall_details_set", queryset=new_Addcall_details.objects.order_by("-created_at"), to_attr="call_obj")
								)
			leads_obj_data=leads
			leads_obj_data_count=leads_obj_data.count()

			

		advance_filter=Q()
		if customer_name:
			advance_filter &=Q(customer_name__icontains=customer_name)
		if phone_no:
			advance_filter &=Q(phone_no__icontains=phone_no)
		if email:
			advance_filter &=Q(email__icontains=email)
		if source:
			advance_filter &=Q(cust_source_dropdown__icontains=source)
		if contacted_date:
			advance_filter &=Q(new_addcall_details__last_call__icontains=contacted_date)
		
		
		if over_all_search:
			advance_filter |= Q(customer_name__icontains=over_all_search) | Q(phone_no__icontains=over_all_search) | Q(email__icontains=over_all_search) | Q(lead_history__stage__stage__icontains =over_all_search) | Q(clients_account_id__company_name__icontains=over_all_search) | Q(created_by__user__first_name__icontains =over_all_search)

		if advance_filter:
			leads_obj_data=leads.filter(
										advance_filter
										)
			leads_obj_data_count=leads_obj_data.count()
			

		leads_obj_list=[]
		for i in leads_obj_data:
			temp={}
			temp['id']=i.id
			temp['customer_name'] = i.customer_name
			temp['parked_funnel'] = i.parked_funnel
			temp['phone_no'] = i.phone_no
			temp['email'] = i.email
			temp['cust_type_dropdown'] = i.cust_type_dropdown
			temp['cust_source_dropdown'] = i.cust_source_dropdown
			temp['parent'] = i.parent.first_name if i.parent else ""
			temp['slug'] = 'lead_'+ str(i.id)
			temp['company_name'] = i.clients_account_id.company_name if i.clients_account_id else ""

			if i.call_obj:
				# print(i.call_obj[0].last_call,i.call_obj[0].schedule_Next_Call, i.call_obj[0].schedule_Next_Call_date, i.call_obj[0].schedule_Next_Call_time)
				temp['last_call'] = (i.call_obj[0].last_call).strftime("%d-%m-%Y") if i.call_obj[0].last_call else ""
				temp['schedule_Next_Call'] = i.call_obj[0].schedule_Next_Call
				temp['follow_up'] = (i.call_obj[0].schedule_Next_Call_date).strftime("%d-%m-%Y") if i.call_obj[0].schedule_Next_Call_date else ""
				temp['follow_up_time']=(datetime.strptime(i.call_obj[0].schedule_Next_Call_time, '%H:%M').time()).strftime("%I:%M %p") if i.call_obj[0].schedule_Next_Call_time else ""
				
			else:
				temp['last_call'] = ""
				temp['schedule_Next_Call'] =""
				temp['follow_up'] = ""
				temp['follow_up_time'] = ""

			if i.cust_lead_stage == None:
				temp['cust_stage'] = None
			else:
				if i.historyObj:
					temp['cust_stage'] = i.historyObj[0].stage.stage
				else:
					temp['cust_stage'] = None

			try:
				multi_obj = i.created_by.id
			except:
				multi_obj = None
				if user_obj:
					temp['created_by_name'] = user_obj.first_name +" "+user_obj.last_name
				else:
					temp['created_by_name'] = ''

			if multi_obj:
				temp['created_by_name'] = i.created_by.user.first_name
				if i.created_by.is_manager == "1":
					temp['role'] = "Manager"
				elif i.created_by.is_admin == "1":
					temp['role'] = "Admin"
				elif i.created_by.is_executive == "1":
					temp['role'] = "Executive"
				else:
					temp['role'] = "S.Admin"
			else:
				temp['role'] = "S.Admin"

			leads_obj_list.append(temp)
			# print(temp)
		
		page_number = start / length + 1

		paginator = Paginator(leads_obj_list, length)

		try:
			object_list = paginator.page(page_number).object_list
		except PageNotAnInteger:
			object_list = paginator.page(1).object_list
		except EmptyPage:
			object_list = paginator.page(paginator.num_pages).object_list
		
		data={				
				'draw': draw,
				'recordsTotal': leads_obj_data_count,   # draw, recordssTotal, recordsFilter is use for datatables 
				'recordsFiltered': leads_obj_data_count,

				"leads_obj_data" : list(object_list)
			}

		return JsonResponse(data,safe=False)

	print("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")

	"""optmz end here"""
			
	typeSelected = "my"

	if request.method == 'POST':
		postdata = request.POST.copy()
		print("[LeadDash]",postdata)
		has_permission = user_has_permissions(request,"Delete_Lead")
		
		if postdata.get('delete_xircl') == 'Yes':
			if has_permission:
				del_leads_obj = get_object_or_404(lead_details,id=postdata.get('slug_to_delete'))
				del_leads_obj.is_trash = True
				del_leads_obj.save()
				messages.add_message(request, messages.SUCCESS, 'Lead Deleted successfully', fail_silently=True)
			else:
				messages.add_message(request, messages.ERROR, 'Access Denied by root user', fail_silently=True)
		elif postdata.get('type') == "my":
			
			pass
			print("[LeadDash] After For")
				
			
		
		elif postdata.get('type') == "every":
			leads_obj = lead_details.objects.filter(outlet_id=outletid,cust_type_dropdown='Lead',is_trash=0, parked_funnel = False)
			leads_obj_list = []
			
			total_hot_lead = 0
			total_cold_lead = 0
			total_warm_lead = 0

			typeSelected = postdata.get('type')
			for i in leads_obj:
				if i.cust_rating == "Cold":
					total_cold_lead += 1
				if i.cust_rating == "Warm":
					total_warm_lead += 1
				if i.cust_rating == "Hot":
					total_hot_lead += 1
				temp = {}
				temp['id'] = i.id
				temp['customer_name'] = i.customer_name
				temp['phone_no'] = i.phone_no
				
				try:
					call_obj = new_Addcall_details.objects.filter(lead_id=i.id).order_by('id').last()
					
				except:
					call_obj = None
					
				if call_obj:
					temp['last_call'] = call_obj.last_call
					temp['schedule_Next_Call'] = call_obj.schedule_Next_Call
					temp['follow_up'] = call_obj.schedule_Next_Call_date
					try:
						datetime_str = datetime.strptime(call_obj.schedule_Next_Call_time, '%H:%M').time()
						temp['follow_up_time'] = (datetime_str).strftime("%I:%M %p")
					except:
						pass
				temp['email'] = i.email
				temp['cust_type_dropdown'] = i.cust_type_dropdown
				if i.cust_lead_stage == None:
					temp['cust_stage'] = None
				else:
					temp['cust_stage'] = i.cust_lead_stage.stage
				temp['cust_source_dropdown'] = i.cust_source_dropdown
				temp['parent'] = i.parent
				temp['slug'] = 'lead_'+ str(i.id)

				try:
					multi_obj = get_object_or_404(MultiUserDetails,id=i.created_by_id)
				except:
					multi_obj = None
					if user_obj:
						temp['created_by_name'] = user_obj.first_name +" "+user_obj.last_name
					else:
						temp['created_by_name'] = ''

				if multi_obj:
					print(multi_obj.user.first_name,"----s-s--")
					temp['created_by_name'] = multi_obj.user.first_name
					if multi_obj.is_manager == "1":
						temp['role'] = "Manager"
					elif multi_obj.is_admin == "1":
						temp['role'] = "Admin"
					elif multi_obj.is_executive == "1":
						temp['role'] = "Executive"
					else:
						temp['role'] = "S.Admin"
				else:
					temp['role'] = "S.Admin"

				leads_obj_list.append(temp)
			return render(request,template_name,locals())
		url= reverse('customers:leads_dashboard')
		return redirect(url)

	return render(request,template_name,locals())


#@multi_user_permission('View_Lead')
@multi_user_permission('view', 'Leads')
def leads_dashboard_b2b(request, slug='', template_name='merchant_site/customers/leads_dashboard_b2b.html'):
	
	outletid = request.session.get('outlet_id')
	active_page_name = ''
	user_id = request.session.get("multi_user_id")
	try:
		multiUser = MultiUserDetails.objects.get(user_id=user_id)
		leadAccountObj = lead_details.objects.filter(is_trash=False,leadFor='Company',created_by_id=multiUser.id)
	except:
		multiUser = None
		leadAccountObj = lead_details.objects.filter(is_trash=False,leadFor='Company',outlet_id=outletid)
	isSAdmin = False
	if user_id is None:
		isSAdmin = True

	checkLeads()
	parked_leads = lead_details.objects.filter(parked_funnel = True)
	all_lead_obj = lead_details.objects.filter(outlet_id=outletid,is_trash=0)

	contacts_obj = lead_details.objects.filter(outlet_id=outletid,cust_type_dropdown='Contact',is_trash=0)
	contacts_obj_list = []
	for i in contacts_obj:
		temp = {}
		temp['id'] = i.id
		temp['customer_name'] = i.customer_name
		temp['phone_no'] = i.phone_no
		temp['email'] = i.email
		temp['cust_type_dropdown'] = i.cust_type_dropdown
		temp['cust_status_dropdown'] = i.cust_status_dropdown
		temp['slug'] = 'lead_'+ str(i.id)

		contacts_obj_list.append(temp)

	
		
	leadAccountList = []
	for i in leadAccountObj:
		temp = {}
		temp['id'] = i.id
		temp['company_name'] = i.clients_account_id.company_name
		temp['company_website'] = i.clients_account_id.company_website
		temp['company_email'] = i.clients_account_id.company_email
		temp['cust_type_dropdown'] = i.cust_type_dropdown
		temp['cust_source_dropdown'] = i.cust_source_dropdown
		temp['slug'] = 'lead_'+ str(i.id)
		if i.cust_lead_stage == None:
			temp['cust_stage'] = None
		else:
			temp['cust_stage'] = i.cust_lead_stage.stage
		temp['parent'] = i.parent
		leadAccountList.append(temp)

	if user_id is None:
		total_leads_obj = lead_details.objects.filter(outlet_id=outletid,cust_type_dropdown='Lead',is_trash=0,leadFor__in=("Individual","Company"), parked_funnel = False)
		leads_obj = lead_details.objects.filter(outlet_id=outletid,cust_type_dropdown='Lead',is_trash=0,leadFor="Individual", parked_funnel = False)
	else:
		MultiUserObj = MultiUserDetails.objects.get(user = user_id)
		total_leads_obj = lead_details.objects.filter(outlet_id=outletid, created_by = MultiUserObj, cust_type_dropdown='Lead',leadFor__in=("Individual","Company"),is_trash=0, parked_funnel = False)
		leads_obj = lead_details.objects.filter(outlet_id=outletid, created_by = MultiUserObj, cust_type_dropdown='Lead',leadFor="Individual",is_trash=0, parked_funnel = False)
	

	leads_obj_list = []
	
	total_link = len(lead_details.objects.filter(outlet_id=outletid,cust_type_dropdown='Lead',is_trash=0, parked_funnel = False, entry_point="LINK"))
	total_content = len(lead_details.objects.filter(outlet_id=outletid,cust_type_dropdown='Lead',is_trash=0, parked_funnel = False, entry_point="CONTENT_LINK"))
	total_manual = len(lead_details.objects.filter(outlet_id=outletid,cust_type_dropdown='Lead',is_trash=0, parked_funnel = False, entry_point="INDV"))

	

	for i in leads_obj:
		# if i.cust_status_dropdown == "Cold":
		#     total_cold_lead += 1
		# if i.cust_status_dropdown == "Warm":
		#     total_warm_lead += 1
		# if i.cust_status_dropdown == "Hot":
		#     total_hot_lead += 1
		temp = {}
		temp['id'] = i.id
		temp['customer_name'] = i.customer_name
		temp['phone_no'] = i.phone_no
		
		try:
			call_obj = Addcall_details.objects.filter(lead_id=i.id).order_by('id').last()
			
		except:
			call_obj = None
			
		if call_obj:
			temp['last_call'] = call_obj.last_call
			temp['schedule_Next_Call'] = call_obj.schedule_Next_Call
			temp['follow_up'] = call_obj.schedule_Next_Call_date
			try:
				datetime_str = datetime.strptime(call_obj.schedule_Next_Call_time, '%H:%M').time()
				temp['follow_up_time'] = (datetime_str).strftime("%I:%M %p")
			except:
				pass
		temp['email'] = i.email
		temp['cust_type_dropdown'] = i.cust_type_dropdown
		if i.cust_lead_stage == None:
			temp['cust_stage'] = None
		else:
			temp['cust_stage'] = i.cust_lead_stage.stage
		temp['cust_source_dropdown'] = i.cust_source_dropdown
		temp['parent'] = i.parent
		temp['slug'] = 'lead_'+ str(i.id)

		try:
			multi_obj = get_object_or_404(MultiUserDetails,id=i.created_by_id)
		except:
			multi_obj = None
			temp['created_by_name'] = "Alex M"

		if multi_obj:
			print(multi_obj.user.first_name,"----s-s--")
			temp['created_by_name'] = multi_obj.user.first_name
			if multi_obj.is_manager == "1":
				temp['role'] = "Manager"
			elif multi_obj.is_admin == "1":
				temp['role'] = "Admin"
			elif multi_obj.is_executive == "1":
				temp['role'] = "Executive"
			else:
				temp['role'] = "S.Admin"
		else:
			temp['role'] = "S.Admin"

		leads_obj_list.append(temp)
		
	leads_obj_data = json.dumps(leads_obj_list, indent=4, sort_keys=True, default=str)

	reportObj = None
	# if len(leads_obj) > 0:
	#     paginator = Paginator(leads_obj, 25)  # Show 25 contacts per page
	#     page = request.GET.get('page')
	#     try:
	#         reportObj = paginator.page(page)
	#     except PageNotAnInteger:
	#         # If page is not an integer, deliver first page.
	#         reportObj = paginator.page(1)
	#     except EmptyPage:
	#         # If page is out of range (e.g. 9999), deliver last page of results.
	#         reportObj = paginator.page(paginator.num_pages)   
			
	typeSelected = "every"

	if request.method == 'POST':
		postdata = request.POST.copy();
		print("[LeadDash]",postdata)
		has_permission = user_has_permissions(request,"Delete_Lead")
		
		if postdata.get('delete_xircl') == 'Yes':
			if has_permission:
				del_leads_obj = get_object_or_404(lead_details,id=postdata.get('slug_to_delete'))
				del_leads_obj.is_trash = True
				del_leads_obj.save()
				messages.add_message(request, messages.SUCCESS, 'Lead Deleted successfully', fail_silently=True)
			else:
				messages.add_message(request, messages.ERROR, 'Access Denied by root user', fail_silently=True)
		elif postdata.get('type') == "my":
			
			user_id = request.session.get("multi_user_id")
			print("[LeadDash]", user_id)
			
			typeSelected = postdata.get('type')
			
			MultiUserObj = MultiUserDetails.objects.get(user = user_id)
			leads_obj = lead_details.objects.filter(outlet_id=outletid, created_by = MultiUserObj, cust_type_dropdown='Lead',is_trash=0, parked_funnel = False)|lead_details.objects.filter(outlet_id=outletid, assigned_to = MultiUserObj, cust_type_dropdown='Lead',is_trash=0, parked_funnel = False)
			leads_obj_list = []
			
			total_hot_lead = 0
			total_cold_lead = 0
			total_warm_lead = 0


			print("[LeadDash]", len(leads_obj))
			print("[LeadDash] before for")
			for i in leads_obj:
				print("[LeadDash]", i)
				if i.cust_status_dropdown == "Cold":
					total_cold_lead += 1
				if i.cust_status_dropdown == "Warm":
					total_warm_lead += 1
				if i.cust_status_dropdown == "Hot":
					total_hot_lead += 1
				temp = {}
				temp['id'] = i.id
				temp['customer_name'] = i.customer_name
				temp['phone_no'] = i.phone_no
				
				try:
					call_obj = Addcall_details.objects.filter(lead_id=i.id).order_by('id').last()
					
				except:
					call_obj = None
					
				if call_obj:
					temp['last_call'] = call_obj.last_call
					temp['schedule_Next_Call'] = call_obj.schedule_Next_Call
					temp['follow_up'] = call_obj.schedule_Next_Call_date
					try:
						datetime_str = datetime.strptime(call_obj.schedule_Next_Call_time, '%H:%M').time()
						temp['follow_up_time'] = (datetime_str).strftime("%I:%M %p")
					except:
						pass
				temp['email'] = i.email
				temp['cust_type_dropdown'] = i.cust_type_dropdown
				if i.cust_lead_stage == None:
					temp['cust_stage'] = None
				else:
					temp['cust_stage'] = i.cust_lead_stage.stage
				temp['cust_source_dropdown'] = i.cust_source_dropdown
				temp['parent'] = i.parent
				temp['slug'] = 'lead_'+ str(i.id)

				try:
					multi_obj = get_object_or_404(MultiUserDetails,id=i.created_by_id)
				except:
					multi_obj = None
					temp['created_by_name'] = "Alex M"

				if multi_obj:
					print(multi_obj.user.first_name,"----s-s--")
					temp['created_by_name'] = multi_obj.user.first_name
					if multi_obj.is_manager == "1":
						temp['role'] = "Manager"
					elif multi_obj.is_admin == "1":
						temp['role'] = "Admin"
					elif multi_obj.is_executive == "1":
						temp['role'] = "Executive"
					else:
						temp['role'] = "S.Admin"
				else:
					temp['role'] = "S.Admin"

				leads_obj_list.append(temp)
			print("[LeadDash] After For")
				
			return render(request,template_name,locals())
		
		elif postdata.get('type') == "every":
			pass
		
		url= reverse('customers:leads_dashboard')
		return redirect(url)

	return render(request,template_name,locals())



# #@multi_user_permission('View_Lead')
@multi_user_permission('view', 'Leads')
def get_view_lead(request,slug,template_name='merchant_site/customers/get_view_lead.html'):

	outletid = request.session.get('outlet_id')
	active_page_name = 'get_view_lead_page'
	lead_slug = 'lead_' + str(slug)
	outlet_obj = get_object_or_404(outlet_details,id = outletid)
	all_appointment_booking_obj = appointment_booking.objects.filter(outlet_id=outletid,is_trash=0,lead_id=slug).order_by('-id')
	result_list_new = []
	customer_details_obj = get_object_or_404(lead_details,id=slug)
	# print(customer_details_obj)
	now = datetime.now()
	leadObj = lead_details.objects.get(id = slug)
	lastCallDate = leadObj.last_call_date
	if lastCallDate is not None:
		diffDate = now - lastCallDate
		diffDays = diffDate.days
	else:
		diffDays = None
	historyObj = lead_history.objects.filter(lead = leadObj)
	timeline = []
	counter = 0
	for i in historyObj:
		if i.parked_funnel == True:
			is_pf = True
			tl= {'id' : i.id, 'stage' : 'Parked Funnel', 'date' : i.created_at}
			timeline.append(tl)
			# print("[EditLead] parked funnel:", i.created_at)
		elif i.new_assign == True:
			is_pf = False
			tl= {'id' : i.id, 'stage' : 'New Assign', 'username' : i.username, 'date' : i.created_at}
			timeline.append(tl)
			# print("[EditLead] stage:", i.new_assign)
		else:
			stageObj = lead_stage.objects.get(id = i.stage_id)
			tl = {'id' : i.id, 'stage' : stageObj.stage, 'date' : i.created_at}
			timeline.append(tl)
			# print("[EditLead]", stageObj.stage,":", i.created_at)
			
	print("[EditLead]", timeline)
	multiUserObj = MultiUserDetails.objects.filter(outlet_id = outletid, is_trash = 0)

	all_call_list = []
	addcallobj = new_Addcall_details.objects.filter(lead_id = slug)

	
	for onm in addcallobj:
		temp={}
		try:
			prod_obj = get_object_or_404(product_details,id=onm.Products)
			temp['Products'] = prod_obj.product_name
		except:
			prod_obj = None
		temp['Call_Purpose'] = onm.Call_Purpose
		temp['note'] = onm.Notes
		temp['Call_Status'] = onm.Call_Status
		temp['Interested'] = onm.Interested
		temp['schedule_Next_Call'] = int(onm.schedule_Next_Call)
		temp['schedule_Next_Call_date'] = onm.schedule_Next_Call_date
		temp['schedule_Next_Call_time'] = onm.schedule_Next_Call_time
		temp['last_call'] = onm.last_call
		temp['id'] = onm.id
		all_call_list.append(temp)

	for apo in all_appointment_booking_obj:
		temp = {}

		date_time_str = apo.appointment_date+ ' ' +apo.appointment_time
		try:
			date_time_obj = datetime.strptime(date_time_str, '%Y-%m-%d %H:%M:%S')
		except:
			date_time_obj = datetime.strptime(date_time_str, '%Y-%m-%d %H:%M')

		inovice_details_obj = inovice_details.objects.filter(outlet_id=outletid,payment_mode="paid").order_by('-id')
		if apo.status == 'CAN':
			temp['status'] = 'Cancelled'
		else:	
			if now > date_time_obj:
				temp['status'] = 'Expired'
			else:
				temp['status'] = 'Upcoming' 

		print(apo.customer_id)
		try:
			customer_details_obj2 = get_object_or_404(lead_details, id=apo.lead_id)
		except:
			customer_details_obj2 = None
		prod_id_str = apo.product_id
		print(prod_id_str)
		import ast
		prod_id_list = ast.literal_eval(prod_id_str)

		temp['no_of_prod'] = len(prod_id_list)
		temp['prod_price'] = apo.product_price

		try:
			service_master_info_obj = get_object_or_404(service_master_info,id=apo.service_master_id)
			temp['service_master_name'] = service_master_info_obj.service_master_name
			temp['service_master_id'] = apo.service_master_id
		except :
			service_master_info_obj = None
			temp['service_master_name'] = None
			temp['service_master_id'] = None

		temp['id'] = apo.id
		if customer_details_obj2:
			temp['cust_name'] = customer_details_obj2.customer_name
			temp['lead_id'] = customer_details_obj2.id
		temp['created_at'] = apo.created_at
		# temp['appointment_date'] = appointment.appointment_date
		temp['appointment_time'] = apo.appointment_time
		dt = datetime.strptime(apo.appointment_date, '%Y-%m-%d')
		temp['appointment_date'] = dt.date()

		result_list_new.append(temp)

	if request.method == 'POST':
		postdata = request.POST.copy()
		print("11837",postdata)
		delete_button = postdata.get('delete_xircl')
		cancel_button = postdata.get('cancel_xircl')
		assign_button = postdata.get('assign')

		if delete_button == 'Yes':
			booking_details_obj = get_object_or_404(appointment_booking, id=postdata.get('slug_to_delete'))
			booking_details_obj.is_trash = 1
			booking_details_obj.is_trash_date = now
			booking_details_obj.save()

			messages.add_message(request, messages.SUCCESS, 'Booking deleted successfully .',fail_silently=True)
			url = reverse('customers:get_view_lead',kwargs={'slug':slug})
			return HttpResponseRedirect(url)

		if cancel_button == 'Yes':
			booking_details_obj = get_object_or_404(appointment_booking, id=postdata.get('slug_to_cancel'))
			booking_details_obj.status = 'CAN'
			booking_details_obj.save()

			messages.add_message(request, messages.SUCCESS, 'Booking cancelled successfully .',fail_silently=True)
			url = reverse('customers:get_view_lead',kwargs={'slug':slug})
			return HttpResponseRedirect(url)
		
		if assign_button == 'Yes':
			print("andu gundu")
			postdata = request.POST.copy()
			print(postdata)
			lead_id = postdata.get('lead_id')
			user_id = postdata.get('user')
			print("11868", lead_id, user_id)
			
			leadObj = lead_details.objects.get(id = lead_id)
			multiUserObj = MultiUserDetails.objects.get(id = user_id)
			leadObj.assigned_to = multiUserObj
			leadObj.parked_funnel = False
			leadObj.save()
			
			username = multiUserObj.first_name + " " + multiUserObj.last_name
			
			lead_history.objects.create(new_assign = True, username = username, lead = leadObj)
			
			print("Sab hogaya bhaiiiiiii")

			messages.add_message(request, messages.SUCCESS, f'Assigned to {username} successfully .',fail_silently=True)
			url = reverse('customers:leads_dashboard')
			return HttpResponseRedirect(url)

	return render(request,template_name,locals())

# #@multi_user_permission('View_Lead')
def leads_settings(request, template_name = 'merchant_site/customers/leads_setting.html'):
	stageDb = lead_stage.objects.all()
	active_page_name = "lead_setting"
	if request.method == "POST":
		stageId = request.POST.get('id')
		stageName = request.POST.get('newStage')
		
		
		stageDb1 = lead_stage.objects.get(id = stageId)
		stageDb1.stage = stageName
		stageDb1.save()
		
	return render(request, template_name, locals())

# #@multi_user_permission('View_Lead')
def lead_email(request, template_name = 'merchant_site/customers/leads_email.html'):
	active_page_name = "lead_email"
	return render(request, template_name, locals())

def stage_delete(request, stageId, template_name = 'merchant_site/customers/leads_setting.html'):
	stageDb = lead_stage.objects.get(id = stageId)
	stageDb.delete()
	print("[LEAD]", stageId)
	print("[LEAD] Deleted")
	return JsonResponse({"data":"success"})

def leads_save(request, template_name='merchant_site/customers/leads_dashboard.html'):
	if request.method == "POST":
		counter = request.POST.get("count")
		print("[LEAD SAVE] counter:", counter)
		raw_leadList = []
		for i in range(int(counter)):
			raw_leadList.append(request.POST.get("stage"+str(i+1)))
		print("[LEAD SAVE] with None:", raw_leadList)
		leadList = [i for i in raw_leadList if i]
		print("[LEAD SAVE] without None:", leadList)
		user_obj = User.objects.get(id = request.session.get('root_user_id'))
		for i in leadList:
			leadStageObj = lead_stage.objects.create(stage = i,user=user_obj)

		url= reverse('customers:leads_settings')
		return redirect(url)
	return render(request, template_name, locals())

def assignUser(request):
	if request.method == "POST":
		print("andu gundu")
		postdata = request.POST.copy()
		print(postdata)
		lead_id = postdata.get('lead_id')
		user = postdata.get('user')
		print("11868", lead_id, user)
		messages.add_message(request, messages.SUCCESS, f'Assigned to {user} successfully .',fail_silently=True)
		url = reverse('customers:get_view_lead',kwargs={'slug':lead_id})
		return HttpResponseRedirect(url)

#######################

##### Departments #####

def checkIfAssigned(request):
	if request.method == "POST":
		dept_id = request.POST.get("id")
		deptObj = department.objects.get(id = dept_id)
		try:
			multiUserObj = MultiUserDetails.objects.filter(dept = deptObj)
			return JsonResponse({"data" : "Yes"})
		except:
			return JsonResponse({"data" : 'No'})

def getSubs(request):
	if request.method == "POST":
		# idl = request.POST.get("id")
		idl = request.POST.get('idl')

		print("[Subs]", idl, type(idl))
		
		if idl is None:
			idl = request.POST.getlist("idl[]")
			
		# if idl is not None:
		#     idl = json.loads(idl)
		
		print("[Subs2]", idl, type(idl))
		
		subFinalList = []
		if isinstance(idl, list):
			for iD in idl:
				print("Subs", iD)
				deptDb = department.objects.get(id = iD)
				name = deptDb.dept_name
				data = ["None"]
				if deptDb.subDept_name is not None:
					text = deptDb.subDept_name
					newStr = text
					charsRem = "[']"
					for char in charsRem:
						newStr = newStr.replace(char, "")
					
					subList = newStr.split(", ")
					# print(subList)
					data = [sub+"-"+name for sub in subList]
					subFinalList.extend(data)
					# print(data)
				
			print("[Subs]",subFinalList)
			return JsonResponse({"data" : subFinalList})
		else:    
			deptDb = department.objects.get(id = idl)
			data = []
			subDeptDb = subDepartment.objects.filter(dept = deptDb)
			print("[Subs] subdept:", len(subDeptDb))
			for sub in subDeptDb:
				temp = {}
				temp['id'] = sub.id
				temp['name'] = sub.name
				data.append(temp)
				
			# print("[Subs] data:", data)
			return JsonResponse({"data" : data})

def getProducts(request):
	print("dfdfgfdghfhgjhhgjhj")
	if request.method == "POST":
		productDb = cross_marketing_products.objects.all()
		print("[productDb]", productDb)
		return JsonResponse({"data" : productDb})

def add_new_dept(request, template_name="merchant_site/customers/add_department.html"):
	
	user_permi_list = permission_list.objects.all()
	# moduleList = ["Customers", "Leads", "Accounts", "Vehicle", "Finance", "Servicing", "Insurance", "Support", "Customer Groups", "Bookings", "Invoice", "Delivery Note", "Pro Froma", "Product", "Category", "Service Person", "Offers", "Settings", "Domain & Email Verifications", "Inner XIRCLS", "Privilege XIRCLS", "Forms", "Subscription Manager", "All Transactions", "Pending Transactions", "Bills", "Wallets", "Partner", "Manager Partner", "Partner Requests", "Invite Business", "Send Invites", "Blocked Outlets", "Network Alerts", "Issue & Reedem Offers", "Teams", "Assign Task/Targets", "Issue Rewards", "Users", "Employees", "Candidate"] 
	moduleDb = MultiUserPermissionsField.objects.all()
	moduleList = [i.forHtml for i in moduleDb]
	
	if request.method == "POST":
		postdata = request.POST.copy()
		deptName = postdata.get('deptName')
		tempName = postdata.get('templateName')
		counter = postdata.get('counter')
		subList = []
		
		# print("#"*20)
		
		for i in range(1, int(counter)+1):
			test = postdata.get(str(i))
			print("[AddDept]", test)
			subList.append(test)
			
		# print("[AddDept]", subList)
		filtered_subList = [sub for sub in subList if sub]
		print("[AddDept]", filtered_subList)
		# roles = postdata.get('roles')
		# permission = permission_list.objects.get(id = roles)
		
		try:
			permListObj = permission_list.objects.get(permission_name = tempName)
			messages.add_message(request, messages.ERROR, 'Template Name Already Exists', fail_silently=True)
			# print("[AddDept] Couldn't add in Permission List")
		except:
			newPerm = permission_list.objects.create(permission_name = tempName)
			# print("[AddDept] Added in Permission List")
			# print(f"[AddDept] permId = {newPerm.id}")
			try:
				deptObj = department.objects.get(dept_name = deptName)
				messages.add_message(request, messages.ERROR, 'Department Name Already Exists', fail_silently=True)
				# print("[AddDept] Couldn't create new department")
			except:
				postMods = []
				for i in moduleList:
					test = postdata.get(i)
					postMods.append(test)
				filtered_postMods = [x for x in postMods if x]
				# print(f"[AddDept] {filtered_postMods}")
				
				newDept = department.objects.create(dept_name = deptName, dept_perm = newPerm, dept_module = filtered_postMods, responsibilities = postdata.get("resp"))
				
				for subs in filtered_subList:
					subDepartment.objects.create(name = subs, dept = newDept)
					
				messages.add_message(request, messages.SUCCESS, 'Department added successfully', fail_silently=True)
				# print(f"[AddDept] deptId = {newDept.id}")
			
		# print(f"[AddDept] name: {deptName} | temp: {tempName}")
		# print("#"*20)
		
		url = reverse('customers:manage_dept')
		return HttpResponseRedirect(url)
	
	return render(request, template_name, locals())

def manage_dept(request, template_name="merchant_site/customers/manage_department.html"):
	
	deptDb = department.objects.all()
	
	for i in deptDb:
		subDeptObj = subDepartment.objects.filter(dept = i.id)
		# text = i.subDept_name
		# newStr = text
		# charsRem = "[']"
		# for char in charsRem:
		#     newStr = newStr.replace(char, "")
		subList = []
		
		for subs in subDeptObj:
			if subs.name:subList.append(subs.name)
			
		print("[subList]", subList)
		if len(subList) > 3:
			i.sub_for_dashboard = subList[0] +','+ subList[1] + ','+subList[2]
			i.plus_icon = 1
			# print(i.sub_for_dashboard)
		else:
			i.sub_for_dashboard = ""
			for sub in subList:
				i.sub_for_dashboard += sub+", "
			print("[SubForDash]", i.sub_for_dashboard)
			i.sub_for_dashboard = i.sub_for_dashboard[:-2]
			print("[SubForDash]", i.sub_for_dashboard)
			i.plus_icon = 0
	else:
		if len(subList) > 0:
			i.sub_for_dashboard = subList[0]
		i.plus_icon = 0
	
	if request.method == "POST":
		postdata = request.POST.copy()
		delete = postdata.get("deleteButt")
		print("[asdasd]", postdata, delete)
		if delete == "Yes":
			dept_id = postdata.get("slug_to_delete")
			newDept = postdata.get("dept", None)
			newSubdept = postdata.get("subdept", None)
			
			oldDeptObj = department.objects.get(id = dept_id)
			oldDeptObj.isDeactivated = True
			oldDeptObj.save()
			
		elif postdata.get("activateButt") == "Yes":
			dept_id = postdata.get("slug_to_delete")
			newDept = postdata.get("dept", None)
			newSubdept = postdata.get("subdept", None)
			
			oldDeptObj = department.objects.get(id = dept_id)
			oldDeptObj.isDeactivated = False
			oldDeptObj.save()
		
		# if newDept != None:
		#     newDeptObj = department.objects.get(id = newDept)
		#     multiUserObj = MultiUserDetails.objects.filter(dept = oldDeptObj)
		#     for i in multiUserObj:
		#         i.dept = newDeptObj
		#         i.subdept = newSubdept
		#         i.save()
			
		#     print("[delete-dept]", oldDeptObj, newDeptObj, dept_id, newDept, newSubdept)
		# oldDeptObj.dept_perm.delete()
		# oldDeptObj.delete()
		
		url = reverse('customers:manage_dept')
		return HttpResponseRedirect(url)
	
	return render(request, template_name, locals())

def edit_dept(request, slug, template_name="merchant_site/customers/edit_department.html"):
	
	deptDb = department.objects.get(id = slug)
	# moduleDb = ["Customers", "Leads", "Accounts", "Vehicle", "Finance", "Servicing", "Insurance", "Support", "Customer Groups", "Bookings", "Invoice", "Delivery Note", "Pro Froma", "Product", "Category", "Service Person", "Offers", "Settings", "Domain & Email Verifications", "Inner XIRCLS", "Privilege XIRCLS", "Forms", "Subscription Manager", "All Transactions", "Pending Transactions", "Bills", "Wallets", "Partner", "Manager Partner", "Partner Requests", "Invite Business", "Send Invites", "Blocked Outlets", "Network Alerts", "Issue & Reedem Offers", "Teams", "Assign Task/Targets", "Issue Rewards", "Users"]
	moduleDb = MultiUserPermissionsField.objects.all()
	moduleList = [i.forHtml for i in moduleDb]
	permObj = permission_list.objects.get(id = deptDb.dept_perm_id)
	permTempName = permObj.permission_name
	
	logger.warning("[DEPT]"+' '+str(deptDb.dept_module))
	subDeptObj = subDepartment.objects.filter(dept = deptDb)
	subList = []
	counter = len(subDeptObj)
	
	for subs in subDeptObj:
		temp = {}
		temp['id'] = subs.id
		temp['name'] = subs.name
		subList.append(temp)
		
	if request.method == "POST":
		postdata = request.POST.copy()
		deptName = postdata.get('deptName')
		tempName = postdata.get('templateName')
		counter = postdata.get('counter')
		subList = []
		logger.warning(str(deptName)+' '+'deptName')
		logger.warning(str(tempName)+' '+'tempName')
		logger.warning(str(counter)+' '+'counter')
		for i in range(1, int(counter)+1):
			test = postdata.get(str(i))
			update = postdata.get('update_'+str(i))
			logger.warning("[AddDept]"+' '+str(test)+' '+str(i))
			try:
				subDeptObj = subDepartment.objects.get(dept = deptDb,id = update)
			except:
				subDeptObj = subDepartment()
			subDeptObj.name = test
			subDeptObj.dept = deptDb
			subDeptObj.save()
		
			subList.append(test)
			
		postMods = []
		for i in moduleList:
			test = postdata.get(i)
			postMods.append(test)
		filtered_postMods = [x for x in postMods if x]
			
		logger.warning("[AddDept]"+ ' '+str(subList))
		filtered_subList = [x for x in subList if x]
		logger.warning("[AddDept]"+' '+str(filtered_subList))
		
		permObj.permission_name = tempName
		permObj.save()
		
		deptDb = department.objects.get(id = slug)
		deptDb.dept_name = deptName
		deptDb.subDept_name = filtered_subList
		deptDb.dept_module = filtered_postMods
		deptDb.responsibilities = postdata.get("resp")
		deptDb.save()
	

		messages.success(request, " Department Edited successfully.")
		url = reverse('customers:manage_dept')
		return HttpResponseRedirect(url)
	
	return render(request, template_name, locals())

def view_dept(request, id=0, template_name="merchant_site/customers/get_view_dept.html"):
	
	deptObj = department.objects.get(id = id)
	deptUserObj = Multipartment.objects.filter(dept = deptObj)
	
	return render(request, template_name, locals())

def toggleForHiring(request):
	
	if request.method == "POST":
		id = request.POST.get("id")
		status = request.POST.get("forHiring")
		
		deptObj = department.objects.get(id = id)
		deptObj.for_hiring = True if status == "true" else False
		deptObj.save()
		
		return JsonResponse({"status":"success"})


#######################

############################### COMMISSION ##########################################################
def add_commission_status(request,template_name = 'merchant_site/customers/add_commission.html'):
	
	productDb = cross_marketing_products.objects.all()
	if request.method =="POST":
		postdata=request.POST.copy()
		print(postdata)
		try:
			commission=get_object_or_404(Commission_details,outlet=request.session.get('outlet_id'),commission_name=postdata.get('commission_name'))
			messages.add_message(request, messages.ERROR, 'commission with this name already exist', fail_silently=True)
		except:
			commission=None
			if commission == None:
				commission=Commission_details()
				commission.outlet = get_object_or_404(outlet_details,id=request.session.get('outlet_id'))
				commission.commission_name = postdata.get('commission_name')
				
				if postdata.get('commission_type'):
					commission.commission_type=postdata.get('commission_type')
				if postdata.get('commission_'):
					commission.commission_period_type=postdata.get('commission_')
				# commission.commission_percent =postdata.get('commission_percent')           
				# commission.start_date =postdata.get('commission_start_date')           
				# commission.end_date =postdata.get('commission_end_date')
				
				if request.session.get('multi_user_id'):
					commission.created_by=get_object_or_404(User, id =request.session.get('multi_user_id'))
				else:
					commission.created_by=get_object_or_404(User,id =request.user.id)
		
				commission.save() 

				count=int(postdata.get('count'))
				if postdata.get('count'):
					if postdata.get('commission_') == "DAYS":
						for i in range(count):
							commission_per=Commission_Tenure()
							if postdata.get('commission_type') == "PRODUCT":
								commission_per.commission_on_product=postdata.get('product_{0}'.format(i))
							commission_per.commission=commission
							commission_per.commission_period=postdata.get('period_'+str(i))
							commission_per.commission_percent=postdata.get('rate_'+str(i))
							commission_per.commission_period_units=postdata.get('unit_'+str(i))
							commission_per.save()
						messages.add_message(request, messages.SUCCESS, 'commission added successfully', fail_silently=True)
					else:
						for i in range(count):
							commission_per =Commission_Tenure_by_Date()
							if postdata.get('commission_type') == "PRODUCT":
								commission_per.commission_on_product=postdata.get('product_{0}'.format(i))
							commission_per.commission=commission
							commission_per.commission_percent =postdata.get('rate_'+str(i))
							commission_per.commission_start_Date = postdata.get('start_date_'+str(i))
							commission_per.commission_end_Date = postdata.get('end_date_'+str(i))
							commission_per.save()
						messages.add_message(request, messages.SUCCESS, 'commission added successfully', fail_silently=True)
					url = reverse('customers:commission_settings')
					return HttpResponseRedirect(url)
			else:
				messages.add_message(request, messages.ERROR, 'commission already exist', fail_silently=True)

	return render(request,template_name,locals())

def view_commission_dashboard(request,template_name = 'merchant_site/customers/view_commission.html'):
	if request.session.get('multi_user_id'):
		print("[ViewCommission]", request.session.get('multi_user_id'))
		userObj=MultiUserDetails.objects.get(user_id =request.session.get('multi_user_id'))
		print("[ViewCommission]", userObj.is_admin, userObj.is_manager, userObj.is_user)
		if userObj.is_admin == '1':
			print("[ViewCommission] is_admin")
			userIs = "admin"
			commDb = commission_summary_details.objects.all()
		elif userObj.is_manager == '1':
			print("[ViewCommission] is_manager")
			userIs = "manager"
			commDb = commission_report_details.objects.filter(user_name = userObj)
		elif userObj.is_executive == '1':
			print("[ViewCommission] is_executive")
			userIs = "executive"
			commDb = commission_report_details.objects.filter(user_name = userObj)
	else:
		userIs = "sAdmin"
		commDb = commission_summary_details.objects.all()
	print("[ViewCommission]", userIs)
		
	print("[ViewCommission]", commDb)
	return render(request,template_name,locals())

def view_commission_settings(request,template_name = 'merchant_site/customers/commission_settings.html'):
	# print("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA1st")
	commission_data=Commission_details.objects.filter(outlet = request.session.get('outlet_id'))
	list_data = []
	for i in commission_data:
		dict={}
		dict['commission_name'] = i.commission_name
		dict['id'] = i.id
		if i.commission_period_type == "DAYS":
			dict['type'] = i.commission_period_type
			dict['commtype'] = i.commission_type
			commission_period =Commission_Tenure.objects.filter(commission = i.id)
			# dict['commission_period'] = [i for i in commission_period]
			dict['commission_period'] = commission_period
		else:
			dict['type'] = i.commission_period_type
			dict['commtype'] = i.commission_type
			commission_period =Commission_Tenure_by_Date.objects.filter(commission = i.id)
			# dict['commission_period'] = [i for i in commission_period]    
			dict['commission_period'] = commission_period
		print(dict)
		list_data.append(dict)
	print(list_data)
	# print("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
	return render(request,template_name,locals())

def edit_commission_status(request, key = 0,template_name = 'merchant_site/customers/edit_commission.html'):
	idl = request.GET.get("idl")
	try:
		commission=Commission_details.objects.get(id = key)
	except:
		commission =None  
	if commission.commission_period_type == "DAYS":
		commten = Commission_Tenure.objects.filter(id = idl)
	else:
		commten = Commission_Tenure_by_Date.objects.filter(id = idl)
		
	for i in commten:
		print("[EDIT-COMM]", i)
	
	productDb = cross_marketing_products.objects.all()
	
	if request.method =="POST":
		postdata=request.POST.copy()
		
		if commission:
			commission.outlet = get_object_or_404(outlet_details,id=request.session.get('outlet_id'))
			commission.commission_percent =postdata.get('commission_percent')
			commission.commission_name =postdata.get('commission_name')           
		   
			commission.start_date =postdata.get('commission_start_date')           
			commission.end_date =postdata.get('commission_end_date') 
			if request.session.get('multi_user_id'):
				commission_created_by=get_object_or_404(id =request.session.get('multi_user_id'))
			else:
				commission_created_by=get_object_or_404(id =request.user.id)
	
			commission.save() 
			messages.add_message(request, messages.SUCCESS, 'commission edited successfully', fail_silently=True)

		else:
			messages.add_message(request, messages.ERROR, 'commission not found', fail_silently=True)


	return render(request,template_name,locals())

@login_required(login_url='/merchant-login/')
@redirectMerchantAsPerProgress("MY_CUSTOMERS")
def view_commission_invoice(request,slug = 0, template_name="merchant_site/customers/commission_invoice.html"):
	
	print("[view_invoice]", slug)
	
	if slug != "0":
		commUserObj = commission_report_details.objects.get(id = slug)
		currency_symbol = "₹"
		type = "Single"
		totalAmt = commUserObj.commission
	else:
		UserObj = MultiUserDetails.objects.get(id = request.session['MultiUserID'])
		commUserObj = commission_report_details.objects.filter(user_name = UserObj, isPaid = False)
		currency_symbol = "₹"
		type = "Multi"
		totalAmt = 0
		for i in commUserObj:
			if i.commission is not None:
				totalAmt += float(i.commission)
		

	return render(request,template_name,locals())

def invoice_pdf_print(request, slug = 0, template_name="merchant_site/customers/commission_invoice_view.html"):
	if request.method == 'GET':
		if slug != "0":
			commUserObj = commission_report_details.objects.get(id = slug)
			currency_symbol = "₹"
			type = "Single"
			totalAmt = commUserObj.commission
			totalAmt_words = getWords(round(float(totalAmt)))
		else:
			UserObj = MultiUserDetails.objects.get(id = request.session['MultiUserID'])
			commUserObj = commission_report_details.objects.filter(user_name = UserObj, isPaid = False)
			currency_symbol = "₹"
			type = "Multi"
			totalAmt = 0
			for i in commUserObj:
				if i.commission is not None:
					totalAmt += float(i.commission)
			totalAmt_words = getWords(round(float(totalAmt)))
		pdf = render_to_pdf('merchant_site/customers/commission_invoice_pdf.html', locals())
		if pdf:
			response = HttpResponse(pdf, content_type='application/pdf')
			filename = "Invoice_%s.pdf" %("12341231")
			filename = "FITPL_"+str("1") + str("2")+".pdf"
			content = "inline; filename='%s'" %(filename)
			download = request.GET.get("download")
			return response
		return HttpResponse("Not found")

def invoice_pdf_download(request, slug = 0, template_name="merchant_site/customers/commission_invoice_view.html"):
	if request.method == 'GET':
		if slug != "0":
			commUserObj = commission_report_details.objects.get(id = slug)
			currency_symbol = "₹"
			type = "Single"
			totalAmt = commUserObj.commission
			totalAmt_words = getWords(round(float(totalAmt)))
			name = commUserObj.user_name.first_name+ "_" + commUserObj.company_name + "_payment_receipt"
			print("[DOWNLOAD]", name, commUserObj.user_name.first_name)
		else:
			UserObj = MultiUserDetails.objects.get(id = request.session['MultiUserID'])
			commUserObj = commission_report_details.objects.filter(user_name = UserObj, isPaid = False)
			currency_symbol = "₹"
			type = "Multi"
			totalAmt = 0
			name = UserObj.first_name+ "_payment_receipt"
			print("[DOWNLOAD]", name, UserObj.first_name)
			for i in commUserObj:
				if i.commission is not None:
					totalAmt += float(i.commission)
			totalAmt_words = getWords(round(float(totalAmt)))
		pdf = render_to_pdf('merchant_site/customers/commission_invoice_pdf.html', locals())
		if pdf:
			response = HttpResponse(pdf, content_type='application/pdf')
			filename = name + ".pdf"
			content = "inline; filename='%s'" %(filename)
			download = request.GET.get("download")
			content = "attachment; filename='%s'" %(filename)
			response['Content-Disposition'] = content
			return response
		return HttpResponse("Not found")

def render_to_pdf(template_src, context_dict={}):
	template = get_template(template_src)
	html  = template.render(context_dict)
	result = BytesIO()
	pdf = pisa.pisaDocument(BytesIO(html.encode("ISO-8859-1")), result)
	return HttpResponse(result.getvalue(), content_type='application/pdf')

######################################################################################

from django.db.models import Q, Count, Case, When, Sum
from django.db.models.functions import Coalesce

from employees.models import *
# @multi_user_permission('view', 'Users')
def get_view_user(request, slug, template_name='merchant_site/customers/get_view_user.html'):
	from django.db import models as mod
	try:
		userObj = MultiUserDetails.objects.get(id = slug)
	except:
		pass
	else:
		all_task = task_details.objects.filter(outlet_id=request.session.get('outlet_id'), is_trash=0, fromm="Tasks", assignToUser=slug)
	login_user_id = request.session.get('multi_user_id') if request.session.get('multi_user_id') else request.user.id
	try:
		commName = userObj.commission_status.commission_name
	except:
		commName = None
	try:
		multiDeptObj = Multipartment.objects.get(user = userObj)
		dept = multiDeptObj.dept.dept_name
		subDept = multiDeptObj.subDept
		subDept = subDept.replace("'","")
		subDept = subDept.replace("[","")
		subDept = subDept.replace("]","")
	except:
		multiDeptObj = Multipartment.objects.filter(user = userObj)
		if len(multiDeptObj) > 1:
			multiDeptObj = multiDeptObj[1]
			dept = multiDeptObj.dept.dept_name
			subDept = multiDeptObj.subDept
			subDept = subDept.replace("'","")
			subDept = subDept.replace("[","")
			subDept = subDept.replace("]","")
		else:
			dept = ""
			subDept = ""
			
	request.session['MultiUserID'] = userObj.id
	user_id = slug
	try:
		csmDb = commission_summary_details.objects.get(user_name = userObj)
		commDb = commission_report_details.objects.filter(user_name = userObj)
	except:
		csmDb = None
		commDb = None
	stats = []
	
	# lis = ["Administration HR", "Recruitment", "Human Resource Management", "Operations", "Sales", "Marketing", "Luxury Sales", "Digital Marketing", "Client Success Management", "Content Writing", "Graphic Design", "Python Programming", "Front-End Development", "Android App Development", "iOS App Development"]
	lis = [
	"Administration HR",
	"Recruitment",
	"Human Resource Management",
	"Operations",
	"Sales",
	"Marketing",
	"Luxury Sales",
	"Digital Marketing",
	"Client Success Management",
	"Content Writing",
	"Graphic Design",
	"Python Programming",
	"Front-End Development",
	"Android App Development",
	"iOS App Development",
	"Sales Business Development",
	"UI/UX Design",
	"Financial Analyst",
	"Founder's Business Plan Analyst",
	"Risk Analyst",
	"Market Research & Competitive Analysis",
	"Luxury Sales Partner",
	"Sales Partner - Automobiles",
	"Sales Partner - Business Consultants",
	"Sales Partner - Hospitality",
	"Sales Partner - IT Consultants",
	"Sales Partner - Loyalty Programs",
	"Sales Partner - SaaS",
	"Content Coordinator",
	"Financial Forecasting",
	"Video",
	"Lead Generation",
	"HR and Content Writing"

]
	for i in lis:
		candObj = candidate_details.objects.filter(Department = i, created_by_id = userObj.user)
		count=candObj.aggregate(
					count=Count("pk"),
					Screened=Coalesce(Sum(
						Case(When(Stage__in = ['Screening Call','Test/Portfolios/Assignments'],then=1),default=0,output_field=mod.IntegerField())
						),0),
					Interview=Coalesce(Sum(
						Case(When(Stage = 'Final Interview',then=1),default=0,output_field=mod.IntegerField())
						),0),
					Selected=Coalesce(Sum(
						Case(When(Stage = 'Documentation Stage',then=1),default=0,output_field=mod.IntegerField())
						),0),
					Probation=Coalesce(Sum(
						Case(When(Stage = 'In Probation',then=1),default=0,output_field=mod.IntegerField())
						),0),
					Employed=Coalesce(Sum(
						Case(When( Stage = 'Employed',then=1),default=0,output_field=mod.IntegerField())
						),0),
					Withdrawn=Coalesce(Sum(
						Case(When( Stage = 'Withdrawn',then=1),default=0,output_field=mod.IntegerField())
						),0),
						)
		temp = {}
		temp['role'] = i
		temp['count'] = count.get('count')
		temp['Screened'] =  count.get('Screened')
		temp['Interview'] =count.get('Interview')
		temp['Selected'] = count.get('Selected')
		temp['Probation'] = count.get('Probation')
		temp['Employed'] = count.get('Employed')
		temp['Withdrawn'] = count.get('Withdrawn')
		stats.append(temp)
	
	return render(request, template_name, locals())

def user_settings(request, template_name='merchant_site/customers/user_settings.html'):
	permDb = MultiUserPermissionsField.objects.all()
	active_page_name = "user_setting"
	if request.method == "POST":
		permId = request.POST.get('id')
		permName = request.POST.get('newperm')
		
		permDb1 = MultiUserPermissionsField.objects.get(id = permId)
		permDb1.perm = permName
		permDb1.save()
		
	return render(request, template_name, locals())

def perms_save(request):
	if request.method == "POST":
		counter = request.POST.get("count")
		print("[Perms SAVE] counter:", counter)
		raw_permList = []
		for i in range(int(counter)):
			raw_permList.append(request.POST.get("perm"+str(i+1)))
		print("[Perms SAVE] with None:", raw_permList)
		permList = [i for i in raw_permList if i]
		htmlList = []
		for perm in permList:
			if "/" in perm:
				perm = perm.replace("/", "")
			if " " in perm:
				perm = perm.replace(" ", "")
			if "&" in perm:
				perm = perm.replace("&", "")
			htmlList.append(perm.replace("/", ""))
		print("[Perms SAVE] without None:", permList)
		print("[Perms SAVE] htmlList:", htmlList)
		for i in range(len(permList)):
			MultiUserPermissionsField.objects.create(fieldName = permList[i], forHtml = htmlList[i])
		url= reverse('customers:user_settings')
		return redirect(url)
	
def user_has_permissions(request,field_name):

	boolean = False

	multi_user_permission_list = request.session.get('multi_user_permission_list')
	print(multi_user_permission_list,"--multi_user_permission_list--")
	if request.session.get('multi_user_id'):
		if multi_user_permission_list:
			print(field_name,"---field_name",multi_user_permission_list)
			if field_name in multi_user_permission_list: 
				boolean = True
				return boolean
			else:
				return boolean
		else:
			return boolean
	else:
		boolean = True
		return boolean

	return boolean

def check_lead_exists(request):
	outlet_id = request.session.get('outlet_id')
	if request.method == "POST":
		email_id = request.POST.get("email")
		try:
			lead_obj = get_object_or_404(lead_details,email=email_id,outlet_id=outlet_id,is_trash=0)
		except:
			lead_obj = None
		if lead_obj:
			created_by = lead_obj.created_by.first_name +' '+lead_obj.created_by.last_name
			data = {
				'created_by':created_by,
				'lead_exists':'Yes',
			}
			msg="Lead already exists. Lead in touch with "+created_by+"."
			status='error'
		else:
			data = {
				'created_by':'',
				'lead_exists':'No',
			}
			msg=''
			status='success'
		response = response_json(request, status, '200', data, msg, '')
		return JsonResponse(response)
		
################################ CONTENT START #################################
@multi_user_permission('add', 'Content')
def create_content(request,template_name="merchant_site/customers/create_content.html"):

	print("^^^^^^^^^^^^^^^^^^^^^^^^CREATE CONTENT^^^^^^^^^^^^^^^^^^^^^^")

	# print(f"MULTI USER ID : {multi_user_id}")

	categories_obj  = OutletCategory.objects.filter(is_active=True)
	categories  = categories_obj.filter(parent_id__isnull = True)
	sub_categories  = categories_obj.filter(parent_id__isnull = False)

	department_obj = list(department.objects.all())
	print("department_obj-->",department_obj)
	if request.method == "POST":
		logger.warning('----------------------------')
		logger.warning('----------------------------')
		logger.warning('----------------------------')
		logger.warning("postdata -- >"+str(request.FILES))
		logger.warning('----------------------------')
		logger.warning('----------------------------')
		logger.warning('----------------------------')
		multi_user_id = request.session.get('multi_user_id')
		outlet_id = request.session.get('outlet_id')
		
		root_user_id = request.session.get('root_user_id')
		parent_id = request.user.id

		created_by_id = None
		req_user_id = None

		print(f"OUTLET ID : {outlet_id}")
		print(f"multi_user_id : {multi_user_id}")
		print(f"root_user_id : {root_user_id}")
		print(f"parent_id ID : {parent_id}")

		# if multi_user_id != None:
		#     parent_id = list(MultiUserDetails.objects.filter(user_id=user_id))

		# multi_user_id = 50964
		

		if multi_user_id == None:
			req_user_id = request.user.id
			print(f"REQUEST USER ID: {req_user_id}")
			
				
		else:
			req_user_id = multi_user_id
			obj = MultiUserDetails.objects.filter(user_id=multi_user_id)
			print("**************************************", obj)
			print(f"OBJ : {obj}")

			created_by_id = obj[0]
			print(f"CREATED BY ID : {created_by_id}")

		is_admin = False

		print("multi_user_id==>",multi_user_id)
		if multi_user_id == None:
			is_admin = True
			multi_position = '4'
		else:
			user_details = MultiUserDetails.objects.get(user_id=multi_user_id)
			if user_details.is_admin == '1':
				is_admin = True
				multi_position = '3'
			elif user_details.is_manager == '1':
				multi_position = '2'
			elif user_details.is_executive == '1':
				multi_position = '1'

   

		title = request.POST.get('title')
		reference_link = request.POST.getlist('ref_link')
		description = request.POST.get('desc')
		tags = request.POST.get('tags')
		text = request.POST.get('text')
		support_text = request.POST.get('support_text')
		validity_number = int(request.POST.get('validity_number'))
		validity_period = request.POST.get('validity_period')
		valid_computed_days = validity_number
		genre = request.POST.getlist('genre',None)
		dep_id_list = request.POST.getlist('department')
		topic = request.POST.getlist('Topic')
		categorys = request.POST.getlist('categorys')
		sub_categorys = request.POST.getlist('sub_categorys')
		Tone = request.POST.getlist('Tone')
		ideal_audience = request.POST.getlist('ideal_audience')
		industry = request.POST.getlist('Industry')
		image = request.FILES.get('content_image')
		if validity_period == "months":

			valid_computed_days *= 30
		elif validity_period == "years":
			valid_computed_days *= 365

		final_date = datetime.now() + timedelta(days=valid_computed_days)

		is_verified = False

		if is_admin == True:
			is_verified = True

		ob = Content(
			reference_link=reference_link,
			title=title, 
			description=description,
			tags=tags,
			text=text, 
			support_text=support_text, 
			validity_number=validity_number, 
			validity_period=validity_period,
			final_validity_date=final_date, 
			is_verified=is_verified,
			user_id= req_user_id,
			parent_id=parent_id,
			outlet_id=outlet_id,
			genre=genre,
			multi_position=multi_position,
			department=dep_id_list,
			category=categorys,
			sub_category =sub_categorys,
			tone = Tone,
			ideal_audience =ideal_audience,
			topic = topic,
			industry = industry,
			image = image
			# created_by_id=created_by_id,
			)

		ob.save()

		ch = contentHistory(
			content=ob,
			status='Created',
			reference_link=reference_link,
			title=title, 
			description=description,
			tags=tags,
			text=text, 
			support_text=support_text, 
			validity_number=validity_number, 
			validity_period=validity_period,
			final_validity_date=final_date, 
			genre=genre,
			multi_position=multi_position,
			is_updated=False,
			department=dep_id_list,
			# created_by_id=created_by_id,
			)

		ch.save()
		
		for i in dep_id_list:
			contentDept.objects.create(content=ob,department_id=i)
		messages.add_message(request, messages.SUCCESS, 'Content created successfully', fail_silently=True)
		return redirect('/merchant/show_content')
	return render(request,template_name,locals())

def filter_categories(request):
	if request.method == "POST":
		logger.warning('----------------------------')
		logger.warning('----------------------------')
		logger.warning('----------------------------')
		logger.warning("Categories -- >"+str(request.POST))
		logger.warning('----------------------------')
		logger.warning('----------------------------')
		logger.warning('----------------------------')

		categories_obj  = OutletCategory.objects.filter(is_active=True, parent_id_id__in = request.POST.getlist('category')).values()

	return JsonResponse({'sub_categories': list(categories_obj)}, safe=False)

@multi_user_permission('view', 'Content')
def show_content(request):

	print("^^^^^^^^^^^^^^^^^^SHOW CONTENT^^^^^^^^^^^^^^^^^^")

	multi_user_id = request.session.get('multi_user_id')
	outlet_id = request.session.get('outlet_id')
	req_user_id = request.session.get('root_user_id')
	is_admin = False

	print(f"MULTI USER ID : {multi_user_id}")

	print(f"REQ USER ID : {req_user_id}")

	#  ----CHECKING IF ADMIN----
	if multi_user_id == None:
		is_admin = True
		multi_role = 'S.Admin'
	else:
		user_details = MultiUserDetails.objects.get(user_id=multi_user_id)
		if user_details.is_admin == '1':
			is_admin = True
			multi_role = 'Admin'
		elif user_details.is_manager == '1':
			multi_role = 'Manager'
		elif user_details.is_executive == '1':
			multi_role = 'Executive'
		
	user_id = request.session.get('multi_user_id') if request.session.get('multi_user_id') else request.session.get('root_user_id')

	print(f"$$$$$$$$$$$$$$$$$$$$  {user_id}  $$$$$$$$$$$$$$$$$$$$$$$$$$")
	can_review = False
	if multi_role == 'Manager':
		try:
			multi_obj = get_object_or_404(MultiUserDetails,user_id=multi_user_id)
		except:
			multi_obj = None
		if multi_obj:
			try:
				multiPart_obj = get_object_or_404(Multipartment,user_id=multi_obj.id)
			except:
				multiPart_obj = None
			if multiPart_obj:
				if multiPart_obj.dept_id == 10:
					can_review = True


	my_content_list = []
	unverified_list = []
	content_data = []
	posted_data = []
	cont_obj = Content.objects.all()
	for content in cont_obj:
		can_post = False
		dept_obj = contentDept.objects.filter(content_id=content.id)
		dept_list = [i.department.dept_name for i in dept_obj]
		dept_id_list = [i.department.id for i in dept_obj]
		if is_admin:
			can_post = True
			times_posted_count = PostContent.objects.filter(content_id=content.id).count()
		else:
			times_posted_count = PostContent.objects.filter(posted_by_id=multi_user_id,content_id=content.id).count()
			try:
				multi_obj = get_object_or_404(MultiUserDetails,user_id=multi_user_id)
			except:
				multi_obj = None
			print("multi_obj-->",multi_obj)
			if multi_obj:
				try:
					multiPart_obj = get_object_or_404(Multipartment,user_id=multi_obj.id)
				except:
					multiPart_obj = None
				print("multiPart_obj-->",multiPart_obj)
				if multiPart_obj:
					print("multiPart_obj.dept_id-->",multiPart_obj.dept_id,dept_id_list)
					
					if multiPart_obj.dept_id in dept_id_list:
						print("yess")
						can_post = True

		times_posted_count_all = PostContent.objects.filter(content_id=content.id).count()
		try:
			ref_link = ast.literal_eval(content.reference_link)
		except:
			ref_link = []
		
		temp = {
			'title': content.title,
			'description': content.description,
			'reference_link': ref_link,
			'tags': content.tags,
			'text': content.text,
			'support_text': content.support_text,
			'final_validity_date': content.final_validity_date.date(),
			'created_on': content.created_on,
			'times_posted': times_posted_count,
			'times_posted_all': times_posted_count_all,
			'id': content.id,
			'dept_list':dept_list,
			'can_post':can_post,
			'user_fname':content.user.first_name,
			'user_lname':content.user.last_name,
			'first_reviewed':content.first_review_by_id,
			'valid_for_review':True,
		}
		if is_admin == True:
			if content.is_verified == False:
				hist_obj = contentHistory.objects.filter(Q(multi_position='1') | Q(multi_position='2'),content_id=content.id).order_by('-id')
				fist_id = hist_obj.first().id
				for hist in hist_obj:
					if hist.status == 'Created':
						fname = hist.content.user.first_name
						lname = hist.content.user.last_name
					else:
						fname = hist.review_by.first_name
						lname = hist.review_by.last_name
					
					valid_for_review = False
					if hist.id == fist_id:
						valid_for_review = True

					temp2 = {
						'title': hist.title,
						'description': hist.description,
						'reference_link': hist.reference_link,
						'tags': hist.tags,
						'text': hist.text,
						'support_text': hist.support_text,
						'final_validity_date': hist.final_validity_date.date(),
						'created_on': hist.content.created_on,
						'times_posted': times_posted_count,
						'times_posted_all': times_posted_count_all,
						'id': hist.content.id,
						'dept_list':dept_list,
						'can_post':can_post,
						'user_fname':fname,
						'user_lname':lname,
						'review_by':hist.review_by,
						'valid_for_review':valid_for_review,
						'requested_on':hist.created_at
					}

					unverified_list.append(temp2)
					unverified_list.sort(key = lambda x:x['requested_on'])
					unverified_list.reverse()
				print('unverified_list---',unverified_list)

		if content.user_id == user_id:
			my_content_list.append(temp)

		if content.is_verified == False:
			if can_review == True:
				if content.first_review_by_id == None:
					if content.multi_position == '1':
						unverified_list.append(temp)
		else:
			if temp['can_post'] == True:
				content_data.append(temp)
			posted_data.append(temp)


	# my_content_obj = Content.objects.filter(user_id=user_id)
	# for content in my_content_obj:
		
	#     dept_obj = contentDept.objects.filter(content_id=content.id)
	#     dept_list = [i.department.dept_name for i in dept_obj]
	#     temp = {
	#         'title': content.title,
	#         'reference_link': content.reference_link,
	#         'tags': content.tags,
	#         'dept_list':dept_list,
	#         'id': content.id,
	#     }
	#     my_content_list.append(temp)
		
	# verified_list = list(Content.objects.filter(is_verified=True))
	# verified_list.reverse()
	# unverified_list = []
	if is_admin == False:
		post_obj = PostContent.objects.filter(outlet_id=outlet_id,posted_by_id=multi_user_id,posted_url__isnull = True)
	else:
		# unverified_obj = list(Content.objects.filter(is_verified=False))
		# for content in unverified_obj:
			
		#     dept_obj = contentDept.objects.filter(content_id=content.id)
		#     dept_list = [i.department.dept_name for i in dept_obj]
		#     temp = {
		#         'title': content.title,
		#         'reference_link': content.reference_link,
		#         'tags': content.tags,
		#         'dept_list':dept_list,
		#         'id': content.id,
		#     }
		#     unverified_list.append(temp)
		
		post_obj = PostContent.objects.filter(outlet_id=outlet_id,posted_url__isnull = True)


	

  

	today = datetime.now().date()
 
	# content_data = []

	# for content in verified_list:
	#     can_post = False
	#     dept_obj = contentDept.objects.filter(content_id=content.id)
	#     dept_list = [i.department.dept_name for i in dept_obj]
	#     dept_id_list = [i.department.id for i in dept_obj]
	#     if is_admin:
	#         can_post = True
	#         times_posted_count = PostContent.objects.filter(content_id=content.id).count()
	#     else:
	#         times_posted_count = PostContent.objects.filter(posted_by_id=multi_user_id,content_id=content.id).count()
	#         try:
	#             multi_obj = get_object_or_404(MultiUserDetails,user_id=multi_user_id)
	#         except:
	#             multi_obj = None
	#         print("multi_obj-->",multi_obj)
	#         if multi_obj:
	#             try:
	#                 multiPart_obj = get_object_or_404(Multipartment,user_id=multi_obj.id)
	#             except:
	#                 multiPart_obj = None
	#             print("multiPart_obj-->",multiPart_obj)
	#             if multiPart_obj:
	#                 print("multiPart_obj.dept_id-->",multiPart_obj.dept_id,dept_id_list)
	#                 if multiPart_obj.dept_id in dept_id_list:
	#                     print("yess")
	#                     can_post = True

	#     times_posted_count_all = PostContent.objects.filter(content_id=content.id).count()
		
	#     temp = {
	#         'title': content.title,
	#         'description': content.description,
	#         'reference_link': content.reference_link,
	#         'tags': content.tags,
	#         'text': content.text,
	#         'support_text': content.support_text,
	#         'final_validity_date': content.final_validity_date.date(),
	#         'created_on': content.created_on,
	#         'times_posted': times_posted_count,
	#         'times_posted_all': times_posted_count_all,
	#         'id': content.id,
	#         'dept_list':dept_list,
	#         'can_post':can_post
	#     }
	#     content_data.append(temp)
		
	   
	users_posted_list = list(PostContent.objects.filter(outlet_id=outlet_id))

	unique_posted_list = []

	
	return render(request, "merchant_site/customers/show_content.html", locals())

@multi_user_permission('view', 'Content')
def publish(request):
	print("!!!!!!!!!!!!!!!!!!!!!!!!! AJAX CALL !!!!!!!!!!!!!!!!!!!!!")
	if request.method == "POST":
		print("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&")
		print(request.POST)
		post_id = request.POST.get('id')

		current_post = Content.objects.filter(id=post_id)[0]

		print(current_post)

		print(current_post.title)

		current_post.is_verified = 1

		current_post.save()

		print("&&&&&&&&&&&&&&&&&&&&&& ", post_id, " &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&")

	return None


def add_url(request):
	print("!!!!!!!!!!!!!!!!!!!!!!!!! AJAX CALL !!!!!!!!!!!!!!!!!!!!!")
	response = ''
	if request.method == "POST":
		print("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&")
		print(request.POST)
		post_id = request.POST.get('post_id')
		post_url = request.POST.get('post_url')

		try:
			post_obj = get_object_or_404(PostContent,id=post_id)
		except:
			post_obj = None
		if post_obj :
			post_obj.posted_url = post_url
			post_obj.save()

			response = response_json(request, 'success', '200', '', 'URL added successfully', '')
		else:
			response = response_json(request, 'error', '200', '', 'Something went wrong', '')   

	return JsonResponse(response)
	
@multi_user_permission('view', 'Content')
def post_content(request, postId='0'):

	print('---------------- POST CONTENT ------------------')
	print(f"POST ID : {postId}")
	if request.session.get("multi_user_id"):
		userid=request.session.get("multi_user_id")
	else:
		userid=request.session.get('root_user_id')
	link = "https://hr.xircls.com/via/content/signup/content_id="+str(postId)+"/content-ref="+str(userid)+"/"
	if request.method == "POST":

		print('---------------- POST CONTENT - POST REQUEST ------------------')

		outlet_id = request.session.get('outlet_id')
		purpose = request.POST.get('purpose')
		date = request.POST.get('date')
		platform = request.POST.get('platform')

		if platform == 'other':
			platform = request.POST.get('other_input')

		print(f"DATE : {date}")
		print(f"PLATFORM : {platform}")
		print(f"PURPOSE : {purpose}")
		print(f"POST ID : {postId}")    
		print(f"OUTLET ID : {outlet_id}")    

		ob = PostContent(
			date=date,
			platform=platform, 
			purpose=purpose,
			outlet_id=outlet_id,
			content_id=postId,
			posted_by_id=userid
		)
		ob.save()
		messages.add_message(request, messages.SUCCESS, 'Content posted successfully', fail_silently=True)
		return redirect('/merchant/show_content')
	return render(request, "merchant_site/customers/post_content.html", locals())

@multi_user_permission('view', 'Content')
def posted_users(request, postId='0'):

	if request.session.get("multi_user_id"):
		userid=request.session.get("multi_user_id")
		multi_user = True
	else:
		userid=request.session.get('root_user_id')
		multi_user = False

	outlet_id = request.session.get('outlet_id')
	print("multi_user - > ",multi_user)
	if multi_user:
		
		users_posted_list = PostContent.objects.filter(content_id=postId,posted_by_id = userid)
	else:
		users_posted_list = PostContent.objects.filter(content_id=postId)

	return render(request, "merchant_site/customers/posted_users.html", locals())

@multi_user_permission('view', 'Content')
def view_content(request,contentId='',template_name="merchant_site/customers/view_content.html"):
	all_content_obj = Content.objects.all().order_by('-id')
	
	categories_obj  = OutletCategory.objects.filter(is_active=True)
	

	try:
		content_obj = get_object_or_404(Content,id=contentId)
		cont_dept = contentDept.objects.filter(content_id=content_obj.id)
		dept_list = [i.department.dept_name for i in cont_dept]
		reference_link = ast.literal_eval(content_obj.reference_link)
		genre = ast.literal_eval(content_obj.genre)

	except:
		content_obj = None
		dept_list = []
		reference_link = []
		genre = []

	try:
		category = ast.literal_eval(content_obj.category)
		ideal_audience = ast.literal_eval(content_obj.ideal_audience)
		sub_category = ast.literal_eval(content_obj.sub_category)
		tone = ast.literal_eval(content_obj.tone)
		topic = ast.literal_eval(content_obj.topic)
		industry = ast.literal_eval(content_obj.industry)

		categories  = categories_obj.filter(parent_id__isnull = True, id__in=category)
		sub_categories  = categories_obj.filter(parent_id__isnull = False, id__in=sub_category)
	except:
		category = []
		ideal_audience = []
		sub_category = []
		tone = []
		topic = []
		industry = []


	return render(request,template_name, locals())

@multi_user_permission('view', 'Content')
def review_content(request,contentId='',template_name="merchant_site/customers/review_content.html"):
	multi_user_id = request.session.get('multi_user_id')
	department_obj = list(department.objects.all())
	if multi_user_id == None:
		is_admin = True
		multi_role = '4'
	else:
		user_details = MultiUserDetails.objects.get(user_id=multi_user_id)
		if user_details.is_admin == '1':
			is_admin = True
			multi_role = '3'
		elif user_details.is_manager == '1':
			multi_role = '2'
		elif user_details.is_executive == '1':
			multi_role = '1'
	user_id = request.session.get('multi_user_id') if request.session.get('multi_user_id') else request.session.get('root_user_id')
	try:
		content_obj = get_object_or_404(Content,id=contentId)
		cont_dept = contentDept.objects.filter(content_id=content_obj.id)
		dept_list = [i.department.dept_name for i in cont_dept]
		reference_link = ast.literal_eval(content_obj.reference_link)
		genre = ast.literal_eval(content_obj.genre)
	except:
		content_obj = None
		dept_list = []
		reference_link = []
		genre = []

	selected_dept_list = []
	if content_obj:
		history_obj = contentHistory.objects.filter(content_id=content_obj.id).order_by('-id')
		cont_dept = contentDept.objects.filter(content_id = content_obj.id)
		for dept in cont_dept:
			selected_dept_list.append(dept.department_id)

		hist_cont_list=[]
		for hist in history_obj:
			hist_reference_link = ast.literal_eval(hist.reference_link) if hist.reference_link else []
			hist_genre = ast.literal_eval(hist.genre) if hist.genre else []
			
			hist_dept_list=[]
			hist_dept = []
			if hist.department:
				hist_dept = ast.literal_eval(hist.department)
				hist_dept_obj = department.objects.filter(id__in=hist_dept)
				hist_dept_list = [i.dept_name for i in hist_dept_obj]
			temp = {
				'title': hist.title,
				'description': hist.description,
				'reference_link': hist_reference_link,
				'tags': hist.tags,
				'text': hist.text,
				'support_text': hist.support_text,
				'validity_number':hist.validity_number,
				'validity_period':hist.validity_period,
				'final_validity_date': hist.final_validity_date.date(),
				'created_on': hist.created_at,
				'dept_list':hist_dept_list,
				'genre': hist_genre
			}
			hist_cont_list.append(temp)
		if request.method == "POST":
			print("postdata->.",request.POST.copy())
			press_btn = request.POST.get('press_btn')
			title = request.POST.get('title')
			reference_link = request.POST.getlist('ref_link')
			description = request.POST.get('desc')
			tags = request.POST.get('tags')
			text = request.POST.get('text')
			support_text = request.POST.get('support_text')
			validity_number = int(request.POST.get('validity_number'))
			validity_period = request.POST.get('validity_period')
			valid_computed_days = validity_number
			genre = request.POST.getlist('genre',None)
			dep_id_list = request.POST.getlist('department')
			if validity_period == "months":
				valid_computed_days *= 30
			elif validity_period == "years":
				valid_computed_days *= 365

			final_date = datetime.now() + timedelta(days=valid_computed_days)

			content_obj.reference_link=reference_link
			content_obj.title=title
			content_obj.description=description
			content_obj.tags=tags
			content_obj.text=text
			content_obj.support_text=support_text
			content_obj.validity_number=validity_number
			content_obj.validity_period=validity_period
			content_obj.final_validity_date=final_date
			content_obj.genre=genre
			content_obj.department=dep_id_list
			
			if press_btn != 'draft':
				if content_obj.first_review_by_id == None:
					content_obj.first_review_by_id=user_id
			content_obj.save()

			if press_btn == 'request_for_publish' or press_btn == 'save_&_review':
				status = 'Reviewed'
				messages.add_message(request, messages.SUCCESS, 'Content reviewed successfully', fail_silently=True)
			elif press_btn == 'draft':
				status = 'Draft'
				messages.add_message(request, messages.SUCCESS, 'Content saved as draft successfully', fail_silently=True)
			else:
				status = 'Published'
				messages.add_message(request, messages.SUCCESS, 'Content published successfully', fail_silently=True)

			if status == 'Published':
				content_obj.is_verified = 1
				content_obj.save()

			ch = contentHistory(
				content=content_obj,
				status=status,
				reference_link=reference_link,
				title=title, 
				description=description,
				tags=tags,
				text=text, 
				support_text=support_text, 
				validity_number=validity_number, 
				validity_period=validity_period,
				final_validity_date=final_date, 
				genre=genre,
				multi_position=multi_role,
				is_updated=False,
				review_by_id = user_id,
				department=dep_id_list
				)

			ch.save()
			
			contentDept.objects.filter(content_id=content_obj.id).delete()
			for i in dep_id_list:
				contentDept.objects.create(content=content_obj,department_id=i)

			return redirect('/merchant/show_content')
	return render(request,template_name, locals())


@multi_user_permission('edit', 'Content')
def edit_content(request,contentId='',template_name="merchant_site/customers/edit_content.html"):
	multi_user_id = request.session.get('multi_user_id')
	department_obj = list(department.objects.all())
	if multi_user_id == None:
		is_admin = True
		multi_role = '4'
	else:
		user_details = MultiUserDetails.objects.get(user_id=multi_user_id)
		if user_details.is_admin == '1':
			is_admin = True
			multi_role = '3'
		elif user_details.is_manager == '1':
			multi_role = '2'
		elif user_details.is_executive == '1':
			multi_role = '1'
	user_id = request.session.get('multi_user_id') if request.session.get('multi_user_id') else request.session.get('root_user_id')
	try:
		content_obj = get_object_or_404(Content,id=contentId)
		cont_dept = contentDept.objects.filter(content_id=content_obj.id)
		dept_list = [i.department.dept_name for i in cont_dept]
		reference_link = ast.literal_eval(content_obj.reference_link)
		genre = ast.literal_eval(content_obj.genre)
	except:
		content_obj = None
		dept_list = []
		reference_link = []
		genre = []

	selected_dept_list = []
	if content_obj:
		cont_dept = contentDept.objects.filter(content_id = content_obj.id)
		for dept in cont_dept:
			selected_dept_list.append(dept.department_id)
		if request.method == "POST":
			print("postdata->.",request.POST.copy())
			press_btn = request.POST.get('press_btn')
			title = request.POST.get('title')
			# reference_link = request.POST.getlist('ref_link')
			description = request.POST.get('desc')
			tags = request.POST.get('tags')
			text = request.POST.get('text')
			support_text = request.POST.get('support_text')
			validity_number = int(request.POST.get('validity_number'))
			validity_period = request.POST.get('validity_period')
			valid_computed_days = validity_number
			genre = request.POST.getlist('genre',None)
			dep_id_list = request.POST.getlist('department')
			if validity_period == "months":
				valid_computed_days *= 30
			elif validity_period == "years":
				valid_computed_days *= 365

			final_date = datetime.now() + timedelta(days=valid_computed_days)

			content_obj.reference_link=reference_link
			content_obj.title=title
			content_obj.description=description
			content_obj.tags=tags
			content_obj.text=text
			content_obj.support_text=support_text
			content_obj.validity_number=validity_number
			content_obj.validity_period=validity_period
			content_obj.final_validity_date=final_date
			content_obj.genre=genre
			content_obj.department=dep_id_list
			
	
			content_obj.save()

			
				
			messages.add_message(request, messages.SUCCESS, 'Content edited successfully', fail_silently=True)

			
			contentDept.objects.filter(content_id=content_obj.id).delete()
			for i in dep_id_list:
				contentDept.objects.create(content=content_obj,department_id=i)

			return redirect('/merchant/show_content')
	return render(request,template_name, locals())


############################### CONTENT END ####################################


#################### CANLENDER FUNCTIONS ############################
@login_required
def calendar(request, template_name='merchant_site/customers/all_calendar2.html'):
	
	try:
		loginID = request.session["multi_user_id"]
	except:
		loginID = request.session["root_user_id"]
		
	try:
		print("[Calendar] In Try", loginID)
		calObj = userCalendar.objects.get(user_id = loginID)
	except:
		print("[Calendar] In except")
		messages.add_message(request, messages.ERROR, 'Please enter these details to access calendar.', fail_silently=True)
		return redirect("customers:calendarSettings")
	else:
		print("[Calendar] In Else", calObj.user.id)
		pass
		
	outlet_id = request.session.get('outlet_id')
	user_id = request.session.get('user_obj')
	
	calPermObj = calPerm.objects.filter(accessTo = loginID, is_trash = 0, is_allowed = 1)
	userList = []
	userList.append({
		'id': loginID,
		'name': calObj.user.first_name + " " + calObj.user.last_name
	})
	for user in calPermObj:
		temp = {}
		temp['id'] = user.accessOf.id
		temp['name'] = user.accessOf.first_name + " " + user.accessOf.last_name
		userList.append(temp)
		
	print("[calendar]", userList)
	
	# Appointment Booking Data
	appointment_list = []       
	appointment_booking_obj = appointment_booking.objects.filter(outlet_id=outlet_id, is_trash=0).order_by('-id')

	for bookings in appointment_booking_obj:
		try:
			cust_details = get_object_or_404(customer_details, id=bookings.customer_id)
			cust_name = cust_details.customer_name
			print("CustomerName", cust_name)
		except:
			cust_details = None
			cust_name = ""

		appointments = {
			'appointment_id': bookings.id,
			'appointment_date': bookings.appointment_date,
			'appointment_time': bookings.appointment_time,  
			'booking_note': bookings.booking_note, 
			'cust_id' : bookings.customer_id,
			'cust_name' : cust_name,
			'status' : bookings.status
		}
		appointment_list.append(appointments)
	appointment_data = dumps(appointment_list)
	print("AppointmentDumps--", appointment_data)

	# Invoice Data
	total_due=[]

	orders= inovice_details.objects.filter(outlet_id=outlet_id).order_by('-id')
	for inv_d in orders:
		try:
			cust_details = get_object_or_404(customer_details, id=inv_d.customer_id)
			cust_name = cust_details.customer_name
		except:
			cust_details = None
			cust_name = ""
			
		if inv_d.due_date :
			invoicedict = { 
				'id': inv_d.id,
				'due_date': str((inv_d.due_date).date()),
				'cust_name':inv_d.customer_name,
				'invoice_number':inv_d.inovice_number
			}
			total_due.append(invoicedict)
	todays_data = dumps(total_due)
	print(todays_data,"---todays_data")

	# Calls -> Customers/Lead
	customer_calls = []

	# calls = Addcall_details.objects.filter(outlet_id=outlet_id).order_by('-id')
	# for cust_calls in calls:
	#     try:
	#         cust_details = get_object_or_404(customer_details, id=cust_calls.customer,is_trash=0)
	#         cust_name = cust_details.customer_name
	#     except:
	#         cust_details = None
	#         cust_name = ""

	#     try:
	#         lead_details_obj = get_object_or_404(lead_details,id=cust_calls.lead_id.id,is_trash=0)
	#         lead_name = lead_details_obj.customer_name
	#         lead_id = lead_details_obj.id
	#     except:
	#         lead_details_obj = None
	#         lead_name = ""
	#         lead_id = ""
   
	#     customer_call = {
	#         'call_id': cust_calls.id,
	#         'customer_id': cust_calls.customer,
	#         'lead_id': lead_id,
	#         'schedule_call_date': cust_calls.schedule_Next_Call_date,
	#         'schedule_call_time': cust_calls.schedule_Next_Call_time,
	#         'is_customer': cust_calls.is_customer,
	#         'cust_name' : cust_name,
	#         'lead_name': lead_name
	#     }
	#     customer_calls.append(customer_call)
	# call_data = dumps(customer_calls, default=str)
	# print("\n Customer Calls--", call_data)
	
	return render(request, template_name, locals())

@login_required
@csrf_exempt
def calendarSettings(request, template_name='merchant_site/customers/calendar_settings.html'):
	# loginId = 
	try:
		loginID = request.session["multi_user_id"]
	except:
		loginID = request.session["root_user_id"]
		
	try:
		calObj = userCalendar.objects.get(user_id = loginID)
	except:
		calObj = None
		exists = "No"
	else:
		print("[Calendar]", calObj.availFrom, calObj.availTo, type(calObj.availTo))
		print("[Calendar]", calObj.user.first_name)
		exists = "Yes"
		availFrom = calObj.availFrom.strftime("%H:%M")
		availTo = calObj.availTo.strftime("%H:%M")
		
	eventObj = userEvents.objects.filter(user_id =loginID,is_trash=0)
	calPermObj = calPerm.objects.filter(accessOf = loginID,is_trash = 0)
	
	tz='local'
	if calObj:
		tz = calObj.timezone
		
		if tz == "local":
			tz = "Asia/Kolkata"
		elif tz == "IST":
			tz = "Asia/Kolkata"
		elif tz == 'EST':
			tz = "America/Los_Angeles"
		tz = timezone(tz)
	multiUserObj = MultiUserDetails.objects.filter(outlet_id = request.session.get("outlet_id"),active=1,is_trash=0)
	events = []
	for event in eventObj:
		temp = {}
		temp['id'] = event.id
		temp['title'] = event.title
		temp['type'] = event.type
		temp['recurring'] = event.recurring
		temp['period'] = event.period
		if event.period == "weekly":
			temp['day'] = event.day
			temp['startDT'] = event.startDT.astimezone(tz).strftime("%I:%M %p")
			temp['endDT'] = event.endDT.astimezone(tz).strftime("%I:%M %p")
		elif event.period == "monthly":
			temp['day'] = event.day
			temp['startDT'] = event.startDT.astimezone(tz).strftime("%I:%M %p")
			temp['endDT'] = event.endDT.astimezone(tz).strftime("%I:%M %p")
		elif event.period == "yearly":
			temp['day'] = event.day
			temp['month'] = event.month
			temp['startDT'] = event.startDT.astimezone(tz).strftime("%I:%M %p")
			temp['endDT'] = event.endDT.astimezone(tz).strftime("%I:%M %p")
		else:
			temp['startDT'] = event.startDT
			temp['endDT'] = event.endDT
		temp['eventType'] = event.eventType if event.eventType != "-" else None
		events.append(temp)
	
	if request.method == "POST":
		postdata = request.POST.copy()
		print("[Setting]", postdata)
		
		if postdata.get('edit_btn') == "edit":
			evId = postdata.get('eventId')
			
			eventObj = userEvents.objects.get(id = evId)
			kalObj = eventObj.kal
			
			eventObj.title = postdata.get('eventTitle')
			kalObj.title = postdata.get('eventTitle')
			
			eventObj.type = postdata.get('eventType')
			eventObj.recurring = True if postdata.get('eventRecurr') == "Yes" else False
			
			if postdata.get('eventType') == "GRP":
				eventObj.eventType = postdata.get('eventTypeGrp')
			if postdata.get('eventRecurr') == "Yes":
				evPeriod = postdata.get('eventPeriod')
				eventObj.period = evPeriod
				kalObj.recurring = evPeriod
				if evPeriod == "weekly":
					
					kalObj.daysOfWeek = [postdata.get('weeklyDay')]
					kalObj.startTime = genDateTimeObj(postdata.get('weeklyStartTime')) 
					kalObj.endTime = genDateTimeObj(postdata.get('weeklyEndTime'))
					
					days = ["Monday", 'Tuesday', 'Wednesday', 'Thrusday', 'Friday', 'Saturday', 'Sunday']
					eventObj.day = days[int(postdata.get('weeklyDay'))-1]
					eventObj.recurring = True
					eventObj.startDT = genDateTimeObj(postdata.get('weeklyStartTime'))
					eventObj.endDT = genDateTimeObj(postdata.get('weeklyEndTime'))
					
				elif evPeriod == "monthly":
					
					kalObj.daysOfWeek = [postdata.get('monthlyDay')] 
					kalObj.startTime = genDateTimeObj(postdata.get('monthlyStartTime')) 
					kalObj.endTime = genDateTimeObj(postdata.get('monthlyEndTime'))
					
					eventObj.day = postdata.get('monthlyDay')
					eventObj.recurring = True
					eventObj.startDT = genDateTimeObj(postdata.get('monthlyStartTime'))
					eventObj.endDT = genDateTimeObj(postdata.get('monthlyEndTime'))
					
				elif evPeriod == "yearly":
					
					kalObj.daysOfWeek = [postdata.get('yearlyMonth'), postdata.get('yearlyDay')] 
					kalObj.startTime = genDateTimeObj(postdata.get('yearlyStartTime')) 
					kalObj.endTime = genDateTimeObj(postdata.get('yearlyEndTime'))
					
					months = ["January", 'February', 'March', 'April', 'May', 'June', 'July', "August", "September", "October", "November", "December"]
					eventObj.month = months[int(postdata.get('yearlyMonth'))-1]
					eventObj.day = postdata.get('yearlyDay')
					eventObj.recurring = True
					eventObj.startDT = genDateTimeObj(postdata.get('yearlyStartTime'))
					eventObj.endDT = genDateTimeObj(postdata.get('yearlyEndTime'))
					
			elif postdata.get('eventRecurr') == "No":
				
				kalObj.daysOfWeek = None
				kalObj.recurring = None
				kalObj.startTime = genDateTimeObj(postdata.get('recurrStartTime'), postdata.get('recurrStartDate')) 
				kalObj.endTime = genDateTimeObj(postdata.get('recurrEndTime'), postdata.get('recurrEndDate')) 
				
				eventObj.month = "-"
				eventObj.day = "-"
				eventObj.period = "-"
				eventObj.recurring = False
				eventObj.startDT = genDateTimeObj(postdata.get('recurrStartTime'), postdata.get('recurrStartDate'))
				eventObj.endDT = genDateTimeObj(postdata.get('recurrEndTime'), postdata.get('recurrEndDate'))

			eventObj.save()
			kalObj.save()
			
			messages.add_message(request, messages.SUCCESS, 'Event edited successfully!',fail_silently=True)
		
		elif postdata.get('setting_btn') == "set":
			if loginID:
				try:
					calObj = userCalendar.objects.get(user_id = loginID)
					print("[Calendar] In try")
				except:
					calObj = userCalendar()
					calObj.user_id = loginID
					print("[Calendar] In except")
					
				calObj.timezone = postdata.get("timezone")
				calObj.slotDur = postdata.get("slotDur")
				calObj.availFrom = postdata.get("from")
				calObj.availTo = postdata.get("to")
				calObj.save()
				print("[Calendar] Data Saved!")
				messages.add_message(request, messages.SUCCESS, 'Details saved!',fail_silently=True)
			else:
				messages.add_message(request, messages.ERROR, 'Relogin and try again!',fail_silently=True)
		
		elif postdata.get('add_btn') == "add":
			if loginID:
				users = request.POST.getlist("accUser")
				print("[calPerm]", request.POST.copy())
				for u in users:
					calPermSaveObj = calPerm()
					calPermSaveObj.accessOf_id = loginID
					calPermSaveObj.is_alloswed = True
					calPermSaveObj.accessTo_id = u
					calPermSaveObj.save()
				messages.add_message(request, messages.SUCCESS, 'User(s) added successfully!',fail_silently=True)
			else:
				messages.add_message(request, messages.ERROR, 'Some error occurred!',fail_silently=True)
			
		# url = reverse('customers:calendar')
		# return HttpResponseRedirect(url)
			
	return render(request,template_name,locals())

def updatePermUsers(request):
	if request.method == "POST":
		if request.POST.get("type") == "revoke":
			calPermObj = calPerm.objects.get(id = request.POST.get("id"))
			calPermObj.is_allowed = False
			calPermObj.save()
			msg = f"Permission revoked from {calPermObj.accessTo}"
		elif request.POST.get("type") == "give":
			calPermObj = calPerm.objects.get(id = request.POST.get("id"))
			calPermObj.is_allowed = True
			calPermObj.save()
			msg = f"Permission given to {calPermObj.accessTo}"
		elif request.POST.get("type") == "delete":
			calPermObj = calPerm.objects.get(id = request.POST.get("id"))
			calPermObj.is_trash = True
			calPermObj.save()
			msg = f"Permission of {calPermObj.accessTo} deleted"
		
		data = {
			'msg' : msg
		}
		
		return JsonResponse(data)

def getUserEvents(request):
	print("[getEvents] In Func now")
	if request.method == "POST":
		if request.session.get("multi_user_id"):
			user = "MultiUser"
			loginUserId = request.session.get("multi_user_id")
		else:
			user = "SAdmin"
			loginUserId = request.user.id
		
		print("[getEvents]", loginUserId)
		
		postdata = request.POST.copy()
		idd = postdata.get("id")
		eventType = postdata.get("type")
		
		print("[getEvents]", eventType)
		try:
			user_cal_obj = userCalendar.objects.get(user_id=loginUserId)
		except:
			user_cal_obj = None
		print("[user_cal_obj]",user_cal_obj)
		print("[user_cal_obj] TZ",user_cal_obj.timezone)
		
		tz='local'
		data = {}
		if user_cal_obj:
			tz = user_cal_obj.timezone
			
			tz = timezone(tz)
		print("USER TIMEZONE",tz)
		if eventType == "all":
			
			# calObj = userCalendar.objects.get(user_id = loginUserId)
			kalObj = Kalnirnay.objects.filter(user_id = idd, is_trash = False)
			print("[kalObj]",kalObj)
			events = []
			interCount = 0
			otherCount = 0
			leadCount  = 0
			employeeCount  = 0  			
			for kal in kalObj:
				temp = {}
				if kal.eventType == "Interview":
					print("[getEvents] In interview if")
					# print(f"[getEvents] [{kal.id}]-[{kal.interview.candidate.id}] {kal.timeZone}, {kal.interview.timeZone}")
					temp['id'] = f"inter{interCount}"
					logger.warning(str(kal.id) + 'kal id inside for')
					try:
						interview_oooo=kal.interview
					except:
						continue
					if kal.interview.stage:
						temp['title'] = f"{kal.interview.stage} with {kal.interview.candidate.fname} ({kal.interview.status})"
					else:
						temp['title'] = "Some event with " + kal.interview.candidate.fname
					temp['color'] = kal.color
					temp['url'] = f'https://hr.xircls.com/merchant/employees/get-view-candidates/{str(kal.interview.candidate.id)}/'
					interCount += 1
					temp['start'] = kal.startTime.astimezone(tz)
					temp['end'] = kal.endTime.astimezone(tz)
				
				elif kal.eventType == "Lead":
					print("inside leads")
					if kal.recurring == "weekly":
						# temp['id'] = f"recurr{interCount}"
						temp['title'] = kal.title
						temp['color'] = kal.color
						temp['allDay'] = False
						try:
							print("inside urlsss with lead id")
							temp['url'] = f'https://hr.xircls.com/merchant/customer/view-lead/{str(kal.leads.id)}/'
						except:
							print("outside urlsss with lead id")
							temp['url'] = None
						print("[TIME]",kal.startTime.time())
						temp['daysOfWeek'] = [kal.daysOfWeek]
						temp['startTime'] = kal.startTime.astimezone(tz)
						temp['endTime'] = kal.endTime.astimezone(tz)

					elif kal.recurring == "monthly":
						# temp['id'] = f"recurr{interCount}"
						temp['title'] = kal.title
						temp['color'] = kal.color
						temp['allDay'] = False
						try:
							temp['url'] = f'https://hr.xircls.com/merchant/customer/view-lead/{str(kal.leads.id)}/'
						except:
							temp['url'] = None
						date=kal.startTime.astimezone(tz)
						print("NEWDATE",date)
						new_date=date.strftime("%Y-%m-%d %H:%M:%S")
						print("NEWDATESS",new_date,type(new_date))
						temp['startTime'] = kal.startTime.astimezone(tz)
						temp['endTime'] = kal.endTime.astimezone(tz)

						temp['rrule'] = {
							
							'interval': 1,
							'freq': "monthly",
							'dtstart':new_date,
							'until': "2040-12-31"
							
							
						}
						print(temp['rrule'],"hojaaaaaaaaaaa")

					
					elif kal.recurring == "yearly":
						print(kal.startTime.strftime("%m"),"month number")
						
						# temp['id'] = f"recurr{interCount}"
						temp['title'] = kal.title
						temp['color'] = kal.color
						temp['allDay'] = False
						try:
							temp['url'] = f'https://hr.xircls.com/merchant/customer/view-lead/{str(kal.leads.id)}/'
						except:
							temp['url'] = None
						date=kal.startTime.astimezone(tz)
						print("NEWDATE",date)
						new_date=date.strftime("%Y-%m-%d %H:%M:%S")
						print("NEWDATESS",new_date,type(new_date))
						
						temp['rrule'] = {
							'freq': "yearly",
							# 'dtstart': kal.startTime.astimezone(tz).time(),
							'dtstart': new_date,
							'bymonth': int(kal.startTime.strftime("%m"))
						}
						print("[TIME]",kal.daysOfWeek, type(kal.daysOfWeek))
						print("[TIME]",ast.literal_eval(kal.daysOfWeek))

		





					else:
						temp['id'] = f"leads{leadCount}"
						temp['title'] = kal.title
						temp['color'] = kal.color
						# temp['allDay'] = False
						# temp['daysOfWeek'] = ast.literal_eval(kal.daysOfWeek)
						try:
							temp['url'] = f'https://hr.xircls.com/merchant/customer/view-lead/{str(kal.leads.id)}/'
						except:
							temp['url'] = None
					
						temp['start'] = kal.startTime.astimezone(tz)
						temp['end'] =  kal.endTime.astimezone(tz)
						
						print("colorrrrrrrrrr",temp['id'],temp['color'],temp['start'],temp['end'])
				elif kal.eventType == "Employee":

	
						if kal.recurring == "weekly":
							# temp['id'] = f"recurr{interCount}"
							temp['title'] = kal.title
							temp['color'] = kal.color
							temp['allDay'] = False
							try:
								print("inside urlsss with employee id")
								temp['url'] = f'https://hr.xircls.com/merchant/employees/get-view-employee/{str(kal.employees.id)}/'
							except:
								print("outside urlsss with employee id")
								temp['url'] = None
							print("[TIME]",kal.startTime.time())
							temp['daysOfWeek'] = [kal.daysOfWeek]
							temp['startTime'] = kal.startTime.time()
							temp['endTime'] = kal.endTime.time()

						elif kal.recurring == "monthly":
							# temp['id'] = f"recurr{interCount}"
							temp['title'] = kal.title
							temp['color'] = kal.color
							temp['allDay'] = False
							try:
								temp['url'] =f'https://hr.xircls.com/merchant/employees/get-view-employee/{str(kal.employees.id)}/'
							except:
								temp['url'] = None
							date=kal.startTime
							print("NEWDATE",date)
							new_date=date.strftime("%Y-%m-%d %H:%M:%S")
							print("NEWDATESS",new_date,type(new_date))
							temp['startTime'] = kal.startTime
							temp['endTime'] = kal.endTime

							temp['rrule'] = {
								
								'interval': 1,
								'freq': "monthly",
								'dtstart':new_date,
								'until': "2040-12-31"
								
								
							}
							print(temp['rrule'],"hojaaaaaaaaaaa")

						
						elif kal.recurring == "yearly":
							print(kal.startTime.strftime("%m"),"month number")
							
							# temp['id'] = f"recurr{interCount}"
							temp['title'] = kal.title
							temp['color'] = kal.color
							temp['allDay'] = False
							try:
								temp['url'] = f'https://hr.xircls.com/merchant/employees/get-view-employee/{str(kal.employees.id)}/'
							except:
								temp['url'] = None
							date=kal.startTime.astimezone(tz)
							print("NEWDATE",date)
							new_date=date.strftime("%Y-%m-%d %H:%M:%S")
							print("NEWDATESS",new_date,type(new_date))
							
							temp['rrule'] = {
								'freq': "yearly",
								# 'dtstart': kal.startTime.astimezone(tz).time(),
								'dtstart': new_date,
								'bymonth': int(kal.startTime.strftime("%m"))
							}
							print("[TIME]",kal.daysOfWeek, type(kal.daysOfWeek))
							print("[TIME]",ast.literal_eval(kal.daysOfWeek))

			





						else:
							temp['id'] = f"employees{employeeCount}"
							temp['title'] = kal.title
							temp['color'] = kal.color
							# temp['allDay'] = False
							# temp['daysOfWeek'] = ast.literal_eval(kal.daysOfWeek)
							try:
								temp['url'] = f'https://hr.xircls.com/merchant/employees/get-view-employee/{str(kal.employees.id)}/'
							except:
								temp['url'] = None
						
							temp['start'] = kal.startTime
							temp['end'] =  kal.endTime
							
							print("colorrrrrrrrrr",temp['id'],temp['color'],temp['start'],temp['end'])    
				elif kal.eventType == "INDV":
					print("[getEvents] In INDV if")
					if kal.recurring == "weekly":
						print("[getEvents] In INDV weekly if")
						temp['id'] = f"recurr{interCount}"
						temp['title'] = kal.title
						temp['color'] = kal.color
						temp['allDay'] = False
						temp['daysOfWeek'] = ast.literal_eval(kal.daysOfWeek)
						print("[TIME]",kal.startTime.time())
						temp['startTime'] = kal.startTime.astimezone(tz).time()
						temp['endTime'] = kal.endTime.astimezone(tz).time()
					
					elif kal.recurring == "monthly":
						print("[getEvents] In INDV monthly if")
						temp['id'] = f"recurr{interCount}"
						temp['title'] = kal.title
						temp['color'] = kal.color
						temp['allDay'] = False
						# temp['startTime'] = datetime.combine(datetime(2000, 1, int(ast.literal_eval(kal.daysOfWeek)[0])).date(), kal.startTime.time())
						# temp['endTime'] = datetime.combine(datetime(2000, 1, int(ast.literal_eval(kal.daysOfWeek)[0])).date(), kal.endTime.time())
						
						# temp['startTime'] = kal.startTime.time()
						# temp['endTime'] = kal.endTime.time()
						
						# temp['startRecur'] = datetime(2022, 1, 1)
						# temp['repeat'] = 1
						# temp['daysOfMonth'] = ast.literal_eval(kal.daysOfWeek)
						# temp['daysOfWeek'] = ast.literal_eval(kal.daysOfWeek)
						
						temp['rrule'] = {
							# 'interval': 4,
							'freq': "monthly",
							# 'dtstart': datetime(2000, 1, int(ast.literal_eval(kal.daysOfWeek)[0])).date(),
							'dtstart': datetime.combine(datetime(2000, 1, int(ast.literal_eval(kal.daysOfWeek)[0])).date(), kal.startTime.time()),
							# 'until': datetime.combine(datetime(2000, 1, int(ast.literal_eval(kal.daysOfWeek)[0])).date(), kal.endTime.time()),
							# 'bymonthday': int(ast.literal_eval(kal.daysOfWeek)[0])
						}

						print("[TIME]",kal.daysOfWeek, type(kal.daysOfWeek))
						print("[TIME]",ast.literal_eval(kal.daysOfWeek))
					
					elif kal.recurring == "yearly":
						print("[getEvents] In INDV yearly if")
						date_month = ast.literal_eval(kal.daysOfWeek)
						temp['id'] = f"recurr{interCount}"
						temp['title'] = kal.title
						temp['color'] = kal.color
						temp['allDay'] = False
						
						temp['rrule'] = {
							'freq': "yearly",
							'dtstart': datetime.combine(datetime(2000, 1, int(date_month[1])).date(), kal.startTime.time()),
							'bymonth': int(date_month[0])
						}
						print("[TIME]",kal.daysOfWeek, type(kal.daysOfWeek))
						print("[TIME]",ast.literal_eval(kal.daysOfWeek))

					else:
						print("[getEvents] In INDV else")
						temp['id'] = f"indv{interCount}"
						temp['title'] = kal.title
						temp['color'] = kal.color
						temp['start'] = kal.startTime
						temp['end'] = kal.endTime
				
				elif kal.eventType == "GRP":
					print("[getEvents] In GRP if")
					if kal.recurring == "weekly":
						print("[getEvents] In GRP weekly if")
						try:
							evObj = userEvents.objects.get(kal = kal)
						except:
							evObj = None
						else:
							if user == "SAdmin" or loginUserId == evObj.user_id:  
								temp['url'] = f"https://hr.xircls.com/merchant/customer/grpEvent/{evObj.id}/"
						temp['id'] = kal.calId
						temp['title'] = kal.title
						temp['color'] = kal.color
						temp['allDay'] = False
						temp['daysOfWeek'] = ast.literal_eval(kal.daysOfWeek)
						print("[TIME--]",kal.startTime.astimezone(tz))
						
						temp['startTime'] = kal.startTime.astimezone(tz).time()
						temp['endTime'] = kal.endTime.astimezone(tz).time()
					
					elif kal.recurring == "monthly":
						print("[getEvents] In GRP monthly if")
						try:
							evObj = userEvents.objects.get(kal = kal)
						except:
							evObj = None
						else:
							if user == "SAdmin" or loginUserId == evObj.user_id:  
								temp['url'] = f"https://hr.xircls.com/merchant/customer/grpEvent/{evObj.id}/"
						temp['id'] = kal.calId
						temp['title'] = kal.title
						temp['color'] = kal.color
						temp['allDay'] = False
						temp['rrule'] = {
							'freq': "monthly",
							'dtstart': datetime.combine(datetime(2000, 1, int(ast.literal_eval(kal.daysOfWeek)[0])).date(), kal.startTime.time()).astimezone(tz),
						}
					
					elif kal.recurring == "yearly":
						print("[getEvents] In GRP yearly if")
						try:
							evObj = userEvents.objects.get(kal = kal)
						except:
							evObj = None
						else:
							if user == "SAdmin" or loginUserId == evObj.user_id:  
								temp['url'] = f"https://hr.xircls.com/merchant/customer/grpEvent/{evObj.id}/"
						date_month = ast.literal_eval(kal.daysOfWeek)
						temp['id'] = kal.calId
						temp['title'] = kal.title
						temp['color'] = kal.color
						temp['allDay'] = False
						temp['rrule'] = {
							'freq': "yearly",
							'dtstart': datetime.combine(datetime(2000, 1, int(date_month[1])).date(), kal.startTime.time()).astimezone(tz),
							'bymonth': int(date_month[0])
						}

					else:
						print("[getEvents] In GRP else")
						try:
							evObj = userEvents.objects.get(kal = kal)
						except:
							evObj = None
						else:
							if user == "SAdmin" or loginUserId == evObj.user_id:  
								temp['url'] = f"https://hr.xircls.com/merchant/customer/grpEvent/{evObj.id}/"
						temp['id'] = kal.calId
						temp['title'] = kal.title
						temp['color'] = kal.color
						temp['start'] = kal.startTime.astimezone(tz)
						temp['end'] = kal.endTime.astimezone(tz)
				
				else:
					print("[getEvents] In else")
					temp['id'] = f"other{otherCount}"
					temp['title'] = "Test Event"
					temp['color'] = "#ffc107"
					otherCount += 1
						
					temp['start'] = kal.startTime.astimezone(tz)
					temp['end'] = kal.endTime.astimezone(tz)
				
				temp['textColor'] = "black"
				events.append(temp)
			
			data = {"events" : events, "interCount": interCount,"otherCount": otherCount,"LeadCount" :leadCount,"EmployeeCount":employeeCount}
		
		elif eventType == "Interview":
			
			kalObj = Kalnirnay.objects.filter(user_id = idd, is_trash = False, eventType = eventType)
		
			events = []
			interCount = 0
			otherCount = 0
			for kal in kalObj:
				temp = {}
				temp['id'] = f"inter{interCount}"
				if kal.interview.stage:
					temp['title'] = kal.interview.stage + " with " + kal.interview.candidate.fname
				else:
					temp['title'] = "Some event with " + kal.interview.candidate.fname
				temp['color'] = kal.color
				temp['url'] = f'https://hr.xircls.com/merchant/employees/get-view-candidates/{str(kal.interview.candidate.id)}/'
				temp['start'] = kal.startTime.astimezone(tz)
				temp['end'] = kal.endTime.astimezone(tz)
				temp['textColor'] = "black"
				interCount += 1
				events.append(temp)
			
			data = {"events" : events, "interCount": interCount,"otherCount": otherCount,"LeadCount" :leadCount}
			
		elif eventType == "Other":
			
			kalObj = Kalnirnay.objects.filter(user_id = idd, is_trash = False, eventType = eventType)
			events = []
			interCount = 0
			otherCount = 0
			for kal in kalObj:
				temp = {}
				temp['id'] = f"other{otherCount}"
				temp['title'] = "Test Event"
				temp['color'] = "#ffc107"
				temp['start'] = kal.startTime.astimezone(tz)
				temp['end'] = kal.endTime.astimezone(tz)
				temp['textColor'] = "black"
				otherCount += 1
				events.append(temp)
			
			data = {"events" : events, "interCount": interCount,"otherCount": otherCount,"LeadCount" :leadCount}
		
		return JsonResponse(data)

def addEvent(request, template_name='merchant_site/customers/add_event.html'):
	
	multiUserObj = MultiUserDetails.objects.filter(outlet_id = request.session.get("outlet_id"),active=1,is_trash=0)
	if request.method == "POST":
		
		postdata = request.POST.copy()
		eventTitle = postdata.get("eventTitle")
		eventType = postdata.get("eventType")
		eventTypeGrp = postdata.get("eventTypeGrp", '-')
		eventRecurr = postdata.get("eventRecurr")
		eventPeriod = postdata.get("eventPeriod")
		eventInvite = postdata.getlist("eventInvite")
		recurrStartDate = postdata.get("recurrStartDate")
		recurrEndDate = postdata.get("recurrEndDate")
		recurrStartTime = postdata.get("recurrStartTime")
		recurrEndTime = postdata.get("recurrEndTime")
		weeklyDay = postdata.get("weeklyDay")
		weeklyStartTime = postdata.get("weeklyStartTime")
		weeklyEndTime = postdata.get("weeklyEndTime")
		monthlyDay = postdata.get("monthlyDay")
		monthlyStartTime = postdata.get("monthlyStartTime")
		monthlyEndTime = postdata.get("monthlyEndTime")
		yearlyMonth = postdata.get("yearlyMonth")
		yearlyDay = postdata.get("yearlyDay")
		yearlyStartTime = postdata.get("yearlyStartTime")
		yearlyEndTime = postdata.get("yearlyEndTime")
		
		print("[addEvent]", postdata)
		print("[addEvent]", eventInvite, type(eventInvite))
		eventInvite.insert(0,request.session.get("multi_user_id") if request.session.get('multi_user_id') else request.user.id)
		
		eventObj = userEvents()
		for uId in eventInvite:
			kalObj = Kalnirnay()
			grpObj = groupEvents()
			
			kalObj.user_id = uId
			kalObj.eventType = eventType
			kalObj.title = eventTitle
			kalObj.calId = f"{eventType}_{eventTypeGrp}" if eventType == "GRP" else f"{eventType}"
				
			if eventRecurr == "Yes":
				if eventPeriod == "weekly":
					startDateTime = genDateTimeObj(weeklyStartTime)
					endDateTime = genDateTimeObj(weeklyEndTime)
					
					kalObj.daysOfWeek = [weeklyDay]
					kalObj.title = eventTitle
					kalObj.startTime = startDateTime 
					kalObj.endTime = endDateTime 
					kalObj.color = "#ffee00"
					kalObj.recurring = eventPeriod
					
					kalObj.save()
					
					days = ["Monday", 'Tuesday', 'Wednesday', 'Thrusday', 'Friday', 'Saturday', 'Sunday']
					
					if eventInvite.index(uId) == 0:
						eventObj.recurring = True
						eventObj.period = eventPeriod
						eventObj.day = days[int(weeklyDay)-1]
					
				elif eventPeriod == "monthly":
					startDateTime = genDateTimeObj(monthlyStartTime)
					endDateTime = genDateTimeObj(monthlyEndTime)
					
					kalObj.daysOfWeek = [monthlyDay] 
					kalObj.title = eventTitle
					kalObj.startTime = startDateTime 
					kalObj.endTime = endDateTime 
					kalObj.color = "#6610f2"
					kalObj.recurring = eventPeriod
					
					kalObj.save()
					
					if eventInvite.index(uId) == 0:
						eventObj.recurring = True
						eventObj.period = eventPeriod
						eventObj.day = monthlyDay
					
				elif eventPeriod == "yearly":
					startDateTime = genDateTimeObj(yearlyStartTime)
					endDateTime = genDateTimeObj(yearlyEndTime)
					
					kalObj.daysOfWeek = [yearlyMonth, yearlyDay] 
					kalObj.title = eventTitle
					kalObj.startTime = startDateTime 
					kalObj.endTime = endDateTime
					kalObj.color = "#0066ff" #ffee00, 17a2b8
					kalObj.recurring = eventPeriod
					kalObj.save()
					
					months = ["January", 'February', 'March', 'April', 'May', 'June', 'July', "August", "September", "October", "November", "December"]
					
					if eventInvite.index(uId) == 0:
						eventObj.recurring = True
						eventObj.period = eventPeriod
						eventObj.month = months[int(yearlyMonth)-1]
						eventObj.day = yearlyDay
					
			elif eventRecurr == "No":
				startDateTime = genDateTimeObj(recurrStartTime, recurrStartDate)
				endDateTime = genDateTimeObj(recurrEndTime, recurrEndDate)
				
				kalObj.startTime = startDateTime 
				kalObj.endTime = endDateTime 
				kalObj.color = "#1269ff"
				
				eventObj.recurring = False
			
			kalObj.save()
			
			if eventInvite.index(uId) == 0:
				eventObj.kal = kalObj
				eventObj.user_id = uId
				eventObj.title = eventTitle
				eventObj.type = eventType
				eventObj.eventType = eventTypeGrp
				eventObj.startDT = startDateTime
				eventObj.endDT = endDateTime
				eventObj.save()
			
			grpObj.event = eventObj
			grpObj.user_id = uId
			grpObj.save()
		
		messages.add_message(request, messages.SUCCESS, 'Event added successfully!', fail_silently=True)
		return redirect("customers:calendarSettings")
	return render(request, template_name, locals())

def grpEvent(request, evId = 0, template_name='merchant_site/customers/grpEvents.html'):
	
	if evId != 0:
		evObj = userEvents.objects.get(id = evId)
		eventObj = groupEvents.objects.filter(event = evObj)
		if evObj.eventType == "meeting":
			print("[grpEvent]", eventObj)
			eventObjTemp = []
			for event in eventObj:
				temp = {}
				try:
					multiObj = MultiUserDetails.objects.get(user_id = event.user.id)
				except:
					temp['isSADmin'] = True
					temp['user'] = event.user
					temp['event'] = event.event
				else:
					temp['user'] = multiObj
					temp['event'] = event.event
					print("[grpEvent] temp:", temp)
					eventObjTemp.append(temp)
					print("[grpEvent] for:", eventObjTemp)
			eventObj = []
			eventObj = eventObjTemp
			
			print("[grpEvent] after:", eventObj)			
	else:
		eventObj = None
	
	if request.method == "POST":
		
		postdata = request.POST.copy()
		eventTitle = postdata.get("eventTitle")
		eventType = postdata.get("eventType")
		eventTypeGrp = postdata.get("eventTypeGrp")
		eventRecurr = postdata.get("eventRecurr")
		eventPeriod = postdata.get("eventPeriod")
		recurrStartDate = postdata.get("recurrStartDate")
		recurrEndDate = postdata.get("recurrEndDate")
		recurrStartTime = postdata.get("recurrStartTime")
		recurrEndTime = postdata.get("recurrEndTime")
		weeklyDay = postdata.get("weeklyDay")
		weeklyStartTime = postdata.get("weeklyStartTime")
		weeklyEndTime = postdata.get("weeklyEndTime")
		monthlyDay = postdata.get("monthlyDay")
		monthlyStartTime = postdata.get("monthlyStartTime")
		monthlyEndTime = postdata.get("monthlyEndTime")
		yearlyMonth = postdata.get("yearlyMonth")
		yearlyDay = postdata.get("yearlyDay")
		yearlyStartTime = postdata.get("yearlyStartTime")
		yearlyEndTime = postdata.get("yearlyEndTime")
		
		kalObj = Kalnirnay()
		eventObj = userEvents()
		
		kalObj.user_id = request.user.id
		kalObj.eventType = eventType
		kalObj.title = eventTitle
		kalObj.calId = f"{eventType}_{eventTypeGrp}" if eventType == "GRP" else f"{eventType}"
			
		if eventRecurr == "Yes":
			if eventPeriod == "weekly":
				startDateTime = weeklyStartTime.split(":")
				year = 2000
				month = 1
				day = 1
				hour = int(startDateTime[0])
				minute = int(startDateTime[1])
				# sec = int(startDateTime[2])
				startDateTime = datetime(year, month, day, hour, minute)
				endDateTime = weeklyEndTime.split(":")
				year = 2000
				month = 1
				day = 1
				hour = int(endDateTime[0])
				minute = int(endDateTime[1])
				# sec = int(endDateTime[2])
				endDateTime = datetime(year, month, day, hour, minute)
				
				kalObj.daysOfWeek = [weeklyDay] 
				kalObj.title = eventTitle
				kalObj.startTime = startDateTime 
				kalObj.endTime = endDateTime 
				kalObj.color = "#ffee00"
				kalObj.recurring = eventPeriod
				
				kalObj.save()
				
				days = ["Monday", 'Tuesday', 'Wednesday', 'Thrusday', 'Friday', 'Saturday', 'Sunday']
				
				eventObj.kal = kalObj
				eventObj.user_id = request.user.id
				eventObj.title = eventTitle
				eventObj.type = eventType
				eventObj.eventType = eventTypeGrp
				eventObj.recurring = True
				eventObj.period = eventPeriod
				eventObj.day = days[int(weeklyDay)-1]
				eventObj.startDT = startDateTime
				eventObj.endDT = endDateTime
				eventObj.save()
				
			elif eventPeriod == "monthly":
				startDateTime = monthlyStartTime.split(":")
				year = 2000
				month = 1
				day = 1
				hour = int(startDateTime[0])
				minute = int(startDateTime[1])
				# sec = int(startDateTime[2])
				startDateTime = datetime(year, month, day, hour, minute)
				
				endDateTime = monthlyEndTime.split(":")
				year = 2000
				month = 1
				day = 1
				hour = int(endDateTime[0])
				minute = int(endDateTime[1])
				# sec = int(endDateTime[2])
				endDateTime = datetime(year, month, day, hour, minute)
				
				kalObj.daysOfWeek = [monthlyDay] 
				kalObj.title = eventTitle
				kalObj.startTime = startDateTime 
				kalObj.endTime = endDateTime 
				kalObj.color = "#6610f2"
				kalObj.recurring = eventPeriod
				
				kalObj.save()
				
				eventObj = userEvents()
				eventObj.kal = kalObj
				eventObj.user_id = request.user.id
				eventObj.title = eventTitle
				eventObj.type = eventType
				eventObj.eventType = eventTypeGrp
				eventObj.recurring = True
				eventObj.period = eventPeriod
				eventObj.day = monthlyDay
				eventObj.startDT = startDateTime
				eventObj.endDT = endDateTime
				eventObj.save()
				
			elif eventPeriod == "yearly":
				startDateTime = yearlyStartTime.split(":")
				year = 2000
				month = 1
				day = 1
				hour = int(startDateTime[0])
				minute = int(startDateTime[1])
				# sec = int(startDateTime[2])
				startDateTime = datetime(year, month, day, hour, minute)
				
				endDateTime = yearlyEndTime.split(":")
				year = 2000
				month = 1
				day = 1
				hour = int(endDateTime[0])
				minute = int(endDateTime[1])
				# sec = int(endDateTime[2])
				endDateTime = datetime(year, month, day, hour, minute)
				
				kalObj.daysOfWeek = [yearlyMonth, yearlyDay] 
				kalObj.title = eventTitle
				kalObj.startTime = startDateTime 
				kalObj.endTime = endDateTime
				kalObj.color = "#0066ff" #ffee00, 17a2b8
				kalObj.recurring = eventPeriod
				
				kalObj.save()
				
				months = ["January", 'February', 'March', 'April', 'May', 'June', 'July', "August", "September", "October", "November", "December"]
				
				eventObj = userEvents()
				eventObj.kal = kalObj
				eventObj.user_id = request.user.id
				eventObj.title = eventTitle
				eventObj.type = eventType
				eventObj.eventType = eventTypeGrp
				eventObj.recurring = True
				eventObj.period = eventPeriod
				eventObj.month = months[int(yearlyMonth)-1]
				eventObj.day = yearlyDay
				eventObj.startDT = startDateTime
				eventObj.endDT = endDateTime
				eventObj.save()
				
		elif eventRecurr == "No":
			startDate = recurrStartDate.split("-")
			startTime = recurrStartTime.split(":")
			year = int(startDate[0])
			month = int(startDate[1])
			day = int(startDate[2])
			hour = int(startTime[0])
			minute = int(startTime[1])
			startDateTime = datetime(year, month, day, hour, minute)
			endDate = recurrEndDate.split("-")
			endTime = recurrEndTime.split(":")
			year = int(endDate[0])
			month = int(endDate[1])
			day = int(endDate[2])
			hour = int(endTime[0])
			minute = int(endTime[1])
			endDateTime = datetime(year, month, day, hour, minute)
			
			kalObj.startTime = startDateTime 
			kalObj.endTime = endDateTime 
			kalObj.color = "#1269ff"
			
			kalObj.save()
			
			eventObj.kal = kalObj
			eventObj.user_id = request.user.id
			eventObj.title = eventTitle
			eventObj.type = eventType
			eventObj.eventType = eventTypeGrp
			eventObj.recurring = False
			eventObj.startDT = startDateTime
			eventObj.endDT = endDateTime
			eventObj.save()
		
		return redirect("customers:calendarSettings")
	return render(request, template_name, locals())

def getEventData(request):
	if request.method == "POST":
		evId = request.POST.get('id')
		evObj = userEvents.objects.get(id = evId)
		startDate = evObj.startDT.date()
		startTime = evObj.startDT.time()
		endDate = evObj.endDT.date()
		endTime = evObj.endDT.time()
		data = {
			'id' : evObj.id,
			'title' : evObj.title,
			'type' : evObj.type,
			'recurring' : evObj.recurring,
			'period' : evObj.period,
			'day' : evObj.day,
			'month' : evObj.month,
			'startDate' : startDate,
			'startTime' : startTime,
			'endDate' : endDate,
			'endTime' : endTime,
			'eventType' : evObj.eventType,
		}
		return JsonResponse(data)

def genDateTimeObj(strTime, strDate = ""):
	
	if strDate != "":
		startDate = strDate.split("-")
		year = int(startDate[0])
		month = int(startDate[1])
		day = int(startDate[2])
	else:
		year = 2000
		month = 1
		day = 1
	
	timeObj = strTime.split(":")
	
	hour = int(timeObj[0])
	minute = int(timeObj[1].split(" ")[0])
	dtObj = datetime(year, month, day, hour, minute)
	
	return dtObj

def add_company_details_via_other(request):
	active_page_name = "add_company_details_via_other"
	outletid = request.session.get('outlet_id')
	response = ''
	try:
		outletObj = get_object_or_404(outlet_details, id = outletid)
	except:
		outletObj = None    
		
	if request.session.get('multi_user_id'):
		userId = request.session.get('multi_user_id')
	else:
		userId = request.user.id
	country_obj = Country.objects.all()
	print("pp-------------------------")
	
	if request.method == 'POST':
		postdata = request.POST.copy()
		logger.warning(str(postdata)+"[COMPANY]")
		
		try:
			clientObj = clients_account.objects.get(company_email=postdata.get('company_email'),company_website=postdata.get('company_website'),outlet_id=outletid)
		except:
			clientObj = None

		if clientObj == None:
			company_name = postdata.get('company_name',None)
			industry = postdata.get('industry',None)
			company_gst = postdata.get('company_gst',None)
			company_phone = postdata.get('company_phone',None)
			company_email = postdata.get('company_email',None)
			company_website = postdata.get('company_website',None)
			categorys = postdata.getlist('categorys[]',None)
			sub_categorys = postdata.getlist('sub_categorys[]',None)
			platform_company = postdata.getlist('platform_company',None)
			other_platform_company = postdata.getlist('other_platform_company',None)
			
			press_btn = postdata.get('press_btn', None)
			# selected_outletid = outletid

			address = postdata.get('com_add',None)
			street = postdata.get('com_street',None)
			area_building = postdata.get('com_area',None)
			landmark = postdata.get('com_landmark',None)
			city = postdata.get('com_city',None)
			state = postdata.get('com_state',None)
			pincode = postdata.get('com_pincode',None)
			country = postdata.get('com_country',None)
			company_pancard = postdata.get('company_pancard_name',None)


			clients_account_obj = clients_account()
			clients_account_obj.company_name = company_name
			clients_account_obj.industry = industry
			clients_account_obj.company_gst = company_gst
			clients_account_obj.company_phone = company_phone
			clients_account_obj.company_email = company_email
			clients_account_obj.company_website = company_website
			clients_account_obj.outlet = outletObj
			clients_account_obj.created_by_id = userId
			
			clients_account_obj.area_building = area_building
			clients_account_obj.address_line1 = address
			clients_account_obj.landmark = landmark
			clients_account_obj.city = city
			clients_account_obj.state = state
			clients_account_obj.street = street
			clients_account_obj.pincode = pincode
			clients_account_obj.country = country

			if platform_company == "Other":
				clients_account_obj.campany_platform = other_platform_company
			else:
				clients_account_obj.campany_platform = platform_company
			# for cat in categorys:
				
			# 
				#    outlet_detail.outlet_categories.add(*categorys)
			clients_account_obj.company_pancard = company_pancard
			clients_account_obj.save()
			clients_account_obj.category.add(*categorys)
			clients_account_obj.sub_category.add(*sub_categorys)

			if postdata.get('markASParent') == 'no':
				try:
					parclientObj = clients_account.objects.get(company_email=postdata.get('par_company_email'),company_website=postdata.get('par_company_website'),outlet_id=selected_outletid)
				except:
					parclientObj = None

				if parclientObj == None:
					company_name = postdata.get('par_company_name',None)
					industry = postdata.get('par_industry',None)
					company_gst = postdata.get('par_company_gst',None)
					company_phone = postdata.get('par_company_phone',None)
					company_email = postdata.get('par_company_email',None)
					company_website = postdata.get('par_company_website',None)
					company_pancard = postdata.get('par_company_pancard_name',None)
					

					address = postdata.get('par_com_add1',None)
					street = postdata.get('par_com_add2',None)
					area_building = postdata.get('par_com_area',None)
					landmark = postdata.get('par_com_landmark',None)
					city = postdata.get('par_com_city',None)
					state = postdata.get('par_com_state',None)
					pincode = postdata.get('par_com_pincode',None)
					country = postdata.get('par_com_country',None)

					categorys = postdata.getlist('par_categorys[]',None)
					sub_categorys = postdata.getlist('par_sub_categorys[]',None)
					platform_sub_company = postdata.getlist('platform_sub_company',None)
					other_platform_sub_company = postdata.getlist('other_platform_sub_company',None)

					par_clients_account_obj = clients_account()
					par_clients_account_obj.company_name = company_name
					par_clients_account_obj.industry = industry
					par_clients_account_obj.company_gst = company_gst
					par_clients_account_obj.company_phone = company_phone
					par_clients_account_obj.company_email = company_email
					par_clients_account_obj.company_website = company_website
					par_clients_account_obj.outlet = outletObj
					par_clients_account_obj.created_by_id = userId
					par_clients_account_obj.is_parent = True
					par_clients_account_obj.area_building = area_building
					par_clients_account_obj.address_line1 = address
					par_clients_account_obj.landmark = landmark
					par_clients_account_obj.city = city
					par_clients_account_obj.state = state
					par_clients_account_obj.street = street
					par_clients_account_obj.pincode = pincode
					par_clients_account_obj.country = country
					par_clients_account_obj.company_pancard = company_pancard
					par_clients_account_obj.save()
					clients_account_obj.parent_id = par_clients_account_obj

					if platform_sub_company == "Other":
						par_clients_account_obj.campany_platform = other_platform_sub_company
					else:
						par_clients_account_obj.campany_platform = platform_sub_company

					clients_account_obj.save()
					par_clients_account_obj.category.add(*categorys)
					par_clients_account_obj.sub_category.add(*sub_categorys)
			else:
				clients_account_obj.is_parent = True
				clients_account_obj.save()

			if postdata.get("add_company_from_add") == "yes":
				if clients_account_obj.is_parent == True:
					data_new = {
					'comapny_id':clients_account_obj.id,
					'company_name':clients_account_obj.company_name,
					'industry':clients_account_obj.industry,
					'company_phone':clients_account_obj.company_phone,
					'company_email':clients_account_obj.company_email,
					'company_website':clients_account_obj.company_website,
					'company_gst':clients_account_obj.company_gst,
					'company_pancard_name':clients_account_obj.company_pancard,
					'address':clients_account_obj.address_line1,
					'street':clients_account_obj.street,
					'area_building': clients_account_obj.area_building,
					'landmark':clients_account_obj.landmark,
					'city':clients_account_obj.city,
					'state':clients_account_obj.state,
					'pincode':clients_account_obj.pincode,
					'country':clients_account_obj.country,
					'is_parent':clients_account_obj.is_parent
					}
				else:
					data_new = {
					'comapny_id':clients_account_obj.id,
					'company_name':clients_account_obj.company_name,
					'industry':clients_account_obj.industry,
					'company_phone':clients_account_obj.company_phone,
					'company_email':clients_account_obj.company_email,
					'company_website':clients_account_obj.company_website,
					'company_gst':clients_account_obj.company_gst,
					'company_pancard_name':clients_account_obj.company_pancard,
					'address':clients_account_obj.address_line1,
					'street':clients_account_obj.street,
					'area_building': clients_account_obj.area_building,
					'landmark':clients_account_obj.landmark,
					'city':clients_account_obj.city,
					'state':clients_account_obj.state,
					'pincode':clients_account_obj.pincode,
					'country':clients_account_obj.country,
					'is_parent':clients_account_obj.is_parent,
					'par_comapny_id':par_clients_account_obj.id,
					'par_company_name':par_clients_account_obj.company_name,
					'par_industry':par_clients_account_obj.industry,
					'par_company_phone':par_clients_account_obj.company_phone,
					'par_company_email':par_clients_account_obj.company_email,
					'par_company_website':par_clients_account_obj.company_website,
					'par_company_gst':par_clients_account_obj.company_gst,
					'par_company_pancard_name':par_clients_account_obj.company_pancard,
					'par_address':par_clients_account_obj.address_line1,
					'par_street':par_clients_account_obj.street,
					'par_area_building': par_clients_account_obj.area_building,
					'par_landmark':par_clients_account_obj.landmark,
					'par_city':par_clients_account_obj.city,
					'par_state':par_clients_account_obj.state,
					'par_pincode':par_clients_account_obj.pincode,
					'par_country':par_clients_account_obj.country,
					}

				print("oooo---------------------------")
				response = response_json(request, 'success', '200', data_new, 'Company added successfully .', '')
		else:
			response = response_json(request, 'error', '200', '', 'Company already exists .', '')
		
	return JsonResponse(response)
			
def deleteEvent(request):
	if request.method == "POST":
		evId = request.POST.get("id")
		try:
			evObj = userEvents.objects.get(id = evId)
			grpObj = groupEvents.objects.filter(event = evObj)
			if evObj.type == "GRP":
				if evObj.eventType == "interview":# Group events(Interview) delete.
					evObj.kal.is_trash = True
					evObj.kal.save()
					for grp in grpObj:
						if grp.interview.status == "Scheduled":
							grp.interview.status == "Cancelled"
							grp.interview.save()
						grp.is_trash = True
						grp.save()
					evObj.is_trash = True
					evObj.save()
				elif evObj.eventType == "meeting":# Group events(Meeting) delete.
					evObj.kal.is_trash = True
					evObj.kal.save()
					for grp in grpObj:
						grp.is_trash = True
						grp.save()
					evObj.is_trash = True
					evObj.save()
			elif evObj.type == "INDV": # Individual events delete.
				evObj.kal.is_trash = True
				evObj.kal.save()
				evObj.is_trash = True
				evObj.save()
		except Exception as e:
			return JsonResponse({"status":"fail", "error": str(e)})
		else:
			return JsonResponse({"status":"success"})	

def JMD_get_finance_customers_list(request, template_name='merchant_site/customers/JMD_get_finance_customer_list.html'):
	active_page_name = "finance_customer_page"
	pagename_string = request.GET.get('pagename')
	page_number = int(request.GET.get('page') if request.GET.get('page') else 1)
	
	if request.session.get('is_logged_in_superuser') == False:
		outlet_list = outlet_details.objects.filter(id__in=request.session.get('allowed_outlets_list'),company_id = request.session.get('company_id'),is_active=1,is_verified = 1)
	elif request.session.get('is_logged_in_superuser') == True:
		outlet_list = outlet_details.objects.filter(company_id = request.session.get('company_id'),is_active=1,is_verified = 1)
	
	cursor = connection.cursor()

	offersObj = getOutletOffers(request)

	outletid = None
	if request.session.get('outlet_id') and outletid == None:
		outletid = int(request.session.get('outlet_id'))    
	

	if outletid:
		try:
			outletObj = get_object_or_404(outlet_details, id = outletid)
		except:
			outletObj = None

		customers_list = customer_details.objects.filter(outlet_id=outletid).order_by('customer_name')
		FinanceObj = CustomerClass()

		if outletObj.is_jmd == True:
			try:
				for_user_id = request.session.get('user_obj')
			except:
				for_user_id = None
			finance_obj = FinanceObj.getJMDAllCustomers(outletObj.id,for_user_id)   
		elif outletObj.is_outlet_vehicle:
			finance_obj = FinanceObj.get_outlet_vehicle_customers(outletObj.id) 

	else:
		finance_obj = None

	if finance_obj:
		temp = []
		for i in finance_obj:
			temp.append(i)
		
		reportObj = None
		if len(temp) > 0:
			paginator = Paginator(temp, 25)  # Show 25 contacts per page
			page = request.GET.get('page')
			try:
				reportObj = paginator.page(page)
			except PageNotAnInteger:
				# If page is not an integer, deliver first page.
				reportObj = paginator.page(1)
			except EmptyPage:
				# If page is out of range (e.g. 9999), deliver last page of results.
				reportObj = paginator.page(paginator.num_pages)   

	if request.method == 'POST':
		postdata = request.POST.copy()

		press_btn = postdata.get("press_btn", None)
		customerid = postdata.get("customer_id", None)
		offerid = postdata.get("offer_id", None)
		delete=postdata.getlist("deletefield")
		

		deletefield=delete
		print(postdata)
		print('kaklsjdklasjdlk')
		print(deletefield)
		print('djjksahdsadhlk')
		if press_btn == "SEND_NOTIFICATION":
			broadcastObj = BroadcastClass()
			respObj = broadcastObj.sendNotificationEmail(request, outletid, customerid, offerid)
			if respObj['status'] == "success":
				messages.add_message(request, messages.SUCCESS, respObj['message'], fail_silently=True)
				return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
			else:
				messages.add_message(request, messages.ERROR, respObj['message'],fail_silently=True)
				return HttpResponseRedirect(request.META.get('HTTP_REFERER'))

		if press_btn == "SEND_SMS":
			broadcastObj = BroadcastClass()
			respObj = broadcastObj.sendNotificationSMS(request, outletid, customerid, offerid)
			if respObj['status'] == "success":
				messages.add_message(request, messages.SUCCESS, respObj['message'], fail_silently=True)
				return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
			else:
				messages.add_message(request, messages.ERROR, respObj['message'],fail_silently=True)
				return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
		elif press_btn == 'SEARCH':

			search_txt = postdata.get('customer_search', None)
			if search_txt:                                
				cursor.execute(''' SELECT cd.id as cust_id, cd.phone_no, cd.customer_name, cd.entry_point, cd.email, cd.outlet_id
							FROM `xl925_customer_details` as cd
							WHERE cd.outlet_id = {0} AND (cd.phone_no LIKE '%{1}%' OR cd.customer_name LIKE '%{1}%' OR cd.email LIKE '%{1}%') '''.format(
							outletid, search_txt))                
				finance_obj = dictfetchall(cursor)

	if not finance_obj:
		finance_obj = None                        

	if finance_obj:            
		paginator = Paginator(finance_obj, 100) # Show 100 contacts per page
		page = request.GET.get('page')
		try:
			finance_obj = paginator.page(page)
		except PageNotAnInteger:
			# If page is not an integer, deliver first page.
			finance_obj = paginator.page(1)
		except EmptyPage:
			# If page is out of range (e.g. 9999), deliver last page of results.
			finance_obj = paginator.page(paginator.num_pages)       
								
	return render(request,template_name,locals())

def footballclubs(request):
    result_list = list(customer_details.objects.all().values_list('customer_name', 'phone_no', 'email', 'area_building','id'), flat=True)
    print(result_list)
  
    return JsonResponse(result_list, safe=False)



def customer_details_API(request):
	if request.method =='GET':
		# cursor = connection.cursor()
		customer_list = list(customer_details.objects.filter(outlet = 984).values_list('customer_name', 'phone_no', 'email', 'area_building','id'))
		# cursor.execute('''SELECT * FROM xl925_customer_details  WHERE outlet_id = 984 ''')
		# customer_list = dictfetchall(cursor)
		# print(result_list)
		response = {
			'response': customer_list,
			'status':'200'
		}
	
		return JsonResponse(response, safe=False)
	else:
		return JsonResponse({'response':'Invalid Request','status':'500'})








'''OR Form-------------------------------------------------------------------------------------------------------'''
import random as r
import math as m

# function for otp generation
def otpgen(type):
	OTP=""
	if type == 'Mobile':
		for i in range(6):
			OTP+=str(r.randint(1,9))
		print ("Your One Time Password: ")
		print (OTP)
	elif type =='Email': 
	# which stores all alpha-numeric characters 
		# string = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
		string = '0123456789'
		OTP = "" 
		varlen= len(string) 
		for i in range(4) : 
			OTP += string[m.floor(r.random() * varlen)] 
		print ("Your One Time Password: ")
		print(OTP)
	return OTP

def Unique__Key():
	string = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
	OTP = "" 
	varlen= len(string) 
	for i in range(12) : 
		OTP += string[m.floor(r.random() * varlen)] 
	print ("Your One Time Password: ")
	print(OTP)
	return OTP

from twilio.rest import Client
 

def twilioSMS(request,body,number):
	account_sid = 'ACdac8c1d1ca92ea679fb4b0789fe67141'
	auth_token = '67c103e517c7c90b6e9f3ec78048aae0'
	client = Client(account_sid, auth_token)

	message = client.messages.create(
							   messaging_service_sid='MGb519d597f237fa2641bfe23df39ac67a', 
							  body=body,      
							  to='+91' +number
						  ) 
	print(message.sid)
	return HttpResponse(request,'this is a test') 

def normalSMS(request,body,number):
	msg = "Your XIRCLS verification code is {0}".format(body)
	# sms_url = 'http://sms6.rmlconnect.net:8080/bulksms/bulksms?username=ALTISS&password=7F08k71L&type=0&dlr=1&destination='+str(number)+'&source=XIRCLS&message='+str(msg)+'&entityid=1001253887567613864&tempid=1007483291713299893'
	# print("Tiny response------>",tinyurl)
	sms_url =f'https://api2.nexgplatforms.com/sms/1/text/query?username=AltisResO&password=*ALTISS@o_23&from=XIRCLS&to=91{number}&indiaDltContentTemplateId=1007483291713299893&indiaDltPrincipalEntityId=1001253887567613864&text={msg}'
	messages.add_message(request, messages.SUCCESS, 'SMS sent.',fail_silently=True)
	r = requests.get(sms_url)


	return HttpResponse(request,'this is a test') 

from utils.tasks import send_custacq_mail
def send_emails(user_email,sender):
	sent_email = sender+'<info@xircls.com>'
	connection = mail.get_connection()
	# Manually open the connection
	connection.open()
	mail.send_mail(user_email[0],'', sent_email, user_email[2], fail_silently=False,connection=connection,html_message=user_email[1])
	connection.close()


# def whatsapp(request,body,cust_phone):
# 	# urls_here = 'https://www.demo.xircls.in/candidate/candidate='+ str()
# 	from twilio.rest import Client

# 	account_sid = 'ACa07f3f590ef4ce9421078c2edb4388d6'
# 	auth_token = 'c851c15f7ef6c55b63c5cf19bc125656'
# 	client = Client(account_sid, auth_token)
# 	numbers=['+14155238886',]
# 	body_msg =body
# 	# body_msg = " Hi {0},\n \n \n  We're delighted that you availed {1} worth Rs.{2}.\n Please click {3} to confirm that you did indeed redeem this gift. \n It is a pleasure to have you as our Privileged customer. We hope to continue serving and delighting you, always \n Regards, \n \n {4} \n {5} \n {6} \n \n Note: Your data was not shared in this collaboration. ".format(customer_name,host_obj.reward_name,hole_amount_rewarded,urls_here,sponsor_outlet_obj.outlet_name,sponsor_outlet_obj.DM_mobileNo,sponsor_outlet_obj.DM_email)

# 	message = client.messages.create(
# 								body=body_msg,
# 								from_='whatsapp:+14155238886',
# 								to='whatsapp:'+str(cust_phone),
# 							)
# 	# messages.add_message(request, messages.SUCCESS, 'Whatsapp message Sent.',fail_silently=True)
# 	return message


def send_otp(request):
	if request.method == "POST":
		number			= request.POST.get('number')
		otp 			= otpgen('Mobile')
		request.session['redeem_otp'] = otp
		print(request.session.get('redeem_otp'))
		normalSMS(request,otp,number)
		return JsonResponse({'response': 'OTP send Successfully'})


def verify_otp(request):
	if request.method == "POST":
		otp = request.POST.get('otp')
		if otp == request.session.get('redeem_otp'):
			response = {
				'response':'success'
			}
		else:
			response = {
				'response':'failed'
			}
		return JsonResponse(response)



def QR__Form(request,outlet,key=0,form_key=0,template_name='merchant_site/customers/QR_Process/Qr_Form.html'):
	print(form_key,'form_key')
	from forms.models import XirclsForms,Form_data
	if form_key!=0:
		
		try:
			formobj = get_object_or_404(XirclsForms,unique_key=form_key,is_trash=0)
		except:
			url = reverse('customers:qr_failed',kwargs={'outlet':outlet})
			return HttpResponseRedirect(url)
			
		request.session['form_key'] = form_key
	try: 
		outlet_obj 	= outlet_details.objects.get(id=outlet)
	except Exception as e:
		print(e, outlet, "pppppppppppppp")
		pass

	else:
		image_logo 	= outlet_obj.outlet_logo
	if request.method =="POST":
		print(request.POST)
		if request.POST.get('button_val') == 'Send_OTP':
			# print('Inside')
			print('inside: Send_OTP')
			# Email_OTP=otpgen('Email')
			Mobile_OTP							= otpgen('Mobile')
			request.session['Email-OTP'] 		= Mobile_OTP
			request.session['Verify_OTP_check'] = False
			body 								= Mobile_OTP
			number 								= request.POST.get('contact')
			normalSMS(request,body,number)
			email_body 							= 'Your Verification Code is '+Mobile_OTP
			email_data 							= ['Email Verification',email_body,[request.POST.get('email-id')]] 
			send_emails(email_data,outlet_obj.outlet_name)
			# send_custacq_mail(email_data)
			print('Email_OTP:',request.session.get('Verify_OTP'))
			print('Mobile_OTP:',request.session.get('Mobile-OTP'))
			request.session['Send_OTP_check'] 	= True
			# request.session['Verify_mobile'] = False
			try:
				Add_Cust = Customer_QR_Details.objects.get(mobile = number,email=request.POST.get('email-id'),outlet=outlet)
			except:
				Add_Cust = Customer_QR_Details()
			Unique_Key 		= Unique__Key()
			print(Unique_Key,'Unique_Key')
			Add_Cust.mobile			= number
			Add_Cust.unique_key 	= Unique_Key
			Add_Cust.email 			= request.POST.get('email-id')
			Add_Cust.name 			= request.POST.get('name')
			Add_Cust.first_name 	= request.POST.get('first_name')
			Add_Cust.last_name 		= request.POST.get('last_name')
			Add_Cust.outlet 		= outlet_details.objects.get(id =outlet)
			
			Add_Cust.form_key		= request.session.get('form_key')
			Add_Cust.save()
			request.session['UniqueKey']=Unique_Key
			# url = reverse('customers:Get_my_Offers',kwargs={'key':request.session.get('UniqueKey')})
			# return HttpResponseRedirect(url)

		elif request.POST.get('button_val') == 'Verify_OTP':
			if request.session.get('Verify_OTP') == request.POST.get('Verify_OTP'):
				messages.add_message(request, messages.SUCCESS,'OTP Verified', fail_silently=True)
				outlet 		= outlet_details.objects.get(id =outlet)
				try:
					Add_Cust = Customer_QR_Details.objects.get(unique_key=request.session.get('UniqueKey'))
				except:
					pass
				request.session['Send_OTP_check'] 		= False
				request.session['Verify_OTP_check'] 	= False
				# request.session['Verify_email'] = False
				if Add_Cust.form_key and request.session.get('form_key')!= 0:
					request.session['form_key'] = 0
					url = reverse('forms:qr_dynamic_form',kwargs={'key':request.session.get('UniqueKey')})
					return HttpResponseRedirect(url)


				else:
					messages.add_message(request, messages.ERROR,'form not assigned to this QR-code', fail_silently=True)
			else:
				messages.add_message(request, messages.ERROR,'Verification Failed', fail_silently=True)


		
		 
	return render(request,template_name,locals())

def get_outlet_info(request):
    apiKey = request.META.get('HTTP_AUTHORIZATION')
    auth_details = None

    if apiKey:
        auth_details = decrypt(apiKey.encode())
    return auth_details


def store_transactions(original_balance_amount,plan_id,outlet_id,kit_id,deduction_method,payment_status,balance_amount,debit_amount,credit_amount,remark,is_paid,customer_reach,own_transactions,topup):
    print("222222222||||||||||||||||||||||")
    print(original_balance_amount)
    print(plan_id)
    print(outlet_id)
    print(kit_id)
    print(deduction_method)
    print(payment_status)
    print(balance_amount)
    print(debit_amount)
    print(credit_amount)
    print(remark)
    print(customer_reach)
    print(own_transactions)
    print(type(customer_reach))
    print(type(own_transactions))
    childtransactions_obj = childtransactions()
    # childtransactions_obj.transaction_no = 
    childtransactions_obj.plan_subcription = plan_id
    childtransactions_obj.plan_deduction_type = deduction_method
    childtransactions_obj.payment_status = payment_status
    childtransactions_obj.payment_date = datetime.now()
    childtransactions_obj.original_balance_amount = original_balance_amount
    childtransactions_obj.balance_amount = balance_amount
    childtransactions_obj.debit_amount = debit_amount
    childtransactions_obj.credit_amount = credit_amount
    childtransactions_obj.outlet_id  = outlet_id
    childtransactions_obj.kit_id = kit_id
    childtransactions_obj.remarks = remark
    childtransactions_obj.is_paid = is_paid
    childtransactions_obj.customer_reach = customer_reach
    childtransactions_obj.own_transactions = own_transactions  
    childtransactions_obj.topup = topup  
    childtransactions_obj.save()
    childtransactions_obj.transaction_no = childtransactions_obj.id
    childtransactions_obj.save()
    if float(childtransactions_obj.balance_amount) < 0:
        childtransactions_obj.balance_amount = 0
        childtransactions_obj.save()    




def DeductionFunction(outletid,offer_kit,sender_outlet,type):
	child_transac 				= childtransactions.objects.filter(outlet_id=outletid).last()
	print(child_transac,'21381')
	try:
		plan_details 			= get_object_or_404(plan_subcriptions,outlet_id=outletid,status='AC')
		print(plan_details)
	except:
		plan_details 			= None

	else:
		price_deduction_obj		= PriceDeductions.objects.filter(is_active=1,membership_plan=plan_details.membership_plan.id)
		cross_marketing			= cross_marketing_strategy.objects.get(outlet = outletid)
		deduction_amount 		= price_deduction_obj.get(method_name = 'Customer Reach').per_cost

		deduction_method 		= float(deduction_amount)
		payment_status 			= "DR"
		balance_amount			= float(child_transac.balance_amount) - float(deduction_amount)
		original_balance_amount	= child_transac.original_balance_amount
		topup					= child_transac.topup
		own_transactions 		= child_transac.own_transactions
		debit_amount			= deduction_amount
		kit_id					= offer_kit
		customer_reach			= child_transac.customer_reach
		plan_id					= plan_details.membership_plan.id
		outlet_id				= outletid
		if type == 'HT':
			remark  			= "Deduction On Customer Reach" 
		else:
			remark				= "Deduction on Offer Issued" 
		is_paid 				= child_transac.is_paid
		# own_transactions = len(kit_id)
		credit_amount 			= 0
		if float(child_transac.balance_amount) >= float(deduction_method):
			store_transactions(original_balance_amount,plan_id,outlet_id,kit_id,deduction_method,payment_status,balance_amount,debit_amount,credit_amount,remark,is_paid,customer_reach,own_transactions,topup)
			response			= 'Success'
		else:
			response 			= 'low_balance'
		return  response

def accept(request,template_name="merchant_site/customers/QR_Process/accept.html"):
	try:
		customer		= Redeem_Requests.objects.get(unique_key=request.GET.get('key'))
	except:
		customer		= None

	return render(request,template_name,locals())


def qr_failed(request,outlet=0,template_name="merchant_site/customers/QR_Process/qr_failed.html"):
	try: 
		outlet_obj 	= outlet_details.objects.get(id=outlet)
	except Exception as e:
		print(e, outlet, "pppppppppppppp")
		pass

	return render(request,template_name,locals())

def decline(request,template_name="merchant_site/customers/QR_Process/decline.html"):
	try:
		customer		= Redeem_Requests.objects.get(unique_key=request.GET.get('key'))
	except:
		customer		= None
	return render(request,template_name,locals())


def save_for_later(request,template_name="merchant_site/customers/QR_Process/save_for_later.html"):
	try:
		customer		= Customer_QR_Details.objects.get(unique_key=request.GET.get('key'))
	except:
		customer		= None
	return render(request,template_name,locals())

@csrf_protect
@csrf_exempt
@has_cloud_api_permission
def FormBasedOffer(request):
	if request.method == 'POST':
		postdata = request.POST.copy()
		logger.warning(str(postdata))
		# print(postdata)
		logger.warning('sssssssscccccccccccccccccccccccccccccccccccccccc')
		outletidcheck 		= get_outlet_info(request)
		outletID 			= outletidcheck[2]
		print(outletID,'outletID')
		crosstrobj 			= get_object_or_404(cross_marketing_strategy,outlet_id = outletID)
		outlet_details_info = get_object_or_404(outlet_details,id =outletID)
		cust_first_name 	= postdata.get('customer_first_name',None)
		cust_last_name 		= postdata.get('customer_last_name',None)
		cust_mob 			= postdata.get('customer_mobile',None)
		cust_email 			= postdata.get('customer_email',None)
		cust_pincode 		= postdata.get('pincode',None)
		cust_city 			= postdata.get('city',None)
		cust_country 		= postdata.get('country',None)
		cust_state			= postdata.get('state',None)
		cust_entry_point 	= 'QR_Forms'
		form_key				=  postdata.get('form_key',None)
		from forms.models import XirclsForms,Form_data
		if form_key:
			try:
				form_based_Xircl	= get_object_or_404(XirclsForms,unique_key = form_key)
			except Exception as e:
				logger.warning(str(e)+'error will fetching form based xircle')
				message 		= "Inner Xircle not found for this form"
				response 		= response_json(request, 'error', '404', '', message, '')
				return JsonResponse(response)
			try :
				innerXircle_obj 				= subXirclsInfo.objects.get(id = form_based_Xircl.inner_xircl.id,is_trash=0)
				innerXircle_offers 				=innerXircle_obj.selected_offer_list
			except Exception as e:
				message 		= str(e)+"Inner Xircle not found"
				response 		= response_json(request, 'error', '404', '', message, '')
				return JsonResponse(response)
			if innerXircle_obj.own_offer:
				innerXircle_offers_list 		= (innerXircle_offers).split(',')
				innerXircle_offers_list.insert(0,innerXircle_obj.own_offer)
			else:
				innerXircle_offers_list 		= (innerXircle_offers).split(',')
			print(innerXircle_offers_list,'21502')
			inner_xircle_offer_obj 			= OutletOfferInfo.objects.filter(id__in = innerXircle_offers_list)
			#### For HOST DEDUCTION ########################################
			child_transac 					= childtransactions.objects.filter(outlet_id=outletID).last()

			try:
				host_plan_details 			= get_object_or_404(plan_subcriptions,outlet=outletID,status = 'AC')
				print(host_plan_details)
			except Exception as e:
				print(e,'host_plan_details')
				host_plan_details 			= None

			else:
				host_price_deduction_obj	= PriceDeductions.objects.filter(is_active=1,membership_plan = host_plan_details.membership_plan.id)
				print(host_plan_details.membership_plan.id,'host_plan_details.membership_plan.id')
				host_deduction_amount 		= host_price_deduction_obj.get(method_name = 'Customer Reach').per_cost
				print(host_deduction_amount)
			############################## HOST DEDUCTION FLOW ##############
			if cust_mob or cust_email:
				


				if cust_mob != "" and cust_mob != None:
					cust_info =  CustomerProfile.objects.filter(phone_no = cust_mob)
				else:
					cust_info =  None

				if cust_email != "" and cust_email != None:
					cust_email_info = User.objects.filter(email = cust_email)
				else:
					cust_email_info = None


			print('///////////////////////////////////////////////////////////////////////////////////////////////////////221')
			if cust_info or cust_email_info:
				
				if cust_info:
					cust_userid = cust_info[0].user_id_id
				elif cust_email_info:
					cust_userid = cust_email_info[0].id
			else:
				
				profile = CustomerProfile()
				# profile.user_id = customer_user
				profile.phone_no = cust_mob
				mac = get_mac()

				profile.desktop_mac_id = mac
				profile.entry_point =cust_entry_point


				profile.ip_address = request.META.get('REMOTE_ADDR')
				# profile.save()

			if cust_email:
			
				if child_transac.balance_amount >= host_deduction_amount:
					try:
						if cust_userid:	
							auth_User 				= User.objects.get(id = cust_userid)
						else:
							auth_User 				= User.objects.get(username = cust_email)
					except Exception as e:
						print(e,'Auth Except')
						auth_User 				= User()
						auth_User.username 		= cust_email
						auth_User.email 		= cust_email
						auth_User.first_name	= cust_first_name
						auth_User.last_name		= cust_last_name
						auth_User.save()
						try:
							profile.user_id = auth_User
							profile.save()
						except:pass

						print(auth_User,'auth_data else')
					try:
						cust 					= customer_details.objects.get(user = auth_User.id,outlet = outletID)
					except:
						cust 					= customer_details()
						cust.customer_name 		= cust_first_name + ' ' + cust_last_name
						cust.email				= cust_email
						cust.phone_no			= cust_mob
						cust.entry_point		= cust_entry_point
						cust.outlet				= outlet_details_info
						cust.user				= get_object_or_404(User, id = auth_User.id)
						cust.created_by_id 		= outlet_details_info.created_by_id
						cust.city				= cust_city
						cust.country			= cust_country
						cust.pincode			= cust_pincode
						cust.state				= cust_state
						cust.save()
					cust_form = Form_data()
					cust_form.form_json =request.POST.get('form_json') if request.POST.get('form_json') else None
					cust_form.customer = cust
					cust_form.form = form_based_Xircl
					cust_form.save()
					print(cust.id,'customer_details')
					offer_kit					= OfferIssueKits()
					offer_kit.issue_method		= 'ACT'
					offer_kit.customer_user		= auth_User
					offer_kit.merchant_user		= get_object_or_404(User, id = outlet_details_info.created_by_id)
					offer_kit.issuance_city		= cust_city
					offer_kit.issuance_country	= cust_country
					offer_kit.issuance_pincode	= cust_pincode
					offer_kit.customer_name		= cust_mob
					offer_kit.outlet			= outlet_details_info
					offer_kit.save()
					print(offer_kit.id,'offer_kit has been generated')
					send_offer_list				= set()
					for offer in inner_xircle_offer_obj:
						print(offer,'21608')
						my_offer				= MyOffers()
						my_offer.kit			= offer_kit
						my_offer.offer			= offer
						my_offer.user			= auth_User
						my_offer.my_offer_type	= 'HT' if offer.outlet.id == outletID else 'IO'
						if offer.offer_expires_in_days_after_issue:
							expiry_days_set 	= offer.offer_expires_in_days_after_issue
							expire_Date 		= ts.now() + timedelta(days=expiry_days_set)
						elif offer.offer_expiry_date:
							expire_Date 		= offer.offer_expiry_date
							# offer has expired 
							if expire_Date < datetime.now():
								expire_Date 	= None
						else:
							expire_Date 		= ts.now() + timedelta(days=30)
						my_offer.expired_at 				= expire_Date				# my_offer.critical_template	= 'IO'
						deduction_status_response 				= DeductionFunction(offer.outlet.id,offer_kit.id,outletID,my_offer.my_offer_type)
						if deduction_status_response != 'low_balance':
							send_offer_list.add(offer.id)
							my_offer.save()
							print(my_offer.id,'offer_data')

						else:
							message 			= 'No offer found'
							response 			= response_json(request, 'error', '404', '', message, '')
					print(send_offer_list)
					try:
						sender_id 		= outlet_details_info.outlet_sender_id
					except:
						sender_id 		= None
					try:
						edited 			= get_object_or_404(offer_design_customization, is_active = 1 ,slug = form_based_Xircl.inner_xircl.slug)
					except Exception as e:
						print(e,'edited')
						edited 			= None
					if edited:
						import ast
						desexis=edited.offer_design_type
						aa=edited.email_body1_design
						bb=edited.email_body2_design
						cc=edited.email_headline_design

						try:
							bod1des = ast.literal_eval(aa)
							bod1sizeexis=bod1des['font_size']
							bod1famexis=bod1des['font_family']
							bod1styexis=bod1des['font_style']
							bod1bgcolor=bod1des['bg_color']
							# bod1image=''
							bod1_font_color = bod1des['font_color']
						except:
							bod1des=''

						try:
							bod2des = ast.literal_eval(bb)
							bod2sizeexis=bod2des['font_size']
							bod2famexis=bod2des['font_family']
							bod2styexis=bod2des['font_style']
							bod2_font_color = bod2des['font_color']
						except:
							bod2des=''
						try:
							headldes = ast.literal_eval(cc)
							headlsizeexis=headldes['font_size']
							headlfamexis=headldes['font_family']
							headlstyexis=headldes['font_style']
						except:
							headldes=''

						own_offer=edited.own_offer
						dd = edited.email_body1.split(' ')
						print(dd)
						em_body1 = dd[0] + ' ' + str(cust_first_name)
						em_body2=edited.email_body2
						em_head=edited.email_head
						em_headl = edited.email_headline
						subline=edited.sub_line



					cust_offers_arr 	= OutletOfferInfo.objects.filter(id__in =send_offer_list)
					print(cust_offers_arr,'cust_id')
					email_title 		= 'A special gift from our friends'
					message 			= render_to_string('merchant_site/customers/QR_Process/action_base_offer_template.html', locals())
					user_email			= (email_title, message, cust_email, offer_kit.id, outletID, auth_User.id,sender_id)
					r 					= send_offer_email_user(user_email, outlet_details_info)
					message 			= "Offer kit issued Successfully"
					response 			= response_json(request, 'success', '200', offer_kit.id, message, '')

				else:
					message 			= "Balance Amount is too low"
					response 			= response_json(request, 'error', '404', '', message, '')
			else:
				message 			= "Please provide a valid email addresss"
				response 			= response_json(request, 'error', '404', '', message, '')
	return JsonResponse(response)

@login_required(login_url='/merchant-login/')
# @multi_user_permission('View_Customers')
@redirectMerchantAsPerProgress("MY_CUSTOMERS")
@multi_user_permission('view', 'Customers')
@permission_required(['customers.add_customer_details','customers.change_customer_details','customers.delete_customer_details'],raise_exception=True)
def get_my_customers(request, template_name='merchant_site/customers/my_customers.html'):
	
	active_page_name = "my_customers_page"
	multi_user_id = request.session.get("multi_user_id")
	# print(multi_user_id,"+++++++++++++++++++++++++++++++++++++++")
	isSAdmin = False
	if multi_user_id is None:
		isSAdmin = True
	display_department_date = 'all'

	outletid = request.session.get('outlet_id')
	
	print("outletid",outletid)
	invoice_count = 0
	try:
		invoice_ob =inovice_details.objects.filter(outlet_id=outletid)
		invoice_count=len(invoice_ob)
	except:
		invoice_ob= None
		# """using below code"""

	try:
		groups = privilege_customer_groups.objects.filter(outlet_id=outletid).values("group_name")
	except:
		groups = []
		
	if outletid:
		try:
			outletObj = get_object_or_404(outlet_details, id = outletid)
			
		except:
			outletObj = None
		else:
			currency_obj = get_object_or_404(All_Countries_Complete_Info, name = outletObj.outlet_country)

		privi_list_group = privileged_customers_subgroup.objects.filter(outlet_id = outletObj.id).values('customer_id','sub_group_name')
			
		if multi_user_id is None:
			print("inside user")
			customers_list = customer_details.objects.filter(outlet_id=outletObj.id).order_by('-created_at')
			customer_count =customers_list.count()
			customers_obj_with_group=customers_list.select_related(
														"outlet"
													)
			customers_obj=customers_obj_with_group.values("id","customer_name","phone_no","email","area_building")
			
			
											
		else:
			print("inside multiuser")
			try:
				MultiUserObj = MultiUserDetails.objects.get(user_id = multi_user_id)
			except:
				MultiUserObj = None
			if MultiUserObj:
				customers_list = customer_details.objects.filter(multi_user_id_id=MultiUserObj.id).order_by('-created_at')
				customer_count =customers_list.count()
				customers_obj_with_group=customers_list.select_related(
															"outlet"
														)
				customers_obj=customers_obj_with_group.values("id","customer_name","phone_no","email","area_building")

		"""end query optmz"""
		# search=any(s != '' for s in search_values)
		try:
			customer_settings_obj = get_object_or_404(customers_setting,outlet_id = outletid)
		except:
			customer_settings_obj = None


		earnings_today = 0
		diff_month = 0
		active_cust_count = 0
		inactive_cust_count = 0
		now = datetime.now()

		cursor = connection.cursor()
		cursor.execute(''' select max(created_at) as created_at,customer_id from xl925_inovice_details WHERE outlet_id ={0} 
							GROUP BY customer_id DESC '''.format(outletid))
		new_inv_obj = dictfetchall(cursor)
		for inv in invoice_ob:
			
			if inv.created_at.date() == now.date():
				if inv.status == "ACT":
					earnings_today = float(earnings_today) + float(inv.total_amount_after_gst)

		for inv in new_inv_obj:
		
			diff_month = (now.date() - inv['created_at'].date()).days / 30
			
			if customer_settings_obj :
				if diff_month <= int(customer_settings_obj.active_months):
					active_cust_count = active_cust_count + 1
			
			else :
				if diff_month <= 6:
					active_cust_count = active_cust_count + 1
				

		inactive_cust_count = customer_count - active_cust_count

		if request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest' and request.method == "POST":
			datatables = request.POST
			print(datatables)
			draw = int(datatables.get('draw'))
			start = int(datatables.get('start'))
			length = int(datatables.get('length'))
			over_all_search = datatables.get('search[value]')

			customer_names=datatables.get("columns[1][search][value]", None)
			customer_group=datatables.get("columns[2][search][value]", None)
			phone_nos=datatables.get("columns[3][search][value]",None)
			email=datatables.get("columns[4][search][value]",None)
			location=datatables.get("columns[5][search][value]",None)

			print(customer_names,customer_group,phone_nos,email,location)

			advance_filter= Q()
			if customer_names:
				advance_filter &=Q(customer_name__icontains=customer_names)
			# if customer_group:
			# 	advance_filter &=Q(outlet__privileged_customers_subgroup__sub_group_name__icontains =customer_group)
			if phone_nos:
				advance_filter &=Q(phone_no__icontains=phone_nos)
			if email:
				advance_filter &=Q(email__icontains=email)
			if location:
				advance_filter &=Q(area_building__icontains=location)
			
			if over_all_search:
				advance_filter |=Q(customer_name__icontains=over_all_search) | Q(phone_no__icontains=over_all_search) | Q(email__icontains=over_all_search) | Q(area_building__icontains=over_all_search)
		
			if over_all_search or customer_names or customer_group or phone_nos or email or location:
				customers_obj=customers_obj_with_group.filter(
															advance_filter
														).values("id","customer_name","phone_no","email","area_building")
				customer_count=customers_obj.count()

			page_number = start / length + 1

			paginator = Paginator(customers_obj, length)

			try:
				object_list = paginator.page(page_number).object_list
			except PageNotAnInteger:
				object_list = paginator.page(1).object_list
			except EmptyPage:
				object_list = paginator.page(paginator.num_pages).object_list
			logger.info('------------------------')
			logger.info('------------------------')
			logger.info('------------------------')
			logger.info(str(object_list))
			logger.info('------------------------')
			logger.info('------------------------')
			logger.info('------------------------')
		

			data={				
				'draw': draw,
				'recordsTotal': customer_count,   # draw, recordssTotal, recordsFilter is use for datatables 
				'recordsFiltered': customer_count,
				'customer_group':list(privi_list_group),
				"customers_obj" : list(object_list)
			}
			
			return JsonResponse(data,safe=False)
		return render(request,template_name,locals())



def user_based_candidate_details(request):
	from django.db import models as mod
	if request.method =='POST':

		stats=[]
		try:
			userObj = MultiUserDetails.objects.get(id = request.POST.get('slug'))
		except:
			return JsonResponse({'response':'No user Found'})
		else:
			days =request.POST.get('period',None)
			lis = [
			"Administration HR",
			"Recruitment",
			"Human Resource Management",
			"Operations",
			"Sales",
			"Marketing",
			"Luxury Sales",
			"Digital Marketing",
			"Client Success Management",
			"Content Writing",
			"Graphic Design",
			"Python Programming",
			"Front-End Development",
			"Android App Development",
			"iOS App Development",
			"Sales Business Development",
			"UI/UX Design",
			"Financial Analyst",
			"Founder's Business Plan Analyst",
			"Risk Analyst",
			"Market Research & Competitive Analysis",
			"Luxury Sales Partner",
			"Sales Partner - Automobiles",
			"Sales Partner - Business Consultants",
			"Sales Partner - Hospitality",
			"Sales Partner - IT Consultants",
			"Sales Partner - Loyalty Programs",
			"Sales Partner - SaaS",
			"Content Coordinator",
			"Financial Forecasting",
			"Video",
			"Lead Generation",
			"HR and Content Writing"

		]
			for i in lis:
				if days:
					candObj = candidate_details.objects.filter(Department = i, created_by_id = userObj.user,created_at__gte = datetime.now()-timedelta(days = int(days)))
				else:
					candObj = candidate_details.objects.filter(Department = i, created_by_id = userObj.user)
				count=candObj.aggregate(
							count=Count("pk"),
							Screened=Coalesce(Sum(
								Case(When(Stage__in = ['Screening Call','Test/Portfolios/Assignments'],then=1),default=0,output_field=mod.IntegerField())
								),0),
							Interview=Coalesce(Sum(
								Case(When(Stage = 'Final Interview',then=1),default=0,output_field=mod.IntegerField())
								),0),
							Selected=Coalesce(Sum(
								Case(When(Stage = 'Documentation Stage',then=1),default=0,output_field=mod.IntegerField())
								),0),
							Probation=Coalesce(Sum(
								Case(When(Stage = 'In Probation',then=1),default=0,output_field=mod.IntegerField())
								),0),
							Employed=Coalesce(Sum(
								Case(When( Stage = 'Employed',then=1),default=0,output_field=mod.IntegerField())
								),0),
							Withdrawn=Coalesce(Sum(
								Case(When( Stage = 'Withdrawn',then=1),default=0,output_field=mod.IntegerField())
								),0),
								)
				temp = {}
				temp['role'] = i
				temp['count'] = count.get('count')
				temp['Screened'] =  count.get('Screened')
				temp['Interview'] =count.get('Interview')
				temp['Selected'] = count.get('Selected')
				temp['Probation'] = count.get('Probation')
				temp['Employed'] = count.get('Employed')
				temp['Withdrawn'] = count.get('Withdrawn')
				stats.append(temp)
	return JsonResponse({'response':stats})


def lead_details_api(request):

	if request.method == 'GET':
		cursor = connection.cursor()

		cursor.execute('''SELECT
				COUNT(lead.id) AS total,
				lead.created_by_id,
				SUM(
					CASE WHEN lead.cust_rating = 'Cold' THEN 1 ELSE 0
				END
			) AS cold_count,
			SUM(
				CASE WHEN lead.cust_rating = 'Warm' THEN 1 ELSE 0
			END
			) AS warm_count,
			SUM(
				CASE WHEN lead.cust_rating = 'HOT' THEN 1 ELSE 0
			END
			) AS HOT_count,
			(
				SELECT
					first_name
				FROM
					xl925_multi_user_details
				WHERE
					lead.created_by_id = id
			) AS NAME,
			(
				SELECT
					COUNT(*)
				FROM
					lead_history
				WHERE
					lead_history.lead_id = lead.id AND lead_history.stage_id = 3
			) AS Stage_count,
			(
				SELECT
					COUNT(*)
				FROM
					xl925_new_Add_Call_Details
				WHERE
					xl925_new_Add_Call_Details.lead_id_id = lead.id
			) AS INTERACTION_count,
			(
				SELECT
					COUNT(*)
				FROM
					xl925_new_Add_Call_Details
				WHERE
					xl925_new_Add_Call_Details.lead_id_id = lead.id AND xl925_new_Add_Call_Details.is_customer = 1
			) AS CONVERSION
			FROM
				`xl925_lead_details` AS lead
			WHERE
				is_trash = 0
			GROUP BY
				lead.created_by_id''')
		lead_type = dictfetchall(cursor)

		print(lead_type, 'uuu')

	return JsonResponse({'data': lead_type })


def create_job_description(request, template_name="merchant_site/customers/add_job_description.html"):
    # print("add_job_description=========")
    all_department= department.objects.all().values()
    position=job_description.positions
    work_role_type=job_description.work_role

    if request.method =="POST":
        postdata=request.POST
        response={}
        # print(postdata.get("type"))
        job_id=postdata.get("job_id",None)
        department_id=postdata.get("department_id",None)
        role=postdata.get("role_name",None)
        position=postdata.get("position",None)
        introduction=postdata.get("introduction",None)
        responsibility=postdata.get("responsibility",None)
        requirement=postdata.get("requirement",None)
        benefits=postdata.get("benefits",None)
        compensation=postdata.get("compensation",None)
        work_role=postdata.get("work_role",None)
        tags=postdata.get("tags",None)
        questions=postdata.get("questions",None)
        stipend=postdata.get("stipend",None)
        note=postdata.get("note",None)

        if postdata.get("type") == "save":
            # print(postdata)
            try:
                department_obj=department.objects.get(id=department_id)
                # print(department_obj)
                job_description_obj=job_description(
                    department_id=department_obj,
                    role_name=role,
                    position=position,
                    introduction=introduction,
                    job_responsibilities=responsibility,
                    requirement=requirement,
                    compensation_structure= compensation,
                    benefits=benefits,
                    work_role_type=work_role,
                    tags=tags,
                    questions=questions,
                    stipend=stipend,
                    note=note

                )
                job_description_obj.save()
                
                response["status"]="success"
                response["status_code"]="200"
                response["data"]=""
                response["id"]= job_description_obj.id
                response["message"]="Job Description Record Saved"
            except:
                response["status"]="error"
                response["status_code"]="400"
                response["data"]=""
                response["message"]="Job Description Record Not Saved"

        if postdata.get("type")=="update":
            logger.info(str(postdata) + '19593')
            # print("update")
            try:
               	department_obj=department.objects.get(id=department_id)
                job_description_obj=job_description.objects.filter(id=job_id).update(
                    introduction=introduction,
                    job_responsibilities=responsibility,
                    requirement=requirement,
                    compensation_structure= compensation,
                    benefits=benefits,
                    tags=tags,
                    questions=questions,
                    stipend=stipend,
					department_id=department_obj,
                    role_name=role,
                    position=position,
                    work_role_type=work_role,
                    note=note

                )
                # job_description_obj.save()
                
                response["status"]="success"
                response["status_code"]="200"
                response["data"]=""
                response["message"]="Job Description Record Updated"
            except Exception as e:
                logger.info(str(e) + "Job Description Record Not Updated")
                response["status"]="error"
                response["status_code"]="400"
                response["data"]=""
                response["message"]="Job Description Record Not Updated"

        if postdata.get("type") == "delete":
            # print(postdata)
            try:
               
                job_description_obj=job_description.objects.get(id=job_id)
                job_description_obj.delete()
                
                response["status"]="success"
                response["status_code"]="200"
                response["data"]=""
                response["message"]=" Record Deleted Successfully"
            except:
                response["status"]="error"
                response["status_code"]="400"
                response["data"]=""
                response["message"]="Record Not Found"

        if postdata.get("type") == "job_table":
            # initial data fot datatables
            logger.info("Enter")
            job_description_obj=job_description.objects.select_related("department_id").filter(is_trash=False)

            job_description_data=job_description_obj.values(
                                                        "id",
                                                        "department_id",
                                                        "department_id__dept_name",
                                                        "introduction",
                                                        "job_responsibilities",
                                                        "requirement",
                                                        "benefits",
                                                        "compensation_structure",
                                                        "role_name",
                                                        "position",
                                                        "work_role_type",
                                                        "tags",
														"questions",
														"question_list",
                                                        "stipend",
                                                        "note"
                                                        )
            job_description_count=job_description_obj.count()



            logger.info("count" + str(job_description_count))
            draw = int(postdata.get('draw'))
            start = int(postdata.get('start'))
            length = int(postdata.get('length'))
            over_all_search = postdata.get('search[value]')
            # print("over_all_search",over_all_search)

            advance_filter= Q()
            
            if over_all_search:
                advance_filter |=Q(department_id__dept_name__icontains=over_all_search) | Q(role_name__icontains=over_all_search) 
        
            if over_all_search:
                job_description_data=job_description_obj.filter(
                                                            advance_filter
                                                        ).values(
                                                        "id",
                                                        "department_id",
                                                        "department_id__dept_name",
                                                        "introduction",
                                                        "job_responsibilities",
                                                        "requirement",
                                                        "benefits",
                                                        "compensation_structure",
                                                        "role_name",
                                                        "position",
                                                        "work_role_type",
                                                        "tags",
														"questions",
														"question_list",
                                                        "stipend"
                                                        )
                job_description_count=job_description_obj.count()

            page_number = start / length + 1

            paginator = Paginator(job_description_data, length)

            try:
                object_list = paginator.page(page_number).object_list
            except PageNotAnInteger:
                object_list = paginator.page(1).object_list
            except EmptyPage:
                object_list = paginator.page(paginator.num_pages).object_list

            logger.info("objects_list" + str(object_list))

            response={				
                'draw': draw,
                'recordsTotal': job_description_count,   # draw, recordssTotal, recordsFilter is use for datatables 
                'recordsFiltered': job_description_count,
                "data" : list(object_list)
            }

        
        return JsonResponse(response,safe=False)

    return render(request, template_name, locals())

def view_job_description(request, template_name="merchant_site/customers/view_job_description.html"):
	logger.info(str(request.session.get("multi_user_id")) + "uuuuuuuu")
	job_description_obj = job_description.objects.all()
	all_department= department.objects.all().values()
	position=job_description.positions
	work_role_type=job_description.work_role
	multiuser = request.session.get("multi_user_id")
	if multiuser:
		multi_user = MultiUserDetails.objects.get(user=multiuser).slug
	else:
		multi_user = request.user.id

	return render(request, template_name, locals())

def job_description_details(request,id=0):
	job_desc = job_description.objects.get(id =id)
	return render(request,'merchant_site/customers/job_description_details.html',locals())






def getUserEventsapp(request):
	print("[getEvents] In Func now")
	if request.method == "POST":
		user = "MultiUser"

		# if request.session.get("multi_user_id"):
		# 	user = "MultiUser"
		# 	loginUserId = postdata.get("logged_in")
		# else:
		# 	user = "SAdmin"
		postdata = request.POST.copy()
		loginUserId = postdata.get("logged_in")
		
		print("[getEvents]", loginUserId)
		idd = postdata.get("logged_in")
		# idd = postdata.get("id")
		
		login_id =postdata.get("logged_in")
		eventType = postdata.get("type")
		
		print("[getEvents]", eventType)
		try:
			user_cal_obj = userCalendar.objects.get(user_id = login_id)
		except:
			user_cal_obj = None
		# print("[user_cal_obj]",user_cal_obj)
		# print("[user_cal_obj] TZ",user_cal_obj.timezone)
		
		tz='local'
		data = {}
		if user_cal_obj:
			tz = user_cal_obj.timezone
			
			tz = timezone(tz)
		print("USER TIMEZONE",tz)
		if eventType == "all":
			
			# calObj = userCalendar.objects.get(user_id = loginUserId)
			kalObj = Kalnirnay.objects.filter(user_id = idd, is_trash = False)
			print("[kalObj]",kalObj)
			events = []
			interCount = 0
			otherCount = 0
			leadCount  = 0
			employeeCount  = 0  			
			for kal in kalObj:
				temp = {}
				if kal.eventType == "Interview":
					print("[getEvents] In interview if")
					# print(f"[getEvents] [{kal.id}]-[{kal.interview.candidate.id}] {kal.timeZone}, {kal.interview.timeZone}")
					temp['id'] = f"inter{interCount}"
					logger.warning(str(kal.id) + 'kal id inside for')
					try:
						interview_oooo=kal.interview
					except:
						continue
					try:
						if kal.interview.stage:
							temp['title'] = f"{kal.interview.stage} with {kal.interview.candidate.fname} ({kal.interview.status})"
						else:
							temp['title'] = "Some event with " + kal.interview.candidate.fname
					except:
						continue
					temp['color'] = kal.color
					temp['url'] = f'https://hr.xircls.com/merchant/employees/get-view-candidates/{str(kal.interview.candidate.id)}/'
					interCount += 1
					temp['start'] = kal.startTime.astimezone(tz)
					temp['end'] = kal.endTime.astimezone(tz)
				
				elif kal.eventType == "Lead":
					print("inside leads")
					if kal.recurring == "weekly":
						# temp['id'] = f"recurr{interCount}"
						temp['title'] = kal.title
						temp['color'] = kal.color
						temp['allDay'] = False
						try:
							print("inside urlsss with lead id")
							temp['url'] = f'https://hr.xircls.com/merchant/customer/view-lead/{str(kal.leads.id)}/'
						except:
							print("outside urlsss with lead id")
							temp['url'] = None
						print("[TIME]",kal.startTime.time())
						# temp['daysOfWeek'] = [kal.daysOfWeek]
						temp['frequency'] = 'weekly'
						temp['identifier'] = [kal.daysOfWeek]
						temp['start'] = kal.startTime.astimezone(tz)
						temp['startTime'] = kal.startTime.astimezone(tz)
						temp['endTime'] = kal.endTime.astimezone(tz)
						temp['end'] = kal.endTime.astimezone(tz)


					elif kal.recurring == "monthly":
						# temp['id'] = f"recurr{interCount}"
						temp['title'] = kal.title
						temp['color'] = kal.color
						temp['allDay'] = False
						try:
							temp['url'] = f'https://hr.xircls.com/merchant/customer/view-lead/{str(kal.leads.id)}/'
						except:
							temp['url'] = None
						date=kal.startTime.astimezone(tz)
						print("NEWDATE",date)
						new_date=date.strftime("%Y-%m-%d %H:%M:%S")
						print("NEWDATESS",new_date,type(new_date))
						temp['startTime'] = kal.startTime.astimezone(tz)
						temp['endTime'] = kal.endTime.astimezone(tz)
						temp['start'] = new_date
						temp['frequency'] = 'monthly'

						temp['identifier'] = []


						# temp['rrule'] = {
							
						# 	'interval': 1,
						# 	'freq': "monthly",
						# 	'dtstart':new_date,
						# 	'until': "2040-12-31"
							
							
						# }
						# print(temp['rrule'],"hojaaaaaaaaaaa")

					
					elif kal.recurring == "yearly":
						print(kal.startTime.strftime("%m"),"month number")
						
						# temp['id'] = f"recurr{interCount}"
						temp['title'] = kal.title
						temp['color'] = kal.color
						temp['allDay'] = False
						try:
							temp['url'] = f'https://hr.xircls.com/merchant/customer/view-lead/{str(kal.leads.id)}/'
						except:
							temp['url'] = None
						date=kal.startTime.astimezone(tz)
						print("NEWDATE",date)
						new_date=date.strftime("%Y-%m-%d %H:%M:%S")
						print("NEWDATESS",new_date,type(new_date))
						temp['frequency'] = 'yearly'
						temp['identifier'] = [str(kal.startTime.strftime("%m"))]
						temp['start'] = new_date

		
					else:
						temp['id'] = f"leads{leadCount}"
						temp['title'] = kal.title
						temp['color'] = kal.color
						# temp['allDay'] = False
						# temp['daysOfWeek'] = ast.literal_eval(kal.daysOfWeek)
						try:
							temp['url'] = f'https://hr.xircls.com/merchant/customer/view-lead/{str(kal.leads.id)}/'
						except:
							temp['url'] = None
					
						temp['start'] = kal.startTime.astimezone(tz)
						temp['end'] =  kal.endTime.astimezone(tz)
						
						
				elif kal.eventType == "Employee":

	
						if kal.recurring == "weekly":
							# temp['id'] = f"recurr{interCount}"
							temp['title'] = kal.title
							temp['color'] = kal.color
							temp['allDay'] = False
							try:
								print("inside urlsss with employee id")
								temp['url'] = f'https://hr.xircls.com/merchant/employees/get-view-employee/{str(kal.employees.id)}/'
							except:
								print("outside urlsss with employee id")
								temp['url'] = None
							print("[TIME]",kal.startTime.time())
							temp['daysOfWeek'] = [kal.daysOfWeek]
							temp['startTime'] = kal.startTime.time()
							temp['endTime'] = kal.endTime.time()
							temp['frequency'] = 'weekly'
							temp['identifier'] = [kal.daysOfWeek]
							temp['start'] = kal.startTime.astimezone(tz)
							temp['end'] = kal.endTime.astimezone(tz)

						

						elif kal.recurring == "monthly":
							# temp['id'] = f"recurr{interCount}"
							temp['title'] = kal.title
							temp['color'] = kal.color
							temp['allDay'] = False
							try:
								temp['url'] =f'https://hr.xircls.com/merchant/employees/get-view-employee/{str(kal.employees.id)}/'
							except:
								temp['url'] = None
							date=kal.startTime
							print("NEWDATE",date)
							new_date=date.strftime("%Y-%m-%d %H:%M:%S")
							print("NEWDATESS",new_date,type(new_date))
							temp['startTime'] = kal.startTime
							temp['endTime'] = kal.endTime
							temp['frequency'] = 'monthly'
							temp['identifier'] = []
							temp['start'] = new_date


							
						
						elif kal.recurring == "yearly":
							print(kal.startTime.strftime("%m"),"month number")
							
							# temp['id'] = f"recurr{interCount}"
							temp['title'] = kal.title
							temp['color'] = kal.color
							temp['allDay'] = False
							try:
								temp['url'] = f'https://hr.xircls.com/merchant/employees/get-view-employee/{str(kal.employees.id)}/'
							except:
								temp['url'] = None
							date=kal.startTime.astimezone(tz)
							print("NEWDATE",date)
							new_date=date.strftime("%Y-%m-%d %H:%M:%S")
							print("NEWDATESS",new_date,type(new_date))
							
							temp['frequency'] = 'yearly'
							temp['identifier'] = [str(kal.startTime.strftime("%m"))]
							temp['start'] = new_date






						else:
							temp['id'] = f"employees{employeeCount}"
							temp['title'] = kal.title
							temp['color'] = kal.color
							# temp['allDay'] = False
							# temp['daysOfWeek'] = ast.literal_eval(kal.daysOfWeek)
							try:
								temp['url'] = f'https://hr.xircls.com/merchant/employees/get-view-employee/{str(kal.employees.id)}/'
							except:
								temp['url'] = None
						
							temp['start'] = kal.startTime
							temp['end'] =  kal.endTime
							
							print("colorrrrrrrrrr",temp['id'],temp['color'],temp['start'],temp['end'])    
				elif kal.eventType == "INDV":
					print("[getEvents] In INDV if")
					if kal.recurring == "weekly":
						print("[getEvents] In INDV weekly if")
						temp['id'] = f"recurr{interCount}"
						temp['title'] = kal.title
						temp['color'] = kal.color
						temp['allDay'] = False
						temp['daysOfWeek'] = ast.literal_eval(kal.daysOfWeek)
						print("[TIME]",kal.startTime.time())
						temp['startTime'] = kal.startTime.astimezone(tz).time()
						temp['endTime'] = kal.endTime.astimezone(tz).time()
						temp['frequency'] = 'weekly'
						temp['identifier'] = ast.literal_eval(kal.daysOfWeek)
						temp['start'] = kal.startTime.astimezone(tz)
						temp['end'] = kal.endTime.astimezone(tz)

					

					
					elif kal.recurring == "monthly":
						print("[getEvents] In INDV monthly if")
						temp['id'] = f"recurr{interCount}"
						temp['title'] = kal.title
						temp['color'] = kal.color
						temp['allDay'] = False
						# temp['startTime'] = datetime.combine(datetime(2000, 1, int(ast.literal_eval(kal.daysOfWeek)[0])).date(), kal.startTime.time())
						temp['frequency'] = 'monthly'
						temp['identifier'] = []
						temp['start'] = new_date


					elif kal.recurring == "yearly":
						print("[getEvents] In INDV yearly if")
						date_month = ast.literal_eval(kal.daysOfWeek)
						temp['id'] = f"recurr{interCount}"
						temp['title'] = kal.title
						temp['color'] = kal.color
						temp['allDay'] = False
						
						temp['frequency'] = 'yearly'
						temp['identifier'] = [str(kal.startTime.strftime("%m"))]
						temp['start'] = new_date

					else:
						print("[getEvents] In INDV else")
						temp['id'] = f"indv{interCount}"
						temp['title'] = kal.title
						temp['color'] = kal.color
						temp['start'] = kal.startTime
						temp['end'] = kal.endTime
				
				elif kal.eventType == "GRP":
					print("[getEvents] In GRP if")
					if kal.recurring == "weekly":
						try:
							evObj = userEvents.objects.get(kal = kal)
						except:
							evObj = None
						else:
							if user == "SAdmin" or loginUserId == evObj.user_id:  
								temp['url'] = f"https://hr.xircls.com/merchant/customer/grpEvent/{evObj.id}/"
						temp['id'] = kal.calId
						temp['title'] = kal.title
						temp['color'] = kal.color
						temp['allDay'] = False
						temp['daysOfWeek'] = ast.literal_eval(kal.daysOfWeek)
						print("[TIME--]",kal.startTime.astimezone(tz))
						
						temp['startTime'] = kal.startTime.astimezone(tz).time()
						temp['endTime'] = kal.endTime.astimezone(tz).time()
						temp['frequency'] = 'weekly'
						temp['identifier'] = ast.literal_eval(kal.daysOfWeek)
						temp['start'] = kal.startTime.astimezone(tz)
						temp['end'] = kal.endTime.astimezone(tz)

					

					
					elif kal.recurring == "monthly":
						print("[getEvents] In GRP monthly if")
						try:
							evObj = userEvents.objects.get(kal = kal)
						except:
							evObj = None
						else:
							if user == "SAdmin" or loginUserId == evObj.user_id:  
								temp['url'] = f"https://hr.xircls.com/merchant/customer/grpEvent/{evObj.id}/"
						temp['id'] = kal.calId
						temp['title'] = kal.title
						temp['color'] = kal.color
						temp['allDay'] = False
						temp['frequency'] = 'monthly'
						temp['identifier'] = []
						temp['start'] = new_date


					elif kal.recurring == "yearly":
						print("[getEvents] In GRP yearly if")
						try:
							evObj = userEvents.objects.get(kal = kal)
						except:
							evObj = None
						else:
							if user == "SAdmin" or loginUserId == evObj.user_id:  
								temp['url'] = f"https://hr.xircls.com/merchant/customer/grpEvent/{evObj.id}/"
						date_month = ast.literal_eval(kal.daysOfWeek)
						temp['id'] = kal.calId
						temp['title'] = kal.title
						temp['color'] = kal.color
						temp['allDay'] = False
						temp['frequency'] = 'yearly'
						temp['identifier'] = [str(kal.startTime.strftime("%m"))]
						temp['start'] = new_date

					else:
						print("[getEvents] In GRP else")
						try:
							evObj = userEvents.objects.get(kal = kal)
						except:
							evObj = None
						else:
							if user == "SAdmin" or loginUserId == evObj.user_id:  
								temp['url'] = f"https://hr.xircls.com/merchant/customer/grpEvent/{evObj.id}/"
						temp['id'] = kal.calId
						temp['title'] = kal.title
						temp['color'] = kal.color
						temp['start'] = kal.startTime.astimezone(tz)
						temp['end'] = kal.endTime.astimezone(tz)
				
				else:
					print("[getEvents] In else")
					temp['id'] = f"other{otherCount}"
					temp['title'] = "Test Event"
					temp['color'] = "#ffc107"
					otherCount += 1
						
					temp['start'] = kal.startTime.astimezone(tz)
					temp['end'] = kal.endTime.astimezone(tz)
					
				temp['textColor'] = "black"
				try:
					temp['can_id'] = kal.interview.candidate.id
				except:
					temp['can_id'] = None
				
				events.append(temp)
			
			data = {"events" : events, "interCount": interCount,"otherCount": otherCount,"LeadCount" :leadCount,"EmployeeCount":employeeCount}
		
		elif eventType == "Interview":
			
			kalObj = Kalnirnay.objects.filter(user_id = idd, is_trash = False, eventType = eventType)
		
			events = []
			interCount = 0
			otherCount = 0
			for kal in kalObj:
				temp = {}
				temp['id'] = f"inter{interCount}"
				if kal.interview.stage:
					temp['title'] = kal.interview.stage + " with " + kal.interview.candidate.fname
				else:
					temp['title'] = "Some event with " + kal.interview.candidate.fname
				temp['color'] = kal.color
				temp['url'] = f'https://hr.xircls.com/merchant/employees/get-view-candidates/{str(kal.interview.candidate.id)}/'
				temp['start'] = kal.startTime.astimezone(tz)
				temp['end'] = kal.endTime.astimezone(tz)
				temp['textColor'] = "black"
				try:
					temp['can_id'] = kal.interview.candidate.id
				except:
					temp['can_id'] = None
				interCount += 1
				events.append(temp)
			
			data = {"events" : events, "interCount": interCount,"otherCount": otherCount,"LeadCount" :leadCount}
			
		elif eventType == "Other":
			
			kalObj = Kalnirnay.objects.filter(user_id = idd, is_trash = False, eventType = eventType)
			events = []
			interCount = 0
			otherCount = 0
			for kal in kalObj:
				temp = {}
				temp['id'] = f"other{otherCount}"
				temp['title'] = "Test Event"
				temp['color'] = "#ffc107"
				temp['start'] = kal.startTime.astimezone(tz)
				temp['end'] = kal.endTime.astimezone(tz)
				temp['textColor'] = "black"
				try:
					temp['can_id'] = kal.interview.candidate.id
				except:
					temp['can_id'] = None
				otherCount += 1
				events.append(temp)
			
			data = {"events" : events, "interCount": interCount,"otherCount": otherCount,"LeadCount" :leadCount}
		
		return JsonResponse(data)


def permission_list(request):
	userList = []
	if request.method =='POST':
		loginID = request.POST.get('login_id')
		
		try:
			print("[Calendar] In Try", loginID)
			calObj = userCalendar.objects.get(user_id = loginID)
		except:
			print("[Calendar] In except")
		
		else:
			print("[Calendar] In Else", calObj.user.id)
			pass
			
		outlet_id = request.session.get('outlet_id')
		user_id = request.session.get('user_obj')
		
		calPermObj = calPerm.objects.filter(accessTo = loginID, is_trash = 0, is_allowed = 1)
		
		userList.append({
			'id': loginID,
			'name': calObj.user.first_name + " " + calObj.user.last_name
		})
		for user in calPermObj:
			temp = {}
			temp['id'] = user.accessOf.id
			temp['name'] = user.accessOf.first_name + " " + user.accessOf.last_name
			userList.append(temp)
	return JsonResponse({'response':userList})


def can_profile(request):
	can=[]
	if request.method == 'POST':
		try:
			can = list(candidate_details.objects.filter(id =request.POST.get('cand_id')).values())[0]
		except:
			can =[]
	return JsonResponse({'response':can})

def QR_code_generator(link,state,outlet):
    #Generate QR code
    url = pyqrcode.create(link)
    qr_code_path="customers/Qr_codes/qr_code_process_{1}_{0}.png".format(outlet,state)
    print(qr_code_path)
    # Create and save the svg file naming "myqr.svg"
    url.png("/home/hr/public_html/xircls/static/customers/Qr_codes/qr_code_process_{1}_{0}.png".format(outlet,state), scale = 6)
    return  qr_code_path

def new_QR_code_generator(request,state):
	qr_code_path =''
	if request.method == 'POST':
		outlet = request.session.get('outlet_id')
		link='https://hr.xircls.com/customer/Verify-For-Offer/{0}/{1}/'.format(outlet,state)
		url = pyqrcode.create(link)
		qr_code_path="customers/Qr_codes/qr_code_inner_process_{1}_{0}.png".format(outlet,state)
		print(qr_code_path)
		# Create and save the svg file naming "myqr.svg"
		url.png("/home/hr/public_html/xircls/static/customers/Qr_codes/qr_code_inner_process_{1}_{0}.png".format(outlet,state), scale = 6)

	return  JsonResponse({'link':qr_code_path})




def QR_Form_new(request,outlet,key=0,inner_xircls=0,template_name='merchant_site/customers/QR_Process/Qr_Form.html'):
	
	try: 
		outlet_obj 	= outlet_details.objects.get(id=outlet)
	except Exception as e:
		print(e, outlet, "pppppppppppppp")
		pass

	else:
		image_logo 	= outlet_obj.outlet_logo
	if request.method =="POST":
		print(request.POST)
		if request.POST.get('button_val') == 'Send_OTP':
			# print('Inside')
			print('inside: Send_OTP')
			# Email_OTP=otpgen('Email')
			Mobile_OTP							= otpgen('Mobile')
			request.session['Email-OTP'] 		= Mobile_OTP
			request.session['Verify_OTP_check'] = False
			body 								= Mobile_OTP
			number 								= request.POST.get('contact')
			normalSMS(request,body,number)
			email_body 							= 'Your Verification Code is '+Mobile_OTP
			email_data 							= ['Email Verification',email_body,[request.POST.get('email-id')]] 
			send_emails(email_data,outlet_obj.outlet_name)
			# send_custacq_mail(email_data)
			print('Email_OTP:',request.session.get('Verify_OTP'))
			print('Mobile_OTP:',request.session.get('Mobile-OTP'))
			request.session['Send_OTP_check'] 	= True
			# request.session['Verify_mobile'] = False
			try:
				Add_Cust = New_Customer_QR_Details.objects.get(mobile = number,email=request.POST.get('email-id'),outlet=outlet)
			except:
				Add_Cust = New_Customer_QR_Details()
			Unique_Key 		= Unique__Key()
			print(Unique_Key,'Unique_Key')
			Add_Cust.mobile			= number
			Add_Cust.unique_key 	= Unique_Key
			Add_Cust.email 			= request.POST.get('email-id')
			Add_Cust.name 			= request.POST.get('name')
			Add_Cust.first_name 	= request.POST.get('first_name')
			Add_Cust.last_name 		= request.POST.get('last_name')
			Add_Cust.outlet 		= outlet_details.objects.get(id =outlet)
			
			Add_Cust.form_key		= request.session.get('form_key')
			Add_Cust.save()
			request.session['UniqueKey']=Unique_Key
			# url = reverse('customers:Get_my_Offers',kwargs={'key':request.session.get('UniqueKey')})
			# return HttpResponseRedirect(url)

		elif request.POST.get('button_val') == 'Verify_OTP':
			if request.session.get('Verify_OTP') == request.POST.get('Verify_OTP'):
				messages.add_message(request, messages.SUCCESS,'OTP Verified', fail_silently=True)
				outlet 		= outlet_details.objects.get(id =outlet)
				request.session['Send_OTP_check'] 		= False
				request.session['Verify_OTP_check'] 	= False
				entry_point='QR_Form'
				try:
					Add_Cust = New_Customer_QR_Details.objects.get(unique_key=request.session.get('UniqueKey'))
				except:
					pass
				else:
					try:
						url 		= "https://hr.xircls.com/customers/api/v2/QR-Offer/"
						if request.POST.get('form_json'):
							payload     = 'customer_mobile='+str(Add_Cust.mobile)+'&customer_email='+str(Add_Cust.email)+'&pincode='+str(Add_Cust.outlet.pincode)+'&customer_first_name='+str(Add_Cust.first_name)+'&customer_last_name='+Add_Cust.last_name+'&city='+str(Add_Cust.outlet.city)+'&entry_point='+entry_point+'&form_key='+str(inner_xircls)+'&form_json='+str(request.POST.get('form_json'))
						else:
							payload     = 'customer_mobile='+str(Add_Cust.mobile)+'&customer_email='+str(Add_Cust.email)+'&pincode='+str(Add_Cust.outlet.pincode)+'&customer_first_name='+str(Add_Cust.first_name)+'&customer_last_name='+Add_Cust.last_name+'&city='+str(Add_Cust.outlet.city)+'&entry_point='+entry_point+'&form_key='+str(inner_xircls)

						headers     = {
							'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
							'Authorization': str(Add_Cust.outlet.api_key),
							
							}
						send_offer 	= json.loads(requests.post(url, data=payload, headers=headers).text)
						print(send_offer,"-------------------------------")
						response =send_offer
						if response.get('data'):
							request.session['offer_kit'] = response.get('data')
						url = reverse('customers:customer_show_offers',kwargs={'id':response['data']})
						return HttpResponseRedirect(url)   
					except:
						messages.add_message(request, messages.ERROR,'Something went wrong', fail_silently=True)
					# api/v1/show_offers/
					# OfferIssueKits.objects.filter(outlet=Add_Cust.outlet,user = )
					# messages.add_message(request, messages.ERROR,response, fail_silently=True)
			else:
				messages.add_message(request, messages.ERROR,'Verification Failed', fail_silently=True)
	if request.method =='GET' and request.session.get('offer_kit'):	
		url = reverse('customers:customer_show_offers',kwargs={'id':request.session.get('offer_kit')})
		return HttpResponseRedirect(url)   
		

	return render(request,template_name,locals())

def show_offers(request,id=0,template_name = "merchant_site/forms/show_offers.html"):
	offersDetailsList = ''
	if request.method == "GET":
		try:
			outlet_logo = OfferIssueKits.objects.get(id= id)
		except:
			outlet_logo =None
		else:
			offersDetailsList = MyOffers.objects.filter(kit= id)
	return render(request,template_name,locals())

# def send_QR_xircl(request):
# 	return JsonResponse({'response':''})




@csrf_protect
@csrf_exempt
@has_cloud_api_permission
def send_QR_xircl(request):
	if request.method == 'POST':
		postdata = request.POST.copy()
		logger.warning(str(postdata))
		# print(postdata)
		logger.warning('sssssssscccccccccccccccccccccccccccccccccccccccc')
		outletidcheck 		= get_outlet_info(request)
		outletID 			= outletidcheck[2]
		print(outletID,'outletID')
		crosstrobj 			= get_object_or_404(cross_marketing_strategy,outlet_id = outletID)
		outlet_details_info = get_object_or_404(outlet_details,id =outletID)
		cust_first_name 	= postdata.get('customer_first_name',None)
		cust_last_name 		= postdata.get('customer_last_name',None)
		cust_mob 			= postdata.get('customer_mobile',None)
		cust_email 			= postdata.get('customer_email',None)
		cust_pincode 		= postdata.get('pincode',None)
		cust_city 			= postdata.get('city',None)
		cust_country 		= postdata.get('country',None)
		cust_state			= postdata.get('state',None)
		cust_entry_point 	= 'QR_Forms'
		form_key				=  postdata.get('form_key',None)
		# from forms.models import XirclsForms,Form_data
		if form_key:
			# try:
			# 	form_based_Xircl	= get_object_or_404(XirclsForms,unique_key = form_key)
			# except Exception as e:
			# 	logger.warning(str(e)+'error will fetching form based xircle')
			# 	message 		= "Inner Xircle not found for this form"
			# 	response 		= response_json(request, 'error', '404', '', message, '')
			# 	return JsonResponse(response)
			try :
				innerXircle_obj 				= subXirclsInfo.objects.get(id = request.POST.get('form_key'),is_trash=0)
				innerXircle_offers 				=innerXircle_obj.selected_offer_list
			except Exception as e:
				message 		= str(e)+"Inner Xircle not found"
				response 		= response_json(request, 'error', '404', '', message, '')
				return JsonResponse(response)
			if innerXircle_obj.own_offer:
				innerXircle_offers_list 		= (innerXircle_offers).split(',')
				innerXircle_offers_list.insert(0,innerXircle_obj.own_offer)
			else:
				innerXircle_offers_list 		= (innerXircle_offers).split(',')
			print(innerXircle_offers_list,'21502')
			inner_xircle_offer_obj 			= OutletOfferInfo.objects.filter(id__in = innerXircle_offers_list)
			#### For HOST DEDUCTION ########################################
			child_transac 					= childtransactions.objects.filter(outlet_id=outletID).last()

			try:
				host_plan_details 			= get_object_or_404(plan_subcriptions,outlet=outletID,status = 'AC')
				print(host_plan_details)
			except Exception as e:
				print(e,'host_plan_details')
				host_plan_details 			= None

			else:
				host_price_deduction_obj	= PriceDeductions.objects.filter(is_active=1,membership_plan = host_plan_details.membership_plan.id)
				print(host_plan_details.membership_plan.id,'host_plan_details.membership_plan.id')
				host_deduction_amount 		= host_price_deduction_obj.get(method_name = 'Customer Reach').per_cost
				print(host_deduction_amount)
			############################## HOST DEDUCTION FLOW ##############
			if cust_mob or cust_email:
				


				if cust_mob != "" and cust_mob != None:
					cust_info =  CustomerProfile.objects.filter(phone_no = cust_mob)
				else:
					cust_info =  None

				if cust_email != "" and cust_email != None:
					cust_email_info = User.objects.filter(email = cust_email)
				else:
					cust_email_info = None


			print('///////////////////////////////////////////////////////////////////////////////////////////////////////221')
			if cust_info or cust_email_info:
				
				if cust_info:
					cust_userid = cust_info[0].user_id_id
				elif cust_email_info:
					cust_userid = cust_email_info[0].id
				

			else:
				
				profile = CustomerProfile()
				# profile.user_id = customer_user
				profile.phone_no = cust_mob
				mac = get_mac()

				profile.desktop_mac_id = mac
				profile.entry_point =cust_entry_point


				profile.ip_address = request.META.get('REMOTE_ADDR')
				# profile.save()

			if cust_email:
			
				if child_transac.balance_amount >= host_deduction_amount:
					try:
						if cust_userid:	
							auth_User 				= User.objects.get(id = cust_userid)
						else:
							auth_User 				= User.objects.get(username = cust_email)
					except Exception as e:
						print(e,'Auth Except')
						auth_User 				= User()
						auth_User.username 		= cust_email
						auth_User.email 		= cust_email
						auth_User.first_name	= cust_first_name
						auth_User.last_name		= cust_last_name
						auth_User.save()
						try:
							profile.user_id = auth_User
							profile.save()
						except:pass

						print(auth_User,'auth_data else')
					try:
						cust 					= customer_details.objects.get(user = auth_User.id,outlet = outletID)
					except:
						cust 					= customer_details()
						cust.customer_name 		= cust_first_name + ' ' + cust_last_name
						cust.email				= cust_email
						cust.phone_no			= cust_mob
						cust.entry_point		= cust_entry_point
						cust.outlet				= outlet_details_info
						cust.user				= get_object_or_404(User, id = auth_User.id)
						cust.created_by_id 		= outlet_details_info.created_by_id
						cust.city				= cust_city
						cust.country			= cust_country
						cust.pincode			= cust_pincode
						cust.state				= cust_state
						cust.save()
					# cust_form = Form_data()
					# cust_form.form_json =request.POST.get('form_json') if request.POST.get('form_json') else None
					# cust_form.customer = cust
					# cust_form.form = form_based_Xircl
					# cust_form.save()
					print(cust.id,'customer_details')
					offer_kit					= OfferIssueKits()
					offer_kit.issue_method		= 'ACT'
					offer_kit.customer_user		= auth_User
					offer_kit.merchant_user		= get_object_or_404(User, id = outlet_details_info.created_by_id)
					offer_kit.issuance_city		= cust_city
					offer_kit.issuance_country	= cust_country
					offer_kit.issuance_pincode	= cust_pincode
					offer_kit.customer_name		= cust_mob
					offer_kit.outlet			= outlet_details_info
					offer_kit.save()
					print(offer_kit.id,'offer_kit has been generated')
					send_offer_list				= set()
					for offer in inner_xircle_offer_obj:
						print(offer,'21608')
						my_offer				= MyOffers()
						my_offer.kit			= offer_kit
						my_offer.offer			= offer
						my_offer.user			= auth_User
						my_offer.my_offer_type	= 'HT' if offer.outlet.id == outletID else 'IO'
						if offer.offer_expires_in_days_after_issue:
							expiry_days_set 	= offer.offer_expires_in_days_after_issue
							expire_Date 		= ts.now() + timedelta(days=expiry_days_set)
						elif offer.offer_expiry_date:
							expire_Date 		= offer.offer_expiry_date
							# offer has expired 
							if expire_Date < datetime.now():
								expire_Date 	= None
						else:
							expire_Date 		= ts.now() + timedelta(days=30)
						my_offer.expired_at 				= expire_Date				# my_offer.critical_template	= 'IO'
						deduction_status_response 				= DeductionFunction(offer.outlet.id,offer_kit.id,outletID,my_offer.my_offer_type)
						if deduction_status_response != 'low_balance':
							send_offer_list.add(offer.id)
							my_offer.save()
							print(my_offer.id,'offer_data')

						else:
							message 			= 'No offer found'
							response 			= response_json(request, 'error', '404', '', message, '')
					print(send_offer_list)
					try:
						sender_id 		= outlet_details_info.outlet_sender_id
					except:
						sender_id 		= None
					try:
						edited 			= get_object_or_404(offer_design_customization, is_active = 1 ,slug = innerXircle_obj.slug)
					except Exception as e:
						print(e,'edited')
						edited 			= None
					if edited:
						import ast
						desexis=edited.offer_design_type
						aa=edited.email_body1_design
						bb=edited.email_body2_design
						cc=edited.email_headline_design

						try:
							bod1des = ast.literal_eval(aa)
							bod1sizeexis=bod1des['font_size']
							bod1famexis=bod1des['font_family']
							bod1styexis=bod1des['font_style']
							bod1bgcolor=bod1des['bg_color']
							# bod1image=''
							bod1_font_color = bod1des['font_color']
						except:
							bod1des=''

						try:
							bod2des = ast.literal_eval(bb)
							bod2sizeexis=bod2des['font_size']
							bod2famexis=bod2des['font_family']
							bod2styexis=bod2des['font_style']
							bod2_font_color = bod2des['font_color']
						except:
							bod2des=''
						try:
							headldes = ast.literal_eval(cc)
							headlsizeexis=headldes['font_size']
							headlfamexis=headldes['font_family']
							headlstyexis=headldes['font_style']
						except:
							headldes=''

						own_offer=edited.own_offer
						dd = edited.email_body1.split(' ')
						print(dd)
						em_body1 = dd[0] + ' ' + str(cust_first_name)
						em_body2=edited.email_body2
						em_head=edited.email_head
						em_headl = edited.email_headline
						subline=edited.sub_line



					cust_offers_arr 	= OutletOfferInfo.objects.filter(id__in =send_offer_list)
					print(cust_offers_arr,'cust_id')
					email_title 		= 'A special gift from our friends'
					message 			= render_to_string('merchant_site/customers/QR_Process/action_base_offer_template.html', locals())
					user_email			= (email_title, message, cust_email, offer_kit.id, outletID, auth_User.id,sender_id)
					r 					= send_offer_email_user(user_email, outlet_details_info)
					message 			= "Offer kit issued Successfully"
					response 			= response_json(request, 'success', '200', offer_kit.id, message, '')

				else:
					message 			= "Balance Amount is too low"
					response 			= response_json(request, 'error', '404', '', message, '')
			else:
				message 			= "Please provide a valid email addresss"
				response 			= response_json(request, 'error', '404', '', message, '')
	return JsonResponse(response)


def type_of_customer(request,template_name="merchant_site/customers/typeof_customer.html"):
	try:
		auto_customer = outlet_details.objects.get(outlet = request.session.get('outlet_id'))
	except:
		auto_customer =None
	else:
		if auto_customer.accountType == 'B2C' or auto_customer.accountType == 'B2B':
			return redirect('/merchant/customers/add_customer/')
			
		else:
			pass
		
	return render(request,template_name,locals())