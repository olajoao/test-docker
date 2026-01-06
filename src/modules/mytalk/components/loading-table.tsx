import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function LoadingTable({ rows, columns }: { rows: number, columns: number }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader className="text-xs">
          <TableRow>
            {Array.from({ length: columns}).map((_, index) => (
              <TableHead key={index}>
                <div className="w-20 h-5 bg-muted dark:bg-muted-foreground/30 animate-pulse rounded"></div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, index) => (
            <TableRow
              key={index}
            >
              {Array.from({ length: columns }).map((_, tableCellIndex) => (
                <TableCell key={tableCellIndex}>
                  <div className="w-28 h-5 rounded bg-muted dark:bg-muted-foreground/30 animate-pulse"></div>
                </TableCell>
              ))}
            </TableRow>
          ))}
          {!rows ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                Nenhum departamento encontrado
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
    </div> 
  )
}
