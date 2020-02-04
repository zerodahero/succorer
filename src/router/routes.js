
const routes = [
  {
    path: '/',
    component: () => import('layouts/Succorer.vue'),
    children: [
      { path: '', name: 'index', component: () => import('pages/Index.vue') },
      { path: '/settings', name: 'settings', component: () => import('pages/Settings.vue') }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
