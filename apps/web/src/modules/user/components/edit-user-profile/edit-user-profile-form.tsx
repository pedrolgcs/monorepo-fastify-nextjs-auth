'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircleIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useGetUserProfile } from '@/http/hooks/use-get-user-profile'
import { useUpdateUserProfileMutation } from '@/http/hooks/use-update-user-profile-mutation'

const formSchema = z.object({
  name: z.string().optional(),
  profession: z.string().optional(),
})

type FormSchema = z.infer<typeof formSchema>

export function EditUserProfileForm() {
  const { data: userProfile } = useGetUserProfile()

  const { mutate: updateUserProfile, isPending: isPendingOnUpdateUserProfile } =
    useUpdateUserProfileMutation()

  const { register, handleSubmit } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    values: {
      name: userProfile?.name,
      profession: userProfile?.profession,
    },
  })

  const handleUpdateUserProfile = (data: FormSchema) => {
    const { name, profession } = data

    if (!userProfile) return

    updateUserProfile(
      {
        id: userProfile.id,
        name,
        profession,
      },
      {
        onSuccess: () => {
          toast.success('Profile updated successfully')
        },
        onError: (error) => {
          toast.error(error.message)
        },
      },
    )
  }

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit(handleUpdateUserProfile)}
    >
      <div className="space-y-2">
        <Label>Name</Label>
        <Input type="text" placeholder="John Doe" {...register('name')} />
      </div>

      <div className="space-y-2">
        <Label>Profession</Label>
        <Input
          type="text"
          placeholder="Software Engineer"
          {...register('profession')}
        />
      </div>

      {isPendingOnUpdateUserProfile ? (
        <Button type="submit" className="w-full">
          <LoaderCircleIcon className="animate-spin" />
        </Button>
      ) : (
        <Button type="submit" className="w-full">
          Update profile
        </Button>
      )}
    </form>
  )
}
