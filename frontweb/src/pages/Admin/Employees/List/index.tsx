import './styles.css';

import Pagination from 'components/Pagination';
import EmployeeCard from 'components/EmployeeCard';
import { Link } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { SpringPage } from 'types/vendor/spring';
import { AxiosRequestConfig } from 'axios';
import { requestBackend } from 'util/requests';
import { Employee } from 'types/employee';
import { hasAnyRoles } from 'util/auth';

type ControlComponentData = {
  activePage: number;
}

const List = () => {

  const [page, setPage] = useState<SpringPage<Employee>>();

  const [controlComponentData, setControlComponentData] = useState<ControlComponentData>({
    activePage: 0 
  });

  const handlePageChange = (pageNumber: number) => {
    setControlComponentData({ activePage: pageNumber })
  }


  const getEmployees = useCallback(() => {
    const config: AxiosRequestConfig = {
      method: 'GET',
      withCredentials: true,
      url: '/employees',
      params: {
        page: controlComponentData.activePage,
        size: 4,
      },
    };

    requestBackend(config).then((response) => {
      setPage(response.data);
    });
  }, [controlComponentData]);

  useEffect(() => {
    getEmployees();
  }, [getEmployees]);
  return (
    <>
      {hasAnyRoles(['ROLE_ADMIN']) &&
        <Link to="/admin/employees/create">
          <button className="btn btn-primary text-white btn-crud-add">
            ADICIONAR
          </button>
        </Link>}

      <div className="row">
        {page?.content.map((employee) => (
          <div key={employee.id} className="col-sm-6 col-md-12">
            <EmployeeCard employee={employee} />
          </div>
        ))}
      </div>

      <Pagination
        forcePage={page?.number}
        pageCount={(page) ? page?.totalPages : 0}
        range={3}
        onChange={handlePageChange}
      />
    </>
  );
};

export default List;