from django.urls import path
from . import views

app_name = 'customers'

urlpatterns = [
    path('merchant/customers/jmd-import-customers-servicing/', views.jmd_upload_customers_info_servicing, name='jmd_upload_customers_info_servicing'),
    path('merchant/customers/jmd-import-customers-insurance/', views.jmd_upload_customers_info_insurance, name='jmd_upload_customers_info_insurance'),
    path('merchant/customers/import-customers/', views.upload_customers_info, name='upload_customers_info'),
    path('merchant/customers/', views.get_my_customers, name='get_my_customers'),
    path('merchant/my_customers/', views.get_my_customers_b2b, name='get_my_customers_b2b'),
    path('merchant/customers/add-customer/', views.add_new_customers, name='add_new_customers'),
    path('merchant/customers/add_customer/', views.add_new_customers_b2b, name='add_new_customers_b2b'),
    path('merchant/customers/jmd-add-customer/', views.jmd_add_new_customers, name='jmd_add_new_customers'),
    path('merchant/customers/edit-customer/<str:custCode>/', views.edit_customers, name='edit_customers'),
    path('merchant/customers/edit_customer/<str:custCode>/', views.edit_customers_b2b, name='edit_customers_b2b'),
    path('merchant/customers/groups/', views.get_my_groups, name='get_my_groups'),
    path('merchant/customers/create-group/', views.create_customer_groups, name='create_customer_groups'),
    path('merchant/customers/edit-group/<str:groupCode>/', views.edit_customer_groups, name='edit_customer_groups'),
    path('merchant/customers/customer-group/<str:groupCode>/', views.add_customers_in_group, name='add_customers_in_group'),

    path('merchant/customers/jmd-add-vehicle-customers/', views.jmd_add_vehicle_customers_list, name='jmd_add_vehicle_customers_list'),
    path('merchant/customers/jmd-add-servicing-customers/', views.jmd_add_servicing_customers_list, name='jmd_add_servicing_customers_list'),
    path('merchant/customers/jmd-add-insurance-customers/', views.jmd_add_insurance_customers_list, name='jmd_add_insurance_customers_list'),
    path('merchant/customers/add-vehicle/<str:custCode>/', views.get_add_vehicle, name='get_add_vehicle'),
    path('merchant/customers/add-vehicle/', views.get_add_vehicle, name='get_add_vehicle_new'),
    path('merchant/customers/edit-vehicle/<str:vehicleId>/', views.get_edit_vehicle, name='get_edit_vehicle'),
    path('merchant/customers/add-servicing/<str:custCode>/', views.get_add_servicing, name='get_add_servicing'),
    path('merchant/customers/add-servicing/', views.get_add_servicing, name='get_add_servicing_new'),
    path('merchant/customers/edit-servicing/<str:servicingId>/', views.get_edit_servicing, name='get_edit_servicing'),
    path('merchant/customers/add-insurance/<str:custCode>/', views.get_add_insurance, name='get_add_insurance'),
    path('merchant/customers/add-insurance/', views.get_add_insurance, name='get_add_insurance_new'),
    path('merchant/customers/edit-insurance/<str:insuranceId>/', views.get_edit_insurance, name='get_edit_insurance'),
    path('merchant/customers/customers_insurance_expiry_details/<str:display_days>/', views.jmd_customer_details_insurance, name='jmd_customer_insurance_expiry'),
    path('merchant/customers/customers_servicing_expiry_details/<str:display_days>/', views.jmd_customer_details_servicing, name='jmd_customer_servicing_expiry'),
    path('merchant/customers/view-customer/<str:custCode>/', views.get_view_customer, name='get_view_customer'),
    path('merchant/customers/assign/', views.assignUser, name='assignUser'),
    path('merchant/customers/send-reminder/<str:custCode>/', views.customer_send_reminder, name='get_send_reminder'),
    path('merchant/customers/send-notifications-template/<str:custCode>/', views.customer_send_notifications, name='get_send_notifications'),
    path('merchant/customers/send-offer/<str:custCode>/', views.customer_send_offer, name='get_send_offer'),
    path('merchant/customers/customer_export/<str:display_department_date>/<str:search_txt>/<str:selected_days>/<str:from_date>/<str:to_date>/', views.export_to_csv, name='export_to_csv'),
    
    path('merchant/customers/add-user/', views.add_new_user, name='add_user_outlet'),
    path('merchant/customers/Manage-user/', views.manage_user_outlet, name='manage_user_outlet'),
    path('merchant/customers/Edit-Manage-User/<str:slug>/', views.edit_manage_user_outlet, name='edit_manage_user_outlet'),

    # ### Department ###
    path('merchant/customers/add-dept/', views.add_new_dept, name='add_dept'),
    path('merchant/customers/manage-dept/', views.manage_dept, name='manage_dept'),
    path('merchant/customers/edit-dept/<str:slug>/', views.edit_dept, name='edit_dept'),
    path('merchant/customers/toggleForHiring/', views.toggleForHiring, name='toggleForHiring'),
    path('merchant/customers/view_dept/<str:id>/', views.view_dept, name='view_dept'),

    # 20-11-2019 for finance in jmd
    path('merchant/customers/jmd-finance-customers/<str:custCode>/', views.jmd_finance, name='jmd_finance'),
    path('merchant/customers/jmd-finance-customers/', views.jmd_finance, name='jmd_finance_new'),
    path('merchant/customer/jmd-finance-customers-view/<str:finance_id>/', views.jmd_finance_view, name='jmd_finance_view'),
    path('merchant/customers/jmd-finance-customers-list/', views.jmd_finance_customers_list, name='jmd_finance_customers_list'),
    path('merchant/customers/edit-finance-details/<str:financeId>/', views.edit_finance_details, name='edit_finance_details'),

    ### 29-01-2020 Add Calls ###
    path('merchant/customers/Add-Call/<str:custCode>/', views.Customer_Add_Calls, name='add_calls'),
    path('merchant/customers/Add-Call-lead/<str:leadCode>/', views.lead_Add_Calls, name='add_calls_lead'),

    path('merchant/customers/scheduled_Call_list/', views.scheduled_Call_list, name='scheduled_Call_list'),
    path('merchant/customers/allcustomerdetails/', views.allcustomerdetails, name='allcustomerdetails'),
    # path('merchant/customers/customerverify/', views.customerverify, name='customerverify'),
    # path('activate_privlege_customers/<key>/',views.test,name='test'),
    path('activate_privlege_customers/<str:key>/', views.privi_customer_verification_link, name='privi_customer_verification_link'),
    path('cust_transaction_verification/<str:outcode>/', views.cust_transaction_verification, name='cust_transaction_verification'),
    path('cust_transaction_verified/<str:outcode>/', views.cust_transaction_verification_completed, name='cust_transaction_verification_completed'),

    path('merchant/customers/exportcustomerdetails/', views.exportcustomerdetails, name='exportcustomerdetails'),
    path('merchant/customers/cust_add_to_privilege/', views.cust_add_to_privilege, name='cust_add_to_privilege'),
    path('merchant/customers/create-groups/', views.cust_add_to_group, name='cust_add_to_group'),
    path('merchant/customers/priv-groups/', views.customer_groups, name='customer_groups'),

    #all_cust_list(jmd)
    path('merchant/customers/<str:slug>/', views.all_cust_detail_list, name='all_cust_detail_list'),
    path('merchant/customer/all_cust_dashboard/<str:slug>/', views.all_cust_dashboard, name='all_cust_dashboard'),

    path('merchant/customer/add-lead/', views.add_new_lead, name='add_new_lead'),
    path('merchant/customer/add_lead/', views.add_new_lead_b2b, name='add_new_lead_b2b'),
    path('merchant/customer/all_lead/<str:slug>/', views.all_lead, name='all_lead'),
    path('merchant/customer/edit-lead/<str:slug>/', views.edit_lead, name='edit_lead'),
    path('merchant/customer/edit_lead/<str:slug>/', views.edit_lead_b2b, name='edit_lead_b2b'),
    path('merchant/customer/view-lead/<str:slug>/', views.get_view_lead, name='get_view_lead'),
    path('merchant/customer/leads_dashboard/', views.leads_dashboard, name='leads_dashboard'),
    path('merchant/customer/leads-dashboard-b2b/', views.leads_dashboard_b2b, name='leads_dashboard_b2b'),
    path('merchant/customer/leads_settings/', views.leads_settings, name='leads_settings'),
    path('merchant/customer/lead_email/', views.lead_email, name='lead_email'),
    path('merchant/customer/stage_delete/<str:stageId>/', views.stage_delete, name='stage_delete'),
    path('merchant/customer/leads_save/', views.leads_save, name='leads_save'),

    path('merchant/customer/add_company_details/', views.add_company_details, name='add_company_details'),
    path('merchant/customer/add_company_details_via_other/', views.add_company_details_via_other, name='add_company_details_via_other'),
    path('merchant/customer/all_company_details/', views.all_company_details, name='all_company_details'),
    path('merchant/customer/edit_company_details/<str:page>/<str:client_acc_id>/', views.edit_company_details, name='edit_company_details'),

    path('merchant/customer/finance_setting/', views.finance_setting_details, name='finance_setting_details'),
    path('merchant/customer/all_finance/', views.all_finance, name='all_finance'),
    path('merchant/customer/calendar/', views.calendar, name='calendar'),
    path('merchant/customer/customers_settings/', views.customer_settings, name='customer_settings'),
    path('merchant/customer/all_customers/', views.get_all_customers, name='get_all_customers'),

    # Commission
    path('merchant/customer/add_commission/', views.add_commission_status, name='add_commission'),
    path('merchant/customer/commission_dashboard/', views.view_commission_dashboard, name='commission_dashboard'),
    path('merchant/customer/commission_settings/', views.view_commission_settings, name='commission_settings'),
    path('merchant/customer/edit_commission/<str:key>/', views.edit_commission_status, name='edit_commission'),
    path('merchant/customer/invoice_print/<str:slug>/', views.invoice_pdf_print, name='invoice_pdf_print'),
    path('merchant/customer/invoice_download/<str:slug>/', views.invoice_pdf_download, name='invoice_pdf_download'),
    path('merchant/customer/view_commission_invoice/<str:slug>/', views.view_commission_invoice, name='view_commission_invoice'),
    path('merchant/customer/view-user/<str:slug>/', views.get_view_user, name='get_view_user'),

    # 04-02-2022
    path('merchant/customer/getsubs/', views.getSubs, name='getSubs'),

    # 07-02-2022
    path('merchant/customer/getproducts/', views.getProducts, name='getProducts'),

    # 15-02-2022
    path('merchant/customer/checkifassigned/', views.checkIfAssigned, name='checkIfAssigned'),
    path('merchant/customer/check_lead_exists/', views.check_lead_exists, name='check_lead_exists'),
    path('merchant/customer/user-settings/', views.user_settings, name='user_settings'),
    path('merchant/create_content', views.create_content, name='create_content'),
    path('merchant/show_content', views.show_content, name='show_content'),
    path('merchant/content/<str:contentId>/', views.view_content, name='view_content'),
    path('merchant/publish', views.publish, name='publish'),
    path('merchant/post_content/<str:postId>/', views.post_content, name='post_content'),
    path('merchant/posted_users/<str:postId>/', views.posted_users, name='posted_users'),
    path('merchant/review_content/<str:contentId>/', views.review_content, name='review_content'),
    path('merchant/edit_content/<str:contentId>/', views.edit_content, name='edit_content'),

    # Calendar
    path('merchant/customer/calendar/', views.calendar, name='calendar'),
    path('merchant/customer/calendar-settings/', views.calendarSettings, name='calendarSettings'),
    path('merchant/customer/updatePermUsers/', views.updatePermUsers, name='updatePermUsers'),
    path('merchant/customer/getUserEvents/', views.getUserEvents, name='getUserEvents'),
    path('api/v1/app/customer/getUserEvents/', views.getUserEventsapp, name='getUserEvents'),
    path('merchant/customer/addEvent/', views.addEvent, name='addEvent'),
    path('merchant/customer/getEventData/', views.getEventData, name='getEventData'),
    path('merchant/customer/grpEvent/<str:evId>/', views.grpEvent, name='grpEvent'),
    path('permission_list/', views.permission_list, name='permission_list'),

    # Support Ticket
    path('merchant/customer/add_support_ticket/', views.add_support_ticket, name='add_support_ticket'),
    path('merchant/customer/edit_support_ticket/<str:ticketCode>/', views.edit_support_ticket, name='edit_support_ticket'),
    path('merchant/customer/all_suport_tickets/', views.all_suport_tickets, name='all_suport_tickets'),
    path('merchant/customer/suport_tickets_history/<str:CustCode>/', views.suport_tickets_history, name='suport_tickets_history'),
    path('merchant/customer/view_suport_ticket/<str:ticketCode>/', views.view_suport_ticket, name='view_suport_ticket'),
    path('merchant/customer/deleteEvent/', views.deleteEvent, name='deleteEvent'),
    path('merchant/customers/JMD_get_finance_customers_list/', views.JMD_get_finance_customers_list, name='JMD_get_finance_customers_list'),
    path('jsonresponse/customer_details/', views.customer_details, name='customer_details'),
    path('api/v1/customer_details/', views.customer_details_API, name='customer_details_API'),
    path('api/v1/user_based_candidate_details/', views.user_based_candidate_details, name='user_based_candidate_details'),
    path('api/v1/app/can_profile/', views.can_profile, name='can_profile'),
    path('Verify-For-Offer/<str:outlet>/<str:key>/', views.QR__Form, name='Verify-For-Offer'),
    path('accept/', views.accept, name='accept'),
    path('decline/', views.decline, name='decline'),
    path('send_otp/', views.send_otp, name='send_otp'),
    path('verify_otp/', views.verify_otp, name='verify_otp'),
    path('customers/api/v2/Form-Based-Offer/', views.FormBasedOffer, name='FormBasedOffer'),
    path('Verify-For-Offer/<str:outlet>/<str:key>/<str:form_key>', views.QR__Form, name='Verify-For-Offer'),
    path('save_for_later/', views.save_for_later, name='save_for_later'),
    path('qr_not_found/<str:outlet>/', views.qr_failed, name='qr_failed'),
    path('customers/api/lead_details_api/', views.lead_details_api, name='lead_details_api'),
    path("employees/add_job_description/", views.create_job_description, name="add_job_description"),
    path("employees/view_job_description/", views.view_job_description, name="view_job_description"),
    path("employees/job_description_details/<str:id>/", views.job_description_details, name="job_description_details"),
    path("customers/filter_categories/", views.filter_categories, name="filter_categories"),
    path("QR_code/<str:state>/", views.new_QR_code_generator, name="new_QR_code_generator"),
    path('customer/Verify-For-Offer/<str:outlet>/<str:inner_xircls>/', views.QR_Form_new, name='QR_Form_new'),
    path('customers/api/v2/QR-Offer/', views.send_QR_xircl, name='send_QR_xircl'),
    path('api/v1/show_offers/<str:id>/', views.show_offers, name='customer_show_offers'),
    path('merchant/customer/add_type_of_customer/', views.type_of_customer, name='type_of_customer'),

    # Rest of your URL patterns...
]

# urlpatterns = [
#                path('merchant/customers/jmd-import-customers-servicing/', views.jmd_upload_customers_info_servicing, name='jmd_upload_customers_info_servicing'),
#                path('merchant/customers/jmd-import-customers-insurance/', views.jmd_upload_customers_info_insurance, name='jmd_upload_customers_info_insurance'),
#                path('merchant/customers/import-customers/', views.upload_customers_info, name='upload_customers_info'),
#                path('merchant/customers/', views.get_my_customers, name='get_my_customers'),
#                path('merchant/my_customers/', views.get_my_customers_b2b, name='get_my_customers_b2b'),
#                path('merchant/customers/add-customer/', views.add_new_customers, name='add_new_customers'),
#                path('merchant/customers/add_customer/', views.add_new_customers_b2b, name='add_new_customers_b2b'),
#                path('merchant/customers/jmd-add-customer/', views.jmd_add_new_customers, name='jmd_add_new_customers'),
#                path('merchant/customers/edit-customer/(?P<custCode>[-\w]+)/', views.edit_customers, name='edit_customers'),
#                path('merchant/customers/edit_customer/(?P<custCode>[-\w]+)/', views.edit_customers_b2b, name='edit_customers_b2b'),
#                path('merchant/customers/groups/', views.get_my_groups, name='get_my_groups'),
#                path('merchant/customers/create-group/', views.create_customer_groups, name='create_customer_groups'),
#                path('merchant/customers/edit-group/(?P<groupCode>[-\w]+)/', views.edit_customer_groups, name='edit_customer_groups'),
#                path('merchant/customers/customer-group/(?P<groupCode>[-\w]+)/', views.add_customers_in_group, name='add_customers_in_group'),

#                path('merchant/customers/jmd-add-vehicle-customers/', views.jmd_add_vehicle_customers_list, name='jmd_add_vehicle_customers_list'),
#                path('merchant/customers/jmd-add-servicing-customers/', views.jmd_add_servicing_customers_list, name='jmd_add_servicing_customers_list'),
#                path('merchant/customers/jmd-add-insurance-customers/', views.jmd_add_insurance_customers_list, name='jmd_add_insurance_customers_list'),
#                path('merchant/customers/add-vehicle/(?P<custCode>[-\w]+)/', views.get_add_vehicle, name='get_add_vehicle'),
#                path('merchant/customers/add-vehicle/', views.get_add_vehicle, name='get_add_vehicle_new'),
#                path('merchant/customers/edit-vehicle/(?P<vehicleId>[-\w]+)/', views.get_edit_vehicle, name='get_edit_vehicle'),
#                path('merchant/customers/add-servicing/(?P<custCode>[-\w]+)/', views.get_add_servicing, name='get_add_servicing'),
#                path('merchant/customers/add-servicing/', views.get_add_servicing, name='get_add_servicing_new'),
#                path('merchant/customers/edit-servicing/(?P<servicingId>[-\w]+)/', views.get_edit_servicing, name='get_edit_servicing'),
#                path('merchant/customers/add-insurance/(?P<custCode>[-\w]+)/', views.get_add_insurance, name='get_add_insurance'),
#                path('merchant/customers/add-insurance/', views.get_add_insurance, name='get_add_insurance_new'),
#                path('merchant/customers/edit-insurance/(?P<insuranceId>[-\w]+)/', views.get_edit_insurance, name='get_edit_insurance'),
#                path('merchant/customers/customers_insurance_expiry_details/(?P<display_days>[-\w]+)/', views.jmd_customer_details_insurance, name='jmd_customer_insurance_expiry'),
#                path('merchant/customers/customers_servicing_expiry_details/(?P<display_days>[-\w]+)/', views.jmd_customer_details_servicing, name='jmd_customer_servicing_expiry'),
#                path('merchant/customers/view-customer/(?P<custCode>[-\w]+)/', views.get_view_customer, name='get_view_customer'),
#                path('merchant/customers/assign/', views.assignUser, name='assignUser'),
#                path('merchant/customers/send-reminder/(?P<custCode>[-\w]+)/', views.customer_send_reminder, name='get_send_reminder'),
#                path('merchant/customers/send-notifications-template/(?P<custCode>[-\w]+)/', views.customer_send_notifications, name='get_send_notifications'),
#                path('merchant/customers/send-offer/(?P<custCode>[-\w]+)/', views.customer_send_offer, name='get_send_offer'),               
#                path('merchant/customers/customer_export/(?P<display_department_date>.*)/(?P<search_txt>.*)/(?P<selected_days>.*)/(?P<from_date>.*)/(?P<to_date>.*)/', views.export_to_csv, name='export_to_csv'),

#                #13-11-2019
#                path('merchant/customers/add-user/', views.add_new_user, name='add_user_outlet'),
#                path('merchant/customers/Manage-user/', views.manage_user_outlet, name='manage_user_outlet'),
#                path('merchant/customers/Edit-Manage-User/(?P<slug>[-\w]+)/', views.edit_manage_user_outlet, name='edit_manage_user_outlet'),


#                # ###  Department  ###
#                path('merchant/customers/add-dept/', views.add_new_dept, name='add_dept'),
#                path('merchant/customers/manage-dept/', views.manage_dept, name='manage_dept'),
#                path('merchant/customers/edit-dept/(?P<slug>[-\w]+)/', views.edit_dept, name='edit_dept'),
#                path('merchant/customers/toggleForHiring/', views.toggleForHiring, name='toggleForHiring'),
#                path('merchant/customers/view_dept/(?P<id>[-\w]+)/', views.view_dept, name='view_dept'),

#                #20-11-2019 for finance in jmd
#                path('merchant/customers/jmd-finance-customers/(?P<custCode>[-\w]+)/', views.jmd_finance, name='jmd_finance'),
#                path('merchant/customers/jmd-finance-customers/', views.jmd_finance, name='jmd_finance_new'),
#                path('merchant/customer/jmd-finance-customers-view/(?P<finance_id>[-\w]+)/', views.jmd_finance_view, name='jmd_finance_view'),
#                path('merchant/customers/jmd-finance-customers-list/', views.jmd_finance_customers_list, name='jmd_finance_customers_list'),
#                path('merchant/customers/edit-finance-details/(?P<financeId>[-\w]+)/', views.edit_finance_details, name='edit_finance_details'),

#                ### 29-01-2020 Add Calls ###
#                path('merchant/customers/Add-Call/(?P<custCode>[-\w]+)/', views.Customer_Add_Calls, name = 'add_calls'),
#                path('merchant/customers/Add-Call-lead/(?P<leadCode>[-\w]+)/', views.lead_Add_Calls, name = 'add_calls_lead'),

               
#                path('merchant/customers/scheduled_Call_list/', views.scheduled_Call_list, name='scheduled_Call_list'),
#                path('merchant/customers/allcustomerdetails/', views.allcustomerdetails, name='allcustomerdetails'),
#                # path('merchant/customers/customerverify/', views.customerverify, name='customerverify'),
#                # path('activate_privlege_customers/(?P<key>.+)/',views.test,name='test'),
#                path('activate_privlege_customers/(?P<key>.+)/', views.privi_customer_verification_link, name='privi_customer_verification_link'),
#                path('cust_transaction_verification/(?P<outcode>[-\w]+)/', views.cust_transaction_verification, name='cust_transaction_verification'),
#                path('cust_transaction_verified/(?P<outcode>[-\w]+)/', views.cust_transaction_verification_completed, name='cust_transaction_verification_completed'),
               
#                path('merchant/customers/exportcustomerdetails/', views.exportcustomerdetails, name='exportcustomerdetails'),
#                path('merchant/customers/cust_add_to_privilege/', views.cust_add_to_privilege, name='cust_add_to_privilege'),
#                path('merchant/customers/create-groups/', views.cust_add_to_group, name='cust_add_to_group'),               
#                path('merchant/customers/priv-groups/', views.customer_groups, name='customer_groups'),               
               
#                #all_cust_list(jmd)
#                path('merchant/customers/(?P<slug>.*)/',views.all_cust_detail_list,name='all_cust_detail_list'),
#                path('merchant/customer/all_cust_dashboard/(?P<slug>.*)/',views.all_cust_dashboard,name='all_cust_dashboard'),

#                path('merchant/customer/add-lead/',views.add_new_lead, name='add_new_lead'),
#                path('merchant/customer/add_lead/',views.add_new_lead_b2b, name='add_new_lead_b2b'),
#                path('merchant/customer/all_lead/(?P<slug>.*)/',views.all_lead, name='all_lead'),
#                path('merchant/customer/edit-lead/(?P<slug>.*)/',views.edit_lead, name='edit_lead'),
#                path('merchant/customer/edit_lead/(?P<slug>.*)/',views.edit_lead_b2b, name='edit_lead_b2b'),
#                path('merchant/customer/view-lead/(?P<slug>[-\w]+)/', views.get_view_lead, name='get_view_lead'),
#                path('merchant/customer/leads_dashboard/',views.leads_dashboard, name='leads_dashboard'),
#                path('merchant/customer/leads-dashboard-b2b/',views.leads_dashboard_b2b, name='leads_dashboard_b2b'),
#                path('merchant/customer/leads_settings/',views.leads_settings, name='leads_settings'),
#                path('merchant/customer/lead_email/',views.lead_email, name='lead_email'),
#                path('merchant/customer/stage_delete/(?P<stageId>[-\w]+)/',views.stage_delete, name='stage_delete'),
#                path('merchant/customer/leads_save/',views.leads_save, name='leads_save'),

#                path('merchant/customer/add_company_details/', views.add_company_details, name='add_company_details'),  
#                path('merchant/customer/add_company_details_via_other/', views.add_company_details_via_other, name='add_company_details_via_other'), 
#                path('merchant/customer/all_company_details/', views.all_company_details, name='all_company_details'),  
#                path('merchant/customer/edit_company_details/(?P<page>.*)/(?P<client_acc_id>[-\w]+)/', views.edit_company_details, name='edit_company_details'),   

#                path('merchant/customer/finance_setting/', views.finance_setting_details, name='finance_setting_details'),
#                path('merchant/customer/all_finance/', views.all_finance, name='all_finance'),

#                path('merchant/customer/calendar/', views.calendar, name='calendar'), 
#                 path('merchant/customer/customers_settings/', views.customer_settings, name='customer_settings'),
#                 path('merchant/customer/all_customers/', views.get_all_customers, name='get_all_customers'),

#                 #########################commission####################
#                 path('merchant/customer/add_commission/', views.add_commission_status, name='add_commission'),
#                 path('merchant/customer/commission_dashboard/', views.view_commission_dashboard, name='commission_dashboard'),
#                 path('merchant/customer/commission_settings/', views.view_commission_settings, name='commission_settings'),
#                 path('merchant/customer/edit_commission/(?P<key>.+)/', views.edit_commission_status, name='edit_commission'),
#                 path('merchant/customer/invoice_print/(?P<slug>[-\w]+)/', views.invoice_pdf_print, name='invoice_pdf_print'),
#                 path('merchant/customer/invoice_download/(?P<slug>[-\w]+)/', views.invoice_pdf_download, name='invoice_pdf_download'),
#                 path('merchant/customer/view_commission_invoice/(?P<slug>[-\w]+)/', views.view_commission_invoice, name='view_commission_invoice'),
#                 path('merchant/customer/view-user/(?P<slug>[-\w]+)/', views.get_view_user, name='get_view_user'),
#                 ############################# 04-02-2022 ################################
#                 path('merchant/customer/getsubs/', views.getSubs, name='getSubs'),                
#                 ############################# 07-02-2022 ################################
#                 path('merchant/customer/getproducts/', views.getProducts, name='getProducts'),
#                 ############################# 15-02-2022 ################################
#                 path('merchant/customer/checkifassigned/', views.checkIfAssigned, name='checkIfAssigned'),

#                 path('merchant/customer/check_lead_exists/', views.check_lead_exists, name='check_lead_exists'),
#                 path('merchant/customer/user-settings/', views.user_settings, name='user_settings'),
#                 path('merchant/customer/perms_save/',views.perms_save, name='perms_save'),

#                 ##########strt content##############
#                 path('merchant/create_content', views.create_content, name='create_content'),
#                 path('merchant/show_content', views.show_content, name='show_content'),
#                 path('merchant/content/(?P<contentId>[-\w]+)/', views.view_content, name='view_content'),
#                 path('merchant/publish', views.publish, name='publish'),
#                 path('merchant/post_content/(?P<postId>[-\w]+)/', views.post_content, name='post_content'),
#                 path('merchant/posted_users/(?P<postId>[-\w]+)/', views.posted_users, name='posted_users'),
#                 #path('merchant/add_path/', views.add_path, name='add_path'),
#                 path('merchant/review_content/(?P<contentId>[-\w]+)/', views.review_content, name='review_content'),
#                 path('merchant/edit_content/(?P<contentId>[-\w]+)/', views.edit_content, name='edit_content'),
#                 ###########end content##############

#                 ######################## Calender #####################################
#                path('merchant/customer/calendar/', views.calendar, name='calendar'),
#                path('merchant/customer/calendar-settings/', views.calendarSettings, name='calendarSettings'),
#                path('merchant/customer/updatePermUsers/', views.updatePermUsers, name='updatePermUsers'),
#                path('merchant/customer/getUserEvents/', views.getUserEvents, name='getUserEvents'),
#                path('api/v1/app/customer/getUserEvents/', views.getUserEventsapp, name='getUserEvents'),
#                path('merchant/customer/addEvent/', views.addEvent, name='addEvent'),
#                path('merchant/customer/getEventData/', views.getEventData, name='getEventData'),
#                path('merchant/customer/grpEvent/(?P<evId>.+)/', views.grpEvent, name='grpEvent'),
#                path('permission_list/',views.permission_list, name='permission_list'),

               
#                #####################################################################
#                 ######################## Support Ticket #####################################
#                 path('merchant/customer/add_support_ticket/',views.add_support_ticket,name='add_support_ticket'),
#                 path('merchant/customer/edit_support_ticket/(?P<ticketCode>[-\w]+)/',views.edit_support_ticket,name="edit_support_ticket"),
#                 path('merchant/customer/all_suport_tickets/',views.all_suport_tickets,name="all_suport_tickets"),
#                 path('merchant/customer/suport_tickets_history/(?P<CustCode>[-\w]+)/',views.suport_tickets_history,name="suport_tickets_history"),
#                 path('merchant/customer/view_suport_ticket/(?P<ticketCode>[-\w]+)/',views.view_suport_ticket,name="view_suport_ticket"),
#                 path('merchant/customer/deleteEvent/', views.deleteEvent, name='deleteEvent'),
#                 path('merchant/customers/JMD_get_finance_customers_list/', views.JMD_get_finance_customers_list, name='JMD_get_finance_customers_list'),
#                 path('jsonresponse/customer_details/',views.customer_details, name='customer_details'),
#                 path('api/v1/customer_details/',views.customer_details_API, name='customer_details_API'),
#                 path('api/v1/user_based_candidate_details/',views.user_based_candidate_details, name='user_based_candidate_details'),
#                 path('api/v1/app/can_profile/',views.can_profile, name='can_profile'),


#                 ##################################################################################
#                 path('Verify-For-Offer/(?P<outlet>.*)/(?P<key>.*)/',views.QR__Form, name='Verify-For-Offer'),
#                 path('accept/', views.accept, name='accept'),
#                 path('decline/', views.decline, name='decline'),
#                 path('send_otp/', views.send_otp, name='send_otp'),
#                 path('verify_otp/', views.verify_otp, name='verify_otp'),
#                 path('customers/api/v2/Form-Based-Offer/',views.FormBasedOffer, name='FormBasedOffer'),
#                 path('Verify-For-Offer/(?P<outlet>.*)/(?P<key>.*)/(?P<form_key>.*)',views.QR__Form, name='Verify-For-Offer'),
#                 path('save_for_later/', views.save_for_later, name='save_for_later'),
#                 path('qr_not_found/(?P<outlet>.*)/', views.qr_failed, name='qr_failed'),
#                 path('customers/api/lead_details_api/',views.lead_details_api, name='lead_details_api'),
#                 path("employees/add_job_description/",views.create_job_description,name="add_job_description"),
#                 path("employees/view_job_description/",views.view_job_description,name="view_job_description"),
#                 path("employees/job_description_details/(?P<id>.*)/",views.job_description_details,name="job_description_details"),
#                 path("customers/filter_categories/",views.filter_categories,name="filter_categories"),

#                 path("QR_code/(?P<state>.*)/",views.new_QR_code_generator,name="new_QR_code_generator"),
#                 path('customer/Verify-For-Offer/(?P<outlet>.*)/(?P<inner_xircls>.*)/',views.QR_Form_new, name='QR_Form_new'),
#                 path('customers/api/v2/QR-Offer/',views.send_QR_xircl, name='send_QR_xircl'),
#                 path('api/v1/show_offers/(?P<id>.*)',views.show_offers, name='customer_show_offers'),




#                ]


