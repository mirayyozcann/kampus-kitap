type Book = {
  id: number;
  title: string;
  course: string;
  department: string;
  price: number;
  condition: string;
};

const books: Book[] = [
  {
    id: 1,
    title: "Introduction to Algorithms",
    course: "BIL 201",
    department: "Bilgisayar Mühendisliği",
    price: 250,
    condition: "Az kullanılmış",
  },
  {
    id: 2,
    title: "Calculus: Early Transcendentals",
    course: "MAT 101",
    department: "Matematik",
    price: 180,
    condition: "Yeni",
  },
  {
    id: 3,
    title: "Database System Concepts",
    course: "BIL 301",
    department: "Bilgisayar Mühendisliği",
    price: 200,
    condition: "Yıpranmış",
  },
  {
    id: 4,
    title: "Fizik I",
    course: "FIZ 101",
    department: "Fizik",
    price: 120,
    condition: "Az kullanılmış",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <h1 className="text-xl font-bold text-indigo-600">KampüsKitap</h1>
          <div className="flex gap-3 text-sm">
            <button className="rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100">
              Giriş Yap
            </button>
            <button className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
              Kayıt Ol
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-4 py-12 text-center">
        <h2 className="text-3xl font-bold text-gray-900">
          Ders kitabını bul, kampüste al-sat
        </h2>
        <p className="mt-3 text-gray-600">
          Ders koduna göre ara, uygun fiyatlı kitabı bul.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-16">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Son ilanlar
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {books.map((book) => (
            <div
              key={book.id}
              className="rounded-xl border bg-white p-4 shadow-sm"
            >
              <span className="rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700">
                {book.course}
              </span>
              <h4 className="mt-3 font-semibold text-gray-900">{book.title}</h4>
              <p className="mt-1 text-sm text-gray-500">{book.department}</p>
              <p className="mt-1 text-sm text-gray-500">{book.condition}</p>
              <p className="mt-3 text-lg font-bold text-gray-900">
                {book.price} TL
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}