import TemplateUI from "../../views/Whatsapp/Templates/TemplateUI/TemplateUI"
import OtpinManage from "../../views/Whatsapp/Templates/OtpinManage"
import ProjectTable from "../../views/Whatsapp/Tables/ProjectTable"
import EmbededSignup from "../../views/Whatsapp/Forms/EmbededSignup"
import CreateTemplate from "../../views/Whatsapp/Templates/CreateTemplate"
import EditTemplate from "../../views/Whatsapp/Templates/EditTemplate"
import GroupTable from "../../views/Whatsapp/Tables/GroupTable"
import Dashboard from "../../views/Whatsapp/Dashboard"
import ContactsTable from "../../views/Whatsapp/Tables/ContactsTable"
import BusinessCreation from "../../views/Whatsapp/Forms/BusinessCreation"
import GroupDetails from "../../views/Whatsapp/Tables/GroupDetails"
import CatalogueView from "../../views/Whatsapp/Templates/CatalogueView"
import Catalogue from "../../views/Whatsapp/Templates/Catalogue"
import TemplateReports from "../../views/Whatsapp/reports/TemplateReports"
import SentReports from "../../views/Whatsapp/reports/SentReports"
import GroupSend from "../../views/Whatsapp/Tables/GroupSend"
// import ProjectTable from "../../views/Whatsapp/Templates/ProjectTable"

export const WhatsAppRoutes = [
    {
        path: '/merchant/whatsapp/',
        element: <Dashboard />
    },
    {
        path: '/merchant/whatsapp/message/',
        element: <TemplateUI />
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
        path: '/merchant/whatsapp/is_template/',
        element: <CreateTemplate />
    },
    {
        path: '/merchant/whatsapp/editTemplate/:templateID/',
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
        path: '/merchant/whatsapp/reports/template/:templateId',
        element: <SentReports />
    }
]