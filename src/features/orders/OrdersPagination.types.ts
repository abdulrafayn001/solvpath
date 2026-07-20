export type OrdersPaginationProps = {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
}
