import { createFileRoute } from '@tanstack/react-router'
import { DataTable } from "@/components/ui/data-table";
import { Skeleton } from '@/components/ui/skeleton';
import { columns } from '@/modules/sip/branchs/components/table-columns';
import { CardList, useBranchs } from '@/modules/sip/branchs';
import z from 'zod'

const branchSearchSchema = z.object({
  page: z.number().optional(),
  perPage: z.number().catch(50).optional(),
  filter: z.string().optional(),
})

export const Route = createFileRoute('/_app/sip/branchs')({
  component: RamaisSip,
  validateSearch: branchSearchSchema,
  loader: () => ({
    crumb: ['SIP', 'Ramais SIP'],
  }),
})

function RamaisSip() {
  const isLoading = false;
  const { list: branchs } = useBranchs()
  return (
    <div className="flex-1 space-y-8 min-w-0 overflow-hidden">
      {isLoading ? (
        <Skeleton />
      ) : (
        <>
          <CardList cardData={branchs} />
          <DataTable columns={columns} data={branchs?.length ? branchs : []} />
        </>
      )}
    </div>
  )
}

export default RamaisSip;
