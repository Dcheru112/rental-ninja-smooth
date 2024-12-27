interface Payment {
  id: string;
  amount: number;
  status: string;
  payment_date: string;
}

interface PaymentListProps {
  payments: Payment[];
}

const PaymentList = ({ payments }: PaymentListProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Recent Payments</h2>
      <div className="space-y-4">
        {payments.slice(0, 5).map((payment) => (
          <div key={payment.id} className="border-b pb-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">${payment.amount}</p>
                <p className="text-sm text-gray-500">
                  {new Date(payment.payment_date).toLocaleDateString()}
                </p>
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                payment.status === 'pending' 
                  ? 'bg-yellow-100 text-yellow-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {payment.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentList;