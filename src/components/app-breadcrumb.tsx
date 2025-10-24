import { useMatches, Link } from "@tanstack/react-router";
import { Fragment } from "react/jsx-runtime";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "./ui/breadcrumb";

export function AppBreadcrumb() {
  const matches = useMatches()

  const breadcrumbs: { label: string; href?: string }[] = []

  matches.forEach(match => {
    const crumbs = match.loaderData?.crumb
    if (!Array.isArray(crumbs)) return

    const pathSegments = match.pathname.split("/").filter(Boolean)

    crumbs.forEach((label, idx) => {
      if (idx === 0 && crumbs.length > 1) {
        // primeiro item: sem link
        breadcrumbs.push({ label })
      } else {
        // acumula os segmentos do pathname correspondente
        const href = "/" + pathSegments.slice(0, idx + 1).join("/")
        breadcrumbs.push({ label, href })
      }
    })
  })

  // remove duplicados
  const uniqueCrumbs = breadcrumbs.filter(
    (crumb, idx, arr) => !arr.slice(0, idx).some(c => c.label === crumb.label)
  )

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {uniqueCrumbs.map((crumb, idx) => (
          <Fragment key={idx}>
            <BreadcrumbItem className="hidden md:block">
              {crumb.href ? (
                <BreadcrumbLink asChild>
                  <Link to={crumb.href}>{crumb.label}</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>

            {idx < uniqueCrumbs.length - 1 && (
              <BreadcrumbSeparator className="hidden md:block" />
            )}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>

  )
}
