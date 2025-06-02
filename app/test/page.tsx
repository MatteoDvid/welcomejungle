export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-600">
          Test Tailwind CSS
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">Card 1</h2>
            <p className="text-gray-600">Test avec bg-white et shadow-md</p>
          </div>
          
          <div className="bg-blue-500 text-white p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Card 2</h2>
            <p>Test avec bg-blue-500</p>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Card 3</h2>
            <p>Test avec gradient</p>
          </div>
        </div>
        
        <div className="mt-8 p-4 bg-yellow-100 border-l-4 border-yellow-500">
          <p className="text-yellow-700">
            Si vous voyez cette page avec des styles (couleurs, espacements, ombres), 
            alors Tailwind CSS fonctionne correctement !
          </p>
        </div>
      </div>
    </div>
  );
} 