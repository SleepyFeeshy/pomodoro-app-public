export default function StatisticsEntry({label, value}){
  return (
    <div className="grid grid-cols-[3fr_2fr] gap-10 font-semibold">
      <h1 className="font-semibold text-sm text-gray-700">{label}</h1>
      <p className="text-sm text-gray-900 text-left place-self-stretch mt-auto">{value}</p>
    </div>
  )
}