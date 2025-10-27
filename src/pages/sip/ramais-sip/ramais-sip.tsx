import { DataTable } from "@/components/ui/data-table";
import CardList from "./card-list";
import { columns, type Payment } from "./table-columns";

function getData(): Payment[] {
  return [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
  ]
}

function RamaisSip() {
  const data = getData();

  return (
    <section className="space-y-8">
      <CardList />
      <DataTable columns={columns} data={data} />
    </section>
  )
}

export default RamaisSip;
