import { PencilIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { EditUserProfileForm } from './edit-user-profile-form'

export function EditUserProfile() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <PencilIcon className="size-3" /> Editar Perfil
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>Edit user profile information</DialogDescription>
        </DialogHeader>

        <EditUserProfileForm />
      </DialogContent>
    </Dialog>
  )
}
