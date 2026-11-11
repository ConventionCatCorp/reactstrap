import { Breadcrumb, BreadcrumbItem } from '@conventioncatcorp/reactstrap';

function Example() {
  return (
    <>
      <Breadcrumb>
        <BreadcrumbItem active>Home</BreadcrumbItem>
      </Breadcrumb>
      <Breadcrumb>
        <BreadcrumbItem>
          {/* oxlint-disable-next-line jsx-a11y/anchor-is-valid -- demo link */}
          <a href="#">Home</a>
        </BreadcrumbItem>
        <BreadcrumbItem active>Library</BreadcrumbItem>
      </Breadcrumb>
      <Breadcrumb>
        <BreadcrumbItem>
          {/* oxlint-disable-next-line jsx-a11y/anchor-is-valid -- demo link */}
          <a href="#">Home</a>
        </BreadcrumbItem>
        <BreadcrumbItem>
          {/* oxlint-disable-next-line jsx-a11y/anchor-is-valid -- demo link */}
          <a href="#">Library</a>
        </BreadcrumbItem>
        <BreadcrumbItem active>Data</BreadcrumbItem>
      </Breadcrumb>
    </>
  );
}

export default Example;
