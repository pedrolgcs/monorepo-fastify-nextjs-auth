import { VerifyAuthenticationCode } from '@/modules/authentication'

export default function SignInPage() {
  return (
    <div className="w-full max-w-sm space-y-4">
      <VerifyAuthenticationCode />
    </div>
  )
}
