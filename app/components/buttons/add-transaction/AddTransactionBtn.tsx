import React from "react";

const AddTransactionBtn: React.FC = ({}) => {
  return (
    <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors cursor-pointer">
      Add Transaction
    </button>
  );
}

export default AddTransactionBtn;