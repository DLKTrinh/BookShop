import Layout from "@/shared/components/Layout";
import AddBookForm from "../../books/components/AddBookForm";

export default function AddNewBook() {
  const handleAddBook = (book: any) => {
    console.log("New Book:", book);
    alert(`"${book.title}" added successfully!`);
  };

  const Form: any = AddBookForm;

  return (
    <Layout username="edward">
      <div className="max-w-2xl mx-auto bg-gray-900 border border-gray-700 rounded-2xl p-8 shadow-lg">
        <h1 className="text-2xl font-semibold text-gray-100 mb-6">📖 Add a New Book</h1>
        <Form handleSubmit={handleAddBook} />
      </div>
    </Layout>
  );
}
