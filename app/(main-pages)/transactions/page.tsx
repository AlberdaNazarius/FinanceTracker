import {TRANSACTIONS} from "@/helpers/data";
import {formatDate} from "@/helpers/utils";

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
        {TRANSACTIONS.map((transaction) => (
          <tr key={transaction.id} className="border-b border-border last:border-0 hover:bg-accent/50">
            <td className="py-4 px-6 text-left">{transaction?.description ?? 'N/A'}</td>
            <td className="py-4 px-6 text-left">{transaction?.category ?? 'N/A'}</td>
            <td className="py-4 px-6 text-left">{formatDate(transaction?.date)}</td>
            <td className="py-4 px-6 text-right">{transaction?.amount ?? 'N/A'}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  )
}

export default Transactions;