// import { lazy } from 'react'
import ViewForms from '../../views/QR_Form/ViewForms'
import FormReports from '../../views/main/QR/FormReports'


const QR_Process_Routes = [
  {
    path: '/merchant/qr/view/',
    element: <ViewForms />
  },
  {
    path: '/merchant/qr/reports/detail/:id',
    element: <FormReports />
  }
]

export default QR_Process_Routes