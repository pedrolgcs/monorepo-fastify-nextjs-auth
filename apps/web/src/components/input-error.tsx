type InputErrorProps = {
  error: string
}

export function InputError({ error }: InputErrorProps) {
  return (
    <p className="text-xs font-medium text-red-500 dark:text-red-400">
      {error}
    </p>
  )
}
