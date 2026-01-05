import { createFileRoute } from '@tanstack/react-router'

import { DataTable } from "@/components/ui/data-table";
import { columns } from '@/modules/pabx/callback/components/table-columns';
import { callbackSearchSchema, useCallback } from '@/modules/pabx/callback';
import { TableSearchForm } from '@/modules/pabx/callback/components/table-search-form';
import { TableSkeleton } from '@/components/ui/table-skeleton';
import { TableColumnsFilter } from '@/modules/pabx/callback/components/table-columns-filter';
import { CallbackDialog } from '@/modules/pabx/callback/components/callback-dialog';



export const Route = createFileRoute('/_app/_layout/pabx/callback')({
  component: PabxCallback, 
    validateSearch:callbackSearchSchema,
  loader: () => ({ crumb: ['PABX', 'Callbacks'] }),
})

function PabxCallback() {
  const { isLoading, table } = useCallback()

  const navigate = Route.useNavigate()
  const search = Route.useSearch()

  const handleChangePage = (nextPage: number) => {
    navigate({
      search: {
        ...search,
        page: nextPage,
      },
    })
  }
  
  return (
    <div className="flex-1 space-y-5 min-w-0 overflow-hidden">

      <div className='flex items-center gap-5'>
        <TableSearchForm />
        <CallbackDialog />
        <TableColumnsFilter table={table} />
      </div>

      {isLoading ?
        <TableSkeleton rows={5} columns={10} />
        : <DataTable columns={columns} table={table} onChangePage={handleChangePage} />
      }
    </div>
  )
}

export default PabxCallback;