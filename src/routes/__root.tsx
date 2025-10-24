import * as React from 'react'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { NotFound } from '@/components/not-found'
import Layout from './_layout'

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: () => <NotFound />,

})

function RootComponent() {
  return (
    <React.Fragment>
      <Layout>
        <Outlet />
      </Layout>
    </React.Fragment>
  )
}
