import { createFileRoute } from '@tanstack/react-router'
import { DataTable } from "@/components/ui/data-table";
import { columns } from '@/modules/sip/branchs/components/table-columns';
import { branchSearchSchema, Cards, useBranchs } from '@/modules/sip/branchs';
import { TableSkeleton } from '@/components/ui/table-skeleton';
import { TableSearchForm } from '@/modules/sip/branchs/components/table-search-form';
import { Button } from '@/components/ui/button';
import { BookOpen, Download, SendIcon } from 'lucide-react';
import { BranchDialog } from '@/modules/sip/branchs/components/branch-dialog';

export const Route = createFileRoute('/_app/_layout/sip/branchs')({
  component: SipBranchs,
  validateSearch: branchSearchSchema,
  loader: () => ({ crumb: ['SIP', 'Ramais SIP'] }),
})

function SipBranchs() {
  const { list: branchs, isLoading } = useBranchs()

  return (
    <div className="flex-1 space-y-8 min-w-0 overflow-hidden">
      <Cards cardData={branchs} />

      <div className='flex items-center gap-5'>
        <TableSearchForm />

        <Button variant="outline" className='cursor-pointer'>
          <Download />
          Download CSV
        </Button>

        <Button variant="outline" className='cursor-pointer'>
          <BookOpen />
          Lista Telefônica
        </Button>

        <Button variant="outline" className='cursor-pointer'>
          <SendIcon />
          Ações em Lote
        </Button>

        <BranchDialog />
      </div>

      {isLoading ?
        <TableSkeleton rows={5} columns={10} />
        : <DataTable columns={columns} data={branchs?.length ? branchs : []} />
      }
    </div>
  )
}

export default SipBranchs;

