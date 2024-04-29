import EmailDashboard from "@src/views/Email/EmailDashboard"
import EmailSelectGroup from "@src/views/Email/send/EmailSelectGroup"
import EmailTemplatesDashboard from "@src/views/Email/EmailTemplatesDashboard"
import EmailTemplateReport from "@src/views/Email/reports/EmailTemplateReport"
import SentEmailReports from "@src/views/Email/reports/SentEmailReports"
import EmailGroupDetails from "@src/views/Email/tables/EmailGroupDetails"
import EmailGroupTable from "@src/views/Email/tables/EmailGroupTable"
import EmailTable from "@src/views/Email/tables/EmailTable"
import EmailSettings from "@src/views/Email/tables/EmailSettings"
import CreateEmail from "@src/views/Email/Create/CreateEmail"
import EmailCampaigns from "@src/views/Email/EmailCampaigns"
import EmailScheduleDetails from "@src/views/Email/send/EmailScheduleDetails"
import Test from "@src/views/Email/Create/test/Test"
import AddEmailForm from "@src/views/Email/tables/AddEmailForm"

export const EmailRoutes = [
  {
    path: '/merchant/Email/templates',
    element: <EmailTemplatesDashboard />
  },
  {
    path: '/merchant/Email/import',
    element: <EmailTable />
  },
  {
    path: '/merchant/Email/group',
    element: <EmailGroupTable />
  },
  {
    path: '/merchant/Email/addEmail',
    element: <AddEmailForm />
  },
  {
    path: '/merchant/Email/Campaign',
    element: <EmailCampaigns />
  },
  {
    path: '/merchant/Email/settings',
    element: <EmailSettings />
  },
  {
    path: '/merchant/Email/:name/:id',
    element: <EmailGroupDetails />
  },
  {
    path: '/merchant/Email/selectGroup/:id',
    element: <EmailSelectGroup />
  },
  {
    path: '/merchant/Email',
    element: <EmailDashboard />
  },
  {
    path: '/merchant/Email/reports/emailReport',
    element: <SentEmailReports />
  },
  {
    path: 'merchant/Email/reports/template/:templateId',
    element: <EmailTemplateReport/>
  },
  {
    path: 'merchant/Email/builder',
    element: <CreateEmail/>
  },
  {
    path: 'merchant/Email/builder/:id',
    element: <CreateEmail/>
  },
  {
    path: '/merchant/Email/EmailSchedule',
    element: <EmailScheduleDetails/>
  },
  {
    path: '/merchant/Email/Test',
    element: <Test/>
  }
]