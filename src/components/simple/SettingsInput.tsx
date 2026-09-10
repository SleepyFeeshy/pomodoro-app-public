type SettingsInputProps = {
    name: string,
    value: string,
    onChange: any
}

export default function SettingsInput({name, value, onChange}: SettingsInputProps) {
  return (
    <div className="flex place-self-end my-auto">
      <input className="bg-input w-12 h-7 my-auto rounded-md text-right place-self-end " name={name} inputMode="numeric" type="string" value={value} onChange={onChange}/>
      <p className="ml-2 my-auto text-left place-self-end text-neutral-500"></p>
    </div>
  )
}