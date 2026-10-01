import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
      {
            path: '',
            loadComponent: () => import('./components/log-in/log-in.component').then(m => m.LogInComponent)
      },
      {
            path: 'forgot-password',
            loadComponent: () => import('./components/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
      },
      {
            path: 'home',
            loadComponent: () => import('./components/main/main.component').then(m => m.MainComponent),
            // canActivate: [authGuard],
            children: [
                  {
                        path: 'dashboard',
                        loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
                  },
                  {
                        path: 'user-management',
                        loadComponent: () => import('./components/user-management/user-management.component').then(m => m.UserManagementComponent)
                  },
                  {
                        path: 'private',
                        loadComponent: () => import('./components/user-management/private/private.component').then(m => m.PrivateComponent)
                  },
                  {
                        path: 'company',
                        loadComponent: () => import('./components/user-management/company/company.component').then(m => m.CompanyComponent)
                  },
                  {
                        path: 'user-detail',
                        loadComponent: () => import('./components/user-management/user-detail/user-detail.component').then(m => m.UserDetailComponent)
                  },
                  {
                        path: 'car-listing',
                        loadComponent: () => import('./components/car-listing/car-listing.component').then(m => m.CarListingComponent)
                  },
                  {
                        path: 'car-detail',
                        loadComponent: () => import('./components/car-listing/car-detail/car-detail.component').then(m => m.CarDetailComponent)
                  },
                  {
                        path: 'pricing-management',
                        loadComponent: () => import('./components/pricing-management/pricing-management.component').then(m => m.PricingManagementComponent)
                  },
                  {
                        path: 'slot-requests',
                        loadComponent: () => import('./components/slot-requests/slot-requests.component').then(m => m.SlotRequestsComponent)
                  },
                  {
                        path: 'revenue',
                        loadComponent: () => import('./components/revenue/revenue.component').then(m => m.RevenueComponent)
                  },
                  {
                        path: 'requests',
                        loadComponent: () => import('./components/requests/requests.component').then(m => m.RequestsComponent)
                  },
                  {
                        path: 'request-detail',
                        loadComponent: () => import('./components/requests/request-detail/request-detail.component').then(m => m.RequestDetailComponent)
                  },
                  {
                        path: 'feedbacks',
                        loadComponent: () => import('./components/feedbacks/feedbacks.component').then(m => m.FeedbacksComponent)
                  },
                  {
                        path: 'support',
                        loadComponent: () => import('./components/support/support.component').then(m => m.SupportComponent)
                  },
                  {
                        path: 'support-detail',
                        loadComponent: () => import('./components/support/support-detail/support-detail.component').then(m => m.SupportDetailComponent)
                  },
                  {
                        path: 'report',
                        loadComponent: () => import('./components/report/report.component').then(m => m.ReportComponent)
                  },
                  {
                        path: 'report-detail',
                        loadComponent: () => import('./components/report/report-detail/report-detail.component').then(m => m.ReportDetailComponent)
                  },
                  {
                        path: 'emblem-management',
                        loadComponent: () => import('./components/emblem-management/emblem-management.component').then(m => m.EmblemManagementComponent)
                  },
                  {
                        path: 'seal-management',
                        loadComponent: () => import('./components/seal-management/seal-management.component').then(m => m.SealManagementComponent)
                  },
                  {
                        path: 'edit-profile',
                        loadComponent: () => import('./components/edit-profile/edit-profile.component').then(m => m.EditProfileComponent)
                  },
                  {
                        path: 'change-password',
                        loadComponent: () => import('./components/change-password/change-password.component').then(m => m.ChangePasswordComponent)
                  },
                  {
                        path: 'transactions',
                        loadComponent: () => import('./components/transactions/transactions.component').then(m => m.TransactionsComponent)
                  },
                  {
                        path: 'notification',
                        loadComponent: () => import('./components/notification/notification.component').then(m => m.NotificationComponent)
                  },
            ]
      }
];
