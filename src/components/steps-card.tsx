interface StepsCardProps {
  index: number;
  title?: string;
  steps?: string[];
}

function StepsCard({
  index,
  title = 'Go to "Download your information"',
  steps = [
    "Go to Setting & Privacy in your Facebook profile",
    'Search "Download your information"',
    'Select "Download you information"',
  ],
}: StepsCardProps) {
  return (
    <div>
      <div
        key={index}
        className="bg-white p-5 sm:p-6 rounded-lg shadow-md text-left border-1 border-gray-50 sm:h-fit md:h-110 h-90"
      >
        <div className="bg-gray-100 text-gray-600 font-semibold rounded-full w-8 h-8 flex items-center justify-center mx-auto sm:mx-0 mb-2 sm:mb-4">
          0{index + 1}
        </div>
        <h3 className="text-lg sm:text-2xl font-semibold mb-4 sm:mb-3 p-2 sm:p-5">
          {title}
        </h3>
        <ul className="text-gray-700 text-sm">
          {steps.map((step, i) => (
            <li
              key={i}
              className="leading-relaxed"
              dangerouslySetInnerHTML={{ __html: `• ${step}` }}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default StepsCard;
