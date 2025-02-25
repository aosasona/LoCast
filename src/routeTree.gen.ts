/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'

// Create Virtual Routes

const SettingsLazyImport = createFileRoute('/settings')()
const PreviewLazyImport = createFileRoute('/preview')()
const IndexLazyImport = createFileRoute('/')()

// Create/Update Routes

const SettingsLazyRoute = SettingsLazyImport.update({
  id: '/settings',
  path: '/settings',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/settings.lazy').then((d) => d.Route))

const PreviewLazyRoute = PreviewLazyImport.update({
  id: '/preview',
  path: '/preview',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/preview.lazy').then((d) => d.Route))

const IndexLazyRoute = IndexLazyImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/index.lazy').then((d) => d.Route))

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/preview': {
      id: '/preview'
      path: '/preview'
      fullPath: '/preview'
      preLoaderRoute: typeof PreviewLazyImport
      parentRoute: typeof rootRoute
    }
    '/settings': {
      id: '/settings'
      path: '/settings'
      fullPath: '/settings'
      preLoaderRoute: typeof SettingsLazyImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexLazyRoute
  '/preview': typeof PreviewLazyRoute
  '/settings': typeof SettingsLazyRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexLazyRoute
  '/preview': typeof PreviewLazyRoute
  '/settings': typeof SettingsLazyRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexLazyRoute
  '/preview': typeof PreviewLazyRoute
  '/settings': typeof SettingsLazyRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/preview' | '/settings'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/preview' | '/settings'
  id: '__root__' | '/' | '/preview' | '/settings'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexLazyRoute: typeof IndexLazyRoute
  PreviewLazyRoute: typeof PreviewLazyRoute
  SettingsLazyRoute: typeof SettingsLazyRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexLazyRoute: IndexLazyRoute,
  PreviewLazyRoute: PreviewLazyRoute,
  SettingsLazyRoute: SettingsLazyRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/preview",
        "/settings"
      ]
    },
    "/": {
      "filePath": "index.lazy.tsx"
    },
    "/preview": {
      "filePath": "preview.lazy.tsx"
    },
    "/settings": {
      "filePath": "settings.lazy.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
