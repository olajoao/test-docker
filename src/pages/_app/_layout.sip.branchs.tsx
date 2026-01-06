import { createFileRoute } from '@tanstack/react-router'
import { DataTable } from "@/components/ui/data-table";
import { columns } from '@/modules/sip/branchs/components/table-columns';
import { branchSearchSchema, Cards, useBranchs } from '@/modules/sip/branchs';
import { TableSkeleton } from '@/components/ui/table-skeleton';
import { TableSearchForm } from '@/modules/sip/branchs/components/table-search-form';
import { Button } from '@/components/ui/button';
import { BookOpen, Download, SendIcon } from 'lucide-react';
import { BranchDialog } from '@/modules/sip/branchs/components/branch-dialog';
import { TableColumnsFilter } from '@/modules/sip/branchs/components/table-columns-filter';

export const Route = createFileRoute('/_app/_layout/sip/branchs')({
  component: SipBranchs,
  validateSearch: branchSearchSchema,
  loader: () => ({ crumb: ['SIP', 'Ramais SIP'] }),
})

function SipBranchs() {
  const { list: branchs, isLoading, table } = useBranchs()

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
      <Cards cardData={branchs} />

      <div className='flex items-center gap-5'>
        <TableSearchForm />

        <Button size="sm" variant="outline" className='cursor-pointer text-xs 2xl:text-sm'>
          <Download />
          Download CSV
        </Button>

        <Button size="sm" variant="outline" className='cursor-pointer text-xs 2xl:text-sm'>
          <BookOpen />
          Lista Telefônica
        </Button>

        <Button size="sm" variant="outline" className='cursor-pointer text-xs 2xl:text-sm'>
          <SendIcon />
          Ações em Lote
        </Button>

        <BranchDialog />

        <TableColumnsFilter table={table} />
      </div>

      {isLoading ?
        <TableSkeleton rows={5} columns={10} />
        : <DataTable columns={columns} table={table} onChangePage={handleChangePage} />
      }
    </div>
  )
}

export default SipBranchs;

