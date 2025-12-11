import { RenderMode, ServerRoute } from '@angular/ssr';


export const serverRoutes: ServerRoute[] = [
  {
    path: 'new_users', // This renders the "/" route on the client (CSR) // this is the dashboard
    renderMode: RenderMode.Client,
  },
  // {
  //   path: '',
  //   renderMode: RenderMode.Server,

  // },
  {
    path: 'about', // This page is static, so we prerender it (SSG)
    renderMode: RenderMode.Server,
  },
  {
    path: 'profile', // This page requires user-specific data, so we use SSR
    renderMode: RenderMode.Server,
    headers: {
      'X-My-Custom-Header': 'some-value',
    },
    status: 201
  },
  {
    path: '**', // All other routes will be rendered on the server (SSR) // including the login and the register page
    renderMode: RenderMode.Server,
  },
];
