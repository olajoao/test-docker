import { useWindowSize } from "usehooks-ts";
import { useDepartmentModel } from "./departments.model";
import { DepartmentTable } from "./table/table";
import DepartmentCard from "./mobile/card/department-card";
import DepartmentModal from "./modal/department-modal/department-modal";

function Departments() {
  const { state, data } = useDepartmentModel();
  const { width } = useWindowSize();
  const isDesktop = width >= 768;

  if (isDesktop) {
    return (
      <div className="p-5">
        <header className="flex items-center justify-between">
          <h1 className="font-medium text-muted-foreground">Departamentos</h1>
        </header>
        <DepartmentTable
          departments={data.departmentData?.data ?? []}
          metaData={data.departmentData?.meta}
          isPending={state.isLoadingDepartments}
        />
      </div>
    );
  }

  return (
    <section>
      <div className="flex-col flex p-5 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg md:text-3xl font-bold tracking-tight">
            Departamentos
          </h2>
          <DepartmentModal />
        </div>
        <div className="space-y-5">
          {data.departmentData?.data?.map((department) => (
            <DepartmentCard key={department.id} department={department} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Departments;
