import SurveyCreator from "../components/SurveyCreator";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Create Your Survey
      </h1>
      <SurveyCreator />
    </div>
  );
}
