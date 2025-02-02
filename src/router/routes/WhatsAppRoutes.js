import TemplateDashboard from "../../views/Whatsapp/Templates/TemplateDashboard/TemplateDashboard"
import OtpinManage from "../../views/Whatsapp/Templates/OtpinManage"
import ProjectTable from "../../views/Whatsapp/Tables/ProjectTable"
import EmbededSignup from "../../views/Whatsapp/Forms/EmbededSignup"
// import CreateTemplate from "../../views/Whatsapp/Templates/CreateTemplate"
import EditTemplate from "../../views/Whatsapp/Templates/EditTemplate"
import GroupTable from "../../views/Whatsapp/Tables/GroupTable"
import Dashboard from "../../views/Whatsapp/Dashboard"
import ContactsTable from "../../views/Whatsapp/Tables/ContactsTable"
import BusinessCreation from "../../views/Whatsapp/Forms/BusinessCreation"
import GroupDetails from "../../views/Whatsapp/Tables/GroupDetails"
import CatalogueView from "../../views/Whatsapp/catalog/CatalogueView"
import TemplateReports from "../../views/Whatsapp/reports/TemplateReports"
import SentReports from "../../views/Whatsapp/reports/SentReports"
import GroupSend from "../../views/Whatsapp/Tables/GroupSend"
import Catalogue from "../../views/Whatsapp/catalog/Catalogue"
import StartCampaign from "../../views/Whatsapp/Templates/TemplateDashboard/pages/StartCampaign"
import LiveChat from "../../views/Whatsapp/liveChat/LiveChat"
import Campaigns from "../../views/Whatsapp/Campaign/Campaigns"
import { CampaignType } from "../../views/Whatsapp/Campaign/CampaignType"
import CreateCampaign from "../../views/Whatsapp/Campaign/CreateCampaign"
import CampaignReports from "../../views/Whatsapp/Campaign/CampaignReports"
import ProjectProfile from "../../views/Whatsapp/settings/ProjectProfile"
import QuickReplySetting from "../../views/Whatsapp/settings/QuickReplySetting"
import Document from "../../views/Whatsapp/Integration/Document"
// import ProjectTable from "../../views/Whatsapp/Templates/ProjectTable"

export const WhatsAppRoutes = [
    {
        path: '/merchant/whatsapp/',
        element: <Dashboard />
    },
    {
        path: '/merchant/whatsapp/templates/',
        element: <TemplateDashboard />
    },
    {
        path: '/merchant/whatsapp/campaign/:id',
        element: <StartCampaign />
    },
    {
        path: '/merchant/whatsapp/optinManage/',
        element: <OtpinManage />
    },
    {
        path: '/merchant/whatsapp/is_business/',
        element: <ProjectTable />
    },
    {
        path: '/merchant/whatsapp/EmbeddedSignup/',
        element: <EmbededSignup />
    },
    {
        element: <Document />,
        path: '/merchant/whatsapp/document/'
    },
    // {
    //     path: '/merchant/whatsapp/is_template/',
    //     element: <CreateTemplate />
    // },
    {
        path: '/merchant/whatsapp/template/:templateID/',
        element: <EditTemplate />
    },
    {
        path: '/merchant/whatsapp/groups/',
        element: <GroupTable />
    },
    {
        path: '/merchant/whatsapp/:name/:id',
        element: <GroupDetails />
    },
    {
        path: '/merchant/whatsapp/sent-to-group/:id',
        element: <GroupSend />
    },
    {
        path: '/merchant/whatsapp/whatsapp_contact/',
        element: <ContactsTable />
    },
    {
        path: '/merchant/whatsapp/business_creation/',
        element: <BusinessCreation />
    },
    {
        path: '/merchant/whatsapp/project_creation/',
        element: <ProjectTable />
    },
    {
        path: '/merchant/whatsapp/Catalogue/',
        element: <Catalogue />
    },
    {
        path: '/merchant/whatsapp/CatalogueView/:id',
        element: <CatalogueView />
    },
    {
        path: '/merchant/whatsapp/reports/template',
        element: <TemplateReports />
    },
    {
        path: '/merchant/whatsapp/reports/template/:templateId/:campaign_id',
        element: <SentReports />
    },
    {
        path: '/merchant/whatsapp/reports/template/:templateId/',
        element: <SentReports />
    },
    {
        path: '/merchant/whatsapp/LiveChat/',
        element: <LiveChat />,
        meta: {
            layout: "fullWidthLayout"
          }
    },
    {
        path: '/merchant/whatsapp/campaigns',
        element: <Campaigns />
    },
    {
        path: '/merchant/whatsapp/create-campaign/type/',
        element: <CampaignType />
    },
    {
        path: '/merchant/whatsapp/create-campaign/:campaign_type/:temp_id/',
        element: <CreateCampaign />
    },
    {
        path: '/merchant/whatsapp/create-campaign/:campaign_type/:temp_id/:campaign_id',
        element: <CreateCampaign />
    },
    {
        path: '/merchant/whatsapp/sent_reports/:campaign_id/',
        element: <CampaignReports />
    },
    {
        path: '/merchant/whatsapp/project-profile',
        element: <ProjectProfile />
    },
    {
        path: '/merchant/whatsapp/quick-reply/',
        element: <QuickReplySetting />
    }
]