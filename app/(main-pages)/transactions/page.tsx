const Transactions = () => {
  return (
    <div className='border-1 rounded-2xl w-full self-start mt-4'>
      <table className="w-full table-fixed sm:table-auto">
        <thead
          className="hidden sm:table-header-group bg-card/50 border-b border-border text-sm font-semibold text-muted-foreground"
        >
          <tr>
            <th className="py-4 px-6 text-left">Transaction</th>
            <th className="py-4 px-6 text-left">Category</th>
            <th className="py-4 px-6 text-left">Date</th>
            <th className="py-4 px-6 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-4 px-6 text-left">Transaction</td>
            <td className="py-4 px-6 text-left">Transaction</td>
            <td className="py-4 px-6 text-left">Transaction</td>
            <td className="py-4 px-6 text-right">Transaction</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default Transactions;