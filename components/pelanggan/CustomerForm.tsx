'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useCustomerStore } from '@/lib/store/customerStore'
import type { Customer } from '@/lib/types'
import { toast } from 'sonner'

const schema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email().optional().or(z.literal('')),
  note: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface CustomerFormProps {
  open: boolean
  onClose: () => void
  customer?: Customer
}

export default function CustomerForm({ open, onClose, customer }: CustomerFormProps) {
  const { addCustomer, updateCustomer, deleteCustomer } = useCustomerStore()

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: customer ? { name: customer.name, phone: customer.phone, email: customer.email ?? '', note: customer.note ?? '' } : {},
  })

  const onSubmit = (data: FormData) => {
    if (customer) {
      updateCustomer(customer.id, data)
      toast.success('Pelanggan diperbarui')
    } else {
      addCustomer({ ...data, email: data.email || undefined, poin: 0, totalBelanja: 0, totalTransaksi: 0 })
      toast.success('Pelanggan ditambahkan')
      reset()
    }
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={customer ? 'Edit Pelanggan' : 'Tambah Pelanggan'}>
      <form onSubmit={handleSubmit(onSubmit)} className="px-4 pb-6 flex flex-col gap-4">
        <Input label="Nama" error={errors.name?.message} {...register('name')} placeholder="Nama pelanggan" />
        <Input label="No. HP" error={errors.phone?.message} {...register('phone')} placeholder="08xxx" type="tel" />
        <Input label="Email (opsional)" error={errors.email?.message} {...register('email')} placeholder="email@..." type="email" />
        <Input label="Catatan" {...register('note')} placeholder="Catatan pelanggan" />
        <Button type="submit" className="w-full">Simpan</Button>
        {customer && (
          <Button type="button" variant="danger" className="w-full" onClick={() => { deleteCustomer(customer.id); toast.success('Pelanggan dihapus'); onClose() }}>
            Hapus Pelanggan
          </Button>
        )}
      </form>
    </Modal>
  )
}
