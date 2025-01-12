import Link from "next/link";

const NavigateToQuestions = () => (
  <Link href="/questions">
    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
      View Created Questions
    </button>
  </Link>
);

export default NavigateToQuestions;
